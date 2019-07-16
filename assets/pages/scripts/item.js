
$(function () {

  getDetail()
  getCategoryList()
  getSidebarItem()
  getRendom(4, $('#owl-carousel4'))

  function getDetail() {
    let product_id = GetQueryString('product_id')
    console.log(product_id)
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
      res.data.specifications = newArry
      $("#product-page").html(template("product_show", { data: res.data }))
      $('#Description').find('p').html(res.data.detail)
    });
  }
})











