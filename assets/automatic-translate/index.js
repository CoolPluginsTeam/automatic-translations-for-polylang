/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/dompurify/dist/purify.es.mjs":
/*!***************************************************!*\
  !*** ./node_modules/dompurify/dist/purify.es.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ purify)
/* harmony export */ });
/*! @license DOMPurify 3.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.0/LICENSE */

const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object; // eslint-disable-line import/no-mutable-exports
let {
  apply,
  construct
} = typeof Reflect !== 'undefined' && Reflect;
if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
 * Creates a new function that calls the given function with a specified thisArg and arguments.
 *
 * @param func - The function to be wrapped and called.
 * @returns A new function that calls the given function with a specified thisArg and arguments.
 */
function unapply(func) {
  return function (thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
/**
 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
 *
 * @param func - The constructor function to be wrapped and called.
 * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
 */
function unconstruct(Func) {
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
/**
 * Add properties to a lookup table
 *
 * @param set - The set to which elements will be added.
 * @param array - The array containing elements to be added to the set.
 * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
 * @returns The modified set with added elements.
 */
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === 'string') {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
/**
 * Clean up an array to harden against CSPP
 *
 * @param array - The array to be cleaned.
 * @returns The cleaned version of the array
 */
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
/**
 * Shallow clone an object
 *
 * @param object - The object to be cloned.
 * @returns A new object that copies the original.
 */
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
/**
 * This method automatically checks if the prop is function or getter and behaves accordingly.
 *
 * @param object - The object to look up the getter function in its prototype chain.
 * @param prop - The property name for which to find the getter function.
 * @returns The getter function found in the prototype chain or a fallback function.
 */
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}

const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'search', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);
const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'enterkeyhint', 'exportparts', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'inputmode', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'part', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);
// List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.
const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']);
// Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.
const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
const text = freeze(['#text']);

const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'exportparts', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inert', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'part', 'pattern', 'placeholder', 'playsinline', 'popover', 'popovertarget', 'popovertargetaction', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'wrap', 'xmlns', 'slot']);
const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'amplitude', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'exponent', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'mask-type', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'slope', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'tablevalues', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

// eslint-disable-next-line unicorn/better-regex
const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm); // eslint-disable-line unicorn/better-regex
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

var EXPRESSIONS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ARIA_ATTR: ARIA_ATTR,
  ATTR_WHITESPACE: ATTR_WHITESPACE,
  CUSTOM_ELEMENT: CUSTOM_ELEMENT,
  DATA_ATTR: DATA_ATTR,
  DOCTYPE_NAME: DOCTYPE_NAME,
  ERB_EXPR: ERB_EXPR,
  IS_ALLOWED_URI: IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR: MUSTACHE_EXPR,
  TMPLIT_EXPR: TMPLIT_EXPR
});

/* eslint-disable @typescript-eslint/indent */
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12 // Deprecated
};
const getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param trustedTypes The policy factory.
 * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
 * @return The policy created (or null, if Trusted Types
 * are not supported or creating the policy failed).
 */
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  }
  // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.
  let suffix = null;
  const ATTR_NAME = 'data-tt-policy-suffix';
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html) {
        return html;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};
const _createHooksMap = function _createHooksMap() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
  const DOMPurify = root => createDOMPurify(root);
  DOMPurify.version = '3.3.0';
  DOMPurify.removed = [];
  if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document
  } = window;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  const remove = lookupGetter(ElementPrototype, 'remove');
  const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
  // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.
  if (typeof HTMLTemplateElement === 'function') {
    const template = document.createElement('template');
    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = '';
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */
  DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
  const {
    MUSTACHE_EXPR,
    ERB_EXPR,
    TMPLIT_EXPR,
    DATA_ATTR,
    ARIA_ATTR,
    IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE,
    CUSTOM_ELEMENT
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */
  /* allowed element names */
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  /* Allowed attribute names */
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  /*
   * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
  let FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
  let FORBID_ATTR = null;
  /* Config object to store ADD_TAGS/ADD_ATTR functions (when used as functions) */
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  /* Decide if ARIA attributes are okay */
  let ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */
  let ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Decide if self-closing tags in attributes are allowed.
   * Usually removed due to a mXSS issue in jQuery 3.0 */
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */
  let SAFE_FOR_TEMPLATES = false;
  /* Output should be safe even for XML used within HTML and alike.
   * This means, DOMPurify removes comments when containing risky content.
   */
  let SAFE_FOR_XML = true;
  /* Decide if document with <html>... should be returned */
  let WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */
  let SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */
  let FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */
  let RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */
  let RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */
  let RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks?
   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
   */
  let SANITIZE_DOM = true;
  /* Achieve full DOM Clobbering protection by isolating the namespace of named
   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
   *
   * HTML/DOM spec rules that enable DOM Clobbering:
   *   - Named Access on Window (§7.3.3)
   *   - DOM Tree Accessors (§3.1.5)
   *   - Form Element Parent-Child Relations (§4.10.3)
   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
   *   - HTMLCollection (§4.2.10.2)
   *
   * Namespace isolation is implemented by prefixing `id` and `name` attributes
   * with a constant string, i.e., `user-content-`
   */
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
  /* Keep element content when removing element? */
  let KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */
  let IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */
  let USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
  /* Tags that are safe for data: URIs */
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
  const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  /* Allowed XHTML+XML namespaces */
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
  // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Parsing of strict XHTML documents */
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  let transformCaseFunc = null;
  /* Keep a reference to config to pass to hooks */
  let CONFIG = null;
  /* Ideally, do not touch anything below this line */
  /* ______________________________________________ */
  const formElement = document.createElement('form');
  const isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param cfg optional config literal
   */
  // eslint-disable-next-line complexity
  const _parseConfig = function _parseConfig() {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */
    if (!cfg || typeof cfg !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE =
    // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
    /* Set configuration parameters */
    ALLOWED_TAGS = objectHasOwnProperty(cfg, 'ALLOWED_TAGS') ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, 'ALLOWED_ATTR') ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, 'FORBID_CONTENTS') ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, 'FORBID_TAGS') ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, 'FORBID_ATTR') ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES') ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
    RETURN_DOM = cfg.RETURN_DOM || false; // Default false
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
    FORCE_BODY = cfg.FORCE_BODY || false; // Default false
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
    IN_PLACE = cfg.IN_PLACE || false; // Default false
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Merge configuration parameters */
    if (cfg.ADD_TAGS) {
      if (typeof cfg.ADD_TAGS === 'function') {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (cfg.ADD_ATTR) {
      if (typeof cfg.ADD_ATTR === 'function') {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    /* Add #text in case KEEP_CONTENT is set to true */
    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      // Overwrite existing TrustedTypes policy.
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      // Sign local variables required by `sanitize`.
      emptyHTML = trustedTypesPolicy.createHTML('');
    } else {
      // Uninitialized policy, attempt to initialize the internal dompurify policy.
      if (trustedTypesPolicy === undefined) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      // If creating the internal policy succeeded sign internal variables.
      if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
        emptyHTML = trustedTypesPolicy.createHTML('');
      }
    }
    // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  /**
   * @param element a DOM element whose namespace is being checked
   * @returns Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */
  const _checkValidNamespace = function _checkValidNamespace(element) {
    let parent = getParentNode(element);
    // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: 'template'
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      }
      // The only way to switch from MathML to SVG is via`
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      }
      // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      }
      // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    // For XHTML and XML documents that support custom namespaces
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
    // Return false just in case.
    return false;
  };
  /**
   * _forceRemove
   *
   * @param node a DOM node
   */
  const _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  /**
   * _removeAttribute
   *
   * @param name an Attribute name
   * @param element a DOM node
   */
  const _removeAttribute = function _removeAttribute(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    // We void attribute values for unremovable "is" attributes
    if (name === 'is') {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {}
      } else {
        try {
          element.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param dirty - a string of dirty markup
   * @return a DOM, filled with the dirty markup
   */
  const _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
        // Syntax error if dirtyPayload is invalid xml
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   *
   * @param root The root element or node to start traversing on.
   * @return The created NodeIterator
   */
  const _createNodeIterator = function _createNodeIterator(root) {
    return createNodeIterator.call(root.ownerDocument || root, root,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
  };
  /**
   * _isClobbered
   *
   * @param element element to check for clobbering attacks
   * @return true if clobbered, false if safe
   */
  const _isClobbered = function _isClobbered(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== 'string' || typeof element.textContent !== 'string' || typeof element.removeChild !== 'function' || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== 'function' || typeof element.setAttribute !== 'function' || typeof element.namespaceURI !== 'string' || typeof element.insertBefore !== 'function' || typeof element.hasChildNodes !== 'function');
  };
  /**
   * Checks whether the given object is a DOM node.
   *
   * @param value object to check whether it's a DOM node
   * @return true is object is a DOM node
   */
  const _isNode = function _isNode(value) {
    return typeof Node === 'function' && value instanceof Node;
  };
  function _executeHooks(hooks, currentNode, data) {
    arrayForEach(hooks, hook => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   * @param currentNode to check for permission to exist
   * @return true if node was killed, false if left alive
   */
  const _sanitizeElements = function _sanitizeElements(currentNode) {
    let content = null;
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    /* Check if element is clobbered or can clobber */
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Now let's check the element's type and name */
    const tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any occurrence of processing instructions */
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any kind of possibly harmful comments */
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove element if anything forbids its presence */
    if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      /* Keep content except for bad-listed elements */
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    /* Check whether element has a valid namespace */
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Make sure that older browsers don't get fallback-tag mXSS */
    if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Sanitize element content to be template-safe */
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      /* Get the element's text content */
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        content = stringReplace(content, expr, ' ');
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param lcTag Lowercase tag name of containing element.
   * @param lcName Lowercase attribute name.
   * @param value Attribute value.
   * @return Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity
  const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
      // First condition does a very basic check if a) it's basically a valid custom element tagname AND
      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
      _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) ||
      // Alternative, second condition checks if it's an `is`-attribute, AND
      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
      return false;
    } else ;
    return true;
  };
  /**
   * _isBasicCustomElement
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   *
   * @param tagName name of the tag of the node to sanitize
   * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
   */
  const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
    return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT);
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param currentNode to sanitize
   */
  const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    /* Check if we have attributes; if not we might have a text node */
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: undefined
    };
    let l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === 'value' ? initValue : stringTrim(initValue);
      /* Execute a hook if present */
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      /* Full DOM Clobbering protection via namespace isolation,
       * Prefix id and name attributes with `user-content-`
       */
      if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
        // Remove the attribute with this value
        _removeAttribute(name, currentNode);
        // Prefix the value and later re-create the attribute with the sanitized value
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      /* Work around a security issue with comments inside attributes */
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Make sure we cannot easily use animated hrefs, even if animations are allowed */
      if (lcName === 'attributename' && stringMatch(value, 'href')) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Sanitize attribute content to be template-safe */
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          value = stringReplace(value, expr, ' ');
        });
      }
      /* Is `value` valid for this attribute? */
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Handle attributes that require Trusted Types */
      if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
        if (namespaceURI) ; else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case 'TrustedHTML':
              {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
            case 'TrustedScriptURL':
              {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
          }
        }
      }
      /* Handle invalid data-* attribute set by try-catching it */
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param fragment to iterate over recursively
   */
  const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      /* Execute a hook if present */
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      /* Sanitize tags and elements */
      _sanitizeElements(shadowNode);
      /* Check attributes next */
      _sanitizeAttributes(shadowNode);
      /* Deep shadow DOM detected */
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(shadowNode.content);
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  // eslint-disable-next-line complexity
  DOMPurify.sanitize = function (dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */
    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      if (typeof dirty.toString === 'function') {
        dirty = dirty.toString();
        if (typeof dirty !== 'string') {
          throw typeErrorCreate('dirty is not a string, aborting');
        }
      } else {
        throw typeErrorCreate('toString is not a function');
      }
    }
    /* Return dirty HTML if DOMPurify cannot run */
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    /* Assign config vars */
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */
    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */
    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes */
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
    } else if (dirty instanceof Node) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
    } else {
      /* Exit directly if we have nothing to do */
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
      // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf('<') === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */
      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */
    while (currentNode = nodeIterator.nextNode()) {
      /* Sanitize tags and elements */
      _sanitizeElements(currentNode);
      /* Check attributes next */
      _sanitizeAttributes(currentNode);
      /* Shadow DOM detected, sanitize it */
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    /* If we sanitized `dirty` in-place, return it. */
    if (IN_PLACE) {
      return dirty;
    }
    /* Return sanitized string or DOM */
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */
    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        serializedHTML = stringReplace(serializedHTML, expr, ' ');
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function () {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function (entryPoint, hookFunction) {
    if (hookFunction !== undefined) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function (entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function () {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();


//# sourceMappingURL=purify.es.mjs.map


/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./src/automatic-translate/allowed-meta-fields.js":
/*!********************************************************!*\
  !*** ./src/automatic-translate/allowed-meta-fields.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const AllowedMetaFields = {
  '_yoast_wpseo_title': {
    type: 'string'
  },
  '_yoast_wpseo_focuskw': {
    type: 'string'
  },
  '_yoast_wpseo_metadesc': {
    type: 'string'
  },
  '_yoast_wpseo_bctitle': {
    type: 'string'
  },
  '_yoast_wpseo_opengraph-title': {
    type: 'string'
  },
  '_yoast_wpseo_opengraph-description': {
    type: 'string'
  },
  '_yoast_wpseo_twitter-title': {
    type: 'string'
  },
  '_yoast_wpseo_twitter-description': {
    type: 'string'
  },
  'rank_math_title': {
    type: 'string'
  },
  'rank_math_description': {
    type: 'string'
  },
  'rank_math_focus_keyword': {
    type: 'string'
  },
  'rank_math_facebook_title': {
    type: 'string'
  },
  'rank_math_facebook_description': {
    type: 'string'
  },
  'rank_math_twitter_title': {
    type: 'string'
  },
  'rank_math_twitter_description': {
    type: 'string'
  },
  'rank_math_breadcrumb_title': {
    type: 'string'
  },
  '_seopress_titles_title': {
    type: 'string'
  },
  '_seopress_titles_desc': {
    type: 'string'
  },
  '_seopress_social_fb_title': {
    type: 'string'
  },
  '_seopress_social_fb_desc': {
    type: 'string'
  },
  '_seopress_social_twitter_title': {
    type: 'string'
  },
  '_seopress_social_twitter_desc': {
    type: 'string'
  },
  '_seopress_analysis_target_kw': {
    type: 'string'
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AllowedMetaFields);

/***/ }),

/***/ "./src/automatic-translate/component/copy-clipboard/index.js":
/*!*******************************************************************!*\
  !*** ./src/automatic-translate/component/copy-clipboard/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const CopyClipboard = async ({
  text = false,
  startCopyStatus = () => {},
  endCopyStatus = () => {}
}) => {
  if (!text || text === "") return;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback method if Clipboard API is not supported
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      if (document.execCommand) {
        document.execCommand('copy');
      }
      document.body.removeChild(textArea);
    }
    startCopyStatus();
    setTimeout(() => endCopyStatus(), 800); // Reset to "Copy" after 2 seconds
  } catch (err) {
    console.error('Error copying text to clipboard:', err);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CopyClipboard);

/***/ }),

/***/ "./src/automatic-translate/component/error-modal-box/index.js":
/*!********************************************************************!*\
  !*** ./src/automatic-translate/component/error-modal-box/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _copy_clipboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../copy-clipboard */ "./src/automatic-translate/component/copy-clipboard/index.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dompurify */ "./node_modules/dompurify/dist/purify.es.mjs");



const ErrorModalBox = ({
  message,
  onClose,
  Title
}) => {
  let dummyElement = jQuery('<div>').append(message);
  const stringifiedMessage = dummyElement.html();
  dummyElement.remove();
  dummyElement = null;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags');
    if (clipboardElements.length > 0) {
      clipboardElements.forEach(element => {
        element.classList.add('atfp-tooltip-element');
        element.addEventListener('click', e => {
          e.preventDefault();
          const toolTipExists = element.querySelector('.atfp-tooltip');
          if (toolTipExists) {
            return;
          }
          let toolTipElement = document.createElement('span');
          toolTipElement.textContent = "Text to be copied.";
          toolTipElement.className = 'atfp-tooltip';
          element.appendChild(toolTipElement);
          (0,_copy_clipboard__WEBPACK_IMPORTED_MODULE_0__["default"])({
            text: element.getAttribute('data-clipboard-text'),
            startCopyStatus: () => {
              toolTipElement.classList.add('atfp-tooltip-active');
            },
            endCopyStatus: () => {
              setTimeout(() => {
                toolTipElement.remove();
              }, 800);
            }
          });
        });
      });
      return () => {
        clipboardElements.forEach(element => {
          element.removeEventListener('click', () => {});
        });
      };
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "atfp-error-modal-box-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-error-modal-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-error-modal-box-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "atfp-error-modal-box-close",
    onClick: onClose
  }, "\xD7"), Title && /*#__PURE__*/React.createElement("h3", null, Title)), /*#__PURE__*/React.createElement("div", {
    className: "atfp-error-modal-box-body"
  }, /*#__PURE__*/React.createElement("p", {
    dangerouslySetInnerHTML: {
      __html: dompurify__WEBPACK_IMPORTED_MODULE_2__["default"].sanitize(stringifiedMessage)
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "atfp-error-modal-box-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "atfp-error-modal-box-close button button-primary",
    onClick: onClose
  }, "Close"))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorModalBox);

/***/ }),

/***/ "./src/automatic-translate/component/filter-nested-attr/index.js":
/*!***********************************************************************!*\
  !*** ./src/automatic-translate/component/filter-nested-attr/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const FilterBlockNestedAttr = (idsArr, attrObj, blockAttr, callBack) => {
  /**
   * Iterates over the keys of the filter object and calls saveTranslatedAttr for each key.
   * 
   * @param {Array} idArr - The array of IDs.
   * @param {Object} filterObj - The filter object to iterate over.
   */
  const childAttr = (idArr, filterObj) => {
    Object.keys(filterObj).map(key => {
      let filterObjType = filterObj;
      filterObjType = filterObjType[key];
      const newIdArr = new Array(...idArr, key);
      callBack(newIdArr, filterObjType);
    });
  };

  /**
   * Handles the attributes that are arrays and objects by recursively calling saveTranslatedAttr.
   * 
   * @param {Array} idArr - The array of IDs.
   * @param {Array} attrFilter - The filter attribute array.
   */
  const childAttrArray = (idArr, attrFilter) => {
    const newIdArr = new Array(...idArr);
    let dynamicBlockAttr = blockAttr;
    newIdArr.forEach(key => {
      dynamicBlockAttr = dynamicBlockAttr[key];
    });
    if ([null, undefined].includes(dynamicBlockAttr)) {
      return;
    }
    if (Object.getPrototypeOf(dynamicBlockAttr) === Object.prototype) {
      childAttr(idArr, attrFilter[0]);
      return;
    }
    if (Object.getPrototypeOf(dynamicBlockAttr) === Array.prototype) {
      dynamicBlockAttr.forEach((_, index) => {
        const nestedId = new Array();
        newIdArr.forEach(key => {
          nestedId.push(key);
        });
        nestedId.push(index);
        callBack(nestedId, attrFilter[0]);
      });
    }
    if (typeof dynamicBlockAttr === 'object') {
      childAttr(idArr, attrFilter[0]);
      return;
    }
  };
  const typeCheck = () => {
    if (Object.getPrototypeOf(attrObj) === Array.prototype) {
      childAttrArray(idsArr, attrObj);
    } else if (Object.getPrototypeOf(attrObj) === Object.prototype) {
      childAttr(idsArr, attrObj);
    }
  };
  typeCheck();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterBlockNestedAttr);

/***/ }),

