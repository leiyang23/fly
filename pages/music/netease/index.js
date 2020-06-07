// pages/music/netease/index.js
const app = getApp()
var setting = require("../../../utils/setting.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play_status:false,
    text:"下一曲",
    currentTime:0
  },
  randomPlay(){
    let that = this;
    wx.request({
      url: setting.basePath + '/netease/random',
      success(res){
        console.log(res)
        that.audioCtx.title = "随机",
        that.audioCtx.src = res.data;
        that.audioCtx.play();
        that.setData({
          play_status:true,
          text:"下一曲"
        })
      },
      fail(err){
        console.error(err)
      }
    })
  },
  pausePlay(){
    let that = this;
    if(this.data.play_status){
      that.audioCtx.pause();
      this.setData({
        play_status:false,
        text:"暂停",
        currentTime:that.audioCtx.currentTime
      })
    }
  },
  continuePlay(){
    let that = this;
    if(this.data.text == "暂停"){
      this.audioCtx.seek(that.data.currentTime);
      this.audioCtx.play();
      this.setData({
        play_status:true,
        text:"下一曲"
      })
    }
  },

  pause_or_continue(){
    this.data.play_status?this.pausePlay():this.continuePlay()
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
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.getBackgroundAudioManager();

    this.audioCtx.onEnded(this.randomPlay)
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