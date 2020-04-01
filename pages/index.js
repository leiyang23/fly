// pages/index.js
var setting = require("../utils/setting.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: setting.basePath + '/assert/list',
      success(res){
        console.log(res);
        if (res.data.code == 200){
          let srcData = res.data.data.audio;
          let aimData = []
          console.log(srcData);
          for (let i = 0; i < srcData.length;i++){
            let trans = "";
            if (setting.trans.hasOwnProperty(srcData[i])){
              trans = setting.trans[srcData[i]]
            }else{
              trans = srcData[i]
            }
            aimData.push({
              "srcTag": srcData[i],
              "trans":trans
            })
          }
          that.setData({
            audio:aimData
          })
          
        }
  
        
      }
    })

  },

  goto(e){
    let tag = e.currentTarget.dataset['tag'];
    wx.navigateTo({
      url: 'index/index?tag=' + tag,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})