/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./automatic-translate/src/AllowedMetafileds.js":
/*!******************************************************!*\
  !*** ./automatic-translate/src/AllowedMetafileds.js ***!
  \******************************************************/
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

/***/ "./automatic-translate/src/FetchPost/Gutenberg/index.js":
/*!**************************************************************!*\
  !*** ./automatic-translate/src/FetchPost/Gutenberg/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _storeSourceString_Gutenberg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../storeSourceString/Gutenberg */ "./automatic-translate/src/storeSourceString/Gutenberg/index.js");

const {
  __
} = wp.i18n;
const {
  parse
} = wp.blocks;
const GutenbergPostFetch = async props => {
  const blockRules = props.blockRules;
  const apiUrl = atfp_ajax_object.ajax_url;

  /**
   * Prepare data to send in API request.
   */
  const apiSendData = {
    postId: parseInt(props.postId),
    local: props.targetLang,
    current_local: props.sourceLang,
    atfp_nonce: atfp_ajax_object.ajax_nonce,
    action: atfp_ajax_object.action_fetch
  };

  /**
   * useEffect hook to fetch post data from the specified API endpoint.
   * Parses the response data and updates the state accordingly.
   * Handles errors in fetching post content.
   */
  // useEffect(() => {
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(apiSendData)
  }).then(response => response.json()).then(data => {
    const post_data = data.data;
    if (post_data.content && post_data.content.trim() !== '') {
      post_data.content = parse(post_data.content);
    }
    (0,_storeSourceString_Gutenberg__WEBPACK_IMPORTED_MODULE_0__["default"])(post_data, blockRules);
    props.refPostData(post_data);
    props.updatePostDataFetch(true);
  }).catch(error => {
    console.error('Error fetching post content:', error);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GutenbergPostFetch);

/***/ }),

/***/ "./automatic-translate/src/component/FilterNestedAttr/index.js":
/*!*********************************************************************!*\
  !*** ./automatic-translate/src/component/FilterNestedAttr/index.js ***!
  \*********************************************************************/
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

/***/ "./automatic-translate/src/component/FilterTargetContent/index.js":
/*!************************************************************************!*\
  !*** ./automatic-translate/src/component/FilterTargetContent/index.js ***!
  \************************************************************************/
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
   * Filters the SEO content.
   * @param {string} content - The SEO content to filter.
   * @returns {string} The filtered SEO content.
   */
  const filterSeoContent = content => {
    const regex = /(%{1,2}[a-zA-Z0-9_]+%{0,2})/g;

    // Replace placeholders with wrapped spans
    const output = content.replace(regex, match => {
      return `#atfp_open_translate_span#${match}#atfp_close_translate_span#`;
    });
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
    let content = tempElement.innerText;
    const isSeoContent = /^(_yoast_wpseo_|rank_math_|_seopress_)/.test(props.contentKey.trim());
    if (isSeoContent) {
      content = filterSeoContent(content);
    }
    return splitContent(content);
  };

  /**
   * The content to be filtered based on the service type.
   * If the service is 'yandex', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
   */
  const content = 'yandex' === props.service || 'localAiTranslator' === props.service ? filterSourceData(props.content) : props.content;
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, 'yandex' === props.service || 'localAiTranslator' === props.service ? content.map((data, index) => {
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

/***/ "./automatic-translate/src/component/StoreTimeTaken/index.js":
/*!*******************************************************************!*\
  !*** ./automatic-translate/src/component/StoreTimeTaken/index.js ***!
  \*******************************************************************/
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
  status = false
}) => {
  const timeTaken = (end - start) / 1000; // Convert milliseconds to seconds
  const data = {};
  if (prefix) {
    data.provider = prefix;
    if (start && end) {
      const oldTimeTaken = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('block-atfp/translate').getTranslationInfo().translateData[prefix]?.timeTaken || 0;
      data.timeTaken = timeTaken + oldTimeTaken;
    }
    if (status) {
      data.translateStatus = true;
    }
    (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.dispatch)('block-atfp/translate').translationInfo(data);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StoreTimeTaken);

/***/ }),

/***/ "./automatic-translate/src/component/TranslateProvider/index.js":
/*!**********************************************************************!*\
  !*** ./automatic-translate/src/component/TranslateProvider/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _yandex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./yandex */ "./automatic-translate/src/component/TranslateProvider/yandex/index.js");
/* harmony import */ var _local_ai_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./local-ai-translator */ "./automatic-translate/src/component/TranslateProvider/local-ai-translator/index.js");



/**
 * Provides translation services using Yandex Translate.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  yandex: _yandex__WEBPACK_IMPORTED_MODULE_0__["default"],
  localAiTranslator: _local_ai_translator__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./automatic-translate/src/component/TranslateProvider/local-ai-translator/index.js":
/*!******************************************************************************************!*\
  !*** ./automatic-translate/src/component/TranslateProvider/local-ai-translator/index.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _local_ai_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./local-ai-translator */ "./automatic-translate/src/component/TranslateProvider/local-ai-translator/local-ai-translator.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _storeTranslatedString__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../storeTranslatedString */ "./automatic-translate/src/component/storeTranslatedString/index.js");
/* harmony import */ var _component_StoreTimeTaken__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../component/StoreTimeTaken */ "./automatic-translate/src/component/StoreTimeTaken/index.js");





