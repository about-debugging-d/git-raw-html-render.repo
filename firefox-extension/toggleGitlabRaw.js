const originInnerHTMLStr = document.body.innerHTML;
const originInnerText = document.body.innerText;
    // alert(`If you can see this message, the toggleGitlabRaw.js was exectued!`);

function toggleHtml(request, sender, sendRequest) {
    // alert(`If you can see this message, the toggleHtml in toggleGitlabRaw.js was exectued!`);
    document.body.innerHTML = request.isOrigin % 2 === 0 ? originInnerText : originInnerHTMLStr;
}

browser.runtime.onMessage.addListener(toggleHtml);