// miniprogram/pages/classify/classify_more/index.js
const util = require('../../../util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 组件所需的参数
      navbarData: {
        showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
        title:'女士箱包', //导航栏 中间的标题
      },
      height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
      contentHeight:getApp().globalData.contentHeight, // 内容的高度
      goodsData:[],
      dataIndex:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.classIndex)

    this.setData({
      dataIndex:options.classIndex.split("-")
    })
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
  /* 跳转 */
  _navto(e){
    getApp()._navto(e)
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
    this.getClassify()
  },
  // api
  getClassify(){
    var that = this
    util.post({
      url:'index.php/Smallapp/Index/category',
      success:res=>{
        var dataIndex = that.data.dataIndex
        that.setData({
          goodsData:res.data.data[dataIndex[0]].sub[dataIndex[1]].data,
        })
      }
    })
  }
})