const Koa=require('koa')
const static=require('koa-static')
const views=require('koa-views')
const router=require('./routers/router')
const logger=require('koa-logger')
const path=require('path')
//创建服务
const app=new Koa
//注册日志模块
app.use(logger())
//为public目录下的文件设置自动路由
app.use(static(path.join(__dirname,"public")))
//配置pug视图模板
app.use(views(path.join(__dirname,"views"),{extension:'pug'}))
//注册路由信息
app.use(router.routes()).use(router.allowedMethods())
//启动服务器监听3000端口
app.listen(3000,()=>{console.log('项目启动成功,监听在3000端口')})