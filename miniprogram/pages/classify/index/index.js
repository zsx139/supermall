// miniprogram/pages/classify/index/index.js
const util = require('../../../util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'VERY PEFECT', //导航栏 中间的标题
      scrollTop:50
    },
    height: getApp().globalData.height * 2 + 10 ,  // 此页面 页面内容距最顶部的距离
    clientHeight: getApp().globalData.clientHeight-45-(getApp().globalData.height * 2), // 视口高度 这里-80是减去底部tabBar的高度-40是底部tabBar的高度
    leftLIst:[], // 左边的tablist 单独提取出来
    rightList:[], // 右边的list 单独提取出来
    tabIndex:0, // 左边的tablist 选中
    tabNavTop:77, // tabNav选中的top值
    classify:[], // 分类
    tabIndexSw:0, //swiper
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
    /* tabnav跳动 */
   tabNav:function(e){
      this.setData({
        tabNavTop: e.currentTarget.offsetTop+77, // 这里加的是一个 leftList_item的高度/2减去tabnav高度的/2
        tabIndex:e.currentTarget.dataset['index'],
        rightList:this.data.classify[e.currentTarget.dataset['index']].sub // 右边的list 单独提取出来
      })
      wx.vibrateShort()
    },
    /* 跳转 */
    _navto(e){
      getApp()._navto(e)
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (){
      var that = this
      wx.getSystemInfo({
        success: (res) => {
          // this.globalData.height = res.statusBarHeight;  // tabBar窗口高度
          // this.globalData.clientHeight = res.windowHeight;	// 获取可使用窗口高度
          // this.globalData.contentHeight = res.windowHeight - (res.statusBarHeight * 2 + 20)  // 制定content的高度
          // this.globalData.windowWidth = res.windowWidth	// 获取可使用窗口宽度
          that.setData({
            clientHeight:res.windowHeight-189
          })
        }
      })
      console.log(this.data.clientHeight)
    this.getClassify()
    this.setData({
      tabIndex:0,
      tabNavTop:77
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      var list = this.getTabBar().data.list1
      list[1].iconPath='../images/tabBar/toClassify2.png'
      list[1].show=true
      this.getTabBar().setData({
        list1:list
      })
    }
  },
  // api
  getClassify(){
    var that = this
    util.post({
      url:'index.php/Smallapp/Index/category',
      success:res=>{
        // 提取leftLIst
        var lelist = []
        res.data.data.forEach((item,index)=>{
          lelist.push(item.name)
        })
        this.setData({
          classify:res.data.data,
          leftLIst:lelist,
          rightList:res.data.data[0].sub
        })
        console.log(res.data.data)
      }
    })
  },
// 滑动swiper
  activeSw(e) {
    var index = e.detail.current
    this.setData({
      tabIndex: index,
    })
    wx.vibrateShort()
    // wx.vibrateLong()
  }
})