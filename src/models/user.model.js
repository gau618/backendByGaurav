import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
const usersScheme=new mongoose.Schema(
    {
      username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
      },
      password:{
        type:String,
        required:true,
        trim:true,
      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
      },
      fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
      },
      avatar:{
        type:String,
        required:true,
      },
      coverImage:{
        type:String,
      },
      watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
      ],
      refreshToken:{
        type:String,
      }
    },
    {
        timestamps:true
    }
);

usersScheme.pre("save", async function(next){
   if(this.isModified("password")){
   this.password=await bcryptjs.hash(this.password,8);
   }
   next();
})
usersScheme.methods.isPasswordCorrect=async function(password){
    return await bcryptjs.compare(password,this.password);
}
usersScheme.methods.generateRefreshToken= async function(){
  return await jwt.sign({
    _id:this._id,
    username:this.username,
    email:this.email,
    fullName:this.fullName
},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
  }
usersScheme.methods.generateAccessToken= async function(
){
 return await jwt.sign({
    _id:this._id,
    username:this.username,
    email:this.email,
    fullName:this.fullName
},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
export const User=mongoose.model("User",usersScheme)