(function(){
  var productStati = {};

  function apiCall(mode, filter, res){
    return new Promise(function(resolve, error){

      var endpoint;
      
      if (mode == "single")
        endpoint = "/api/v1/products/" + filter + "?expand=pictures";
      else if (mode == "multiple")
        endpoint = "/api/v1/products?id=" + filter + "&expand=pictures";
      else if (mode == "category")
        endpoint = "/api/v1/categories/" + filter + "/products";
      else if (mode == "status")
        endpoint = "/api/v1/product_statuses/" + filter;

      var r = new XMLHttpRequest();
      r.open("GET", "https://" + VUE_AC_SECURE_DOMAIN + endpoint, true);
      r.setRequestHeader("x-ac-auth-token", VUE_AC_API_KEY);
      r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200)
          return;

        res && res(r.responseText);

        if (mode == "category"){
          var products = JSON.parse(r.responseText).products;
            apiCall("multiple", products.map(function(item) { return item.id}).join("+OR+"), resolve);
        } else 
          resolve(r.responseText);
      };
      r.send(null);
    });
  }

  //from https://bost.ocks.org/mike/shuffle/
  function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  Vue.component('vue-ac-product',{
    props: ["mode", "product-id", "product-ids", "category-id", "random"],
    methods: {
      primaryPhoto: function(product){
        var prod = product || this.product;

        if (!prod)
          return;

        if (prod.pictures){
          var primary = prod.pictures.filter(function(pic){ return pic.is_primary});

          if (primary){
            return primary[0].image_file;
          }
        }
        return "";
      },
      productStatus: function(product){
        // var prod = product || this.product;

        // if (!prod.product_status_id)
        //   return {};

        // var statusId = prod.product_status_id;

        // if (productStati[statusId])
        //   return producStati[statusId];
        // else {
        //   apiCall("status", statusId).then(function(value){
        //     return value;
        //   })
        // }
        return "";

      }
    },
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
        else if (mode == "multiple" || mode =="category"){
          self.products = JSON.parse(value).products;
          if (self._props.random){
            self.products = shuffle(self.products);
          }
        }

        self.$el.setAttribute && self.$el.setAttribute("style", "");
      });

      if (mode == "single"){
        return {
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
