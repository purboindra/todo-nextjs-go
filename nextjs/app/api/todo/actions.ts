"use server";

import { TodoType } from "@/lib/type";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { todo } from "node:test";
import { string } from "zod";

export async function addTodo(formData: FormData) {
  const cookieStore = cookies();

  try {
    const token = cookieStore.get("token");

    const values = Object.fromEntries(formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}add-todo`, {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        description: values.description,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token!.value,
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
      throw new Error("Unauthorized");
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}get-todos`, {
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });

    if (result.status == 401) {
      // cookiesStore.delete("token");
      redirect("/sign-in");
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
    const cookiesStore = cookies();

    const token = cookiesStore.get("token");

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}delete-todo/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token!.value,
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

export async function editTodo(formData: FormData, id: string) {
  const data = formData.get("data");

  const decodeData = JSON.parse(data!.toString());

  try {
    const cookiesStore = cookies();

    const token = cookiesStore.get("token");

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}update-todo/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          id: id,
          title: decodeData!.title,
          description: decodeData.description,
          isComplete: decodeData.isComplete,
        }),
        headers: {
          Authorization: token!.value,
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

export async function getTodoById(id: string) {
  try {
    const cookiesStore = cookies();

    const token = cookiesStore.get("token");

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}get-todo/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token!.value,
        },
      }
    );

    if (result.status == 401) {
      redirect("/sign-in");
    }

    if (result.status != 200) {
      throw new Error("Sorry, something went wrong. Try again!");
    }

    const data = await result.json();

    console.log(result.json());

    return data.todo;
  } catch (error) {
    throw error;
  }
}

export async function searchTodo(query: string) {
  console.log(`SEARCH TODO: ${query}`);

  try {
    const cookieStore = cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Unauthorized");
    }

    let todos: TodoType[] = [];

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}todos?q=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await result.json();

    console.log(`RESULT SEARCH: ${result.ok} -- ${data.data}`);

    if (!result.ok) {
      return [];
    }

    for (const todo of data.data) {
      todos.push(todo);
    }

    return todos;
  } catch (error) {
    console.log("ERROR SEARCH TODO", error);
    throw error;
  }
}