/***/ "./src/automatic-translate/component/filter-target-content/index.js":
/*!**************************************************************************!*\
  !*** ./src/automatic-translate/component/filter-target-content/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const FilterTargetContent = props => {
  const skipTags = props.skipTags || [];
  const OpenSpanPlaceholder = '#atfp_open_translate_span#';
  const CloseSpanPlaceholder = '#atfp_close_translate_span#';
  const OpenTempTagPlaceholder = '#atfp_temp_tag_open#';
  const CloseTempTagPlaceholder = '#atfp_temp_tag_close#';
  const LessThanSymbol = '#atfp_less_then_symbol#';
  const GreaterThanSymbol = '#atfp_greater_then_symbol#';
  const entityOpenPlaceholder = '#atfp_entity_open_translate_span#';
  const entityClosePlaceholder = '#atfp_entity_close_translate_span#';
  const removeInnerSpanPlaceholder = content => {
    return content.replace(new RegExp(OpenSpanPlaceholder, 'g'), '').replace(new RegExp(CloseSpanPlaceholder, 'g'), '');
  };
  const setEntityPlaceholder = content => {
    const entityRegex = /&([a-zA-Z0-9#x]+);/g;
    return content.replace(entityRegex, match => `${entityOpenPlaceholder}${match.replace(/&/g, '').replace(/;/g, '')}${entityClosePlaceholder}`);
  };
  const removeEntityPlaceholder = content => {
    return content.replace(new RegExp(entityOpenPlaceholder, 'g'), '&').replace(new RegExp(entityClosePlaceholder, 'g'), ';');
  };
  const fixHtmlTags = content => {
    if (typeof content !== 'string' || !content.trim()) return content;
    const tagRegex = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
    const stack = [];
    let result = '';
    let lastIndex = 0;
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
      const [fullMatch, tagName] = match;
      const isClosingTag = fullMatch.startsWith('</');
      const currentIndex = match.index;

      // Append content before this tag
      if (currentIndex > lastIndex) {
        result += content.slice(lastIndex, currentIndex);
      }
      if (!isClosingTag) {
        // Opening tag: push to stack
        stack.push({
          tag: tagName
        });
        result += fullMatch;
      } else {
        // Closing tag
        const openIndex = stack.findIndex(t => t.tag === tagName);
        if (openIndex !== -1) {
          // Match found: remove opening from stack
          stack.splice(openIndex, 1);
          result += fullMatch;
        } else {
          // No opening tag: insert missing opening tag before closing
          result += `${OpenTempTagPlaceholder}<${tagName}>${CloseTempTagPlaceholder}` + fullMatch;
        }
      }
      lastIndex = tagRegex.lastIndex;
    }

    // Append any remaining content after last tag
    if (lastIndex < content.length) {
      result += content.slice(lastIndex);
    }

    // Add missing closing tags at the end
    for (let i = stack.length - 1; i >= 0; i--) {
      const {
        tag
      } = stack[i];
      result += `${OpenTempTagPlaceholder}</${tag}>${CloseTempTagPlaceholder}`;
    }

    // Clear references to free memory (optional in GC-based engines, but helpful)
    match = null;
    stack.length = 0;
    content = null;
    return result;
  };

  /**
   * Wraps the first element and its matching closing tag with translation spans.
   * If no elements are found, returns the original HTML.
   * @param {string} html - The HTML string to process.
   * @returns {string} The modified HTML string with wrapped translation spans.
   */
  const wrapFirstAndMatchingClosingTag = html => {
    // Create a temporary element to parse the HTML string
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    // Get the first element
    const firstElement = tempElement.firstElementChild;
    if (!firstElement) {
      return html; // If no elements, return the original HTML
    }
    let childNodes = firstElement.childNodes;
    let childNodesLength = childNodes.length;
    if (childNodesLength > 0) {
      // Sort so that nodeType 3 (Text nodes) come first
      childNodes = Array.from(childNodes).sort((a, b) => a.nodeType === 3 ? -1 : b.nodeType === 3 ? 1 : 0);
      for (let i = 0; i < childNodesLength; i++) {
        let element = childNodes[i];
        if (element.nodeType === 3) {
          let textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, match => `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(match)}${CloseSpanPlaceholder}`);
          element.textContent = textContent;
        } else if (element.nodeType === 8) {
          // let textContent = `<!--${element.textContent}-->`;
          element.textContent = element.textContent;
        } else {
          let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
          element.outerHTML = filterContent;
        }
      }
    }

    // Get the opening tag of the first element
    // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
    let firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
    const pattern = new RegExp(`${OpenSpanPlaceholder}|${CloseSpanPlaceholder}`, 'g');
    firstElementOpeningTag = firstElementOpeningTag.replace(pattern, '');

    // Check if the first element has a corresponding closing tag
    const openTagName = firstElement.tagName.toLowerCase();
    const closingTagName = new RegExp(`<\/${openTagName}>`, 'i');

    // Check if the inner HTML contains the corresponding closing tag
    const closingTagMatch = firstElement.outerHTML.match(closingTagName);

    // Wrap the style element
    if (firstElementOpeningTag === '<style>') {
      let wrappedFirstTag = `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(firstElement.outerHTML)}${CloseSpanPlaceholder}`;
      return wrappedFirstTag;
    }
    let firstElementHtml = firstElement.innerHTML;
    firstElementHtml = firstElementHtml.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, match => `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(match)}${CloseSpanPlaceholder}`);
    firstElement.innerHTML = '';
    let closeTag = '';
    let openTag = '';
    let filterContent = '';
    openTag = `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(firstElementOpeningTag)}${CloseSpanPlaceholder}`;
    if (closingTagMatch) {
      closeTag = `${OpenSpanPlaceholder}</${openTagName}>${CloseSpanPlaceholder}`;
    }
    if (skipTags.includes(openTagName)) {
      // Remove the custom span markers from the HTML if the tag is in skipTags
      const pattern = new RegExp(`${OpenSpanPlaceholder}|${CloseSpanPlaceholder}`, 'g');
      firstElementHtml = firstElementHtml.replace(pattern, '');
      firstElementHtml = `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(firstElementHtml)}${CloseSpanPlaceholder}`;
    }
    if ('' !== firstElementHtml) {
      if ('' !== openTag) {
        filterContent = openTag + firstElementHtml;
      }
      if ('' !== closeTag) {
        filterContent += closeTag;
      }
    } else {
      filterContent = openTag + closeTag;
    }
    firstElement.outerHTML = filterContent;

    // Return the modified HTML
    return tempElement.innerHTML;
  };

  /**
   * Splits the content string based on a specific pattern.
   * @param {string} string - The content string to split.
   * @returns {Array} An array of strings after splitting based on the pattern.
   */
  const splitContent = string => {
    const pattern = new RegExp(`(${OpenSpanPlaceholder}[\\s\\S]*?${CloseSpanPlaceholder})|'`);
    const matches = string.split(pattern).filter(Boolean);

    // Remove empty strings from the result
    const output = matches.filter(match => match.trim() !== '');
    return output;
  };

  /**
   * Filters the SEO content.
   * @param {string} content - The SEO content to filter.
   * @returns {string} The filtered SEO content.
   */
  const filterSeoContent = content => {
    const regex = /(%{1,2}[a-zA-Z0-9_]+%{0,2})/g;

    // Replace placeholders with wrapped spans
    const output = content.replace(regex, match => {
      return `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(match)}${CloseSpanPlaceholder}`;
    });
    return output;
  };

  /**
   * Checks if the HTML is empty or has an unclosed tag.
   * @param {string} html - The HTML string to check.
   * @returns {boolean} True if the HTML is empty or has an unclosed tag, false otherwise.
   */
  const isEmptyOrUnclosedTag = html => {
    // Clean up whitespace
    html = html.trim();

    // Regex that matches:
    // 1️⃣ Single open tag only (<div>, <table>, <span class="x">, etc.)
    // 2️⃣ Empty tag (<div></div>, <table></table>, etc.)
    // 3️⃣ Ignores self-closing tags like <img />, <br />, etc.
    const regex = /^<([a-z][a-z0-9]*)\b[^>]*>(\s*(?:<!--.*?-->\s*)*<\/\1>)?$/i;

    // Test and return true/false
    return regex.test(html);
  };

  /**
   * Synchronizes the TR and TD tags from the first string to the second string.
   * @param {string} str1 - The first string to synchronize.
   * @param {string} str2 - The second string to synchronize.
   * @returns {string} The synchronized string.
   */
  const syncTRTDFromFirstToSecond = (str1, str2) => {
    str1 = str1.trim();

    // 1️⃣ Check if first string has any tr or td
    if (!/<\/?(tr|td)\b[^>]*>/i.test(str1)) {
      return str2; // no tr/td → skip
    }

    // 2️⃣ Skip if second string already contains tr or td
    if (/<\/?(tr|td)\b[^>]*>/i.test(str2)) {
      return str2;
    }
    str2 = str2.trim();

    // 3️⃣ Extract tags (if present)
    const startTagMatch = str1.match(/^<(tr|td)\b[^>]*>/i); // opening tag at start
    const endTagMatch = str1.match(/<\/(tr|td)>\s*$/i); // closing tag at end

    // 4️⃣ Build new string using only what exists
    let newString = str2;
    if (startTagMatch) {
      newString = `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(startTagMatch[0])}${CloseSpanPlaceholder}` + newString;
    }
    if (endTagMatch) {
      newString = newString + `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(endTagMatch[0])}${CloseSpanPlaceholder}`;
    }
    return newString;
  };

  /**
   * Replaces the inner text of HTML elements with span elements for translation.
   * @param {string} string - The HTML content string to process.
   * @returns {Array} An array of strings after splitting based on the pattern.
   */
  const filterSourceData = string => {
    const isSeoContent = /^(_yoast_wpseo_|rank_math_|_seopress_)/.test(props.contentKey.trim());
    if (isSeoContent) {
      string = filterSeoContent(string);
    }

    // Filter shortcode content
    const shortcodePattern = /\[(.*?)\]/g;
    const shortcodeMatches = typeof string === 'string' ? string.match(shortcodePattern) : false;
    if (shortcodeMatches) {
      string = string.replace(shortcodePattern, match => `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(match)}${CloseSpanPlaceholder}`);
    }
    function replaceInnerTextWithSpan(doc) {
      let childElements = doc.childNodes;
      const childElementsReplace = index => {
        if (childElements.length > index) {
          let element = childElements[index];
          let textNode = null;
          if (element.nodeType === 3) {
            const textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, match => `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(match)}${CloseSpanPlaceholder}`);
            textNode = document.createTextNode(textContent);
          } else if (element.nodeType === 8) {
            textNode = document.createTextNode(`${OpenSpanPlaceholder}${LessThanSymbol}!--${removeInnerSpanPlaceholder(element.textContent)}--${GreaterThanSymbol}${CloseSpanPlaceholder}`);
          } else if (element.nodeType === 1) {
            const childNodes = element.childNodes;
            const trimmed = element.outerHTML.trim();

            // Match the outer opening tag dynamically
            const match = trimmed.match(/^<([a-zA-Z0-9]+)(\s[^>]*)?>/i);
            if (!match) return trimmed; // no valid HTML tag found

            const tagName = match[1];
            const attrs = match[2] || "";
            const hasClosingTag = new RegExp(`<\\/${tagName}>\\s*$`, "i").test(trimmed);
            if (childNodes.length > 0) {
              replaceInnerTextWithSpan(element);
            }
            let filterHtml = `${OpenSpanPlaceholder}${LessThanSymbol}${tagName}${removeInnerSpanPlaceholder(attrs)}${GreaterThanSymbol}${CloseSpanPlaceholder}${setEntityPlaceholder(element.innerHTML)}`;
            if (hasClosingTag) {
              filterHtml += `${OpenSpanPlaceholder}${LessThanSymbol}/${tagName}${GreaterThanSymbol}${CloseSpanPlaceholder}`;
            }
            textNode = document.createTextNode(filterHtml);
          } else {
            let filterHtml = element.outerHTML;
            filterHtml = filterHtml.replace(/<!--([\s\S]*?)-->/g, (match, inner) => `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(match)}${CloseSpanPlaceholder}`);
            let filterContent = wrapFirstAndMatchingClosingTag(filterHtml);
            textNode = document.createTextNode(filterContent);
          }
          element.replaceWith(textNode);
          index++;
          childElementsReplace(index);
        }
      };
      childElementsReplace(0);
      return doc;
    }
    let content = string;
    if (isEmptyOrUnclosedTag(string)) {
      content = string.replace(/<([a-z][a-z0-9]*)\b[^>]*>(\s*(?:<!--.*?-->\s*)*<\/\1>)?/gi, match => `${OpenSpanPlaceholder}${removeInnerSpanPlaceholder(match)}${CloseSpanPlaceholder}`);
    } else {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = fixHtmlTags(string);
      replaceInnerTextWithSpan(tempElement);
      content = tempElement.innerText;
      content = content.replace(new RegExp(LessThanSymbol, 'g'), '<').replace(new RegExp(GreaterThanSymbol, 'g'), '>');
      content = syncTRTDFromFirstToSecond(string, content);
    }

    // remoove all the ${OpenTempTagPlaceholder} and ${CloseTempTagPlaceholder}
    const tempTagPattern = new RegExp(`${OpenTempTagPlaceholder}([\\s\\S]*?)(${CloseTempTagPlaceholder})`, 'g');
    content = content.replace(tempTagPattern, '');
    content = removeEntityPlaceholder(content);
    return splitContent(content);
  };

  /**
   * The content to be filtered based on the service type.
   * If the service is 'yandex', 'localAiTranslator', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
   */
  const content = ['yandex', 'localAiTranslator'].includes(props.service) ? filterSourceData(props.content) : props.content;

  /**
   * Regular expression pattern to match the span elements that should not be translated.
   */
  const notTranslatePattern = new RegExp(`${OpenSpanPlaceholder}[\\s\\S]*?${CloseSpanPlaceholder}`);

  /**
   * Regular expression pattern to replace the placeholder span elements.
   */
  const replacePlaceholderPattern = new RegExp(`${OpenSpanPlaceholder}|${CloseSpanPlaceholder}`, 'g');
  const filterContent = content => {
    const updatedContent = content.replace(replacePlaceholderPattern, '');
    return updatedContent;
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, ['yandex', 'localAiTranslator', 'google'].includes(props.service) ? content.map((data, index) => {
    const notTranslate = notTranslatePattern.test(data);
    if (notTranslate) {
      return /*#__PURE__*/React.createElement("span", {
        key: index,
        className: "notranslate atfp-notraslate-tag",
        translate: "no"
      }, filterContent(data));
    } else {
      return data;
    }
  }) : content);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterTargetContent);

/***/ }),

/***/ "./src/automatic-translate/component/format-number-count/index.js":
/*!************************************************************************!*\
  !*** ./src/automatic-translate/component/format-number-count/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const FormatNumberCount = ({
  number
}) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormatNumberCount);

/***/ }),

/***/ "./src/automatic-translate/component/notice/index.js":
/*!***********************************************************!*\
  !*** ./src/automatic-translate/component/notice/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const Notice = props => {
  const updateNoticeWrapperHeight = () => {
    const parentNoticeWrapper = document.querySelector('.atfp-body-notice-wrapper');
    if (parentNoticeWrapper) {
      const height = parentNoticeWrapper.offsetHeight + parentNoticeWrapper.offsetTop;
      parentNoticeWrapper.closest('.modal-body').style.setProperty('--atfp-notice-wrapper-height', `${height}px`);
    }
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (props.lastNotice) {
      updateNoticeWrapperHeight();
      window.addEventListener('resize', updateNoticeWrapperHeight);
    }
    return () => {
      window.removeEventListener('resize', updateNoticeWrapperHeight);
    };
  }, [props.lastNotice]);
  return /*#__PURE__*/React.createElement("div", {
    className: props.className
  }, props.children);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Notice);

/***/ }),

/***/ "./src/automatic-translate/component/pro-version-notice/index.js":
/*!***********************************************************************!*\
  !*** ./src/automatic-translate/component/pro-version-notice/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _format_number_count__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../format-number-count */ "./src/automatic-translate/component/format-number-count/index.js");


const ProVersionNotice = ({
  characterCount = 0,
  url = ''
}) => {
  const [showNotice, setShowNotice] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [activeClass, setActiveClass] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  if (url !== '') {
    url = url + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup';
  }
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const translateButton = document.querySelector('button.atfp-translate-button[name="atfp_meta_box_translate"],input#atfp-translate-button[name="atfp_meta_box_translate"]');
    if (!translateButton) {
      return;
    }
    translateButton.addEventListener('click', () => {
      setShowNotice(true);
      setActiveClass(true);
    });
    return () => {
      translateButton.removeEventListener('click', () => {});
    };
  }, []);
  return showNotice ? /*#__PURE__*/React.createElement("div", {
    id: "atfp-pro-notice-wrapper",
    className: `${activeClass ? 'atfp-active' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-pro-notice"
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-notice-header"
  }, /*#__PURE__*/React.createElement("h2", null, "AutoPoly - AI Translation For Polylang"), /*#__PURE__*/React.createElement("span", {
    className: "atfp-close-button",
    onClick: () => setShowNotice(false),
    "aria-label": "Close Notice"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "atfp-notice-content"
  }, /*#__PURE__*/React.createElement("p", null, "You have reached the character limit of ", /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(_format_number_count__WEBPACK_IMPORTED_MODULE_1__["default"], {
    number: characterCount
  })), " for your translations. To continue translating beyond this limit, please consider upgrading to ", /*#__PURE__*/React.createElement("strong", null, "AutoPoly - AI Translation For Polylang Pro"), ".")), /*#__PURE__*/React.createElement("div", {
    className: "atfp-notice-footer"
  }, /*#__PURE__*/React.createElement("a", {
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "atfp-upgrade-button"
  }, "Upgrade to Pro")))) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProVersionNotice);

/***/ }),

/***/ "./src/automatic-translate/component/progress-bar/index.js":
/*!*****************************************************************!*\
  !*** ./src/automatic-translate/component/progress-bar/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Adds a progress bar to the container.
 * 
 * @param {HTMLElement} container - The container element for translation.
 */
const AddProgressBar = provider => {
  const progressBarSelector = "#atfp_strings_model .atfp_translate_progress";
  if (!document.querySelector(`#atfp-${provider}-progress-bar`)) {
    const progressBar = jQuery(`
            <div id="atfp-${provider}-progress-bar" class="atfp-translate-progress-bar">
                <div class="${provider}-translator_progress_bar" style="background-color: #f3f3f3;border-radius: 10px;overflow: hidden;margin: 1.5rem auto; width: 50%;">
                <div class="${provider}-translator_progress" style="overflow: hidden;transition: width .2s ease-in-out; border-radius: 10px;text-align: center;width: 0%;height: 20px;box-sizing: border-box;background-color: #4caf50; color: #fff; font-weight: 600;"></div>
                </div>
                <div style="display:none; color: white;" class="${provider}-translator-strings-count hidden">
                    Wahooo! You have saved your valuable time via auto translating 
                    <strong class="totalChars"></strong> characters using 
                    <strong>
                        ${provider} Translator
                    </strong>
                </div>
            </div>
        `);
    jQuery(progressBarSelector).append(progressBar); // Append the progress bar to the specified selector
  } else {
    jQuery(`.${provider}-translator_progress`).css('width', '0%');
    jQuery(`.${provider}-translator-strings-count`).hide();
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddProgressBar);

/***/ }),

/***/ "./src/automatic-translate/component/progress-bar/show-string-count.js":
/*!*****************************************************************************!*\
  !*** ./src/automatic-translate/component/progress-bar/show-string-count.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _format_number_count__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../format-number-count */ "./src/automatic-translate/component/format-number-count/index.js");


const ShowStringCount = (provider, status = 'none', characterCount = false) => {
  if (false === characterCount) {
    characterCount = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslationInfo().sourceCharacterCount;
  }
  const stringCount = document.querySelector(`.${provider}-translator-strings-count`);
  if (stringCount) {
    stringCount.style.display = status;
    stringCount.querySelector('.totalChars').textContent = (0,_format_number_count__WEBPACK_IMPORTED_MODULE_1__["default"])({
      number: characterCount
    });
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShowStringCount);

/***/ }),

/***/ "./src/automatic-translate/component/store-time-taken/index.js":
/*!*********************************************************************!*\
  !*** ./src/automatic-translate/component/store-time-taken/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const StoreTimeTaken = ({
  prefix = false,
  start = false,
  end = false,
  translateStatus = false
}) => {
  const timeTaken = (end - start) / 1000; // Convert milliseconds to seconds
  const data = {};
  if (prefix) {
    data.provider = prefix;
    if (start && end) {
      const oldTimeTaken = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslationInfo().translateData[prefix]?.timeTaken || 0;
      data.timeTaken = timeTaken + oldTimeTaken;
    }
    if (translateStatus) {
      data.translateStatus = true;
    }
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').translationInfo(data);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StoreTimeTaken);

/***/ }),

/***/ "./src/automatic-translate/component/store-translated-string/index.js":
/*!****************************************************************************!*\
  !*** ./src/automatic-translate/component/store-translated-string/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const SaveTranslation = ({
  type,
  key,
  translateContent,
  source,
  provider,
  AllowedMetaFields
}) => {
  if (['title', 'excerpt'].includes(type)) {
    const action = `${type}SaveTranslate`;
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate')[action](translateContent, provider);
  } else if (['metaFields'].includes(type)) {
    if (Object.keys(AllowedMetaFields).includes(key)) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').metaFieldsSaveTranslate(key, translateContent, source, provider);
    }
  } else {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').contentSaveTranslate(key, translateContent, source, provider);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SaveTranslation);

/***/ }),

/***/ "./src/automatic-translate/component/string-modal-scroll/index.js":
/*!************************************************************************!*\
  !*** ./src/automatic-translate/component/string-modal-scroll/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _store_translated_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store-translated-string */ "./src/automatic-translate/component/store-translated-string/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _store_time_taken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store-time-taken */ "./src/automatic-translate/component/store-time-taken/index.js");
/* harmony import */ var _progress_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../progress-bar */ "./src/automatic-translate/component/progress-bar/index.js");
/* harmony import */ var _progress_bar_show_string_count__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../progress-bar/show-string-count */ "./src/automatic-translate/component/progress-bar/show-string-count.js");






/**
 * Handles the scrolling animation of a specified element.
 * 
 * @param {Object} props - The properties for the scroll animation.
 * @param {HTMLElement} props.element - The element to be scrolled.
 * @param {number} props.scrollSpeed - The duration of the scroll animation in milliseconds.
 */
const ScrollAnimation = props => {
  const {
    element,
    scrollSpeed,
    provider
  } = props;
  if (element.scrollHeight - element.offsetHeight <= 0) {
    return;
  }
  const progressBar = jQuery(`.${provider}-translator_progress_bar`);
  let startTime = null;
  let startScrollTop = element.scrollTop;
  const animateScroll = () => {
    const scrollHeight = element.scrollHeight - element.offsetHeight + 100;
    const currentTime = performance.now();
    const duration = scrollSpeed;
    const scrollTarget = scrollHeight + 2000;
    if (!startTime) {
      startTime = currentTime;
    }
    const progress = (currentTime - startTime) / duration;
    const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;
    var scrollTop = element.scrollTop;
    var currentScrollHeight = element.scrollHeight;
    var clientHeight = element.clientHeight;
    var scrollPercentage = scrollTop / (currentScrollHeight - clientHeight) * 100;
    progressBar.find(`.${provider}-translator_progress`).css('width', scrollPercentage + '%');
    let percentage = (Math.round(scrollPercentage * 10) / 10).toFixed(1);
    percentage = Math.min(percentage, 100).toString();
    progressBar.find(`.${provider}-translator_progress`).text(percentage + '%');
    if (scrollPosition > scrollHeight) {
      (0,_progress_bar_show_string_count__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
      return; // Stop animate scroll
    }
    element.scrollTop = scrollPosition;
    if (scrollPosition < scrollHeight) {
      setTimeout(animateScroll, 16);
    }
  };
  animateScroll();
};

/**
 * Updates the translated content in the string container based on the provided translation object.
 */
const updateTranslatedContent = ({
  provider,
  startTime,
  endTime
}) => {
  const container = document.getElementById("atfp_strings_model");
  const stringContainer = container.querySelector('.atfp_string_container');
  const translatedData = stringContainer.querySelectorAll('td.translate[data-string-type]:not([data-translate-status="translated"]):not(.notranslate):not([translate="no"])');
  const totalTranslatedData = translatedData.length;
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getAllowedMetaFields();
  translatedData.forEach((ele, index) => {
    const translatedText = ele.innerText;
    const key = ele.dataset.key;
    const type = ele.dataset.stringType;
    const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;
    (0,_store_translated_string__WEBPACK_IMPORTED_MODULE_0__["default"])({
      type: type,
      key: key,
      translateContent: translatedText,
      source: sourceText,
      provider: provider,
      AllowedMetaFields
    });
    const translationEntry = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getTranslationInfo().translateData[provider];
    const previousTargetStringCount = translationEntry && translationEntry.targetStringCount ? translationEntry.targetStringCount : 0;
    const previousTargetWordCount = translationEntry && translationEntry.targetWordCount ? translationEntry.targetWordCount : 0;
    const previousTargetCharacterCount = translationEntry && translationEntry.targetCharacterCount ? translationEntry.targetCharacterCount : 0;
    if (translatedText.trim() !== '' && translatedText.trim().length > 0) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').translationInfo({
        targetStringCount: previousTargetStringCount + sourceText.trim().split(/(?<=[.!?]+)\s+/).length,
        targetWordCount: previousTargetWordCount + sourceText.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length,
        targetCharacterCount: previousTargetCharacterCount + sourceText.trim().length,
        provider: provider
      });
    }
    if (index === totalTranslatedData - 1) {
      jQuery(`.${provider}-translator_progress`).css('width', '100%');
      (0,_progress_bar_show_string_count__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
      (0,_store_time_taken__WEBPACK_IMPORTED_MODULE_2__["default"])({
        prefix: provider,
        start: startTime,
        end: endTime,
        translateStatus: true
      });
    }
  });
};

/**
 * Handles the completion of the translation process by enabling the save button,
 * updating the UI, and stopping the translation progress.
 * 
 * @param {HTMLElement} container - The container element for translation.
 * @param {number} startTime - The start time of the translation.
 * @param {number} endTime - The end time of the translation.
 * @param {Function} translateStatus - The function to call when the translation is complete.
 */
const onCompleteTranslation = ({
  container,
  provider,
  startTime,
  endTime,
  translateStatus,
  modalRenderId
}) => {
  const conainer = document.querySelector(`#atfp-${provider}-strings-modal.modal-container[data-render-id="${modalRenderId}"]`);
  if (!conainer) {
    return;
  }
  container.querySelector(".atfp_translate_progress").style.display = "none";
  container.querySelector(".atfp_string_container").style.animation = "none";
  document.body.style.top = '0';
  const saveButton = container.querySelector('button.save_it');
  saveButton.removeAttribute('disabled');
  saveButton.classList.add('translated');
  saveButton.classList.remove('notranslate');
  updateTranslatedContent({
    provider,
    startTime,
    endTime
  });
  translateStatus(false);
};

/**
 * Automatically scrolls the string container and triggers the completion callback
 * when the bottom is reached or certain conditions are met.
 * 
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 * @param {string} provider - The provider of the translation.
 */
const ModalStringScroll = (translateStatus, provider, modalRenderId) => {
  const startTime = new Date().getTime();
  let translateComplete = false;
  (0,_progress_bar__WEBPACK_IMPORTED_MODULE_3__["default"])(provider);
  const container = document.getElementById("atfp_strings_model");
  const stringContainer = container.querySelector('.atfp_string_container');
  stringContainer.scrollTop = 0;
  const scrollHeight = stringContainer.scrollHeight;
  if (scrollHeight !== undefined && scrollHeight > 100) {
    document.querySelector(".atfp_translate_progress").style.display = "block";
    setTimeout(() => {
      const scrollSpeed = Math.ceil(scrollHeight / stringContainer?.offsetHeight) * 2000;
      ScrollAnimation({
        element: stringContainer,
        scrollSpeed: scrollSpeed,
        provider: provider
      });
    }, 2000);
    stringContainer.addEventListener('scroll', () => {
      var isScrolledToBottom = stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight;
      if (isScrolledToBottom && !translateComplete) {
        const endTime = new Date().getTime();
        setTimeout(() => {
          onCompleteTranslation({
            container,
            provider,
            startTime,
            endTime,
            translateStatus,
            modalRenderId
          });
        }, 4000);
        translateComplete = true;
      }
    });
    if (stringContainer.clientHeight + 10 >= scrollHeight) {
      jQuery(`.${provider}-translator_progress`).css('width', '100%');
      jQuery(`.${provider}-translator_progress`).text('100%');
      (0,_progress_bar_show_string_count__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
      const endTime = new Date().getTime();
      setTimeout(() => {
        onCompleteTranslation({
          container,
          provider,
          startTime,
          endTime,
          translateStatus,
          modalRenderId
        });
      }, 4000);
    }
  } else {
    jQuery(`.${provider}-translator_progress`).css('width', '100%');
    jQuery(`.${provider}-translator_progress`).text('100%');
    (0,_progress_bar_show_string_count__WEBPACK_IMPORTED_MODULE_4__["default"])(provider, 'block');
    const endTime = new Date().getTime();
    setTimeout(() => {
      onCompleteTranslation({
        container,
        provider,
        startTime,
        endTime,
        translateStatus,
        modalRenderId
      });
    }, 4000);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModalStringScroll);

/***/ }),

