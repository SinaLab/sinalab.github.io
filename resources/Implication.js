$(function() {
	$('#getImplication').click(function() {
		var word1 = $('#word1').val();
		var word2 = $('#word2').val();
		if(word1 == null || word1.trim() == "" || word2 == null || word2.trim() == "") {
			$('#output').val('ERROR: Please provide word1 and word2 data!');
			if((word1 == null || word1.trim() == "") && !(word2 == null || word2.trim() == "")) {
				$('#word1').css({'background-color':'#FFFF00'});
				$('#word2').css({'background-color':'#FFFFFF'});
			}
			else if((word2 == null || word2.trim() == "") && !(word1 == null || word1.trim() == "")) {
				$('#word1').css({'background-color':'#FFFFFF'});
				$('#word2').css({'background-color':'#FFFF00'});
			}
			else {
				$('#word1').css({'background-color':'#FFFF00'});
				$('#word2').css({'background-color':'#FFFF00'});
			}
		}
		else {
			$('#word1').css({'background-color':'#FFFFFF'});
			$('#word2').css({'background-color':'#FFFFFF'});
			$('#output').val('Processing...');
			var ignoreLastLetterDiacs = $('#ignoreLastLetterDiacs').is(":checked");
			var ignoreShadda = $('#ignoreShadda').is(":checked");
			var ignorefirstLetterHamza = $('#ignorefirstLetterHamza').is(":checked");
			var ignoreAL = $('#ignoreAL').is(":checked");
			$.ajax({
				url: `https://ontology.birzeit.edu/sina/api/Implication/${word1}/${word2}`,
				timeout: 3000,
				success: function(data) {
				  $('#output').val(JSON.stringify(data));
				},
				error: function(xhr, textStatus, errorThrown) {
				  $('#output').val('Request failed, please try again later!');
				}
			  });
		}
	});
});

// function copyText() {
// 	$('#output').select();
// 	document.execCommand('copy');
// }