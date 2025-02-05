/**
 * Provides a lightweight HTML Editor component. Some toolbar features are not supported
 * by Safari and will be automatically hidden when needed. These are noted in the config options
 * where appropriate.
 *
 * The editor's toolbar buttons have tooltips defined in the {@link #buttonTips} property,
 * but they are not enabled by default unless the global {@link Ext.tip.QuickTipManager} singleton
 * is {@link Ext.tip.QuickTipManager#init initialized}.
 *
 * An Editor is a sensitive component that can't be used in all spots standard fields can be used.
 * Putting an Editor within any element that has display set to 'none' can cause problems in Safari
 * and Firefox due to their default iframe reloading bugs.
 *
 * # Example usage
 *
 * Simple example rendered with default options:
 *
 *     @example
 *     Ext.tip.QuickTipManager.init();  // enable tooltips
 *     Ext.create('Ext.form.HtmlEditor', {
 *         width: 580,
 *         height: 250,
 *         renderTo: Ext.getBody()
 *     });
 *
 * Passed via xtype into a container and with custom options:
 *
 *     @example
 *     Ext.tip.QuickTipManager.init();  // enable tooltips
 *     new Ext.panel.Panel({
 *         title: 'HTML Editor',
 *         renderTo: Ext.getBody(),
 *         width: 550,
 *         height: 250,
 *         frame: true,
 *         layout: 'fit',
 *         items: {
 *             xtype: 'htmleditor',
 *             enableColors: false,
 *             enableAlignments: false
 *         }
 *     });
 *     
 * # Reflow issues
 * 
 * In some browsers, a layout reflow will cause the underlying editor iframe to be reset. This
 * is most commonly seen when using the editor in collapsed panels with animation. In these cases
 * it is best to avoid animation.
 * More information can be found here: https://bugzilla.mozilla.org/show_bug.cgi?id=90268 
 */
