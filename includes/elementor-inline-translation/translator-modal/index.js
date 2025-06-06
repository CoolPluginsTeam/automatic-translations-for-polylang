import TranslatorModal from '../../inline-translate-modal/modal';


const ElementorWidgetTranslator = (props) => {
  const value = props.getControlValue();
  const activePageLanguage = window.atfpElementorInlineTranslation?.pageLanguage || 'en';

  const onUpdateHandler = (value) => {
    props.activeController(value);
  }

  return <TranslatorModal modalOpen={true} value={value} onUpdate={onUpdateHandler} pageLanguage={activePageLanguage} />
}

export default ElementorWidgetTranslator;