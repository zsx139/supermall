// miniprogram/pages/my/allOrder/index.js
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
    height: 0 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:0, // 内容的高度
    tabList:['全部 ','待发货','已发货','已取消'],
    tabNavLeft:0, // tabNav的left值
    tabwth:0, // 每个tab选项的宽度
    tabIndex:0, // swp的index
    orderList:[], // 订单
    DaiFaHuo:[], // 待发货
    YiFaHuo:[], // 已发货
    YiQuXiao:[], // 已取消 
    currentPage:1, // all页数
    DaiFaCurrentPage:1, // 待发页数
    url:'',
    imageSize:{},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    console.log(wx.getStorageSync('allorder'))
    var index = options.index
    var that = this
    wx.getSystemInfo({
			success: function (res) {
				let clientWidth = res.windowWidth;	// 获取可使用窗口宽度
        var tabwth = clientWidth/that.data.tabList.length // 算出每个tab选项的宽度
        console.log(tabwth)
        that.setData({
          tabNavLeft: (tabwth/2-7)+(tabwth*that.data.tabIndex),
          tabwth:tabwth,
          orderIndex:index
        })
      }
    });
    var index = this.data.orderIndex
    if(index==0){
      // this.data.url
      this.setData({
        url:''
      })
    }else if(index == 1){
      this.setData({
        url:'&status=1&ship_status=0'
      })
    }else if(index == 2){
      this.setData({
        url:'&status=1&ship_status=1'
      })
    }else if(index == 3){
      this.setData({
        url:'&status=2'
      })
    }
    this.setData({
      tabIndex:this.data.orderIndex,
      currentPage:1,
      orderList:[],
    })
    this.order(this.data.currentPage)
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
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        // this.globalData.height = res.statusBarHeight;  // tabBar窗口高度
        // this.globalData.clientHeight = res.windowHeight;	// 获取可使用窗口高度
        // this.globalData.contentHeight = res.windowHeight - (res.statusBarHeight * 2 + 20)  // 制定content的高度
        // this.globalData.windowWidth = res.windowWidth	// 获取可使用窗口宽度
        that.setData({
          height:res.statusBarHeight* 2 + 20,
          clientHeight:res.windowHeight-45-(res.statusBarHeight * 2 + 20),
          contentHeight:res.windowHeight - (res.statusBarHeight * 2 + 20)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.order(1)
    // this.DaiFaOrder(1)
    
  },
     /* 头部切换的小红标的tabnav跳动 */
     tabNav:function(e){
      this.setData({tabIndex:e.currentTarget.dataset['index']})
      this.setData({tabNavLeft: (this.data.tabwth/2-7)+(this.data.tabwth*this.data.tabIndex)})
    },
    // 滑动swiper
    activeSw(e) {

      var index = e.detail.current
      if(index==0){
        // this.data.url
        this.setData({
          url:''
        })
      }else if(index == 1){
        this.setData({
          url:'&status=1&ship_status=0'
        })
      }else if(index == 2){
        this.setData({
          url:'&status=1&ship_status=1'
        })
      }else if(index == 3){
        this.setData({
          url:'&status=2'
        })
      }
      this.setData({
        tabIndex: index,
        tabNavLeft: (this.data.tabwth/2-7)+(this.data.tabwth*index),
        currentPage:1,
        orderList:[]
      })
      console.log(this.data.tabIndex)
      this.order(this.data.currentPage)
    },
      /* 跳转 */
  _navto(e){
    getApp()._navto(e)
  },
  order(currentPages){
    console.log(this.data.url,currentPages)
    util.post({
      url:'index.php/Smallapp/Index/hisOrder?p='+currentPages+this.data.url,
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        var list = res.data.data.orderList
        list.forEach((item)=>{
          this.data.orderList.push(item)
          this.setData({
            orderList:this.data.orderList,
            currentPage:this.data.currentPage,
            totalPages:res.data.data.totalPages
          })
        })
        console.log(this.data.orderList)
      }
    })
  },

  onReachBottom(){
    this.data.currentPage+=1
    this.setData({
      currentPage:this.data.currentPage
    })
    console.log(this.data.currentPage)
    if(this.data.currentPage < this.data.totalPages){
      this.order(this.data.currentPage)
    }
  },
  imgInfo(e){
    var width = e.detail.width,    //获取图片真实宽度
         height = e.detail.height,
         ratio = width/height;    //图片的真实宽高比例
     var viewWidth = 100,           //设置图片显示宽度，左右留有16rpx边距
         viewHeight = 100/ratio;    //计算的高度值
      var image = this.data.imageSize; 
          //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
          image[e.target.dataset.index]={
            width:viewWidth,
            height:viewHeight
          }
      this.setData({
        imageSize:image
      })
  },
  copySn(e){
      var that = this
      wx.setClipboardData({
        data: e.target.dataset.ordersn,
        success: function (res){
          console.log(res)
          util.showMessage('复制成功')
          wx.vibrateShort()
          wx.getClipboardData({
            // 这个api是把拿到的数据放到电脑系统中的
            success: function(res) {
              console.log(res.data) // data
            }
          })
        }
      })
  },
  // DaiFaOrder(currentPages){
  //   util.post({
  //     url:'index.php/Smallapp/Index/hisOrder?p='+currentPages+'&status=1&ship_status=0',
  //     header:{
  //       'whoareyou':1,
  //       'VPToken':getApp().getUserToken(),
  //       'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
  //     },
  //     success:res=>{
  //       console.log(res)
  //       var list = res.data.data.orderList
  //       list.forEach((item)=>{
  //         this.data.DaiFaHuo.push(item)
  //         this.setData({
  //           DaiFaHuo:this.data.DaiFaHuo,
  //           DaiFaTotalPages:res.data.data.totalPages
  //         })
  //       })
  //       console.log(this.data.DaiFaHuo)
  //     }
  //   })
  // },

  // onReachBottomDaiFa(){
  //   this.data.DaiFaCurrentPage+=1
  //   this.setData({
  //     DaiFaCurrentPage:this.data.DaiFaCurrentPage
  //   })
  //   console.log(this.data.DaiFaCurrentPage)
  //   if(this.data.DaiFaCurrentPage < this.data.DaiFaTotalPages){
  //     this.DaiFaOrder(this.data.DaiFaCurrentPage)
  //   }
  // },





})