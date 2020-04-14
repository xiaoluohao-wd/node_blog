const Router=require('koa-router')
const router=new Router

//设计主页
router.get('/',async (ctx)=>{
   await ctx.render("index")
})


module.exports=router