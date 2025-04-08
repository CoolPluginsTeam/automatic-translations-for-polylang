import ElementorTranslator from "./elementor-translator-button";

export default class ControlBase extends elementorModules.editor.utils.Module {
    constructor(prefix) {
        super();

        this.pluginPrefix = prefix;
    }
    onElementorInit() {
        elementor.hooks.addFilter('controls/base/behaviors', this.addControlBehavior.bind(this));
    }

    addControlBehavior(behaviors, view) {
        const controlType = view.options.model.get('type');
        const aiConfig = view.options.model.get( 'ai' );

        if (!aiConfig?.active) {
            return behaviors;
        }

        if (['text', 'textarea'].includes(aiConfig.type)) {

            behaviors.atfpElementorWidgetTranslator = {
                behaviorClass: ElementorTranslator,
                pluginPrefix: this.pluginPrefix,
                controlType,
                setControlValue: (value) => {

                    if ('wysiwyg' === controlType) {
                        value = value.replaceAll('\n', '<br>');
                    }

                    view.setSettingsModel(value);
                    view.applySavedValue();
                },
                getControlValue: view.getControlValue.bind(view),
                isLabelBlock: view.options.model.get('label_block'),
                controlLabel: view.options.model.get('label')
            };
        }

        return behaviors;
    }
};