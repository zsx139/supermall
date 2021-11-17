// miniprogram/pages/my/add&amend-site/index.js inDetails
const util = require('../../../util.js')
const ssq = require('../../../ssq.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
   // 组件所需的参数
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '收货地址管理', //导航栏 中间的标题
    },
    height: getApp().globalData.height * 2 + 20 ,  // 此页面 页面内容距最顶部的距离
    contentHeight:getApp().globalData.contentHeight-41, // 内容的高度 -41是底部按钮的高度
    togwc:false,
    area:'',
    num:[1,2,3,4,5,6,7,8,9,10],
    usernames:undefined,
    userPhones:'',
    chenshi:[],
    shenShi:ssq.ssq.provinces.province[0].cities.city,
    shenqu:ssq.ssq.provinces.province[0].cities.city[0].areas.area,
    username:undefined,
    btnText:'保存',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    console.log(options)
    if(options.addrId){
      this.setData({
        addr_id:options.addrId,
        usernames:options.username,
        userPhones:options.userPhone,
        FAusernames:options.FAusername,
        FAuserPhones:options.FAuserPhone,
        inDetails:options.inDetails,
        btnText:'确认修改',
      })
    }else{
    }
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShow: function () {
    this.diQu()
    this.getSite()
  },
  getSite(){  
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
          console.log(this.data.userText)  
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
            success:res=>{
              console.log(res.data.data)
              res.data.data.forEach(item=>{
                if(item.addr_id == this.data.addr_id){
                  console.log(item)
                  // var dizhi = item.address.split('&')
                  
                  this.setData({
                    // area:dizhi[0],
                    inDetails:item.address
                  })
                }
              })
              
            }
          })
        }
      })
  },
  // 修改地址
  amend(){
    util.post({
      url:'index.php/Smallapp/Index/updateAddress',
      header:{
        'whoareyou':1,
        'VPToken':getApp().getUserToken(),
        'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
      },
      data:{
        addr_id:this.data.addr_id,
        consignee:this.data.usernames,
        phone_tel:this.data.userPhones,
        address:this.data.inDetails,
        fhr_name:this.data.FAusernames,
        fhr_phone:this.data.FAuserPhones,
      },
      success:res=>{
        console.log(res)
        util.showMessage(res.data.msg)
        wx.navigateBack()
      }
    })

  },
  username(e){
    this.data.usernames = e.detail.value;
    this.setData({
      usernames:this.data.usernames
    })
  },
  userPhone(e){
    this.data.userPhones = e.detail.value;
    this.setData({
      userPhones:this.data.userPhones
    })
  },
  FAusername(e){
    this.data.FAusernames = e.detail.value;
    this.setData({
      FAusernames:this.data.FAusernames
    })
  },
  FAuserPhone(e){
    this.data.FAuserPhones = e.detail.value;
    this.setData({
      FAuserPhones:this.data.FAuserPhones
    })
  },
  inDetail(e){
    this.data.inDetails = e.detail.value;
    this.setData({
      inDetails:this.data.inDetails
    })
  },
  // 底部抽屉弹出
  toUp(e){
    var togwc = this.data.togwc==false?true:false
      this.setData({
        togwc:togwc,
     })
  },
  // picker-view的变化
  bindChange(e){
    const val = e.detail.value
    this.setData({
      shenShi:this.data.chenshi[val[0]].cities.city,
      shenqu:this.data.chenshi[val[0]].cities.city[val[1]].areas.area,
      area:this.data.chenshi[val[0]].ssqname+'-'+this.data.chenshi[val[0]].cities.city[val[1]].ssqname+'-'+this.data.chenshi[val[0]].cities.city[val[1]].areas.area   [val[2]].ssqname,
      // inDetails:''
    })
    console.log(val)
  },
  // 切换默认
  changeAutoplay(e){

  },
  diQu(){
    console.log(ssq.ssq.provinces.province)
    this.setData({
      chenshi:ssq.ssq.provinces.province
    })
  },
  save(){
    console.log(this.data.area,this.data.inDetails,this.data.usernames)
    if(this.data.inDetails == undefined || this.data.usernames == undefined || this.data.FAusernames == undefined || this.data.FAuserPhones == undefined){
      util.showMessage('不能为空哦')
    }else{
      if(this.data.addr_id == undefined){
        util.post({
          url:'index.php/Smallapp/Index/myInfo',
          header:{
            'whoareyou':1,
            'VPToken':getApp().getUserToken(),
            'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
          },
          success:res=>{
            console.log(res.data.data.ucenter.user_id)
            util.post({
              url:'index.php/Smallapp/Index/saveAddress',
              header:{
                'whoareyou':1,
                'VPToken':getApp().getUserToken(),
                'content-type': 'application/x-www-form-urlencoded' //将请求参数转为form-data格式
              },
              data:{
                user_id:res.data.data.ucenter.user_id,
                consignee:this.data.usernames,
                phone_tel:this.data.userPhones,
                address:this.data.inDetails,
                fhr_name:this.data.FAusernames,
                fhr_phone:this.data.FAuserPhones,
              },
              success:res=>{
                console.log(res)
                util.showMessage('保存成功')
                wx.navigateBack()
              }
            })
          }
        })
        console.log(123)
      }else{
        this.amend()
      }
      
    }
  }
})