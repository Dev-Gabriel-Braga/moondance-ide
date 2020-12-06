ace.define("ace/theme/moon-dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-moon-dark";
exports.cssText = `
.ace-moon-dark .ace_gutter {
    background: hsl(223, 30%, 15%);
    color: hsl(223, 20%, 35%);
}
.ace-moon-dark .ace_print-margin {
    width: 1px;
    background: hsl(223, 20%, 25%);
}
.ace-moon-dark {
    background-color: hsla(223, 30%, 15%, 1);
    color: hsl(60, 30%, 96%);
}
.ace-moon-dark .ace_cursor {
    color: hsl(60, 36%, 96%);
}
.ace-moon-dark .ace_marker-layer .ace_selection {
    background: hsl(223, 20%, 25%);
}
.ace-moon-dark.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px hsl(59, 89%, 60%);
    border-radius: 2px;
}
.ace-moon-dark .ace_marker-layer .ace_step {
    background: hsl(223, 38%, 57%);
}
.ace-moon-dark .ace_marker-layer .ace_bracket {
    margin: -1px 0 0 -1px;
    border: 1px solid hsl(59, 89%, 60%);
}
.ace-moon-dark .ace_marker-layer .ace_active-line {
    background: hsl(223, 20%, 25%);
}
.ace-moon-dark .ace_gutter-active-line {
    background-color: hsl(223, 20%, 25%);
}
.ace-moon-dark .ace_marker-layer .ace_selected-word {
    box-shadow: 0px 0px 0px 1px hsl(59, 89%, 60%);
    border-radius: 3px;
}
.ace-moon-dark .ace_fold {
    background-color: hsl(0, 94%, 65%);
    border-color: hsl(60, 30%, 96%);
}
.ace-moon-dark .ace_keyword {
    color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_constant.ace_language {
    color: hsl(29, 94%, 65%);
}
.ace-moon-dark .ace_constant.ace_numeric {
    color: hsl(29, 94%, 65%);
}
.ace-moon-dark .ace_constant.ace_character {
    color: hsl(29, 94%, 65%);
}
.ace-moon-dark .ace_constant.ace_character.ace_escape {
    color: hsl(257, 100%, 60%);
}
.ace-moon-dark .ace_constant.ace_other {
    color: hsl(29, 94%, 65%);
}
.ace-moon-dark .ace_support.ace_function {
    color: hsl(210, 100%, 55%);
}
.ace-moon-dark .ace_support.ace_constant {
    color: hsl(210, 80%, 55%);
    font-weight: 700;
}
.ace-moon-dark .ace_support.ace_class {
    font-style: italic;
    color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_support.ace_type {
    font-style: italic;
    color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_storage {
    color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_storage.ace_type {
    font-style: italic;
    color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_invalid {
    color: hsl(60, 36%, 96%);
    background-color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_invalid.ace_deprecated {
    color: hsl(60, 36%, 96%);
    background-color: hsl(29, 94%, 65%);
}
.ace-moon-dark .ace_string {
    color: hsl(140, 100%, 65%);
}
.ace-moon-dark .ace_comment {
    color: hsl(223, 14%, 60%);
}
.ace-moon-dark .ace_variable {
    color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_variable.ace_parameter {
    font-style: italic;
    color: hsl(10, 100%, 65%);
}
.ace-moon-dark .ace_entity.ace_other.ace_attribute-name {
    color: hsl(0, 94%, 65%);
}
.ace-moon-dark .ace_entity.ace_name.ace_function {
    color: hsl(210, 80%, 55%);
    font-weight: 700;
}
.ace-moon-dark .ace_entity.ace_name.ace_tag {
    color: hsl(210, 80%, 55%);
    font-weight: 700;
}
.ace-moon-dark .ace_invisible {
    color: hsl(223, 13%, 44%);
}
.ace-moon-dark .ace_indent-guide {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHB3d/8PAAOIAdULw8qMAAAAAElFTkSuQmCC) right repeat-y
}`;
exports.$selectionColorConflict = true;

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});                (function() {
                    ace.require(["ace/theme/moon-dark"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();