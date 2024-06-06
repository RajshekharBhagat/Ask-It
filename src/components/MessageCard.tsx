import { Message } from '@/models/user.model';
import React from 'react'
import { useToast } from './ui/use-toast';
import axios from 'axios';
import { ApiResponse } from '@/Types/ApiResponse';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';

type Props = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

function MessageCard({message, onMessageDelete}: Props) {

    const {toast} = useToast();

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/deleteMessage/${message._id}`)
        toast({
            title: response.data.message
        });
        onMessageDelete(message.id);
    }

  return (
    <div>
      <Card>
        <CardContent>
           {message.content}
        </CardContent>
        <CardFooter>
          <span>{message.createdAt.toString()}</span>
          <Button onClick={handleDeleteConfirm}>Delete</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default MessageCard
