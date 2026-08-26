/**
 * Chrome/Edge AI Translation Setup Framework
 * A reusable, copy-pasteable library for managing on-device Translator API setup,
 * checks, download progress, and live preview testing.
 * 
 * Version: 1.0.0
 * Author: Cool Plugins
 */
class ChromeAISetupFramework {
    /**
     * @param {string|HTMLElement} container - Selector or Element to render the UI into
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            console.error('ChromeAISetupFramework: Container element not found.');
            return;
        }

        // Default Configuration
        this.options = Object.assign({
            sourceLanguage: 'en',
            sourceLanguageLabel: 'English',
            availableLanguages: [], // Array of { code: 'es', name: 'Spanish' }
            chromeIconUrl: '',      // Optional URL to Google Chrome logo image
            edgeIconUrl: '',        // Optional URL to Microsoft Edge logo image
            alternativeUrl: '',     // URL to redirect when user clicks "Use Another Provider" — set from PHP
            bypassBrowserCheck: false,  // Skip desktop/browser brand check
            bypassSecureCheck: false,   // Skip HTTPS / secure context check
            bypassApiCheck: false,      // Skip Translator API availability check
            primaryBtnClass: '',        // Class to apply to primary actions like Install Pack
            secondaryBtnClass: '',      // Class to apply to secondary actions like the guide link
            defaultProvider: 'chrome'   // Fallback provider when browser is 'Other'
        }, options);

        // Merge default strings with options.texts
        this.texts = Object.assign({
            cardTitle: 'Chrome AI Translation Setup',
            cardDescription: 'Free on-device translation. We detect what your browser needs — usually just one click.',
            statusChecking: 'Checking your browser…',
            statusCheckingDesc: 'Give us a second while we detect Chrome AI support.',
            statusReady: 'Chrome AI is Ready',
            statusReadyDesc: 'On-device translation is set up. No API key, no cost.',
            statusDownloadable: 'One step left: download the language model',
            statusDownloadableDesc: 'A one-time ~1–2 GB download enables offline translation. Takes a couple of minutes.',
            statusDownloading: 'Downloading language model…',
            statusDownloadingDesc: 'Keep this tab open. This happens once.',
            statusError: 'Chrome AI is currently unavailable',
            statusErrorDesc: 'Something blocked the check. See advanced steps or use alternative options.',
            statusHttpError: 'Chrome AI needs a secure (HTTPS) connection',
            statusHttpErrorDesc: 'Serving wp-admin over HTTP prevents Chrome AI from launching. Serve pages over HTTPS or use an alternative engine.',
            btnEnable: 'Enable Chrome AI',
            btnRetry: 'Retry',
            btnAlternative: 'Use Another Provider',
            previewTitle: 'Try a real translation',
            previewDesc: 'Type anything and see the exact on-device result — no page needed.',
            previewSourceLabel: 'Source language',
            previewTargetLabel: 'Target language',
            previewInputLabel: 'Your text',
            previewOutputLabel: 'Translation',
            previewPlaceholder: 'Type or paste text to translate…',
            previewOutPlaceholder: 'Translation will appear here.',
            btnTranslate: 'Translate preview',
            translatingText: 'Translating…',
            translationDone: 'Done in {ms} ms · on-device · no data left your browser',
            translationFailed: '✗ Translation failed. This pair may need its own model, or see advanced steps below.',
            advancedTitle: 'Still not working? Advanced steps',
            advancedBrowserRequirements: 'Chrome AI translation needs <b>Chrome or Edge on desktop</b> (version 138+). It doesn’t run on mobile phones or tablets.',
            openSetupGuide: 'Open Official Setup Guide →',
            unsupportedBrowser: 'Chrome AI not supported in this browser'
        }, options.texts);

        // Setup environment variables
        this.browserType = ChromeAISetupFramework.getBrowserType(); // 'Chrome' | 'Edge' | 'Other'
        if (this.options.forceProvider) {
            this.isEdge = this.options.forceProvider === 'edge';
        } else {
            this.isEdge = this.browserType === 'Edge' || (this.browserType === 'Other' && this.options.defaultProvider === 'edge');
        }
        this.browserTitle = this.isEdge ? 'Edge' : 'Chrome';

        // Dynamically replace browser name in standard strings
        for (const key in this.texts) {
            if (typeof this.texts[key] === 'string') {
                this.texts[key] = this.texts[key].replace(/Chrome/g, this.browserTitle);
            }
        }

        // Core State
        this.currentState = 'checking'; // 'checking' | 'unavailable' | 'downloadable' | 'downloading' | 'available' | 'error'
        this.currentTranslator = null;

        // Render layout & bind elements
        this.render();
        this.bindEvents();

        // Perform initial live check
        this.liveDetect();
    }

    /**
     * Get browser type (Chrome, Edge, or Other)
     * @returns {string}
     */
    static getBrowserType() {
        let type = 'Other';
        if (navigator && navigator.userAgentData && navigator.userAgentData.brands) {
            navigator.userAgentData.brands.forEach(data => {
                if (data.brand === 'Google Chrome') {
                    type = 'Chrome';
                } else if (data.brand === 'Microsoft Edge') {
                    type = 'Edge';
                }
            });
        } else {
            if (navigator.userAgent.includes('Edg')) {
                type = 'Edge';
            } else if (window.hasOwnProperty('chrome')) {
                type = 'Chrome';
            }
        }
        return type;
    }

    /**
     * Verify if Platform is Desktop (API is not supported on mobile/tablet)
     * @returns {boolean}
     */
    static isDesktop() {
        return !/Mobi|Android|iPhone|iPad|Windows Phone/i.test(navigator.userAgent);
    }

