$("#search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tableBody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
  
  var shoppingCart = function () {
    // =============================
    // Private methods and propeties
    // =============================
    cart = [];
  
    // Constructor
    function Item(id, name, price, count, cid, wid) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.count = count;
      this.cid = cid;
      this.wid = wid;
    }
  
    // Save cart
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
  
    // Load cart
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }
  
  
    // =============================
    // Public methods and propeties
    // =============================
    var obj = {};
  
    // Add to cart
    obj.addItemToCart = function (id, name, price, count, cid, wid) {
      for (var item in cart) {
        if (cart[item].id === id) {
          cart[item].count++;
          saveCart();
          return;
        }
      }
      var item = new Item(id, name, price, count, cid, wid);
      cart.push(item);
      saveCart();
    };
    // Set count from item
    obj.setCountForItem = function (id, count) {
      for (var i in cart) {
        if (cart[i].id === id) {
          cart[i].count = count;
          break;
        }
      }
    };
    // Remove item from cart
    obj.removeItemFromCart = function (id) {
      for (var item in cart) {
        if (cart[item].id === id) {
          cart[item].count--;
          if (cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
      }
      saveCart();
    };
  
    // Remove all items from cart
    obj.removeItemFromCartAll = function (id) {
      for (var item in cart) {
        if (cart[item].id === id) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    };
  
    // Clear cart
    obj.clearCart = function () {
      cart = [];
      saveCart();
    };
  
    // Count cart 
    obj.totalCount = function () {
      var totalCount = 0;
      for (var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    };
  
    // Total cart
    obj.totalCart = function () {
      var totalCart = 0;
      for (var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    };
  
    // List cart
    obj.listCart = function () {
      var cartCopy = [];
      for (i in cart) {
        item = cart[i];
        itemCopy = {};
        for (p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy);
      }
      return cartCopy;
    };
  
    return obj;
  }();
  
  
  // *****************************************
  // Triggers / Events
  // ***************************************** 
  // Add item
  $('.add-to-cart').click(function (event) {
    event.preventDefault();
    var cid = Number($(this).data('cid'));
    var id = Number($(this).data('id'));
    var wid = $('#warehouseSelection'+id).val();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(id, name, price, 1, cid, wid);
    displayCart();
  });
  
  // Clear items
  $('.clear-cart').click(function () {
    shoppingCart.clearCart();
    displayCart();
  });
  
  
  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for (var i in cartArray) {
      output += "<tr>" +
      "<td>" + cartArray[i].name + "</td>" +
      "<td>(Rs." + cartArray[i].price + " per item)</td>" +
      "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-success' data-id=" + cartArray[i].id + ">-</button>" +
      "<input type='number' class='item-count form-control' data-id='" + cartArray[i].id + "' value='" + cartArray[i].count + "'>" +
      "<button class='plus-item btn btn-success input-group-addon' data-id=" + cartArray[i].id + ">+</button></div></td>" +
      "<td><button class='delete-item btn btn-danger' data-id=" + cartArray[i].id + ">X</button></td>" +
      " = " +
      "<td>Rs." + cartArray[i].total + "</td>" +
      "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }
  
  // Delete item button
  $('.show-cart').on("click", ".delete-item", function (event) {
    var id = $(this).data('id');
    shoppingCart.removeItemFromCartAll(id);
    displayCart();
  });
  
  
  // -1
  $('.show-cart').on("click", ".minus-item", function (event) {
    var id = $(this).data('id');
    shoppingCart.removeItemFromCart(id);
    displayCart();
  });
  // +1
  $('.show-cart').on("click", ".plus-item", function (event) {
    var id = $(this).data('id');
    shoppingCart.addItemToCart(id);
    displayCart();
  });
  
  // Item count input
  $('.show-cart').on("change", ".item-count", function (event) {
    var id = $(this).data('id');
    var count = Number($(this).val());
    shoppingCart.setCountForItem(id, count);
    displayCart();
  });
  
  // Order Functionality
  $('.order-button').click(function () {
    // console.log(shoppingCart.listCart());
    var c = JSON.stringify(shoppingCart.listCart());
    console.log(c);
    var a = JSON.parse(c);
    var total = 0;
    for (o of a) {
      total += Number(o.total);
    };
    console.log(a);
  
  
    event.preventDefault();
    
    $.ajax({
        type: "POST",
        url: 'http://localhost:3000/orders/createOrder/',
        data: JSON.stringify(shoppingCart.listCart()),
        contentType: 'application/json',
        success: function(){
            $('#alert-message').html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> New order added successfully.</div>');
            console.log("New Order Added sucessfully");
            shoppingCart.clearCart();
            displayCart();
            $('#cart').modal('hide');
            $('.modal-backdrop').hide();
            location.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseText != '1062'){
                alert(xhr.responseText);
            }
            $('.alert-message').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Failure!</strong> Connection Lost or Not Enough Stock In The Selected Warehouse.</div>');
        }
    });
  });
  
  displayCart();