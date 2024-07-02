/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/component/FilterTargetContent/index.js":
/*!****************************************************!*\
  !*** ./src/component/FilterTargetContent/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const FilterTargetContent = props => {
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
    let childElements = firstElement.children;
    const length = childElements.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        let element = childElements[i];
        let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
        element.outerHTML = filterContent;
      }
    }

    // Get the opening tag of the first element
    // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
    const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];

    // Check if the first element has a corresponding closing tag
    const openTagName = firstElement.tagName.toLowerCase();
    const closingTagName = new RegExp(`<\/${openTagName}>`, 'i');

    // Check if the inner HTML contains the corresponding closing tag
    const closingTagMatch = firstElement.outerHTML.match(closingTagName);

    // Wrap the style element
    if (firstElementOpeningTag === '<style>') {
      let wrappedFirstTag = `#atfp_open_translate_span#${firstElement.outerHTML}#atfp_close_translate_span#`;
      return wrappedFirstTag;
    }
    const firstElementHtml = firstElement.innerHTML;
    firstElement.innerHTML = '';
    let openTag = `#atfp_open_translate_span#${firstElementOpeningTag}#atfp_close_translate_span#`;
    let closeTag = '';
    let filterContent = '';
    if (closingTagMatch) {
      closeTag = `#atfp_open_translate_span#</${openTagName}>#atfp_close_translate_span#`;
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
    const pattern = /(#atfp_open_translate_span#.*?#atfp_close_translate_span#)|'/;
    const matches = string.split(pattern).filter(Boolean);

    // Remove empty strings from the result
    const output = matches.filter(match => match.trim() !== '');
    return output;
  };

  /**
   * Replaces the inner text of HTML elements with span elements for translation.
   * @param {string} string - The HTML content string to process.
   * @returns {Array} An array of strings after splitting based on the pattern.
   */
  const filterSourceData = string => {
    function replaceInnerTextWithSpan(doc) {
      let childElements = doc.children;
      const childElementsReplace = () => {
        if (childElements.length > 0) {
          let element = childElements[0];
          let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
          const textNode = document.createTextNode(filterContent);
          element.replaceWith(textNode);
          childElementsReplace();
        }
      };
      childElementsReplace();
      return doc;
    }
    const tempElement = document.createElement('div');
    tempElement.innerHTML = string;
    replaceInnerTextWithSpan(tempElement);
    return splitContent(tempElement.innerText);
  };

  /**
   * The content to be filtered based on the service type.
   * If the service is 'yandex', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
   */
  const content = 'yandex' === props.service ? filterSourceData(props.content) : props.content;
  props.translateContent(content);
  if (props.currentIndex === props.totalString) {
    props.translateContent({
      stringRenderComplete: true
    });
  }

  /**
   * Regular expression pattern to match the span elements that should not be translated.
   */
  const notTranslatePattern = /#atfp_open_translate_span#[\s\S]*?#atfp_close_translate_span#/;

  /**
   * Regular expression pattern to replace the placeholder span elements.
   */
  const replacePlaceholderPattern = /#atfp_open_translate_span#|#atfp_close_translate_span#/g;
  const filterContent = content => {
    const updatedContent = content.replace(replacePlaceholderPattern, '');
    return updatedContent;
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, 'yandex' === props.service ? content.map((data, index) => {
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

/***/ "./src/component/TranslateProvider/index.js":
/*!**************************************************!*\
  !*** ./src/component/TranslateProvider/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _yandex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./yandex */ "./src/component/TranslateProvider/yandex/index.js");


/**
 * Provides translation services using Yandex Translate.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  yandex: _yandex__WEBPACK_IMPORTED_MODULE_0__["default"]
});

/***/ }),

/***/ "./src/component/TranslateProvider/yandex/index.js":
/*!*********************************************************!*\
  !*** ./src/component/TranslateProvider/yandex/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _storeTranslatedString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../storeTranslatedString */ "./src/component/storeTranslatedString/index.js");

const yandexWidget = (win, doc, nav, params, namespace, targetLang, translateStatus) => {
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
      (0,_storeTranslatedString__WEBPACK_IMPORTED_MODULE_0__["default"])(translateStatus);
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
      (0,_storeTranslatedString__WEBPACK_IMPORTED_MODULE_0__["default"])(translateStatus);
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
  }, globalObj.yt = globalObj.yt || {}, props.targetLang, props.translateStatus);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YandexTranslater);

/***/ }),

/***/ "./src/component/createTranslatedPost/createBlock.js":
/*!***********************************************************!*\
  !*** ./src/component/createTranslatedPost/createBlock.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const {
  createBlock
} = wp.blocks;
const {
  dispatch,
  select
} = wp.data;

/**
 * Filters and translates attributes of a block based on provided rules.
 * 
 * @param {Object} block - The block to filter and translate attributes for.
 * @param {Object} blockParseRules - The rules for parsing the block.
 * @param {Object} replaceAttrRules - The rules for replacing attributes.
 * @returns {Object} The updated block with translated attributes.
 */
