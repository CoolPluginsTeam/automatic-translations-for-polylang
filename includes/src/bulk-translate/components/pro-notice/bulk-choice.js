import React, { useEffect, useMemo } from 'react';
import { __, sprintf, _n } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";

const LOCKED_PREVIEW_LIMIT = 2;

/**
 * Translation status for the listed rows, embedded in the page footer.
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
 * Resolve the free-version pick and the remaining selected rows in one pass.
 *
 * Preference order for the pick: source language, then the fewest existing
 * translations, then the earliest row. Unsupported or fully translated rows
 * are never offered as the free pick.
 *
 * @since 1.6.0
 *
 * @param {string[]} postIds Selected post IDs, in list order.
 *
 * @return {Object} `reason`, plus `candidate` and `others` when the screen applies.
 */
const resolveSelection = (postIds) => {
    const meta = readPostsMeta();
    const fallbackTitle = __('(no title)', 'automatic-translations-for-polylang');
    const rows = [];
    const candidates = [];
    let knownRows = 0;
    let supportedRows = 0;

    postIds.forEach((postId, order) => {
        const info = meta[String(postId)];
        const row = {
            post_id: postId,
            title: (info && info.title) || fallbackTitle,
            slug: (info && info.slug) || '',
            done: info ? info.done : 0,
            source: !!(info && info.source),
            order,
        };

        rows.push(row);

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

        candidates.push(row);
    });

    if (0 === knownRows) {
        return { reason: 'multiple', candidate: null, others: rows };
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

    const candidate = pool[0];

    return {
        reason: 'multiple',
        candidate,
        others: rows.filter((row) => String(row.post_id) !== String(candidate.post_id)),
    };
};

/**
 * Clear every selected row in the list table.
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

const CheckIcon = ({ checked }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
            x="1.25"
            y="1.25"
            width="13.5"
            height="13.5"
            rx="3"
            fill={checked ? 'currentColor' : '#fff'}
            stroke="currentColor"
            strokeWidth="1.5"
        />
        {checked && (
            <path d="M4.4 8.1l2.2 2.2 5-5.2" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        )}
    </svg>
);

const PageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
);

const TranslateIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17c-.67 1.92-1.73 3.75-3.17 5.35-1.02-1.13-1.89-2.4-2.56-3.75H4.5c.82 2 2.05 3.87 3.63 5.47L3 18l1.41 1.41L9 14.83l3.11 3.11.76-2.04z" />
        <path d="M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
);

const ExternalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 4h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 4l-8.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * One selected post: checkbox, page glyph, title, slug, optional badge.
 *
 * @since 1.6.0
 *
 * @return {JSX.Element} Row.
 */
const ChoiceRow = ({ prefix, post, checked, badge, actions }) => (
    <div className={`${prefix}-choice-row`}>
        <span className={`${prefix}-choice-check`} aria-hidden="true">
            <CheckIcon checked={checked} />
        </span>
        <span className={`${prefix}-choice-file`} aria-hidden="true">
            <PageIcon />
        </span>
        <span className={`${prefix}-choice-meta`}>
            <span className={`${prefix}-choice-title`}>{post.title}</span>
            {post.slug ? <span className={`${prefix}-choice-slug`}>{post.slug}</span> : null}
        </span>
        {badge}
        {actions}
    </div>
);

/**
 * Shown when several rows are selected but the free version translates one at a
 * time. Suggests the row with the most work left and previews the rest as Pro.
 *
 * @since 1.6.0
 *
 * @param {Object}   props
 * @param {string}   props.prefix
 * @param {string[]} props.postIds
 * @param {Function} props.onDestory
 * @param {Function} props.onReasonChange
 * @param {Function} props.onTranslateSingle
 *
 * @return {JSX.Element} Suggestion screen.
 */
const BulkPageChoice = ({ prefix, postIds, onDestory, onReasonChange, onTranslateSingle }) => {
    const settings = atfp_bulk_translate_object;
    const postLabel = settings.post_label;
    const postSingular = settings.post_label_singular || postLabel;
    const { reason, candidate, others } = useMemo(() => resolveSelection(postIds), [postIds]);

    useEffect(() => {
        if ('multiple' !== reason) {
            onReasonChange(reason);
        }
    }, [reason]);

    if ('multiple' !== reason) {
        return null;
    }

    const selectedCount = postIds.length;
    const otherCount = others.length;
    const lockedPreview = others.slice(0, LOCKED_PREVIEW_LIMIT);
    const lockedRemaining = otherCount - lockedPreview.length;
    const upgradeUrl = `${settings.pro_version_url}?${settings.refrence_text}&utm_medium=inside&utm_campaign=get_pro&utm_content=bulk_multiple_posts`;
    const proBadge = <span className={`${prefix}-choice-pro-badge`}>{__('Pro', 'automatic-translations-for-polylang')}</span>;

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
                    {candidate && (
                        <>
                            <h3 className={`${prefix}-choice-heading`}>
                                {sprintf(
                                    /* translators: 1: position (always 1), 2: total selected, 3: singular post type label. */
                                    __('Translate %1$d of %2$d %3$s', 'automatic-translations-for-polylang'),
                                    1,
                                    selectedCount,
                                    postSingular.toLowerCase()
                                )}
                            </h3>
                            <div className={`${prefix}-choice-box`}>
                                <ChoiceRow
                                    prefix={prefix}
                                    post={candidate}
                                    checked
                                    actions={(
                                        <span className={`${prefix}-choice-inline-actions`}>
                                            <button
                                                type="button"
                                                className={`${prefix}-footer-button button button-primary`}
                                                onClick={() => onTranslateSingle(String(candidate.post_id))}
                                            >
                                                <span className={`${prefix}-choice-translate-icon`} aria-hidden="true">
                                                    <TranslateIcon />
                                                </span>
                                                {sprintf(
                                                    /* translators: %s: singular post type label. */
                                                    __('Translate This %s', 'automatic-translations-for-polylang'),
                                                    postSingular
                                                )}
                                            </button>
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
                                        </span>
                                    )}
                                />
                            </div>
                        </>
                    )}

                    <p className={`${prefix}-choice-help`}>
                        {createInterpolateElement(
                            __('AutoPoly Free allows you to translate <one>one page at a time.</one> Continue with a single untranslated page, or go back and choose another pages.', 'automatic-translations-for-polylang'),
                            { one: <strong /> }
                        )}
                    </p>

                    {otherCount > 0 && (
                        <>
                            <div className={`${prefix}-choice-locked-heading`}>
                                <h3 className={`${prefix}-choice-heading`}>
                                    {sprintf(
                                        /* translators: 1: number of remaining selected items, 2: post type label. */
                                        __('Bulk Translate All %1$d %2$s (Pro)', 'automatic-translations-for-polylang'),
                                        otherCount,
                                        postLabel
                                    )}
                                </h3>
                            </div>
                            <div className={`${prefix}-choice-locked`}>
                                <div className={`${prefix}-choice-locked-list`}>
                                    {lockedPreview.map((post) => (
                                        <ChoiceRow
                                            key={post.post_id}
                                            prefix={prefix}
                                            post={post}
                                            checked
                                            badge={proBadge}
                                        />
                                    ))}
                                    {lockedRemaining > 0 && (
                                        <a
                                            className={`${prefix}-choice-locked-more`}
                                            href={upgradeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {sprintf(
                                                /* translators: 1: number of additional selected items not shown, 2: post type label. */
                                                __('+ %1$d more %2$s', 'automatic-translations-for-polylang'),
                                                lockedRemaining,
                                                postLabel
                                            )}
                                            <span aria-hidden="true">&#9662;</span>
                                        </a>
                                    )}
                                </div>
                                <div className={`${prefix}-choice-locked-upsell`}>
                                    <span className={`${prefix}-choice-crown`} aria-hidden="true">
                                        <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.5 16.5L1.5 4.5l6.5 5L13 2l5 7.5 6.5-5-2 12H3.5z" fill="#f5b301" />
                                            <path d="M13 2l1.1 2.2L16.5 5l-2.4.8L13 8l-1.1-2.2L9.5 5l2.4-.8L13 2z" fill="#ffe08a" />
                                            <path d="M3.5 16.5h19v3.2c0 .4-.3.8-.8.8H4.3c-.5 0-.8-.4-.8-.8v-3.2z" fill="#e29c02" />
                                        </svg>
                                    </span>
                                    <strong>
                                        {sprintf(
                                            /* translators: 1: total selected items, 2: post type label. */
                                            __('Translate All %1$d %2$s', 'automatic-translations-for-polylang'),
                                            selectedCount,
                                            postLabel
                                        )}
                                        {proBadge}
                                    </strong>
                                    <a
                                        className={`${prefix}-choice-upsell-button`}
                                        href={upgradeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {__('Upgrade for Bulk Translation', 'automatic-translations-for-polylang')}
                                        <span aria-hidden="true"><ExternalIcon /></span>
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </div>


            </div>
        </div>
    );
}

export default BulkPageChoice;
