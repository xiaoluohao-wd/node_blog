const Koa=require('koa')
const static=require('koa-static')
const views=require('koa-views')
const router=require('./routers/router')
const logger=require('koa-logger')
const path=require('path')
const body=require('koa-body')
const session=require('koa-session')
//创建服务
const app=new Koa

//注册日志模块 可以在控制台查看日志和错误信息
// app.use(logger())
const CONFIG={
    //session id
    key:'Sid',
    //有效期 ms
    maxAge:36e5,
    //是否覆盖
    overwrite:true,
    //浏览器不可见
    httpOnly:false,
    //是否需要签名
    signed:false,
    //用户进行操作时就更新过期时间
    rolling:true

}
//配置session
app.use(session(CONFIG,app))

//配置koa-body 用于处理post表单数据
app.use(body())

//为public目录下的文件设置自动路由
app.use(static(path.join(__dirname,"public")))

//配置pug视图模板
app.use(views(path.join(__dirname,"views"),{extension:'pug'}))

//注册路由信息
app.use(router.routes()).use(router.allowedMethods())

//启动服务器监听3000端口
app.listen(3000,()=>{console.log('项目启动成功,监听在3000端口')})

//创建管理员用户 如果管理员用户存在 则返回
{
    //admin admin
    const {db}=require('./Schema/config')
    const UserSchema=require('./Schema/userSchema')
    const User=db.model('users',UserSchema)
    const encrypt=require('./util/encrypt')
    User.find({username:'admin'}).then(data=>{
        if(data.length===0){
            //管理员不存在 创建
            new User({
                username:'admin',
                password:encrypt('admin'),
                role:666,
                commentNum:0,
                articleNum:0
            })
            .save()
            .then(data=>{
                console.log(`管理员账号:admin 密码:admin`)
            })
            .catch(err=>{
                console.log(err)
            })
        }else{
            // 控制台输出
            console.log(`管理员账号:admin 密码:admin`)
        }
    })
}