const filterTranslateAttr = (block, blockParseRules, replaceAttrRules) => {
  const filterAttrArr = Object.values(blockParseRules);
  const blockAttr = block.attributes;
  const blockId = block.clientId;

  // Function to update a nested attribute in the block
  const updateNestedAttribute = (obj, path, value) => {
    const attrReplaceKey = Object.keys(replaceAttrRules);
    const attrKeyJoin = path.slice(-2).join('_');
    let attrReplace = false;
    if (attrReplaceKey.includes(attrKeyJoin)) {
      const filterReplaceBlockName = replaceAttrRules[attrKeyJoin];
      if (filterReplaceBlockName.includes(block.name)) {
        path.pop();
        attrReplace = true;
      }
    }
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
    if (attrReplace) {
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
        dynamicBlockAttr = dynamicBlockAttr[key];
      });
      const blockAttrContent = dynamicBlockAttr;
      if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {
        let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
        let translateContent = '';
        if (!/[^\p{L}\p{N}]/gu.test(blockAttrContent)) {
          translateContent = blockAttrContent;
        } else {
          translateContent = select('block-atfp/translate').getTranslatedString('content', blockAttrContent, filterKey);
        }
        block.attributes = updateNestedAttribute(block.attributes, newIdArr, translateContent);
      }
    }
    if (Object.getPrototypeOf(filterAttrObj) === Array.prototype) {
      childAttrArray(idArr, filterAttrObj);
    } else if (Object.getPrototypeOf(filterAttrObj) === Object.prototype) {
      childAttr(idArr, filterAttrObj);
    }
  };

  /**
   * Function to handle updating translated attributes for a single level object.
   * 
   * @param {Array} idArr - The array of IDs to update attributes for.
   * @param {Object} filterObj - The filter object containing attributes to update.
   */
  const childAttr = (idArr, filterObj) => {
    Object.keys(filterObj).map(key => {
      let filterObjType = filterObj;
      filterObjType = filterObjType[key];
      const newIdArr = new Array(...idArr, key);
      updateTranslatedAttr(newIdArr, filterObjType);
    });
  };

  /**
   * Function to handle updating translated attributes for an array of objects.
   * 
   * @param {Array} idArr - The array of IDs to update attributes for.
   * @param {Array} attrFilter - The filter array containing attributes to update.
   */
  const childAttrArray = (idArr, attrFilter) => {
    const newIdArr = new Array(...idArr);
    let dynamicBlockAttr = blockAttr;
    newIdArr.forEach(key => {
      dynamicBlockAttr = dynamicBlockAttr[key];
    });
    if (Object.getPrototypeOf(dynamicBlockAttr) === Object.prototype) {
      childAttr(idArr, attrFilter[0]);
      return;
    }
    dynamicBlockAttr.forEach((_, index) => {
      const nestedId = new Array();
      newIdArr.forEach(key => {
        nestedId.push(key);
      });
      nestedId.push(index);
      updateTranslatedAttr(nestedId, attrFilter[0]);
    });
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
 * @returns {Object} The newly created translated block.
 */
const createTranslatedBlock = (block, childBlock, blockRules) => {
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
    translatedBlock = filterTranslateAttr(block, blockRules['AtfpBlockParseRules'][block.name], blockRules.AtfpCoreAttrReplace);
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
const cretaeChildBlock = (block, blockRules) => {
  let childBlock = block.innerBlocks.map(block => {
    if (block.name) {
      const childBlock = cretaeChildBlock(block, blockRules);
      return childBlock;
    }
  });
  const newBlock = createTranslatedBlock(block, childBlock, blockRules);
  return newBlock;
};

/**
 * Creates the main blocks based on the provided block, translate handler, and block rules.
 * If the block name exists, it creates the main block along with its child blocks and inserts it into the block editor.
 * 
 * @param {Object} block - The main block to create.
 * @param {Object} blockRules - The rules for translating blocks.
 */
const createBlocks = (block, blockRules) => {
  const {
    name: blockName
  } = block;
  // Create the main block
  if (blockName) {
    let childBlock = block.innerBlocks.map(block => {
      if (block.name) {
        return cretaeChildBlock(block, blockRules);
      }
    });
    const parentBlock = createTranslatedBlock(block, childBlock, blockRules);
    dispatch('core/block-editor').insertBlock(parentBlock);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBlocks);

/***/ }),

/***/ "./src/component/createTranslatedPost/index.js":
/*!*****************************************************!*\
  !*** ./src/component/createTranslatedPost/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createBlock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createBlock */ "./src/component/createTranslatedPost/createBlock.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);


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
    postContent
  } = props;

  /**
   * Updates the post title and excerpt text based on translation.
   */
  const postDataUpdate = () => {
    const data = {};
    const editPostData = Object.keys(postContent).filter(key => key !== 'content');
    editPostData.forEach(key => {
      const sourceData = postContent[key];
      if (sourceData.trim() !== '') {
        const translateContent = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getTranslatedString(key, sourceData);
        data[key] = translateContent;
      }
    });
    editPost(data);
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
      (0,_createBlock__WEBPACK_IMPORTED_MODULE_0__["default"])(block, props.blockRules);
    });
  };

  // Update post title and excerpt text
  postDataUpdate();
  // Update post content
  postContentUpdate();
  // Close string modal box
  modalClose();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (translatePost);

