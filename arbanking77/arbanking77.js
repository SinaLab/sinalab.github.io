
var text = "";
var alam = "";

function ExcuteBank() {
	var input = $('#text').val();
	var bankId = document.getElementById("bankId");
	

	$('#output').html('<i class="fa fa-spinner fa-spin" style="font-size:24px" id="loading_icon"></i>');
	$.ajax({
//		url: "https://ontology.birzeit.edu/sina/v2/api/BankIntent/?apikey=BankIntentKey",
//		data: JSON.stringify({ "lang": "ar", "text": input }),
//		type: "POST",
		url: 'https://sinalab-BankIntent-api.hf.space/predict',
        data: JSON.stringify({"lang": "ar" , "text": input}),
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		timeout: 10000000,
		success: function (data) {
			
			var statusCode = data["statusCode"];
			if (statusCode.toString() == "0") {
				document.getElementById("loading_icon").style.animation = "none";
				document.getElementById("loading_icon").style.display = "none";

				bankId.style.opacity = "1";
				/*Go_Text.style.display = "block";*/
				val = data["resp"];
				console.log(val);

				var output = '<div class="row slideanim container">';
				
				var counter = 0; 
				var end = "False";
                for (var i = 0; i < val.length; i++) {
					if(counter == 4) {
						output += '</div>';
						output += '<div class="row slideanim container">';
						end = "True";
					}
					output += '<div class="col-md-3 col-sm-6 videos-card">';
					output += '<div class="card">';
					output += ' <div class="intent">'+val[i]["predicted_label"][0]+'</div>';
					// output += ' <div class="sentence">'+val[i]["text"][0]+'</div>';
					output += '</div>';
					output += '</div>';
					counter = counter + 1;
					end = "False";
                }
	            	      
				if(end == "False"){
					output += '</div>';
				}
				
				//output += key + ': ' + value + '<br>';
				$('#output').html(output);


			}
		}
	});
}

