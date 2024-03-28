"use client";

import { PencilIcon, Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { FormattedDate } from "react-intl";

export default function TodoItem() {
  // DUMMY
  const currentDate = new Date();

  return (
    <div className="px-3 py-2 rounded border-neutral-400 border-[1px] w-full h-24">
      <span className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="todo-1" />
          <label
            htmlFor="todo-1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
        <div className="flex flex-row gap-4">
          <PencilIcon
            size={18}
            className="text-neutral-500 hover:cursor-pointer hover:text-neutral-600"
          />
          <Trash2
            size={18}
            className="text-neutral-500 hover:cursor-pointer hover:text-neutral-600"
          />
        </div>
      </span>
      <p className="text-sm text-neutral-500 mt-2 truncate">
        Learn go and next js for my goals become a software engineer Learn
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
