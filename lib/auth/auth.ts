import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { promises as dns } from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
        transaction: false,
    }),
    emailAndPassword: {
        enabled: true,
    }


})


export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers()
    })

    return result
}

export async function signOut() {
    const result = await auth.api.signOut({
        headers: await headers()
    })

    if(result.success) {
        redirect("/sign-in")
    }
}