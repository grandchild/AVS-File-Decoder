// highlighter
hljs.initHighlightingOnLoad();

// selection
function SelectText(element) {
    var doc = document;
    var text = doc.getElementById(element);
    if (doc.body.createTextRange) {
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select()
    } else {
        if (window.getSelection) {
            var selection = window.getSelection();
            var range = doc.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range)
        }
    }
};
$(function () {
    $("#output").click(function () {
        SelectText("output")
    })
});