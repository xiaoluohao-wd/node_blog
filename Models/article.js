const {db}=require('../Schema/config')
const ArticleSchema=require('../Schema/articleSchema')
const Article=db.model('articles',ArticleSchema)
module.exports=Article