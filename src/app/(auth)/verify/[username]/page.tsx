"use client";

import { ApiResponse } from "@/Types/ApiResponse";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function Page() {

  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });


  useEffect(() => {
    const getOtp = async () => {
      try {
        const response = await axios.get(`/api/getUser?username=${params.username}`);
        console.log(response);
        const otp = response.data.user.verifyCode;
        toast({
          title: 'Your Otp',
          description: otp,
        })
        
      } catch (error) {
        console.log('Error while fetching user: ',error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Failed to get Otp',
          description: axiosError.response?.data.message,
          variant: 'destructive',
        })
      }
    }
    getOtp()
  }, [toast])
  
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
        setIsVerifying(true);
      const response = await axios.post(`/api/verifyCode`, {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      setIsVerifying(false);
      router.replace("/sign-in");
    } catch (error) {
      console.log("Error in Verifying user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Signup Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
      setIsVerifying(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center text-white justify-center">
      <BackgroundBeams />
      <div className="w-full max-w-md p-8 space-y-8 border bg-transparent border-white rounded-lg shadow-md z-10">
        <div className="text-center">
          <h1 className="text-white font-bold text-3xl md:font-extrabold md:text-4xl tracking-tight mb-3">
            Verify you account
          </h1>
          <p className="text-neutral-300 text-sm tracking-tight">
            Please enter the code we have send to you email
          </p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-center justify-center gap-4">
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          {...field}
                          className="text-white bg-gray-900"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                        <FormMessage/>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-black border border-neutral-300 hover:bg-neutral-950"
                >
                {isVerifying ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Verifying</>): ('Verify')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Page;
