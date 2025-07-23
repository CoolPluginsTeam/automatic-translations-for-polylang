class ChromeAiTranslator {
    // Static method to create an instance of ChromeAiTranslator and return extra data
    static Object = (options) => {
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
        this.onStartTranslationProcess = options.onStartTranslationProcess || (() => { }); // Callback for when translation starts
        this.onComplete = options.onComplete || (() => { }); // Callback for when translation completes
        this.onLanguageError = options.onLanguageError || (() => { }); // Callback for language errors
        this.onBeforeTranslate = options.onBeforeTranslate || (() => { }); // Callback for before translation
        this.onAfterTranslate = options.onAfterTranslate || (() => { }); // Callback for after translation
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
    }

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
    }

    static languagePairAvality = async (source, target) => {
        try {
            const translator = await self.Translator.create({
                sourceLanguage: source,
                targetLanguage: target,
                monitor(m) {
                    m.addEventListener('downloadprogress', (e) => {
                        console.log(`Downloaded ${e.loaded * 100}%`);
                    });
                },
            });

        } catch (err) { console.log('err', err) }

        if (('translation' in self && 'createTranslator' in self.translation)) {
            const status = await self.translation.canTranslate({
                sourceLanguage: source,
                targetLanguage: target,
            });

            return status;
        } else if (('ai' in self && 'translator' in self.ai)) {
            const translatorCapabilities = await self.ai.translator.capabilities();
            const status = await translatorCapabilities.languagePairAvailable(source, target);

            return status;
        } else if ("Translator" in self && "create" in self.Translator) {
            const status = await self.Translator.availability({
                sourceLanguage: source,
                targetLanguage: target,
            });

            return status;
        }

        return false;
    }

    AITranslator = async (targetLanguage) => {
        if (('translation' in self && 'createTranslator' in self.translation)) {
            const translator = await self.translation.createTranslator({
                sourceLanguage: this.sourceLanguage,
                targetLanguage,
            });

            return translator;
        } else if (('ai' in self && 'translator' in self.ai)) {
            const translator = await self.ai.translator.create({
                sourceLanguage: this.sourceLanguage,
                targetLanguage,
            });

            return translator;
        } else if ("Translator" in self && "create" in self.Translator) {
            const translator = await self.Translator.create({
                sourceLanguage: this.sourceLanguage,
                targetLanguage,
            });

            return translator;
        }

        return false;
    }

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
    }

    /**
     * Formats a number by converting it to a string and removing any non-numeric characters.
     * 
     * @param {number} number - The number to format.
     * @returns returns formatted number
     */
    formatCharacterCount = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number;
    }

    // Method to set up button events for translation
    translateBtnEvents = (e) => {
        if (!this.btnSelector || jQuery(this.btnSelector).length === 0) return this.onLanguageError("The button selector is missing. Please provide a valid selector for the button.");
        if (!this.stringSelector || jQuery(this.stringSelector).length === 0) return this.onLanguageError("The string selector is missing. Please provide a valid selector for the strings to be translated.");

        this.translateStatus = true; // Set translation status to true
        this.translateBtn.off("click"); // Clear previous click handlers
        this.translateBtn.prop("disabled", false); // Enable the button

        // Set up click event for starting translation
        if (!this.translationStart) {
            this.translateBtn.on("click", this.startTranslationProcess);
        } else if (this.translateStringEle.length > (this.completedTranslateIndex + 1)) {
            this.translateBtn.on("click", () => {
                this.onStartTranslationProcess(); // Call the start translation callback
                this.stringTranslation(this.completedTranslateIndex + 1); // Start translating the next string
            });
        } else {
            this.onComplete({ translatedStringsCount: this.completedCharacterCount }); // Call the complete callback
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
    stringTranslation = async (index) => {
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
            this.onComplete({ characterCount: this.completedCharacterCount }); // Call the complete callback
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
    }

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
        const progress = ((this.completedCharacterCount / this.totalStringCount) * 1000) / 10; // Calculate progress percentage
        let decimalValue = progress.toString().split('.')[1] || ''; // Get decimal part of the progress
        decimalValue = decimalValue.length > 0 && decimalValue[0] !== '0' ? decimalValue[0] : ''; // Format decimal value
        const formattedProgress = parseInt(progress) + `${decimalValue !== '' ? '.' + decimalValue : ''}`; // Format progress for display
        jQuery(".chrome-ai-translator_progress").css({ "width": `${formattedProgress}%` }).text(`${formattedProgress}%`); // Update progress bar width and text
    };

    // Method to stop the translation process
    stopTranslation = () => {
        this.translateStatus = false; // Set translation status to false
    }

    // Method to reinitialize button events
    reInit = () => {
        this.translateBtnEvents(); // Re-setup button events
    }

    // Method to start translation from the current index
    startTranslation = () => {
        this.translateStatus = true; // Set translation status to true
        this.startTranslationProcess(this.completedTranslateIndex + 1); // Start translation process
    }


    static svgIcons = (iconName) => {
        const Icons = {
            'copy': `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" fill="#2271b1"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg>`
        }

        return Icons[iconName] || '';
    }
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

export default ChromeAiTranslator;