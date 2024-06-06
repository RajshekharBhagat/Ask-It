import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, content } = await req.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json({
      success: true,
      message: 'message sent successfully',
    }, {status: 200});
  } catch (error) {
    console.error('Error sending messages:',error);
    return Response.json(
        {
            success: false,
            message: 'Internale Server Error',
        },
        {
            status: 500
        }
    )
}
}
