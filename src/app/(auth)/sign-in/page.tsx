"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { sighInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function Page() {

  const router = useRouter();

  const form = useForm<z.infer<typeof sighInSchema>>({
    resolver: zodResolver(sighInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (data: z.infer<typeof sighInSchema>) => {
    setIsLoading(true)
    const result = await signIn('credentials',{
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if(result?.error) {
      toast({
        title: 'Login Failed',
        description: `${result?.error}`,
        variant: 'destructive',
      });
    } 
    if(result?.url) {
      setIsLoading(false);
      router.replace('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-white bg-black">
      <BackgroundBeams />
      <div className="w-full max-w-md p-8 space-y-8 border bg-transparent border-white rounded-lg shadow-md z-10">
        <div className="text-center">
          <h1 className="text-white font-bold text-3xl md:font-extrabold md:text-4xl tracking-tight mb-5">
            Login to Ask-It
          </h1>
          <p className="text-neutral-300 text-sm tracking-tight">
            Welcome Back
          </p>
        </div>
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username/email"
                        className="bg-black text-white"
                        {...field}
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
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="password" className="bg-black"/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-black border border-neutral-300 hover:bg-neutral-950"
              >{isLoading ? (<><Loader2 className=" mr-2 h-4 w-4 animate-spin" /> Logging in</>) : (<>Login</>)}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Page;
