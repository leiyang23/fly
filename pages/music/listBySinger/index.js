//index.js
//获取应用实例
const app = getApp()
var setting = require("../../../utils/setting.js")

Page({
  data: {
    songs:[],
    songIndex:-1,

    myPlaylistIds:[],
    showModal:false,
    addSongInfo:{
      songName:"",
      songUrl:"",
      playlistId:""
    },
  },
  onReady(e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.getBackgroundAudioManager();
    
    this.audioCtx.onEnded(this.next)
  },

  onLoad: function (params) {
    let that = this;
    let tag = params.tag
    wx.request({
      url: setting.basePath + '/assert?category=audio&tag=' + tag,
      success(res){
        console.log(res)
        let basePath = res.data.urlBasePath;
        let data = res.data.data;
        let songs = []
        for (let i=0;i<data.length;i++){
          songs.push({
            "name":data[i].replace(".mp3",""),
            "url": basePath + 　"/" + data[i]
          })
        }
        that.setData({
          songs:songs
        });


        let trans = "";
        if (setting.trans.hasOwnProperty(tag)) {
          trans = setting.trans[tag]
        } else {
          trans = tag
        }
        wx.setNavigationBarTitle({
          title: trans
        })
        
      }
    })

  },
  addPlaylistModal(e){
    let songName = e.currentTarget.dataset['title'];
    let songUrl = e.currentTarget.dataset['url'];
    let myPlaylistIds = [];

    try {
      var myPlaylist = wx.getStorageSync('myPlaylist')
      if (myPlaylist) {
        for (let i in myPlaylist){
          myPlaylistIds.push(i)
        };
        this.setData({
          showModal: true,
          myPlaylistIds: myPlaylistIds,
          addSongInfo:{"songName":songName,"songUrl":songUrl}
        })
        
      }
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '请登录',
        icon:"none"
      })
    }

  },
  addSong(e){
    let that = this;
    that.setData({
      showModal:false
    })
    let playlistId = e.currentTarget.dataset['id'];

    try {
      var sessionId = wx.getStorageSync('sessionId')
      if (sessionId) {}
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '请登录',
        icon: "none"
      })
      return
    }

    wx.request({
      url: setting.basePath + '/miniprogram/playlist/addSong',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        sessionId: sessionId,
        playlistId: playlistId,
        songName:that.data.addSongInfo.songName,
        songUrl: that.data.addSongInfo.songUrl
      },
      success(res){
        if (res.data.code == 200){
          wx.showToast({
            title: '添加成功',
          });
        }else{
          wx.showToast({
            title: '添加失败',
            icon:"none"
          });
        }
      },
      fail(err){
        console.error(err)
      }
      
    })
  },


  play:function(e){
    console.log(e)

    this.audioCtx.title = e.currentTarget.dataset['title']
    this.audioCtx.src = e.currentTarget.dataset['url'];
    this.audioCtx.play();
    this.data.songIndex = e.currentTarget.dataset['index'];
  },
  next:function(){
    if (this.data.songIndex < this.data.songs.length) {
      this.data.songIndex = this.data.songIndex + 1
    }else{
      this.data.songIndex = 0
    }
    this.audioCtx.title = this.data.songs[this.data.songIndex].name;
    this.audioCtx.src = this.data.songs[this.data.songIndex].url;
    this.audioCtx.play();
  },

   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
