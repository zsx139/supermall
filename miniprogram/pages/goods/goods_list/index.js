// miniprogram/pages/classify/classify_more_goods/index.js
const util = require('../../../util.js')
const DownloadSaveFile = require('../../../downloadSaveFile')
Page({
  /**
   * 页面的初始数据
   */
  data: {
     // 组件所需的参数
     navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title:'商品列表', //导航栏 中间的标题
    },
    height: 0 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:0, // 内容的高度
    clientHeight: 0, // 视口高度 这里-80是减去底部tabBar的高度-40是底部tabBar的高度
    windowWidth:0,
    imageSize:[], // 图片的宽高
    discount:[], // 商品的折扣
    list:[], // 需要在里面添加加载的item
    goodsSize:5, // 商品数量
    goodsData:[], // 所有数据
    serverDatas: [], // 操作所有数据
    pageSize: 5, // 每次刷新添加几个
    totalPage: 1,//计算总页数
    start: 1, // 数据从哪开始截取
    loading: false, // loading显示
    filtrateBoxLeft:1000,
    leftLIst:[], // 左边的tablist 单独提取出来
    rightList:[], // 右边的list 单独提取出来
    tabNavTop:17, // tabNav选中的top值
    tabIndex:0, // 左边的tablist 选中
    navHeight: (getApp().globalData.clientHeight-45-(getApp().globalData.height * 2 + 20))*0.7, // nav的高度
    zimu_list:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],// 字母
    brandsList:[], // 品牌
    recommend:[], // 品牌推荐
    scroll:'', //滚动到指定 id值
    nav_height: '',//字母导航单个元素高度
    hiddenn: true,//hint_box 提示框 展示隐藏
    nav_text: '',//hint_box 提示框里面的文本
    scrollTop:'',
    twiId:'',
    sort:null, // 排序
    sortTime:false, // 时间排序
    sortprice:false, // 价格..
    sortDiscount:false, // 折扣..
    classify:[], // 筛选分类
    brandId:null, // 品牌id
    goodsCateID:null, // 商品类型id
    goodsCate:null, // 商品选中index
    goodsNameID:'000', // 商品名称id
    goods:[],
    options:null, // 传递参数
    tobrand:false,
    tocate:false,
    buur:true,
    imageSize:{},
    CutClass:'true',
    toFenXiang:false,
    FenXiangImg:[],
    showImgHeight:[],
    changeAc:[],
    filtrateBlockTop:-1000,
    sizeIndex:{},
    addgoods:[],
    goodsMax:{},
    ImgHeight:{},
    brandINto:'',
    modalShow:false,
  },
  /** toStrip
   * 生命周期函数--监听页面初次渲染完成 tabNavTop
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
  // 添加img自适应的高度 brandIds
  imgInfo(e){
    var width = e.detail.width,    // 获取图片真实宽度
         height = e.detail.height,
         ratio = width/height;    // 图片的真实宽高比例
     var viewWidth = 151.5,           // 设置图片显示宽度，左右留有16rpx边距
         viewHeight = 151.5/ratio;    // 计算的高度值
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
  showImg(e){
    var $width = e.detail.width,    //获取图片真实宽度
         $height = e.detail.height,
         ratio = $width/$height;    //图片的真实宽高比例
     var viewWidth = 110,    
         viewHeight = 110/ratio;    //计算的高度值
      var image=this.data.showImgHeight; 
          image[e.target.dataset.index]={
            width:viewWidth.toFixed(2)*2,
            height:viewHeight.toFixed(2)*2
          }
      this.setData({
        showImgHeight:image
      })
  },

  change(e){
    var index = e.currentTarget.dataset['index']
    console.log(this.data.changeAc[index],e.currentTarget.dataset['index'])
    if(this.data.changeAc[index]==e.currentTarget.dataset['index']){
      this.data.changeAc[index] = null
    }else{
      this.data.changeAc[index]=index
    }
    this.setData({
      // changeList:this.data.changeList,
      changeAc:this.data.changeAc
    })
    console.log(this.data.changeAc)
  },

  Down(){
    var imgs = []
    this.data.FenXiangImg.forEach((item)=>{
      imgs.push(item.image_url.replace(/^http:\/\//i,'https://'))
    })
    var check = []
    var checkNum = []
    this.data.changeAc.forEach(item=>{
      if(item != null){
        checkNum.push(item)
      }
    })
    if(checkNum == ''){
      DownloadSaveFile.downloadFiles('image',imgs); //video或image
    }else{
      this.data.changeAc.forEach(item=>{
        imgs.forEach((items,index)=>{
          if(item == index){
            check.push(items)
          }
        })
      })
      DownloadSaveFile.downloadFiles('image',check); //video或image
    }
    this.textPaste()
  },
  textPaste(){
    var that = this
    console.log(that.data.SpName)
    wx.setClipboardData({
      data: that.data.SpName+'---售价HK$'+that.data.myPrice,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data)
          }
        })
      }
    })
  },
  // tabNav
  // 求出折扣
  discount(){
    var goods = this.data.serverDatas
    var discount = []
    goods.forEach(item => {
      var discounts = item.mk_price/(item.sort_price/10)
      discount.push(discounts.toFixed(1))
    });
    this.setData({
      discount:discount
    })
  },
  /** onRefresh
   * 生命周期函数--监听页面加载 keywords keywords
   */
  onLoad: function (options) {
    this.setData({
      loading: true,
      options:options,
      brandINto:'z'+options.brand_id,
      goodsCate:options.goodsCate
    })
    console.log(options)
  },
  // 打开筛选抽屉
  tofiltrate(){
    var left = this.data.filtrateBoxLeft==(this.data.windowWidth)?0:(this.data.windowWidth)
    this.setData({
      filtrateBoxLeft:left
    })
    this.get_height();
  },
  cattab(){
    this.setData({
      filtrateBoxLeft:0
    })
  },
  /* 跳转 */
  _navto(e){
    getApp()._navto(e)
  },
  /* tabnav跳动 */
  tabNav:function(e){
    var index = e.currentTarget.dataset['index']
    if(index == 0){
      this.setData({
        scroll:this.data.brandINto
      })
    }
    this.setData({
      tabNavTop: e.currentTarget.offsetTop+17, // 这里加的是一个 leftList_item的高度/2减去tabnav高度的/2
      tabIndex:index,
      rightList:this.data.classify[index-1], // 右边的list 单独提取出来
    })
    // console.log(this.data.rightList)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGoodsList()
    this.getClassify()
    this.getBrand()
    this.refreshDatas()
    this.getCarNum()

  },
  getList: function(start, pageSize){
    var serverDatas = this.data.serverDatas
    var totalCount = serverDatas.length
    var list = new Array()
    var length = start * pageSize >= serverDatas.length ? serverDatas.length : start * pageSize // 加载的长度
    // 网list添加新加载的数据
    // console.log(serverDatas)
    for(var i=(start - 1) * pageSize; i<length; i++) {
      list.push(serverDatas[i])
    }
    var result = {
      totalCount: totalCount,
      list: list
    }
    // 返回出
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function(){
        resolve(result);
        clearTimeout(timer)
      }, 1000);
    });
  },
  // 上拉刷新
  refreshDatas: async function() {
    this.setData({
      loading:true,
    })
   setTimeout(()=>{
    this.getGoodsList()
    this.setData({
      loading: false,
    })
   },1000)
   console.log(this.data.loading)
  },
  onRefresh: function(e){
    this.refreshDatas()
  },
  onPulling(e){
    // console.log(123)
    
    // this.setData({
    //   loading:true,
    // })
  },
  onReachBottom: function(e) {
    var that = this
    var timer = setTimeout(function() {
      that.loadDatas()
      clearTimeout(timer)
    }, 500)
  },
  // 下拉加载
  loadDatas: async function() {
    // console.log(123)
    var size = this.data.goodsSize+=5
      this.setData({
        goodsSize:size
      })
      this.getGoodsList()
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(()=>{
        wx.hideLoading()
      }, 1000)
  },
   //取高度
   get_height: function(){
    var that = this
    var query = wx.createSelectorQuery();
    query.select('#nav_item').boundingClientRect()
    query.exec(function (res){
      if(res[0] != null){
        that.setData({
          nav_height: res[0].height,
        })
      }
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
  },
  touchmove: function(e){
    this.set_scroll(e)
  },
  touchend: function(){
    this.setData({
      hiddenn: true
    })
  },
  // 获取高度
  set_scroll: function(e){
    var page_y = e.changedTouches[0].pageY-this.data.height-20 // 这里减去145是缓解当时nav设置的padding的高度从而获得准确的idx
    var nav_height = +this.data.nav_height
    var idx = Math.floor(page_y/nav_height)
    var zimu = this.data.zimu_list[idx];
    if(this.data.scroll!=zimu && this.data.nav_text!=zimu){
      this.setData({
        scroll: zimu,
        nav_text: zimu,
        hiddenn: false
      })
      wx.vibrateShort()
      // console.log(zimu)
    }
  },

  
  // 时间戳转时间
  getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
  },
  // api
  getGoodsList(){
    var that = this
    var option = this.data.options
    option['size'] = this.data.goodsSize
    console.log(option)    
    util.post({
      url:'index.php/Smallapp/Index/goodsList',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      data:option,
      success:res=>{
        var goods = res.data.data.goodsList
        console.log(goods)

        if(goods==null){
          this.setData({
            goods:[],
            serverDatas:null
          })
        }else{
          goods.forEach(item => {
            this.getGoodsImg(item.goods_id,item)
          });
          this.setData({
            serverDatas:goods,
            goodsData:goods,
            goods:goods,
            goodlists:res.data.data,
          })
        }
       
        
      }
    })
  },
  /*goodsCate
   * 对多张图片进行预览
  */
  previewImg: function (e) {
    var goodsid = e.currentTarget.dataset['goodsid']
    var images = []
    var photos = this.data.goodsMax[goodsid];//是一个存放多张图片的数组
    photos.forEach(element => {
      images.push(element.image_url)
    });
    var src = e.currentTarget.dataset['item']
    wx.previewImage({
      current: src,     //当前图片地址
      urls: images,                 //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // swp自适应的高度
  swpInfo(e){
    var width = e.detail.width,    //获取图片真实宽度
         height = e.detail.height,
         ratio = width/height;    //图片的真实宽高比例
     var viewWidth = 110,
          viewHeight = 110/ratio;
      var image = this.data.ImgHeight; 
          image[e.target.dataset.index+ '&' +e.target.dataset.goodsid]={
            width:viewWidth,
            height:viewHeight
          }
      // console.log(image)
      this.setData({
        ImgHeight:image
      })
 },
  getGoodsImg(goodsid,item){
    // util.post({
    //   url:'index.php/Smallapp/Index/goods',
    //   header:{
    //     'whoareyou':1,
    //     'VPToken':getApp().getUserToken(),
    //     'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
    //   },
    //   data:{
    //     id:goodsid,
    //   },
    //   success:res=>{
    //     var goodsMax = this.data.goodsMax
    //     goodsMax[res.data.data.info.goods_id] = res.data.data.info.images
    //     this.setData({
    //       goodsMax:goodsMax,
    //     })
    //     // console.log(this.data.goodsMax)
    //   }
    // })

    wx.request({
      url: 'https://www.vpxyy.com/index.php/Smallapp/Index/goods',
      method: 'POST',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      data:{
        id:goodsid,
      },
      success:res=>{
        var goodsMax = this.data.goodsMax
        goodsMax[res.data.data.info.goods_id] = res.data.data.info.images
        this.setData({
          goodsMax:goodsMax,
        })
      }
    })
  },
  // 获取分类
  getClassify(){
    var that = this
    util.post({
      url:'index.php/Smallapp/Index/category',
      success:res=>{
        var lelist = []
        res.data.data.forEach((item,index)=>{
          lelist.push(item)
        })
        this.setData({
          classify:res.data.data,
          leftLIst:lelist,
          rightList:res.data.data[0].sub
        })
        // console.log(this.data.rightList)
      }
    })
  },
  // 获取品牌 sortDate
  getBrand(){
    var that = this
    util.post({
      url:'index.php/Smallapp/Index/brandList',
      success:res=>{
        // console.log(res)
        var brandsList = res.data.data.brandsList
        var recommend = res.data.data.recommend
        that.setData({
          brandsList:brandsList,
          recommend:recommend,
          brands:brandsList
        })
      }
    })
  },
  // 类型 goodsCate
  goodsCateIDs(e){
    var cateid = e.currentTarget.dataset['cateid']
    var tocate = null
    if(this.data.options.cate_id != cateid){
      var options = this.data.options
      options['cate_id'] = cateid
      tocate = true
      console.log(0)
      this.setData({
        topNum:0,
        goodsCate:this.data.rightList.id-1,
      })
    }else{
      var options = this.data.options
      options['cate_id'] = ''
      tocate = true
      console.log(1)
      this.setData({
        goodsCate:'',
        topNum:0,
      })
    }
    // console.log(this.data.tocate==true && this.data.goodsCate==0+1)
    this.setData({
      options:options,
      goodsCateID:cateid,
      tocate:tocate,
    })
    // console.log(this.data.goodsCate)
    this.getGoodsList()
    this.refreshDatas()
  },
  // 品牌
  brandIds(e){
    var brandid = e.currentTarget.dataset['brandid']
    console.log(this.data.options.cate_id,brandid)
    var tobrand
    var brandINto
    if(this.data.options.brand_id != brandid){
      var options = this.data.options
      options['brand_id'] = brandid
      console.log(options)
      tobrand=true
      brandINto = 'z'+brandid
    }else{
      var options = this.data.options
      options['brand_id'] = ''
      tobrand=false
      brandINto = ''
    }
    console.log(brandINto)
    this.setData({
      brandId:brandid,
      options:options,
      topNum:0,
      tobrand:tobrand,
      brandINto:brandINto
    })
    this.getGoodsList()
    this.refreshDatas()
  },
  // 排序 imgInfo
  sortDate(e){
    var options = this.data.options
    options['order'] = e.currentTarget.dataset['order']
    options['sort'] = e.currentTarget.dataset['leixin']

      this.setData({
        topNum:0,
        options:options,
      })
      this.getGoodsList()
      this.refreshDatas()
      var that = this
      setTimeout(() => {
        that.filtrateBlockTopTab()
      }, 500);
      console.log(this.data.options)
  },
  // 筛选
  goodsFiltrate(cateid,brandid){
    var data = this.data.serverDatas
    var catedata = []
    this.sorts()
    if(cateid!=null && brandid!=null){
      data.forEach(item=>{
        if(item.cate_id_two == cateid && item.brand_id == brandid){
          catedata.push(item)
        }
      })
    }else if(cateid==null && brandid==null){
      catedata = this.data.goodsData
    }else{
      data.forEach(item=>{
        if(item.cate_id_two == cateid || item.brand_id == brandid){
          catedata.push(item)
        }
      })

    }
    this.setData({
      serverDatas:catedata,
    })
    this.refreshDatas()
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

  toCarIndex(){
    wx.switchTab({
			url: '/pages/shoppingCart/index/index'
		})
  },

  // 搜索goods
  searchSubmit(){
    var options = this.data.options
    options['keywords'] = this.data.goodsname
    this.setData({
      options:options,
    })
    this.getGoodsList()
    // wx.navigateTo({
    //   url: '/pages/goods/goods_list/index?keywords='+this.data.goodsname,sort
    // })
  },

    /* input简约双向绑定 */
    bindcall(e){
      var brand = e.detail.value;
      var sousuo = {}
      var brandsList = this.data.brands
      for (const key in brandsList) {
        for (const keys in brandsList[key]){
          if (brandsList[key][keys].brand_name.toLowerCase().indexOf(brand.toLowerCase()) != -1) {
            // console.log(brandsList[key][keys].brand_name)
            sousuo[key] = brandsList[key]
            sousuo[key] = {}
            sousuo[key][keys] = brandsList[key][keys]
            sousuo[key][keys].brand_name = brandsList[key][keys].brand_name
            // console.log(sousuo)
          }
        }
      }
      // console.log(sousuo)
      this.setData({
        brandname:brand,
        brandsList:sousuo
      })
      if(brand == ''){
        this.setData({
          brandsList:this.data.brands
        })
      }
    },
    toStrip(e){
      if(getApp().getUserToken() == ''){
        this.setData({
          modalShow:true
        })
      }else{
        this.setData({
          toFenXiang:!this.data.toFenXiang,
          FenXiangImg:[],
          sizeIndex:{},
          SpName:e.currentTarget.dataset['spname'],
          myPrice:e.currentTarget.dataset['myprice'],
          toType:e.currentTarget.dataset['totype']
        })
        console.log(e)
        if(e.currentTarget.dataset['goodsid']){
          util.post({
            url:'index.php/Smallapp/Index/goods',
            header:{
              'whoareyou':1,
              'VPToken':getApp().getUserToken(),
              'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
            },
            data:{
              id:e.currentTarget.dataset['goodsid'],
            },
            success:res=>{
              // console.log(res.data)
              this.setData({
                FenXiangImg:res.data.data.info.images,
                changeAc:[],
                storehouseStockInfo:res.data.data.storehouseStockInfo,
              })
              console.log(this.data.storehouseStockInfo)
            }
          })
        }
      }
      
    },
    filtrateBlockTopTab(){
      if(this.data.filtrateBlockTop == -1000){
        this.data.filtrateBlockTop = 0
      }else{
        this.data.filtrateBlockTop = -1000
      }
      this.setData({
        filtrateBlockTop:this.data.filtrateBlockTop
      })
    },
    CutClassTab(){
      if(this.data.CutClass==true){
        this.data.CutClass = false
      }else{
        this.data.CutClass = true
      }
      this.setData({
        CutClass:this.data.CutClass
      })
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
  sizeSelect(e){

    var sizeIndex = this.data.sizeIndex
    var index = e.currentTarget.dataset['spaecid']
    var shid = e.currentTarget.dataset['shid']
    var cangindex = shid+'&'+index
    if(sizeIndex[cangindex] == cangindex){
      // sizeIndex[cangindex] = ''
      // console.log(1)
      delete sizeIndex[cangindex]
    }else{
      sizeIndex[cangindex] = cangindex
    }
    // console.log(sizeIndex)
    this.setData({
      sizeIndex:sizeIndex,
      goodsid:e.currentTarget.dataset['goodeid']
    })
  },
  isEmptyObject(obj){
    for (var key in obj){
      return false;//返回false，不为空对象
    }　　
    return true;//返回true，为空对象
  },
  addgoods(){
    if(this.isEmptyObject(this.data.sizeIndex)){
      util.showMessage('请选择尺码')
    }else{
      var sizeList = []
      for (const key in this.data.sizeIndex) {
        sizeList.push(this.data.sizeIndex[key].split('&')[1])
      }
      // console.log(sizeList)
      sizeList.forEach(item => {
        this.agCar(item,this.data.goodsid,1)
      });
    }
  },
  brandScrowInto(){
    console.log(123)
    this.setData({
      scroll:this.data.brandINto
    })
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