    /**
     * List of supported language codes by Chrome AI Translator
     * @returns {string[]}
     */
    static getSupportedLanguages() {
        return ['en', 'es', 'ja', 'ar', 'de', 'bn', 'fr', 'hi', 'it', 'ko', 'nl', 'pl', 'pt', 'ru', 'th', 'tr', 'vi', 'zh', 'zh-hant', 'bg', 'cs', 'da', 'el', 'fi', 'hr', 'hu', 'id', 'iw', 'lt', 'no', 'ro', 'sk', 'sl', 'sv', 'uk', 'kn', 'ta', 'te', 'mr'].map(lang => lang.toLowerCase());
    }

    /**
     * Helper to check secure context
     * @returns {boolean}
     */
    static isSecure() {
        return window.location.protocol === 'https:' || window.isSecureContext;
    }

    /**
     * Helper to verify if API is exposed in global scope
     * @returns {boolean}
     */
    static isApiPresent() {
        return ('translation' in self && 'createTranslator' in self.translation) ||
            ('ai' in self && 'translator' in self.ai) ||
            ('Translator' in self && 'create' in self.Translator);
    }

    /**
     * Check language pair availability status
     * @param {string} source - Source language code
     * @param {string} target - Target language code
     * @returns {Promise<string>} 'available' | 'downloadable' | 'downloading' | 'unavailable'
     */
    static async getLanguagePairStatus(source, target) {
        source = source.toLowerCase();
        target = target.toLowerCase();

        // 1. Standard translation API
        if ('translation' in self && 'canTranslate' in self.translation) {
            try {
                const status = await self.translation.canTranslate({
                    sourceLanguage: source,
                    targetLanguage: target,
                });
                // Map standard results to framework states
                if (status === 'readily') return 'available';
                if (status === 'after-download') return 'downloadable';
                return status; // 'no' etc.
            } catch (e) {
                return 'unavailable';
            }
        }

        // 2. Gemini nano prompt translator capabilities
        if ('ai' in self && 'translator' in self.ai && 'capabilities' in self.ai.translator) {
            try {
                const caps = await self.ai.translator.capabilities();
                const status = await caps.languagePairAvailable(source, target);
                if (status === 'readily') return 'available';
                if (status === 'after-download') return 'downloadable';
                return status;
            } catch (e) {
                return 'unavailable';
            }
        }

        // 3. Experimental older Translator API
        if ('Translator' in self && 'availability' in self.Translator) {
            try {
                const status = await self.Translator.availability({
                    sourceLanguage: source,
                    targetLanguage: target,
                });
                return status; // 'available', 'downloadable', 'downloading', 'unavailable'
            } catch (e) {
                return 'unavailable';
            }
        }

        return 'unavailable';
    }

    /**
     * Helper to instantiate a translator using the available API namespace
     * @param {string} source - Source language code
     * @param {string} target - Target language code
     * @param {Function} monitor - Callback function for download progress
     * @returns {Promise<Object>} The translator instance
     */
    static async createTranslator(source, target, monitor = null) {
        const options = { sourceLanguage: source, targetLanguage: target };
        if (monitor) options.monitor = monitor;

        if ('translation' in self && 'createTranslator' in self.translation) {
            return await self.translation.createTranslator(options);
        } else if ('ai' in self && 'translator' in self.ai) {
            return await self.ai.translator.create(options);
        } else if ('Translator' in self && 'create' in self.Translator) {
            return await self.Translator.create(options);
        }
        throw new Error('Chrome AI Translator API is missing or disabled');
    }

    /**
     * System checks wrapper that runs without rendering the UI
     * Useful for parent dashboard cards or pre-flight settings notices
     * @param {Object} options
     * @returns {Promise<Object>} { hasError: boolean, errorType: string, message: string }
     */
    static async checkSystemAvailability(options = {}) {
        const sourceLang = (options.sourceLanguage || 'en').toLowerCase();
        const availableLangs = options.availableLanguages || [];
        const browser = this.getBrowserType();
        const browserTitle = browser === 'Edge' ? 'Edge' : 'Chrome';

        const bypassDesktopCheck = options.bypassDesktopCheck === true;

        // 1. Check Platform
        if (!bypassDesktopCheck && !this.isDesktop()) {
            return {
                hasError: true,
                errorType: 'browser',
                message: `${browserTitle} AI is only supported on desktop browsers.`
            };
        }

        // 2. Check Browser
        if (browser === 'Other') {
            return {
                hasError: true,
                errorType: 'browser',
                message: 'Chrome/Edge is required for built-in AI translations.'
            };
        }

        // 3. Check Secure Connection
        if (!this.isSecure()) {
            return {
                hasError: true,
                errorType: 'secure',
                message: 'Translator API is restricted to Secure Contexts (HTTPS).'
            };
        }

        // 4. Check API Presence
        if (!this.isApiPresent()) {
            return {
                hasError: true,
                errorType: 'api',
                message: 'Built-in Translator API is not enabled in this browser.'
            };
        }

        // 5. Check Language Pair Support
        const supportedList = this.getSupportedLanguages();
        if (!supportedList.includes(sourceLang)) {
            return {
                hasError: true,
                errorType: 'language-unsupported',
                message: `Source language (${sourceLang.toUpperCase()}) is not supported by on-device translator.`
            };
        }

        let needsPacks = false;
        let isDownloading = false;

        for (const lang of availableLangs) {
            const code = (lang.code || '').toLowerCase();
            if (code && code !== sourceLang && supportedList.includes(code)) {
                try {
                    const status = await this.getLanguagePairStatus(sourceLang, code);
                    if (status === 'downloadable' || status === 'after-download') {
                        needsPacks = true;
                    } else if (status === 'downloading') {
                        isDownloading = true;
                    }
                } catch (e) {
                    // Ignore individual pair check failures, handle as needed
                }
            }
        }

        if (isDownloading) {
            return {
                hasError: true,
                errorType: 'language-pack-downloading',
                message: 'Required language packs are currently downloading.'
            };
        }

        if (needsPacks) {
            return {
                hasError: true,
                errorType: 'language-pack',
                message: 'One or more language packs need to be downloaded.'
            };
        }

        return {
            hasError: false,
            errorType: '',
            message: `${browserTitle} AI is fully operational.`
        };
    }

