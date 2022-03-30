function checkForPDF()
{
    // Get all the links
    var iframeList = document.getElementsByTagName("iframe");
    for (const ifr of iframeList) {
        console.log(ifr.src);
        // If the iframe has a src attribute, and the src attribute is a PDF, then we have a PDF
        if (ifr.src != undefined && ifr.src.indexOf(".pdf") != -1) {
            // Redirect to raw pdf page
            window.location = (ifr.src)
            break;
        }
    }
}

// Call our magic function when extension is called
checkForPDF();

// However, the code above does not works for every sites.
// Some sites edit the DOM and add new elements (and the pdf page) AFTER the extension is called (Xilinx.com for example.....).
// So we need to observe the DOM and call again checkForPDF() when the DOM is modified.
// That is the purpose of the code below.

// Code bellow from this page: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Select the node that will be observed for mutations
const targetNode = document
// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Call our magic function
            checkForPDF();
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
observer.observe(document, config);