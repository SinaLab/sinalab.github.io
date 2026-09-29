var currentRequestId = null; // Variable to store a unique ID for each request

/* https://www.w3schools.com/cssref/css4_pr_accent-color.php */
// Global variables to manage pagination
let currentPage = 1; // Current page number
let pageSize = 250; // Default page size
var prev_st =document.getElementById("searchbar_main").value.trim();// Previous search text
var Flag = 0;
function getRes() {
    $('#thead').empty();
    Flag=1;
    GetResult();
}
function GetResult() {
    var requestId = Date.now();
    currentRequestId = requestId;

    let t0 = performance.now();

    // Show loading spinner
    document.getElementById("search_text").style.display = "none";
    document.getElementById("search_spinner").style.display = "block";
    document.getElementById("search_spinner").style.animation = "fa-spin 2s infinite linear";
    document.getElementById("search_spinner").style.color = "black";
    document.getElementById("pagination").style.display = "none";
    document.getElementById("count_results").style.display = "none";

    var search_fields = [];
    if (document.getElementById("stem_search").checked) search_fields.push("stem_str_strip");
    if (document.getElementById("msa").checked) search_fields.push("MSALemma_strip");
    if (document.getElementById("surface").checked) search_fields.push("coda_strip");
    if (document.getElementById("gloss").checked) search_fields.push("Gloss");

    var match_type = [];
    if (document.getElementById("whole").checked) match_type.push("equal");
    if (document.getElementById("substring").checked) match_type.push("contains");

    var sources = [];
    if (document.getElementById("pal").checked) sources.push("Curras");
    if (document.getElementById("leb").checked) sources.push("Baladi");
    if (document.getElementById("nabra").checked) sources.push("Nabra2");
    if (document.getElementById("iraqi").checked) sources.push("Iraqi");
    if (document.getElementById("libyan").checked) sources.push("Libyan");
    if (document.getElementById("sudanese").checked) sources.push("Sudanese");
    if (document.getElementById("yemeni").checked) sources.push("Yemeni");

    var search_text = document.getElementById("searchbar_main").value.trim();
    if(prev_st != search_text || Flag===1){
        prev_st=search_text;
        // $('#thead').empty();
        $('#tbody').empty();
        currentPage = 1;
    }


    var search_text_strip = arStrip(search_text, "True", "True", "True", "False", "True", "True");

    if (search_text && search_fields.length && sources.length) {

        currentRequest = $.ajax({
            url: "https://ontology.birzeit.edu/sina/v2/api/FilterCurrasBiladiResults/?apikey=annotationsKey",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "search_fields": search_fields.join('+'),
                "match_type": match_type.join('+'),
                "source": sources.join('+'),
                "search_text": search_text_strip,
                "page": currentPage,
                "page_size": pageSize
            }),
            timeout: 1000000,
            beforeSend: function() {
                var element = document.getElementById("myprogressBar");
                document.getElementById("myprogressBar").style.visibility = "visible";
                var width = 0.5;
                var identity = setInterval(scene, 10);
                function scene() {
                    if (width >= 100) {
                        clearInterval(identity);
                    } else {
                        width++;
                        element.style.width = width + '%';
                    }
                }
            },
            complete: function() {
                document.getElementById("myprogressBar").style.visibility = "hidden";
                document.getElementById("search_spinner").style.display = "none";
                document.getElementById("search_text").style.display = "block";
            },
            success: function(data) {
                // Hide spinner and display search text
                document.getElementById("search_spinner").style.display = "none";
                document.getElementById("search_text").style.display = "block";
            
                // Check if results are empty
                if (data.results.length === 0) {
                    console.log("No results found.");
                    // Hide all elements in the body and display "No results found" message
                    // document.getElementById("annotations_table").style.display = "none";
                    // document.getElementById("buttonload").style.display = "none";
                    // document.getElementById("tableBody").style.display= "none";  
                    // document.getElementById("buttonload").style.display = "none";
                    // document.getElementById("user_message").innerText = "No results found.";
                    document.getElementById("pagination").style.display = "none";
                    document.getElementById("count_results").style.display = "none";
                    document.getElementById("no_result_div").style.display = "block";
                 
                } else {
                    // If results are found, proceed with displaying them
                    document.getElementById("no_result_div").style.display = "none";
                    document.getElementById("user_message").style.display = "none";
                    document.getElementById("annotations_table").style.display = "table";
                    document.getElementById("pagination").style.display = "block";
                    document.getElementById("count_results").style.display = "block";
            
                    
                    // $('#tbody').empty();
                    
                    
                    // Append each result row
                    var flag = 0;
                    data.results.forEach(function(val) {
                        if (requestId === currentRequestId) {
                            var list_of_lemmas = [];
                            Row_ID = val.pk;
                            CODA = val.fields.CODA;
                            prefixes = val.fields.Prefix;
                            stem = val.fields.stem_str;
                            suffixes = val.fields.Suffix;
                            POS = val.fields.POS;
                            Pers = val.fields.Pers;
                            Gen = val.fields.Gen;
                            Num = val.fields.Num;
                            Gloss = val.fields.Gloss;
                            context = val.fields.context_11;
                            Source = val.fields.Source;
                            DALemma = val.fields.DALemma;
                            MSALemma = val.fields.MSALemma;
                            dalemma_id = val.fields.DALemmaID;
                            msalemma_id = val.fields.MSALemmaID;
            
                            if (DALemma === MSALemma) {
                                if (msalemma_id.toString() !== "0") {
                                    list_of_lemmas.push('<a href="https://sina.birzeit.edu/qabas/lemma/' + msalemma_id + '" style="color:#229b92; text-decoration:none;font-weight: bold;">' + MSALemma + '</a>');
                                } else {
                                    list_of_lemmas.push(MSALemma);
                                }
                            } else {
                                if (DALemma) {
                                    if (dalemma_id.toString() !== "0") {
                                        list_of_lemmas.push('<a href="https://sina.birzeit.edu/qabas/lemma/' + dalemma_id + '" style="color:#229b92; text-decoration:none;font-weight: bold;">' + DALemma + '</a>');
                                    } else {
                                        list_of_lemmas.push(DALemma);
                                    }
                                }
                                if (MSALemma) {
                                    if (msalemma_id.toString() !== "0") {
                                        list_of_lemmas.push('<a href="https://sina.birzeit.edu/qabas/lemma/' + msalemma_id + '" style="color:#229b92; text-decoration:none;font-weight: bold;">' + MSALemma + '</a>');
                                    } else {
                                        list_of_lemmas.push(MSALemma);
                                    }
                                }
                            }
                            if (flag == 0) {
                                $('#thead').empty();
                                var rowContent = '<tr style="width:100%; text-align: right; font-size:35px;">' +
                                    '<th style="text-align: right; font-size:15px;"class="table_first_head">Context</th>' +
                                    '<th style="text-align: right; font-size:15px;"class="table_first_head">Word</th>' +
                                    '<th style="text-align: right; font-size:15px;"class="table_first_head">Prefix</th>' +
                                    '<th style="text-align: right; font-size:15px;"class="table_first_head">Stem</th>' +
                                    '<th style="text-align: right; font-size:15px;"class="table_first_head">Suffix</th>' +
                                    '<th style="text-align: right; font-size:15px;"class="table_first_head">POS</th>' +
                                    '<th style="text-align: right; font-size:15px;"class="table_first_head">Lemma</th>' +
                                    '<th style="text-align: left; font-size:15px;"class="table_first_head">Gloss</th>' +
                                    '</tr>';
                                $('#thead').append(rowContent);
                                flag = 1;
                            }
                            
            
                            var rowContent = '<tr style="width:100%; text-align: right; font-size:35px;">' +
                                '<td style="text-align: right; font-size:15px;">' + context + '</td>' +
                                '<td style="text-align: right; font-size:15px;">' + CODA + '</td>' +
                                '<td style="text-align: right; font-size:15px;">' + prefixes + '</td>' +
                                '<td style="text-align: right; font-size:15px;">' + stem + '</td>' +
                                '<td style="text-align: right; font-size:15px;">' + suffixes + '</td>' +
                                '<td style="text-align: right; font-size:15px;">' + POS + '</td>' +
                                '<td style="text-align: right; font-size:15px;">' + list_of_lemmas.join(', ') + '</td>' +
                                '<td style="text-align: left; font-size:15px;">' + Gloss + '</td>' +
                                '</tr>';
            
                            $('#tbody').append(rowContent);
                        }
                    });
                    
                    let t1 = performance.now();
                    let time = t1 - t0;
                    var time_in_second = time.toPrecision(2);
                    $('#count_results').html(data.total_results + " results (" + time_in_second / 1000 + " secs) ");
                    updatePagination(data.total_results);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching results:", error);
                document.getElementById("user_message").innerText = "An error occurred while fetching results. Please try again.";
                document.getElementById("user_message").style.display = "block";
            }
        });
    } else {
        document.getElementById("user_message").innerText = "Please fill out all required fields.";
        document.getElementById("user_message").style.display = "block";
    }
}


