var app = getApp()
var setting = require("./setting.js")

var login=function(){
  wx.login({
    success(res) {
      if (res.code) {
        //发起网络请求
        wx.request({
          url: setting.basePath + "/miniprogram/login",
          data: {
            code: res.code
          },
          success(res) {
            if (res.data.code == 200) {
              wx.setStorage({
                key: "sessionId",
                data: res.data.sessionId
              });
              wx.showToast({
                title: '登录成功',
                duration: 2000
              });
            }
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}


module.exports.login = login