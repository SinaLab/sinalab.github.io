function escapeHtml(value) {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/*
  Update these URLs if your Hugging Face Space name is different.

  /predict_re  = normal relation extraction
  /predict_eae = event argument extraction
*/
const API_BASE_URL = 'https://SinaLab-relation-api.hf.space';
const RELATION_API_URL = API_BASE_URL + '/predict_re';
const EVENT_API_URL = API_BASE_URL + '/predict_eae';

/*
  Strips trailing punctuation (Arabic and Latin) from a label string.
*/
function stripTrailingPunctuation(label) {
  if (!label) return label;
  return label.replace(/[\s\u060C,.\u061B;:!?\-\u2013\u2014]+$/u, '').trim();
}
/*
  Cleans Subject.Label and Object.Label for every item in an array.
*/
function cleanLabels(items) {
  return items.map(function (item) {
    if (item.Subject && item.Subject.Label) {
      item.Subject.Label = stripTrailingPunctuation(item.Subject.Label);
    }
    if (item.Object && item.Object.Label) {
      item.Object.Label = stripTrailingPunctuation(item.Object.Label);
    }
    return item;
  });
}

function normalizeApiResponse(response) {
  if (typeof response === 'string') {
    try {
      response = JSON.parse(response);
    } catch (e) {
      return [];
    }
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.resp)) {
    return response.resp;
  }

  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  if (response && Array.isArray(response.results)) {
    return response.results;
  }

  return [];
}

function callApi(url, text) {
  return $.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify({
      text: text
    }),
    contentType: 'application/json',
    dataType: 'json',
    timeout: 10000000
  });
}

/*
  Button 1:
  Extract All Relations = normal relations + event arguments
*/
function getRelation() {
  extractRelations('all');
}

/*
  Button 2:
  Extract Only Event Arguments
*/
function getEventRelation() {
  extractRelations('events');
}

function extractRelations(mode) {
  var textAreaInput = document.getElementById('text').value.trim();
  var outputFormat = document.getElementById('output_format').value;
  var outputDiv = document.getElementById('output');
  var textInput = document.getElementById('text');

  if (textAreaInput === '') {
    outputDiv.innerHTML = '<p> ⁄–—«!!  √ﬂœ „‰ ≈œŒ«· «·‰’ </p>';
    textInput.style.backgroundColor = '#d3d3d3';
    return;
  }

  textInput.style.backgroundColor = '#FFFFFF';

  outputDiv.innerHTML =
    '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>';

  if (mode === 'all') {
    var relationData = [];
    var eventData = [];
    var errors = [];

    var relationRequest = callApi(RELATION_API_URL, textAreaInput)
      .done(function (response) {
        relationData = cleanLabels(normalizeApiResponse(response)).map(function (item) {
          item.Task = 'Relation Extraction';
          return item;
        });
      })
      .fail(function (xhr, textStatus, errorThrown) {
        console.error('Relation API failed:', textStatus, errorThrown);
        console.error('Relation API response:', xhr.responseText);
        errors.push('Relation Extraction request failed.');
      });

    var eventRequest = callApi(EVENT_API_URL, textAreaInput)
      .done(function (response) {
        eventData = cleanLabels(normalizeApiResponse(response)).map(function (item) {
          item.Task = 'Event Argument Extraction';
          return item;
        });
      })
      .fail(function (xhr, textStatus, errorThrown) {
        console.error('Event API failed:', textStatus, errorThrown);
        console.error('Event API response:', xhr.responseText);
        errors.push('Event Argument Extraction request failed.');
      });

    /*
      Use always() so that if one API works and the other fails,
      the working results are still displayed.
    */
    $.when(relationRequest, eventRequest).always(function () {
      var allData = relationData.concat(eventData);

      if (allData.length === 0) {
        outputDiv.innerHTML =
          '<p>Request failed, please try again later!</p>' +
          '<pre dir="ltr" style="text-align:left; white-space:pre-wrap;">' +
          escapeHtml(errors.join('\n')) +
          '</pre>';
        return;
      }

      renderOutput(allData, outputFormat, textAreaInput, errors);
    });
  }

  else if (mode === 'events') {
    callApi(EVENT_API_URL, textAreaInput)
      .done(function (response) {
        var eventData = cleanLabels(normalizeApiResponse(response)).map(function (item) {
          item.Task = 'Event Argument Extraction';
          return item;
        });

        renderOutput(eventData, outputFormat, textAreaInput, []);
      })
      .fail(function (xhr, textStatus, errorThrown) {
        showError(xhr, textStatus, errorThrown);
      });
  }
}

