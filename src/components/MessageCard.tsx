import { Message } from "@/models/user.model";
import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/Types/ApiResponse";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Delete, DeleteIcon, Loader2, Trash2 } from "lucide-react";

type Props = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: Props) {
  const { toast } = useToast();
  const[isLoading, setisLoading] = useState(false);
  const [isOpen,setIsOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    setisLoading(true);
    const response = await axios.delete<ApiResponse>(
      `/api/deleteMessage/${message._id}`
    );
    setisLoading(false);
    setIsOpen(false);
    toast({
      title: response.data.message,
    });
    onMessageDelete(message.id);
  };

  return (
    <Card className="bg-black text-white py-6 max-h-50 h-full">
      <CardContent className="break-words">{message.content}</CardContent>
      <CardFooter className="flex items-center justify-between">
        <span>{message.createdAt.toString()}</span>
        <Dialog open={isOpen}>
          <DialogTrigger>
            <Button onClick={() => setIsOpen(true)}>Delete</Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white rounded-lg">
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              Do you really want to delete this message?
              <Button onClick={handleDeleteConfirm} className="bg-black border border-red-500 hover:bg-red-500/[0.2]">
                {isLoading  ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="text-red-500 group" />
                )}
              </Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default MessageCard;
