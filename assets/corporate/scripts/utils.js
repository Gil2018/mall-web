// api
window.baseUrl = 'http://zhkapi.fxz.ink'

// 消息提示
function ShowNotice(title, text, type, delay, is_mouse_reset) {
  PNotify.prototype.options.styling = 'bootstrap3'
  new PNotify({
    title: title,
    text: text,
    type: type,
    delay: delay,
    hide: true, //是否自动关闭
    mouse_reset: is_mouse_reset //鼠标悬浮的时候，时间重置
  })
}

// 根据name获取url参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

// 获取商品(模态框)详情
function viewDetail(e) {
  var product_id = e.children[0].innerText
  ajaxPromise({ url: `${baseUrl}/wx/goods/detail`, data: { id: product_id } }).then(res => {
    var specifications = res.data.specifications
    var temp = {};
    for (var i in specifications) {
      var key = specifications[i].specification;
      if (temp[key]) {
        temp[key].valueArr += `,${specifications[i].value}`;
        temp[key].specification = specifications[i].specification;
      } else {
        temp[key] = {};
        temp[key].valueArr = specifications[i].value;
        temp[key].specification = specifications[i].specification;
      }
      temp[key].valueArr = temp[key].valueArr.split(",")
    }
    var newArry = [];
    for (var k in temp) {
      newArry.push(temp[k])
    }
    res.data.newspecifications = newArry
    $("#product_det").html(template("product_detail", { data: res.data }))
  });
}

// 点击互换图片
function changeImage(e) {
  $(e).siblings().removeClass()
  $(e).addClass('active')
  var thisSrc = e.children[0].src
  var mainSrc = $(e).parent().siblings().children().attr('src')
  $(e).parent().siblings().children().attr('src', thisSrc)
  e.children[0].src = mainSrc
}

// 判断数组相等
function ArrayIsEqual(arr1, arr2) {//判断2个数组是否相等
  if (arr1 === arr2) {//如果2个数组对应的指针相同，那么肯定相等，同时也对比一下类型
    return true;
  } else {
    if (arr1.length != arr2.length) {
      return false;
    } else {//长度相同
      for (let i in arr1) {//循环遍历对比每个位置的元素
        if (arr1[i] != arr2[i]) {//只要出现一次不相等，那么2个数组就不相等
          return false;
        }
      }//for循环完成，没有出现不相等的情况，那么2个数组相等
      return true;
    }
  }
}

// 加入购物车
function add2Cart(e) {
  var product = JSON.parse(e.children[0].innerText)
  let num = Number($('#product_det .product-quantity input').val())
  let params = { goodsId: product.id }
  if (num) {
    let specArr = []
    let productId = product.products[0].id
    for (let i = 0; i < product.newspecifications.length; i++) {
      specArr.push($(`#product_det .product-page-options .pull-left select[name=${product.newspecifications[i].specification}] option:selected`).val())
    }
    product.products.forEach(item => {
      if (ArrayIsEqual(item.specifications, specArr)) {
        productId = item.id
      }
    });
    params.number = num
    params.productId = productId
  } else {
    params.number = 1
    params.productId = product.products[0].id
  }
  ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/cart/mall/add`, data: JSON.stringify(params) }).then(res => {
    ShowNotice(res.errmsg, '加入购物车成功', 'success', 2000, true)
    getShoppingCart($("#top-cart"), "shopping_cart")
  })
}

// 修改规格
function changeSpec(e) {
  var product = JSON.parse(e.attributes.data.value)
  let specArr = []
  for (let i = 0; i < product.newspecifications.length; i++) {
    specArr.push($(`#product_det .product-page-options .pull-left select[name=${product.newspecifications[i].specification}] option:selected`).val())
  }
  product.products.forEach(item => {
    if (ArrayIsEqual(item.specifications, specArr)) {
      $('#product_det .product-main-image').children().attr('src', item.url)
    }
  })
}

// 获取推荐商品
function getRendom(num, ele) {
  ajaxPromise({ url: `${baseUrl}/wx/goods/rendom`, data: { number: num } }).then(res => {
    // 将数据渲染到页面
    res.data[0].picUrl = './assets/pages/img/products/product1.png'
    res.data[1].picUrl = './assets/pages/img/products/product2.png'
    res.data[2].picUrl = './assets/pages/img/products/product3.png'
    if (res.data.length === 5) {
      res.data[3].picUrl = './assets/pages/img/products/product4.png'
      res.data[4].picUrl = './assets/pages/img/products/product1.png'
    }
    res.data.forEach(item => {
      if (item.id === 5) {
        item.name = '秋季新款卫衣'
      }
    })
    ele.html(template("product_item", { list: res.data }))
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

// 侧边栏分类菜单
function getCategoryList() {
  ajaxPromise({ url: `${baseUrl}/wx/category/list` }).then(res => {
    // 将数据渲染到页面
    res.data = [{
      name: '爆款榜单',
      childList: ''
    },{
      name: '上衣T恤',
      childList: ''
    },{
      name: '长裤/短裤',
      childList: ''
    },{
      name: '休闲卫衣',
      childList: ''
    },{
      name: '外套夹克',
      childList: ''
    },{
      name: '配件',
      childList: ''
    }]
    $("#sidebar-menu").html(template("category_menu", { categoryList: res.data }))
  })
}

// 侧边栏热销商品
function getSidebarItem() {
  ajaxPromise({ url: `${baseUrl}/wx/goods/rendom`, data: { number: 3 } }).then(res => {
    // 将数据渲染到页面
    $('#sidebar-products').html(template("sidebar3", { list: res.data }))
  })
}

// 商品搜索
function handleSearch(e) {
  // console.log()
  let search = $('.search-box input[name="search"]').val()
  let href = encodeURI(`search-result.html?search=${search}`)
  window.location.href = href
}
