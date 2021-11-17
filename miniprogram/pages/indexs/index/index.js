// miniprogram/pages/index/index.js goodsWidth
const config = require('../../../config.js')
const DownloadSaveFile = require('../../../downloadSaveFile.js')
const util = require('../../../util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'VERY PEFECT', //导航栏 中间的标题
      scrollTop:0
    },
    height: getApp().globalData.height * 2 + 10,  // 此页面 页面内容距最顶部的距离
    width:getApp().globalData.windowWidth, // 视口宽度
    tabNavLeft:0, // tabNav的left值
    tabwth:0, // 每个tab选项的宽度
    dataList:[],
    tabIndex:0,
    imgList:[
      '../../../images/swp/swp.png',
      '../../../images/swp/swp.png',
      '../../../images/swp/swp.png',
      '../../../images/swp/swp.png',
    ],
    select:0, // swp的index 
    channel:[],
    imageSize:[],
    swpHeight:0, // swp的高度
    goodsWidth:0,
    getContactQr:getApp().getcallService(),
    keFuCode:true,
    imgHeight:{},
    imgHeightTJ:{},
    modalShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(getApp().getUserToken())
    // var 
    util.post({
      url:'index.php/Smallapp/Index/getContactQr',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
       },
      success:res=>{
        console.log(res)
        this.setData({
          getContactQr: res.data
        })
      }
    })
    wx.showShareMenu({
      menus: ['shareAppMessagewx', 'shareTimeline'],
      withShareTicket:true
    });
  },
   // 添加img自适应的高度
   imgInfo(e){
    var width = e.detail.width,    //获取图片真实宽度
         height = e.detail.height,
         ratio = height/width;    //图片的真实宽高比例
     var viewWidth = 140/ratio,           
          viewHeight = 140;   
      var image = this.data.imgHeight; 
          image[e.target.dataset.index]={
            width:viewWidth*2,
            height:viewHeight*2
          }
      this.setData({
        imgHeight:image
      })
      // console.log(this.data.imgHeight)
  },
  imgInfoTJ(){
    var width = e.detail.width,    //获取图片真实宽度
         height = e.detail.height,
         ratio = height/width;    //图片的真实宽高比例
     var viewWidth = 140/ratio,           
          viewHeight = 140;   
      var image = this.data.imgHeightTJ; 
          image[e.target.dataset.index] = {
            width:viewWidth*2,
            height:viewHeight*2
          }
      this.setData({
        imgHeightTJ:image
      })
      // console.log(this.data.imgHeight)
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
  onPageScroll (e) { 
    this.data.navbarData.scrollTop = e.scrollTop
    this.setData({
      navbarData:this.data.navbarData
    })
  },
  // swp 的index改变
  activeSw(e){
    let {current, source} = e.detail
    // console.log(current, source,e.detail)
    if(source === 'autoplay' || source === 'touch') {
    //根据官方 source 来进行判断swiper的change事件是通过什么来触发的，autoplay是自动轮播。touch是用户手动滑动。其他的就是未知问题。抖动问题主要由于未知问题引起的，所以做了限制，只有在自动轮播和用户主动触发才去改变current值，达到规避了抖动bug
      this.setData({
        select: current
      })
    }
  },
  bindchangeSwiper(e){
    this.setData({
      select: e.detail.current
    })
  },
  /* 头部切换的小红标的tabnav跳动 */
  tabNav:function(e){
    this.setData({
      tabNavLeft: e.currentTarget.offsetLeft+this.data.tabwth/2-7,
      tabIndex:e.currentTarget.dataset['index'],
      channel:this.data.dataList[Number(e.currentTarget.dataset['index'])],
    })
    console.log(this.data.channel)
  },
    /* 跳转 */
    _navto(e){
      getApp()._navto(e)
    },
    swpNavto(e){
      var url = '/pages/goods/goods_list/index?'
      var data = e.currentTarget.dataset['filter']
      console.log(data)
      for (const key in data){
        url = url + key + '=' + data[key] + '&'
      }
      console.log(url)
      wx.navigateTo({
        url: url
      })
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
    // 底部tabBar的变化
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      var list = this.getTabBar().data.list1
      list[0].iconPath='../images/tabBar/toHome2.png'
      list[0].show=true
      this.getTabBar().setData({
        list1:list
      })
    }
    // 判断是否登录
    util.login()
    if(getApp().getUserToken() == ''){
      this.setData({
        modalShow:true
      })
    }else{
      this.setData({
        modalShow:false
      })
    }
    this.apiIndex()
    var option = {
      active_tag:3
    }
    util.post({
      url:'index.php/Smallapp/Index/goodsList?active_tag=3',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      // data:option,
      success:res=>{
        console.log(res)
      }
    })
  },
  modalBtn(e){
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
  // 请求
  apiIndex(){
    var that = this
    wx.request({
      url: 'https://www.vpxyy.com/index.php/Smallapp/Index/index',
      method: 'POST',
      header: {
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        // 'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      success:res=>{
        console.log(res)
        if(res.data.data == undefined){
          wx.showModal({
            title: 'VERY PEFECT',
            content: '系统仅对会员开放，请先登录或注册成为会员。',
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
          let clientWidth = that.data.width;	// 获取可使用窗口宽度
          var tabwth = clientWidth/res.data.data.channel.length// 算出每个tab选项的宽度
          that.setData({
            dataList:res.data.data.channel[0],
            channel:res.data.data.channel[0],
            tabNavLeft: tabwth/2-7,
            tabwth:tabwth,
            goodsWidth:that.data.width/2.8
          })
      }
    })

    // util.post({
    //   url:'index.php/Smallapp/Index/index',
    //   header:{
    //     'whoareyou':1,
    //     'VPToken':getApp().getUserToken(),
    //     'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
    //   },
    //   success:res=>{
    //     console.log(res)
    //     if(res.data.data == undefined){
    //       wx.showModal({
    //         title: 'VERY PEFECT',
    //         content: '系统仅对会员开放，请先登录或注册成为会员。',
    //         success (res) {
    //           if (res.confirm) {
    //             wx.navigateTo({
    //               url: '/pages/userLogin/login/index',
    //             })
    //           } else if (res.cancel) {
    //           }
    //         }
    //       })
    //     }
    //       let clientWidth = that.data.width;	// 获取可使用窗口宽度
    //       var tabwth = clientWidth/res.data.data.channel.length// 算出每个tab选项的宽度
    //       that.setData({
    //         dataList:res.data.data.channel[0],
    //         channel:res.data.data.channel[0],
    //         tabNavLeft: tabwth/2-7,
    //         tabwth:tabwth,
    //         goodsWidth:that.data.width/2.8
    //       })
    //   }
    // })
  },
  // swp自适应的高度
  swpInfo(e){
    var biLi = this.data.width/e.detail.width
    this.setData({
      swpHeight:e.detail.height*biLi,
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
    // 下载
    Down(){
      DownloadSaveFile.downloadFile('image', this.data.getContactQr.data.img_qr); //video或image
      this.toKeFu()
    },
    
})