// Function to update pagination controls716503 
function updatePagination(totalResults) {
    const resultsPerPage = pageSize;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    $('#pagination').empty();

    if (currentPage < totalPages) {
        $('#pagination').append('<button onclick="loadMore()" class="searchbutton" style="font-size:0.8rem" id="buttonload">Load More</button>');
		// currentPage++;
		// GetResult();
    }
// let loadMoreInterval;

// function startAutoLoadMore() {
//     clearInterval(loadMoreInterval);

//     loadMoreInterval = setInterval(function() {
//         if (currentPage < totalPages) {
//             currentPage++;
//             GetResult();
//         } else {
//             clearInterval(loadMoreInterval);
//         }
//     }, 60000);
// }
// startAutoLoadMore();
}

// Function to load more results
function loadMore() {
    currentPage++;
    Flag=0;
    GetResult();
}


function reset_style(element){
	element.style.color = "#229b92";
	element.style.textDecoration = "none";
	//console.log("reset", element.style);
}

function add_style(element){
	element.style.color = "#229b92";
	element.style.textDecoration = "underline";
	//console.log("add", element.style);
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
					
function change_language_to_arabic(){
	
	document.getElementById("searchbar_main").placeholder = "ابحث عن كلمة عربية/انجليزية";
	document.getElementById("searchbar_main").style.direction = "rtl";
	
	document.getElementById("en_btn").style.color = "#23a99e";
	document.getElementById("ar_btn").style.color = "gray";
	
	document.getElementById("Bu_logo").style.display = "inline-flex";
	document.getElementById("UN_logo").style.display = "inline-flex";
	document.getElementById("notification_text").style.display = "inline-flex";
	document.getElementById("copy_right").style.display = "block";

	
	if(document.getElementById("searchresults").innerText != ""){
		console.log("Text is not null");
		document.getElementById("context").innerText = "سياق";
		document.getElementById("CODA").innerText = "كلمة";
		document.getElementById("prefixes").innerText = "سوابق";
		document.getElementById("stem").innerText = "ساق";
		document.getElementById("suffixes").innerText = "لواحق";
		document.getElementById("POS").innerText = "قسم الكلام";
		//document.getElementById("Num").innerText = "عدد";
		//document.getElementById("Gen").innerText = "جنس";
		//document.getElementById("Pers").innerText = "شخص";
		document.getElementById("MSALemma").innerText = "مدخلة";
		document.getElementById("Gloss").innerText = "تعريف";
	}
	
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
    div +=    '<input type="checkbox" id="leb" class="input_filers_style_ar" value="Baladi" onclick="checkbox_clicked()" checked>لبنانية'
	div +=    '<input type="checkbox" id="nabra" class="input_filers_style_ar" value="Nabra2" onclick="checkbox_clicked()" checked>سورية'
    div +=    '<input type="checkbox" id="iraqi" class="input_filers_style_ar" value="Iraqi" onclick="checkbox_clicked()" checked>عراقية'
    div +=    '<input type="checkbox" id="libyan" class="input_filers_style_ar" value="Libyan" onclick="checkbox_clicked()" checked>ليبية'
    div +=    '<input type="checkbox" id="sudanese" class="input_filers_style_ar" value="Sudanese" onclick="checkbox_clicked()" checked>سوادنية'
    div +=    '<input type="checkbox" id="yemeni" class="input_filers_style_ar" value="Yemeni" onclick="checkbox_clicked()" checked>يمنية'
	
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
	
	document.getElementById("Bu_logo").style.display = "inline-flex";
	document.getElementById("UN_logo").style.display = "inline-flex";
	document.getElementById("notification_text").style.display = "inline-flex";
	document.getElementById("copy_right").style.display = "block";
	
	if(document.getElementById("searchresults").innerText != ""){
		document.getElementById("context").innerText = "Context";
		document.getElementById("CODA").innerText = "Word";
		document.getElementById("prefixes").innerText = "Prefix";
		document.getElementById("stem").innerText = "Stem";
		document.getElementById("suffixes").innerText = "Suffix";
		document.getElementById("POS").innerText = "POS";
		//document.getElementById("Num").innerText = "Number";
		//document.getElementById("Gen").innerText = "Gender";
		//document.getElementById("Pers").innerText = "Person";
		document.getElementById("MSALemma").innerText = "Lemma";
		document.getElementById("Gloss").innerText = "Gloss";
	}
	

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
    div +=    '<input type="checkbox" id="leb" class="input_filers_style_en" value="Baladi" onclick="checkbox_clicked()" checked>Lebanese'
	div +=    '<input type="checkbox" id="nabra" class="input_filers_style_en" value="Nabra2" onclick="checkbox_clicked()" checked>Syrian'
    div +=    '<input type="checkbox" id="iraqi" class="input_filers_style_en" value="Iraqi" onclick="checkbox_clicked()" checked>Iraqi'
    div +=    '<input type="checkbox" id="libyan" class="input_filers_style_en" value="Libyan" onclick="checkbox_clicked()" checked>Libyan'
    div +=    '<input type="checkbox" id="sudanese" class="input_filers_style_en" value="Sudanese" onclick="checkbox_clicked()" checked>Sudanese'
    div +=    '<input type="checkbox" id="yemeni" class="input_filers_style_en" value="Yemeni" onclick="checkbox_clicked()" checked>Yemeni'
	
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
			var search_text = document.getElementById("searchbar_main").value.trim();
			/*var  new_url = "./search.html"+ '?' + encodeURIComponent(search_text);
			window.location.href = new_url;*/
			
			// Get the current URL
			var currentURL = window.location.href;

			// Modify the URL
			var newURL = currentURL.split("?")[0] + "?"+search_text;

			// Update the URL in the browser's address bar
			history.pushState({}, "", newURL);
			
			//GetResult();
		}
	});
});



