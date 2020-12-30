// pages/test2/test2.js
const Auth=require("../../utils/auth.js");
const Tool=require("../../utils/tool.js");
var tool=new Tool();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    tool.vlog("tt",this);

    // var object={}
    // object.test1="1";
    // object.test2="2";
    // object.test2="3";
    // tool.setStorageSync("test", object);

    var auth=new Auth();
    auth.login(this,function(res){
      tool.vlog("客户端获取到"+res)
    },function(msg){
      tool.vlog(msg+'dddd')
    });

    // auth.auth(this,function(res){
    //   console.log("客户端获取到"+res)
    //   tool.setStorageSync("iphone",res)
    // },function(msg){
    //   console.log(msg)
    // });
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})