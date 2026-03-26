import TranslateService from "../component/translate-provider";
import { __, sprintf } from "@wordpress/i18n";

const Providers = (props) => {
  const service = props.Service;
  const buttonDisable = props[service + "Disabled"];

  const ActiveService = TranslateService({ Service: service, [service + "ButtonDisabled"]: buttonDisable, openErrorModalHandler: props.openErrorModalHandler });
  const activeProvider = props.activeProvider

  const isSelected = activeProvider === service;
  const isDisabled = ActiveService.ButtonDisabled || buttonDisable;
  const handleCardClick = () => {
    if (!isDisabled && props.onSelectProvider) {
      props.onSelectProvider(service);
    }
  };

  return (
    <div
            className={`atfp-provider-card ${isDisabled ? `atfp-provider-card-disabled` : ""} ${isSelected ? `atfp-provider-card-selected` : ""}`}
            data-service={service}
            onClick={handleCardClick}
            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !isDisabled) { e.preventDefault(); handleCardClick(); } }}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-pressed={isSelected}
        >
            <div className='atfp-provider-card-body'>
            <span className='atfp-provider-card-icon' aria-hidden="true">
                <img src={`${props.imgFolder}${ActiveService.Logo}`} alt="" />
            </span>
            <span className='atfp-provider-card-name'>{ActiveService.title}</span>
            <span className='atfp-provider-card-check' aria-hidden="true" />
            </div>
            <div className='atfp-provider-card-actions'>
                <a href={ActiveService.Docs} target="_blank" rel="noopener noreferrer" className='atfp-provider-card-docs' title={sprintf(__("View %s Documentation", "automatic-translations-for-polylang"), ActiveService.serviceLabel)} onClick={(e) => e.stopPropagation()}>
                    {__('Docs', 'automatic-translations-for-polylang')}
                </a>
                {isDisabled && (
                    <div className='atfp-provider-card-error'>{ActiveService.ErrorMessage}</div>
                )}
            </div>
        </div>
  );
}

export default Providers;

