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
        let handleLogin = ajaxPromise({ type: 'post', contentType: 'application/json', url: `${baseUrl}/wx/auth/loginByMobile`, data: params })
        handleLogin.then(res => {
            ShowNotice('成功', '登录成功', 'success', 2000, true)
            sessionStorage.setItem('token-wx', res.data.token)
            sessionStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
            e.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'file:///F:/DownLoad/shopping3/shopping3/index.html'
            }
        })
    })
})
