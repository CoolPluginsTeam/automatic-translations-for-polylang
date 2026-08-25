import React, { useEffect } from 'react';
import { __, sprintf, _n } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";

/**
 * Translation status for the listed rows, embedded in the page footer.
 *
 * Read once per page rather than fetched, because admin-ajax has to boot the
 * whole admin stack before it can answer.
 *
 * @since 1.6.0
 *
 * @return {Object} Map of post ID to its translation status.
 */
const readPostsMeta = () => {
    const node = document.getElementById('atfp-bulk-posts-meta');

    if (!node) {
        return {};
    }

    try {
        return JSON.parse(node.textContent) || {};
    } catch (error) {
        return {};
    }
};

/**
 * Pick the single post to offer out of a multi row selection.
 *
 * Preference order: rows in the source language, then the fewest existing
 * translations, then the earliest row. Rows the free version cannot translate,
 * or that are already translated everywhere, are never offered.
 *
 * @since 1.6.0
 *
 * @param {string[]} postIds Selected post IDs, in list order.
 *
 * @return {Object} `reason` plus the chosen `post` when there is one.
 */
const pickCandidate = (postIds) => {
    const meta = readPostsMeta();
    const candidates = [];
    let knownRows = 0;
    let supportedRows = 0;

    postIds.forEach((postId, order) => {
        const info = meta[String(postId)];

        if (!info) {
            return;
        }

        knownRows++;

        if (!info.supported) {
            return;
        }

        supportedRows++;

        if (info.complete) {
            return;
        }

        candidates.push({ post_id: postId, title: info.title, done: info.done, source: info.source, order });
    });

    // Nothing known about the selection, so fall back to a plain upsell.
    if (0 === knownRows) {
        return { reason: 'multiple', post: null };
    }

    if (0 === supportedRows) {
        return { reason: 'unsupported-editor' };
    }

    if (!candidates.length) {
        return { reason: 'retranslate' };
    }

    const sourceRows = candidates.filter((candidate) => candidate.source);
    const pool = sourceRows.length ? sourceRows : candidates;

    pool.sort((a, b) => (a.done === b.done ? a.order - b.order : a.done - b.done));

    return { reason: 'multiple', post: pool[0] };
};

/**
 * Clear every selected row in the list table.
 *
 * Used by "Choose Another Page" so the user starts a fresh selection instead of
 * reopening the same notice.
 *
 * @since 1.6.0
 *
 * @return {void}
 */
const clearSelection = () => {
    document
        .querySelectorAll('table.widefat input[name="post[]"]:checked, #cb-select-all-1, #cb-select-all-2')
        .forEach((checkbox) => {
            checkbox.checked = false;
        });
};

/**
 * Shorten a post title so it cannot stretch the Translate button.
 *
 * @since 1.6.0
 *
 * @param {string} title Post title.
 * @param {number} max   Characters to keep before the ellipsis.
 *
 * @return {string} Title, shortened with an ellipsis when it is too long.
 */
const shortenTitle = (title, max = 24) => {
    const value = String(title || '');

    return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
};

/**
 * Shown when several rows are selected but the free version translates one at a
 * time. Suggests the row with the most work left and offers to translate it.
 *
 * The suggestion is resolved server side, because translation status and editor
 * type are not available in the browser.
 *
 * @since 1.6.0
 *
 * @param {Object}   props                   Component props.
 * @param {string}   props.prefix            CSS class prefix.
 * @param {string[]} props.postIds           Selected post IDs, in list order.
 * @param {Function} props.onDestory         Closes the whole translation UI.
 * @param {Function} props.onReasonChange    Called when the server says another Pro screen fits better.
 * @param {Function} props.onTranslateSingle Called with the post to translate on its own.
 *
 * @return {JSX.Element} Suggestion screen.
 */
