//index.js
//获取应用实例
const app = getApp()
var setting = require("../../../utils/setting.js")

Page({
  data: {
    songs:[],
    songIndex:-1,
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