    /**
     * Render the UI template inside the container
     */
    render() {
        const flagsUrl = this.isEdge ? 'edge://flags/#translation-api' : 'chrome://flags/#translation-api';
        const internalsUrl = this.isEdge ? 'edge://on-device-translation-internals' : 'chrome://on-device-translation-internals';
        const docUrl = this.isEdge ? (this.options.edgeDocUrl || 'https://learn.microsoft.com/en-us/microsoft-edge/web-platform/translator-api') : (this.options.chromeDocUrl || 'https://developer.chrome.com/docs/ai/translator-api');

        const browserType = ChromeAISetupFramework.getBrowserType();
        let iconHtml = '';
        if (browserType === 'Edge') {
            if (this.options.edgeIconUrl) {
                iconHtml = `<img src="${this.options.edgeIconUrl}" width="20" height="20" alt="Edge" style="vertical-align: middle; display: inline-block;" />`;
            }
        } else if (browserType === 'Chrome') {
            if (this.options.chromeIconUrl) {
                iconHtml = `<img src="${this.options.chromeIconUrl}" width="20" height="20" alt="Chrome" style="vertical-align: middle; display: inline-block;" />`;
            }
        }

        let langOptions = '';
        let hasSupportedLang = false;
        this.options.availableLanguages.forEach(lang => {
            const code = lang.code.toLowerCase();
            if (code === this.options.sourceLanguage.toLowerCase()) return;
            if (ChromeAISetupFramework.getSupportedLanguages().includes(code)) {
                hasSupportedLang = true;
                langOptions += `<option value="${lang.code}">${lang.name}</option>`;
            } else {
                langOptions += `<option value="${lang.code}" disabled style="color: #9ca3af;">${lang.name} (Not supported)</option>`;
            }
        });

        // If no supported languages at all, the preview section will be hidden after render
        this._noSupportedLangs = !hasSupportedLang && this.options.availableLanguages.length > 0;

        this.container.innerHTML = `
            <div class="cais-card">
                <div class="cais-section-header" style="${this.options.hideHeader ? 'display: none;' : ''}">
                    <span class="cais-section-icon">${iconHtml}</span>
                    <div class="cais-section-titles">
                        <div class="cais-section-title">${this.texts.cardTitle}</div>
                        <div class="cais-section-description">${this.texts.cardDescription}</div>
                    </div>
                </div>

                <div class="cais-setup-box">
                    <div class="cais-status-row">
                        <div class="cais-status-copy">
                            <div class="cais-title-row">
                                <span class="cais-status-dot checking" id="cais-dot"></span>
                                <strong id="cais-title">${this.texts.statusChecking}</strong>
                            </div>
                            <span id="cais-desc" class="cais-muted">${this.texts.statusCheckingDesc}</span>
                        </div>
                        <button class="cais-btn cais-btn-primary" id="cais-action-btn" style="display:none;"></button>
                    </div>

                    <div class="cais-dl-wrap" id="cais-dl-wrap" style="display:none;">
                        <div class="cais-dl-bar"><span id="cais-dl-fill"></span></div>
                        <span id="cais-dl-pct">Preparing download…</span>
                    </div>

                    <!-- Language Packs Status List -->
                    <div id="cais-language-status-list" style="display:none; margin-top: 15px; margin-bottom: 20px;"></div>

                    <!-- Translation Preview Section -->
                    <div class="cais-preview-section" id="cais-test-ui" style="display:none;">
                        <div class="cais-preview-header">
                            <strong>${this.texts.previewTitle}</strong>
                            <span class="cais-muted">${this.texts.previewDesc}</span>
                        </div>

                        <div class="cais-lang-row">
                            <span class="cais-lang-fixed">${this.options.sourceLanguageLabel}</span>
                            <span class="cais-lang-arrow">→</span>
                            <select id="cais-tgt-select" class="cais-lang-select">
                                <option value="" disabled selected>Loading...</option>
                            </select>
                            <span class="cais-pair-state" id="cais-pair-state"></span>
                        </div>

                        <div class="cais-preview-grid">
                            <div class="cais-preview-col">
                                <label>${this.texts.previewInputLabel}</label>
                                <textarea id="cais-sample-text" rows="3" placeholder="${this.texts.previewPlaceholder}">Hello, this is a test translation. If you can read this correctly in another language, our local AI translation is working correctly.</textarea>
                                <span class="cais-count cais-muted" id="cais-char-count">0 characters</span>
                            </div>
                            <div class="cais-preview-col">
                                <label>${this.texts.previewOutputLabel} <span id="cais-tgt-label" class="cais-muted"></span></label>
                                <div class="cais-preview-out" id="cais-test-out"><span class="cais-placeholder cais-muted">${this.texts.previewOutPlaceholder}</span></div>
                            </div>
                        </div>

                        <div class="cais-preview-actions">
                            <button class="cais-btn cais-btn-primary${this.options.primaryBtnClass ? ' ' + this.options.primaryBtnClass : ''}" id="cais-run-btn">${this.texts.btnTranslate}</button>
                            <span class="cais-preview-note cais-muted" id="cais-preview-note"></span>
                        </div>
                    </div>
                </div>

                <details class="cais-fallback-accordion" id="cais-fallback-accordion">
                    <summary>${this.texts.advancedTitle}</summary>
                    <div class="cais-fallback-body" id="cais-fallback-body"></div>
                </details>
            </div>
        `;

        // Cache elements
        this.elDot = this.container.querySelector('#cais-dot');
        this.elTitle = this.container.querySelector('#cais-title');
        this.elDesc = this.container.querySelector('#cais-desc');
        this.elActionBtn = this.container.querySelector('#cais-action-btn');
        this.elDlWrap = this.container.querySelector('#cais-dl-wrap');
        this.elDlFill = this.container.querySelector('#cais-dl-fill');
        this.elDlPct = this.container.querySelector('#cais-dl-pct');
        this.elTestUi = this.container.querySelector('#cais-test-ui');
        this.elTgtSelect = this.container.querySelector('#cais-tgt-select');
        this.elPairState = this.container.querySelector('#cais-pair-state');
        this.elSampleText = this.container.querySelector('#cais-sample-text');
        this.elCharCount = this.container.querySelector('#cais-char-count');
        this.elTgtLabel = this.container.querySelector('#cais-tgt-label');
        this.elTestOut = this.container.querySelector('#cais-test-out');
        this.elRunBtn = this.container.querySelector('#cais-run-btn');
        this.elPreviewNote = this.container.querySelector('#cais-preview-note');
        this.elAccordion = this.container.querySelector('#cais-fallback-accordion');
        this.elLanguageStatusList = this.container.querySelector('#cais-language-status-list');
    }

