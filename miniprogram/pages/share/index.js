// miniprogram/pages/share/index.js
const util = require('../../util.js')
const DownloadSaveFile = require('../../downloadSaveFile.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '分享', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight-52-45, // 内容的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的宽度
    openSettingBtnHidden:false,
    data:[],
    noSet:null,
    shouYi:0, // 收益
    addPriceList:['不加价','+10%','+12%','+14%','+16%','自定义+'],
    togwc:false, // 选择画面弹出
    addPrices:null,
    custom:true,//自定义框
    addPriceXuan:false, // 选项框
    addpercent:0, // 加价的百分之
    myPrice:0, // 我的售价
    addType:null,
    changeList:[],
    changeAc:[],
    showImgHeight:{},
    modalShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsid:options.goodsid,
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
  onShow: function (){
    this.setData({
      shouYi:0
    })
    if(getApp().getUserToken() == ''){
      this.setData({
        modalShow:true
      })
    }else{
      this.shaerApi()
    }
  },
  modalBtn(e){
    if(e.detail.index==0){
      wx.navigateBack()
    }else if(e.detail.index==1){
      wx.navigateTo({
        url: '/pages/userLogin/login/index'
      })
    }
  },
  shaerApi(){
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
        console.log(res)
        this.setData({
          data:res.data.data,
          myPrice:res.data.data.info.mprice
        })
      }
    })
  },
  Down(){
    var imgs = []
    this.data.data.gallery.forEach((item)=>{
      imgs.push(item.image_url.replace(/^http:\/\//i,'https://'))
    })
    var check = []
    var checkNum = []
    this.data.changeAc.forEach(item=>{
      if(item != null){
        checkNum.push(item)
      }
    })
    console.log(checkNum)
    if(checkNum == ''){
      console.log(2)
      DownloadSaveFile.downloadFiles('image',imgs); //video或image
    }else{
      this.data.changeAc.forEach(item=>{
        imgs.forEach((items,index)=>{
          if(item == index){
            check.push(items)
          }
        })
      })
      console.log(1)
      DownloadSaveFile.downloadFiles('image',check); //video或image
    }
    this.textPaste()
  },
  textPaste(){
    var that = this
    wx.setClipboardData({
      data: this.data.data.info.goods_name+'---售价HK$'+this.data.myPrice,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data)
          }
        })
      }
    })
  },
   // 底部抽屉弹出
   toUp(e){
    var togwc = this.data.togwc==false?true:false
    console.log(this.data.noSet)
     if(e!=undefined){
      if(e.currentTarget.dataset['index']==0){
        this.setData({
          addPriceList:['不加价','+300','+500','+800','+1000','自定义+'],
          addType:e.currentTarget.dataset['index'],
        })
      }else{
        this.setData({
          addPriceList:['不加价','+10%','+12%','+14%','+16%','自定义+'],
          addType:e.currentTarget.dataset['index'],
        })
      }
      if(this.data.addTypy == e.currentTarget.dataset['index']){
        togwc = false
        if(this.data.noSet==0){
          util.showMessage('已设置整体')
        }else{
          util.showMessage('已设置百分比')
        }
      }
     }
     console.log(this.data.noSet)
    this.setData({
      togwc:togwc,
    })
      
  },
  cattab(){
    this.setData({
      togwc:true
    })
  },
  addPrice(e){
    var index = e.currentTarget.dataset['index']
    var type = e.currentTarget.dataset['type']
    this.setData({
      addPrices:index,
    })
    if(index==5){
      var custom = this.data.custom==false?true:false
      var addPriceXuan = this.data.addPriceXuan==false?true:false
      this.setData({
        custom:custom,
        addPriceXuan:addPriceXuan,
        addPrices:null,
      })
      console.log(custom)
    }
    if(type.match(/\d+/g)!=null){
      this.setData({
        addpercent:Number(type.match(/\d+/g)[0]),
        noSet:this.data.addType,
      })
    }else{
      this.setData({
        noSet:null,
        addTypy:null,
        addpercent:null,
      })
    }
    
  },
    /* input简约双向绑定 */
    bindcall(e){
      this.data.addpercent = e.detail.value;
      this.setData({
        addpercent:this.data.addpercent
      })
    },
    confirmAdd(){
      var price = this.data.data.info.mprice
      if(this.data.addType==1){
        var bfb = this.data.addpercent*0.01
        console.log(Number(price*bfb)+Number(price))
        console.log(this.data.addpercent)
        var addPrice = price*bfb
        var addt = null
        if(this.data.addpercent==null){
          addt = null
        }else{
          addt = 0
        }
        this.setData({
          myPrice:Number(price*bfb)+Number(price),
          shouYi:Number(price*bfb),
          addTypy:addt,
          togwc:false,
        })
      }else{
        price = Number(price)+Number(this.data.addpercent)
        var addt = null
        if(this.data.addpercent==null){
          addt = null
        }else{
          addt = 1
        }
        this.setData({
          myPrice:price,
          shouYi:Number(this.data.addpercent).toFixed(2),
          addTypy:addt,
          togwc:false,
        })
      }
      console.log(this.data.addTypy,123)
    },
    // 选择下载图片 默认全部
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
})