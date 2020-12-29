const tool = require("./tool.js");
const auth_fun = true;
const getPhone_fun = true;
const userId = '';
var get_phone_url="/wx/api/asset/tag/list"
var get_auth_url="/wx/api/asset/tag/list"

//一、
function getPhoneNumber(e) {
  if (e.detail.errMsg == 'getPhoneNumber:ok') {
    phone(this, e.detail.iv, e.detail.encryptedData);
  }
}

function phone(that,iv, encryptedData,succ,fail){
  checkAuth(that,function(res){
    succ(res);
  },function(){
    login(that,function(code){
      req_send_code(code,function(userId){
        req_send_aesphone(userId,iv, encryptedData,function(res){
          succ(res)
        },function(msg){
          fail(msg)
        })
      },function(msfg){
        fail(msg)
      })
    },function(msg){
      fail(msg)
    })
  })
}

function auth(that,succ,fail){
  checkAuth(that,function(res){
    succ(res);
  },function(){
    login(that,function(code){
      req_send_code(code,function(res){
        succ(res)
      },function(msfg){
        fail(msg)
      })
    },function(msg){
      fail(msg)
    })
  })
}

function checkAuth(that,succ,fail){
  console.log("1开始检测授权是否过期。")
  wx.checkSession({
    success: (res) => {
      if (get_user("iphone")=='') {
        console.log("1-2未过期。但是没有用户信息")
        fail("iphone未查到")
      }else{
        console.log("1-2未过期。有用户信息 OVER")
        succ(get_user("iphone"));
      }
    },
    fail(){
      console.log("1-2已过期。去授权")
      fail("已过期。去授权")
    }
  })
}

function login(that, succ, fail) {
  console.log("2-1开始授权。")
  wx.login({
    success(res) {
      if (res.code) {
        console.log("2-2授权成功")
        succ(res.code)
      } else {
        console.log("2-2授权失败")
        fail("未取得code");
      }
    },
    fail() {
      console.log("2-2授权失败")
      fail("login 失败");
    }
  })
}

function req_send_code(code, succ, fail) {
  console.log("3-1开始推送Code")
  tool.get(get_auth_url, "", function (res) {
    console.log("3-2推送Code成功，返回基本数据")
    succ("推送Code成功，返回基本数据")
    
  }, function (msg) {
    console.log("3-2推送Code失败")
    fail("上传code失败")
  }, function () {});
}

function req_send_aesphone(userId, iv, encryptedData, succ, fail) {
  console.log("4-1开始获取用户手机号")
  tool.get(get_phone_url, "", function (res) {
    console.log("4-2获取用户手机号成功")
    succ("获取用户手机号成功")

  }, function (msg) {
    console.log("4-2获取手机信息失败")
    fail("获取手机信息失败")

  }, function () {});
}



function get_user(key) {
  return tool.getStorageSync(key) ;
}

function save_user(key, value) {
  tool.setStorageSync(key, value)
}

module.exports.phone = phone;
module.exports.auth = auth;