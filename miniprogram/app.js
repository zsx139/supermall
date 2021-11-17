//app.js
const util = require('util.js')
App({
  onLaunch: function(options){
    var userSource = wx.getStorageSync('userSource')
		userSource = userSource == "" ? {} : userSource
		this.globalData.userSource = userSource
    // console.log(123)

		wx.showShareMenu({
      menus: ['shareAppMessagewx', 'shareTimeline'],
      withShareTicket:true
    });

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight;  // tabBar窗口高度
        console.log(''+this.globalData.height)
        this.globalData.clientHeight = res.windowHeight;	// 获取可使用窗口高度
        this.globalData.contentHeight = res.windowHeight - (res.statusBarHeight * 2 + 20)  // 制定content的高度
        this.globalData.windowWidth = res.windowWidth	// 获取可使用窗口宽度
      }
    })

    // 用户的token
    var userToken = wx.getStorageSync('userToken')
    userToken = userToken == "" ? '' : userToken
    // console.log(userToken)
    this.globalData.userToken = userToken
    // 经理二维码
    util.post({
      url:'index.php/Smallapp/Index/getContactQr',
      header:{
        'whoareyou':1,
        'VPToken':this.globalData.userToken,
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
       },
      success:res=>{
        // console.log(res)
        this.globalData.getContactQr = res.data
        // console.log(this.globalData.getContactQr)
      }
    })

      util.post({
        url:'index.php/Smallapp/Index/myInfo',
        header:{
          'whoareyou':1,
          'VPToken':this.globalData.userToken,
          'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
        },
        success:res=>{
          console.log(res)
          this.globalData.userID = res.data.data.ucenter.user_id
        }
      })
    // 购物车推荐
    var that = this
    util.get({
      url:'index.php/Smallapp/Index/recommend',
      header:{
        'whoareyou':1,
        'VPToken':this.globalData.userToken,
        // 'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res.data.data)
        that.globalData.carRecommendGoods = res.data.data
        console.log(that.globalData.carRecommendGoods)
        // this.setData({
        //   recommend:res.data.data
        // })
      }
    })
  },
  onReady: function () {

  },
  /* 跳转 */
  _navto(e){
    wx.navigateTo({
      url: e.currentTarget.dataset['url'],
    })
  },
  // 获取userSource
	getUserSource: function() {
		return this.globalData.userSource
	},
	// 获取userToken
	getUserToken: function() {
		return wx.getStorageSync('userToken')
  },
  // 修改并本地存储userToken
	saveStorageUserToken: function(userToken) {
		this.globalData.userToken = userToken
		wx.setStorageSync('userToken', userToken)
  },
  // 经理二维码
  getcallService:function(){
    return this.globalData.getContactQr
  },
  globalData:{
    share: false,  // 分享默认为false
    height: 0,
    clientHeight:0,
    contentHeight:0,
    windowWidth:0,
    userToken:'',
    getContactQr:[],
    userID:'',
    carRecommendGoods:[],
  },
})