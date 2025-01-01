import { connectDB } from "./db/db.js";
import dotenv from "dotenv";
import { ApiError } from "./utils/ApiError.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });
import { User } from "./models/user.model.js";

connectDB().then(()=>{
   app.listen(process.env.PORT||8000,()=>{
    console.log(`Application is runing at ${process.env.PORT}`)
   })
}).catch((error)=>{
    Console.log("Error Found on conection of DB",error)
})
// async function createUserAndGenerateToken() {
//   try {
//     const newUser = await User.create({
//       username: 'john_doe',
//       email: 'john@example.com',
//       fullName: 'John Doe',
//       avatar: 'https://example.com/avatar.jpg',
//       coverImage: 'https://example.com/cover.jpg',
//       refreshToken: 'a', // Will update this after generating the token
//     });

//     // Generate refresh token for the user
//     const refreshToken = await newUser.generateRefreshToken();

//     // Save the token to the database
//     newUser.refreshToken = refreshToken;
//     await newUser.save();
//     console.log(newUser)

//     console.log('User created with refresh token:', refreshToken);
//   } catch (error) {
//     console.error('Error creating user:', error);
//   }
// }

// createUserAndGenerateToken();



