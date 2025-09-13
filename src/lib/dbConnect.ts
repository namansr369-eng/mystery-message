import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    // multiple db connection is allowed but can cause the performance issue. So make sure to verify.
    if (connection.isConnected){
        console.log("Already connected to database");
        return
    }

    try{
       const db = await mongoose.connect(process.env.MONGODB_URI || "", {})

       connection.isConnected = db.connections[0].readyState

       console.log("DB Connected Successfully");

       // just a check-
       console.log("\n-----db-----\n",db)
    }catch(error){
        console.log("Database Connection is Failed", error)
        process.exit(1);
    }
}

export default dbConnect;