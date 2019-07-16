$(function () {
    let params = {
        page: 1,
        size: 9
    }

    getList()
    getCategoryList()
    getSidebarItem()

    function getList() {
        ajaxPromise({ url: `${baseUrl}/wx/goods/list`, data: params }).then(res => {
            // 将数据渲染到页面
            res.data.total = 19
            $('.items-info').html(` ${params.size} 条/页 共 ${res.data.total} 条`)
            $("#product_list").html(template("product_temp", { list: res.data.items }))
            Layout.initImageZoom();
            // 调用分页函数.参数:当前所在页, 总页数(用总条数 除以 每页显示多少条,在向上取整), ajax函数
            setPage(params.page, params.size, Math.ceil(res.data.total / params.size), getList)
        })
    }

    /**
     * @param page 当前所在页
     * @param size 每页数量
     * @param pageSum 总页数
     * @param callback 调用ajax
     */
    function setPage(page, size, pageSum, callback) {
        $(".pagination").bootstrapPaginator({
            //设置版本号
            bootstrapMajorVersion: 3,
            // 显示第几页
            currentPage: page,
            // 总页数
            totalPages: pageSum,
            numberOfPages: size,//每页记录数
            itemTexts: function (type, page, current) {//设置分页按钮显示字体样式
                switch (type) {
                    case "first":
                        return "首页";
                    case "prev":
                        return "上一页";
                    case "next":
                        return "下一页";
                    case "last":
                        return "末页";
                    case "page":
                        return page;
                }
            },
            //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
            onPageClicked: function (event, originalEvent, type, page) {
                // 把当前点击的页码赋值给params.page, 调用ajax,渲染页面
                params.page = page
                callback && callback()
            }
        })
    }
})











