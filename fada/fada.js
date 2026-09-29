function morphTagger(){
	console.log("morph_tagger");
	document.getElementById("morph_tagger").style.backgroundColor = "#666";
	document.getElementById("morph_tagger").style.color = "white";

	document.getElementById("pos_tagger").style.backgroundColor = "#f1f1f1";
	document.getElementById("pos_tagger").style.color = "black";	
	
	document.getElementById("lemmatizer").style.backgroundColor = "#f1f1f1";
	document.getElementById("lemmatizer").style.color = "black";

	var textAreaInput = $('#text').val();
	
	if (textAreaInput == null || textAreaInput.trim() == "") {
		if (textAreaInput == null || textAreaInput.trim() == "") {
			document.getElementById("text").style.backgroundColor = "#d3d3d3";
			document.getElementById("output").innerHTML = '<p>عذراً!! تأكد من إدخال النص</p>';
		} else {
			document.getElementById("text").style.backgroundColor = "#FFFF00";
			document.getElementById("output").style.backgroundColor = "#FFFF00";
		}
	} else {
		document.getElementById("text").style.backgroundColor = "#FFFFFF";
		document.getElementById("output").style.backgroundColor = "#FFFFFF";
		document.getElementById("output").innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';
		$.ajax({
			url: "https://ontology.birzeit.edu/sina/v2/api/ALMADB/?apikey=sampleKey",
            data: JSON.stringify({ "sentence": textAreaInput.trim() }),
            type: "POST",
			timeout: 10000000,
			success: function (data) {
				var textLemmas = ""
				var val = data["resp"];
				console.log("val: ", val);
		    	var words = "<ul style='font-size: 1.6rem !important;'>";
                for(i = 0 ; i < val.length ; i ++){
					if(val[i][2] == null){
						val[i][2] = "-";
					}
					if(val[i][1] == null){
					    val[i][1] = "-";
					}
                    words+= "<li>◂ <b>"+val[i][0] +"</b>: <span style='color: #14a79c;padding-left: 0px;padding-right: 0px;'>"+ val[i][1] +"</span>،<span style='color: #f39221;padding-left: 0px;'>"+ val[i][2] +"</span>"+ "، (جذر)" +" </li>";
                }
                words += "</ul>";
				document.getElementById("output").innerHTML = words;
			},error: function (xhr, textStatus, errorThrown) {
				document.getElementById("output").innerHTML = '<p> Request failed, please try again later! </p>';
			}
		});	
	}
}

function lemmatization(){
	
	document.getElementById("morph_tagger").style.backgroundColor = "#f1f1f1";
	document.getElementById("morph_tagger").style.color = "black";

	document.getElementById("pos_tagger").style.backgroundColor = "#f1f1f1";
	document.getElementById("pos_tagger").style.color = "black";	
	
	document.getElementById("lemmatizer").style.backgroundColor = "#666";
	document.getElementById("lemmatizer").style.color = "white";
	
	var textAreaInput = $('#text').val();
	
	if (textAreaInput == null || textAreaInput.trim() == "") {
		if (textAreaInput == null || textAreaInput.trim() == "") {
			document.getElementById("text").style.backgroundColor = "#d3d3d3";
			document.getElementById("output").innerHTML = '<p>عذراً!! تأكد من إدخال النص</p>';
		} else {
			document.getElementById("text").style.backgroundColor = "#FFFF00";
			document.getElementById("output").style.backgroundColor = "#FFFF00";
		}
	} else {
		document.getElementById("text").style.backgroundColor = "#FFFFFF";
		document.getElementById("output").style.backgroundColor = "#FFFFFF";
		document.getElementById("output").innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';
		$.ajax({
			url: "https://ontology.birzeit.edu/sina/v2/api/ALMADB/?apikey=sampleKey",
            data: JSON.stringify({ "sentence": textAreaInput.trim() }),
            type: "POST",
			timeout: 10000000,
			success: function (data) {
				var textLemmas = ""
				var val = data["resp"];
				console.log("val: ", val);
		    	var words = "<ul style='font-size: 1.6rem !important;'>";
                for(i = 0 ; i < val.length ; i ++){
					if(val[i][1] == null){
					    val[i][1] = "-";
					}
                    words+= "<li>◂ <b>"+val[i][0] +"</b>: <span style='color: #14a79c;padding-left: 0px;padding-right: 0px;'>"+ val[i][1] +"</span>" +" </li>";
                }
                words += "</ul>";
				document.getElementById("output").innerHTML = words;
			},error: function (xhr, textStatus, errorThrown) {
				document.getElementById("output").innerHTML = '<p> Request failed, please try again later! </p>';
			}
		});	
	}
	
}

function posTagger(){
	document.getElementById("morph_tagger").style.backgroundColor = "#f1f1f1";
	document.getElementById("morph_tagger").style.color = "black";

	document.getElementById("pos_tagger").style.backgroundColor = "#666";
	document.getElementById("pos_tagger").style.color = "white";	
	
	document.getElementById("lemmatizer").style.backgroundColor = "#f1f1f1";
	document.getElementById("lemmatizer").style.color = "black";
	
	var textAreaInput = $('#text').val();
	
	if (textAreaInput == null || textAreaInput.trim() == "") {
		if (textAreaInput == null || textAreaInput.trim() == "") {
			document.getElementById("text").style.backgroundColor = "#d3d3d3";
			document.getElementById("output").innerHTML = '<p>عذراً!! تأكد من إدخال النص</p>';
		} else {
			document.getElementById("text").style.backgroundColor = "#FFFF00";
			document.getElementById("output").style.backgroundColor = "#FFFF00";
		}
	} else {
		document.getElementById("text").style.backgroundColor = "#FFFFFF";
		document.getElementById("output").style.backgroundColor = "#FFFFFF";
		document.getElementById("output").innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';
		$.ajax({
			url: "https://ontology.birzeit.edu/sina/v2/api/ALMADB/?apikey=sampleKey",
            data: JSON.stringify({ "sentence": textAreaInput.trim() }),
            type: "POST",
			timeout: 10000000,
			success: function (data) {
				var textLemmas = ""
				var val = data["resp"];
				console.log("val: ", val);
		    	var words = "<ul style='font-size: 1.6rem !important;'>";
                for(i = 0 ; i < val.length ; i ++){
					if(val[i][2] == null){
						val[i][2] = "-";
					}
					
                    words+= "<li>◂ <b>"+val[i][0] +"</b>: <span style='color: #f39221;padding-left: 0px;padding-right: 0px;'>"+ val[i][2] +"</span> </li>";
                }
                words += "</ul>";
				document.getElementById("output").innerHTML = words;
			},error: function (xhr, textStatus, errorThrown) {
				document.getElementById("output").innerHTML = '<p> Request failed, please try again later! </p>';
			}
		});	
	}
	
}
