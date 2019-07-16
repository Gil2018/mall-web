
$(function () {

    getBannerList()
    getRendom(5, $('#owl-carousel5'))
    getRendom(3, $('#owl-carousel3'))
    getCategoryList()

    function getBannerList() {
        ajaxPromise({ url: `${baseUrl}/wx/ad/list`, data: { type: 1 } }).then(res => {
            // 将数据渲染到页面
            $("#carousel-example-generic").html(template("banner", { bannerList: res.data }))
            $('.carousel-inner').children(":first").addClass('active')
            $('.carousel-indicators').children(":first").addClass('active')
        })
    }



})