const localAiTranslator = async props => {
  const targetLangName = atfp_ajax_object.languageObject[props.targetLang];
  let translationInitialize = false;
  let startTime = 0;
  const startTranslation = () => {
    startTime = new Date().getTime();
    const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");
    if (stringContainer[0].scrollHeight > 100) {
      jQuery("#atfp_strings_model .atfp_translate_progress").fadeIn("slow");
    }
  };
  const completeTranslation = () => {
    (0,_component_StoreTimeTaken__WEBPACK_IMPORTED_MODULE_4__["default"])({
      prefix: 'localAiTranslator',
      start: startTime,
      end: new Date().getTime(),
      translateStatus: true
    });
    setTimeout(() => {
      props.translateStatus();
      jQuery("#atfp_strings_model .atfp_translate_progress").fadeOut("slow");
    }, 4000);
  };
  const beforeTranslate = ele => {
    const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");
    if (stringContainer.length < 1) {
      TranslateProvider.stopTranslation();
      (0,_component_StoreTimeTaken__WEBPACK_IMPORTED_MODULE_4__["default"])({
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
    (0,_storeTranslatedString__WEBPACK_IMPORTED_MODULE_3__["default"])({
      type: type,
      key: key,
      translateContent: translatedText,
      source: sourceText,
      provider: 'localAiTranslator'
    });
    const translationEntry = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('block-atfp/translate').getTranslationInfo().translateData?.localAiTranslator;
    const previousTargetWordCount = translationEntry && translationEntry.targetWordCount ? translationEntry.targetWordCount : 0;
    const previousTargetCharacterCount = translationEntry && translationEntry.targetCharacterCount ? translationEntry.targetCharacterCount : 0;
    if (translatedText.trim() !== '' && translatedText.trim().length > 0) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)('block-atfp/translate').translationInfo({
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
    btnText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Translate To", 'automatic-translations-for-polylang') + ' ' + targetLangName + ' (Beta)',
    stringSelector: ".atfp_string_container tbody tr td.translate:not([data-translate-status='translated'])",
    progressBarSelector: "#atfp_strings_model .atfp_translate_progress",
    sourceLanguage: props.sourceLang,
    targetLanguage: props.targetLang,
    targetLanguageLabel: targetLangName,
    onStartTranslationProcess: startTranslation,
    onComplete: completeTranslation,
    onBeforeTranslate: beforeTranslate,
    onAfterTranslate: afterTranslate
  });
  if (TranslateProvider.hasOwnProperty('init')) {
    translationInitialize = true;
    TranslateProvider.init();
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (localAiTranslator);

/***/ }),

/***/ "./automatic-translate/src/component/TranslateProvider/local-ai-translator/local-ai-translator.js":
/*!********************************************************************************************************!*\
  !*** ./automatic-translate/src/component/TranslateProvider/local-ai-translator/local-ai-translator.js ***!
  \********************************************************************************************************/
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
  }

  // Method to check language support and return relevant data
  extraData = async () => {
    // Check if the language is supported
    const langSupportedStatus = await ChromeAiTranslator.languageSupportedStatus(this.sourceLanguage, this.targetLanguage, this.targetLanguageLabel);
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
  static languageSupportedStatus = async (sourceLanguage, targetLanguage, targetLanguageLabel) => {
    const supportedLanguages = ['en', 'es', 'ja', 'ar', 'bn', 'de', 'fr', 'hi', 'it', 'ko', 'nl', 'pl', 'pt', 'ru', 'th', 'tr', 'vi', 'zh', 'zh-hant', 'bg', 'cs', 'da', 'el', 'fi', 'hr', 'hu', 'id', 'iw', 'lt', 'no', 'ro', 'sk', 'sl', 'sv', 'uk', 'en-zh'].map(lang => lang.toLowerCase());

    // Browser check
    if (!window.hasOwnProperty('chrome') || !navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edg')) {
      const message = jQuery(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">The Translator API, which uses local AI models, only works in the Chrome browser. For more details, <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">click here</a>.</span>`);
      return message;
    }
    // Check if the translation API is available
    if (!('translation' in self && 'createTranslator' in self.translation)) {
      const message = jQuery(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">The Translator AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Translator AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">click here</a>.</span>`);
      return message;
    }

    // Check if the target language is supported
    if (!supportedLanguages.includes(targetLanguage.toLowerCase())) {
      const message = jQuery(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">Unfortunately, the <strong>${targetLanguageLabel} (${targetLanguage})</strong> language is currently not supported by the Local Translator AI modal. Please check and read the docs which languages are currently supported by <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">clicking here</a>.</span>`);
      return message;
    }

    // Check if translation can be performed
    const status = await translation.canTranslate({
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    });

    // Handle case for language pack after download
    if (status === "after-download") {
      const message = jQuery(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">Please install the <strong>${targetLanguageLabel} (${targetLanguage})</strong> language pack to proceed.To install the language pack, visit <strong>chrome://on-device-translation-internals</strong>. For further assistance, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">documentation</a>.</span>`);
      return message;
    }

    // Handle case for language pack not readily available
    if (status !== 'readily') {
      const message = jQuery(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">Please ensure that the <strong>${targetLanguageLabel} (${targetLanguage})</strong> language pack is installed and set as a preferred language in your browser. To install the language pack, visit <strong>chrome://on-device-translation-internals</strong>. For further assistance, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">documentation</a>.</span>`);
      return message;
    }
    return true;
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
    this.translator = await self.translation.createTranslator({
      sourceLanguage: this.sourceLanguage,
      targetLanguage: langCode
    });

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
      jQuery(this.progressBarSelector).find(".chrome-ai-translator-strings-count").show().find(".totalChars").text(this.completedCharacterCount);
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

/***/ "./automatic-translate/src/component/TranslateProvider/yandex/index.js":
/*!*****************************************************************************!*\
  !*** ./automatic-translate/src/component/TranslateProvider/yandex/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringModalScroll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../stringModalScroll */ "./automatic-translate/src/component/stringModalScroll/index.js");

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
      (0,_stringModalScroll__WEBPACK_IMPORTED_MODULE_0__["default"])(translateStatus);
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
      (0,_stringModalScroll__WEBPACK_IMPORTED_MODULE_0__["default"])(translateStatus);
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

/***/ "./automatic-translate/src/component/TranslateProvider/yandex/yandex-language.js":
/*!***************************************************************************************!*\
  !*** ./automatic-translate/src/component/TranslateProvider/yandex/yandex-language.js ***!
  \***************************************************************************************/
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

/***/ "./automatic-translate/src/component/storeTranslatedString/index.js":
/*!**************************************************************************!*\
  !*** ./automatic-translate/src/component/storeTranslatedString/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AllowedMetafileds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../AllowedMetafileds */ "./automatic-translate/src/AllowedMetafileds.js");
const {
  dispatch
} = wp.data;


/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const SaveTranslation = ({
  type,
  key,
  translateContent,
  source,
  provider
}) => {
  if (['title', 'excerpt'].includes(type)) {
    const action = `${type}SaveTranslate`;
    dispatch('block-atfp/translate')[action](translateContent, provider);
  } else if (['metaFields'].includes(type)) {
    if (Object.keys(_AllowedMetafileds__WEBPACK_IMPORTED_MODULE_0__["default"]).includes(key)) {
      dispatch('block-atfp/translate').metaFieldsSaveTranslate(key, translateContent, source, provider);
    }
  } else {
    dispatch('block-atfp/translate').contentSaveTranslate(key, translateContent, source, provider);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SaveTranslation);

/***/ }),

/***/ "./automatic-translate/src/component/stringModalScroll/index.js":
/*!**********************************************************************!*\
  !*** ./automatic-translate/src/component/stringModalScroll/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _storeTranslatedString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storeTranslatedString */ "./automatic-translate/src/component/storeTranslatedString/index.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _StoreTimeTaken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../StoreTimeTaken */ "./automatic-translate/src/component/StoreTimeTaken/index.js");




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
    scrollSpeed
  } = props;
  const scrollHeight = element.scrollHeight - element.offsetHeight + 100;
  let startTime = null;
  let startScrollTop = element.scrollTop;
  const animateScroll = () => {
    const currentTime = performance.now();
    const duration = scrollSpeed;
    const scrollTarget = scrollHeight + 2000;
    if (!startTime) {
      startTime = currentTime;
    }
    const progress = (currentTime - startTime) / duration;
    const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;
    if (scrollPosition > scrollHeight) {
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
const updateTranslatedContent = () => {
  const container = document.getElementById("atfp_strings_model");
  const stringContainer = container.querySelector('.atfp_string_container');
  const translatedData = stringContainer.querySelectorAll('td.translate[data-string-type]');
  translatedData.forEach(ele => {
    const translatedText = ele.innerText;
    const key = ele.dataset.key;
    const type = ele.dataset.stringType;
    const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;
    (0,_storeTranslatedString__WEBPACK_IMPORTED_MODULE_0__["default"])({
      type: type,
      key: key,
      translateContent: translatedText,
      source: sourceText,
      provider: 'yandex'
    });
    const translationEntry = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getTranslationInfo().translateData?.yandex;
    const previousTargetWordCount = translationEntry && translationEntry.targetWordCount ? translationEntry.targetWordCount : 0;
    const previousTargetCharacterCount = translationEntry && translationEntry.targetCharacterCount ? translationEntry.targetCharacterCount : 0;
    if (translatedText.trim() !== '' && translatedText.trim().length > 0) {
      (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.dispatch)('block-atfp/translate').translationInfo({
        targetWordCount: previousTargetWordCount + sourceText.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length,
        targetCharacterCount: previousTargetCharacterCount + sourceText.trim().length,
        provider: 'yandex'
      });
    }
  });
};

/**
 * Handles the completion of the translation process by enabling the save button,
 * updating the UI, and stopping the translation progress.
 * 
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
 * Automatically scrolls the string container and triggers the completion callback
 * when the bottom is reached or certain conditions are met.
 * 
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 */
const ModalStringScroll = translateStatus => {
  const startTime = new Date().getTime();
  let translateComplete = false;
  const container = document.getElementById("atfp_strings_model");
  const stringContainer = container.querySelector('.atfp_string_container');
  stringContainer.scrollTop = 0;
  const scrollHeight = stringContainer.scrollHeight;
  if (scrollHeight !== undefined && scrollHeight > 100) {
    container.querySelector(".atfp_translate_progress").style.display = "block";
    setTimeout(() => {
      const scrollSpeed = Math.ceil(scrollHeight / stringContainer?.offsetHeight) * 2000;
      ScrollAnimation({
        element: stringContainer,
        scrollSpeed: scrollSpeed
      });
    }, 2000);
    stringContainer.addEventListener('scroll', () => {
      var isScrolledToBottom = stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight;
      if (isScrolledToBottom && !translateComplete) {
        translateStatus();
        (0,_StoreTimeTaken__WEBPACK_IMPORTED_MODULE_2__["default"])({
          prefix: 'yandex',
          start: startTime,
          end: new Date().getTime(),
          translateStatus: true
        });
        onCompleteTranslation(container);
        translateComplete = true;
      }
    });
    if (stringContainer.clientHeight + 10 >= scrollHeight) {
      (0,_StoreTimeTaken__WEBPACK_IMPORTED_MODULE_2__["default"])({
        prefix: 'yandex',
        start: startTime,
        end: new Date().getTime(),
        translateStatus: true
      });
      setTimeout(() => {
        translateStatus();
        onCompleteTranslation(container);
      }, 1500);
    }
  } else {
    (0,_StoreTimeTaken__WEBPACK_IMPORTED_MODULE_2__["default"])({
      prefix: 'yandex',
      start: startTime,
      end: new Date().getTime(),
      translateStatus: true
    });
    setTimeout(() => {
      translateStatus();
      onCompleteTranslation(container);
    }, 2000);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModalStringScroll);

/***/ }),

/***/ "./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/RankMathSeo.js":
/*!*********************************************************************************************!*\
  !*** ./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/RankMathSeo.js ***!
  \*********************************************************************************************/
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

/***/ "./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/SeoPress.js":
/*!******************************************************************************************!*\
  !*** ./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/SeoPress.js ***!
  \******************************************************************************************/
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

/***/ "./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/YoastSeoFields.js":
/*!************************************************************************************************!*\
  !*** ./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/YoastSeoFields.js ***!
  \************************************************************************************************/
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

/***/ "./automatic-translate/src/createTranslatedPost/Gutenberg/createBlock.js":
/*!*******************************************************************************!*\
  !*** ./automatic-translate/src/createTranslatedPost/Gutenberg/createBlock.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_FilterNestedAttr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component/FilterNestedAttr */ "./automatic-translate/src/component/FilterNestedAttr/index.js");

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
 * @returns {Object} The updated block with translated attributes.
 */
const filterTranslateAttr = (block, blockParseRules, service) => {
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
        dynamicBlockAttr = dynamicBlockAttr[key];
      });
      let blockAttrContent = dynamicBlockAttr;
      if (blockAttrContent instanceof wp.richText.RichTextData) {
        blockAttrContent = blockAttrContent.originalHTML;
      }
      if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {
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
    (0,_component_FilterNestedAttr__WEBPACK_IMPORTED_MODULE_0__["default"])(idArr, filterAttrObj, blockAttr, updateTranslatedAttr);
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
const createBlocks = (block, blockRules, service) => {
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

/***/ "./automatic-translate/src/createTranslatedPost/Gutenberg/index.js":
/*!*************************************************************************!*\
  !*** ./automatic-translate/src/createTranslatedPost/Gutenberg/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createBlock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createBlock */ "./automatic-translate/src/createTranslatedPost/Gutenberg/createBlock.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _SeoMetaFields_YoastSeoFields__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SeoMetaFields/YoastSeoFields */ "./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/YoastSeoFields.js");
/* harmony import */ var _AllowedMetafileds__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../AllowedMetafileds */ "./automatic-translate/src/AllowedMetafileds.js");
/* harmony import */ var _SeoMetaFields_RankMathSeo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SeoMetaFields/RankMathSeo */ "./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/RankMathSeo.js");
/* harmony import */ var _SeoMetaFields_SeoPress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SeoMetaFields/SeoPress */ "./automatic-translate/src/createTranslatedPost/Gutenberg/SeoMetaFields/SeoPress.js");







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
    Object.keys(metaFieldsData).forEach(key => {
      // Update yoast seo meta fields
      if (Object.keys(_AllowedMetafileds__WEBPACK_IMPORTED_MODULE_3__["default"]).includes(key) && _AllowedMetafileds__WEBPACK_IMPORTED_MODULE_3__["default"][key].type === 'string') {
        const translatedMetaFields = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('block-atfp/translate').getTranslatedString('metaFields', metaFieldsData[key][0], key, service);
        if (key.startsWith('_yoast_wpseo_')) {
          (0,_SeoMetaFields_YoastSeoFields__WEBPACK_IMPORTED_MODULE_2__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else if (key.startsWith('rank_math_')) {
          (0,_SeoMetaFields_RankMathSeo__WEBPACK_IMPORTED_MODULE_4__["default"])({
            key: key,
            value: translatedMetaFields
          });
        } else if (key.startsWith('_seopress_')) {
          (0,_SeoMetaFields_SeoPress__WEBPACK_IMPORTED_MODULE_5__["default"])({
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
   * Updates the post content based on translation.
   */
  const postContentUpdate = () => {
    const postContentData = postContent.content;
    if (postContentData.length <= 0) {
      return;
    }
    Object.values(postContentData).forEach(block => {
      (0,_createBlock__WEBPACK_IMPORTED_MODULE_0__["default"])(block, props.blockRules, service);
    });
  };

  // Update post title and excerpt text
  postDataUpdate();
  // Update post meta fields
  postMetaFieldsUpdate();
  // Update post content
  postContentUpdate();
  // Close string modal box
  modalClose();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (translatePost);

/***/ }),

/***/ "./automatic-translate/src/global-store/actions.js":
/*!*********************************************************!*\
  !*** ./automatic-translate/src/global-store/actions.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contentSaveSource: () => (/* binding */ contentSaveSource),
/* harmony export */   contentSaveTranslate: () => (/* binding */ contentSaveTranslate),
/* harmony export */   excerptSaveSource: () => (/* binding */ excerptSaveSource),
/* harmony export */   excerptSaveTranslate: () => (/* binding */ excerptSaveTranslate),
/* harmony export */   metaFieldsSaveSource: () => (/* binding */ metaFieldsSaveSource),
/* harmony export */   metaFieldsSaveTranslate: () => (/* binding */ metaFieldsSaveTranslate),
/* harmony export */   titleSaveSource: () => (/* binding */ titleSaveSource),
/* harmony export */   titleSaveTranslate: () => (/* binding */ titleSaveTranslate),
/* harmony export */   translationInfo: () => (/* binding */ translationInfo)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./automatic-translate/src/global-store/types.js");
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
const translationInfo = ({
  sourceWordCount = null,
  sourceCharacterCount = null,
  timeTaken = null,
  provider = null,
  targetWordCount = null,
  targetCharacterCount = null,
  translateStatus = null
}) => {
  return {
    type: _types__WEBPACK_IMPORTED_MODULE_0__["default"].translationInfo,
    // Action type for saving the translation info
    sourceWordCount: sourceWordCount,
    sourceCharacterCount: sourceCharacterCount,
    // The character count
    timeTaken: timeTaken,
    // The time taken
    targetWordCount: targetWordCount,
    targetCharacterCount: targetCharacterCount,
    provider: provider,
    // The provider
    translateStatus: translateStatus // The translate status
  };
};

/***/ }),

/***/ "./automatic-translate/src/global-store/index.js":
/*!*******************************************************!*\
  !*** ./automatic-translate/src/global-store/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reducer */ "./automatic-translate/src/global-store/reducer.js");
/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ "./automatic-translate/src/global-store/actions.js");
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./automatic-translate/src/global-store/selectors.js");
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

/***/ "./automatic-translate/src/global-store/reducer.js":
/*!*********************************************************!*\
  !*** ./automatic-translate/src/global-store/reducer.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./automatic-translate/src/global-store/types.js");
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
  metaFields: {} // Initial state for meta field translations
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
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].translationInfo:
      // Action to save the translation info
      // Update the state with the new translation info
      const data = {};

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
    default:
      // If the action type does not match any case
      return state;
    // Return the current state unchanged
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reducer); // Exporting the reducer as the default export

/***/ }),

/***/ "./automatic-translate/src/global-store/selectors.js":
/*!***********************************************************!*\
  !*** ./automatic-translate/src/global-store/selectors.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
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
const getTranslationInfo = state => {
  return {
    sourceWordCount: state.translationInfo.sourceWordCount || 0,
    sourceCharacterCount: state.translationInfo.sourceCharacterCount || 0,
    translateData: state.translationInfo.translateData || {}
  };
};

/***/ }),

/***/ "./automatic-translate/src/global-store/types.js":
/*!*******************************************************!*\
  !*** ./automatic-translate/src/global-store/types.js ***!
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
  // Action type for saving the translatio info of the translated content
  translationInfo: 'SAVE_TRANSLATE_INFO'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AtfpActionTypes);

/***/ }),

/***/ "./automatic-translate/src/popmodel.js":
/*!*********************************************!*\
  !*** ./automatic-translate/src/popmodel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _popupStringModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./popupStringModal */ "./automatic-translate/src/popupStringModal/index.js");
/* harmony import */ var _component_TranslateProvider_yandex_yandex_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./component/TranslateProvider/yandex/yandex-language */ "./automatic-translate/src/component/TranslateProvider/yandex/yandex-language.js");
/* harmony import */ var _component_TranslateProvider_local_ai_translator_local_ai_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./component/TranslateProvider/local-ai-translator/local-ai-translator */ "./automatic-translate/src/component/TranslateProvider/local-ai-translator/local-ai-translator.js");





const {
  sprintf,
  __
} = wp.i18n;
const PopupModal = props => {
  const [targetBtn, setTargetBtn] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [blockRules, setBlockRules] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [modalRender, setModalRender] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const [settingVisibility, setSettingVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const sourceLang = atfp_ajax_object.source_lang;
  const targetLang = props.targetLang;
  const sourceLangName = atfp_ajax_object.languageObject[sourceLang];
  const targetLangName = atfp_ajax_object.languageObject[targetLang];
  const apiUrl = atfp_ajax_object.ajax_url;
  const imgFolder = atfp_ajax_object.atfp_url + 'assets/images/';
  const yandexSupport = (0,_component_TranslateProvider_yandex_yandex_language__WEBPACK_IMPORTED_MODULE_3__["default"])().includes(targetLang);

  /**
   * Prepare data to send in API request.
   */
  const apiSendData = {
    atfp_nonce: atfp_ajax_object.ajax_nonce,
    action: atfp_ajax_object.action_block_rules
  };
  const openModalOnLoadHandler = e => {
    e.preventDefault();
    const btnElement = e.target;
    const visibility = btnElement.dataset.value;
    if (visibility === 'yes') {
      setSettingVisibility(true);
    }
    btnElement.closest('#atfp-modal-open-warning-wrapper').remove();
  };

  /**
   * useEffect hook to set settingVisibility.
   * Triggers the setSettingVisibility only when user click on meta field Button.
  */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const firstRenderBtns = document.querySelectorAll('#atfp-modal-open-warning-wrapper .modal-content button');
    const metaFieldBtn = document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');
    if (metaFieldBtn) {
      metaFieldBtn.addEventListener('click', () => {
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
      const localAiTranslatorSupport = await _component_TranslateProvider_local_ai_translator_local_ai_translator__WEBPACK_IMPORTED_MODULE_4__["default"].languageSupportedStatus(sourceLang, targetLang, targetLangName);
      const translateBtn = document.querySelector('.atfp-service-btn#local_ai_translator_btn');
      if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object' && translateBtn) {
        translateBtn.disabled = true;
        jQuery(translateBtn).after(localAiTranslatorSupport);
      }
    };
    languageSupportedStatus();
  }, [settingVisibility]);

  /**
   * Fetch block rules data from the server.
   */
  const fetchBlockRules = () => {
    if (Object.keys(blockRules).length > 0 || props.postDataFetchStatus) {
      return;
    }
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(apiSendData)
    }).then(response => response.json()).then(data => {
      const blockRules = JSON.parse(data.data.blockRules);
      setBlockRules(blockRules);
    }).catch(error => {
      console.error('Error fetching post content:', error);
    });
  };

  /**
   * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
   * Renders the modal only when blockRules is not empty and fetchStatus is true.
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
        parentWrp._reactRoot.render(/*#__PURE__*/React.createElement(_popupStringModal__WEBPACK_IMPORTED_MODULE_2__["default"], {
          blockRules: blockRules,
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
          updatePostDataFetch: props.updatePostDataFetch
        }));
      }
    }
  }, [props.postDataFetchStatus, blockRules, modalRender]);

  /**
   * Function to handle fetching content based on the target button clicked.
   * Sets the target button and updates the fetch status to true.
   * @param {Event} e - The event object representing the button click.
   */
  const fetchContent = async e => {
    let targetElement = !e.target.classList.contains('atfp-service-btn') ? e.target.closest('.atfp-service-btn') : e.target;
    const dataService = targetElement.dataset && targetElement.dataset.service;
    setSettingVisibility(false);
    if (dataService === 'localAiTranslator') {
      const localAiTranslatorSupport = await _component_TranslateProvider_local_ai_translator_local_ai_translator__WEBPACK_IMPORTED_MODULE_4__["default"].languageSupportedStatus(sourceLang, targetLang, targetLangName);
      if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object') {
        return;
      }
    }
    setModalRender(prev => prev + 1);
    setTargetBtn(targetElement);
    fetchBlockRules();
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
  }, /*#__PURE__*/React.createElement("h2", null, __("Step 1 - Select Translation Provider", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("h4", null, sprintf(__("Translate %(postType)s content from %(source)s to %(target)s", 'automatic-translations-for-polylang'), {
    postType: props.postType,
    source: sourceLangName,
    target: targetLangName
  })), /*#__PURE__*/React.createElement("p", {
    className: "atfp-error-message",
    style: {
      marginBottom: '.5rem'
    }
  }, sprintf(__("This translation widget replaces the current %(postType)s content with the original %(source)s %(postType)s and translates it into %(target)s", 'automatic-translations-for-polylang'), {
    postType: props.postType,
    source: sourceLangName,
    target: targetLangName
  })), /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: () => setSettingVisibility(false)
  }, "\xD7")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("strong", {
    className: "atlt-heading"
  }, __("Translate Using Yandex Page Translate Widget", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: "inputGroup"
  }, yandexSupport ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "atfp-service-btn translate button button-primary",
    "data-service": "yandex",
    "data-service-label": "Yandex Translate",
    onClick: fetchContent
  }, __("Yandex Translate", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("br", null)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "atfp-service-btn translate button button-primary",
    disabled: true
  }, __("Yandex Translate", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "atfp-error-message"
  }, targetLangName, " ", __('language is not supported by Yandex Translate', 'automatic-translations-for-polylang'), ".")), /*#__PURE__*/React.createElement("a", {
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
  }, "\u2714"), " ", __("Unlimited Translations with Yandex Translate", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("No API Key Required for Yandex Translate", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("Supports Multiple Languages", 'automatic-translations-for-polylang'), " - ", /*#__PURE__*/React.createElement("a", {
    href: "https://yandex.com/support2/translate-desktop/en/supported-langs",
    target: "_blank"
  }, __("See Supported Languages", 'automatic-translations-for-polylang')))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("strong", {
    className: "atlt-heading"
  }, __("Translate Using Chrome Built-in API", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: "inputGroup"
  }, /*#__PURE__*/React.createElement("button", {
    id: "local_ai_translator_btn",
    className: "atfp-service-btn button button-primary",
    "data-service": "localAiTranslator",
    "data-service-label": "Chrome Built-in API",
    onClick: fetchContent
  }, __("Chrome AI Translator (Beta)", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "https://developer.chrome.com/docs/ai/translator-api",
    target: "_blank"
  }, "Powered by ", /*#__PURE__*/React.createElement("img", {
    className: "pro-features-img",
    src: `${imgFolder}chrome-ai-translator.png`,
    alt: "powered by Chrome built-in API"
  }), " Built-in API")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "atfp-setting-close",
    onClick: () => setSettingVisibility(false)
  }, __("Close", 'automatic-translations-for-polylang'))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PopupModal);

/***/ }),

/***/ "./automatic-translate/src/popupStringModal/body.js":
/*!**********************************************************!*\
  !*** ./automatic-translate/src/popupStringModal/body.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _component_FilterTargetContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component/FilterTargetContent */ "./automatic-translate/src/component/FilterTargetContent/index.js");
/* harmony import */ var _component_TranslateProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component/TranslateProvider */ "./automatic-translate/src/component/TranslateProvider/index.js");
/* harmony import */ var react_loading_skeleton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-loading-skeleton */ "./node_modules/react-loading-skeleton/dist/index.js");
/* harmony import */ var react_loading_skeleton_dist_skeleton_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-loading-skeleton/dist/skeleton.css */ "./node_modules/react-loading-skeleton/dist/skeleton.css");


const {
  __
} = wp.i18n;
const {
  select
} = wp.data;
const {
  Fragment
} = wp.element;



const StringPopUpBody = props => {
  const {
    service: service,
    serviceLabel: serviceLabel
  } = props;
  const [stringAvality, setStringAvality] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const translateContent = select("block-atfp/translate").getTranslationEntry();
  let totalWordCount = 0;
  let totalCharacterCount = 0;

  /**
   * Updates the post content with the provided content.
   * @param {string} content - The content to update the post with.
   */
  const updatePostContent = content => {
    props.updatePostContent(content);
    const translationEntry = select("block-atfp/translate").getTranslationEntry();
    const totalString = Object.values(translationEntry).filter(data => data.source !== undefined && /[\p{L}\p{N}]/gu.test(data.source));
    if (Object.keys(totalString).length > 0) {
      setStringAvality(true);
    } else {
      setStringAvality(false);
    }
  };
  const updateTranslateContent = entries => {
    if (Object.getPrototypeOf(entries) === Object.prototype && entries.stringRenderComplete === true) {
      props.stringCountHandler(totalWordCount, totalCharacterCount);
      return;
    }
    let entrie = entries.join(" ");
    if (undefined === entrie || entrie.trim() === '') {
      return;
    }
    ;
    entrie = entrie.replace(/#atfp_open_translate_span#(.*?)#atfp_close_translate_span#/g, '');
    const wordCount = entrie.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
    const characterCount = entrie.length;
    totalWordCount += wordCount;
    totalCharacterCount += characterCount;
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (props.service === 'yandex') {
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
      _component_TranslateProvider__WEBPACK_IMPORTED_MODULE_2__["default"][service]({
        sourceLang: props.sourceLang,
        targetLang: props.targetLang,
        translateStatus: props.translateStatusHandler,
        ID: id
      });
    }
  }, [props.modalRender, props.postDataFetchStatus]);
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, translateContent.length > 0 && props.postDataFetchStatus ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "atfp_translate_progress",
    key: props.modalRender
  }, __("Automatic translation is in progress....", 'automatic-translations-for-polylang'), /*#__PURE__*/React.createElement("br", null), __("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translations-for-polylang'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), __("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: `translator-widget ${service}`,
    style: {
      display: `${props.service === 'localAiTranslator' ? 'flex' : 'block'}`
    }
  }, props.service === 'localAiTranslator' ? /*#__PURE__*/React.createElement("h3", {
    className: "choose-lang"
  }, __("Translate Using Chrome built-in API", 'automatic-translations-for-polylang'), " ", /*#__PURE__*/React.createElement("span", {
    className: "dashicons-before dashicons-translation"
  })) : /*#__PURE__*/React.createElement("h3", {
    className: "choose-lang"
  }, __("Choose language", 'automatic-translations-for-polylang'), " ", /*#__PURE__*/React.createElement("span", {
    className: "dashicons-before dashicons-translation"
  })), /*#__PURE__*/React.createElement("div", {
    className: "atfp_translate_element_wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    id: "atfp_yandex_translate_element",
    style: {
      display: `${service === 'yandex' ? 'block' : 'none'}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    id: "atfp_localAiTranslator_translate_element",
    style: {
      display: `${service === 'localAiTranslator' ? 'block' : 'none'}`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "atfp_string_container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "scrolldown",
    id: "stringTemplate"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, __("S.No", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, __("Source Text", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("th", {
    className: "notranslate"
  }, __("Translation", 'automatic-translations-for-polylang')))), /*#__PURE__*/React.createElement("tbody", null, props.postDataFetchStatus && /*#__PURE__*/React.createElement(React.Fragment, null, translateContent.map((data, index) => {
    return /*#__PURE__*/React.createElement(Fragment, {
      key: index
    }, undefined !== data.source && data.source.trim() !== '' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", {
      "data-source": "source_text"
    }, data.source), data.translatedData[props.service] ? /*#__PURE__*/React.createElement("td", {
      className: "translate",
      "data-translate-status": "translated",
      "data-key": data.id,
      "data-string-type": data.type
    }, data.translatedData[props.service]) : /*#__PURE__*/React.createElement("td", {
      className: "translate",
      translate: "yes",
      "data-key": data.id,
      "data-string-type": data.type
    }, /*#__PURE__*/React.createElement(_component_FilterTargetContent__WEBPACK_IMPORTED_MODULE_1__["default"], {
      service: props.service,
      content: data.source,
      translateContent: updateTranslateContent,
      totalString: 350,
      currentIndex: index + 1,
      contentKey: data.id
    })))));
  })))))) : props.postDataFetchStatus ? /*#__PURE__*/React.createElement("p", null, __('No strings are available for translation', 'automatic-translations-for-polylang')) : /*#__PURE__*/React.createElement(react_loading_skeleton__WEBPACK_IMPORTED_MODULE_4__["default"], {
    count: 1,
    height: "150px",
    width: "100%",
    className: "react-loading-skeleton-atfp"
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpBody);

/***/ }),

