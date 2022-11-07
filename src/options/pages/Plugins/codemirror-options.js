const openSearchDialog = function(cm) {
  console.log(cm);
  cm.setCursor({ line: 0, ch: 0 });
  window.CodeMirror.commands.findPersistent(cm);
};

const getExtraKeysMap = () => {
  var extraKeyMap = {
    Esc: function(cm) {
      window.CodeMirror.commands.clearSearch(cm);
      cm.setSelection(cm.getCursor());
      cm.focus();
    },
  };
  extraKeyMap['Ctrl-F'] = openSearchDialog;
  extraKeyMap['Cmd-F'] = openSearchDialog;
  return extraKeyMap;
};
export default {
  height: 500,
  tabSize: 2,
  lineNumbers: true,
  line: true,
  indentWithTabs: true,
  smartIndent: true,
  autofocus: false,

  highlightSelectionMatches: { annotateScrollbar: true },
  lineWrapping: true,
  foldGutter: true,
  styleActiveLine: true,
  indentCStyle: false,
  showArraySize: false,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],

  viewportMargin: 400,
  hintOptions: {
    completeSingle: false,
  },
  extraKeys: getExtraKeysMap(),
};
