const asynchandler=(requesthandler)=>{
  return (req,resp,next)=>{
    Promise.resolve(requesthandler(req,resp,next)).catch((error)=>next(error))
   }
 }
 export {asynchandler}

// const asynchandler=(fun)=> async(err,req,resp,next)=>{
//   try{
//     await fun(err,req,resp,next)
//   }catch(error){
//     resp.status(err.code||404).json(
//         {
//             success:false,
//             message:err.message
//         }
//     )
//   }
// }