/***/ "./automatic-translate/src/popupStringModal/footer.js":
/*!************************************************************!*\
  !*** ./automatic-translate/src/popupStringModal/footer.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _notice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notice */ "./automatic-translate/src/popupStringModal/notice.js");

const {
  sprintf,
  __
} = wp.i18n;
const StringPopUpFooter = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-footer",
    key: props.modalRender
  }, !props.translateStatus && props.stringCount && /*#__PURE__*/React.createElement(_notice__WEBPACK_IMPORTED_MODULE_0__["default"], {
    className: "atfp_string_count"
  }, sprintf(__("Automated translation complete: %s words translated, saving valuable time and resources.", 'automatic-translations-for-polylang'), props.stringCount)), /*#__PURE__*/React.createElement("div", {
    className: "save_btn_cont"
  }, /*#__PURE__*/React.createElement("button", {
    className: "notranslate save_it button button-primary",
    disabled: props.translateStatus,
    onClick: props.updatePostData
  }, __("Update Content", 'automatic-translations-for-polylang'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpFooter);

/***/ }),

/***/ "./automatic-translate/src/popupStringModal/header.js":
/*!************************************************************!*\
  !*** ./automatic-translate/src/popupStringModal/header.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-header",
    key: props.modalRender
  }, /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: closeModal
  }, "\xD7"), /*#__PURE__*/React.createElement("h2", {
    className: "notranslate"
  }, __("Step 2 - Start Automatic Translation Process", 'automatic-translations-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: "save_btn_cont"
  }, /*#__PURE__*/React.createElement("button", {
    className: "notranslate save_it button button-primary",
    disabled: props.translateStatus,
    onClick: props.updatePostData
  }, __("Update Content", 'automatic-translations-for-polylang'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringPopUpHeader);

/***/ }),

