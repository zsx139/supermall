// miniprogram/pages/userLogin/login/index.js
const util = require('../../../util.js')
let toast;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 3, //是否显示左上角图标   1表示显示    0表示不显示
      title: '用户登录', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的宽度
    inpType:false,
    usernameText: "", // 用户名
    passwordText: "", // 密码
    Type:'icon-biyan1',
    name_focus:false,
    user_focus:false,
    tuiButton:[{
      text: "确定",
      type: "",
      plain: false
    }],
    tuiModalShow:false,
    tuiModalText:"",
    passwordSeeShow:false
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
  onReady: function () {
    var that = this
    toast = this.selectComponent("#toast")
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          height:res.statusBarHeight* 2 + 20,
          clientHeight:res.windowHeight-(res.statusBarHeight * 2 + 20),
          filtrateBoxLeft:res.windowWidth,
          contentHeight:res.windowHeight-(res.statusBarHeight * 2 + 20),
          windowWidth:res.windowWidth,
          navHeight:(getApp().globalData.clientHeight-45-(getApp().globalData.height * 2 + 20))*0.7
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  username(e){
    var value = e.detail.value;
    this.setData({
      usernameText:value
    })
  },
  password(e){
    var value = e.detail.value;
      this.setData({
        passwordText:value
      })
  },
    // 用户绑定
    wxlogin(){
      var that = this
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 20000
      })
      wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            console.log(res)
            var code = res.code
            var appId = 'wxfd2bfbc422bcfa67';
            var secret = 'e4a30cfb6daebfcb4c0f90a8df8ec402';
            that.setData({
              code:code
            })
		      	wx.hideToast()

            that.goLogin()
          }else{
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
  // 确认登陆
  goLogin(){
    var that = this
    console.log(that.data.usernameText,that.data.passwordText,that.data.code)
    util.post({
      url: 'index.php/Smallapp/Login/login',
      data:{
        "username": that.data.usernameText,
        "password": that.data.passwordText,
        "code":that.data.code,
      },
      success:res=>{
        console.log(res)
        if(res.data.msg != "账号或密码错误"){
          util.showMessage('登陆成功')
          wx.vibrateShort()
          getApp().saveStorageUserToken(res.data.data.token)
          wx.switchTab({
            url: '/pages/indexs/index/index'
          })
        }else{
          console.log(res.data.msg)
          util.showMessage(res.data.msg)

          // let options = {
          //   msg: res.data.msg,
          //   duration: 2000
          // };
          // toast.showTips(options);
          wx.vibrateLong()
          // this.setData({
          //   tuiModalText:res.data.msg,
          //   tuiModalShow:true
          // })
        }
      }
    })
  },
  tuiModalBtn(){
    this.setData({
      tuiModalShow:false
    })
  },
   // 密码是否看见
   tosee(e){
    if(this.data.passwordSeeShow){
      this.setData({
        passwordSeeShow:false,
      })
    }else{
      this.setData({
        passwordSeeShow:true,
      })
    }
    // this.setData({
    //   name_focus:true
    // })
    // wxlogin
  },
   /* 跳转 */
   _navto(e){
    getApp()._navto(e)
  },
  usName(){
    this.setData({
      user_focus:true
    })
  },
  psWord(){
    this.setData({
      name_focus:true
    })
  }
})