"use client";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { searchTodo } from "@/app/api/todo/actions";

export default function SearchFormField() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchSchema = z.object({
    search: z.string().min(1, "Please eter a text"),
  });

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    const params = new URLSearchParams(searchParams);

    params.set("query", values.search);

    replace(`${pathname}?${params.toString()}`);

    const result = await searchTodo(values.search);

    console.log(result);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem {...field}>
              <FormLabel htmlFor="search">Search todo</FormLabel>
              <FormControl>
                <Input
                  id="search"
                  placeholder="Find your activity..."
                  defaultValue={searchParams.get("query")?.toString()}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
