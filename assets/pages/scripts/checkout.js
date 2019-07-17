var Checkout = function () {
  return {
    init: function () {
      $('#checkout').on('change', '#checkout-content input[name="account"]', function () {
        var title = '';
        if ($(this).attr('value') == 'register') {
          title = 'Step 2: Account &amp; Billing Details';
        } else {
          title = 'Step 2: Billing Details';
        }
        $('#payment-address .accordion-toggle').html(title);
      });
    }
  };
}();

// 获取收货地址列表
function getAddressList() {
  ajaxPromise({ url: `${baseUrl}/wx/address/list` }).then(res => {
    let temp = ''
    res.data.forEach(item => {
      if (item.isDefault) {
        temp += `<li class="address-wrap default selected">
        <div class="addressBox">
          <div class="marker-par">
            <i class="fa fa-location-arrow marker"></i>
            <span class="marker-tip">寄送至</span>
          </div>
          <label for="addressInput" class="addressInfo" onclick="switchoverAddress(this)">
            <span class="user-address">
              ${item.province} ${item.city} ${item.district} ${item.addressDetail} ${item.addressName} ( ${item.name} 收 )
              <em>${item.mobile}</em>
            </span>
          </label>
        </div>
      </li>`
      } else {
        temp += `<li class="address-wrap">
        <div class="addressBox">
          <label for="addressInput" class="addressInfo" onclick="switchoverAddress(this)">
            <span class="user-address">
              ${item.province} ${item.city} ${item.district} ${item.addressDetail} ${item.addressName} ( ${item.name} 收 )
              <em>${item.mobile}</em>
            </span>
          </label>
        </div>
      </li>`
      }
    });
    $('#address-list').html(temp)
  })
}

// 点击切换收货地址
function switchoverAddress(e) {
  let hasClass = $(e).parent().parent().hasClass('selected')
  if (!hasClass) {
    $.confirm({
      title: '地址!',
      content: '更换地址后, 您需要重新确认订单信息',
      buttons: {
        cancel: {
          text: '取消'
        },
        confirm: {
          text: '确认',
          btnClass: 'btn-blue',
          keys: ['enter', 'shift'],
          action: function () {
            $('.address-wrap').attr('class', 'address-wrap')
            $(e).parent().parent().addClass('default selected')
            $('.address-wrap .addressBox .marker-par').remove()
            $(e).before(`<div class="marker-par">
            <i class="fa fa-location-arrow marker"></i>
            <span class="marker-tip">寄送至</span>
          </div>`)
            // console.log($(e).parent().parent().html())

            // $('.address-list label.addressInfo').attr('class', '')
          }
        }
      }
    });
  }
}

// 获取购物车商品
function getCartList() {
  ajaxPromise({ url: `${baseUrl}/wx/cart/mall/index` }).then(res => {
    $("#goods-data").html(template('cart_list', res.data))
  })
}

// 修改
function changeNumber(e) {
  let number = e.target.value
  let price = e.target.attributes.price.value
  let cartId = e.target.attributes.cartId.value
  $(`.goods-page-total[cartId=${cartId}]`).html(`<strong><span>¥</span>${Number(number) * Number(price)}</strong>`)
  var length = $('.goods-page-total strong').length
  var allTotal = 0
  for (let i = 0; i < length; i++) {
    allTotal += Number($('.goods-page-total strong')[i].innerText.trim().slice(1))
  }
  $('.shopping-total-price .price').html(`<span>¥</span>${allTotal}`)
}

getAddressList()
getCartList()
