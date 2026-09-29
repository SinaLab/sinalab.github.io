/* https://stackoverflow.com/questions/36599781/how-to-pass-data-from-one-page-to-another-page-html 
https://stackoverflow.com/questions/12777691/how-can-i-send-the-data-to-another-page-without-appending-it-in-url
*/					
function change_language_to_arabic(){
	
	document.getElementById("searchbar_main").placeholder = "ابحث عن كلمة عربية/انجليزية";
	document.getElementById("searchbar_main").style.direction = "rtl";
	document.getElementById("en_btn").style.color = "#23a99e";
	document.getElementById("ar_btn").style.color = "gray";
	
    var div = "";
	div +=    '<input type="checkbox" id="surface" class="input_filers_style_ar" value="CODA" checked>كلمة'
	div +=	  '<input type="checkbox" id="stem_search" class="input_filers_style_ar" value="stem_str" checked>ساق'
    div +=    '<input type="checkbox" id="msa" class="input_filers_style_ar" value="MSALemma_strip" checked>مدخلة'
    div +=    '<input type="checkbox" id="gloss" class="input_filers_style_ar" value="Gloss" checked>تعريف'
    div +=    '<br>'
    div +=    '<input type="radio" name="stringmatch" id="whole" class="input_filers_style_ar" value="equal" checked>الكلمة كاملة'
    div +=    '<input type="radio" name="stringmatch" id="substring" class="input_filers_style_ar" value="contains">جزء من الكلمة'
    div +=    '<br>'
    div +=    '<input type="checkbox" id="pal" class="input_filers_style_ar" value="Curras" checked>فلسطينية'
    div +=    '<input type="checkbox" id="leb" class="input_filers_style_ar" value="Baladi" checked>لبنانية'
	div +=    '<input type="checkbox" id="nabra" class="input_filers_style_ar" value="Nabra2" checked>سورية'
    div +=    '<input type="checkbox" id="iraqi" class="input_filers_style_ar" value="Iraqi" checked>عراقية'
    div +=    '<input type="checkbox" id="libyan" class="input_filers_style_ar" value="Libyan" checked>ليبية'
    div +=    '<input type="checkbox" id="sudanese" class="input_filers_style_ar" value="Sudanese" checked>سوادنية'
    div +=    '<input type="checkbox" id="yemeni" class="input_filers_style_ar" value="Yemeni" checked>يمنية'
	
	document.getElementById("search_btns").innerHTML = div;
	document.getElementById("search_btns").style.direction = "rtl";
	
	document.getElementById("search_text").innerText = "ابحث";
	
	document.getElementById("about").innerText = "حول";
	document.getElementById("pub").innerText = "أبحاث";
	//document.getElementById("download").innerText= "تنزيل";
}

function change_language_to_english(){
	
	document.getElementById("searchbar_main").placeholder = "Search for a word in Arabic/English";
	document.getElementById("searchbar_main").style.direction = "ltr";
	document.getElementById("ar_btn").style.color = "#23a99e";
	document.getElementById("en_btn").style.color = "gray";

	var div = "";
	div +=    '<input type="checkbox" id="surface" class="input_filers_style_en" value="CODA" checked>Word'
	div +=	  '<input type="checkbox" id="stem_search" class="input_filers_style_en" value="stem_str" checked>Stem'
    div +=    '<input type="checkbox" id="msa" class="input_filers_style_en" value="MSALemma_strip" checked>Lemma'
    div +=    '<input type="checkbox" id="gloss" class="input_filers_style_en" value="Gloss" checked>Gloss'
    div +=    '<br>'
    div +=    '<input type="radio" name="stringmatch" class="input_filers_style_en" id="whole" value="equal" checked>Whole Word'
    div +=    '<input type="radio" name="stringmatch" class="input_filers_style_en" id="substring" value="contains">Substring'
    div +=    '<br>'
    div +=    '<input type="checkbox" id="pal" class="input_filers_style_en" value="Curras" checked>Palestinian'
    div +=    '<input type="checkbox" id="leb" class="input_filers_style_en" value="Baladi" checked>Lebanese'
	div +=    '<input type="checkbox" id="nabra" class="input_filers_style_en" value="Nabra2" checked>Syrian'
    div +=    '<input type="checkbox" id="iraqi" class="input_filers_style_en" value="Iraqi" checked>Iraqi'
    div +=    '<input type="checkbox" id="libyan" class="input_filers_style_en" value="Libyan" checked>Libyan'
    div +=    '<input type="checkbox" id="sudanese" class="input_filers_style_en" value="Sudanese" checked>Sudanese'
    div +=    '<input type="checkbox" id="yemeni" class="input_filers_style_en" value="Yemeni" checked>Yemeni'
	
	document.getElementById("search_btns").innerHTML = div;
	document.getElementById("search_btns").style.direction = "ltr";
	
	document.getElementById("search_text").innerText = "Search";
	
	document.getElementById("about").innerText = "About";
	document.getElementById("pub").innerText =  "Publications";
	//document.getElementById("download").innerText = "Download";
}


$(function () {
    document.getElementById("searchbar_main").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
			GetResult();
		}
	});
});


function GetResult(){
	/*console.log("GetResult...");
	var firstData = {
    'key1' : 'value1',
    'key2' : 'value2'
	};
	var myData = [ firstData ];
	console.log("MyData : ", myData);
	localStorage.setItem( 'objectToPass', myData );*/
	
	var search_text = document.getElementById("searchbar_main").value.trim();
	window.open("./search.html"+"?"+encodeURIComponent(search_text), "_self");
}


function show_hide_projects(){
	//console.log("Show hide projects");
	if(document.getElementById("en_btn").style.color == "gray"){ // english mood active
		console.log("language is english");
		document.getElementById("popup_header").innerText = "Other Projects";
		document.getElementById("popup_header").style.direction = "ltr";
	}else{
		document.getElementById("popup_header").innerText = "مشاريع ذات علاقة";
		document.getElementById("popup_header").style.direction = "rtl";	
	}
	
	var popup_status = document.getElementById("popup_id").style.visibility;
	if(popup_status == "visible"){
		document.getElementById("popup_id").style.visibility = "hidden";
	}else{
		document.getElementById("popup_id").style.visibility = "visible";
	}
}



$(document).on('click', function (event) {
  if (!$(event.target).closest('#popup_id').length && !$(event.target).closest('#app_icon_id').length) {
	  //console.log("clicked");
	  document.getElementById("popup_id").style.visibility = "hidden";
  }
});



function mouseover_change_more_project_style(){
	document.getElementById("more_projects_btn").style.color = "white";
	document.getElementById("more_projects_btn").style.backgroundColor = "rgb(0, 128, 197)";
}


function mouseout_change_more_project_style(){
	document.getElementById("more_projects_btn").style.color = "rgb(0, 128, 197)";
	document.getElementById("more_projects_btn").style.backgroundColor = "#f0f0f0";
}

function reset_menu_bar_style(element){
	element.style.color = "gray";
	element.style.textDecoration = "none";
	//console.log("reset", element.style);
}

function add_menu_bar_style(element){
	element.style.color = "#229b92";
	element.style.textDecoration = "underline";
	//console.log("add", element.style);
}