/***/ }),

/***/ "./src/component/storeSourceString/index.js":
/*!**************************************************!*\
  !*** ./src/component/storeSourceString/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const {
  dispatch
} = wp.data;
let contentIndex = 0;
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
        dynamicBlockAttr = dynamicBlockAttr[key];
      });
      const blockAttrContent = dynamicBlockAttr;
      if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {
        let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
        if (!/[^\p{L}\p{N}]/gu.test(blockAttrContent)) {
          return false;
        }
        dispatch('block-atfp/translate').contentSaveSource(filterKey, blockAttrContent, contentIndex);
        contentIndex++;
      }
    }
    if (Object.getPrototypeOf(filterAttrObj) === Array.prototype) {
      childAttrArray(idArr, filterAttrObj);
    } else if (Object.getPrototypeOf(filterAttrObj) === Object.prototype) {
      childAttr(idArr, filterAttrObj);
    }
  };

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
      saveTranslatedAttr(newIdArr, filterObjType);
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
    if (Object.getPrototypeOf(dynamicBlockAttr) === Object.prototype) {
      childAttr(idArr, attrFilter[0]);
      return;
    }
    dynamicBlockAttr.forEach((_, index) => {
      const nestedId = new Array();
      newIdArr.forEach(key => {
        nestedId.push(key);
      });
      nestedId.push(index);
      saveTranslatedAttr(nestedId, attrFilter[0]);
    });
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
const saveTranslation = (block, blockRules) => {
  Object.keys(block).forEach(key => {
    if (key === 'content') {
      blockAttributeContent(block[key], blockRules);
    } else {
      const action = `${key}SaveSource`;
      dispatch('block-atfp/translate')[action](block[key]);
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (saveTranslation);

/***/ }),

/***/ "./src/component/storeTranslatedString/index.js":
/*!******************************************************!*\
  !*** ./src/component/storeTranslatedString/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const {
  dispatch
} = wp.data;
const ScrollAnimation = props => {
  const {
    element,
    scrollSpeed
  } = props;
  const scrollHeight = element.scrollHeight;
  let startTime = null;
  let startScrollTop = element.scrollTop;
  const animateScroll = () => {
    const currentTime = performance.now();
    const duration = scrollSpeed; // 10 seconds
    const scrollTarget = scrollHeight + 2000;
    if (!startTime) {
      startTime = currentTime;
    }
    const progress = (currentTime - startTime) / duration;
    const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;
    element.scrollTop = scrollPosition;
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };
  animateScroll();
};

/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const saveTranslation = translateData => {
  Object.keys(translateData).map(key => {
    const data = translateData[key];
    if (data.type !== 'content') {
      const action = `${data.type}SaveTranslate`;
      dispatch('block-atfp/translate')[action](data.translateContent);
    } else {
      dispatch('block-atfp/translate').contentSaveTranslate(key, data.translateContent, data.source);
    }
  });
};
/**
 * Updates the translated content based on the provided translation object.
 */
const updateTranslatedContent = () => {
  const container = document.getElementById("atfp_strings_model");
  const stringContainer = container.querySelector('.atfp_string_container');
  const translatedData = stringContainer.querySelectorAll('td.translate[data-string-type]');
  const data = {};
  translatedData.forEach(ele => {
    const translatedText = ele.innerText;
    const key = ele.dataset.key;
    const type = ele.dataset.stringType;
    const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;
    data[key] = {
      type: type,
      translateContent: translatedText,
      source: sourceText
    };
  });
  saveTranslation(data);
};

/**
 * Handles the completion of translation by enabling save button, updating stats, and stopping translation progress.
 * @param {HTMLElement} container - The container element for translation.
 */
const onCompleteTranslation = container => {
  container.querySelector(".atfp_translate_progress").style.display = "none";
  container.querySelector(".atfp_string_container").style.animation = "none";
  document.body.style.top = '0';
  const saveButton = container.querySelector('button.save_it');
  saveButton.removeAttribute('disabled');
  saveButton.classList.add('translated');
  saveButton.classList.remove('notranslate');
  updateTranslatedContent();
};

