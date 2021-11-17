// miniprogram/pages/shoppingCart/index/index.js
const util = require('../../../util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 2, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'VERY PEFECT', //导航栏 中间的标题
      toCar:true,
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight-52-45, // 内容的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的宽度
    cartList:null, // 模拟购物车里的商品
    allCheckbox:false, // 全选
    scriptwriterBtn:false, // 编剧按钮的变化
    addItem:[], // 已选的商品
    recommend:[], // 推荐
    cartTotal:[],
    userCentre:[],
    imageSize:{},
    imageSizeT:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onReady: function (){
    // this.carIndex = this.selectComponent('#carIndex')
    this.selectComponent('#carIndex').getCar(true)
    this.selectComponent('#carIndex').getRecommend()
    this.selectComponent('#carIndex').userZongXing()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      var list = this.getTabBar().data.list1
      list[3].iconPath='../images/tabBar/toCar.png'
      list[3].show=true
      this.getTabBar().setData({
        list1:list
      })
    }
  
  },
 
  onReachBottom: function () {
  },
})