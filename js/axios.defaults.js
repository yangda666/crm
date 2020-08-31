axios.defaults.baseURL = "http://127.0.0.1:8888";

axios.defaults.withCredentials = true

//数据以表单形式传递给服务器
axios.defaults.headers['Content-Type'] = "application/x-www-form-urlencoded";


axios.defaults.transformRequest = function(data){
    if(!data) return data;
    let result = ``;
    for(let attr in data){
        if(!data.hasOwnProperty(attr)) break;
        result += `&${attr}=${data[attr]}`;
    }
    return result.substring(1)
}

//配置请求拦截器
axios.interceptors.request.use(config=>{
    return config
})
//配置响应拦截器
axios.interceptors.response.use(response=>{
    return response.data
},reason=>{
    if(reason.response){
        switch (String(reason.response.status)) {
            case "404":
                alert("当前请求地址不存在")
                break;
            default:
                break;
        }
    }
    return Promise.reject(reason);

})