const Comments=require('../Models/comments')
const User=require('../Models/user')
const Article=require('../Models/article')

//添加评论
exports.addComment=async ctx=>{
    let message={msg:'请登录',status:0}
    //验证用户是否登录
    if(ctx.session.isNew) return ctx.body=message

    //用户登录则发表评论
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
    //更新用户的评论计数器
    User.update({_id:data.from},{$inc:{commentNum:1}},(err)=>{
        if(err)return console.log(err)
    })
    ctx.body=message
}

//获取评论列表
exports.comlist=async ctx=>{
    const uid=ctx.session.uid
    const data= await Comments.find({from:uid}).populate('article','title')
    ctx.body={
        code:0,
        count:data.length,
        data
    }
}

// 删除对应 id 的评论
exports.del = async ctx => {
    // 获取评论 id
    const commentId = ctx.params.id
    let res = {
      state: 1,
      message: "成功"
    }
    await Comments.findById(commentId)
      .then(data => data.remove())
      .catch(err => {
        res = {
          state: 0,
          message: err
        }
      })
    ctx.body = res
  } 