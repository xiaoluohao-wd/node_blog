const {Schema}=require('./config')

const UserSchema=new Schema({
    username:String,
    password:String,
    //默认头像
    avatar:{
        type:String,
        default:'/avatar/default.jpg'
    }
},{versionKey:false})

module.exports=UserSchema