    /**
     * Dynamically update advanced steps based on error state
     * @param {string} state
     */
    updateFallbackAccordion(state) {
        const body = this.container.querySelector('#cais-fallback-body');
        if (!body) return;

        const flagsUrl = this.isEdge ? 'edge://flags/#translation-api' : 'chrome://flags/#translation-api';
        const internalsUrl = this.isEdge ? 'edge://on-device-translation-internals' : 'chrome://on-device-translation-internals';
        const docUrl = this.isEdge ? (this.options.edgeDocUrl || 'https://learn.microsoft.com/en-us/microsoft-edge/web-platform/translator-api') : (this.options.chromeDocUrl || 'https://developer.chrome.com/docs/ai/translator-api');
        const secureBypassUrl = this.isEdge ? 'edge://flags/#unsafely-treat-insecure-origin-as-secure' : 'chrome://flags/#unsafely-treat-insecure-origin-as-secure';
        const langSettingsUrl = this.isEdge ? 'edge://settings/languages' : 'chrome://settings/languages';

        let html = '';

        if (state === 'unavailable') {
            html = `
                <p>${this.texts.advancedBrowserRequirements}</p>
                <ol>
                    <li>Open this page in a desktop <b>Google Chrome</b> or <b>Microsoft Edge</b> browser.</li>
                    <li>Verify your browser version by going to settings → <b>Help → About</b>.</li>
                    <li>If the issue persists, you can choose an alternative translation engine.</li>
                </ol>
            `;
        } else if (state === 'secure-error') {
            html = `
                <p>The browser blocks built-in AI translation on insecure connections (HTTP). Serve wp-admin over HTTPS or configure flags for local development.</p>
                <ol>
                    <li>Serve your site over <b>HTTPS</b>.</li>
                    <li>For local development bypass, open browser flags: ${this.createCopyableSpan(secureBypassUrl)}</li>
                    <li>Search for <b>unsafely-treat-insecure-origin-as-secure</b>, set it to <b>Enabled</b>, add your local site origin <code>${window.location.origin}</code> to the text field, and relaunch the browser.</li>
                </ol>
            `;
        } else if (state === 'error') {
            html = `
                <p>The on-device Translator API needs to be enabled in your browser flags.</p>
                <ol>
                    <li>Open browser flags: ${this.createCopyableSpan(flagsUrl)}</li>
                    <li>Search for <b>Translation API</b> and set it to <b>Enabled</b>.</li>
                    <li>Verify or manage translation packs manually at: ${this.createCopyableSpan(internalsUrl)}</li>
                    <li>Relaunch the browser and refresh this page.</li>
                </ol>
            `;
        } else if (state === 'downloadable' || state === 'downloading') {
            if (this.isEdge) {
                const playgroundUrl = 'https://microsoftedge.github.io/Demos/built-in-ai/playgrounds/translator-api/';
                html = `
                    <p>Your browser needs language packs installed for translation to work. This is a one-time setup.</p>
                    <ol>
                        <li>Test your required languages on the ${this.createCopyableSpan(playgroundUrl)}.</li>
                        <li>Type any text, and click translate to automatically download the language packs.</li>
                        <li>Wait until the translation works successfully in the playground.</li>
                        <li>Come back here, refresh the page, and the packs will be ready.</li>
                    </ol>
                `;
            } else {
                html = `
                    <p>Your browser needs language packs installed for translation to work. This is a one-time setup.</p>
                    <ol>
                        <li>Open Settings → Languages: ${this.createCopyableSpan(langSettingsUrl)}</li>
                        <li>Click <b>Add languages</b> and select the translation languages configured in your site.</li>
                        <li>Manage, download, or check download progress manually at: ${this.createCopyableSpan(internalsUrl)}</li>
                        <li>Relaunch the browser and refresh this page once done.</li>
                    </ol>
                `;
            }
        } else {
            // General troubleshooting fallback
            html = `
                <p>${this.texts.advancedBrowserRequirements}</p>
                <ol>
                    <li>Serve your site over <b>HTTPS</b>.</li>
                    <li>Update your browser to the latest version.</li>
                    <li>Enable the required flags at: ${this.createCopyableSpan(flagsUrl)}</li>
                    <li>Manage translation packs manually at: ${this.createCopyableSpan(internalsUrl)}</li>
                </ol>
            `;
        }
        
        const extraClass = this.options.secondaryBtnClass ? ` ${this.options.secondaryBtnClass}` : '';
        html += `<a href="${docUrl}" target="_blank" rel="noopener" class="cais-btn cais-guide-link${extraClass}">${this.texts.openSetupGuide}</a>`;
        body.innerHTML = html;
    }

    /**
     * Create copyable elements with tooltips
     * @param {string} text 
     * @returns {string}
     */
    createCopyableSpan(text) {
        return `<span class="cais-copyable-link" data-copy="${text}">${text} <svg class="cais-copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span>`;
    }