/***/ "./src/automatic-translate/component/translate-provider/index.js":
/*!***********************************************************************!*\
  !*** ./src/automatic-translate/component/translate-provider/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _yandex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./yandex */ "./src/automatic-translate/component/translate-provider/yandex/index.js");
/* harmony import */ var _local_ai_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./local-ai-translator */ "./src/automatic-translate/component/translate-provider/local-ai-translator/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);




/**
 * Provides translation services using Yandex Translate.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (props => {
  props = props || {};
  const {
    Service = false,
    openErrorModalHandler = () => {}
  } = props;
  const adminUrl = window.atfp_global_object.admin_url;
  const assetsUrl = window.atfp_global_object.atfp_url + 'assets/images/';
  const errorIcon = assetsUrl + 'error-icon.svg';
  const Services = {
    yandex: {
      Provider: _yandex__WEBPACK_IMPORTED_MODULE_0__["default"],
      title: "Yandex Translate",
      SettingBtnText: "Translate",
      serviceLabel: "Yandex Translate",
      Docs: "https://docs.coolplugins.net/doc/yandex-translate-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_yandex",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Choose Language", 'autopoly-ai-translation-for-polylang'),
      BetaEnabled: false,
      ButtonDisabled: props.yandexButtonDisabled,
      ErrorMessage: props.yandexButtonDisabled ? /*#__PURE__*/React.createElement("div", {
        className: "atfp-provider-error button button-primary",
        onClick: () => openErrorModalHandler("yandex")
      }, /*#__PURE__*/React.createElement("img", {
        src: errorIcon,
        alt: "error"
      }), " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('View Error', 'autopoly-ai-translation-for-polylang')) : /*#__PURE__*/React.createElement(React.Fragment, null),
      Logo: 'yandex.png'
    },
    localAiTranslator: {
      Provider: _local_ai_translator__WEBPACK_IMPORTED_MODULE_1__["default"],
      title: "Chrome Built-in AI",
      SettingBtnText: "Translate",
      serviceLabel: "Chrome AI Translator",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translate Using %s", 'autopoly-ai-translation-for-polylang'), "Chrome built-in API"),
      Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_chrome",
      BetaEnabled: true,
      ButtonDisabled: props.localAiTranslatorButtonDisabled,
      ErrorMessage: props.localAiTranslatorButtonDisabled ? /*#__PURE__*/React.createElement("div", {
        className: "atfp-provider-error button button-primary",
        onClick: () => openErrorModalHandler("localAiTranslator")
      }, /*#__PURE__*/React.createElement("img", {
        src: errorIcon,
        alt: "error"
      }), " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('View Error', 'autopoly-ai-translation-for-polylang')) : /*#__PURE__*/React.createElement(React.Fragment, null),
      Logo: 'chrome.png'
    },
    google: {
      title: "Google Translate",
      SettingBtnText: "Translate",
      serviceLabel: "Google Translate",
      Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_google",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Choose Language", 'autopoly-ai-translation-for-polylang'),
      BetaEnabled: false,
      ButtonDisabled: true,
      ErrorMessage: /*#__PURE__*/React.createElement("a", {
        className: "atfp-provider-error button button-primary",
        href: (window.atfp_global_object.pro_version_url || '') + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_google',
        target: "_blank"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Buy Pro', 'autopoly-ai-translation-for-polylang')),
      Logo: 'google.png'
    },
    openai_ai: {
      title: "OpenAI Model",
      SettingBtnText: "Translate",
      serviceLabel: "OpenAI",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translate Using %s Model", 'autopoly-ai-translation-for-polylang'), "OpenAI"),
      Docs: "https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_openai",
      BetaEnabled: true,
      ButtonDisabled: true,
      ErrorMessage: /*#__PURE__*/React.createElement("a", {
        className: `atfp-provider-error button button-primary`,
        href: (window.atfp_global_object.pro_version_url || '') + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_openai',
        target: "_blank"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Buy Pro', 'autopoly-ai-translation-for-polylang')),
      Logo: 'openai.png'
    },
    google_ai: {
      title: "Gemini Model",
      SettingBtnText: "Translate",
      serviceLabel: "Gemini",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translate Using %s Model", 'autopoly-ai-translation-for-polylang'), "Gemini"),
      Docs: "https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_gemini",
      BetaEnabled: true,
      ButtonDisabled: true,
      ErrorMessage: /*#__PURE__*/React.createElement("a", {
        className: `atfp-provider-error button button-primary`,
        href: (window.atfp_global_object.pro_version_url || '') + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_gemini',
        target: "_blank"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Buy Pro', 'autopoly-ai-translation-for-polylang')),
      Logo: 'gemini.png'
    },
    deepl_ai: {
      title: "DeepL Model",
      SettingBtnText: "Translate",
      serviceLabel: "DeepL",
      heading: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translate Using %s Model", 'autopoly-ai-translation-for-polylang'), "DeepL"),
      Docs: "https://docs.coolplugins.net/doc/translate-via-deepl-ai-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_deepl",
      BetaEnabled: true,
      ButtonDisabled: true,
      ErrorMessage: /*#__PURE__*/React.createElement("a", {
        className: `atfp-provider-error button button-primary`,
        href: (window.atfp_global_object.pro_version_url || '') + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_deepl',
        target: "_blank"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Buy Pro', 'autopoly-ai-translation-for-polylang')),
      Logo: 'deepl.png'
    }
  };
  if (!Service) {
    return Services;
  }
  return Services[Service];
});

/***/ }),

/***/ "./src/automatic-translate/component/translate-provider/local-ai-translator/index.js":
/*!*******************************************************************************************!*\
  !*** ./src/automatic-translate/component/translate-provider/local-ai-translator/index.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _local_ai_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./local-ai-translator */ "./src/automatic-translate/component/translate-provider/local-ai-translator/local-ai-translator.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _store_translated_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../store-translated-string */ "./src/automatic-translate/component/store-translated-string/index.js");
/* harmony import */ var _component_store_time_taken__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../component/store-time-taken */ "./src/automatic-translate/component/store-time-taken/index.js");





const localAiTranslator = async props => {
  const targetLangName = atfp_global_object.languageObject[props.targetLang]['name'];
  const sourceLangName = atfp_global_object.languageObject[props.sourceLang]['name'];
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('block-atfp/translate').getAllowedMetaFields();
  const {
    translateStatusHandler,
    translateStatus
  } = props;
  let startTime = 0;
  const startTranslation = () => {
    startTime = new Date().getTime();
    const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");
    if (stringContainer[0].scrollHeight > 100) {
      jQuery("#atfp_strings_model .atfp_translate_progress").fadeIn("slow");
    }
  };
  const completeTranslation = () => {
    (0,_component_store_time_taken__WEBPACK_IMPORTED_MODULE_4__["default"])({
      prefix: 'localAiTranslator',
      start: startTime,
      end: new Date().getTime(),
      translateStatus: true
    });
    setTimeout(() => {
      translateStatusHandler(false);
      jQuery("#atfp_strings_model .atfp_translate_progress").fadeOut("slow");
    }, 4000);
  };
  const beforeTranslate = ele => {
    const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");
    if (stringContainer.length < 1) {
      TranslateProvider.stopTranslation();
      (0,_component_store_time_taken__WEBPACK_IMPORTED_MODULE_4__["default"])({
        prefix: 'localAiTranslator',
        start: startTime,
        end: new Date().getTime()
      });
      startTime = 0;
      return;
    }
    const scrollStringContainer = position => {
      stringContainer.scrollTop(position);
    };
    const stringContainerPosition = stringContainer[0].getBoundingClientRect();
    const eleTopPosition = ele.closest("tr").offsetTop;
    const containerHeight = stringContainer.height();
    if (eleTopPosition > containerHeight + stringContainerPosition.y) {
      scrollStringContainer(eleTopPosition - containerHeight + ele.offsetHeight);
    }
  };
  const afterTranslate = ele => {
    const translatedText = ele.innerText;
    const type = ele.dataset.stringType;
    const key = ele.dataset.key;
    const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;
    (0,_store_translated_string__WEBPACK_IMPORTED_MODULE_3__["default"])({
      type: type,
      key: key,
      translateContent: translatedText,
      source: sourceText,
      provider: 'localAiTranslator',
      AllowedMetaFields
    });
    const translationEntry = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('block-atfp/translate').getTranslationInfo().translateData?.localAiTranslator;
    const previousTargetStringCount = translationEntry && translationEntry.targetStringCount ? translationEntry.targetStringCount : 0;
    const previousTargetWordCount = translationEntry && translationEntry.targetWordCount ? translationEntry.targetWordCount : 0;
    const previousTargetCharacterCount = translationEntry && translationEntry.targetCharacterCount ? translationEntry.targetCharacterCount : 0;
    if (translatedText.trim() !== '' && translatedText.trim().length > 0) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)('block-atfp/translate').translationInfo({
        targetStringCount: previousTargetStringCount + sourceText.trim().split(/(?<=[.!?]+)\s+/).length,
        targetWordCount: previousTargetWordCount + sourceText.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length,
        targetCharacterCount: previousTargetCharacterCount + sourceText.trim().length,
        provider: 'localAiTranslator'
      });
    }
  };
  const TranslateProvider = await _local_ai_translator__WEBPACK_IMPORTED_MODULE_0__["default"].Object({
    mainWrapperSelector: "#atfp_strings_model",
    btnSelector: `#${props.ID}`,
    btnClass: "local_ai_translator_btn",
    btnText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Translate To", 'autopoly-ai-translation-for-polylang') + ' ' + targetLangName + ' (Beta)',
    stringSelector: ".atfp_string_container tbody tr td.translate:not([data-translate-status='translated'])",
    progressBarSelector: "#atfp_strings_model .atfp_translate_progress",
    sourceLanguage: props.sourceLang,
    targetLanguage: props.targetLang,
    targetLanguageLabel: targetLangName,
    sourceLanguageLabel: sourceLangName,
    onStartTranslationProcess: startTranslation,
    onComplete: completeTranslation,
    onBeforeTranslate: beforeTranslate,
    onAfterTranslate: afterTranslate
  });
  if (TranslateProvider.hasOwnProperty('init')) {
    TranslateProvider.init();
    const button = document.querySelector('#atfp_localAiTranslator_translate_element .local_ai_translator_btn');
    if (button && translateStatus) {
      button.disabled = translateStatus;
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (localAiTranslator);

/***/ }),

/***/ "./src/automatic-translate/component/translate-provider/local-ai-translator/local-ai-translator.js":
/*!*********************************************************************************************************!*\
  !*** ./src/automatic-translate/component/translate-provider/local-ai-translator/local-ai-translator.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ChromeAiTranslator {
  // Static method to create an instance of ChromeAiTranslator and return extra data
  static Object = options => {
    const selfObject = new this(options);
    return selfObject.extraData();
  };

  // Constructor to initialize the translator with options
  constructor(options) {
    this.btnSelector = options.btnSelector || false; // Selector for the button that triggers translation
    this.btnClass = options.btnClass || false; // Class for the button
    this.btnText = options.btnText || `Translate To ${options.targetLanguageLabel} (Beta)`; // Text for the button
    this.stringSelector = options.stringSelector || false; // Selector for the elements containing strings to translate
    this.progressBarSelector = options.progressBarSelector || false; // Selector for the progress bar element
    this.onStartTranslationProcess = options.onStartTranslationProcess || (() => {}); // Callback for when translation starts
    this.onComplete = options.onComplete || (() => {}); // Callback for when translation completes
    this.onLanguageError = options.onLanguageError || (() => {}); // Callback for language errors
    this.onBeforeTranslate = options.onBeforeTranslate || (() => {}); // Callback for before translation
    this.onAfterTranslate = options.onAfterTranslate || (() => {}); // Callback for after translation
    this.sourceLanguage = options.sourceLanguage || "en"; // Default source language
    this.targetLanguage = options.targetLanguage || "hi"; // Default target language
    this.targetLanguageLabel = options.targetLanguageLabel || "Hindi"; // Label for the target language
    this.sourceLanguageLabel = options.sourceLanguageLabel || "English"; // Label for the source language
  }

  // Method to check language support and return relevant data
  extraData = async () => {
    // Check if the language is supported
    const langSupportedStatus = await ChromeAiTranslator.languageSupportedStatus(this.sourceLanguage, this.targetLanguage, this.targetLanguageLabel, this.sourceLanguageLabel);
    if (langSupportedStatus !== true) {
      this.onLanguageError(langSupportedStatus); // Handle language error
      return {}; // Return empty object if language is not supported
    }
    this.defaultLang = this.targetLanguage; // Set default language

    // Return methods for translation control
    return {
      continueTranslation: this.continueTranslation,
      stopTranslation: this.stopTranslation,
      startTranslation: this.startTranslation,
      reInit: this.reInit,
      init: this.init
    };
  };

  /**
   * Checks if the specified source and target languages are supported by the Local Translator AI modal.
   * 
   * @param {string} sourceLanguage - The language code for the source language (e.g., "en" for English).
   * @param {string} targetLanguage - The language code for the target language (e.g., "hi" for Hindi).
   * @param {string} targetLanguageLabel - The label for the target language (e.g., "Hindi").
   * @returns {Promise<boolean|jQuery>} - Returns true if the languages are supported, or a jQuery message if not.
   */
  static languageSupportedStatus = async (sourceLanguage, targetLanguage, targetLanguageLabel, sourceLanguageLabel) => {
    const supportedLanguages = ['en', 'es', 'ja', 'ar', 'de', 'bn', 'fr', 'hi', 'it', 'ko', 'nl', 'pl', 'pt', 'ru', 'th', 'tr', 'vi', 'zh', 'zh-hant', 'bg', 'cs', 'da', 'el', 'fi', 'hr', 'hu', 'id', 'iw', 'lt', 'no', 'ro', 'sk', 'sl', 'sv', 'uk', 'kn', 'ta', 'te', 'mr'].map(lang => lang.toLowerCase());
    const safeBrowser = window.location.protocol === 'https:';
    const browserContentSecure = window?.isSecureContext;

    // Browser check
    if (!window.hasOwnProperty('chrome') || !navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edg')) {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <strong>Important Notice:</strong>
                <ol>
                    <li>The Translator API, which leverages Chrome local AI models, is designed specifically for use with the Chrome browser.</li>
                    <li>For comprehensive information about the Translator API, <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">click here</a>.</li>
                </ol>
                <p>Please ensure you are using the Chrome browser for optimal performance and compatibility.</p>
            </span>`);
      return message;
    }
    if (!('translation' in self && 'createTranslator' in self.translation) && !('ai' in self && 'translator' in self.ai) && !("Translator" in self && "create" in self.Translator) && !safeBrowser && !browserContentSecure) {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <strong>Important Notice:</strong>
                <ol>
                    <li>
                        The Translator API is not functioning due to an insecure connection.
                    </li>
                    <li>
                        Please switch to a secure connection (HTTPS) or add this URL to the list of insecure origins treated as secure by visiting 
                        <span data-clipboard-text="chrome://flags/#unsafely-treat-insecure-origin-as-secure" target="_blank" class="chrome-ai-translator-flags">
                            chrome://flags/#unsafely-treat-insecure-origin-as-secure ${ChromeAiTranslator.svgIcons('copy')}
                        </span>.
                        Click on the URL to copy it, then open a new window and paste this URL to access the settings.
                    </li>
                </ol>
            </span>`);
      return message;
    }

    // Check if the translation API is available
    if (!('translation' in self && 'createTranslator' in self.translation) && !('ai' in self && 'translator' in self.ai) && !("Translator" in self && "create" in self.Translator)) {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <h4>Steps to Enable the Translator AI Modal:</h4>
                <ol>
                    <li>Open this URL in a new Chrome tab: <strong><span data-clipboard-text="chrome://flags/#translation-api" target="_blank" class="chrome-ai-translator-flags">chrome://flags/#translation-api ${ChromeAiTranslator.svgIcons('copy')}</span></strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.</li>
                    <li>Ensure that the <strong>Experimental translation API</strong> option is set to <strong>Enabled</strong>.</li>
                    <li>Click on the <strong>Save</strong> button to apply the changes.</li>
                    <li>The Translator AI modal should now be enabled and ready for use.</li>
                </ol>
                <p>For more information, please refer to the <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">documentation</a>.</p>   
                <p>If the issue persists, please ensure that your browser is up to date and restart your browser.</p>
                <p>If you continue to experience issues after following the above steps, please <a href="https://my.coolplugins.net/account/support-tickets/" target="_blank" rel="noopener">open a support ticket</a> with our team. We are here to help you resolve any problems and ensure a smooth translation experience.</p>
            </span>`);
      return message;
    }

    // Check if the target language is supported
    if (!supportedLanguages.includes(targetLanguage.toLowerCase())) {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <strong>Language Support Information:</strong>
                <ol>
                    <li>The current version of Chrome AI Translator does not support the Target Language <strong>${targetLanguageLabel} (${targetLanguage})</strong></li>
                    <li>To view the list of supported languages, please <span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">chrome://on-device-translation-internals ${ChromeAiTranslator.svgIcons('copy')}</span>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.</li>
                    <li>Ensure your Chrome browser is updated to the latest version for optimal performance.</li>
                </ol>
            </span>`);
      return message;
    }

    // Check if the source language is supported
    if (!supportedLanguages.includes(sourceLanguage.toLowerCase())) {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <strong>Language Support Information:</strong>
                <ol>
                    <li>The current version of Chrome AI Translator does not support the Source Language <strong>${sourceLanguageLabel} (${sourceLanguage})</strong></li>
                    <li>To view the list of supported languages, please <span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">chrome://on-device-translation-internals ${ChromeAiTranslator.svgIcons('copy')}</span>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.</li>
                    <li>Ensure your Chrome browser is updated to the latest version for optimal performance.</li>
                </ol>
            </span>`);
      return message;
    }

    // Check if translation can be performed
    const status = await ChromeAiTranslator.languagePairAvality(sourceLanguage, targetLanguage);

    // Handle case for language pack after download
    if (status === "after-download" || status === "downloadable" || status === "unavailable") {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <h4>Installation Instructions for Language Packs:</h4>
                <ol>
                    <li>
                        To proceed, please install the language pack for <strong>${targetLanguageLabel} (${targetLanguage})</strong> or <strong>${sourceLanguageLabel} (${sourceLanguage})</strong>.
                    </li>
                    <li>
                        After installing the language pack, add this language to your browser's system languages in Chrome settings.<br>
                        Go to <strong>Settings &gt; Languages &gt; Add languages</strong> and add <strong>${targetLanguageLabel}</strong> or <strong>${sourceLanguageLabel}</strong> to your preferred languages list & reload the page.
                    </li>
                    <li>
                        You can install it by visiting the following link: 
                        <strong>
                            <span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">
                                chrome://on-device-translation-internals ${ChromeAiTranslator.svgIcons('copy')}
                            </span>
                        </strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.
                    </li>
                    <li>
                        Please check if both your source <strong>(<span style="color:#2271b1">${sourceLanguage}</span>)</strong> and target <strong>(<span style="color:#2271b1">${targetLanguage}</span>)</strong> languages are available in the language packs list.
                    </li>
                    <li>
                        You need to install both language packs for translation to work. You can search for each language by its language code: <strong>${sourceLanguage}</strong> and <strong>${targetLanguage}</strong>.
                    </li>
                    <li>For more help, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">documentation to check supported languages</a>.</li>
                </ol>
            </span>`);
      return message;
    }

    // Handle case for language pack downloadable
    if (status === "downloading") {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <h4>Language Pack Download In Progress:</h4>
                <ol>
                    <li>
                        The language pack for <strong>${targetLanguageLabel} (${targetLanguage})</strong> or <strong>${sourceLanguageLabel} (${sourceLanguage})</strong> is already being downloaded.
                    </li>
                    <li>
                        <strong>You do not need to start the download again.</strong> Please wait for the download to complete. Once finished, the translation feature will become available automatically.
                    </li>
                    <li>
                        You can check the download progress by opening:
                        <strong>
                            <span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">
                                chrome://on-device-translation-internals ${ChromeAiTranslator.svgIcons('copy')}
                            </span>
                        </strong>
                        . Click on the URL to copy it, then open a new window and paste this URL in Chrome to view the status.
                    </li>
                    <li>
                        <strong>What to do next:</strong>
                        <ul style="margin-top: .5em;">
                            <li>Wait for the download to finish. The status will change to <strong>Ready</strong> or <strong>Installed</strong> in the <strong>Language Packs</strong> section.</li>
                            <li>After the language pack is installed, you may need to <strong>reload</strong> or <strong>restart</strong> your browser for the changes to take effect.</li>
                        </ul>
                    </li>
                    <li>
                        For more help, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">documentation to check supported languages</a>.
                    </li>
                </ol>
                <div style="text-align: right;">
                    <button onclick="location.reload()" class="atfpp-error-reload-btn">Reload Page</button>
                </div>
            </span>`);
      return message;
    }

    // Handle case for language pack not readily available
    if (status !== 'readily' && status !== 'available') {
      const message = jQuery(`<span style="color: #ff4646; display: inline-block;">
                <h4>Language Pack Installation Required</h4>
                <ol>
                    <li>Please ensure that the language pack for <strong>${targetLanguageLabel} (${targetLanguage})</strong> or <strong>${sourceLanguageLabel} (${sourceLanguage})</strong> is installed and set as a preferred language in your browser.</li>
                    <li>To install the language pack, visit <strong><span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">chrome://on-device-translation-internals ${ChromeAiTranslator.svgIcons('copy')}</span></strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.</li>
                    <li>If you encounter any issues, please refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">documentation to check supported languages</a> for further assistance.</li>
                </ol>
            </span>`);
      return message;
    }
    return true;
  };
  static languagePairAvality = async (source, target) => {
    try {
      const translator = await self.Translator.create({
        sourceLanguage: source,
        targetLanguage: target,
        monitor(m) {
          m.addEventListener('downloadprogress', e => {
            console.log(`Downloaded ${e.loaded * 100}%`);
          });
        }
      });
    } catch (err) {
      console.log('err', err);
    }
    if ('translation' in self && 'createTranslator' in self.translation) {
      const status = await self.translation.canTranslate({
        sourceLanguage: source,
        targetLanguage: target
      });
      return status;
    } else if ('ai' in self && 'translator' in self.ai) {
      const translatorCapabilities = await self.ai.translator.capabilities();
      const status = await translatorCapabilities.languagePairAvailable(source, target);
      return status;
    } else if ("Translator" in self && "create" in self.Translator) {
      const status = await self.Translator.availability({
        sourceLanguage: source,
        targetLanguage: target
      });
      return status;
    }
    return false;
  };
  AITranslator = async targetLanguage => {
    if ('translation' in self && 'createTranslator' in self.translation) {
      const translator = await self.translation.createTranslator({
        sourceLanguage: this.sourceLanguage,
        targetLanguage
      });
      return translator;
    } else if ('ai' in self && 'translator' in self.ai) {
      const translator = await self.ai.translator.create({
        sourceLanguage: this.sourceLanguage,
        targetLanguage
      });
      return translator;
    } else if ("Translator" in self && "create" in self.Translator) {
      const translator = await self.Translator.create({
        sourceLanguage: this.sourceLanguage,
        targetLanguage
      });
      return translator;
    }
    return false;
  };

  // Method to initialize the translation process
  init = async () => {
    this.appendBtn();
    this.translationStart = false; // Flag to indicate if translation has started
    this.completedTranslateIndex = 0; // Index of the last completed translation
    this.completedCharacterCount = 0; // Count of characters translated
    this.translateBtnEvents(); // Set up button events
    if (this.progressBarSelector) {
      this.addProgressBar(); // Add progress bar to the UI
    }
  };

  /**
   * Appends a translation button to the specified button selector.
   * The button is styled with primary button classes and includes
   * any additional classes specified in `this.btnClass`.
   */
  appendBtn = () => {
    this.translateBtn = jQuery(`<button class="button button-primary${this.btnClass ? ' ' + this.btnClass : ''}">${this.btnText}</button>`);
    jQuery(this.btnSelector).append(this.translateBtn);
  };

  /**
   * Formats a number by converting it to a string and removing any non-numeric characters.
   * 
   * @param {number} number - The number to format.
   * @returns returns formatted number
   */
  formatCharacterCount = number => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number;
  };

  // Method to set up button events for translation
  translateBtnEvents = e => {
    if (!this.btnSelector || jQuery(this.btnSelector).length === 0) return this.onLanguageError("The button selector is missing. Please provide a valid selector for the button.");
    if (!this.stringSelector || jQuery(this.stringSelector).length === 0) return this.onLanguageError("The string selector is missing. Please provide a valid selector for the strings to be translated.");
    this.translateStatus = true; // Set translation status to true
    this.translateBtn.off("click"); // Clear previous click handlers
    this.translateBtn.prop("disabled", false); // Enable the button

    // Set up click event for starting translation
    if (!this.translationStart) {
      this.translateBtn.on("click", this.startTranslationProcess);
    } else if (this.translateStringEle.length > this.completedTranslateIndex + 1) {
      this.translateBtn.on("click", () => {
        this.onStartTranslationProcess(); // Call the start translation callback
        this.stringTranslation(this.completedTranslateIndex + 1); // Start translating the next string
      });
    } else {
      this.onComplete({
        translatedStringsCount: this.completedCharacterCount
      }); // Call the complete callback
      this.translateBtn.prop("disabled", true); // Disable the button
    }
  };

  // Method to start the translation process
  startTranslationProcess = async () => {
    this.onStartTranslationProcess(); // Call the start translation callback
    const langCode = this.defaultLang; // Get the default language code

    this.translationStart = true; // Set translation start flag
    this.translateStringEle = jQuery(this.stringSelector); // Get the elements to translate

    // Calculate total character count for progress tracking
    this.totalStringCount = Array.from(this.translateStringEle).map(ele => ele.innerText.length).reduce((a, b) => a + b, 0);

    // Create a translator instance
    this.translator = await this.AITranslator(langCode);

    // Start translating if there are strings to translate
    if (this.translateStringEle.length > 0) {
      await this.stringTranslation(this.completedTranslateIndex);
    }
  };

  // Method to translate a specific string at the given index
  stringTranslation = async index => {
    if (!this.translateStatus) return; // Exit if translation is stopped
    const ele = this.translateStringEle[index]; // Get the element to translate
    this.onBeforeTranslate(ele); // Call the before translation callback
    const orignalText = ele.innerText;
    let originalString = [];
    if (ele.childNodes.length > 0 && !ele.querySelector('.notranslate')) {
      ele.childNodes.forEach(child => {
        if (child.nodeType === 3 && child.nodeValue.trim() !== '') {
          originalString.push(child);
        }
      });
    } else if (ele.querySelector('.notranslate')) {
      ele.childNodes.forEach(child => {
        if (child.nodeType === 3 && child.nodeValue.trim() !== '') {
          originalString.push(child);
        }
      });
    }
    if (originalString.length > 0) {
      await this.stringTranslationBatch(originalString, 0);
    }
    this.completedCharacterCount += orignalText.length; // Update character count
    this.completedTranslateIndex = index; // Update completed index
    if (this.progressBarSelector) {
      this.updateProgressBar(); // Update the progress bar
    }
    this.onAfterTranslate(ele); // Call the after translation callback

    // Continue translating the next string if available
    if (this.translateStringEle.length > index + 1) {
      await this.stringTranslation(this.completedTranslateIndex + 1);
    }

    // If all strings are translated, complete the process
    if (index === this.translateStringEle.length - 1) {
      this.translateBtn.prop("disabled", true); // Disable the button
      this.onComplete({
        characterCount: this.completedCharacterCount
      }); // Call the complete callback
      jQuery(this.progressBarSelector).find(".chrome-ai-translator-strings-count").show().find(".totalChars").text(this.formatCharacterCount(this.completedCharacterCount));
    }
  };
  stringTranslationBatch = async (originalString, index) => {
    const translatedString = await this.translator.translate(originalString[index].nodeValue); // Translate the string

    if (translatedString && '' !== translatedString) {
      originalString[index].nodeValue = translatedString; // Set the translated string
    }
    if (index < originalString.length - 1) {
      await this.stringTranslationBatch(originalString, index + 1);
    }
    return true;
  };

  // Method to add a progress bar to the UI
  addProgressBar = () => {
    if (!document.querySelector("#chrome-ai-translator-modal .chrome-ai-translator_progress_bar")) {
      const progressBar = jQuery(`
                <div class="chrome-ai-translator_progress_bar" style="background-color: #f3f3f3;border-radius: 10px;overflow: hidden;margin: 1.5rem auto; width: 50%;">
                <div class="chrome-ai-translator_progress" style="overflow: hidden;transition: width .5s ease-in-out; border-radius: 10px;text-align: center;width: 0%;height: 20px;box-sizing: border-box;background-color: #4caf50; color: #fff; font-weight: 600;"></div>
                </div>
                <div style="display:none; color: white;" class="chrome-ai-translator-strings-count hidden">
                    Wahooo! You have saved your valuable time via auto translating 
                    <strong class="totalChars">0</strong> characters using 
                    <strong>
                        Chrome AI Translator
                    </strong>
                </div>
            `);
      jQuery(this.progressBarSelector).append(progressBar); // Append the progress bar to the specified selector
    }
  };

  // Method to update the progress bar based on translation progress
  updateProgressBar = () => {
    const progress = this.completedCharacterCount / this.totalStringCount * 1000 / 10; // Calculate progress percentage
    let decimalValue = progress.toString().split('.')[1] || ''; // Get decimal part of the progress
    decimalValue = decimalValue.length > 0 && decimalValue[0] !== '0' ? decimalValue[0] : ''; // Format decimal value
    const formattedProgress = parseInt(progress) + `${decimalValue !== '' ? '.' + decimalValue : ''}`; // Format progress for display
    jQuery(".chrome-ai-translator_progress").css({
      "width": `${formattedProgress}%`
    }).text(`${formattedProgress}%`); // Update progress bar width and text
  };

  // Method to stop the translation process
  stopTranslation = () => {
    this.translateStatus = false; // Set translation status to false
  };

  // Method to reinitialize button events
  reInit = () => {
    this.translateBtnEvents(); // Re-setup button events
  };

  // Method to start translation from the current index
  startTranslation = () => {
    this.translateStatus = true; // Set translation status to true
    this.startTranslationProcess(this.completedTranslateIndex + 1); // Start translation process
  };
  static svgIcons = iconName => {
    const Icons = {
      'copy': `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" fill="#2271b1"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg>`
    };
    return Icons[iconName] || '';
  };
}

