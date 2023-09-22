/*
* FileName "plugins.action.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(c){var e,f;kb.field.load(kintone.app.getId()).then(function(k){kb.config[c].build({submit:function(h,a){a.tab=[];a.flat={};a.tab=JSON.stringify(a.tab);a.flat=JSON.stringify(a.flat);return a}},function(h,a){f=c;e={};kb.config[c].tabbed=new KintoneBoosterConfigTabbed(h,{add:function(b){(function(g){b.panel.addClass("kb-scope").attr("form-id","form_"+g.id);b.panel.elms("input,select,textarea").each(function(d,l){return d.initialize()})})({id:f,fields:e})},copy:function(b,g){var d={id:f,fields:e};
kb.record.set(g.panel,d,kb.record.get(b.panel,d,!0).record)},del:function(b){}});0==Object.keys(a).length&&kb.config[c].tabbed.add()})})})(kintone.$PLUGIN_ID);