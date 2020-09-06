$(function () {
    // console.log(window.location.href);
    let lx = "my"
    let limit = 8;
    let page = 1;
    let totalPage = 1;
    let total = 0
    let params = window.location.href.getQueryVariable("lx");
    params ? lx = params : null;

    //获取客户列表
    showCustomerList();
    async function showCustomerList(){
        let result = await axios.get("/customer/list",{
            params:{
                lx,
                type:$(".selectBox").val(),
                search:$(".searchInp").val().trim(),
                limit,
                page,
            }

        })
        // console.log(result);
        if(result.code != 0) return alert ("网络不给力，请稍后再试")
        totalPage = parseInt(result.totalPage)
        total = parseInt(result.total)
        
        result = result.data;
        let str = ``;
        result.forEach(item => {
            let {
                id, name, email, phone, type, userId, userName, weixin, sex, address, QQ
            } = item;

            str +=`
                <tr>
                    <td class="w8">${name}</td>
                    <td class="w5">${sex==0?'男':'女'}</td>
                    <td class="w10">${email}</td>
                    <td class="w10">${phone}</td>
                    <td class="w10">${weixin}</td>
                    <td class="w10">${QQ}</td>
                    <td class="w5">${type}</td>
                    <td class="w8">${userName}</td>
                    <td class="w20">${address}</td>
                    <td class="w14" customerId="${id}" >
                        <a href="javascript:;">编辑</a>
                        <a href="javascript:;" > 删除 </a>
                        <a href="visit.html?id=${id}"> 回访记录 </a>
                    </td>
                </tr>
            ` ;
        });
        $("tbody").html(str)
        if(totalPage>1){
            str = ``;
            page > 1 ? str += `<a href="javascript:;">上一页</a>` : null;
            str += '<ul class="pageNum">';
            for (let i = 1; i <= totalPage; i++ ){
                str += `<li class="${i==page?'active':``}">${i}</li>`;
            }
            str +='</ul>';
            page < totalPage ? str +=`<a href="javascript:;">下一页</a>` : null;
            $(".pageBox").html(str); 
        }
    }
    //其他功能
    // 分页功能
    handle();
    function handle(){
        $(".selectBox").change(showCustomerList);
        $(".searchInp").keydown(function(ev){
            if(ev.keyCode===13){
                showCustomerList();
            }
        });
        $(".pageBox").click(e=>{
            // console.log(e.target);
            let target = e.target,
                tag = target.nodeName.toLowerCase(),
                text = target.innerHTML,
                temp = page;
            // console.log(tag);
            if(tag === "a"){
                if(text ===  "上一页"){temp --;}
                if(text ===  "下一页"){temp ++;}
            }
            if(tag === "li"){
                temp = parseInt(text)
            }
            temp !== page ? (page=temp,showCustomerList()):null
            
        })
    }
    //基于时间委托使用编辑删除回访
    delegata();
    function delegata(){
        $("tbody").on("click","a",async (e)=>{
            let target = e.target,
                text = target.innerHTML.trim();
                // console.log(customerId)
                customerId = $(target).parent().attr("customerId")
                // console.log(customerId);
            //编辑    
            if(text === "编辑"){
                let flag = confirm("你确定要重新编辑客服信息")
                if (!flag) {
                    return;
                }else{
                    window.location.href = `customeradd.html?id=${customerId}`;
                    return
                }            
                return;
            }
            //删除
            if (text === "删除") {
                // console.log("SAHNCHU");
                let flag = confirm("你确定删除此用户吗？")
                if (!flag) return;
                let result = await axios.get("/customer/delete", {
                    params: {
                        customerId
                    }
                })
                if (result.code === 0) {
                    alert("删除客服信息");
                    $(target).parent().parent().remove();
                    return;
                }
                return;
            }
        })
    }




})