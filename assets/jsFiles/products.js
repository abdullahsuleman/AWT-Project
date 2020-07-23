
$(document).ready(()=>{

    //Delete Product
    var temp = 0;
    $(document).on('click','.delete',function(){
        $('#deleteProduct').attr('data-pid',$(this).attr('data-pid'));
        temp = $(this).parents('tr');
        $('#deleteProductModal').modal('show');
    });

    $(document).on('submit','#deleteProductForm',function(event){
        event.preventDefault();
        var id = $('#deleteProduct').attr('data-pid');
        $('#deleteProductModal').modal('hide');
        temp.remove();
        $.ajax({
            type: "DELETE",
            url: 'http://localhost:3000/stock/'+id,
            success: function(){
                console.log("Product Deleted sucessfully");
            },
            error: function(){
                alert("Error in deleting Product");
            }
        });
    });

    // Add new Product
    $(document).on('click','.addProduct',function(){
        $('#addProductModal').modal('show');
    });

    $(document).on("submit", "#addProductForm", function( event ){
        event.preventDefault();
        var $inputs = $('#addProductForm :input').slice(1,-2);
        

        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
        });

        $.ajax({
            type: "POST",
            url: 'http://localhost:3000/stock/',
            data: JSON.stringify(values),
            contentType: 'application/json',
            success: function(product){
                $('#addProductModal').modal('hide');
                console.log("Product Added sucessfully");
                $('tbody').append(
                    '<tr>' +
						'<td>'+product.pid+'</td>'+
						'<td>'+product.name+'</td>'+
						'<td>'+product.description+'</td>'+
                        '<td>'+product.price+'</td>'+
                        '<td>'+0+'</td>'+
                        '<td>'+0+'</td>'+
                        '<td>'+0+'</td>'+
                        '<td>'+0+'</td>'+
                        '<td>'+
                            '<a href="" class="addstock" data-toggle="modal" data-pid='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Edit">add_box</i></a>'+
							'<a href="" class="edit" data-toggle="modal" data-pid='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>'+
							'<a href="" class="delete" data-toggle="modal" data-pid='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
						'</td>'+
                    '</tr>'
                );
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseText == '1062'){
                    $("#add_name_error").html("* Name already exist");
                } else {
                    alert(xhr.responseText);
                }
            }
        });
      
    });

    // Edit Product
    var edit_row;
    $(document).on('click','.edit',function(){
        $('#editProductID').attr('value',$(this).parents("tr").find("td:eq(0)").text());
        $('#editproductname').attr('value',$(this).parents("tr").find("td:eq(1)").text());
        $('#editProductdescription').attr('value',$(this).parents("tr").find("td:eq(2)").text());
        $('#editProductPrice').attr('value',$(this).parents("tr").find("td:eq(3)").text());

        edit_row = $(this).parents('tr');
        $('#editProductModal').modal('show');
    });

    $(document).on("submit", "#editProductForm", function( event ){
        event.preventDefault();
        var $inputs = $('#editProductForm :input').slice(1,-2);
        
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
        });
        console.log(values);
        $.ajax({
            type: "PUT",
            url: 'http://localhost:3000/stock/',
            data: JSON.stringify(values),
            contentType: 'application/json',
            success: function(product){
                $('#editProductModal').modal('hide');
                console.log("Product updated sucessfully");
                edit_row.html(
                    '<td>'+product.pid+'</td>'+
                    '<td>'+product.name+'</td>'+
                    '<td>'+product.description+'</td>'+
                    '<td>'+product.price+'</td>'+
                    '<td>'+product.w1+'</td>'+
                    '<td>'+product.w2+'</td>'+
                    '<td>'+product.w3+'</td>'+
                    '<td>'+product.w4+'</td>'+
                    '<td>'+
                        '<a href="" class="addstock" data-toggle="modal" data-pid='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Edit">add_box</i></a>'+
						'<a href="" class="edit" data-toggle="modal" data-pid='+product.cid+'><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>'+
						'<a href="" class="delete" data-toggle="modal" data-pid='+product.cid+'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
					'</td>'
                );
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseText == '1062'){
                    $("#edit_name_error").html("\* Name already exist");
                } else {
                    alert(xhr.responseText);
                }
            }
        });
    });

    // Add Stock 
    var id;
    $(document).on('click','.addstock',function(){

        // getting ID of selected product
        id=$(this).attr('data-pid'); 

        // Passing value of w1,w2,w3,w4 to model
        $('#addStockTitle').text($(this).parents("tr").find("td:eq(1)").text());
        $('#addW1').attr('value',$(this).parents("tr").find("td:eq(4)").text());
        $('#addW2').attr('value',$(this).parents("tr").find("td:eq(5)").text());
        $('#addW3').attr('value',$(this).parents("tr").find("td:eq(6)").text());
        $('#addW4').attr('value',$(this).parents("tr").find("td:eq(7)").text());

        // Storing selected row for later changes
        edit_row = $(this).parents('tr'); 
        $('#addStockModal').modal('show');
    });

    $(document).on("submit", "#addStockForm", function( event ){
        event.preventDefault();

        // Selecting required fields
        var $inputs = $('#addStockForm :input').slice(1,-2); 
        
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
        });

        $.ajax({
            type: "PUT",
            url: 'http://localhost:3000/stock/'+String(id),
            data: JSON.stringify(values),
            contentType: 'application/json',
            success: function(product){
                $('#addStockModal').modal('hide');
                console.log("Stock updated sucessfully");  
                edit_row.html(
                    '<td>'+product.pid+'</td>'+
                    '<td>'+product.name+'</td>'+
                    '<td>'+product.description+'</td>'+
                    '<td>'+product.price+'</td>'+
                    '<td>'+product.w1+'</td>'+
                    '<td>'+product.w2+'</td>'+
                    '<td>'+product.w3+'</td>'+
                    '<td>'+product.w4+'</td>'+
                    '<td>'+
                    '<a href="" class="addstock" data-toggle="modal"  data-pid='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Edit">add_box</i></a>'+
                        '<a href="" class="edit" data-toggle="modal" data-pid='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>'+
                        '<a href="" class="delete" data-toggle="modal" data-pid='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
                    '</td>'
                );
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.responseText);
            }
        });
    });
});
