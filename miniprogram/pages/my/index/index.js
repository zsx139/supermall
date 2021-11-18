// miniprogram/pages/my/index/index.js
const util = require('../../../util.js')
const DownloadSaveFile = require('../../../downloadSaveFile.js')
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
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    clientHeight: getApp().globalData.clientHeight-45-(getApp().globalData.height * 2 + 20), // 视口高度 这里-80是减去底部tabBar的高度-40是底部tabBar的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的宽度
    winH:0,
    userImg:'',// 用户头像
    userName:'',
    keFuCode:true, // 客服弹出
    qrcode:true, // 邀请码弹出
    getContactQr:[],
    myCollect:0, // 收藏个数
    userText:[], // 用户信息
    userCentre:[], // 用户中心
    discounts:0,// 优惠劵个数
    DaiFaHuo:[],
    YiFaHuo:[],
    YiQuXiao:[],
    allorder:0,
  },

  /* myCollect
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   getContactQr:getApp().getcallService()
    // })
  },
  /** orderCount
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSystemInfo({
      success: (res, rect) => {
        this.setData({
          winH: res.windowHeight
        })
      }
    })
    this.setData({
      userImg:wx.getStorageSync('userImg'),
      userName:wx.getStorageSync('userName')
    })
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      var list = this.getTabBar().data.list1
      list[4].iconPath='../images/tabBar/toMy2.png'
      list[4].show=true
      this.getTabBar().setData({
        list1:list
      })
    }

    // // 判断是否登录
    // util.login()
    this.userZongXing()
    this.collectSee()
    this.userXinXi()
    this.userQrcode()
    // this.order()
    this.discountsSee()
    this.getContactQr()
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

  /* 跳转 */
  _navto(e){
    getApp()._navto(e)
  },
  // 复制
  textPaste(){
    var that = this
    wx.setClipboardData({
      data: this.data.getContactQr.data.weixin_number,
      success: function (res) {
        wx.getClipboardData({
          // 这个api是把拿到的数据放到电脑系统中的
          success: function(res) {
            console.log(res.data) // data
            that.setData({
              keFuCode:true, // 客服弹出
              qrcode:true, // 邀请码弹出
            })
          }
        })
      }
    })
  },
  // 下载
  Down(e){
    var img = e.currentTarget.dataset['image'].replace(/^http:\/\//i,'https://')
    DownloadSaveFile.downloadFile('image',img); //video或image
    // this.toKeFu()
    this.setData({
      keFuCode:true, // 客服弹出
      qrcode:true, // 邀请码弹出
    })
  },
  // 客服弹出
  toKeFu(){
    var key = this.data.keFuCode==true?false:true
    this.setData({
      keFuCode:key
    })
  },
  // 邀请弹出
  qrcodes(){
    var key = this.data.qrcode==true?false:true
    this.setData({
      qrcode:key
    })
  },
  // 邀请码
  getContactQr(){
    util.post({
      url:'index.php/Smallapp/Index/getContactQr',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
       },
      success:res=>{
        console.log(res)
        this.setData({
          getContactQr:res.data
        })
      }
    })
  },
  collectSee(){ // 查看收藏
    util.post({
      url:'index.php/Smallapp/Index/myCollect',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        var shu = 0
        if(res.data.data.goods == null){
          shu = 0
        }else{
          shu = res.data.data.goods.length
        }
        this.setData({
          myCollect:shu
        })
        console.log(this.data.myCollect)
      }
    })
  },
  userXinXi(){
    util.post({
      url:'index.php/Smallapp/Index/myInfo',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        this.setData({
          userText:res.data
        })
        console.log(this.data.userText)
      }
    })
  },

  userZongXing(){
    util.post({
      url:'index.php/Smallapp/Index/ucenter',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        this.setData({
          userCentre:res.data,
          allorder:res.data.data.dfh_total
        })
        wx.setStorage({
          data: res.data.data.dfh_total,
          key: 'allorder',
        })
        console.log(res)
        this.order(res.data.data.dfh_total)
      }
    })
  },
  userQrcode(){
    util.post({
      url:'index.php/Smallapp/Index/myQrcode',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        this.setData({
          qrcodeImg:res.data.data.qr_image
        })
      }
    })
  },
  order(allorder){
    console.log(allorder)
    util.post({
      url:'index.php/Smallapp/Index/hisOrder?p=1&size='+40,
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res.data.data.orderList)
        if(res.data.data.orderList != null){
          this.setData({
            orderCount:res.data.data.orderList
          })
          this.data.DaiFaHuo = []
          this.data.YiFaHuo = []
          this.data.YiQuXiao = []
          this.data.orderCount.forEach((item)=>{
            if(item.ship_status == '2'){
              this.data.DaiFaHuo.push(item)
            }
            if(item.ship_status == '1'){
              this.data.YiFaHuo.push(item)
            }
            if(item.ship_status == '0'){
              this.data.YiQuXiao.push(item)
            }
            this.setData({
              DaiFaHuo:this.data.DaiFaHuo,
              YiFaHuo:this.data.YiFaHuo,
              YiQuXiao:this.data.YiQuXiao,
            })
          })
        }
        


      }
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
        var discounts
        if(res.data.data.enabled != '0'){
          discounts = res.data.data.enabled.length
        }else{
          discounts=0
        }
        this.setData({
          discounts:discounts
        })
      }
    })
  },
})