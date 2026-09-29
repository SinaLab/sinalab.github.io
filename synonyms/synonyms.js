function findSynonyms() {
	
	document.getElementById("output").style.display = "none";
	document.getElementById("spinner").style.display = "block";
	document.getElementById("spinner").style.animation = "fa-spin 2s infinite linear";
	var btn_Text = document.getElementById("btn_text");
	btn_Text.style.display = "none";

	var results = "";

	/*console.log("start");*/


	var synset = document.getElementById("text").value;
	var accurecy = parseInt(document.getElementById("accurecy").value) / 100;
	/*console.log("accurecy : ",accurecy);*/

	var filter_en = document.getElementById("filter1").checked;
	var filter_ar = document.getElementById("filter2").checked;
	var filter_welsh = document.getElementById("filter3").checked;

	/*console.log(filter_en);
	console.log(filter_ar);
	console.log(filter_welsh);*/

	var level2 = document.getElementById("level2").checked;
	var level3 = document.getElementById("level3").checked;
	var level4 = document.getElementById("level4").checked;

	var level = "";

	if (level2 == true) {
		level = "2";
		//level = 3;
	}else if (level3 == true) {
		level = "3";
		//level = 4;
	} else if (level4 == true) {
		level = "4";
		//level = 5;
	} else {
		$('#output').html("Please choose level...");
	}

							
	/*console.log("level : ", level);*/

	var arabic = /[\u0600-\u06FF]/;

	//var final_arabic_synset = [] ;
	//var final_english_synset = [] ;
	var final_synset = [];

	synset = synset.replaceAll(',', '|');
	synset = synset.replaceAll('،', '|');
	document.getElementById("text").value = synset;
	var tmp_synset = synset.split("|");
	for (var i = 0; i < tmp_synset.length; i++) {
		if(tmp_synset[i].trim() != ""){
		    if (arabic.test(tmp_synset[i].trim())) {
		    	//	    final_arabic_synset.push(tmp_synset[i].trim());     
		    	final_synset.push(tmp_synset[i].trim());
		    } else {
		    	//		    final_english_synset.push(tmp_synset[i].trim().toLowerCase());     
		    	final_synset.push(tmp_synset[i].trim());
		    }
		}	
	}

	var use_lemmatization = document.getElementById("lem").checked;
													
	// console.log("lexicons : ",filter_lexicons);
	// console.log({ "synset": final_synset, "level": level, "task": task });
	$.ajax({
		url: "https://ontology.birzeit.edu/sina/v2/api/SynonymGenerator/?apikey=sinaMapping",
// //		data: JSON.stringify({ "synset": final_synset, "level": level, "task": task }),
		data: JSON.stringify({ "synset": final_synset.join(" | "), "level": level, "useALMA": use_lemmatization}),
		//url: 'https://sinalab-synonyms-api.hf.space/predict',
                //data: JSON.stringify({ "synset": final_synset.join(" | "), "level": level, "useALMA": use_lemmatization.toString()}),
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		timeout: 500000000,
		success: function (data) {

            //console.log("success");

			var synonems = data["resp"];
			//console.log(synonems);
			var output = [];
			var tmp_output = [];
			var arabic_syn = [];
			var english_syn = [];
			var welsh_syn = [];

			for (var i = 0; i < synonems.length; i++) {
				// console.log("synonems : ", synonems[i][0],synonems[i][1], " start with 1 : ", synonems[i][0].trim().startsWith("1"));

				if (synonems[i][1] > accurecy) {
					if (filter_ar == true) {
						if (arabic.test(synonems[i][0].trim()) == true) {
							arabic_syn.push([synonems[i][0], synonems[i][1]]);
						}
					}
					if (filter_en == true) {
						if (arabic.test(synonems[i][0].trim()) == false & synonems[i][0].trim().startsWith("1") == false) {
							english_syn.push([synonems[i][0], synonems[i][1]]);
						}
					}
					if (filter_welsh == true) {
						if (synonems[i][0].trim().startsWith("1") == true) {
							welsh_syn.push([synonems[i][0].replace("1",""), synonems[i][1]]);
						}
					}


					/*
					if(filter_ar == true && filter_en == true){
						output.push([synonems[i][0], synonems[i][1]]);
					}else if (filter_en == true){
						if(arabic.test(synonems[i][0].trim()) == false && synonems[i][0].trim().startsWith("1") == false){
							output.push([synonems[i][0], synonems[i][1]]);
						}
					}else if (filter_ar == true){
						if(arabic.test(synonems[i][0].trim()) == true){
							output.push([synonems[i][0], synonems[i][1]]);
						}
					}
					if (filter_welsh == true){
						if(synonems[i][0].trim().startsWith("1")){
						   output.push([synonems[i][0], synonems[i][1]]);   
						}
					}
					*/
					// output.push(synonems[i][0]);
					tmp_output.push(synonems[i]);
					// console.log(" tmp_out     "+tmp_output);
				}
			}



			var arabic_final_output = [];
			// console.log(" results : ", output );
			for (var j = 0; j < arabic_syn.length; j++) {
				// <!-- updated by weaam on 18/12/2022 add the Accurecy value -->
				var x = arabic_syn[j][1];
				arabic_final_output.push(arabic_syn[j][0] + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + Math.round(Number(x).toFixed(2) * 100) + "% " + "</a>");
				// console.log(" final     "+final_output);
			}
			arabic_final_output.push('<a style="color: black;font-weight: normal;font-size: 10px;text-decoration: none;visibility: collapse;">ت</a>')


			var english_final_output = [];
			// console.log(" results : ", output );
			for (var j = 0; j < english_syn.length; j++) {
				// <!-- updated by weaam on 18/12/2022 add the Accurecy value -->
				var x = english_syn[j][1];
				english_final_output.push(english_syn[j][0] + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " +  Math.round(Number(x).toFixed(2) * 100) + "% " + "</a>");
				// console.log(" final     "+final_output);
			}


			var welsh_final_output = [];
			// console.log(" results : ", output );
			for (var j = 0; j < welsh_syn.length; j++) {
				// <!-- updated by weaam on 18/12/2022 add the Accurecy value -->
				var x = welsh_syn[j][1];
				welsh_final_output.push(welsh_syn[j][0].replace("1","") + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + Math.round(Number(x).toFixed(2) * 100) + "% " +"</a>");
				// console.log(" final     "+final_output);
				console.log("Welsh : ", welsh_final_output);
			}

			document.getElementById("output").value = tmp_output;
			//$('#output').html(final_output.join(", "));
			
			$('#english_result').html(english_final_output.join(", "));
			$('#arabic_result').html(arabic_final_output.join(", "));
			$('#welsh_result').html(welsh_final_output.join(", "));
			
			document.getElementById("output").style.display = "block";
			document.getElementById("spinner").style.animation = "none";
			document.getElementById("spinner").style.display = "none";

			btn_Text.style.display = "block";	// <!-- updated by weaam on 18/12/2022 added Id to the text on btn (btn_text) and make it hidden when click 

		}
		/*
		, error: function (xhr, textStatus, errorThrown) {
			console.log("error");
			//$('#output').html('<p> Request failed, please try again later! </p>');
		} */
	});
}


function EvaluateSynset() {
	/*console.log("Eval synset");*/
	document.getElementById("output").style.display = "none";
	document.getElementById("evaluate_spinner").style.display = "block";
	document.getElementById("evaluate_spinner").style.animation = "fa-spin 2s infinite linear";
	var btn_Text = document.getElementById("btn_evaluate");
	btn_Text.style.display = "none";

	var results = "";



	var synset = document.getElementById("text").value;
	/*
	var accurecy = parseInt(document.getElementById("accurecy").value) / 100;


	var filter_en = document.getElementById("filter1").checked;
	var filter_ar = document.getElementById("filter2").checked;
	var filter_welsh = document.getElementById("filter3").checked;
*/
	var level2 = document.getElementById("level2").checked;
	var level3 = document.getElementById("level3").checked;
	var level4 = document.getElementById("level4").checked;

	var level = "";

	if (level2 == true) {
		level = 2;
		//level = 3;
	}else if (level3 == true) {
		level = 3;
		//level = 4;
	} else if (level4 == true) {
		level = 4;
		//level = 5;
	} else {
		$('#output').html("Please choose level...");
	}

/*
	var task_dic = document.getElementById("task_dic").checked;
	var task_db = document.getElementById("task_db").checked;

	var task = "";

	if (task_dic == true) {
		task = "dictionary";
	} else if (task_db == true) {
		task = "DB";
	} else {
		$('#output').html("Please choose task...");
	}

	*/
    															
	// console.log(level);

	var arabic = /[\u0600-\u06FF]/;

	//var final_arabic_synset = [] ;
	//var final_english_synset = [] ;
	var final_synset = [];

	synset = synset.replaceAll(',', '|');
	synset = synset.replaceAll('،', '|');
	document.getElementById("text").value = synset;
	var tmp_synset = synset.split("|");
	for (var i = 0; i < tmp_synset.length; i++) {
		if(tmp_synset[i].trim() != ""){
			if (arabic.test(tmp_synset[i].trim())) {
				//	    final_arabic_synset.push(tmp_synset[i].trim());     
				final_synset.push(tmp_synset[i].trim());
			} else {
				//		    final_english_synset.push(tmp_synset[i].trim().toLowerCase());     
				final_synset.push(tmp_synset[i].trim());
			}
		}
	}
/*
	var pos = document.getElementById("pos").value;

	// console.log("Final synset: ", final_synset);
	// console.log(final_arabic_synset);
	// console.log(final_english_synset);

	var lexicon = "";
	var filter_lexicons = [];
	if (document.getElementById("AWN").checked == true) {
		filter_lexicons.push("AWN");
		//console.log("IN AWN");
	}
	if (document.getElementById("BZU").checked == true) {
		filter_lexicons.push("BZU");
		//console.log("IN BZU");
	}
	if (document.getElementById("EWN").checked == true) {
		filter_lexicons.push("WN");
		//console.log("IN EWN");
	}
	if (document.getElementById("ALESCO").checked == true) {
		filter_lexicons.push("ALESCO");
		//console.log("IN ALESCO");
	}
	if (document.getElementById("Others").checked == true) {
		filter_lexicons.push("Others");
		//console.log("IN Others");
	}
	if (document.getElementById("Cairo").checked == true) {
		filter_lexicons.push("Cairo Academy");
		//console.log("IN Cairo");
	}
	if (document.getElementById("Welsh").checked == true) {
		filter_lexicons.push("Welsh");
		//console.log("IN Welsh");
	}
	if (document.getElementById("All").checked == true) {
		filter_lexicons.push("All");
		//console.log("IN All");
	}


	if (filter_lexicons == []) {
		filter_lexicons = ["All"];
	}

	*/
													
	// console.log("lexicons : ",filter_lexicons);
	//console.log({ "synset": final_synset.join(" | "), "level": level});
	
	$.ajax({
		url: "https://ontology.birzeit.edu/sina/v2/api/EvaluateSynset/?apikey=IntentKey",
		//data: JSON.stringify({ "synset": final_synset, "level": level, "task": task }),
		data: JSON.stringify({ "synset": final_synset.join(" | "), "level": level }),
		type: "POST",
		timeout: 500000000,
		success: function (data) {

			var synonems = data["resp"];
			/*console.log("synonyms: ", synonems);*/
			var output = [];
			var tmp_output = [];
			var evaluate_output = [];
			
			if(data["statusCode"] == -1){
				for(var i = 0; i < final_synset.length; i++){			
					evaluate_output.push(final_synset[i].replace("1","") + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + 0 + "% " + "</a>");
					tmp_output.push([final_synset[i],0]);
				}
				
			}else{

				for (var i = 0; i < synonems.length; i++) {
					// console.log("synonems : ", synonems[i][0],synonems[i][1], " start with 1 : ", synonems[i][0].trim().startsWith("1"));
					//if (synonems[i][1] > accurecy) {
					if (synonems[i][0].trim().startsWith("1") == true) {	
							evaluate_output.push(synonems[i][0].replace("1","") + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + Math.round(Number(synonems[i][1]).toFixed(2) * 100) + "% " + "</a>");
							tmp_output.push(synonems[i]);
					}else{
							evaluate_output.push(synonems[i][0] + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + Math.round(Number(synonems[i][1]).toFixed(2) * 100) + "% " + "</a>");
							tmp_output.push(synonems[i]);
					}
					
					
					//}
				}
			}
			document.getElementById("output").value = tmp_output;
				
			$('#evaluate_paragraph').html(evaluate_output.join(", "));
			document.getElementById("evaluate_div").style.visibility = "visible";
			document.getElementById("output").style.display = "block";
			document.getElementById("evaluate_spinner").style.animation = "none";
			document.getElementById("evaluate_spinner").style.display = "none";

			btn_evaluate.style.display = "block";
			
			
		}
		/*
		, error: function (xhr, textStatus, errorThrown) {
			console.log("error");
			//$('#output').html('<p> Request failed, please try again later! </p>');
		} */
	});
}

var expanded = false;

function showCheckboxes() {
	var checkboxes = document.getElementById("checkboxes");
	if (!expanded) {
		checkboxes.style.display = "block";
		expanded = true;
	} else {
		checkboxes.style.display = "none";
		expanded = false;
	}
}



function filter_results() {
	document.getElementById("output").style.display = "none";
	document.getElementById("spinner").style.display = "block";
	document.getElementById("spinner").style.animation = "fa-spin 2s infinite linear";
	// <!-- updated by weaam on 18/12/2022 added Id to the text on btn (btn_text) and make it hidden when click -->
	var btn_Text = document.getElementById("btn_text");
	btn_Text.style.display = "none";
	var accurecy = parseInt(document.getElementById("accurecy").value) / 100;
	//console.log("accurecy 1 : ", accurecy);

	var prev_output = document.getElementById("output").value;
	var english_prev_output = document.getElementById("english_result").value;
	var arabic_prev_output = document.getElementById("arabic_result").value;
	var welsh_prev_output = document.getElementById("welsh_result").value;
	var output = [];
	//console.log(output);

	var filter_en = document.getElementById("filter1").checked;
	var filter_ar = document.getElementById("filter2").checked;
	var filter_welsh = document.getElementById("filter3").checked;

	/*var pos = document.getElementById("pos").value;*/

	var arabic_final_output = [];
	var english_final_output = [];
	var welsh_final_output = [];
	
	// console.log("Filters :", pos);
	var arabic = /[\u0600-\u06FF]/;

	if (prev_output != undefined){
		for (var i = 0; i < prev_output.length; i++) {
			if (prev_output[i][1] > accurecy) {
				// console.log(prev_output[i][1]);
				if (filter_ar == true) {
					if (arabic.test(prev_output[i][0].trim()) == true) {
						var x = prev_output[i][1];
						arabic_final_output.push(prev_output[i][0] + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + Math.round(Number(x).toFixed(2) * 100) + "% " + "</a>");
					}
				}
				if (filter_en == true) {
					if (arabic.test(prev_output[i][0].trim()) == false & prev_output[i][0].trim().startsWith("1") == false) {
						var x = prev_output[i][1];
						english_final_output.push(prev_output[i][0] + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + Math.round(Number(x).toFixed(2) * 100) + "% " + "</a>");
					}
				}
				if (filter_welsh == true) {
					if (prev_output[i][0].trim().startsWith("1") == true) {
						var x = prev_output[i][1];
						welsh_final_output.push(prev_output[i][0].replace("1","") + "<a style=\"color: black;font-weight: normal;font-size: 10px;text-decoration: none;\"> " + Math.round(Number(x).toFixed(2) * 100) + "% " +"</a>");
					}
				}
			}
		}

	}

	$('#english_result').html(english_final_output.join(", "));
	$('#arabic_result').html(arabic_final_output.join(", "));
	$('#welsh_result').html(welsh_final_output.join(", "));


	//$('#output').html(output.join(", "));
	$('#accurracy_label').html(accurecy);
	document.getElementById("output").style.display = "block";
	document.getElementById("spinner").style.animation = "none";
	document.getElementById("spinner").style.display = "none";
	btn_Text.style.display = "block";
}



