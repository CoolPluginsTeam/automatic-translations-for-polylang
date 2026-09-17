import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";

/**
 * Upsell screen shown when the requested action needs AutoPoly Pro.
 *
 * The headline copy, benefit list and artwork all vary with the reason Pro is
 * required, so one screen can serve every gated action.
 *
 * @since 1.1.0
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.prefix    CSS class prefix.
 * @param {string}   props.reason    Why Pro is required: multiple, unsupported-editor or retranslate.
 * @param {Function} props.onDestory Callback that closes the whole translation UI.
 *
 * @return {JSX.Element} Pro upsell screen.
 */
const ProNotice = ({ prefix, reason, onDestory }) => {
    const imgFolder = `${atfp_bulk_translate_object.atfp_url}assets/images/`;
    const postLabel = atfp_bulk_translate_object.post_label;

    const proMessages = {
        'multiple': {
            highlight: __('Translate 10× faster with Bulk Translation — save hours of manual work and effort.', 'automatic-translations-for-polylang'),
            utm: 'bulk_multiple_posts',
            benefits: [
                {
                    title: __('Translate In Bulk', 'automatic-translations-for-polylang'),
                    /* translators: %s: post type label, for example Posts or Pages. */
                    desc: sprintf(__('Send many %s through AI in a single run.', 'automatic-translations-for-polylang'), postLabel),
                },
                {
                    title: __('Better Accuracy', 'automatic-translations-for-polylang'),
                    desc: __('Improved context-aware translations.', 'automatic-translations-for-polylang'),
                },
                {
                    title: __('Save Time & Effort', 'automatic-translations-for-polylang'),
                    desc: __('No need to translate them one by one.', 'automatic-translations-for-polylang'),
                },
            ],
        },
        // Reached by every editor the free version cannot read, not only the
        // classic one -- page builders such as Divi or WPBakery land here too,
        // because their content carries no blocks to detect.
        'unsupported-editor': {
            text: __('Translating this editor is a <accent>Pro</accent> feature.', 'automatic-translations-for-polylang'),
            utm: 'bulk_classic_editor',
            benefits: [
                {
                    title: __('More Editor Support', 'automatic-translations-for-polylang'),
                    desc: __('Translate content built without blocks, including the classic editor and page builders.', 'automatic-translations-for-polylang'),
                },
                {
                    title: __('Better Accuracy', 'automatic-translations-for-polylang'),
                    desc: __('Improved context-aware translations.', 'automatic-translations-for-polylang'),
                },
                {
                    title: __('Save Time & Effort', 'automatic-translations-for-polylang'),
                    desc: __('No need to translate manually again.', 'automatic-translations-for-polylang'),
                },
            ],
        },
        'retranslate': {
            title: __('Unlock Re-Translation with AutoPoly Pro', 'automatic-translations-for-polylang'),
            desc: __('Upgrade to Pro to re-translate existing content with AI.', 'automatic-translations-for-polylang'),
            heading: __('Already translated this content?', 'automatic-translations-for-polylang'),
            text: __('AutoPoly Pro lets you translate it again with AI whenever your original content changes.', 'automatic-translations-for-polylang'),
            utm: 'bulk_retranslate',
            benefits: [
                {
                    title: __('Re-translate Existing Content', 'automatic-translations-for-polylang'),
                    desc: __('Translate previously translated pages again with AI.', 'automatic-translations-for-polylang'),
                },
                {
                    title: __('Re-translate in One Click', 'automatic-translations-for-polylang'),
                    desc: __('Start AI re-translation quickly without recreating translations manually.', 'automatic-translations-for-polylang'),
                },
            ],
        },
    };

    const proMessage = proMessages[reason] || proMessages.retranslate;
    const upgradeUrl = `${atfp_bulk_translate_object.pro_version_url}?${atfp_bulk_translate_object.refrence_text}&utm_medium=inside&utm_campaign=get_pro&utm_content=${proMessage.utm}`;
    const accent = <span className={`${prefix}-pro-accent`} />;

    return (
        <div id={`${prefix}-setting-modal-container`}>
            <div className={`${prefix}-setting-modal-content`}>

                <div className={`${prefix}-header`}>
                    <div className={`${prefix}-modal-header-inner`}>
                        <div className={`${prefix}-modal-header-left`}>
                            <img
                                src={`${imgFolder}bulk-translation-icon-badge.svg`}
                                className={`${prefix}-pro-header-badge`}
                                alt=""
                                aria-hidden="true"
                            />
                            <div>
                                <h2>{proMessage.title || __('AutoPoly Pro Feature', 'automatic-translations-for-polylang')}</h2>
                                <p className={`${prefix}-modal-desc`}>
                                    {proMessage.desc || __('Upgrade to Pro to unlock advanced AI translation capabilities.', 'automatic-translations-for-polylang')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={`${prefix}-modal-close`}
                        onClick={onDestory}
                        title={__('Close', 'automatic-translations-for-polylang')}
                        aria-label={__('Close', 'automatic-translations-for-polylang')}
                    >
                        &times;
                    </button>
                </div>

                <div className={`${prefix}-setting-modal-body`}>
                    <div className={`${prefix}-pro-panel`}>
                        <div className={`${prefix}-pro-panel-head`}>
                            <span className={`${prefix}-pro-crown`} aria-hidden="true">
                                <svg width="74" height="34" viewBox="0 0 86 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M29 31L25 10l10.5 7.5L43 6l7.5 11.5L61 10l-4 21H29z" fill="#f5b301" />
                                    <path d="M29 31h28v4H29z" fill="#e29c02" />
                                    <path d="M13 8l1.5 3.5L18 13l-3.5 1.5L13 18l-1.5-3.5L8 13l3.5-1.5L13 8z" fill="#fbd15b" />
                                    <path d="M73 9l1.5 3.5L78 14l-3.5 1.5L73 19l-1.5-3.5L68 14l3.5-1.5L73 9z" fill="#fbd15b" />
                                    <path d="M22 20l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" fill="#fde08e" />
                                    <path d="M64 21l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" fill="#fde08e" />
                                </svg>
                            </span>
                            <h3>
                                {proMessage.heading
                                    ? <span className={`${prefix}-pro-accent`}>{proMessage.heading}</span>
                                    : createInterpolateElement(
                                        __('Unlock <accent>AutoPoly Pro</accent>', 'automatic-translations-for-polylang'),
                                        { accent }
                                    )}
                            </h3>
                            {proMessage.text && (
                                <p>{createInterpolateElement(proMessage.text, { accent })}</p>
                            )}
                            {proMessage.highlight && (
                                <p className={`${prefix}-pro-highlight`}>{proMessage.highlight}</p>
                            )}
                        </div>

                        <div className={`${prefix}-pro-panel-body`}>
                            <ul className={`${prefix}-pro-benefits`}>
                                {proMessage.benefits.map((benefit) => (
                                    <li key={benefit.title}>
                                        <span className={`${prefix}-pro-benefit-icon`} aria-hidden="true">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                                                <path d="M7.8 12.3l2.9 2.9 5.5-5.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <span className={`${prefix}-pro-benefit-text`}>
                                            <strong>{benefit.title}</strong>
                                            <span>{benefit.desc}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={`${prefix}-footer`}>
                    <a
                        className={`${prefix}-pro-upgrade-button`}
                        href={upgradeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {__('Upgrade to Pro', 'automatic-translations-for-polylang')}
                        <span className={`${prefix}-pro-upgrade-icon`} aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 4h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 4l-8.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </a>
                </div>

            </div>
        </div>
    );
}

export default ProNotice;
