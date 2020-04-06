// pages/index.js
const app = getApp()
var setting = require("../../utils/setting.js")
var common = require("../../utils/common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio:{},
    playList:[],
    isLogin: false
  },

  login: function () {
    let that = this;
    common.login(function(){
      that.setData({
        isLogin: app.globalData.isLogin
      })
    });
  }, 
  createList(){
    wx.navigateTo({
      url: '/pages/music/listByCustom/create',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取歌手列表
    wx.request({
      url: setting.basePath + '/assert/list',
      success(res){
        console.log(res);
        if (res.data.code == 200){
          let srcData = res.data.data.audio;
          let aimData = []
          // console.log(srcData);
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

    // 获取歌单列表
    wx.getStorage({
      key: 'sessionId',
      success: res => {
        wx.request({
          url: setting.basePath + "/miniprogram/playlists",
          method: "POST",
          data: {
            sessionId: res.data
          }
        })
      },
      fail(){
        wx.showToast({
          title: '请登录',
          icon:"none"
        }),
        that.login()
      }
    })   

  },

  goto(e){
    let tag = e.currentTarget.dataset['tag'];
    wx.navigateTo({
      url: 'listBySinger/index?tag=' + tag,
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
    let that = this;
    that.setData({
      isLogin: app.globalData.isLogin,
    })
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