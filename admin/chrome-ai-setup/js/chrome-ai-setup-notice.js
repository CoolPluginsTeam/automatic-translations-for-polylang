/**
 * Chrome/Edge AI Translation Notice Framework
 * A reusable class for managing built-in AI dashboard notices, provider toggles,
 * browser filtering, pre-flight availability checks, and settings instantiation.
 * 
 * Version: 1.0.0
 * Author: Cool Plugins
 */
class ChromeAINoticeFramework {
    /**
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        this.options = Object.assign({
            container: '#cais-chrome-setup-container',          // Override per-plugin
            dataVar: 'caisNoticeData',                          // Global localized data object name
            providerTypes: ['chrome', 'edge'],
            cardSelectorPattern: '.cais-card-{type}-built-in-ai',
            toggleSelectorPattern: '.cais-card-{type}-built-in-ai .cais-provider-toggle', // Override if your toggle uses a different class
            configureBtnSelectorPattern: '.cais-{type}-configure-button',
            noticeClassPattern: 'cais-{type}-configure-notice'
        }, options);

        this.data = window[this.options.dataVar] || {};
        this.init();
    }

    /**
     * Initialize the settings page UI and dashboard cards notices
     */
    init() {
        const $ = jQuery;

        // 1. Settings tab UI Setup
        const $container = $(this.options.container);
        if ($container.length && typeof ChromeAISetupFramework !== 'undefined') {
            const rawLangs = this.data.all_languages || {};
            const availableLangs = [];
            for (const key in rawLangs) {
                availableLangs.push({
                    code: key,
                    name: rawLangs[key].name
                });
            }

            const detectedBrowser = ChromeAISetupFramework.getBrowserType();
            const enabledProviders = this.data.enabled_providers || [];
            const chromeEnabled = enabledProviders.includes('chrome-built-in-ai');
            const edgeEnabled = enabledProviders.includes('edge-built-in-ai');
            
            let forceProvider = 'chrome';
            if (detectedBrowser === 'Edge' && edgeEnabled) {
                forceProvider = 'edge';
            } else if (detectedBrowser === 'Chrome' && chromeEnabled) {
                forceProvider = 'chrome';
            } else {
                if (chromeEnabled) forceProvider = 'chrome';
                else if (edgeEnabled) forceProvider = 'edge';
            }

            new ChromeAISetupFramework(this.options.container, {
                sourceLanguage: this.data.source_language || 'en',
                sourceLanguageLabel: this.data.source_language_label || 'English',
                availableLanguages: availableLangs,
                chromeIconUrl: this.data.chrome_icon_url || '',
                edgeIconUrl: this.data.edge_icon_url || '',
                chromeDocUrl: this.data.chrome_setup_doc_url || '',
                edgeDocUrl: this.data.edge_setup_doc_url || '',
                texts: this.data.texts || {},
                // URL passed from PHP via localized data, avoiding hardcoded URLs
                alternativeUrl: this.data.alternative_url || '',
                bypassBrowserCheck: this.data.chrome_ai_bypass_browser_check === '1' || this.data.chrome_ai_bypass_browser_check === true,
                bypassApiCheck: this.data.chrome_ai_bypass_api_check === '1' || this.data.chrome_ai_bypass_api_check === true,
                bypassSecureCheck: this.data.chrome_ai_bypass_secure_check === '1' || this.data.chrome_ai_bypass_secure_check === true,
                defaultProvider: (this.data.enabled_providers && !this.data.enabled_providers.includes('chrome-built-in-ai') && this.data.enabled_providers.includes('edge-built-in-ai')) ? 'edge' : 'chrome',
                forceProvider: forceProvider
            });
        }

        // 2. Pre-flight check and notice logic for the Dashboard tab
        if (typeof ChromeAISetupFramework !== 'undefined') {
            const browserType = ChromeAISetupFramework.getBrowserType();

            // Filter cards based on user browser
            if (browserType === "Chrome") {
                $(this.options.cardSelectorPattern.replace('{type}', 'edge')).hide();
            } else if (browserType === "Edge") {
                $(this.options.cardSelectorPattern.replace('{type}', 'chrome')).hide();
            }

            // Bind toggle change hooks and run checks for each provider
            this.options.providerTypes.forEach(type => {
                const cardSelector = this.options.cardSelectorPattern.replace('{type}', type);
                const $card = $(cardSelector);

                if ($card.length > 0) {
                    const toggle = $(this.options.toggleSelectorPattern.replace('{type}', type));
                    const enabled = toggle.is(":checked");

                    if (enabled) {
                        this.showConfigurationNotice(type);
                    }

                    toggle.on("change", () => {
                        const isChecked = toggle.is(":checked");
                        if (isChecked) {
                            this.showConfigurationNotice(type);
                        } else {
                            $card.find(`.${this.options.noticeClassPattern.replace('{type}', type)}`).hide();
                            $(this.options.configureBtnSelectorPattern.replace('{type}', type)).hide();
                        }
                    });
                }
            });
        }
    }

