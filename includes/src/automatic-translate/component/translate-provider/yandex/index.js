import ModalStringScroll from "../../string-modal-scroll";

const yandexWidget = (win, doc, nav, params, namespace, targetLang, translateStatusHandler, modalRenderId) => {
    'use strict';

    var util = {
        keycode: {
            ESCAPE: 27
        },
        getRequest: function () {
            if (win.XDomainRequest) {
                return new win.XDomainRequest();
            }
            if (win.XMLHttpRequest) {
                return new win.XMLHttpRequest();
            }
            return null;
        },
        loadScript: function (src, parent, callback) {
            var script = doc.createElement('script');
            script.src = src;

            script.addEventListener('load', function onLoad() {
                this.removeEventListener('load', onLoad, false);
                callback();
            }, false);

            parent.appendChild(script);
        },
        loadResource: function (url, callback) {
            var request = this.getRequest();

            if (!request) {
                return null;
            }

            request.onload = function () {
                callback(this.responseText);
            };
            request.open('GET', url, true);

            win.setTimeout(function () {
                request.send();
            }, 0);

            return request;
        },
        getStyleList: function (element) {
            var value = element.getAttribute('class');
            if (!value) {
                return [];
            }
            return value.replace(/\s+/g, ' ').trim().split(' ');
        },
        hasStyleName: function (element, name) {
            var list = this.getStyleList(element);
            return !!list.length && list.indexOf(name) >= 0;
        },
        addStyleName: function (element, name) {
            var list = this.getStyleList(element);
            list.push(name);
            element.setAttribute('class', list.join(' '));
        },
        removeStyleName: function (element, name) {
            var list = this.getStyleList(element),
                index = list.indexOf(name);
            if (index >= 0) {
                list.splice(index, 1);
                element.setAttribute('class', list.join(' '));
            }
        },
        isSupportedBrowser: function () {
            return 'localStorage' in win &&
                'querySelector' in doc &&
                'addEventListener' in win &&
                'getComputedStyle' in win && doc.compatMode === 'CSS1Compat';
        }
    };

    // Button
    var Button = function Button(element, contentElement) {
        var self = this;

        element.addEventListener('click', function (event) {
            self.onClick(event);
        }, false);

        this._element = element;
        this._contentElement = contentElement || this._element;
    };

    Button.prototype.onClick = function () { };

    Button.prototype.setText = function (text) {
        this._contentElement.textContent = text;
        return this;
    };

    // Select
    var Select = function Select(form, itemName) {
        var self = this;

        form.reset();

        form.addEventListener('click', function (event) {
            var target = event.target;
            if ('value' in target) {
                self.onSelect(target.value);
            }
        }, false);

        form.addEventListener('change', function (event) {
            alert("form change state");
            var target = event.target;
            if (target.checked) {
                self.onChange(target.value);
            }
        }, false);

        this._form = form;
        this._itemName = itemName;
    };

    Select.prototype.onSelect = function () { };

    Select.prototype.onChange = function () { };

    Select.prototype.isHidden = function () {
        return this._form.hasAttribute('hidden');
    };

    Select.prototype.getItems = function () {
        return this._form[this._itemName] || [];
    };

    Select.prototype.getValue = function () {
        var i, n, items = this.getItems();
        for (i = 0, n = items.length; i < n; i++) {
            if (items[i].checked) {
                return items[i].value;
            }
        }
        return '';
    };

    Select.prototype.setValue = function (value) {
        var i, n, items = this.getItems();
        if (value === this.getValue()) {
            return this;
        }
        for (i = 0, n = items.length; i < n; i++) {
            if (items[i].value === value) {
                items[i].checked = true;
                this.onChange(value);
                break;
            }
        }
        return this;
    };

    Select.prototype.setHidden = function (hidden) {
        hidden = !!hidden;
        if (hidden !== this.isHidden()) {
            this._form[(hidden ? 'set' : 'remove') + 'Attribute']('hidden', '');
            this.onHiddenChange(hidden);
        }
        return this;
    };

    Select.prototype.onHiddenChange = function () { };

    // Widget
    var Widget = function Widget(options) {
        var self = this,
            active,
            select = options.select,
            element = options.element,
            storage = options.storage,
            autoMode = options.autoMode,
            pageLang = options.pageLang,
            userLang = options.userLang,
            translator = options.translator,
            leftButton = options.leftButton,
            rightButton = options.rightButton,
            closeButton = options.closeButton,
            defaultLang;

        this._element = element;
        this._pageLang = pageLang;
        this._translator = translator;

        this.onStateChange = function (name, enable) {
            if (name === 'active') {
                storage.setValue('active', enable);
            }
        };

        select.onSelect = function (lang) {
            this.setHidden(true);
            self.translate(lang);
            ModalStringScroll(translateStatusHandler,'yandex', modalRenderId);
        };

        select.onChange = function (lang) {
            storage.setValue('lang', lang);
            rightButton.setText(lang);
            self.setState('invalid', lang === pageLang);
        };

        select.onHiddenChange = function (hidden) {
            var docElem = doc.documentElement,
                formRect;
            self.setState('expanded', !hidden);
            if (!hidden) {
                self.setState('right', false)
                    .setState('bottom', false);
                element.focus();
                formRect = this._form.getBoundingClientRect();

                if (formRect.right + (win.pageXOffset || docElem.scrollLeft) + 1 >= Math.max(docElem.clientWidth, docElem.scrollWidth)) {
                    self.setState('right', true);
                }

                if (formRect.bottom + (win.pageYOffset || docElem.scrollTop) + 1 >= Math.max(docElem.clientHeight, docElem.scrollHeight)) {
                    self.setState('bottom', true);
                }
            }
        };

        element.addEventListener('blur', function () {
            select.setHidden(true);
        }, false);

        element.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case util.keycode.ESCAPE:
                    select.setHidden(true);
                    break;
            }
        }, false);

        translator.on('error', function () {
            this.abort();
            self.setState('busy', false)
                .setState('error', true);
        });

        translator.on('progress', function (progress) {
            switch (progress) {
                case 0:
                    self.setState('busy', true)
                        .setState('active', true);
                    break;

                case 100:
                    self.setState('done', true)
                        .setState('busy', false);
                    break;
            }
        });


        leftButton.onClick = function () {
            select.setHidden(true);
            self.translate(select.getValue());
            ModalStringScroll(translateStatusHandler,'yandex', modalRenderId);
        };

        rightButton.onClick = function () {
            if (self.hasState('active')) {
                translator.undo();
                self.setState('busy', false)
                    .setState('done', false)
                    .setState('error', false)
                    .setState('active', false);
            } else {
                select.setHidden(!select.isHidden());
            }
        };

        closeButton.onClick = function () {
            select.setHidden(true);
        };

        if (targetLang != undefined) {
            var defaultcode = targetLang;
        }
        switch (defaultcode) {
            case 'nb':
                defaultLang = 'no';
                break;

            case 'nn':
                defaultLang = 'no';
                break;
            default:
                defaultLang = defaultcode;
                break;
        }
        if (defaultLang) {
            select.setValue(defaultLang);
            active = storage.getValue('active');
        }
    };
    Widget.prototype.hasState = function (name) {
        return util.hasStyleName(this._element, 'yt-state_' + name);
    };

    Widget.prototype.setState = function (name, enable) {
        var hasState = this.hasState(name);
        enable = !!enable;
        if (enable === hasState) {
            return this;
        }
        util[(enable ? 'add' : 'remove') + 'StyleName'](
            this._element, 'yt-state_' + name
        );
        this.onStateChange(name, enable);
        return this;
    };

    Widget.prototype.translate = function (targetLang) {
        if (targetLang && !this.hasState('active')) {
            this._translator.translate(this._pageLang, targetLang);
        }
        return this;
    };

    Widget.prototype.onStateChange = function () { };

    // Storage
    var Storage = function Storage(name) {
        this._name = name;
        try {
            this._data = win.JSON.parse(win.localStorage[name]);
        } catch (error) {
            this._data = {};
        }
    };

    Storage.prototype.getValue = function (prop) {
        return this._data[prop];
    };

    Storage.prototype.setValue = function (prop, value) {
        this._data[prop] = value;
        try {
            win.localStorage[this._name] = win.JSON.stringify(this._data);
        } catch (error) { }
    };

    var wrapper = doc.getElementById(params.widgetId);

    if (!wrapper || !util.isSupportedBrowser()) {
        return;
    }
    var initWidget = function () {
        util.loadScript('https://yastatic.net/s3/translate/v21.4.7/js/tr_page.js', wrapper, function () {
            util.loadResource('https://translate.yandex.net/website-widget/v1/widget.html',
                function (responseText) {
                    var element;
                    if (!responseText) {
                        return;
                    }
                    wrapper.innerHTML = responseText;
                    element = wrapper.querySelector('.yt-widget');
                    if (params.widgetTheme) {
                        element.setAttribute('data-theme', params.widgetTheme);
                    }
                    new Widget({
                        select: new Select(element.querySelector('.yt-listbox'), 'yt-lang'),
                        element: element,
                        storage: new Storage('yt-widget'),
                        autoMode: params.autoMode === 'true',
                        pageLang: params.pageLang,
                        userLang: (nav.language || nav.userLanguage || '').split('-')[0],
                        translator: new namespace.PageTranslator({
                            srv: 'tr-url-widget',
                            url: 'https://translate.yandex.net/api/v1/tr.json/translate',
                            autoSync: true,
                            maxPortionLength: 600
                        }),
                        leftButton: new Button(element.querySelector('.yt-button_type_left')),
                        rightButton: new Button(
                            element.querySelector('.yt-button_type_right'),
                            element.querySelector('.yt-button_type_right > .yt-button__text')
                        ),
                        closeButton: new Button(element.querySelector('.yt-button_type_close'))
                    });
                }
            );
        });
    };
    if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
        initWidget();
    } else {
        doc.addEventListener('DOMContentLoaded', initWidget, false);
    }
};

const YandexTranslater = (props) => {
    const globalObj = window;
    yandexWidget(globalObj, globalObj.document, globalObj.navigator, { "pageLang": props.sourceLang, "autoMode": "false", "widgetId": "atfp_yandex_translate_element", "widgetTheme": "light" }, globalObj.yt = globalObj.yt || {}, props.targetLang, props.translateStatusHandler, props.modalRenderId);
}

export default YandexTranslater;