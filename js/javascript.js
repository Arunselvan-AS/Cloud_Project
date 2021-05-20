
function downloadFile(urlToSend) {
    var req = new XMLHttpRequest();
    req.open("GET", urlToSend, true);
    req.responseType = "blob";
    req.onload = function (event) {
        var blob = req.response;
        var fileName = 'out.tr' //if you have the fileName header available
        var link=document.createElement('a');
        link.href=window.URL.createObjectURL(blob);
        link.download=fileName;
        link.click();
    };

    req.send();
}
$(function(){
    $("#traceFile").click(function(){
        console.log('Button Clicked');
        $.getJSON("https://api.ipify.org?format=json",function(data) {
            var ipaddr = data.ip
            ipaddr = ipaddr.replace(/\./g,"");
            downloadFile(`files/${ipaddr}/out.tr`);
        });
    });
})
$(document).ready(function(){
    var codeText = $(".codemirror-textarea")[0];
    var editor = CodeMirror.fromTextArea(codeText, {
        lineNumbers : true,
        mode:"tcl",
        theme:"monokai",
    });
    $("#submit").click(function(){
        $.getJSON("https://api.ipify.org?format=json",function(data) {
        var ns2code = editor.getValue();
        var ipaddr = data.ip
        ipaddr = ipaddr.replace(/\./g,"");
        $.post("/compile",{code:ns2code,ip:ipaddr},function(result){
            $("#compileStatus").html(result.status);
            $("#Output").html(result.outputStatus);
            if(result.status == 'Compilation Successful')
            {
                document.getElementById("traceFile").disabled = false;
            }
            else
            {
                document.getElementById("traceFile").disabled = true;
            }
            $.post("/getPDR",{ipaddr:ipaddr},function(result){
                $("#Metrics").html('Sent packets:'+result.sent+'\nReceived Packets:'+result.receive+'\nCollided Packets:'+result.collided+'\nPDR ratio:'+(result.sent/result.receive));
            });
        });
    });
    })
});
window.addEventListener('beforeunload', function (e) {
    $.getJSON("https://api.ipify.org?format=json",function(data) {
        var ns2code = editor.getValue();
        var ipaddr = data.ip
        ipaddr = ipaddr.replace(/\./g,"");
        $.post("/deleteUser",{ipaddr:ipaddr},function(){
        });
    });
    e.preventDefault();
    e.returnValue = '';
});
