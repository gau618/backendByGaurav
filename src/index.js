import { connectDB } from "./db/db.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });

connectDB().then(()=>{
   app.listen(process.env.PORT||8000,()=>{
    console.log(`Application is runing at ${process.env.PORT}`)
   })
}).catch((error)=>{
    Console.log("Error Found on conection of DB",error)
})
