import ControlBase from './control-base';

const App = () => {
    const prefix = 'atfpElementorInlineTranslation';
    return new ControlBase(prefix);
}

jQuery(window).on('elementor:loaded', function () {
    App();
})