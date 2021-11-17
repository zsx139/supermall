// miniprogram/pages/my/discounts/index.js
const util = require('../../../util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的优惠劵', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    width:getApp().globalData.windowWidth, // 视口宽度
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    tabList:['待使用','使用过','已过期'],
    tabNavLeft:0, // tabNav的left值
    tabwth:0, // 每个tab选项的宽度
    tabIndex:0, // 
    discountsData:{}, // 优惠劵信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
			success: function (res) {
				let clientWidth = res.windowWidth;	// 获取可使用窗口宽度
        var tabwth = clientWidth/that.data.tabList.length // 算出每个tab选项的宽度
        that.setData({
          tabNavLeft: (tabwth/2-7)+(tabwth*that.data.tabIndex),
          tabwth:tabwth
        })
      }
		}); 
  },
  onShareAppMessage: function () {//分享好友
    return {
        title: '',
        imageUrl:'',
        path: '',
    }
  },
  onShareTimeline: function () {//分享朋友圈
      return {
          title: '',
          imageUrl:'',
          query: '',
      }
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
    this.discountsSee()
    // var discountsData = this.data.discountsData
    // console.log(discountsData)
    // discountsData.enabled = Number(this.data.discountsData.enabled)
    // discountsData.timeout = Number(this.data.discountsData.timeout)
    // discountsData.used = Number(this.data.discountsData.used)
    // this.setData({
    //   discountsData:discountsData
    // })
  },
  swpInfo(e){
    var biLi = this.data.width*0.9/e.detail.width
    this.setData({
      swpHeight:e.detail.height*biLi,
    })
  },
   /* 头部切换的小红标的tabnav跳动 */
   tabNav:function(e){
    this.setData({tabIndex:e.currentTarget.dataset['index']})
    this.setData({tabNavLeft: (this.data.tabwth/2-7)+(this.data.tabwth*this.data.tabIndex)})
  },
  // 滑动swiper
  activeSw(e) {
    var index = e.detail.current
    this.setData({
      tabIndex: index,
      tabNavLeft: (this.data.tabwth/2-7)+(this.data.tabwth*index)
    })
  },
  discountsSee(){
    util.post({
      url:'index.php/Smallapp/Index/myCoupon',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded', //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        // wx.setStorageSync("history", res.cookies)
        var discounts = {}
        if(res.data.data.enabled != '0'){
          discounts.enabled = res.data.data.enabled
        }else{
          discounts.enabled = null
        }
        if(res.data.data.timeout != '0'){
          discounts.timeout = res.data.data.timeout
        }else{
          discounts.timeout = null
        }
        if(res.data.data.used!='0'){
          discounts.used = res.data.data.used
        }else{
          discounts.used = null
        }
        this.setData({
          discountsData:discounts
        })
      }
    })
  },
})