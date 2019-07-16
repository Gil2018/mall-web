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

$('.address-list label.addressInfo').click(function () {
  const that = this
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
          $(that).parent().parent().addClass('default selected')
          $('.address-wrap .addressBox .marker-par').remove()
          $(that).before(`<div class="marker-par">
          <i class="fa fa-location-arrow marker"></i>
          <span class="marker-tip">寄送至</span>
        </div>`)
          // console.log($(that).parent().parent().html())

          // $('.address-list label.addressInfo').attr('class', '')
        }
      }
    }
  });
})