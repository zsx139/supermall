Component({
  data: {
    "list1": [{
      "pagePath": "/pages/indexs/index/index",
      "text": "首页",
      "show":false,
      "iconPath": "../images/tabBar/home.png",
    },
    {
      "pagePath": "/pages/classify/index/index",
      "text": "分类",
      "show":false,
      "iconPath": "../images/tabBar/classify.png",
    },
    {
      "pagePath": "/pages/brand/index/index",
      "text": "品牌",
      "show":false,
      "iconPath": "../images/tabBar/brand.png",
    },
    {
      "pagePath": "/pages/shoppingCart/index/index",
      "text": "购物车",
      "show":false,
      "iconPath": "../images/tabBar/car.png",
    },
    {
      "pagePath": "/pages/my/index/index",
      "text": "我的",
      "show":false,
      "iconPath": "../images/tabBar/my.png",
    }
  ],
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url: url
      })
    },
  },
})