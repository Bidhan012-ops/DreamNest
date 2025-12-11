const mongoose=require('mongoose')
const userSchema= new mongoose.Schema({
    userName:{type:String,required:[true,"username is required"],unique:true,trim:true},
    email:{type:String,required:[true,"email is required"],unique:true,trim:true},
    password:{type:String,required:[true,"password is required"]},
    accountType:{type:String,enum:['host','guest'],required:[true,"account type is required"]},
    favourites:[{type:mongoose.Schema.Types.ObjectId,ref:'Home'}],
    hostHomes:[{type:mongoose.Schema.Types.ObjectId,ref:'Home'}]
});
module.exports= mongoose.model('User',userSchema);