/**
 * Automatically scrolls the container and triggers the completion callback when the bottom is reached or certain conditions are met.
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 */
const SaveTranslationHandler = translateStatus => {
  let translateComplete = false;
  const container = document.getElementById("atfp_strings_model");
  const stringContainer = container.querySelector('.atfp_string_container');
  stringContainer.scrollTop = 0;
  const scrollHeight = stringContainer.scrollHeight;
  if (scrollHeight !== undefined && scrollHeight > 100) {
    container.querySelector(".atfp_translate_progress").style.display = "block";
    setTimeout(() => {
      const scrollSpeed = Math.floor(scrollHeight / stringContainer?.offsetHeight) * 2000;
      ScrollAnimation({
        element: stringContainer,
        scrollSpeed: scrollSpeed
      });
    }, 2000);
    stringContainer.addEventListener('scroll', () => {
      var isScrolledToBottom = stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight;
      if (isScrolledToBottom && !translateComplete) {
        translateStatus();
        onCompleteTranslation(container);
        translateComplete = true;
      }
    });
    if (stringContainer.clientHeight + 10 >= scrollHeight) {
      setTimeout(() => {
        translateStatus();
        onCompleteTranslation(container);
      }, 1500);
    }
  } else {
    setTimeout(() => {
      translateStatus();
      onCompleteTranslation(container);
    }, 2000);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SaveTranslationHandler);

/***/ }),

/***/ "./src/fetch-post.js":
/*!***************************!*\
  !*** ./src/fetch-post.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _component_storeSourceString__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component/storeSourceString */ "./src/component/storeSourceString/index.js");
/* harmony import */ var _component_FilterTargetContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component/FilterTargetContent */ "./src/component/FilterTargetContent/index.js");



const {
  __
} = wp.i18n;
const {
  parse
} = wp.blocks;
const {
  select
} = wp.data;
const FetchPost = props => {
  const [translateContent, setTranslateContent] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [stringAvality, setStringAvality] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const blockRules = props.blockRules;
  const apiUrl = atfp_ajax_object.ajax_url;

  /**
   * Prepare data to send in API request.
   */
  const apiSendData = {
    postId: parseInt(props.postId),
    atfp_nonce: atfp_ajax_object.ajax_nonce,
    action: atfp_ajax_object.action_fetch
  };

  /**
   * useEffect hook to fetch post data from the specified API endpoint.
   * Parses the response data and updates the state accordingly.
   * Handles errors in fetching post content.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams(apiSendData)
    }).then(response => response.json()).then(data => {
      const post_data = data.data;
      if (post_data.content && post_data.content.trim() !== '') {
        post_data.content = parse(post_data.content);
      }
      (0,_component_storeSourceString__WEBPACK_IMPORTED_MODULE_1__["default"])(post_data, blockRules);
      props.setPostData(post_data);
      const translationEntry = select("block-atfp/translate").getTranslationEntry();
      const totalString = Object.values(translationEntry).filter(data => data.source !== undefined && /[^\p{L}\p{N}]/gu.test(data.source));
      if (Object.keys(totalString).length > 0) {
        setTranslateContent(translationEntry);
      } else {
        setStringAvality(false);
      }
    }).catch(error => {
      console.error('Error fetching post content:', error);
    });
  }, [props.fetchKey]);
  let sNo = 0;
  const totalString = translateContent.filter(data => undefined !== data.source && data.source.trim() !== '').length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, translateContent.length > 0 || stringAvality ? translateContent.map((data, index) => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, undefined !== data.source && data.source.trim() !== '' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, ++sNo), /*#__PURE__*/React.createElement("td", {
      "data-source": "source_text"
    }, data.source), /*#__PURE__*/React.createElement("td", {
      class: "translate",
      translate: "yes",
      "data-key": data.id,
      "data-string-type": data.type
    }, /*#__PURE__*/React.createElement(_component_FilterTargetContent__WEBPACK_IMPORTED_MODULE_2__["default"], {
      service: props.service,
      content: data.source,
      translateContent: props.translateContent,
      totalString: totalString,
      currentIndex: sNo
    })))));
  }) : /*#__PURE__*/React.createElement("p", null, __('No strings are available for translation', 'automatic-translation-for-polylang')));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FetchPost);

/***/ }),

/***/ "./src/global-store/actions.js":
/*!*************************************!*\
  !*** ./src/global-store/actions.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contentSaveSource: () => (/* binding */ contentSaveSource),
/* harmony export */   contentSaveTranslate: () => (/* binding */ contentSaveTranslate),
/* harmony export */   excerptSaveSource: () => (/* binding */ excerptSaveSource),
/* harmony export */   excerptSaveTranslate: () => (/* binding */ excerptSaveTranslate),
/* harmony export */   titleSaveSource: () => (/* binding */ titleSaveSource),
/* harmony export */   titleSaveTranslate: () => (/* binding */ titleSaveTranslate)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/global-store/types.js");

const titleSaveSource = data => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceTitle,
    text: data
  };
};
const titleSaveTranslate = data => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedTitle,
    text: data
  };
};
const excerptSaveSource = data => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceExcerpt,
    text: data
  };
};
const excerptSaveTranslate = data => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedExcerpt,
    text: data
  };
};
const contentSaveSource = (id, data, index) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceContent,
    text: data,
    id: id,
    index: index
  };
};
const contentSaveTranslate = (id, data, source) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedContent,
    text: data,
    id: id,
    source: source
  };
};

/***/ }),