/*
 * Example Usage of the ChromeAiTranslator.init method.
 * This method initializes the Chrome AI Translator with a comprehensive set of configuration options to facilitate the translation process.
 * 
 * Configuration Options:
 * 
 * - mainWrapperSelector: A CSS selector for the main wrapper element that encapsulates all translation-related elements.
 * - btnSelector: A CSS selector for the button that initiates the translation process.
 * - btnClass: A custom class for styling the translation button.
 * - btnText: The text displayed on the translation button.
 * - stringSelector: A CSS selector for the elements that contain the strings intended for translation.
 * - progressBarSelector: A CSS selector for the progress bar element that visually represents the translation progress.
 * - sourceLanguage: The language code representing the source language (e.g., "es" for Spanish).
 * - targetLanguage: The language code representing the target language (e.g., "fr" for French).
 * - onStartTranslationProcess: A callback function that is executed when the translation process begins.
 * - onBeforeTranslate: A callback function that is executed prior to each individual translation.
 * - onAfterTranslate: A callback function that is executed following each translation.
 * - onComplete: A callback function that is executed upon the completion of the translation process.
 * - onLanguageError: A callback function that is executed when a language-related error occurs.
 */

// Example for checking language support status
// ChromeAiTranslator.languageSupportedStatus("en", "fr", "French");

// const chromeAiTranslatorObject = ChromeAiTranslator.Object(
//     {
//         mainWrapperSelector: ".main-wrapper", // CSS selector for the main wrapper element
//         btnSelector: ".translator-container .translator-button", // CSS selector for the translation button
//         btnClass: "Btn_custom_class", // Custom class for button styling
//         btnText: "Translate To French", // Text displayed on the translation button
//         stringSelector: ".translator-body .translation-item", // CSS selector for translation string elements
//         progressBarSelector: ".translator-progress-bar", // CSS selector for the progress bar
//         sourceLanguage: "es", // Language code for the source language
//         targetLanguage: "fr", // Language code for the target language
//         onStartTranslationProcess: () => { console.log("Translation process started."); }, // Callback for translation start
//         onBeforeTranslate: () => { console.log("Before translation."); }, // Callback before each translation
//         onAfterTranslate: () => { console.log("After translation."); }, // Callback after each translation
//         onComplete: () => { console.log("Translation completed."); }, // Callback for completion
//         onLanguageError: () => { console.error("Language error occurred."); } // Callback for language errors
//     }
// );
// chromeAiTranslatorObject.init();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChromeAiTranslator);

/***/ }),

/***/ "./src/automatic-translate/component/translate-provider/yandex/index.js":
/*!******************************************************************************!*\
  !*** ./src/automatic-translate/component/translate-provider/yandex/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _string_modal_scroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../string-modal-scroll */ "./src/automatic-translate/component/string-modal-scroll/index.js");

const yandexWidget = (win, doc, nav, params, namespace, targetLang, translateStatusHandler, modalRenderId) => {
  'use strict';

  var util = {
    keycode: {
      ESCAPE: 27
    },
    getRequest: function () {
      if (win.XDomainRequest) {
        return new win.XDomainRequest();
      }
      if (win.XMLHttpRequest) {
        return new win.XMLHttpRequest();
      }
      return null;
    },
    loadScript: function (src, parent, callback) {
      var script = doc.createElement('script');
      script.src = src;
      script.addEventListener('load', function onLoad() {
        this.removeEventListener('load', onLoad, false);
        callback();
      }, false);
      parent.appendChild(script);
    },
    loadResource: function (url, callback) {
      var request = this.getRequest();
      if (!request) {
        return null;
      }
      request.onload = function () {
        callback(this.responseText);
      };
      request.open('GET', url, true);
      win.setTimeout(function () {
        request.send();
      }, 0);
      return request;
    },
    getStyleList: function (element) {
      var value = element.getAttribute('class');
      if (!value) {
        return [];
      }
      return value.replace(/\s+/g, ' ').trim().split(' ');
    },
    hasStyleName: function (element, name) {
      var list = this.getStyleList(element);
      return !!list.length && list.indexOf(name) >= 0;
    },
    addStyleName: function (element, name) {
      var list = this.getStyleList(element);
      list.push(name);
      element.setAttribute('class', list.join(' '));
    },
    removeStyleName: function (element, name) {
      var list = this.getStyleList(element),
        index = list.indexOf(name);
      if (index >= 0) {
        list.splice(index, 1);
        element.setAttribute('class', list.join(' '));
      }
    },
    isSupportedBrowser: function () {
      return 'localStorage' in win && 'querySelector' in doc && 'addEventListener' in win && 'getComputedStyle' in win && doc.compatMode === 'CSS1Compat';
    }
  };

  // Button
  var Button = function Button(element, contentElement) {
    var self = this;
    element.addEventListener('click', function (event) {
      self.onClick(event);
    }, false);
    this._element = element;
    this._contentElement = contentElement || this._element;
  };
  Button.prototype.onClick = function () {};
  Button.prototype.setText = function (text) {
    this._contentElement.textContent = text;
    return this;
  };

  // Select
  var Select = function Select(form, itemName) {
    var self = this;
    form.reset();
    form.addEventListener('click', function (event) {
      var target = event.target;
      if ('value' in target) {
        self.onSelect(target.value);
      }
    }, false);
    form.addEventListener('change', function (event) {
      alert("form change state");
      var target = event.target;
      if (target.checked) {
        self.onChange(target.value);
      }
    }, false);
    this._form = form;
    this._itemName = itemName;
  };
  Select.prototype.onSelect = function () {};
  Select.prototype.onChange = function () {};
  Select.prototype.isHidden = function () {
    return this._form.hasAttribute('hidden');
  };
  Select.prototype.getItems = function () {
    return this._form[this._itemName] || [];
  };
  Select.prototype.getValue = function () {
    var i,
      n,
      items = this.getItems();
    for (i = 0, n = items.length; i < n; i++) {
      if (items[i].checked) {
        return items[i].value;
      }
    }
    return '';
  };
  Select.prototype.setValue = function (value) {
    var i,
      n,
      items = this.getItems();
    if (value === this.getValue()) {
      return this;
    }
    for (i = 0, n = items.length; i < n; i++) {
      if (items[i].value === value) {
        items[i].checked = true;
        this.onChange(value);
        break;
      }
    }
    return this;
  };
  Select.prototype.setHidden = function (hidden) {
    hidden = !!hidden;
    if (hidden !== this.isHidden()) {
      this._form[(hidden ? 'set' : 'remove') + 'Attribute']('hidden', '');
      this.onHiddenChange(hidden);
    }
    return this;
  };
  Select.prototype.onHiddenChange = function () {};

  // Widget
  var Widget = function Widget(options) {
    var self = this,
      active,
      select = options.select,
      element = options.element,
      storage = options.storage,
      autoMode = options.autoMode,
      pageLang = options.pageLang,
      userLang = options.userLang,
      translator = options.translator,
      leftButton = options.leftButton,
      rightButton = options.rightButton,
      closeButton = options.closeButton,
      defaultLang;
    this._element = element;
    this._pageLang = pageLang;
    this._translator = translator;
    this.onStateChange = function (name, enable) {
      if (name === 'active') {
        storage.setValue('active', enable);
      }
    };
    select.onSelect = function (lang) {
      this.setHidden(true);
      self.translate(lang);
      (0,_string_modal_scroll__WEBPACK_IMPORTED_MODULE_0__["default"])(translateStatusHandler, 'yandex', modalRenderId);
    };
    select.onChange = function (lang) {
      storage.setValue('lang', lang);
      rightButton.setText(lang);
      self.setState('invalid', lang === pageLang);
    };
    select.onHiddenChange = function (hidden) {
      var docElem = doc.documentElement,
        formRect;
      self.setState('expanded', !hidden);
      if (!hidden) {
        self.setState('right', false).setState('bottom', false);
        element.focus();
        formRect = this._form.getBoundingClientRect();
        if (formRect.right + (win.pageXOffset || docElem.scrollLeft) + 1 >= Math.max(docElem.clientWidth, docElem.scrollWidth)) {
          self.setState('right', true);
        }
        if (formRect.bottom + (win.pageYOffset || docElem.scrollTop) + 1 >= Math.max(docElem.clientHeight, docElem.scrollHeight)) {
          self.setState('bottom', true);
        }
      }
    };
    element.addEventListener('blur', function () {
      select.setHidden(true);
    }, false);
    element.addEventListener('keydown', function (event) {
      switch (event.keyCode) {
        case util.keycode.ESCAPE:
          select.setHidden(true);
          break;
      }
    }, false);
    translator.on('error', function () {
      this.abort();
      self.setState('busy', false).setState('error', true);
    });
    translator.on('progress', function (progress) {
      switch (progress) {
        case 0:
          self.setState('busy', true).setState('active', true);
          break;
        case 100:
          self.setState('done', true).setState('busy', false);
          break;
      }
    });
    leftButton.onClick = function () {
      select.setHidden(true);
      self.translate(select.getValue());
      (0,_string_modal_scroll__WEBPACK_IMPORTED_MODULE_0__["default"])(translateStatusHandler, 'yandex', modalRenderId);
    };
    rightButton.onClick = function () {
      if (self.hasState('active')) {
        translator.undo();
        self.setState('busy', false).setState('done', false).setState('error', false).setState('active', false);
      } else {
        select.setHidden(!select.isHidden());
      }
    };
    closeButton.onClick = function () {
      select.setHidden(true);
    };
    if (targetLang != undefined) {
      var defaultcode = targetLang;
    }
    switch (defaultcode) {
      case 'nb':
        defaultLang = 'no';
        break;
      case 'nn':
        defaultLang = 'no';
        break;
      default:
        defaultLang = defaultcode;
        break;
    }
    if (defaultLang) {
      select.setValue(defaultLang);
      active = storage.getValue('active');
    }
  };
  Widget.prototype.hasState = function (name) {
    return util.hasStyleName(this._element, 'yt-state_' + name);
  };
  Widget.prototype.setState = function (name, enable) {
    var hasState = this.hasState(name);
    enable = !!enable;
    if (enable === hasState) {
      return this;
    }
    util[(enable ? 'add' : 'remove') + 'StyleName'](this._element, 'yt-state_' + name);
    this.onStateChange(name, enable);
    return this;
  };
  Widget.prototype.translate = function (targetLang) {
    if (targetLang && !this.hasState('active')) {
      this._translator.translate(this._pageLang, targetLang);
    }
    return this;
  };
  Widget.prototype.onStateChange = function () {};

  // Storage
  var Storage = function Storage(name) {
    this._name = name;
    try {
      this._data = win.JSON.parse(win.localStorage[name]);
    } catch (error) {
      this._data = {};
    }
  };
  Storage.prototype.getValue = function (prop) {
    return this._data[prop];
  };
  Storage.prototype.setValue = function (prop, value) {
    this._data[prop] = value;
    try {
      win.localStorage[this._name] = win.JSON.stringify(this._data);
    } catch (error) {}
  };
  var wrapper = doc.getElementById(params.widgetId);
  if (!wrapper || !util.isSupportedBrowser()) {
    return;
  }
  var initWidget = function () {
    util.loadScript('https://yastatic.net/s3/translate/v21.4.7/js/tr_page.js', wrapper, function () {
      util.loadResource('https://translate.yandex.net/website-widget/v1/widget.html', function (responseText) {
        var element;
        if (!responseText) {
          return;
        }
        wrapper.innerHTML = responseText;
        element = wrapper.querySelector('.yt-widget');
        if (params.widgetTheme) {
          element.setAttribute('data-theme', params.widgetTheme);
        }
        new Widget({
          select: new Select(element.querySelector('.yt-listbox'), 'yt-lang'),
          element: element,
          storage: new Storage('yt-widget'),
          autoMode: params.autoMode === 'true',
          pageLang: params.pageLang,
          userLang: (nav.language || nav.userLanguage || '').split('-')[0],
          translator: new namespace.PageTranslator({
            srv: 'tr-url-widget',
            url: 'https://translate.yandex.net/api/v1/tr.json/translate',
            autoSync: true,
            maxPortionLength: 600
          }),
          leftButton: new Button(element.querySelector('.yt-button_type_left')),
          rightButton: new Button(element.querySelector('.yt-button_type_right'), element.querySelector('.yt-button_type_right > .yt-button__text')),
          closeButton: new Button(element.querySelector('.yt-button_type_close'))
        });
      });
    });
  };
  if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
    initWidget();
  } else {
    doc.addEventListener('DOMContentLoaded', initWidget, false);
  }
};
const YandexTranslater = props => {
  const globalObj = window;
  yandexWidget(globalObj, globalObj.document, globalObj.navigator, {
    "pageLang": props.sourceLang,
    "autoMode": "false",
    "widgetId": "atfp_yandex_translate_element",
    "widgetTheme": "light"
  }, globalObj.yt = globalObj.yt || {}, props.targetLang, props.translateStatusHandler, props.modalRenderId);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YandexTranslater);

/***/ }),

/***/ "./src/automatic-translate/component/translate-provider/yandex/yandex-language.js":
/*!****************************************************************************************!*\
  !*** ./src/automatic-translate/component/translate-provider/yandex/yandex-language.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const languages = ['af', 'am', 'ar', 'az', 'ba', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'cs', 'cv', 'cy', 'da', 'de', 'el', 'emj', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'jv', 'ka', 'kazlat', 'kk', 'km', 'kn', 'ko', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mhr', 'mi', 'mk', 'ml', 'mn', 'mr', 'mrj', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pap', 'pl', 'pt', 'pt-BR', 'ro', 'ru', 'sah', 'si', 'sk', 'sl', 'sq', 'sr', 'sr-Latn', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'tt', 'udm', 'uk', 'ur', 'uz', 'uzbcyr', 'vi', 'xh', 'yi', 'zh', 'zu'];
  return languages;
});

/***/ }),

/***/ "./src/automatic-translate/component/translate-seo-fields/rank-math-seo.js":
/*!*********************************************************************************!*\
  !*** ./src/automatic-translate/component/translate-seo-fields/rank-math-seo.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const RankMathSeo = props => {
  if (!(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("rank-math")) {
    return;
  }
  const {
    updateKeywords,
    updateTitle,
    updateDescription,
    updateBreadcrumbTitle,
    updateFacebookTitle,
    updateFacebookDescription,
    updateTwitterTitle,
    updateTwitterDescription
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("rank-math");
  const {
    key,
    value
  } = props;
  switch (key) {
    case 'rank_math_focus_keyword':
      if (updateKeywords) {
        updateKeywords(value);
      }
      break;
    case 'rank_math_title':
      if (updateTitle) {
        updateTitle(value);
      }
      break;
    case 'rank_math_description':
      if (updateDescription) {
        updateDescription(value);
      }
      break;
    case 'rank_math_breadcrumb_title':
      if (updateBreadcrumbTitle) {
        updateBreadcrumbTitle(value);
      }
      break;
    case 'rank_math_facebook_title':
      if (updateFacebookTitle) {
        updateFacebookTitle(value);
      }
      break;
    case 'rank_math_facebook_description':
      if (updateFacebookDescription) {
        updateFacebookDescription(value);
      }
      break;
    case 'rank_math_twitter_title':
      if (updateTwitterTitle) {
        updateTwitterTitle(value);
      }
      break;
    case 'rank_math_twitter_description':
      if (updateTwitterDescription) {
        updateTwitterDescription(value);
      }
      break;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RankMathSeo);

/***/ }),

/***/ "./src/automatic-translate/component/translate-seo-fields/seo-press.js":
/*!*****************************************************************************!*\
  !*** ./src/automatic-translate/component/translate-seo-fields/seo-press.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const SeoPressFields = async props => {
  const {
    key,
    value
  } = props;
  const inputId = key.replace(/^_/, '') + '_meta';
  if (!document.querySelector('#' + inputId)) {
    return;
  }
  switch (key) {
    case '_seopress_titles_title':
    case '_seopress_titles_desc':
    case '_seopress_social_fb_title':
    case '_seopress_social_fb_desc':
    case '_seopress_social_twitter_title':
    case '_seopress_social_twitter_desc':
      jQuery(`#${inputId}`).val(value);
      jQuery(`#${inputId}`).trigger('change');
      break;
    case '_seopress_analysis_target_kw':
      if (window.target_kw && window.target_kw instanceof window.Tagify && window.target_kw.DOM.originalInput.id === inputId) {
        window.target_kw.addTags(value);
      } else {
        jQuery('#' + inputId).val(value);
        jQuery('#' + inputId).trigger('change');
      }
      break;
    default:
      break;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SeoPressFields);

/***/ }),

