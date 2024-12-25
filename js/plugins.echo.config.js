/*
* FileName "plugins.echo.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(l=>{var f={};kb.field.load(kintone.app.getId()).then(w=>{kb.view.load(kintone.app.getId()).then(u=>{kb.apps.load().then(x=>{kb.roleSet.load().then(()=>{kb.config[l].build({submit:(v,h)=>{try{var k=!1;h.tab=[];h.flat={};(m=>{kb.config[l].tabbed.tabs.some(b=>{var a=kb.record.get(b.panel,m);a.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),kb.config[l].tabbed.activate(b),k=!0):k||(a.record.directory.value.match(/^[0-9a-z-_.!']+$/g)?["api","static"].includes(a.record.directory.value)?
(kb.alert(kb.constants.config.message.invalid.reserved[kb.operator.language]),kb.config[l].tabbed.activate(b),k=!0):h.tab.push({label:b.label.html(),setting:a.record}):(kb.alert(kb.constants.config.message.invalid.characters[kb.operator.language]),kb.config[l].tabbed.activate(b),k=!0));return k});h.tab.length!=[...(new Set(h.tab.map(b=>b.setting.directory.value)))].length&&(kb.alert(kb.constants.config.message.invalid.duplicate[kb.operator.language]),k=!0)})({id:f.app.id,fields:f.app.fields.tab});
h.tab=JSON.stringify(h.tab);h.flat=JSON.stringify(h.flat);kb.event.off("kb.config.submit.call").on("kb.config.submit.call",m=>new Promise((b,a)=>{var c={},d=(e,g)=>{0!=f.plugins.installed.length?(n=>{(new KintoneBoosterConfig(f.plugins.keys[n])).config.get().then(p=>{c[n]=JSON.parse(p.tab).map((q,t)=>kb.extend({sIndex:{value:t.toString()}},q.setting)).reduce((q,t)=>{["all","injector"].includes(t.device.value)&&q.push(t);return q},[]);e++;e<f.plugins.installed.length?d(e,g):g()}).catch(p=>b({error:!0}))})(f.plugins.installed[e]):
g()};d(0,()=>{(e=>{fetch("https://api.kintone-booster.com/echo",{method:"PUT",headers:{"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({app:e.appId,data:JSON.parse(h.tab).map(g=>g.setting),generated:f.generated,host:location.host,plugins:c,space:location.href.match(/\/k\/guest/g)?e.spaceId:""})}).then(g=>{g.json().then(n=>{200!=g.status?(kb.alert(kb.error.parse(result)),b({error:!0})):b({error:!1})})}).catch(g=>{kb.alert(kb.error.parse(g));b({error:!0})})})(x.filter(e=>e.appId==kintone.app.getId()).first())})}));
return k?!1:h}catch(m){return kb.alert(kb.error.parse(m)),!1}}},(v,h)=>{try{f.app={id:l,fields:{tab:{view:{code:"view",type:"DROP_DOWN",label:kb.constants.config.caption.view[kb.operator.language],required:!0,noLabel:!1,options:[]},title:{code:"title",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.title[kb.operator.language],required:!0,noLabel:!1,format:"text"},description:{code:"description",type:"MULTI_LINE_TEXT",label:kb.constants.config.caption.description[kb.operator.language],required:!1,
noLabel:!1,lines:"5"},directory:{code:"directory",type:"SINGLE_LINE_TEXT",label:"",required:!0,noLabel:!0,format:"text"},operator:{code:"operator",type:"DROP_DOWN",label:kb.constants.config.caption.operator[kb.operator.language],required:!0,noLabel:!1,options:[]},pass:{code:"pass",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.pass[kb.operator.language],required:!0,noLabel:!1,format:"password"},basicOperator:{code:"basicOperator",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.basic.operator[kb.operator.language],
required:!1,noLabel:!1,format:"text"},basicPass:{code:"basicPass",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.basic.pass[kb.operator.language],required:!1,noLabel:!1,format:"password"},accessPass:{code:"accessPass",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.access.pass[kb.operator.language],required:!1,noLabel:!1,format:"password"},accessField:{code:"accessField",type:"SUBTABLE",label:"",noLabel:!0,fields:{field:{code:"field",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,
options:[]}}},plugin:{code:"plugin",type:"CHECK_BOX",label:kb.constants.config.caption.plugin[kb.operator.language],required:!1,noLabel:!1,options:[]},injectorAddURL:{code:"injectorAddURL",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.injector.add[kb.operator.language],required:!1,noLabel:!1,format:"url"},injectorEditURL:{code:"injectorEditURL",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.injector.edit[kb.operator.language],required:!1,noLabel:!1,format:"url"},injectorPattern:{code:"injectorPattern",
type:"RADIO_BUTTON",label:"",required:!1,noLabel:!0,options:[{index:0,label:"detail"},{index:1,label:"edit"}]},customizeJs:{code:"customizeJs",type:"MULTI_LINE_TEXT",label:kb.constants.config.caption.customize.js[kb.operator.language],required:!1,noLabel:!1,lines:"5"},customizeCSS:{code:"customizeCSS",type:"MULTI_LINE_TEXT",label:kb.constants.config.caption.customize.css[kb.operator.language],required:!1,noLabel:!1,lines:"5"}},flat:{}}};f.generated=0!=Object.keys(h).length?JSON.parse(h.tab).map(b=>
b.setting.directory.value):[];f.plugins={installed:[],keys:{style:"ckcjgfhmgkibngjnopmehnelkbefdada"}};var k=(b,a,c)=>{var d=kb.record,e=d.set,g=b.panel;c.directory.value&&b.panel.elm(".kb-url").append(kb.create("a").attr("href","https://echo.kintone-booster.com/"+c.directory.value+"/").attr("target","_blank").html("https://echo.kintone-booster.com/"+c.directory.value+"/"));e.call(d,g,a,c)},m;for(m in f.plugins.keys)try{(b=>{b&&0!=Object.keys(b).length&&f.plugins.installed.push(m)})(kintone.plugin.app.getConfig(f.plugins.keys[m]))}catch(b){}kb.config[l].tabbed=
new KintoneBoosterConfigTabbed(v,{add:b=>{(a=>{b.tables={accessField:kb.table.activate(kb.table.create(a.fields.accessField),a)};b.panel.addClass("kb-scope").attr("form-id","form_"+a.id).append(kb.create("h1").html(kb.constants.config.caption.contents[kb.operator.language])).append(kb.create("section").append((c=>{c.elm("select").empty().assignOption([{code:"",label:""}].concat(u.list.map(d=>({code:d.id,label:d.name}))).concat(u.calendar.map(d=>({code:d.id,label:d.name}))),"label","code");return c})(kb.field.activate(kb.field.create(a.fields.view),
a))).append(kb.field.activate(kb.field.create(a.fields.title).css({width:"100%"}),a)).append(kb.field.activate(kb.field.create(a.fields.description).css({width:"100%"}),a))).append(kb.create("h1").html(kb.constants.config.caption.directory[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.directory[kb.operator.language])).append(kb.field.activate(kb.field.create(a.fields.directory),a)).append(kb.create("p").addClass("kb-url"))).append(kb.create("h1").html(kb.constants.config.caption.connection[kb.operator.language])).append(kb.create("section").append((c=>
{c.elm("select").empty().assignOption([{code:"",label:""}].concat(kb.roleSet.user.map(d=>({code:d.code.value,label:d.name.value}))),"label","code");return c})(kb.field.activate(kb.field.create(a.fields.operator),a))).append(kb.field.activate(kb.field.create(a.fields.pass).css({width:"100%"}),a)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.basic[kb.operator.language])).append(kb.field.activate(kb.field.create(a.fields.basicOperator).css({width:"100%"}),a)).append(kb.field.activate(kb.field.create(a.fields.basicPass).css({width:"100%"}),
a))).append(kb.create("h1").html(kb.constants.config.caption.access[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.access[kb.operator.language])).append(kb.field.activate(kb.field.create(a.fields.accessPass).css({width:"100%"}),a)).append(kb.create("h1").html(kb.constants.config.caption.access.field[kb.operator.language])).append((c=>{c.template.elm("[field-id=field]").elm("select").empty().assignOption([{code:"",label:""}].concat(Object.values(w.origin).reduce((d,
e)=>{["LINK","NUMBER","SINGLE_LINE_TEXT"].includes(e.type)&&d.push({code:e.code,label:e.label});return d},[])),"label","code");c.elm("thead").hide();return c})(b.tables.accessField)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.access.field[kb.operator.language]))).append(kb.create("h1").html(kb.constants.config.caption.plugin[kb.operator.language])).append(kb.create("section").append((c=>{c.elm(".kb-field-value").elms("label").each((d,e)=>d.parentNode.removeChild(d));
f.plugins.installed.each((d,e)=>{e=c.elm(".kb-field-value");var g=e.append,n=kb.create("label").append(kb.create("input").attr("type","checkbox").attr("data-type","checkbox").val(d)),p=n.append,q=kb.create("span"),t=q.html,r="";switch(d){case "style":r="Boost! Style";break;case "action":r="Boost! Action";break;case "submit":r="Boost! Submit";break;case "upsert":r="Boost! Upsert";break;case "mail":r="Boost! Mail";break;case "omail":r="Boost! OAuth Mail"}g.call(e,p.call(n,t.call(q,r)))});return c})(kb.field.activate(kb.field.create(a.fields.plugin),
a))).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.plugin[kb.operator.language]))).append(kb.create("h1").html(kb.constants.config.caption.injector[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.injector[kb.operator.language])).append(kb.field.activate(kb.field.create(a.fields.injectorAddURL).css({width:"100%"}),a)).append(kb.field.activate(kb.field.create(a.fields.injectorEditURL).css({width:"100%"}),
a)).append(kb.field.activate((c=>{c.elms("[type=radio]").each((d,e)=>{d.closest("label").elm("span").html(kb.constants.config.caption.injector.pattern[d.val()][kb.operator.language])});return c})(kb.field.create(a.fields.injectorPattern)),a))).append(kb.create("h1").html(kb.constants.config.caption.customize[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.customize[kb.operator.language])).append(kb.field.activate(kb.field.create(a.fields.customizeJs).css({width:"100%"}),
a)).append(kb.field.activate(kb.field.create(a.fields.customizeCSS).css({width:"100%"}),a)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.customize.multi[kb.operator.language])));kb.event.on("kb.change.directory",c=>{if(c.record.directory.value&&c.record.directory.value!=(b.setting?b.setting.directory.value:"")){var d=()=>{var e=kb.record,g=e.set,n=b.panel,p=c.record;p.directory.value="";g.call(e,n,a,p)};fetch("https://api.kintone-booster.com/echo?directory="+c.record.directory.value,
{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>{e.json().then(g=>{switch(e.status){case 200:"ok"!=g.result&&(kb.alert(kb.constants.config.message.invalid.used[kb.operator.language]),d());break;default:kb.alert(kb.error.parse(g)),d()}})}).catch(e=>{kb.alert(kb.error.parse(e));d()})}return c});b.tables.accessField.clearRows();b.tables.accessField.addRow();b.panel.elms("input,select,textarea").each((c,d)=>c.initialize())})({id:f.app.id,fields:f.app.fields.tab})},copy:(b,a)=>{var c=
{id:f.app.id,fields:f.app.fields.tab};k(a,c,kb.record.get(b.panel,c,!0).record)},del:b=>{}});0!=Object.keys(h).length?(b=>{b.each(a=>{var c={id:f.app.id,fields:f.app.fields.tab},d=kb.config[l].tabbed.add();k(d,c,a.setting);d.label.html(a.label);d.setting=a.setting})})(JSON.parse(h.tab)):(b=>{b.tables.accessField.clearRows();b.tables.accessField.addRow()})(kb.config[l].tabbed.add())}catch(b){kb.alert(kb.error.parse(b))}})})})})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{access:{en:"Access control to the created web page",ja:"\u4f5c\u6210\u3059\u308bweb\u30da\u30fc\u30b8\u3078\u306e\u30a2\u30af\u30bb\u30b9\u5236\u5fa1",zh:"\u5bf9\u6240\u521b\u5efa\u7f51\u9875\u7684\u8bbf\u95ee\u63a7\u5236","zh-TW":"\u5c0d\u6240\u5275\u5efa\u7db2\u9801\u7684\u8a2a\u554f\u63a7\u5236",field:{en:"Control with field value input",ja:"\u30d5\u30a3\u30fc\u30eb\u30c9\u5024\u306e\u5165\u529b\u3067\u5236\u5fa1\u3059\u308b",zh:"\u901a\u8fc7\u5b57\u6bb5\u503c\u8f93\u5165\u8fdb\u884c\u63a7\u5236",
"zh-TW":"\u901a\u904e\u5b57\u6bb5\u503c\u8f38\u5165\u9032\u884c\u63a7\u5236"},pass:{en:"Control with a fixed password",ja:"\u56fa\u5b9a\u30d1\u30b9\u30ef\u30fc\u30c9\u3067\u5236\u5fa1\u3059\u308b",zh:"\u901a\u8fc7\u56fa\u5b9a\u5bc6\u7801\u8fdb\u884c\u63a7\u5236","zh-TW":"\u901a\u904e\u56fa\u5b9a\u5bc6\u78bc\u9032\u884c\u63a7\u5236"}},basic:{operator:{en:"Basic Authentication User",ja:"Basic\u8a8d\u8a3c\u7528\u30e6\u30fc\u30b6\u30fc",zh:"Basic\u8ba4\u8bc1\u7528\u6237","zh-TW":"Basic\u8a8d\u8b49\u7528\u6236"},
pass:{en:"Basic Authentication Password",ja:"Basic\u8a8d\u8a3c\u7528\u30d1\u30b9\u30ef\u30fc\u30c9",zh:"Basic\u8ba4\u8bc1\u5bc6\u7801","zh-TW":"Basic\u8a8d\u8b49\u5bc6\u78bc"}},contents:{en:"Displayed Contents",ja:"\u8868\u793a\u30b3\u30f3\u30c6\u30f3\u30c4",zh:"\u663e\u793a\u5185\u5bb9","zh-TW":"\u986f\u793a\u5167\u5bb9"},connection:{en:"Connection to kintone",ja:"kintone\u3078\u306e\u63a5\u7d9a",zh:"\u8fde\u63a5\u5230kintone","zh-TW":"\u9023\u63a5\u5230kintone"},customize:{en:"Customized File",
ja:"\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u30d5\u30a1\u30a4\u30eb",zh:"\u81ea\u5b9a\u4e49\u6587\u4ef6","zh-TW":"\u81ea\u8a02\u6a94\u6848",css:{en:"CSS File Reference URL",ja:"CSS\u30d5\u30a1\u30a4\u30eb\u306e\u53c2\u7167\u5148URL",zh:"CSS \u6587\u4ef6\u53c2\u8003 URL","zh-TW":"CSS \u6a94\u6848\u53c3\u8003 URL"},js:{en:"JS File Reference URL",ja:"JS\u30d5\u30a1\u30a4\u30eb\u306e\u53c2\u7167\u5148URL",zh:"JS \u6587\u4ef6\u53c2\u8003 URL","zh-TW":"JS \u6a94\u6848\u53c3\u8003 URL"}},description:{en:"Description",
ja:"\u8aac\u660e",zh:"\u63cf\u8ff0","zh-TW":"\u63cf\u8ff0"},directory:{en:"Directory Name",ja:"\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d",zh:"\u76ee\u5f55\u540d\u79f0","zh-TW":"\u76ee\u9304\u540d\u7a31"},injector:{en:"Injector Integration",ja:"Injector\u9023\u643a",zh:"Injector\u96c6\u6210","zh-TW":"Injector\u96c6\u6210",add:{en:"New Record Addition URL",ja:"\u65b0\u898f\u30ec\u30b3\u30fc\u30c9\u306e\u8ffd\u52a0\u7528URL",zh:"\u65b0\u589e\u8bb0\u5f55\u7684URL","zh-TW":"\u65b0\u589e\u8a18\u9304\u7684URL"},
edit:{en:"Existing Record Viewing/Editing URL",ja:"\u65e2\u5b58\u306e\u30ec\u30b3\u30fc\u30c9\u306e\u95b2\u89a7\u30fb\u7de8\u96c6\u7528URL",zh:"\u67e5\u770b/\u7f16\u8f91\u73b0\u6709\u8bb0\u5f55\u7684URL","zh-TW":"\u67e5\u770b/\u7de8\u8f2f\u73fe\u6709\u8a18\u9304\u7684URL"},pattern:{detail:{en:"Read-only",ja:"\u95b2\u89a7\u5c02\u7528",zh:"\u4ec5\u4f9b\u9605\u8bfb","zh-TW":"\u50c5\u4f9b\u95b1\u8b80"},edit:{en:"Editable",ja:"\u7de8\u96c6\u53ef",zh:"\u53ef\u7f16\u8f91","zh-TW":"\u53ef\u7de8\u8f2f"}}},
operator:{en:"Login User",ja:"\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc",zh:"\u767b\u5f55\u7528\u6237","zh-TW":"\u767b\u9304\u7528\u6236"},pass:{en:"Password",ja:"\u30d1\u30b9\u30ef\u30fc\u30c9",zh:"\u5bc6\u7801","zh-TW":"\u5bc6\u78bc"},plugin:{en:"Linked plugins",ja:"\u9023\u52d5\u30d7\u30e9\u30b0\u30a4\u30f3",zh:"\u8054\u52a8\u63d2\u4ef6","zh-TW":"\u806f\u52d5\u63d2\u4ef6"},title:{en:"Title",ja:"\u30bf\u30a4\u30c8\u30eb",zh:"\u6807\u9898","zh-TW":"\u6a19\u984c"},view:{en:"Referenced View",
ja:"\u53c2\u7167\u3059\u308b\u4e00\u89a7",zh:"\u53c2\u8003\u5217\u8868","zh-TW":"\u53c3\u8003\u5217\u8868"}},description:{access:{en:"If you want to control access to the web page you create, please specify them.",ja:"\u4f5c\u6210\u3059\u308bweb\u30da\u30fc\u30b8\u306e\u30a2\u30af\u30bb\u30b9\u3092\u5236\u5fa1\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u305d\u308c\u3089\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u60a8\u60f3\u63a7\u5236\u521b\u5efa\u7684\u7f51\u9875\u7684\u8bbf\u95ee\uff0c\u8bf7\u6307\u5b9a\u3002",
"zh-TW":"\u5982\u679c\u60a8\u60f3\u63a7\u5236\u5275\u5efa\u7684\u7db2\u9801\u7684\u8a2a\u554f\uff0c\u8acb\u6307\u5b9a\u3002",field:{en:"When controlling access with field values, any existing filtering conditions for displaying records will be automatically combined with the contents of those fields.",ja:"\u30d5\u30a3\u30fc\u30eb\u30c9\u5024\u3067\u30a2\u30af\u30bb\u30b9\u3092\u5236\u5fa1\u3059\u308b\u5834\u5408\u306f\u3001\u8868\u793a\u3059\u308b\u30ec\u30b3\u30fc\u30c9\u306e\u7d5e\u308a\u8fbc\u307f\u6761\u4ef6\u306b\u305d\u308c\u3089\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u5185\u5bb9\u304c\u81ea\u52d5\u7684\u306b\u8ffd\u52a0\u3055\u308c\u307e\u3059\u3002",
zh:"\u5f53\u901a\u8fc7\u5b57\u6bb5\u503c\u63a7\u5236\u8bbf\u95ee\u65f6\uff0c\u4efb\u4f55\u73b0\u6709\u7684\u663e\u793a\u8bb0\u5f55\u7b5b\u9009\u6761\u4ef6\u90fd\u4f1a\u6839\u636e\u8fd9\u4e9b\u5b57\u6bb5\u7684\u5185\u5bb9\u81ea\u52a8\u7ec4\u5408\u3002","zh-TW":"\u7576\u901a\u904e\u5b57\u6bb5\u503c\u63a7\u5236\u8a2a\u554f\u6642\uff0c\u4efb\u4f55\u73fe\u6709\u7684\u986f\u793a\u8a18\u9304\u7be9\u9078\u689d\u4ef6\u90fd\u6703\u6839\u64da\u9019\u4e9b\u5b57\u6bb5\u7684\u5167\u5bb9\u81ea\u52d5\u7d44\u5408\u3002"}},
basic:{en:"If access is restricted by Basic authentication, please specify the following items as well.",ja:"Basic\u8a8d\u8a3c\u306b\u3088\u308b\u30a2\u30af\u30bb\u30b9\u5236\u9650\u3092\u884c\u3063\u3066\u3044\u308b\u5834\u5408\u306f\u4ee5\u4e0b\u306e\u9805\u76ee\u3082\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u901a\u8fc7Basic\u8ba4\u8bc1\u9650\u5236\u4e86\u8bbf\u95ee\uff0c\u8bf7\u540c\u65f6\u6307\u5b9a\u4ee5\u4e0b\u9879\u76ee\u3002","zh-TW":"\u5982\u679c\u901a\u904eBasic\u8a8d\u8b49\u9650\u5236\u4e86\u8a2a\u554f\uff0c\u8acb\u540c\u6642\u6307\u5b9a\u4ee5\u4e0b\u9805\u76ee\u3002"},
customize:{en:"If you want to add processing using your own customized files, please enter each URL.",ja:"\u72ec\u81ea\u306e\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u30d5\u30a1\u30a4\u30eb\u3092\u7528\u610f\u3057\u3066\u51e6\u7406\u3092\u8ffd\u52a0\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u305d\u308c\u305e\u308c\u306eURL\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u60a8\u60f3\u4f7f\u7528\u81ea\u5b9a\u4e49\u6587\u4ef6\u6dfb\u52a0\u5904\u7406\uff0c\u8bf7\u8f93\u5165\u5404\u81ea\u7684 URL\u3002",
"zh-TW":"\u5982\u679c\u60a8\u60f3\u4f7f\u7528\u81ea\u8a02\u6a94\u6848\u65b0\u589e\u8655\u7406\uff0c\u8acb\u8f38\u5165\u5404\u81ea\u7684 URL\u3002",multi:{en:"If you want to add multiple files, please enter each URL separated by commas.",ja:"\u8907\u6570\u306e\u30d5\u30a1\u30a4\u30eb\u3092\u8ffd\u52a0\u3059\u308b\u5834\u5408\u306f\u3001\u305d\u308c\u305e\u308c\u306eURL\u3092\u30ab\u30f3\u30de\u533a\u5207\u308a\u3067\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u8981\u6dfb\u52a0\u591a\u4e2a\u6587\u4ef6\uff0c\u8bf7\u7528\u9017\u53f7\u5206\u9694\u8f93\u5165\u6bcf\u4e2aURL\u3002",
"zh-TW":"\u5982\u679c\u8981\u6dfb\u52a0\u591a\u500b\u6a94\u6848\uff0c\u8acb\u7528\u9017\u865f\u5206\u9694\u8f38\u5165\u6bcf\u500bURL\u3002"}},directory:{en:"Please enter the directory name that corresponds to \u201c***\u201d in the URL \u201chttps://echo.kintone-booster.com/***\u201d.",ja:'\u4f5c\u6210\u3059\u308bweb\u30da\u30fc\u30b8\u306eURL"https://echo.kintone-booster.com/***"\u306e\u300c***\u300d\u306b\u5f53\u3066\u306f\u307e\u308b\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002',
zh:"\u8bf7\u8f93\u5165\u4e0e\u7f51\u5740 \u201chttps://echo.kintone-booster.com/***\u201d \u4e2d \u201c***\u201d \u5bf9\u5e94\u7684\u76ee\u5f55\u540d\u79f0\u3002","zh-TW":"\u8acb\u8f38\u5165\u8207\u7db2\u5740 \u201chttps://echo.kintone-booster.com/***\u201d \u4e2d \u201c***\u201d \u5c0d\u61c9\u7684\u76ee\u9304\u540d\u7a31\u3002"},injector:{en:'When adding new records or viewing and editing existing records using "Boost! Injector" on the created web page, please enter each respective URL.',ja:"Boost! Injector\u3092\u4f7f\u7528\u3057\u3066\u3001\u4f5c\u6210\u3057\u305fWeb\u30da\u30fc\u30b8\u4e0a\u3067\u65b0\u898f\u30ec\u30b3\u30fc\u30c9\u306e\u8ffd\u52a0\u3084\u3001\u65e2\u5b58\u306e\u30ec\u30b3\u30fc\u30c9\u306e\u95b2\u89a7\u30fb\u7de8\u96c6\u3092\u884c\u3046\u5834\u5408\u306f\u3001\u305d\u308c\u305e\u308c\u306eURL\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5728\u4f7f\u7528\u201cBoost! Injector\u201d\u6dfb\u52a0\u65b0\u8bb0\u5f55\u6216\u67e5\u770b\u548c\u7f16\u8f91\u73b0\u6709\u8bb0\u5f55\u65f6\uff0c\u8bf7\u5206\u522b\u8f93\u5165\u6bcf\u4e2a\u76f8\u5e94\u7684URL\u3002","zh-TW":"\u5728\u4f7f\u7528\u201cBoost! Injector\u201d\u6dfb\u52a0\u65b0\u8a18\u9304\u6216\u67e5\u770b\u548c\u7de8\u8f2f\u73fe\u6709\u8a18\u9304\u6642\uff0c\u8acb\u5206\u5225\u8f38\u5165\u6bcf\u500b\u76f8\u61c9\u7684URL\u3002"},plugin:{en:'When using linked plugins, the operation conditions must have "Execute on injector only" or "Execute on both PC and mobile versions, or on injector" checked.',
ja:"\u9023\u52d5\u30d7\u30e9\u30b0\u30a4\u30f3\u3092\u4f7f\u7528\u3059\u308b\u5834\u5408\u306f\u3001\u305d\u308c\u3089\u306e\u52d5\u4f5c\u6761\u4ef6\u3067\u300c\u30a4\u30f3\u30b8\u30a7\u30af\u30bf\u30fc\u306e\u307f\u3067\u5b9f\u884c\u300d\u307e\u305f\u306f\u300cPC\u7248\u3068\u30e2\u30d0\u30a4\u30eb\u7248\u306e\u4e21\u65b9\u3001\u307e\u305f\u306f\u30a4\u30f3\u30b8\u30a7\u30af\u30bf\u30fc\u3067\u5b9f\u884c\u300d\u306b\u30c1\u30a7\u30c3\u30af\u304c\u4ed8\u3044\u3066\u3044\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002",
zh:"\u5f53\u4f7f\u7528\u8054\u52a8\u63d2\u4ef6\u65f6\uff0c\u5fc5\u987b\u5728\u5176\u64cd\u4f5c\u6761\u4ef6\u4e2d\u52fe\u9009\u201c\u4ec5\u4f7f\u7528Injector\u6267\u884c\u201d\u6216\u201c\u5728PC\u7248\u548c\u624b\u673a\u7248\u7684\u4e24\u8005\uff0c\u6216\u4f7f\u7528Injector\u6267\u884c\u201d\u3002","zh-TW":"\u7576\u4f7f\u7528\u806f\u52d5\u63d2\u4ef6\u6642\uff0c\u5fc5\u9808\u5728\u5176\u64cd\u4f5c\u689d\u4ef6\u4e2d\u52fe\u9078\u201c\u50c5\u4f7f\u7528Injector\u57f7\u884c\u201d\u6216\u201c\u5728PC\u7248\u548c\u624b\u6a5f\u7248\u7684\u5169\u8005\uff0c\u6216\u4f7f\u7528Injector\u57f7\u884c\u201d\u3002"}},
message:{invalid:{characters:{en:"The directory name contains invalid characters.",ja:"\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u306b\u4f7f\u7528\u51fa\u6765\u306a\u3044\u6587\u5b57\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\u3002",zh:"\u76ee\u5f55\u540d\u79f0\u5305\u542b\u65e0\u6548\u5b57\u7b26\u3002","zh-TW":"\u76ee\u9304\u540d\u7a31\u5305\u542b\u7121\u6548\u5b57\u7b26\u3002"},duplicate:{en:"You cannot specify the same directory name with different settings.",ja:"\u7570\u306a\u308b\u8a2d\u5b9a\u3067\u540c\u3058\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u3092\u6307\u5b9a\u3059\u308b\u3053\u3068\u306f\u51fa\u6765\u307e\u305b\u3093\u3002",
zh:"\u4e0d\u80fd\u5728\u4e0d\u540c\u7684\u8bbe\u7f6e\u4e0b\u6307\u5b9a\u76f8\u540c\u7684\u76ee\u5f55\u540d\u79f0\u3002","zh-TW":"\u4e0d\u80fd\u5728\u4e0d\u540c\u7684\u8a2d\u7f6e\u4e0b\u6307\u5b9a\u76f8\u540c\u7684\u76ee\u9304\u540d\u7a31\u3002"},reserved:{en:"The entered directory name cannot be used.",ja:"\u5165\u529b\u3055\u308c\u305f\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u306f\u4f7f\u7528\u51fa\u6765\u307e\u305b\u3093\u3002",zh:"\u8f93\u5165\u7684\u76ee\u5f55\u540d\u79f0\u65e0\u6cd5\u4f7f\u7528\u3002",
"zh-TW":"\u8f38\u5165\u7684\u76ee\u9304\u540d\u7a31\u7121\u6cd5\u4f7f\u7528\u3002"},used:{en:"The entered directory name is already in use.",ja:"\u5165\u529b\u3057\u305f\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u306f\u65e2\u306b\u306b\u4f7f\u7528\u3055\u308c\u3066\u3044\u307e\u3059\u3002",zh:"\u8f93\u5165\u7684\u76ee\u5f55\u540d\u79f0\u5df2\u88ab\u4f7f\u7528\u3002","zh-TW":"\u8f38\u5165\u7684\u76ee\u9304\u540d\u7a31\u5df2\u88ab\u4f7f\u7528\u3002"}}}}},kb.constants);
