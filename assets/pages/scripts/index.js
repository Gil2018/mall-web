
$(function () {

    getBannerList()
    getRendom(5, $('#owl-carousel5'))
    getRendom(4, $('.owl-carousel4'))
    getRendom(3, $('#owl-carousel3'))
    getCategoryList()

    function getBannerList() {
        ajaxPromise({ url: `${baseUrl}/wx/ad/list`, data: { type: 1 } }).then(res => {
            // 将数据渲染到页面
            res.data[0].url = './assets/pages/img/index-sliders/slide4.png'
            res.data[1].url = './assets/pages/img/index-sliders/slide5.png'
            res.data[2].url = './assets/pages/img/index-sliders/slide1.jpg'
            $("#carousel-example-generic").html(template("banner", { bannerList: res.data }))
            $('.carousel-inner').children(":first").addClass('active')
            $('.carousel-indicators').children(":first").addClass('active')
        })
    }
})
