const app = getApp()
const DownloadSaveFile = require('../../downloadSaveFile.js')
const util = require('../../util.js')
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  data: {
    height: getApp().globalData.height * 2 + 20,  // 机型媒体兼容  this.toKeFu
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1,
      title: 'VERY PEFEC'
    },
    titleTop:0,
    keFuCode:true,
    getContactQr:[],
    userid:''
  },
  attached: function(){
    console.log(12123132123)
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
    // title top值   方便对齐
    var top =  getApp().globalData.height * 2 + 20
    this.setData({
      titleTop: top/2
    })
    util.post({
      url:'index.php/Smallapp/Index/myInfo',
      header:{
        'whoareyou':1,
        'VPToken':wx.getStorageSync('userToken'),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        this.setData({
          userid:res.data.data.ucenter.user_id
        })
      }
    })
  },
  methods: { 
  // 路由跳转
  _navto(e){
    console.log(e.currentTarget.dataset['url'])
    wx.navigateTo({
      url: e.currentTarget.dataset['url'],
    })
  },
  // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
  // 去购物车
    toGwc(){
      console.log(123)
      wx.navigateTo({
        url: '/pages/shoppingCart/toShoppingCart/index'
      })
    },
    user(){
      util.post({
        url:'index.php/Smallapp/Index/myInfo',
        header:{
          'whoareyou':1,
          'VPToken':this.globalData.userToken,
          'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
        },
        success:res=>{
          console.log(res)
          this.setData({
            userid:res.data.data.ucenter.user_id
          })
        }
      })
    },
  //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/indexs/index/index',
      })
    },
    getCall(){
      util.post({
        url:'index.php/Smallapp/Index/getContactQr',
        header:{
          'whoareyou':1,
          'VPToken':getApp().getUserToken(),
          'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
         },
        success:res=>{
          this.setData({
            getContactQr: res.data,
            keFuCode:false,
          })
          console.log(res.data)
        }
      })
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
                  keFuCode:true,
                })
              }
            })
          }
        })
      },
      // 下载
      Down(){
        DownloadSaveFile.downloadFile('image', this.data.getContactQr.data.img_qr); //video或image
        this.setData({
          keFuCode:true,
        })
      },
      toUp(){
        var keFuCode = this.data.keFuCode==false?true:false
        this.setData({
          keFuCode:keFuCode
       })
      }
  }

}) 