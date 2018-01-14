/*
@license
Webix SpreadSheet v.3.4.0
This software is covered by Webix Commercial License.
Usage without proper license is prohibited.
(c) XB Software Ltd.
*/
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/codebase/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(1);
	
	__webpack_require__(2);
	
	var _toolbar = __webpack_require__(9);
	
	var bar = _interopRequireWildcard(_toolbar);
	
	var _styles = __webpack_require__(10);
	
	var stl = _interopRequireWildcard(_styles);
	
	var _table = __webpack_require__(11);
	
	var tbl = _interopRequireWildcard(_table);
	
	var _hotkeys = __webpack_require__(22);
	
	var key = _interopRequireWildcard(_hotkeys);
	
	var _resize = __webpack_require__(23);
	
	var rsz = _interopRequireWildcard(_resize);
	
	var _spans = __webpack_require__(24);
	
	var spn = _interopRequireWildcard(_spans);
	
	var _undo = __webpack_require__(25);
	
	var und = _interopRequireWildcard(_undo);
	
	var _live_editor = __webpack_require__(26);
	
	var led = _interopRequireWildcard(_live_editor);
	
	__webpack_require__(29);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	webix.protoUI({
		name: "spreadsheet",
		_base_index: { count: 1 },
		defaults: {
			spans: true,
			rowCount: 50,
			columnCount: 20,
			columnOperation: false
		},
		$init: function $init(obj) {
			this.$index = this._base_index.count++;
			this.$view.className += " webix_ssheet";
	
			this.$ready.unshift(this._sub_init);
			this.$ready.push(this._set_handlers);
		},
		formatHelpers: {
			price: function price(value) {
				return webix.i18n.priceFormat(value);
			},
			"int": function int(value) {
				return webix.i18n.numberFormat(value);
			},
			percent: function percent(value) {
				return Math.round(value * 100) + "%";
			}
		},
		_sub_init: function _sub_init() {
			var obj = this.config;
			var rows = [];
	
			//toolbars
			if (!obj.readonly || obj.toolbar === false) rows.push(bar.init(this));
			if (obj.subbar) rows.push(obj.subbar);
			if (obj.liveEditor) rows.push(led.init(this));
	
			//data part
			rows.push(tbl.init(this, {
				editable: !obj.readonly,
				spans: true,
				clipboard: obj.clipboard
			}));
	
			this.rows_setter(rows);
		},
		_set_handlers: function _set_handlers() {
			var _this = this;
	
			//prevent double init
			if (this._table) return;
	
			//set sizes for the table
			tbl.reset(this, this.config.columnCount, this.config.rowCount);
			stl.init(this); //styles
			key.init(this); //keyboard shortcuts
			rsz.init(this); //resizers
			und.init(this); //undo/redo
	
			this._table = this.$$("cells");
			this._table.attachEvent("onAfterAreaAdd", function () {
				return _this.callEvent("onAfterSelect", [_this.getSelectedId(true)]);
			});
	
			this.callEvent("onComponentInit", []);
	
			//span must be loaded last, as they depends on already loaded data
			spn.init(this);
		},
		$onLoad: function $onLoad(obj, driver) {
			//when loading data by data:, we can get $onLoad before _set_handlers call
			this._set_handlers();
	
			if (obj.excel) {
				var options = obj.options || {};
				options.math = this.config.math;
	
				obj = driver.getSheet(obj, options);
				obj = this._excel_to_data(obj);
			}
	
			var rows = Math.max(this.config.rowCount, obj.data.length);
			var cols = obj.data[0] ? Math.max(this.config.columnCount, obj.data[0].length) : this.config.columnCount;
	
			if (rows != this.config.rowCount || cols != this.config.columnCount) {
				this.config.rowCount = rows;
				this.config.columnCount = cols;
				tbl.reset(this);
			}
	
			this.callEvent("onDataParse", [obj]);
			this._table.refresh();
		},
		serialize: function serialize(config) {
			var obj = {};
			this.callEvent("onDataSerialize", [obj, config]);
			return obj;
		},
		_excel_to_data: function _excel_to_data(obj) {
			var dataObj = webix.copy(obj.data || obj);
			var data = [];
	
			for (var i = 0; i < dataObj.length; i++) {
				for (var c = 0; c < dataObj[0].length; c++) {
					var row = i + 1,
					    column = c + 1;
					data.push([row, column, dataObj[i][c]]);
				}
			}
	
			if (obj.spans) for (var i = 0; i < obj.spans.length; i++) {
				obj.spans[i][0]++;
				obj.spans[i][1]++;
			}
	
			if (obj.data) obj.data = data;else obj = { data: data };
			return obj;
		},
		refresh: function refresh(all) {
			if (all) this._table.refreshColumns();else this._table.refresh();
		},
		eachSelectedCell: function eachSelectedCell(cb) {
			var cells = this.getSelectedId(true);
			for (var i = 0; i < cells.length; i++) {
				cb.call(this, cells[i]);
			}
		},
		getSelectedId: function getSelectedId(all) {
			var area = this._table.getSelectArea();
			if (!all) return area && area.start.row ? area.start : null;
	
			var selection = [];
			if (area) {
				var c0 = area.start;
				var c1 = area.end;
	
				for (var i = c0.row; i <= c1.row; i++) {
					for (var j = c0.column; j <= c1.column; j++) {
						selection.push({ row: i, column: j });
					}
				}
			}
	
			return selection;
			//return this._table.getSelectedId(all)
		},
		getCellValue: function getCellValue(row, column) {
			var item = this.getRow(row);
			return item["$" + column] || item[column];
		},
		setCellValue: function setCellValue(row, column, value) {
			var item = this.getRow(row);
			item[column] = value;
			delete item["$" + column];
	
			this.callEvent("onCellChange", [row, column, value, true]);
			this.saveCell(row, column);
		},
		$exportView: function $exportView(options) {
			webix.extend(options, { header: false, rawValues: true, spans: true, xCorrection: 1, yCorrection: 1 });
			return this._table;
		},
		getRow: function getRow(id) {
			return this._table.getItem(id);
		},
		getColumn: function getColumn(id) {
			return this._table.getColumnConfig(id);
		},
		getStyle: function getStyle(row, column) {
			return stl.getStyle(this, { row: row, column: column });
		},
		setStyle: function setStyle(row, column, style) {
			return stl.setStyle(this, { row: row, column: column }, style);
		},
		combineCells: function combineCells(range) {
			if (!range) {
				var sel = this.getSelectedId(true);
				if (sel.length > 1) {
					range = spn.getRange(sel);
				}
			}
			if (range && this.callEvent("onBeforeSpan", [range.cell.row, range.cell.column, [range.x, range.y]])) spn.addSpan(this, range.cell, range.x, range.y);
			this.refresh();
		},
		splitCell: function splitCell(row, column) {
			if (row && column) {
				spn.removeSpan(this, { row: row, column: column });
			} else {
				var group = webix.uid();
				this.eachSelectedCell(function (cell) {
					var span = this._table.getSpan(cell.row, cell.column);
					if (span && this.callEvent("onBeforeSplit", [cell.row, cell.column, [span[2], span[3]], group])) {
						spn.removeSpan(this, cell);
					}
				});
			}
	
			this.refresh();
		},
		_save: function _save(name, data) {
			var save = this.config.save;
			var url = "";
			if (typeof save === "string") url = save + "/" + name;else if (save && save[name]) url = save[name];
	
			if (url) {
				if (url.$proxy && url.save) url.save(this, data, null, null);else webix.ajax().post(url, data);
			}
		},
		saveCell: function saveCell(row, column) {
			var style = this.getStyle(row, column);
	
			this._save("data", {
				row: row,
				column: column,
				value: this.getCellValue(row, column),
				style: style ? style.id : ""
			});
		},
		reset: function reset(config) {
			this.callEvent("onReset", [config]);
		},
		undo: function undo() {
			und.undo(this);
		},
		redo: function redo() {
			und.redo(this);
		}
	}, webix.AtomDataLoader, webix.IdSpace, webix.ui.layout);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	webix.i18n.spreadsheet = {
	    labels: {
	        // formats
	        common: "Common",
	        currency: "Currency",
	        number: "Number",
	        percent: "Percent",
	        // titles
	        "undo": "Undo/Redo",
	        "font": "Font",
	        "text": "Text",
	        "cell": "Cell",
	        "align": "Align",
	        "format": "Format",
	        "column": "Column",
	        "px": "px"
	    },
	    tooltips: {
	        "color": "Font color",
	        "background": "Background color",
	        "font-family": "Font family",
	        "font-size": "Font size",
	        "text-align": "Horizontal align",
	        "vertical-align": "Vertical align",
	        "borders": "Borders",
	        "borders-no": "Clear borders",
	        "borders-left": "Left border",
	        "borders-top": "Top border",
	        "borders-right": "Right border",
	        "borders-bottom": "Bottom border",
	        "borders-all": "All borders",
	        "borders-outer": "Outer borders",
	        "borders-top-bottom": "Top and bottom borders",
	        "borders-color": "Border color",
	        "align-left": "Left align",
	        "align-center": "Center align",
	        "align-right": "Right align",
	        "align-top": "Top align",
	        "align-middle": "Middle align",
	        "align-bottom": "Bottom align",
	        "span": "Merge",
	        "wrap": "Text wrap",
	        "undo": "Undo",
	        "redo": "Redo",
	        "format": "Format",
	        "font-weight": "Bold",
	        "font-style": "Italic",
	        "text-decoration": "Underline"
	    },
	    menus: {
	        "add_row": "Insert Row",
	        "del_row": "Delete Row",
	        "show_row": "Show Row",
	        "hide_row": "Hide Row",
	        "add_column": "Insert Column",
	        "del_column": "Delete Column",
	        "show_column": "Show Column",
	        "hide_column": "Hide Column"
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(3);

	__webpack_require__(4);

	__webpack_require__(5);

	__webpack_require__(6);

	__webpack_require__(7);

	__webpack_require__(8);

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	webix.protoUI({
	    name: "ssheet-borders-suggest",
	    defaults: {
	        width: 300
	    },
	    $init: function $init(config) {
	        config.body = {
	            margin: 6,
	            cols: [{ view: "dataview", css: "webix_ssheet_dataview", borderless: true, scroll: false, select: true,
	                xCount: 4,
	                yCount: 2,
	                on: {
	                    onAfterSelect: function onAfterSelect(id) {
	                        var suggest = this.getParentView().getParentView();
	                        suggest.updateMasterValue(true);
	                    }
	                },
	                type: {
	                    width: 36,
	                    height: 36,
	                    template: function template(obj) {
	                        var css = "webix_ssheet_button_icon webix_ssheet_icon_borders_" + obj.value;
	                        var title = webix.i18n.spreadsheet.tooltips["borders-" + obj.id];
	                        return "<div title='" + title + "'><span class='" + css + "'></span></div>";
	                    }
	                },
	                data: config.data
	            }, { view: "ssheet-separator" }, {
	                rows: [{ view: "ssheet-colorpicker", css: config.css, name: config.name, width: 62,
	                    tooltip: webix.i18n.spreadsheet.tooltips["borders-color"],
	                    title: "<span class='webix_icon fa-pencil'></span>",
	                    on: {
	                        onChange: function onChange() {
	                            var suggest = this.getParentView().getParentView().getParentView();
	                            suggest.updateMasterValue(false);
	                        }
	                    }
	                }, {}]
	            }]
	        };
	    },
	    updateMasterValue: function updateMasterValue(hide) {
	        var value = this.getValue();
	        var master = webix.$$(this.config.master);
	        master.setValue(value);
	        if (hide) this.hide();
	    },
	    setValue: function setValue(value) {
	        if (value[0]) this.getList().select(value[0]);
	        if (value[1]) this.getColorView().setValue(value[1]);
	    },
	    getValue: function getValue() {
	        return [this.getList().getSelectedId(), this.getColorView().getValue() || ""];
	    },
	    getList: function getList() {
	        return this.getBody().getChildViews()[0];
	    },
	    getColorView: function getColorView() {
	        return this.getBody().getChildViews()[2].getChildViews()[0];
	    }
	}, webix.ui.suggest);
	
	webix.protoUI({
	    name: "ssheet-borders",
	    $cssName: "richselect",
	    defaults: {
	        text: "<span class='webix_ssheet_button_icon webix_ssheet_icon_borders'>"
	    },
	    $init: function $init(config) {
	        config.options = {
	            view: "ssheet-borders-suggest",
	            fitMaster: false,
	            data: config.data
	        };
	
	        this.$ready.push(webix.bind(function () {
	            this.getPopup().config.master = this.config.id;
	        }, this));
	    },
	    setValue: function setValue(value) {
	        if (webix.isArray(value)) {
	            if (!this.config.value || value[0] != this.config.value[0] || value[1] != this.config.value[1]) {
	                this.getPopup().setValue(value);
	            }
	            this.config.value = value;
	            if (value[0]) this.callEvent("onChange");
	        }
	        return value;
	    },
	    getValue: function getValue() {
	        return this.getPopup().getValue().join(",");
	    },
	    getList: function getList() {
	        return this.getPopup().getBody().getChildViews()[0];
	    },
	    getColorView: function getColorView() {
	        return this.getPopup().getBody().getChildViews()[1].getChildViews()[0];
	    }
	}, webix.ui.richselect);

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	// toolbar: color selector
	webix.protoUI({
	    $cssName: "colorboard",
	    name: "ssheet-colorboard",
	    setValue: function setValue(value) {
	        if (!value) return;
	        if (value.charAt(0) != "#") value = '#' + value;
	
	        this.config.value = value;
	        this.drawSelection(value);
	
	        return value;
	    },
	    drawSelection: function drawSelection(value, cell) {
	        if (this.isVisible(this.config.id)) {
	            var elems = this.$view.lastChild.getElementsByTagName("DIV");
	            for (var i = 0; i < elems.length; i++) {
	                var color = elems[i].getAttribute("webix_val");
	                if (color) {
	                    if (color.toUpperCase() != value.toUpperCase()) {
	                        webix.html.removeCss(elems[i], "webix_selected");
	                    } else webix.html.addCss(elems[i], "webix_selected", "");
	                }
	            }
	        }
	    }
	}, webix.ui.colorboard);
	
	webix.protoUI({
	    $cssName: "richselect",
	    name: "ssheet-colorpicker",
	    defaults: {
	        css: "webix_ssheet_colorpicker",
	        icon: "angle-down",
	        suggest: {
	            height: 202,
	            borderless: true,
	            body: {
	                view: "ssheet-colorboard",
	                css: "webix_ssheet_colorboard",
	                palette: [["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"], ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"], ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"], ["#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47"], ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"]],
	                on: {
	                    onSelect: function onSelect(value) {
	                        this.getParentView().setMasterValue({ value: value });
	                    }
	                }
	            }
	        }
	    },
	    $init: function $init() {
	        this.$view.className += " webix_ssheet_colorpicker";
	    },
	    $renderInput: function $renderInput(config, divStart, id) {
	        var color = this.renderColor.call(this);
	        divStart = divStart.replace(/([^>]>)(.*)(<\/div)/, function (match, p1, p2, p3) {
	            return p1 + config.title + color + p3;
	        });
	
	        return webix.ui.colorpicker.prototype.$renderInput.call(this, config, divStart, id);
	    },
	    $setValue: function $setValue(value) {
	        var popup = webix.$$(this.config.popup.toString());
	        var colorboard = popup.getBody();
	        if (value) {
	            colorboard.setValue(value);
	            this.config.value = value;
	            this.getColorNode().style.backgroundColor = value;
	        }
	    },
	    renderColor: function renderColor() {
	        return "<div class='webix_ssheet_cp_color' style='background-color:" + this.config.value + ";'> </div>";
	    },
	    getColorNode: function getColorNode() {
	        return this.$view.firstChild.firstChild.childNodes[1];
	    },
	    $renderIcon: function $renderIcon() {
	        return webix.ui.richselect.prototype.$renderIcon.apply(this, arguments);
	    }
	}, webix.ui.colorpicker);

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	webix.protoUI({
	    name: "ssheet-align",
	    $cssName: "richselect",
	    $init: function $init(config) {
	        config.options = {
	            view: "datasuggest",
	            css: "webix_ssheet_dataview",
	
	            body: {
	                borderless: true,
	                tooltip: {
	                    template: "#tooltip#"
	                },
	                xCount: 3, yCount: 1,
	                type: {
	                    width: 36,
	                    height: 36
	                }
	            },
	            data: config.data
	        };
	    }
	}, webix.ui.richselect);

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	// toolbar: toogle button
	webix.protoUI({
	    $cssName: "toggle",
	    name: "ssheet-toggle",
	    toggle: function toggle() {
	        var value = this.getValue() == this.config.onValue ? true : false;
	        this.setValue(!value);
	    },
	    getValue: function getValue() {
	        var config = this.config;
	        var value = config.value;
	        return !value ? config.offValue || false : config.onValue || true;
	    },
	    defaults: {
	        template: function template(obj, common) {
	            var css = obj.value === true || obj.value == obj.onValue ? " webix_pressed" : "";
	            var inp = common.$renderInput(obj, common);
	            return "<div class='webix_el_box" + css + "' style='width:" + obj.awidth + "px; height:" + obj.aheight + "px'>" + inp + "</div>";
	        }
	    }
	}, webix.ui.toggle);

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	webix.protoUI({
	    name: "ssheet-separator",
	    defaults: {
	        css: "webix_ssheet_toolbar_spacer",
	        template: " ",
	        width: 1,
	        borderless: true
	    }
	}, webix.ui.view);

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	webix.protoUI({
	    name: "ssheet-column",
	    $cssName: "richselect",
	    defaults: {
	        command: true, //trigger command only
	        width: 70,
	        text: "<span class='webix_ssheet_button_icon webix_ssheet_icon_borders'>"
	    },
	    $init: function $init(config) {
	        config.options = {
	            fitMaster: false,
	            body: {
	                view: "list",
	                on: {
	                    onItemClick: function onItemClick(id) {
	                        var view = this.getTopParentView();
	                        view.callEvent("onCommand", [id, null]);
	                    }
	                },
	                css: "webix_ssheet_column__selected",
	                data: config.data,
	                width: 150
	            }
	        };
	    },
	    $setValue: function $setValue() {
	        return "";
	    }
	}, webix.ui.richselect);

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.init = init;
	// default styles for toolbar elements
	var defaultStyles = {
	    "color": "#000000",
	    "background": "#ffffff",
	    "font-family": "'PT Sans', Tahoma",
	    "font-size": "15px",
	    "text-align": "left",
	    "vertical-align": "top",
	    "white-space": "nowrap",
	    "borders": ["no", "#434343"]
	};
	
	// options for 'font-family' select
	var _fontFamily = [{ id: "Arial", value: "Arial" }, { id: "'PT Sans', Tahoma", value: "PT Sans" }, { id: "Tahoma", value: "Tahoma" }, { id: "Verdana", value: "Verdana" }];
	
	// options for 'format' select
	function getCellFormats() {
	    return [{ id: "-1", value: webix.i18n.spreadsheet.labels.common }, { id: "price", value: webix.i18n.spreadsheet.labels.currency, example: "98.20" }, { id: "int", value: webix.i18n.spreadsheet.labels.number, example: "2120.02" }, { id: "percent", value: webix.i18n.spreadsheet.labels.percent, example: "0.5" }];
	}
	
	function getColumnOperation() {
	    return [{ id: "add_row", value: webix.i18n.spreadsheet.menus.add_row }, { id: "del_row", value: webix.i18n.spreadsheet.menus.del_row }, { id: "show_row", value: webix.i18n.spreadsheet.menus.show_row }, { id: "hide_row", value: webix.i18n.spreadsheet.menus.hide_row }, { id: "add_column", value: webix.i18n.spreadsheet.menus.add_column }, { id: "del_column", value: webix.i18n.spreadsheet.menus.del_column }, { id: "show_column", value: webix.i18n.spreadsheet.menus.show_column }, { id: "hide_column", value: webix.i18n.spreadsheet.menus.hide_column }];
	}
	// options for 'borders' select
	var _borders = [{ id: "no", value: "no" }, { id: "left", value: "left" }, { id: "top", value: "top" }, { id: "right", value: "right" }, { id: "bottom", value: "bottom" }, { id: "all", value: "all" }, { id: "outer", value: "outer" }, { id: "top-bottom", value: "top_bottom" }];
	
	// options for 'font-size' select
	function getFontSize() {
	    var numbers = ["8", "9", "10", "11", "12", "14", "15", "16", "18", "20", "22", "24", "28", "36"];
	    var fontSize = [];
	
	    for (var i = 0; i < numbers.length; i++) {
	        fontSize.push({ id: numbers[i] + webix.i18n.spreadsheet.labels.px, value: numbers[i] });
	    }
	    return fontSize;
	}
	
	var toolbarSizes = {
	    height: 39,
	    margin: 7,
	    paddingY: 1,
	    sectorPadding: 5,
	    sectorMargin: 0
	};
	
	var buttons = {
	    "undo": ["undo", "redo"],
	    "font": ["font-family", "font-size"],
	    "text": ["font-weight", "font-style", "text-decoration", "color"],
	    "cell": ["background", "borders", "span"],
	    "align": ["text-align", "vertical-align", "wrap"],
	    "format": ["format"]
	};
	
	var ui = {
	    "toolbarElements": function toolbarElements(view, structure) {
	        var config = [];
	        for (var block in structure) {
	            config.push(ui.elementsBlock(view, block, structure[block]));
	            config.push(ui.separator());
	        }
	        return config;
	    },
	    "elementsBlock": function elementsBlock(view, name, columns) {
	        var block = {
	            rows: [{
	                padding: 2,
	                cols: [{
	                    height: toolbarSizes.height,
	                    margin: 2,
	                    cols: ui.blockColumns(view, columns)
	                }]
	            }, ui.title({ title: name })]
	        };
	        return block;
	    },
	    "blockColumns": function blockColumns(view, buttons) {
	        var cols = [];
	        for (var i = 0; i < buttons.length; i++) {
	            if (_typeof(buttons[i]) == "object") {
	                cols.push(buttons[i]);
	            } else if (buttonsMap[buttons[i]]) {
	                cols.push(buttonsMap[buttons[i]](view));
	            }
	        }
	        return cols;
	    },
	    button: function button(config) {
	        return {
	            view: "ssheet-toggle", width: config.width || 40, id: config.name, name: config.name, label: config.label,
	            css: config.css || "", onValue: config.onValue, offValue: config.offValue,
	            tooltip: webix.i18n.spreadsheet.tooltips[config.name] || ""
	        };
	    },
	    colorButton: function colorButton(config) {
	        return {
	            view: "ssheet-colorpicker", css: config.css, name: config.name, width: config.width || 62,
	            title: "<span class='webix_ssheet_button_icon webix_ssheet_color_button_icon webix_ssheet_icon_" + config.name + "' ></span>",
	            tooltip: webix.i18n.spreadsheet.tooltips[config.name] || ""
	        };
	    },
	    iconButton: function iconButton(config) {
	        var btn = webix.copy(config);
	        webix.extend(btn, { view: "button", type: "htmlbutton", width: 40, id: config.name,
	            label: "<span class='webix_ssheet_button_icon webix_ssheet_icon_" + config.name + "'></span>",
	            css: "",
	            tooltip: webix.i18n.spreadsheet.tooltips[config.name] || ""
	        });
	        if (config.onValue) {
	            webix.extend(btn, { view: "ssheet-toggle", onValue: config.onValue, offValue: config.offValue }, true);
	        }
	
	        return btn;
	    },
	    segmented: function segmented(config) {
	        return {
	            view: "segmented", name: config.name, css: config.css || "", width: config.width || 115, options: config.options
	        };
	    },
	    select: function select(config) {
	        webix.extend(config, {
	            view: "richselect",
	            id: config.name,
	            value: defaultStyles[config.name],
	            suggest: {
	                css: "webix_ssheet_suggest",
	                fitMaster: false,
	                padding: 0,
	                data: config.options
	            }
	        });
	
	        config.tooltip = webix.i18n.spreadsheet.tooltips[config.name] || "";
	        config.suggest.width = config.popupWidth || config.width;
	        if (config.popupTemplate) config.suggest.body = {
	            template: config.popupTemplate
	        };
	        return config;
	    },
	    separator: function separator() {
	        return {
	            view: "ssheet-separator"
	        };
	    },
	    title: function title(config) {
	        var title = config.title;
	        if (title.indexOf("$") === 0) title = "";
	        title = webix.i18n.spreadsheet.labels[config.title] || title;
	
	        return {
	            template: title, height: config.height || 24, css: "webix_ssheet_subbar_title",
	            borderless: true
	        };
	    },
	    borders: function borders(config) {
	        return { view: "ssheet-borders", width: config.width || 62, data: _borders, id: config.name, name: config.name,
	            tooltip: webix.i18n.spreadsheet.tooltips[config.name] };
	    },
	    align: function align(config) {
	        return { view: "ssheet-align", value: defaultStyles[config.name], width: config.width || 62, data: config.options,
	            name: config.name, tooltip: webix.i18n.spreadsheet.tooltips[config.name] };
	    },
	    column: function column(config) {
	        return {
	            view: "ssheet-column",
	            data: config.data,
	            id: config.name,
	            name: config.name
	        };
	    }
	};
	
	var actions = {
	    span: function span(view) {
	        var range = view.$$("cells").getSelectArea();
	        if (range) {
	            if (isMerged(view, range)) {
	                view.splitCell();
	            } else {
	                view.combineCells();
	            }
	        }
	    },
	    undo: function undo(view) {
	        view.undo();
	    },
	    redo: function redo(view) {
	        view.redo();
	    }
	};
	
	function isMerged(view, range) {
	    var i,
	        j,
	        c0 = range.start,
	        c1 = range.end;
	
	    for (i = c0.row * 1; i <= c1.row * 1; i++) {
	        for (j = c0.column * 1; j <= c1.column * 1; j++) {
	            if (view.$$("cells").getSpan(i, j)) return true;
	        }
	    }
	    return false;
	}
	
	var buttonsMap = {
	    "undo": function undo() {
	        return ui.iconButton({ name: "undo" });
	    },
	    "redo": function redo() {
	        return ui.iconButton({ name: "redo" });
	    },
	    "font-family": function fontFamily() {
	        return ui.select({ name: "font-family", tooltip: "Font family", options: _fontFamily, width: 100 });
	    },
	    "font-size": function fontSize() {
	        return ui.select({ name: "font-size", tooltip: "Font size", options: getFontSize(), width: 62 });
	    },
	    "font-weight": function fontWeight() {
	        return ui.button({ name: "font-weight", label: "B", css: "webix_ssheet_bold",
	            tooltip: "Bold", onValue: "bold", offValue: "normal" });
	    },
	    "font-style": function fontStyle() {
	        return ui.button({ name: "font-style", label: "I", css: "webix_ssheet_italic",
	            tooltip: "Italic", onValue: "italic", offValue: "normal" });
	    },
	    "text-decoration": function textDecoration() {
	        return ui.button({ name: "text-decoration", label: "U", css: "webix_ssheet_underline",
	            tooltip: "Underline", onValue: "underline", offValue: "normal" });
	    },
	    "color": function color() {
	        return ui.colorButton({ name: "color", icon: "font", css: "webix_ssheet_color" });
	    },
	    "background": function background() {
	        return ui.colorButton({ name: "background", icon: "paint-brush", css: "webix_ssheet_background" });
	    },
	    "borders": function borders() {
	        return ui.borders({ name: "borders" });
	    },
	    "span": function span() {
	        return ui.iconButton({ name: "span" });
	    },
	    "text-align": function textAlign() {
	        var locale = webix.i18n.spreadsheet.tooltips;
	        return ui.align({ name: "text-align", tooltip: "Horizontal Align", css: "webix_ssheet_align", options: [{ id: "left", value: "<span class='webix_ssheet_button_icon webix_ssheet_icon_left'></span>", tooltip: locale["align-left"] }, { id: "center", value: "<span class='webix_ssheet_button_icon webix_ssheet_icon_center' ></span>", tooltip: locale["align-center"] }, { id: "right", value: "<span class='webix_ssheet_button_icon webix_ssheet_icon_right' ></span>", tooltip: locale["align-right"] }] });
	    },
	    "vertical-align": function verticalAlign() {
	        var locale = webix.i18n.spreadsheet.tooltips;
	        return ui.align({ name: "vertical-align", tooltip: "Vertical Align", css: "webix_ssheet_align", options: [{ id: "top", value: "<span class='webix_ssheet_button_icon webix_ssheet_icon_top' ></span>", tooltip: locale["align-top"] }, { id: "middle", value: "<span class='webix_ssheet_button_icon webix_ssheet_icon_middle'></span>", tooltip: locale["align-middle"] }, { id: "bottom", value: "<span class='webix_ssheet_button_icon webix_ssheet_icon_bottom'></span>", tooltip: locale["align-bottom"] }] });
	    },
	    "wrap": function wrap() {
	        return ui.iconButton({ name: "wrap", onValue: "wrap", offValue: "nowrap" });
	    },
	    "format": function format(view) {
	        return ui.select({
	            name: "format", tooltip: "Cell data format", options: getCellFormats(), width: 100,
	            popupWidth: 150,
	            popupTemplate: function popupTemplate(obj) {
	                var format = view.formatHelpers[obj.id];
	                return obj.value + (format ? "<span class='webix_ssheet_right'>" + format(obj.example) + "</span>" : "");
	            }
	        });
	    },
	    "column": function column(view) {
	        return ui.column({
	            data: getColumnOperation()
	        });
	    }
	};
	
	function init(view) {
	    view.attachEvent("onComponentInit", function () {
	        return ready(view);
	    });
	
	    var bar = {
	        view: "toolbar",
	        css: "webix_ssheet_toolbar webix_layout_toolbar",
	        id: "bar",
	        padding: 0,
	        elements: ui.toolbarElements(view, view.config.buttons || buttons),
	        on: {
	            onChange: function onChange() {
	                var source = this.$eventSource;
	                var value = source.getValue();
	                var name = source.config.name;
	
	                view.callEvent("onStyleSet", [name, value]);
	            },
	            onItemClick: function onItemClick(id) {
	                var viewId = view.innerId(id);
	                if (actions[viewId]) {
	                    actions[viewId].call(this, view);
	                }
	            }
	        }
	    };
	    view.callEvent("onViewInit", ["toolbar", bar]);
	    return bar;
	}
	
	function ready(view) {
	    view.attachEvent("onAfterSelect", function (selected) {
	        return setValues(view, selected);
	    });
	}
	
	function setValues(view, selected) {
	    var styles = {};
	    var cell = selected[0];
	    if (cell) {
	        var obj = view.getStyle(cell.row, cell.column);
	        if (obj) styles = obj.props;
	    }
	
	    webix.extend(styles, defaultStyles);
	    view.$$("bar").setValues(styles);
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.getStyle = getStyle;
	exports.setStyle = setStyle;
	//do not change order, it will break server side compatibility
	//add new options to the end of this list
	var _style_names = ["color", "background", "text-align", "font-family", "font-size", "font-style", "text-decoration", "font-weight", "vertical-align", "wrap", "borders", "format", "border-right", "border-bottom", "border-left", "border-top"];
	
	var _style_map = {
		"vertical-align": {
			"top": function top(obj) {
				return "display: block;";
			},
			"middle": function middle(obj) {
				var align = "flex-start";
				if (obj["text-align"] == "center") align = "center";else if (obj["text-align"] == "right") align = "flex-end";
				var result = "display: flex; align-items: center;justify-content:" + align + ";";
				return result;
			},
			"bottom": function bottom(obj) {
				var align = "flex-start";
				if (obj["text-align"] == "center") align = "center";else if (obj["text-align"] == "right") align = "flex-end";
				var result = "display: flex; align-items:flex-end;justify-content:" + align + ";";
				return result;
			}
		},
		"wrap": {
			"wrap": function wrap(obj) {
				return "white-space: normal !important;";
			},
			"nowrap": function nowrap(obj) {
				return "";
			}
		},
		"format": "",
		"borders": "",
		"border-left": function borderLeft(obj) {
			if (obj["border-left"]) return "border-left: 1px solid " + obj["border-left"] + " !important;";
			return "";
		},
		"border-top": function borderTop(obj) {
			if (obj["border-top"]) return "border-top: 1px solid " + obj["border-top"] + " !important;";
			return "";
		},
		"border-right": function borderRight(obj) {
			if (obj["border-right"]) return "border-right-color: " + obj["border-right"] + " !important;";
			return "";
		},
		"border-bottom": function borderBottom(obj) {
			if (obj["border-bottom"]) return "border-bottom-color: " + obj["border-bottom"] + " !important;";
			return "";
		}
	};
	
	var border_checks = {
		"border-left": function borderLeft(cell, area, mode) {
			return cell.column == area.start.column;
		},
		"border-right": function borderRight(cell, area, mode) {
			return cell.column == area.end.column || mode == "all" || mode == "no";
		},
		"border-top": function borderTop(cell, area, mode) {
			return cell.row == area.start.row;
		},
		"border-bottom": function borderBottom(cell, area, mode) {
			return cell.row == area.end.row || mode == "all" || mode == "no";
		}
	};
	
	var _style_handlers = {
		"borders": function borders(view, style, value, cell) {
			var area = view.$$("cells").getSelectArea();
			value = value.split(",");
			var type = value[0];
			var color = value[1];
	
			var modes = ["border-left", "border-right", "border-bottom", "border-top"];
	
			if (type == "no") color = "";else if (type == "top-bottom") {
				modes = ["border-top", "border-bottom"];
			} else if (type != "all" && type != "outer") modes = ["border-" + type];
	
			for (var i = 0; i < modes.length; i++) {
				var mode = modes[i];
				if (border_checks[mode](cell, area, type)) style = _updateStyle(view, style, mode, color, cell);
			}
	
			return style;
		}
	};
	
	function init(view) {
		view.attachEvent("onStyleSet", function (name, value) {
			return _applyStyles(view, name, value);
		});
		view.attachEvent("onDataParse", function (data) {
			return _parse(view, data);
		});
		view.attachEvent("onDataSerialize", function (data) {
			return _serialize(view, data);
		});
		view.attachEvent("onReset", function (columns, rows) {
			return reset(view);
		});
		view.attachEvent("onUndo", function (type, row, column, style) {
			if (type == "style") _undoStyle(view, row, column, style);
		});
		reset(view);
	}
	
	function reset(view) {
		view._styles = {};
		view._styles_cache = {};
		view._styles_max = 0;
	}
	
	function getStyle(view, cell) {
		var styles = view.getRow(cell.row).$cellCss;
		if (styles) {
			var styleid = styles[cell.column];
			if (styleid) return view._styles[styleid];
		}
		return null;
	}
	
	// undo
	function _undoStyle(view, row, column, style) {
		var cell = { row: row, column: column };
		setStyle(view, cell, style);
		var oldStyle = getStyle(view, cell);
		view.callEvent("onStyleChange", [row, column, style, oldStyle]);
		view.refresh();
	}
	
	function _serialize(view, obj) {
		var styles = [];
	
		for (var key in view._styles_cache) {
			styles.push([view._styles_cache[key].id, key]);
		}obj.styles = styles;
	}
	
	function _parse(view, obj) {
		if (obj.styles) for (var i = 0; i < obj.styles.length; i++) {
			var styleObj = obj.styles[i];
			var style = {
				id: styleObj[0],
				text: styleObj[1],
				props: _styleFromText(styleObj[1])
			};
	
			_addStyle(view, style, true);
			view._styles[style.id] = style;
		}
	
		for (var i = 0; i < obj.data.length; i++) {
			var _obj$data$i = obj.data[i];
			var row = _obj$data$i[0];
			var column = _obj$data$i[1];
			var value = _obj$data$i[2];
			var css = _obj$data$i[3];
	
	
			if (css) update_style_data(view.getRow(row), column, view._styles[css]);
		}
	}
	
	function _applyStyles(view, name, value) {
		//this - spreadsheet
		var group = webix.uid();
		view.eachSelectedCell(function (cell) {
			_applyCellStyles(view, cell, name, value, group);
		});
		view.refresh();
	}
	
	function _applyCellStyles(view, cell, name, value, group) {
		var ostyle = getStyle(view, cell);
	
		var nstyle = _updateStyle(view, ostyle, name, value, cell);
		if (nstyle && nstyle != ostyle) {
			if (view.callEvent("onBeforeStyleChange", [cell.row, cell.column, nstyle, ostyle, group])) {
				setStyle(view, cell, nstyle);
				view.callEvent("onStyleChange", [cell.row, cell.column, nstyle, ostyle, group]);
			}
		}
	}
	
	function _updateStyle(view, style, name, value, cell) {
	
		if (_style_handlers[name]) {
			return _style_handlers[name](view, style, value, cell);
		}
	
		if (style && style.props[name] == value) return style;
	
		var nstyle = { text: "", id: 0, props: style ? webix.copy(style.props) : {} };
		nstyle.props[name] = value;
		nstyle.text = _styleToText(nstyle);
	
		var cache = view._styles_cache[nstyle.text];
		if (cache) return cache;
	
		_addStyle(view, nstyle);
	
		return nstyle;
	}
	
	function update_style_data(item, column, style) {
		item.$cellCss = item.$cellCss || {};
		item.$cellFormat = item.$cellFormat || {};
	
		if (style) {
			item.$cellCss[column] = style.id;
			item.$cellFormat[column] = style.props.format || null;
		} else {
			delete item.$cellCss[column];
			delete item.$cellFormat[column];
		}
	}
	
	function setStyle(view, cell, style) {
		if (style) view._styles[style.id] = style;
		update_style_data(view.getRow(cell.row), cell.column, style);
		view.saveCell(cell.row, cell.column);
	}
	
	function _addStyle(view, style, silent) {
		view._styles_max++;
		view._styles_cache[style.text] = style;
	
		style.id = style.id || "wss" + view._styles_max;
	
		var css = "";
		for (var key in style.props) {
			if (style.props[key]) {
				if (_style_map[key]) {
					if (_style_map[key][style.props[key]]) css += _style_map[key][style.props[key]](style.props);else if (typeof _style_map[key] == "function") css += _style_map[key](style.props);
				} else css += key + ":" + style.props[key] + ";";
			}
		}
	
		webix.html.addStyle(".wss_" + view.$index + " ." + style.id + "{" + css + "}");
	
		if (!silent) view._save("styles", { name: style.id, text: style.text });
	}
	
	function _styleToText(style) {
		var id = [];
		for (var i = 0; i < _style_names.length; i++) {
			id.push(style.props[_style_names[i]]);
		}return id.join(";");
	}
	
	function _styleFromText(text) {
		var parts = text.split(";");
		var props = {};
		for (var i = 0; i < _style_names.length; i++) {
			props[_style_names[i]] = parts[i];
		}return props;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.reset = reset;
	
	var _math = __webpack_require__(12);
	
	var mth = _interopRequireWildcard(_math);
	
	var _clipboard = __webpack_require__(15);
	
	var clp = _interopRequireWildcard(_clipboard);
	
	var _column_operations = __webpack_require__(16);
	
	var cop = _interopRequireWildcard(_column_operations);
	
	var _column_names = __webpack_require__(14);
	
	var nms = _interopRequireWildcard(_column_names);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function init(view, extra) {
		view.attachEvent("onComponentInit", function () {
			return ready(view);
		});
	
		var datatable = {
			view: "datatable", id: "cells", css: "webix_ssheet_table wss_" + view.$index,
			headerRowHeight: 20,
			//select:"cell",
			spans: true,
			leftSplit: 1,
			areaselect: true,
			editable: true,
			editaction: "dblclick",
			navigation: true
		};
	
		//enable clipboard by default
		if (typeof extra.clipboard === "undefined") extra.clipboard = true;
		if (extra) datatable = webix.extend(datatable, extra, true);
	
		return datatable;
	}
	
	function ready(view) {
		var grid = view.$$("cells");
	
		if (view.config.math) {
			mth.init(view);
			grid.config.editMath = true;
		}
	
		//FIXME - we need to create a standard solution for context menu
		if (view.config.columnOperation) {
			cop.init(view);
			grid.on_context.sheet_column_0 = function (e, obj, target) {
				var pos = webix.html.pos(e);
				webix.$$("rows_context_menu").show(pos, obj.row, 'row');
				webix.html.preventEvent(e);
			};
	
			grid.on_context.webix_hcell = function (e, obj, target) {
				var pos = webix.html.pos(e);
				webix.$$("rows_context_menu").show(pos, obj.column, 'column');
				webix.html.preventEvent(e);
			};
		}
	
		//saving value after edit
		grid.attachEvent("onAfterEditStop", function (st, ed) {
			//ignore empty cells
			if (st.old === webix.undefined && st.value === "") return;
	
			if (st.value != st.old && view.callEvent("onBeforeValueChange", [ed.row, ed.column, st.value, st.old])) view.setCellValue(ed.row, ed.column, st.value);
		});
	
		if (grid.config.clipboard) clp.init(view, grid.config.readonly);
	
		//parsing initial data
		view.attachEvent("onDataParse", function (data) {
			return _parse(view, data);
		});
		view.attachEvent("onDataSerialize", function (data, config) {
			return _serialize(view, data, config);
		});
	
		//column and row selection
		grid.attachEvent("onBeforeSelect", function (id) {
			return id.column != "rowId";
		});
		grid.attachEvent("onBeforeBlockSelect", function (start, end) {
			if (start.column === "rowId") start.column = 1;
			if (end.column === "rowId") end.column = 1;
		});
		grid.attachEvent("onItemClick", function (id, e) {
			return id.column == "rowId" ? cop.selectRow(id.row, view) : true;
		});
		grid.attachEvent("onHeaderClick", function (id, e) {
			return cop.selectColumn(id.column, view);
		});
	
		//reset API
		view.attachEvent("onReset", function (config) {
			return reset(view, config);
		});
		// undo
		view.attachEvent("onUndo", function (type, row, column, value) {
			if (type == "value") _undoValue(view, row, column, value);
		});
	
		grid.attachEvent("onBlur", function () {
			//after focus moved out, check and if it is somewhere
			//on the spreadsheet controls them move focus back to datatable
			webix.delay(function () {
				var target = document.activeElement;
				if (target && target.tagName == "INPUT") return;
	
				var focus = webix.UIManager.getFocus();
				if (focus && focus != grid && focus.getTopParentView && focus.getTopParentView() === view) webix.UIManager.setFocus(grid);
			}, this, [], 100);
		});
	}
	
	function _serialize(view, obj, config) {
		var math = config && config.math;
		var data = [];
		var grid = view.$$("cells");
		var state = grid.getState();
		var columns = state.ids.concat(state.hidden);
	
		grid.eachRow(function (obj) {
			var item = this.getItem(obj);
			for (var i = 1; i < columns.length; i++) {
				var key = columns[i];
				var value = item[key];
				var css = item.$cellCss ? item.$cellCss[key] || "" : "";
				if (value !== "" && typeof value != "undefined" || css) {
					if (math) value = item["$" + key] || value;
					data.push([obj * 1, key * 1, value || "", css]);
				}
			}
		}, true);
	
		obj.data = data;
	}
	
	function _parse(view, obj) {
		var grid = view.$$("cells");
	
		if (obj.sizes) grid.define("fixedRowHeight", false);
	
		for (var i = 0; i < obj.data.length; i++) {
			var _obj$data$i = obj.data[i];
			var row = _obj$data$i[0];
			var column = _obj$data$i[1];
			var value = _obj$data$i[2];
			var style = _obj$data$i[3];
	
	
			var item = grid.getItem(row);
			item[column] = value;
			if (style) {
				item.$cellCss = item.$cellCss || {};
				item.$cellCss[column] = style;
			}
			view.callEvent("onCellChange", [row, column, value]);
		}
	}
	
	function cell_template(view, obj, common, value, column) {
		var format = obj.$cellFormat ? obj.$cellFormat[column.id] : null;
		if (format) {
			var helper = view.formatHelpers[format];
			return helper ? helper(value) : value;
		}
		return value;
	}
	
	function reset(view, config) {
		var grid = view.$$("cells");
		var select = grid.getSelectArea();
		grid.clearAll();
	
		var columns = view.config.columnCount;
		var rows = view.config.rowCount;
	
		var cols = [{
			id: "rowId", header: "", width: 40,
			css: "sheet_column_0",
			template: function template(el, obj, c, config, i) {
				return el.id;
			}
		}];
	
		for (var i = 1; i <= columns; i++) {
			cols.push({
				id: i,
				editor: "text",
				header: {
					text: nms.encode[i],
					css: view._hideColumn && view._hideColumn.indexOf(i + 1) >= 0 ? 'webix_ss_hideColumn' : ''
				},
				template: function template(obj, common, value, column) {
					return cell_template(view, obj, common, value, column);
				} });
		}
		grid.refreshColumns(cols);
	
		if (view._hideColumn && view._hideColumn.length) view._hideColumn.map(function (id) {
			return grid.hideColumn(id);
		});
	
		var data = [];
		for (var i = 1; i <= rows; i++) {
			data.push({ id: i });
		}grid.parse(data);
	
		if (view._hideRow && view._hideRow.length) {
			grid.filter(function (obj) {
				if (view._hideRow.indexOf(obj.id) === -1) {
					return true;
				} else {
					if (obj.id - 1 === 0) {
						var cell = view.$$("cells").getColumnConfig("rowId").header[0];
						cell.css = (cell.css || "") + " webix_ss_hideRow";
						view.$$("cells").refreshColumns();
					} else {
						view.$$("cells").addCellCss(obj.id - 1, "rowId", "webix_ss_hideRow");
					}
					return false;
				}
			});
		}
	
		if (select && config.select && select.end.row < rows && select.end.column < columns) grid.addSelectArea(select.start, select.end);
	}
	
	function _undoValue(view, row, column, value) {
		view.setCellValue(row, column, value);
		view.refresh();
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	
	var _math_methods = __webpack_require__(13);
	
	var methods = _interopRequireWildcard(_math_methods);
	
	var _column_names = __webpack_require__(14);
	
	var nms = _interopRequireWildcard(_column_names);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function init(view) {
		var triggers = [];
		var backtrak = [];
	
		//math operations object
		var core = get_core(view);
	
		view.attachEvent("onReset", function (columns, rows) {
			triggers = [];
			backtrak = [];
		});
	
		view.attachEvent("onCellChange", function (r, c, value) {
			//check if changed cell was a math cell, based on some other cells
			//clean triggers in such case
			var line = backtrak[r];
			if (line && line[c]) remove_triggers(triggers, backtrak, c, r);
	
			//if new value is a math, calculate it and store triggers
			if (value && value.toString().indexOf("=") === 0) {
				var formula = _parse(value);
				var row = view.getRow(r);
				row[c] = _execute(formula.handler, core);
				row["$" + c] = value;
	
				if (formula.triggers.length) add_triggers(triggers, backtrak, formula.triggers, { row: r, column: c, handler: formula.handler });
			}
	
			//check if we have some other cells, related to the changed one
			check_trigger(r, c);
		});
	
		//execute math handler
		function applyMath(r, c, handler) {
			var row = view.getRow(r);
			row[c] = _execute(handler, core);
			//check if we have related cells, process their math as well
			check_trigger(r, c);
		}
	
		//check and run triggers
		function check_trigger(row, column) {
			//triggers is a matrix[row][column]
			//store array of coordinates of related cells
			var line = triggers[row];
			if (line) {
				var block = line[column];
				if (block) {
					for (var i = 0; i < block.length; i++) {
						var cell = block[i];
						//if triggers exists, run them
						if (cell.row != row || cell.column != column) applyMath(cell.row, cell.column, cell.handler);
					}
				}
			}
		}
	}
	
	//add new triggers
	function add_triggers(trs, back, adds, cell) {
		//trs - matrix of triggers
		//back - matrix of backlinks
		//adds - list of triggers
		var blist = [];
		for (var i = 0; i < adds.length; i++) {
			var line = adds[i];
			//line = [start_row, start_column, end_row, end_column]
			for (var j = line[0]; j <= line[2]; j++) {
				var step = trs[j];
				if (!step) step = trs[j] = [];
				for (var k = line[1]; k <= line[3]; k++) {
					var block = step[k];
					if (!block) block = step[k] = [];
	
					blist.push([j, k]);
					block.push(cell);
				}
			}
		}
	
		//store back-relations, for easy trigger removing
		add_backtrack(back, cell.row, cell.column, blist);
	}
	
	//store backtrack relations as a matrix
	function add_backtrack(back, row, column, adds) {
		var line = back[row];
		if (!line) line = back[row] = [];
		line[column] = adds;
	}
	
	//remove unused triggers
	function remove_triggers(trs, back, c, r) {
		//get list of triggers from backtrack structure
		var adds = back[r][c];
		back[r][c] = null;
	
		//delete triggers
		for (var i = adds.length - 1; i >= 0; i--) {
			var cell = adds[i];
			var block = trs[cell[0]][cell[1]];
	
			for (var j = block.length - 1; j >= 0; j--) {
				var bcell = block[j];
				if (bcell.row == r && bcell.column == c) block.splice(j, 1);
			}
		}
	}
	
	//convert math string to the js function
	function _parse(value) {
		var triggers = [];
	
		value = value.replace(/\((.*,.*)\)/g, "([$1])");
		//group operations
		value = value.replace(/([A-Z]{1,2})([0-9]+)\:([A-Z]{1,2})([0-9]+)/gi, function (v, c1, r1, c2, r2) {
			c1 = nms.decode[c1.toUpperCase()];
			c2 = nms.decode[c2.toUpperCase()];
			triggers.push([r1 * 1, c1, r2 * 1, c2]);
			return "this.r(" + c1 + "," + r1 + "," + c2 + "," + r2 + ")";
		});
	
		//value operations
		value = value.replace(/([A-Z]{1,2})([0-9]+)/gi, function (v, c1, r1) {
			c1 = nms.decode[c1.toUpperCase()];
			triggers.push([r1 * 1, c1, r1 * 1, c1]);
			return "this.v(" + c1 + "," + r1 + ")*1";
		});
	
		//operator names
		value = value.replace(/[A-Z]+/g, function (val) {
			return "this.m." + val;
		});
	
		//global return
		value = value.replace("=", "return ");
	
		return {
			code: value,
			triggers: triggers,
			handler: _build_function(value)
		};
	}
	
	function _build_function(value) {
		try {
			return new Function(value);
		} catch (e) {}
	}
	
	//run math function
	function _execute(formula, core) {
		var value;
		try {
			value = formula.call(core);
		} catch (e) {
			//some error in the math code
			return "ERROR";
		}
	
		//round values to fix math precision issue in JS
		if ((value || value === 0) && !isNaN(value)) {
			return Math.round(value * 100000) / 100000;
		} else {
			return "";
		}
	}
	
	function _to_number(v) {
		if (v || v === 0) {
			v = v * 1;
			if (!isNaN(v)) return v;
		}
		return false;
	}
	
	//converts cell references to code
	function get_core(view) {
		return {
			r: function r(c1, r1, c2, r2) {
				var set = [];
				for (var i = r1; i <= r2; i++) {
					var item = view.getRow(i);
					for (var j = c1; j <= c2; j++) {
						set.push(item[j]);
					}
				}
				return set;
			},
			v: function v(c, r) {
				var val = view.getRow(r)[c];
				if (val || val === 0) return val * 1;
				return "";
			},
			m: methods
		};
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.SUM = SUM;
	exports.AVERAGE = AVERAGE;
	exports.COUNT = COUNT;
	exports.COUNTA = COUNTA;
	exports.COUNTBLANK = COUNTBLANK;
	exports.MAX = MAX;
	exports.MIN = MIN;
	exports.PRODUCT = PRODUCT;
	exports.SUMPRODUCT = SUMPRODUCT;
	exports.SUMSQ = SUMSQ;
	exports.VARP = VARP;
	exports.STDEVP = STDEVP;
	exports.POWER = POWER;
	exports.QUOTIENT = QUOTIENT;
	exports.SQRT = SQRT;
	exports.ABS = ABS;
	exports.RAND = RAND;
	exports.PI = PI;
	exports.INT = INT;
	exports.ROUND = ROUND;
	exports.ROUNDDOWN = ROUNDDOWN;
	exports.ROUNDUP = ROUNDUP;
	exports.TRUNC = TRUNC;
	exports.EVEN = EVEN;
	exports.ODD = ODD;
	function _to_number(v) {
		if (v || v === 0) {
			v = v * 1;
			if (!isNaN(v)) return v;
		}
		return false;
	}
	
	/*Empty cells, logical values like TRUE, or text are ignored.*/
	function SUM(set) {
		var sum = 0;
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (v !== false) sum += v;
		}
		return sum;
	}
	
	/*If a range or cell reference argument contains text, logical values, or empty cells, those values are ignored; 
	however, cells with the value zero are included.*/
	function AVERAGE(set) {
		var sum = 0,
		    count = 0;
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (v !== false) {
				sum += v;count++;
			}
		}
		return sum / count;
	}
	
	/*Empty cells, logical values, text, or error values in the array or reference are not counted. */
	function COUNT(set) {
		var count = 0;
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (v !== false) count++;
		}
		return count;
	}
	
	/*counts the number of cells that are not empty in a range, zero is excluded.*/
	function COUNTA(set) {
		var count = 0;
		for (var i = 0; i < set.length; i++) {
			if (set[i] && set[i] * 1 !== 0) count++;
		}return count;
	}
	
	/*Counts empty cells in a specified range of cells. Cells with zero values are not counted.*/
	function COUNTBLANK(set) {
		var count = 0;
		for (var i = 0; i < set.length; i++) {
			if (!set[i] * 1) count++;
		}return count;
	}
	
	/*Empty cells, logical values, or text in the array or reference are ignored.
	If the arguments contain no numbers, MAX returns 0 (zero).*/
	function MAX(set) {
		var max = "";
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (v !== false && (v > max || max === "")) max = v;
		}
		return max || 0;
	}
	
	/*Empty cells, logical values, or text in the array or reference are ignored. 
	If the arguments contain no numbers, MIN returns 0.*/
	function MIN(set) {
		var min = "";
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (v !== false && (v < min || min === "")) min = v;
		}
		return min || 0;
	}
	
	/*Oonly numbers in the array or reference are multiplied. 
	Empty cells, logical values, and text in the array or reference are ignored.*/
	function PRODUCT(set) {
		var product = "";
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (v !== false) product = product === "" ? v : product * v;
		}
		return product;
	}
	
	/* For valid products only numbers are multiplied. Empty cells, logical values, and text are ignored.
	Treats array entries that are not numeric as if they were zeros.*/
	function SUMPRODUCT(sets) {
		var length = sets[0].length;
		for (var i in sets) {
			if (sets[i].length !== length) return;
		}var sp = 0;
		for (var i = 0; i < sets[0].length; i++) {
			var product = "";
			for (var s in sets) {
				var v = _to_number(sets[s][i]);
				if (v !== false) product = product === "" ? v : product * v;else {
					product = 0;break;
				}
			}
			if (!webix.isUndefined(product)) sp += product;
		}
		return sp;
	}
	
	/*Empty cells, logical values, text, or error values in the array or reference are ignored. */
	function SUMSQ(set) {
		var sq = 0;
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (typeof v === "number") sq += Math.pow(v, 2);
		}
		return sq;
	}
	
	/*Empty cells, logical values, text, or error values in the array or reference are ignored. */
	function VARP(set) {
		var count = this.COUNT(set);
		var avg = this.AVERAGE(set);
	
		var sum = 0;
		for (var i = 0; i < set.length; i++) {
			var v = _to_number(set[i]);
			if (v !== false) sum += Math.pow(v - avg, 2);
		}
		return sum / count;
	}
	
	/* Empty cells, logical values, text, or error values in the array or reference are ignored. */
	function STDEVP(set) {
		return Math.sqrt(this.VARP(set));
	}
	
	/*real numbers*/
	function POWER(num, pow) {
		var n = _to_number(num),
		    p = _to_number(pow);
		if (typeof n == "number" && typeof p == "number") return Math.pow(n, p);
	}
	
	/*real numbers*/
	function QUOTIENT(num, div) {
		var n = _to_number(num),
		    d = _to_number(div);
		if (typeof n == "number" && typeof d == "number") return n / d;
	}
	
	/*Returns a positive square root.*/
	function SQRT(num) {
		var v = _to_number(num);
		if (v !== false && v >= 0) return Math.sqrt(v);
	}
	
	function ABS(num) {
		var v = _to_number(num);
		if (v !== false) return Math.abs(v);
	}
	
	function RAND() {
		return Math.random();
	}
	
	function PI() {
		return Math.PI;
	}
	
	/*Rounds a number down to the nearest integer*/
	function INT(num) {
		var v = _to_number(num);
		if (v !== false) return Math.round(v);
	}
	
	/*rounds a number to a specified number of digits*/
	function ROUND(num, digits) {
		var v = _to_number(num);
		var d = _to_number(digits) || 0;
		if (v !== false) return parseFloat(v.toFixed(d));
	}
	
	/*rounds a number down to a specified number of digits*/
	function ROUNDDOWN(num, digits) {
		var v = _to_number(num);
		var d = _to_number(digits) || 0;
		if (v !== false) return Math.floor(v * Math.pow(10, d)) / Math.pow(10, d);
	}
	
	/*rounds a number up to a specified number of digits*/
	function ROUNDUP(num, digits) {
		var v = _to_number(num);
		var d = _to_number(digits) || 0;
		if (v !== false) return Math.ceil(v * Math.pow(10, d)) / Math.pow(10, d);
	}
	
	/*Truncates a number to an integer by removing the fractional part of the number.*/
	function TRUNC(num) {
		var v = _to_number(num);
		if (v !== false) return parseInt(v);
	}
	
	/*Returns number rounded up to the nearest even integer*/
	function EVEN(num) {
		var v = _to_number(num);
		if (v !== false) {
			var r = Math.round(v);
			return r % 2 ? r + 1 : r;
		}
	}
	
	/*Returns number rounded up to the nearest odd integer*/
	function ODD(num) {
		var v = _to_number(num);
		if (v !== false) {
			var r = Math.round(v);
			return r % 2 ? r : r + 1;
		}
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var decode = exports.decode = {};
	var encode = exports.encode = {};
	
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 1; i < 1000; i++) {
		var prefixIndex = parseInt((i - 1) / alpha.length);
		var str = (prefixIndex ? alpha[prefixIndex - 1] : "") + alpha[(i - 1) % alpha.length];
	
		decode[str] = i;
		encode[i] = str;
	}
	
	encode[0] = encode[1];

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	var styledata, clipdata;
	
	function init(view, readonly) {
		var grid = view.$$("cells");
	
		grid.attachEvent("onKeyPress", function (code, e) {
			if (code === 67 && e.ctrlKey && grid.getSelectedId()) {
				styledata = _get_sel_style(view, grid);
				clipdata = document.getElementsByClassName("webix_clipbuffer")[0].value;
			}
		});
	
		if (!readonly) grid.attachEvent("onPaste", function (text) {
			return _clip_to_sel(view, grid, text);
		});
	
		// undo
		view.attachEvent("onUndo", function (type, row, column, value, style) {
			if (type == "paste") _undoPaste(view, row, column, value, style);
		});
	}
	
	function _clip_to_sel(view, grid, text) {
		var data = text === clipdata ? JSON.parse(styledata) : webix.csv.parse(text, grid.config.delimiter);
		var leftTop = grid.mapSelection(null);
		if (!leftTop) return;
	
		var group = webix.uid();
		grid.mapCells(leftTop.row, leftTop.column, data.length, null, function (value, row, col, row_ind, col_ind) {
			if (data[row_ind] && data[row_ind].length > col_ind) {
				var cdata = data[row_ind][col_ind];
				var fromSheet = text === clipdata;
				var oldValue = grid.getItem(row)[col];
				var newValue = fromSheet ? cdata.text : cdata;
				var oldStyle = fromSheet ? view.getStyle(row, col) : null;
				var style = fromSheet ? cdata.style : null;
	
				if (view.callEvent("onBeforePaste", [row, col, newValue, oldValue, style, oldStyle, group])) {
					if (text === clipdata) {
						grid.getItem(row)[col] = newValue;
						view.setStyle(row, col, style);
					}
					return newValue;
				}
			}
			return value;
		});
		grid.render();
	}
	
	function _get_sel_style(view, grid) {
		var data = [];
		grid.mapSelection(function (value, row, col, row_ind, col_ind) {
			if (!data[row_ind]) data[row_ind] = [];
	
			data[row_ind].push({ text: value, style: view.getStyle(row, col) });
			return value;
		});
		return JSON.stringify(data);
	}
	
	function _undoPaste(view, row, column, value, style) {
		var grid = view.$$("cells");
		grid.getItem(row)[column] = value;
		view.setStyle(row, column, style);
		grid.render();
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.selectRow = selectRow;
	exports.selectColumn = selectColumn;
	
	var _column_names = __webpack_require__(14);
	
	var nms = _interopRequireWildcard(_column_names);
	
	var _hide = __webpack_require__(17);
	
	var hid = _interopRequireWildcard(_hide);
	
	var _add = __webpack_require__(19);
	
	var add = _interopRequireWildcard(_add);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	var locale = webix.i18n.spreadsheet.menus;
	
	var row_data = [{ id: "add", group: "row", value: locale.add_row }, { id: "del", group: "row", value: locale.del_row }, { id: "show", group: "row", value: locale.show_row }, { id: "hide", group: "row", value: locale.hide_row }];
	
	var column_data = [{ id: "add", group: "column", value: locale.add_column }, { id: "del", group: "column", value: locale.del_column }, { id: "show", group: "column", value: locale.show_column }, { id: "hide", group: "column", value: locale.hide_column }];
	
	function init(view) {
	  webix.ui({
	    view: "contextmenu",
	    id: "rows_context_menu",
	    on: {
	      onItemClick: function onItemClick(id, e, node) {
	        var _view$$$$getSelectAre = view.$$("cells").getSelectArea();
	
	        var start = _view$$$$getSelectAre.start;
	        var end = _view$$$$getSelectAre.end;
	
	        if (!start || !end) return;
	
	        view.callEvent("onCommand", [this.getItem(id), start, end]);
	      },
	      onBeforeShow: function onBeforeShow(pos, field_id, type) {
	        if (field_id === "rowId") return false;
	        this.clearAll();
	
	        if (type === 'row') {
	          selectRow(field_id, view);
	          this.parse(row_data);
	        }
	        if (type === 'column') {
	          selectColumn(field_id, view);
	          this.parse(column_data);
	        }
	      }
	    }
	  });
	
	  hid.init(view);
	  add.init(view);
	}
	
	function selectRow(id, view) {
	  var start = { row: id, column: 1 };
	  var last = { row: id, column: view.config.columnCount };
	  _selectRange(start, last, view);
	}
	
	function selectColumn(id, view) {
	  var startRow = view.$$("cells").data.order[0];
	  var lastRow = view.$$("cells").data.order.length;
	
	  var start = { row: startRow, column: id };
	  var last = { row: lastRow, column: id };
	
	  _selectRange(start, last, view);
	}
	
	function _selectRange(a, b, view) {
	  view.$$("cells").addSelectArea(a, b);
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.process = process;
	function init(view) {
		view.attachEvent("onCommand", function (action, start, end) {
			if (action.id == "show" || action.id == "hide") process(action, start, end, view);
		});
		reset(view);
	}
	
	function reset(view) {
		view._hideColumn = [];
		view._hideRow = [];
	}
	
	function process(action, start, end, view) {
		if (action.group == "column") switch (action.id) {
			case 'show':
				if (!view._hideColumn.length) return;
				var n = end.column;
				while (n >= start.column) {
					var id = _handleState(view._hideColumn, n);
					if (id !== false) {
						var cell = view.$$("cells").getColumnConfig(id - 1 || "rowId").header[0];
						cell.css = cell.css.replace("webix_ss_hideColumn", "");
						view.$$("cells").showColumn(id);
					}
					n--;
				}
				break;
	
			case 'hide':
				var p = end.column;
				while (p >= start.column) {
					view._hideColumn.push(p);
					var cell = view.$$("cells").getColumnConfig(p - 1 || "rowId").header[0];
					cell.css = (cell.css || "") + " webix_ss_hideColumn";
					view.$$("cells").hideColumn(p);
					p--;
				}
				break;
		} else if (action.group == "row") {
			switch (action.id) {
				case 'show':
					if (!view._hideRow.length) return;
					var o = end.row;
					while (o >= start.row) {
						var state = _handleState(view._hideRow, o);
						if (state !== false) {
							if (state - 1 === 0) {
								var cell = view.$$("cells").getColumnConfig("rowId").header[0];
								cell.css = cell.css.replace("webix_ss_hideRow", "");
								view.$$("cells").refreshColumns();
							} else {
								view.$$("cells").removeCellCss(state - 1, "rowId", "webix_ss_hideRow");
							}
						}
						o--;
					}
					view.$$("cells").filter(function (obj) {
						return view._hideRow.indexOf(obj.id) === -1;
					});
					break;
	
				case 'hide':
					for (var k = end.row; k >= start.row; k--) {
						view._hideRow.push(k);
						if (k - 1 === 0) {
							var cell = view.$$("cells").getColumnConfig("rowId").header[0];
							cell.css = (cell.css || "") + " webix_ss_hideRow";
							view.$$("cells").refreshColumns();
						} else {
							view.$$("cells").addCellCss(k - 1, "rowId", "webix_ss_hideRow");
						}
					}
					view.$$("cells").filter(function (obj) {
						return view._hideRow.indexOf(obj.id) === -1;
					});
					break;
			}
		}
	}
	
	function _handleState(arr, id) {
		var indexNext = arr.indexOf(id + 1); //next column behind current
		var indexPrev = arr.indexOf(id - 1); //prev column before current
	
		if (indexNext >= 0) {
			return arr.splice(indexNext, 1)[0];
		} else if (indexPrev >= 0) {
			return arr.splice(indexPrev, 1)[0];
		}
		return false;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.process = process;
	
	var _updater = __webpack_require__(20);
	
	var fpd = _interopRequireWildcard(_updater);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function init(view) {
		view.attachEvent("onCommand", function (action, start, end) {
			if (action.id == "add" || action.id == "del") process(action, start, end, view);
		});
	}
	
	function process(action, start, end, view) {
		var params = view.serialize({
			math: true
		});
		var data = params.data;
		var i = data.length;
	
		//shift data
		if (action.group == "column") switch (action.id) {
			case 'add':
				view.config.columnCount += 1;
				view.reset({
					select: true
				});
				while (i--) {
					if (data[i][1] >= start.column) data[i][1] += 1;
				}break;
			case 'del':
				view.config.columnCount -= end.column - start.column + 1;
				view.reset({
					select: true
				});
				while (i--) {
					if (data[i][1] >= start.column && data[i][1] <= end.column) data.splice(i, 1);else if (data[i][1] > end.column) data[i][1] -= 1;
				}break;
		} else if (action.group == "row") switch (action.id) {
			case 'add':
				view.config.rowCount += 1;
				view.reset({
					select: true
				});
				while (i--) {
					if (data[i][0] >= start.row) data[i][0] += 1;
				}break;
	
			case 'del':
				view.config.rowCount -= end.row - start.row + 1;
				view.reset({
					select: true
				});
				while (i--) {
					if (data[i][0] >= start.row && data[i][0] <= end.row) data.splice(i, 1);else if (data[i][0] > end.row) data[i][0] -= 1;
				}break;
		}
	
		//update formulas
		var updater = fpd.get(action.group, action.id);
		i = params.data.length;
		while (i--) {
			if (data[i][2] && typeof data[i][2] === "string" && data[i][2].substr(0, 1) == "=") data[i][2] = updater(data[i][2], start, end);
		}
	
		params.data = data;
		view.parse(params);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.updateRanges = updateRanges;
	exports.update = update;
	exports.updateMath = updateMath;
	
	var _column_names = __webpack_require__(14);
	
	var nms = _interopRequireWildcard(_column_names);
	
	var _parser = __webpack_require__(21);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	function updateRanges() {}
	
	function update() {}
	
	function updateMath(formula, action) {
	  var stack = (0, _parser.split)(formula);
	  var max = stack.length;
	  for (var i = 1; i < max; i += 2) {
	    var _stack$i = stack[i];
	    var row = _stack$i[0];
	    var column = _stack$i[1];
	
	
	    if (action.id === "move") {
	      column += action.column;
	      row += action.row;
	    } else if (action.id === "row" && action.row <= row) {
	      row += action.count;
	    } else if (action.id === "column" && action.column <= column) {
	      column += action.count;
	    }
	
	    if (!column || !row) stack[i] = 0;else stack[i] = nms.encode[column] + row;
	  }
	
	  return stack.join("");
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.split = split;
	exports.parse = parse;
	function isChar(char) {
		var code = char.charCodeAt(0);
		return code >= 65 && code <= 122;
	}
	function isNumber(char) {
		var code = char.charCodeAt(0);
		return code >= 48 && code <= 57;
	}
	
	function getWord(formula, i) {
		var max = formula.length;
		var hasNumber = false;
		var isField = true;
	
		for (var j = i + 1; j < max; j++) {
			var key = formula[j];
	
			if (!isChar(key) && !isNumber(key)) return formula.substr(i, j - i);
		}
	
		return formula.substr(i);
	}
	
	var operand = /[A-Z]{1,2}[0-9]+/;
	function isPosition(text) {
		return operand.test(text);
	}
	
	function position(word) {
		var size = isNumber(word[1]) ? 1 : 2;
		var column = word.substr(0, size);
		var row = word.substr(size);
	
		var colid;
		if (column.length == 2) colid = (column.charCodeAt(0) - 64) * 28 + column.charCodeAt(1) - 64;else colid = column.charCodeAt(0) - 64;
	
		return [row * 1, colid];
	}
	function operandCode(deps, word) {
		var _position = position(word);
	
		var r = _position[0];
		var c = _position[1];
	
		deps.push([r, c, r, c]);
	
		return 'this.v(' + r + ',' + c + ')';
	}
	
	function methodCode(word) {
		return 'this.m.' + word;
	}
	
	function namedRangeCode(word) {
		return 'this.g.' + word + '()';
	}
	function templateCode(word) {
		return 'this.p.' + word;
	}
	
	function rangeCode(deps, a, b) {
		var _position2 = position(a);
	
		var r1 = _position2[0];
		var c1 = _position2[1];
	
		var _position3 = position(b);
	
		var r2 = _position3[0];
		var c2 = _position3[1];
	
	
		if (r1 > r2) {
			var t = r1;r1 = r2;r2 = t;
		}
		if (c1 > c2) {
			var t = c1;c1 = c2;c2 = t;
		}
	
		deps.push([r1, c1, r2, c2]);
	
		return 'this.r(' + r1 + ',' + c1 + ',' + r2 + ',' + c2 + ')';
	}
	
	function split(formula) {
		var lines = [];
		var index = 0;
		var quotes = false,
		    ph = false;
	
		for (var i = 1; i < formula.length; i++) {
			var key = formula[i];
			if (key == '"') {
				quotes = !quotes;
			} else if (!quotes) {
				if (key == '{' && formula[i + 1] == "{") {
					ph = true;
				} else if (key == '}' && formula[i + 1] == "}") {
					ph = false;
				} else if (!ph) {
					if (isChar(key)) {
						var word = getWord(formula, i).toUpperCase();
						var next = i + word.length - 1;
						if (formula[next + 1] !== "(" && isPosition(word)) {
							if (i !== 0) lines.push(formula.substr(index, i - index));
							lines.push(position(word));
							index = next + 1;
						}
						i = next;
					}
				}
			}
		}
	
		if (index != formula.length) lines.push(formula.substr(index));
		return lines;
	}
	
	function parse(formula) {
		var code = "return ";
		var deps = [];
	
		var quotes = false;
		var pair = "";
	
		if (formula[0] !== "=") return false;
	
		for (var i = 1; i < formula.length; i++) {
			var key = formula[i];
	
			if (key == '"') quotes = !quotes;else if (key == '{' && formula[i + 1] == "{") {
				var word = getWord(formula, i + 2);
				i += word.length + 3;
				code += templateCode(word);
				continue;
			} else if (!quotes && isChar(key)) {
				var word = getWord(formula, i).toUpperCase();
				i += word.length - 1;
	
				if (formula[i + 1] === "(") {
					code += methodCode(word);
				} else if (isPosition(word)) {
					if (formula[i + 1] === ":") {
						pair = word;
						i++;
					} else {
						if (pair !== "") {
							code += rangeCode(deps, pair, word);
							pair = "";
						} else code += operandCode(deps, word);
					}
				} else code += namedRangeCode(word);
	
				continue;
			}
	
			code += formula[i];
		}
	
		return { code: code + ";", triggers: deps };
	}

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		var grid = view.$$("cells");
	
		webix.UIManager.addHotKey("delete", function () {
			view.eachSelectedCell(function (cell) {
				return view.setCellValue(cell.row, cell.column, "");
			});
			view.refresh();
		}, grid);
	
		webix.UIManager.addHotKey("any", function (view, ev) {
			//ignore shift key
			if ((ev.which || ev.keyCode) == 16) return;
	
			var sel = view.getSelectedId(true);
			if (sel.length && grid.config.editable) grid.edit(sel[0]);
		}, grid);
	
		webix.UIManager.addHotKey("ctrl-z", function () {
			return view.undo();
		}, grid);
		webix.UIManager.addHotKey("ctrl-y", function () {
			return view.redo();
		}, grid);
	}

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	function init(view) {
		if (view.config.resizeCell) {
			var grid = view.$$("cells");
			grid.define("resizeRow", true);
			grid.define("resizeColumn", true);
			grid.define("fixedRowHeight", false);
	
			grid.attachEvent("onRowResize", function (id) {
				view.$$("cells").removeSelectArea();
				view._save("sizes", { row: id, column: 0, size: view.getRow(id).$height });
			});
			grid.attachEvent("onColumnResize", function (id) {
				view.$$("cells").removeSelectArea();
				view._save("sizes", { row: 0, column: id, size: view.getColumn(id).width });
			});
	
			// undo
			view.attachEvent("onUndo", function (type, row, column, value) {
				if (type == "c-resize" || type == "r-resize") _undoResize(view, row, column, value);
			});
		}
	
		view.attachEvent("onDataParse", function (data) {
			if (data.sizes) {
				for (var i = 0; i < data.sizes.length; i++) {
					var size = data.sizes[i];
					if (size[0] * 1 !== 0) {
						view.getRow(size[0]).$height = size[2] * 1;
					} else {
						view.getColumn(size[1]).width = size[2] * 1;
					}
				}
	
				if (data.sizes.length) view.refresh(true);
			}
		});
	
		view.attachEvent("onDataSerialize", function (data) {
			var sizes = [];
			var grid = view.$$("cells");
			var columns = grid.config.columns;
			var order = grid.data.order;
	
			var defWidth = grid.config.columnWidth;
			var defHeight = grid.config.rowHeight;
	
			for (var i = 1; i < columns.length; i++) {
				var width = columns[i].width;
				if (width && width != defWidth) sizes.push([0, i, width]);
			}
	
			for (var i = 0; i < order.length; i++) {
				var height = grid.getItem(order[i]).$height;
				if (height && height != defHeight) sizes.push([order[i] * 1, 0, height]);
			}
	
			data.sizes = sizes;
		});
	}
	
	function _undoResize(view, row, column, value) {
		if (row) {
			view.$$("cells").getItem(row).$height = value;
			view.refresh();
			view._save("sizes", { row: row, column: 0, size: value });
		} else {
			view._table.setColumnWidth(column, value);
		}
		// update area selection
		view.$$("cells")._renderSelectAreas();
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.addSpan = addSpan;
	exports.removeSpan = removeSpan;
	exports.getRange = getRange;
	function init(view) {
		view.attachEvent("onStyleChange", function (row, column, style) {
			var span = getSpan(view, row, column);
			if (span) span[3] = style.id;
		});
	
		view.attachEvent("onCellChange", function (row, column, value) {
			var span = getSpan(view, row, column);
			if (span) span[2] = value;
		});
	
		view.attachEvent("onDataParse", function (data) {
			if (data.spans) for (var i = 0; i < data.spans.length; i++) {
				var span = data.spans[i];
				addSpan(view, { row: span[0], column: span[1] }, span[2] * 1, span[3] * 1);
			}
		});
	
		view.attachEvent("onDataSerialize", function (data) {
			var spans = [];
			var pull = view.$$("cells").getSpan();
			if (pull) {
				for (var rid in pull) {
					var row = pull[rid];
					for (var cid in row) {
						var span = row[cid];
						spans.push([rid * 1, cid * 1, span[0], span[1]]);
					}
				}
	
				data.spans = spans;
			}
		});
	
		view.attachEvent("onUndo", function (type, row, column, value, isUndo) {
			if (type == "span" || type == "split") {
				if (type == "span") isUndo = !isUndo;
				undoSpan(view, row, column, value, isUndo);
			}
		});
	}
	
	function getSpan(view, row, column) {
		var item = view.$$("cells").getSpan()[row];
		if (item) return item[column];
	}
	
	function addSpan(view, cell, x, y) {
		if (x < 2 && y < 2) return;
	
		var row = view.getRow(cell.row);
		var value = row[cell.column];
		var css = row.$cellCss ? row.$cellCss[cell.column] || "" : "";
	
		view.$$("cells").addSpan(cell.row, cell.column, x, y, value, css);
		view._save("spans", {
			row: cell.row, column: cell.column,
			x: x, y: y
		});
	}
	
	function removeSpan(view, cell) {
		view.$$("cells").removeSpan(cell.row, cell.column);
		view._save("spans", {
			row: cell.row, column: cell.column,
			x: 0, y: 0
		});
	}
	
	function getRange(sel) {
		var lx, ly, rx, ry;
		rx = ry = 0;
		lx = ly = Infinity;
	
		for (var i = 0; i < sel.length; i++) {
			var cx = sel[i].column * 1;
			var cy = sel[i].row * 1;
	
			lx = Math.min(cx, lx);
			rx = Math.max(cx, rx);
			ly = Math.min(cy, ly);
			ry = Math.max(cy, ry);
		}
	
		return {
			cell: { row: ly, column: lx },
			x: rx - lx + 1,
			y: ry - ly + 1
		};
	}
	
	function undoSpan(view, row, column, value, isUndo) {
		if (isUndo) {
			removeSpan(view, { row: row, column: column });
		} else {
			addSpan(view, { row: row, column: column }, value[0], value[1]);
		}
		view.refresh();
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	exports.undo = undo;
	exports.redo = redo;
	function init(view) {
	    reset(view);
	    view.attachEvent("onReset", function () {
	        return reset(view);
	    });
	    // styles
	    view.attachEvent("onBeforeStyleChange", function (row, column, nstyle, ostyle, group) {
	        return addToHistory(view, { action: "style", row: row, column: column, value: ostyle, newValue: nstyle, group: group });
	    });
	    // editing
	    view.attachEvent("onBeforeValueChange", function (row, column, nvalue, ovalue) {
	        return addToHistory(view, { action: "value", row: row, column: column, value: ovalue, newValue: nvalue });
	    });
	    // merge cells
	    view.attachEvent("onBeforeSpan", function (row, column, value) {
	        return addToHistory(view, { action: "span", row: row, column: column, value: value, newValue: value });
	    });
	    // split cells
	    view.attachEvent("onBeforeSplit", function (row, column, value, group) {
	        return addToHistory(view, { action: "split", row: row, column: column, value: value, newValue: value, group: group });
	    });
	    // column resize
	    view.$$("cells").attachEvent("onColumnResize", function (column, nvalue, ovalue) {
	        return addToHistory(view, { action: "c-resize", row: 0, column: column, value: ovalue, newValue: nvalue });
	    });
	    // row resize
	    view.$$("cells").attachEvent("onRowResize", function (row, nvalue, ovalue) {
	        return addToHistory(view, { action: "r-resize", row: row, column: 0, value: ovalue, newValue: nvalue });
	    });
	
	    // clipboard
	    view.attachEvent("onBeforePaste", function (row, column, nvalue, ovalue, nstyle, ostyle, group) {
	        return addToHistory(view, { action: "paste", row: row, column: column, value: ovalue, newValue: nvalue,
	            style: ostyle, newStyle: nstyle, group: group });
	    });
	}
	
	function undo(view) {
	    restoreHistory(view, -1);
	}
	
	function redo(view) {
	    restoreHistory(view, 1);
	}
	
	function reset(view) {
	    view._ssUndoHistory = [];
	    view._ssUndoCursor = -1;
	}
	
	function addToHistory(view, data) {
	    if (!view.$skipHistory) {
	        // remove futher history
	        view._ssUndoHistory.splice(view._ssUndoCursor + 1);
	        // add to an array and increase cursor
	        view._ssUndoHistory.push(data);
	        view._ssUndoCursor++;
	    }
	}
	function ignoreUndo(func, view) {
	    view.$skipHistory = true;
	    func();
	    view.$skipHistory = false;
	}
	
	function restoreHistory(view, step) {
	    var data = view._ssUndoHistory[step > 0 ? view._ssUndoCursor + step : view._ssUndoCursor];
	
	    if (data) {
	        var value = step > 0 ? data.newValue : data.value;
	        var direction = step > 0;
	
	        var params = [data.action, data.row, data.column, value, direction];
	        if (data.action == "paste") params.push(direction ? data.newStyle : data.style);
	
	        ignoreUndo(function () {
	            view.callEvent("onUndo", params);
	        }, view);
	
	        view._ssUndoCursor += step;
	
	        // group support
	        var group = data.group;
	        var prevData = view._ssUndoHistory[step > 0 ? view._ssUndoCursor + step : view._ssUndoCursor];
	        if (prevData && group && group == prevData.group) {
	            restoreHistory(view, step);
	        }
	    }
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.init = init;
	
	__webpack_require__(27);
	
	var _math_methods = __webpack_require__(13);
	
	var methods = _interopRequireWildcard(_math_methods);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	var methodsName = Object.keys(methods);
	methodsName.splice(methodsName.indexOf('__esModule'), 1);
	
	function init(view) {
	  view.attachEvent("onComponentInit", function () {
	    return ready(view);
	  });
	
	  return {
	    view: "toolbar",
	    css: "webix_ssheet_toolbar",
	    elements: [{ view: 'label', template: "Edit: ", width: 60 }, {
	      view: 'live-editor',
	      disabled: true,
	      id: 'liveEditor',
	      suggestData: methodsName,
	      linkToView: view.config.id
	    }]
	  };
	}
	
	function ready(view) {
	  var isBlockSelect = false;
	  var areaObj = null;
	
	  //block native editor, and move focus to the custom input
	  view.$$("cells").attachEvent("onBeforeEditStart", function () {
	    view.$$("liveEditor").focus();
	    return false;
	  });
	
	  view.$$("cells").attachEvent('onBeforeBlockSelect', function (data) {
	    if (view.$$('liveEditor') !== webix.UIManager.getFocus()) return true;
	    isBlockSelect = true;
	  });
	
	  view.attachEvent('onAfterSelect', function (data) {
	    if (!isBlockSelect) {
	      var editor = view.$$('liveEditor');
	      areaObj = view.$$("cells").getSelectArea();
	      editor.config.selectCell = areaObj;
	
	      var value = view.getCellValue(data[0].row, data[0].column);
	      editor.setValue(value || '');
	      editor.enable();
	    }
	  });
	
	  //a moment before cell selection
	  webix.event(view.$$("cells").$view, "click", function (ev) {
	    if (view.$$('liveEditor') !== webix.UIManager.getFocus()) return true;
	
	    var text = view.$$('liveEditor').getValue().trim();
	    var first = text.substr(0, 1);
	    var last = text.substr(text.length - 1, 1);
	    var grid = view.$$("cells");
	
	    //if we have a math formula in the editor
	    if (last.match(/[\+\-\/\*\%\=\(:]/)) {
	      //paste cell position
	      var id = grid.locate(ev);
	      if (id && !id.header && id.column !== "rowId") {
	        var block = view.getColumn(id.column).header[0].text + id.row;
	        view.$$('liveEditor').setRange(block);
	        return webix.html.preventEvent(ev);
	      }
	    } else {
	      //else, apply formula and set new cell value
	      var cell = grid.getSelectArea();
	      view.setCellValue(cell.start.row, cell.start.column, text);
	      grid.refresh(cell.start.row);
	    }
	  }, this, true);
	
	  view.$$("cells").attachEvent("onBeforeAreaRemove", function (name) {
	    if (view.$$('liveEditor') !== webix.UIManager.getFocus()) return true;
	    if (name === areaObj.name.toString()) return false;
	  });
	
	  view.$$("cells").attachEvent("onAfterAreaAdd", function (start, end) {
	    if (view.$$('liveEditor') !== webix.UIManager.getFocus()) return true;
	
	    var areas = view.$$("cells").getAllSelectAreas();
	    for (var name in areas) {
	      if (!areaObj || name !== areaObj.name.toString()) {
	        view.$$("cells").removeSelectArea(name);
	      }
	    }
	    return false;
	  });
	
	  view.$$("cells").attachEvent("onAfterBlockSelect", function (start, end) {
	    if (!isBlockSelect) return true;
	    isBlockSelect = false;
	    var blockStart = view.getColumn(start.column).header[0].text + start.row;
	    var blockEnd = view.getColumn(end.column).header[0].text + end.row;
	    if (blockStart == blockEnd) view.$$('liveEditor').setRange(blockStart);else view.$$('liveEditor').setRange(blockStart + ":" + blockEnd);
	  });
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(28);
	
	webix.protoUI({
	  name: "live-editor",
	  $cssName: "text webix_ssheet_formula",
	  defaults: {
	    keyPressTimeout: 25,
	    selectCell: null
	  },
	  $init: function $init(config) {
	    var _this = this;
	
	    config.suggest = {
	      view: "suggest-formula",
	      data: config.suggestData
	    };
	    this.attachEvent("onKeyPress", function (code, e) {
	      if (code === 13) {
	        //ignore Enter key if it was pressed to select some value from suggest
	        if (new Date() - (_this._last_value_set || 0) > 300) {
	          _this.updateCellValue();
	          webix.UIManager.setFocus(_this.getTopParentView().$$("cells"));
	        }
	      }
	    });
	  },
	  updateCellValue: function updateCellValue() {
	    var newv = this.getValue();
	    if (!this.config.selectCell) this.setValue("");else {
	      var master = webix.$$(this.config.linkToView);
	      master.setCellValue(this.config.selectCell.start.row, this.config.selectCell.start.column, newv);
	      master.refresh();
	    }
	  },
	  setValueHere: function setValueHere(value) {
	    this._last_value_set = new Date();
	
	    var node = this.getInputNode();
	    var formula = node.value;
	    var cursor = node.selectionStart;
	
	    var str1 = formula.substring(0, cursor);
	    var str2 = formula.substring(cursor);
	
	    str1 = str1.replace(/([a-zA-Z]+)$/, value);
	
	    node.value = str1 + "(" + str2;
	    node.setSelectionRange(str1.length + 1, str1.length + 1);
	  },
	  setRange: function setRange(range) {
	    var node = this.getInputNode();
	    var cursor = node.selectionStart;
	    var formula = this.getValue();
	
	    var str1 = formula.substring(0, cursor) + range;
	    var str2 = formula.substring(cursor);
	
	    node.value = str1 + str2;
	    node.setSelectionRange(str1.length + 1, str1.length + 1);
	    this.focus();
	  }
	}, webix.ui.text);

/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";
	
	webix.protoUI({
	  name: "suggest-formula",
	  defaults: {
	    fitMaster: false,
	    width: 200,
	    filter: function filter(item, value) {
	      var trg = webix.$$(this.config.master).getInputNode();
	      var cursor = trg.selectionStart;
	      var val = trg.value;
	
	      if (val.charAt(0) !== '=') return;
	
	      var str1 = val.substring(0, cursor).match(/([a-zA-Z]+)$/);
	      var str2 = val.charAt(cursor).search(/[^A-Za-z0-9]/);
	
	      if (str1 && (cursor === val.length || str2 === 0)) {
	        value = str1[0];
	      }
	      return item.value.toString().toLowerCase().indexOf(value.toLowerCase()) === 0;
	    }
	  },
	  $init: function $init() {
	    var _this = this;
	
	    this.attachEvent("onBeforeShow", function (node, mode, point) {
	      if (node.tagName) {
	        var sizes = webix.html.offset(node);
	        var symbolLenght = 9;
	
	        var y = sizes.y + sizes.height;
	        var x = sizes.x + node.selectionStart * symbolLenght;
	
	        webix.ui.popup.prototype.show.apply(_this, [{ x: x, y: y }]);
	        return false;
	      }
	    });
	  },
	  setMasterValue: function setMasterValue(data, refresh) {
	    var text = data.id ? this.getItemText(data.id) : data.text || data.value;
	    var master = webix.$$(this.config.master);
	    master.setValueHere(text);
	
	    if (!refresh) this.hide(true);
	
	    this.callEvent("onValueSuggest", [data, text]);
	  }
	}, webix.ui.suggest);

/***/ },
/* 29 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	"use strict";

/***/ }
/******/ ]);