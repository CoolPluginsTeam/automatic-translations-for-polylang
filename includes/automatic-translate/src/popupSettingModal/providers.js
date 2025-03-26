
const Providers = ({ Title, Logo, ButtonText, Service, ServiceLabel, ButtonAction, ButtonDisabled = false, BetaEnabled = false, Docs = false, ProviderLink = false, ErrorMessage = <></> }) => {

    const serviceId = Service.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const btnId = `atfp-${serviceId}-btn`;

    return (
        <div id={`atfp-${serviceId}-column`} className="atfp-translator-column">
            <div className="atfp-translator-header">
                {Docs &&
                    <a href={Docs} target="_blank"><svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.17607 6.20533H6.82393V5.53867H2.17607V6.20533ZM2.17607 8.05133H6.82393V7.38467H2.17607V8.05133ZM2.17607 9.898H4.89536V9.23133H2.17607V9.898ZM1.03821 12C0.7425 12 0.495643 11.8973 0.297643 11.692C0.0996427 11.4867 0.000428571 11.2304 0 10.9233V1.07667C0 0.77 0.0992142 0.514 0.297643 0.308667C0.496071 0.103333 0.743143 0.000444444 1.03886 0H6.10714L9 3V10.9233C9 11.23 8.901 11.4862 8.703 11.692C8.505 11.8978 8.25771 12.0004 7.96114 12H1.03821ZM5.78571 3.33333V0.666667H1.03886C0.939857 0.666667 0.849 0.709333 0.766286 0.794666C0.683571 0.88 0.642429 0.974 0.642857 1.07667V10.9233C0.642857 11.0256 0.684 11.1196 0.766286 11.2053C0.848571 11.2911 0.939214 11.3338 1.03821 11.3333H7.96179C8.06036 11.3333 8.151 11.2907 8.23371 11.2053C8.31643 11.12 8.35757 11.0258 8.35714 10.9227V3.33333H5.78571Z" fill="#6F6F6F" />
                    </svg></a>
                }
                {ProviderLink &&
                    <a href={ProviderLink} target="_blank"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.32545 10.0687C5.12822 9.90719 5.10017 9.62531 5.2617 9.42808L10.4537 3.08853C10.6153 2.89129 10.8972 2.86324 11.0944 3.02477C11.2916 3.18631 11.3197 3.46819 11.1581 3.66542L5.96609 10.005C5.80456 10.2022 5.52268 10.2303 5.32545 10.0687Z" fill="#6F6F6F" />
                        <path d="M11.5398 7.50929C11.4931 7.47202 11.4548 7.42541 11.4272 7.37243C11.3997 7.31946 11.3835 7.26131 11.3798 7.20172L10.9781 3.16566L6.94209 3.56729C6.68583 3.59279 6.46747 3.41395 6.44197 3.1577C6.41647 2.90144 6.5953 2.68308 6.85156 2.65758L11.3361 2.21132C11.5923 2.18582 11.8107 2.36466 11.8362 2.62091L12.2824 7.10542C12.3079 7.36168 12.1291 7.58004 11.8729 7.60554C11.7447 7.61829 11.6243 7.57852 11.5398 7.50929Z" fill="#6F6F6F" />
                        <path d="M5.9026 4.89502H2.82096C1.81527 4.89502 1 5.71029 1 6.71598V12.1789C1 13.1846 1.81527 13.9998 2.82096 13.9998H8.28386C9.28955 13.9998 10.1048 13.1846 10.1048 12.1789V8.04669" stroke="#6F6F6F" strokeWidth="0.910482" />
                    </svg>
                    </a>
                }
            </div>
            <div className="atfp-translator-body">
                <strong>{Title}</strong><br />
                <a href={ProviderLink} target="_blank"><img src={Logo} alt={Title} /></a>
                <div className="atfp-translator-btn-wrapper">
                    {ButtonDisabled ?
                        <button disabled={ButtonDisabled} className="atfp-translator-service-btn" id={btnId}>{ButtonText}</button> :
                        <button id={btnId} onClick={ButtonAction} className="atfp-service-btn" data-service={Service} data-service-label={ServiceLabel}>{ButtonText}</button>}
                    {BetaEnabled && <span className="atfp-translator-beta-btn">Beta</span>}
                </div>
            </div>
            <div className="atfp-translator-footer">
                {ErrorMessage && ErrorMessage}
            </div>
        </div>
    );
}

export default Providers;

