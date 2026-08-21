import TranslateService from "../components/translate-provider";
import { __, sprintf } from "@wordpress/i18n";
import LocalAiTranslator from "../components/translate-provider/local-ai/local-ai-translate";

const Providers = (props) => {
  const service = props.Service;
  const prefix = props.prefix;
  const activeProvider = props.activeProvider;

  const buttonDisable = props[service + "Disabled"];

  const ActiveService = TranslateService({ Service: service, [service + "ButtonDisabled"]: buttonDisable, openErrorModalHandler: props.openErrorModalHandler, prefix });

  const isSelected = activeProvider === service;
  const isDisabled = ActiveService.ButtonDisabled || buttonDisable;
  const browserType = LocalAiTranslator.getBrowserType();

  // A disabled card is still actionable when it has an error to show.
  const errorToShow = {
    localAiTranslator: props.localAiModalError,
    edgeAiTranslator: props.edgeAiModalError,
    yandex: props.yandexDisabled,
    google: props.googleDisabled,
  }[service];
  const isActionable = isDisabled ? Boolean(errorToShow) : true;

  let classNames = `${prefix}-provider-card`;
  if (isDisabled) {
    classNames += ` ${prefix}-provider-card-disabled`;
  }
  if (isSelected) {
    classNames += ` ${prefix}-provider-card-selected`;
  }
  if (['localAiTranslator', 'edgeAiTranslator'].includes(service) && browserType === 'Other') {
    classNames += ` ${prefix}-provider-browser-other`;
  }

  const handleCardClick = () => {
    if (isDisabled) {
      if (errorToShow) {
        props.openErrorModalHandler(errorToShow);
      }
      return;
    }

    if (props.onSelectProvider) {
      props.onSelectProvider(service);
    }
  };

  return (
    <div
            className={classNames}
            data-service={service}
            onClick={handleCardClick}
            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && isActionable) { e.preventDefault(); handleCardClick(); } }}
            role="button"
            tabIndex={isActionable ? 0 : -1}
            aria-pressed={isSelected}
            id={`${prefix}-provider-card-${service}`}
        >
            <div className={`${prefix}-provider-card-body`}>
            <span className={`${prefix}-provider-card-icon`} aria-hidden="true">
                <img src={`${props.imgFolder}${ActiveService.Logo}`} alt="" />
            </span>
            <span className={`${prefix}-provider-card-name`}>{ActiveService.title}</span>
            <span className={`${prefix}-provider-card-check`} aria-hidden="true" />
            </div>
            <div className={`${prefix}-provider-card-actions`}>
                <a href={ActiveService.Docs} target="_blank" rel="noopener noreferrer" className={`${prefix}-provider-card-docs`} title={sprintf(__("View %s Documentation", "automatic-translations-for-polylang"), ActiveService.serviceLabel)} onClick={(e) => e.stopPropagation()}>
                    {__('Docs', 'automatic-translations-for-polylang')}
                </a>
                {isDisabled && (
                    <div className={`${prefix}-provider-card-error`}>{ActiveService.ErrorMessage}</div>
                )}
            </div>
        </div>
  );
}

export default Providers;
