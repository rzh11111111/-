// mp/pages/me/me.js
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  insert() {
    db.collection('user').add({
      data: {
        name: 'jerry',
        age: 20
      }, //回调函数的写法，也可以then的promise写法
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  update() {
    db.collection('user').doc('8d1e75855e15944d003c1dc0349984e1').update({
      data: {
        age: 21
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  search() {
    db.collection('user').where({
      name: 'jerry'
    }).get().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  delete() {
    db.collection('user').doc('8d1e75855e15944d003c1dc0349984e1').remove().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  getOpenId(){
    wx.cloud.callFunction({
      name:'login',
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  batchDelete(){
    wx.cloud.callFunction({
      name:'batchDelete'
    }).then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  },
  upload(){
    wx.chooseImage({
      count:1,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success: function(res) {
        const temFilePaths = res.tempFilePaths
        console.log(temFilePaths)
        wx.cloud.uploadFile({
          cloudPath:new Date().getTime()+'.png',
          filePath: temFilePaths[0],
          success:res=>{
            console.log(res)
            db.collection('image').add({
              data:{
                fileID:res.fileID
              },
              success:res2=>{
                console.log(res2)
              },
              file:console.error
            })
          },fail:console.error
        })
      },
    })
  },
  getFile(){
    wx.cloud.callFunction({
      name:'login',
    }).then(res=>{
      db.collection('image').where({
        _openid:res.result._openid
      }).get().then(res2=>{
        console.log(res2)
        this.setData({
          images:res2.data
        })
      }).catch(console.error)
    }).catch(console.error)
  },
  downloadFile(event){
    wx.cloud.downloadFile({
      fileID:event.target.dataset.fileid,
      success:res=>{
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:res=>{
            wx.showToast({
              title: '保存成功',
            })
          },
          fail:console.error
        })
      },
      fail:console.error
    })
  },
  sconCode() {
    console.log('111')
    wx.scanCode({

      success: (res) => {
        console.log(res, res.result)
        wx.cloud.callFunction({
          name: 'rzhbook',
          data: {
            a: 5,
            b: 10,
            isbn: res.result,
          },
          success: (val) => {

            console.log(val.result)
          },
          fail: console.error
        })
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('准备好了me页面')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})