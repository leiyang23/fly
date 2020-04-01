//index.js
//获取应用实例
const app = getApp()

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

  onLoad: function () {
    let that = this;
    wx.request({
      url: 'https://assert.freaks.group/api/assert?category=audio&tag=zhoujielun',
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
  }
})
