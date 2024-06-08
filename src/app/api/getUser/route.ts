import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function GET(req: Request) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    if(!username) {
        return Response.json(
            {
                success: false,
                message: 'username is required',
            },
            {
                status: 400,
            }
        )
    }
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in finding user", error);
    return Response.json({
      success: false,
      message: "Something went wrong whild finding user",
    });
  }
}
