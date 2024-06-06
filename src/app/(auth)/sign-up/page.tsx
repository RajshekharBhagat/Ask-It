"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { sighUpSchema } from "@/schemas/sighUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/Types/ApiResponse";
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
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof sighUpSchema>>({
    resolver: zodResolver(sighUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/checkUsernameUnique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking Username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof sighUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Success",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-black">
      <BackgroundBeams />
      <div className="w-full max-w-md p-8 space-y-8 border bg-transparent border-white rounded-lg shadow-md z-10">
        <div className="text-center">
          <h1 className="text-white font-bold text-3xl md:font-extrabold md:text-4xl tracking-tight mb-5">
            Join Ask-It
          </h1>
          <p className="text-neutral-300 text-sm tracking-tight">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300">Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="username" className="bg-black text-white"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className=" mr-2 h-4 w-4 animate-spin" />}
                    <p className={`text-sm ${usernameMessage === 'username is unique' ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                    <FormDescription className="text-neutral-400">
                      This is you public display name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300">Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="email" className="bg-black text-white"
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300">Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="password" className="bg-black text-white"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}
              className="bg-black border border-neutral-300 hover:bg-neutral-950"
              >
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className=" mr-2 h-4 w-4 animate-spin" /> Please Wait
                    </>
                  ) : ('Signup')
                }
              </Button>
            </form>
          </Form>
          <div className="flex items-center gap-5">
            <p className="text-white">Already a member?{' '}</p>
            <Link href={'/sign-in'} className="text-neutral-400 hover:text-neutral-300">
                Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
