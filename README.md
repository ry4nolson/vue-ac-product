# vue-ac-product
AmeriCommerce product display vue component.

This component uses the AmeriCommerce REST API to load a product or products to be used similar to a product display 


# Usage
## step 1
### display 1 product:
```html
<vue-ac-product mode="single" product-id="1">
  <div>
    {{product.item_name}}
  </div>
</vue-ac-product>
```

### display multiple products:
```html
<vue-ac-product mode="multiple" product-ids="1,2,3">
  <div>
    <div v-for="product in products">
      {{product.item_name}}
    </div>
  </div>
</vue-ac-product>
```

### display all products for a category
```html
<vue-ac-product mode="category" category-id="1">
  <div>
    <div v-for="product in products">
      {{product.item_name}}
    </div>
  </div>
</vue-ac-product>
```


## step 2

### include vue
include vue 2.x (if you haven't already) ex: 
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.3/vue.min.js"></script>
```

### initialize
```html
<script>
  // can be a single or multiple element selector
  var VUE_ROOT = "#app";
  //api key should only have access to read catalog data.
  var VUE_AC_API_KEY = "";
  // use secure domain name for your americommerce store
  var VUE_AC_SECURE_DOMAIN = "";
  // IF you are using this component within an existing Vue app set this to true;
  var EXISTING_VUE_APP = false;
</script>
```

### include ```vue-ac-product.js``` or ```vue-ac-product.min.js```

```html
<script src="vue-ac-product.js"></script>
```