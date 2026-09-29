$(function() {
	$('#removeDuplicates').click(function() {
		var input = $('#input').val();
		var delimiter = $('#delimiter').val();
		if(input == null || input.trim() == "" || delimiter == null || delimiter.trim() == "") {
			$('#output').val('ERROR: Please provide input data!');
			if((input == null || input.trim() == "") && !(delimiter == null || delimiter.trim() == "")) {
				$('#input').css({'background-color':'#FFFF00'});
				$('#delimiter').css({'background-color':'#FFFFFF'});
			}
			else if((delimiter == null || delimiter.trim() == "") && !(input == null || input.trim() == "")) {
				$('#input').css({'background-color':'#FFFFFF'});
				$('#delimiter').css({'background-color':'#FFFF00'});
			}
			else {
				$('#input').css({'background-color':'#FFFF00'});
				$('#delimiter').css({'background-color':'#FFFF00'});
			}
		}
		else {
			$('#input').css({'background-color':'#FFFFFF'});
			$('#delimiter').css({'background-color':'#FFFFFF'});
			$('#output').val('Processing...');
			var ignoreLastLetterDiacs = $('#ignoreLastLetterDiacs').is(":checked");
			var ignoreShadda = $('#ignoreShadda').is(":checked");
			var ignorefirstLetterHamza = $('#ignorefirstLetterHamza').is(":checked");
			var ignoreAL = $('#ignoreAL').is(":checked");

			
			$.ajax({
				url: " https://ontology.birzeit.edu/sina/api/DuplicateCleaner/" + input + "/" + delimiter + "/" + ignoreLastLetterDiacs + "/" + ignoreShadda + "/" + ignorefirstLetterHamza + "/" + ignoreAL,
				timeout: 3000,
				success: function(data){
					//$('#output').val(JSON.stringify(data));
					/*var res = JSON.stringify(data);
					res = res.substring(1, res.length - 1);
					$('#output').val(res);*/
					var obj = jQuery.parseJSON(JSON.stringify(data));
					$('#output').val(obj.Result);
				},
				error: function(xhr, textStatus, errorThrown){
					$('#output').val('Request failed, please try again later!');
				}
			});
		}
	});
});

function copyText() {
	$('#output').select();
	document.execCommand('copy');
}