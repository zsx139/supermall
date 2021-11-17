// miniprogram/pages/my/siteAdmin/index.js
const util = require('../../../util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '收货地址管理', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    // contentHeight:getApp().globalData.contentHeight, // 内容的高度 -41是底部按钮的高度
    contentHeight:getApp().globalData.contentHeight, // 内容的高度 -41是底部按钮的高度
    clientHeight: getApp().globalData.clientHeight-20, // 视口高度 这里-80是减去底部tabBar的高度-40是底部tabBar的高度
    userText:[],
    addressList:[],
    select:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.select)
    if(options.select){
      this.setData({
        select:true
      })
    }
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
  onShow: function(){
    this.getSite()
  },
  /* 跳转 */
  _navto(e){
    getApp()._navto(e)
  },
  userXinXi: function(){
    var that = this
    new Promise(function (resolve, reject) {
      util.post({
        url:'index.php/Smallapp/Index/myInfo',
        header:{
          'whoareyou':1,
          'VPToken':getApp().getUserToken(),
          'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
        },
        success:res=>{
          that.setData({
            userText:res.data
          })
          // console.log(this.data.userText)
        }
      })
    });
  },
  getSite(){  
    var that = this
      util.post({
        url:'index.php/Smallapp/Index/myInfo',
        header:{
          'whoareyou':1,
          'VPToken':getApp().getUserToken(),
          'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
        },
        success:res=>{
          that.setData({
            userText:res.data
          })
          console.log(this.data.userText)  
          util.post({
            url:'index.php/Smallapp/Index/addressList',
            header:{
              'whoareyou':1,
              'VPToken':getApp().getUserToken(),
              'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
            },
            data:{
              user_id:this.data.userText.data.ucenter.user_id
            },
            success:res=>{
              console.log(res)
              this.setData({
                addressList:res.data.data
              })
            }
          })
        }
      })
  },
  toBack(e){
    // console.log(e.currentTarget.dataset)
    if(this.data.select==true){
      wx.setStorageSync('siteid', e.currentTarget.dataset['siteid'])
      wx.navigateBack()
    }
  },
})