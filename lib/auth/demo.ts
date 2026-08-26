import { signIn, signUp } from "./auth-client";

export async function startDemo() {
  const guestId = crypto.randomUUID().slice(0, 8);
  const guestEmail = `guest_${guestId}@demo.local`;
  const guestPassword = crypto.randomUUID();

  const signUpResult = await signUp.email({
    email: guestEmail,
    password: guestPassword,
    name: `Guest ${guestId}`,
  });

  if (signUpResult.error) {
    throw new Error(
      signUpResult.error.message ?? "Failed to start demo",
    );
  }

  const signInResult = await signIn.email({
    email: guestEmail,
    password: guestPassword,
  });

  if (signInResult.error) {
    throw new Error(
      signInResult.error.message ?? "Failed to start demo",
    );
  }
}