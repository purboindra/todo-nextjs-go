import AddTodoButton from "@/components/AddTodoButton";
import SearchFormField from "@/components/SearchFormField";
import TodoItem from "@/components/TodoItem";
import { getAllTodos, searchTodo } from "./api/todo/actions";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const todos = await getAllTodos();
  const result = await searchTodo(searchParams?.query || "");

  return (
    <main className="max-w-5xl m-auto my-12 space-y-10">
      <h1 className="text-neutral-700 font-semibold text-2xl text-center">
        TODO LIST
      </h1>
      <div className="mt-5 space-y-3">
        <SearchFormField placeholder="Search todo..." />
        <AddTodoButton />
      </div>
      <div className="px-5 items-center flex flex-col space-y-3">
        {todos.length === 0 && !result ? (
          <h2 className="text-lg font-semibold text-neutral-600 flex justify-center">
            No Todos Yet...
          </h2>
        ) : (
          (!result ? todos : result).map((todo, index) => {
            return <TodoItem key={index} todo={todo} />;
          })
        )}
      </div>
    </main>
  );
}
