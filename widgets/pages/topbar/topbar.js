// 支持下拉刷新-上拉加载的组件
Component({
  options: {
    multipleSlots: true,
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  properties: {
    left_close:{
      type:Boolean,
      value:false
    },
    show_left_img:{
      type:Boolean,
      value:true
    },
    show_left_text:{
      type:Boolean,
      value:true
    },
    left_text:{
      type:String,
      value:"返回"
    },
    center_text:{
      type:String,
      value:"你好我的Top"
    },
    bg_color:{
      type:String,
      value:"red"
    }
  },
  observers: { //观察者：属性监听
    'show_left_img'(show_left_img) {
      if (show_left_img == false) {
        this.setData({
          navbar_width:1.2
        })
      }else{
        this.setData({
          navbar_width:1.6
        })
      }
    },
  },
  data: {
    statusbar_height:0,
    navbar_height:0,
    navbar_width:1.6
  },

  ready() {
    const res = wx.getSystemInfoSync()
    var statusbarH = res.statusBarHeight
    this.setData({
      statusbar_height :statusbarH,
      navbar_height:wx.getMenuButtonBoundingClientRect().bottom-res.statusBarHeight+(wx.getMenuButtonBoundingClientRect().top-res.statusBarHeight)*2
    })
  },
  methods: {
    left_click(){
      this.triggerEvent('left_click');
    }
  },
})


