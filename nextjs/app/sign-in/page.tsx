"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "../api/auth/action";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().refine((val) => val.includes("@"), "Email is not valid"),
  password: z.string().min(2, "Password should be 6 characters").max(50),
});

export default function SignIn() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (val) {
        formData.append(key, val);
      }
    });

    try {
      await signIn(formData);

      toast({
        title: "Success!",
        description: "Sign in sucessfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong. Please try again!",
      });
    }
  }

  return (
    <main className="flex min-h-screen justify-center items-center">
      <div className="rounded-md shadow-lg p-12 flex flex-col items-center justify-center">
        <h1 className="text-lg font-semibold text-neutral-700">Sign In</h1>
        <Form {...form}>
          <form
            className="space-y-3 mt-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Input your valid email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input placeholder="Input your valid password" {...field} />
                </FormItem>
              )}
            />
            <LoadingButton loading={form.formState.isSubmitting}>
              Sign In
            </LoadingButton>
          </form>
        </Form>
        <Link href={"/sign-up"}>
          <p className="mt-3 text-sm font-medium text-neutral-500 hover:cursor-pointer hover:text-neutral-600 hover:font-semibold">{`Don\'t have an account?`}</p>
        </Link>
      </div>
    </main>
  );
}
