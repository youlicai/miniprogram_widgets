// 支持下拉刷新-上拉加载的组件
Component({
  options: {
    multipleSlots: true,
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  properties: {
    url: {
      type: String,
      value: ''
    }
  },
  data: {
    _page: 0,
    _page_size: 10,
    load_status: '', //first,loading,load_scu,load_fail,none,no_data
    loadmore_status: 'init', //init,loading,load_scu,load_fail,no_data
    _load_type: 'first', //first,pull,push
    refreshfinsh: true,
    refresh_data_size: 0,
    animationData: {},
  },
  observers: { //观察者：属性监听
    'load_status'(load_status) {
      if (load_status == 'first') {
        animation(this);
      }
    },
  },
  ready() {
    var that = this;
    this.setData({
      _load_type: 'first'
    })
    loaddata(this, function (res) {
      that.triggerEvent('first_load', res);
    }, function () {}, function () {});
  },
  methods: {
    _onRefresh: function (e) {
      var that = this;
      if (!(this.data.loadmore_status == "loading" || this.data.load_status == 'loading')) {
        console.log('_onRefresh');
        this.setData({
          _load_type: 'pull'
        })
        loaddata(this, function (res) {
          that.triggerEvent('refresh', res);
        }, function () {
          that.triggerEvent('refresh', []);
        }, function () {
          that.triggerEvent('refresh', []);
        });
      }
    },

    _onLoadMore: function (e) {
      var that = this;
      console.log('_onLoadMore');
      if (!(this.data.loadmore_status == "loading" || this.data.load_status == 'loading')) {
        this.setData({
          _load_type: 'push'
        })
        loaddata(this, function (res) {
          that.triggerEvent('loadmore', res);
        }, function () {

        }, function () {

        });

      }
    }
  },
})


function animation(that) {
  var animation = wx.createAnimation({
    duration: 100,
    timingFunction: 'ease',
  })
  var r = 10; //半径
  var num = 0; //变化幅度
  //连续动画关键步骤
  var interval;
  interval = setInterval(function () {
    if (that.properties.load_status != "first") {
      clearInterval(interval)
    }
    if (num > 360) {
      num = 0;
    }
    num = num + 10;
    var a = Math.sin(num * Math.PI / 180) * r;
    var b = Math.cos(num * Math.PI / 180) * r;
    animation.translate(a, b).step();
    that.setData({
      animationData: animation.export()
    })
  }.bind(this), 70)
}

function loaddata(that, succ, fail, no_data) {
  loadBefore(that);
  wx.request({
    url: that.properties.url + that.data._page,
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      if (res.data.rows != null && res.data.rows.length > 0) {
        loadSucc(that, res.data.rows.length);
        succ(res.data.rows);
      } else {
        noData(that)
        no_data()
      }
    },
    fail(msg) {
      loadFail(that)
      fail();
    }
  })
}

function loadBefore(that) {
  if (that.data._load_type == 'pull') {
    that.setData({
      load_status: 'loading',
      _page: 0
    })
  } else if (that.data._load_type == 'first') {
    that.setData({
      load_status: 'first',
      _page: 0
    })
  } else if (that.data._load_type == 'push') {
    that.setData({
      loadmore_status: 'loading',
      _page: that.data._page + 1
    })
  }
}

function loadSucc(that, size) {
  if (that.data._load_type == 'pull') {
    that.setData({
      load_status: 'load_scu',
      refreshfinsh: false,
      _page: 0,
      refresh_data_size: size
    })
  } else if (that.data._load_type == 'first') {
    that.setData({
      load_status: 'load_scu',
      _page: 0,
      refresh_data_size: size
    })
  } else if (that.data._load_type == 'push') {
    that.setData({
      loadmore_status: 'init',
      refresh_data_size: size
    })
  }
}

function loadFail(that) {
  if (that.data._load_type == 'pull') {
    that.setData({
      load_status: 'load_fail',
      refreshfinsh: false,
      _page: 0
    })
  } else if (that.data._load_type == 'first') {
    that.setData({
      load_status: 'load_fail',
      _page: 0
    })
  } else if (that.data._load_type == 'push') {
    that.setData({
      loadmore_status: 'loadmore_fail',
      _page: that.data._page - 1
    })
  }
}

function noData(that) {
  if (that.data._load_type == 'pull') {
    that.setData({
      load_status: 'no_data',
      refreshfinsh: false,
      _page: 0
    })
  } else if (that.data._load_type == 'first') {
    that.setData({
      load_status: 'no_data',
      _page: 0
    })
  } else if (that.data._load_type == 'push') {
    that.setData({
      loadmore_status: 'no_data',
      _page: that.data._page - 1
    })
  }
}