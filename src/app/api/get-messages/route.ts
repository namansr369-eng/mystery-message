import {auth} from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from  "@/model/User";
import mongoose from "mongoose";
import {User} from "next-auth";

// implementing the mongodb aggregation pipeline to fetch messages for the authenticated user.

export async function GET(request: Request){
    await dbConnect()
    const session = await auth();
    const user = session?.user as User | undefined;

    if (!session || !user) {
        return Response.json(
            {
        success : false,
        message: "Not Authenticated"
    }, { status: 402 });
    };
    
    // since we had converted the _id to string while storing in the session, we need to convert it back to ObjectId for querying the database.
    // though other methods can do this internally but to use the aggregation pipeline we need to do it manually.
    const userId = new mongoose.Types.ObjectId(user._id);

    try{
        const user = await UserModel.aggregate([
            { $match: { _id: userId}},
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" }}}

        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 });
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        } , { status: 200 });
        
    } catch (error) {
        console.error("Error fetching messages:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}