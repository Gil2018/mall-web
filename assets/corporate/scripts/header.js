
const pathname = window.location.pathname;
const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
if (userInfo) {
    $('.additional-nav .list-inline .login_btn').hide()
    $('.additional-nav .list-inline .langs-block').show()
    $('#top-cart .nocart').hide()
    $('#top-cart .top-cart-info').show()
    let current = userInfo.realname
    if (!current) {
        current = '未实名'
    }
    $('.additional-nav .list-inline .langs-block .current').html(current)
} else {
    $('.additional-nav .list-inline .login_btn').show()
    $('#top-cart').html(`<div class="nocart top-cart-info">
                        <a href="javascript:void(0);" class="top-cart-info-count">请登录</a>
                    </div>
                <i class="fa fa-shopping-cart"></i>`)
}

// 退出登录
$('#logout').click(function () {
    $.confirm({
        title: '退出!',
        content: '确认退出吗?',
        buttons: {
            cancel: {
                text: '取消'
            },
            confirm: {
                text: '确认',
                btnClass: 'btn-blue',
                keys: ['enter', 'shift'],
                action: function () {
                    let handleLogout = ajaxPromise({ type: 'post', url: `${baseUrl}/wx/auth/logout` })
                    handleLogout.then(res => {
                        ShowNotice('成功', '退出成功', 'success', 2000, true)
                        sessionStorage.clear()
                        window.location.href = '/login.html'
                    })
                }
            }
        }
    });
})

// 获取推荐分类
function getHeadCategory() {
    ajaxPromise({ url: `${baseUrl}/wx/category/recommend` }).then(res => {
        // 将数据渲染到页面
        if (res.data) {
            $("#nav_category").html(template("category", { categoryList: res.data }))
        }
    })
}

// 获取购物车列表
function getShoppingCart(dom, temp) {
    ajaxPromise({ url: `${baseUrl}/wx/cart/mall/index` }).then(res => {
        // 将数据渲染到页面
        if (res.data) {
            dom.html(template(temp, res.data))
        }
    })
}

// 删除购物车商品
function delCommodity(e) {
    $.confirm({
        title: '删除!',
        content: '确认删除吗?',
        buttons: {
            cancel: {
                text: '取消'
            },
            confirm: {
                text: '确认',
                btnClass: 'btn-blue',
                keys: ['enter', 'shift'],
                action: function () {
                    let params = JSON.stringify({
                        id: e.children[0].innerText
                    })
                    ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/cart/mall/delete`, data: params }).then(res => {
                        ShowNotice(res.errmsg, '删除成功', 'success', 2000, true)
                        getShoppingCart($("#top-cart"), "shopping_cart")
                    })
                }
            }
        }
    });
}

if (pathname !== '/login.html') {
    getShoppingCart($("#top-cart"), "shopping_cart")
    getHeadCategory()
}