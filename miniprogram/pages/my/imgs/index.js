// pages/weCoperStudy/weCoperStudy.js
import WeCropper from '../../../dist/we-cropper.js'
const util = require('../../../util.js')
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio
const height = device.windowHeight - 70
const fs = width / 750 * 2

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc:'',//确定裁剪后的图片
    userid:'',
    // 组件所需的参数
    width:250,//宽度
    height: 250,//高度
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '选择头像', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    modalShow:false,
  },
  onShow: function () {
    // this.setData({
    //   imgSrc:wx.getStorageSync('userImg')
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.imgSrc)
    this.cropper = this.selectComponent("#image-cropper");
    // url.replace(“https”,“http”);
    this.setData({
      imgSrc:options.imgSrc,
      userid:options.userid
    })
    wx.showLoading({
      title: '加载中'
    })
  },
  cropperload(e){
    console.log("cropper初始化完成");
  },
  // imgReset
  loadimage(e){
      console.log("图片加载完成",e.detail);
      wx.hideLoading();
      //重置图片角度、缩放、位置
      this.cropper.imgReset();
  },
  clickcut(e){
      console.log(e.detail);
      //点击裁剪框阅览图片
      // wx.previewImage({
      //     current: e.detail.url, // 当前显示图片的http链接
      //     urls: [e.detail.url] // 需要预览的图片http链接列表
      // })
      // this.upImg(e.detail.url)
      this.setData({
        imgUrl:e.detail.url,
        modalShow:true
      })
  },
  upImg(filePath){
    console.log(this.data.userid)
    console.log(filePath)
    wx.showToast({
      title: '上传图片中',
      icon: 'loading',
      duration: 20000
    })
    wx.uploadFile({
      url: 'https://www.vpxyy.com/index.php/Smallapp/Index/uploadAvatar',
      filePath: filePath,
      file:filePath,
      name: 'imgFile',
      formData: {
        'user_id': this.data.userid
      },
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
      },
      success:(res)=>{
			  wx.hideToast()
        var uploadFileRes = JSON.parse(res.data)
        console.log(uploadFileRes.url);
        if(uploadFileRes.url){
          util.showMessage('修改成功')
          wx.navigateBack()
        }
      }
    })
  },
  modalBtn(e){
    if(e.detail.index==0){
      this.setData({
        modalShow:false
      })
    }else if(e.detail.index==1){
      this.upImg(this.data.imgUrl)
    }
  }
})