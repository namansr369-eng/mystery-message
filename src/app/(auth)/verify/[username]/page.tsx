"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as Z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
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
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const page = () => {
  const router = useRouter();
  const para = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // zod implementation

  const register = useForm<Z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: Z.infer<typeof verifySchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.get("/api/verify-code", {
        params: {
          username: para.username,
          code: data.code,
        },
      });
      toast.success("Success", { description: response.data.message });
      setIsSubmitting(false);
      router.replace("/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            "Something went wrong. Please try again."
        );
        setIsSubmitting(false);
      }
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <div className="text-center">
          <h1 className="text=4xk font-extrabold">
            Verify your account with OTP
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Enter the OTP sent to your email to verify your account.
          </p>
        </div>
        <Form {...register}>
          <form
            onSubmit={register.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={register.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Code" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the code you received via email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {" "}
                  <Loader className="mx-2 h-4 w-4 animate-spin inline-block" />{" "}
                  Signing Up...{" "}
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
