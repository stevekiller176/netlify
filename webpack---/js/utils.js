'use es6';

var DATA_ATTR_PORTAL_ID = "data-hsjs-portal";
var DATA_ATTR_ENV = "data-hsjs-env";
var DATA_ATTR_HUBLET = "data-hsjs-hublet";
var ENV = {
  PROD: "prod",
  QA: "qa"
};
export function getDataAttribute(attr) {
  var script = document.querySelectorAll("script[" + attr + "]");

  if (!script.length) {
    return null;
  }

  return script[0].getAttribute(attr);
}
export function getEnv() {
  return getDataAttribute(DATA_ATTR_ENV) || ENV.PROD;
}
export function getPortalId() {
  var portalId = getDataAttribute(DATA_ATTR_PORTAL_ID);
  portalId = parseInt(portalId, 10);

  if (!portalId) {
    throw new Error("HS Pixel Loader can't identify portalId via " + DATA_ATTR_PORTAL_ID);
  }

  return portalId;
}
export function getHublet() {
  return getDataAttribute(DATA_ATTR_HUBLET) || 'na1';
}
export function browserSupportsCors() {
  return 'withCredentials' in new XMLHttpRequest();
}