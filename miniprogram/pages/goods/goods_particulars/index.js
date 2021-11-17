// miniprogram/pages/goods/goods_particulars/index.js
const util = require('../../../util.js')
const DownloadSaveFile = require('../../../downloadSaveFile.js')
Page({
  /** collect
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
     navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title:'VERY PEFECT', //导航栏 中间的标题
      userId:true,
      userIdShow:true
    },
    tops:-800,
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    width:getApp().globalData.windowWidth, // 视口宽度
    swpHeight:{},
    showImgHeight:{}, // 图片高度
    tuijianImgHeight:{},
    imgList:[],
    datas:[], // 总数据
    tuiJian:[], // 推荐
    select:0, // swp的index
    togwc:false, // 选择画面弹出
    SizeIndex:null,
    num:0,
    goodsid:0,
    listData:[
      {"size":"22","text":"text1","texts":"text1","type":"type1"},
      {"size":"23","text":"text2","texts":"text1","type":"type2"},
      {"size":"24","text":"text3","texts":"text1","type":"type3"},
      {"size":"25","text":"text4","texts":"text1","type":"type4"},
      {"size":"26","text":"text5","texts":"text1","type":"type5"},
      {"size":"27","text":"text6","texts":"text1","type":"type6"},
      {"size":"28","text":"text7","texts":"text1","type":"type7"},
    ],
    keFuCode:true, // 客服弹出
    goodsData:[],
    storehouseStockInfo:[],//仓
    cang:null,//仓
    shouCang:'icon-shoucang1',
    toCarRight:-57,
    toCarNum:-30,
    carNum:0, // 购物车个数
    seeimgs:0,
    photos:[],
    scrollTop:0,
    modalShow:false,
  },
  /**
   * 生命周期函数--监听页面加载get_
   */
  onLoad: function (options) {
    this.setData({
      goodsid:options.goodsid,
      goodsWidth:this.data.width/2.5
    })
    this.collectSee()
    this.userZongXing()
    
  },
  onShow: function () {
    // if(getApp().getUserToken()==''){
      // wx.showModal({
      //   title: '提示',
      //   content: '登陆之后才能看到商品信息哦',
      //   success (res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '/pages/userLogin/login/index',
      //       })
      //     } else if (res.cancel){
        // previewImg
      //     }
      //   }
      // })
    // }else{
      this.getData()
    // }
    this.getCarNum()
  },
// ucenter
  onReady: function(){
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        // this.globalData.height = res.statusBarHeight;  // tabBar窗口高度
        // this.globalData.clientHeight = res.windowHeight;	// 获取可使用窗口高度
        // this.globalData.contentHeight = res.windowHeight - (res.statusBarHeight * 2 + 20)  // 制定content的高度
        // this.globalData.windowWidth = res.windowWidth	// 获取可使用窗口宽度
        that.setData({
          height:res.statusBarHeight* 2 + 20,
          clientHeight:res.windowHeight-45-(res.statusBarHeight * 2 + 20),
          contentHeight:res.windowHeight - (res.statusBarHeight * 2 + 20)
        })
      }
    })
    console.log(this.data.clientHeight)
    // this.get_height();
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
  getCarNum(){
    util.post({
      url:'index.php/Smallapp/Order/cartList',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res.data.data.cartList)
        if(res.data.data.cartList != null){
          var car = []
          res.data.data.cartList.forEach(item=>{
            if(item.quantity != '0' || item.quantity != 0){
              car.push(item)
            }
          })
          this.setData({
            carNum:car.length,
          })
        }
      }
    })
  },
  // specList
  goodsNum(e){
    var indexs = e.currentTarget.dataset['index']
    var cang = e.currentTarget.dataset['cang']
    var size_name = e.currentTarget.dataset['size_name']
    var storehouseStockInfo = this.data.storehouseStockInfo
        this.data.specList.forEach((item,index)=>{
          if(item.size_name==size_name){
            var max = 0
            if(item.stock > Number(item.xianhuo_stock)){
              max = item.stock
            }else{
              max = item.xianhuo_stock
            }
            if(e.currentTarget.dataset['num']=='+'){
              item.selected = item.selected>=max?max:Number(item.selected)+1
              console.log(item.selected)
            }else{
              console.log(item.selected)
              item.selected = item.selected<=0?0:item.selected-1
            }
          }
        });
    this.setData({
      specList:this.data.specList,
      cang:indexs
    })
    // console.log(this.data.storehouseStockInfo)
  },
  // 加入购物车 
  addCar(e){
    if(getApp().getUserToken() == ''){
      util.showMessage('请先登录')
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/userLogin/login/index'
        })
      },1000)
    }else{
      var key = 0
      var storehouseStockInfo = this.data.storehouseStockInfo
      for (const key in storehouseStockInfo) {
        storehouseStockInfo[key].specList.forEach((item)=>{
          // console.log(item)
          if(item.selected!=0){
            var again = true
            var max = 0
              if(item.stock > Number(item.xianhuo_stock)){
                max = item.stock
              }else{
                max = item.xianhuo_stock
              }
            util.post({
              url:'index.php/Smallapp/Index/addCart',
              header:{
                'whoareyou':1,
                'VPToken':getApp().getUserToken(),
                'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
              },
              data:{
                spec_id:item.spec_id,
                goods_id:this.data.goodsid,
                number:item.selected
              },
              success:res=>{
                console.log(res)
                util.showMessage(res.data.msg)
                if(res.data.msg == '添加成功'){
                  this.getCarNum()
                  this.setData({
                    toCarRight:0,
                    toCarNum:36
                  })
                  util.showMessage('添加成功')
                }
              }
            })
          }else{
            // util.showMessage('请选择商品')
          }
        })
      }
    }
    
  },
  // 添加购物
  agCar(spec_id,goodsid,selected){
    console.log(321)
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
        util.showMessage(res.data.msg)
      }
    })
  },
  SizeIndexs(e){
    this.setData({
      SizeIndex: e.currentTarget.dataset['index']
    })
  },
  // swp 的index改变
  activeSw(e) {
    let {current, source} = e.detail
    // console.log(current, source,e.detail)
    if(source === 'autoplay' || source === 'touch') {
    //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
      this.setData({
        select: current
      })
    }
  },
   // 底部抽屉弹出 specList
   toUp(e){
     if(e.currentTarget.dataset['cang']){
       this.setData({
         specList:this.data.storehouseStockInfo[e.currentTarget.dataset['cang']].specList
       })
      //  console.log(this.data.specList)
     }

		var togwc = this.data.togwc==false?true:false
    this.setData({
      togwc:togwc
    })
  },
  toTable(){
    var top = this.data.tops==0?-1000:0
    console.log(top)
    this.setData({
      tops:top,
    })
  },
  /* 跳转 */
  _navto(e){
    // if(e.currentTarget.dataset['type']){
    //   if(getApp().getUserToken() == ''){

    //   }
    // }
    getApp()._navto(e)
  },
  toCarIndex(){
    wx.switchTab({
			url: '/pages/shoppingCart/index/index'
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
            that.toKeFu()
          }
        })
      }
    })
  },
  // 下载 addCar
  Down(){
    DownloadSaveFile.downloadFile('image', this.data.getContactQr.data.img_qr); //video或image
    this.toKeFu()
  },
  // 客服弹出
  toKeFu(){
    var key = this.data.keFuCode==true?false:true
        this.setData({
          keFuCode:key,
        })
  },
  // api 
  getData(){
    var that = this
    console.log(this.data.goodsid)
    util.post({
      url:'index.php/Smallapp/Index/goods',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      data:{
        id:this.data.goodsid,
      },
      success:res=>{
        console.log(res.data.data)
        // console.log(res.data.data.storehouseStockInfo)
        if(res.data.data==undefined){
          wx.showModal({
            title: '提示',
            content: '登陆之后才能看到商品信息哦',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/userLogin/login/index',
                })
              } else if (res.cancel) {
                
              }
            }
          })
        }
        console.log(res.data.data.shipping_day)
        var opimg = []
        res.data.data.gallery.forEach(item=>{
          opimg.push(item.image_url)
        })
        this.setData({
          datas:res.data.data,
          shipping_day:res.data.data.shipping_day,
          imgList:opimg,
          goodsData:res.data.data.info,
          storehouseStockInfo:res.data.data.storehouseStockInfo
        })
        console.log(this.data.storehouseStockInfo.length==0)
      }
    })
    
    util.get({
      url:'index.php/Smallapp/Index/recommend?gid='+this.data.goodsid,
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式 addCar
      },
      data:{
        gid:this.data.goodsid,
      },
      success:res=>{
        console.log(res)
        util.showMessage(res.data.msg)
        this.setData({
          tuiJian:res.data.data,
        })
      }
    })
  },
  // swp自适应的高度
  swpInfo(e){
    var width = e.detail.width,    //获取图片真实宽度 collect
         height = e.detail.height,
         ratio = width/height;    //图片的真实宽高比例
     var viewWidth = this.data.width,           //设置图片显示宽度，左右留有16rpx边距
         viewHeight = this.data.width/ratio;    //计算的高度值
      var image=this.data.swpHeight; 
          //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
          image[e.target.dataset.index]={
            width:viewWidth*2,
            height:viewHeight*2
          }
      this.setData({
        swpHeight:image
      })
      // console.log(height,width,e.target.dataset.index)
  },
  showImg(e){
    var width = e.detail.width,    //获取图片真实宽度
         height = e.detail.height,
         ratio = height/width;    //图片的真实宽高比例
     var viewWidth = 450/ratio,           
          viewHeight = 450;   
      var image = this.data.showImgHeight; 
          image[e.target.dataset.index]={
            width:viewWidth,
            height:viewHeight
          }
      this.setData({
        showImgHeight:image
      })
      // console.log(height,width,e.target.dataset.index)
  },

  collect(e){ // 收藏
    if(getApp().getUserToken() == ''){
      this.setData({
        modalShow:true
      })
    }else{
      util.post({
        url:'index.php/Smallapp/Index/toggleCollect',
        header:{
          'whoareyou':1,
          'VPToken':getApp().getUserToken(),
          'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
        },
        data:{
          gid:this.data.goodsid,
        },
        success:res=>{
          console.log(res)
          if(res.data.type=='1'){
            this.setData({
              shouCang:'icon-shoucang'
            })
          }else{
            this.setData({
              shouCang:'icon-shoucang1'
            })
          }
          util.showMessage(res.data.msg)
        }
      })
    }
    
  },

  collectSee(){ // 查看是否收藏
    util.post({
      url:'index.php/Smallapp/Index/myCollect',
      
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        res.data.data.goods.forEach((item)=>{
          if(item.goods_id == this.data.goodsid){
            this.setData({
              shouCang:'icon-shoucang'
            })
          }
        })
      }
    })
  },
  // 客服
  getCall(){
    util.post({
      url:'index.php/Smallapp/Index/getContactQr',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式 carNum
       },
      success:res=>{
        var key = this.data.keFuCode==true?false:true
        this.setData({
          getContactQr: res.data,
          keFuCode:key,
        })
        console.log(res.data)
      }
    })
  },
  // 查看大图
  /**
   * 对多张图片进行预览
   */
  previewImg: function (e){
    var photos = this.data.imgList;//是一个存放多张图片的数组
    var src = e.currentTarget.dataset['item']
    // console.log(photos);
    wx.previewImage({
      current: src,     //当前图片地址
      urls: photos,                 //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // user_id
  userZongXing(){
      util.post({
        url:'index.php/Smallapp/Index/ucenter',
        header:{
          'whoareyou':1,
          'VPToken':getApp().getUserToken(),
          'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
        },
        success:res=>{
          console.log(res.data.data.account.user_id)
          this.data.navbarData.userId = res.data.data.account.user_id
          this.setData({
            navbarData:this.data.navbarData
          })
        }
      })
  },
  onPageScroll(e){
    this.setData({
      scrollTop:e.scrollTop
    })
  },
  tuijianImg(e){
    var width = e.detail.width,     //获取图片真实宽度
         height = e.detail.height,
         ratio = height/width;      //图片的真实宽高比例
     var viewWidth = 150/ratio,           
          viewHeight = 150;   
      var image = this.data.tuijianImgHeight; 
          image[e.target.dataset.index]={
            width:viewWidth,
            height:viewHeight
          }
      this.setData({
        tuijianImgHeight:image
      })
      console.log(this.data.tuijianImgHeight)
  },
  modalBtn(e){
    console.log(e.detail.index)
    if(e.detail.index==0){
      this.setData({
        modalShow:false
      })
    }else if(e.detail.index==1){
      wx.navigateTo({
        url: '/pages/userLogin/login/index'
      })
    }
  },
})