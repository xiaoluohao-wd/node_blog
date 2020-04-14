const {Schema}=require('./config')

const UserSchema=new Schema({
    username:String,
    password:String,
    //权限
    role:{
        type:String,
        default:1
    },
    //默认头像
    avatar:{
        type:String,
        default:'/avatar/default.jpg'
    },
    articleNum:Number,
    commentNum:Number
},{versionKey:false})

//设置User的钩子函数
UserSchema.post('remove',doc=>{
    console.log(doc)
    const Comments=require('../Models/comments')
    const Article = require('../Models/article')
    const {_id}=doc
    Comments.find({from:_id}).then(data=>{
        data.forEach(v=>v.remove())
    })
    Article.find({author:_id}).then(data=>{
        data.forEach(v=>v.remove())
    })
})

module.exports=UserSchema