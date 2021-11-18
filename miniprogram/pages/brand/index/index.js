// miniprogram/pages/brand/index/index.js
const config = require('../../../config.js')
const util = require('../../../util.js')
const app = getApp()
Page({
  /**bindcall
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'VERY PEFECT', //导航栏 中间的标题
      scrollTop:50

    },
    height: 0 ,  // 此页面 页面内容距最顶部的距离
    clientHeight: 0, // 视口高度 这里-80是减去底部tabBar的高度-40是底部tabBar的高度
    screenHeight:0,
    brandname:'', //搜索text
    navHeight: (getApp().globalData.clientHeight-45-(getApp().globalData.height * 2 + 20))*0.7, // nav的高度
    // zimu_list:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],// 字母
    zimu_list:[],// 字母
    zm:[],
    brandsList:null, // 品牌
    brands:null,
    recommend:[], // 品牌推荐
    scroll:'', //滚动到指定 id值
    nav_height: 20,//字母导航单个元素高度
    hiddenn: true,//hint_box 提示框 展示隐藏
    nav_text: '',//hint_box 提示框里面的文本
    brandItem:[], // 搜索的数组
    scrollTop:'',
    twiId:'',
    zimuIndex:'',
    zimuarr:[],
    ScrollViewKey:0,
    ScrollViewKeyTop:[],
    zimuKey:false,
    zimuTop:'',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options){
    
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
  /* 跳转 */
  _navto(e){
    getApp()._navto(e)
  },
   //取高度
   get_height(){
    var that = this
    var query = wx.createSelectorQuery();
    query.select('#nav_item').boundingClientRect()
    query.exec(function (res){
      console.log(res)
      that.setData({
        nav_height: res[0].height,
      })
    })
  },
  tap:function(e){
    this.set_scroll(e)
    var that = this
    setTimeout(function(){
      that.setData({
        hiddenn: true
      })
    },500)
  },
  touchstart: function(e){
    this.set_scroll(e)
    // console.log(1)
  },
  touchmove: function(e){
    this.set_scroll(e)
    // console.log(2)
  },
  touchend: function(){
    this.setData({
      hiddenn: true
    })
    // console.log(12)
  },
  // 获取当前位置

  ScrollView(e){
    var that = this;
    var scrollTop = e.detail.scrollTop+135
    // console.log(scrollTop)
    if(scrollTop < that.data.ScrollViewKeyTop[0]){
      that.setData({
        zimuKey:false
      })
    }else{
      that.setData({
        zimuKey:true
      })
    }
    that.data.ScrollViewKeyTop.forEach((item,index)=>{
      if(scrollTop > item && scrollTop < that.data.ScrollViewKeyTop[index+1]){
        if(this.data.zimuTop != that.data.zimu_list[index]){
          const query = wx.createSelectorQuery()
            query.select('.'+that.data.zimu_list[index]).boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function(res){
    
            })
          that.setData({
            zimuTop:that.data.zimu_list[index],
            nav_text:that.data.zimu_list[index]
          })
        }
      }
    })
    
  },
  // 获取高度
  set_scroll: function(e){
    var page_y = e.changedTouches[0].pageY-this.data.height-40 // 这里减去是缓解当时nav设置的padding的高度从而获得准确的idx
    var nav_height =+ this.data.nav_height
    var idx = Math.floor(page_y/550)
    var zimu = this.data.zimu_list[idx];
    // console.log(this.data.zimu_list.length)
    // console.log(Math.floor((page_y/550)*this.data.zimu_list.length))
    var index = Math.floor((page_y/550)*this.data.zimu_list.length)
    if(this.data.scroll!=this.data.zimu_list[index] && this.data.nav_text!=this.data.zimu_list[index]){
      if(index == -1){
        index = 0
      }
      var zimuIndex = this.data.zimu_list[index]
      zimuIndex = zimuIndex=='其它'?'z0':zimuIndex
      console.log(zimuIndex)
      this.setData({
        scroll: this.data.zimu_list[index],
        nav_text: this.data.zimu_list[index],
        zimuTop:this.data.zimu_list[index],
        hiddenn: false
      })
      wx.vibrateShort()
    }
  },

  /* input简约双向绑定 */
  bindcall(e){
    var brand = e.detail.value;
    var sousuo = {}
    var arr = []
    var brandsList = this.data.brands
   
    console.log(brand)

    this.setData({
      brandname:brand,
      // brandsList:sousuo
    })
    if(brand == ''){
      this.setData({
        brandsList:this.data.brands
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(){
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          height:res.statusBarHeight* 2 + 20,
          screenHeight:res.statusBarHeight,
          clientHeight:res.windowHeight-45-(res.statusBarHeight * 2 + 20)
        })
      }
    })
    this.getBrand()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      var list = this.getTabBar().data.list1
      list[2].iconPath='../images/tabBar/toBrand2.png'
      list[2].show=true
      this.getTabBar().setData({
        list1:list
      })
    }
    // 判断是否登录
    // util.login()
    // const query = wx.createSelectorQuery()
    // query.select('#the-id').boundingClientRect()
    // query.selectViewport().scrollOffset()
    // query.exec(function(res){
    //   console.log(res)
    // })
  },

  bing(item){
    this.setData({
      twiId:item
    })
    var that = this
    setTimeout(()=>{
      that.setData({
        twiId:''
      })
    },800)
  },
  // api zimu_list
  getBrand(){
    var that = this
    util.post({
      url:'index.php/Smallapp/Index/brandList',
      success:res=>{
        var brandItem = []
        var zm = []
        var brandsList = res.data.data.brandsList
        var recommend = res.data.data.recommend
        for (const key in brandsList) {
          zm.push(key)
          for (const item in brandsList[key]) {
            brandItem.push(brandsList[key][item].brand_name)
          }
        }
        
        that.setData({
          brandsList:brandsList,
          brands:brandsList,
          brandItem:brandItem,
          recommend:recommend,
          zimu_list:zm,
        })
        // console.log(123)
        for (const key in this.data.brandsList) {
          if(key!='其它'){
            const query = wx.createSelectorQuery()
            query.select('.'+key).boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function(res){
              var keyTop = res[0].top
              that.data.ScrollViewKeyTop.push(keyTop)
              that.setData({
                ScrollViewKeyTop:that.data.ScrollViewKeyTop
              })
            })
          }
        }
      }
    })
  }
})