import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// 该js为统一处理,返回的接口均在此处做处理
// create an axios instance//创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url//api的基础url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout//请求超时时间
})

// request interceptor//request拦截,请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent//请求之前要做的事情

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      /**
       * 这里可以把每个请求都带上该请求头,非常方便
       * ['X-Token']为请求头所带的token,这里可以使用jwt来发送请求头
       */
      config.headers['X-Token'] = getToken()// 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // do something with request error//请求失败之后要处理的
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor//response拦截器,服务端响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  response => {
    //这里可以根据服务端自定义的响应code来判断请求结果和状态,从而自定义登录登出
/*    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      
      //中文
       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        })
      }


      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }*/
    // 根据自己的数据接口,自定义统一
    const res = response.data
    const result = res.data
    
    if(res.status=='fail'){
      Message({
        message: result.errorMessage || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    else {
      return res
    }
  },
  error => {//错误提示
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
