import ModalStringScroll from "../../string-modal-scroll";

const yandexWidget = ($, win, doc, targetLang, params, namespace, translateStatus, translateStatusHandler, modalRenderId) => {
    'use strict';

    if(translateStatus && true === translateStatus){
        return;
    }

    var util = {
        loadScript: function (src, parent, callback) {
            var script = doc.createElement('script');
            script.src = src;

            script.addEventListener('load', function onLoad() {
                this.removeEventListener('load', onLoad, false);
                callback();
            }, false);

            parent.appendChild(script);
        },
        isSupportedBrowser: function () {
            return 'localStorage' in win &&
                'querySelector' in doc &&
                'addEventListener' in win &&
                'getComputedStyle' in win && doc.compatMode === 'CSS1Compat';
        }
    };

    var wrapper = doc.getElementById(params.widgetId);

    if (!wrapper || !util.isSupportedBrowser()) {
        return;
    }
    var initWidget = function () {
        util.loadScript('https://yastatic.net/s3/translate/v21.4.7/js/tr_page.js', wrapper, function () {
            // Custom UI mode: we do NOT load Yandex widget.html.
            if ((!namespace || !namespace.PageTranslator) && wrapper) {
                wrapper.innerHTML = '<div class="atfp-notice atfp-notice-warning">Yandex translator script did not initialize. Please check network/CSP blocking `yastatic.net`.</div>';
                wrapper.style.display = 'block';
                return;
            }
            
            function getConfiguredMaxPortionLength() {
                var rawValue = null;

                if (wrapper && wrapper.getAttribute) {
                    rawValue = wrapper.getAttribute('data-max-portion-length');
                }

                var parsed = parseInt(rawValue, 10);
                if (isNaN(parsed)) {
                    return 600;
                }
                return Math.min(1500, Math.max(300, parsed));
            }

            var translator = new namespace.PageTranslator({
                srv: 'tr-url-widget',
                url: 'https://translate.yandex.net/api/v1/tr.json/translate',
                autoSync: false,
                maxPortionLength: getConfiguredMaxPortionLength()
            });

            // Prevent multiple translation runs from stacking
            var atfpTranslating = false;
            var progressTickTimer = null;
            var translationUnlockTimer = null;

            function clearProgressTick() {
                if (progressTickTimer) {
                    win.clearInterval(progressTickTimer);
                    progressTickTimer = null;
                }
            }

            function scheduleUnlock(delayMs) {
                if (translationUnlockTimer) {
                    win.clearTimeout(translationUnlockTimer);
                }
                translationUnlockTimer = win.setTimeout(function () {
                    atfpTranslating = false;
                    clearProgressTick();
                }, delayMs);
            }

            // Hook progress/errors (best-effort; depends on PageTranslator implementation)
            try {
                translator.on('error', function () {
                    atfpTranslating = false;
                    clearProgressTick();
                    wrapper.insertAdjacentHTML('afterbegin', '<div class="notice inline notice-warning">Yandex translation failed. Please retry or check network blocking.</div>');
                });
            } catch (e) { }

            function getStoredTargetLang() {
                var code = targetLang;
                if (code) return code;
                try {
                    var fromYt = win.JSON.parse(win.localStorage['yt-widget'] || '{}') || {};
                    if (fromYt.lang) return fromYt.lang;
                } catch (e) { }
                return '';
            }

            function startAtfpTranslation() {
                var targetLang = getStoredTargetLang();
                if (!targetLang) return;
                if (atfpTranslating) return;

                // Only start when strings are rendered + modal is visible
                var $container = $('#atfp-yandex-strings-modal');
                if (!$container.length || $container.css('display') === 'none') return;
                if (!$container.find('.atfp_string_container tbody tr').length) return;

                atfpTranslating = true;

                // Persist for subsequent opens
                try {
                    var prev = win.JSON.parse(win.localStorage['yt-widget'] || '{}') || {};
                    prev.lang = targetLang;
                    win.localStorage['yt-widget'] = win.JSON.stringify(prev);
                } catch (e) {
                    try { win.localStorage['yt-widget'] = win.JSON.stringify({ lang: targetLang }); } catch (e2) { }
                }

                // Start translating the page/popup content
                win.setTimeout(function () {
                    try {
                        translator.translate(params.pageLang, targetLang);
                        ModalStringScroll(translateStatusHandler,'yandex', modalRenderId);
                    } finally {
                        // Best-effort unlock fallback if provider callbacks are missed.
                        scheduleUnlock(30000);
                    }
                }, 1000);
            }

            // Auto-start translation when popup opens + strings are loaded (no button needed)
            startAtfpTranslation();
        });
    };

    if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
        initWidget();
    } else {
        doc.addEventListener('DOMContentLoaded', initWidget, false);
    }
};

const YandexTranslater = (props) => {
    const globalObj = window;
    yandexWidget(jQuery, globalObj, globalObj.document, props.targetLang, { "pageLang": props.sourceLang, "autoMode": "false", "widgetId": "atfp_yandex_translate_notice_wrapper", "widgetTheme": "light" }, globalObj.yt = globalObj.yt || {}, props.translateStatus,  props.translateStatusHandler, props.modalRenderId);
}

export default YandexTranslater;