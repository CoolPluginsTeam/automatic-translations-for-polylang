import { sprintf, __ } from "@wordpress/i18n";
import Providers from "./providers";
import TranslateService from "../component/TranslateProvider";

const SettingModalBody = (props) => {
    const { targetLangName, postType, sourceLangName } = props;
    const ServiceProviders=TranslateService();

    return (
        <div className="atfp-setting-modal-body">
            <div className="atfp-setting-modal-notice-wrapper">
                <h4>{sprintf(__("Translate %(postType)s content from %(source)s to %(target)s", 'automatic-translations-for-polylang'), { postType: postType, source: sourceLangName, target: targetLangName })}</h4>
                <p className="atfp-error-message" style={{ marginBottom: '.5rem' }}>{sprintf(__("This translation will replace the current %(postType)s content with the original %(source)s version and translate it to %(target)s.", 'automatic-translations-for-polylang'), { postType: postType, source: sourceLangName, target: targetLangName })}</p>
            </div>
            <div className="atfp-translator-row">
                {Object.keys(ServiceProviders).map((provider) => (
                    <Providers key={provider} {...props} Service={provider}/>
                ))}
            </div>
        </div>
    );
}

export default SettingModalBody;
