function jaccard() {
	var delimiter = document.getElementById('delimiter').value;
	console.log(delimiter);
	var ignoreAllDiacriticsButNotShadda = document.getElementById('ignoreAllDiacriticsButNotShadda').checked;
	var ignoreShaddaDiacritic =document.getElementById('ignoreShaddaDiacritic').checked;
	var list1 = document.getElementById('list1').value;
	console.log(list1);
	var list2 = document.getElementById('list2').value;
	console.log(list2);
	var flag = true;

	if(list1 == null || list1.trim() == "")
	{
		document.getElementById('status').innerHTML='Error!! (Invalid input data)';
		document.getElementById('list1').style.borderColor='#FF0000';
		flag = false;
	}
	if (list2 == null || list2.trim() == "")
	{
		document.getElementById('status').innerHTML='Error!! (Invalid input data)';
		document.getElementById('list2').style.borderColor='#FF0000';
		flag = false;
	}
	if(delimiter == null || delimiter.trim() == "")
	{
		flag = false;
		document.getElementById('delimiter').style.borderColor='#FF0000';
		
	}

	if(flag) {
		// document.getElementById('status').innerHTML = 'Processing...';
		document.getElementById('delimiter').style.backgroundColor='#FFFFFF';
		console.log(list1);
		requestJaccard(list1, list2, delimiter, ignoreAllDiacriticsButNotShadda, ignoreShaddaDiacritic);
		// document.getElementById('status').innerHTML = 'Done!';
	}
}

function requestJaccard(list1, list2, delimiter, ignoreAllDiacriticsButNotShadda, ignoreShaddaDiacritic) {
	$.ajax({
		type: "POST",
		url: 'https://ontology.birzeit.edu/sina/v2/api/jaccard/',
		data: JSON.stringify({
		"delimiter" : delimiter,
		"string1" : list1,
		"string2" : list2,
		"ignoreAllDiacriticsButNotShadda" : ignoreAllDiacriticsButNotShadda,
		"ignoreShaddaDiacritic" : ignoreShaddaDiacritic,
		"selection" : "jaccardAll"}),
		timeout: 3000,
		success: function(data){
			var val = data["resp"];
			var obj = JSON.parse(JSON.stringify(data));
		
			document.getElementById('intersection').value = val[1].join(" "+delimiter+" ");
	
			document.getElementById('union').value = val[3].join(" "+delimiter+" ");

			document.getElementById('similarity').value = val[5].toFixed(4);

			document.getElementById('result').style.display = 'block';
		},
		error: function(xhr, textStatus, errorThrown){
			document.getElementById('intersection').value;
		}
	});
}

