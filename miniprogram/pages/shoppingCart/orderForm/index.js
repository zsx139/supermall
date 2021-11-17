// miniprogram/pages/shoppingCart/orderForm/index.js
const util = require('../../../util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title:'订单', //导航栏 中间的标题 checkedGoodsList
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight, // 内容的高度
    windowWidth:getApp().globalData.windowWidth, // 内容的高度
    discounts:'请选择支付方式', // 优惠劵
    KuaiDi:'请选择', // 快递
    togwc:false,
    toKuaiDi:false,
    order:{},
    KuaiDiList:[],
    addressList:[],
    discountList:[],
    YunFei:'请选择快递方式',
    orderPrice:'请先选择快递方式',
    DiZhi:'',
    site:'',
    imageSize:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    console.log(options.payForTheOrder)
    this.setData({
      payForTheOrder:options.payForTheOrder,
      orderid:options.orderid
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
  orderItem(){
    util.post({
        url:'index.php/Smallapp/Index/getOrderDetail',
        header:{
          'whoareyou':1,
          'VPToken':getApp().getUserToken(),
          'content-type':'application/x-www-form-urlencoded' //将请求参数转为form-data格式 
        },
        data:{
          order_id: this.data.orderid,
        },
        success:res=>{
          console.log(res)
          var order = this.data.order
          order.actualPrice = res.data.data.goods_amount
          order.orderTotal = res.data.data.order_amount
          var goodsNum = 0
          res.data.data.goods.forEach(item=>{
            goodsNum = goodsNum+Number(item.goods_number)
            item.quantity = item.goods_number
          })
          this.setData({
            site:res.data.data,
            checkedGoodsList:res.data.data.goods,
            KuaiDi:res.data.data.ship_name,
            discounts:res.data.data.payment_name,
            order:order,
            goodsNum:goodsNum,
            YunFei:res.data.data.ship_fee,
            orderPrice:'HK$' + res.data.data.order_amount
            // orderPrice:,
          })
          console.log(this.data.checkedGoodsList)

        }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(Number('HK$0'))
    console.log(wx.getStorageSync('siteid'))
    if(this.data.orderid == undefined){
      this.getOrder()
      this.setData({
        DiZhi:wx.getStorageSync('siteid')
      })
      if(wx.getStorageSync('siteid')!=''){
        this.getDiZhi()
      }
      console.log('zf')
    }
    if(this.data.orderid != undefined){
      console.log('dd')
      this.orderItem()
    }
    // console.log(this.data.order.orderTotal)
  },
  // 底部抽屉弹出 getOrderDetail
  toUp(e){
    if(this.data.shippingId==undefined){
      util.showMessage('请选择快递方式')
    }else if(this.data.site==''){
      util.showMessage('请选择收货地址')
    }else{
      console.log(e.currentTarget.dataset['type'])
      var togwc = this.data.togwc==false?true:false
      this.setData({
      togwc:togwc
    })
    }
    
  },
  // 单选框的变化
  radioChange(e){
     var discounts = e.detail.value.split('-')
    this.setData({
      discounts:discounts[0],
      zhoFuId:discounts[1]
    })
  },
  _navto(e){
    getApp()._navto(e)
  },
  //api
  getOrder(){
    util.post({
      url:'index.php/Smallapp/Order/checkout',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式 
      },
      success:res=>{
        console.log(res)
        if(res.data.data.checkedGoodsList==null){
          wx.showModal({
            title: '提示',
            content: '购物车里没有商品哦',
            success (res) {
              if (res.confirm) {
                wx.navigateBack()
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        }
        var car = []
        var goodsNum = 0
        if(res.data.data.checkedGoodsList != null){
          res.data.data.checkedGoodsList.forEach(item=>{
            goodsNum = goodsNum+Number(item.quantity)
            if(item.quantity != '0' || item.quantity != 0){
              car.push(item)
            }
          })
        }
        var paymentId = []
        res.data.data.paymentList.forEach((item,index)=>{
          if(item.payment_name == "微信支付(小程序端)" || item.payment_name == '余额支付'){
            paymentId.push(item)
          }
        })
        paymentId.forEach(item=>{
          if(item.payment_name == '微信支付(小程序端)'){
            item.payment_name = '微信支付'
          }
        })
        var order = res.data.data
          order.actualPrice = res.data.data.goodsTotalPrice
          order.orderTotal = res.data.data.orderTotalPrice
        this.setData({
          checkedGoodsList:car,
          order:order,
          orderTotal:res.data.data.orderTotalPrice,
          goodsAmount:res.data.data.goodsTotalPrice,
          paymentId:paymentId,
          goodsNum:goodsNum
          // orderTotalPrice:res.data.data.orderTotalPrice
        })
        console.log(this.data.paymentId)
      }
    })
  },
  toKuaiDiUp(){
    var toKuaiDi = this.data.toKuaiDi==false?true:false
    this.setData({
      toKuaiDi:toKuaiDi,
      KuaiDiList:this.data.order.shippingList
    })
    console.log(this.data.KuaiDiList)
  },
  radioChangeKuaiDi(e){
    var lis = e.detail.value.split('-')
    this.setData({
      KuaiDi:lis[0],
      YunFei:Number(lis[1]),
      shippingId:lis[2],
      orderPrice:'HK$'+(this.data.order.orderTotal+Number(lis[1]))
    })
    console.log(lis)
  },
  toIndex(){
    this.setData({
      togwc:false,
      toKuaiDi:false,
    })
  },
  getDiZhi(){
    var that = this
    util.post({
      url:'index.php/Smallapp/Index/myInfo',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        that.setData({
          userText:res.data
        })
        // console.log(this.data.userText)  
        util.post({
          url:'index.php/Smallapp/Index/addressList',
          header:{
            'whoareyou':1,
            'VPToken':getApp().getUserToken(),
            'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
          },
          data:{
            user_id:this.data.userText.data.ucenter.user_id
          },
          success:ress=>{
            // console.log(res) 
            this.setData({
              addressList:ress.data.data
            })
            console.log(this.data.addressList,this.data.DiZhi)
            this.data.addressList.forEach((item)=>{
              if(item.addr_id==this.data.DiZhi){
                this.setData({
                  site:item,
                  addressId:item.addr_id,
                })
                console.log(this.data.site)
              }
            })
          }
        })
      }
    })
  },
    // 添加img自适应的高度 brandIds
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
  buybuy:function(){
    var that=this;
    // var http = getApp();
    // var openid = http.globalData.openid;
    // var url = http.globalData.url;
    wx.requestPayment({
      timeStamp: that.data.timeStamp,
      nonceStr: that.data.nonceStr,
      package: 'prepay_id=' + that.data.package,
      signType: 'MD5',
      paySign: that.data.paySign,
      success: function (res) {
        console.log('支付成功');
      },
      fail:function(res){
        console.log(res);
      },
      complete:function(res){
        console.log(res);
      }
    })
  },
  // 支付
  ZhiFu(){
    // console.log(shipping_fee,payment_id,Number(goods_amount),shipping_id)
    console.log(this.data.zhoFuId)
    wx.vibrateShort()
    if(this.data.zhoFuId == undefined){
      util.showMessage('请选择支付方式')
    }else{
      var datas = this.data.site
      datas['payment'] = this.data.zhoFuId
      datas['shipping'] = this.data.shippingId
      datas['shipFee'] = this.data.YunFei
      datas['goodsAmount'] = this.data.goodsAmount
      console.log(datas)
      if(datas['payment'] == '28'){
        util.post({
          url:'index.php/Smallapp/Order/gethipoWxMiniPayParam',
          header:{
            'whoareyou':1,
            'VPToken':getApp().getUserToken(),
          },
          data:datas,
          success:res=>{
            console.log(res)
            if(res.data.param==undefined){
              util.showMessage(res.data.msg)
            }
            wx.requestPayment({
              timeStamp: res.data.param.data.response.prepay_params.timeStamp,
              nonceStr: res.data.param.data.response.prepay_params.nonceStr,
              package: 'prepay_id='+res.data.param.data.response.prepay_params.prepay_id,
              signType: res.data.param.data.response.prepay_params.signType,
              paySign: res.data.param.data.response.prepay_params.paySign,
              success (res) {
                util.showMessage('支付成功！')
                wx.navigateTo({
                  url: '/pages/my/allOrder/index?index=0',
                })
              },
              fail (res) {
                util.showMessage('支付失败！')
              }
            })
          }
        })
      }else if(datas['payment'] == '16'){
        console.log(datas)
        util.post({
          url:'index.php/Smallapp/Order/orderSubmit',
          header:{
            'whoareyou':1,
            'VPToken':getApp().getUserToken(),
          },
          data:{
            "addressId": datas.addr_id,
            "shippingId": this.data.shippingId,
            "paymentId": datas.payment,
            "goodsAmount": datas.goodsAmount,
            "orderTotal": datas.goodsAmount,
            "shipFee": datas.shipFee
          },
          success:res=>{
            console.log(res)
            util.showMessage(res.data.msg)
            if(res.data.data.order_id != '0'){
              wx.navigateTo({
                url: '/pages/my/allOrder/index?index=0',
              })
            }
          }
        })
      }
      
    }
  },
  QuXiao(){
    wx.navigateBack({
      delta: 1,
    })
  }
})