    /**
     * Bind UI event listeners
     */
    bindEvents() {
        // Character counter
        this.elSampleText.addEventListener('input', () => this.updateCharCount());

        // Target language change triggers pair checking and resets translation output
        this.elTgtSelect.addEventListener('change', () => {
            // Reset translation preview box to default placeholder
            this.elTestOut.className = 'cais-preview-out';
            this.elTestOut.innerHTML = `<span class="cais-placeholder cais-muted">${this.texts.previewOutPlaceholder}</span>`;
            this.elPreviewNote.textContent = '';
            
            this.checkPairSupport();
        });

        // Run preview translation
        this.elRunBtn.addEventListener('click', () => this.runPreviewTranslation());

        // Copy-to-clipboard binding
        this.container.addEventListener('click', (e) => {
            const copySpan = e.target.closest('.cais-copyable-link');
            if (copySpan) {
                const text = copySpan.getAttribute('data-copy');
                this.copyTextToClipboard(text, copySpan);
            }
        });
    }

    /**
     * Copy text to clipboard and show tooltips
     * @param {string} text 
     * @param {HTMLElement} element 
     */
    async copyTextToClipboard(text, element) {
        if (!text) return;
        try {
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            // Visual feedback tooltip
            const tooltip = document.createElement('span');
            tooltip.className = 'cais-tooltip';
            tooltip.textContent = 'Copied!';
            element.appendChild(tooltip);

            setTimeout(() => tooltip.classList.add('active'), 50);
            setTimeout(() => {
                tooltip.classList.remove('active');
                setTimeout(() => tooltip.remove(), 200);
            }, 1000);
        } catch (err) {
            console.error('ChromeAISetupFramework: Failed to copy to clipboard', err);
        }
    }

    /**
     * Update the character count display
     */
    updateCharCount() {
        const count = this.elSampleText.value.length;
        this.elCharCount.textContent = `${count} character${count === 1 ? '' : 's'}`;
    }

    /**
     * Update the translation target label (e.g. "-> Spanish")
     */
    updateTargetLabel() {
        const selectedOption = this.elTgtSelect.options[this.elTgtSelect.selectedIndex];
        if (selectedOption) {
            this.elTgtLabel.textContent = `→ ${selectedOption.text}`;
        }
    }

    /**
     * Check if the specific source->target pair is supported and download state
     */
    async checkPairSupport() {
        this.updateTargetLabel();
        if (!ChromeAISetupFramework.isApiPresent()) {
            this.elPairState.className = 'cais-pair-state cais-state-error';
            this.elPairState.textContent = 'Not supported';
            this.elPairState.style.cursor = '';
            this.elPairState.onclick = null;
            return;
        }

        const target = this.elTgtSelect.value;
        this.elPairState.className = 'cais-pair-state';
        this.elPairState.textContent = 'Checking…';
        this.elPairState.style.cursor = '';
        this.elPairState.onclick = null;

        try {
            const status = await ChromeAISetupFramework.getLanguagePairStatus(this.options.sourceLanguage, target);
            if (status === 'available') {
                this.elPairState.className = 'cais-pair-state cais-state-ok';
                this.elPairState.textContent = 'Ready';
                this.elPairState.style.cursor = '';
                this.elPairState.title = '';
                this.elPairState.onclick = null;
                this.elRunBtn.disabled = false;
            } else if (status === 'downloadable' || status === 'downloading') {
                this.elPairState.className = 'cais-pair-state cais-state-dl';
                this.elPairState.textContent = 'Install Language Pack';
                this.elPairState.style.cursor = 'pointer';
                this.elPairState.title = 'Click to download this language model';
                this.elRunBtn.disabled = true;

                // Click to download this specific language pair
                this.elPairState.onclick = async () => {
                    const source = this.options.sourceLanguage;
                    this.elPairState.style.cursor = 'default';
                    this.elPairState.title = '';
                    this.elPairState.onclick = null;

                    try {
                        const monitor = (m) => {
                            m.addEventListener('downloadprogress', (e) => {
                                const pct = Math.round((e.loaded || 0) * 100);
                                this.elPairState.className = 'cais-pair-state cais-state-dl';
                                this.elPairState.textContent = `Downloading… ${pct}%`;
                            });
                        };

                        let dl = await ChromeAISetupFramework.createTranslator(source, target, monitor);
                        if (dl && dl.ready) await dl.ready;
                        if (dl && typeof dl.destroy === 'function') dl.destroy();

                        this.elPairState.className = 'cais-pair-state cais-state-ok';
                        this.elPairState.textContent = 'Ready';
                        this.elPairState.style.cursor = '';
                        window.location.reload();
                    } catch (err) {
                        this.elPairState.className = 'cais-pair-state cais-state-error';
                        this.elPairState.textContent = 'Failed — retry';
                        this.elPairState.style.cursor = 'pointer';
                        this.elPairState.title = 'Click to retry download';
                        // Re-enable onclick so user can retry
                        this.checkPairSupport();
                    }
                };
            } else {
                this.elPairState.className = 'cais-pair-state cais-state-error';
                this.elPairState.textContent = 'Pair unsupported';
                this.elPairState.style.cursor = '';
                this.elPairState.onclick = null;
                this.elRunBtn.disabled = true;
            }
        } catch (e) {
            this.elPairState.className = 'cais-pair-state cais-state-error';
            this.elPairState.textContent = 'Check failed';
            this.elPairState.style.cursor = '';
            this.elPairState.onclick = null;
            this.elRunBtn.disabled = true;
        }
    }