/***/ "./src/global-store/index.js":
/*!***********************************!*\
  !*** ./src/global-store/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reducer */ "./src/global-store/reducer.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ "./src/global-store/actions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/global-store/selectors.js");



const {
  createReduxStore,
  register
} = wp.data;
const store = createReduxStore('block-atfp/translate', {
  reducer: _reducer__WEBPACK_IMPORTED_MODULE_0__["default"],
  actions: _actions__WEBPACK_IMPORTED_MODULE_1__,
  selectors: _selectors__WEBPACK_IMPORTED_MODULE_2__
});
register(store);

/***/ }),

/***/ "./src/global-store/reducer.js":
/*!*************************************!*\
  !*** ./src/global-store/reducer.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/global-store/types.js");

const TranslateDefaultState = {
  title: {},
  excerpt: {},
  content: []
};
const reducer = (state = TranslateDefaultState, action) => {
  switch (action.type) {
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceTitle:
      if (/[^\p{L}\p{N}]/gu.test(action.text)) {
        return {
          ...state,
          title: {
            ...state.title,
            source: action.text
          }
        };
      }
      return state;
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedTitle:
      return {
        ...state,
        title: {
          ...state.title,
          target: action.text
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceExcerpt:
      if (/[^\p{L}\p{N}]/gu.test(action.text)) {
        return {
          ...state,
          excerpt: {
            ...state.excerpt,
            source: action.text
          }
        };
      }
      return state;
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedExcerpt:
      return {
        ...state,
        excerpt: {
          ...state.excerpt,
          target: action.text
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceContent:
      if (/[^\p{L}\p{N}]/gu.test(action.text)) {
        return {
          ...state,
          content: {
            ...state.content,
            [action.id]: {
              ...(state.content[action.id] || []),
              source: action.text,
              index: action.index
            }
          }
        };
      }
      return state;
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedContent:
      if (state.content[action.id].source === action.source) {
        return {
          ...state,
          content: {
            ...state.content,
            [action.id]: {
              ...(state.content[action.id] || []),
              target: action.text
            }
          }
        };
      }
      return state;
    default:
      return state;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer);

/***/ }),

/***/ "./src/global-store/selectors.js":
/*!***************************************!*\
  !*** ./src/global-store/selectors.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTranslatedString: () => (/* binding */ getTranslatedString),
/* harmony export */   getTranslationEntry: () => (/* binding */ getTranslationEntry)
/* harmony export */ });
const getTranslationEntry = state => {
  const translateEntry = new Array();
  translateEntry.push({
    id: 'title',
    source: state.title.source,
    type: 'title',
    target: state.title.target || ''
  });
  translateEntry.push({
    id: 'excerpt',
    source: state.excerpt.source,
    type: 'excerpt',
    target: state.excerpt.target || ''
  });
  Object.keys(state.content).map(key => {
    const newIndex = state.content[key].index + 2;
    translateEntry[newIndex] = {
      type: 'content',
      id: key,
      source: state.content[key].source,
      target: state.content[key].target || ''
    };
  });
  return translateEntry;
};
const getTranslatedString = (state, type, source, id = null) => {
  if (type !== 'content' && state[type].source === source) {
    return state[type].target;
  } else if (state[type] && state[type][id] && state[type][id].source === source) {
    return undefined !== state[type][id].target ? state[type][id].target : state[type][id].source;
  }
  return source;
};

/***/ }),

/***/ "./src/global-store/types.js":
/*!***********************************!*\
  !*** ./src/global-store/types.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const AtfpActionTypes = {
  sourceTitle: 'SAVE_SOURCE_TITLE',
  traslatedTitle: 'SAVE_TRANSLATE_TITLE',
  sourceExcerpt: 'SAVE_SOURCE_EXCERPT',
  traslatedExcerpt: 'SAVE_TRANSLATE_EXCERPT',
  sourceContent: 'SAVE_SOURCE_CONTENT',
  traslatedContent: 'SAVE_TRANSLATE_CONTENT'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AtfpActionTypes);

/***/ }),

/***/ "./src/popmodel.js":
/*!*************************!*\
  !*** ./src/popmodel.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _popupStringModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./popupStringModal */ "./src/popupStringModal/index.js");



