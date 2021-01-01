// 支持下拉刷新-上拉加载的组件
Component({
  options: {
    multipleSlots: true,
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  properties: {
    width:{
      type:Number,
      value:20
    },
    height:{
      type:Number,
      value:10
    },
    bg_color: {
      type: String,
      value: "#dfdfdf"
    },
    font_color:{
      type: String,
      value: "#666"
    },
    radius:{//round，square
      type: Number,
      value:1
    },
    total_num:{
      type:Number,
      value:10
    },
    init_txt:{
      type:String,
      value:'验证码'
    }

  },
  observers: { //观察者：属性监听
    'count'(count) {
      if (count == this.properties.total_num) {
        this.setData({
          is_init: true,
          _click_enable: true
        })
      } else {
        this.setData({
          is_init: false,
          _click_enable: false
        })
      }
    },
  },
  data: {
    count: 0, //total_num为init
    _click_enable: true
  },

  ready() {
    this.setData({
      count:this.properties.total_num
    })
  },
  methods: {
    click(e) {
      if (!this.data._click_enable) {
        return;
      }
      console.log("send");
      this.setData({
        is_init: false,
        _click_enable: false
      })
      var that = this;
      var interval = setInterval(function () {
        if (that.data.count == 1) {
          clearInterval(interval)
          that.setData({
            count: that.data.total_num,
          })
          return;
        }
        that.setData({
          count: that.data.count - 1,
        })
      }, 1000)
    }
  },
})