    /**
     * Run a real live on-device translation in the preview window
     */
    async runPreviewTranslation() {
        const text = this.elSampleText.value.trim();
        this.elPreviewNote.textContent = '';

        if (!text) {
            this.elTestOut.className = 'cais-preview-out cais-out-error';
            this.elTestOut.textContent = 'Type some text to translate first.';
            return;
        }

        if (!ChromeAISetupFramework.isApiPresent()) {
            this.elTestOut.className = 'cais-preview-out cais-out-error';
            this.elTestOut.textContent = 'Translator API not available in this browser.';
            return;
        }

        this.elTestOut.className = 'cais-preview-out';
        this.elTestOut.textContent = this.texts.translatingText;
        this.elRunBtn.disabled = true;

        const source = this.options.sourceLanguage;
        const target = this.elTgtSelect.value;
        const t0 = performance.now();
        let translator = null;

        try {
            // Check status first to see if a download is required
            const status = await ChromeAISetupFramework.getLanguagePairStatus(source, target);
            if (status !== 'available' && status !== 'readily') {
                this.elTestOut.className = 'cais-preview-out cais-out-error';
                this.elTestOut.textContent = 'Please install the language pack first.';
                this.elRunBtn.disabled = true;
                return;
            }

            translator = await ChromeAISetupFramework.createTranslator(source, target);
            if (translator.ready) {
                await translator.ready;
            }

            const result = await translator.translate(text);
            const ms = Math.round(performance.now() - t0);

            this.elTestOut.className = 'cais-preview-out cais-out-ok';
            this.elTestOut.textContent = result;
            this.elPreviewNote.textContent = this.texts.translationDone.replace('{ms}', ms);

            // Trigger pair re-check to update badges
            this.checkPairSupport();
        } catch (e) {
            console.error('ChromeAISetupFramework translation error:', e);
            this.elTestOut.className = 'cais-preview-out cais-out-error';
            this.elTestOut.textContent = this.texts.translationFailed;
        } finally {
            if (translator && typeof translator.destroy === 'function') {
                translator.destroy();
            }
            this.elRunBtn.disabled = false;
        }
    }

    /**
     * Check systems and load current state dynamically
     */
    async liveDetect() {
        this.currentState = 'checking';
        this.renderState('checking');

        const bypassBrowser = this.options.bypassBrowserCheck;
        const bypassSecure  = this.options.bypassSecureCheck;
        const bypassApi     = this.options.bypassApiCheck;

        // 1. Desktop Check
        if (!bypassBrowser && !ChromeAISetupFramework.isDesktop()) {
            this.renderState('unavailable', this.texts.unsupportedBrowser, 'Chrome AI requires a desktop browser (Chrome or Edge version 138+). Mobile operating systems are not supported.');
            return;
        }

        // 2. Browser Brand check
        if (!bypassBrowser && this.browserType === 'Other') {
            this.renderState('unavailable', this.texts.unsupportedBrowser, 'To use offline translation, switch to Google Chrome or Microsoft Edge (desktop v138+).');
            return;
        }

        // 3. HTTPS / SecureContext Check
        if (!bypassSecure && !ChromeAISetupFramework.isSecure()) {
            this.renderState('secure-error');
            return;
        }

        // 4. API availability check
        if (!bypassApi && !ChromeAISetupFramework.isApiPresent()) {
            this.renderState('unavailable', this.texts.statusError, 'The Translator API is not enabled. Go to advanced steps below to enable flags.');
            return;
        }

        // 5. Query overall availability for all required languages
        try {
            this.downloadedLanguages = [];
            this.missingLanguages = [];
            this.allLanguageStatuses = [];
            
            let isDownloading = false;

            for (const lang of this.options.availableLanguages) {
                if (lang.code.toLowerCase() === this.options.sourceLanguage.toLowerCase()) continue;

                if (!ChromeAISetupFramework.getSupportedLanguages().includes(lang.code.toLowerCase())) {
                    this.allLanguageStatuses.push({ lang, status: 'unsupported' });
                    continue;
                }

                try {
                    const status = await ChromeAISetupFramework.getLanguagePairStatus(this.options.sourceLanguage, lang.code);
                    this.allLanguageStatuses.push({ lang, status });

                    if (status === 'available') {
                        this.downloadedLanguages.push(lang);
                    } else if (status === 'downloadable' || status === 'downloading' || status === 'after-download') {
                        this.missingLanguages.push({ lang, status });
                        if (status === 'downloading') isDownloading = true;
                    }
                } catch (e) {
                    this.allLanguageStatuses.push({ lang, status: 'error' });
                }
            }

            this.updateDropdownUI();
            this.updateLanguageStatusList();

            if (this.missingLanguages.length > 0) {
                if (isDownloading) {
                    this.realDownload(); // Start monitoring the download
                } else {
                    if (this.isEdge) {
                        const settingsUrl = 'https://microsoftedge.github.io/Demos/built-in-ai/playgrounds/translator-api/';
                        const customDesc = `To translate in Edge, open the Edge Playground — <strong>${this.createCopyableSpan(settingsUrl)}</strong> — select your target language, and test a translation to trigger the download. Then return here and click <strong>Install Language Pack</strong>.`;
                        this.renderState('downloadable', null, customDesc);
                    } else {
                        const settingsUrl = 'chrome://settings/languages';
                        const customDesc = `To translate, download the target language pack in your browser settings — <strong>${this.createCopyableSpan(settingsUrl)}</strong>, and click on the 'Install Language Pack' button below.`;
                        this.renderState('downloadable', null, customDesc);
                    }
                }
            } else if (this.downloadedLanguages.length > 0) {
                this.renderState('available');
            } else {
                this.renderState('error', 'No supported languages', 'None of your site languages are supported by Chrome AI.');
            }
        } catch (e) {
            this.renderState('error', 'Browser check failed', `An error occurred while calling the Translator API: ${e.message || e}`);
        }
    }

