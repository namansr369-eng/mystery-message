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
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [ isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  // zod implementation

  const register = useForm<Z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }
  })
  
  
  useEffect( () => {
     const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(`/api/check-unique-user?username=${username}`);
          setUsernameMessage(response.data.message);
        }catch (error) {
          if (axios.isAxiosError(error)){
            setUsernameMessage(
              error.response?.data.message || "Something went wrong. Please try again."  
            );
          }
        }
        finally {
          setIsCheckingUsername(false);
        }
      }
     }

     checkUsernameUniqueness();
  }, [username])
  
  const onSubmit = async ( data: Z.infer<typeof signUpSchema> ) =>{
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    }catch (error) {
      console.error("Error signing up: ",error);
      if (axios.isAxiosError(error)){
        toast.error(
          error.response?.data.message || "Something went wrong. Please try again."
        )
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className= "w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <div className="text-center">
          <h1 className="text=4xk font-extrabold">Join Mystery Message</h1>
          <p className="mb-4 text-sm text-gray-600">
            Sign up to start your anonymous journey!
          </p>
        </div>
    <Form {...register}>
      <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={register.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} 
                 onChange = { (e)=>{
                  field.onChange(e);
                  debounced(e.target.value);
                 }} />
              </FormControl>
              { isCheckingUsername && <span className="text-sm mt-1 text-blue-400"> <Loader className="mx-2 h-4 w-4 animate-spin inline-block" />Checking username...</span>}
              {!isCheckingUsername && <p className={`text-sm mt-1 ${usernameMessage=="Username is available" && ! isCheckingUsername ? 'text-green-400' : 'text-red-400'} `}>{usernameMessage}</p>}
              <FormDescription>
                Enter the user Name you want to use.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={register.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}  />
              </FormControl>
              <FormDescription>
                Enter the email you want to use.
              </FormDescription>
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
                <Input placeholder="password" {...field}  />
              </FormControl>
              <FormDescription>
                Enter the password you want to use.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? <> <Loader className="mx-2 h-4 w-4 animate-spin inline-block"  /> Signing Up... </> : ("Sign Up")
          }
        </Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default page