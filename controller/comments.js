const {db}=require('../Schema/config')
const CommentSchema=require('../Schema/commentSchema')
const Comments=db.model('comments',CommentSchema)
//连接用户的集合获取信息
const UserSchema=require('../Schema/userSchema')
const User=db.model('users',UserSchema)
//连接文章的集合
const ArticleSchema=require('../Schema/articleSchema')
const Article=db.model('articles',ArticleSchema)


exports.addComment=async ctx=>{
    let message={msg:'请登录',status:0}
    //验证用户是否登录
    if(ctx.session.isNew) return ctx.body=message

    //用户登录
    const data=ctx.request.body
    data.from=ctx.session.uid

    const _comment=new Comments(data)
    await _comment.save().then(data=>{
        message={
            status:1,
            msg:'评论成功'
        }
        //更新当前文章的评论计数器
        Article.update({_id:data.article},{$inc:{commentNum:1}},(err)=>{
            if(err)return console.log()
        })
    }).catch(err=>{
        message={
            status:0,
            msg:'评论失败'
        }
    })
    ctx.body=message
}