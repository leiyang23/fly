// pages/index.js
const app = getApp()
var setting = require("../../utils/setting.js")
var common = require("../../utils/common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    init: false,
    combo: null,
    textTimer:null,
    text: "",
    tips:[
      "如果要飞得高, 就该把地平线忘掉",
      "想假如, 是无力的寂寞",
      "曾梦想仗剑走天涯, 看一看世界的繁华",
      "最怕此生已经决心自己过没有你, 却又突然听到你的消息",
      "不知道，不明了，不想要，为什么我的心明明是想靠近，却孤单到黎明",
      "逆风的方向更适合飞翔，我不怕千万人阻挡，只怕自己投降",
      "得不到的永远在骚动，被偏爱的都有恃无恐",
      "如果当时我们能不那么倔强，现在也不那么遗憾",
      "我们的爱情，是你路过的风景",
      "我遇见你，是最美丽的意外",
      "我怀念的是无话不说，我怀念的是一起做梦，我怀念的是争吵以后还是想要爱你的冲动，我怀念的是你很激动求我原谅抱的我都痛。"

    ],
    audio: {},
    playlists: [],
  },

  // 连击屏幕进行解锁
  unlock() {
    let that = this;
    if (that.data.combo) {
      that.setData({
        combo: that.data.combo + 1
      });
      wx.showToast({
        title: '连击 ' + that.data.combo + " 次",
        icon: "none",
        duration: 200
      })
    } else {
      setTimeout(function() {
        console.log("timeout")      
        if (that.data.combo > 10) {
          that.setData({
            init: true,
          });
          clearInterval(that.data.textTimer);
        };

        that.setData({
          combo: null,
        });
      }, 3000);
      that.setData({
        combo: 1
      })
    }
  },

  // 进入 创建歌单页面
  createList() {
    wx.navigateTo({
      url: '/pages/music/listByCustom/create',
    })
  },

  // 进入网易歌单页面
  gotoNetease() {
    wx.navigateTo({
      url: '/pages/music/netease/index',
    })
  },

  // 删除歌单
  showModal(e) {
    let that = this;
    let playlistId = e.currentTarget.dataset['id'];
    wx.showModal({
      title: '提示',
      content: '确认删除歌单？',
      success(res) {
        if (res.confirm) {
          that.delPlaylist(playlistId)
        }
      }
    })

  },
  delPlaylist(playlistId) {
    let that = this;
    if (app.globalData.sessionId) {
      let sessionId = app.globalData.sessionId
    } else {
      wx.showToast({
        title: '未登录',
        icon: "none"
      })
      return
    }

    wx.request({
      url: setting.basePath + '/miniprogram/playlist/delete',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        sessionId: sessionId,
        playlistId: playlistId
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除歌单',
          })
          that.getPlaylists()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      text: that.data.tips[Math.floor(Math.random() * that.data.tips.length)]
    });
    that.data.textTimer = setInterval(function(){
      that.setData({
        text:that.data.tips[Math.floor(Math.random()*that.data.tips.length)]
      })
    }, 12000)

    this.getSingers()
    this.getPlaylists();
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
    if (app.globalData.sessionId) {
      let sessionId = app.globalData.sessionId;
      wx.request({
        url: setting.basePath + "/miniprogram/playlists",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          sessionId: sessionId
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 200) {
            let lists = []
            let myPlaylist = {}
            for (let key in res.data.data) {
              let desc = JSON.parse(res.data.data[key])["Desc"];
              let songs = JSON.parse(res.data.data[key])['Songs']
              lists.push({
                "id": key,
                "name": key,
                "desc": desc,
                "num": songs.length
              })
              myPlaylist[key] = {
                "name": key,
                "desc": desc,
                songs: songs
              }
            }
            that.setData({
              playlists: lists
            });
            // 保存到本地
            wx.setStorage({
              key: "myPlaylist",
              data: myPlaylist
            })
          }else{
            if (res.data.msg =="登录已过期"){
              wx.removeStorage({
                key: 'sessionId',
                success: function(res) {},
              });
              common.login()
            }
          };

        }
      })
    } else {
      wx.showToast({
        title: '无法获取自定义歌单',
        icon: "none"
      })
      console.log("未登录，无法获取自定义歌单")

    }

  },

  goto(e) {
    let tag = e.currentTarget.dataset['tag'];
    wx.navigateTo({
      url: 'listBySinger/index?tag=' + tag,
    })
  },
  gotoPlaylist(e) {
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
    // let that = this;
    // that.getPlaylists()
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
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 500)
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