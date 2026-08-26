import { MongoClient } from "mongodb";
import connectDB from "@/lib/db"; 
import { Board, Column } from "@/lib/models"; 
import JobApplication from "@/lib/models/job-application"; 

// export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db();

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); 

    // 1. Find stale guest users via Better Auth's raw "user" collection
    const guests = await db
      .collection("user")
      .find({
        email: { $regex: /^guest_.*@demo\.local$/ },
        createdAt: { $lt: cutoff },
      })
      .toArray();

    if (guests.length === 0) {
      return Response.json({ deleted: 0, message: "No stale guests found" });
    }

    const guestObjectIds = guests.map((g) => g._id);
    const guestIdStrings = guestObjectIds.map((id) => id.toString());

    // 2. Delete app data via Mongoose — all keyed by userId as a string
    await connectDB();

    const jobAppResult = await JobApplication.deleteMany({
      userId: { $in: guestIdStrings },
    });

    const boards = await Board.find({ userId: { $in: guestIdStrings } });
    const boardIds = boards.map((b) => b._id);

    const columnResult = await Column.deleteMany({
      boardId: { $in: boardIds },
    });

    const boardResult = await Board.deleteMany({
      userId: { $in: guestIdStrings },
    });

    // 3. Delete Better Auth's session/account/user records via native driver
    const sessionResult = await db
      .collection("session")
      .deleteMany({ userId: { $in: guestIdStrings } });

    const accountResult = await db
      .collection("account")
      .deleteMany({ userId: { $in: guestIdStrings } });

    const userResult = await db
      .collection("user")
      .deleteMany({ _id: { $in: guestObjectIds } });

    return Response.json({
      deletedUsers: userResult.deletedCount,
      deletedBoards: boardResult.deletedCount,
      deletedColumns: columnResult.deletedCount,
      deletedJobApplications: jobAppResult.deletedCount,
      deletedSessions: sessionResult.deletedCount,
      deletedAccounts: accountResult.deletedCount,
    });
  } catch (err) {
    console.error("Cleanup cron failed:", err);
    return new Response("Internal error", { status: 500 });
  } finally {
    await client.close();
  }
}