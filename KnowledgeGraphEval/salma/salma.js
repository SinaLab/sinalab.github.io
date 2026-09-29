var text = '';
var alam = '';

function ExcuteSALMA() {
  var input = $('#text').val();

  $('#output').html(
    '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>'
  );
  $.ajax({
    url: 'https://ontology.birzeit.edu/sina/v2/api/SALMA/?apikey=sampleKey',
    data: JSON.stringify({ sentence: input }),
	//url: 'https://sinalab-salma-api.hf.space/predict',
    //data: JSON.stringify({ "text": input }),
	type: 'POST',
	contentType: 'application/json',
	dataType: 'json',
    timeout: 10000000,
    success: function (data) {
      console.log(data);
      var val = data['resp'];
      console.log(val);

      // Start generating the table with inline styles for width and centering
      var table = '<table class="responsive-table" >';
      table +=
        '<thead><tr style="background-color: whitesmoke;"><th style="white-space: nowrap; text-align: center; background-color: whitesmoke;">Gloss</th><th style="white-space: nowrap; text-align: center;">Concept Id</th><th style="white-space: nowrap; text-align: center;">Lemma</th><th style="white-space: nowrap; text-align: center;">Token</th></tr></thead>';
      table += '<tbody>';

      for (i = 0; i < val.length; i++) {
        console.log('val[i]: ', val[i].gloss, val[i].Concept_id);

        table += '<tr>';
        if (val[i].gloss) {
          table += '<td dir="rtl">' + val[i].gloss + '</td>';
        } else if (val[i].Gloss) {
          table += '<td  dir="rtl">' + val[i].Gloss + '</td>';
        } else {
          table += '<td style="white-space: nowrap;" dir="rtl">-</td>';
        }

        if (val[i].Concept_id) {
          table +=
            '<td style="white-space: nowrap; font-size:1.4rem"><a target="__blank" href="https://ontology.birzeit.edu/lexicalconcept/' +
            val[i].Concept_id +
            '">' +
            val[i].Concept_id +
            '</a></td>';
          table +=
            '<td style="white-space: nowrap;"><a target="__blank" href="https://sina.birzeit.edu/qabas/lemma/' +
            val[i].lemma_id +
            '">' +
            val[i].Diac_lemma +
            '</a></td>';
        } else {
          table += '<td style="white-space: nowrap;">' + '-' + '</td>';
          table += '<td style="white-space: nowrap;">' + val[i].Diac_lemma + '</td>';
        }

        table +=
          '<td style="white-space: nowrap; font-weight: bold;">' +
          val[i].word +
          '</td>';

        table += '</tr>';
      }

      table += '</tbody></table>';
      $('#output').html(table); // Replace the spinner with the table
    },
    error: function (xhr, textStatus, errorThrown) {
      $('#output').html('<p> Request failed, please try again later! </p>');
    },
  });
}
function openLightbox(img) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  lightboxImg.src = img.src;
  lightbox.style.display = 'flex';
}

function closeLightbox(event) {
  const lightbox = document.getElementById('lightbox');

  // if (event.target === lightbox || event.target.classList.contains('close')) {
  lightbox.style.display = 'none';
  // }
}
