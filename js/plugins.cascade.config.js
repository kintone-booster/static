/*
* FileName "plugins.cascade.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(g=>{var l={};kb.field.load(kintone.app.getId()).then(m=>{kb.config[g].build({submit:(r,h)=>{try{var n=!1;h.tab=[];h.flat={};(b=>{kb.config[g].tabbed.tabs.some(c=>{var a=kb.record.get(c.panel,b);a.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),kb.config[g].tabbed.activate(c),n=!0):h.tab.push({label:c.label.html(),setting:a.record});return n})})({id:l.app.id,fields:l.app.fields.tab});h.tab=JSON.stringify(h.tab);h.flat=JSON.stringify(h.flat);return n?!1:h}catch(b){return kb.alert(kb.error.parse(b)),
!1}}},(r,h)=>{try{l.app={id:g,fields:{tab:{parent:{code:"parent",type:"DROP_DOWN",label:"",required:!0,noLabel:!0,options:[]},child:{code:"child",type:"DROP_DOWN",label:"",required:!0,noLabel:!0,options:[]},parentOption:{code:"parentOption",type:"RADIO_BUTTON",label:"",required:!0,noLabel:!0,options:[]},childOption:{code:"childOption",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[]},relation:{code:"relation",type:"SINGLE_LINE_TEXT",label:"",required:!0,noLabel:!0,placeholder:""}},flat:{}}};
var n=(b,c,a)=>{b.panel.elm("[field-id=parent]").elm("select").val(a.parent.value).rebuild().then(()=>{b.panel.elm("[field-id=child]").elm("select").val(a.child.value).rebuild().then(()=>{var d=JSON.parse(a.relation.value);a.parentOption.value=Object.keys(d).first();a.childOption.value=d[Object.keys(d).first()];kb.record.set(b.panel,c,a)})})};(b=>{for(var c in b)l.app.fields.tab[c]=b[c]})(kb.config[g].ui.fields.conditions.get(m,!0));kb.config[g].tabbed=new KintoneBoosterConfigTabbed(r,{add:b=>{(c=>
{b.options={parent:kb.create("div").addClass("kb-config-borderd-block").css({flex:"1",margin:"0.5em"}).hide(),child:kb.create("div").addClass("kb-config-borderd-block").css({flex:"1",margin:"0.5em"}).hide()};b.panel.addClass("kb-scope").attr("form-id","form_"+c.id).append(kb.config[g].ui.fields.conditions.set(kb.create("div").addClass("kb-config-tabbed-panel-block"),c,!0)).append(kb.create("h1").html(kb.constants.config.description[kb.operator.language])).append(kb.create("section").addClass("kb-config-flex-columns").append(kb.create("div").addClass("kb-config-flex-column").append(kb.create("h1").html(kb.constants.config.caption.parent[kb.operator.language])).append((a=>
{a.elm("select").empty().assignOption(kb.config[g].ui.options.fields(m,(d,k)=>{switch(k.type){case "CHECK_BOX":case "DROP_DOWN":case "MULTI_SELECT":case "RADIO_BUTTON":d.push({code:k.code,label:k.label})}return d}),"label","code").on("change",d=>d.currentTarget.rebuild()).rebuild=()=>new Promise((d,k)=>{(q=>{q.elm("select").empty().assignOption([{code:"",label:""}],"label","code");b.options.parent.empty().hide();b.options.child.empty().hide();a.elm("select").val()&&(e=>{q.elm("select").empty().assignOption(kb.config[g].ui.options.fields(m,
(f,p)=>{if(p.tableCode==e)switch(p.type){case "CHECK_BOX":case "DROP_DOWN":case "MULTI_SELECT":case "RADIO_BUTTON":f.push({code:p.code,label:p.label})}return f}),"label","code")})(m.parallelize[a.elm("select").val()].tableCode);d()})(b.panel.elm("[field-id=child]"))});return a})(kb.field.activate(kb.field.create(c.fields.parent).css({width:"100%"}),c))).append(b.options.parent.append(kb.field.activate(kb.field.create(c.fields.parentOption).css({width:"100%"}),c)))).append(kb.create("div").addClass("kb-config-flex-column").append(kb.create("h1").html(kb.constants.config.caption.child[kb.operator.language])).append((a=>
{a.elm("select").empty().assignOption([{code:"",label:""}],"label","code").on("change",d=>d.currentTarget.rebuild()).rebuild=()=>new Promise((d,k)=>{b.options.parent.empty().hide();b.options.child.empty().hide();a.elm("select").val()&&(q=>{c.fields.parentOption.options=Object.fromEntries(Object.entries(q.parent.options).sort(([,e],[,f])=>Number(e.index)-Number(f.index)));c.fields.childOption.options=Object.fromEntries(Object.entries(q.child.options).sort(([,e],[,f])=>Number(e.index)-Number(f.index)));
b.options.parent.append(kb.field.activate((e=>{e.elms("[type=radio]").each((f,p)=>{f.closest("label").css({display:"block"})});return e})(kb.field.create(c.fields.parentOption).css({width:"100%"})),c)).show();b.options.child.append(kb.field.activate((e=>{e.elms("[type=checkbox]").each((f,p)=>{f.closest("label").css({display:"block"})});return e})(kb.field.create(c.fields.childOption).css({width:"100%"})),c)).show();b.panel.elm("[field-id=relation]").elm("input").val(JSON.stringify(Object.keys(c.fields.parentOption.options).reduce((e,
f)=>{e[f]=Object.keys(c.fields.childOption.options);return e},{})));kb.record.set(b.panel,c,{parentOption:{value:Object.keys(c.fields.parentOption.options).first()},childOption:{value:Object.keys(c.fields.childOption.options)}})})({parent:m.parallelize[b.panel.elm("[field-id=parent]").elm("select").val()],child:m.parallelize[b.panel.elm("[field-id=child]").elm("select").val()]});d()});return a})(kb.field.activate(kb.field.create(c.fields.child).css({width:"100%"}),c))).append(b.options.child.append(kb.field.activate(kb.field.create(c.fields.childOption).css({width:"100%"}),
c))))).append(kb.create("div").css({paddingRight:"0.75em",textAlign:"right"}).append((a=>{switch(kb.operator.language){case "en":a.text("Select All");break;case "ja":a.text("\u5168\u9078\u629e");break;case "zh":a.text("\u5168\u9009");break;case "zh-TW":a.text("\u5168\u9078")}return a})(kb.create("button").addClass("kb-config-button").on("click",()=>{b.panel.elm("[field-id=childOption]").elms("input").each((a,d)=>a.checked=!0)}))).append((a=>{switch(kb.operator.language){case "en":a.text("Deselect All");
break;case "ja":a.text("\u5168\u89e3\u9664");break;case "zh":a.text("\u5168\u53d6\u6d88");break;case "zh-TW":a.text("\u5168\u53d6\u6d88")}return a})(kb.create("button").addClass("kb-config-button").on("click",a=>{b.panel.elm("[field-id=childOption]").elms("input").each((d,k)=>d.checked=!1)})))).append(kb.create("div").addClass("kb-hidden").append(kb.field.activate(kb.field.create(c.fields.relation),c)));kb.event.on("kb.change.parentOption",a=>{a.container==b.panel&&(a.record.childOption.value=JSON.parse(a.record.relation.value)[a.record.parentOption.value]);
return a});kb.event.on("kb.change.childOption",a=>{if(a.container==b.panel){var d=a.record.relation;var k=JSON.parse(a.record.relation.value||"{}");k[a.record.parentOption.value]=a.record.childOption.value;k=JSON.stringify(k);d.value=k}return a});b.panel.elms("input,select,textarea").each((a,d)=>a.initialize())})({id:l.app.id,fields:kb.extend({},l.app.fields.tab)})},copy:(b,c)=>{var a={id:l.app.id,fields:l.app.fields.tab};n(c,a,kb.record.get(b.panel,a,!0).record)},del:b=>{}});0!=Object.keys(h).length?
(b=>{b.each(c=>{var a={id:l.app.id,fields:l.app.fields.tab},d=kb.config[g].tabbed.add();n(d,a,c.setting);d.label.html(c.label)})})(JSON.parse(h.tab)):kb.config[g].tabbed.add()}catch(b){kb.alert(kb.error.parse(b))}})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{child:{en:"Child Field",ja:"\u5b50\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u5b50\u5b57\u6bb5","zh-TW":"\u5b50\u6b04\u4f4d"},parent:{en:"Parent Field",ja:"\u89aa\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u7236\u5b57\u6bb5","zh-TW":"\u7236\u6b04\u4f4d"}},description:{en:"If there are items in the child field that need to be hidden depending on the selection in the parent field, please uncheck them.",ja:"\u89aa\u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u9078\u629e\u306b\u5fdc\u3058\u3066\u975e\u8868\u793a\u306b\u3057\u305f\u3044\u5b50\u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u9805\u76ee\u304c\u3042\u308b\u5834\u5408\u306f\u3001\u305d\u306e\u30c1\u30a7\u30c3\u30af\u3092\u5916\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
zh:"\u5982\u679c\u5b50\u5b57\u6bb5\u4e2d\u6709\u6839\u636e\u7236\u5b57\u6bb5\u7684\u9009\u62e9\u9700\u8981\u9690\u85cf\u7684\u9879\u76ee\uff0c\u8bf7\u53d6\u6d88\u52fe\u9009\u3002","zh-TW":"\u5982\u679c\u5b50\u6b04\u4f4d\u4e2d\u6709\u6839\u64da\u7236\u6b04\u4f4d\u7684\u9078\u64c7\u9700\u8981\u96b1\u85cf\u7684\u9805\u76ee\uff0c\u8acb\u53d6\u6d88\u52fe\u9078\u3002"}}},kb.constants);
