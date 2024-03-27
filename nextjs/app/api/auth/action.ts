"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { error } from "console";

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

    if (res.status != 200) {
      throw new Error("Sorry, something went wrong. Try again!");
    }

    const data = await res.json();

    cookies().set("token", data.token, { secure: true });

    redirect("/");
  } catch (error: any) {
    throw error;
  }
}

export async function signIn(formData: FormData) {
  try {
    const value = Object.fromEntries(formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}signin`, {
      method: "POST",
      body: JSON.stringify({
        email: value.email,
        password: value.password,
      }),
    });

    if (res.status != 200) {
      // throw new Error("Sorry, something went wrong. Try again");
      return {
        message: "Errro",
      };
    }

    const data = await res.json();

    cookies().set("token", data.token, { secure: true });

    redirect("/");
  } catch (error) {
    throw error;
  }
}
