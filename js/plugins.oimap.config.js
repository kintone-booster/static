/*
* FileName "plugins.oimap.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(f=>{var g={};kb.oauth.callback()||kb.field.load(kintone.app.getId()).then(k=>{kb.view.load(kintone.app.getId()).then(q=>{kb.config[f].build({submit:(m,h)=>{try{var e=!1;h.tab=[];h.flat={};(a=>{kb.config[f].tabbed.tabs.some(b=>{var d=kb.record.get(b.panel,a);d.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),kb.config[f].tabbed.activate(b),e=!0):h.tab.push({label:b.label.html(),setting:d.record});return e})})({id:g.app.id,fields:g.app.fields.tab});h.tab=
JSON.stringify(h.tab);h.flat=JSON.stringify(h.flat);return e?!1:h}catch(a){return kb.alert(kb.error.parse(a)),!1}}},(m,h)=>{try{g.app={id:f,fields:{tab:{label:{code:"label",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.label[kb.operator.language],required:!0,noLabel:!1,placeholder:""},message:{code:"message",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.message[kb.operator.language],required:!0,noLabel:!1,placeholder:""},view:{code:"view",type:"DROP_DOWN",label:kb.constants.config.caption.view[kb.operator.language],
required:!1,noLabel:!1,options:[]},client_id:{code:"client_id",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.client_id[kb.operator.language],required:!0,noLabel:!1,format:"text"},client_secret:{code:"client_secret",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.client_secret[kb.operator.language],required:!0,noLabel:!1,format:"text"},author:{code:"author",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.author[kb.operator.language],required:!0,noLabel:!1,format:"alphanum"},
provider:{code:"provider",type:"RADIO_BUTTON",label:kb.constants.config.caption.provider[kb.operator.language],required:!0,noLabel:!1,options:[{index:0,label:"GMail"},{index:1,label:"Exchange Online"}]},refresh_token:{code:"refresh_token",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.refresh_token[kb.operator.language],required:!1,noLabel:!1,format:"text"},uid:{code:"uid",type:"DROP_DOWN",label:kb.constants.config.caption.uid[kb.operator.language],required:!0,noLabel:!1,options:[]},from:{code:"from",
type:"DROP_DOWN",label:kb.constants.config.caption.from[kb.operator.language],required:!0,noLabel:!1,options:[]},cc:{code:"cc",type:"DROP_DOWN",label:kb.constants.config.caption.cc[kb.operator.language],required:!1,noLabel:!1,options:[]},date:{code:"date",type:"DROP_DOWN",label:kb.constants.config.caption.date[kb.operator.language],required:!0,noLabel:!1,options:[]},subject:{code:"subject",type:"DROP_DOWN",label:kb.constants.config.caption.subject[kb.operator.language],required:!0,noLabel:!1,options:[]},
body:{code:"body",type:"DROP_DOWN",label:kb.constants.config.caption.body[kb.operator.language],required:!0,noLabel:!1,options:[]},attachment:{code:"attachment",type:"DROP_DOWN",label:kb.constants.config.caption.attachment[kb.operator.language],required:!0,noLabel:!1,options:[]}},flat:{}}},(e=>{for(var a in e)g.app.fields.tab[a]=e[a]})(kb.config[f].ui.fields.conditions.get(k)),(e=>{for(var a in e)g.app.fields.tab[a]=e[a]})(kb.config[f].ui.fields.users.get(k)),kb.config[f].tabbed=new KintoneBoosterConfigTabbed(m,
{add:e=>{(a=>{e.panel.addClass("kb-scope").attr("form-id","form_"+a.id).append(kb.config[f].ui.fields.users.set(kb.config[f].ui.fields.conditions.set(kb.create("div").addClass("kb-config-tabbed-panel-block"),a,!0),a).append(kb.create("h1").html(kb.constants.config.caption.button[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(a.fields.label).css({width:"100%"}),a))).append(kb.create("section").append(kb.field.activate(kb.field.create(a.fields.message).css({width:"100%"}),
a))).append(kb.create("section").append(kb.field.activate((b=>{b.elm("select").empty().assignOption([{code:"",label:kb.constants.config.caption.view.all[kb.operator.language]}].concat(q.list.map(d=>({code:d.id,label:d.name}))),"label","code");return b})(kb.field.create(a.fields.view)),a)))).append(kb.create("h1").html(kb.constants.config.caption.server[kb.operator.language])).append(kb.create("section").append(kb.create("div").append(kb.field.activate(kb.field.create(a.fields.client_id),a))).append(kb.create("div").append(kb.field.activate(kb.field.create(a.fields.client_secret),
a))).append(kb.create("div").append(kb.field.activate(kb.field.create(a.fields.author),a))).append(kb.create("div").append(kb.field.activate(kb.field.create(a.fields.provider),a))).append(kb.create("div").append(kb.field.activate(kb.field.create(a.fields.refresh_token).addClass("kb-readonly"),a))).append(kb.create("button").addClass("kb-action-button kb-page-detail").html(kb.constants.config.caption.popup[kb.operator.language]).on("click",b=>{var d=b="",c=kb.record.get(e.panel,a,!0).record;if(c.client_id.value)if(c.client_secret.value){switch(c.provider.value){case "GMail":d=
"https://mail.google.com/";b="google";break;case "Exchange Online":d="https://outlook.office.com/IMAP.AccessAsUser.All https://outlook.office.com/POP.AccessAsUser.All https://outlook.office.com/SMTP.Send offline_access",b="microsoft"}kb.oauth.authorize(c.client_id.value,c.client_secret.value,d,b).then(l=>{var n=kb.record,r=n.set,t=e.panel,p={};p.refresh_token={value:l};r.call(n,t,a,p)}).catch(l=>kb.alert(l?l:"Failed to get the authentication code."))}else kb.alert(kb.constants.config.message.invalid.client_secret[kb.operator.language]);
else kb.alert(kb.constants.config.message.invalid.client_id[kb.operator.language])}))).append(kb.create("h1").html(kb.constants.config.caption.receive[kb.operator.language])).append(kb.create("section").append(kb.create("div").append(kb.field.activate((b=>{b.elm("select").empty().assignOption(kb.config[f].ui.options.fields(k,(d,c)=>{switch(c.type){case "SINGLE_LINE_TEXT":c.lookup||d.push({code:c.code,label:c.label})}return d}),"label","code");return b})(kb.field.create(a.fields.uid)),a))).append(kb.create("div").append(kb.field.activate((b=>
{b.elm("select").empty().assignOption(kb.config[f].ui.options.fields(k,(d,c)=>{switch(c.type){case "LINK":"MAIL"==c.protocol&&d.push({code:c.code,label:c.label})}return d}),"label","code");return b})(kb.field.create(a.fields.from)),a))).append(kb.create("div").append(kb.field.activate((b=>{b.elm("select").empty().assignOption(kb.config[f].ui.options.fields(k,(d,c)=>{switch(c.type){case "SINGLE_LINE_TEXT":c.lookup||d.push({code:c.code,label:c.label})}return d}),"label","code");return b})(kb.field.create(a.fields.cc)),
a))).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.cc[kb.operator.language])).append(kb.create("div").append(kb.field.activate((b=>{b.elm("select").empty().assignOption(kb.config[f].ui.options.fields(k,(d,c)=>{switch(c.type){case "DATETIME":d.push({code:c.code,label:c.label})}return d}),"label","code");return b})(kb.field.create(a.fields.date)),a))).append(kb.create("div").append(kb.field.activate((b=>{b.elm("select").empty().assignOption(kb.config[f].ui.options.fields(k,
(d,c)=>{switch(c.type){case "SINGLE_LINE_TEXT":c.lookup||d.push({code:c.code,label:c.label})}return d}),"label","code");return b})(kb.field.create(a.fields.subject)),a))).append(kb.create("div").append(kb.field.activate((b=>{b.elm("select").empty().assignOption(kb.config[f].ui.options.fields(k,(d,c)=>{switch(c.type){case "MULTI_LINE_TEXT":case "RICH_TEXT":d.push({code:c.code,label:c.label})}return d}),"label","code");return b})(kb.field.create(a.fields.body)),a))).append(kb.create("div").append(kb.field.activate((b=>
{b.elm("select").empty().assignOption(kb.config[f].ui.options.fields(k,(d,c)=>{switch(c.type){case "FILE":d.push({code:c.code,label:c.label})}return d}),"label","code");return b})(kb.field.create(a.fields.attachment)),a))));e.panel.elms("input,select,textarea").each((b,d)=>b.initialize())})({id:g.app.id,fields:g.app.fields.tab})},copy:(e,a)=>{var b={id:g.app.id,fields:g.app.fields.tab};e=kb.record.get(e.panel,b,!0).record;kb.record.set(a.panel,b,e)},del:e=>{}}),0!=Object.keys(h).length?(e=>{e.each(a=>
{var b={id:g.app.id,fields:g.app.fields.tab},d=kb.config[f].tabbed.add();kb.record.set(d.panel,b,a.setting);d.label.html(a.label)})})(JSON.parse(h.tab)):kb.config[f].tabbed.add()}catch(e){kb.alert(kb.error.parse(e))}})})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{attachment:{en:"Attachment Field",ja:"\u6dfb\u4ed8\u30d5\u30a1\u30a4\u30eb\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u9644\u4ef6\u5b57\u6bb5"},author:{en:"Username (Email Address)",ja:"\u30e6\u30fc\u30b6\u30fc\u540d\uff08\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\uff09",zh:"\u7528\u6237\u540d\uff08\u7535\u5b50\u90ae\u4ef6\u5730\u5740\uff09"},body:{en:"Body",ja:"\u672c\u6587",zh:"\u6b63\u6587"},button:{en:"Execution Button Setting",ja:"\u5b9f\u884c\u30dc\u30bf\u30f3",
zh:"\u6267\u884c\u6309\u94ae\u8bbe\u7f6e"},cc:{en:"CC",ja:"CC",zh:"CC"},client_id:{en:"Client ID",ja:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8ID",zh:"\u5ba2\u6237\u7aefID"},client_secret:{en:"Client Secret",ja:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30b7\u30fc\u30af\u30ec\u30c3\u30c8",zh:"\u5ba2\u6237\u7aef\u5bc6\u94a5"},date:{en:"Received DateTime",ja:"\u53d7\u4fe1\u65e5\u6642",zh:"\u63a5\u6536\u65e5\u671f\u65f6\u95f4"},from:{en:"Sender",ja:"\u5dee\u51fa\u4eba",zh:"\u53d1\u4ef6\u4eba"},label:{en:"Execution Button Label",
ja:"\u5b9f\u884c\u30dc\u30bf\u30f3\u306e\u30e9\u30d9\u30eb\u30c6\u30ad\u30b9\u30c8",zh:"\u6267\u884c\u6309\u94ae\u7684\u6807\u7b7e\u540d\u79f0"},message:{en:"Execution Confirmation Dialog Message",ja:"\u5b9f\u884c\u78ba\u8a8d\u30c0\u30a4\u30a2\u30ed\u30b0\u306e\u30e1\u30c3\u30bb\u30fc\u30b8",zh:"\u6267\u884c\u786e\u8ba4\u5bf9\u8bdd\u6846\u7684\u6d88\u606f"},popup:{en:"Get the refresh token",ja:"\u30ea\u30d5\u30ec\u30c3\u30b7\u30e5\u30c8\u30fc\u30af\u30f3\u3092\u53d6\u5f97",zh:"\u83b7\u53d6\u5237\u65b0\u4ee4\u724c"},
provider:{en:"Service Name",ja:"\u30b5\u30fc\u30d3\u30b9\u540d",zh:"\u670d\u52a1\u540d\u79f0"},receive:{en:"Email Storage Settings",ja:"\u30e1\u30fc\u30eb\u4fdd\u5b58\u8a2d\u5b9a",zh:"\u90ae\u4ef6\u4fdd\u5b58\u8bbe\u7f6e"},refresh_token:{en:"Refresh Token",ja:"\u30ea\u30d5\u30ec\u30c3\u30b7\u30e5\u30c8\u30fc\u30af\u30f3",zh:"\u5237\u65b0\u4ee4\u724c"},server:{en:"OAuth Settings",ja:"OAuth\u8a2d\u5b9a",zh:"OAuth\u8bbe\u7f6e"},subject:{en:"Subject",ja:"\u4ef6\u540d",zh:"\u4e3b\u9898"},uid:{en:"UID",
ja:"\u30e1\u30fc\u30ebID",zh:"\u90ae\u7bb1ID"},view:{en:"List View where buttons can be placed",ja:"\u30dc\u30bf\u30f3\u3092\u6709\u52b9\u306b\u3059\u308b\u4e00\u89a7\u753b\u9762",zh:"\u53ef\u4ee5\u653e\u7f6e\u6309\u94ae\u7684\u5217\u8868\u89c6\u56fe",all:{en:"No restrictions",ja:"\u5236\u9650\u3057\u306a\u3044",zh:"\u4e0d\u9650\u5236"}}},description:{cc:{en:"Since there may be multiple email addresses set in the CC, the field that can be specified will be a string field, not a link field.",ja:"CC\u306b\u306f\u8907\u6570\u306e\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u304c\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u306e\u3067\u3001\u6307\u5b9a\u53ef\u80fd\u306a\u30d5\u30a3\u30fc\u30eb\u30c9\u306f\u30ea\u30f3\u30af\u30d5\u30a3\u30fc\u30eb\u30c9\u3067\u306f\u306a\u304f\u3001\u6587\u5b57\u5217\u30d5\u30a3\u30fc\u30eb\u30c9\u306b\u306a\u308a\u307e\u3059\u3002",
zh:"\u7531\u4e8e\u5728CC\u4e2d\u53ef\u80fd\u8bbe\u7f6e\u4e86\u591a\u4e2a\u7535\u5b50\u90ae\u4ef6\u5730\u5740\uff0c\u53ef\u4ee5\u6307\u5b9a\u7684\u5b57\u6bb5\u5c06\u662f\u5b57\u7b26\u4e32\u5b57\u6bb5\uff0c\u800c\u4e0d\u662f\u94fe\u63a5\u5b57\u6bb5\u3002"}},message:{invalid:{client_id:{en:"Please enter the client ID.",ja:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8ID\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u8f93\u5165\u5ba2\u6237\u7aefID\u3002"},client_secret:{en:"Please enter the client secret.",
ja:"\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u8f93\u5165\u5ba2\u6237\u7aef\u5bc6\u94a5\u3002"}}}}},kb.constants);