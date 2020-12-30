const Tool = require("./tool.js");
const auth_fun = true;
const getPhone_fun = true;
const userId = '';
var get_phone_url = "/wx/api/asset/tag/list"
var get_auth_url = "/wx/api/asset/tag/list"
var login_key = "userid"
var userinfo_key="userinfo"
var tool=new Tool();
var Auth = function () {
  /*-------------------------------------自定义登录状态 关联小程序openid、session_key----------------------*/
  this.login = function (that, succ, fail) {
    // var auth = new Auth();
    check_login(that, function (login_value) {
      succ(login_value);
    }, function (msg) {
      wxlogin(that, function (code) {
        req_send_code(that, code, function (login_value) {
          tool.setStorageSync(login_key, login_value);
          succ(login_value)
        }, function (msg) {
          fail(msg);
        })
      }, function (msg) {
        fail(msg);
      })
    })
  }


  /*----------------------------------------获取用户信息------------------------------------*/

  this.getuserinfo=function(that,iv,encryptedData,succ,fail){
    decrypt_data(that,iv,encryptedData,function(res){
      tool.setStorageSync(userinfo_key, res);
      succ(res);
    },function(msg){
      fail(msg)
    })
  }


  /*
小程序登录流程
a.必须要走 1.2.3步骤，实现小程序openid、session_key关联服务端用户。

b.获取、解码用户相关信息，必须包保证a完整
*/
  //1.检查本地Session是否过期，检查login_key是否过期。保证2个都不过期，则通过。
  var check_login = function (that, succ, fail) {
    wx.checkSession({
      success: (res) => {
        if (tool.getStorageSync(login_key) == '') {
          tool.vlog("1-2未过期。但是没有用户信息")
          fail(login_key + "未查到")
        } else {
          // console.log("1-2未过期。有用户信息 OVER")
          tool.vlog("1-2未过期。有用户信息 OVER");
          succ(tool.getStorageSync(login_key));
        }
      },
      fail() {
        console.log("1-2已过期。去授权")
        fail("已过期。去授权")
      }
    })
  }

  //2.重新获取本地Session，同时获取code用来下一步获取login_key对应的值。
  var wxlogin = function (that, succ, fail) {
    console.log("2-1开始授权。")
    wx.login({
      success(res) {
        if (res.code) {
          tool.vlog("2-2授权成功")
          succ(res.code)
        } else {
          tool.vlog("2-2授权失败")
          fail("未取得code");
        }
      },
      fail() {
        tool.vlog("2-2授权失败")
        fail("login 失败");
      }
    })
  }
  //3.根据code货物获取login_key对应的值
  var req_send_code = function (that, code, succ, fail) {
    tool.vlog("3-1开始推送Code")
    tool.get(get_auth_url, "", function (res) {
      tool.vlog("3-2推送Code成功，返回基本数据")
      succ("userId")
    }, function (msg) {
      tool.vlog("3-2推送Code失败")
      fail("上传code失败")
    }, function () {});
  }

  //4.根据login_key对应的值，获取用户信息
  var decrypt_data=function(login_value, iv, encryptedData, succ, fail) {
    tool.vlog("4-1开始获取用户信息")
    tool.get(get_phone_url, "", function (res) {
      tool.vlog("4-2获取用户信息成功")
      succ("获取用户信息成功")
    }, function (msg) {
      tool.vlog("4-2获取手机信息失败")
      fail("获取用户信息失败")
    }, function () {});
  }
}
module.exports = Auth