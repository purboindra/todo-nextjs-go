"use client";

import UseDialog from "@/hooks/useDialog";
import Modal from "./Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { addTodo } from "../api/todo/actions";
import { toast } from "@/components/ui/use-toast";
import { useCookies } from "next-client-cookies";
import { redirect } from "next/navigation";

const todoSchema = z.object({
  title: z.string().min(1, "Please enter a text"),
  description: z.string().min(1, "Please enter a text"),
});
export default function AddTodoModal() {
  const { isOpen, onOpen, onClose } = UseDialog();
  // const cookie = useCookies();

  const form = useForm<z.infer<typeof todoSchema>>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof todoSchema>) {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (val) {
          formData.append(key, val);
        }
      });

      await addTodo(formData);

      toast({
        title: "Success",
        description: "Todo has successfully created!",
      });

      onClose();
      form.reset();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error!",
        description: "Sorry something went wrong. Please try again!",
        variant: "destructive",
      });
    }
  }

  const handleOpen = () => {
    if (!isOpen) {
      onOpen();
    } else {
      onClose();
      form.reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onChange={handleOpen}
      title="Add Todo"
      description="Add a new todo"
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
                  <Input {...field} placeholder="What would you like to do?" />
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
                  <Input
                    {...field}
                    placeholder="Describe your today activity"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <LoadingButton className="mt-3" loading={form.formState.isSubmitting}>
            Add
          </LoadingButton>
        </form>
      </Form>
    </Modal>
  );
}
