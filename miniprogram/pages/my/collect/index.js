// miniprogram/pages/my/collect/index.js
const util = require('../../../util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的收藏', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight-50, // 内容的高度 -50是底部按钮的高度
    // contentHeight:getApp().globalData.contentHeight-41, // 内容的高度 -41是底部按钮的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的宽度
    allCheckbox:false, // 全选
    goods:[],
    CheckboxList:[],
    imageSize:{},
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

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      allCheckbox:false,
    })
    this.collectSee()
  },
  // checkbox空事件防止冒泡
  preventBubbling(e){
  },
  /* 跳转 */
  _navto(e){
    getApp()._navto(e)
  },
  /* 全选是否选中 */
  checkboxChange(e){
    console.log(e.detail.value)
    var allCheck = e.detail.value.length == this.data.goods.length?true:false
    this.setData({
      allCheckbox:allCheck,
      CheckboxList:e.detail.value
    })
  },
  /* 全选 */
  allCheckbox(e){
    var allCheckbox = this.data.allCheckbox==false?true:false
    var goods = this.data.goods
    goods.forEach(item => {
      if(allCheckbox){item.checked = true}else{item.checked = false}
    });
    this.setData({
      allCheckbox:allCheckbox,
      goods:goods
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
        console.log(res.data.data.goods)
        this.setData({
          goods:res.data.data.goods
        })
      }
    })
  },
  shanCollect(){ // 删收藏
    this.data.CheckboxList.forEach((item)=>{
      this.data.goods.forEach((items,index)=>{
        if(index==Number(item)){
          console.log(items.goods_id)
          util.post({
            url:'index.php/Smallapp/Index/toggleCollect',
            header:{
              'whoareyou':1,
              'VPToken':getApp().getUserToken(),
              'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
            },
            data:{
              gid:items.goods_id
            },
            success:res=>{
              console.log(res)
              util.showMessage(res.data.msg)
              this.collectSee()
            }
          })
      }
      })
    })
  },

  imgInfo(e){
    var width = e.detail.width,    //获取图片真实宽度
         height = e.detail.height,
         ratio = width/height;    //图片的真实宽高比例
     var viewWidth = this.data.windowWidth*0.26,           //设置图片显示宽度，左右留有16rpx边距
         viewHeight = this.data.windowWidth*0.26/ratio;    //计算的高度值
      var image = this.data.imageSize; 
          //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
          image[e.target.dataset.index]={
            width:viewWidth*2,
            height:viewHeight*2
          }
      this.setData({
        imageSize:image
      })

  },
})