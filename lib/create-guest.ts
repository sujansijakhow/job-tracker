"use server";

import { auth } from "./auth/auth";
import { headers } from "next/headers";

export async function createGuestAccount() {
  const guestId = crypto.randomUUID().slice(0, 8);
  const email = `guest_${guestId}@demo.local`;
  const password = crypto.randomUUID();

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: `Guest ${guestId}`,
    },
    headers: await headers(),
  });

  await auth.api.signInEmail({
    body: { email, password },
    headers: await headers(),
    asResponse: true, 
  });

  return result;
}