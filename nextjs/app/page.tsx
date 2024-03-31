import AddTodoButton from "@/components/AddTodoButton";
import SearchFormField from "@/components/SearchFormField";
import TodoItem from "@/components/TodoItem";
import { getAllTodos } from "./api/todo/actions";

export default async function Home() {
  const todos = await getAllTodos();

  return (
    <main className="max-w-5xl m-auto my-12 space-y-10">
      <h1 className="text-neutral-700 font-semibold text-2xl text-center">
        TODO LIST
      </h1>
      <div className="mt-5 space-y-3">
        <SearchFormField />
        <AddTodoButton />
      </div>
      <div className="px-5 items-center flex flex-col space-y-3">
        {todos.map((todo, index) => (
          <TodoItem key={index} todo={todo} />
        ))}
      </div>
    </main>
  );
}
