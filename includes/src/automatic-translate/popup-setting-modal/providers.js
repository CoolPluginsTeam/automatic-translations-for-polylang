import TranslateService from "../component/translate-provider";
import { __, sprintf } from "@wordpress/i18n";
import ChromeLocalAiTranslator from "../component/translate-provider/local-ai-translator/local-ai-translator";

const Providers = (props) => {
  const service = props.Service;
  const buttonDisable = props[service + "Disabled"];

  const ActiveService = TranslateService({ Service: service, [service + "ButtonDisabled"]: buttonDisable, openErrorModalHandler: props.openErrorModalHandler });
  const activeProvider = props.activeProvider

  const isSelected = activeProvider === service;
  const isDisabled = ActiveService.ButtonDisabled || buttonDisable;
  const browserType = ChromeLocalAiTranslator.getBrowserType(); 

  let classNames='atfp-provider-card';
  if(isDisabled){
    classNames += ' atfp-provider-card-disabled';
  }
  if(isSelected){
    classNames += ' atfp-provider-card-selected';
  }

  if(['localAiTranslator','edgeAiTranslator'].includes(service) && browserType === 'Other'){
    classNames += ' atfp-provider-browser-other';
  }

  const handleCardClick = () => {
    if(isDisabled && 'localAiTranslator' === service) {
      props.openErrorModalHandler("localAiTranslator");
      return;
    }
    if (!isDisabled && props.onSelectProvider) {
      props.onSelectProvider(service);
    }
  };

  return (
    <div
            className={classNames}
            data-service={service}
            onClick={handleCardClick}
            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !isDisabled) { e.preventDefault(); handleCardClick(); } }}
            role="button"
            tabIndex={isDisabled && 'localAiTranslator' !== service ? -1 : 0}
            aria-pressed={isSelected}
            id={`atfp-provider-card-${service}`}
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