const {
  sprintf,
  __
} = wp.i18n;
const PopupModal = props => {
  const [fetchStatus, setFetchStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [targetBtn, setTargetBtn] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [blockRules, setBlockRules] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [modalRender, setModalRender] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [settingVisibility, setSettingVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const sourceLang = atfp_ajax_object.source_lang;
  const targetLang = props.targetLang;
  const sourceLangName = atfp_ajax_object.languageObject[sourceLang];
  const targetLangName = atfp_ajax_object.languageObject[targetLang];
  const apiUrl = atfp_ajax_object.ajax_url;
  const imgFolder = atfp_ajax_object.atfp_url + 'assets/images/';

  /**
   * Prepare data to send in API request.
   */
  const apiSendData = {
    atfp_nonce: atfp_ajax_object.ajax_nonce,
    action: atfp_ajax_object.action_block_rules
  };

  /**
   * Update the fetch status state.
   * @param {boolean} state - The state to update the fetch status with.
   */
  const updateFetch = state => {
    setFetchStatus(state);
  };

  /**
   * useEffect hook to set settingVisibility.
   * Triggers the setSettingVisibility only when user click on meta field Button.
  */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const metaFieldBtn = document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');
    if (metaFieldBtn) {
      metaFieldBtn.addEventListener('click', () => {
        setSettingVisibility(prev => !prev);
      });
    }
  }, []);

  /**
   * useEffect hook to fetch block rules data from the server.
   * Triggers the fetch only when fetchStatus is true and blockRules is empty.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (Object.keys(blockRules).length > 0 || !fetchStatus) {
      return;
    }
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams(apiSendData)
    }).then(response => response.json()).then(data => {
      const blockRules = JSON.parse(data.data.blockRules);
      setBlockRules(blockRules);
    }).catch(error => {
      console.error('Error fetching post content:', error);
    });
  }, [fetchStatus]);

  /**
   * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
   * Renders the modal only when blockRules is not empty and fetchStatus is true.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (Object.keys(blockRules).length <= 0) {
      return;
    }
    const btn = targetBtn;
    const service = btn.dataset && btn.dataset.service;
    const serviceLabel = btn.dataset && btn.dataset.serviceLabel;
    // const postId = urlParams.get('from_post');
    const postId = props.postId;
    console.log(postId);
    const parentWrp = document.getElementById("atfp_strings_model");
    if (fetchStatus && Object.keys(blockRules).length > 0) {
      react_dom__WEBPACK_IMPORTED_MODULE_0___default().render( /*#__PURE__*/React.createElement(_popupStringModal__WEBPACK_IMPORTED_MODULE_2__["default"], {
        blockRules: blockRules,
        visibility: fetchStatus,
        updateFetch: updateFetch,
        postId: postId,
        service: service,
        serviceLabel: serviceLabel,
        sourceLang: sourceLang,
        targetLang: targetLang,
        modalRender: modalRender,
        pageTranslate: props.pageTranslate
      }), parentWrp);
      setSettingVisibility(prev => !prev);
    }
  }, [fetchStatus, blockRules]);

  /**
   * Function to handle fetching content based on the target button clicked.
   * Sets the target button and updates the fetch status to true.
   * @param {Event} e - The event object representing the button click.
   */
  const fetchContent = e => {
    let targetElement = !e.target.classList.contains('atfp-service-btn') ? e.target.closest('.atfp-service-btn') : e.target;
    setModalRender(prev => prev + 1);
    setTargetBtn(targetElement);
    setFetchStatus(true);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, settingVisibility && /*#__PURE__*/React.createElement("div", {
    className: "modal-container",
    style: {
      display: settingVisibility ? 'flex' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-settings modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, __("Step 1 - Select Translation Provider (Beta)", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("h4", null, sprintf(__("Translate post content from %(source)s to %(target)s", 'automatic-translation-for-polylang'), {
    source: sourceLangName,
    target: targetLangName
  })), /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: () => setSettingVisibility(false)
  }, "\xD7")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("strong", {
    className: "atlt-heading"
  }, __("Translate Using Yandex Page Translate Widget", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: "inputGroup"
  }, /*#__PURE__*/React.createElement("button", {
    className: "atfp-service-btn translate button button-primary",
    "data-service": "yandex",
    "data-service-label": "Yandex Translate",
    onClick: fetchContent
  }, __("Yandex Translate (Beta)", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "https://translate.yandex.com/",
    target: "_blank"
  }, /*#__PURE__*/React.createElement("img", {
    className: "pro-features-img",
    src: `${imgFolder}powered-by-yandex.png`,
    alt: "powered by Yandex Translate Widget"
  }))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "0"
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("Unlimited Translations with Yandex Translate", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("No API Key Required for Yandex Translate", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("Supports Multiple Languages", 'automatic-translation-for-polylang'), " - ", /*#__PURE__*/React.createElement("a", {
    href: "https://yandex.com/support2/translate-desktop/en/supported-langs",
    target: "_blank"
  }, __("See Supported Languages", 'automatic-translation-for-polylang')))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "atfp-setting-close",
    onClick: () => setSettingVisibility(false)
  }, __("Close", 'automatic-translation-for-polylang'))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PopupModal);

/***/ }),

/***/ "./src/popupStringModal/body.js":
/*!**************************************!*\
  !*** ./src/popupStringModal/body.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fetch_post__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fetch-post */ "./src/fetch-post.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }


