$(document).ready(()=>{

    //Delete Order
    var temp = 0;
    $(document).on('click','.delete',function(){
        $('#deleteOrder').attr('data-oid',$(this).attr('data-oid'));
        temp = $(this).parents('tr');
        $('#deleteOrderModal').modal('show');
    });

    $(document).on('submit','#deleteOrderForm',function(event){
        event.preventDefault();
        var id = $('#deleteOrder').attr('data-oid');
        $('#deleteOrderModal').modal('hide');
        temp.remove();
        $.ajax({
            type: "DELETE",
            url: 'http://localhost:3000/orders/'+id,
            success: function(){
                console.log("Order Deleted sucessfully");
            },
            error: function(){
                console.log("Error in deleting Order");
            }
        });
    });

    // Add Amount
    var temp;
    var values = {};
    $(document).on('click','.addAmount',function(){
        $('#addAmountField').attr('data-oid',$(this).parents("tr").find("td:eq(0)").text());
        temp = $(this).parents("tr").find("td:eq(2)");
        values['balance'] = $(this).parents("tr").find("td:eq(2)").text()
        $('#addAmountModal').modal('show');
    });

    $(document).on("submit", "#addAmountForm", function( event ){
        event.preventDefault();
        var $inputs = $('#addAmountForm :input').slice(1,-2);
        
        
        values[$inputs.attr('name')] = $inputs.val();
        values['oid'] = $inputs.attr('data-oid');
        
        console.log(values);
        
        $.ajax({
            type: "PUT",
            url: 'http://localhost:3000/orders/',
            data: JSON.stringify(values),
            contentType: 'application/json',
            success: function(balance){
                $('#addAmountModal').modal('hide');
                console.log("Account updated sucessfully");
                temp.html(balance);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                   alert(xhr.responseText);
            }
        });
    });
});