Ext.define('Ext.form.field.HtmlEditor', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.htmleditor',
    alternateClassName: 'Ext.form.HtmlEditor',

    requires: [
        'Ext.tip.QuickTipManager',
        'Ext.picker.Color',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Item',
        'Ext.toolbar.Toolbar',
        'Ext.util.Format',
        'Ext.layout.component.field.HtmlEditor',
        'Ext.util.TaskManager',
        'Ext.layout.container.boxOverflow.Menu'
    ],

    mixins: {
        field: 'Ext.form.field.Field'
    },

    focusable: true,
    componentLayout: 'htmleditor',

    /**
     * @private
     */
    textareaCls: Ext.baseCSSPrefix + 'htmleditor-textarea',

    /* eslint-disable indent, max-len */
    componentTpl: [
        '{beforeTextAreaTpl}',
        '<textarea id="{id}-textareaEl" data-ref="textareaEl" name="{name}" tabindex="-1" {inputAttrTpl}',
                 ' class="{textareaCls}" autocomplete="off">',
            '{[Ext.util.Format.htmlEncode(values.value)]}',
        '</textarea>',
        '{afterTextAreaTpl}',
        '{beforeIFrameTpl}',
        '<iframe id="{id}-iframeEl" data-ref="iframeEl" name="{iframeName}" frameBorder="0" {iframeAttrTpl}',
               ' src="{iframeSrc}" class="{iframeCls}"></iframe>',
        '{afterIFrameTpl}',
        {
            disableFormats: true
        }
    ],
    /* eslint-enable indent, max-len */

    stretchInputElFixed: true,

    subTplInsertions: [
        /**
         * @cfg {String/Array/Ext.XTemplate} beforeTextAreaTpl
         * An optional string or `XTemplate` configuration to insert in the field markup
         * before the textarea element. If an `XTemplate` is used, the component's
         * {@link Ext.form.field.Base#getSubTplData subTpl data} serves as the context.
         */
        'beforeTextAreaTpl',

        /**
         * @cfg {String/Array/Ext.XTemplate} afterTextAreaTpl
         * An optional string or `XTemplate` configuration to insert in the field markup
         * after the textarea element. If an `XTemplate` is used, the component's
         * {@link Ext.form.field.Base#getSubTplData subTpl data} serves as the context.
         */
        'afterTextAreaTpl',

        /**
         * @cfg {String/Array/Ext.XTemplate} beforeIFrameTpl
         * An optional string or `XTemplate` configuration to insert in the field markup
         * before the iframe element. If an `XTemplate` is used, the component's
         * {@link Ext.form.field.Base#getSubTplData subTpl data} serves as the context.
         */
        'beforeIFrameTpl',

        /**
         * @cfg {String/Array/Ext.XTemplate} afterIFrameTpl
         * An optional string or `XTemplate` configuration to insert in the field markup
         * after the iframe element. If an `XTemplate` is used, the component's
         * {@link Ext.form.field.Base#getSubTplData subTpl data} serves as the context.
         */
        'afterIFrameTpl',

        /**
         * @cfg {String/Array/Ext.XTemplate} iframeAttrTpl
         * An optional string or `XTemplate` configuration to insert in the field markup
         * inside the iframe element (as attributes). If an `XTemplate` is used, the component's
         * {@link Ext.form.field.Base#getSubTplData subTpl data} serves as the context.
         */
        'iframeAttrTpl',

        // inherited
        'inputAttrTpl'
    ],

    /**
     * @cfg {Boolean} enableFormat
     * Enable the bold, italic and underline buttons
     */
    enableFormat: true,

    /**
     * @cfg {Boolean} enableFontSize
     * Enable the increase/decrease font size buttons
     */
    enableFontSize: true,

    /**
     * @cfg {Boolean} enableColors
     * Enable the fore/highlight color buttons
     */
    enableColors: true,

    /**
     * @cfg {Boolean} enableAlignments
     * Enable the left, center, right alignment buttons
     */
    enableAlignments: true,

    /**
     * @cfg {Boolean} enableLists
     * Enable the bullet and numbered list buttons. Not available in Safari 2.
     */
    enableLists: true,

    /**
     * @cfg {Boolean} enableSourceEdit
     * Enable the switch to source edit button. Not available in Safari 2.
     */
    enableSourceEdit: true,

    /**
     * @cfg {Boolean} enableLinks
     * Enable the create link button. Not available in Safari 2.
     */
    enableLinks: true,

    /**
     * @cfg {Boolean} enableFont
     * Enable font selection. Not available in Safari 2.
     */
    enableFont: true,

    /**
     * @cfg {String} createLinkText
     * The default text for the create link prompt
     * @locale
     */
    createLinkText: 'Please enter the URL for the link:',

    /**
     * @cfg {String} [defaultLinkValue='http://']
     * The default value for the create link prompt
     */
    defaultLinkValue: 'http:/' + '/',

    /**
     * @cfg {String[]} fontFamilies
     * An array of available font families
     */
    fontFamilies: [
        'Arial',
        'Courier New',
        'Tahoma',
        'Times New Roman',
        'Verdana'
    ],

    /**
     * @cfg {String} defaultValue
     * A default value to be put into the editor to resolve focus issues.
     *
     * Defaults to (Non-breaking space) in Opera,
     * (Zero-width space) in all other browsers.
     */
    defaultValue: Ext.isOpera ? '&#160;' : '&#8203;',

    /**
     * @private
     */
    extraFieldBodyCls: Ext.baseCSSPrefix + 'html-editor-wrap',

    /**
     * @cfg {String} defaultButtonUI
     * A default {@link Ext.Component#ui ui} to use for the HtmlEditor's toolbar
     * {@link Ext.button.Button buttons}.
     */
    defaultButtonUI: 'default-toolbar',

    /**
     * @cfg {Object} buttonDefaults
     * A config object to apply to the toolbar's {@link Ext.button.Button buttons} to affect
     * how they operate, eg:
     *
     *     buttonDefaults: {
     *         tooltip: {
     *             align: 't-b',
     *             anchor: true
     *         }
     *     }
     *
     * @since 6.2.0
     */
    buttonDefaults: null,

    /**
     * @private
     */
    initialized: false,

    /**
     * @private
     */
    activated: false,

    /**
     * @private
     */
    sourceEditMode: false,

    /**
     * @private
     */
    iframePad: 3,

    /**
     * @private
     */
    hideMode: 'offsets',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    maskOnDisable: true,

    containerElCls: Ext.baseCSSPrefix + 'html-editor-container',

    // This will strip any number of single or double quotes (in any order)
    // from a string at the anchors.
    reStripQuotes: /^['"]*|['"]*$/g,

    textAlignRE: /text-align:(.*?);/i,
    safariNonsenseRE: /\sclass="(?:Apple-style-span|Apple-tab-span|khtml-block-placeholder)"/gi,
    nonDigitsRE: /\D/g,

    /**
     * @event initialize
     * Fires when the editor is fully initialized (including the iframe)
     * @param {Ext.form.field.HtmlEditor} this
     */

    /**
     * @event activate
     * Fires when the editor is first receives the focus. Any insertion must wait until after
     * this event.
     * @param {Ext.form.field.HtmlEditor} this
     */

    /**
     * @event beforesync
     * Fires before the textarea is updated with content from the editor iframe.
     * Return false to cancel the sync.
     * @param {Ext.form.field.HtmlEditor} this
     * @param {String} html
     */

    /**
     * @event beforepush
     * Fires before the iframe editor is updated with content from the textarea.
     * Return false to cancel the push.
     * @param {Ext.form.field.HtmlEditor} this
     * @param {String} html
     */

    /**
     * @event sync
     * Fires when the textarea is updated with content from the editor iframe.
     * @param {Ext.form.field.HtmlEditor} this
     * @param {String} html
     */

    /**
     * @event push
     * Fires when the iframe editor is updated with content from the textarea.
     * @param {Ext.form.field.HtmlEditor} this
     * @param {String} html
     */

    /**
     * @event editmodechange
     * Fires when the editor switches edit modes
     * @param {Ext.form.field.HtmlEditor} this
     * @param {Boolean} sourceEdit True if source edit, false if standard editing.
     */

    /**
     * @private
     */
    initComponent: function() {
        var me = this;

        me.items = [me.createToolbar(), me.createInputCmp()];

        // No value set, we must report empty string
        if (me.value == null) {
            me.value = '';
        }

        me.callParent(arguments);
        me.initField();
    },

    createInputCmp: function() {
        this.inputCmp = Ext.widget(this.getInputCmpCfg());

        return this.inputCmp;
    },

    getInputCmpCfg: function() {
        var me = this,
            id = me.id + '-inputCmp',
            data = {
                id: id,
                name: me.name,
                textareaCls: me.textareaCls + ' ' + Ext.baseCSSPrefix + 'hidden',
                value: me.value,
                iframeName: Ext.id(),
                iframeSrc: Ext.SSL_SECURE_URL,
                iframeCls: Ext.baseCSSPrefix + 'htmleditor-iframe'
            };

        me.getInsertionRenderData(data, me.subTplInsertions);

        return {
            flex: 1,
            xtype: 'component',
            tpl: me.lookupTpl('componentTpl'),
            childEls: ['iframeEl', 'textareaEl'],
            id: id,
            cls: Ext.baseCSSPrefix + 'html-editor-input',
            data: data
        };
    },

    /**
     * Called when the editor creates its toolbar. Override this method if you need to
     * add custom toolbar buttons.
     * @param {Ext.form.field.HtmlEditor} editor
     * @protected
     */
    createToolbar: function() {
        this.toolbar = Ext.widget(this.getToolbarCfg());

        return this.toolbar;
    },

    getToolbarCfg: function() {
        var me = this,
            items = [],
            i,
            tipsEnabled = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
            baseCSSPrefix = Ext.baseCSSPrefix,
            fontSelectItem, undef;

        function btn(id, toggle, handler) {
            return Ext.merge({
                itemId: id,
                cls: baseCSSPrefix + 'btn-icon',
                iconCls: baseCSSPrefix + 'edit-' + id,
                enableToggle: toggle !== false,
                scope: me,
                handler: handler || me.relayBtnCmd,
                clickEvent: 'mousedown',
                tooltip: tipsEnabled ? me.buttonTips[id] : undef,
                overflowText: me.buttonTips[id].title || undef,
                tabIndex: -1
            }, me.buttonDefaults);
        }

        if (me.enableFont) {
            fontSelectItem = Ext.widget('component', {
                itemId: 'fontSelect',
                renderTpl: [
                    '<select id="{id}-selectEl" data-ref="selectEl" class="' + baseCSSPrefix +
                        'font-select">',
                    '</select>'
                ],
                childEls: ['selectEl'],
                afterRender: function() {
                    me.fontSelect = this.selectEl;
                    Ext.Component.prototype.afterRender.apply(this, arguments);
                },
                onDisable: function() {
                    var selectEl = this.selectEl;

                    if (selectEl) {
                        selectEl.dom.disabled = true;
                    }

                    Ext.Component.prototype.onDisable.apply(this, arguments);
                },
                onEnable: function() {
                    var selectEl = this.selectEl;

                    if (selectEl) {
                        selectEl.dom.disabled = false;
                    }

                    Ext.Component.prototype.onEnable.apply(this, arguments);
                },
                listeners: {
                    change: function() {
                        me.win.focus();
                        me.relayCmd('fontName', me.fontSelect.dom.value);
                        me.deferFocus();
                    },
                    element: 'selectEl'
                }
            });

            items.push(
                fontSelectItem,
                '-'
            );
        }

        if (me.enableFormat) {
            items.push(
                btn('bold'),
                btn('italic'),
                btn('underline')
            );
        }

        if (me.enableFontSize) {
            items.push(
                '-',
                btn('increasefontsize', false, me.adjustFont),
                btn('decreasefontsize', false, me.adjustFont)
            );
        }

        if (me.enableColors) {
            items.push(
                '-', Ext.merge({
                    itemId: 'forecolor',
                    cls: baseCSSPrefix + 'btn-icon',
                    iconCls: baseCSSPrefix + 'edit-forecolor',
                    overflowText: me.buttonTips.forecolor.title,
                    tooltip: tipsEnabled ? me.buttonTips.forecolor || undef : undef,
                    tabIndex: -1,
                    menu: Ext.widget('menu', {
                        plain: true,

                        items: [{
                            xtype: 'colorpicker',
                            allowReselect: true,
                            focus: Ext.emptyFn,
                            value: '000000',
                            plain: true,
                            clickEvent: 'mousedown',
                            handler: function(cp, color) {
                                me.relayCmd(
                                    'forecolor',
                                    Ext.isWebKit || Ext.isIE || Ext.isEdge ? '#' + color : color
                                );

                                this.up('menu').hide();
                            }
                        }]
                    })
                }, me.buttonDefaults), Ext.merge({
                    itemId: 'backcolor',
                    cls: baseCSSPrefix + 'btn-icon',
                    iconCls: baseCSSPrefix + 'edit-backcolor',
                    overflowText: me.buttonTips.backcolor.title,
                    tooltip: tipsEnabled ? me.buttonTips.backcolor || undef : undef,
                    tabIndex: -1,
                    menu: Ext.widget('menu', {
                        plain: true,

                        items: [{
                            xtype: 'colorpicker',
                            focus: Ext.emptyFn,
                            value: 'FFFFFF',
                            plain: true,
                            allowReselect: true,
                            clickEvent: 'mousedown',
                            handler: function(cp, color) {
                                if (Ext.isGecko) {
                                    me.execCmd('useCSS', false);
                                    me.execCmd('hilitecolor', '#' + color);
                                    me.execCmd('useCSS', true);
                                    me.deferFocus();
                                }
                                else {
                                    // eslint-disable-next-line max-len
                                    me.relayCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isWebKit || Ext.isIE || Ext.isEdge || Ext.isOpera ? '#' + color : color);
                                }

                                this.up('menu').hide();
                            }
                        }]
                    })
                }, me.buttonDefaults)
            );
        }

        if (me.enableAlignments) {
            items.push(
                '-',
                btn('justifyleft'),
                btn('justifycenter'),
                btn('justifyright')
            );
        }

        if (me.enableLinks) {
            items.push(
                '-',
                btn('createlink', false, me.createLink)
            );
        }

        if (me.enableLists) {
            items.push(
                '-',
                btn('insertorderedlist'),
                btn('insertunorderedlist')
            );
        }

        if (me.enableSourceEdit) {
            items.push(
                '-',
                btn('sourceedit', true, function() {
                    me.toggleSourceEdit(!me.sourceEditMode);
                })
            );
        }

        // Everything starts disabled.
        for (i = 0; i < items.length; i++) {
            if (items[i].itemId !== 'sourceedit') {
                items[i].disabled = true;
            }
        }

        // build the toolbar
        // Automatically rendered in Component.afterRender's renderChildren call
        return {
            xtype: 'toolbar',
            defaultButtonUI: me.defaultButtonUI,
            cls: Ext.baseCSSPrefix + 'html-editor-tb',
            enableOverflow: true,
            items: items,

            // stop form submits
            listeners: {
                click: function(e) {
                    e.preventDefault();
                },
                element: 'el'
            }
        };
    },

    getMaskTarget: function() {
        // Can't be the body td directly because of issues with absolute positioning
        // inside td's in FF
        return Ext.isGecko ? this.inputCmp.el : this.bodyEl;
    },

    /**
     * Sets the read only state of this field.
     * @param {Boolean} readOnly Whether the field should be read only.
     */
    setReadOnly: function(readOnly) {
        var me = this,
            textareaEl = me.textareaEl,
            iframeEl = me.iframeEl,
            body;

        me.readOnly = readOnly;

        if (textareaEl) {
            textareaEl.dom.readOnly = readOnly;
        }

        if (me.initialized) {
            body = me.getEditorBody();

            if (Ext.isIE) {
                // Hide the iframe while setting contentEditable so it doesn't grab focus
                iframeEl.setDisplayed(false);
                body.contentEditable = !readOnly;
                iframeEl.setDisplayed(true);
            }
            else {
                me.setDesignMode(!readOnly);
            }

            if (body) {
                body.style.cursor = readOnly ? 'default' : 'text';
            }

            me.disableItems(readOnly);
        }
    },

    /**
     * Called when the editor initializes the iframe with HTML contents. Override this method if you
     * want to change the initialization markup of the iframe (e.g. to add stylesheets).
     *
     * **Note:** IE8-Standards has unwanted scroller behavior, so the default meta tag forces IE7
     * compatibility. Also note that forcing IE7 mode works when the page is loaded normally,
     * but if you are using IE's Web Developer Tools to manually set the document mode, that will
     * take precedence and override what this code sets by default. This can be confusing when
     * developing, but is not a user-facing issue.
     * @protected
     */
    getDocMarkup: function() {
        var me = this,
            h = me.iframeEl.getHeight() - me.iframePad * 2;

        /* eslint-disable max-len */
        // - IE9+ require a strict doctype otherwise text outside visible area can't be selected.
        // - Opera inserts <P> tags on Return key, so P margins must be removed to avoid double line-height.
        // - On browsers other than IE, the font is not inherited by the IFRAME so it must be specified.
        return Ext.String.format(
            '<!DOCTYPE html>' +
               '<html><head><style type="text/css">' +
               (Ext.isOpera || Ext.isIE ? 'p{margin:0;}' : '') +
               'body{border:0;margin:0;padding:{0}px;direction:' + (me.rtl ? 'rtl;' : 'ltr;') +
               (Ext.isIE8 ? Ext.emptyString : 'min-') +
               'height:{1}px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;cursor:text;background-color:white;' +
               (Ext.isIE ? '' : 'font-size:12px;font-family:{2}') +
               '}</style></head><body></body></html>',
            me.iframePad, h, me.defaultFont);
        /* eslint-enable max-len */
    },

    /**
     * @private
     */
    getEditorBody: function() {
        var doc = this.getDoc();

        return doc && doc.body;
    },

    /**
     * @private
     */
    getDoc: function() {
        return this.iframeEl.dom.contentDocument || this.getWin().document;
    },

    /**
     * @private
     */
    getWin: function() {
        // using window.frames[id] to access the the iframe's window object in FF creates
        // a global variable with name == id in the global scope that references the iframe
        // window.  This is undesirable for unit testing because that global variable
        // is readonly and cannot be deleted.  To avoid this, we use contentWindow if it
        // is available (and it is in all supported browsers at the time of this writing)
        // and fall back to window.frames if contentWindow is not available.
        return this.iframeEl.dom.contentWindow || window.frames[this.iframeEl.dom.name];
    },

    initDefaultFont: function() {
        // It's not ideal to do this here since it's a write phase, but we need to know
        // what the font used in the textarea is so that we can setup the appropriate font
        // options in the select box. The select box will reflow once we populate it, so we want
        // to do so before we layout the first time.

        var me = this,
            selIdx = 0,
            fonts, font, select,
            option, i, len, lower;

        if (!me.defaultFont) {
            font = me.textareaEl.getStyle('font-family');
            font = Ext.String.capitalize(font.split(',')[0]);
            fonts = Ext.Array.clone(me.fontFamilies);
            Ext.Array.include(fonts, font);
            fonts.sort();
            me.defaultFont = font;

            select = me.down('#fontSelect').selectEl.dom;

            for (i = 0, len = fonts.length; i < len; ++i) {
                font = fonts[i];
                lower = font.toLowerCase();
                option = new Option(font, lower);

                if (font === me.defaultFont) {
                    selIdx = i;
                }

                option.style.fontFamily = lower;

                if (Ext.isIE) {
                    select.add(option);
                }
                else {
                    select.options.add(option);
                }
            }

            // Old IE versions have a problem if we set the selected property
            // in the loop, so set it after.
            select.options[selIdx].selected = true;
        }
    },

    isEqual: function(value1, value2) {
        return this.isEqualAsString(value1, value2);
    },

    /**
     * @private
     */
    afterRender: function() {
        var me = this,
            inputCmp = me.inputCmp;

        me.callParent(arguments);

        me.iframeEl = inputCmp.iframeEl;
        me.textareaEl = inputCmp.textareaEl;

        // The input element is interrogated by the layout to extract height when labelAlign
        // is 'top'. It must be set, and then switched between the iframe and the textarea
        me.inputEl = me.iframeEl;

        if (me.enableFont) {
            me.initDefaultFont();
        }

        // Start polling to step through the phases of document readiness.
        me.initPhase = 0;
        me.initializeTask = Ext.TaskManager.start({
            run: me.initFrameDoc,
            scope: me,
            interval: 10,
            duration: 5000
        });
    },

    initFrameDoc: function() {
        var me = this,
            doc = me.getDoc();

        // Destroying the component during initialization cancels initialization.
        if (me.destroying || me.destroyed) {
            return Ext.TaskManager.stop(me.initializeTask);
        }

        switch (me.initPhase) {
            case 0:
                if (doc) {
                    me.win = me.getWin();
                    doc.open();
                    doc.write(me.getDocMarkup());
                    doc.close();
                    me.initPhase++;
                }

                break;

            case 1:
                if (doc.body || doc.readyState === 'complete') {
                    me.setDesignMode(true);
                    me.initPhase++;
                }

                break;

            case 2:
                me.initEditor();
                Ext.TaskManager.stop(me.initializeTask);
        }
    },

    /**
     * @private
     * Sets current design mode. To enable, mode can be true or 'on', off otherwise
     */
    setDesignMode: function(mode) {
        var me = this,
            doc = me.getDoc();

        if (doc) {
            if (me.readOnly) {
                mode = false;
            }

            doc.designMode = (/on|true/i).test(String(mode).toLowerCase()) ? 'on' : 'off';
        }
    },

    /**
     * @private
     */
    getDesignMode: function() {
        var doc = this.getDoc();

        return !doc ? '' : String(doc.designMode).toLowerCase();
    },

    disableItems: function(disabled) {
        var items = this.getToolbar().items.items,
            i,
            iLen = items.length,
            item;

        for (i = 0; i < iLen; i++) {
            item = items[i];

            if (item.getItemId() !== 'sourceedit') {
                item.setDisabled(disabled);
            }
        }
    },

    /**
     * Toggles the editor between standard and source edit mode.
     * @param {Boolean} [sourceEditMode] True for source edit, false for standard
     */
    toggleSourceEdit: function(sourceEditMode) {
        var me = this,
            iframe = me.iframeEl,
            textarea = me.textareaEl,
            hiddenCls = Ext.baseCSSPrefix + 'hidden',
            btn = me.getToolbar().getComponent('sourceedit');

        if (!Ext.isBoolean(sourceEditMode)) {
            sourceEditMode = !me.sourceEditMode;
        }

        me.sourceEditMode = sourceEditMode;

        if (btn.pressed !== sourceEditMode) {
            btn.toggle(sourceEditMode);
        }

        if (sourceEditMode) {
            me.disableItems(true);
            me.syncValue();
            iframe.addCls(hiddenCls);
            textarea.removeCls(hiddenCls);
            textarea.dom.removeAttribute('tabIndex');
            textarea.focus();
            me.inputEl = textarea;
        }
        else {
            if (me.initialized) {
                me.disableItems(me.readOnly);
            }

            me.pushValue();
            iframe.removeCls(hiddenCls);
            textarea.addCls(hiddenCls);
            textarea.dom.setAttribute('tabIndex', -1);
            me.deferFocus();
            me.inputEl = iframe;
        }

        me.fireEvent('editmodechange', me, sourceEditMode);
        me.updateLayout();
    },

    /**
     * @private
     */
    createLink: function() {
        var url = prompt(this.createLinkText, this.defaultLinkValue);

        if (url && url !== 'http:/' + '/') {
            this.relayCmd('createlink', url);
        }
    },

    clearInvalid: Ext.emptyFn,

    setValue: function(value) {
        var me = this,
            textarea = me.textareaEl;

        if (value === null || value === undefined) {
            value = '';
        }

        // Only update the field if the value has changed
        if (me.value !== value) {
            if (textarea) {
                textarea.dom.value = value;
            }

            me.pushValue();

            if (!me.rendered && me.inputCmp) {
                me.inputCmp.data.value = value;
            }

            me.mixins.field.setValue.call(me, value);
        }

        return me;
    },

    /**
     * If you need/want custom HTML cleanup, this is the method you should override.
     * @param {String} html The HTML to be cleaned
     * @return {String} The cleaned HTML
     * @protected
     */
    cleanHtml: function(html) {
        html = String(html);

        if (Ext.isWebKit) { // strip safari nonsense
            html = html.replace(this.safariNonsenseRE, '');
        }

        /*
         * Neat little hack. Strips out all the non-digit characters from the default
         * value and compares it to the character code of the first character in the string
         * because it can cause encoding issues when posted to the server. We need the
         * parseInt here because charCodeAt will return a number.
         */
        if (html.charCodeAt(0) === parseInt(this.defaultValue.replace(this.nonDigitsRE, ''), 10)) {
            html = html.substring(1);
        }

        return html;
    },

    /**
     * Syncs the contents of the editor iframe with the textarea.
     * @protected
     */
    syncValue: function() {
        var me = this,
            body, changed, html, bodyStyleText, match, textElDom;

        if (me.initialized) {
            body = me.getEditorBody();
            html = body.innerHTML;
            textElDom = me.textareaEl.dom;

            if (Ext.isWebKit) {
                // Safari puts text-align styles on the body element!
                bodyStyleText = body.style.cssText;
                match = bodyStyleText.match(me.textAlignRE);

                if (match && match[1]) {
                    html = '<div style="' + match[0] + '">' + html + '</div>';
                }
            }

            html = me.cleanHtml(html);

            if (me.fireEvent('beforesync', me, html) !== false) {
                // Gecko inserts single <br> tag when input is empty
                // and user toggles source mode. See https://sencha.jira.com/browse/EXTJSIV-8542
                if (Ext.isGecko && textElDom.value === '' && html === '<br>') {
                    html = '';
                }

                if (textElDom.value !== html) {
                    textElDom.value = html;
                    changed = true;
                }

                me.fireEvent('sync', me, html);

                if (changed) {
                    // we have to guard this to avoid infinite recursion because getValue
                    // calls this method...
                    me.checkChange();
                }
            }
        }
    },

    getValue: function() {
        var me = this,
            value;

        if (!me.sourceEditMode) {
            me.syncValue();
        }

        value = me.rendered ? me.textareaEl.dom.value : me.value;
        me.value = value;

        return value;
    },

    /**
     * Pushes the value of the textarea into the iframe editor.
     * @protected
     */
    pushValue: function() {
        var me = this,
            v;

        if (me.initialized) {
            v = me.textareaEl.dom.value || '';

            if (!me.activated && v.length < 1) {
                v = me.defaultValue;
            }

            if (me.fireEvent('beforepush', me, v) !== false) {
                me.getEditorBody().innerHTML = v;

                if (Ext.isGecko) {
                    // Gecko hack, see: https://bugzilla.mozilla.org/show_bug.cgi?id=232791#c8
                    me.setDesignMode(false);  // toggle off first
                    me.setDesignMode(true);
                }

                me.fireEvent('push', me, v);
            }
        }
    },

    focus: function(selectText, delay) {
        var me = this,
            value, focusEl;

        if (delay) {
            if (!me.focusTask) {
                me.focusTask = new Ext.util.DelayedTask(me.focus);
            }

            me.focusTask.delay(Ext.isNumber(delay) ? delay : 10, null, me, [selectText, false]);
        }
        else {
            if (selectText) {
                if (me.textareaEl && me.textareaEl.dom) {
                    value = me.textareaEl.dom.value;
                }

                // Make sure there is content before calling SelectAll,
                // otherwise the caret disappears.
                if (value && value.length) {
                    me.execCmd('selectall', true);
                }
            }

            focusEl = me.getFocusEl();

            if (focusEl && focusEl.focus) {
                focusEl.focus();
            }
        }

        return me;
    },

    /**
     * @private
     */
    initEditor: function() {
        var me = this,
            dbody = me.getEditorBody(),
            ss = me.textareaEl.getStyle(
                ['font-size', 'font-family', 'background-image', 'background-repeat',
                 'background-color', 'color']
            ),
            doc = me.getDoc(),
            docEl = Ext.get(doc),
            fn;

        ss['background-attachment'] = 'fixed'; // w3c
        dbody.bgProperties = 'fixed'; // ie

        Ext.DomHelper.applyStyles(dbody, ss);

        if (docEl) {
            try {
                docEl.clearListeners();
            }
            catch (e) {
                // ignore
            }

            /*
             * Update toolbar state on a buffered timer when document changes.
             */
            fn = Ext.Function.createBuffered(me.updateToolbar, 100, me);
            docEl.on({
                mousedown: fn,
                dblclick: fn,
                click: fn,
                keyup: fn,
                delegated: false
            });

            // These events need to be relayed from the inner document (where they stop
            // bubbling) up to the outer document. This has to be done at the DOM level so
            // the event reaches listeners on elements like the document body. The effected
            // mechanisms that depend on this bubbling behavior are listed to the right
            // of the event.
            fn = me.onRelayedEvent;
            docEl.on({
                mousedown: fn, // menu dismisal (MenuManager) and Window onMouseDown (toFront)
                mousemove: fn, // window resize drag detection
                mouseup: fn,   // window resize termination
                click: fn,     // not sure, but just to be safe
                dblclick: fn,  // not sure again
                delegated: false,
                scope: me
            });

            if (Ext.isGecko) {
                docEl.on('keypress', me.applyCommand, me);
            }

            if (me.fixKeys) {
                docEl.on('keydown', me.fixKeys, me, { delegated: false });
            }

            if (me.fixKeysAfter) {
                docEl.on('keyup', me.fixKeysAfter, me, { delegated: false });
            }

            if (Ext.isIE9) {
                Ext.get(doc.documentElement).on('focus', me.focus, me);
            }

            // In old IEs, clicking on a toolbar button shifts focus from iframe
            // and it loses selection. To avoid this, we save current selection
            // and restore it.
            if (Ext.isIE8) {
                docEl.on('focusout', function() {
                    me.savedSelection =
                        doc.selection.type !== 'None' ? doc.selection.createRange() : null;
                }, me);

                docEl.on('focusin', function() {
                    if (me.savedSelection) {
                        me.savedSelection.select();
                    }
                }, me);
            }

            // We need to be sure we remove all our events from the iframe on unload
            // or we're going to LEAK!
            Ext.getWin().on('unload', me.destroyEditor, me);

            me.initialized = true;
            me.pushValue();
            me.setReadOnly(me.readOnly);
            me.fireEvent('initialize', me);
        }
    },

    /**
     * @private
     */
    destroyEditor: function() {
        var me = this,
            initializeTask = me.initializeTask,
            doc, prop;

        if (initializeTask) {
            Ext.TaskManager.stop(initializeTask, true);
        }

        if (me.rendered) {
            Ext.getWin().un('unload', me.destroyEditor, me);

            doc = me.getDoc();

            if (doc) {
                // removeAll() doesn't currently know how to handle iframe document,
                // so for now we have to wrap it in an Ext.Element,
                // or else IE6/7 will leak big time when the page is refreshed.
                // TODO: this may not be needed once we find a more permanent fix.
                // see EXTJSIV-5891.
                Ext.get(doc).destroy();

                if (doc.hasOwnProperty) {

                    for (prop in doc) {
                        try {
                            if (doc.hasOwnProperty(prop)) {
                                delete doc[prop];
                            }
                        }
                        catch (e) {
                            // clearing certain props on document MAY throw in IE
                        }
                    }
                }
            }
        }
    },

    /**
     * @private
     */
    doDestroy: function() {
        this.destroyEditor();
        this.callParent();
    },

    /**
     * @private
     */
    onRelayedEvent: function(event) {
        // relay event from the iframe's document to the document that owns the iframe...

        var iframeEl = this.iframeEl,
            iframeXY = Ext.fly(iframeEl).getTrueXY(),
            originalEventXY = event.getXY(),

            eventXY = event.getXY();

        // the event from the inner document has XY relative to that document's origin,
        // so adjust it to use the origin of the iframe in the outer document:
        event.xy = [iframeXY[0] + eventXY[0], iframeXY[1] + eventXY[1]];

        event.injectEvent(iframeEl); // blame the iframe for the event...

        event.xy = originalEventXY; // restore the original XY (just for safety)
    },

    /**
     * @private
     */
    onFirstFocus: function() {
        var me = this,
            selection, range;

        me.activated = true;
        me.disableItems(me.readOnly);

        if (Ext.isGecko) { // prevent silly gecko errors
            me.win.focus();
            selection = me.win.getSelection();

            // If the editor contains a <br> tag, clicking on the editor after the text where
            // the <br> broke the line will produce nodeType === 1 (the body tag).
            // It's better to check the length of the selection.focusNode's content.
            //
            // If htmleditor.value = ' ' (note the space)
            // 1. nodeType === 1
            // 2. nodeName === 'BODY'
            // 3. selection.focusNode.textContent.length === 1
            //
            // If htmleditor.value = '' (no chars) nodeType === 3 && nodeName === '#text'
            // 1. nodeType === 3
            // 2. nodeName === '#text'
            // 3. selection.focusNode.textContent.length === 1 (yes, that's right, 1)
            //
            // The editor inserts Unicode code point 8203, a zero-width space when
            // htmleditor.value === '' (call selection.focusNode.textContent.charCodeAt(0))
            // http://www.fileformat.info/info/unicode/char/200b/index.htm
            // So, test with framework method to normalize.
            if (selection.focusNode && !me.getValue().length) {
                range = selection.getRangeAt(0);
                range.selectNodeContents(me.getEditorBody());
                range.collapse(true);
                me.deferFocus();
            }

            try {
                me.execCmd('useCSS', true);
                me.execCmd('styleWithCSS', false);
            }
            catch (e) {
                // ignore (why?)
            }
        }

        me.fireEvent('activate', me);
    },

    /**
     * @private
     */
    adjustFont: function(btn) {
        var adjust = btn.getItemId() === 'increasefontsize' ? 1 : -1,
            size = this.getDoc().queryCommandValue('FontSize') || '2',
            isPxSize = Ext.isString(size) && size.indexOf('px') !== -1,
            isSafari;

        size = parseInt(size, 10);

        if (isPxSize) {
            // Safari 3 values
            // 1 = 10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px
            if (size <= 10) {
                size = 1 + adjust;
            }
            else if (size <= 13) {
                size = 2 + adjust;
            }
            else if (size <= 16) {
                size = 3 + adjust;
            }
            else if (size <= 18) {
                size = 4 + adjust;
            }
            else if (size <= 24) {
                size = 5 + adjust;
            }
            else {
                size = 6 + adjust;
            }

            size = Ext.Number.constrain(size, 1, 6);
        }
        else {
            isSafari = Ext.isSafari;

            if (isSafari) { // safari
                adjust *= 2;
            }

            size = Math.max(1, size + adjust) + (isSafari ? 'px' : 0);
        }

        this.relayCmd('FontSize', size);
    },

    /**
     * Triggers a toolbar update by reading the markup state of the current selection in the editor.
     * @protected
     */
    updateToolbar: function() {
        var me = this,
            i, l, btns, doc, name, queriedName, fontSelect,
            toolbarSubmenus;

        if (me.readOnly) {
            return;
        }

        if (!me.activated) {
            me.onFirstFocus();

            return;
        }

        btns = me.getToolbar().items.map;
        doc = me.getDoc();

        if (me.enableFont) {
            // When querying the fontName, Chrome may return an Array of font names
            // with those containing spaces being placed between single-quotes.
            queriedName = doc.queryCommandValue('fontName');

            // eslint-disable-next-line max-len
            name = (queriedName ? queriedName.split(",")[0].replace(me.reStripQuotes, '') : me.defaultFont).toLowerCase();
            fontSelect = me.fontSelect.dom;

            if (name !== fontSelect.value || name !== queriedName) {
                fontSelect.value = name;
            }
        }

        function updateButtons() {
            var state;

            for (i = 0, l = arguments.length, name; i < l; i++) {
                name = arguments[i];

                // Firefox 18+ sometimes throws NS_ERROR_INVALID_POINTER exception
                // See https://sencha.jira.com/browse/EXTJSIV-9766
                try {
                    state = doc.queryCommandState(name);
                }
                catch (e) {
                    state = false;
                }

                btns[name].toggle(state);
            }
        }

        if (me.enableFormat) {
            updateButtons('bold', 'italic', 'underline');
        }

        if (me.enableAlignments) {
            updateButtons('justifyleft', 'justifycenter', 'justifyright');
        }

        if (me.enableLists) {
            updateButtons('insertorderedlist', 'insertunorderedlist');
        }

        // Ensure any of our toolbar's owned menus are hidden.
        // The overflow menu must control itself.
        toolbarSubmenus = me.toolbar.query('menu');

        for (i = 0; i < toolbarSubmenus.length; i++) {
            toolbarSubmenus[i].hide();
        }

        me.syncValue();
    },

    /**
     * @private
     */
    relayBtnCmd: function(btn) {
        this.relayCmd(btn.getItemId());
    },

    /**
     * Executes a Midas editor command on the editor document and performs necessary focus
     * and toolbar updates.
     * **This should only be called after the editor is initialized.**
     * @param {String} cmd The Midas command
     * @param {String/Boolean} [value=null] The value to pass to the command
     */
    relayCmd: function(cmd, value) {
        Ext.defer(function() {
            var me = this;

            if (!this.destroyed) {
                me.win.focus();
                me.execCmd(cmd, value);
                me.updateToolbar();
            }
        }, 10, this);
    },

    /**
     * Executes a Midas editor command directly on the editor document. For visual commands,
     * you should use {@link #relayCmd} instead.
     * **This should only be called after the editor is initialized.**
     * @param {String} cmd The Midas command
     * @param {String/Boolean} [value=null] The value to pass to the command
     */
    execCmd: function(cmd, value) {
        var me = this,
            doc = me.getDoc();

        doc.execCommand(cmd, false, (value === undefined ? null : value));
        me.syncValue();
    },

    /**
     * @private
     */
    applyCommand: function(e) {
        if (e.ctrlKey) {
            // eslint-disable-next-line vars-on-top
            var me = this,
                c = e.getCharCode(),
                cmd;

            if (c > 0) {
                c = String.fromCharCode(c);

                switch (c) {
                    case 'b':
                        cmd = 'bold';
                        break;
                    case 'i':
                        cmd = 'italic';
                        break;
                    case 'u':
                        cmd = 'underline';
                        break;
                }

                if (cmd) {
                    me.win.focus();
                    me.execCmd(cmd);
                    me.deferFocus();
                    e.preventDefault();
                }
            }
        }
    },

    /**
     * Inserts the passed text at the current cursor position.
     * __Note:__ the editor must be initialized and activated to insert text.
     * @param {String} text
     */
    insertAtCursor: function(text) {
        // adapted from http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
        var me = this,
            win = me.getWin(),
            doc = me.getDoc(),
            sel, range, el, frag, node, lastNode;

        if (me.activated) {
            win.focus();

            if (win.getSelection) {
                sel = win.getSelection();

                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();

                    // Range.createContextualFragment() would be useful here but is
                    // only relatively recently standardized and is not supported in
                    // some browsers (IE9, for one)
                    el = doc.createElement("div");
                    el.innerHTML = text;
                    frag = doc.createDocumentFragment();

                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }

                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
            else if (doc.selection && sel.type !== 'Control') {
                sel = doc.selection;
                range = sel.createRange();
                range.collapse(true);
                sel.createRange().pasteHTML(text);
            }

            me.deferFocus();
        }
    },

    /**
     * @private
     * Load time branching for fastest keydown performance.
     */
    fixKeys: (function() {
        if (Ext.isIE10m) {
            return function(e) {
                var me = this,
                    k = e.getKey(),
                    doc = me.getDoc(),
                    readOnly = me.readOnly,
                    range;

                if (k === e.TAB) {
                    e.stopEvent();

                    // TODO: add tab support for IE 11.
                    if (!readOnly) {
                        range = doc.selection.createRange();

                        if (range) {
                            if (range.collapse) {
                                range.collapse(true);
                                range.pasteHTML('&#160;&#160;&#160;&#160;');
                            }

                            me.deferFocus();
                        }
                    }
                }
            };
        }

        if (Ext.isOpera) {
            return function(e) {
                var me = this,
                    k = e.getKey(),
                    readOnly = me.readOnly;

                if (k === e.TAB) {
                    e.stopEvent();

                    if (!readOnly) {
                        me.win.focus();
                        me.execCmd('InsertHTML', '&#160;&#160;&#160;&#160;');
                        me.deferFocus();
                    }
                }
            };
        }

        // Not needed, so null.
        return null;
    }()),

    /**
     * @private
     */
    fixKeysAfter: (function() {
        if (Ext.isIE) {
            return function(e) {
                var me = this,
                    k = e.getKey(),
                    doc = me.getDoc(),
                    readOnly = me.readOnly,
                    innerHTML;

                if (!readOnly && (k === e.BACKSPACE || k === e.DELETE)) {
                    innerHTML = doc.body.innerHTML;

                    // If HtmlEditor had some input and user cleared it, IE inserts <p>&nbsp;</p>
                    // which makes an impression that there is still some text, and creeps
                    // into source mode when toggled. We don't want this.
                    //
                    // See https://sencha.jira.com/browse/EXTJSIV-8542
                    //
                    // N.B. There is **small** chance that user could go to source mode,
                    // type '<p>&nbsp;</p>', switch back to visual mode, type something else
                    // and then clear it -- the code below would clear the <p> tag as well,
                    // which could be considered a bug. However I see no way to distinguish
                    // between offending markup being entered manually and generated by IE,
                    // so this can be considered a nasty corner case.
                    //
                    if (innerHTML === '<p>&nbsp;</p>' || innerHTML === '<P>&nbsp;</P>') {
                        doc.body.innerHTML = '';
                    }
                }
            };
        }

        return null;
    }()),

    /**
     * Returns the editor's toolbar. **This is only available after the editor has been rendered.**
     * @return {Ext.toolbar.Toolbar}
     */
    getToolbar: function() {
        return this.toolbar;
    },

    /**
     * @property {Object} buttonTips
     * Object collection of toolbar tooltips for the buttons in the editor.
     * The key is the command id associated with that button and the value is a valid
     * QuickTips object. For example:
     *
     *     {
     *         bold: {
     *             title: 'Bold (Ctrl+B)',
     *             text: 'Make the selected text bold.',
     *             cls: 'x-html-editor-tip'
     *         },
     *         italic: {
     *             title: 'Italic (Ctrl+I)',
     *             text: 'Make the selected text italic.',
     *             cls: 'x-html-editor-tip'
     *         }
     *         // ...
     *     }
     * @locale
     */
    buttonTips: {
        bold: {
            title: 'Bold (Ctrl+B)',
            text: 'Make the selected text bold.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        italic: {
            title: 'Italic (Ctrl+I)',
            text: 'Make the selected text italic.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        underline: {
            title: 'Underline (Ctrl+U)',
            text: 'Underline the selected text.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        increasefontsize: {
            title: 'Grow Text',
            text: 'Increase the font size.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        decreasefontsize: {
            title: 'Shrink Text',
            text: 'Decrease the font size.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        backcolor: {
            title: 'Text Highlight Color',
            text: 'Change the background color of the selected text.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        forecolor: {
            title: 'Font Color',
            text: 'Change the color of the selected text.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        justifyleft: {
            title: 'Align Text Left',
            text: 'Align text to the left.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        justifycenter: {
            title: 'Center Text',
            text: 'Center text in the editor.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        justifyright: {
            title: 'Align Text Right',
            text: 'Align text to the right.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        insertunorderedlist: {
            title: 'Bullet Feladatok',
            text: 'Start a bulleted list.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        insertorderedlist: {
            title: 'Numbered Feladatok',
            text: 'Start a numbered list.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        createlink: {
            title: 'Hyperlink',
            text: 'Make the selected text a hyperlink.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        },
        sourceedit: {
            title: 'Source Edit',
            text: 'Switch to source editing mode.',
            cls: Ext.baseCSSPrefix + 'html-editor-tip'
        }
    },

    // hide stuff that is not compatible
    /**
     * @event blur
     * @hide
     */

    /**
     * @event focus
     * @hide
     */

    /**
     * @event specialkey
     * @hide
     */

    /**
     * @cfg {String} fieldCls
     * @hide
     */

    /**
     * @cfg {String} focusCls
     * @hide
     */

    /**
     * @cfg {String} autoCreate
     * @hide
     */

    /**
     * @cfg {String} inputType
     * @hide
     */

    /**
     * @cfg {String} invalidCls
     * @hide
     */

    /**
     * @cfg {String} invalidText
     * @hide
     */

    /**
     * @cfg {Boolean} allowDomMove
     * @hide
     */

    /**
     * @cfg {String} readOnly
     * @hide
     */

    /**
     * @cfg {String} tabIndex
     * @hide
     */

    /**
     * @method validate
     * @hide
     */

    privates: {
        deferFocus: function() {
            this.focus(false, true);
        },

        getFocusEl: function() {
            return this.sourceEditMode ? this.textareaEl : this.iframeEl;
        }
    }
});
