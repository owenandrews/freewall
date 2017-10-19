var manifest = chrome.runtime.getManifest();
var url = manifest.permissions[3];

/*
  * Intercept request before the headers are sent;
  * Loop through headers until the 'Referer' header is found;
  * Set referer value to 'https://www.google.com.au/';
  * Return modified headers and continue with request.
*/
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
  for (var i = 0; i < details.requestHeaders.length; ++i) {
    if (details.requestHeaders[i].name === 'Referer') {
      details.requestHeaders[i].value = 'https://www.google.com/';
      break;
    }
  }
  
  return { requestHeaders: details.requestHeaders };
}, {urls: ['<all_urls>']}, ['blocking', 'requestHeaders']);

/*
  * Once request has completed;
  * Get all the cookies associated with site;
  * Loop through cookies until desired cookie is found;
  * Remove cookie.
*/
chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.cookies.getAll({domain: url.replace(/^.*?:\/\//, '').replace('/', '')}, function(cookies) {
      for (var i=0; i < cookies.length; i++) {
        if (cookies[i].name === 'gr') {
          chrome.cookies.remove({url: url + cookies[i].path, name: cookies[i].name});
          break;
        }
      }
  });
}, {urls: ['<all_urls>']});