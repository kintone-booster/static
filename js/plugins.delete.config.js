/*
* FileName "plugins.delete.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(f=>{var l={};kb.field.load(kintone.app.getId()).then(n=>{kb.apps.load().then(x=>{kb.config[f].build({submit:(p,m)=>{try{var d=!1;m.tab=[];m.flat={};(c=>{kb.config[f].tabbed.tabs.some(b=>{var a=kb.record.get(b.panel,c);a.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),kb.config[f].tabbed.activate(b),d=!0):(a.record.backupApp.value?(d||a.record.backupID.value||(kb.alert(kb.constants.config.message.invalid.backup.id[kb.operator.language]),kb.config[f].tabbed.activate(b),
d=!0),d||a.record.backupName.value||(kb.alert(kb.constants.config.message.invalid.backup.name[kb.operator.language]),kb.config[f].tabbed.activate(b),d=!0),d||a.record.backupUser.value||(kb.alert(kb.constants.config.message.invalid.backup.user[kb.operator.language]),kb.config[f].tabbed.activate(b),d=!0),d||a.record.backupDatetime.value||(kb.alert(kb.constants.config.message.invalid.backup.datetime[kb.operator.language]),kb.config[f].tabbed.activate(b),d=!0),d||a.record.backupFile.value||(kb.alert(kb.constants.config.message.invalid.backup.file[kb.operator.language]),
kb.config[f].tabbed.activate(b),d=!0),d||a.record.backupRecord.value||(kb.alert(kb.constants.config.message.invalid.backup.record[kb.operator.language]),kb.config[f].tabbed.activate(b),d=!0)):(a.record.backupID.value="",a.record.backupName.value="",a.record.backupUser.value="",a.record.backupDatetime.value="",a.record.backupFile.value="",a.record.backupRecord.value=""),d||(a.record.suspendMessage.value||(a.record.suspendFilter.value="",a.record.suspendContinue.value=[]),m.tab.push({label:b.label.html(),
setting:a.record})));return d})})({id:l.app.id,fields:l.app.fields.tab});m.tab=JSON.stringify(m.tab);m.flat=JSON.stringify(m.flat);return d?!1:m}catch(c){return kb.alert(kb.error.parse(c)),!1}}},(p,m)=>{try{l.app={id:f,fields:{tab:{suspendFilter:{code:"suspendFilter",type:"CONDITION",label:"",required:!1,noLabel:!0,app:{id:kintone.app.getId(),fields:n.parallelize}},suspendMessage:{code:"suspendMessage",type:"SINGLE_LINE_TEXT",label:"",required:!1,noLabel:!0,placeholder:""},suspendContinue:{code:"suspendContinue",
type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"continue"}]},backupApp:{code:"backupApp",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},backupID:{code:"backupID",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},backupName:{code:"backupName",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},backupUser:{code:"backupUser",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},backupDatetime:{code:"backupDatetime",type:"DROP_DOWN",label:"",
required:!1,noLabel:!0,options:[]},backupFile:{code:"backupFile",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},backupRecord:{code:"backupRecord",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]}},flat:{}}};var d=(c,b,a)=>{kb.record.set(c.panel,b,(()=>{c.panel.elm("[field-id=backupApp]").elm("select").val(a.backupApp.value).rebuild().then(g=>{(e=>{a.backupID.value in g.number?e.elm("select").val(a.backupID.value):e.elm("select").val("")})(c.panel.elm("[field-id=backupID]").elm(".kb-field-value"));
(e=>{a.backupName.value in g.singleline?e.elm("select").val(a.backupName.value):e.elm("select").val("")})(c.panel.elm("[field-id=backupName]").elm(".kb-field-value"));(e=>{a.backupUser.value in g.user?e.elm("select").val(a.backupUser.value):e.elm("select").val("")})(c.panel.elm("[field-id=backupUser]").elm(".kb-field-value"));(e=>{a.backupDatetime.value in g.datetime?e.elm("select").val(a.backupDatetime.value):e.elm("select").val("")})(c.panel.elm("[field-id=backupDatetime]").elm(".kb-field-value"));
(e=>{a.backupFile.value in g.file?e.elm("select").val(a.backupFile.value):e.elm("select").val("")})(c.panel.elm("[field-id=backupFile]").elm(".kb-field-value"));(e=>{a.backupRecord.value in g.multiline?e.elm("select").val(a.backupRecord.value):e.elm("select").val("")})(c.panel.elm("[field-id=backupRecord]").elm(".kb-field-value"))});return a})())};(c=>{for(var b in c)l.app.fields.tab[b]=c[b]})(kb.config[f].ui.fields.conditions.get(n));(c=>{for(var b in c)l.app.fields.tab[b]=c[b]})(kb.config[f].ui.fields.users.get(n));
kb.config[f].tabbed=new KintoneBoosterConfigTabbed(p,{add:c=>{(b=>{c.fields={external:{},internal:n};c.panel.addClass("kb-scope").attr("form-id","form_"+b.id).append(kb.config[f].ui.fields.users.set(kb.config[f].ui.fields.conditions.set(kb.create("div").addClass("kb-config-tabbed-panel-block"),b),b)).append(kb.create("h1").html(kb.constants.config.caption.suspend[kb.operator.language])).append(kb.create("section").append(kb.create("h1").html(kb.constants.config.caption.suspend.filter[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.suspendFilter).css({width:"100%"}),
b))).append(kb.create("h1").html(kb.constants.config.caption.suspend.message[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.suspendMessage).css({width:"100%"}),b)).append(kb.field.activate((a=>{a.elm("input").closest("label").elm("span").html(kb.constants.config.caption.suspend.continue[kb.operator.language]);return a})(kb.field.create(b.fields.suspendContinue).css({width:"100%"})),b)))).append(kb.create("h1").html(kb.constants.config.caption.backup[kb.operator.language])).append(kb.create("section").append(kb.create("h1").html(kb.constants.config.caption.backup.app[kb.operator.language])).append(kb.create("section").append((a=>
{a.elm("select").empty().assignOption([{appId:"",name:""}].concat(x),"name","appId").on("change",g=>g.currentTarget.rebuild()).rebuild=()=>new Promise((g,e)=>{((q,r,t,u,v,w)=>{q.elm("select").empty().assignOption([{code:"",label:""}],"label","code");r.elm("select").empty().assignOption([{code:"",label:""}],"label","code");t.elm("select").empty().assignOption([{code:"",label:""}],"label","code");u.elm("select").empty().assignOption([{code:"",label:""}],"label","code");v.elm("select").empty().assignOption([{code:"",
label:""}],"label","code");w.elm("select").empty().assignOption([{code:"",label:""}],"label","code");a.elm("select").val()?kb.field.load(a.elm("select").val()).then(h=>{c.fields.external=h;a.elm("select").val();h={datetime:{},file:{},multiline:{},number:{},singleline:{},user:{}};for(var y in c.fields.external.parallelize){var k=c.fields.external.parallelize[y];if(!c.fields.internal.disables.includes(k.code)&&!k.tableCode)switch(k.type){case "DATETIME":h.datetime[k.code]=k;break;case "FILE":h.file[k.code]=
k;break;case "MULTI_LINE_TEXT":h.multiline[k.code]=k;break;case "NUMBER":h.number[k.code]=k;break;case "SINGLE_LINE_TEXT":h.singleline[k.code]=k;break;case "USER_SELECT":h.user[k.code]=k}}q.elm("select").assignOption(Object.values(h.number),"label","code");r.elm("select").assignOption(Object.values(h.singleline),"label","code");t.elm("select").assignOption(Object.values(h.user),"label","code");u.elm("select").assignOption(Object.values(h.datetime),"label","code");v.elm("select").assignOption(Object.values(h.file),
"label","code");w.elm("select").assignOption(Object.values(h.multiline),"label","code");g(h)}):g({datetime:{},file:{},multiline:{},number:{},singleline:{},user:{}})})(c.panel.elm("[field-id=backupID]").elm(".kb-field-value"),c.panel.elm("[field-id=backupName]").elm(".kb-field-value"),c.panel.elm("[field-id=backupUser]").elm(".kb-field-value"),c.panel.elm("[field-id=backupDatetime]").elm(".kb-field-value"),c.panel.elm("[field-id=backupFile]").elm(".kb-field-value"),c.panel.elm("[field-id=backupRecord]").elm(".kb-field-value"))});
return a})(kb.field.activate(kb.field.create(b.fields.backupApp),b)))).append(kb.create("h1").html(kb.constants.config.caption.backup.id[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.backupID),b))).append(kb.create("h1").html(kb.constants.config.caption.backup.name[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.backupName),b))).append(kb.create("h1").html(kb.constants.config.caption.backup.user[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.backupUser),
b))).append(kb.create("h1").html(kb.constants.config.caption.backup.datetime[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.backupDatetime),b))).append(kb.create("h1").html(kb.constants.config.caption.backup.file[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.backupFile),b))).append(kb.create("h1").html(kb.constants.config.caption.backup.record[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.backupRecord),
b))));c.panel.elm("[field-id=backupApp]").elm("select").rebuild();c.panel.elms("input,select,textarea").each((a,g)=>a.initialize())})({id:l.app.id,fields:l.app.fields.tab})},copy:(c,b)=>{var a={id:l.app.id,fields:l.app.fields.tab};d(b,a,kb.record.get(c.panel,a,!0).record)},del:c=>{}});Object.keys(m).length!=0?(c=>{c.each(b=>{var a={id:l.app.id,fields:l.app.fields.tab},g=kb.config[f].tabbed.add();d(g,a,b.setting);g.label.html(b.label)})})(JSON.parse(m.tab)):kb.config[f].tabbed.add().panel.elm("[field-id=backupApp]").elm("select").rebuild()}catch(c){kb.alert(kb.error.parse(c))}})})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{backup:{en:"Copy to Backup App",ja:"\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u7528\u30a2\u30d7\u30ea\u306b\u30b3\u30d4\u30fc",zh:"\u5907\u4efd\u7528\u590d\u5236\u5e94\u7528","zh-TW":"\u5099\u4efd\u7528\u8907\u88fd\u61c9\u7528",app:{en:"Destination App for Backup",ja:"\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u5148\u30a2\u30d7\u30ea",zh:"\u5907\u4efd\u76ee\u6807\u5e94\u7528","zh-TW":"\u5099\u4efd\u76ee\u6a19\u61c9\u7528"},datetime:{en:"Deletion Date Save Field",ja:"\u524a\u9664\u65e5\u6642\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9",
zh:"\u5220\u9664\u65e5\u671f\u4fdd\u5b58\u5b57\u6bb5","zh-TW":"\u522a\u9664\u65e5\u671f\u4fdd\u5b58\u5b57\u6bb5"},file:{en:"Deleted Attachment Save Field",ja:"\u524a\u9664\u6dfb\u4ed8\u30d5\u30a1\u30a4\u30eb\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u5220\u9664\u9644\u4ef6\u4fdd\u5b58\u5b57\u6bb5","zh-TW":"\u522a\u9664\u9644\u4ef6\u4fdd\u5b58\u5b57\u6bb5"},id:{en:"App ID Save Field",ja:"\u30a2\u30d7\u30eaID\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u5e94\u7528ID\u4fdd\u5b58\u5b57\u6bb5",
"zh-TW":"\u61c9\u7528ID\u4fdd\u5b58\u5b57\u6bb5"},name:{en:"App Name Save Field",ja:"\u30a2\u30d7\u30ea\u540d\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u5e94\u7528\u540d\u79f0\u4fdd\u5b58\u5b57\u6bb5","zh-TW":"\u61c9\u7528\u540d\u7a31\u4fdd\u5b58\u5b57\u6bb5"},record:{en:"Deleted Record Save Field",ja:"\u524a\u9664\u30ec\u30b3\u30fc\u30c9\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u5220\u9664\u8bb0\u5f55\u4fdd\u5b58\u5b57\u6bb5","zh-TW":"\u522a\u9664\u8a18\u9304\u4fdd\u5b58\u5b57\u6bb5"},
user:{en:"Deleted User Save Field",ja:"\u524a\u9664\u30e6\u30fc\u30b6\u30fc\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u5220\u9664\u7528\u6237\u4fdd\u5b58\u5b57\u6bb5","zh-TW":"\u522a\u9664\u7528\u6236\u4fdd\u5b58\u5b57\u6bb5"}},suspend:{en:"Pause deletion when additional conditions are met, and display a message",ja:"\u8ffd\u52a0\u6761\u4ef6\u306b\u5408\u81f4\u3057\u305f\u3089\u3001\u524a\u9664\u3092\u4e2d\u65ad\u3057\u3066\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u8868\u793a\u3059\u308b",zh:"\u6ee1\u8db3\u9644\u52a0\u6761\u4ef6\u65f6\u6682\u505c\u5220\u9664\uff0c\u5e76\u663e\u793a\u6d88\u606f",
"zh-TW":"\u6eff\u8db3\u9644\u52a0\u689d\u4ef6\u6642\u66ab\u505c\u522a\u9664\uff0c\u4e26\u986f\u793a\u6d88\u606f",continue:{en:"Allow decision on whether to continue deletion",ja:"\u524a\u9664\u3092\u7d9a\u884c\u3059\u308b\u304b\u3069\u3046\u304b\u5224\u65ad\u51fa\u6765\u308b\u3088\u3046\u306b\u3059\u308b",zh:"\u5141\u8bb8\u51b3\u5b9a\u662f\u5426\u7ee7\u7eed\u5220\u9664","zh-TW":"\u5141\u8a31\u6c7a\u5b9a\u662f\u5426\u7e7c\u7e8c\u522a\u9664"},filter:{en:"Additional conditions for displaying a message",
ja:"\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u8868\u793a\u3059\u308b\u8ffd\u52a0\u6761\u4ef6",zh:"\u663e\u793a\u6d88\u606f\u7684\u9644\u52a0\u6761\u4ef6","zh-TW":"\u986f\u793a\u6d88\u606f\u7684\u9644\u52a0\u689d\u4ef6"},message:{en:"Message",ja:"\u30e1\u30c3\u30bb\u30fc\u30b8",zh:"\u6d88\u606f","zh-TW":"\u6d88\u606f"}}},message:{invalid:{backup:{datetime:{en:"Please specify the Deletion Date Save Field.",ja:"\u524a\u9664\u65e5\u6642\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u8bf7\u6307\u5b9a\u5220\u9664\u65e5\u671f\u4fdd\u5b58\u5b57\u6bb5\u3002","zh-TW":"\u8acb\u6307\u5b9a\u522a\u9664\u65e5\u671f\u4fdd\u5b58\u5b57\u6bb5\u3002"},file:{en:"Please specify the Deleted Attachment Save Field.",ja:"\u524a\u9664\u6dfb\u4ed8\u30d5\u30a1\u30a4\u30eb\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u5220\u9664\u9644\u4ef6\u4fdd\u5b58\u5b57\u6bb5\u3002","zh-TW":"\u8acb\u6307\u5b9a\u522a\u9664\u9644\u4ef6\u4fdd\u5b58\u5b57\u6bb5\u3002"},
id:{en:"Please specify the App ID Save Field.",ja:"\u30a2\u30d7\u30eaID\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u5e94\u7528ID\u4fdd\u5b58\u5b57\u6bb5\u3002","zh-TW":"\u8acb\u6307\u5b9a\u61c9\u7528ID\u4fdd\u5b58\u5b57\u6bb5\u3002"},name:{en:"Please specify the App Name Save Field.",ja:"\u30a2\u30d7\u30ea\u540d\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u5e94\u7528\u540d\u79f0\u4fdd\u5b58\u5b57\u6bb5\u3002",
"zh-TW":"\u8acb\u6307\u5b9a\u61c9\u7528\u540d\u7a31\u4fdd\u5b58\u5b57\u6bb5\u3002"},record:{en:"Please specify the Deleted Record Save Field.",ja:"\u524a\u9664\u30ec\u30b3\u30fc\u30c9\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u5220\u9664\u8bb0\u5f55\u4fdd\u5b58\u5b57\u6bb5\u3002","zh-TW":"\u8acb\u6307\u5b9a\u522a\u9664\u8a18\u9304\u4fdd\u5b58\u5b57\u6bb5\u3002"},user:{en:"Please specify the Deleted User Save Field.",ja:"\u524a\u9664\u30e6\u30fc\u30b6\u30fc\u4fdd\u5b58\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u8bf7\u6307\u5b9a\u5220\u9664\u7528\u6237\u4fdd\u5b58\u5b57\u6bb5\u3002","zh-TW":"\u8acb\u6307\u5b9a\u522a\u9664\u7528\u6236\u4fdd\u5b58\u5b57\u6bb5\u3002"}}}}}},kb.constants);