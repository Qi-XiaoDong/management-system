// 初始化函数
function init () {
    bindEvent();
}
// 声明弹窗区域
var dialog = document.getElementsByClassName('dialog')[0];
var tableData = [];
// 绑定事件函数
function bindEvent () {
    // 利用事件委托给 dd标签 绑定切换 active样式的函数
    var menuList = document.getElementsByClassName('menu-list')[0];
   menuList.addEventListener('click', changeMenuList,false);

//  为form表单的提交按钮绑定单击函数
    var addStudentBtn = document.getElementById('add-btn')
    // addStudentBtn.addEventListener('click',addStudent,false);
    addStudentBtn.addEventListener('click',function (e) {
        changeStudentInfo(e, '/api/student/addStudent', 'add-student-form');
    },false);


//利用事件委托为编辑 和删除按钮  绑定点击事件
    var tBody = document.getElementById('tbody');
    tBody.addEventListener('click',tbodyClick,false);
   
    var mask = document.getElementsByClassName('mask')[0];
    mask.onclick = function (){
        dialog.classList.remove('show');
    }

    var editStudentBtn = document.getElementById('edit-btn');
    // editStudentBtn.addEventListener('click',editStudent,false);
    editStudentBtn.addEventListener('click',function (e) {
        changeStudentInfo(e, '/api/student/updateStudent', 'edit-student-form' );
    },false);
}    

    

// 表格内部按钮点击事件
    function tbodyClick (e) {
        var tagName = e.target.tagName;
        if (!tagName === 'BUTTON') {
            return false;
        }
        var isEdit = e.target.className.indexOf('edit') > -1;
        var isDel = e.target.className.indexOf('del') > -1;
        var index = e.target.getAttribute('data-index');
    //    为编辑按钮绑定事件
        if (isEdit){
            dialog.classList.add('show');
           renderForm(tableData[index]);
        }else if (isDel){
            var del = window.confirm('是否删除？');
            if (del) {
                transfarData('/api/student/delBySno',{
                    sNo : tableData[index].sNo
                },function () {
                    alert('已删除');
                    var list = document.getElementsByClassName('list')[0];
                    list.click();
                });
            }
        } 
    }
// 回填表单数据
    function renderForm (data) {
        console.log(data);
        var form = document.getElementById('edit-student-form');
        for (var prop in data) {
            if (form[prop]) {
                form[prop].value = data[prop];
            }
        }
    }

    function changeStudentInfo (e,url, id) {
        e.preventDefault();
        var form = document.getElementById(id);
        var data = getData(form);
        var msg = '';
        if (!data) {
            return false;
        }
        if (id === 'edit-student-form') {
            msg = '是否更新数据?';
        }else {
            msg = '提交成功,是否切换学生列表页面';
        }
        transfarData(url, data, function () {
            var isTruePage = window.confirm (msg);
            if (isTruePage) {
                var studentTable = document.getElementsByClassName('list')[0];
                studentTable.click();
                if (id === 'edit-student-form') {
                    var mask = document.getElementsByClassName('mask')[0];
                    mask.click();
                }
            }
            form.reset();
        });
    }    

// 编辑学生
    // function editStudent (e) {
    //     e.preventDefault();
    //     var form = document.getElementById('edit-student-form');
    //     var data = getData(form);
    //     if (!data) {
    //         return false;
    //     }
    //     transfarData('/api/student/updateStudent', data, function () {
    //         var isTruePage = window.confirm ('是否更新数据');
    //         if (isTruePage) {
    //             var studentTable = document.getElementsByClassName('list')[0];
    //             studentTable.click();
    //             var mask = document.getElementsByClassName('mask')[0];
    //             mask.click();
    //         }
    //         form.reset();
    //     });
    // }    

// 新增学生
// function addStudent (e) {
//     // 取消表单默认行为
//     e.preventDefault();
//     // 获取到表单元素
//     var form = document.getElementById('add-student-form');
//     // 接收返回的表单数据
//     var data = getData(form);
//     // 如果没有接收到data数据 直接结束函数
//     if (!data) {
//         return false;
//     }
//     // console.log(data);
//     // 向后端传输数据
//      transfarData('/api/student/addStudent', data, function () {
//         var isTruePage = window.confirm ('提交成功,是否切换学生列表页面');
//         if (isTruePage) {
//             var studentTable = document.getElementsByClassName('list')[0];
//             studentTable.click();
//         }
//         form.reset();
//      });
// }

var curPage = 0;

