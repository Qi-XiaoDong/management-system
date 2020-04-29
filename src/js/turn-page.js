/* 
    *每页展示信息条数可控制
    * 当页码为1或者为最后一页时 上一页，下一页 按钮灰色显示表示不能点击，
    *当前页码标记显示
    *只展示当前页码和左右两页其余。。。显示  但始终显示第一页和最后一页
    *最后展示共多少页
*/
(function ($) {

// 构造函数
    function TurnPage (config) {
        this.wrap = config.wrap;                                           //记录页码要插入的父级，防止发生混乱
        this.nowPage = config.nowPage;                                     //当前展示的页码
        this.allPageSize = config.allPageSize || 0;                        //总共的信息条数
        this.pageSize = config.pageSize || 10;                             //每页展示的信息条数
        this.allPage = Math.ceil( this.allPageSize / this.pageSize );      //通过信息条数和每页显示条数计算需要展示的页数
        this.showPageSize = config.showPageSize;                           //是否可调每页的显示条数
        this.cb = config.cb;                                               //点击页码后要执行的回调函数
        if (this.nowPage > this.allPage) {                                 //当前页码大于总页码提示错误
            alert('页码错误');
            return false;
        }
        this.createDom();                                                    //创建的dom结构
        this.initStyle();                                                   //添加样式
        this.bindEvent();                                                   //绑定事件
    }

// 创建dom结构
    TurnPage.prototype.createDom = function () {
        $(this.wrap).empty();                                               //每次渲染时清空上次渲染结果
        if ( this.showPageSize ) {                                            //true表示需要可调每页显示条数
            var $div = $('<div class="page-size"><span>每页</span></div>');
            $div.append( $('<input class="size" type="number" min=1 max=50 \
                value="' + this.pageSize + '"></input><span>条</span>') )
                    .appendTo(this.wrap);
        }
    // 添加上一页
        if ( this.nowPage > 1) {
            var $span = $('<span class="all prev-page">上一页</span>');        //当页码大于1时可以点击上一页
            $span.appendTo(this.wrap);
        } else {
            var $span = $('<span class="all">上一页</span>');                 //当页码等于1时灰置上一页按钮,表示不能单击
            $span.appendTo(this.wrap);
        }
        var $ul = $('<ul class=-"my-page"></ul>');
    //添加第一页
        if ( this.nowPage > 3) {                        //当前页码大于3时需要独立渲染第1页
            $('<li class="num">1</li>').appendTo($ul);
        }
    // 添加...
        if ( this.nowPage > 4 ) {                       //当前页码大于4时需渲染前两页其余。。。显示
            $('<span>...</span>').appendTo($ul);
        }
    // 通过循环添加中间的页码
        for (var i = this.nowPage - 2;  i <= this.nowPage + 2; i++) {       //页面始终渲染当前页和前后两页
            if ( i == this.nowPage ) {
                $('<li class="num active">' + i +  '</li>').appendTo($ul);
            } else if ( i > 0 && i <= this.allPage ) {
                $('<li class="num">' + i +  '</li>').appendTo($ul);
            }
        }
    // 添加...
        if ( this.nowPage + 2 < this.allPage - 1 ){         //当前页码小于总页数-3时需渲染后两页其余。。。显示
            $('<span>...</span>').appendTo($ul);
        }
    // 添加最后一页
        if ( this.nowPage + 2 < this.allPage ) {            //当前页码为最后一页时需要独立渲染第最后一页
            $('<li class="num">' + this.allPage +  '</li>').appendTo($ul);
        }
    // 将页码插入页面
        $ul.appendTo(this.wrap);
    // 添加下一页
        if ( this.nowPage < this.allPage ) {
            var $span = $('<span class="all next-page">下一页</span>');   //当页码小于总页数时可以点击下一页
            $span.appendTo(this.wrap);
        } else {
            var $span = $('<span class="all">下一页</span>');             //当页码等于总页数时灰置上一页按钮,表示不能单击
            $span.appendTo(this.wrap);
        }
    // 添加计算后一共显示的页码数
        $(this.wrap).append('<span>共'+ this.allPage + '页</span>');      //显示总页码数
    }

// 添加css样式
    TurnPage.prototype.initStyle = function() {
        $(this.wrap).css({
            width : 600,
            margin :'0 auto',
            // border : '1px solid black',
            padding : 10
        }).find('.page-size').add('.all').add('.prev-page').add('.next-page').add('ul').add('ul li')
                .css({
                    display:'inline-block'
                });
        $(this.wrap).find('.all')
                .css({
                    height: '20px',
                    padding: '3px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: '#bfbfbf',
	                border: '1px solid #bfbfbf'
                }).end().find('.prev-page, .next-page').css({
	              background: '#f2f2f2'
                });
        $(this.wrap).find('ul').css({
            margin:0,
            padding:0
        }).find('li').css({
            listStyle: 'none',
            textAlign: 'center',
            height: '20px',
            lineHeight: '20px',
            padding: '3px',
            margin: '0 5px',
            border: '1px solid #ddd',
            cursor: 'pointer',
           
        }).end().find('li.active').css({
            backgroundColor: '#428bca',
            border: '1px solid #428bca',
            color: '#fff'
        });
    }

// 绑定事件
TurnPage.prototype.bindEvent = function () {
    var self = this;
    $('.num', this.wrap).click(function (e) {  //单击页码进行跳转页面
        var page = + $(this).text();
        self.changeePage(page);
    });
    $('.prev-page', this.wrap).click(function (e) {  //单击上一页进行跳转
        var page = parseInt( $('.active').text() ) - 1;
        console.log(page);
        self.changeePage(page);
    });
    $('.next-page', this.wrap).click(function (e) {  //单击下一页进行跳转
        var page = parseInt( $('.active').text() ) + 1 ;
        self.changeePage(page);
    });
    $('.size',this.wrap).on('change', function(e) {    // 调节每页显示信息条数
        self.pageSize = + $(this).val();
        self.allPage = Math.ceil( self.allPageSize / self.pageSize );
        self.changeePage(1);
    })
}
// 改变当前页码
TurnPage.prototype.changeePage = function (page) {
    this.nowPage = page;
    this.createDom();                                                   
    this.initStyle();
    this.bindEvent();
    this.cb && this.cb({
        nowPage: this.nowPage,
        pageSize : this.pageSize
    });
}
// 扩展插件 实例方法  $.fn.extend();
    $.fn.extend({
        page : function (config) {
            config.wrap = this;
            new TurnPage (config);
            return this;
        }
    });
} (jQuery))