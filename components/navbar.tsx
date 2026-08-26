"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutButton from "./sign-out-btn";
import { useSession } from "@/lib/auth/auth-client";
import { useState } from "react";
import { startDemo } from "@/lib/auth/demo";

const Navbar = () => {
  //   const session = await getSession();
  const { data: session } = useSession();

  const [demoLoading, setDemoLoading] = useState(false);

  async function handleTryDemo() {
    setDemoLoading(true);

    try {
      await startDemo();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to start demo:", error);
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center p-4 justify-between">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <Briefcase />
          Job Tracker
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href={"/dashboard"}>
                <Button
                  variant={"ghost"}
                  className="text-gray-700 hover:text-black cursor-pointer"
                >
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="relative inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent focus-visible:outline-none">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className={"bg-primary text-white"}>
                      {session.user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1 text-black">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <SignOutButton />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href={"/sign-in"}>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black cursor-pointer"
                >
                  Log In
                </Button>
              </Link>

              <Button
                onClick={handleTryDemo}
                variant="outline"
                disabled={demoLoading}
                className="border-primary text-primary hover:bg-primary/5 cursor-pointer"
              >
                Try Demo
              </Button>
              <Link href={"/sign-up"}>
                <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                  Start for free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
