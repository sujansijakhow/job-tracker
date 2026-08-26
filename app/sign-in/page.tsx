"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to sign in");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occured");
    } finally {
      setLoading(false);
    }
  }

  async function handleTryDemo() {
    setError("");
    setDemoLoading(true);

    try {
      const guestId = crypto.randomUUID().slice(0, 8);
      const guestEmail = `guest_${guestId}@demo.local`;
      const guestPassword = crypto.randomUUID();

      const signUpResult = await signUp.email({
        email: guestEmail,
        password: guestPassword,
        name: `Guest ${guestId}`,
      });

      if (signUpResult.error) {
        setError(signUpResult.error.message ?? "Failed to start demo");
        return;
      }

      // signUp already establishes a session in Better Auth, but sign in
      // explicitly to be safe across versions/configs.
      const signInResult = await signIn.email({
        email: guestEmail,
        password: guestPassword,
      });

      if (signInResult.error) {
        setError(signInResult.error.message ?? "Failed to start demo");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Failed to start demo. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg px-2 py-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">
            Sign In
          </CardTitle>

          <CardDescription className="text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="border-gray-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="border-gray-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading || demoLoading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={handleTryDemo}
              disabled={loading || demoLoading}
            >
              {demoLoading ? "Setting up demo..." : "Try Demo (No Signup)"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account ?{" "}
              <Link
                href={"/sign-up"}
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;