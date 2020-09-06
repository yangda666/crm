$(function(){
    //实现数据回显
    let customerId = null;
    let params = window.location.href.getQueryVariable("id")
    console.log(params);
    if(params != false){
        customerId = params;
        //调用方法实现数据回显
        getBaseInfo()
    }
    //实现数据回显方法
    async function getBaseInfo() {
        let result = await axios.get("/customer/info", {
            params: {
                customerId
            }
        })
        if (result.code === 0) {
            result = result.data;
            console.log(result);
            $(".username").val(result.name),
            result.sex == 0 ? $("#man").prop('checked', true) : $("#woman").prop('checked', true);
            $(".useremail").val(result.email),
            $(".userphone").val(result.phone),
            $(".userqq").val(result.QQ),
            $(".userweixin").val(result.weixin),
            $(".ctype").val(result.type),
            $("textarea").val(result.address)
            return;
        }
        alert("编辑不成功，可能网络不给力")
        customerId = null;
    }

    //用户名检验函数
    function checkName(){
        let val = $(".username").val().trim()
        if(val.length === 0){
            // console.log($("span"));
            $(".spanusername").html("小可爱我不知道你是谁")
            return false;
        }
        //客户名必须填写真实
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanusername").html("名字必须2~10个汉字或者英文名 ")
            return false;
        }
        $(".spanusername").html("姓名ok")
        return true;
    }
    function checkEmail(){
        let val = $(".useremail").val().trim();
        if (val.length === 0) {
            $(".spanEmail").html("此为必填项")
            return false;
        }
        if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val)) {
            $(".spanEmail").html("请填写邮箱")
            return false;
        }
        $(".spanEmail").html("yangdada帅")
        return true;
    }
    function checkPhone() {
        let val = $(".userphone").val().trim();
        if (val.length === 0) {
            $(".spanTel").html("此选项为必填项")
            return false;
        }
        if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val)) {
            $(".spanTel").html("请填入正确的电话")
            return false;
        }
        $(".spanTel").html("你gio,我的gio，gio~~")
        return true;
    }
    function checkQQ() {
        let val = $(".userqq").val().trim();
        if (val.length === 0) {
            $(".spanQQ").html("此选项为必填项")
            return false;
        }
        if (!/^[1-9][0-9]{4,14}$/.test(val)) {
            $(".spanQQ").html("请填入正确的qq号")
            return false;
        }
        $(".spanQQ").html("你gio,我的gio，gio~~")
        return true;
    }
    function checkweixin() {
        let val = $(".userweixin").val().trim();
        if (val.length === 0) {
            $(".spanweixin").html("此选项为必填项")
            return false;
        }
        if (!/^[a-zA-Z][a-zA-Z\d_-]{5,19}$/.test(val)) {
            $(".spanweixin").html("请填入正确的微信号")
            return false;
        }
        $(".spanweixin").html("你gio,我的gio，gio~~")
        return true;
    }
    function checkaddress(){
        let val = $("textarea").val().trim();
        if(val.length === 0){
            $(".spanAddress").html("请填写您的地址")
            return false;
        }
        return true;
    }
    //失去焦点对数据进行校验
    $(".username").blur(checkName);    
    $(".useremail").blur(checkEmail);
    $(".userphone").blur(checkPhone);
    $(".userqq").blur(checkQQ);
    $(".userweixin").blur(checkweixin);
    $("textarea").blur(checkaddress);

    //添加提交数据
    $(".submit").click(async function(){

        if (!checkName() || !checkPhone() || !checkEmail() || !checkQQ() || !checkweixin() || !checkaddress){
            alert("你填写的数据不合法")
            return
        }

        let params = {
            name: $(".username").val(),
            sex: $("#man").prop("checked") ? 0 : 1,
            email: $(".useremail").val().trim(),
            phone: $(".userphone").val().trim(),
            QQ:$(".userqq").val().trim(),
            weixin: $(".userweixin").val().trim(),
            type:$(".ctype").val().trim(),
            address:$("textarea").val().trim()
        }
        //实现修改
        if(customerId){
            params.customerId = customerId
            let result = await axios.post("/customer/update",params)
            if(result.code === 0){
                alert("修改数据成功");
                window.location.href = "customerlist.html"
                return;
            }
            alert("网络不给力，稍后再试")
            return;
        }

        //实现新增
        let result = await axios.post("/customer/add", params)
        if (result.code === 0) {
            alert("添加客服成功");
            window.location.href = "customerlist.html";
            return
        }
        alert("添加失败请重试")
    })
    
})