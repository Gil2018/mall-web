
var $table;
const token = sessionStorage.getItem('token-wx')
//初始化bootstrap-table的内容
function InitMainTable() {
    //记录页面bootstrap-table全局变量$table，方便应用
    $table = $('#address-table').bootstrapTable({
        url: `${baseUrl}/wx/address/list`,                      //请求后台的URL（*）
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
        // pageSize: 10,                     //每页的记录行数（*）
        // pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
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
            var temp = {};
            return temp;
        },
        columns: [{
            field: 'id',
            title: 'ID',
            sortable: true
        }, {
            field: 'name',
            title: '收货人姓名',
            sortable: true
        }, {
            field: 'mobile',
            title: '联系电话'
        }, {
            field: 'addressDetail',
            title: '所在城市',
            formatter: addressFormatter
        }, {
            field: 'addressDetail',
            title: '详细地址'
        }, {
            field: 'addressName',
            title: '收货地址'
        }, {
            field: 'location',
            title: '经纬度'
        }, {
            field: 'isDefault',
            title: '是否默认',
            formatter: defaultFormatter
        }, {
            field: 'ID',
            title: '操作',
            width: 120,
            align: 'center',
            valign: 'middle',
            formatter: actionFormatter
        },],
        onLoadSuccess: function (res) {
            $('#address-table').bootstrapTable('load', res.data)
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

// 地址格式化
function addressFormatter(value, row, index) {
    return `<span>${row.province}-${row.city}-${row.district}</span>`
}

// 是否为默认地址
function defaultFormatter(value, row, index) {
    var result = "";
    if (row.isDefault) {
        result = `<span class="address-default">默认地址</span>`
    } else {
        result = `<span class="address-setDefault" onclick="handleSetDefault(this)">设为默认<span style="display: none;">${JSON.stringify(row)}</span></span>`
    }
    return result;
}

// 设置为默认地址
function handleSetDefault(e) {
    let row = JSON.parse(e.children[0].innerText)
    row.isDefault = true
    ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/address/save`, data: JSON.stringify(row) }).then(res => {
        ShowNotice(res.errmsg, '设置成功', 'success', 2000, true)
        $('#address-table').bootstrapTable('refresh');
    })
}

//操作栏的格式化
function actionFormatter(value, row, index) {
    var id = value;
    var result = "";
    result += "<a href='javascript:;' class='btn btn-xs blue' onclick=\"handleUpdate('" + row.id + "')\" title='编辑'><span class='glyphicon glyphicon-pencil'></span></a>";
    result += "<a href='javascript:;' class='btn btn-xs red' onclick=\"handleDelete('" + row.id + "')\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";
    return result;
}

InitMainTable()

// 保存数据
function createData(e) {
    const flag = validform().form()
    if (flag) {
        let location = $(e).attr('location')
        if (location) {
            // let gender = $("#gender option:selected").val()
            let msg = '添加成功'
            let params = {
                addressDetail: $('#addressDetail').val().trim(),
                addressName: $('#addressName').val().trim(),
                city: $('#city').val(),
                district: $('#district').val(),
                isDefault: $("#isDefault[type='checkbox']").is(':checked'),
                location: location,
                mobile: $('#mobile').val().trim(),
                name: $('#fullName').val().trim(),
                province: $('#province').val()
            }
            let addressId = $('#address-save').attr('addressId')
            if (addressId) {
                params.id = addressId
                msg = '修改成功'
            }
            ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/address/save`, data: JSON.stringify(params) }).then(res => {
                ShowNotice(res.errmsg, msg, 'success', 2000, true)
                if (addressId) {
                    $('#address-table').bootstrapTable('refresh');
                } else {
                    let index = $('#address-table').bootstrapTable('getData').length;
                    $('#address-table').bootstrapTable('insertRow', {
                        index: index,
                        row: res.data
                    });
                }
                $('#address-form').modal('hide')
            })
        } else {
            $.alert({
                title: '',
                content: '请输入关键词查找地址!',
            });
            $('#keywords').focus()
        }
    }
}

// 新增收货地址
function handleCreate() {
    resetTemp({
        addressDetail: '',
        addressName: '',
        isDefault: false,
        mobile: '',
        name: '',
        city: '',
        district: '',
        province: ''
    })
    $('#address-save').attr('addressId', '')
    $('#addressFormLabel').text('新增地址')
}

// 初始化模态框
function resetTemp(data) {
    console.log(data)
    $('#addressDetail').val(data.addressDetail)
    $('#addressName').val(data.addressName)
    $("#isDefault").prop("checked", data.isDefault);
    $('#mobile').val(data.mobile)
    $('#fullName').val(data.name)
    $('#keywords').val('')
    // $("#gender option:selected").val(data.gender)
    if (!data.district || data.district === '') {
        $('#distpicker').distpicker('reset');
    } else {
        $('#distpicker').distpicker('destroy');
        $('#distpicker').distpicker({
            province: data.province,
            city: data.city,
            district: data.district
        });
    }
}

// 表单验证
function validform() {
    return $("#edit-address").validate({
        rules: {
            fullName: {
                required: true,
                minlength: 2,
                maxlength: 20
            },
            mobile: {
                required: true,
                minlength: 11,
                isMobile: true
            },
            addressName: {
                required: true,
            },
            addressDetail: {
                required: true
            }
        },
        messages: {
            fullName: {
                required: "收货人姓名不能为空",
                minlength: "姓名不能少于2个字符",
                maxlength: "姓名不能超过20个字符"
            },
            mobile: {
                required: "请输入联系电话",
                minlength: "不能小于11个字符",
                isMobile: "请正确填写手机号码"
            },
            addressName: {
                required: "收货地址不能为空",
            },
            addressDetail: {
                required: "详细地址不能为空"
            }
        }
    });
}

// 修改收货地址
function handleUpdate(id) {
    ajaxPromise({ url: `${baseUrl}/wx/address/detail`, data: { id: id } }).then(res => {
        let data = res.data
        resetTemp({
            addressDetail: data.addressDetail,
            addressName: data.addressName,
            isDefault: data.isDefault,
            mobile: data.mobile,
            name: data.name,
            city: data.city,
            district: data.district,
            province: data.province
        })
        $('#addressFormLabel').text('修改地址')
        $('#address-save').attr('addressId', id)
        $('#address-save').attr('location', data.location)
        $('#address-form').modal()
    })
}

// 删除收货地址
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
                    ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/address/delete`, data: JSON.stringify({ id: id }) }).then(res => {
                        ShowNotice(res.errmsg, '删除成功', 'success', 2000, true)
                        $('#address-table').bootstrapTable('remove', {
                            field: "id",
                            values: [parseInt(id)]
                        });
                    })
                }
            }
        }
    });
}
