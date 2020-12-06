ace.define("ace/mode/moge", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
	"use strict";

	var oop = require("../lib/oop");
	var TextMode = require("./text").Mode;
	var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

	var MogeHighlightRules = function () {
		// regexp must not have capturing parentheses. Use (?:) instead.
		// regexps are ordered -> the first match is used

		this.$rules = {
			start: [{
				include: "#structures"
			}],
			"#structures": [{
				token: "keyword.begin.separator",
				regex: /\|/,
				push: [{
					token: "keyword.end.separator",
					regex: /\|/,
					next: "pop"
				}, {
					token: "entity.name.function.separator",
					regex: /./
				}, {
					defaultToken: "meta.struct.separator"
				}]
			}, {
				token: ["keyword.note", "meta.struct.note"],
				regex: /(\+)(\s\[)/,
				push: [{
					token: "meta.struct.note",
					regex: /\]/,
					next: "pop"
				}, {
					include: "#substructures"
				}, {
					token: "string.parameter.note",
					regex: /./
				}, {
					defaultToken: "meta.struct.note"
				}]
			}, {
				token: [
					"keyword.media",
					"meta.struct.media",
					"entity.name.function.media",
					"meta.struct.media"
				],
				regex: /(\@)(\s)(.+)(\s*\()/,
				push: [{
					token: "meta.struct.media",
					regex: /\)/,
					next: "pop"
				}, {
					token: [
						"parameter.media",
						"constant.language.media",
						"parameter.media",
						"string.path.media",
						"parameter.media"
					],
					regex: /(\s*)(video|image)(\s*,\s*)([^\)]+)(\s*)/
				}, {
					defaultToken: "meta.struct.media"
				}]
			}, {
				token: [
					"keyword.block",
					"meta.struct.block",
					"entity.name.function.block",
					"meta.struct.block"
				],
				regex: /(\!)(\s)(.+)(\s*\{)/,
				push: [{
					token: "meta.struct.block",
					regex: /\}/,
					next: "pop"
				}, {
					include: "#structures"
				}, {
					defaultToken: "meta.struct.block"
				}]
			}],
			"#substructures": [{
				token: "keyword.begin.link",
				regex: /\#\</,
				push: [{
					token: "keyword.end.link",
					regex: /\>\#/,
					next: "pop"
				}, {
					token: "punctuation.comma.link",
					regex: /,/
				}, {
					token: "string.parameter.link",
					regex: /./
				}, {
					defaultToken: "meta.substruct.link"
				}]
			}, {
				token: "keyword.begin.list",
				regex: /\:\</,
				push: [{
					token: "keyword.end.list",
					regex: /\>\:/,
					next: "pop"
				}, {
					token: "punctuation.comma.list",
					regex: /,/
				}, {
					token: "string.parameter.list",
					regex: /./
				}, {
					defaultToken: "meta.substruct.list"
				}]
			}]
		}

		this.normalizeRules();
	};

	MogeHighlightRules.metaData = {
		"$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
		name: "Moge",
		scopeName: "source.moge"
	}

	oop.inherits(MogeHighlightRules, TextHighlightRules);

	var Mode = function () {
		this.HighlightRules = MogeHighlightRules;
	};
	oop.inherits(Mode, TextMode);

	(function () {
		// this.lineCommentStart = ""//"";
		// this.blockComment = {start: ""/*"", end: ""*/""};
		// Extra logic goes here.
		this.$id = "ace/mode/moge"
	}).call(Mode.prototype);

	module.exports.Mode = Mode;
});