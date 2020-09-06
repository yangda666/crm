$(function(){
    
    aaa = null
    //显示回访记录
    let myid = window.location.href.getQueryVariable("id")
    // console.log(myid);
    showVisitList();
    async function showVisitList(){
        
        let result = await axios.get("/visit/list",{
            params:{customerId:myid}
        })
        // console.log(result);
        if(result.code !=0) return alert ("网络不给力，请稍后再试");
        result = result.data;
        // console.log(result);
        let str = `` ;
        result.forEach(item => {
            let {
                id,
                customerId,
                customerName,
                visitText,
                visitTime
            } = item;
            str +=`
                <tr>
                    <td class = "w5">${id}</td> 
                    <td class = "w15">${visitTime} </td> 
                    <td class = "w50 wrap" style = text-align:center >${visitText}</td> 
                    <td class = "w20"  visittimes = "${id}" >
                    <a href = "javascript:;"> 删除 </a> 
                    <a href = "javascript:;"> 修改 </a> 
                    </td >
                </tr> 
            ` 
        });
        $("tbody").html(str)
    }

    //添加回访记录
    function checkTime(){
        let val = $(".visitTime").val().trim();
        if (val.length === 0) {
            $(".spanTime").html("请填写您的拜访时间")
            return false;
        }
        $(".spanTime").html("ok")
        return true;
    }
    function checkText() {
        let val = $(".visitText").val().trim();
        if (val.length === 0) {
            $(".spanVisit").html("请填写您的纪要")
            return false;
        }
        $(".spanVisit").html("")
        return true;
    }
    //检验填写数据
    $(".visitTime").blur(checkTime);
    $(".visitText").blur(checkText);
    
    //删除和修改纪要
    deleteVisit()
    function deleteVisit() {
        $("tbody").on("click","a",async function(e){
            let target = e.target,
                text = target.innerHTML.trim();
            let visitId = $(target).parent().attr("visittimes")
            // console.log(visitid);
            if (text === "删除"){
                let flag = confirm("你确定删除吗？")
                if (!flag) return;
                let result = await axios.get("/visit/delete", {
                    params: {
                        visitId
                    }
                })
                if (result.code === 0) {
                    alert("删除用户信息");
                    $(target).parent().parent().remove();
                    checkList = $("tbody").find('input[type ="checkbox"]')
                    return;
                }
                return;
            }
            if(text === "修改") {
                let flag = confirm("你确定修改吗？")
                if (!flag) return;
                let visitId = $(target).parent().attr("visittimes")
                let result = await axios.get('/visit/info',{
                    params:{
                        visitId
                    }
                })
                // console.log(result);
                if(result.code === 0){
                    //数据回显
                    let results = result.data
                    console.log(results);
                    $(".visitTime").val(results.visitTime)
                    $(".visitText").val(results.visitText)
                    $(".vID").val(results.id)
                    // console.log("aaa");
                    aaa=$(".vID").val()
                    console.log(aaa);
                    return
                }
                
                            
            }
            alertt("网络不给力，稍后再试")
        })
    }
    

    //提交拜访纪要
    $(".submit").click(async function () {
        // console.log("1");
        if (!checkTime() || !checkText()) {
            alert("请您重新填写数据");
            return
        }

        let params = {
            customerId: myid,
            visitText: $(".visitText").val().trim(),
            visitTime: $(".visitTime").val().trim()
        }
        //实现修改
        // console.log(aaa);
        if (aaa) {
            // let params = {}
            params.visitId = aaa
            let result = await axios.post("/visit/update", params)
            if (result.code === 0) {
                alert("修改数据成功");
                window.location.href = "visit.html"
                return;
            }
            alert("网络不给力，稍后再试")
            return;
        }

        //实现新增
        let result = await axios.post("/visit/add", params)
        if (result.code === 0) {
            alert("添加回访成功");
            window.location.href = "visit.html";
            return
        }
        alert("添加失败请重试")
    })

})