/***/ "./src/automatic-translate/component/translate-seo-fields/yoast-seo-fields.js":
/*!************************************************************************************!*\
  !*** ./src/automatic-translate/component/translate-seo-fields/yoast-seo-fields.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const YoastSeoFields = props => {
  if (!(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("yoast-seo/editor")) {
    return;
  }
  const {
    updateData,
    setFocusKeyword,
    setBreadcrumbsTitle,
    setFacebookPreviewTitle,
    setFacebookPreviewDescription,
    setTwitterPreviewTitle,
    setTwitterPreviewDescription
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)("yoast-seo/editor");
  const {
    key,
    value
  } = props;
  switch (key) {
    case "_yoast_wpseo_focuskw":
      if (setFocusKeyword) {
        setFocusKeyword(value);
      }
      break;
    case "_yoast_wpseo_title":
      if (updateData) {
        updateData({
          title: value
        });
      }
      break;
    case "_yoast_wpseo_metadesc":
      if (updateData) {
        updateData({
          description: value
        });
      }
      break;
    case "_yoast_wpseo_bctitle":
      if (setBreadcrumbsTitle) {
        setBreadcrumbsTitle(value);
      }
      break;
    case "_yoast_wpseo_opengraph-title":
      if (setFacebookPreviewTitle) {
        setFacebookPreviewTitle(value);
      }
      break;
    case "_yoast_wpseo_opengraph-description":
      if (setFacebookPreviewDescription) {
        setFacebookPreviewDescription(value);
      }
      break;
    case "_yoast_wpseo_twitter-title":
      if (setTwitterPreviewTitle) {
        setTwitterPreviewTitle(value);
      }
      break;
    case "_yoast_wpseo_twitter-description":
      if (setTwitterPreviewDescription) {
        setTwitterPreviewDescription(value);
      }
      break;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastSeoFields);

/***/ }),

/***/ "./src/automatic-translate/create-translated-post/elementor/index.js":
/*!***************************************************************************!*\
  !*** ./src/automatic-translate/create-translated-post/elementor/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _component_translate_seo_fields_yoast_seo_fields__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../component/translate-seo-fields/yoast-seo-fields */ "./src/automatic-translate/component/translate-seo-fields/yoast-seo-fields.js");
/* harmony import */ var _component_translate_seo_fields_rank_math_seo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../component/translate-seo-fields/rank-math-seo */ "./src/automatic-translate/component/translate-seo-fields/rank-math-seo.js");




// Update widget content with translations
const atfpUpdateWidgetContent = translations => {
  translations.forEach(translation => {
    // Find the model by ID using the atfpFindModelById function
    const model = atfpFindModelById(elementor.elements.models, translation.ID);
    if (model) {
      const settings = model.get('settings');

      // Check for normal fields (title, text, editor, etc.)
      if (settings.get(translation.key)) {
        settings.set(translation.key, translation.translatedContent); // Set the translated content
        model?.renderRemoteServer();
      }

      // Handle repeater fields (if any)
      const repeaterMatch = translation.key.match(/(.+)\[(\d+)\]\.(.+)/);
      if (repeaterMatch) {
        const [_, repeaterKey, index, subKey] = repeaterMatch;
        const repeaterArray = settings.get(repeaterKey);
        if (Array.isArray(repeaterArray.models) && repeaterArray.models[index]) {
          let repeaterModel = repeaterArray.models[index];
          let repeaterAttribute = repeaterModel.attributes;
          repeaterAttribute[subKey] = translation.translatedContent;
          settings.set(repeaterKey, repeaterArray); // Set the updated array back to settings
          model?.renderRemoteServer();
        }
      }
    }
  });

  // After updating content, ensure that the changes are saved or published
  $e.internal('document/save/set-is-modified', {
    status: true
  });
};
const atfpUpdateMetaFields = (metaFields, service) => {
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getAllowedMetaFields();
  if (!metaFields && Object.keys(metaFields).length < 1) {
    return;
  }
  Object.keys(metaFields).forEach(key => {
    // Update yoast seo meta fields
    if (Object.keys(AllowedMetaFields).includes(key)) {
      const translatedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslatedString('metaFields', metaFields[key][0], key, service);
      if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
        (0,_component_translate_seo_fields_yoast_seo_fields__WEBPACK_IMPORTED_MODULE_1__["default"])({
          key: key,
          value: translatedMetaFields
        });
      } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
        (0,_component_translate_seo_fields_rank_math_seo__WEBPACK_IMPORTED_MODULE_2__["default"])({
          key: key,
          value: translatedMetaFields
        });
      } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
        elementor?.settings?.page?.model?.setExternalChange(key, translatedMetaFields);
      }
    }
    ;
  });
};
const atfpUpdateTitle = (title, service) => {
  if (title && '' !== title) {
    const translatedTitle = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslatedString('title', title, null, service);
    if (translatedTitle && '' !== translatedTitle) {
      elementor?.settings?.page?.model?.setExternalChange('post_title', translatedTitle);
    }
  }
};

// Find Elementor model by ID
const atfpFindModelById = (elements, id) => {
  for (const model of elements) {
    if (model.get('id') === id) {
      return model;
    }
    const nestedElements = model.get('elements').models;
    const foundModel = atfpFindModelById(nestedElements, id);
    if (foundModel) {
      return foundModel;
    }
  }
  return null;
};
const updateElementorPage = ({
  postContent,
  modalClose,
  service
}) => {
  const postID = elementor.config.document.id;

  // Collect translated content
  const translations = [];

  // Define a list of properties to exclude
  const cssProperties = ['content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align', 'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow', 'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'];
  const subStringsToCheck = strings => {
    const dynamicSubStrings = ['title', 'description', 'editor', 'text', 'content', 'label'];
    const staticSubStrings = ['caption', 'heading', 'sub_heading', 'testimonial_content', 'testimonial_job', 'testimonial_name', 'name'];
    return dynamicSubStrings.some(substring => strings.toLowerCase().includes(substring)) || staticSubStrings.some(substring => strings === substring);
  };
  const storeSourceStrings = (element, index, ids = []) => {
    const widgetId = element.id;
    const settings = element.settings;
    ids.push(index);

    // Check if settings is an object
    if (typeof settings === 'object' && settings !== null) {
      // Define the substrings to check for translatable content

      // Iterate through the keys in settings
      Object.keys(settings).forEach(key => {
        // Skip keys that are CSS properties
        if (cssProperties.some(substring => key.toLowerCase().includes(substring))) {
          return; // Skip this property and continue to the next one
        }

        // Check if the key includes any of the specified substrings
        if (subStringsToCheck(key) && typeof settings[key] === 'string' && settings[key].trim() !== '') {
          const uniqueKey = ids.join('_atfp_') + '_atfp_settings_atfp_' + key;
          const translatedData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslatedString('content', settings[key], uniqueKey, service);
          translations.push({
            ID: widgetId,
            key: key,
            translatedContent: translatedData
          });
        }

        // Check for arrays (possible repeater fields) within settings
        if (Array.isArray(settings[key])) {
          settings[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              // Check for translatable content in repeater fields
              Object.keys(item).forEach(repeaterKey => {
                // Skip if it's a CSS-related property
                if (cssProperties.includes(repeaterKey.toLowerCase())) {
                  return; // Skip this property
                }
                if (subStringsToCheck(repeaterKey) && typeof item[repeaterKey] === 'string' && item[repeaterKey].trim() !== '') {
                  const fieldKey = `${key}[${index}].${repeaterKey}`;
                  const uniqueKey = ids.join('_atfp_') + '_atfp_settings_atfp_' + key + '_atfp_' + index + '_atfp_' + repeaterKey;
                  const translatedData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslatedString('content', item[repeaterKey], uniqueKey, service);
                  translations.push({
                    ID: widgetId,
                    key: fieldKey,
                    translatedContent: translatedData
                  });
                }
              });
            }
          });
        }
      });
    }

    // If there are nested elements, process them recursively
    if (element.elements && Array.isArray(element.elements)) {
      element.elements.forEach((nestedElement, index) => {
        storeSourceStrings(nestedElement, index, [...ids, 'elements']);
      });
    }
  };
  postContent.widgetsContent.map((widget, index) => storeSourceStrings(widget, index, []));

  // Update widget content with translations
  atfpUpdateWidgetContent(translations);

  // Update Meta Fields
  atfpUpdateMetaFields(postContent.metaFields, service);

  // Update Title
  atfpUpdateTitle(postContent.title, service);
  const replaceSourceString = () => {
    const elementorData = atfp_global_object.elementorData;
    const translateStrings = wp.data.select('block-atfp/translate').getTranslationEntry();
    translateStrings.forEach(translation => {
      const sourceString = translation.source;
      const ids = translation.id;
      const translatedContent = translation.translatedData;
      const type = translation.type;
      if (!sourceString || '' === sourceString || 'content' !== type) {
        return;
      }
      const keyArray = ids.split('_atfp_');
      const translateValue = translatedContent[service];
      let parentElement = null;
      let parentKey = null;
      let currentElement = elementorData;
      keyArray.forEach(key => {
        parentElement = currentElement;
        parentKey = key;
        currentElement = currentElement ? currentElement[key] : null;
      });
      if (parentElement && parentKey && parentElement[parentKey] && parentElement[parentKey] === sourceString) {
        parentElement[parentKey] = translateValue;
      }
    });
    return elementorData;
  };
  const elementorData = replaceSourceString();
  const requestBody = {
    action: atfp_global_object.update_elementor_data,
    post_id: postID,
    elementor_data: JSON.stringify(elementorData),
    atfp_nonce: atfp_global_object.ajax_nonce
  };
  fetch(atfp_global_object.ajax_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(requestBody)
  }).then(response => response.json()).then(data => {
    if (data.success) {
      const translateButton = document.querySelector('.atfp-translate-button[name="atfp_meta_box_translate"]');
      if (translateButton) {
        translateButton.setAttribute('title', 'Translation process completed successfully.');
      }
    } else {
      console.error('Failed to update Elementor data:', data.data);
    }
    modalClose();
  }).catch(error => {
    modalClose();
    console.error('Error updating Elementor data:', error);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (updateElementorPage);

/***/ }),

/***/ "./src/automatic-translate/create-translated-post/gutenberg/create-block.js":
/*!**********************************************************************************!*\
  !*** ./src/automatic-translate/create-translated-post/gutenberg/create-block.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_filter_nested_attr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component/filter-nested-attr */ "./src/automatic-translate/component/filter-nested-attr/index.js");


/**
 * Filters and translates attributes of a block based on provided rules.
 * 
 * @param {Object} block - The block to filter and translate attributes for.
 * @param {Object} blockParseRules - The rules for parsing the block.
 * @returns {Object} The updated block with translated attributes.
 */
const filterTranslateAttr = (block, blockParseRules, service) => {
  const {
    select
  } = wp.data;
  const filterAttrArr = Object.values(blockParseRules);
  const blockAttr = block.attributes;
  const blockId = block.clientId;

  // Function to update a nested attribute in the block
  const updateNestedAttribute = (obj, path, value) => {
    const newObj = {
      ...obj
    };
    let current = newObj;
    for (let i = 0; i < path.length - 1; i++) {
      if (Object.getPrototypeOf(current[path[i]]) === Array.prototype) {
        current[path[i]] = [...current[path[i]]];
      } else {
        current[path[i]] = {
          ...current[path[i]]
        }; // Create a shallow copy
      }
      current = current[path[i]];
    }
    if (current[path[path.length - 1]] instanceof wp.richText.RichTextData) {
      current[path[path.length - 1]] = value.replace(/(?<!\\)"|\\"/g, "'");
    } else {
      current[path[path.length - 1]] = value;
    }
    return newObj;
  };

  /**
   * Updates translated attributes based on provided ID array and filter attribute object.
   * 
   * @param {Array} idArr - The array of IDs to update attributes for.
   * @param {Object|Array} filterAttrObj - The filter attribute object to apply.
   */
  const updateTranslatedAttr = (idArr, filterAttrObj) => {
    if (true === filterAttrObj) {
      const newIdArr = new Array(...idArr);
      const childIdArr = new Array();
      let dynamicBlockAttr = blockAttr;
      let uniqueId = blockId;
      newIdArr.forEach(key => {
        childIdArr.push(key);
        uniqueId += `atfp${key}`;
        dynamicBlockAttr = dynamicBlockAttr ? dynamicBlockAttr[key] : dynamicBlockAttr;
      });
      let blockAttrContent = dynamicBlockAttr;
      if (blockAttrContent instanceof wp.richText.RichTextData) {
        blockAttrContent = blockAttrContent.originalHTML;
      }
      if (undefined !== blockAttrContent && typeof blockAttrContent === 'string' && blockAttrContent.trim() !== '') {
        let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
        let translateContent = '';
        if (!/[\p{L}\p{N}]/gu.test(blockAttrContent)) {
          translateContent = blockAttrContent;
        } else {
          translateContent = select('block-atfp/translate').getTranslatedString('content', blockAttrContent, filterKey, service);
        }
        block.attributes = updateNestedAttribute(block.attributes, newIdArr, translateContent);
      }
      return;
    }
    (0,_component_filter_nested_attr__WEBPACK_IMPORTED_MODULE_0__["default"])(idArr, filterAttrObj, blockAttr, updateTranslatedAttr);
  };
  filterAttrArr.forEach(data => {
    Object.keys(data).forEach(key => {
      const idArr = new Array(key);
      updateTranslatedAttr(idArr, data[key]);
    });
  });
  return block;
};

/**
 * Creates a translated block based on the provided block, child block, translate handler, and block rules.
 * If the block name is included in the block rules, it filters and translates the attributes accordingly.
 * 
 * @param {Object} block - The block to create a translated version of.
 * @param {Array} childBlock - The child blocks associated with the main block.
 * @param {Object} blockRules - The rules for translating blocks.
 * @param {String} service - The service to use for translation.
 * @returns {Object} The newly created translated block.
 */
const createTranslatedBlock = (block, childBlock, blockRules, service) => {
  const {
    createBlock
  } = wp.blocks;
  const {
    name: blockName,
    attributes
  } = block;
  const blockTranslateName = Object.keys(blockRules.AtfpBlockParseRules);
  let attribute = {
    ...attributes
  };
  let translatedBlock = block;
  let newBlock = '';
  if (blockTranslateName.includes(block.name)) {
    translatedBlock = filterTranslateAttr(block, blockRules['AtfpBlockParseRules'][block.name], service);
    attribute = translatedBlock.attributes;
  }
  newBlock = createBlock(blockName, attribute, childBlock);
  return newBlock;
};

/**
 * Creates a child block recursively by translating each inner block based on the provided block, translate handler, and block rules.
 * 
 * @param {Object} block - The block to create a child block for.
 * @param {Object} blockRules - The rules for translating blocks.
 * @returns {Object} The newly created translated child block.
 */
const cretaeChildBlock = (block, blockRules, service) => {
  let childBlock = block.innerBlocks.map(block => {
    if (block.name) {
      const childBlock = cretaeChildBlock(block, blockRules, service);
      return childBlock;
    }
  });
  const newBlock = createTranslatedBlock(block, childBlock, blockRules, service);
  return newBlock;
};

/**
 * Creates the main blocks based on the provided block, translate handler, and block rules.
 * If the block name exists, it creates the main block along with its child blocks and inserts it into the block editor.
 * 
 * @param {Object} block - The main block to create.
 * @param {Object} blockRules - The rules for translating blocks.
 */
const createBlocks = (block, service) => {
  const {
    select
  } = wp.data;
  const blockRules = select('block-atfp/translate').getBlockRules();
  const {
    dispatch
  } = wp.data;
  const {
    name: blockName
  } = block;
  // Create the main block
  if (blockName) {
    let childBlock = block.innerBlocks.map(block => {
      if (block.name) {
        return cretaeChildBlock(block, blockRules, service);
      }
    });
    const parentBlock = createTranslatedBlock(block, childBlock, blockRules, service);
    dispatch('core/block-editor').insertBlock(parentBlock);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBlocks);

/***/ }),

/***/ "./src/automatic-translate/create-translated-post/gutenberg/index.js":
/*!***************************************************************************!*\
  !*** ./src/automatic-translate/create-translated-post/gutenberg/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _create_block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-block */ "./src/automatic-translate/create-translated-post/gutenberg/create-block.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _component_translate_seo_fields_yoast_seo_fields__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../component/translate-seo-fields/yoast-seo-fields */ "./src/automatic-translate/component/translate-seo-fields/yoast-seo-fields.js");
/* harmony import */ var _component_translate_seo_fields_rank_math_seo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../component/translate-seo-fields/rank-math-seo */ "./src/automatic-translate/component/translate-seo-fields/rank-math-seo.js");
/* harmony import */ var _component_translate_seo_fields_seo_press__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../component/translate-seo-fields/seo-press */ "./src/automatic-translate/component/translate-seo-fields/seo-press.js");






/**
 * Translates the post content and updates the post title, excerpt, and content.
 * 
 * @param {Object} props - The properties containing post content, translation function, and block rules.
 */
const translatePost = props => {
  const {
    editPost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('core/editor');
  const {
    modalClose,
    postContent,
    service
  } = props;

  /**
   * Updates the post title and excerpt text based on translation.
   */
  const postDataUpdate = () => {
    const data = {};
    const editPostData = Object.keys(postContent).filter(key => ['title', 'excerpt'].includes(key));
    editPostData.forEach(key => {
      const sourceData = postContent[key];
      if (sourceData.trim() !== '') {
        const translateContent = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getTranslatedString(key, sourceData, null, service);
        data[key] = translateContent;
      }
    });
    editPost(data);
  };

  /**
   * Updates the post meta fields based on translation.
   */
  const postMetaFieldsUpdate = () => {
    const metaFieldsData = postContent.metaFields;
    if (!metaFieldsData && Object.keys(metaFieldsData).length < 1) {
      return;
    }
    const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getAllowedMetaFields();
    Object.keys(metaFieldsData).forEach(key => {
      // Update yoast seo meta fields
      if (Object.keys(AllowedMetaFields).includes(key)) {
        const translatedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getTranslatedString('metaFields', metaFieldsData[key][0], key, service);
        if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
          (0,_component_translate_seo_fields_yoast_seo_fields__WEBPACK_IMPORTED_MODULE_2__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
          (0,_component_translate_seo_fields_rank_math_seo__WEBPACK_IMPORTED_MODULE_3__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
          (0,_component_translate_seo_fields_seo_press__WEBPACK_IMPORTED_MODULE_4__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else {
          editPost({
            meta: {
              [key]: translatedMetaFields
            }
          });
        }
      }
      ;
    });
  };

  /**
   * Updates the post ACF fields based on translation.
   */
  const postAcfFieldsUpdate = () => {
    const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getAllowedMetaFields();
    const metaFieldsData = postContent.metaFields;
    if (window.acf) {
      acf.getFields().forEach(field => {
        const fieldData = JSON.parse(JSON.stringify({
          key: field.data.key,
          type: field.data.type,
          name: field.data.name
        }));
        let repeaterField = false;
        // Update repeater fields
        if (field.$el && field.$el.closest('.acf-field.acf-field-repeater') && field.$el.closest('.acf-field.acf-field-repeater').length > 0) {
          const rowId = field.$el.closest('.acf-row').data('id');
          const repeaterItemName = field.$el.closest('.acf-field.acf-field-repeater').data('name');
          if (rowId && '' !== rowId) {
            const index = rowId.replace('row-', '');
            fieldData.name = repeaterItemName + '_' + index + '_' + fieldData.name;
            repeaterField = true;
          }
        }
        if (field.data && field.data.key && Object.keys(AllowedMetaFields).includes(fieldData.name)) {
          const fieldName = field.data.name;
          const inputType = field.data.type;
          const sourceValue = metaFieldsData[fieldName] && metaFieldsData[fieldName][0] ? metaFieldsData[fieldName][0] : field?.val();
          const translatedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-catfp/translate').getTranslatedString('metaFields', sourceValue, fieldData.name, service);
          console.log(sourceValue);
          console.log(metaFieldsData);
          console.log(translatedMetaFields);
          if (!translatedMetaFields || '' === translatedMetaFields) {
            return;
          }
          if ('wysiwyg' === inputType && window.tinymce) {
            const editorId = field.data.id;
            tinymce.get(editorId)?.setContent(translatedMetaFields);
          } else {
            field.val(translatedMetaFields);
          }
        }
      });
    }
  };

  /**
   * Updates the post content based on translation.
   */
  const postContentUpdate = () => {
    const postContentData = postContent.content;
    if (postContentData.length <= 0) {
      return;
    }
    Object.values(postContentData).forEach(block => {
      (0,_create_block__WEBPACK_IMPORTED_MODULE_0__["default"])(block, service);
    });
  };

  // Update post title and excerpt text
  postDataUpdate();
  // Update post meta fields
  postMetaFieldsUpdate();
  // Update post ACF fields
  postAcfFieldsUpdate();
  // Update post content
  postContentUpdate();
  // Close string modal box
  modalClose();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (translatePost);

/***/ }),

/***/ "./src/automatic-translate/fetch-post/elementor/index.js":
/*!***************************************************************!*\
  !*** ./src/automatic-translate/fetch-post/elementor/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _allowed_meta_fields__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../allowed-meta-fields */ "./src/automatic-translate/allowed-meta-fields.js");
/* harmony import */ var _store_source_string_elementor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../store-source-string/elementor */ "./src/automatic-translate/store-source-string/elementor/index.js");




// Update allowed meta fields
const updateAllowedMetaFields = data => {
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').allowedMetaFields(data);
};
const fetchPostContent = async props => {
  const elementorPostData = atfp_global_object.elementorData && typeof atfp_global_object.elementorData === 'string' ? JSON.parse(atfp_global_object.elementorData) : atfp_global_object.elementorData;
  const content = {
    widgetsContent: elementorPostData,
    metaFields: atfp_global_object?.metaFields || {}
  };
  if (atfp_global_object.parent_post_title && '' !== atfp_global_object.parent_post_title) {
    content.title = atfp_global_object.parent_post_title;
  }

  // Update allowed meta fields
  Object.keys(_allowed_meta_fields__WEBPACK_IMPORTED_MODULE_1__["default"]).forEach(key => {
    updateAllowedMetaFields({
      id: key,
      type: _allowed_meta_fields__WEBPACK_IMPORTED_MODULE_1__["default"][key].type
    });
  });
  (0,_store_source_string_elementor__WEBPACK_IMPORTED_MODULE_2__["default"])(content);
  props.refPostData(content);
  props.updatePostDataFetch(true);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchPostContent);

/***/ }),

/***/ "./src/automatic-translate/fetch-post/gutenberg/index.js":
/*!***************************************************************!*\
  !*** ./src/automatic-translate/fetch-post/gutenberg/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _store_source_string_gutenberg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../store-source-string/gutenberg */ "./src/automatic-translate/store-source-string/gutenberg/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _allowed_meta_fields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../allowed-meta-fields */ "./src/automatic-translate/allowed-meta-fields.js");





const GutenbergPostFetch = async props => {
  const apiUrl = atfp_global_object.ajax_url;
  let blockRules = wp.data.select('block-atfp/translate').getBlockRules() || {};
  const apiController = [];
  const destroyHandler = () => {
    apiController.forEach(controller => {
      controller.abort('Modal Closed');
    });
  };
  props.updateDestroyHandler(() => {
    destroyHandler();
  });

  // Update allowed meta fields
  const updateAllowedMetaFields = data => {
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').allowedMetaFields(data);
  };

  // Update ACF fields allowed meta fields
  const AcfFields = () => {
    const postMetaSync = atfp_global_object.postMetaSync === 'true';
    if (window.acf && !postMetaSync) {
      const allowedTypes = ['text', 'textarea', 'wysiwyg'];
      acf.getFields().forEach(field => {
        if (field.data && allowedTypes.includes(field.data.type)) {
          updateAllowedMetaFields({
            id: field.data.key,
            type: field.data.type
          });
        }
      });
    }
  };

  // Update allowed meta fields
  Object.keys(_allowed_meta_fields__WEBPACK_IMPORTED_MODULE_4__["default"]).forEach(key => {
    updateAllowedMetaFields({
      id: key,
      type: _allowed_meta_fields__WEBPACK_IMPORTED_MODULE_4__["default"][key].type
    });
  });

  // Update ACF fields allowed meta fields
  AcfFields();
  const BlockParseFetch = async () => {
    if (blockRules && blockRules.AtfpBlockParseRules && Object.keys(blockRules.AtfpBlockParseRules).length > 0) {
      return;
    }
    const blockRulesApiSendData = {
      atfp_nonce: atfp_global_object.ajax_nonce,
      action: atfp_global_object.action_block_rules
    };
    const rulesController = new AbortController();
    apiController.push(rulesController);
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(blockRulesApiSendData),
      signal: rulesController.signal
    }).then(response => response.json()).then(data => {
      blockRules = JSON.parse(data.data.blockRules);
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').setBlockRules(blockRules);
    }).catch(error => {
      console.error('Error fetching post content:', error);
    });
  };
  await BlockParseFetch();
  const ContentFetch = async () => {
    const contentFetchStatus = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').contentFetchStatus();
    if (contentFetchStatus) {
      return;
    }

    /**
    * Prepare data to send in API request.
    */
    const apiSendData = {
      postId: parseInt(props.postId),
      local: props.targetLang,
      current_local: props.sourceLang,
      atfp_nonce: atfp_global_object.ajax_nonce,
      action: atfp_global_object.action_fetch
    };
    const contentController = new AbortController();
    apiController.push(contentController);

    /**
     * useEffect hook to fetch post data from the specified API endpoint.
     * Parses the response data and updates the state accordingly.
     * Handles errors in fetching post content.
     */
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(apiSendData),
      signal: contentController.signal
    }).then(response => response.json()).then(data => {
      const contentFetchStatus = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').contentFetchStatus();
      if (contentFetchStatus) {
        return;
      }
      const post_data = data.data;
      if (post_data.content && post_data.content.trim() !== '') {
        post_data.content = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.parse)(post_data.content);
      }
      (0,_store_source_string_gutenberg__WEBPACK_IMPORTED_MODULE_0__["default"])(post_data, blockRules);
      props.refPostData(post_data);
      props.updatePostDataFetch(true);
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').contentFetchStatus(true);
    }).catch(error => {
      console.error('Error fetching post content:', error);
    });
  };
  await ContentFetch();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GutenbergPostFetch);