/***/ "./automatic-translate/src/popupStringModal/index.js":
/*!***********************************************************!*\
  !*** ./automatic-translate/src/popupStringModal/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header */ "./automatic-translate/src/popupStringModal/header.js");
/* harmony import */ var _body__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./body */ "./automatic-translate/src/popupStringModal/body.js");
/* harmony import */ var _footer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./footer */ "./automatic-translate/src/popupStringModal/footer.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }




const popStringModal = props => {
  const [popupVisibility, setPopupVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [refPostData, setRefPostData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [translatePending, setTranslatePending] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [stringCount, setStringCount] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [characterCount, setCharacterCount] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!props.postDataFetchStatus) {
      if (atfp_ajax_object.editor_type === 'gutenberg' && Object.keys(props.blockRules).length > 0) {
        props.fetchPostData({
          blockRules: props.blockRules,
          postId: props.postId,
          sourceLang: props.sourceLang,
          targetLang: props.targetLang,
          updatePostDataFetch: props.updatePostDataFetch,
          refPostData: data => setRefPostData(data)
        });
      }
    }
  }, [props.postDataFetchStatus, props.blockRules, props.modalRender]);
  const stringCountHandler = (number, characterCount) => {
    if (popupVisibility) {
      setStringCount(number);
      setCharacterCount(characterCount);
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
  };
  const translateStatusHandler = () => {
    setTranslatePending(false);
  };
  const updatePostDataHandler = () => {
    const postContent = refPostData;
    const blockRules = props.blockRules;
    const modalClose = () => setPopupVisibility(false);
    props.translatePost({
      postContent: postContent,
      modalClose: modalClose,
      blockRules: blockRules,
      service: props.service,
      blockRules: blockRules
    });
    props.pageTranslate(true);
  };
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, " ", popupVisibility && /*#__PURE__*/React.createElement("div", {
    id: `atfp-${props.service}-strings-modal`,
    className: "modal-container",
    style: {
      display: popupVisibility ? 'flex' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement(_header__WEBPACK_IMPORTED_MODULE_1__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    blockRules: props.blockRules,
    translateStatus: translatePending,
    pageTranslate: props.pageTranslate,
    stringCount: stringCount,
    characterCount: characterCount,
    service: props.service,
    updatePostData: updatePostDataHandler
  }), /*#__PURE__*/React.createElement(_body__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, props, {
    updatePostContent: updatePostContentHandler,
    blockRules: props.blockRules,
    stringCountHandler: stringCountHandler,
    contentLoading: props.contentLoading,
    postDataFetchStatus: props.postDataFetchStatus,
    service: props.service,
    sourceLang: props.sourceLang,
    targetLang: props.targetLang,
    translateStatusHandler: translateStatusHandler,
    modalRender: props.modalRender
  })), /*#__PURE__*/React.createElement(_footer__WEBPACK_IMPORTED_MODULE_3__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    blockRules: props.blockRules,
    translateStatus: translatePending,
    pageTranslate: props.pageTranslate,
    stringCount: stringCount,
    characterCount: characterCount,
    service: props.service,
    updatePostData: updatePostDataHandler
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (popStringModal);

/***/ }),

/***/ "./automatic-translate/src/popupStringModal/notice.js":
/*!************************************************************!*\
  !*** ./automatic-translate/src/popupStringModal/notice.js ***!
  \************************************************************/
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

/***/ "./automatic-translate/src/storeSourceString/Gutenberg/index.js":
/*!**********************************************************************!*\
  !*** ./automatic-translate/src/storeSourceString/Gutenberg/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _component_FilterNestedAttr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../component/FilterNestedAttr */ "./automatic-translate/src/component/FilterNestedAttr/index.js");
