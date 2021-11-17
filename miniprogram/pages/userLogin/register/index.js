// miniprogram/pages/userLogin/register/index.js
const util = require('../../../util.js')
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
    agInpType:false,
    toCodeKey:false,
    toCodeTime:60,
    noag_name_focus:false,
    ag_name_focus:false,
    "user_name": "", // 用户名
    "pwd": "", // 密码
    "phone_tel": "", // 手机号
    "phone_code": "", // 验证码
    "syscode": "" // 邀请码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
          clientHeight:res.windowHeight-(res.statusBarHeight * 2 + 20),
          filtrateBoxLeft:res.windowWidth,
          contentHeight:res.windowHeight-(res.statusBarHeight * 2 + 20),
          windowWidth:res.windowWidth,
          navHeight:(getApp().globalData.clientHeight-45-(getApp().globalData.height * 2 + 20))*0.7
        })
      }
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
   /* input简约双向绑定 */
  user_name(e){
    var value = e.detail.value;
    this.setData({
      user_name:value
    })
  },
  pwd(e){
    var value = e.detail.value;
    this.setData({
      pwd:value
    })
  },
  phone_tel(e){
    var value = e.detail.value;
    this.setData({
      phone_tel:value
    })
    // console.log(this.data.phone_tel)
  },
  phone_code(e){
    var value = e.detail.value;
    this.setData({
      phone_code:value
    })
  },
  syscode(e){
    var value = e.detail.value;
    this.setData({
      syscode:value
    })
  },
  // 获取验证码
  toCode(e){
    var that = this
    console.log(that.data.phone_tel)
    // console.log((/^[1][3,4,5,7,8,9][0-9]{9}$/.test(that.data.phone_tel)))
    if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(that.data.phone_tel))){ 
      // alert("手机号码有误，请重填");
      util.showMessage("手机号码有误，请重填")
      // return false;
    }else{
      this.sendSmsCode()
      var toCodeTime = 60
      var that = this
      this.setData({
        toCodeKey:true
      })
      var times = setInterval(() => {
        toCodeTime = toCodeTime - 1
        if(toCodeTime<1){
          clearInterval(times)
          that.setData({
            toCodeKey:false,
            toCodeTime:60,
          })
        }else{
          that.setData({
            toCodeTime:toCodeTime,
          })
        }
        // console.log(this.data.toCodeTime)
      }, 1000);
    }
    
  },
  // 获取验证码
  sendSmsCode(){
    util.post({
      url: 'index.php/Smallapp/Index/sendSmsCode',
      data:{
        "phone_tel": this.data.phone_tel,
      },
      success:res=>{
        console.log(res)
        if(res.data.msg){
          util.showMessage(res.data.msg)
        }else if(res.data.data){
          util.showMessage('验证码已发送')
        }
      }
    })
  },
   // 密码是否看见
   tosee(e){
     if(e.currentTarget.dataset['ag']=='ag'){
      var agInpType = this.data.agInpType==false?true:false
      this.setData({
        agInpType:agInpType,
        ag_name_focus:true
      })
     }else{
      var inpType = this.data.inpType==false?true:false
      this.setData({
        inpType:inpType,
        noag_name_focus:true,
        
      })
     }
  },
  // 确认注册
  goRegister(e){
    var that = this
    util.post({
      url: 'index.php/Smallapp/Index/register',
      data:{
        "user_name": that.data.user_name,
        "pwd": that.data.pwd,
        "phone_tel": that.data.phone_tel,
        "phone_code": that.data.phone_code,
        "syscode": that.data.syscode
      },
      success:res=>{
        console.log(res)
        if(res.data.msg == "登录成功"){
          this.navback()
          util.showMessage('注册成功')
        }else{
          util.showMessage(res.data.msg)
        }
      }
    })
  },
  navback(){
    wx.navigateBack()
  }
})