/***/ }),

/***/ "./src/automatic-translate/global-store/actions.js":
/*!*********************************************************!*\
  !*** ./src/automatic-translate/global-store/actions.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allowedMetaFields: () => (/* binding */ allowedMetaFields),
/* harmony export */   contentFetchStatus: () => (/* binding */ contentFetchStatus),
/* harmony export */   contentSaveSource: () => (/* binding */ contentSaveSource),
/* harmony export */   contentSaveTranslate: () => (/* binding */ contentSaveTranslate),
/* harmony export */   excerptSaveSource: () => (/* binding */ excerptSaveSource),
/* harmony export */   excerptSaveTranslate: () => (/* binding */ excerptSaveTranslate),
/* harmony export */   metaFieldsSaveSource: () => (/* binding */ metaFieldsSaveSource),
/* harmony export */   metaFieldsSaveTranslate: () => (/* binding */ metaFieldsSaveTranslate),
/* harmony export */   setBlockRules: () => (/* binding */ setBlockRules),
/* harmony export */   titleSaveSource: () => (/* binding */ titleSaveSource),
/* harmony export */   titleSaveTranslate: () => (/* binding */ titleSaveTranslate),
/* harmony export */   translationInfo: () => (/* binding */ translationInfo)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/automatic-translate/global-store/types.js");
 // Importing action types from the types module

/**
 * Action creator for saving the source title.
 * @param {string} data - The source title to be saved.
 * @returns {Object} The action object containing the type and text.
 */
const titleSaveSource = data => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceTitle,
    // Action type for saving the source title
    text: data // The source title text
  };
};

/**
 * Action creator for saving the translated title.
 * @param {string} data - The translated title to be saved.
 * @param {string} provider - The provider of the translated title.
 * @returns {Object} The action object containing the type, text, and provider.
 */
const titleSaveTranslate = (data, provider) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedTitle,
    // Action type for saving the translated title
    text: data,
    // The translated title text
    provider: provider // The provider of the translated title
  };
};

/**
 * Action creator for saving the source excerpt.
 * @param {string} data - The source excerpt to be saved.
 * @returns {Object} The action object containing the type and text.
 */
const excerptSaveSource = data => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceExcerpt,
    // Action type for saving the source excerpt
    text: data // The source excerpt text
  };
};

/**
 * Action creator for saving the translated excerpt.
 * @param {string} data - The translated excerpt to be saved.
 * @param {string} provider - The provider of the translated excerpt.
 * @returns {Object} The action object containing the type, text, and provider.
 */
const excerptSaveTranslate = (data, provider) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedExcerpt,
    // Action type for saving the translated excerpt
    text: data,
    // The translated excerpt text
    provider: provider // The provider of the translated excerpt
  };
};

/**
 * Action creator for saving the source content.
 * @param {string} id - The identifier for the content.
 * @param {string} data - The source content to be saved.
 * @returns {Object} The action object containing the type, text, and id.
 */
const contentSaveSource = (id, data) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceContent,
    // Action type for saving the source content
    text: data,
    // The source content text
    id: id // The identifier for the content
  };
};

/**
 * Action creator for saving the translated content.
 * @param {string} id - The identifier for the content.
 * @param {string} data - The translated content to be saved.
 * @param {string} source - The source of the translated content.
 * @param {string} provider - The provider of the translated content.
 * @returns {Object} The action object containing the type, text, id, source, and provider.
 */
const contentSaveTranslate = (id, data, source, provider) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedContent,
    // Action type for saving the translated content
    text: data,
    // The translated content text
    id: id,
    // The identifier for the content
    source: source,
    // The source of the translated content
    provider: provider // The provider of the translated content
  };
};

/**
 * Action creator for saving the source meta fields.
 * @param {string} id - The identifier for the meta fields.
 * @param {Object} data - The source meta fields to be saved.
 * @returns {Object} The action object containing the type, text, and id.
 */
const metaFieldsSaveSource = (id, data) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceMetaFields,
    // Action type for saving the source meta fields
    text: data,
    // The source meta fields text
    id: id // The identifier for the meta fields
  };
};

/**
 * Action creator for saving the translated meta fields.
 * @param {string} id - The identifier for the meta fields.
 * @param {Object} data - The translated meta fields to be saved.
 * @param {string} source - The source of the translated meta fields.
 * @param {string} provider - The provider of the translated meta fields.
 * @returns {Object} The action object containing the type, text, id, source, and provider.
 */
const metaFieldsSaveTranslate = (id, data, source, provider) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedMetaFields,
    // Action type for saving the translated meta fields
    text: data,
    // The translated meta fields text
    id: id,
    // The identifier for the meta fields
    source: source,
    // The source of the translated meta fields
    provider: provider // The provider of the translated meta fields
  };
};

/**
 * Action creator for saving the block rules.
 * @param {Object} data - The block rules to be saved.
 * @returns {Object} The action object containing the type and data.
 */
const setBlockRules = data => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].setBlockRules,
    // Action type for saving the block rules
    data: data // The block rules data
  };
};

/**
 * Action creator for saving the translation info.
 * @param {Object} data - The translation info to be saved.
 * @returns {Object} The action object containing the type and data.
 */
const translationInfo = ({
  sourceStringCount = null,
  sourceWordCount = null,
  sourceCharacterCount = null,
  timeTaken = null,
  provider = null,
  targetStringCount = null,
  targetWordCount = null,
  targetCharacterCount = null,
  translateStatus = null
}) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].translationInfo,
    // Action type for saving the translation info
    sourceStringCount: sourceStringCount,
    sourceWordCount: sourceWordCount,
    sourceCharacterCount: sourceCharacterCount,
    // The character count
    timeTaken: timeTaken,
    // The time taken
    targetStringCount: targetStringCount,
    targetWordCount: targetWordCount,
    targetCharacterCount: targetCharacterCount,
    provider: provider,
    // The provider
    translateStatus: translateStatus // The translate status
  };
};

/**
 * Action creator for saving the allowed meta fields.
 * @param {Object} data - The allowed meta fields to be saved.
 * @returns {Object} The action object containing the type and data.
 */
const allowedMetaFields = ({
  id,
  type
}) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].allowedMetaFields,
    id: id,
    inputType: type
  };
};

/**
 * Action creator for saving the content fetch status.
 * @param {boolean} status - The content fetch status to be saved.
 * @returns {Object} The action object containing the type and status.
 */
const contentFetchStatus = status => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].contentFetchStatus,
    status: status
  };
};

/***/ }),

/***/ "./src/automatic-translate/global-store/index.js":
/*!*******************************************************!*\
  !*** ./src/automatic-translate/global-store/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reducer */ "./src/automatic-translate/global-store/reducer.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ "./src/automatic-translate/global-store/actions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/automatic-translate/global-store/selectors.js");
/**
 * This module sets up a Redux store for the automatic translation block.
 * It imports the necessary reducer, actions, and selectors, and then
 * creates and registers the Redux store with the WordPress data system.
 */

// Import the reducer function from the reducer module, which handles state changes.


// Import all action creators from the actions module, which define how to interact with the store.


// Import all selector functions from the selectors module, which allow us to retrieve specific pieces of state.


// Destructure the createReduxStore and register functions from the wp.data object provided by WordPress.
const {
  createReduxStore,
  register
} = wp.data;

// Create a Redux store named 'block-atfp/translate' with the specified reducer, actions, and selectors.
const store = createReduxStore('block-atfp/translate', {
  reducer: _reducer__WEBPACK_IMPORTED_MODULE_0__["default"],
  // The reducer function to manage state updates.
  actions: _actions__WEBPACK_IMPORTED_MODULE_1__,
  // The action creators for dispatching actions to the store.
  selectors: _selectors__WEBPACK_IMPORTED_MODULE_2__ // The selectors for accessing specific state values.
});

// Register the created store with the WordPress data system, making it available for use in the application.
register(store);

/***/ }),

/***/ "./src/automatic-translate/global-store/reducer.js":
/*!*********************************************************!*\
  !*** ./src/automatic-translate/global-store/reducer.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/automatic-translate/global-store/types.js");
 // Importing action types from the types module

/**
 * The default state for the translation reducer.
 * This state holds the initial values for title, excerpt, content, and metaFields.
 * 
 * @type {Object}
 * @property {Object} title - Contains source and target translations for the title.
 * @property {Object} excerpt - Contains source and target translations for the excerpt.
 * @property {Array} content - An array holding content translations.
 * @property {Object} metaFields - Contains source and target translations for meta fields.
 */
const TranslateDefaultState = {
  title: {},
  // Initial state for title translations
  excerpt: {},
  // Initial state for excerpt translations
  content: [],
  // Initial state for content translations
  metaFields: {},
  // Initial state for meta field translations
  allowedMetaFields: {},
  // Initial state for allowed meta fields
  contentFetchStatus: false // Initial state for content fetch status
};

/**
 * The reducer function for handling translation actions.
 * This function updates the state based on the action type received.
 * 
 * @param {Object} state - The current state of the reducer.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} The new state after applying the action.
 */
const reducer = (state = TranslateDefaultState, action) => {
  switch (action.type) {
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceTitle:
      // Action to save the source title
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source title
        return {
          ...state,
          title: {
            ...state.title,
            source: action.text
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedTitle:
      // Action to save the translated title
      // Update the state with the new target title
      return {
        ...state,
        title: {
          ...state.title,
          translatedData: {
            ...(state.title.translatedData || []),
            [action.provider]: action.text
          }
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceExcerpt:
      // Action to save the source excerpt
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source excerpt
        return {
          ...state,
          excerpt: {
            ...state.excerpt,
            source: action.text
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedExcerpt:
      // Action to save the translated excerpt
      // Update the state with the new target excerpt
      return {
        ...state,
        excerpt: {
          ...state.excerpt,
          translatedData: {
            ...(state.excerpt.translatedData || []),
            [action.provider]: action.text
          }
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceContent:
      // Action to save the source content
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source content for the specific ID
        return {
          ...state,
          content: {
            ...state.content,
            [action.id]: {
              ...(state.content[action.id] || []),
              source: action.text
            }
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedContent:
      // Action to save the translated content
      // Check if the source of the content matches the action source
      if (state.content[action.id].source === action.source) {
        // Update the state with the new target content for the specific ID
        return {
          ...state,
          content: {
            ...state.content,
            [action.id]: {
              ...(state.content[action.id] || []),
              translatedData: {
                ...(state.content[action.id].translatedData || []),
                [action.provider]: action.text
              }
            }
          }
        };
      }
      return state;
    // Return the current state if no match

    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceMetaFields:
      // Action to save the source meta fields
      // Check if the action text contains any letters or numbers
      if (/[\p{L}\p{N}]/gu.test(action.text)) {
        // Update the state with the new source meta field for the specific ID
        return {
          ...state,
          metaFields: {
            ...state.metaFields,
            [action.id]: {
              ...(state.metaFields[action.id] || []),
              source: action.text
            }
          }
        };
      }
      return state;
    // Return the current state if no valid text

    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedMetaFields:
      // Action to save the translated meta fields
      // Update the state with the new target meta field for the specific ID
      return {
        ...state,
        metaFields: {
          ...state.metaFields,
          [action.id]: {
            ...(state.metaFields[action.id] || []),
            translatedData: {
              ...(state.metaFields[action.id].translatedData || []),
              [action.provider]: action.text
            }
          }
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].setBlockRules:
      // Action to save the block rules
      // Update the state with the new block rules
      return {
        ...state,
        blockRules: action.data
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].translationInfo:
      // Action to save the translation info
      // Update the state with the new translation info
      const data = {};

      // Source String Count
      action.sourceStringCount && (data.sourceStringCount = action.sourceStringCount);
      // Source Word Count
      action.sourceWordCount && (data.sourceWordCount = action.sourceWordCount);
      // Source Character Count
      action.sourceCharacterCount && (data.sourceCharacterCount = action.sourceCharacterCount);

      // Save the translation info like target word count, target character count, translate status, time taken
      if ((action.targetWordCount || action.targetCharacterCount || action.translateStatus || action.timeTaken) && action.provider) {
        data.translateData = {
          ...(state.translationInfo?.translateData || {}),
          [action.provider]: {
            // If the provider already exists, update the existing provider data    
            ...(state.translationInfo?.translateData?.[action.provider] || {}),
            // Update the source string count
            ...(action.targetStringCount && {
              targetStringCount: action.targetStringCount
            }),
            // Update the target word count, target character count, translate status, time taken
            ...(action.targetWordCount && {
              targetWordCount: action.targetWordCount
            }),
            // Update the target character count
            ...(action.targetCharacterCount && {
              targetCharacterCount: action.targetCharacterCount
            }),
            // Update the translate status
            ...(action.translateStatus && {
              translateStatus: action.translateStatus
            }),
            // Update the time taken
            ...(action.timeTaken && {
              timeTaken: action.timeTaken
            })
          }
        };
      }
      return {
        ...state,
        translationInfo: {
          ...state.translationInfo,
          ...data
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].allowedMetaFields:
      // Action to save the allowed meta fields
      // Update the state with the new allowed meta fields
      return {
        ...state,
        allowedMetaFields: {
          ...state.allowedMetaFields,
          [action.id]: {
            ...(state.allowedMetaFields[action.id] || []),
            inputType: action.inputType
          }
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].contentFetchStatus:
      // Action to save the content fetch status
      // Update the state with the new content fetch status
      return {
        ...state,
        contentFetchStatus: action.status
      };
    default:
      // If the action type does not match any case
      return state;
    // Return the current state unchanged
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer); // Exporting the reducer as the default export

/***/ }),

/***/ "./src/automatic-translate/global-store/selectors.js":
/*!***********************************************************!*\
  !*** ./src/automatic-translate/global-store/selectors.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contentFetchStatus: () => (/* binding */ contentFetchStatus),
/* harmony export */   getAllowedMetaFields: () => (/* binding */ getAllowedMetaFields),
/* harmony export */   getBlockRules: () => (/* binding */ getBlockRules),
/* harmony export */   getTranslatedString: () => (/* binding */ getTranslatedString),
/* harmony export */   getTranslationEntry: () => (/* binding */ getTranslationEntry),
/* harmony export */   getTranslationInfo: () => (/* binding */ getTranslationInfo)
/* harmony export */ });
/**
 * Retrieves the translation entries from the given state.
 *
 * This function extracts translation entries for the title, excerpt, meta fields, and content
 * from the provided state object and returns them as an array of translation entry objects.
 *
 * @param {Object} state - The state object containing translation data.
 * @param {Object} state.title - The title object containing source and target translations.
 * @param {Object} state.excerpt - The excerpt object containing source and target translations.
 * @param {Object} state.metaFields - An object containing meta field translations, where each key is a meta field ID.
 * @param {Object} state.content - An object containing content translations, where each key is a content ID.
 * @returns {Array<Object>} An array of translation entry objects, each containing the following properties:
 *   @property {string} id - The identifier of the translation entry.
 *   @property {string} source - The source text of the translation entry.
 *   @property {string} type - The type of the translation entry (e.g., 'title', 'excerpt', 'metaFields', 'content').
 *   @property {string} translatedData - The target text of the translation entry (default is an empty string if not provided).
 */
const getTranslationEntry = state => {
  // Initialize an empty array to hold translation entries
  const translateEntry = new Array();
  if (state.title.source) {
    // Push the title translation entry into the array
    translateEntry.push({
      id: 'title',
      // Identifier for the entry
      source: state.title.source,
      // Source text for the title
      type: 'title',
      // Type of the entry
      translatedData: state.title.translatedData || {} // translated text for the title, defaulting to an empty string if not provided
    });
  }
  if (state.excerpt.source) {
    // Push the excerpt translation entry into the array
    translateEntry.push({
      id: 'excerpt',
      // Identifier for the entry
      source: state.excerpt.source,
      // Source text for the excerpt
      type: 'excerpt',
      // Type of the entry
      translatedData: state.excerpt.translatedData || {} // translated text for the excerpt, defaulting to an empty string if not provided
    });
  }

  // Iterate over the metaFields object keys and push each translation entry into the array
  Object.keys(state.metaFields).map(key => {
    translateEntry.push({
      type: 'metaFields',
      // Type of the entry
      id: key,
      // Identifier for the meta field
      source: state.metaFields[key].source,
      // Source text for the meta field
      translatedData: state.metaFields[key].translatedData || {} // translated text for the meta field, defaulting to an empty string if not provided
    });
  });

  // Iterate over the content object keys and push each translation entry into the array
  Object.keys(state.content).map(key => {
    translateEntry.push({
      type: 'content',
      // Type of the entry
      id: key,
      // Identifier for the content
      source: state.content[key].source,
      // Source text for the content
      translatedData: state.content[key].translatedData || {} // translated text for the content, defaulting to an empty string if not provided
    });
  });

  // Return the array of translation entries
  return translateEntry;
};

/**
 * Retrieves the block rules from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The block rules data.
 */
const getBlockRules = state => {
  return state.blockRules;
};

/**
 * Retrieves the translated string from the given state.
 *
 * This function extracts the translated string for a given type (title, excerpt, metaFields, or content)
 * from the provided state object and returns it.
 *
 * @param {Object} state - The state object containing translation data.
 * @param {string} type - The type of the translation entry (e.g., 'title', 'excerpt', 'metaFields', 'content').
 * @param {string} source - The source text of the translation entry.
 * @param {string} id - The identifier of the translation entry (optional, used for metaFields and content).
 * @param {string} provider - The provider of the translation (optional, used for metaFields and content).
 * @returns {string} The translated string for the given type and source, or the original source text if no translation is found.
 */
const getTranslatedString = (state, type, source, id = null, provider = null) => {
  // Check if the type is 'title' or 'excerpt' and if the source matches
  if (['title', 'excerpt'].includes(type) && state[type].source === source && state[type].translatedData && state[type].translatedData[provider]) {
    return state[type]?.translatedData[provider] || state[type]?.source; // Return the translatedData if it matches
  }
  // Check if the type is 'metaFields' and if the source matches
  else if (type === 'metaFields' && state.metaFields && state.metaFields[id] && state.metaFields[id].source === source && state.metaFields[id].translatedData && state.metaFields[id].translatedData[provider]) {
    // Return the target text if it exists, otherwise return the source text
    return undefined !== state.metaFields[id]?.translatedData[provider] ? state.metaFields[id]?.translatedData[provider] : state.metaFields[id]?.source;
  }
  // Check if the type is 'content' and if the source matches
  else if (type === 'content' && state.content && state.content[id] && state.content[id].source === source && state.content[id].translatedData && state.content[id].translatedData[provider]) {
    // Return the target text if it exists, otherwise return the source text
    return undefined !== state.content[id]?.translatedData[provider] ? state.content[id]?.translatedData[provider] : state.content[id]?.source;
  }
  // If no matches, return the original source text
  return source;
};

/**
 * Retrieves the translation info from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The translation info.
 */
const getTranslationInfo = state => {
  return {
    sourceStringCount: state?.translationInfo?.sourceStringCount || 0,
    sourceWordCount: state?.translationInfo?.sourceWordCount || 0,
    sourceCharacterCount: state?.translationInfo?.sourceCharacterCount || 0,
    translateData: state?.translationInfo?.translateData || {}
  };
};

/** 
 * Retrieves the allowed meta fields from the given state.
 * @param {Object} state - The state object containing translation data.
 * @returns {Object} The allowed meta fields.
 */
const getAllowedMetaFields = state => {
  return state.allowedMetaFields || {};
};
const contentFetchStatus = state => {
  return state.contentFetchStatus;
};

/***/ }),

/***/ "./src/automatic-translate/global-store/types.js":
/*!*******************************************************!*\
  !*** ./src/automatic-translate/global-store/types.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * AtfpActionTypes is an object that defines the action types used in the 
 * automatic translation feature of the application. Each property in this 
 * object corresponds to a specific action that can be dispatched to the 
 * global store, allowing the application to manage the state related to 
 * source and translated content effectively.
 */
const AtfpActionTypes = {
  // Action type for saving the title of the source content
  sourceTitle: 'SAVE_SOURCE_TITLE',
  // Action type for saving the title of the translated content
  traslatedTitle: 'SAVE_TRANSLATE_TITLE',
  // Action type for saving the excerpt of the source content
  sourceExcerpt: 'SAVE_SOURCE_EXCERPT',
  // Action type for saving the excerpt of the translated content
  traslatedExcerpt: 'SAVE_TRANSLATE_EXCERPT',
  // Action type for saving the main content of the source
  sourceContent: 'SAVE_SOURCE_CONTENT',
  // Action type for saving the main content of the translated content
  traslatedContent: 'SAVE_TRANSLATE_CONTENT',
  // Action type for saving the meta fields of the source content
  sourceMetaFields: 'SAVE_SOURCE_META_FIELDS',
  // Action type for saving the meta fields of the translated content
  traslatedMetaFields: 'SAVE_TRANSLATE_META_FIELDS',
  // Action type for saving the block rules
  setBlockRules: 'SET_BLOCK_RULES',
  // Action type for saving the translatio info of the translated content
  translationInfo: 'SAVE_TRANSLATE_INFO',
  // Action type for saving the allowed meta fields
  allowedMetaFields: 'ALLOWED_META_FIELDS',
  // Action type for saving the content fetch status
  contentFetchStatus: 'CONTENT_FETCH_STATUS'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AtfpActionTypes);

/***/ }),

/***/ "./src/automatic-translate/helper/index.js":
/*!*************************************************!*\
  !*** ./src/automatic-translate/helper/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateTranslateData: () => (/* binding */ updateTranslateData)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const updateTranslateData = ({
  provider,
  sourceLang,
  targetLang,
  postId
}) => {
  const translateData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslationInfo();
  const totalStringCount = translateData.translateData?.[provider]?.targetStringCount || 0;
  const totalWordCount = translateData.translateData?.[provider]?.targetWordCount || 0;
  const totalCharacterCount = translateData.translateData?.[provider]?.targetCharacterCount || 0;
  const timeTaken = translateData.translateData?.[provider]?.timeTaken || 0;
  const sourceWordCount = translateData?.sourceWordCount || 0;
  const sourceCharacterCount = translateData?.sourceCharacterCount || 0;
  const sourceStringCount = translateData?.sourceStringCount || 0;
  const editorType = atfp_global_object.editor_type;
  const date = new Date().toISOString();
  const data = {
    provider,
    totalStringCount,
    totalWordCount,
    totalCharacterCount,
    editorType,
    date,
    sourceStringCount,
    sourceWordCount,
    sourceCharacterCount,
    sourceLang,
    targetLang,
    timeTaken,
    action: atfp_global_object.update_translate_data,
    atfp_nonce: atfp_global_object.ajax_nonce,
    post_id: postId
  };
  fetch(atfp_global_object.ajax_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(data)
  }).then().catch(error => {
    console.error(error);
  });
};

/***/ }),

/***/ "./src/automatic-translate/popup-setting-modal/body.js":
/*!*************************************************************!*\
  !*** ./src/automatic-translate/popup-setting-modal/body.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./providers */ "./src/automatic-translate/popup-setting-modal/providers.js");
