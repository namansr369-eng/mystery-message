import {auth} from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from  "@/model/User";
import {User} from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    const session = await auth();
    const user = session?.user as User | undefined;

    if(!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401})
    }

    const userId = user._id;

    const acceptMessage = await request.json();

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessage},
            {new: true}
         )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        else{
            return Response.json({
                success: true,
                message: "User status updated successfully",    
                data: updatedUser
            }, { status: 200 } );
        }
    }catch (error){
        console.error("Error in excepting message", error);
        return Response.json({
           success: false,
           message: "failed to update user status to accept message"
        }, { status: 500 })
    }
}


export async function GET(request: Request){
    await dbConnect();

    const session = await auth();
    const user = session?.user as User | undefined;

    if(!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401})
    }

    const userId = user._id;

    try{
        const foundUser = await UserModel.findById(userId);

    if(!foundUser){
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 })
    }

    return Response.json({
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage
    }, { status: 200 })

    }catch{
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, { status: 500 })
    }


}