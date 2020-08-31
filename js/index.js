$(function(){
    init();
    let $plan = $.Callbacks();
    $plan.add((_,baseInfo)=>{
        console.log(baseInfo);

        $(".baseBox>span").html(`你好,${baseInfo.name ||''}`)
    })

    //实现退出
    $(".baseBox>a").click(async function(){
        let result = await axios.get("/user/signout")
        if(result.code == 0){
            window.location.href="login.html";
            return;
        }
        alert("网络不给力，请稍后再试")
    })

    $plan.add((power)=>{
        console.log("渲染菜单:",power);
    })


    async function init(){
        let result = await axios.get("/user/login");
        console.log(result);
        if(result.code != 0){
            alert("你还没登录，请先登录")
            window.location.href = "login.html";
            return;
        }
        //代表登录成功
        let [power,baseInfo] = await axios.all([
            axios.get("/user/power"),
            axios.get("/user/info")
        ])
        // console.log(power);
        // console.log(baseInfo);
        
        baseInfo.code === 0 ? baseInfo = baseInfo.data : null;
        $plan.fire(power, baseInfo)
    }
})