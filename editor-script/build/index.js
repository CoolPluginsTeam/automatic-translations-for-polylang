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

    // Get the opening tag of the first element
    // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
    const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];

    // Check if the first element has a corresponding closing tag
    const openTagName = firstElement.tagName.toLowerCase();
    const closingTagName = new RegExp(`<\/${openTagName}>`, 'i');

    // Check if the inner HTML contains the corresponding closing tag
    const closingTagMatch = firstElement.outerHTML.match(closingTagName);

    // Wrap the first opening tag
    const wrappedFirstTag = `#atfp_open_translate_span#${firstElementOpeningTag}#atfp_close_translate_span#`;

    // Wrap the first element's outerHTML with the wrapped first tag
    let filterContent = firstElement.outerHTML.replace(firstElementOpeningTag, wrappedFirstTag);
    if (closingTagMatch) {
      const wrappedClosingTag = `#atfp_open_translate_span#</${openTagName}>#atfp_close_translate_span#`;
      filterContent = filterContent.replace(closingTagName, wrappedClosingTag);
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
      let elements = doc.querySelector('body').querySelectorAll('*');
      elements.forEach(element => {
        let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
        const textNode = document.createTextNode(filterContent);
        element.parentNode.replaceChild(textNode, element);
      });
      return doc;
    }
    let parser = new DOMParser();
    let doc = parser.parseFromString(string, 'text/html');
    replaceInnerTextWithSpan(doc);
    return splitContent(doc.body.innerText);
  };

  /**
   * The content to be filtered based on the service type.
   * If the service is 'google', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
   */
  const content = 'google' === props.service ? filterSourceData(props.content) : props.content;

  /**
   * Regular expression pattern to match the span elements that should not be translated.
   */
  const notTranslatePattern = /#atfp_open_translate_span#[\s\S]*?#atfp_close_translate_span#/;

  /**
   * Regular expression pattern to replace the placeholder span elements.
   */
  const replacePlaceholderPattern = /#atfp_open_translate_span#|#atfp_close_translate_span#/g;
  return /*#__PURE__*/React.createElement(React.Fragment, null, 'google' === props.service ? content.map((data, index) => {
    const notTranslate = notTranslatePattern.test(data);
    if (notTranslate) {
      return /*#__PURE__*/React.createElement("span", {
        key: index,
        className: "notranslate atfp-notraslate-tag"
      }, data.replace(replacePlaceholderPattern, ''));
    } else {
      return data;
    }
  }) : content);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FilterTargetContent);

/***/ }),