/* harmony import */ var _AllowedMetafileds__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../AllowedMetafileds */ "./automatic-translate/src/AllowedMetafileds.js");


const {
  dispatch
} = wp.data;

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
      let blockAttrContent = dynamicBlockAttr;
      if (blockAttrContent instanceof wp.richText.RichTextData) {
        blockAttrContent = blockAttrContent.originalHTML;
      }
      if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {
        let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
        if (!/[\p{L}\p{N}]/gu.test(blockAttrContent)) {
          return false;
        }
        dispatch('block-atfp/translate').contentSaveSource(filterKey, blockAttrContent);
      }
      return;
    }
    (0,_component_FilterNestedAttr__WEBPACK_IMPORTED_MODULE_0__["default"])(idArr, filterAttrObj, blockAttr, saveTranslatedAttr);
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
  Object.keys(block).forEach(key => {
    if (key === 'content') {
      blockAttributeContent(block[key], blockRules);
    } else if (key === 'metaFields') {
      Object.keys(block[key]).forEach(metaKey => {
        // Store yoast seo meta fields
        if (Object.keys(_AllowedMetafileds__WEBPACK_IMPORTED_MODULE_1__["default"]).includes(metaKey) && _AllowedMetafileds__WEBPACK_IMPORTED_MODULE_1__["default"][metaKey].type === 'string') {
          if ('' !== block[key][metaKey][0] && undefined !== block[key][metaKey][0]) {
            dispatch('block-atfp/translate').metaFieldsSaveSource(metaKey, block[key][metaKey][0]);
          }
        }
      });
    } else if (['title', 'excerpt'].includes(key)) {
      if (block[key] && block[key].trim() !== '') {
        const action = `${key}SaveSource`;
        dispatch('block-atfp/translate')[action](block[key]);
      }
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GutenbergBlockSaveSource);

/***/ }),

