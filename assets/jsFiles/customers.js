
function search() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
        
    }
}


$(document).ready(()=>{

    //Delete Customer
    var temp = 0;
    $(document).on('click','.delete',function(){
        $('#deleteCustomer').attr('data-cid',$(this).attr('data-cid'));
        temp = $(this).parents('tr');
        $('#deleteCustomerModal').modal('show');
    });

    $(document).on('submit','#deleteCustomerForm',function(event){
        event.preventDefault();
        var id = $('#deleteCustomer').attr('data-cid');
        $('#deleteCustomerModal').modal('hide');
        temp.remove();
        $.ajax({
            type: "DELETE",
            url: 'http://localhost:3000/customers/'+id,
            success: function(){
                console.log("Customer Deleted sucessfully");
            },
            error: function(){
                console.log("Error in deleting Customer");
            }
        });
    });

    // Add new Customer
    $(document).on('click','.addCustomer',function(){
        $('#addCustomerModal').modal('show');
    });

    $(document).on("submit", "#addCustomerForm", function( event ){
        event.preventDefault();
        var $inputs = $('#addCustomerForm :input').slice(1,-2);
        

        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
        });
        console.log(values);
        $.ajax({
            type: "POST",
            url: 'http://localhost:3000/customers/',
            data: JSON.stringify(values),
            contentType: 'application/json',
            success: function(Customer){
                $('#addCustomerModal').modal('hide');
                console.log("Customer Added sucessfully");
                $('tbody').append(
                    '<tr>' +
						'<td>'+Customer.cid+'</td>'+
						'<td>'+Customer.name+'</td>'+
						'<td>'+Customer.contact+'</td>'+
                        '<td>'+
                            '<a href="/orders/<%=order.oid%>/invoice" target="_blank" class="addOrder" data-cid='+Customer.cid+'><i class="material-icons" data-toggle="tooltip" title="Orders">dvr</i></a>'+
							'<a href="" class="edit" data-toggle="modal" data-cid='+Customer.cid+'><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>'+
							'<a href="" class="delete" data-toggle="modal" data-cid='+Customer.cid+'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
						'</td>'+
                    '</tr>'
                );
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseText == '1062'){
                    $("#add_name_error").html("\* Name already exist");
                } else {
                    alert(xhr.responseText);
                }
            }
        });
    });

    //Edit Customer
    var edit_row;
    $(document).on('click','.edit',function(){
        $('#editCustomerID').attr('value',$(this).parents("tr").find("td:eq(0)").text());
        $('#editCustomername').attr('value',$(this).parents("tr").find("td:eq(1)").text());
        $('#editCustomercontact').attr('value',$(this).parents("tr").find("td:eq(2)").text());

        edit_row = $(this).parents('tr');
        $('#editCustomerModal').modal('show');
    });

    // On submit
    $(document).on("submit", "#editCustomerForm", function( event ){
        event.preventDefault();
        var $inputs = $('#editCustomerForm :input').slice(1,-2);
        
        var values = {};
        $inputs.each(function() {
            values[this.name] = $(this).val();
        });
        console.log(values);
        $.ajax({
            type: "PUT",
            url: 'http://localhost:3000/customers/',
            data: JSON.stringify(values),
            contentType: 'application/json',
            success: function(Customer){
                $('#editCustomerModal').modal('hide');
                console.log("Customer updated sucessfully");
                edit_row.html(
						'<td>'+Customer.cid+'</td>'+
						'<td>'+Customer.name+'</td>'+
						'<td>'+Customer.contact+'</td>'+
                        '<td>'+
                            '<a href="/orders/<%=order.oid%>/invoice" target="_blank" class="addOrder" data-cid='+Customer.cid+'><i class="material-icons" data-toggle="tooltip" title="Orders">dvr</i></a>'+
							'<a href="" class="edit" data-toggle="modal" data-cid='+Customer.cid+'><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>'+
							'<a href="" class="delete" data-toggle="modal" data-cid='+Customer.cid+'><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>'+
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
});
