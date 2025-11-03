import { __ } from '@wordpress/i18n';
import ElementorWidgetTranslator from './translator-modal';
import ReactDom from 'react-dom/client';
import { RiTranslateAi2 } from "react-icons/ri";
import styles from './style.modules.css';

export default class ElementorTranslator extends Marionette.Behavior {

    initialize() {
        this.type = 'text';
        this.controlType = 'text';
        this.buttonLabel = 'Ai Translator';
        this.controlLabel = 'Title';
        this.isLabelBlock = false;
        this.additionalOptions = {};
        this.context = {};

        this.pluginPrefix = this.getOption('pluginPrefix');
    }

    ui() {
        return {
            translatorWrapper: `.atfp-et-translator-wrapper`,
        };
    }

    events() {
        return {
            'click @ui.translatorWrapper': 'onTranslatorWrapperClick',
        };
    }

    onTranslatorWrapperClick(event) {
        event.stopPropagation();

        this.rootElement = document.createElement('div');
        document.body.append(this.rootElement);

        const root = ReactDom.createRoot(this.rootElement);

        root.render(<ElementorWidgetTranslator activeController={this.getOption('setControlValue')} pluginPrefix={this.pluginPrefix} onCloseHandler={() => { this.modalCloseHandler() }} getControlValue={this.getOption('getControlValue')}/>);

        this.root = root;
    }

    modalCloseHandler() {
        this.rootElement.remove()
        this.root.unmount();
    }

    onRender() {
        const buttonLabel = this.getOption('buttonLabel');

        const $button=jQuery(`<div class="atfp-et-translator-wrapper ${styles.atfpEtTranslatorWrapper}">`);

        let iconElement = document.createElement('div');
        iconElement.className=styles.atfpEtTranslatorContainer;
        iconElement.title="Chrome built-in translator AI";
        ReactDom.createRoot(iconElement).render(<RiTranslateAi2 className={styles.atfpEtTranslatorIcon} />);
        $button.html(iconElement);

        iconElement=null;

        if (this.getOption('isLabelBlock')) {
            $button.append(' ' + buttonLabel);
        } else {
            $button.tipsy({
                gravity: 's',
                title() {
                    return buttonLabel;
                },
            });
        }

        let $wrap = this.$el.find('.elementor-control-responsive-switchers');
        if (!$wrap.length) {
            $wrap = this.$el.find('.elementor-control-title');
        }

        $wrap.after(
            $button,
        );
    }
}