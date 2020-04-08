// pages/music/listByCustom/detail.js
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
    if (this.data.songIndex < this.data.songs.length) {
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