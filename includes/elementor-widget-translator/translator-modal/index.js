import TranslatorModal from '../../common/AiTranslator/modal';


const ElementorWidgetTranslator = (props) => {
  const value = props.getControlValue();
  const activePageLanguage = window.atfpElementorWidgetTranslator?.pageLanguage || 'en';

  const onUpdateHandler = (value) => {
    props.activeController(value);
  }

  return <TranslatorModal modalOpen={true} value={value} onUpdate={onUpdateHandler} pageLanguage={activePageLanguage} />
}

export default ElementorWidgetTranslator;