/* harmony import */ var _component_translate_provider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/translate-provider */ "./src/automatic-translate/component/translate-provider/index.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }



const SettingModalBody = props => {
  const ServiceProviders = (0,_component_translate_provider__WEBPACK_IMPORTED_MODULE_2__["default"])();
  return /*#__PURE__*/React.createElement("div", {
    className: "atfp-setting-modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-setting-modal-notice-wrapper"
  }), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Translate"), /*#__PURE__*/React.createElement("th", null, "Docs"))), /*#__PURE__*/React.createElement("tbody", null, Object.keys(ServiceProviders).map(provider => /*#__PURE__*/React.createElement(_providers__WEBPACK_IMPORTED_MODULE_1__["default"], _extends({
    key: provider
  }, props, {
    Service: provider
  }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModalBody);

/***/ }),

/***/ "./src/automatic-translate/popup-setting-modal/footer.js":
/*!***************************************************************!*\
  !*** ./src/automatic-translate/popup-setting-modal/footer.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);

const SettingModalFooter = props => {
  const {
    targetLangName,
    postType,
    sourceLangName,
    setSettingVisibility
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("p", {
    className: "atfp-error-message",
    style: {
      marginBottom: '.5rem'
    }
  }, sprintf((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("This will replace your current %(postType)s with a %(target)s translation of the original %(source)s content.", 'autopoly-ai-translation-for-polylang'), {
    postType: postType,
    source: sourceLangName,
    target: targetLangName
  })), /*#__PURE__*/React.createElement("button", {
    className: "atfp-setting-close button button-primary",
    onClick: () => setSettingVisibility(false)
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Close", 'autopoly-ai-translation-for-polylang')));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModalFooter);

/***/ }),

/***/ "./src/automatic-translate/popup-setting-modal/header.js":
/*!***************************************************************!*\
  !*** ./src/automatic-translate/popup-setting-modal/header.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);

const SettingModalHeader = ({
  setSettingVisibility
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Step 1 - Select Translation Provider", 'autopoly-ai-translation-for-polylang')), /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: () => setSettingVisibility(false)
  }, "\xD7"));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModalHeader);

/***/ }),

/***/ "./src/automatic-translate/popup-setting-modal/index.js":
/*!**************************************************************!*\
  !*** ./src/automatic-translate/popup-setting-modal/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _popup_string_modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../popup-string-modal */ "./src/automatic-translate/popup-string-modal/index.js");
/* harmony import */ var _component_translate_provider_yandex_yandex_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component/translate-provider/yandex/yandex-language */ "./src/automatic-translate/component/translate-provider/yandex/yandex-language.js");
/* harmony import */ var _component_translate_provider_local_ai_translator_local_ai_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../component/translate-provider/local-ai-translator/local-ai-translator */ "./src/automatic-translate/component/translate-provider/local-ai-translator/local-ai-translator.js");
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./header */ "./src/automatic-translate/popup-setting-modal/header.js");
/* harmony import */ var _body__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./body */ "./src/automatic-translate/popup-setting-modal/body.js");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./footer */ "./src/automatic-translate/popup-setting-modal/footer.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _component_error_modal_box__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../component/error-modal-box */ "./src/automatic-translate/component/error-modal-box/index.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }










const SettingModal = props => {
  const [targetBtn, setTargetBtn] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [modalRender, setModalRender] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const [settingVisibility, setSettingVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const sourceLang = atfp_global_object.source_lang;
  const targetLang = props.targetLang;
  const sourceLangName = atfp_global_object.languageObject[sourceLang]['name'];
  const targetLangName = atfp_global_object.languageObject[targetLang]['name'];
  const imgFolder = atfp_global_object.atfp_url + 'assets/images/';
  const yandexSupport = (0,_component_translate_provider_yandex_yandex_language__WEBPACK_IMPORTED_MODULE_3__["default"])().includes(targetLang);
  const [serviceModalErrors, setServiceModalErrors] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [errorModalVisibility, setErrorModalVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [chromeAiBtnDisabled, setChromeAiBtnDisabled] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const openModalOnLoadHandler = e => {
    e.preventDefault();
    const btnElement = e.target;
    const visibility = btnElement.dataset.value;
    if (visibility === 'yes') {
      setSettingVisibility(true);
    }
    btnElement.closest('#atfp-modal-open-warning-wrapper').remove();
  };
  const closeErrorModal = () => {
    setErrorModalVisibility(false);
    setSettingVisibility(true);
  };
  const openErrorModalHandler = service => {
    setSettingVisibility(false);
    setErrorModalVisibility(service);
  };

  /**
   * useEffect hook to set settingVisibility.
   * Triggers the setSettingVisibility only when user click on meta field Button.
  */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const firstRenderBtns = document.querySelectorAll('#atfp-modal-open-warning-wrapper .modal-content div[data-value]');
    const metaFieldBtn = document.querySelector(props.translateWrpSelector);
    if (metaFieldBtn) {
      metaFieldBtn.addEventListener('click', e => {
        e.preventDefault();
        setSettingVisibility(prev => !prev);
      });
    }
    firstRenderBtns.forEach(ele => {
      if (ele) {
        ele.addEventListener('click', openModalOnLoadHandler);
      }
    });
  }, []);

  /**
   * useEffect hook to check if the local AI translator is supported.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const languageSupportedStatus = async () => {
      const localAiTranslatorSupport = await _component_translate_provider_local_ai_translator_local_ai_translator__WEBPACK_IMPORTED_MODULE_4__["default"].languageSupportedStatus(sourceLang, targetLang, targetLangName, sourceLangName);
      const translateBtn = document.querySelector('.atfp-service-btn#atfp-local-ai-translator-btn');
      if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object' && translateBtn) {
        setChromeAiBtnDisabled(true);
        setServiceModalErrors(prev => ({
          ...prev,
          localAiTranslator: {
            message: localAiTranslatorSupport,
            Title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("Chrome AI Translator", 'autopoly-ai-translation-for-polylang')
          }
        }));
      }
    };
    if (settingVisibility) {
      if (!yandexSupport) {
        setServiceModalErrors(prev => ({
          ...prev,
          yandex: {
            message: "<p style={{ fontSize: '1rem', color: '#ff4646' }}>" + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("Yandex Translate does not support the target language: %s.", 'autopoly-ai-translation-for-polylang'), "<strong>" + targetLangName + " (" + targetLang + ")</strong>") + "</p>",
            Title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("Yandex Translate", 'autopoly-ai-translation-for-polylang')
          }
        }));
      }
      ;
      languageSupportedStatus();
    }
  }, [settingVisibility]);

  /**
   * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const btn = targetBtn;
    const service = btn.dataset && btn.dataset.service;
    const serviceLabel = btn.dataset && btn.dataset.serviceLabel;
    const postId = props.postId;
    const parentWrp = document.getElementById("atfp_strings_model");
    if (parentWrp) {
      // Store root instance in a ref to avoid recreating it
      if (!parentWrp._reactRoot) {
        parentWrp._reactRoot = react_dom_client__WEBPACK_IMPORTED_MODULE_0__.createRoot(parentWrp);
      }
      if (modalRender) {
        parentWrp._reactRoot.render(/*#__PURE__*/React.createElement(_popup_string_modal__WEBPACK_IMPORTED_MODULE_2__["default"], {
          currentPostId: props.currentPostId,
          postId: postId,
          service: service,
          serviceLabel: serviceLabel,
          sourceLang: sourceLang,
          targetLang: targetLang,
          modalRender: modalRender,
          pageTranslate: props.pageTranslate,
          postDataFetchStatus: props.postDataFetchStatus,
          fetchPostData: props.fetchPostData,
          translatePost: props.translatePost,
          contentLoading: props.contentLoading,
          updatePostDataFetch: props.updatePostDataFetch,
          stringModalBodyNotice: props.stringModalBodyNotice
        }));
      }
    }
  }, [props.postDataFetchStatus, modalRender]);

  /**
   * Function to handle fetching content based on the target button clicked.
   * Sets the target button and updates the fetch status to true.
   * @param {Event} e - The event object representing the button click.
   */
  const fetchContent = async e => {
    let targetElement = !e.target.classList.contains('atfp-service-btn') ? e.target.closest('.atfp-service-btn') : e.target;
    if (!targetElement) {
      return;
    }
    const dataService = targetElement.dataset && targetElement.dataset.service;
    setSettingVisibility(false);
    if (dataService === 'localAiTranslator') {
      const localAiTranslatorSupport = await _component_translate_provider_local_ai_translator_local_ai_translator__WEBPACK_IMPORTED_MODULE_4__["default"].languageSupportedStatus(sourceLang, targetLang, targetLangName);
      if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object') {
        return;
      }
    }
    setModalRender(prev => prev + 1);
    setTargetBtn(targetElement);
  };
  const handleSettingVisibility = visibility => {
    setSettingVisibility(visibility);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, errorModalVisibility && serviceModalErrors[errorModalVisibility] && /*#__PURE__*/React.createElement(_component_error_modal_box__WEBPACK_IMPORTED_MODULE_9__["default"], _extends({
    onClose: closeErrorModal
  }, serviceModalErrors[errorModalVisibility])), settingVisibility && /*#__PURE__*/React.createElement("div", {
    className: "modal-container",
    style: {
      display: settingVisibility ? 'flex' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-settings modal-content"
  }, /*#__PURE__*/React.createElement(_header__WEBPACK_IMPORTED_MODULE_5__["default"], {
    setSettingVisibility: handleSettingVisibility,
    postType: props.postType,
    sourceLangName: sourceLangName,
    targetLangName: targetLangName
  }), /*#__PURE__*/React.createElement(_body__WEBPACK_IMPORTED_MODULE_6__["default"], {
    yandexDisabled: !yandexSupport,
    fetchContent: fetchContent,
    imgFolder: imgFolder,
    targetLangName: targetLangName,
    postType: props.postType,
    sourceLangName: sourceLangName,
    localAiTranslatorDisabled: chromeAiBtnDisabled,
    openErrorModalHandler: openErrorModalHandler
  }), /*#__PURE__*/React.createElement(_footer__WEBPACK_IMPORTED_MODULE_7__["default"], {
    targetLangName: targetLangName,
    postType: props.postType,
    sourceLangName: sourceLangName,
    setSettingVisibility: handleSettingVisibility
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SettingModal);

/***/ }),

/***/ "./src/automatic-translate/popup-setting-modal/providers.js":
/*!******************************************************************!*\
  !*** ./src/automatic-translate/popup-setting-modal/providers.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_translate_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/translate-provider */ "./src/automatic-translate/component/translate-provider/index.js");

const Providers = props => {
  const service = props.Service;
  const buttonDisable = props[service + "Disabled"];
  const ActiveService = (0,_component_translate_provider__WEBPACK_IMPORTED_MODULE_0__["default"])({
    Service: service,
    [service + "ButtonDisabled"]: buttonDisable,
    openErrorModalHandler: props.openErrorModalHandler
  });
  const serviceId = service.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const btnId = `atfp-${serviceId}-btn`;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "atfp-provider-name"
  }, /*#__PURE__*/React.createElement("img", {
    src: `${props.imgFolder}${ActiveService.Logo}`,
    alt: ActiveService.title
  }), /*#__PURE__*/React.createElement("span", null, ActiveService.title)), /*#__PURE__*/React.createElement("td", null, ActiveService.ButtonDisabled ? ActiveService.ErrorMessage : /*#__PURE__*/React.createElement("div", {
    id: btnId,
    onClick: props.fetchContent,
    className: "atfp-service-btn button button-primary",
    "data-service": service,
    "data-service-label": ActiveService.ServiceLabel
  }, ActiveService.SettingBtnText)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: ActiveService.Docs,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "atfp-doc-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "12",
    viewBox: "0 0 9 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.17607 6.20533H6.82393V5.53867H2.17607V6.20533ZM2.17607 8.05133H6.82393V7.38467H2.17607V8.05133ZM2.17607 9.898H4.89536V9.23133H2.17607V9.898ZM1.03821 12C0.7425 12 0.495643 11.8973 0.297643 11.692C0.0996427 11.4867 0.000428571 11.2304 0 10.9233V1.07667C0 0.77 0.0992142 0.514 0.297643 0.308667C0.496071 0.103333 0.743143 0.000444444 1.03886 0H6.10714L9 3V10.9233C9 11.23 8.901 11.4862 8.703 11.692C8.505 11.8978 8.25771 12.0004 7.96114 12H1.03821ZM5.78571 3.33333V0.666667H1.03886C0.939857 0.666667 0.849 0.709333 0.766286 0.794666C0.683571 0.88 0.642429 0.974 0.642857 1.07667V10.9233C0.642857 11.0256 0.684 11.1196 0.766286 11.2053C0.848571 11.2911 0.939214 11.3338 1.03821 11.3333H7.96179C8.06036 11.3333 8.151 11.2907 8.23371 11.2053C8.31643 11.12 8.35757 11.0258 8.35714 10.9227V3.33333H5.78571Z",
    fill: "#6F6F6F"
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Providers);

/***/ }),

/***/ "./src/automatic-translate/popup-string-modal/body.js":
/*!************************************************************!*\
  !*** ./src/automatic-translate/popup-string-modal/body.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _component_filter_target_content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/filter-target-content */ "./src/automatic-translate/component/filter-target-content/index.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _component_translate_provider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../component/translate-provider */ "./src/automatic-translate/component/translate-provider/index.js");






const StringPopUpBody = props => {
  const {
    service: service
  } = props;
  const translateContent = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.select)("block-atfp/translate").getTranslationEntry();
  const StringModalBodyNotice = props.stringModalBodyNotice;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (['yandex'].includes(props.service)) {
      document.documentElement.setAttribute('translate', 'no');
      document.body.classList.add('notranslate');
    }

    /**
     * Calls the translate service provider based on the service type.
     * For example, it can call services like yandex Translate.
    */
    const service = props.service;
    const id = `atfp_${service}_translate_element`;
    const translateContent = wp.data.select('block-atfp/translate').getTranslationEntry();
    if (translateContent.length > 0 && props.postDataFetchStatus) {
      const ServiceSetting = (0,_component_translate_provider__WEBPACK_IMPORTED_MODULE_5__["default"])({
        Service: service
      });
      ServiceSetting.Provider({
        sourceLang: props.sourceLang,
        targetLang: props.targetLang,
        translateStatusHandler: props.translateStatusHandler,
        ID: id,
        translateStatus: props.translateStatus,
        modalRenderId: props.modalRender,
        destroyUpdateHandler: props.updateDestroyHandler
      });
    }
  }, [props.modalRender, props.postDataFetchStatus]);
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, translateContent.length > 0 && props.postDataFetchStatus ? /*#__PURE__*/React.createElement(React.Fragment, null, StringModalBodyNotice && /*#__PURE__*/React.createElement("div", {
    className: "atfp-body-notice-wrapper"
  }, /*#__PURE__*/React.createElement(StringModalBodyNotice, null)), /*#__PURE__*/React.createElement("div", {
    className: "atfp_translate_progress",
    key: props.modalRender
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Automatic translation is in progress....", 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/React.createElement("br", null), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("It will take few minutes, enjoy ☕ coffee in this time!", 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Please do not leave this window or browser tab while translation is in progress...", 'autopoly-ai-translation-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: `translator-widget ${service}`,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "choose-lang"
  }, (0,_component_translate_provider__WEBPACK_IMPORTED_MODULE_5__["default"])({
    Service: props.service
  }).heading, " ", /*#__PURE__*/React.createElement("span", {
    className: "dashicons-before dashicons-translation"
  })), /*#__PURE__*/React.createElement("div", {
    className: `atfp_translate_element_wrapper ${props.translateStatus ? 'translate-completed' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    id: `atfp_${props.service}_translate_element`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "atfp_string_container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "scrolldown",
    id: "stringTemplate"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("S.No", 'autopoly-ai-translation-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Source Text", 'autopoly-ai-translation-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translation", 'autopoly-ai-translation-for-polylang')))), /*#__PURE__*/React.createElement("tbody", null, props.postDataFetchStatus && /*#__PURE__*/React.createElement(React.Fragment, null, translateContent.map((data, index) => {
    return /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
      key: index + props.translatePendingStatus
    }, undefined !== data.source && data.source.trim() !== '' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", {
      key: index + 'tr' + props.translatePendingStatus
    }, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", {
      "data-source": "source_text"
    }, data.source), !props.translatePendingStatus ? /*#__PURE__*/React.createElement("td", {
      className: "translate",
      "data-translate-status": "translated",
      "data-key": data.id,
      "data-string-type": data.type
    }, data.translatedData[props.service]) : /*#__PURE__*/React.createElement("td", {
      className: "translate",
      translate: "yes",
      "data-key": data.id,
      "data-string-type": data.type
    }, /*#__PURE__*/React.createElement(_component_filter_target_content__WEBPACK_IMPORTED_MODULE_1__["default"], {
      service: props.service,
      content: data.source,
      contentKey: data.id
    })))));
  })))))) : props.postDataFetchStatus ? /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('No strings are available for translation', 'autopoly-ai-translation-for-polylang')) : /*#__PURE__*/React.createElement("div", {
    className: "atfp-skeleton-loader-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "translate-widget"
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-skeleton-loader-mini"
  }), /*#__PURE__*/React.createElement("div", {
    className: "atfp-skeleton-loader-mini"
  })), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("S.No", 'autopoly-ai-translation-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Source Text", 'autopoly-ai-translation-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Translation", 'autopoly-ai-translation-for-polylang')))), /*#__PURE__*/React.createElement("tbody", null, [...Array(10)].map((_, index) => {
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "atfp-skeleton-loader-mini"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "atfp-skeleton-loader-mini"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "atfp-skeleton-loader-mini"
    })));
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpBody);

/***/ }),

/***/ "./src/automatic-translate/popup-string-modal/footer.js":
/*!**************************************************************!*\
  !*** ./src/automatic-translate/popup-string-modal/footer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _notice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notice */ "./src/automatic-translate/popup-string-modal/notice.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _component_format_number_count__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/format-number-count */ "./src/automatic-translate/component/format-number-count/index.js");



const StringPopUpFooter = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-footer",
    key: props.modalRender
  }, !props.translatePendingStatus && /*#__PURE__*/React.createElement(_notice__WEBPACK_IMPORTED_MODULE_0__["default"], {
    className: "atfp_string_count"
  }, /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Wahooo! You have saved your valuable time via auto translating', 'autopoly-ai-translation-for-polylang'), " ", /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(_component_format_number_count__WEBPACK_IMPORTED_MODULE_2__["default"], {
    number: props.characterCount
  })), " ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('characters using', 'autopoly-ai-translation-for-polylang'), " ", /*#__PURE__*/React.createElement("strong", null, props.serviceLabel), ".", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please share your feedback —', 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/React.createElement("a", {
    href: "https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post",
    target: "_blank",
    rel: "noopener",
    style: {
      color: 'yellow'
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('leave a quick review', 'autopoly-ai-translation-for-polylang')), "!")), /*#__PURE__*/React.createElement("div", {
    className: "save_btn_cont"
  }, /*#__PURE__*/React.createElement("button", {
    className: "notranslate save_it button button-primary",
    disabled: props.translatePendingStatus,
    onClick: props.updatePostData
  }, props.translateButtonStatus ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "updating-text"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Updating", 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      "--i": 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      "--i": 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      "--i": 2
    }
  }))) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Update Content", 'autopoly-ai-translation-for-polylang'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpFooter);

/***/ }),

/***/ "./src/automatic-translate/popup-string-modal/header.js":
/*!**************************************************************!*\
  !*** ./src/automatic-translate/popup-string-modal/header.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);

const StringPopUpHeader = props => {
  /**
   * Function to close the popup modal.
   */
  const closeModal = () => {
    props.setPopupVisibility(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-header",
    key: props.modalRender
  }, /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: closeModal
  }, "\xD7"), /*#__PURE__*/React.createElement("h2", {
    className: "notranslate"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Step 2 - Start Automatic Translation Process", 'autopoly-ai-translation-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: "save_btn_cont"
  }, /*#__PURE__*/React.createElement("button", {
    className: "notranslate save_it button button-primary",
    disabled: props.translatePendingStatus,
    onClick: props.updatePostData
  }, props.translateButtonStatus ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "updating-text"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Updating", 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      "--i": 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      "--i": 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      "--i": 2
    }
  }))) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Update Content", 'autopoly-ai-translation-for-polylang'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpHeader);

/***/ }),

/***/ "./src/automatic-translate/popup-string-modal/index.js":
/*!*************************************************************!*\
  !*** ./src/automatic-translate/popup-string-modal/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper */ "./src/automatic-translate/helper/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./header */ "./src/automatic-translate/popup-string-modal/header.js");
/* harmony import */ var _body__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./body */ "./src/automatic-translate/popup-string-modal/body.js");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./footer */ "./src/automatic-translate/popup-string-modal/footer.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }






const popStringModal = props => {
  let selectedService = props.service;
  const translateData = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('block-atfp/translate').getTranslationInfo().translateData[selectedService] || false;
  const translateStatus = translateData?.translateStatus || false;
  const [popupVisibility, setPopupVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [refPostData, setRefPostData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [translatePending, setTranslatePending] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [characterCount, setCharacterCount] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(translateData?.targetCharacterCount || 0);
  const [onDestroy, setOnDestroy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [translateButtonStatus, setTranslateButtonStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const updateDestroyHandler = callback => {
    setOnDestroy(prev => [...prev, callback]);
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!popupVisibility) {
      if (onDestroy.length > 0) {
        onDestroy.forEach(callback => {
          if (typeof callback === 'function') {
            callback();
          }
        });
      }
    }
  }, [popupVisibility, onDestroy]);

  /**
   * Returns the label for the service provider.
   * @returns {string} The label for the service provider.
   */
  const serviceLabel = () => {
    const serviceProvider = props.service;
    if (serviceProvider === 'localAiTranslator') {
      return 'Chrome AI Translator';
    } else {
      return serviceProvider.replace(/^\w/, c => c.toUpperCase()) + ' Translate';
    }
  };

  /**
   * Fetches the post data.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!props.postDataFetchStatus) {
      props.fetchPostData({
        postId: props.postId,
        sourceLang: props.sourceLang,
        targetLang: props.targetLang,
        updatePostDataFetch: props.updatePostDataFetch,
        refPostData: data => setRefPostData(prev => ({
          ...prev,
          ...data
        })),
        updateDestroyHandler: updateDestroyHandler
      });
    }
  }, [props.postDataFetchStatus, props.modalRender]);

  /**
   * Updates the post content data.
   * @param {string} data - The data to set as the post content.
   */
  const updatePostContentHandler = data => {
    setRefPostData(data);
  };

  /**
   * Updates the fetch state.
   * @param {boolean} state - The state to update the fetch with.
   */
  const setPopupVisibilityHandler = state => {
    if (props.service === 'yandex') {
      document.querySelector('#atfp_yandex_translate_element #yt-widget .yt-button__icon.yt-button__icon_type_right')?.click();
    }
    setTranslatePending(true);
    setPopupVisibility(false);
  };
  const translateStatusHandler = status => {
    let service = props.service;
    const characterCount = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('block-atfp/translate').getTranslationInfo().translateData[service]?.targetCharacterCount || 0;
    setCharacterCount(characterCount);
    setTranslatePending(status);
  };
  const updatePostDataHandler = () => {
    if (translateButtonStatus) {
      return;
    }
    const postContent = refPostData;
    const modalClose = () => {
      setPopupVisibility(false);
      setPopupVisibilityHandler(false);
    };
    let service = props.service;
    setTranslateButtonStatus(true);
    props.translatePost({
      postContent: postContent,
      modalClose: modalClose,
      service: service
    });
    props.pageTranslate(true);
    (0,_helper__WEBPACK_IMPORTED_MODULE_1__.updateTranslateData)({
      provider: service,
      sourceLang: props.sourceLang,
      targetLang: props.targetLang,
      postId: props.currentPostId
    });
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setPopupVisibility(true);
    if (translateStatus) {
      setCharacterCount(translateData?.targetCharacterCount || 0);
      setTranslatePending(false);
    }
    setTimeout(() => {
      const stringModal = document.querySelector('.atfp_string_container');
      if (stringModal) {
        stringModal.scrollTop = 0;
      }
      ;
    });
  }, [props.modalRender]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, " ", popupVisibility && /*#__PURE__*/React.createElement("div", {
    id: `atfp-${props.service}-strings-modal`,
    className: "modal-container",
    style: {
      display: popupVisibility ? 'flex' : 'none'
    },
    "data-render-id": props.modalRender
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement(_header__WEBPACK_IMPORTED_MODULE_3__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    translatePendingStatus: translatePending,
    pageTranslate: props.pageTranslate,
    service: props.service,
    serviceLabel: serviceLabel(),
    updatePostData: updatePostDataHandler,
    characterCount: characterCount,
    translateButtonStatus: translateButtonStatus
  }), /*#__PURE__*/React.createElement(_body__WEBPACK_IMPORTED_MODULE_4__["default"], _extends({}, props, {
    updatePostContent: updatePostContentHandler,
    contentLoading: props.contentLoading,
    postDataFetchStatus: props.postDataFetchStatus,
    translatePendingStatus: translatePending,
    service: props.service,
    sourceLang: props.sourceLang,
    targetLang: props.targetLang,
    translateStatusHandler: translateStatusHandler,
    modalRender: props.modalRender,
    translateStatus: translateStatus,
    stringModalBodyNotice: props.stringModalBodyNotice,
    updateDestroyHandler: updateDestroyHandler
  })), /*#__PURE__*/React.createElement(_footer__WEBPACK_IMPORTED_MODULE_5__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    translatePendingStatus: translatePending,
    pageTranslate: props.pageTranslate,
    service: props.service,
    serviceLabel: serviceLabel(),
    updatePostData: updatePostDataHandler,
    characterCount: characterCount,
    translateButtonStatus: translateButtonStatus
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (popStringModal);

/***/ }),

/***/ "./src/automatic-translate/popup-string-modal/notice.js":
/*!**************************************************************!*\
  !*** ./src/automatic-translate/popup-string-modal/notice.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const StringPopUpNotice = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: `notice inline notice-info is-dismissible ${props.className}`
  }, Array.isArray(props.children) ? props.children.join(' ') : props.children);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpNotice);

/***/ }),

/***/ "./src/automatic-translate/store-source-string/elementor/index.js":
/*!************************************************************************!*\
  !*** ./src/automatic-translate/store-source-string/elementor/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);

const ElementorSaveSource = content => {
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getAllowedMetaFields();
  const storeMetaFields = metaFields => {
    Object.keys(metaFields).forEach(metaKey => {
      if (Object.keys(AllowedMetaFields).includes(metaKey) && AllowedMetaFields[metaKey].inputType === 'string') {
        if ('' !== metaFields[metaKey][0] && undefined !== metaFields[metaKey][0]) {
          (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').metaFieldsSaveSource(metaKey, metaFields[metaKey][0]);
        }
      }
    });
  };
  const loopCallback = (callback, loop, index) => {
    callback(loop[index], index);
    index++;
    if (index < loop.length) {
      loopCallback(callback, loop, index);
    }
  };
  const translateContent = (ids, value) => {
    if (typeof value === 'string' && value.trim() !== '' && ids.length > 0) {
      const uniqueKey = ids.join('_atfp_');
      if (value && '' !== value) {
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').contentSaveSource(uniqueKey, value);
      }
    }
  };
  const subStringsToCheck = strings => {
    const dynamicSubStrings = ['title', 'description', 'editor', 'text', 'content', 'label'];
    const staticSubStrings = ['caption', 'heading', 'sub_heading', 'testimonial_content', 'testimonial_job', 'testimonial_name', 'name'];
    return dynamicSubStrings.some(substring => strings.toLowerCase().includes(substring)) || staticSubStrings.some(substring => strings === substring);
  };

  // Define a list of properties to exclude
  const cssProperties = ['content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align', 'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow', 'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'];
  const storeWidgetStrings = (element, index, ids = []) => {
    const settings = element.settings;
    ids.push(index);

    // Check if settings is an object
    if (typeof settings === 'object' && settings !== null && Object.keys(settings).length > 0) {
      // Define the substrings to check for translatable content

      const keysLoop = (key, index) => {
        if (cssProperties.some(substring => key.toLowerCase().includes(substring))) {
          return; // Skip this property and continue to the next one
        }
        if (subStringsToCheck(key) && typeof settings[key] === 'string' && settings[key].trim() !== '') {
          translateContent([...ids, 'settings', key], settings[key]);
        }
        if (Array.isArray(settings[key]) && settings[key].length > 0) {
          const settingsLoop = (item, index) => {
            if (typeof item === 'object' && item !== null) {
              const settingsItemsLoop = repeaterKey => {
                if (cssProperties.includes(repeaterKey.toLowerCase())) {
                  return; // Skip this property
                }
                if (subStringsToCheck(repeaterKey) && typeof item[repeaterKey] === 'string' && item[repeaterKey].trim() !== '') {
                  translateContent([...ids, 'settings', key, index, repeaterKey], item[repeaterKey]);
                }
              };
              loopCallback(settingsItemsLoop, Object.keys(item), 0);
            }
          };
          loopCallback(settingsLoop, settings[key], 0);
        }
      };
      loopCallback(keysLoop, Object.keys(settings), 0);
    }

    // If there are nested elements, process them recursively
    if (element.elements && Array.isArray(element.elements) && element.elements.length > 0) {
      const runLoop = (childElement, index) => {
        storeWidgetStrings(childElement, index, [...ids, 'elements']);
      };
      loopCallback(runLoop, element.elements, 0);
    }
  };
  if (content.widgetsContent && content.widgetsContent.length > 0) {
    const runLoop = (element, index) => {
      storeWidgetStrings(element, index, []);
    };
    loopCallback(runLoop, content.widgetsContent, 0);
  }
  if (content.title && '' !== content.title) {
    const currentPostId = atfp_global_object.current_post_id;
    if (currentPostId) {
      const existingTitle = elementor?.settings?.page?.model?.get('post_title');
      if (existingTitle && '' !== existingTitle && existingTitle === `Elementor #${currentPostId}`) {
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').titleSaveSource(content.title);
      }
    }
  }
  storeMetaFields(content.metaFields);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ElementorSaveSource);

