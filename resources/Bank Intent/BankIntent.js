
function checkCode() {
    var inp_code = $('#inp_pswd').val();
    if (inp_code==null|| inp_code ==""){
        alert("please enter the code!")
    }else if (inp_code == "Bank@2023") {
        document.getElementById("GoButton").style.visibility = "visible";
        document.getElementById("text").style.visibility = "visible";
        document.getElementById("myDiv").style.visibility = "visible";
    } else {
        alert("Wrong code entered!");
        document.getElementById("GoButton").style.visibility = "Hidden";
        document.getElementById("text").style.visibility = "Hidden";
        document.getElementById("myDiv").style.visibility = "Hidden";
    }
    console.log(inp_code);
}


function BankIntentService() {
    // var inplang = $('#inp_lang').val();
    var textAreaInput = $('#text').val();
    var getBtn = document.getElementById("GoButton");
    var Go_Text = document.getElementById("go_text");


    console.log(textAreaInput);

    getBtn.style.opacity = "0.4";
    Go_Text.style.display = "none";

    document.getElementById("loading_icon").style.display = "inline-block";
    document.getElementById("loading_icon").style.animation = "fa-todayTimespin 2s infinite linear";
    if (textAreaInput.length > 500) {
        alert("ملاحظة !! ، الحد الأقصى لطول النص هو 500 حرف")
        $('#text').val(textAreaInput.substr(0, 500));

    }
    var textAreaInput = $('#text').val();
    console.log(textAreaInput);


    if (textAreaInput == null || textAreaInput.trim() == "") {
        $('#output').html('<p> عذرا!! تأكد من ادخال النص </p>');
        $('#text').css({ 'background-color': '#d3d3d3' });
        // } else if(inplang.trim() == null || inplang.trim() == "")
        //  {
        $('#output').html('<p> عذرا!! تأكد من ادخال اللغة </p>');
        // $('#inp_lang').css({ 'background-color': '#d3d3d3' });
    } else {
        // $('#inp_lang').css({ 'background-color': '#FFFFFF' });
        $('#text').css({ 'background-color': '#FFFFFF' });
        $('#output').html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');
        $.ajax({
            url: "https://ontology.birzeit.edu/sina/v2/api/BankIntent/?apikey=BankIntentKey",
            data: JSON.stringify({ "lang": "ar", "text": textAreaInput }),
            type: "POST",
            timeout: 10000000,
            success: function (data) {
                console.log(data);
                var obj = data;
                var statusCode = obj["statusCode"];
                if (statusCode.toString() == "0") {
                    document.getElementById("loading_icon").style.animation = "none";
                    document.getElementById("loading_icon").style.display = "none";

                    getBtn.style.opacity = "1";
                    Go_Text.style.display = "block";
                    val = obj["resp"];
                    let output = '';
                    // accessing the 'predicted_label' field and printing its values
                    for (const [key, value] of Object.entries(val.predicted_label)) {
                        output += key + ': ' + value + '<br>';
                    }
                    $('#output').html(output);


                }
            }
        });

    }

}