/***/ "./node_modules/react-loading-skeleton/dist/skeleton.css":
/*!***************************************************************!*\
  !*** ./node_modules/react-loading-skeleton/dist/skeleton.css ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
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

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/react-loading-skeleton/dist/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-loading-skeleton/dist/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SkeletonTheme: () => (/* binding */ SkeletonTheme),
/* harmony export */   "default": () => (/* binding */ Skeleton)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
'use client';


/**
 * @internal
 */
const SkeletonThemeContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext({});

/* eslint-disable react/no-array-index-key */
const defaultEnableAnimation = true;
// For performance & cleanliness, don't add any inline styles unless we have to
function styleOptionsToCssProperties({ baseColor, highlightColor, width, height, borderRadius, circle, direction, duration, enableAnimation = defaultEnableAnimation, customHighlightBackground, }) {
    const style = {};
    if (direction === 'rtl')
        style['--animation-direction'] = 'reverse';
    if (typeof duration === 'number')
        style['--animation-duration'] = `${duration}s`;
    if (!enableAnimation)
        style['--pseudo-element-display'] = 'none';
    if (typeof width === 'string' || typeof width === 'number')
        style.width = width;
    if (typeof height === 'string' || typeof height === 'number')
        style.height = height;
    if (typeof borderRadius === 'string' || typeof borderRadius === 'number')
        style.borderRadius = borderRadius;
    if (circle)
        style.borderRadius = '50%';
    if (typeof baseColor !== 'undefined')
        style['--base-color'] = baseColor;
    if (typeof highlightColor !== 'undefined')
        style['--highlight-color'] = highlightColor;
    if (typeof customHighlightBackground === 'string')
        style['--custom-highlight-background'] = customHighlightBackground;
    return style;
}
function Skeleton({ count = 1, wrapper: Wrapper, className: customClassName, containerClassName, containerTestId, circle = false, style: styleProp, ...originalPropsStyleOptions }) {
    var _a, _b, _c;
    const contextStyleOptions = react__WEBPACK_IMPORTED_MODULE_0__.useContext(SkeletonThemeContext);
    const propsStyleOptions = { ...originalPropsStyleOptions };
    // DO NOT overwrite style options from the context if `propsStyleOptions`
    // has properties explicity set to undefined
    for (const [key, value] of Object.entries(originalPropsStyleOptions)) {
        if (typeof value === 'undefined') {
            delete propsStyleOptions[key];
        }
    }
    // Props take priority over context
    const styleOptions = {
        ...contextStyleOptions,
        ...propsStyleOptions,
        circle,
    };
    // `styleProp` has the least priority out of everything
    const style = {
        ...styleProp,
        ...styleOptionsToCssProperties(styleOptions),
    };
    let className = 'react-loading-skeleton';
    if (customClassName)
        className += ` ${customClassName}`;
    const inline = (_a = styleOptions.inline) !== null && _a !== void 0 ? _a : false;
    const elements = [];
    const countCeil = Math.ceil(count);
    for (let i = 0; i < countCeil; i++) {
        let thisStyle = style;
        if (countCeil > count && i === countCeil - 1) {
            // count is not an integer and we've reached the last iteration of
            // the loop, so add a "fractional" skeleton.
            //
            // For example, if count is 3.5, we've already added 3 full
            // skeletons, so now we add one more skeleton that is 0.5 times the
            // original width.
            const width = (_b = thisStyle.width) !== null && _b !== void 0 ? _b : '100%'; // 100% is the default since that's what's in the CSS
            const fractionalPart = count % 1;
            const fractionalWidth = typeof width === 'number'
                ? width * fractionalPart
                : `calc(${width} * ${fractionalPart})`;
            thisStyle = { ...thisStyle, width: fractionalWidth };
        }
        const skeletonSpan = (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: className, style: thisStyle, key: i }, "\u200C"));
        if (inline) {
            elements.push(skeletonSpan);
        }
        else {
            // Without the <br />, the skeleton lines will all run together if
            // `width` is specified
            elements.push(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: i },
                skeletonSpan,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", null)));
        }
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { className: containerClassName, "data-testid": containerTestId, "aria-live": "polite", "aria-busy": (_c = styleOptions.enableAnimation) !== null && _c !== void 0 ? _c : defaultEnableAnimation }, Wrapper
        ? elements.map((el, i) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(Wrapper, { key: i }, el))
        : elements));
}

