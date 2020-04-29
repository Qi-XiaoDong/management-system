var falg = false;
var nowPage = 1;
var pageSize = 6;
var allPageSize = 0;
var tableData = [];
// 绑定事件
function bindEvent () {
//左侧导航切换
    $('.menu-list').on('click', 'dd', function () {
        $(this).siblings().removeClass('active');                   //将其他导航的样式取消
        $(this).addClass('active');                                 //为当前点击的导航添加样式
        var id = $(this).data('id');                                // 获取当前点击导航所对应的内容
        if ( id === 'student-list') {
            getTableDate()                                          // 点击学生列表时实时向后端获取表格数据
        }
        $('.content').fadeOut();                                    //将内容区清空
        $('#' + id ).fadeIn();                                      //将获取的内容展示在内容区
    }) ;
// 添加学生提交按钮
    $('#add-btn').on('click', function (e) {
        e.preventDefault();                                         // 阻止表单提交的默认事件
        if ( falg ) {                                               //加锁防止连续多次点击
            return false;
        }
        falg = true;
        var data = $('#add-student-form').serializeArray();             // 获取表单内填写的数据[展示结果为数组形式]
        data = formatObj(data);                                         //将表格数据转换为对象形式
        transferData('/api/student/addStudent', data, function (res) {  //将数据添加到后台
            key = window.confirm('添加成功,是否跳转页面到学生列表');
            if ( key ) {
                $('.list').trigger('click');                            //调用学生列表单击事件 跳转到列表内容
            } 
            $('#add-student-form')[0].reset();                          //  提交后将表单清空,jq对象的[0]是原生dom对象
            flag = false;                                               // 解锁
        })
    });

// 编辑按钮
    $('#tbody').on('click', '.edit',  function(){
        var index = $(this).data('index');
        // 编辑框显示
        $('.dialog').slideDown();
        renderForm(tableData[index]);   //回填表格数据
    })
    // 编辑框消失动画
    $('.mask').click(function () {
        $('.dialog').slideUp()
    } )

// 修改提交按钮
    $('#edit-btn').on('click', function (e) {
        e.preventDefault();
        if ( falg ) {
            return false;
        }
        falg = true;
        var data = $('#edit-student-form').serializeArray();
        data = formatObj(data);
        transferData('/api/student/updateStudent', data, function (res) {
            key = window.confirm('是否修改内容');
            if ( key ) {
                var val = $('#seacher-word').val();
                // console.log(val)
                if ( val ) {
                    filterData(val)
                } else {
                    getTableDate();
                }
            } 
            $('#edit-student-form')[0].reset();      //清空编辑表单
            $('.mask').trigger('click');             //触发事件使编辑框消失
            flag = false;                            //打开锁
        })
    });

// 删除按钮
    $('#tbody').on('click', '.del', function () {
    var index = $(this).data('index');
    var key = window.confirm('确认删除');
    if ( key ) {
        transferData('/api/student/delBySno', {
            sNo : tableData[index].sNo
        }, function (res) {
            alert('删除成功')
            $('.list').trigger('click');
        })
    }
    });

// 关键字搜索按钮
    $('.sea-btn').click(function (e) {
        var val = $('#seacher-word').val();
        nowPage = 1;
        // console.log(val)
        if ( val ) {
           filterData(val)
        } else {
            getTableDate();
        }
    });
}

// 函数功能区域

/* 
    回填表单数据 
*/
function renderForm (data) {
    console.log(data);
    var form = $('#edit-student-form')[0];
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}


 /* 
    获取后端的数据
  */
function getTableDate () {
    transferData('/api/student/findByPage', {
        page:nowPage,
        size:pageSize
    }, function (res) {
        console.log(res);
        allPageSize = res.data.cont;
        tableData = res.data.findByPage;
        rederTable(tableData) ;
    })
}

 /* 
    渲染表格数据 
 */
function rederTable(data) {
    var str = '';
    data.forEach(function (item, index) {
        str += ' <tr>\
        <td>' + item.sNo +'</td>\
        <td>' + item.name + '</td> \
        <td>' + ( item.sex ? '女' : '男') + '</td>\
        <td>' + item.email + '</td>\
        <td>' + (new Date().getFullYear() - item.birth) + '</td>\
        <td>' + item.phone +'</td>\
        <td>' + item.address + '</td>\
        <td>\
            <button class="btn edit" data-index=' + index + '>编辑</button>\
            <button class="btn del" data-index=' + index + '>删除</button>\
        </td>\
    </tr>';
    });
    $('#tbody').html(str);
    $('.turn-page').page({
        allPageSize : allPageSize,          //信息总条数
        nowPage : nowPage,                  //当前页码数
        pageSize : pageSize,                //当前每页显示条数
        showPageSize:true,
        cb : function (obj){
            nowPage = obj.nowPage;          
            pageSize = obj.pageSize;
            var val = $('#seacher-word').val();
            if ( val ) {
               filterData(val)
            } else {
                getTableDate();
            }
        }
    });
}


 /* 
    将表单数据转换为对象格式 
 */
function formatObj (arr) {
    var obj = {},
        len = arr.length;
    for (var i = 0; i < len; i++) {
        if ( !obj[arr[i].name] ) {
            obj[arr[i].name] = arr[i].value;
        }
    }
    return obj;
}

/*
     前后端交互
 */
function  transferData(url, data, cb){
    $.ajax({
        type : 'get',
        url : 'http://api.duyiedu.com' + url,
        data : $.extend(data, {
            appkey : 'QXD_QiXiaoDong_1553869605759'
        }),
        dataType : 'json',
        success : function (res) {
            if (res.status == 'success') {
                cb(res);
            } else {
                alert(res.msg);
            }
        }
    });
}

 /* 
    根据关键字过滤信息
  */
function filterData (val) {
    transferData('/api/student/searchStudent', {
        sex : -1,
        search : val,
        page: nowPage,
        size : pageSize,
    }, function (res) {
        // console.log(res);
        allPageSize = res.data.cont;
        rederTable(res.data.searchList);
    })
}

function init () {
    bindEvent();
    $('.list').trigger('click');
}
init();

