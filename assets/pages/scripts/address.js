

function handleCreate(e) {
    const flag = validform().form()
    if (flag) {
        let location = $(e).attr('location')
        if (location) {
            console.log(location)
        } else {
            $.alert({
                title: '',
                content: '请输入关键词查找地址!',
            });
            $('#keywords').focus()
        }
    }
}

function validform() {
    return $("#edit-address").validate({
        rules: {
            fullName: {
                required: true,
                minlength: 4,
                maxlength: 25
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
                minlength: "姓名不能少于4个字符(1个汉字代表2字符)",
                maxlength: "密码长度不能超过25个字符"
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
            var temp = {};
            return temp;
        },
        columns: [{
            checkbox: true,
            visible: true                  //是否显示复选框
        }, {
            field: 'name',
            title: '收货人姓名',
            sortable: true
        }, {
            field: 'mobile',
            title: '联系电话'
        }, {
            field: 'addressName',
            title: '收货地址'
        }, {
            field: 'addressDetail',
            title: '详细地址',
            formatter: addressFormatter
        }, {
            field: 'location',
            title: '经纬度'
        }, {
            field: 'isDefault',
            title: '是否默认'
        }, {
            field: 'ID',
            title: '操作',
            width: 120,
            align: 'center',
            valign: 'middle',
            formatter: actionFormatter
        },],
        onLoadSuccess: function (res) {
            console.log(res)
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

function addressFormatter(value, row, index) {
    return `<span>${row.province}-${row.city}-${row.district}-${row.addressDetail}</span>`
}

//操作栏的格式化
function actionFormatter(value, row, index) {
    var id = value;
    var result = "";
    result += "<a href='javascript:;' class='btn btn-xs green' onclick=\"EditViewById('" + id + "', view='view')\" title='查看'><span class='glyphicon glyphicon-search'></span></a>";
    result += "<a href='javascript:;' class='btn btn-xs blue' onclick=\"EditViewById('" + id + "')\" title='编辑'><span class='glyphicon glyphicon-pencil'></span></a>";
    result += "<a href='javascript:;' class='btn btn-xs red' onclick=\"DeleteByIds('" + id + "')\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";

    return result;
}
InitMainTable()

// handleCreate() {
//     this.temp = {
//       id: undefined,
//       categoryId: undefined,
//       isOnSale: false,
//       name: '',
//       number: 0,
//       retailPrice: 0,
//       brief: '',
//       keywords: '',
//       supperSn: ''
//     }
//     this.picUrl = []
//     this.keywords = []
//     this.getCategory()
//     this.dialogStatus = 'create'
//     this.dialogFormVisible = true
//     this.$nextTick(() => {
//       this.$refs['dataForm'].clearValidate()
//     })
//   },
//   createData() {
//     this.temp.name = this.temp.name.replace(/(^\s*)|(\s*$)/g, '')
//     this.temp.supperSn = this.temp.supperSn.replace(/(^\s*)|(\s*$)/g, '')
//     this.$refs['dataForm'].validate((valid) => {
//       if (valid) {
//         if (promptMessage(Array, this.picUrl, '上传菜品图片')) {
//           this.temp.picUrl = this.picUrl[0].url
//           addSupper(this.temp).then((res) => {
//             this.list.unshift(res.data.data)
//             this.dialogFormVisible = false
//             this.$notify({
//               title: '成功',
//               message: '创建成功',
//               type: 'success',
//               duration: 2000
//             })
//           })
//         }
//       }
//     })
//   },
//   handleUpdate(row) {
//     this.getCategory()
//     this.getDetail(row.id)
//     this.dialogStatus = 'update'
//     this.dialogFormVisible = true
//     this.$nextTick(() => {
//       this.$refs['dataForm'].clearValidate()
//     })
//   },
//   updateData() {
//     this.temp.name = this.temp.name.replace(/(^\s*)|(\s*$)/g, '')
//     this.temp.supperSn = this.temp.supperSn.replace(/(^\s*)|(\s*$)/g, '')
//     this.$refs['dataForm'].validate((valid) => {
//       if (valid) {
//         if (promptMessage(Array, this.picUrl, '上传菜品图片')) {
//           this.temp.picUrl = this.picUrl[0].url
//           editSupper(this.temp).then((res) => {
//             for (const v of this.list) {
//               if (v.id === this.temp.id) {
//                 const index = this.list.indexOf(v)
//                 this.list.splice(index, 1, this.temp)
//                 break
//               }
//             }
//             this.dialogFormVisible = false
//             this.$notify({
//               title: '成功',
//               message: '修改成功',
//               type: 'success',
//               duration: 2000
//             })
//           })
//         }
//       }
//     })
//   },