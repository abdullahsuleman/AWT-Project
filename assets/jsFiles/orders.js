$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();

	$('#button').click(function() {
		var customer = $( "#customerSelection" ).val();
		console.log("/"+customer+"/createOrder/")
		window.location.href = "createOrder/"+customer+"/new";
	});
});
