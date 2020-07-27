$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();

	$('#button').click(function() {
		var customer = $( "#customerSelection" ).val();
		console.log("/"+customer+"/orders/")
		window.location.href = "orders/"+customer+"/newOrder";
	});
});