    /**
     * Update the target language dropdown options
     */
    updateDropdownUI() {
        if (!this.elTgtSelect) return;
        
        let html = '';
        if (this.downloadedLanguages.length > 0) {
            this.downloadedLanguages.forEach(lang => {
                html += `<option value="${lang.code}">${lang.name}</option>`;
            });
            this.elTgtSelect.disabled = false;
        } else {
            html = `<option value="" disabled selected>No downloaded languages available</option>`;
            this.elTgtSelect.disabled = true;
            // Also disable test button
            if (this.elRunBtn) this.elRunBtn.disabled = true;
        }
        this.elTgtSelect.innerHTML = html;
        this.checkPairSupport();
    }

    /**
     * Render the Language Packs Status list (All languages with their status pills)
     */
    updateLanguageStatusList() {
        if (!this.elLanguageStatusList || this.allLanguageStatuses.length === 0) return;

        let html = `
            <div style="background: #fafafa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin-top: 20px;">
                <h4 style="margin: 0 0 15px 0; font-size: 14px; color: #374151;">Language Packs Status</h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;

        this.allLanguageStatuses.forEach(item => {
            const name = `${item.lang.name} (${item.lang.code.toUpperCase()})`;
            let badgeHtml = '';
            
            if (item.status === 'unsupported') {
                badgeHtml = `<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">Unsupported</span>`;
            } else if (item.status === 'available') {
                badgeHtml = `<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">Ready</span>`;
            } else if (item.status === 'downloading') {
                badgeHtml = `<span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">Downloading...</span>`;
            } else {
                // downloadable / after-download / error
                const extraClass = this.options.primaryBtnClass ? ` ${this.options.primaryBtnClass}` : '';
                badgeHtml = `<button class="cais-needs-download-btn${extraClass}" data-lang="${item.lang.code}">Install Language Pack</button>`;
            }

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">
                    <span style="color: #4b5563; font-size: 13px;">${name}</span>
                    ${badgeHtml}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        this.elLanguageStatusList.innerHTML = html;
        this.elLanguageStatusList.style.display = 'block';

