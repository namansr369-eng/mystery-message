"use client";
import { Loader } from "lucide-react";
import * as Z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import axios from "axios";
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
import Link from "next/link";
import { signIn } from "next-auth/react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  // zod implementation

  const register = useForm<Z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

const onSubmit = async (data: Z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    
    // Call NextAuth's signIn function with 'credentials' provider
    const result = await signIn('credentials', {
        redirect: false, // Prevents automatic redirect on failure
        username: data.username, // Map your form data to the expected keys
        password: data.password,
    });

    if (result?.error) {
        toast.error(result.error); // Error message from the authorize callback
    } else if (result?.ok) {
        toast.success("Login Successful");
        router.replace('/dashboard');
    }
    
    setIsSubmitting(false);
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <div className="text-center">
          <h1 className="text=4xk font-extrabold">Welcome Back to Mystery Message</h1>
          <p className="mb-4 text-sm text-gray-600">
            Sign In to start your anonymous journey!
          </p>
        </div>
        <Form {...register}>
          <form
            onSubmit={register.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={register.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <span className="text-sm mt-1 text-blue-400">
                      {" "}
                      <Loader className="mx-2 h-4 w-4 animate-spin inline-block" />
                      Checking username...
                    </span>
                  )}
                  {!isCheckingUsername && (
                    <p
                      className={`text-sm mt-1 ${
                        usernameMessage == "Username is available" &&
                        !isCheckingUsername
                          ? "text-green-400"
                          : "text-red-400"
                      } `}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={register.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="float-right ml-[100%]" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {" "}
                  <Loader className="mx-2 h-4 w-4 animate-spin inline-block" />{" "}
                  Signing In...{" "}
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <h2>
              Don't have an account yet?{" "}
              <Link
                className="text-sm font-bold text-gray-500 bg-gray-300/80 py-1 px-2 rounded"
                href="/sign-up"
              >
                Sign Up
              </Link>
            </h2>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
