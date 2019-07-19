
var $table;
const token = sessionStorage.getItem('token-wx')
//初始化bootstrap-table的内容
function InitMainTable() {
    //记录页面bootstrap-table全局变量$table，方便应用
    $table = $('#order-table').bootstrapTable({
        url: `${baseUrl}/wx/order/list`,                      //请求后台的URL（*）
        ajaxOptions: {
            headers: { "token-wx": token }
        },
        method: 'GET',                      //请求方式（*）
        dataType: 'json',
        //toolbar: '#toolbar',              //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
        pageSize: 10,                     //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索
        strictSearch: true,
        // showColumns: false,                  //是否显示所有的列（选择显示的列）
        // showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        // showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
        // cardView: false,                    //是否显示详细视图
        // detailView: false,                  //是否显示父子表
        //得到查询的参数
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一致，这边改动，控制器也需要改成一样的
            var temp = {
                size: params.size,   //页面大小
                page: params.page
            };
            return temp;
        },
        columns: [{
            field: 'name',
            title: '订单详情',
            formatter: orderFormatter
        }, {
            field: 'number',
            title: '数量'
        }, {
            field: 'orderPrice',
            title: '价格'
        }, {
            field: 'orderStatusText',
            title: '订单状态'
        }, {
            field: 'ID',
            title: '交易操作',
            width: 120,
            align: 'center',
            valign: 'middle',
            formatter: actionFormatter
        },],
        onLoadSuccess: function (res) {
            console.log(res.data.items)
            $('#order-table').bootstrapTable('load', res.data.items
            )
        },
        onLoadError: function () {
            // showTips("数据加载失败！");
        },
        onDblClickRow: function (row, $element) {
            var id = row.ID;
            // EditViewById(id, 'view');
        },
    });
};

// 订单格式化
function orderFormatter(value, row, index) {
    return `<div class="bought-wrapper"><span>订单号: </span><span>${row.orderSn}</span></div>
    <div class="order-content">
        <div>
            <a href="/item.html?product_id=${row.orderGoodsList.id}">
                <img src="${row.orderGoodsList.picUrl}"
                    alt="${row.orderGoodsList.goodsName}">
            </a>
        </div>
        <div>
            <p>
                <a href="/item.html?product_id=${row.orderGoodsList.id}">${row.orderGoodsList.goodsName}</a>
            </p>
            <p><span>${row.orderGoodsList.specifications}</span></p>
        </div>
    </div>`
}

//操作栏的格式化
function actionFormatter(value, row, index) {
    return "<a href='javascript:;' class='btn btn-xs red' onclick=\"handleDelete('" + row.id + "')\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";
}

InitMainTable()

// 删除订单
function handleDelete(id) {
    $.confirm({
        title: '删除!',
        content: '确认删除该条地址吗?',
        buttons: {
            cancel: {
                text: '取消'
            },
            confirm: {
                text: '确认',
                btnClass: 'btn-blue',
                keys: ['enter', 'shift'],
                action: function () {
                    ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/order/delete`, data: JSON.stringify({ id: id }) }).then(res => {
                        ShowNotice(res.errmsg, '删除成功', 'success', 2000, true)
                        $('#order-table').bootstrapTable('remove', {
                            field: "id",
                            values: [parseInt(id)]
                        });
                    })
                }
            }
        }
    });
}