// Global variable to store CSV content
var globalCsvContent = '';

// Function to handle CSV download
function downloadCsv() {
  if (globalCsvContent) {
    var encodedUri = encodeURI(globalCsvContent);
    var downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', encodedUri);
    downloadLink.setAttribute('download', 'results.csv');
    downloadLink.click(); // Trigger the download
  } else {
    alert('No data to download!');
  }
}

function morphTagger() {
  console.log('morph_tagger');

  // Cache DOM elements
  const morphTaggerEl = document.getElementById('morph_tagger');
  const posTaggerEl = document.getElementById('pos_tagger');
  const lemmatizerEl = document.getElementById('lemmatizer');
  const textAreaEl = document.getElementById('text');
  const outputEl = document.getElementById('output');
  const csvDownloadEl = document.getElementById('csv-download');
  const liHiddenEl = document.getElementById('li_hidden');

  // Update styles for active tab
  morphTaggerEl.style.backgroundColor = '#666';
  morphTaggerEl.style.color = 'white';

  posTaggerEl.style.backgroundColor = '#f1f1f1';
  posTaggerEl.style.color = 'black';

  lemmatizerEl.style.backgroundColor = '#f1f1f1';
  lemmatizerEl.style.color = 'black';

  const textAreaInput = textAreaEl.value;

  if (textAreaInput == null || textAreaInput.trim() === '') {
    textAreaEl.style.backgroundColor = '#d3d3d3';
    outputEl.innerHTML = '<p>عذراً!! تأكد من إدخال النص</p>';
  } else {
    textAreaEl.style.backgroundColor = '#FFFFFF';
    outputEl.style.backgroundColor = '#FFFFFF';
    outputEl.innerHTML =
      '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';

    $.ajax({
      url: 'https://ontology.birzeit.edu/sina/v2/api/AlmaDemo/?apikey=sampleKey',
      data: JSON.stringify({
        text: textAreaInput.trim(),
        language: 'MSA',
        task: 'full',
        flag: '1',
      }),
	  
	 // url: 'https://sinalab-alma-api.hf.space/predict',
      //data: JSON.stringify({ text: textAreaInput.trim(), language: 'MSA', task: 'full', flag: '1' }),
	  type: 'POST',
	  contentType: 'application/json',
	  dataType: 'json',
      timeout: 10000000,
      success: function (data) {
        const val = data['resp'];
        console.log('val: ', val);

        // Create a scrollable container for the table
        let table = `
            <style>
              .scrollable-container {
                overflow-x: auto; /* Enable horizontal scrolling */
                max-width: 100%; /* Restrict the maximum width */
              }
              @media screen and (max-width: 540px) {
                .responsive-table {
                  width: 100% !important;
                  margin-right: 10px !important;
                }
              }
              @media screen and (max-width: 1024px) {
                .responsive-table {
                  width: 70% !important;
                  margin-right: 10px !important;
                }
              }
            </style>
            <div class='scrollable-container'>
              <table class='responsive-table' style='font-size: 1.6rem !important; width: 100%; border-collapse: collapse; line-height: 30px;'>
          `;
        table +=
          "<thead style='background-color: whitesmoke; padding:5px;'><tr style='border: 1px solid #ddd; text-align: right;'>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center; '>Lemma ID</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>Lemma</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>POS</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>Root</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>Token</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>Token ID</th>";
        // table +=
        //   "<th style='border: 1px solid #ddd; text-align: center;'>Sentence</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>Sentence ID</th>";
        table += '</tr></thead><tbody>';

        globalCsvContent = 'data:text/csv;charset=utf-8,'; // Reset the CSV content
        globalCsvContent +=
          'Lemma ID,Lemma,POS,Root,Token,Token Id,Sentence ID\n';

        for (let i = 0; i < val.length; i++) {
          const sentence_id = val[i]['sentence_id'] || '-';
          // const sentence = val[i]['sentence'] || '-';
          const lemmatizer_results = val[i]['lemmatizer_results'] || [];
          let token_count = 0;

          for (let j = 0; j < lemmatizer_results.length; j++) {
            const token = lemmatizer_results[j]['token'] || '-';
            var pos = lemmatizer_results[j]['pos'] || '-';
            const lemma = lemmatizer_results[j]['lemma'].split("|")[0] || '-';
            const root = lemmatizer_results[j]['root'] || '-';
            const lemma_id = lemmatizer_results[j]['lemma_id'] || '-';
            token_count++;

            if (pos.includes('فعل')) {
              pos = 'فعل';
            }
            table += "<tr style='text-align: right;'>";

            if (lemma_id !== '-') {
              table +=
                "<td style='border: 1px solid #ddd; color: #14a79c; line-height: 30px; padding-right: 4px; padding-left: 4px; font-size:1.4rem;'>" +
                `<a href='https://sina.birzeit.edu/qabas/lemma/${lemma_id}' target='_blank'>${lemma_id}</a>` +
                '</td>';
              table +=
                "<td style='border: 1px solid #ddd; color: #14a79c; line-height: 30px; padding-right: 4px; padding-left: 4px;'>" +
                `<a href='https://sina.birzeit.edu/qabas/lemma/${lemma_id}' target='_blank'>${lemma}</a>` +
                '</td>';
            } else {
              table +=
                "<td style='border: 1px solid #ddd; color: #14a79c; line-height: 30px; padding-right: 4px; padding-left: 4px;'>-</td>";
              table +=
                "<td style='border: 1px solid #ddd; color: #14a79c; line-height: 30px; padding-right: 4px; padding-left: 4px;'>" +
                lemma +
                '</td>';
            }

            table +=
              "<td style='border: 1px solid #ddd; color: #f39221; line-height: 30px; padding-right: 4px; padding-left: 4px; text-wrap: nowrap;'>" +
              pos +
              '</td>';
            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px; text-wrap: nowrap;'>" +
              root +
              '</td>';
            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px; font-weight: bold;'>" +
              token +
              '</td>';
            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px;'>" +
              token_count +
              '</td>';
            // table +=
            //   "<td style='border: 1px solid #ddd; text-align: center; text-wrap: nowrap;' dir='rtl'>" +
            //   sentence +
            //   '</td>';
            table +=
              "<td style='border: 1px solid #ddd; text-align: right;'>" +
              sentence_id +
              '</td>';

            table += '</tr>';

            globalCsvContent +=
              [
                lemma_id,
                lemma,
                pos,
                root,
                token,
                token_count,
                sentence_id,
              ].join(',') + '\n';
          }
        }

        table += '</tbody></table></div>'; // Close the scrollable container div
        outputEl.innerHTML = table;
        liHiddenEl.style.display = 'block';

        // Create or update CSV download link
        let downloadLink = document.getElementById('csv-link');
        if (!downloadLink) {
          downloadLink = document.createElement('a');
          downloadLink.setAttribute('id', 'csv-link');
          downloadLink.innerHTML = 'Download CSV';
          var downloadDiv = document.getElementById('csv-download');
          if (downloadDiv.children.length === 0) {
            downloadDiv.appendChild(downloadLink);
          } else {
            downloadDiv.replaceChild(downloadLink, downloadDiv.children[0]);
          }
        }

        const encodedUri = encodeURI(globalCsvContent);
        downloadLink.setAttribute('href', encodedUri);
        downloadLink.setAttribute('download', 'results.csv');
      },
      error: function (xhr, textStatus, errorThrown) {
        outputEl.innerHTML = '<p> Request failed, please try again later! </p>';
      },
    });
  }
}

