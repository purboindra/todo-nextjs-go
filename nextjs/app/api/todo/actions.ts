"use server";

import { TodoType } from "@/lib/type";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { todo } from "node:test";

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

    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

export async function getAllTodos() {
  try {
    let todos: TodoType[] = [];

    const cookiesStore = cookies();

    const token = cookiesStore.get("token");

    if (!token) {
      redirect("/sign-in");
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}get-todos`, {
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });

    if (result.status == 401) {
      cookiesStore.delete("token");
      throw new Error("Unauthorized!");
    }

    if (result.status != 200) {
      throw new Error("Sorry, something went wrong. Try again!");
    }

    const data = await result.json();

    for (const todo of data.data) {
      todos.push(todo);
    }

    return todos;
  } catch (error) {
    throw error;
  }
}

export async function deleteTodo(id: string) {
  try {
    console.log(`TODO ID: ${id}`);

    const cookiesStore = cookies();

    const token = cookiesStore.get("token");

    if (!token) {
      redirect("/sign-in");
    }

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}delete-todo/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token.value,
        },
      }
    );

    if (result.status == 401) {
      cookiesStore.delete("token");
      throw new Error("Unauthorized!");
    }

    if (result.status != 200) {
      throw new Error("Sorry, something went wrong. Try again!");
    }

    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}
