const ajaxPromise = param => {
    return new Promise((resovle, reject) => {
        const token = sessionStorage.getItem('token-wx')
        $.ajax({
            headers: {
                "token-wx": token //此处放置请求到的用户token
            },
            dataType: "json",
            contentType: param.contentType || 'application/x-www-form-urlencoded',
            type: param.type || 'get',
            async: param.async || true,
            cache: false,
            url: param.url,
            data: param.data || '',
            success: res => {
                const errmsg = res.errmsg
                const errno = res.errno
                if (errno) {
                    switch (errno) {
                        case 501:
                            $.confirm({
                                title: '错误!',
                                content: '系统未登录，请重新登录!',
                                buttons: {
                                    confirm: {
                                        text: '确认',
                                        btnClass: 'btn-blue',
                                        keys: ['enter', 'shift'],
                                        action: function () {
                                            sessionStorage.clear()
                                            window.location.href = 'login.html'
                                        }
                                    }
                                }
                            })
                            reject('error')
                            break
                        case 502:
                            ShowNotice('错误', '系统内部错误，请联系管理员维护', 'error', 2000, true)
                            reject('error')
                            break
                        case 503:
                            ShowNotice('错误', '请求业务目前未支持', 'error', 2000, true)
                            reject('error')
                            break
                        case 504:
                            ShowNotice('错误', '更新数据已经失效，请刷新页面重新操作', 'error', 2000, true)
                            reject('error')
                            break
                        case 505:
                            ShowNotice('错误', '更新失败，请再尝试一次', 'error', 2000, true)
                            reject('error')
                            break
                        case 506:
                            ShowNotice('错误', '没有操作权限，请联系管理员授权', 'error', 2000, true)
                            reject('error')
                            break
                        default:
                            ShowNotice('错误', errmsg, 'error', 2000, true)
                            reject('error')
                            break
                    }
                } else {
                    resovle(res)
                }
            },
            error: err => {
                console.log(err) // for debug
                ShowNotice('错误', err, 'error', 2000, true)
                return reject(err)
            }
        })
    })
}