function copyJsonOutput() {
  var jsonElement = document.getElementById('jsonOutput');

  if (!jsonElement) {
    return;
  }

  var text = jsonElement.innerText || jsonElement.textContent;

  navigator.clipboard.writeText(text).then(function () {
    var btn = document.querySelector('.re-copy-btn');
    if (btn) {
      btn.innerText = 'Copied!';
      setTimeout(function () {
        btn.innerText = 'Copy JSON';
      }, 1500);
    }
  }).catch(function () {
    alert('Could not copy JSON.');
  });
}

function getRelationName(item) {
  if (!item.Relation) return '';

  return item.Relation.includes('.')
    ? item.Relation.split('.').pop()
    : item.Relation;
}

function getConfidence(item) {
  if (item.Confidence !== undefined) {
    return Number(item.Confidence).toFixed(4);
  }

  if (item.confidence !== undefined) {
    return Number(item.confidence).toFixed(4);
  }

  return '';
}

function renderOutput(data, outputFormat, textAreaInput, errors) {
  var outputDiv = document.getElementById('output');

  if (!data || data.length === 0) {
    outputDiv.innerHTML = '<p>\u0644\u0627 \u062A\u0648\u062C\u062F \u0639\u0644\u0627\u0642\u0627\u062A \u0645\u0633\u062A\u062E\u0631\u062C\u0629.</p>';
    return;
  }

  var warningOutput = '';

  if (errors && errors.length > 0) {
    warningOutput =
      '<div style="max-width:720px;margin:10px auto;padding:8px 12px;border:1px solid #facc15;background:#fefce8;color:#854d0e;border-radius:8px;text-align:left;font-size:13px;">' +
      escapeHtml(errors.join(' ')) +
      '</div>';
  }

  var output = '';

  if (outputFormat === 'Table') {
    output =
      warningOutput +
      '<div class="center-table">' +
      '<table>' +
      '<tr style="background-color: whitesmoke;">' +
      '<th>TripleID</th>' +
      '<th>Subject</th>' +
      '<th>Relation</th>' +
      '<th>Object</th>' +
      '<th>Confidence Score</th>' +
      '</tr>';

    data.forEach(function (item, index) {
      var tripleId = item.TripleID !== undefined ? item.TripleID : index + 1;

      var subjectLabel =
        item.Subject && item.Subject.Label ? item.Subject.Label : '';

      var subjectType =
        item.Subject && item.Subject.Type ? item.Subject.Type : '';

      var objectLabel =
        item.Object && item.Object.Label ? item.Object.Label : '';

      var objectType =
        item.Object && item.Object.Type ? item.Object.Type : '';

      var relation = getRelationName(item);
      var confidence = getConfidence(item);

      output += '<tr>';
      output += '<td>' + escapeHtml(tripleId) + '</td>';

      output +=
        '<td class="text-class" style="text-align: right;">' +
        escapeHtml(subjectLabel) +
        ' (' +
        escapeHtml(subjectType) +
        ')</td>';

      output +=
        '<td class="text-class" style="text-align: left;">' +
        escapeHtml(relation) +
        '</td>';

      output +=
        '<td class="text-class" style="text-align: right;">' +
        escapeHtml(objectLabel) +
        ' (' +
        escapeHtml(objectType) +
        ')</td>';

      output += '<td>' + escapeHtml(confidence) + '</td>';
      output += '</tr>';
    });

    output += '</table></div>';
  }

  else if (outputFormat === 'highlighted') {
    var highlightedText = escapeHtml(textAreaInput);

    var entities = [];

    data.forEach(function (item) {
      if (item.Subject && item.Subject.Label) {
        entities.push({
          label: item.Subject.Label,
          type: item.Subject.Type || '',
          role: 'subject'
        });
      }

      if (item.Object && item.Object.Label) {
        entities.push({
          label: item.Object.Label,
          type: item.Object.Type || '',
          role: 'object'
        });
      }
    });

    entities.sort(function (a, b) {
      return b.label.length - a.label.length;
    });

    var replacedEntities = new Set();

    entities.forEach(function (entity) {
      if (replacedEntities.has(entity.label)) {
        return;
      }

      var safeLabel = escapeHtml(entity.label);
      var safeType = escapeHtml(entity.type);

      var badge =
        '<span class="re-entity re-entity-' +
        entity.role +
        '">' +
        '<span class="re-entity-name">' +
        safeLabel +
        '</span>' +
        '<span class="re-entity-type">' +
        safeType +
        '</span>' +
        '</span>';

      highlightedText = highlightedText.replace(safeLabel, badge);
      replacedEntities.add(entity.label);
    });

    var relationItems = '';

    data.forEach(function (item, index) {
      var subjectLabel =
        item.Subject && item.Subject.Label
          ? escapeHtml(item.Subject.Label)
          : '';

      var subjectType =
        item.Subject && item.Subject.Type
          ? escapeHtml(item.Subject.Type)
          : '';

      var objectLabel =
        item.Object && item.Object.Label
          ? escapeHtml(item.Object.Label)
          : '';

      var objectType =
        item.Object && item.Object.Type
          ? escapeHtml(item.Object.Type)
          : '';

      var relation = escapeHtml(getRelationName(item));
      var confidence = escapeHtml(getConfidence(item));
      var task = escapeHtml(item.Task || '');

      relationItems +=
        '<div class="re-relation-card">' +

        '<div class="re-card-header">' +
        '<span class="re-card-label">' +
        task +
        ' ' +
        (index + 1) +
        '</span>' +
        '<span class="re-confidence">' +
        confidence +
        '</span>' +
        '</div>' +

        '<div class="re-triple-row">' +

        '<div class="re-argument re-subject-box">' +
        '<div class="re-argument-label">' +
        subjectLabel +
        '</div>' +
        '<div class="re-argument-type">' +
        subjectType +
        '</div>' +
        '</div>' +

        '<div class="re-predicate">' +
        '<span class="re-line"></span>' +
        '<span class="re-predicate-name">' +
        relation +
        '</span>' +
        '<span class="re-line"></span>' +
        '</div>' +

        '<div class="re-argument re-object-box">' +
        '<div class="re-argument-label">' +
        objectLabel +
        '</div>' +
        '<div class="re-argument-type">' +
        objectType +
        '</div>' +
        '</div>' +

        '</div>' +
        '</div>';
    });

    output =
      warningOutput +
      '<div class="re-output">' +
      '<div class="re-sentence-panel">' +
      highlightedText +
      '</div>' +
      '<div class="re-panel-title">«·⁄·«ﬁ«  «·„” Œ—Ã…</div>' +
      '<div class="re-relations-list">' +
      relationItems +
      '</div>' +
      '</div>';
  }

  else if (outputFormat === 'JSON') {
    var jsonText = JSON.stringify(data, null, 2);

    output =
      warningOutput +
      '<div class="re-output">' +

      '<div class="re-json-header">' +
      '<span>JSON Output</span>' +
      '<button class="re-copy-btn" onclick="copyJsonOutput()">Copy JSON</button>' +
      '</div>' +

      '<pre id="jsonOutput" class="re-json-output">' +
      escapeHtml(jsonText) +
      '</pre>' +

      '</div>';
  }

  outputDiv.innerHTML = output;
}

function showError(xhr, textStatus, errorThrown) {
  console.error('AJAX error:', textStatus, errorThrown);
  console.error('Response text:', xhr.responseText);

  document.getElementById('output').innerHTML =
    '<p>Request failed, please try again later!</p>' +
    '<pre dir="ltr" style="text-align:left; white-space:pre-wrap;">' +
    escapeHtml(xhr.responseText || textStatus || errorThrown) +
    '</pre>';
}