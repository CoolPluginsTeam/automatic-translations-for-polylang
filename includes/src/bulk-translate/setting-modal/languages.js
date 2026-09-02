import { __ } from "@wordpress/i18n";

/**
 * Language selection column of the translation setup screen.
 *
 * Renders the target language checkboxes together with the select-all toggle.
 * All values are rendered through React, so language names and flag paths
 * coming from the localized script object are escaped by default.
 *
 * @since 1.1.0
 *
 * @param {Object}   props                      Component props.
 * @param {string}   props.prefix               CSS class prefix.
 * @param {Object}   props.targetLanguages      Available target languages keyed by language slug.
 * @param {string[]} props.selectedLanguages    Slugs of the currently selected languages.
 * @param {Function} props.onLanguageChange     Callback for a single language checkbox change.
 * @param {Function} props.onSelectAllLanguages Callback for the select-all checkbox change.
 * @param {*}        props.notice               Optional notice rendered above the language list.
 * @param {boolean}  props.disabled             Whether the language inputs are disabled.
 * @param {string}   props.disabledReason       Tooltip shown while the inputs are disabled.
 *
 * @return {JSX.Element} Language selection column.
 */
const SettingModalLanguages = ({
    prefix,
    targetLanguages = {},
    selectedLanguages = [],
    onLanguageChange,
    onSelectAllLanguages,
    notice = null,
    disabled = false,
    disabledReason = '',
}) => {
    const languageSlugs = Object.keys(targetLanguages);
    const allSelected = languageSlugs.length > 0 && selectedLanguages.length === languageSlugs.length;
    const selectAllId = `${prefix}-select-all-languages`;

    return (
        <section className={`${prefix}-setup-column ${prefix}-setup-languages`}>
            <div className={`${prefix}-setup-column-head`}>
                <span className={`${prefix}-setup-step-badge`} aria-hidden="true">1</span>
                <h3>{__('Select Languages', 'automatic-translations-for-polylang')}</h3>
            </div>
            <p className={`${prefix}-setup-column-desc`}>
                {__('Choose the languages you want to translate your content into.', 'automatic-translations-for-polylang')}
            </p>

            {notice}

            <div className={`${prefix}-select-all-languages${allSelected ? ' all-languages-selected' : ''}`}>
                <label htmlFor={selectAllId}>
                    <div className={`${prefix}-select-all-languages-inner`}>
                        <input
                            type="checkbox"
                            name="select-all-languages"
                            id={selectAllId}
                            onChange={onSelectAllLanguages}
                            disabled={disabled}
                            checked={allSelected}
                        />
                        <span className={`${prefix}-select-all-languages-check-visual`} aria-hidden="true"></span>
                        <span className={`${prefix}-language-label`}>
                            {allSelected
                                ? __('Unselect All', 'automatic-translations-for-polylang')
                                : __('Select All', 'automatic-translations-for-polylang')}
                        </span>
                    </div>
                </label>
            </div>

            <div className={`${prefix}-languages`}>
                {languageSlugs.map((slug) => {
                    const language = targetLanguages[slug];
                    const inputId = `${prefix}-language-${slug}`;
                    const isSelected = selectedLanguages.includes(slug);

                    return (
                        <label
                            htmlFor={inputId}
                            key={slug}
                            className={`${prefix}-language${isSelected ? ' language-selected' : ''}`}
                        >
                            <div
                                className={`${prefix}-language-item`}
                                title={disabled ? disabledReason : language.name}
                            >
                                <input
                                    type="checkbox"
                                    name="languages"
                                    id={inputId}
                                    value={slug}
                                    onChange={onLanguageChange}
                                    disabled={disabled}
                                    checked={isSelected}
                                />
                                <span className={`${prefix}-language-check-visual`} aria-hidden="true"></span>
                                <span className={`${prefix}-language-label`} title={language.name}>
                                    <img src={language.flag} alt="" aria-hidden="true" />
                                    &nbsp;{language.name}
                                </span>
                            </div>
                        </label>
                    );
                })}
            </div>

        </section>
    );
}

export default SettingModalLanguages;
