"use client";

import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={async () => {
        const result = await signOut();

        if (result.data) {
          router.push("/sign-in");
        } else {
          alert("Error Signing out");
        }
      }}
    >
      Log Out
    </DropdownMenuItem>
  );
};

export default SignOutButton;
