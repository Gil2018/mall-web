$('.header').load('./header.html', function (responseTxt, statusTxt, xhr) { })
$('.footer').load('./footer.html', function (responseTxt, statusTxt, xhr) { })
$(function () {
    let time = 60
    let flag = true //设置点击标记，防止60内再次点击生效
    //发送验证码
    $('#sendMobileCode').click(function () {
        $(this).attr('disabled', true)
        var phone = $.trim($('#mobile').val())
        if (phone) {
            if (flag) {
                var timer = setInterval(function () {
                    if (time == 60 && flag) {
                        flag = false
                        var params = JSON.stringify({
                            mobile: phone
                        })
                        let sendCaptcha = ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/auth/captcha`, data: params })
                        sendCaptcha.then(res => {
                            ShowNotice('成功', '发送成功', 'success', 2000, true)
                            $('#dyMobileButton').html('已发送')
                        }).catch(err => {
                            flag = true
                            time = 60
                            clearInterval(timer)
                        })
                    } else if (time == 0) {
                        $('#dyMobileButton').removeAttr('disabled')
                        $('#dyMobileButton').html('获取验证码')
                        clearInterval(timer)
                        time = 60
                        flag = true
                    } else {
                        $('#dyMobileButton').html(time + ' s 重新发送')
                        time--
                    }
                }, 1000)
            }
        } else {
            ShowNotice('提示', '请输入手机号码', 'notice', 2000, true)
        }
    })

    //   登录
    $('#login_btn').click(function (e) {
        var params = JSON.stringify({
            code: $.trim($('#login_code').val()),
            mobile: $.trim($('#mobile').val())
        })
        console.log(params)
    })

})

function switchingMode(e) {
    let text = $(e).text()
    if (text.includes('电子邮箱')) {
        $('#sendMobileCode').hide()
        $(e).text('使用手机号码注册')
        $("label[for='mobile']").text("电子邮件")
        $("label[for='login_code']").text("密码")
        $('.explain').text("我们将发送电子邮件至您的邮箱, 请单击包含的链接以验证您的电子邮箱地址")
    } else {
        $('#sendMobileCode').show()
        $(e).text('使用电子邮箱注册')
        $("label[for='mobile']").text("手机号码")
        $("label[for='login_code']").text("验证码")
        $('.explain').text("我们将通过短信向您发送一条一次性验证码, 以验证你的号码")
    }
}
