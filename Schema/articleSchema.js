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
    tips:String
},
{
    versionKey:false,
    //存储创建时间
    timestamps:{createdAt:'created'}
})

module.exports=ArticleSchema