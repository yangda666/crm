$(function(){

    //获取元素
    let $navBoxList = $(".navBox>a");
    let $itemBoxList = null;


    init();
    let $plan = $.Callbacks();


    $plan.add((_,baseInfo)=>{
        // console.log(baseInfo);

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
   
    //拼接菜单字符串
    $plan.add((power)=>{
        let str = ``;
        // console.log("渲染菜单:",power);
        if(power.includes("userhandle")){
            str += `
            <div class="itemBox" text="员工管理">
                <h3>
                <i class="iconfont icon-yuangong"></i>
                员工管理
                </h3>
                <nav class="item">
                    <a href="page/userlist.html" target="iframeBox">员工列表<a>
                    <a href="page/useradd.html" target="iframeBox">新增员工<a>
                </nav>
            </div>
            `
        }            
        if (power.includes("jobhandle")) {
             str += `
            <div class="itemBox" text="职位管理">
                <h3>
                <i class="iconfont icon-zhiwuguanli"></i>
                职位管理
                </h3>
                <nav class="item">
                    <a href="page/joblist.html" target="iframeBox">职位列表<a>
                    <a href="page/jobadd.html" target="iframeBox">新增职位<a>
                </nav>
            </div>
            `
        }
        if (power.includes("customerall")) {
             str += `
            <div class="itemBox" text="客服管理">
                <h3>
                <i class="iconfont icon-kehuguanli"></i>
                客服管理
                </h3>
                <nav class="item">
                    <a href="page/customerlist.html" target="iframeBox">我的客服<a>
                    <a href="page/customerlist.html" target="iframeBox">全部客服<a>
                    <a href="page/customeradd.html" target="iframeBox">新增客服<a>
                </nav>
            </div>
            `
        }
        if(power.includes("departhandle")){
             str += `
            <div class="itemBox" text="部门管理">
                <h3>
                <i class="iconfont icon-laoban"></i>
                部门管理
                </h3>
                <nav class="item">
                    <a href="page/departhandlelist.html" target="iframeBox">部门列表<a>
                    <a href="page/departhandleadd.html" target="iframeBox">新增部门<a>
                </nav>
            </div>
            `
        }
        $(".menuBox").html(str);
        $itemBoxList = $(".menuBox").find(".itemBox")
    })

    //控制组织结构和客户管理点击切换
    function handGroup(index) {
        console.log($itemBoxList);
        let $group1 = $itemBoxList.filter((_, item) => {
            let text = $(item).attr("text");
            // console.log(text);
            return text === "客服管理"
        })
        let $group2 = $itemBoxList.filter((_, item) => {
            let text = $(item).attr("text");
            // console.log(text);
            return /^(员工管理|部门管理|职位管理)/.test(text)
        })
        //控制那一组显示
        if (index === 0) {
            $group1.css("display", "block");
            $group2.css("display", "none");
        } else if (index === 1) {
            $group1.css("display", "none")
            $group2.css("display", "block")

        }
    }
    //实现tab选项卡功能
    $plan.add(power=>{

        let initIndex = power.includes("customer")? 0:1;
        $navBoxList.eq(initIndex).addClass("active").siblings().removeClass("active");
        handGroup(initIndex)
        //点击切换
        $navBoxList.click(function(){
            let index = $(this).index();
            let text = $(this).html().trim()

            if(text ==="客服管理" && !/customerall/.test(power) || (text ==="组织结构") && !/(userhandle|departhandle|jobhandle)/.test(power)){
                alert("没有权限访问")
                return;
            }
            if(index === initIndex) return;
            $(this).addClass("active").siblings().removeClass("active");
            handGroup(index);
            initIndex = index;
        })
    })

    //控制默认的ifram的src
    $plan.add(power=>{
        let url = "page/customerlist.html"
        if(power.includes("customerall")){
            $(".iframeBox").attr("src",url)
        }
    })

    async function init(){
        let result = await axios.get("/user/login");
        // console.log(result);
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
        power.code === 0 ? power = power.power:null;
        baseInfo.code === 0 ? baseInfo = baseInfo.data : null;
        $plan.fire(power, baseInfo)
    }
})