const Router=require('koa-router')
const router=new Router
const user=require('../controller/user')
//设计主页
router.get('/',user.keepLog,async (ctx)=>{
   await ctx.render("index",{title:'博客',session:ctx.session})
})

// 主要用来处理返回  用户登录 用户注册
router.get(/^\/user\/(?=register|login)/, async (ctx) => {
   // show 为 true 则显示注册   false 显示登录
   const show = /register$/.test(ctx.path)
   await ctx.render("register", {show})
 })
//处理登录的post表单
router.post('/user/login',user.login)

//处理注册的post表单
router.post('/user/register',user.register)

// 用户退出
router.get('/user/logout', user.logout)

module.exports=router