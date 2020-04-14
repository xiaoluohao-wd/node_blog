const {db}=require('../Schema/config')
const ArticleSchema=require('../Schema/articleSchema')
const Article=db.model('articles',ArticleSchema)
//连接用户的集合获取信息
const UserSchema=require('../Schema/userSchema')
const User=db.model('users',UserSchema)

//连接评论的集合
const CommentSchema=require('../Schema/commentSchema')
const Comments=db.model('comments',CommentSchema)

//显示文章发表的页面
exports.showAddPage=async ctx=>{
    await ctx.render('add-article',{title:'发表文章',session:ctx.session})
}

//添加文章
exports.add=async ctx=>{
    if(ctx.session.isNew){
        //如果为true表示用户未登录 
        return ctx.body={
            msg:'用户未登录',
            status:0
        }
    }
    //如果用户登录 则处理发布文章
    const data=ctx.request.body
    //author的类型是objectId
    data.author=ctx.session.uid
    data.commentNum=0
    await new Promise((resolve,reject)=>{
        new Article(data).save((err,data)=>{
            if(err)return reject(err)
            resolve(data)
        })
    }).then(data=>{
        ctx.body={
            msg:'发表成功',
            status:1
        }
    }).catch(err=>{
        ctx.body={
            msg:'发表失败',
            status:0
        }
    })
}

//获取文章列表
exports.getArticleList=async ctx=>{
    //查询每篇文章作者的头像
    //获取显示文章的页数
    let page=ctx.params.page||1
    page--
    //该方法获取集合中最大的文档数量
    const maxNum=await Article.estimatedDocumentCount((err,num)=>{
        err?console.log(err):num
    })
    //获取页数关联的五条数据
    const data=await Article.find()//查找文章的所有内容
           .sort('-created')//根据时间降序排序
           .skip(5*page)//跳过页数的五条 
           .limit(5)//筛选接下的五条
           //用于联表查询的方法
           .populate(
               {
                   path:'author',
                   select:'username _id avatar'
               }
           )
           .then(data=>data)
           .catch(err=>console.log(err))
    await ctx.render('index',{
        session:ctx.session,
        title:'博客',
        artList:data,
        maxNum
    })

}

//文章详情页
exports.details=async ctx=>{
    const _id=ctx.params.articlename
    //查找文章数据
    const article= await Article.findById(_id)
                 .populate({
                     path:'author',
                     select:'username'
                 })
                 .then(data=>data)

    //查找评论内容
    const comment=await Comments.find({article:_id})
                    .sort('-created')
                    .populate(
                        {
                            path:'from',
                            select:'username _id avatar'
                        }
                    )
                    .then(data=>data)
                    .catch(err=>console.log(err))
    console.log(comment)
    //渲染页面
    await ctx.render('article',{
        title:article.title,
        session:ctx.session,
        comment,
        article
    })
}