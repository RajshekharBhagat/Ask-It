"use client";
import { ApiResponse } from "@/Types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const params = useParams<{ username: string }>();
  const username = params.username;

  const onSubmit = async ( data: z.infer<typeof messageSchema>) => {
    try {
        setIsLoading(true)
        const response = await axios.post('/api/sendMessage',{
            username: username,
            content: data.content,
        })
        toast({
            title: 'Sent',
            description: `Message sent to ${username}`
        });
        setIsLoading(false);
    } catch (error) {
        console.log("Failed to send message", error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title: 'Failed',
            description: axiosError.response?.data.message,
            variant:'destructive',
        })
        setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-black relative overflow-hidden bg-dot-white/[0.2]">
      <section className="container mx-auto py-12 px-4 md:px-8 text-white">
        <h1 className="text-2xl font-extrabold border rounded-md py-4 text-center md:text-4xl ">
          Send Anonymous Message to @{username}
        </h1>
      </section>
      <div className="max-w-5xl mx-auto px-4 md:px-8 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 flex flex-col mb-10"
          >
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Write you message here"
                      className="bg-black text-white pb-8 h-auto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="bg-black border border-neutral-300 hover:bg-neutral-950 self-center ">
              {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                </>
              ) : (
                <>
                    Send
                </>
              )}
            </Button>
          </form>
        </Form>
        <Separator className="text-neutral-500 mb-5" />
        <div className="flex flex-col items-center text-white gap-6">
          <h1>See you own Anonymous Messages</h1>
          <Link href={'/sign-in'}>
          <Button className="bg-black border border-neutral-300 hover:bg-neutral-950 self-center ">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Page;
