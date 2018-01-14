/*
@license
Webix Kanban v.3.4.0
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
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	__webpack_require__(2);
	
	webix.protoUI({
		name: "kanban",
		defaults: {
			listFilter: function listFilter(item, list) {
				var status = list.config.status;
				var result = true;
				if (typeof list.config.status == "function") {
					result = list.config.status.call(list, item);
				} else if (_typeof(list.config.status) == "object") {
					for (var s in status) {
						result = result && item[s] == status[s];
					}
				} else result = item.status == list.config.status;
	
				return result;
			}
		},
		$init: function $init() {
			this.data.provideApi(this, true);
			this._applyOrder();
			this.$ready.push(function () {
				this._sublist = this._buildSublistMap(this, {});
			});
		},
		_applyOrder: function _applyOrder() {
			var kanban = this;
			this.data.attachEvent("onStoreUpdated", function (id) {
				var statusArr = {};
				this.each(function (item) {
					if (item.status) {
						if (!statusArr[item.status]) {
							statusArr[item.status] = [];
						}
						statusArr[item.status].push(item);
					}
				});
				for (var status in statusArr) {
					var arr = statusArr[status];
					kanban._sortItems(arr, id);
	
					for (var i = 0; i < arr.length; i++) {
						arr[i].$index = i;
					}
				}
			});
		},
		_sortItems: function _sortItems(arr, id) {
			// stable sorting
			for (var i = 0; i < arr.length; i++) {
				arr[i].$i = i;
			}
			arr.sort(function (a, b) {
				var i = a.$index,
				    j = b.$index;
	
				return i > j ? 1 : i < j ? -1 : a.$i > b.$i ? 1 : -1;
			});
		},
		_buildSublistMap: function _buildSublistMap(view, hash) {
			var t = view.getChildViews();
			for (var i = 0; i < t.length; i++) {
				var sub = t[i];
				if (sub.$kanban) {
					var status = sub.config.status;
					if (hash[status]) {
						if (!webix.isArray(hash[status])) {
							hash[status] = [hash[status]];
						}
						hash[status].push(sub);
					} else hash[status] = sub;
					if (this.config.icons) sub.type.icons = this.config.icons;
					sub.config.master = this.config.id;
					sub.sync(this.data, this._getSublistFilter);
				} else if (sub.getChildViews) this._buildSublistMap(sub, hash);
			}
			return hash;
		},
		_getSublistFilter: function _getSublistFilter() {
			var list = webix.$$(this.owner);
			var master = webix.$$(list.config.master);
	
			this.filter(function (item) {
				return master.config.listFilter.call(master, item, list);
			});
	
			/*
	  		list.sort(function(a,b){
	  			a = a.$index;
	  			b = b.$index;
	  			return a>b?1:(a<b?-1:0);
	  		});*/
		},
		getSelectedId: function getSelectedId() {
			var selected = null;
			this.eachList(function (list) {
				selected = list.getSelectedId() || selected;
			});
			return selected;
		},
		select: function select(id) {
			this.getOwnerList(id).select(id);
		},
		getOwnerList: function getOwnerList(id) {
			var owner = null;
			this.eachList(function (list) {
				if (list.data.order.find(id) > -1) owner = list;
			});
			return owner;
		},
		eachList: function eachList(code) {
			for (var key in this._sublist) {
				if (webix.isArray(this._sublist[key])) {
					for (var i = 0; i < this._sublist[key].length; i++) {
						code.call(this, webix.$$(this._sublist[key][i]), key);
					}
				} else code.call(this, webix.$$(this._sublist[key]), key);
			}
		},
		_getIndex: function _getIndex(list, listIndex) {
			var index = -1;
			var id = list.getIdByIndex(listIndex);
			if (!id) {
				var prevLists = [];
				for (var key in this._sublist) {
					if (this._sublist[key] == list) {
						for (var i = prevLists.length - 1; index < 0 && i >= 0; i--) {
							if (prevLists[i].count()) index = this.getIndexById(prevLists[i].getLastId());
						}
						if (index < 0) index = 0;
					}
					prevLists.push(this._sublist[key]);
				}
			} else index = this.getIndexById(id);
			return index;
		},
		_unmarkList: function _unmarkList() {
			if (this._markedListId) {
				var list = webix.$$(this._markedListId);
				webix.html.removeCss(list.$view, "webix_drag_over");
			}
		},
		_markList: function _markList(list) {
			this._unmarkList();
			if (list.$view.className.indexOf("webix_drag_over") < 0) {
				webix.html.addCss(list.$view, "webix_drag_over");
				this._markedListId = list.config.id;
			}
		}
	}, webix.DataLoader, webix.EventSystem, webix.ui.headerlayout);
	
	webix.protoUI({
		name: "kanbanlist",
		$init: function $init() {
			this.$view.className += " webix_kanban_list";
			this.attachEvent("onAfterSelect", function () {
				this.eachOtherList(function (list) {
					list.unselect();
				});
			});
			this.$ready.push(webix.bind(this._setHandlers, this));
		},
		$kanban: true,
		on_context: {},
		$dragDestroy: function $dragDestroy() {
			webix.$$(this.config.master)._unmarkList();
			webix.html.remove(webix.DragControl.getNode());
		},
		_setHandlers: function _setHandlers() {
	
			this.on_click.webix_kanban_user_avatar = function (e, id, none) {
				return webix.$$(this.config.master).callEvent("onAvatarClick", [id, e, none, this]);
			};
	
			// selection events
			this.attachEvent("onBeforeSelect", function (id, state) {
				return webix.$$(this.config.master).callEvent("onListBeforeSelect", [id, state, this]);
			});
			this.attachEvent("onAfterSelect", function (id) {
				webix.$$(this.config.master).callEvent("onListAfterSelect", [id, this]);
			});
	
			// click event
			this.attachEvent("onItemClick", function (id, e, node) {
				var target = e.target || e.srcElement;
				var icon = null;
				while (!icon && target != node) {
					icon = target.getAttribute("webix_icon_id");
					target = target.parentNode;
				}
				var res = true;
				if (icon) res = res && webix.$$(this.config.master).callEvent("onListIconClick", [icon, id, e, node, this]);
				if (res) webix.$$(this.config.master).callEvent("onListItemClick", [id, e, node, this]);
			});
	
			// dblclick event
			this.attachEvent("onItemDblClick", function (id, e, node) {
				webix.$$(this.config.master).callEvent("onListItemDblClick", [id, e, node, this]);
			});
	
			// context events
			this.attachEvent("onBeforeContextMenu", function (id, e, node) {
				return webix.$$(this.config.master).callEvent("onListBeforeContextMenu", [id, e, node, this]);
			});
			this.attachEvent("onAfterContextMenu", function (id, e, node) {
				webix.$$(this.config.master).callEvent("onListAfterContextMenu", [id, e, node, this]);
			});
	
			// drag-n-drop events
			this.attachEvent("onBeforeDrag", function (context, e) {
				return webix.$$(this.config.master).callEvent("onListBeforeDrag", [context, e, this]);
			});
	
			this.attachEvent("onBeforeDragIn", function (context, e) {
				var kanban = webix.$$(this.config.master);
				var result = kanban.callEvent("onListBeforeDragIn", [context, e, this]);
				kanban._unmarkList();
				if (result) {
					if (!context.target) kanban._markList(this);
				}
	
				return result;
			});
	
			this.attachEvent("onDragOut", function (context, e) {
				webix.$$(this.config.master).callEvent("onListDragOut", [context, e, this]);
			});
	
			this.dropHandler = this.attachEvent("onBeforeDrop", function (context, e) {
				var i,
				    id,
				    ids,
				    item,
				    sameList,
				    kanban = webix.$$(this.config.master);
	
				kanban._unmarkList();
				if (kanban.callEvent("onListBeforeDrop", [context, e, this])) {
					ids = context.source;
					sameList = context.from == context.to;
					for (i = 0; i < ids.length; i++) {
						id = ids[i];
						item = kanban.getItem(id);
						item.$index = context.index;
						kanban.data.blockEvent();
						var index = kanban._getIndex(this, context.index);
						if (!sameList && (index && index < kanban.getIndexById(id) || !index && context.to.count())) index++;
						kanban.data.move(kanban.getIndexById(id), index);
						kanban.data.unblockEvent();
						if (!sameList) {
							if (kanban.callEvent("onBeforeStatusChange", [id, this.config.status, this, context, e])) {
								var status = this.config.status;
								if ((typeof status === "undefined" ? "undefined" : _typeof(status)) == "object") for (var s in status) {
									item[s] = status[s];
								} else item.status = status;
								kanban.refresh(id);
								kanban.callEvent("onAfterStatusChange", [id, this.config.status, this, context, e]);
							}
						}
					}
	
					// to call onStoreUpdated handler
					if (sameList) for (i = 0; i < ids.length; i++) {
						kanban.refresh(ids[i]);
					}kanban.callEvent("onListAfterDrop", [context, e, this]);
				}
				return false;
			});
		},
		$dragCreate: function $dragCreate(a, e) {
			var text = webix.DragControl.$drag(a, e);
			if (!text) return false;
			var drag_container = document.createElement("DIV");
			drag_container.innerHTML = text;
			drag_container.className = "webix_drag_zone webix_kanban_drag_zone";
			document.body.appendChild(drag_container);
			return drag_container;
		},
		$dragPos: function $dragPos(pos) {
			pos.x = pos.x - 4;
			pos.y = pos.y - 4;
		},
		eachOtherList: function eachOtherList(code) {
			var self = this.config.id;
			var master = webix.$$(this.config.master);
	
			master.eachList(function (view) {
				if (view.config.id != self) code.call(webix.$$(self), view);
			});
		},
		type_setter: function type_setter(type) {
			var i = 0,
			    icon = null;
			var t = webix.ui.dataview.prototype.type_setter.apply(this, arguments);
			if (this.type.icons) {
				for (i = 0; i < this.type.icons.length; i++) {
					icon = this.type.icons[i];
					if (icon.click) {
						this.on_click['fa-' + icon.icon] = icon.click;
					}
				}
			}
			return t;
		},
		defaults: {
			drag: true,
			prerender: true,
			select: true,
			xCount: 1
	
		},
		type: {
			height: "auto",
			width: "auto",
			icons: [{ icon: "pencil" }],
			tagDemiliter: ",",
			templateTags: function templateTags(obj, common) {
				var res = [];
				if (obj.tags) {
					var tags = obj.tags.split(common.tagDemiliter);
					for (var i = 0; i < tags.length; i++) {
						res.push('<span class="webix_kanban_tag">' + tags[i] + '</span>');
					}
				}
				return '<div  class="webix_kanban_tags">' + (res.length ? res.join(' ') : "&nbsp;") + '</div>';
			},
			templateIcons: function templateIcons(obj, common) {
				var icons = [];
				var icon = null;
				var html = "";
				for (var i = 0; i < common.icons.length; i++) {
					icon = common.icons[i];
					if (!icon.show || icon.show(obj)) {
						html = '<span webix_icon_id="' + (icon.id || icon.icon) + '" class="webix_kanban_icon" title="' + (icon.tooltip || '') + '">';
	
						html += '<span class="fa-' + icon.icon + ' webix_icon"></span>';
	
						if (icon.template) {
							html += '<span class="webix_kanban_icon_text">' + webix.template(icon.template)(obj) + '</span>';
						}
						html += '</span>';
						icons.push(html);
					}
				}
				return '<div  class="webix_kanban_icons">' + icons.join(" ") + '</div>';
			},
			templateNoAvatar: webix.template("<span class='webix_icon fa-user'></span>"),
			templateAvatar: webix.template(""),
			templateBody: webix.template("#text#"),
			templateFooter: function templateFooter(obj, common) {
				var tags = common.templateTags(obj, common);
				return (tags ? tags : "&nbsp;") + common.templateIcons(obj, common);
			},
			templateStart: webix.template('<div webix_f_id="#id#" class="{common.classname()} webix_kanban_list_item" style="width:{common.width}px; height:{common.height}px;   overflow:hidden;float:left;">'),
			template: function template(obj, common) {
				//var img = (obj.img)?"<img src='"+obj.img+"'/>":"";
				var avatarResult = common.templateAvatar(obj, common);
				var avatar = '<div class="webix_kanban_user_avatar">' + (avatarResult ? avatarResult : common.templateNoAvatar(obj, common)) + '</div>';
				var body = '<div class="webix_kanban_body">' + common.templateBody(obj, common) + '</div>';
				var footer = '<div class="webix_kanban_footer">' + common.templateFooter.call(this, obj, common) + '</div>';
				var style = "border-left-color:" + obj.color;
				return avatar + '<div class="webix_kanban_list_content" style="' + style + '">' + body + footer + '</div>';
			}
		}
	}, webix.ui.dataview);

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	"use strict";

/***/ }
/******/ ]);