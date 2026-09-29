var text = '';
var alam = '';

function ExcuteWojood() {
  document.getElementById('combo').style.display = 'inherit';
  var textAreaInput = $('#text').val();
  /*if (textAreaInput.length > 500) {
		alert("NOTE!!, Maximum Input length is 500 characters ")
		$('#text').val(textAreaInput.substr(0, 500));
	}*/
  var textAreaInput = $('#text').val();


  if (textAreaInput == null || textAreaInput.trim() == '') {
    $('#output').html('<p> عذرا!! تأكد من ادخال النص </p>');
    $('#text').css({ 'background-color': '#d3d3d3' });
  } else {
    $('#text').css({ 'background-color': '#FFFFFF' });
    var e = document.getElementById('output_format').value;
	console.log("mode is: ", e);
    if (e == 'JSON IBO') {
      $('#output').html(
        '<i class="fa fa-spinner fa-spin" style="font-size:24px;"></i>'
      );
      $('#output').css({
        'text-align': 'center',
      });
      $.ajax({
        //url: 'https://ontology.birzeit.edu/sina/v2/api/wojood/?apikey=sampleKey',
        //data: JSON.stringify({ sentence: textAreaInput, mode: '1' }),
        url: 'https://sinalab-wojood-api.hf.space/predict',
        data: JSON.stringify({ text: textAreaInput, mode: '1' }),
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
        timeout: 10000000,
        success: function (data) {
          var words = data;
          output = JSON.stringify(words);
          output = '<p>' + output + '</p>';
          $('#output').css({
            'text-align': 'left',
          });
          $('#output').html(output);

          console.log('obj output is = : ', output);
          //$('#output').html(words);
        },
        error: function (xhr, textStatus, errorThrown) {
          $('#output').html('<p> Request failed, please try again later! </p>');
        },
      });
    } else if (e == 'JSON entities') {
      $('#output').html(
        '<i class="fa fa-spinner fa-spin" style="font-size:24px;"></i>'
      );
      $('#output').css({
        'text-align': 'center',
      });
      $.ajax({
        //url: 'https://ontology.birzeit.edu/sina/v2/api/wojood/?apikey=sampleKey',
        //data: JSON.stringify({ sentence: textAreaInput, mode: '4' }),
		url: 'https://sinalab-wojood-api.hf.space/predict',
        data: JSON.stringify({ text: textAreaInput, mode: '4' }),
        type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
        timeout: 10000000,
        success: function (data) {
          console.log('data is : ', data);
          var result = data;
          output = JSON.stringify(result);
          console.log(output);
          output = '<p>' + output + '</p>';
          $('#output').css({
            'text-align': 'left',
          });
          $('#output').html(output);
        },
        error: function (xhr, textStatus, errorThrown) {
          $('#output').html('<p> Request failed, please try again later! </p>');
        },
      });
    } else if (e == 'XML') {
      $('#output').html(
        '<i class="fa fa-spinner fa-spin" style="font-size:24px; text-align: center;"></i>'
      );
      $('#output').css({
        'text-align': 'center',
      });
      $.ajax({
        //url: 'https://ontology.birzeit.edu/sina/v2/api/wojood/?apikey=sampleKey',
        //data: JSON.stringify({ sentence: textAreaInput, mode: '2' }),
        url: 'https://sinalab-wojood-api.hf.space/predict',
        data: JSON.stringify({ text: textAreaInput, mode: '2' }),
        type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
        timeout: 10000000,
        success: function (data) {
          console.log('data is : ', data);
          var output_results = [];
		  var results = data['resp'];
          //result = " &lt;p&gt;";
		  for (let r = 0; r < results.length; r++) {
				output_results.push(results[r].replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
		  }
          //result = result.replaceAll('<', '&lt;');
          //result = result.replaceAll('>', '&gt;');
          console.log(output_results);
          $('#output').html('<p> ' + output_results.join(" ") + ' </p>');
        },
        error: function (xhr, textStatus, errorThrown) {
          $('#output').html('<p> Request failed, please try again later! </p>');
        },
      });
    } else if (e === 'highlighted') {
      $('#output').html(
        '<i class="fa fa-spinner fa-spin" style="font-size:24px; text-align: center;"></i>'
      );
      $('#output').css({
        'text-align': 'center',
      });
    
      // Send AJAX request to the API
      $.ajax({
        //url: 'https://ontology.birzeit.edu/sina/v2/api/wojood/?apikey=sampleKey',
        //data: JSON.stringify({ sentence: textAreaInput, mode: '3' }),
        url: 'https://sinalab-wojood-api.hf.space/predict',
        data: JSON.stringify({ text: textAreaInput, mode: '3' }),
        type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
        timeout: 10000000,
        success: function (data) {
          var obj = data['resp']; 
          let outputHtml = '';
          obj.forEach(item => {
            outputHtml += `
              <div class="sentence-block" style="direction: rtl; text-align: right; margin-bottom: 10px;">
                <div>${item}</div>
              </div>
           
            `;
          });
    
          // Apply the generated HTML to the #output element
          $('#output').css({
            'text-align': 'right',
          });
          $('#output').html(outputHtml);
        },
        error: function (xhr, textStatus, errorThrown) {
          $('#output').html('<p>Request failed, please try again later!</p>');
        },
      });
    }
    
  }
}

function toggle_visibility(entity) {
  var box = document.getElementById('block-' + entity);
  if (box.style.display == 'block') {
    box.style.display = 'none';
  } else {
    box.style.display = 'block';
  }
}
function openFullScreen(img) {
  const modal = document.getElementById('imgModal');
  const fullImg = document.getElementById('fullImg');
  modal.style.display = 'block';
  fullImg.src = img.src;
}

function closeFullScreen() {
  const modal = document.getElementById('imgModal');
  modal.style.display = 'none';
}
