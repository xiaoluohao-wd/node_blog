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

module.exports=CommentSchema