        // Bind clicks for Install Language Pack pills
        const downloadBtns = this.elLanguageStatusList.querySelectorAll('.cais-needs-download-btn');
        downloadBtns.forEach(btn => {
            // Click to download
            btn.addEventListener('click', () => {
                const langCode = btn.getAttribute('data-lang');
                // Trigger download for this specific language
                this.realDownloadForLang(langCode, btn);
            });
        });
    }

    /**
     * Start the real download process for a specific Chrome AI model
     */
    async realDownloadForLang(targetLang, btnElement) {
        if (!ChromeAISetupFramework.isApiPresent()) {
            this.renderState('unavailable');
            return;
        }

        const source = this.options.sourceLanguage;
        let downloader = null;

        // Update button UI
        btnElement.textContent = 'Downloading...';
        btnElement.disabled = true;
        
        try {
            const monitor = (m) => {
                m.addEventListener('downloadprogress', (e) => {
                    const pct = Math.round((e.loaded || 0) * 100);
                    btnElement.textContent = `Downloading... ${pct}%`;
                });
            };

            const initDownload = async () => {
                const options = { sourceLanguage: source, targetLanguage: targetLang };
                // Microsoft Edge rejects unknown options like monitor in older builds
                if (!this.isEdge) {
                    options.monitor = monitor;
                }

                if ('translation' in self && 'createTranslator' in self.translation) {
                    return await self.translation.createTranslator(options);
                } else if ('ai' in self && 'translator' in self.ai) {
                    return await self.ai.translator.create(options);
                } else if ('Translator' in self && 'create' in self.Translator) {
                    return await self.Translator.create(options);
                }
                throw new Error('API missing');
            };

            downloader = await initDownload();
            if (downloader.ready) {
                await downloader.ready;
            }

            if (downloader && typeof downloader.destroy === 'function') {
                downloader.destroy();
            }

            window.location.reload();
        } catch (e) {
            console.error('ChromeAISetupFramework: Model download failed', e);
            btnElement.textContent = 'Setup in Settings';
            btnElement.disabled = false;
            
            // On click again, open settings tab
            btnElement.onclick = () => {
                const langUrl = this.isEdge ? 'https://microsoftedge.github.io/Demos/built-in-ai/playgrounds/translator-api/' : 'chrome://settings/languages';
                window.open(langUrl, '_blank');
            };
        }
    }

    /**
     * Start the real download process for Chrome AI models
     */
    async realDownload() {
        if (!ChromeAISetupFramework.isApiPresent()) {
            this.renderState('unavailable');
            return;
        }

        this.renderState('downloading');

        const source = this.options.sourceLanguage;
        const target = this.elTgtSelect.value || 'fr';
        let downloader = null;

        try {
            const monitor = (m) => {
                m.addEventListener('downloadprogress', (e) => {
                    let pct = 0;
                    if (e.total) {
                        pct = Math.round((e.loaded / e.total) * 100);
                    } else if (e.loaded && e.loaded <= 1) {
                        pct = Math.round(e.loaded * 100);
                    } else if (e.loaded > 1) {
                        this.elDlPct.textContent = `Downloading…`;
                        return;
                    }
                    this.elDlFill.style.width = `${pct}%`;
                    this.elDlPct.textContent = `Downloading… ${pct}%`;
                });
            };

            const initDownload = async () => {
                const options = { sourceLanguage: source, targetLanguage: target };
                if (!this.isEdge) {
                    options.monitor = monitor;
                }

                if ('translation' in self && 'createTranslator' in self.translation) {
                    return await self.translation.createTranslator(options);
                } else if ('ai' in self && 'translator' in self.ai) {
                    return await self.ai.translator.create(options);
                } else if ('Translator' in self && 'create' in self.Translator) {
                    return await self.Translator.create(options);
                }
                throw new Error('API missing');
            };

            downloader = await initDownload();
            if (downloader.ready) {
                await downloader.ready;
            }

            this.elDlFill.style.width = '100%';
            this.elDlPct.textContent = 'Done';

            if (downloader && typeof downloader.destroy === 'function') {
                downloader.destroy();
            }

            this.renderState('available');
            window.location.reload();
        } catch (e) {
            console.error('ChromeAISetupFramework: Model download failed', e);
            this.renderState('error', 'Download failed', 'Ensure your connection is stable and you have enough free disk space (~22 GB) to unpack the translation model, then retry.');

            // Set up action button for retry
            this.elActionBtn.style.display = 'inline-flex';
            this.elActionBtn.textContent = this.texts.btnRetry;
            this.elActionBtn.onclick = () => this.realDownload();
        }
    }


    /**
     * Render the UI matching the current state
     * @param {string} state - 'checking' | 'unavailable' | 'downloadable' | 'downloading' | 'available' | 'error' | 'secure-error'
     * @param {string} [customTitle]
     * @param {string} [customDesc]
     */
    renderState(state, customTitle = '', customDesc = '') {
        this.currentState = state;

        // Reset layout elements
        this.elDot.className = `cais-status-dot ${state}`;
        this.elActionBtn.style.display = 'none';
        this.elDlWrap.style.display = 'none';
        this.elTestUi.style.display = 'none';

        // Apply visual state transitions
        if (state === 'checking') {
            this.elDot.className = 'cais-status-dot checking';
            this.elTitle.textContent = customTitle || this.texts.statusChecking;
            this.elDesc.textContent = customDesc || this.texts.statusCheckingDesc;
        }
        else if (state === 'unavailable') {
            this.elDot.className = 'cais-status-dot error';
            this.elTitle.textContent = customTitle || this.texts.unsupportedBrowser;
            this.elDesc.textContent = customDesc || `Please use Google Chrome or Microsoft Edge on desktop (v138+).`;

            // Show action button to Use Another Provider
            this.elActionBtn.style.display = 'inline-flex';
            this.elActionBtn.textContent = this.texts.btnAlternative;
            this.elActionBtn.onclick = () => {
                if (this.options.alternativeUrl) {
                    window.location.href = this.options.alternativeUrl;
                }
            };
            this.elAccordion.open = true;
        }
        else if (state === 'secure-error') {
            this.elDot.className = 'cais-status-dot error';
            this.elTitle.textContent = this.texts.statusHttpError;
            this.elDesc.textContent = this.texts.statusHttpErrorDesc;

            this.elActionBtn.style.display = 'inline-flex';
            this.elActionBtn.textContent = this.texts.btnAlternative;
            this.elActionBtn.onclick = () => {
                if (this.options.alternativeUrl) {
                    window.location.href = this.options.alternativeUrl;
                }
            };
            this.elAccordion.open = true;
        }
        else if (state === 'downloadable') {
            const hasTargetLanguage = this.options.availableLanguages.some((lang) => {
                return (lang.code || '').toLowerCase() !== this.options.sourceLanguage.toLowerCase();
            });

            this.elDot.className = 'cais-status-dot action';
            this.elTitle.textContent = customTitle || this.texts.statusDownloadable || 'Language pack required';

            if (customDesc) {
                this.elDesc.innerHTML = customDesc;
            } else if (hasTargetLanguage) {
                if (this.isEdge) {
                    const langUrl = 'https://microsoftedge.github.io/Demos/built-in-ai/playgrounds/translator-api/';
                    this.elDesc.innerHTML = `To translate in Edge, open the Edge Playground — ${this.createCopyableSpan(langUrl)} — select your target language, and test a translation to trigger the download. Then return here and click <strong>Install Language Pack</strong>.`;
                } else {
                    const langUrl = 'chrome://settings/languages';
                    this.elDesc.innerHTML = `To translate, download the target language pack in your browser settings — ${this.createCopyableSpan(langUrl)}, and click on the <strong>Install Language Pack</strong> button below.`;
                }
            } else {
                this.elDesc.textContent = 'Add a target language in Polylang settings before downloading a translation pack.';
            }

            // Show Translation Panel instead of static list
            this.elTestUi.style.display = 'block';
            this.updateCharCount();
            this.checkPairSupport();
        }
        else if (state === 'downloading') {
            this.elDot.className = 'cais-status-dot checking';
            this.elTitle.textContent = customTitle || this.texts.statusDownloading;
            this.elDesc.textContent = customDesc || this.texts.statusDownloadingDesc;
            this.elDlWrap.style.display = 'block';
        }
        else if (state === 'available') {
            this.elDot.className = 'cais-status-dot ready';
            this.elTitle.textContent = customTitle || this.texts.statusReady;
            this.elDesc.textContent = customDesc || this.texts.statusReadyDesc;

            // Show Translation Panel
            this.elTestUi.style.display = 'block';
            this.updateCharCount();
            this.checkPairSupport();
        }
        else if (state === 'error') {
            this.elDot.className = 'cais-status-dot error';
            this.elTitle.textContent = customTitle || this.texts.statusError;
            this.elDesc.textContent = customDesc || this.texts.statusErrorDesc;
            this.elAccordion.open = true;
        }

        // Dynamically toggle Advanced Steps accordion visibility and update list
        if (state === 'checking') {
            this.elAccordion.style.display = 'none';
        } else {
            const hasIncompleteLangs = this.allLanguageStatuses && this.allLanguageStatuses.some(l => l.status !== 'available');
            
            if (state === 'available' && !hasIncompleteLangs) {
                this.elAccordion.style.display = 'none';
            } else {
                this.elAccordion.style.display = 'block';
                this.updateFallbackAccordion(state);
            }
        }

        // Trigger hooks
        if (typeof this.options.onStatusChange === 'function') {
            this.options.onStatusChange(state, {
                title: this.elTitle.textContent,
                desc: this.elDesc.textContent
            });
        }
    }
}

// Export global to window for standard copy-paste script tags integration
window.ChromeAISetupFramework = ChromeAISetupFramework;
