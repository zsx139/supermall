// pages/weCoperStudy/weCoperStudy.js
import WeCropper from '../../../dist/we-cropper.js'

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
      title: '选择头像', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
      contentHeight:getApp().globalData.contentHeight, // 内容的高度
  },
  onShow: function () {
    this.setData({
      imgSrc:wx.getStorageSync('userImg')
    })
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },

  uploadTap() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        var src = res.tempFilePaths[0];
        console.log(src)
        that.wecropper.pushOrign(src);
        that.setData({imgSrc: src})
      }
    })
  },
  getCropperImage() {
    let that = this;
    wx.showToast({
      title: '上传中',
      icon: 'loading',
      duration: 2000
    })
    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    this.wecropper.getCropperImage((src) => {
      if (src) {
        that.setData({
          imgSrc: src
        })
        wx.setStorage({
          data: src,
          key: 'userImg',
        })
        wx.hideToast()
        wx.navigateBack()
        // wx.previewImage({ // 显示当前图片
        //   current: '', // 当前显示图片的http链接
        //   urls: [src] // 需要预览的图片http链接列表
        // })
        console.log(src)
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data
    let that = this;
    this.cropper = new WeCropper(cropperOpt).on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
        that.wecropper.pushOrign(wx.getStorageSync('userImg'));
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
    //刷新画面
    this.wecropper.updateCanvas()
  }
})