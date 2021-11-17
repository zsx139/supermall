// miniprogram/pages/indexs/callService/index.js
const util = require('../../../util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '联系客服', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    tabNavLeft:0, // tabNav的left值
    tabwth:0, // 每个tab选项的宽度
    tabIndex:0,
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    serviceList:['微信客服1','微信客服2']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
			success: function (res) {
				let clientWidth = res.windowWidth;	// 获取可使用窗口宽度
        var tabwth = clientWidth/that.data.serviceList.length // 算出每个tab选项的宽度
        that.setData({
          tabNavLeft: tabwth/2-7,
          tabwth:tabwth
        })
      }
		});
  },
    /* tabnav跳动 */
    tabNav:function(e){
      this.setData({
        tabNavLeft: e.currentTarget.offsetLeft+this.data.tabwth/2-7,
        tabIndex:e.currentTarget.dataset['index']
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
    console.log(getApp().globalData.getContactQr)
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