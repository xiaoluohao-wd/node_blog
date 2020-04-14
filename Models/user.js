const {db}=require('../Schema/config')
const UserSchema=require('../Schema/userSchema')
//通过db创建user集合 指定文档结构为UserSchema
const User=db.model('users',UserSchema)
module.exports=User