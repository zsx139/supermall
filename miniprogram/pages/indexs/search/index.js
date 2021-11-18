// miniprogram/pages/indexs/search/index.js
const util = require('../../../util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '搜索', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    goodsname:'', //搜索text
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    history:['体育场馆预定','停车泊位','爱心捐款','蚂蚁结呗'], // 历史组
    brandItem:''
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
    this.getBrand()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /* input简约双向绑定 */
  bindcall(e){
    var brand = e.detail.value;
		this.setData({
			goodsname:brand
    })
        var brandItem = []
        var brandsList = this.data.brandsList
        for (const key in brandsList) {
          for (const keys in brandsList[key]) {
            if (brandsList[key][keys].brand_name.toLowerCase().indexOf(brand.toLowerCase()) != -1) {
              brandItem.push({
                ['brand_name']:brandsList[key][keys].brand_name,
                ['brand_id']:brandsList[key][keys].brand_id,
              })
            }
          }
        }
        this.setData({
          brandItem:brandItem
        })
  },
  getBrand(){
    util.post({
      url:'index.php/Smallapp/Index/brandList',
      success:res=>{
        var brandItem = []
        var brandsList = res.data.data.brandsList
        this.setData({
          brandItem:brandItem,
          brandsList:brandsList
        })
      }
    })
  },
  // 搜索goods
  searchSubmit(){
    wx.navigateTo({
      url: '/pages/goods/goods_list/index?keywords='+this.data.goodsname,
    })
  },
  /* 历史推荐搜索 */
  history(e){
    this.setData({
			goodsname:e.currentTarget.dataset['text']
    })
  },
  cancel(){
    // this.setData({
		// 	goodsname:''
    // })
    wx.navigateBack()
  },
    /* 跳转 */
    _navto(e){
      getApp()._navto(e)
    },
})