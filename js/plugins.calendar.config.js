/*
* FileName "plugins.calendar.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(PLUGIN_ID){var vars={};kb.field.load(kintone.app.getId()).then(function(fieldInfos){kb.view.load(kintone.app.getId()).then(function(viewInfos){kb.config[PLUGIN_ID].build({submit:function(container,config){var error=false;config.tab=[];config.flat={};(function(app){kb.config[PLUGIN_ID].tabbed.tabs.some(function(item){var res=kb.record.get(item.panel,app);if(!res.error)if(function(record){var res=[];if(record.title.value)res.push(fieldInfos.parallelize[record.title.value].tableCode);if(record.start.value)res.push(fieldInfos.parallelize[record.start.value].tableCode);
if(record.end.value)res.push(fieldInfos.parallelize[record.end.value].tableCode);return Array.from(new Set(res))}(res.record).length>1){kb.alert(kb.constants.config.message.invalid.table[kb.operator.language]);kb.config[PLUGIN_ID].tabbed.activate(item);error=true}else config.tab.push({label:item.label.html(),setting:res.record});else{kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]);kb.config[PLUGIN_ID].tabbed.activate(item);error=true}return error});if(config.tab.length!=
Array.from(new Set(config.tab.map(function(item){return item.setting.view.value}))).length){kb.alert(kb.constants.config.message.invalid.duplicate[kb.operator.language]);error=true}})({id:vars.app.id,fields:vars.app.fields.tab});config.tab=JSON.stringify(config.tab);config.flat=JSON.stringify(config.flat);return!error?config:false}},function(container,config){vars.app={id:PLUGIN_ID,fields:{tab:{view:{code:"view",type:"DROP_DOWN",label:"",required:true,noLabel:true,options:[]},title:{code:"title",
type:"DROP_DOWN",label:"",required:true,noLabel:true,options:[]},start:{code:"start",type:"DROP_DOWN",label:"",required:true,noLabel:true,options:[]},end:{code:"end",type:"DROP_DOWN",label:"",required:false,noLabel:true,options:[]},initial:{code:"initial",type:"RADIO_BUTTON",label:"",required:true,noLabel:true,options:[{index:0,label:"month"},{index:1,label:"week"},{index:2,label:"day"}]}},flat:{}}};kb.config[PLUGIN_ID].tabbed=new KintoneBoosterConfigTabbed(container,{add:function(tab){(function(app){tab.panel.addClass("kb-scope").attr("form-id",
"form_"+app.id).append(kb.create("h1").html(kb.constants.config.caption.view[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.view[kb.operator.language])).append(kb.field.activate(function(res){res.elm("select").empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields({placed:viewInfos.custom},function(result,current){result.push({code:current.id,label:current.name});return result}),"label","code");return res}(kb.field.create(app.fields.view)),
app))).append(kb.create("h1").html(kb.constants.config.caption.title[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.title[kb.operator.language])).append(kb.field.activate(function(res){res.elm("select").empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,function(result,current){result.push({code:current.code,label:current.label});return result}),"label","code");return res}(kb.field.create(app.fields.title)),app))).append(kb.create("h1").html(kb.constants.config.caption.start[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.start[kb.operator.language])).append(kb.field.activate(function(res){res.elm("select").empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,
function(result,current){switch(current.type){case "CALC":switch(current.format){case "DATE":case "DATETIME":result.push({code:current.code,label:current.label});break}break;case "CREATED_TIME":case "DATE":case "DATETIME":case "UPDATED_TIME":result.push({code:current.code,label:current.label});break}return result}),"label","code");return res}(kb.field.create(app.fields.start)),app))).append(kb.create("h1").html(kb.constants.config.caption.end[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.end[kb.operator.language])).append(kb.field.activate(function(res){res.elm("select").empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,
function(result,current){switch(current.type){case "CALC":switch(current.format){case "DATE":case "DATETIME":result.push({code:current.code,label:current.label});break}break;case "CREATED_TIME":case "DATE":case "DATETIME":case "UPDATED_TIME":result.push({code:current.code,label:current.label});break}return result}),"label","code");return res}(kb.field.create(app.fields.end)),app))).append(kb.create("h1").html(kb.constants.config.caption.initial[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.initial[kb.operator.language])).append(kb.field.activate(function(res){res.elms("[data-name="+
app.fields.initial.code+"]").each(function(element,index){element.closest("label").elm("span").html(kb.constants.config.caption.initial[element.val()][kb.operator.language])});return res}(kb.field.create(app.fields.initial)),app)));tab.panel.elms("input,select,textarea").each(function(element,index){return element.initialize()})})({id:vars.app.id,fields:vars.app.fields.tab})},copy:function(source,destination){(function(app){kb.record.set(destination.panel,app,kb.record.get(source.panel,app,true).record)})({id:vars.app.id,
fields:vars.app.fields.tab})},del:function(index){}});if(Object.keys(config).length!=0)(function(settings){settings.each(function(setting){(function(app,tab){kb.record.set(tab.panel,app,setting.setting);tab.label.html(setting.label)})({id:vars.app.id,fields:vars.app.fields.tab},kb.config[PLUGIN_ID].tabbed.add())})})(JSON.parse(config.tab));else kb.config[PLUGIN_ID].tabbed.add()})})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{start:{en:"Start Date",ja:"\u958b\u59cb\u65e5",zh:"\u5f00\u59cb\u65e5\u671f"},end:{en:"End Date",ja:"\u7d42\u4e86\u65e5\u6642",zh:"\u7ed3\u675f\u65e5\u671f"},initial:{en:"Initial Calendar Display",ja:"\u30ab\u30ec\u30f3\u30c0\u30fc\u306e\u521d\u671f\u8868\u793a",zh:"\u65e5\u5386\u7684\u521d\u59cb\u663e\u793a",day:{en:"Day",ja:"\u65e5",zh:"\u65e5"},month:{en:"Month",ja:"\u6708",zh:"\u6708"},week:{en:"Week",ja:"\u9031",zh:"\u5468"}},title:{en:"Title",ja:"\u30bf\u30a4\u30c8\u30eb",
zh:"\u6807\u9898"},view:{en:"View",ja:"\u4f7f\u7528\u4e00\u89a7",zh:"\u6807\u9898"}},description:{start:{en:"Please specify the field to use as the Start Date.",ja:"\u958b\u59cb\u65e5\u3068\u3057\u3066\u4f7f\u7528\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u4f5c\u4e3a\u5f00\u59cb\u65e5\u671f\u7684\u5b57\u6bb5\u3002"},end:{en:"Please specify the field to use as the End Date.",ja:"\u7d42\u4e86\u65e5\u3068\u3057\u3066\u4f7f\u7528\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
zh:"\u8bf7\u6307\u5b9a\u4f5c\u4e3a\u7ed3\u675f\u65e5\u671f\u7684\u5b57\u6bb5\u3002"},initial:{en:"Please specify the display format of the calendar after showing the list view.",ja:"\u4e00\u89a7\u753b\u9762\u3092\u8868\u793a\u3057\u305f\u5f8c\u3067\u8868\u793a\u3059\u308b\u30ab\u30ec\u30f3\u30c0\u30fc\u306e\u8868\u793a\u5f62\u5f0f\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u5728\u663e\u793a\u5217\u8868\u89c6\u56fe\u540e\u6307\u5b9a\u65e5\u5386\u7684\u663e\u793a\u683c\u5f0f\u3002"},
title:{en:"Please specify the field to use as the Title.",ja:"\u30bf\u30a4\u30c8\u30eb\u3068\u3057\u3066\u4f7f\u7528\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u4f5c\u4e3a\u6807\u9898\u7684\u5b57\u6bb5\u3002"},view:{en:"Please specify the list to enable this plugin using the settings below.",ja:"\u30bf\u30a4\u30c8\u30eb\u3068\u3057\u3066\u4f7f\u7528\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
zh:"\u8bf7\u4f7f\u7528\u4ee5\u4e0b\u8bbe\u7f6e\u9009\u62e9\u542f\u7528\u6b64\u63d2\u4ef6\u7684\u5217\u8868\u3002"}},message:{invalid:{duplicate:{en:"You cannot specify the same list in different tabs.",ja:"\u7570\u306a\u308b\u30bf\u30d6\u3067\u540c\u3058\u4e00\u89a7\u3092\u6307\u5b9a\u3059\u308b\u3053\u3068\u306f\u51fa\u6765\u307e\u305b\u3093\u3002",zh:"\u5728\u4e0d\u540c\u7684\u6807\u7b7e\u4e2d\u4e0d\u80fd\u6307\u5b9a\u76f8\u540c\u7684\u5217\u8868\u3002"},table:{en:"Check whether the specified fields are all from the same table or all from outside the table.",
ja:"\u6307\u5b9a\u3057\u305f\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u3059\u3079\u3066\u540c\u3058\u30c6\u30fc\u30d6\u30eb\u306e\u3082\u306e\u3067\u3042\u308b\u304b\u3001\u3059\u3079\u3066\u30c6\u30fc\u30d6\u30eb\u5916\u306e\u3082\u306e\u3067\u3042\u308b\u304b\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002",zh:"\u8bf7\u68c0\u67e5\u6307\u5b9a\u7684\u5b57\u6bb5\u662f\u5426\u5168\u90e8\u6765\u81ea\u540c\u4e00\u5f20\u8868\uff0c\u6216\u8005\u5168\u90e8\u6765\u81ea\u8868\u5916\u3002"}}}}},kb.constants);