const {
  __
} = wp.i18n;
const {
  select
} = wp.data;
const StringPopUpBody = props => {
  const {
    service: service,
    serviceLabel: serviceLabel
  } = props;
  const [stringAvality, setStringAvality] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  let totalWordCount = 0;
  /**
   * Updates the post content with the provided content.
   * @param {string} content - The content to update the post with.
   */
  const updatePostContent = content => {
    props.updatePostContent(content);
    const translationEntry = select("block-atfp/translate").getTranslationEntry();
    const totalString = Object.values(translationEntry).filter(data => data.source !== undefined && /[^\p{L}\p{N}]/gu.test(data.source));
    if (Object.keys(totalString).length > 0) {
      setStringAvality(true);
    } else {
      setStringAvality(false);
    }
  };
  const updateTranslateContent = entries => {
    if (Object.getPrototypeOf(entries) === Object.prototype && entries.stringRenderComplete === true) {
      props.stringCountHandler(totalWordCount);
      return;
    }
    let entrie = entries.join(" ");
    if (undefined === entrie || entrie.trim() === '') {
      return;
    }
    ;
    entrie = entrie.replace(/#atfp_open_translate_span#(.*?)#atfp_close_translate_span#/g, '');
    const wordCount = entrie.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
    totalWordCount += wordCount;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp_translate_progress"
  }, __("Automatic translation is in progress....", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("br", null), __("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), __("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: `translator-widget ${service}`,
    style: {
      display: `${stringAvality ? 'block' : 'none'}`
    }
  }, /*#__PURE__*/React.createElement("h3", {
    class: "choose-lang"
  }, __("Choose language", 'automatic-translation-for-polylang'), " ", /*#__PURE__*/React.createElement("span", {
    class: "dashicons-before dashicons-translation"
  })), /*#__PURE__*/React.createElement("div", {
    id: "atfp_yandex_translate_element",
    style: {
      display: `${service === 'yandex' ? 'block' : 'none'}`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: `atfp_string_container ${!stringAvality ? 'atfp_empty_string' : ''}`
  }, /*#__PURE__*/React.createElement("table", {
    className: "scrolldown",
    id: "stringTemplate"
  }, stringAvality && /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, __("S.No", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, __("Source Text", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, __("Translation", 'automatic-translation-for-polylang')))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement(_fetch_post__WEBPACK_IMPORTED_MODULE_1__["default"], _extends({
    blockRules: props.blockRules,
    setPostData: updatePostContent
  }, props, {
    translateContent: updateTranslateContent
  }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpBody);

/***/ }),

/***/ "./src/popupStringModal/footer.js":
/*!****************************************!*\
  !*** ./src/popupStringModal/footer.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_createTranslatedPost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/createTranslatedPost */ "./src/component/createTranslatedPost/index.js");
/* harmony import */ var _notice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notice */ "./src/popupStringModal/notice.js");


const {
  sprintf,
  __
} = wp.i18n;
const StringPopUpFooter = props => {
  /**
   * Function to close the popup modal.
   */
  const closeModal = () => {
    props.setPopupVisibility(false);
  };

  /**
   * Function to create a translated post using the provided content, translation, block rules, and modal close function.
   */
  const createTranslatedPost = () => {
    const postContent = props.postContent;
    const blockRules = props.blockRules;
    const modalClose = closeModal;
    (0,_component_createTranslatedPost__WEBPACK_IMPORTED_MODULE_0__["default"])({
      postContent: postContent,
      modalClose: modalClose,
      blockRules: blockRules
    });
    props.pageTranslate(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-footer",
    key: props.modalRender
  }, !props.translateStatus && props.stringCount && /*#__PURE__*/React.createElement(_notice__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: "atfp_string_count"
  }, sprintf(__("Automated translation complete: %s strings translated, saving valuable time and resources.", 'automatic-translation-for-polylang'), props.stringCount)), /*#__PURE__*/React.createElement("div", {
    className: "save_btn_cont"
  }, /*#__PURE__*/React.createElement("button", {
    className: "notranslate save_it button button-primary",
    disabled: props.translateStatus,
    onClick: createTranslatedPost
  }, __("Update Content", 'automatic-translation-for-polylang'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpFooter);

/***/ }),

/***/ "./src/popupStringModal/header.js":
/*!****************************************!*\
  !*** ./src/popupStringModal/header.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_createTranslatedPost__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component/createTranslatedPost */ "./src/component/createTranslatedPost/index.js");

const {
  __
} = wp.i18n;
const StringPopUpHeader = props => {
  /**
   * Function to close the popup modal.
   */
  const closeModal = () => {
    props.setPopupVisibility(false);
  };

  /**
   * Function to create a translated post using the provided content, translation settings, block rules, and modal close function.
   */
  const createTranslatedPost = () => {
    const postContent = props.postContent;
    const blockRules = props.blockRules;
    const modalClose = closeModal;
    (0,_component_createTranslatedPost__WEBPACK_IMPORTED_MODULE_0__["default"])({
      postContent: postContent,
      modalClose: modalClose,
      blockRules: blockRules
    });
    props.pageTranslate(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-header",
    key: props.modalRender
  }, /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: closeModal
  }, "\xD7"), /*#__PURE__*/React.createElement("h2", {
    className: "notranslate"
  }, __("Step 2 - Start Automatic Translation Process (Beta)", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: "save_btn_cont"
  }, /*#__PURE__*/React.createElement("button", {
    className: "notranslate save_it button button-primary",
    disabled: props.translateStatus,
    onClick: createTranslatedPost
  }, __("Update Content", 'automatic-translation-for-polylang'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "none"
    },
    className: "ytstats hidden"
  }, __("Wahooo! You have saved your valuable time via auto translating", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("strong", {
    className: "totalChars"
  }, " "), " ", __("characters using", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement("a", {
    href: "https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post",
    target: "_new"
  }, __("Loco Automatic Translate Addon", 'automatic-translation-for-polylang')))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpHeader);

/***/ }),

/***/ "./src/popupStringModal/index.js":
/*!***************************************!*\
  !*** ./src/popupStringModal/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header */ "./src/popupStringModal/header.js");
/* harmony import */ var _body__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./body */ "./src/popupStringModal/body.js");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./footer */ "./src/popupStringModal/footer.js");
/* harmony import */ var _component_TranslateProvider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../component/TranslateProvider */ "./src/component/TranslateProvider/index.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }





