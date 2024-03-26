export async function signUp(formData: FormData) {
  const value = Object.fromEntries(formData);

  const result = await fetch("http://localhost:8080/signup", {
    method: "POST",
    body: JSON.stringify({
      email: value.email,
      password: value.password,
      username: value.username,
    }),
  });

  console.log(result.body);
  console.log(result.status);
}
