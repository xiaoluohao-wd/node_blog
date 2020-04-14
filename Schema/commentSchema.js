const {Schema}=require('./config')
//mongodb的一种主键的数据类型 用于关联集合
const ObjectId=Schema.Types.ObjectId
const CommentSchema=new Schema({
    //头像 用户名 文章 内容
    title:String,
    content:String,
    //通过author属性关联User的集合 
    from:{
        type:ObjectId,//类型是ObjectId
        ref:'users'//关联的集合名是users
    },
    //关联到article集合
    article:{
        type:ObjectId,
        ref:'articles'
    }
},
{
    versionKey:false,
    //存储创建时间
    timestamps:{createdAt:'created'}
})


// 设置 comment 的 remove钩子
CommentSchema.post("remove", (doc) => {
    // 当前这个回调函数  一定会在 remove 事件执行前触发
    const Article = require('../Models/article')
    const User = require('../Models/user')
    const { from, article } = doc
    // 对应文章的评论数 -1 
    Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec()
    // 当前被删除评论的作者的 commentNum -1
    User.updateOne({_id: from}, {$inc: {commentNum: -1}}).exec()
  })
  

module.exports=CommentSchema