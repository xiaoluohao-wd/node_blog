const {Schema}=require('./config')
//mongodb的一种主键的数据类型 用于关联集合
const ObjectId=Schema.Types.ObjectId
const ArticleSchema=new Schema({
    title:String,
    content:String,
    //通过author属性关联User的集合 
    author:{
        type:ObjectId,//类型是ObjectId
        ref:'users'//关联的集合名是users
    },
    tips:String,
    commentNum:Number
},
{
    versionKey:false,
    //存储创建时间
    timestamps:{createdAt:'created'}
})

ArticleSchema.post('remove', doc => {
    const Comments=require('../Models/comments')
    const User = require('../Models/user')
    const { _id:artId, author: authorId } = doc
    // 只需要用户的 articleNum -1
    User.findByIdAndUpdate(authorId, {$inc: {articleNum: -1}}).exec()
    // 把当前需要删除的文章所关联的所有评论  一次调用 评论 remove
    Comments.find({article: artId})
      .then(data => {
        data.forEach(v => v.remove())
      })
  })

module.exports=ArticleSchema