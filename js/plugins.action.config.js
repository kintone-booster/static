/*
* FileName "plugins.action.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(e){var g,h;kb.field.load(kintone.app.getId()).then(function(l){kb.config[e].build({submit:function(k,b){try{return b.tab=[],b.flat={},b.tab=JSON.stringify(b.tab),b.flat=JSON.stringify(b.flat),b}catch(a){return kb.alert(kb.error.parse(a)),!1}}},function(k,b){try{h=e,g={},kb.config[e].tabbed=new KintoneBoosterConfigTabbed(k,{add:function(a){(function(c){a.panel.addClass("kb-scope").attr("form-id","form_"+c.id);a.panel.elms("input,select,textarea").each(function(d,f){return d.initialize()})})({id:h,
fields:g})},copy:function(a,c){var d={id:h,fields:g},f=kb.record.get(a.panel,d,!0).record;kb.record.set(c.panel,d,f)},del:function(a){}}),0!=Object.keys(b).length?function(a){a.each(function(c){var d={id:h,fields:g},f=kb.config[e].tabbed.add();kb.record.set(f.panel,d,c.setting);f.label.html(c.label)})}(JSON.parse(b.tab)):kb.config[e].tabbed.add()}catch(a){kb.alert(kb.error.parse(a))}})})})(kintone.$PLUGIN_ID);