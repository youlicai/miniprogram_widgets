// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    loadStatus:'first',
    loadmore_status:'init',
    pull_data_size:0,
    refreshOver:'',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // loadData(this,'init')
    this.setData({
      url:"http://47.101.11.109:8008/wx/api/asset/tag/list?keywords=&pageSize=5&sign=&tagCode=&tagName=&userId=101&pageNum="
    })

    // this.setData({
    //   url:"eeee"
    // })
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

  loadmore:function(e){
    
    this.setData({
      // ['list[' + (page - 1) + ']']: newVal,
      list:this.data.list.concat(e.detail)
    })
  },
  refresh:function(e){
    this.setData({
      list:e.detail
    })
  },
  first_load:function(e) {
    this.setData({
      list:e.detail
    })
  }
})





