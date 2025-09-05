(function () {
    var loaderContainer;
    var isUnsupportedBrowser = !document.contentType;
    var unsupportedBrowserMessage = {
        title: 'This browser is not supported.',
        description: 'For the best experience, please use a different browser, such as Chrome, Firefox or Safari.',
    };

    if (isUnsupportedBrowser) {
        loaderContainer = document.getElementById('loader-container');
        loaderContainer.style.cssText = 'flex-direction: column; justify-content: center; align-items: center;';
        loaderContainer.innerHTML = (
            '<h1 style="font-size: 32px; color: #fff">' +
                unsupportedBrowserMessage.title +
            '</h1>' +
            '<p style="color: #fff">' +
                unsupportedBrowserMessage.description +
            '</p>'
        );
    }
})();
