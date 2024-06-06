import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";
import path from "path";
import { MessagesPage } from "openai/resources/beta/threads/messages.mjs";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const foundUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!foundUser || foundUser.length === 0) {
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
    return Response.json({
      success: true,
      messages: foundUser[0].messages,
    });
  } catch (error) {
    console.error("An unexpected error occured:", error);
    return Response.json(
      {
        success: false,
        message: "Internale Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