function SkeletonTheme({ children, ...styleOptions }) {
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(SkeletonThemeContext.Provider, { value: styleOptions }, children));
}




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
  !*** ./automatic-translate/src/index.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _popmodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popmodel */ "./automatic-translate/src/popmodel.js");
/* harmony import */ var _global_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global-store */ "./automatic-translate/src/global-store/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _FetchPost_Gutenberg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FetchPost/Gutenberg */ "./automatic-translate/src/FetchPost/Gutenberg/index.js");
/* harmony import */ var _createTranslatedPost_Gutenberg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createTranslatedPost/Gutenberg */ "./automatic-translate/src/createTranslatedPost/Gutenberg/index.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");






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
  const postType = urlParams.get('post_type');
  const [postDataFetchStatus, setPostDataFetchStatus] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const translatePost = _createTranslatedPost_Gutenberg__WEBPACK_IMPORTED_MODULE_4__["default"];
  const fetchPostData = async data => {
    await (0,_FetchPost_Gutenberg__WEBPACK_IMPORTED_MODULE_3__["default"])(data);
    const allEntries = wp.data.select('block-atfp/translate').getTranslationEntry();
    let totalCharacterCount = 0;
    let totalWordCount = 0;
    allEntries.map(entries => {
      const source = entries.source ? entries.source : '';
      const wordCount = source.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
      const characterCount = source.length;
      totalCharacterCount += characterCount;
      totalWordCount += wordCount;
    });
    wp.data.dispatch('block-atfp/translate').translationInfo({
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
      const metaFieldBtn = document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');
      if (metaFieldBtn) {
        metaFieldBtn.disabled = true;
      }
    }
  }, [pageTranslate]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, !pageTranslate && /*#__PURE__*/React.createElement(_popmodel__WEBPACK_IMPORTED_MODULE_0__["default"], {
    contentLoading: loading,
    updatePostDataFetch: updatePostDataFetch,
    postDataFetchStatus: postDataFetchStatus,
    pageTranslate: handlePageTranslate,
    postId: postId,
    targetLang: targetLang,
    postType: postType,
    fetchPostData: fetchPostData,
    translatePost: translatePost
  }));
};

/**
 * Creates a message popup based on the post type and target language.
 * @returns {HTMLElement} The created message popup element.
 */
const createMessagePopup = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postType = urlParams.get('post_type');
  const targetLang = urlParams.get('new_lang');
  const targetLangName = atfp_ajax_object.languageObject[targetLang];
  const messagePopup = document.createElement('div');
  messagePopup.id = 'atfp-modal-open-warning-wrapper';
  messagePopup.innerHTML = `
    <div class="modal-container" style="display: flex">
      <div class="modal-content">
        <p>Would you like to duplicate your original ${postType} content and have it automatically translated into ${targetLangName}?</p>
        <div>
          <button data-value="yes">Yes</button>
          <button data-value="no">No</button>
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
window.addEventListener('load', () => {
  // Append app root wrapper in body
  init();
  insertMessagePopup();
  const root = react_dom_client__WEBPACK_IMPORTED_MODULE_5__.createRoot(document.getElementById('atfp-setting-modal'));
  root.render(/*#__PURE__*/React.createElement(App, null));
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map