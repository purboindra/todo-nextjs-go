"use client";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SearchFormField() {
  const searchSchema = z.object({
    search: z.string().min(1, "Please eter a text"),
  });

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  function onSubmit(values: z.infer<typeof searchSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem {...field}>
              <FormLabel>Search todo</FormLabel>
              <FormControl>
                <Input placeholder="Find your activity..." />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