const popStringModal = props => {
  const [popupVisibility, setPopupVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(props.visibility);
  const [refPostData, setRefPostData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [translatePending, setTranslatePending] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [translateObj, setTranslateObj] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [stringCount, setStringCount] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const stringCountHandler = number => {
    if (popupVisibility) {
      setStringCount(number);
    }
  };

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
    props.updateFetch(state);
  };
  const translateStatusHandler = () => {
    setTranslatePending(false);
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    document.documentElement.setAttribute('translate', 'no');
    document.body.classList.add('notranslate');

    /**
     * Calls the translate service provider based on the service type.
     * For example, it can call services like yandex Translate.
    */
    const service = props.service;
    const id = `atfp_${service}_translate_element`;
    if (undefined === translateObj[service] && true !== translateObj[service]) {
      setTranslateObj(prev => {
        return {
          ...prev,
          [service]: true
        };
      });
      _component_TranslateProvider__WEBPACK_IMPORTED_MODULE_4__["default"][service]({
        sourceLang: props.sourceLang,
        targetLang: props.targetLang,
        translateStatus: translateStatusHandler,
        ID: id
      });
    }
  }, [props.service]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setPopupVisibility(true);
    setTimeout(() => {
      const stringModal = document.querySelector('.atfp_string_container');
      if (stringModal) {
        stringModal.scrollTop = 0;
      }
      ;
    });
  }, [props.modalRender]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    class: "modal-container",
    style: {
      display: popupVisibility ? 'flex' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    class: "modal-content"
  }, /*#__PURE__*/React.createElement(_header__WEBPACK_IMPORTED_MODULE_1__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    blockRules: props.blockRules,
    translateStatus: translatePending,
    pageTranslate: props.pageTranslate
  }), /*#__PURE__*/React.createElement(_body__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, props, {
    updatePostContent: updatePostContentHandler,
    blockRules: props.blockRules,
    stringCountHandler: stringCountHandler
  })), /*#__PURE__*/React.createElement(_footer__WEBPACK_IMPORTED_MODULE_3__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    blockRules: props.blockRules,
    translateStatus: translatePending,
    pageTranslate: props.pageTranslate,
    stringCount: stringCount
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (popStringModal);

/***/ }),

/***/ "./src/popupStringModal/notice.js":
/*!****************************************!*\
  !*** ./src/popupStringModal/notice.js ***!
  \****************************************/
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
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popmodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popmodel */ "./src/popmodel.js");
/* harmony import */ var _global_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global-store */ "./src/global-store/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);



const init = () => {
  let atfpModals = new Array();
  const atfpSettingModalWrp = '<!-- The Modal --><div id="atfp-setting-modal"></div>';
  const atfpStringModalWrp = '<div id="atfp_strings_model" class="modal atfp_custom_model"></div>';
  atfpModals.push(atfpSettingModalWrp, atfpStringModalWrp);
  atfpModals.forEach(modal => {
    document.body.insertAdjacentHTML('beforeend', modal);
  });
};
const App = () => {
  const [pageTranslate, setPageTranslate] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const urlParams = new URLSearchParams(window.location.search);
  const targetLang = urlParams.get('new_lang');
  const postId = urlParams.get('from_post');
  const pageTranslateHandler = status => {
    setPageTranslate(status);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (pageTranslate) {
      const metaFieldBtn = document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');
      if (metaFieldBtn) {
        metaFieldBtn.disabled = true;
      }
    }
  }, [pageTranslate]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, !pageTranslate && /*#__PURE__*/React.createElement(_popmodel__WEBPACK_IMPORTED_MODULE_0__["default"], {
    pageTranslate: pageTranslateHandler,
    postId: postId,
    targetLang: targetLang
  }));
};

// Append app root wrapper in body
init();
// Render the main App component
window.addEventListener('load', () => {
  wp.element.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('atfp-setting-modal'));
});
/******/ })()
;
//# sourceMappingURL=index.js.map