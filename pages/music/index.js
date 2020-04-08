// pages/index.js
const app = getApp()
var setting = require("../../utils/setting.js")
var common = require("../../utils/common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio: {},
    playlists: [],
    isLogin: false
  },

  login: function() {
    let that = this;
    common.login(function() {
      that.setData({
        isLogin: app.globalData.isLogin
      })
    });
  },
  createList() {
    wx.navigateTo({
      url: '/pages/music/listByCustom/create',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getSingers()
    this.getPlaylists()

  },

  getSingers() {
    let that = this;
    // 获取歌手列表
    wx.request({
      url: setting.basePath + '/assert/list',
      success(res) {
        console.log(res);
        if (res.data.code == 200) {
          let srcData = res.data.data.audio;
          let aimData = []
          // console.log(srcData);
          for (let i = 0; i < srcData.length; i++) {
            let trans = "";
            if (setting.trans.hasOwnProperty(srcData[i])) {
              trans = setting.trans[srcData[i]]
            } else {
              trans = srcData[i]
            }
            aimData.push({
              "srcTag": srcData[i],
              "trans": trans
            })
          }
          that.setData({
            audio: aimData
          })
        }
      }
    })
  },
  getPlaylists() {
    let that = this;
    // 获取歌单列表
    wx.getStorage({
      key: 'sessionId',
      success: res => {
        wx.request({
          url: setting.basePath + "/miniprogram/playlists",
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            sessionId: res.data
          },
          success(res) {
            console.log(res.data);
            if (res.data.code == 200){
              let lists = []
              let myPlaylist = {}
              for (let key in res.data.data){
                let desc = JSON.parse(res.data.data[key])["Desc"];
                let songs = JSON.parse(res.data.data[key])['Songs']
                lists.push({
                  "id":key,
                  "name":key,
                  "desc": desc,
                  "num": songs.length
                })
                myPlaylist[key] = {
                  "name": key,
                  "desc": desc,
                  songs:songs
                }
              }
              that.setData({
                playlists:lists
              });
              // 保存到本地
              wx.setStorage({
                key: "myPlaylist",
                data: myPlaylist
              })
            }
            
          }
        })
      },
      fail() {
        wx.showToast({
            title: '请登录',
            icon: "none"
          }),
          that.login()
      }
    })
  },

  goto(e) {
    let tag = e.currentTarget.dataset['tag'];
    wx.navigateTo({
      url: 'listBySinger/index?tag=' + tag,
    })
  },
  gotoPlaylist(e){
    let id = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: 'listByCustom/detail?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.setData({
      isLogin: app.globalData.isLogin,
    });
    console.log()
    if (getCurrentPages()[0].__displayReporter.showReferpagepath == "pages/music/listByCustom/create.html") {

    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getPlaylists();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})