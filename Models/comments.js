const {db}=require('../Schema/config')
const CommentSchema=require('../Schema/commentSchema')
const Comments=db.model('comments',CommentSchema)
module.exports=Comments