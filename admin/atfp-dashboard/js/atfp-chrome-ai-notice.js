jQuery(function ($) {
    class ChromeAiTranslator {

        static languagePairAvality = async (source, target) => {

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
                let status = await self.Translator.availability({
                    sourceLanguage: source,
                    targetLanguage: target,
                });

                return status;
            }

            return false;
        }

        /**
         * Get the list of supported languages for Chrome AI Translator
         * @returns {string[]} Array of supported language codes (lowercase)
         */
        static getSupportedLanguages = () => {
            return ['en', 'es', 'ja', 'ar', 'de', 'bn', 'fr', 'hi', 'it', 'ko', 'nl', 'pl', 'pt', 'ru', 'th', 'tr', 'vi', 'zh', 'zh-hant', 'bg', 'cs', 'da', 'el', 'fi', 'hr', 'hu', 'id', 'iw', 'lt', 'no', 'ro', 'sk', 'sl', 'sv', 'uk', 'kn', 'ta', 'te', 'mr'].map(lang => lang.toLowerCase());
        }

        /**
         * Get the target language from settings, falling back to the first supported language from all_languages that is not the source/default language.
         * @param {string|undefined} configuredTarget - The configured target language code (e.g. from wp_localize_script).
         * @param {string} sourceLanguage - The source/default language code to exclude.
         * @param {Array} allLanguages - Array of {code, label} objects from settings.
         * @param {string} fallback - Final fallback if nothing else works (default: 'hi').
         * @returns {{code: string, label: string}}
         */
        static getTargetLanguage = (configuredTarget, sourceLanguage, allLanguages, fallback = 'hi') => {
            const supportedLanguages = ChromeAiTranslator.getSupportedLanguages();
            const sourceLang = sourceLanguage.toLowerCase();
            const configured = (configuredTarget || fallback).toLowerCase();

            // If configured target is supported and not the source language, use it
            if (supportedLanguages.includes(configured) && Object.keys(allLanguages).includes(configured) && configured !== sourceLang) {
                // Find the label from allLanguages if available
                let label = configured;
                if (allLanguages && Object.keys(allLanguages).length > 0) {
                    const match = Object.keys(allLanguages).find(l => l.toLowerCase() === configured);
                    if (match) label = allLanguages[match].name;
                }
                return { code: configured, label: label };
            }

            // Otherwise loop through all_languages and return the first supported language that is not the source/default
            if (allLanguages && Object.keys(allLanguages).length > 0) {
                for (const lang of Object.keys(allLanguages)) {
                    const code = lang.toLowerCase();
                    if (supportedLanguages.includes(code) && code !== sourceLang) {
                        return { code, label: allLanguages[lang].name };
                    }
                }
            }

            // Final fallback: return the fallback itself
            return { code: fallback, label: fallback };
        }

        /**
         * Check if browser is Chrome (not Edge or other browsers)
         * @returns {boolean} True if browser is Chrome, false otherwise
         */
        static checkBrowserCompatibility = () => {
            return window.hasOwnProperty('chrome') &&
                navigator.userAgent.includes('Chrome') &&
                !navigator.userAgent.includes('Edg');
        }

        /**
         * Check if Chrome AI Translator API is available
         * @returns {boolean} True if API is available, false otherwise
         */
        static checkApiAvailability = () => {
            return ('translation' in self && 'createTranslator' in self.translation) ||
                ('ai' in self && 'translator' in self.ai) ||
                ('Translator' in self && 'create' in self.Translator);
        }

        /**
         * Check if connection is secure (HTTPS or secure context)
         * @returns {boolean} True if connection is secure, false otherwise
         */
        static checkSecureConnection = () => {
            return window.location.protocol === 'https:' || window.isSecureContext;
        }

        /**
         * Initialize clipboard for elements with atfp-tooltip-element pattern
         * Using user provided implementation
         */
        static initializeClipboard = () => {
            // Support both old and new class names
            const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags, .chrome-url-link');

            const copyClipboard = async (text, startCopyStatus, endCopyStatus) => {
                if (!text || text === "") return;

                try {
                    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(text);
                    } else {
                        const div = document.createElement('div');
                        div.textContent = text;
                        document.body.appendChild(div);

                        if (window.getSelection && document.createRange) {
                            const range = document.createRange();
                            range.selectNodeContents(div);

                            const selection = window.getSelection();
                            selection.removeAllRanges(); // clear any existing selection
                            selection.addRange(range);   // select the range
                        }

                        if (document.execCommand) {
                            document.execCommand('copy');
                        }
                        document.body.removeChild(div);
                    }

                    startCopyStatus();
                    setTimeout(endCopyStatus, 800);
                } catch (err) {
                    console.error('Error copying text to clipboard:', err);
                }
            };

            clipboardElements.forEach(element => {
                // Skip if already initialized (has the class and data attribute)
                if (element.classList.contains('atfp-tooltip-element') && element.hasAttribute('data-clipboard-initialized')) {
                    return;
                }

                element.classList.add('atfp-tooltip-element');
                element.setAttribute('data-clipboard-initialized', 'true');

                element.addEventListener('click', (e) => {
                    e.preventDefault();

                    const toolTipExists = element.querySelector('.atfp-tooltip');
                    if (toolTipExists) {
                        return;
                    }

                    const toolTipElement = document.createElement('span');
                    toolTipElement.textContent = "Text to be Copied!";
                    toolTipElement.className = 'atfp-tooltip';
                    element.appendChild(toolTipElement);

                    copyClipboard(
                        element.getAttribute('data-clipboard-text'),
                        () => {
                            toolTipElement.classList.add('atfp-tooltip-active');
                        },
                        () => {
                            setTimeout(() => {
                                toolTipElement.remove();
                            }, 800);
                        }
                    );
                });
            });
        }

        /**
         * Get SVG icons centrally
         * @param {string} iconName - Name of the icon
         * @returns {string} - SVG HTML string
         */
        static svgIcons = (iconName) => {
            const icons = {
                copy: '<svg style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
            };
            return icons[iconName] || '';
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
    }

    /* =========================
     * Chrome Local AI Notice
     * Initialize Chrome AI translator notice on settings page
     * ========================= */
    async function initChromeLocalAINotice() {
        // Check if notice element exists
        const $notice = $('#atfp-chrome-local-ai-notice');
        if (!$notice.length) {
            return; // Notice element doesn't exist, exit early
        }
        // Use centralized Chrome AI Translator utility methods
        const bypassBrowser = typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData.chrome_ai_bypass_browser_check === '1';
        const bypassSecure = typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData.chrome_ai_bypass_secure_check === '1';
        const bypassApi = typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData.chrome_ai_bypass_api_check === '1';

        const safeBrowser = (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.checkSecureConnection)
            ? ChromeAiTranslator.checkSecureConnection()
            : (window && window.location && window.location.protocol === "https:" || window && window.isSecureContext);
        const browserContentSecure = window && window.isSecureContext;

        // Secure connection + API availability check (use centralized method)
        const apiAvailable = (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.checkApiAvailability)
            ? ChromeAiTranslator.checkApiAvailability()
            : false;

        const effectiveApiAvailable = apiAvailable || bypassApi;
        const effectiveSecure = safeBrowser || browserContentSecure || bypassSecure;

        const $heading = $('#atfp-chrome-notice-heading');
        const $message = $('#atfp-chrome-notice-message');

        let showBrowserNotice = false;
        let showSecureNotice = false;
        let showApiNotice = false;
        let showLanguageNotice = false;
        let languageNoticeData = null;

        // Browser check (must be Chrome, not Edge or others) - use centralized method
        const isBrowserCompatible = (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.checkBrowserCompatibility)
            ? ChromeAiTranslator.checkBrowserCompatibility()
            : (window && window.hasOwnProperty("chrome") && navigator && navigator.userAgent && navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Edg"));

        const effectiveBrowserCompatible = isBrowserCompatible || bypassBrowser;

        if (!effectiveBrowserCompatible) {
            showBrowserNotice = true;
        } else if (!effectiveApiAvailable && !effectiveSecure) {
            showSecureNotice = true;
        } else if (!effectiveApiAvailable) {
            showApiNotice = true;
        } else {
            // Only check language issues if browser/API/secure checks pass
            languageNoticeData = await checkLanguageIssues();
            if (languageNoticeData) {
                showLanguageNotice = true;
            }
        }

        if (!showBrowserNotice && !showSecureNotice && !showApiNotice && !showLanguageNotice) {
            // Hide only notice content; keep container visible for test translation section
            $notice.find('.atfp-chrome-local-ai-notice-content').hide();
            $notice.show();
            return; // no notice needed
        }

        // Notice messages
        const notices = {
            browserHeading: '⚠️ Important Notice: Browser Compatibility',
            browserMessage: '<ul><li>' +
                'The <strong>Translator API</strong>, which uses Chrome Local AI Models, is designed exclusively for use with the <strong>Chrome browser</strong>.' +
                '</li><li>' +
                'If you are using a different browser (such as Edge, Firefox, or Safari), the API may not function correctly.' +
                '</li><li>' +
                'Learn more in the <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank" rel="noreferrer">official documentation</a>.' +
                '</li></ul>',
            secureHeading: '⚠️ Important Notice: Secure Connection Required',
            secureMessage: '<ul><li>' +
                'The <strong>Translator API</strong> requires a secure (HTTPS) connection to function properly.' +
                '</li><li>' +
                'If you are on an insecure connection (HTTP), the API will not work.' +
                '</li></ul>' +
                '<p><strong>👉 How to Fix This:</strong></p>' +
                '<ol>' +
                '<li>Switch to a secure connection by using <strong><code>https://</code></strong>.</li>' +
                '<li>' +
                'Alternatively, add this URL to Chrome\'s list of insecure origins treated as secure: ' + createCopyableLink('chrome://flags/#unsafely-treat-insecure-origin-as-secure') +
                '<br />Copy the URL and then open a new window and paste this URL to access the settings.' +
                '</li></ol>',
            apiHeading: '⚠️ Important Notice: API Availability',
            apiMessage: '<ol>' +
                '<li>Open this URL in a new Chrome tab: ' + createCopyableLink('chrome://flags/#translation-api') + '. Copy this URL and then open a new window and paste this URL to access the settings.</li>' +
                '<li>Ensure that the <strong>Experimental translation API</strong> option is set to <strong>Enabled</strong>.</li>' +
                '<li>After change the setting, Click on the <strong>Relaunch</strong> button to apply the changes.</li>' +
                '<li>The Translator AI modal should now be enabled and ready for use.</li>' +
                '</ol>' +
                '<p>For more information, please refer to the <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">documentation</a>.</p>' +
                '<p>If the issue persists, please ensure that your browser is up to date and restart your browser.</p>' +
                '<p>If you continue to experience issues after following the above steps, please <a href="https://my.coolplugins.net/account/support-tickets/" target="_blank" rel="noopener">open a support ticket</a> with our team. We are here to help you resolve any problems and ensure a smooth translation experience.</p>'
        };

        let heading = '';
        let message = '';

        if (showBrowserNotice) {
            heading = notices.browserHeading;
            message = notices.browserMessage;
        } else if (showSecureNotice) {
            heading = notices.secureHeading;
            message = notices.secureMessage;
        } else if (showApiNotice) {
            heading = notices.apiHeading;
            message = notices.apiMessage;
        } else if (showLanguageNotice && languageNoticeData) {
            heading = languageNoticeData.heading;
            message = languageNoticeData.message;
        }

        $heading.html(heading);
        $message.html(message);

        // Check if this is a combined notice (has both unsupported and language pack issues)
        // Combined notice toggles a class (styling handled in CSS)
        const isCombinedNotice = showLanguageNotice && languageNoticeData &&
            languageNoticeData.isCombined === true;

        if (isCombinedNotice) {
            $notice.addClass('atfp-chrome-notice-combined');
        } else {
            $notice.removeClass('atfp-chrome-notice-combined');
        }

        $notice.find('.atfp-chrome-local-ai-notice-content').show();
        $notice.show();

        // Initialize clipboards for any new copyable links
        if (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.initializeClipboard) {
            ChromeAiTranslator.initializeClipboard();
        }
    }

    /**
    * Helper to create copyable link HTML using user's preferred structure
    */
    function createCopyableLink(url) {
        return '<span class="chrome-url-link chrome-ai-translator-flags atfp-tooltip-element" data-clipboard-text="' + url + '">' +
            '<a href="' + url + '" onclick="return false;">' + url + '</a> ' +
            (typeof ChromeAiTranslator !== 'undefined' ? ChromeAiTranslator.svgIcons('copy') : '') +
            '</span>';
    }

    /* =========================
     * Check Language Issues
     * Check for language support and language pack issues for ALL languages
     * ========================= */
    async function checkLanguageIssues() {
        // Get supported languages list from centralized Chrome AI Translator
        const supportedLanguages = ChromeAiTranslator.getSupportedLanguages();

        // Get languages from TRP settings (passed via wp_localize_script)
        let sourceLanguage = 'en';
        let sourceLanguageLabel = 'English';
        let allLanguages = [];

        if (typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData) {
            // Use TRP settings from PHP
            sourceLanguage = atfpChromeAiNoticeData.source_language || 'en';
            sourceLanguageLabel = atfpChromeAiNoticeData.source_language_label || 'English';
            allLanguages = atfpChromeAiNoticeData.all_languages || [];
        }

        // Get target language using centralized method
        const configuredTarget = (atfpChromeAiNoticeData && atfpChromeAiNoticeData.target_language) || 'hi';
        const configuredTargetLabel = (atfpChromeAiNoticeData && atfpChromeAiNoticeData.target_language_label) || 'Hindi';
        const targetObj = ChromeAiTranslator.getTargetLanguage(configuredTarget, sourceLanguage, allLanguages, 'hi');
        let targetLanguage = targetObj.code;
        let targetLanguageLabel = targetObj.code === 'hi' ? configuredTargetLabel : targetObj.label;

        // Check all languages for unsupported ones
        const unsupportedLanguages = [];
        const supportedLanguagePairs = []; // Store supported language pairs for pack checking

        if (allLanguages && allLanguages.length > 0) {
            // Check all languages from TRP settings
            allLanguages.forEach(function (lang) {
                if (!supportedLanguages.includes(lang.code.toLowerCase())) {
                    unsupportedLanguages.push({
                        code: lang.code.toUpperCase(),
                        label: lang.label,
                        isDefault: lang.code === sourceLanguage
                    });
                } else {
                    // Store supported languages for pack checking
                    supportedLanguagePairs.push({
                        code: lang.code.toLowerCase(),
                        fullCode: lang.code,
                        label: lang.label,
                        isDefault: lang.code === targetLanguage
                    });
                }
            });
        } else {
            // Fallback: check source and target languages
            if (!supportedLanguages.includes(sourceLanguage.toLowerCase())) {
                unsupportedLanguages.push({
                    code: sourceLanguage.toUpperCase(),
                    label: sourceLanguageLabel,
                    isDefault: true
                });
            } else {
                supportedLanguagePairs.push({
                    code: sourceLanguage.toLowerCase(),
                    fullCode: sourceLanguage,
                    label: sourceLanguageLabel,
                    isDefault: true
                });
            }
            if (!supportedLanguages.includes(targetLanguage.toLowerCase())) {
                unsupportedLanguages.push({
                    code: targetLanguage.toUpperCase(),
                    label: targetLanguageLabel,
                    isDefault: false
                });
            } else {
                supportedLanguagePairs.push({
                    code: targetLanguage.toLowerCase(),
                    fullCode: targetLanguage,
                    label: targetLanguageLabel,
                    isDefault: false
                });
            }
        }

        // Build unsupported languages notice (Pro-style markup)
        let unsupportedNotice = null;
        if (unsupportedLanguages.length > 0) {
            let unsupportedList = '';
            unsupportedLanguages.forEach(function (lang) {
                unsupportedList += '<strong>' + lang.label + ' (' + lang.code + ')</strong>, ';
            });
            // Remove trailing comma
            unsupportedList = unsupportedList.replace(/, $/, '');

            unsupportedNotice = {
                heading: '<span class="atfp-chrome-unsupported-heading"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" id="error"><g><rect fill="none"/></g><g><path d="M12 7c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1zm-.01-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-3h-2v-2h2v2z"></path></g></svg>Unsupported Languages</span> ',
                message: '<div class="atfp-chrome-unsupported-box">' +
                    '<p>The following languages are not supported by the current AI engine: </br><span class="atfp-unsupported-list">' + unsupportedList + '</span></p>' +
                    '<p>To see the full list of supported translation languages, visit: ' + createCopyableLink('chrome://on-device-translation-internals') + '</p>' +
                    '</div>',
                isCombined: true
            };
        }

        // Check language pack availability for ALL supported language pairs if API is available
        const languagePackIssues = [];

        // Helper function to check language pair availability (use centralized method)
        async function checkLanguagePairAvailability(source, target) {
            if (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.languagePairAvality) {
                return await ChromeAiTranslator.languagePairAvality(source, target);
            }
            return false;
        }

        // Check if browser API is available (use centralized method)
        const apiAvailable = (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.checkApiAvailability)
            ? ChromeAiTranslator.checkApiAvailability()
            : false;

        if (apiAvailable && supportedLanguagePairs.length > 0) {
            try {
                // Get source language
                const sourceLang = supportedLanguagePairs.find(l => l.isDefault) || supportedLanguagePairs[0];
                const targetLangs = supportedLanguagePairs.filter(l => !l.isDefault);

                // Check each target language against source for language pack issues
                for (let i = 0; i < targetLangs.length; i++) {
                    const targetLang = targetLangs[i];
                    try {
                        const status = await checkLanguagePairAvailability(sourceLang.code, targetLang.code);

                        // Collect all language pack issues (don't break on first issue)
                        if (status === "after-download" || status === "downloadable" || status === "unavailable") {
                            languagePackIssues.push({
                                sourceLang: sourceLang,
                                targetLang: targetLang,
                                status: 'required',
                                message: 'Language pack required for ' + targetLang.label + ' (' + targetLang.code.toUpperCase() + ')'
                            });
                        } else if (status === "downloading") {
                            languagePackIssues.push({
                                sourceLang: sourceLang,
                                targetLang: targetLang,
                                status: 'downloading',
                                message: 'Language pack downloading for ' + targetLang.label + ' (' + targetLang.code.toUpperCase() + ')'
                            });
                        } else if (status !== 'readily' && status !== 'available' && status !== false) {
                            languagePackIssues.push({
                                sourceLang: sourceLang,
                                targetLang: targetLang,
                                status: 'required',
                                message: 'Language pack required for ' + targetLang.label + ' (' + targetLang.code.toUpperCase() + ')'
                            });
                        }
                    } catch (error) {
                        // Continue checking other language pairs if one fails
                        console.log('Language pair check failed for ' + sourceLang.code + '-' + targetLang.code + ':', error);
                    }
                }
            } catch (error) {
                // If language pair check fails, log it but continue
                console.log('Language pair check failed:', error);
            }
        }

        // Build language pack notice from all collected issues (Pro-style markup)
        let languagePackNotice = null;
        if (languagePackIssues.length > 0) {
            // Group issues by status type
            const requiredIssues = languagePackIssues.filter(issue => issue.status === 'required');
            const downloadingIssues = languagePackIssues.filter(issue => issue.status === 'downloading');

            // If there are downloading issues, show downloading notice first
            if (downloadingIssues.length > 0) {
                let downloadingList = '';
                downloadingIssues.forEach(function (issue) {
                    downloadingList += '<strong>' + issue.targetLang.label + ' (' + issue.targetLang.code.toUpperCase() + ')</strong>, ';
                });
                // Remove trailing comma
                downloadingList = downloadingList.replace(/, $/, '');

                languagePackNotice = {
                    heading: '⏳ Language Packs Downloading',
                    message: '<div class="atfp-chrome-language-pack-box">' +
                        '<p>Language packs are being downloaded: ' + downloadingList + '</p>' +
                        '<p>Please wait for the download to complete. Translation will be available automatically once finished.</p>' +
                        '<p>Check download progress: ' + createCopyableLink('chrome://on-device-translation-internals') + '</p>' +
                        '</div>',
                    isCombined: true
                };
            } else if (requiredIssues.length > 0) {
                // Show required language packs notice
                let requiredList = '';
                const uniqueTargetLangs = [];
                requiredIssues.forEach(function (issue) {
                    // Avoid duplicates
                    if (!uniqueTargetLangs.find(l => l.code === issue.targetLang.code)) {
                        uniqueTargetLangs.push(issue.targetLang);
                        requiredList += '<strong>' + issue.targetLang.label + ' (' + issue.targetLang.code.toUpperCase() + ')</strong>, ';
                    }
                });
                // Remove trailing comma
                requiredList = requiredList.replace(/, $/, '');

                const sourceLang = requiredIssues[0].sourceLang;
                languagePackNotice = {
                    heading: '<span class="atfp-chrome-language-pack-heading"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="15" viewBox="0 0 24 24" width="15"><g><rect fill="none"/></g><g><path d="M20,2H4C3,2,2,2.9,2,4v3.01C2,7.73,2.43,8.35,3,8.7V20c0,1.1,1.1,2,2,2h14c0.9,0,2-0.9,2-2V8.7c0.57-0.35,1-0.97,1-1.69V4 C22,2.9,21,2,20,2z M15,14H9v-2h6V14z M20,7H4V4h16V7z"/></g></svg>Language Pack Required</span> ',
                    message: '<div class="atfp-chrome-language-pack-box">' +
                        '<p>Chrome needs language packs installed for translation to work. This is a one-time setup.</p>' +
                        '<div class="atfp-chrome-language-pack-inner">' +
                        '<p><strong class="atfp-required-label">Required Languages:</strong><br>' + sourceLang.label + ' (Source), <span class="atfp-required-lang">' + requiredList + '</span></p>' +
                        '<p><strong>Quick Setup:</strong></p>' +
                        '<ol class="atfp-chrome-steps-list">' +
                        '<li><span class="atfp-chrome-step-number">1</span>Open <strong>Chrome Settings → Languages</strong>: ' + createCopyableLink('chrome://settings/languages') + '</li>' +
                        '<li><span class="atfp-chrome-step-number">2</span>Click <strong class="atfp-required-lang">Add languages</strong> and add the languages listed above</li>' +
                        '<li><span class="atfp-chrome-step-number">3</span>Reload this page to verify configuration.</li>' +
                        '</ol>' +
                        '<p>Verify language packs: ' + createCopyableLink('chrome://on-device-translation-internals') + '</p>' +
                        '</div>' +
                        '</div>',
                    isCombined: true
                };
            }
        }

        // Combine notices if both exist (Pro-style layout)
        if (unsupportedNotice && languagePackNotice) {
            return {
                heading: '⚠️ Language Configuration Issues',
                message: '<div class="atfp-chrome-combined-section">' +
                    '<h4 class="atfp-chrome-combined-heading">' + unsupportedNotice.heading + '</h4>' +
                    unsupportedNotice.message +
                    '</div>' +
                    '<div class="atfp-chrome-combined-section">' +
                    '<h4 class="atfp-chrome-combined-heading">' + languagePackNotice.heading + '</h4>' +
                    languagePackNotice.message +
                    '</div>',
                isCombined: true
            };
        }

        // Return individual notices if only one exists
        if (unsupportedNotice) {
            return unsupportedNotice;
        }

        if (languagePackNotice) {
            return languagePackNotice;
        }

        return null; // No language issues detected
    }

    /* =========================
     * Test Translation Feature
     * Allow users to test Chrome AI translation
     * ========================= */
    async function initTestTranslation() {
        const $testSection = $('#atfp-chrome-test-translation');
        if (!$testSection.length) {
            return; // Test section doesn't exist
        }

        // Hide test section initially - it will be shown after notice is displayed
        $testSection.hide();

        // Check for critical Chrome AI configuration errors (browser, API, secure connection)
        // Hide test section if any critical errors exist
        // Use centralized Chrome AI Translator utility methods
        if (typeof ChromeAiTranslator === 'undefined') {
            return; // ChromeAiTranslator not loaded
        }

        const safeBrowser = ChromeAiTranslator.checkSecureConnection();
        const browserContentSecure = window && window.isSecureContext;
        const apiAvailable = ChromeAiTranslator.checkApiAvailability();

        // Browser check (must be Chrome, not Edge or others)
        const hasBrowserError = !ChromeAiTranslator.checkBrowserCompatibility();

        // Secure connection check
        const hasSecureError = !apiAvailable && !safeBrowser && !browserContentSecure;

        // API availability check
        const hasApiError = !apiAvailable;

        // Hide test translation section if any critical errors exist
        if (hasBrowserError || hasSecureError || hasApiError) {
            return; // Don't initialize test translation if critical errors exist
        }

        const $sourceSelect = $('#atfp-test-translation-source');
        const $targetSelect = $('#atfp-test-translation-target');
        const $testBtn = $('#atfp-test-translation-btn');
        const $resultDiv = $('#atfp-test-translation-result');
        const $errorDiv = $('#atfp-test-translation-error');

        // Supported languages list (use centralized method)
        const supportedLanguages = ChromeAiTranslator.getSupportedLanguages();

        // Helper function to check language pair availability (use centralized method)
        async function checkLanguagePairAvailability(source, target) {
            if (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.languagePairAvality) {
                return await ChromeAiTranslator.languagePairAvality(source, target);
            }
            return false;
        }

        // Filter languages: only supported AND with language packs installed
        async function getAvailableLanguages() {
            const availableLanguages = [];

            if (typeof atfpChromeAiNoticeData === 'undefined' || !atfpChromeAiNoticeData.all_languages || atfpChromeAiNoticeData.all_languages.length === 0) {
                return availableLanguages;
            }

            const languages = atfpChromeAiNoticeData.all_languages;
            const defaultSourceLanguage = atfpChromeAiNoticeData.source_language || 'en';

            // Filter to only supported languages
            const supportedLangs = [];

            for (const lang in languages) {
                if (supportedLanguages.includes(lang.toLowerCase())) {
                    supportedLangs.push({
                        code: lang,
                        label: languages[lang].name
                    });
                }
            }

            // Check if browser API is available (use centralized method)
            const apiAvailable = (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.checkApiAvailability)
                ? ChromeAiTranslator.checkApiAvailability()
                : false;

            if (!apiAvailable || supportedLangs.length === 0) {
                // If API not available, return only supported languages (user can still try)
                return supportedLangs;
            }

            // Check language pack availability for each language
            // We'll check each language against the default source to see if packs are available
            for (let i = 0; i < supportedLangs.length; i++) {
                const lang = supportedLangs[i];
                const langCode = lang.code.toLowerCase();
                const defaultSourceCode = defaultSourceLanguage.toLowerCase();
                let isAvailable = false;
                if (lang.code === defaultSourceLanguage) {
                    // This is the default source language - check if it can translate to at least one supported target
                    for (let j = 0; j < supportedLangs.length; j++) {
                        const targetLang = supportedLangs[j];
                        if (targetLang.code !== defaultSourceLanguage) {
                            try {
                                const status = await checkLanguagePairAvailability(langCode, targetLang.code.toLowerCase());
                                if (status === 'readily' || status === 'available' || status === true) {
                                    isAvailable = true;
                                    break;
                                } else if (status === 'downloadable') {
                                    isAvailable = true;
                                    lang.label = lang.label + ' (Downloadable)';
                                    break;
                                }
                            } catch (error) {
                                // Continue checking other pairs
                            }
                        }
                    }
                } else {
                    // This is a target language (or alternative source) - check if default source can translate to it
                    try {
                        const status = await checkLanguagePairAvailability(defaultSourceCode, langCode);
                        if (status === 'readily' || status === 'available' || status === true) {
                            isAvailable = true;
                        }
                    } catch (error) {
                        // Language pack not available for this pair
                    }
                }

                if (isAvailable) {
                    availableLanguages.push(lang);
                }
            }

            return availableLanguages;
        }

        // Get available languages and populate dropdowns
        const availableLanguages = await getAvailableLanguages();

        if (availableLanguages.length === 0) {
            $testSection.hide();
            return;
        }

        // Show test section now that we've found available languages
        $testSection.show();

        // Get source language

        // Get languages from TRP settings (passed via wp_localize_script)
        let sourceLanguage = 'en';

        if (typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData) {
            // Use TRP settings from PHP
            sourceLanguage = atfpChromeAiNoticeData.source_language || 'en';
        }

        // Get target language using centralized method
        const allLanguages2 = (atfpChromeAiNoticeData && atfpChromeAiNoticeData.all_languages) || [];
        const configuredTarget2 = (atfpChromeAiNoticeData && atfpChromeAiNoticeData.target_language) || 'hi';
        const targetObj2 = ChromeAiTranslator.getTargetLanguage(configuredTarget2, sourceLanguage, allLanguages2, 'hi');
        let targetLanguage = targetObj2.code;

        availableLanguages.forEach(function (lang) {
            const option = $('<option></option>')
                .attr('value', lang.code)
                .text(lang.label);
            $sourceSelect.append(option);

            if (lang.code === sourceLanguage) {
                $sourceSelect.val(lang.code);
            }
        });

        // Populate target language dropdown (exclude source language, only available languages)
        availableLanguages.forEach(function (lang) {
            const option = $('<option></option>')
                .attr('value', lang.code)
                .text(lang.label);
            $targetSelect.append(option);

            if (lang.code === targetLanguage) {
                $targetSelect.val(lang.code);
            }
        });

        // Handle test translation button click
        $testBtn.on('click', async function () {
            const textToTranslate = $('#atfp-test-translation-text').val();
            const sourceLang = $sourceSelect.val();
            const targetLang = $targetSelect.val();

            if (availableLanguages[targetLang].label.includes('Downloadable')) {
                if (self && self.Translator && self.Translator.create) {
                    try {
                        await self.Translator.create({
                            sourceLanguage: source,
                            targetLanguage: target,
                            monitor(m) {
                                m.addEventListener('downloadprogress', (e) => {
                                    console.log(`Downloaded ${e.loaded * 100}%`);
                                });
                            },
                        });

                        if (self.Translator.availability) {
                            // @ts-ignore
                            const status = await window.self.Translator.availability({
                                sourceLanguage: source,
                                targetLanguage: target,
                            });

                            if (status !== 'available') {
                                $errorDiv.html('Language pack is downloding. Please select another language or wait for it to finish downloading.').show();
                                return;
                            }else{
                                $targetSelect.find('option[value="' + target + '"]').text(availableLanguages[targetLang].label.replace(' (Downloadable)', ''));
                            }
                        }
                    }catch(error){
                        $errorDiv.html('Language pack is not available. Please select another language.').show();
                        return;
                    }
                } else {
                    $errorDiv.html('Language pack is not available. Please select another language.').show();
                    return;
                }
            }

            if (textToTranslate === '') {
                $errorDiv.html('Please enter text to translate.').show();
                $("#atfp-test-translation-result").hide();
                return;
            }

            // Hide previous results
            $resultDiv.hide();
            $errorDiv.hide();

            // Validate language selection
            if (!sourceLang || !targetLang) {
                $errorDiv.html('Please select both source and target languages.').show();
                return;
            }

            if (sourceLang === targetLang) {
                $errorDiv.html('Source and target languages must be different.').show();
                return;
            }

            // Disable button and show loading state
            $testBtn.prop('disabled', true).text('Translating...');

            try {
                // Create translator instance
                let translator = null;

                if ('translation' in self && 'createTranslator' in self.translation) {
                    translator = await self.translation.createTranslator({
                        sourceLanguage: sourceLang.toLowerCase(),
                        targetLanguage: targetLang.toLowerCase()
                    });
                } else if ('ai' in self && 'translator' in self.ai) {
                    translator = await self.ai.translator.create({
                        sourceLanguage: sourceLang.toLowerCase(),
                        targetLanguage: targetLang.toLowerCase()
                    });
                } else if ('Translator' in self && 'create' in self.Translator) {
                    translator = await self.Translator.create({
                        sourceLanguage: sourceLang.toLowerCase(),
                        targetLanguage: targetLang.toLowerCase()
                    });
                }

                if (!translator) {
                    throw new Error('Chrome AI Translator API is not available. Please check your browser configuration.');
                }

                // Perform translation
                const translatedText = await translator.translate(textToTranslate);

                // Display result
                $resultDiv.html(
                    '<strong>Original:</strong> ' + $('<div>').text(textToTranslate).html() + '<br><br>' +
                    '<strong>Translated:</strong> ' + $('<div>').text(translatedText).html()
                ).css({
                    'background': '#f0f9ff',
                    'border': '1px solid #bae6fd',
                    'color': '#0c4a6e'
                }).show();

            } catch (error) {
                // Display error
                let errorMessage = 'Translation failed. ';
                if (error.message) {
                    errorMessage += error.message;
                } else {
                    errorMessage += 'Please check your Chrome AI Translator configuration.';
                }
                $errorDiv.html(errorMessage).show();
            } finally {
                // Re-enable button
                $testBtn.prop('disabled', false).text('Test Translation');
            }
        });
    }

    /* =========================
     * Check Language Pack Availability
     * Check if language packs are installed for supported languages
     * ========================= */
    async function checkLanguagePackAvailability() {
        // Use centralized Chrome AI Translator utility methods
        if (typeof ChromeAiTranslator === 'undefined') {
            return { hasError: false }; // Can't check if ChromeAiTranslator not loaded
        }

        // Helper function to check language pair availability (use centralized method)
        async function checkLanguagePairAvailability(source, target) {
            if (typeof ChromeAiTranslator !== 'undefined' && ChromeAiTranslator.languagePairAvality) {
                return await ChromeAiTranslator.languagePairAvality(source, target);
            }
            return false;
        }

        // Get languages from TRP settings
        let sourceLanguage = 'en';
        let allLanguages = [];

        if (typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData) {
            sourceLanguage = atfpChromeAiNoticeData.source_language || 'en';
            allLanguages = atfpChromeAiNoticeData.all_languages || [];
        } else if (typeof localStorage !== 'undefined') {
            sourceLanguage = localStorage.getItem('page_lang') || 'en';
        }

        // Get target language using centralized method
        const configuredTarget3 = (typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData)
            ? (atfpChromeAiNoticeData.target_language || 'hi')
            : (localStorage.getItem('language_code') || 'hi');
        const targetObj3 = ChromeAiTranslator.getTargetLanguage(configuredTarget3, sourceLanguage, allLanguages, 'hi');
        let targetLanguage = targetObj3.code;

        // Check supported languages list (use centralized method)
        const supportedLanguages = ChromeAiTranslator.getSupportedLanguages();

        // Get source language
        const sourceLang = sourceLanguage.toLowerCase();
        const targetLangs = [];

        if (allLanguages && Object.keys(allLanguages).length > 0) {
            // Get all supported target languages
            Object.keys(allLanguages).forEach(function (lang) {
                if (supportedLanguages.includes(lang.toLowerCase()) && lang.toLowerCase() !== sourceLang) {
                    targetLangs.push(lang.toLowerCase());
                }
            });
        } else if (supportedLanguages.includes(targetLanguage.toLowerCase())) {
            targetLangs.push(targetLanguage.toLowerCase());
        }


        // Check language pack status for each target language
        if (targetLangs.length > 0 && supportedLanguages.includes(sourceLang)) {
            for (let i = 0; i < targetLangs.length; i++) {
                try {
                    const status = await checkLanguagePairAvailability(sourceLang, targetLangs[i]);

                    // If status indicates pack is required or downloading, return error
                    if (status === "after-download" || status === "downloadable" || status === "unavailable" || status === "downloading") {
                        return { hasError: true, type: 'language-pack' };
                    }

                    // If status is not 'readily' or 'available', pack might be required
                    if (status !== 'readily' && status !== 'available' && status !== false) {
                        return { hasError: true, type: 'language-pack' };
                    }
                } catch (error) {
                    // Continue checking other language pairs if one fails
                    console.log('Language pack check failed for ' + sourceLang + '-' + targetLangs[i] + ':', error);
                }
            }
        }

        return { hasError: false };
    }

    // Initialize Chrome AI notice first, then show test translation section after notice is displayed
    if ($('#atfp-chrome-local-ai-notice').length) {
        // Initialize notice and wait for it to complete
        initChromeLocalAINotice().then(function () {
            // After notice is shown (or hidden if no notice needed), initialize test translation
            if ($('#atfp-chrome-test-translation').length) {
                initTestTranslation().catch(function (error) {
                    console.error('Failed to initialize test translation:', error);
                    const $errorDiv = $('#atfp-test-translation-error');
                    if ($errorDiv.length) {
                        $errorDiv.html('Failed to load available languages. Please refresh the page.').show();
                    }
                });
            }
        }).catch(function (error) {
            console.error('Failed to initialize Chrome AI notice:', error);
            // Even if notice fails, try to initialize test translation
            if ($('#atfp-chrome-test-translation').length) {
                initTestTranslation().catch(function (testError) {
                    console.error('Failed to initialize test translation:', testError);
                });
            }
        });
    } else {
        // If no notice element exists, initialize test translation directly
        if ($('#atfp-chrome-test-translation').length) {
            initTestTranslation().catch(function (error) {
                console.error('Failed to initialize test translation:', error);
                const $errorDiv = $('#atfp-test-translation-error');
                if ($errorDiv.length) {
                    $errorDiv.html('Failed to load available languages. Please refresh the page.').show();
                }
            });
        }
    }

    const showConfigurationNotice = async () => {
        if ($('.atfp-chrome-ai-card .atfp-chrome-configure-notice').length > 0) {
            $('.atfp-chrome-ai-card .atfp-chrome-configure-notice').show();
            $('.atfp-chrome-configure-button').show();
            return;
        }

        let hasError = false;
        let errorType = '';

        const bypassBrowser = typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData.chrome_ai_bypass_browser_check === '1';
        const bypassSecure = typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData.chrome_ai_bypass_secure_check === '1';
        const bypassApi = typeof atfpChromeAiNoticeData !== 'undefined' && atfpChromeAiNoticeData.chrome_ai_bypass_api_check === '1';

        const browserCompatible = ChromeAiTranslator.checkBrowserCompatibility() || bypassBrowser;
        const secureConnection = ChromeAiTranslator.checkSecureConnection() || window && window.isSecureContext || bypassSecure;
        const apiAvailable = ChromeAiTranslator.checkApiAvailability() || bypassApi;

        // Browser check (must be Chrome, not Edge or others)
        if (!browserCompatible) {
            hasError = true;
            errorType = 'browser';
        } else if (!apiAvailable && !secureConnection) {
            hasError = true;
            errorType = 'secure';
        } else if (!apiAvailable) {
            hasError = true;
            errorType = 'api';
        }

        // If browser/API/secure checks pass, check language pack availability
        if (!hasError) {
            const packCheck = await checkLanguagePackAvailability();
            if (packCheck.hasError) {
                hasError = true;
                errorType = 'language-pack';
            }
        }

        if (hasError) {
            // Create notice with specific message based on error type
            let noticeMessage = 'Please configure the Chrome settings to use Chrome AI Translator.';

            if (errorType === 'browser') {
                noticeMessage = 'Chrome browser is required. Please configure Chrome settings.';
            } else if (errorType === 'secure') {
                noticeMessage = 'Secure connection (HTTPS) is required. Please configure Chrome settings.';
            } else if (errorType === 'api') {
                noticeMessage = 'Chrome Translation API is not available. Please configure Chrome settings.';
            } else if (errorType === 'language-pack') {
                noticeMessage = 'Language pack is required. Please configure Chrome settings.';
            }

            const notice = $('<div class="atfp-chrome-configure-notice" style="margin-top: 10px; font-size: 12px; color: #dc2626;">' + noticeMessage + '</div>');

            $('.atfp-chrome-ai-card').append(notice);
            $('.atfp-chrome-configure-button').show();
        } else {
            $('.atfp-chrome-ai-card .atfp-chrome-configure-notice').hide();
            $('.atfp-chrome-configure-button').hide();
        }
    }


    if ($('.atfp-chrome-ai-card').length > 0) {
        const ctfp_chrome_ai_toogle = $('.atfp-chrome-ai-card .atfp-provider-toggle');
        const chrome_ai_enabled = ctfp_chrome_ai_toogle.is(':checked');

        if (chrome_ai_enabled) {
            showConfigurationNotice();
        }

        ctfp_chrome_ai_toogle.on('change', function () {
            const chrome_ai_enabled = ctfp_chrome_ai_toogle.is(':checked');
            if (chrome_ai_enabled) {
                showConfigurationNotice();
            } else {
                $('.atfp-chrome-ai-card .atfp-chrome-configure-notice').hide();
                $('.atfp-chrome-configure-button').hide();
            }
        });
    }

});
