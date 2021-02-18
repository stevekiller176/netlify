'use es6';

import { browserSupportsCors, getPortalId } from 'adsscriptloaderstatic/utils'; // makes the proper API call to fetch configs/access-control for the script

export function fetchConfig(_ref, callback, scriptName) {
  var jsonUrl = _ref.jsonUrl,
      jsonpUrl = _ref.jsonpUrl;

  if (!jsonUrl && !jsonpUrl) {
    throw new Error("Missing jsonUrl and jsonpUrl args");
  }

  if (browserSupportsCors()) {
    fetchConfigWithXHR(jsonUrl, callback);
  } else {
    fetchConfigWithScript(jsonpUrl, callback, scriptName);
  }
}

var resolveUrl = function resolveUrl(url) {
  return "https://" + url + "?portalId=" + getPortalId();
};

var fetchConfigWithXHR = function fetchConfigWithXHR(jsonUrl, callback) {
  var request = new XMLHttpRequest();
  request.addEventListener('load', function () {
    var config = JSON.parse(request.responseText);
    callback(config);
  });
  request.open("GET", resolveUrl(jsonUrl));
  request.send();
};

var getJsonpCallbackName = function getJsonpCallbackName(scriptName) {
  return "hubspotJsonpCallbackName" + scriptName;
};

var getJsonpUrl = function getJsonpUrl(jsonpUrl, jsonpCallbackName) {
  var params = ["portalId=" + getPortalId(), "callback=" + jsonpCallbackName].join("&");
  return "https://" + jsonpUrl + "?" + params;
};

var fetchConfigWithScript = function fetchConfigWithScript(jsonpUrl, callback, scriptName) {
  var script = document.createElement('script');
  var jsonpCallbackName = getJsonpCallbackName(scriptName);

  window[jsonpCallbackName] = function (config) {
    callback(config);
    document.body.removeChild(script);
    delete window[jsonpCallbackName];
  };

  script.src = getJsonpUrl(jsonpUrl, jsonpCallbackName);
  document.body.appendChild(script);
};