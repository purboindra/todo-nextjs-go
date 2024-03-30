export async function addTodo(formData: FormData) {
  try {
    const values = Object.fromEntries(formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}add-todo`, {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        description: values.description,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      },
    });

    if (res.status != 200) {
      throw new Error("Sorry, something went wrong. Try again!");
    }

    console.log(`SUCCESS ADD TODO: ${res.status}`);
  } catch (error) {
    throw error;
  }
}
