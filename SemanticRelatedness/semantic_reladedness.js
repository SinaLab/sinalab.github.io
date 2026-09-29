$(function() {
	$('#compute_relatedness').click(function() {
		var sentence1 = $('#sentence1').val();
		var sentence2 = $('#sentence2').val();
		if(sentence1 == null || sentence1.trim() == "" || sentence2 == null || sentence2.trim() == "") {
			$('#output').val('ERROR: Please provide sentence1 and sentence2 data!');
			if((sentence1 == null || sentence1.trim() == "") && !(sentence2 == null || sentence2.trim() == "")) {
				$('#sentence1').css({'background-color':'#FFFF00'});
				$('#sentence2').css({'background-color':'#FFFFFF'});
			}
			else if((sentence2 == null || sentence2.trim() == "") && !(sentence1 == null || sentence1.trim() == "")) {
				$('#sentence1').css({'background-color':'#FFFFFF'});
				$('#sentence2').css({'background-color':'#FFFF00'});
			}
			else {
				$('#sentence1').css({'background-color':'#FFFF00'});
				$('#sentence2').css({'background-color':'#FFFF00'});
			}
		}
		else {
			$('#sentence1').css({'background-color':'#FFFFFF'});
			$('#sentence2').css({'background-color':'#FFFFFF'});
			$('#output').val('Processing...');

			$.ajax({
				url: 'https://ontology.birzeit.edu/sina/v2/api/Semantic_relatedness/',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					sentence1: sentence1,
					sentence2: sentence2
				}),
				timeout: 3000,
				success: function(data) {
					$('#output').val(JSON.stringify(data["Score"]));
				},
				error: function(xhr, textStatus, errorThrown) {
					$('#output').val('Request failed, please try again later!');
				}
			});
		}
	});
});
