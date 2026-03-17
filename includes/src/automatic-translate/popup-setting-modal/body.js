import { sprintf, __ } from "@wordpress/i18n";
import Providers from "./providers";
import TranslateService from "../component/translate-provider";

const SettingModalBody = (props) => {
    const ServiceProviders = TranslateService();

    return (
        <div className="atfp-setting-modal-body">
            <div className="atfp-provider-cards">
                {Object.keys(ServiceProviders).map((provider) => (
                    <Providers
                        key={provider}
                        {...props}
                        Service={provider}
                    />
                ))}
            </div>
        </div>
    );
}

export default SettingModalBody;
