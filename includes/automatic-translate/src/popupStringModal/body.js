import { useEffect, useState } from "react";
import FilterTargetContent from "../component/FilterTargetContent";
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import TranslateService from "../component/TranslateProvider";

const StringPopUpBody = (props) => {

    const { service: service } = props;
    const translateContent = select("block-atfp/translate").getTranslationEntry();
    const StringModalBodyNotice = props.stringModalBodyNotice;

    useEffect(() => {

        if (['yandex'].includes(props.service)) {
            document.documentElement.setAttribute('translate', 'no');
            document.body.classList.add('notranslate');
        }

        /**
         * Calls the translate service provider based on the service type.
         * For example, it can call services like yandex Translate.
        */
        const service = props.service;
        const id = `atfp_${service}_translate_element`;

        const translateContent = wp.data.select('block-atfp/translate').getTranslationEntry();

        if (translateContent.length > 0 && props.postDataFetchStatus) {
            const ServiceSetting = TranslateService({ Service: service });
            ServiceSetting.Provider({ sourceLang: props.sourceLang, targetLang: props.targetLang, translateStatusHandler: props.translateStatusHandler, ID: id, translateStatus: props.translateStatus, modalRenderId: props.modalRender, destroyUpdateHandler: props.updateDestroyHandler });
        }
    }, [props.modalRender, props.postDataFetchStatus]);

    return (
        <div className="modal-body">
            {translateContent.length > 0 && props.postDataFetchStatus ?
                <>
                    {StringModalBodyNotice && <div className="atfp-body-notice-wrapper"><StringModalBodyNotice /></div>}
                    <div className="atfp_translate_progress" key={props.modalRender}>{__("Automatic translation is in progress....", 'autopoly-ai-translation-for-polylang')}<br />{__("It will take few minutes, enjoy ☕ coffee in this time!", 'autopoly-ai-translation-for-polylang')}<br /><br />{__("Please do not leave this window or browser tab while translation is in progress...", 'autopoly-ai-translation-for-polylang')}</div>
                    <div className={`translator-widget ${service}`} style={{ display: 'flex' }}>
                        <h3 className="choose-lang">{TranslateService({ Service: props.service }).heading} <span className="dashicons-before dashicons-translation"></span></h3>

                        <div className={`atfp_translate_element_wrapper ${props.translateStatus ? 'translate-completed' : ''}`}>
                            <div id={`atfp_${props.service}_translate_element`}></div>
                        </div>
                    </div>

                    <div className="atfp_string_container">
                        <table className="scrolldown" id="stringTemplate">
                            <thead>
                                <tr>
                                    <th className="notranslate">{__("S.No", 'autopoly-ai-translation-for-polylang')}</th>
                                    <th className="notranslate">{__("Source Text", 'autopoly-ai-translation-for-polylang')}</th>
                                    <th className="notranslate">{__("Translation", 'autopoly-ai-translation-for-polylang')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.postDataFetchStatus &&
                                    <>
                                        {translateContent.map((data, index) => {
                                            return (
                                                <Fragment key={index + props.translatePendingStatus}>
                                                    {undefined !== data.source && data.source.trim() !== '' &&
                                                        <>
                                                            <tr key={index + 'tr' + props.translatePendingStatus}>
                                                                <td>{index + 1}</td>
                                                                <td data-source="source_text">{data.source}</td>
                                                                {!props.translatePendingStatus ?
                                                                    <td className="translate" data-translate-status="translated" data-key={data.id}data-string-type={data.type}>{data.translatedData[props.service]}</td> :
                                                                    <td className="translate" translate="yes" data-key={data.id} data-string-type={data.type}>
                                                                        <FilterTargetContent service={props.service} content={data.source} contentKey={data.id} />
                                                                    </td>
                                                                }
                                                            </tr>
                                                        </>
                                                    }
                                                </Fragment>
                                            );
                                        })
                                        }
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>
                </> :
                props.postDataFetchStatus ?
                    <p>{__('No strings are available for translation', 'autopoly-ai-translation-for-polylang')}</p> :

                    <div className="atfp-skeleton-loader-wrapper">
                        <div className="translate-widget">
                            <div className="atfp-skeleton-loader-mini"></div>
                            <div className="atfp-skeleton-loader-mini"></div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th className="notranslate">{__("S.No", 'autopoly-ai-translation-for-polylang')}</th>
                                    <th className="notranslate">{__("Source Text", 'autopoly-ai-translation-for-polylang')}</th>
                                    <th className="notranslate">{__("Translation", 'autopoly-ai-translation-for-polylang')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(10)].map((_, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><div className="atfp-skeleton-loader-mini"></div></td>
                                            <td><div className="atfp-skeleton-loader-mini"></div></td>
                                            <td><div className="atfp-skeleton-loader-mini"></div></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
            }
        </div>
    );
}

export default StringPopUpBody;
