"use client";

import UseDialog from "@/hooks/useDialog";
import { TodoType } from "@/lib/type";
import Modal from "./Modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingButton from "@/components/LoadingButton";
import { editTodo } from "../api/todo/actions";
import { useEffect, useState } from "react";

export default function EditTodoModal() {
  const { isOpen, onOpen, onClose, todo, setTodo } = UseDialog();
  const [newTodo, setNewTodo] = useState<TodoType>({
    title: "",
    created_at: "",
    description: "",
    id: "",
    isComplete: false,
    updated_at: "",
    user_id: "",
  });

  useEffect(() => {
    if (todo !== null) {
      setNewTodo(todo!);
    }

    return () => {};
  }, [newTodo, setTodo, todo]);

  const EditTodoSchema = z.object({
    isComplete: z.boolean(),
    title: z
      .string()
      .min(1, "Title is required")
      .default(todo?.title ?? "No Title"),
    description: z
      .string()
      .min(1, "Description is required")
      .default(todo?.description ?? "No Desc"),
  });

  const form = useForm<z.infer<typeof EditTodoSchema>>({
    defaultValues: {
      isComplete: todo?.isComplete,
      title: todo?.title,
      description: todo?.description,
    },
  });

  const onSubmit = async (values: z.infer<typeof EditTodoSchema>) => {
    const formData = new FormData();
    const data = JSON.stringify(values);
    formData.append("data", data);
    await editTodo(formData, todo?.id ?? "");
    // revalidatePath("/");
  };

  const handleOpen = () => {
    if (!isOpen) {
      onOpen();
    } else {
      onClose();
      form.reset();
      setTodo(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onChange={handleOpen}
      title="Edit Todo"
      description=""
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={todo?.description} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isComplete"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="1"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="todo-1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Complete
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <LoadingButton loading={form.formState.isSubmitting}>
            Edit Todo
          </LoadingButton>
        </form>
      </Form>
    </Modal>
  );
}
