const {db}=require('../Schema/config')
const CommentSchema=require('../Schema/commentSchema')
const Comments=db.model('comments',CommentSchema)
//连接用户的集合获取信息
const UserSchema=require('../Schema/userSchema')
const User=db.model('users',UserSchema)
//连接文章的集合
const ArticleSchema=require('../Schema/articleSchema')
const Article=db.model('articles',ArticleSchema)
const fs=require('fs')
const path=require('path')

exports.index=async ctx=>{
    if(ctx.session.isNew){
        //如果用户没有登录
        ctx.status=404
        return await ctx.render('404',{title:'404'})
    }
    const id=ctx.params.id
    const arr=fs.readdirSync(path.join(__dirname,'../views/admin'))
    let flag=false
    arr.forEach(item=>{
        const name=item.replace(/^(admin\-)|(\.pug)$/g,'')
        if(name===id){
            flag=true
        }
    })
    if(flag){
        await ctx.render('./admin/admin-'+id,{role:ctx.session.role})
    }else{
        ctx.status=404
        return await ctx.render('404',{title:'404'})
    }
}