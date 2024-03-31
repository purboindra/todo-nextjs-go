"use client";

import { PencilIcon, Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { FormattedDate } from "react-intl";
import { ModalType, TodoType } from "@/lib/type";
import { deleteTodo } from "@/app/api/todo/actions";
import UseDialog from "@/hooks/useDialog";

interface TodoItemInterface {
  todo: TodoType;
}

export default function TodoItem({ todo }: TodoItemInterface) {
  const currentDate = new Date(todo.created_at);

  const { onOpen, setType, setTodo } = UseDialog();

  const deletedTodo = async (id: string) => {
    deleteTodo(id);
  };

  return (
    <div className="px-3 py-2 rounded border-neutral-400 border-[1px] w-full h-24">
      <span className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id={todo.id} checked={todo.isComplete} />
          <label
            htmlFor="todo-1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {todo.title}
          </label>
        </div>
        <div className="flex flex-row gap-4">
          <PencilIcon
            size={18}
            onClick={() => {
              onOpen();
              setType(ModalType.Edit);
              setTodo(todo);
            }}
            className="text-neutral-500 hover:cursor-pointer hover:text-neutral-600"
          />
          <Trash2
            onClick={async () => await deletedTodo(todo.id)}
            size={18}
            className="text-neutral-500 hover:cursor-pointer hover:text-neutral-600"
          />
        </div>
      </span>
      <p className="text-sm text-neutral-500 mt-2 truncate">
        {todo.description}
      </p>
      <div className="mt-2 text-neutral-500 text-sm">
        <FormattedDate
          value={currentDate}
          year="numeric"
          month="long"
          day="numeric"
          weekday="long"
        />
      </div>
    </div>
  );
}