function lemmatization() {
  // Set the background and text colors of buttons
  document.getElementById('morph_tagger').style.backgroundColor = '#f1f1f1';
  document.getElementById('morph_tagger').style.color = 'black';

  document.getElementById('pos_tagger').style.backgroundColor = '#f1f1f1';
  document.getElementById('pos_tagger').style.color = 'black';

  document.getElementById('lemmatizer').style.backgroundColor = '#666';
  document.getElementById('lemmatizer').style.color = 'white';

  var textAreaInput = $('#text').val();

  if (textAreaInput == null || textAreaInput.trim() == '') {
    document.getElementById('text').style.backgroundColor = '#d3d3d3';
    document.getElementById('output').innerHTML =
      '<p>عذراً!! تأكد من إدخال النص</p>';
  } else {
    document.getElementById('text').style.backgroundColor = '#FFFFFF';
    document.getElementById('output').style.backgroundColor = '#FFFFFF';
    document.getElementById('output').innerHTML =
      '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';

    $.ajax({
		
      url: 'https://ontology.birzeit.edu/sina/v2/api/AlmaDemo/?apikey=sampleKey',
      data: JSON.stringify({
        text: textAreaInput.trim(),
        language: 'MSA',
        task: 'lemmatization',
        flag: '1',
      }),
	  
	 // url: 'https://sinalab-alma-api.hf.space/predict',
     // data: JSON.stringify({ text: textAreaInput.trim(), language: 'MSA', task: 'lemmatization', flag: '1' }),
	  type: 'POST',
	  contentType: 'application/json',
	  dataType: 'json',
	  timeout: 10000000,
      success: function (data) {
        var resp = data['resp'];
        console.log('resp: ', resp);

        var table = `<style>
                    .scrollable-container {
                        overflow-x: hidden; /* Enable horizontal scrolling */
                        max-width: 100%; /* Restrict the maximum width */
                      
                    }
                    @media screen and (max-width: 770px) {
                        .responsive-table {
                            width: 100% !important;
                            margin-right: 10px !important;
                        }
                             .scrollable-container {
                        overflow-x: auto;
      }
                    }
                    @media screen and (max-width: 1024px) {
                        .responsive-table {
                            width: 70% !important;
                            margin-right: 10px !important;
                        }
                    }
                </style>
                <div class='scrollable-container'>
                    <table class='responsive-table' style='font-size: 1.6rem !important;  width: 100%; border-collapse: collapse; margin-right: 50px; margin-bottom: 25px; line-height: 30px;'>
                        <thead>
                            <tr style='border: 1px solid #ddd; text-align: right; background-color: whitesmoke;'>
                                <th style='border: 1px solid #ddd; text-align: center;'>Lemma ID</th>
                                <th style='border: 1px solid #ddd; text-align: center;'>Lemma</th>
                                <th style='border: 1px solid #ddd; text-align: center;'>Token</th>
                                <th style='border: 1px solid #ddd; text-align: center; text-wrap: nowrap;'>Token ID</th>
                             
                                <th style='border: 1px solid #ddd; text-align: center; text-wrap: nowrap;'>Sentence ID</th>
                            </tr>
                        </thead>
                        <tbody>`;

        globalCsvContent = 'data:text/csv;charset=utf-8,'; // Reset the CSV content
        globalCsvContent += 'Lemma ID,Lemma,Token,Token ID,Sentence ID\n';

        for (var i = 0; i < resp.length; i++) {
          var sentence_id = resp[i]['sentence_id'] || '-';
          // var sentence = resp[i]['sentence'] || '-';
          var lemmatizer_results = resp[i]['lemmatizer_results'] || [];
          let token_count = 0;

          for (var j = 0; j < lemmatizer_results.length; j++) {
            var lemma_id = lemmatizer_results[j]['lemma_id'] || '-';
            var lemma = lemmatizer_results[j]['lemma'].split("|")[0] || '-';
            var token = lemmatizer_results[j]['token'] || '-';
            token_count++;

            // Add row to table
            table += "<tr style='text-align: right;'>";

            // Lemma ID with link if valid
            if (lemma_id !== '-' && !isNaN(lemma_id)) {
              table += `<td style='border: 1px solid #ddd; color: #14a79c; line-height: 30px; padding-right: 4px; padding-left: 4px; font-size:1.4rem;'>
                                <a href='https://sina.birzeit.edu/qabas/lemma/${lemma_id}' target='_blank'>${lemma_id}</a>
                            </td>`;
            } else {
              table += `<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px;'>${lemma_id}</td>`;
            }

            // Lemma with link if valid
            if (lemma_id !== '-' && !isNaN(lemma_id)) {
              table += `<td style='border: 1px solid #ddd; color: #14a79c; line-height: 30px; padding-right: 4px; padding-left: 4px;'>
                                <a href='https://sina.birzeit.edu/qabas/lemma/${lemma_id}' target='_blank'>${lemma}</a>
                            </td>`;
            } else {
              table += `<td style='border: 1px solid #ddd; color: #14a79c; line-height: 30px; padding-right: 4px; padding-left: 4px;'>${lemma}</td>`;
            }

            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px; font-weight: bold;'>" +
              token +
              '</td>';
            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px;'>" +
              token_count +
              '</td>';

            // table +=
            //   "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px; text-wrap: nowrap;' dir='rtl'>" +
            //   sentence +
            //   '</td>';
            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px;'>" +
              sentence_id +
              '</td>';
            table += '</tr>';

            // Add row to CSV content
            globalCsvContent +=
              [lemma_id, lemma, token, token_count, sentence_id].join(',') +
              '\n';
          }
        }

        table += '</tbody></table></div>';
        document.getElementById('output').innerHTML = table;
        document.getElementById('li_hidden').style.display = 'block';

        // Create or update CSV download link
        var encodedUri = encodeURI(globalCsvContent);
        var downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', encodedUri);
        downloadLink.setAttribute('download', 'results.csv');
        downloadLink.innerHTML = 'Download CSV';

        var downloadDiv = document.getElementById('csv-download');
        if (downloadDiv.children.length === 0) {
          downloadDiv.appendChild(downloadLink);
        } else {
          downloadDiv.replaceChild(downloadLink, downloadDiv.children[0]);
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        document.getElementById('output').innerHTML =
          '<p> Request failed, please try again later! </p>';
      },
    });
  }
}
function posTagger() {
  // Cache DOM elements
  const morphTaggerEl = document.getElementById('morph_tagger');
  const posTaggerEl = document.getElementById('pos_tagger');
  const lemmatizerEl = document.getElementById('lemmatizer');
  const textAreaEl = document.getElementById('text');
  const outputEl = document.getElementById('output');
  const csvDownloadEl = document.getElementById('csv-download');
  const liHiddenEl = document.getElementById('li_hidden');

  // Update styles for active tab
  morphTaggerEl.style.backgroundColor = '#f1f1f1';
  morphTaggerEl.style.color = 'black';

  posTaggerEl.style.backgroundColor = '#666';
  posTaggerEl.style.color = 'white';

  lemmatizerEl.style.backgroundColor = '#f1f1f1';
  lemmatizerEl.style.color = 'black';

  const textAreaInput = textAreaEl.value;

  if (textAreaInput == null || textAreaInput.trim() === '') {
    textAreaEl.style.backgroundColor = '#d3d3d3';
    outputEl.innerHTML = '<p>عذراً!! تأكد من إدخال النص</p>';
  } else {
    textAreaEl.style.backgroundColor = '#FFFFFF';
    outputEl.style.backgroundColor = '#FFFFFF';
    outputEl.innerHTML =
      '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';

    $.ajax({
		
      url: 'https://ontology.birzeit.edu/sina/v2/api/AlmaDemo/?apikey=sampleKey',
      data: JSON.stringify({
        text: textAreaInput.trim(),
        language: 'MSA',
        task: 'pos',
        flag: '1',
      }),
	 // url: 'https://sinalab-alma-api.hf.space/predict',
      //data: JSON.stringify({ text: textAreaInput.trim(), language: 'MSA', task: 'pos', flag: '1' }),
	  type: 'POST',
	  contentType: 'application/json',
	  dataType: 'json',
	  timeout: 10000000,
      success: function (data) {
        const sentences = data['resp'];
        console.log('sentences: ', sentences);

        let table = `
                <style>
                    .scrollable-container {
                        overflow-x: hidden; /* Enable horizontal scrolling */
                        max-width: 100%; /* Restrict the maximum width */
                       
                    }
                    @media screen and (max-width: 600px) {
                        .responsive-table {
                            width: 100% !important;
                            margin-right: 10px !important;
                        }
                            .scrollable-container {
                            overflow-x: auto;
                              }
                    }
                    @media screen and (max-width: 1024px) {
                        .responsive-table {
                            width: 70% !important;
                            margin-right: 10px !important;
                        }
                    }
                </style>
                <div class='scrollable-container'>
                    <table class='responsive-table' style='font-size: 1.6rem !important; width: 100%; border-collapse: collapse; margin-right: 50px; margin-bottom: 25px; line-height: 30px;'>
                    `;
        table +=
          "<thead style='background-color: whitesmoke; padding:5px'><tr style='border: 1px solid #ddd; text-align: right;'>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>POS</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center;'>Token</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center; text-wrap: nowrap;'>Token ID</th>";
        // table +=
        //   "<th style='border: 1px solid #ddd; text-align: center;'>Sentence</th>";
        table +=
          "<th style='border: 1px solid #ddd; text-align: center; text-wrap: nowrap;'>Sentence ID</th>";
        table += '</tr></thead><tbody>';

        let globalCsvContent = 'data:text/csv;charset=utf-8,'; // Reset the CSV content
        globalCsvContent += 'POS,Token,Token ID,Sentence ID\n';

        for (const sentence of sentences) {
          // const sentenceText = sentence['sentence'] || '-';
          const sentenceId = sentence['sentence_id'] || '-';
          const lemmatizerResults = sentence['lemmatizer_results'] || [];
          let tokenCount = 0;

          for (const result of lemmatizerResults) {
            const token = result['token'] || '-';
            let pos = result['pos'] || '-';

            if (pos.includes('فعل')) {
              pos = 'فعل';
            }

            tokenCount++;
            // Add CSV row
            globalCsvContent +=
              [pos, token, tokenCount, sentenceId].join(',') + '\n';

            table += "<tr style='text-align: right;'>";
            table +=
              "<td style='border: 1px solid #ddd; color: #f39221; line-height: 30px; padding-right: 4px; padding-left: 4px; text-wrap: nowrap;'>" +
              pos +
              '</td>';
            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px; font-weight: bold;'>" +
              token +
              '</td>';
            table +=
              "<td style='border: 1px solid #ddd; line-height: 30px; padding-right: 4px; padding-left: 4px;'>" +
              tokenCount +
              '</td>';
            // table +=
            //   "<td style='border: 1px solid #ddd; text-align: center; text-wrap: nowrap;' dir='rtl'>" +
            //   sentenceText +
            //   '</td>';
            table +=
              "<td style='border: 1px solid #ddd; text-align: right;'>" +
              sentenceId +
              '</td>';
            table += '</tr>';
          }
        }

        table += '</tbody></table></div>';
        document.getElementById('output').innerHTML = table;
        document.getElementById('li_hidden').style.display = 'block';

        // Create or update CSV download link
        let downloadLink = document.getElementById('csv-link');
        if (!downloadLink) {
          downloadLink = document.createElement('a');
          downloadLink.setAttribute('id', 'csv-link');
          downloadLink.innerHTML = 'Download CSV';
          var downloadDiv = document.getElementById('csv-download');
          if (downloadDiv.children.length === 0) {
            downloadDiv.appendChild(downloadLink);
          } else {
            downloadDiv.replaceChild(downloadLink, downloadDiv.children[0]);
          }
        }

        const encodedUri = encodeURI(globalCsvContent);
        downloadLink.setAttribute('href', encodedUri);
        downloadLink.setAttribute('download', 'results.csv');
      },
      error: function (xhr, textStatus, errorThrown) {
        document.getElementById('output').innerHTML =
          '<p> Request failed, please try again later! </p>';
      },
    });
  }
}
function openLightbox(img) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  lightboxImg.src = img.src;
  lightbox.style.display = 'flex';
}

function closeLightbox(event) {
  const lightbox = document.getElementById('lightbox');

  lightbox.style.display = 'none';
}