function GetResultUsingSearchBtn(){
	var search_text = document.getElementById("searchbar_main").value.trim();
	
	// Get the current URL
	var currentURL = window.location.href;

	// Modify the URL
	var newURL = currentURL.split("?")[0] + "?"+search_text;

	// Update the URL in the browser's address bar
	history.pushState({}, "", newURL);
			
	//GetResult();		
}


function checkbox_clicked(){
	//console.log("checkbox clicked");
	var leb = document.getElementById("leb").checked;
	var iraqi = document.getElementById("iraqi").checked;
	var libyan = document.getElementById("libyan").checked;
	var sudanese = document.getElementById("sudanese").checked;
	var yemeni = document.getElementById("yemeni").checked;
	
	if(leb == true || iraqi == true || libyan == true || sudanese == true || yemeni == true){
		document.getElementById("Bu_logo").style.display = "inline-flex";
		document.getElementById("notification_text").style.display = "inline-flex";
		document.getElementById("copy_right").style.display = "block";
	}else{
		document.getElementById("Bu_logo").style.display = "none";
		document.getElementById("notification_text").style.display = "none";
		document.getElementById("copy_right").style.display = "none";
	}
	
	if(iraqi == true || libyan == true || sudanese == true || yemeni == true){
		document.getElementById("UN_logo").style.display = "inline-flex";
		document.getElementById("notification_text").style.display = "inline-flex";
		document.getElementById("copy_right").style.display = "block";
	}else{
		document.getElementById("UN_logo").style.display = "none";
	}
	
	if(leb == false && iraqi == false && libyan == false && sudanese == false && yemeni == false){
		document.getElementById("notification_text").style.display = "none";
		document.getElementById("copy_right").style.display = "none";
	}
	
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



function arStrip(input_str, diacs, smallDiacs , shaddah ,  digit , alif , specialChars ){

        if (input_str){
            if (diacs == "True"){
              input_str = input_str.replace(/[\u064B-\u0650]/g, '') ; // Remove all Arabic diacretics [ ًٌٍَُِْ]
              input_str = input_str.replace(/[\u0652]/g, ''); // Remove SUKUN
            }
            if (shaddah == "True"){
              input_str = input_str.replace(/[\u0651]/g,''); // Remove shddah
            }
            if (smallDiacs == "True"){
              input_str = input_str.replace(/[\u06D6-\u06ED]/g,''); // Remove all small Quranic annotation signs
              input_str = input_str.replace(/[\u0670]/g,''); // Remove Small Alif ٰ
            }
            if (digit == "True"){
              input_str = input_str.replace(/[0-9]/g,''); // Remove English digits
              input_str = input_str.replace(/[٠-٩]/g,''); // Remove Arabic digits
            }
            if (alif == "True"){ // Unify alif with hamzah:
                input_str = input_str.replace('ٱ', 'ا');
                input_str = input_str.replace('أ', 'ا');
                input_str = input_str.replace('إ', 'ا');
                input_str = input_str.replace('آ', 'ا');
            }
            if (specialChars == "True"){
                input_str = input_str.replace(/[?؟!@#$%]/g , ''); // Remove some of special chars
            }
            input_str = input_str.replace(/[\\s]/g," "); // Remove all spaces
            input_str = input_str.replace("_" , ''); // Remove underscore
            input_str = input_str.replace("ـ" , ''); // Remove Arabic tatwelah
            input_str = input_str.trim(); // Trim input string
        }
        return input_str;
}