/***/ }),

/***/ "./src/automatic-translate/store-source-string/gutenberg/index.js":
/*!************************************************************************!*\
  !*** ./src/automatic-translate/store-source-string/gutenberg/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_filter_nested_attr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component/filter-nested-attr */ "./src/automatic-translate/component/filter-nested-attr/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Filters and translates attributes of a block.
 * 
 * @param {string} blockId - The ID of the block.
 * @param {Object} blockAttr - The attributes of the block.
 * @param {Object} filterAttr - The attributes to filter.
 */
const filterTranslateAttr = (blockId, blockAttr, filterAttr) => {
  const filterAttrArr = Object.values(filterAttr);

  /**
   * Saves translated attributes based on the provided ID array and filter attribute object.
   * 
   * @param {Array} idArr - The array of IDs.
   * @param {Object} filterAttrObj - The filter attribute object.
   */
  const saveTranslatedAttr = (idArr, filterAttrObj) => {
    if (true === filterAttrObj) {
      const newIdArr = new Array(...idArr);
      const childIdArr = new Array();
      let dynamicBlockAttr = blockAttr;
      let uniqueId = blockId;
      newIdArr.forEach(key => {
        childIdArr.push(key);
        uniqueId += `atfp${key}`;
        dynamicBlockAttr = dynamicBlockAttr ? dynamicBlockAttr[key] : dynamicBlockAttr;
      });
      let blockAttrContent = dynamicBlockAttr;
      if (blockAttrContent instanceof wp.richText.RichTextData) {
        blockAttrContent = blockAttrContent.originalHTML;
      }
      if (undefined !== blockAttrContent && typeof blockAttrContent === 'string' && blockAttrContent.trim() !== '') {
        let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
        if (!/[\p{L}\p{N}]/gu.test(blockAttrContent)) {
          return false;
        }
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').contentSaveSource(filterKey, blockAttrContent);
      }
      return;
    }
    (0,_component_filter_nested_attr__WEBPACK_IMPORTED_MODULE_0__["default"])(idArr, filterAttrObj, blockAttr, saveTranslatedAttr);
  };
  filterAttrArr.forEach(data => {
    Object.keys(data).forEach(key => {
      const idArr = new Array(key);
      saveTranslatedAttr(idArr, data[key]);
    });
  });
};
/**
 * Retrieves the translation string for a block based on block rules and applies translation.
 * 
 * @param {Object} block - The block to translate.
 * @param {Object} blockRules - The rules for translating the block.
 */
const getTranslateString = (block, blockRules) => {
  const blockTranslateName = Object.keys(blockRules.AtfpBlockParseRules);
  if (!blockTranslateName.includes(block.name)) {
    return;
  }
  filterTranslateAttr(block.clientId, block.attributes, blockRules['AtfpBlockParseRules'][block.name]);
};

/**
 * Recursively processes child block attributes for translation.
 * 
 * @param {Array} blocks - The array of blocks to translate.
 * @param {Object} blockRules - The rules for translating the blocks.
 */
const childBlockAttributesContent = (blocks, blockRules) => {
  blocks.forEach(block => {
    getTranslateString(block, blockRules);
    if (block.innerBlocks) {
      childBlockAttributesContent(block.innerBlocks, blockRules);
    }
  });
};

/**
 * Processes the attributes of a block for translation.
 * 
 * @param {Object} parseBlock - The block to parse for translation.
 * @param {Object} blockRules - The rules for translating the block.
 */
const blockAttributeContent = (parseBlock, blockRules) => {
  Object.values(parseBlock).forEach(block => {
    getTranslateString(block, blockRules);
    if (block.innerBlocks) {
      childBlockAttributesContent(block.innerBlocks, blockRules);
    }
  });
};

/**
 * Saves the translation for a block based on its attributes.
 * 
 * @param {Object} block - The block to save translation for.
 * @param {Object} blockRules - The rules for translating the block.
 */
const GutenbergBlockSaveSource = (block, blockRules) => {
  const AllowedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getAllowedMetaFields();
  Object.keys(block).forEach(key => {
    if (key === 'content') {
      blockAttributeContent(block[key], blockRules);
    } else if (key === 'metaFields') {
      Object.keys(block[key]).forEach(metaKey => {
        // Store meta fields
        if (Object.keys(AllowedMetaFields).includes(metaKey) && AllowedMetaFields[metaKey].inputType === 'string') {
          if ('' !== block[key][metaKey][0] && undefined !== block[key][metaKey][0]) {
            (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').metaFieldsSaveSource(metaKey, block[key][metaKey][0]);
          }
        }
      });

      // Store ACF fields
      if (window.acf) {
        acf.getFields().forEach(field => {
          if (field.data && AllowedMetaFields[field.data.key]) {
            const name = field.data.name;
            const currentValue = acf.getField(field.data.key)?.val();
            if (block[key] && block[key][name]) {
              if ('' !== block[key][name] && undefined !== block[key][name]) {
                (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').metaFieldsSaveSource(field.data.key, block[key][name][0]);
              }
            } else if (currentValue && '' !== currentValue && undefined !== currentValue) {
              (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').metaFieldsSaveSource(field.data.key, currentValue);
            }
          }
        });
      }
    } else if (['title', 'excerpt'].includes(key)) {
      if (block[key] && block[key].trim() !== '') {
        const action = `${key}SaveSource`;
        (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate')[action](block[key]);
      }
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GutenbergBlockSaveSource);

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************************!*\
  !*** ./src/automatic-translate/index.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popup_setting_modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup-setting-modal */ "./src/automatic-translate/popup-setting-modal/index.js");
/* harmony import */ var _global_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global-store */ "./src/automatic-translate/global-store/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fetch_post_gutenberg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fetch-post/gutenberg */ "./src/automatic-translate/fetch-post/gutenberg/index.js");
/* harmony import */ var _create_translated_post_gutenberg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./create-translated-post/gutenberg */ "./src/automatic-translate/create-translated-post/gutenberg/index.js");
/* harmony import */ var _component_pro_version_notice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./component/pro-version-notice */ "./src/automatic-translate/component/pro-version-notice/index.js");
/* harmony import */ var _component_notice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./component/notice */ "./src/automatic-translate/component/notice/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _fetch_post_elementor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./fetch-post/elementor */ "./src/automatic-translate/fetch-post/elementor/index.js");
/* harmony import */ var _create_translated_post_elementor__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./create-translated-post/elementor */ "./src/automatic-translate/create-translated-post/elementor/index.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");










// Elementor post fetch and update page



const editorType = window.atfp_global_object.editor_type;
const init = () => {
  let atfpModals = new Array();
  const atfpSettingModalWrp = '<!-- The Modal --><div id="atfp-setting-modal"></div>';
  const atfpStringModalWrp = '<div id="atfp_strings_model" class="modal atfp_custom_model"></div>';
  atfpModals.push(atfpSettingModalWrp, atfpStringModalWrp);
  atfpModals.forEach(modal => {
    document.body.insertAdjacentHTML('beforeend', modal);
  });
};
const StringModalBodyNotice = () => {
  const notices = [];
  if (editorType === 'gutenberg') {
    const postMetaSync = atfp_global_object.postMetaSync === 'true';
    if (postMetaSync) {
      notices.push({
        className: 'atfp-notice atfp-notice-error',
        message: /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('For accurate custom field translations, please disable the Custom Fields synchronization in ', 'autopoly-ai-translation-for-polylang'), /*#__PURE__*/React.createElement("a", {
          href: `${atfp_global_object.admin_url}admin.php?page=mlang_settings`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('Polylang settings', 'autopoly-ai-translation-for-polylang')), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('. This may affect linked posts or pages.', 'autopoly-ai-translation-for-polylang'))
      });
    }
    const blockRules = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.select)('block-atfp/translate').getBlockRules();
    if (!blockRules.AtfpBlockParseRules || Object.keys(blockRules.AtfpBlockParseRules).length === 0) {
      notices.push({
        className: 'atfp-notice atfp-notice-error',
        message: /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)('No block rules were found. It appears that the block-rules.JSON file could not be fetched, possibly because it is blocked by your server settings. Please check your server configuration to resolve this issue.', 'autopoly-ai-translation-for-polylang'))
      });
    }
  }
  const noticeLength = notices.length;
  if (notices.length > 0) {
    return notices.map((notice, index) => /*#__PURE__*/React.createElement(_component_notice__WEBPACK_IMPORTED_MODULE_6__["default"], {
      className: notice.className,
      key: index,
      lastNotice: index === noticeLength - 1
    }, notice.message));
  }
  return;
};
const App = () => {
  const [pageTranslate, setPageTranslate] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const targetLang = window.atfp_global_object.target_lang;
  const postId = window.atfp_global_object.parent_post_id;
  const currentPostId = window.atfp_global_object.current_post_id;
  const postType = window.atfp_global_object.post_type;
  let translatePost, fetchPost, translateWrpSelector;
  const sourceLang = window.atfp_global_object.source_lang;

  // Elementor post fetch and update page
  if (editorType === 'elementor') {
    translateWrpSelector = 'button.atfp-translate-button[name="atfp_meta_box_translate"]';
    translatePost = _create_translated_post_elementor__WEBPACK_IMPORTED_MODULE_10__["default"];
    fetchPost = _fetch_post_elementor__WEBPACK_IMPORTED_MODULE_9__["default"];
  } else if (editorType === 'gutenberg') {
    translateWrpSelector = 'input#atfp-translate-button[name="atfp_meta_box_translate"]';
    translatePost = _create_translated_post_gutenberg__WEBPACK_IMPORTED_MODULE_4__["default"];
    fetchPost = _fetch_post_gutenberg__WEBPACK_IMPORTED_MODULE_3__["default"];
  }
  const [postDataFetchStatus, setPostDataFetchStatus] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const fetchPostData = async data => {
    await fetchPost(data);
    const allEntries = wp.data.select('block-atfp/translate').getTranslationEntry();
    let totalStringCount = 0;
    let totalCharacterCount = 0;
    let totalWordCount = 0;
    allEntries.map(entries => {
      const source = entries.source ? entries.source : '';
      const stringCount = source.split(/(?<=[.!?]+)\s+/).length;
      const wordCount = source.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
      const characterCount = source.length;
      totalStringCount += stringCount;
      totalCharacterCount += characterCount;
      totalWordCount += wordCount;
    });
    wp.data.dispatch('block-atfp/translate').translationInfo({
      sourceStringCount: totalStringCount,
      sourceWordCount: totalWordCount,
      sourceCharacterCount: totalCharacterCount
    });
  };
  const updatePostDataFetch = status => {
    setPostDataFetchStatus(status);
    setLoading(false);
  };
  const handlePageTranslate = status => {
    setPageTranslate(status);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (pageTranslate) {
      const metaFieldBtn = document.querySelector(translateWrpSelector);
      if (metaFieldBtn) {
        metaFieldBtn.disabled = true;
        metaFieldBtn.value = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("Already Translated", 'autopoly-ai-translation-for-polylang');
      }
    }
  }, [pageTranslate]);
  if (!sourceLang || '' === sourceLang) {
    const metaFieldBtn = document.querySelector(translateWrpSelector);
    if (metaFieldBtn) {
      metaFieldBtn.title = `Parent ${window.atfp_global_object.post_type} may be deleted.`;
      metaFieldBtn.disabled = true;
    }
    return;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, !pageTranslate && sourceLang && '' !== sourceLang && /*#__PURE__*/React.createElement(_popup_setting_modal__WEBPACK_IMPORTED_MODULE_0__["default"], {
    contentLoading: loading,
    updatePostDataFetch: updatePostDataFetch,
    postDataFetchStatus: postDataFetchStatus,
    pageTranslate: handlePageTranslate,
    postId: postId,
    currentPostId: currentPostId,
    targetLang: targetLang,
    postType: postType,
    fetchPostData: fetchPostData,
    translatePost: translatePost,
    translateWrpSelector: translateWrpSelector,
    stringModalBodyNotice: StringModalBodyNotice
  }));
};

/**
 * Creates a message popup based on the post type and target language.
 * @returns {HTMLElement} The created message popup element.
 */
const createMessagePopup = () => {
  const postType = window.atfp_global_object.post_type;
  const targetLang = window.atfp_global_object.target_lang;
  const targetLangName = atfp_global_object.languageObject[targetLang]['name'];
  const messagePopup = document.createElement('div');
  messagePopup.id = 'atfp-modal-open-warning-wrapper';
  messagePopup.innerHTML = `
    <div class="modal-container" style="display: flex">
      <div class="modal-content">
        <p>${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("Would you like to duplicate your original %s content and have it automatically translated into %s?", 'autopoly-ai-translation-for-polylang'), postType, targetLangName)}</p>
        <div>
          <div data-value="yes">${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("Yes", 'autopoly-ai-translation-for-polylang')}</div>
          <div data-value="no">${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_8__.__)("No", 'autopoly-ai-translation-for-polylang')}</div>
        </div>
      </div>
    </div>`;
  return messagePopup;
};

/**
 * Inserts the message popup into the DOM.
 */
const insertMessagePopup = () => {
  const targetElement = document.getElementById('atfp-setting-modal');
  const messagePopup = createMessagePopup();
  document.body.insertBefore(messagePopup, targetElement);
};

/**
 * Elementor translate button append
 */
const appendElementorTranslateBtn = () => {
  const translateButtonGroup = jQuery('.MuiButtonGroup-root.MuiButtonGroup-contained').parent();
  const buttonElement = jQuery(translateButtonGroup).find('.elementor-button.atfp-translate-button');
  if (translateButtonGroup.length > 0 && buttonElement.length === 0) {
    const buttonHtml = '<button class="elementor-button atfp-translate-button" name="atfp_meta_box_translate">Translate</button>';
    const buttonElement = jQuery(buttonHtml);
    let confirmBox = false;
    const postId = window.atfp_global_object.current_post_id;
    const targetLang = window.atfp_global_object.target_lang;
    const oldData = localStorage.getItem('atfpElementorConfirmBox');
    if (oldData && 'string' === typeof oldData && '' !== oldData) {
      confirmBox = JSON.parse(oldData);
    }
    translateButtonGroup.prepend(buttonElement);
    $e.internal('document/save/set-is-modified', {
      status: true
    });
    if (!window.atfp_global_object.translation_data || !window.atfp_global_object.translation_data.total_string_count && 0 !== window.atfp_global_object.translation_data.total_string_count) {
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation data not found.');
      return;
    }
    const characterCount = parseInt(window.atfp_global_object.translation_data.total_character_count);
    if (characterCount > 500000) {
      const elementorProNotice = document.createElement('div');
      elementorProNotice.id = 'atfp-pro-notice';
      document.body.appendChild(elementorProNotice);
      const root = react_dom_client__WEBPACK_IMPORTED_MODULE_11__.createRoot(document.getElementById('atfp-pro-notice'));
      root.render(/*#__PURE__*/React.createElement(_component_pro_version_notice__WEBPACK_IMPORTED_MODULE_5__["default"], {
        characterCount: characterCount,
        url: window.atfp_global_object.pro_version_url || ''
      }));
      return;
    }
    if (!window.atfp_global_object.elementorData || '' === window.atfp_global_object.elementorData || window.atfp_global_object.elementorData.length < 1 || elementor.elements.length < 1) {
      if (confirmBox && confirmBox[postId + '_' + targetLang]) {
        delete confirmBox[postId + '_' + targetLang];
        if (Object.keys(confirmBox).length === 0) {
          localStorage.removeItem('atfpElementorConfirmBox');
        } else {
          localStorage.setItem('atfpElementorConfirmBox', JSON.stringify(confirmBox));
        }
      }
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation is not available because there is no Elementor data.');
      return;
    }
    // Append app root wrapper in body
    init();
    const root = react_dom_client__WEBPACK_IMPORTED_MODULE_11__.createRoot(document.getElementById('atfp-setting-modal'));
    root.render(/*#__PURE__*/React.createElement(App, null));
    if (confirmBox && confirmBox[postId + '_' + targetLang]) {
      setTimeout(() => {
        buttonElement.click();
        delete confirmBox[postId + '_' + targetLang];
        if (Object.keys(confirmBox).length === 0) {
          localStorage.removeItem('atfpElementorConfirmBox');
        } else {
          localStorage.setItem('atfpElementorConfirmBox', JSON.stringify(confirmBox));
        }
      }, 100);
    }
  }
};
if (editorType === 'gutenberg') {
  // Render App
  window.addEventListener('load', () => {
    // Append app root wrapper in body
    init();
    const buttonElement = jQuery('input#atfp-translate-button[name="atfp_meta_box_translate"]');
    if (!window.atfp_global_object.translation_data || !window.atfp_global_object.translation_data.total_string_count && 0 !== window.atfp_global_object.translation_data.total_string_count) {
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation data not found.');
      return;
    }
    const characterCount = parseInt(window.atfp_global_object.translation_data.total_character_count);
    if (characterCount > 500000) {
      const elementorProNotice = document.createElement('div');
      elementorProNotice.id = 'atfp-pro-notice';
      document.body.appendChild(elementorProNotice);
      const root = react_dom_client__WEBPACK_IMPORTED_MODULE_11__.createRoot(document.getElementById('atfp-pro-notice'));
      root.render(/*#__PURE__*/React.createElement(_component_pro_version_notice__WEBPACK_IMPORTED_MODULE_5__["default"], {
        characterCount: characterCount,
        url: window.atfp_global_object.pro_version_url || ''
      }));
      return;
    }
    const sourceLang = window.atfp_global_object.source_lang;
    if (sourceLang && '' !== sourceLang) {
      insertMessagePopup();
    }
    const root = react_dom_client__WEBPACK_IMPORTED_MODULE_11__.createRoot(document.getElementById('atfp-setting-modal'));
    root.render(/*#__PURE__*/React.createElement(App, null));
  });
}

// Elementor translate button append
if (editorType === 'elementor') {
  jQuery(window).on('elementor:init', function () {
    elementor.on('document:loaded', appendElementorTranslateBtn);
  });
}
})();

/******/ })()
;
//# sourceMappingURL=index.js.map