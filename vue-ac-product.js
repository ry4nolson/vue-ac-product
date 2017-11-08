(function(){
  function apiCall(mode, filter){
    return new Promise(function(resolve, error){

      var endpoint;
      
      if (mode == "single")
        endpoint = "/api/v1/products/" + filter;
      else if (mode == "multiple")
        endpoint = "/api/v1/products?id=" + filter;
      else if (mode == "category")
        endpoint = "/api/v1/categories/" + filter + "/products";

      var r = new XMLHttpRequest();
      r.open("GET", "https://" + VUE_AC_SECURE_DOMAIN + endpoint, true);
      r.setRequestHeader("x-ac-auth-token", VUE_AC_API_KEY);
      r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200)
          return;
        resolve(r.responseText);
      };
      r.send(null);
    })
  }

  Vue.component('vue-ac-product',{
    props: ["mode", "product-id", "product-ids", "category-id"],
    data: function(){
      var self = this;
      var mode = self._props.mode || "single"; 
      var filter;

      switch(mode){
        case "category":
          filter = self._props.categoryId;
          break;
        case "multiple":
          filter = self._props.productIds.split(",").join("+OR+");
          break;
        case "single":
        default:
          filter = self._props.productId;
          break;
      }

      apiCall(mode, filter).then(function(value){
        if (mode == "single")
          self.product = JSON.parse(value);
        else if (mode == "multiple")
          self.products = JSON.parse(value).products;
        else if (mode == "category")
          self.products = JSON.parse(value).products;

        self.$el.setAttribute && self.$el.setAttribute("style", "");
      });

      if (mode == "single"){
        return {
          products: [],
          product: { /* populated via ajax */}
        }
      }
      return {
        products: []
      }
    }
  });

  if (!window.EXISTING_VUE_APP || !EXISTING_VUE_APP){
    new Vue({
      el : VUE_ROOT
    });
  }
})();
