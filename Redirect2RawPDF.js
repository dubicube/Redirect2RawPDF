function checkForPDF() {
    var redirected = false;
    if (!redirected) {
        // When a website embeds a pdf reader, it appears that there is always a link to the raw pdf file
        // with the "iframe" tagname.
        // So, here we extract all elements with "ifrmae" as tagname,
        // and if one of these elements has a pdf link, we redirect to it.
        var iframeList = document.getElementsByTagName("iframe");
        for (const ifr of iframeList) {
            // If the iframe has a src attribute, and the src attribute is a PDF, then we have a PDF
            if (ifr.src != undefined && (ifr.src.indexOf(".pdf") != -1 || ifr.src.startsWith("https://docs.xilinx.com/api/khub/maps/"))) {
                // Do not redirect if we are already at the same URL
                if (window.location.href != ifr.src) {
                    // Redirect to raw pdf page
                    window.location = ifr.src
                }
                redirected = true;
                break;
            }
        }
    }
    // This part is to handle some special Xilinx pages.
    // I made this after discovering that the DS925 is no longer available in the standard pdf page format,
    // but only in the weird annoying web format like here:
    // https://docs.xilinx.com/r/en-US/ds925-zynq-ultrascale-plus
    // There are many reasons why I don't like this web interface, but the main one is that the document is not
    // completly loaded and you can't even search for words which are in parts that are not loaded............
    // Seriously, who thought it was a good idea ?
    // Anyway,
    // So, the idea of the code bellow is to detect such pages, click on the "PDF and attachments" button
    // to discover the pdf link, and then redirect to the pdf page.
    if (!redirected) {
        // Get the "PDF and attachments" button
        var button = document.getElementsByClassName("ft-btn fluid-aside-tab-id-mapattachments")[0];
        // If button exists
        if (button != undefined) {
            // Click the discovered button
            button.click();
            // Now that we released the "Downloadable PDF" button, we can extract the URL to the PDF page
            var pdfLink = document.getElementsByClassName("gwt-InlineHyperlink mapattachments-viewer-link")[0];
            // If url is successfully detected, redirect to it
            if (pdfLink != undefined && pdfLink.href != undefined) {
                window.location = pdfLink.href
                redirected = true;
            }
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
            break;
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
observer.observe(document, config);