const BulkPageChoice = ({ prefix, postIds, onDestory, onReasonChange, onTranslateSingle }) => {
    const settings = atfp_bulk_translate_object;
    const postLabel = settings.post_label;
    const { reason, post: candidate } = pickCandidate(postIds);

    // The selection may be better served by one of the other Pro screens.
    useEffect(() => {
        if ('multiple' !== reason) {
            onReasonChange(reason);
        }
    }, [reason]);

    if ('multiple' !== reason) {
        return null;
    }

    const selectedCount = postIds.length;
    const upgradeUrl = `${settings.pro_version_url}?${settings.refrence_text}&utm_medium=inside&utm_campaign=get_pro&utm_content=bulk_multiple_posts`;

    return (
        <div id={`${prefix}-setting-modal-container`}>
            <div className={`${prefix}-setting-modal-content`}>

                <div className={`${prefix}-header`}>
                    <div className={`${prefix}-modal-header-inner`}>
                        <div className={`${prefix}-modal-header-left`}>
                            <img
                                src={`${settings.atfp_url}assets/images/bulk-translation-icon-badge.svg`}
                                className={`${prefix}-pro-header-badge`}
                                alt=""
                                aria-hidden="true"
                            />
                            <div>
                                <h2>{__('Bulk Translation is a Pro Feature', 'automatic-translations-for-polylang')}</h2>
                                <p className={`${prefix}-modal-desc`}>
                                    {createInterpolateElement(
                                        sprintf(
                                            /* translators: 1: number of selected items, 2: post type label. */
                                            __('You have selected <count>%1$d %2$s</count> for translation.', 'automatic-translations-for-polylang'),
                                            selectedCount,
                                            postLabel
                                        ),
                                        { count: <strong /> }
                                    )}
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
                    <div className={`${prefix}-choice-note`} role="note">
                        <span className={`${prefix}-choice-note-icon`} aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                                <path d="M12 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <circle cx="12" cy="7.8" r="1.1" fill="currentColor" />
                            </svg>
                        </span>
                        <p>
                            {createInterpolateElement(
                                __('AutoPoly Free allows you to translate <one>one page at a time.</one> Continue with the selected untranslated page, or go back and choose a different page.', 'automatic-translations-for-polylang'),
                                { one: <strong /> }
                            )}
                        </p>
                    </div>

                    {candidate && (
                        <>
                            <h3 className={`${prefix}-choice-heading`}>
                                {__('Selected Untranslated Page', 'automatic-translations-for-polylang')}
                            </h3>
                            <div className={`${prefix}-choice-card`}>
                                <span className={`${prefix}-choice-card-icon`} aria-hidden="true">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                        <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className={`${prefix}-choice-card-title`}>{candidate.title}</span>
                            </div>
                        </>
                    )}

                    <div className={`${prefix}-choice-actions`}>
                        {candidate && (
                            <button
                                type="button"
                                className={`${prefix}-footer-button button button-primary`}
                                onClick={() => onTranslateSingle(String(candidate.post_id))}
                                title={sprintf(
                                    /* translators: %s: post title. */
                                    __('Translate “%s”', 'automatic-translations-for-polylang'),
                                    candidate.title
                                )}
                            >
                                <span className={`${prefix}-choice-translate-icon`} aria-hidden="true">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17c-.67 1.92-1.73 3.75-3.17 5.35-1.02-1.13-1.89-2.4-2.56-3.75H4.5c.82 2 2.05 3.87 3.63 5.47L3 18l1.41 1.41L9 14.83l3.11 3.11.76-2.04z" />
                                        <path d="M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                                    </svg>
                                </span>
                                {sprintf(
                                    /* translators: %s: post title, shortened when long. */
                                    __('Translate “%s”', 'automatic-translations-for-polylang'),
                                    shortenTitle(candidate.title)
                                )}
                            </button>
                        )}
                        <button
                            type="button"
                            className={`${prefix}-choice-secondary button`}
                            onClick={(e) => {
                                clearSelection();
                                onDestory(e);
                            }}
                        >
                            &#8592; {sprintf(
                                /* translators: %s: post type label, for example Pages. */
                                __('Choose Another %s', 'automatic-translations-for-polylang'),
                                postLabel
                            )}
                        </button>
                    </div>
                </div>

                <div className={`${prefix}-footer ${prefix}-choice-footer`}>
                    <p>
                        {sprintf(
                            /* translators: 1: number of selected items, 2: post type label. */
                            _n(
                                'Upgrade to Pro to translate all %1$d %2$s at once.',
                                'Upgrade to Pro to translate all %1$d %2$s at once.',
                                selectedCount,
                                'automatic-translations-for-polylang'
                            ),
                            selectedCount,
                            postLabel
                        )}
                    </p>
                        <a
                            className={`${prefix}-pro-upgrade-button`}
                            href={upgradeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {__('Get Bulk Translation', 'automatic-translations-for-polylang')}
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

export default BulkPageChoice;
