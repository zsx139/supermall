// miniprogram/pages/shoppingCart/index/index.js
// const util = require('../../../util.js')
const util = require('../../util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'VERY PEFECT', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight-52-45, // 内容的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的宽度
    cartList:null, // 模拟购物车里的商品
    allCheckbox:false, // 全选
    scriptwriterBtn:false, // 编剧按钮的变化
    addItem:[], // 已选的商品
    recommend:[], // 推荐
    cartTotal:[],
    userCentre:[],
    imageSize:{},
    imageSizeT:{},
    tuijian:getApp().globalData.carRecommendGoods,
    tuiButton:[{
      text: "确定",
      type: "red",
      plain: false
    }],
    tuiModalText:"",
    actions: [{
      name: '移至收藏',
      color: '#fff',
      fontsize: 16, //单位rpx
      width: 70, //单位px
      background: '#F4B653'
    },{
      name: '删除',
      color: '#fff',
      fontsize: 24, //单位rpx
      width: 70, //单位px
      background: '#FD3B31'
    }]
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(123)

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
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // 添加img自适应的高度 brandIds
  
  onReachBottom: function () {
    // console.log(2123)
  },
  _navto(e){
    getApp()._navto(e)
  },
  /* 全选是否选中 */
  checkboxChange(e){
    console.log(e.detail.value)
    var allCheck = e.detail.value.length == this.data.cartList.length?true:false
    this.setData({
      allCheckbox:allCheck,
      addItem:e.detail.value,
    })
  },
  /* 全选 orderSubmit */
  allCheckbox(e){
    var allCheckbox = this.data.allCheckbox==false?true:false
    var goods = this.data.cartList
    var additem = []
    goods.forEach((item,index) => {
      if(allCheckbox){
        item.checked = true
        additem.push(index)
      }else{
        item.checked = false
        additem = []
      }
    });
    this.setData({
      allCheckbox:allCheckbox,
      cartList:goods,
      addItem:additem
    })
    console.log(this.data.addItem)
  },
  /* 编剧  */
  scriptwriter(e){
    this.getCar()
    this.getRecommend()
    this.userZongXing()
    var scriptwriterBtn = this.data.scriptwriterBtn==false?true:false
    this.setData({
      scriptwriterBtn:scriptwriterBtn,
    })
  },
  //api
  getCar(toCarKey){
    util.post({
      url:'index.php/Smallapp/Order/cartList',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res.data.data.cartList)
        wx.setStorageSync('goodsAmount',res.data.data.cartTotal.goodsAmount)
        var car = []
        if(res.data.data.cartList != null){
          res.data.data.cartList.forEach(item=>{
            if(item.quantity != '0' || item.quantity != 0){
              car.push(item)
            }
          })
        }
        car = car==[]?null:car
        console.log(car=='')
        this.setData({
          cartList:car,
          cartTotal:res.data.data.cartTotal,
          toCarKey:toCarKey
        })
        console.log(this.data.toCarKey)
        console.log(this.data.cartList)
        if(this.data.cartList == null){
          this.setData({
            scriptwriterBtn:false
          })
        }
      }
    })
  },
  // 推荐
  getRecommend(){
    util.get({
      url:'index.php/Smallapp/Index/recommend',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        // 'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        this.setData({
          recommend:res.data.data
        })
      }
    })
  },
  // delete
  shanCart(){
    this.data.addItem.forEach((item)=>{
      this.data.cartList.forEach((items,index)=>{
        if(index==Number(item)){
          console.log(items.spec_id)
          util.post({
            url:'index.php/Smallapp/Order/deleteCart',
            header:{
              'whoareyou':1,
              'VPToken':getApp().getUserToken(),
            },
            data:{
              productIds:items.spec_id
            },
            success:res=>{
              console.log(res)
              util.showMessage(res.data.msg)
              this.getCar()
              console.log(this.data.cartList)
              this.setData({
                scriptwriterBtn:false
              })
            }
          })
          // var carlist = wx.getStorageSync('MYcar')
          // carlist.splice(Number(item), 1);
          // wx.setStorageSync('MYcar', carlist)
        }
        
      })
    })


  },
  userZongXing(){
    util.post({
      url:'index.php/Smallapp/Index/ucenter',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        this.setData({
          userCentre:res.data
        })
        console.log(this.data.userCentre)
      }
    })
  },
  addGoods(e){
    var index = e.currentTarget.dataset['index']
    var cartList = this.data.cartList
    var items = cartList[index]
    console.log(items)
    if(e.currentTarget.dataset['num']=='+'){
        console.log(items.quantity,items.qihuo_stock)
        items.quantity = Number(items.quantity)+1
        // if()
        this.agCar(items.spec_id,items.goods_id,1)
    }else if(e.currentTarget.dataset['num']=='-'){
      console.log(items.quantity)
      if(items.quantity==1){
        items.quantity = 1
        console.log('个数为一')
        items.jianFas = false
      }else{
        items.quantity = items.quantity-1
        this.agCar(items.spec_id,items.goods_id,-1)
      }
    }
    this.setData({
      cartList:cartList
    })
  },
  cshCar(){
    var carlist = wx.getStorageSync('MYcar')
    console.log(carlist,this.data.cartList)
    carlist.forEach(item=>{
      if(this.data.cartList == null){
        console.log(item.spec_id)
        // this.agCar(item.spec_id,item.goodsid,item.selected)
      }
    })
    this.getCar()
  },
  // 添加购物
  agCar(spec_id,goodsid,selected){
    console.log()
    util.post({
      url:'index.php/Smallapp/Index/addCart',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      data:{
        spec_id:spec_id,
        goods_id:goodsid,
        number:selected
      },
      success:res=>{
        console.log(res)
        this.getCar(res.data.msg)
        // util.showMessage(res.data.msg)
        if(res.data.msg == "对不起，该仓库商品库存不足"){
          wx.vibrateLong()
          this.setData({
            tuiModalText:res.data.msg,
            tuiModalShow:true
          })
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.msg,
          //   success (res) {
          //     if (res.confirm) {
          //       // wx.navigateBack()
          //     } else if (res.cancel) {
          //       // wx.navigateBack()
          //     }
          //   }
          // })

        }
      }
    })
  },
  // 减出购物车
  jianCar(id){
    util.post({
      url:'index.php/Smallapp/Order/deleteCart',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
      },
      data:{
        productIds:id
      },
      success:res=>{
        console.log(res)
        this.getCar()
        util.showMessage(res.data.msg)

      }
    })
  },
  imgInfoTJ(e){
    var width = e.detail.width,    //获取图片真实宽度
        height = e.detail.height,
        ratio = width/height;    //图片的真实宽高比例
    var viewWidth = this.data.windowWidth*0.35,           //设置图片显示宽度，左右留有16rpx边距
        viewHeight = this.data.windowWidth*0.35/ratio;    //计算的高度值
    var image = this.data.imageSizeT; 
    image[e.target.dataset.index]={
      width:viewWidth*2,
      height:viewHeight*2
    }
    this.setData({
      imageSizeT:image
    })
  },
  tuiModalBtn(){
    this.setData({
      tuiModalShow:false
    })
  },
  customBtn(e){
    var goodsIndex = e.target.dataset.goodsindex
    if(e.target.dataset.index==0){
      this.getCollect(goodsIndex)
    }else if(e.target.dataset.index==1){
      this.deleteGoods(goodsIndex)
    }
  },
  deleteGoods(index){
    util.post({
      url:'index.php/Smallapp/Order/deleteCart',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
      },
      data:{
        productIds:this.data.cartList[index].spec_id
      },
      success:res=>{
        console.log(res)
        util.showMessage(res.data.msg)
        this.getCar()
        console.log(this.data.cartList)
      }
    })
  },
  getCollect(index){
    util.post({
      url:'index.php/Smallapp/Index/toggleCollect',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      data:{
        gid:this.data.cartList[index].goods_id,
      },
      success:res=>{
        console.log(res,res.data.type)
        if(res.data.type==1){
          this.deleteGoods(index)
        }
        util.showMessage(res.data.msg)
      }
    })
  }
  // shanCart
})