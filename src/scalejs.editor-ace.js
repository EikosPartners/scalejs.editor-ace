define([
    'scalejs!core',
    'knockout',
    'ace/ace'
], function (
    core,
    ko,
    ace
) {
    'use strict';

    //ace.config.set("basePath", "Scripts/ace");

    function init(
        element,
        valueAccessor
    ) {
        var value = valueAccessor(),
            editorMode = value.editorMode || 'html',
            text = value.text,
            editor = ace.edit(element),
            session = editor.getSession(),
            selectedTheme = value.selectedTheme,
            val,
            disposeLayout;

        if (editorMode === 'js') {
            editorMode = 'javascript';
        }

        session.setUseWrapMode(false);
        session.setMode('ace/mode/' + editorMode);
        session.setUseWrapMode(true);
        editor.setFontSize(15);
        editor.setTheme('ace/theme/monokai');

        ko.computed({
            read: function () {
                if (val !== ko.unwrap(text)) {
                    editor.setValue(text(), -1);
                }
            },
            disposeWhenNodeIsRemoved: element
        });
        ko.computed({
            read: function () {
                editor.setTheme('ace/theme/' + (ko.unwrap(selectedTheme) || 'monokai'));
            },
            disposeWhenNodeIsRemoved: element
        });


        if (ko.isObservable(text)) {
            session.on('change', function () {
                val = editor.getValue();
                if (text() !== val) {
                    text(val);
                }
            });
        }

        if (core.layout && core.layout.onLayoutDone) {
            disposeLayout = core.layout.onLayoutDone(function () {
                editor.resize();
            });
        }
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (disposeLayout) {
                disposeLayout();
            }
            editor.destroy();
        });
    }

    ko.bindingHandlers.editor = {
        init: init
    };
});
