var host = "http://47.101.11.109:8008";
function get(action, req_data, doSucc, doFail, doComplete) {
  if (!(req_data == '' || req_data == null)) {
    try {
      var res = wx.getStorageSync('cur_wh')
      if (res) {
        req_data.whId = res['whId']
      }
    } catch (e) {
    }
    req_data.userId = 101
  }

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

function post(action, req_data, doSucc, doFail) {
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


function getbinddata(e,key_){
  for (const key in e.currentTarget.dataset) {
    if(key==key_){
      return e.currentTarget.dataset[key];
    }
  }
  return '';
}

function forward(path,data){
  var params='?';
  if(data!=null)
    for (var k in data) {
      params = params + k + "=" + data[k] + "&";
    }
  params = params.slice(0, params.length - 1);
  wx.navigateTo({
    url: path+params
  })
}

function getforwarddata(options,key_){
  for (const key in options) {
    if(key==key_){
      if(options[key]=='undefined'){
        return '';
      }
      return options[key];
    }
  }
  return '';
}


function back(index,data){
  var pages = getCurrentPages();
  var prevPage = pages[pages.length +(index-1)]; //上一个页面
  if(!(data==null||prevPage==null)){
    prevPage.setData({
      backdata: data
    })
  }
  wx.navigateBack({
    delta: -index,
  });
}

function getbackdata(){
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]; //当前页面
  if(currPage.data.backdata==undefined){
    return null;
  }
  return currPage.data.backdata;
}

function setStorageSync(key,value){
  try {
    wx.setStorageSync(key, value)
  } catch (e) { 
    console.log("setStorageSync fail");
  }
}

function getStorageSync(key){
  var value;
  try {
    value = wx.getStorageSync(key)
  } catch (e) {
    value='';
  }
  return value;
}

function removeStorageSync(key){
  try {
    wx.removeStorageSync('key')
  } catch (e) {
    console.log("removeStorageSync fail");
  }
}
module.exports.get = get;
module.exports.host = host;
module.exports.getbinddata = getbinddata;
module.exports.forward = forward;
module.exports.back = back;
module.exports.getbackdata = getbackdata;
module.exports.getforwarddata = getforwarddata;
module.exports.setStorageSync = setStorageSync;
module.exports.getStorageSync = getStorageSync;