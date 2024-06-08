import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await dbConnect();
    try {
      const url = new URL(req.url);
      const username = url.searchParams.get('username');
  
      if (!username) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'Username is required',
          }),
          {
            status: 400,
          }
        );
      }
  
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "User not found",
          }),
          { status: 404 }
        );
      }
  
      return new NextResponse(
        JSON.stringify({
          success: true,
          user,
        }),
        { status: 200 }
      );
    } catch (error) {
      console.log("Error in finding user", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Something went wrong while finding user",
        }),
        { status: 500 }
      );
    }
  }