var text = '';
var alam = '';

document.addEventListener("DOMContentLoaded", () => {

const modelSelect = document.getElementById("model_choice");
const apiKeyContainer = document.getElementById("apiKeyContainer");

modelSelect.addEventListener("change", () => {
  if (modelSelect.value === "GPT-4") {
    apiKeyContainer.style.display = "block";
  } else {
    apiKeyContainer.style.display = "none";
  }
});

const inputType = document.getElementById("input_type")
const textInput = document.getElementById("textInput")
const csvInput = document.getElementById("csvInput")
const status = document.getElementById("status")
const errorMessage = document.getElementById("errorMessage")
const modelChoice = document.getElementById("model_choice")
const warningMessage = document.getElementById("warningMessage")
const apiKeyInput = document.getElementById("api_key")

/* INPUT METHOD SWITCH */
inputType.addEventListener("change",()=>{
    if(inputType.value==="text"){
        textInput.classList.remove("hidden")
        csvInput.classList.add("hidden")
    } else {
        textInput.classList.add("hidden")
        csvInput.classList.remove("hidden")
    }
})

/* MODEL CHANGE */
modelChoice.addEventListener("change",()=>{
    const model=modelChoice.value
    warningMessage.innerText=""
    if(model==="DeepSeek-Reasoner"){
        warningMessage.innerText="Warning: DeepSeek may take a longer time to respond."
    }
    if(model==="GPT-4"){
        apiKeyContainer.classList.remove("hidden")
    } else {
        apiKeyContainer.classList.add("hidden")
    }
})

/* SEND REQUEST TO DETECT CONFLICT */
async function sendPair(req1, req2, id1, id2){
    let payload = {
        Req1:req1,
        Req2:req2,
        model_choice:modelChoice.value,
        prompt_type:document.getElementById("prompt_type").value
    }
    if(modelChoice.value==="GPT-4"){
        payload.api_key = apiKeyInput.value
    }
    const response = await fetch("https://SinaLabOrg-ReqConflictDetection.hf.space/predict", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
    })
    const result = await response.json()
    addRow(id1, id2, req1, req2, result)
}

/* ADD RESULT ROW WITH RESOLVE BUTTON */
function addRow(id1, id2, r1, r2, result){
    const table = document.querySelector("#resultsTable tbody")
    const row = document.createElement("tr")

    row.innerHTML =
        "<td>"+id1+" - "+id2+"</td>" +
        "<td>"+r1+"</td>" +
        "<td>"+r2+"</td>" +
        "<td class='resultCell'>"+JSON.stringify(result)+"</td>" +
        "<td><button class='resolveBtn'>Resolve</button></td>"

    table.appendChild(row)

    // Add click listener to the resolve button
    row.querySelector(".resolveBtn").addEventListener("click", async () => {
        const payload = {
            "Req1": r1,
            "Req2": r2,
            "model_choice": "Fanar"
        }
        try {
            const response = await fetch("https://SinaLabOrg-ReqConflictDetection.hf.space/resolve", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(payload)
            })
            const data = await response.json()
            row.querySelector(".resultCell").innerText = data.resolved_result || JSON.stringify(data)
        } catch (err) {
            alert("Error resolving requirements: " + err)
        }
    })
}

/* RUN BUTTON */
document.getElementById("runBtn").addEventListener("click", async()=>{
    errorMessage.innerText=""
    status.innerText="Processing..."

    if(inputType.value==="text"){
        const r1 = document.getElementById("req1").value.trim()
        if(!r1){
            alert("Please enter requirement set")
            return
        }
		

		// Split by new lines and remove empty lines
		const requirements = r1
			.split("\n")
			.map(r => r.trim())
			.filter(r => r.length > 0)

		// Generate unique pairs (no duplication like r2,r1)
		for (let i = 0; i < requirements.length; i++) {
			for (let j = i + 1; j < requirements.length; j++) {

				const req1 = requirements[i]
				const req2 = requirements[j]

				console.log(req1, req2)

				// Call your function
				await sendPair(req1, req2, `R${i+1}`, `R${j+1}`)
			}
		}

        //await sendPair(r1,r2,"R1","R2")
        status.innerText="Done"
    } else {
        const file = document.getElementById("csvFile").files[0]
        if(!file){
            errorMessage.innerText="Please upload a CSV file."
            return
        }
        const text = await file.text()
        const rows = text.trim().split("\n")
        if(rows[0].trim()!=="ID,Requirement"){
            errorMessage.innerText="Invalid CSV format. First row must be: ID,Requirement"
            return
        }
        let requirements=[]
        for(let i=1;i<rows.length;i++){
            const cols = rows[i].split(",")
            if(cols.length!==2){
                errorMessage.innerText="Invalid CSV format. Each row must contain ID and Requirement."
                return
            }
            requirements.push({id:cols[0].trim(), text:cols[1].trim()})
        }
        for(let i=0;i<requirements.length;i++){
            for(let j=i+1;j<requirements.length;j++){
                await sendPair(
                    requirements[i].text,
                    requirements[j].text,
                    requirements[i].id,
                    requirements[j].id
                )
            }
        }
        status.innerText="Finished processing CSV"
    }
})

});

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
