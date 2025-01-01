import mongoose,{Schema}from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoScheme=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        //index:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    videoUrl:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    dislikes:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    // comments:[
    //     {
    //         type:Schema.Types.ObjectId,
    //         ref:"Comment"
    //     }
    // ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    isPublished:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
});
videoScheme.plugin(mongooseAggregatePaginate);
 const Video=mongoose.model("Video",videoScheme);

