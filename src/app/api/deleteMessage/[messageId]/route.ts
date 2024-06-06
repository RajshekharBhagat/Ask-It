import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";

export async function DELETE(req: Request, {params}: {params: {messageId: string}}) {
    const messageId = params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated',
        },{status: 401})
    }
    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: { _id: messageId}}}
        )

        if(updatedResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: 'Message not found or already deleted',
                },
                {
                    status: 401,
                }
            )
        }

        return Response.json(
            {
                success: false,
                message: 'Message Deleted',
            },
            {
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error in deleting the message', error)
        return Response.json(
            {
                success: false,
                message: 'Something went wrong while deleting the message',
            },
            {
                status: 500,
            }
        )
    }
}