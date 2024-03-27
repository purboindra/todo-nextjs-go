"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { signUp } from "../api/auth/action";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().refine((val) => val.includes("@"), "Email is not valid"),
  username: z.string().min(2, "Username must be at least 2 characters").max(50),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (val) {
        formData.append(key, val);
      }
    });

    try {
      await signUp(formData);
      toast({
        title: "Success!",
        description: "Sign up success!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong, try again later",
      });
    }
  }

  return (
    <main className="flex min-h-screen lg:flex-row">
      {/* <div className="bg-blue-200 hidden lg:flex items-center justify-center">
        <h1>HEllo</h1>
      </div> */}
      <div className=" w-full flex flex-col p-12 items-center justify-center">
        <h1 className="text-2xl font-bold text-neutral-800">Create Account</h1>
        <div className="mt-4 flex flex-col w-1/2">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Input your valid email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password should be 6 characters or more"
                        {...field}
                      />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Input your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton loading={isSubmitting}>Sign Up</LoadingButton>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