    /**
     * Check system capabilities and render notification banner under provider card
     * @param {string} type - 'chrome' | 'edge'
     */
    async showConfigurationNotice(type) {
        const $ = jQuery;
        if (typeof ChromeAISetupFramework === 'undefined') return;

        const browserType = ChromeAISetupFramework.getBrowserType();
        const cardSelector = this.options.cardSelectorPattern.replace('{type}', type);
        const $card = $(cardSelector);
        if (!$card.length) return;

        const noticeClass = this.options.noticeClassPattern.replace('{type}', type);
        let $notice = $card.find(`.${noticeClass}`);
        const configureBtnSelector = this.options.configureBtnSelectorPattern.replace('{type}', type);

        if ($notice.length) {
            $notice.show();
            const errorType = $notice.data("error-type");
            if (errorType !== "browser") {
                $(configureBtnSelector).show();
            }
            return;
        }

        // Convert languages
        const rawLangs = this.data.all_languages || {};
        const availableLangs = [];
        for (const key in rawLangs) {
            availableLangs.push({
                code: key,
                name: rawLangs[key].name
            });
        }

        // Run capability checks from the reusable framework
        const checkResult = await ChromeAISetupFramework.checkSystemAvailability({
            sourceLanguage: this.data.source_language || 'en',
            availableLanguages: availableLangs,
            bypassBrowserCheck: this.data.chrome_ai_bypass_browser_check === '1' || this.data.chrome_ai_bypass_browser_check === true,
            bypassApiCheck: this.data.chrome_ai_bypass_api_check === '1' || this.data.chrome_ai_bypass_api_check === true,
            bypassSecureCheck: this.data.chrome_ai_bypass_secure_check === '1' || this.data.chrome_ai_bypass_secure_check === true
        });

        if (checkResult.hasError) {
            const browserName = type.charAt(0).toUpperCase() + type.slice(1);
            let noticeMessage = `Please configure the ${browserName} settings to use ${browserName} AI Translator.`;

            if (checkResult.errorType === 'browser') {
                noticeMessage = `${browserName} browser is required.`;
            } else if (checkResult.errorType === 'secure') {
                noticeMessage = `Secure connection (HTTPS) is required. Please configure ${browserName} settings.`;
            } else if (checkResult.errorType === 'api') {
                noticeMessage = `${browserName} Translation API is not available. Please configure ${browserName} settings.`;
            } else if (checkResult.errorType === 'language-pack') {
                noticeMessage = `Language pack is required. Please configure ${browserName} settings.`;
            } else if (checkResult.errorType === 'language-pack-downloading') {
                noticeMessage = `Language pack is currently downloading.`;
            }

            $notice = $(`<div class="${noticeClass}" style="margin-top: 10px; font-size: 12px; color: #dc2626;" data-error-type="${checkResult.errorType}">${noticeMessage}</div>`);
            $card.append($notice);

            // Always offer the setup link. Even when the browser itself is the
            // blocker, the row says the provider needs configuring, so leaving
            // no action at all reads as a dead end.
            $(configureBtnSelector).show();
        } else {
            $card.find(`.${noticeClass}`).hide();
            $(configureBtnSelector).hide();
        }
    }
}

// Export framework class globally
window.ChromeAINoticeFramework = ChromeAINoticeFramework;