// miniprogram/pages/my/userSet/index.js
const util = require('../../../util.js')
import WeCropper from '../../../dist/we-cropper.js'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio
const height = device.windowHeight - 70
const fs = width / 750 * 2
Page({
  /** myCollect
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    cropperOpt: {
      id: 'cropper',
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 250) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: (height * 0.5 - 250 * 0.5), // 裁剪框y轴期起点
        width: 250, // 裁剪框宽度
        height: 250// 裁剪框高度
      }
    },
    // 组件所需的参数
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '设置', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    // clientHeight: getApp().globalData.clientHeight-45-(getApp().globalData.height * 2 + 20), // 视口高度 这里-80是减去底部tabBar的高度-40是底部tabBar的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的宽度
    userText:[],
    togwc:false, // 抽屉弹出
    amendTitle:'123', // 修改框标题
    verification:true, // 验证码是否正确
    verify:true, // 验证码按钮的隐藏
    verifyCountDown:60, // 验证码倒计时
    tohomeLocation:false, // 选择归属地
    homeLocation:'86', // 归属地
    userName:'', // 昵称
    verifyNum:'', // 验证码
    phoneNumber:'', // 手机号
    passWord:'', // 新密码
    toFunction:'', // 验证的事件 “确定按钮”
    userImg:'', // 用户头像
    imgSrc:'',
    oldPassWords:'', // 旧密码
    NotarizePassWord:'', // 确认密码
    modalShow:false
  },

  /** modalBtn
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.src)
    const { cropperOpt } = this.data
    this.cropper = new WeCropper(cropperOpt).on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      }).on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
    
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
  onShow: function () {
    this.setData({
      userImg:wx.getStorageSync('userImg')
    })
    //刷新画面
    this.wecropper.updateCanvas()
    this.userXinXi()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /* 跳转 */
  _navto(e){
    getApp()._navto(e)
  },
    // 底部抽屉弹出
  toUp(e){
    var togwc = this.data.togwc==false?true:false
    if(getApp().getUserToken() == ''){
      util.showMessage('请先登录')
    }else{
      if(e&&e.currentTarget.dataset['title']){
        this.setData({
          togwc:togwc,
          amendTitle:e.currentTarget.dataset['title'],
          toFunction:e.currentTarget.dataset['function'],
       })
      }else{
        this.setData({
          togwc:togwc,
       })
      }
    }
  },
  /* input简约双向绑定 昵称 toFunction*/
  bindcallName(e){
		this.data.userName = e.detail.value;
		this.setData({
			userName:this.data.userName
    })
  },
  /* input简约双向绑定 验证码 */
  bindcallVerify(e){
		this.data.verifyNum = e.detail.value;
		this.setData({
			verifyNum:this.data.verifyNum
    })
  },
  /* input简约双向绑定 新手机号 */
  bindcallPhone(e){
		this.data.phoneNumber = e.detail.value;
		this.setData({
			phoneNumber:this.data.phoneNumber
    })
  },
  /* input简约双向绑定 新密码 */
  bindcallPassWord(e){
		this.data.passWord = e.detail.value;
		this.setData({
			passWord:this.data.passWord
    })
  },
  /* 验证新密码 确认密码 */
  bindcallNotarizePassWord(e){
		this.data.NotarizePassWord = e.detail.value;
		this.setData({
			NotarizePassWord:this.data.NotarizePassWord
    })
  },
  oldPassWord(e){
    this.data.oldPassWords = e.detail.value;
		this.setData({
			oldPassWords:this.data.oldPassWords
    })
  },
  // 修改昵称
  amendNmae(){
    this.toUp()
  },
  // 验证手机
  toverifyPhone(){
    util.showMessage('验证码错误','1000')
    this.setData({
      toFunction:'amendPhone',
      verification:false
    })
  },
  // 修改手机号 verifyNum
  amendPhone(){
    util.showMessage('验证码错误','1000')
    this.toUp()
    this.setData({
      verification:true
    })
  },
  // 修改密码
  amendPassword(){
    var that = this
    console.log(this.data.oldPassWords,this.data.passWord,this.data.NotarizePassWord)
    util.post({
      url:'index.php/Smallapp/Index/resetPwd',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      data:{
        'oldpwd':this.data.oldPassWords.replace(/&lt;\/?.+?&gt;/g,""),
        'newpwd':this.data.passWord.replace(/&lt;\/?.+?&gt;/g,""),
        'repwd':this.data.NotarizePassWord.replace(/&lt;\/?.+?&gt;/g,""),
      },
      success:res=>{
        console.log(res)
        that.setData({
          oldPassWords:'',
          passWord:'',
          NotarizePassWord:'',
        })
        util.showMessage(res.data.data.msg)
        if(res.data.data.msg == '密码已更新'){
          that.toUp()
          util.removeStorageUserToken()
          util.showMessage(res.data.data.msg)
        }
      }
    })
  },

  // 验证码倒计时
  toverify(){
    this.setData({
			verify:false
    })
    var time = this.data.verifyCountDown
    var that = this
    var t
    t = setInterval(()=>{
      time = time-1
      that.setData({
        verifyCountDown:time
      })
      if(that.data.verifyCountDown==0){
        that.setData({
          verify:true
        })
        clearInterval(t)
      }
    },1000)
  },
  // 归属地选择弹出
  tohomeLocation(){
    var tohomeLocation = this.data.tohomeLocation==false?true:false
    this.setData({
      tohomeLocation:tohomeLocation,
   })
  },
  // 归属地选择
  radioChange(e) {
    this.setData({
      homeLocation:e.detail.value
    })
  },
  // 重置input
  resetInput(){
    this.setData({
      userName:''
    })
  },
  // 选择头像
  uploadTap() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        var src = res.tempFilePaths[0];
        // console.log(src)
        wx.setStorage({
          data: src,
          key: 'userImg',
        })
        that.wecropper.pushOrign(src);
        that.setData({imgSrc: src})
        wx.navigateTo({
          url: '/pages/my/imgs/index',
        })
      }
    })
  },
  // 确认
  toFunctions(){
    if(this.data.amendTitle == '修改密码'){
      this.amendPassword()
    }
  },
  // 用户信息
  userXinXi(){
    util.post({
      url:'index.php/Smallapp/Index/myInfo',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        // userText.data.ucenter.phone_tel
        var str1 = res.data.data.ucenter.phone_tel
        var reg = /^(\d{3})\d*(\d{4})$/;
        var str2 = str1.replace(reg,'$1****$2')
        this.setData({
          userText:res.data,
          baoMiPhone:str2
        })
        // console.log(this.data.userText)
      }
    })
  },
  copy(){
    var that = this
    wx.setClipboardData({
      data:that.data.userText.data.ucenter.user_id,
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  // 退出登录
  secede(){
    this.data.userText.data.ucenter.phone_tel = ''
    this.data.userText.data.ucenter.user_name = ''
    this.setData({
      userText:this.data.userText,
      modalShow:false
    })
    util.removeStorageUserToken()
  },
  modalBtn(e){
    console.log(e.detail.index)
    if(e.detail.index==0){
      this.setData({
        modalShow:false
      })
    }else{
      this.secede()
    }
  },
  modalKey(){
    if(getApp().getUserToken() == ''){
      wx.navigateTo({
        url: '/pages/userLogin/login/index',
      })
    }else{
      this.setData({
        modalShow:true
      })
    }
    
  }
})