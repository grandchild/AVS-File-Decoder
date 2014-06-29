// highlighter
hljs.initHighlightingOnLoad();

// localStorage.getItem("last_preset");

// selection
function SelectText(element) {
    var doc = document;
    var text = doc.getElementById(element);
    var range = null;
    if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else {
        if (window.getSelection) {
            var selection = window.getSelection();
            range = doc.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}

$(function() {
    $("#output").click(function() {
        SelectText("output");
    });
});