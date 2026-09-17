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
            if (detectedBrowser === 'Edge') {
                forceProvider = 'edge';
            } else if (detectedBrowser === 'Chrome') {
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
                forceProvider: forceProvider,
                primaryBtnClass: this.data.primary_btn_class || '',
                secondaryBtnClass: this.data.secondary_btn_class || ''
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
                    if (this.isUnsupportedBrowser(type)) {
                        this.applyUnsupportedState($card, type);
                        return;
                    }

                    const toggle = $(this.options.toggleSelectorPattern.replace('{type}', type));

                    // Always run the readiness check so the Ready / Not Configured
                    // badge stays accurate. The Configure button is gated separately
                    // inside showConfigurationNotice based on the enable toggle.
                    this.showConfigurationNotice(type);

                    toggle.on("change", () => {
                        this.showConfigurationNotice(type);
                    });
                }
            });
        }
    }

    /**
     * Browser that actually runs this built-in AI provider.
     * @param {string} type - 'chrome' | 'edge'
     * @return {string} Chrome or Edge
     */
    requiredBrowserName(type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    /**
     * True when this provider cannot run in the current browser at all.
     * @param {string} type - 'chrome' | 'edge'
     * @return {boolean}
     */
    isUnsupportedBrowser(type) {
        if (typeof ChromeAISetupFramework === 'undefined') {
            return false;
        }

        return ChromeAISetupFramework.getBrowserType() !== this.requiredBrowserName(type);
    }

    /**
     * Tooltip copy for a provider that the current browser cannot run.
     * @param {string} providerName
     * @param {string} browserName
     * @return {string}
     */
    unsupportedTooltip(providerName, browserName) {
        if (window.wp && wp.i18n && wp.i18n.sprintf && wp.i18n.__) {
            return wp.i18n.sprintf(
                /* translators: 1: translation provider name, 2: required browser name */
                wp.i18n.__('%1$s Translation provider is not supported in your current browser. Please use %2$s browser to use this translation provider.', 'automatic-translations-for-polylang'),
                providerName,
                browserName
            );
        }

        return `${providerName} Translation provider is not supported in your current browser. Please use ${browserName} browser to use this translation provider.`;
    }

    /**
     * Mark the row as unsupported: hide Set as default / Docs / toggle,
     * show the browser-support message, Not supported badge.
     * @param {Object} $card jQuery row
     * @param {string} type - 'chrome' | 'edge'
     */
    applyUnsupportedState($card, type) {
        const $ = jQuery;
        const requiredBrowser = this.requiredBrowserName(type);
        const providerName = $card.find('.atfp-engine-name').text().trim() || `${requiredBrowser} Built-in AI`;
        const message = this.unsupportedTooltip(providerName, requiredBrowser);
        const $msg = $card.find('.atfp-engine-unsupported-msg');

        $card.addClass('atfp-engine-unsupported');
        if ($msg.length) {
            $msg.text(message);
        }
        $(this.options.configureBtnSelectorPattern.replace('{type}', type)).hide();
    }

    /**
     * Restore the row after the provider is turned off or becomes usable.
     * @param {Object} $card jQuery row
     */
    clearUnsupportedState($card) {
        $card.removeClass('atfp-engine-unsupported');
    }

    /**
     * Check system capabilities and render notification banner under provider card
     * @param {string} type - 'chrome' | 'edge'
     */
    async showConfigurationNotice(type) {
        const $ = jQuery;
        if (typeof ChromeAISetupFramework === 'undefined') return;

        const cardSelector = this.options.cardSelectorPattern.replace('{type}', type);
        const $card = $(cardSelector);
        if (!$card.length) return;

        const noticeClass = this.options.noticeClassPattern.replace('{type}', type);
        let $notice = $card.find(`.${noticeClass}`);
        const configureBtnSelector = this.options.configureBtnSelectorPattern.replace('{type}', type);
        const toggleSelector = this.options.toggleSelectorPattern.replace('{type}', type);
        const isUnsupportedBrowser = this.isUnsupportedBrowser(type);
        // Badge status keys off the notice's inline display. Keep that in sync with
        // real readiness. Only the Configure button follows the enable toggle.
        const isEnabled = !$(toggleSelector).length || $(toggleSelector).is(':checked');

        if ($notice.length) {
            $notice.show();
            if (isUnsupportedBrowser) {
                this.applyUnsupportedState($card, type);
            } else {
                this.clearUnsupportedState($card);
                $(configureBtnSelector).toggle(isEnabled);
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
            bypassSecureCheck: this.data.chrome_ai_bypass_secure_check === '1' || this.data.chrome_ai_bypass_secure_check === true,
            // Device toolbar spoofs a phone UA but this is still desktop Chrome/Edge,
            // so the dashboard badge must follow the real API check, not isDesktop().
            bypassDesktopCheck: true
        });

        // A missing or still downloading language pack is not something the user
        // has to set up: the browser fetches the pack on demand when the
        // translation runs. Only real blockers -- wrong browser, insecure
        // context, missing API -- mark the provider as needing configuration.
        const packErrorTypes = ['language-pack', 'language-pack-downloading'];
        const needsSetup = checkResult.hasError && !packErrorTypes.includes(checkResult.errorType);

        if (needsSetup) {
            const browserName = this.requiredBrowserName(type);
            let noticeMessage = `Please configure the ${browserName} settings to use ${browserName} AI Translator.`;

            if (checkResult.errorType === 'browser') {
                noticeMessage = `${browserName} browser is required.`;
            } else if (checkResult.errorType === 'secure') {
                noticeMessage = `Secure connection (HTTPS) is required. Please configure ${browserName} settings.`;
            } else if (checkResult.errorType === 'api') {
                noticeMessage = `${browserName} Translation API is not available. Please configure ${browserName} settings.`;
            }

            $notice = $(`<div class="${noticeClass}" style="margin-top: 10px; font-size: 12px; color: #dc2626;" data-error-type="${checkResult.errorType}">${noticeMessage}</div>`);
            $card.append($notice);

            if (isUnsupportedBrowser) {
                this.applyUnsupportedState($card, type);
            } else {
                this.clearUnsupportedState($card);
                $(configureBtnSelector).toggle(isEnabled);
            }
        } else {
            $card.find(`.${noticeClass}`).hide();
            $(configureBtnSelector).hide();
            this.clearUnsupportedState($card);
        }
    }
}

// Export framework class globally
window.ChromeAINoticeFramework = ChromeAINoticeFramework;