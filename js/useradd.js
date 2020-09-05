$(function(){
    
    let userId = null;
    let params = window.location.href.getQueryVariable("id");
    // console.log(params);
    if(params != false){
        userId = params;
        console.log(userId);
        getBaseInfo()
    }
    //实现编辑的数据回显
    async function getBaseInfo(){
        let result = await axios.get("/user/info",{
            params:{userId}
        })
        if(result.code === 0){
            result = result.data;
            // console.log(result);
            $(".username").val(result.name);
            result.sex == 0 ? $("#man").prop('checked',true):$("#woman").prop('checked',true);
            $(".useremail").val(result.email)
            $(".userphone").val(result.phone)
            $(".userdepartmen").val(result.departmentId)
            $(".userjob").val(result.jobId)
            $(".userdesc").val(result.desc);
            return;
        }
        alert("编辑不成功，可能网络不给力")
        userId = null;
    }
    // console.log( window.location.href);
    //初始化部门和职务
    initDeptAndJob();
    async function initDeptAndJob(){
        let departmentData = await queryDepart();
        let jobData = await queryJob();
        // console.log(departmentData);
        // console.log(jobData);
       
        if (departmentData.code === 0){
            departmentData = departmentData.data;
            // console.log(departmentData);
            let str = ``;
            departmentData.forEach(item => {
                str +=`<option value="${item.id}">${item.name}</option>`
            });
            $(".userdepartment").html(str);
        }
        if(jobData.code === 0){
            jobData = jobData.data;
            let str = ``;
            jobData.forEach(item=>{
                str += `<option value="${item.id}">${item.name}</option>`
            })
            $(".userjob").html(str);
        }
    }
    //name校验函数
    function checkName() {
        let val = $(".username").val().trim();
        if (val.length === 0) {
            $(".sapnusername").html("此项为必填项")
            return false;
        }
        //用户名必须填写真实姓名
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanusername").html("名字必须2~10个汉字")
            return false;
        }
        $(".spanusername").html("姓名ok")
        return true;
    }

    //对邮箱进行校验
    function checkEmail() {
        let val = $(".useremail").val().trim();
        if (val.length === 0) {
            $(".spanuseremail").html("此为必填项")
            return false;
        }
        if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val)) {
            $(".spanuseremail").html("请填写邮箱")
            return false;
        }
        $(".spanuseremail").html("yangdada帅")
        return true;
    }
    //对电话校验函数
    function checkPhone() {
        let val = $(".userphone").val().trim();
        if (val.length === 0) {
            $(".spanuserphone").html("此选项为必填项")
            return false;
        }
        if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val)) {
            $(".spanuserphone").html("请填入正确的电话")
            return false;
        }
        $(".spanuserphone").html("你gio,我的gio，gio~~")
        return true;
    }

    //失去焦点时对数据校验
    $(".username").blur(checkName)
    //对邮箱进行校验
    $(".useremail").blur(checkEmail)
    //对手机号校验
    $(".userphone").blur(checkPhone)

    $(".submit").click(async function(){
        if(!checkName()||!checkPhone()||!checkEmail()){
            alert("你填写的数据不合法")
            return;
        }
        let params = {
            name:$(".username").val().trim(),
            sex:$("#man").prop("checked") ? 0 : 1,
            email: $(".useremail").val().trim(),
            phone: $(".userphone").val().trim(),
            departmentId:$(".userdepartment").val().trim(),
            jobId:$(".userjob").val(),
            desc:$(".userdesc").val().trim()
        }

        if (userId) {
            params.userId = userId
            let result = await axios.post("/user/update", params)
            if (result.code === 0) {
                alert("修改数据成功");
                window.location.href = "userlist.html"
                return;
            }
            alert("网络不给力，稍后再试")
            return;
        }
        // console.log(params);
        //实现新增
        let result = await axios.post("/user/add",params)
        if(result.code === 0){
            alert("添加成功");
            window.location.href = "userlist.html"
            return
        }
        alert("网络不给力，稍后再试")
    })
})