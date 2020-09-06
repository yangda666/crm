$(function(){

    let checkList = null;
    //实现显示部门
    initDeparMent();
    async function initDeparMent(){
        let result = await queryDepart();
        // console.log(result);
        if(result.code == 0){
            let str = ``;
            result.data.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`
            });
            $(".selectBox").html(str)
        }
    }
    //展现员工列表
    showUserList();
    async function showUserList() {
        let params = {
            departmentId: $(".selectBox").val(),
            search: $(".searchInp").val().trim()
        }
        let result = await axios.get("/user/list", {
            params
        })
        // console.log(result);
        //不成功
        if (result.code !== 0) return;
        let str = ``;
        result.data.forEach(item => {
            let {
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc
            } = item;
            str += `<tr>
				<td class="w3"><input type="checkbox" userId="${id}"></td>
				<td class="w10">${name}</td>
				<td class="w5">${sex == 0 ? '男' : '女'}</td>
				<td class="w10">${department}</td>
				<td class="w10">${job}</td>
				<td class="w15">${email}</td>
				<td class="w15">${phone}</td>
				<td class="w20">${desc}</td>
				<td class = "w12" userId = "${id}">
					<a href="javascript:;">编辑</a>
					<a href="javascript:;">删除</a>
					<a href="javascript:;">重置密码</a>
				</td>
			</tr>`
        })
        $("tbody").html(str)

        checkList = $("tbody").find('input[type ="checkbox"]')

    }
    //根据条件显示员工列表
    searchHandle();
    function searchHandle(){
        $(".selectBox").change(showUserList);
        $(".searchInp").on("keydown",e=>{
            if(e.keyCode === 13){
                showUserList()
            }
        })
    }

    //基于事件委托使用编辑和删除修改密码
    delegata();
    function delegata() {
        $("tbody").on("click", "a", async(e) => {
            let target = e.target,
                text = target.innerHTML.trim();
                // console.log(text);
            let userId = $(target).parent().attr("userid")
                // console.log(userId);
            if(text ==="编辑"){
                window.location.href = `useradd.html?id=${userId}`
                return;
            }
            if (text === "删除"){
                // console.log("SAHNCHU");
                let flag = confirm("你确定删除此用户吗？")
                if (!flag) return;
                let result = await axios.get("/user/delete",{
                    params:{userId}
                })
                if(result.code === 0){
                    alert ("删除用户信息");
                    $(target).parent().parent().remove();
                    checkList = $("tbody").find('input[type ="checkbox"]')
                    return;
                }
                return;
            }
            if (text === "重置密码") {
                let flag = confirm("你确定重置此用户的密码吗？")
                if(!flag) return;
                let result = await axios.post("/user/resetpassword",{
                    userId
                })
                if(result.code === 0){
                    alert("重置密码成功")
                    return;
                }
                return;
            }
        })
    }

    //实现全选
    selectHandle();
    function selectHandle(){
        $("#checkAll").click(e => {
            let checked = $("#checkAll").prop("checked")
            checkList.prop("checked", checked)
           
        })
    }
    $("tbody").on("click","input",e=>{
        // console.log(e.target.tagName);
        if (e.target.nodeName.toLowerCase() === "input") {
            newCheckList = Array.from(checkList)
            newCheckList.forEach(item=>{
                if(!$(item).prop("checked")){
                    flag=false;
                }
            })
            $("#checkAll").prop("checked",flag)
        }
    })
    //实现批量删除
    $(".deleteAll").click(e=>{
        let arr = [];
        // console.log(checkList);
        [].forEach.call(checkList,item=>{
            // console.log(item);
            if($(item).prop("checked")){
                arr.push($(item).attr("userid"))
            }
        })
        // console.log(arr);
        if(arr.length === 0){
            alert("请您选择需要删除的用户")
            return;
        }
        let flag = confirm("你确定要删除这些用户吗")
        if(!flag) return;
        let index = -1;
        async function deleteUser(){
            let userId = arr[++index];
            if(index >= arr.length){
                alert("已删除该员工")
                showUserList();
                return;
            }
            let result = await axios.get("/user/delete",{
                params:{
                    userId
                }
            })
            if(result.code != 0){
                return
            }
            deleteUser();
        }
        deleteUser();
    })
})
