"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addTodo(formData: FormData) {
  const cookieStore = cookies();

  try {
    const token = cookieStore.get("token");

    if (!token) {
      redirect("/sign-in");
    }

    const values = Object.fromEntries(formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}add-todo`, {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        description: values.description,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token.value,
      },
    });

    console.log(`RESP ADD TODO: ${res.status} -- ${res.body}`);

    if (res.status != 200) {
      cookieStore.delete("token");
      throw new Error("Sorry, something went wrong. Try again!");
    }

    console.log(`SUCCESS ADD TODO: ${res.status}`);
  } catch (error) {
    throw error;
  }
}
