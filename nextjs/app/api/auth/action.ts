"use server";

import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  try {
    const value = Object.fromEntries(formData);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: value.email,
        password: value.password,
        username: value.username,
      }),
    });
    console.log(`RESP SIGN UP: ${res.json()}`);
    console.log(`RESP: ${res.text()}`);
    redirect("/");
  } catch (error: any) {
    throw error;
  }
}
