const encrypt=require('../util/encrypt')
const User=require('../Models/user')

exports.register=async (ctx)=>{
    //获取表单信息
    const user=ctx.request.body
    const username=user.username
    const password=user.password
    await new Promise((resolve,reject)=>{
        //验证用户名是否存在 
        User.find({username},(err,data)=>{
            if(err)return reject(err)
            //如果用户名存在 则返回用户名已存在
            if(data.length!==0){
                return resolve('')
            }
            //用户名不存在 则创建用户 encrypt()方法进行了密码的加密
            new User({
                username,
                password:encrypt(password),
                commentNum:0,
                articleNum:0
            })
            .save((err,data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    }).then(async data=>{
        //data有值 表示注册成功
        if(data){
           await ctx.render('isOk',{status:'注册成功'})
        }
        //表示用户名已存在
        else{
           await ctx.render('isOk',{status:'用户名已存在'})
        }
    }).catch(async err=>{
        await ctx.render('isOk',{status:'注册失败,请重试'})
    })
}

exports.login=async (ctx)=>{
    //获取表单信息
    const user=ctx.request.body
    const username=user.username
    const password=encrypt(user.password) 
    await new Promise((resolve,reject)=>{
        User.find({username,password},(err,data)=>{
            if(err)return reject(err)
            if(data.length===0){
                return resolve('')
            }
            return resolve(data)
           
        })
    }).then(async data=>{
        if(!data){
            return ctx.render('isOk',{status:'账号或密码错误'})
        }
        //如果登录成功 让用户设置cookie值 保存用户的的登陆状态
        ctx.cookies.set('username',username,{
            domain:'localhost',//指定域名
            path:'/',//指定该cookie生效的路径
            maxAge:36e5,//指定有效期
            httpOnly:false,//不让客户端访问这个cookie
            overwrite:false,
            signed:false
        })
        //设置数据库中的u_id为cookie的第二个值
        //如果登录成功 让用户设置cookie值 保存用户的的登陆状态
        ctx.cookies.set('uid',data[0]._id,{
            domain:'localhost',//指定主机名
            path:'/',//指定该cookie生效的路径
            maxAge:36e5,//指定有效期
            httpOnly:false,//不让客户端访问这个cookie
            overwrite:false,
            signed:false
        })
        //设置session
        ctx.session={
            username,
            uid:data[0]._id,
            avatar:data[0].avatar,
            role:data[0].role
        }
        await ctx.render('isOk',{status:'登录成功'})
    }).catch(async err=>{
        await ctx.render('isOk',{status:'登录失败,请重试'})
    })
}
// 确定用户的状态  保持用户的状态
exports.keepLog = async (ctx, next) => {
    if(ctx.session.isNew){// session没有
      if(ctx.cookies.get("username")){
        let uid = ctx.cookies.get("uid")
        const avatar = await User.findById(uid)
          .then(data => data.avatar)
  
        ctx.session = {
          username: ctx.cookies.get('username'),
          uid,
          avatar
        }
      }
    }
    await next()
  }


// 用户退出中间件
exports.logout = async (ctx) => {
    ctx.session = null
    ctx.cookies.set("username", null, {
      maxAge: 0
    })
    
    ctx.cookies.set("uid", null, {
      maxAge: 0
    })
    // 在后台做重定向到根路径  
    ctx.redirect("/")
  }

//头像上传
exports.upload=async ctx=>{
    const filename=ctx.req.file.filename
    let data={}
    await User.update({_id:ctx.session.uid},{$set:{avatar:'/avatar/'+filename}},(err,res)=>{
        if(err){
            data={
                status:0,
                message:'上传失败'
            }
        }else{
            data={
                message:'上传头像成功',
                status:1
            }
        }
    })
    ctx.body=data
}


//获取用户列表
exports.userlist=async ctx=>{
    const uid = ctx.session.uid
    const data = await User.find()
    ctx.body = {
      code: 0,
      count: data.length,
      data
    }
  
}

//删除用户
exports.del=async ctx=>{
    //获取用户id
    const _id=ctx.params.user
    let res={
        state:1,message:'成功'
    }
    await User.findById(_id)
    .then(data=>{
         data.remove()
    })
    .catch(err=>{
        res={
            state:0,
            message:err
        }
    })
    ctx.body=res
}