// 渲染biaoge
function renderTable() {
    // console.log(transferData('/api/student/findAll'))
   
    transfarData('/api/student/findAll', "", function (res) {
        var data = res.data;
        tableData = data;
        var str = "";
        // 想做分页，对每页展示的信息数进行控制
        // for (var i = 0; i < len; i++ ) {
        //     (function (i) {
        //         console.log(data[i]);
        //         str += ' <tr>\
        //         <td>' + data[i].sNo +'</td>\
        //         <td>' + data[i].name + '</td> \
        //         <td>' + (data[i].sex ? '女' : '男') + '</td>\
        //         <td>' + data[i].email + '</td>\
        //         <td>' + (new Date().getFullYear() - data[i].birth) + '</td>\
        //         <td>' + data[i].phone +'</td>\
        //         <td>' + data[i].address + '</td>\
        //         <td>\
        //             <button class="btn edit" data-index="'+ i +'">编辑</button>\
        //             <button class="btn del" data-index="'+ i +'">删除</button>\
        //         </td>\
        //         </tr>'
        //     } (i)) 
        // }
        data.forEach(function (item, index) {
            str += ' <tr>\
            <td>' + item.sNo +'</td>\
            <td>' + item.name + '</td> \
            <td>' + (item.sex ? '女' : '男') + '</td>\
            <td>' + item.email + '</td>\
            <td>' + (new Date().getFullYear() - item.birth) + '</td>\
            <td>' + item.phone +'</td>\
            <td>' + item.address + '</td>\
            <td>\
                <button class="btn edit" data-index="'+ index +'">编辑</button>\
                <button class="btn del" data-index="'+ index +'">删除</button>\
            </td>\
        </tr>'
        });

        var tBody = document.getElementById('tbody');
        tBody.innerHTML = str;
    });
}
// 前后交互函数
function transfarData (url, data, cb) {
    if (!data) {
        var data = {};
    }
    // console.log(data);
    var result = saveData('http://api.duyiedu.com' + url, Object.assign(data,{
        appkey : 'QXD_QiXiaoDong_1553869605759'
    }));

    if (result.status == 'success') {
        // console.log(result);
        cb(result);
    } else {
        alert(result.msg);
    }
}
   

// 获取表单数据
function getData (form) {
    // 获取到每个input标签的value值
    var name = form.name.value,
        sNo = form.sNo.value,
        sex = form.sex.value,
        birth = form.birth.value,
        email = form.email.value,
        address = form.address.value,
        phone = form.phone.value;
        //判断是否有没有填写的信息 
    if (!name || !sNo || !birth || !email || !address || !phone) {
        alert('有信息未填写,请填写完整信息后提交'); 
        return false;
    }
    // 将填写的信息以对象的形式返回出去
    return {
        name : name,
        sex : sex,
        sNo : sNo,
        birth : birth,
        email : email,
        address : address,
        phone : phone
    }
}

//向后端存储数据 
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

// 切换右侧列表active样式的函数 并且与右侧内容相对应
function changeMenuList (e) {
//    e.target可以获取到事件触发的源对象  e.target.targetName 可以获取到 事件原对象的标签名  
//    也可以用 nodeName  返回结果为大写
    var tagName = e.target.tagName;
    // 只想给dd标签绑定
    if (tagName === 'DD') {
        // 将改变class属性的函数单独抽取出来
        initMenuCss(e.target);
        // 获取到点击的dd标签上的data-id属性  它是和右侧内容一一对应的关键
        var id = e.target.getAttribute('data-id');
    //    通过data-id 的唯一标识将右侧应该对应的内容获取到
        var content = document.getElementById(id);
    //    为右侧的内容添加content-active样式类名 让它显示
        initContentCss(content);
       
        if (id == 'student-list') {
            // 渲染右侧表格
            renderTable();
        }
    }
}

// 改变right-content中 content-active标签要显示在那个内容上 和initMenuCss函数的思想一样
function initContentCss(dom){
    var activeArr = document.getElementsByClassName('content-active');
    for (var i = 0; i < activeArr.length; i++) {
        activeArr[i].classList.remove('content-active');
    }
    dom.classList.add('content-active');
}

// 改变MenuList中active样式的函数
function initMenuCss (dom) {
    // 获取到有active属性的标签
    var activeArr = document.getElementsByClassName('active');
    // 通过遍历将所有标签上的active属性全部删除diao
    for (var i = 0; i < activeArr.length; i++) {
        activeArr[i].classList.remove('active');
    }
//    为传进来的标签添加active的属性
    dom.classList.add('active');
}

// function detection (target, reg) {
//     target.
// }



init();