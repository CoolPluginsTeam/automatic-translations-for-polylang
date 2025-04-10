import { useEffect, useState } from "react";
import FilterTargetContent from "../component/FilterTargetContent";
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import TranslateService from "../component/TranslateProvider";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const StringPopUpBody = (props) => {

    const { service: service } = props;
    const translateContent = select("block-atfp/translate").getTranslationEntry();
    const StringModalBodyNotice = props.stringModalBodyNotice;
    const [onDestroy, setOnDestroy] = useState([]);

    const updateDestroyHandler = (callback) => {
        setOnDestroy(prev => [...prev, callback]);
    }

    useEffect(() => {
        return () => {
            if (onDestroy.length > 0) {
                onDestroy.forEach(callback => {
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
        }
    }, [onDestroy]);

    useEffect(() => {

        if (props.service === 'yandex') {
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
            ServiceSetting.Provider({ sourceLang: props.sourceLang, targetLang: props.targetLang, translateStatusHandler: props.translateStatusHandler, ID: id, translateStatus: props.translateStatus, modalRenderId: props.modalRender, destroyUpdateHandler: updateDestroyHandler });
        }
    }, [props.modalRender, props.postDataFetchStatus]);

    return (
        <div className="modal-body">
            {translateContent.length > 0 && props.postDataFetchStatus ?
                <>
                    {StringModalBodyNotice && <div className="atfp-body-notice-wrapper"><StringModalBodyNotice /></div>}
                    <div className="atfp_translate_progress" key={props.modalRender}>{__("Automatic translation is in progress....", 'automatic-translations-for-polylang')}<br />{__("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translations-for-polylang')}<br /><br />{__("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translations-for-polylang')}</div>
                    <div className={`translator-widget ${service}`} style={{ display: `${['localAiTranslator', 'ai_modal'].includes(props.service) ? 'flex' : 'block'}` }}>
                        <h3 className="choose-lang">{TranslateService({ Service: props.service }).heading} <span className="dashicons-before dashicons-translation"></span></h3>

                        <div className={`atfp_translate_element_wrapper ${props.translateStatus ? 'translate-completed' : ''}`}>
                            <div id={`atfp_${props.service}_translate_element`}></div>
                        </div>
                    </div>

                    <div className="atfp_string_container">
                        <table className="scrolldown" id="stringTemplate">
                            <thead>
                                <tr>
                                    <th className="notranslate">{__("S.No", 'automatic-translations-for-polylang')}</th>
                                    <th className="notranslate">{__("Source Text", 'automatic-translations-for-polylang')}</th>
                                    <th className="notranslate">{__("Translation", 'automatic-translations-for-polylang')}</th>
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
                                                                    <td className="translate" data-translate-status="translated" data-key={data.id} data-string-type={data.type}>{data.translatedData[props.service]}</td> :
                                                                    <td className="translate" translate="yes" data-key={data.id} data-string-type={data.type}>
                                                                        <FilterTargetContent service={props.service} content={data.source} totalString={350} currentIndex={index + 1} contentKey={data.id} />
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
                    <p>{__('No strings are available for translation', 'automatic-translations-for-polylang')}</p> :

                    <Skeleton
                        count={1}
                        height='150px'
                        width="100%"
                        className="react-loading-skeleton-atfp"
                    />
            }
        </div>
    );
}

export default StringPopUpBody;
