// pages/music/listByCustom/detail.js
var app = getApp()
var setting = require("../../../utils/setting.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    desc: "",
    songs: [],
    songIndex: -1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id;
    console.log(id)
    wx.getStorage({
      key: 'myPlaylist',
      success(res) {
        console.log(res.data);
        wx.setNavigationBarTitle({
          title: res.data[id].name,
        })
        that.setData({
          name: res.data[id].name,
          desc: res.data[id].desc,
          songs: res.data[id].songs
        })
      }
    })
  },
  showModal(e){
    let that = this;
    let songName = e.currentTarget.dataset['title'];
    let index = e.currentTarget.dataset['index']

    wx.showModal({
      title: '提示',
      content: '确认从歌单中删除？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.delSong(songName, index)

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delSong(songName, index){
    let that = this;

    let playlistId = this.data.name;    

    if (app.globalData.sessionId){
      let sessionId = app.globalData.sessionId;
      wx.request({
        url: setting.basePath + '/miniprogram/playlist/delSong',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          sessionId: sessionId,
          playlistId: playlistId,
          songName: songName,
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '已删除',
            });

            that.data.songs.splice(index, 1)
            that.setData({
              songs: that.data.songs
            })
          }
        },
        fail(err) {
          console.error(err);
          wx.showToast({
            title: '网络错误',
            icon: "none"
          })
        }
      })
    }else{
      wx.showToast({
        title: '未登录',
        icon: "none"
      })
      return
    }


    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.getBackgroundAudioManager();

    this.audioCtx.onEnded(this.next)
  },
  play: function (e) {
    console.log(e)

    this.audioCtx.title = e.currentTarget.dataset['title']
    this.audioCtx.src = e.currentTarget.dataset['url'];
    this.audioCtx.play();
    this.data.songIndex = e.currentTarget.dataset['index'];
  },
  next: function () {
    if (this.data.songIndex < this.data.songs.length-1) {
      this.data.songIndex = this.data.songIndex + 1
    } else {
      this.data.songIndex = 0
    }
    this.audioCtx.title = this.data.songs[this.data.songIndex].name;
    this.audioCtx.src = this.data.songs[this.data.songIndex].url;
    this.audioCtx.play();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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