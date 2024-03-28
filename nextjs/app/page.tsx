import SearchFormField from "@/components/SearchFormField";
import TodoItem from "@/components/TodoItem";

export default function Home() {
  return (
    <main className="max-w-5xl m-auto my-12 space-y-10">
      <h1 className="text-neutral-700 font-semibold text-2xl text-center">
        TODO LIST
      </h1>
      <div className="mt-5">
        <SearchFormField />
      </div>
      <div className="px-5 items-center flex flex-col space-y-3">
        <TodoItem />
        <TodoItem />
      </div>
    </main>
  );
}
