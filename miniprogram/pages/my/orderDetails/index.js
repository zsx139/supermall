// pages/my/orderDetails/index.js
const util = require('../../../util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '全部订单', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    order_id:'',
    orderData:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id:options.orderid
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
    this.orderItem()
  },
  orderItem(){
    util.post({
        url:'index.php/Smallapp/Index/getOrderDetail',
        header:{
          'whoareyou':1,
          'VPToken':getApp().getUserToken(),
          'content-type':'application/x-www-form-urlencoded' //将请求参数转为form-data格式 
        },
        data:{
          order_id: this.data.order_id,
        },
        success:res=>{
          console.log(res)
          this.setData({
            orderData:res.data.data
          })
        }
    })
  },
  copy(){
    var that = this
    wx.setClipboardData({
      data:that.data.orderData.order_sn,
      success: function (res) {
        console.log(res)
        wx.vibrateShort()
        wx.showToast({
          title: '复制成功',
        });
      }
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