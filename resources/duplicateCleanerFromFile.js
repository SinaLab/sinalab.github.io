$(function() {
	$('#removeDuplicatesFromFile').click(function() {
		removeDuplicatesFromFile();
	});
});

function removeDuplicatesFromFile() {
	var delimiter = $('#delimiter').val();
	var ignoreLastLetterDiacs = $('#ignoreLastLetterDiacs').is(":checked");
	var ignoreShadda = $('#ignoreShadda').is(":checked");
	var ignorefirstLetterHamza = $('#ignorefirstLetterHamza').is(":checked");
	var ignoreAL = $('#ignoreAL').is(":checked");
	var input = $('#input').val();
	var arrayOfLines;
	var arrayOfFields;
	var res = '';

	document.getElementById('status').innerHTML = 'Download';
	if(delimiter == null || delimiter.trim() == "")
		$('#delimiter').css({'background-color':'#FFFF00'});
	else {
		document.getElementById('status').innerHTML = 'Processing...';
		$('#delimiter').css({'background-color':'#FFFFFF'});
		arrayOfLines = input.match(/[^\r\n]+/g);
		for(var i=0; i < arrayOfLines.length; i++) {
			var line = arrayOfLines[i];
			arrayOfFields = line.split('#'); //Fields are # separated
			removeDuplicates(arrayOfFields[1], delimiter, ignoreLastLetterDiacs, ignoreShadda, ignorefirstLetterHamza, ignoreAL);
			res = res + arrayOfFields[0] + '#' + arrayOfFields[1] + '#' + $('#output').val() + '\n';
		}
		document.getElementById('status').innerHTML = 'Done! Click to Download Results';
	}
	$('#outputRes').append(res);
}

function removeDuplicates(input, delimiter, ignoreLastLetterDiacs, ignoreShadda, ignorefirstLetterHamza, ignoreAL) {
	if(input == null || input.trim() == "")
		$('#output').val('ERROR: Invalid input data!');
	else {
		

		$.ajax({
			'async': false,
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
				$('#output').val('ERROR: Request failed!');
			}
		});
	}
}

$(function() {
	$('#openFile').change(function() {
		var fr = new FileReader();
		fr.onload = function() {
			$('#input').val(this.result);
			$('#output').val('');
			$('#outputRes').val('');
			document.getElementById('status').innerHTML = 'Download';
		}
		fr.readAsText(this.files[0]);
	});
});

function downloadOutputFile() {
	var filename = 'output.txt';
	var elId = 'outputRes';
	var mimeType = 'text/html';
	var elHtml = document.getElementById(elId).innerHTML;
	var link = document.createElement('a');
	mimeType = mimeType || 'text/plain';

	link.setAttribute('download', filename);
	link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
	link.click();
}