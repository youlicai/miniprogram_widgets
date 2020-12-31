var Tool = function () {
  var host = "http://47.101.11.109:8008";
  var enable_log = true;
  this.I = 0
  this.W = 1;
  this.E = 2;
  this.get = function (action, req_data, doSucc, doFail, doComplete) {
    var params = "";
    var k;
    for (k in req_data) {
      params = params + k + "=" + req_data[k] + "&";
    }
    if (params.length > 0) {
      params = params.slice(0, params.length - 1);
    }
    console.log(host + action + "?" + params)
    wx.request({
      url: host + action + "?" + params,
      header: {
        "content-type": "application/json;charset=utf-8"
      },
      method: "GET",
      timeout: 3000,
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
          if (res.data.rows == null) {
            doFail('未找到相关数据！');
          } else {
            doSucc(res.data);
          }
        } else {
          doFail(res.data.msg);
        }
      },
      fail: function (res) {
        doFail("请检查网络！" + res.errMsg);
      },
      complete() {
        doComplete();
      }
    })
  }

  this.post = function (action, req_data, doSucc, doFail) {
    var params = "";
    var k;
    for (k in req_data) {
      params = params + k + "=" + req_data[k] + "&";
    }
    if (params.length > 0) {
      params = params.slice(0, params.length - 1);
    }
    wx.request({
      url: host + action,
      header: {
        "content-type": "application/json;charset=utf-8"
      },
      data: req_data,
      method: "POST",
      success: function (res) {
        doSucc(res.data);
      },
      fail: function () {
        doFail();
      }
    })
  }


  this.get_page_value = function (e, key_) {
    for (const key in e.currentTarget.dataset) {
      if (key == key_) {
        return e.currentTarget.dataset[key];
      }
    }
    return '';
  }

  this.forward = function (path, data) {
    var params = '?';
    if (data != null)
      for (var k in data) {
        params = params + k + "=" + data[k] + "&";
      }
    params = params.slice(0, params.length - 1);
    wx.navigateTo({
      url: path + params
    })
  }

  this.get_forward_value = function (options, key_) {
    for (const key in options) {
      if (key == key_) {
        if (options[key] == 'undefined') {
          return '';
        }
        return options[key];
      }
    }
    return '';
  }


  this.back = function (index, data) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length + (index - 1)]; //上一个页面
    if (!(data == null || prevPage == null)) {
      prevPage.setData({
        backdata: data
      })
    }
    wx.navigateBack({
      delta: -index,
    });
  }

  this.get_back_data = function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    if (currPage.data.backdata == undefined) {
      return null;
    }
    return currPage.data.backdata;
  }

  this.setStorageSync = function (key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      vlog("setStorageSync fail"+e);
    }
  }

  this.getStorageSync = function (key) {
    var value;
    try {
      value = wx.getStorageSync(key)
    } catch (e) {
      value = '';
      vlog("getStorageSync fail"+e);
    }finally{
      return value;
    }
  }

  this.removeStorageSync = function (key) {
    try {
      wx.removeStorageSync('key')
    } catch (e) {
      vlog("removeStorageSync fail"+e);
    }
  }

  this.vlog = function (info, that = null, level = 0) { 
    if (enable_log) {
      var page = '****';
      if (that != null) {
        page = that.route;
      }
      switch (level) {
        case 0:
          console.log(page + ': ' + info);
          break
        case 1:
          console.warn(page + ': ' + info)
          break;
        case 2:
          console.error(page + ': ' + info);
          break;
        default:
          console.log(page + ': ' + info);
          break;
      }
    }
  }
}
module.exports = Tool;