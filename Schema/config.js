//连接数据库 导出 db Schema
const mongoose=require('mongoose')
const db=mongoose.createConnection("mongodb://localhost:27017/blog",{useNewUrlParser:true},(err)=>{
    if(err){
        console.log('数据库连接失败')
        return
    }
    console.log('数据库连接成功')
})

//用原生promise代替mongoose自带的promise
mongoose.Promise=global.Promise

const Schema=mongoose.Schema

module.exports={
    db,Schema
}