/***/ "./src/component/TranslateProvider/google/index.js":
/*!*********************************************************!*\
  !*** ./src/component/TranslateProvider/google/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const {
  dispatch
} = wp.data;
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
 * Automatically scrolls the container and triggers the completion callback when the bottom is reached or certain conditions are met.
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 */
const translationWaiting = translateStatus => {
  let translateComplete = false;
  const container = document.getElementById("atfp_strings_model");
  const stringContainer = container.querySelector('.atfp_string_container');
  stringContainer.scrollTop = 0;
  const scrollHeight = stringContainer.scrollHeight;
  const scrollSpeed = Math.min(10000, scrollHeight);
  let startTime = null;
  const animateScroll = () => {
    const currentTime = performance.now();
    const duration = scrollSpeed; // 10 seconds
    const scrollTarget = scrollHeight + 2000;
    if (!startTime) {
      startTime = currentTime;
    }
    const progress = (currentTime - startTime) / duration;
    const scrollPosition = scrollTarget * progress;
    stringContainer.scrollTop = scrollPosition;
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };
  if (scrollHeight !== undefined && scrollHeight > 100) {
    container.querySelector(".atfp_translate_progress").style.display = "block";
    setTimeout(() => {
      animateScroll();
      // stringContainer.scrollBy({
      //     top: scrollHeight + 2000,
      //     behavior: 'smooth',
      // });
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

/**
 * Handles the completion of translation by enabling save button, updating stats, and stopping translation progress.
 * @param {HTMLElement} container - The container element for translation.
 */
const onCompleteTranslation = container => {
  // container.querySelector(".atfp_save_strings").disabled = false;
  // container.querySelector(".atfp_stats").style.display = "block";
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
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
const GoogleTranslater = data => {
  // delete window.google;
  const bodyEle = document.querySelector('body');
  bodyEle.setAttribute('translate', 'no');
  const {
    sourceLang,
    targetLang,
    translateStatus
  } = data;
  new google.translate.TranslateElement({
    pageLanguage: sourceLang,
    includedLanguages: targetLang,
    defaultLanguage: sourceLang,
    multilanguagePage: true,
    autoDisplay: false
  }, 'atfp_google_translate_element');
  document.querySelector("#atfp_google_translate_element").addEventListener('change', () => {
    translationWaiting(translateStatus);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GoogleTranslater);

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
/* harmony import */ var _google__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./google */ "./src/component/TranslateProvider/google/index.js");


/**
 * Provides translation services using Deepl and Google Translate.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  google: _google__WEBPACK_IMPORTED_MODULE_0__["default"]
});

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
        let filterKey = uniqueId.replace(/[^a-zA-Z0-9]/g, '');
        let translateContent = '';
        if (!/[a-zA-Z]/.test(blockAttrContent)) {
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
        let filterKey = uniqueId.replace(/[^a-zA-Z0-9]/g, '');
        if (!/[a-zA-Z]/.test(blockAttrContent)) {
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
  parse
} = wp.blocks;
const {
  select
} = wp.data;
const FetchPost = props => {
  const [translateContent, setTranslateContent] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
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
      if (post_data.content.trim() !== '') {
        post_data.content = parse(post_data.content);
      }
      props.setPostData(post_data);
      (0,_component_storeSourceString__WEBPACK_IMPORTED_MODULE_1__["default"])(post_data, blockRules);
      const translationEntry = select("block-atfp/translate").getTranslationEntry();
      setTranslateContent(translationEntry);
      props.translateContent(translationEntry);
    }).catch(error => {
      console.error('Error fetching post content:', error);
    });
  }, [props.fetchKey]);
  let sNo = 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, translateContent.map((data, index) => {
    return undefined !== data.source && data.source.trim() !== '' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, sNo++), /*#__PURE__*/React.createElement("td", {
      "data-source": "source_text"
    }, data.source), /*#__PURE__*/React.createElement("td", {
      class: "translate",
      "data-key": data.id,
      "data-string-type": data.type
    }, /*#__PURE__*/React.createElement(_component_FilterTargetContent__WEBPACK_IMPORTED_MODULE_2__["default"], {
      service: props.service,
      content: data.source
    }))));
  }));
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
      return {
        ...state,
        title: {
          ...state.title,
          source: action.text
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedTitle:
      return {
        ...state,
        title: {
          ...state.title,
          target: action.text
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceExcerpt:
      return {
        ...state,
        excerpt: {
          ...state.excerpt,
          target: action.text
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].traslatedExcerpt:
      return {
        ...state,
        excerpt: {
          ...state.excerpt,
          target: action.text
        }
      };
    case _types__WEBPACK_IMPORTED_MODULE_0__["default"].sourceContent:
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
  __
} = wp.i18n;
const PopupModal = () => {
  const [fetchStatus, setFetchStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [targetBtn, setTargetBtn] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [blockRules, setBlockRules] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [modalRender, setModalRender] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)({});
  const [settingVisibility, setSettingVisibility] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
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
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const duplicateBtn = document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');
    duplicateBtn.addEventListener('click', () => {
      setSettingVisibility(prev => !prev);
    });
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
    const urlParams = new URLSearchParams(window.location.search);
    const btn = targetBtn;
    const service = btn.dataset && btn.dataset.service;
    const serviceLabel = btn.dataset && btn.dataset.serviceLabel;
    const sourceLang = atfp_ajax_object.source_lang;
    const targetLang = urlParams.get('new_lang');
    const postId = urlParams.get('from_post');
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
        modalRender: modalRender
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
      display: settingVisibility ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp-settings modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, __("Step 1 - Select Translation Provider (Beta)", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: () => setSettingVisibility(false)
  }, "\xD7")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("strong", {
    className: "atfp-heading",
    style: {
      marginBottom: "10px",
      display: "inline-block"
    }
  }, __("Translate Using Google Page Translate Widget", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: "inputGroup"
  }, /*#__PURE__*/React.createElement("button", {
    className: "atfp-service-btn translate button button-primary",
    "data-service": "google",
    "data-service-label": "Google Translate",
    onClick: fetchContent
  }, __("Google Translate (Beta)", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("span", {
    className: "proonly-button alsofree"
  }, "\u2714 ", __("Available", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "https://translate.google.com/",
    target: "_blank"
  }, /*#__PURE__*/React.createElement("img", {
    style: {
      marginTop: "5px"
    },
    src: `${imgFolder}powered-by-google.png`,
    alt: __("powered by Google Translate Widget", 'automatic-translation-for-polylang')
  }))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "0"
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("Unlimited Translations with Google Translate", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("No API Key Required for Google Translate", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "green"
    }
  }, "\u2714"), " ", __("Supports Multiple Languages", 'automatic-translation-for-polylang'), " - ", /*#__PURE__*/React.createElement("a", {
    href: "https://en.wikipedia.org/wiki/Google_Translate#Supported_languages",
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
/* harmony import */ var _notice__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./notice */ "./src/popupStringModal/notice.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }



const {
  __
} = wp.i18n;
const StringPopUpBody = props => {
  const {
    service: service,
    serviceLabel: serviceLabel
  } = props;
  const [translateEntryCount, setTranslateEntryCount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);

  /**
   * Updates the post content with the provided content.
   * @param {string} content - The content to update the post with.
   */
  const updatePostContent = content => {
    props.updatePostContent(content);
  };
  const updateTranslateContent = entries => {
    let content = '';
    entries.forEach(object => {
      if (undefined !== object.source && object.source.trim() !== '') {
        content += ' ' + object.source;
      }
      ;
    });
    const wordCount = content.trim().split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length;
    setTranslateEntryCount(wordCount);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "atfp_translate_progress"
  }, __("Automatic translation is in progress....", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("br", null), __("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), __("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translation-for-polylang')), /*#__PURE__*/React.createElement("div", {
    className: `translator-widget ${service}`
  }, /*#__PURE__*/React.createElement("h3", {
    class: "choose-lang"
  }, __("Choose language", 'automatic-translation-for-polylang'), " ", /*#__PURE__*/React.createElement("span", {
    class: "dashicons-before dashicons-translation"
  })), /*#__PURE__*/React.createElement("div", {
    id: "atfp_google_translate_element"
  })), /*#__PURE__*/React.createElement("div", {
    className: "atfp_string_container"
  }, /*#__PURE__*/React.createElement("table", {
    className: "scrolldown",
    id: "stringTemplate"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
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
  }))))), /*#__PURE__*/React.createElement(_notice__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "atfp_string_count"
  }, __("Total Strings Translated:", 'automatic-translation-for-polylang'), " ", translateEntryCount));
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

const {
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
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-footer",
    key: props.modalRender
  }, /*#__PURE__*/React.createElement("div", {
    className: "save_btn_cont"
  }, /*#__PURE__*/React.createElement("button", {
    className: "notranslate save_it button button-primary",
    disabled: props.translateStatus,
    onClick: createTranslatedPost
  }, __("Save Translation", 'automatic-translation-for-polylang'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "none"
    },
    className: "ytstats"
  }, __("Wahooo! You have saved your valuable time via auto translating", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("strong", {
    className: "totalChars"
  }), " ", __("characters using", 'automatic-translation-for-polylang'), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement("a", {
    href: "https://wordpress.org/support/plugin/automatic-translator-addon-for-loco-translate/reviews/#new-post",
    target: "_new"
  }, __("Loco Automatic Translate Addon", 'automatic-translation-for-polylang')))));
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
  }, __("Save Translation", 'automatic-translation-for-polylang'))), /*#__PURE__*/React.createElement("div", {
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
    if (props.service === 'google') {
      document.querySelector('div.skiptranslate iframe.skiptranslate')?.contentDocument?.querySelector('a[title="Close"] img[alt="Close"]')?.click();
    }
    setTranslatePending(true);
    setPopupVisibility(false);
    props.updateFetch(state);
  };
  const translateStatusHandler = () => {
    setTranslatePending(false);
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    /**
     * Calls the translate service provider based on the service type.
     * For example, it can call services like deepL or Google Translate.
    */
    const service = props.service;
    _component_TranslateProvider__WEBPACK_IMPORTED_MODULE_4__["default"][service]({
      ...props,
      translateStatus: translateStatusHandler
    });
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setPopupVisibility(true);
  }, [props.modalRender]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    class: "modal-container",
    style: {
      display: popupVisibility ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    class: "modal-content"
  }, /*#__PURE__*/React.createElement(_header__WEBPACK_IMPORTED_MODULE_1__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    blockRules: props.blockRules,
    translateStatus: translatePending
  }), /*#__PURE__*/React.createElement(_body__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, props, {
    updatePostContent: updatePostContentHandler,
    blockRules: props.blockRules
  })), /*#__PURE__*/React.createElement(_footer__WEBPACK_IMPORTED_MODULE_3__["default"], {
    modalRender: props.modalRender,
    setPopupVisibility: setPopupVisibilityHandler,
    postContent: refPostData,
    blockRules: props.blockRules,
    translateStatus: translatePending
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
  }, props.children.join(' '));
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
  return /*#__PURE__*/React.createElement(_popmodel__WEBPACK_IMPORTED_MODULE_0__["default"], null);
};

// Append app root wrapper in body
init();
// Render the main App component
document.addEventListener('DOMContentLoaded', () => {
  wp.element.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('atfp-setting-modal'));
});
/******/ })()
;
//# sourceMappingURL=index.js.map