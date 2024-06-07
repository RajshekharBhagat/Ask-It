"use client";
import { ApiResponse } from "@/Types/ApiResponse";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };


  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/acceptMessages`);
      setValue("acceptMessage", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue,toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setisLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`/api/getMessages`);
        setMessages(response.data.messages as Message[])
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest Messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch Messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setisLoading(false);
      }
    },
    [setisLoading, setMessages,toast]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post(`/api/acceptMessages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black">
        <h1 className="text-4xl text-neutral-400 font-extrabold">
          Please Login...
        </h1>
      </div>
    );
  }

  const user = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${user.username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied",
      description: "Profile URL has been copied to clipboard",
    });
    router.replace(`/u/${session.user.username}`)
  };

  return (
    <main className="min-h-screen w-full bg-black p-4 md:p-6 overflow-hidden">
      <div className="container mx-auto text-white py-5">
        <h1 className="text-3xl text-center md:text-left md:text-5xl font-semibold mb-5">
          User Dashboard
        </h1>
        <div className="mb-5 grid md:grid-cols-[1fr_2fr] items-center ">
          <h2 className="text-lg font-semibold mb-2">Copy you Unique Link</h2>
          <div className="flex items-center mb-6">
            <Input
              type="text"
              value={profileUrl}
              disabled
              className="bg-black text-white max-w-4xl w-full p-2 mr-2"
            />
            <Button
              onClick={copyToClipBoard}
              className="bg-black border border-neutral-300 hover:bg-neutral-950"
            >
              Copy
            </Button>
          </div>
        </div>
        <div className="flex gap-4 items-center mb-8">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span>Accept Message: {acceptMessages ? "On" : "Off"}</span>
        </div>
        <Separator className="bg-neutral-500 mb-8" />
        <div className=" max-w-3xl mx-auto space-y-6">
          {
            messages.length === 0 ? (
              <div> No Messages available</div>
            ) : (
              messages.map((message : Message,index) => (
                <MessageCard key={index} message={message} onMessageDelete={() =>handleDeleteMessage(message._id as string)}  />
              ))
            )
          }
        </div>
      </div>
    </main>
  );
}

export default Page;
