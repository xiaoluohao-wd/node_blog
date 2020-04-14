//用于加密的模块
const crypto=require('crypto')
module.exports=function(pwd,key='xiaoluohao'){
    const hmac=crypto.createHmac('sha256',key)
    hmac.update(pwd)
    const pwdHmac=hmac.digest("hex")
    return pwdHmac
}