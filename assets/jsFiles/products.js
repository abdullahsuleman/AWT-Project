
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
                console.log("Error in deleting Product");
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
						'<td>'+product.folio+'</td>'+
                        '<td>'+product.price+'</td>'+
                        '<td>'+product.quantity+'</td>'+
						'<td>'+
							'<a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>'+
							'<a href="" class="delete" data-toggle="modal" value='+product.pid+'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
						'</td>'+
                    '</tr>'
                );
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseText == '1062'){
                    $("#add_name_error").html("* Name already exist");
                }
            }
        });
      
    });

});
