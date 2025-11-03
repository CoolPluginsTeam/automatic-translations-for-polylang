import { sprintf, __ } from "@wordpress/i18n";
import Providers from "./providers";
import TranslateService from "../component/translate-provider";

const SettingModalBody = (props) => {
    const ServiceProviders = TranslateService();

    return (
        <div className="atfp-setting-modal-body">
            <div className="atfp-setting-modal-notice-wrapper">
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Translate</th>
                        <th>Docs</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(ServiceProviders).map((provider) => (
                        <Providers
                            key={provider}
                            {...props}
                            Service={provider}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SettingModalBody;
