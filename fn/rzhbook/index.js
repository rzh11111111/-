// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const doubanbook = require('doubanbook')
cloud.init()

async function getDoubanBook(isbn){
  const url = "https://search.douban.com/book/subject_search?search_text="+isbn
  let res = await axios.get(url)
  console.log(res.data)
  let reg = /window\.__DATA__ = "(.*)"/
  if(reg.test(res.data)){
    //第一个括号分组数据
    let searchData = doubanbook(RegExp.$1)[0]
    console.log(searchData)
    return searchData
  }else{
    return '111'
  }
}


// let bookinfo = await getDoubanBook('9787801093660')
// console.log(bookinfo)
// 云函数入口函数
//wx.cloud.callFunction的时候，就会执行这个main函数
exports.main = async (event, context) => {
  let {a,b,isbn}=event
  
  let bookinfo = await getDoubanBook(isbn)
  
  return {
    sum:a+b,
    title: bookinfo
  }



  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}