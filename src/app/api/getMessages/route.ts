import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const foundUser = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      {
        $unwind: "$message",
      },
      {
        $sort: { "message.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", message: { $push: "$message" } },
      },
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
      message: foundUser[0].message,
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
