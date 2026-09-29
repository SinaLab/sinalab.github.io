
function change_border(box_id){
	console.log("ID: ",box_id);
    var box =  document.getElementById(box_id).checked;
		console.log(box);
	console.log(document.getElementById(box_id).style.borderBottomLeftRadius);
	if(box == true){
		document.getElementById(box_id+"-label").style.borderBottomLeftRadius = "0px";
		document.getElementById(box_id+"-label").style.borderBottomRightRadius = "0px";		
	}else{
		document.getElementById(box_id+"-label").style.borderBottomLeftRadius = "2px";
		document.getElementById(box_id+"-label").style.borderBottomRightRadius = "2px";
	}

	
}



document.addEventListener("DOMContentLoaded", () => {
    const fragment = window.location.hash.substring(1);

    if (fragment) {
		document.getElementById("p-"+fragment).checked = true;
    }
});