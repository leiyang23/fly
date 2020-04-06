// pages/music/listByCustom/detail.js
var setting = require("../../../utils/setting.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    desc:""

  },
  nameInput(e){
    this.setData({
      name:e.detail.value
    })
  },
  descInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  submit(){
    let that = this;
    wx.request({
      url: setting.basePath + '/miniprogram/playlist/create',
      method:"POST",
      data:{
        name:that.data.name,
        desc:that.data.desc
      },
      success(res){
        console.log(res.data)
        console.log("创建成功")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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