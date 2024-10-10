/*
* FileName "plugins.submit.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(f=>{var k={};kb.field.load(kintone.app.getId()).then(g=>{kb.status.load(kintone.app.getId()).then(t=>{kb.view.load(kintone.app.getId()).then(u=>{kb.apps.load().then(w=>{kb.config[f].build({submit:(q,l)=>{try{var h=!1;l.tab=[];l.flat={};(c=>{kb.config[f].tabbed.tabs.some(b=>{var a=kb.record.get(b.panel,c);a.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),kb.config[f].tabbed.activate(b),h=!0):(h||(a.record.event.value.includes("process")?a.record.action.value||
(kb.alert(kb.constants.config.message.invalid.action[kb.operator.language]),kb.config[f].tabbed.activate(b),h=!0):a.record.action.value=""),h||(a.record.event.value.includes("index")?(a.record.label.value||(kb.alert(kb.constants.config.message.invalid.label.index[kb.operator.language]),kb.config[f].tabbed.activate(b),h=!0),a.record.message.value||(kb.alert(kb.constants.config.message.invalid.message.index[kb.operator.language]),kb.config[f].tabbed.activate(b),h=!0)):(a.record.label.value="",a.record.message.value=
"",a.record.view.value="")),h||!a.record.numberingField.value||a.record.numberingDigits.value||(kb.alert(kb.constants.config.message.invalid.numbering[kb.operator.language]),kb.config[f].tabbed.activate(b),h=!0),h||(a.record.numberingGroup.value=a.record.numberingGroup.value.filter(d=>d.value.field.value),a.record.promptField.value=a.record.promptField.value.filter(d=>d.value.field.value),a.record.verifyField.value=a.record.verifyField.value.filter(d=>d.value.field.value),a.record.errorField.value=
a.record.errorField.value.filter(d=>d.value.field.value).filter(d=>d.value.message.value),a.record.duplicateCriteria.value=a.record.duplicateCriteria.value.filter(d=>d.value.external.value).filter(d=>d.value.internal.value),l.tab.push({label:b.label.html(),setting:a.record})));return h})})({id:k.app.id,fields:k.app.fields.tab});l.tab=JSON.stringify(l.tab);l.flat=JSON.stringify(l.flat);return h?!1:l}catch(c){return kb.alert(kb.error.parse(c)),!1}}},(q,l)=>{try{k.app={id:f,fields:{tab:{event:{code:"event",
type:"CHECK_BOX",label:"",required:!0,noLabel:!0,options:[{index:0,label:"create"},{index:1,label:"edit"},{index:2,label:"process"},{index:3,label:"index"}]},action:{code:"action",type:"DROP_DOWN",label:kb.constants.config.caption.action[kb.operator.language],required:!1,noLabel:!1,options:[]},label:{code:"label",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.label[kb.operator.language],required:!1,noLabel:!1,placeholder:""},message:{code:"message",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.message[kb.operator.language],
required:!1,noLabel:!1,placeholder:""},view:{code:"view",type:"DROP_DOWN",label:kb.constants.config.caption.view[kb.operator.language],required:!1,noLabel:!1,options:[]},numberingField:{code:"numberingField",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},numberingGroup:{code:"numberingGroup",type:"SUBTABLE",label:"",noLabel:!0,fields:{field:{code:"field",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]}}},numberingDigits:{code:"numberingDigits",type:"NUMBER",label:"",required:!1,
noLabel:!0},promptField:{code:"promptField",type:"SUBTABLE",label:"",noLabel:!0,fields:{field:{code:"field",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]}}},promptOverwrite:{code:"promptOverwrite",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"overwrite"}]},verifyField:{code:"verifyField",type:"SUBTABLE",label:"",noLabel:!0,fields:{field:{code:"field",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]}}},verifyMessage:{code:"verifyMessage",type:"SINGLE_LINE_TEXT",
label:"",required:!1,noLabel:!0,placeholder:""},errorFilter:{code:"errorFilter",type:"CONDITION",label:"",required:!1,noLabel:!0,app:{id:kintone.app.getId(),fields:g.parallelize}},errorMessage:{code:"errorMessage",type:"SINGLE_LINE_TEXT",label:"",required:!1,noLabel:!0,placeholder:""},errorField:{code:"errorField",type:"SUBTABLE",label:"",noLabel:!0,fields:{field:{code:"field",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},message:{code:"message",type:"SINGLE_LINE_TEXT",label:"",required:!1,
noLabel:!0,placeholder:kb.constants.config.prompt.error.message[kb.operator.language]}}},duplicateCriteria:{code:"duplicateCriteria",type:"SUBTABLE",label:"",noLabel:!0,fields:{external:{code:"external",type:"DROP_DOWN",label:kb.constants.config.caption.duplicate.destination[kb.operator.language],required:!1,noLabel:!0,options:[]},operator:{code:"operator",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},internal:{code:"internal",type:"DROP_DOWN",label:kb.constants.config.caption.duplicate.source[kb.operator.language],
required:!1,noLabel:!0,options:[]}}},url:{code:"url",type:"SINGLE_LINE_TEXT",label:"",required:!1,noLabel:!0,placeholder:kb.constants.config.prompt.url[kb.operator.language]}},flat:{}}};var h=(c,b,a)=>{var d=kb.record,e=d.set,p=c.panel;a.event.value.includes("process")&&c.panel.elm("[field-id=action]").closest("section").removeClass("kb-hidden");a.event.value.includes("index")&&c.panel.elm("[field-id=label]").closest("section").removeClass("kb-hidden");a.event.value.includes("index")&&c.panel.elm("[field-id=message]").closest("section").removeClass("kb-hidden");
a.event.value.includes("index")&&c.panel.elm("[field-id=view]").closest("section").removeClass("kb-hidden");e.call(d,p,b,a).then(()=>{c.tables.duplicateCriteria.clearRows();a.duplicateCriteria.value.each((m,r)=>{m.value.external.value in g.criterias&&(n=>{n.elm("[field-id=external]").elm("select").val(m.value.external.value).rebuild().then(v=>{m.value.internal.value in v&&(n.elm("[field-id=operator]").elm("select").val(m.value.operator.value),n.elm("[field-id=internal]").elm("select").val(m.value.internal.value))})})(c.tables.duplicateCriteria.addRow())});
0==c.tables.duplicateCriteria.tr.length&&c.tables.duplicateCriteria.addRow()})};(c=>{for(var b in c)k.app.fields.tab[b]=c[b]})(kb.config[f].ui.fields.conditions.get(g,!0));(c=>{for(var b in c)k.app.fields.tab[b]=c[b]})(kb.config[f].ui.fields.users.get(g));kb.config[f].tabbed=new KintoneBoosterConfigTabbed(q,{add:c=>{(b=>{c.tables={numberingGroup:kb.table.activate(kb.table.create(b.fields.numberingGroup),b),promptField:kb.table.activate(kb.table.create(b.fields.promptField),b),verifyField:kb.table.activate(kb.table.create(b.fields.verifyField),
b),errorField:kb.table.activate(kb.table.create(b.fields.errorField),b),duplicateCriteria:kb.table.create(b.fields.duplicateCriteria,!1,!1,!1).spread((a,d)=>{a.elm(".kb-table-row-add").on("click",e=>{c.tables.duplicateCriteria.insertRow(a)});a.elm(".kb-table-row-del").on("click",e=>{kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],()=>{c.tables.duplicateCriteria.delRow(a)})});(e=>{e.external.on("change",p=>p.currentTarget.rebuild()).rebuild=()=>new Promise((p,m)=>{e.operator.empty();
e.internal.empty().assignOption([{code:"",label:""}],"label","code");if(e.external.val()){m={};e.operator.assignOption(kb.filter.query.operator(g.parallelize[e.external.val()]),"label","code");for(var r in g.parallelize){var n=g.parallelize[r];n.tableCode||kb.field.typing(n,g.parallelize[e.external.val()],!0)&&(m[n.code]=n)}e.internal.assignOption(Object.values(m),"label","code");p(m)}else p({})})})({external:a.elm("[field-id=external]").elm("select"),operator:a.elm("[field-id=operator]").elm("select"),
internal:a.elm("[field-id=internal]").elm("select")})},(a,d)=>{0==a.tr.length&&a.addRow()},!1)};c.panel.addClass("kb-scope").attr("form-id","form_"+b.id).append(kb.config[f].ui.fields.users.set(kb.config[f].ui.fields.conditions.set(kb.create("div").addClass("kb-config-tabbed-panel-block"),b),b).append(kb.create("h1").html(kb.constants.config.caption.event[kb.operator.language])).append(kb.create("section").append(kb.field.activate((a=>{a.elms("[type=checkbox]").each((d,e)=>{d.closest("label").elm("span").html(kb.constants.config.caption.event[d.val()][kb.operator.language])});
return a})(kb.field.create(b.fields.event)),b))).append(kb.create("section").addClass("kb-hidden").append(kb.field.activate((a=>{a.elm("select").empty().assignOption([{code:"",label:""}].concat(t.actions.map(d=>({code:d.key,label:d.name+"&nbsp;("+d.from+"&nbsp;&gt;&nbsp;"+d.to+")"}))),"label","code");return a})(kb.field.create(b.fields.action)),b))).append(kb.create("section").addClass("kb-hidden").append(kb.field.activate(kb.field.create(b.fields.label).css({width:"100%"}),b))).append(kb.create("section").addClass("kb-hidden").append(kb.field.activate(kb.field.create(b.fields.message).css({width:"100%"}),
b))).append(kb.create("section").addClass("kb-hidden").append(kb.field.activate((a=>{a.elm("select").empty().assignOption([{code:"",label:kb.constants.config.caption.view.all[kb.operator.language]}].concat(u.list.map(d=>({code:d.id,label:d.name}))),"label","code");return a})(kb.field.create(b.fields.view)),b))).append(kb.create("section").append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.event.index[kb.operator.language])))).append(kb.create("h1").html(kb.constants.config.caption.numbering[kb.operator.language])).append(kb.create("section").append(kb.create("h1").html(kb.constants.config.caption.numbering.field[kb.operator.language])).append(kb.create("section").append(kb.field.activate((a=>
{a.elm("select").empty().assignOption(kb.config[f].ui.options.fields(g,(d,e)=>{switch(e.type){case "SINGLE_LINE_TEXT":e.tableCode||e.expression||d.push({code:e.code,label:e.label})}return d}),"label","code");return a})(kb.field.create(b.fields.numberingField)),b)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.numbering.caution[kb.operator.language]))).append(kb.create("h1").html(kb.constants.config.caption.numbering.group[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.numbering.group[kb.operator.language])).append((a=>
{a.template.elm("[field-id=field]").elm("select").empty().assignOption(kb.config[f].ui.options.fields(g,(d,e)=>{switch(e.type){case "DROP_DOWN":case "RADIO_BUTTON":case "SINGLE_LINE_TEXT":e.tableCode||d.push({code:e.code,label:e.label})}return d}),"label","code");a.elm("thead").hide();return a})(c.tables.numberingGroup))).append(kb.create("h1").html(kb.constants.config.caption.numbering.digits[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.numbering.digits[kb.operator.language])).append(kb.field.activate(kb.field.create(b.fields.numberingDigits),
b)))).append(kb.create("h1").html(kb.constants.config.caption.prompt[kb.operator.language])).append(kb.create("section").append(kb.create("h1").html(kb.constants.config.caption.prompt.field[kb.operator.language])).append(kb.create("section").append((a=>{a.template.elm("[field-id=field]").elm("select").empty().assignOption(kb.config[f].ui.options.fields(g,(d,e)=>{e.tableCode||g.disables.includes(e.code)||"FILE"==e.type||e.lookup||d.push({code:e.code,label:e.label});return d}),"label","code");a.elm("thead").hide();
return a})(c.tables.promptField)).append(kb.field.activate((a=>{a.elm("input").closest("label").elm("span").html(kb.constants.config.caption.prompt.overwrite[kb.operator.language]);return a})(kb.field.create(b.fields.promptOverwrite).css({width:"100%"})),b)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.prompt.caution[kb.operator.language])))).append(kb.create("h1").html(kb.constants.config.caption.verify[kb.operator.language])).append(kb.create("section").append(kb.create("h1").html(kb.constants.config.caption.verify.field[kb.operator.language])).append(kb.create("section").append((a=>
{a.template.elm("[field-id=field]").elm("select").empty().assignOption(kb.config[f].ui.options.fields(g,(d,e)=>{e.tableCode||"FILE"!=e.type&&d.push({code:e.code,label:e.label});return d}),"label","code");a.elm("thead").hide();return a})(c.tables.verifyField)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.verify.caution[kb.operator.language]))).append(kb.create("h1").html(kb.constants.config.caption.verify.message[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.verifyMessage).css({width:"100%"}),
b)))).append(kb.create("h1").html(kb.constants.config.caption.error[kb.operator.language])).append(kb.create("section").append(kb.create("h1").html(kb.constants.config.caption.error.filter[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.errorFilter).css({width:"100%"}),b))).append(kb.create("h1").html(kb.constants.config.caption.error.message[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.errorMessage).css({width:"100%"}),
b))).append(kb.create("h1").html(kb.constants.config.caption.error.field[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.error.field[kb.operator.language])).append((a=>{a.template.elm("[field-id=field]").elm("select").empty().assignOption(kb.config[f].ui.options.fields(g,(d,e)=>{d.push({code:e.code,label:e.label});return d}),"label","code");a.elm("thead").hide();return a})(c.tables.errorField)))).append(kb.create("h1").html(kb.constants.config.caption.duplicate[kb.operator.language])).append(kb.create("section").append(kb.create("h1").html(kb.constants.config.caption.duplicate.criteria[kb.operator.language])).append(kb.create("section").append((a=>
{a.template.elm("[field-id=external]").elm("select").empty().assignOption([{code:"",label:""}].concat(Object.values(g.criterias)),"label","code");return a})(c.tables.duplicateCriteria)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.duplicate.hint[kb.operator.language])))).append(kb.create("h1").html(kb.constants.config.caption.url[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(b.fields.url).css({width:"100%"}),b)).append(kb.create("p").addClass("kb-hint").html(kb.constants.config.description.url.hint[kb.operator.language])).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.url.caution[kb.operator.language])));
c.tables.numberingGroup.addRow();c.tables.promptField.addRow();c.tables.verifyField.addRow();c.tables.errorField.addRow();c.tables.duplicateCriteria.addRow();kb.event.on("kb.change.event",a=>{a.container==c.panel&&(c.panel.elm("[field-id=action]").closest("section").addClass("kb-hidden"),c.panel.elm("[field-id=view]").closest("section").addClass("kb-hidden"),c.panel.elm("[field-id=label]").closest("section").addClass("kb-hidden"),c.panel.elm("[field-id=message]").closest("section").addClass("kb-hidden"),
a.record.event.value.includes("process")&&c.panel.elm("[field-id=action]").closest("section").removeClass("kb-hidden"),a.record.event.value.includes("index")&&c.panel.elm("[field-id=label]").closest("section").removeClass("kb-hidden"),a.record.event.value.includes("index")&&c.panel.elm("[field-id=message]").closest("section").removeClass("kb-hidden"),a.record.event.value.includes("index")&&c.panel.elm("[field-id=view]").closest("section").removeClass("kb-hidden"));return a});c.panel.elms("input,select,textarea").each((a,
d)=>a.initialize())})({id:k.app.id,fields:k.app.fields.tab})},copy:(c,b)=>{var a={id:k.app.id,fields:k.app.fields.tab};h(b,a,kb.record.get(c.panel,a,!0).record)},del:c=>{}});q.main.append(kb.create("p").addClass("kb-hint").html(kb.constants.config.description.status[kb.operator.language]+"<br>"+(()=>{var c=null;switch(kb.operator.language){case "en":c=kb.create("a").attr("href","https://kintone.dev/en/docs/kintone/js-api/events/record-details-event/#overwrite-field-values").attr("target","_blank").html("https://kintone.dev/en/docs/kintone/js-api/events/record-details-event/#overwrite-field-values");
break;case "ja":c=kb.create("a").attr("href","https://cybozu.dev/ja/kintone/docs/js-api/events/event-object-actions/#record-details-overwrite-field-values").attr("target","_blank").html("https://cybozu.dev/ja/kintone/docs/js-api/events/event-object-actions/#record-details-overwrite-field-values");break;case "zh":c=kb.create("a").attr("href","https://cybozudev.kf5.com/hc/kb/article/206907/#step4").attr("target","_blank").html("https://cybozudev.kf5.com/hc/kb/article/206907/#step4")}return c})().outerHTML));
0!=Object.keys(l).length?(c=>{c.each(b=>{var a={id:k.app.id,fields:k.app.fields.tab},d=kb.config[f].tabbed.add();h(d,a,b.setting);d.label.html(b.label)})})(JSON.parse(l.tab)):kb.config[f].tabbed.add()}catch(c){kb.alert(kb.error.parse(c))}})})})})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{action:{en:"Action Name",ja:"\u30a2\u30af\u30b7\u30e7\u30f3\u540d",zh:"\u64cd\u4f5c\u540d\u79f0"},duplicate:{en:"Confirm Registration of Existing Record",ja:"\u6761\u4ef6\u306b\u5408\u81f4\u3059\u308b\u30ec\u30b3\u30fc\u30c9\u304c\u767b\u9332\u6e08\u307f\u3067\u3042\u308c\u3070\u3001\u767b\u9332\u3059\u308b\u304b\u3069\u3046\u304b\u78ba\u8a8d\u3092\u3059\u308b",zh:"\u786e\u8ba4\u5df2\u5b58\u5728\u8bb0\u5f55\u7684\u6ce8\u518c",criteria:{en:"Associating records",
ja:"\u30ec\u30b3\u30fc\u30c9\u306e\u95a2\u9023\u4ed8\u3051",zh:"\u8bb0\u5f55\u7684\u5173\u8054"},destination:{en:"Destination",ja:"\u3053\u306e\u30a2\u30d7\u30ea\u306e\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u8fd9\u4e2a\u5e94\u7528\u7684\u5b57\u6bb5"},source:{en:"Source",ja:"\u3053\u306e\u30ec\u30b3\u30fc\u30c9\u306e\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u8fd9\u6761\u8bb0\u5f55\u7684\u5b57\u6bb5"}},error:{en:"If it meets additional conditions, make it an error",ja:"\u8ffd\u52a0\u6761\u4ef6\u306b\u5408\u81f4\u3057\u305f\u3089\u30a8\u30e9\u30fc\u306b\u3059\u308b",
zh:"\u5982\u679c\u6ee1\u8db3\u989d\u5916\u7684\u6761\u4ef6\uff0c\u5c06\u5176\u89c6\u4e3a\u9519\u8bef",field:{en:"Display message for each field",ja:"\u30d5\u30a3\u30fc\u30eb\u30c9\u6bce\u306b\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u8868\u793a",zh:"\u6bcf\u4e2a\u5b57\u6bb5\u663e\u793a\u6d88\u606f"},filter:{en:"Additional conditions to be considered as error",ja:"\u30a8\u30e9\u30fc\u3068\u3059\u308b\u8ffd\u52a0\u6761\u4ef6",zh:"\u88ab\u89c6\u4e3a\u9519\u8bef\u7684\u9644\u52a0\u6761\u4ef6"},message:{en:"Error message",
ja:"\u30a8\u30e9\u30fc\u30e1\u30c3\u30bb\u30fc\u30b8",zh:"\u9519\u8bef\u6d88\u606f"}},event:{en:"Action Available Event",ja:"\u52d5\u4f5c\u30a4\u30d9\u30f3\u30c8",zh:"\u53ef\u64cd\u4f5c\u4e8b\u4ef6",create:{en:"Submit on record creation",ja:"\u30ec\u30b3\u30fc\u30c9\u8ffd\u52a0\u753b\u9762\u3067\u306e\u4fdd\u5b58\u30dc\u30bf\u30f3\u30af\u30ea\u30c3\u30af",zh:"\u5728\u8bb0\u5f55\u521b\u5efa\u65f6\u63d0\u4ea4"},edit:{en:"Submit on record editing",ja:"\u30ec\u30b3\u30fc\u30c9\u7de8\u96c6\u753b\u9762\u3067\u306e\u4fdd\u5b58\u30dc\u30bf\u30f3\u30af\u30ea\u30c3\u30af",
zh:"\u5728\u8bb0\u5f55\u7f16\u8f91\u65f6\u63d0\u4ea4"},index:{en:"Bulk Execution from List View",ja:"\u4e00\u89a7\u753b\u9762\u304b\u3089\u306e\u4e00\u62ec\u5b9f\u884c",zh:"\u4ece\u5217\u8868\u5c4f\u5e55\u7684\u6279\u91cf\u6267\u884c"},process:{en:"Process Action",ja:"\u30d7\u30ed\u30bb\u30b9\u30a2\u30af\u30b7\u30e7\u30f3",zh:"\u8fc7\u7a0b\u64cd\u4f5c"}},label:{en:"Execution Button Label",ja:"\u5b9f\u884c\u30dc\u30bf\u30f3\u306e\u30e9\u30d9\u30eb\u30c6\u30ad\u30b9\u30c8",zh:"\u6267\u884c\u6309\u94ae\u7684\u6807\u7b7e\u540d\u79f0"},
message:{en:"Execution Confirmation Dialog Message",ja:"\u5b9f\u884c\u78ba\u8a8d\u30c0\u30a4\u30a2\u30ed\u30b0\u306e\u30e1\u30c3\u30bb\u30fc\u30b8",zh:"\u6267\u884c\u786e\u8ba4\u5bf9\u8bdd\u6846\u7684\u6d88\u606f"},numbering:{en:"Automatically number it",ja:"\u81ea\u52d5\u63a1\u756a\u3059\u308b",zh:"\u81ea\u52a8\u7f16\u53f7",digits:{en:"Number of digits",ja:"\u63a1\u756a\u6841\u6570",zh:"\u7f16\u53f7\u4f4d\u6570"},field:{en:"Field to save",ja:"\u4fdd\u5b58\u5148\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u4fdd\u5b58\u5b57\u6bb5"},
group:{en:"Numbering group",ja:"\u63a1\u756a\u30b0\u30eb\u30fc\u30d7",zh:"\u7f16\u53f7\u7ec4"}},prompt:{en:"Show a popup prompting for input",ja:"\u5165\u529b\u3092\u4fc3\u3059\u30dd\u30c3\u30d7\u30a2\u30c3\u30d7\u3092\u8868\u793a\u3059\u308b",zh:"\u663e\u793a\u4e00\u4e2a\u63d0\u793a\u8f93\u5165\u7684\u5f39\u7a97",field:{en:"Field to prompt input",ja:"\u5165\u529b\u3092\u4fc3\u3059\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u63d0\u793a\u8f93\u5165\u7684\u5b57\u6bb5"},overwrite:{en:"Even if already inputted, prompt to enter again",
ja:"\u5165\u529b\u6e08\u307f\u3067\u3042\u3063\u3066\u3082\u3001\u6539\u3081\u3066\u5165\u529b\u3092\u4fc3\u3059",zh:"\u5373\u4f7f\u5df2\u8f93\u5165\uff0c\u4e5f\u91cd\u65b0\u63d0\u793a\u8f93\u5165"}},url:{en:"Navigate to the specified URL after event processing",ja:"\u30a4\u30d9\u30f3\u30c8\u51e6\u7406\u5f8c\u306b\u6307\u5b9a\u3057\u305fURL\u3078\u9077\u79fb\u3059\u308b",zh:"\u4e8b\u4ef6\u5904\u7406\u540e\u8f6c\u5230\u6307\u5b9a\u7684URL"},verify:{en:"Show a popup to confirm the input content",ja:"\u5165\u529b\u5185\u5bb9\u306e\u78ba\u8a8d\u3092\u3059\u308b\u30dd\u30c3\u30d7\u30a2\u30c3\u30d7\u3092\u8868\u793a\u3059\u308b",
zh:"\u663e\u793a\u4e00\u4e2a\u786e\u8ba4\u8f93\u5165\u5185\u5bb9\u7684\u5f39\u7a97",field:{en:"Field to confirm input contents",ja:"\u5165\u529b\u5185\u5bb9\u3092\u78ba\u8a8d\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u786e\u8ba4\u8f93\u5165\u5185\u5bb9\u7684\u5b57\u6bb5"},message:{en:"Message to be displayed at the top of the popup screen",ja:"\u30dd\u30c3\u30d7\u30a2\u30c3\u30d7\u753b\u9762\u4e0a\u90e8\u306b\u8868\u793a\u3059\u308b\u30e1\u30c3\u30bb\u30fc\u30b8",zh:"\u5728\u5f39\u51fa\u5c4f\u5e55\u9876\u90e8\u663e\u793a\u7684\u6d88\u606f"}},
view:{en:"Executable List View",ja:"\u5b9f\u884c\u53ef\u80fd\u306a\u4e00\u89a7\u753b\u9762",zh:"\u53ef\u6267\u884c\u7684\u5217\u8868\u5c4f\u5e55",all:{en:"No restrictions",ja:"\u5236\u9650\u3057\u306a\u3044",zh:"\u4e0d\u9650\u5236"}}},description:{duplicate:{hint:{en:"Setting conditions in multiple tabs will result in an OR search.",ja:"\u8907\u6570\u306e\u30bf\u30d6\u306b\u5206\u3051\u3066\u6761\u4ef6\u3092\u8a2d\u5b9a\u3059\u308b\u3068OR\u691c\u7d22\u306b\u306a\u308a\u307e\u3059\u3002",zh:"\u5728\u591a\u4e2a\u6807\u7b7e\u4e2d\u8bbe\u7f6e\u6761\u4ef6\u5c06\u53d8\u6210\u6216\u641c\u7d22\u3002"}},
error:{field:{en:"If you want to display error messages for each field, please specify them.",ja:"\u30d5\u30a3\u30fc\u30eb\u30c9\u6bce\u306b\u30a8\u30e9\u30fc\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u8868\u793a\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u305d\u308c\u3089\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u60a8\u60f3\u4e3a\u6bcf\u4e2a\u5b57\u6bb5\u663e\u793a\u9519\u8bef\u4fe1\u606f\uff0c\u8bf7\u6307\u5b9a\u5b83\u4eec\u3002"}},event:{index:{en:"Only automatic numbering can be executed in bulk from the list view.",
ja:"\u4e00\u89a7\u753b\u9762\u304b\u3089\u4e00\u62ec\u5b9f\u884c\u51fa\u6765\u308b\u306e\u306f\u81ea\u52d5\u63a1\u756a\u306e\u307f\u306b\u306a\u308a\u307e\u3059\u3002",zh:"\u4ece\u5217\u8868\u754c\u9762\u6279\u91cf\u6267\u884c\u7684\u53ea\u80fd\u662f\u81ea\u52a8\u7f16\u53f7\u3002"}},numbering:{digits:{en:"Please input the number of digits to align with leading zeros.",ja:"\u5148\u982d\u3092\u30bc\u30ed\u3067\u63c3\u3048\u308b\u70ba\u306e\u6841\u6570\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u8bf7\u8f93\u5165\u7528\u4e8e\u4f7f\u524d\u5bfc\u96f6\u5bf9\u9f50\u7684\u4f4d\u6570\u3002"},group:{en:"If you want to number by group, please specify the field for grouping.",ja:"\u30b0\u30eb\u30fc\u30d7\u6bce\u306b\u63a1\u756a\u3092\u884c\u3044\u305f\u3044\u5834\u5408\u306f\u3001\u30b0\u30eb\u30fc\u30d7\u5316\u3059\u308b\u70ba\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u60a8\u60f3\u6309\u7ec4\u7f16\u53f7\uff0c\u8bf7\u6307\u5b9a\u7528\u4e8e\u5206\u7ec4\u7684\u5b57\u6bb5\u3002"},
caution:{en:'It will only operate if the field specified in the "Field to save" is empty.',ja:"\u4fdd\u5b58\u5148\u30d5\u30a3\u30fc\u30eb\u30c9\u306b\u6307\u5b9a\u3057\u305f\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u7a7a\u306e\u5834\u5408\u306e\u307f\u306e\u52d5\u4f5c\u306b\u306a\u308a\u307e\u3059\u3002",zh:"\u53ea\u6709\u5f53\u6307\u5b9a\u7684\u201c\u4fdd\u5b58\u5b57\u6bb5\u201d\u4e3a\u7a7a\u65f6\u624d\u4f1a\u64cd\u4f5c\u3002"}},prompt:{caution:{en:"Fields within a table cannot be specified.",ja:"\u30c6\u30fc\u30d6\u30eb\u5185\u30d5\u30a3\u30fc\u30eb\u30c9\u306f\u6307\u5b9a\u51fa\u6765\u307e\u305b\u3093\u3002",
zh:"\u8868\u5185\u5b57\u6bb5\u4e0d\u80fd\u88ab\u6307\u5b9a\u3002"}},status:{en:"Due to kintone's specifications, there are fields that cannot be modified. Please check the URL below.",ja:"kintone\u306e\u4ed5\u69d8\u306b\u3088\u308a\u3001\u66f8\u304d\u63db\u3048\u308b\u3053\u3068\u304c\u51fa\u6765\u306a\u3044\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u3042\u308a\u307e\u3059\u306e\u3067\u3001\u4e0b\u8a18URL\u3092\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002",zh:"\u7531\u4e8ekintone\u7684\u89c4\u8303\uff0c\u6709\u4e9b\u5b57\u6bb5\u4e0d\u80fd\u88ab\u4fee\u6539\u3002\u8bf7\u68c0\u67e5\u4ee5\u4e0b\u7684URL\u3002"},
url:{caution:{en:'There is no transition after "Process Action" is executed.',ja:"\u30d7\u30ed\u30bb\u30b9\u30a2\u30af\u30b7\u30e7\u30f3\u5b9f\u884c\u5f8c\u306e\u9077\u79fb\u306f\u3042\u308a\u307e\u305b\u3093\u3002",zh:'\u6267\u884c"Process Action"\u540e\u4e0d\u4f1a\u8fdb\u884c\u8f6c\u6362\u3002'},hint:{en:"To insert the value of a field at any position in URL, please enclose the field code of the field to be inserted with %.",ja:"URL\u306e\u4efb\u610f\u306e\u4f4d\u7f6e\u306b\u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u5024\u3092\u633f\u5165\u3059\u308b\u5834\u5408\u306f\u3001\u633f\u5165\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u30b3\u30fc\u30c9\u3092\u3001%\u3067\u56f2\u3063\u3066\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u8981\u5728URL\u7684\u4efb\u610f\u4f4d\u7f6e\u63d2\u5165\u5b57\u6bb5\u503c\uff0c\u8bf7\u7528%\u5305\u56f4\u8981\u63d2\u5165\u7684\u5b57\u6bb5\u7684\u5b57\u6bb5\u4ee3\u7801\u3002"}},verify:{caution:{en:"Fields within a table cannot be specified.",ja:"\u30c6\u30fc\u30d6\u30eb\u5185\u30d5\u30a3\u30fc\u30eb\u30c9\u306f\u6307\u5b9a\u51fa\u6765\u307e\u305b\u3093\u3002",zh:"\u8868\u5185\u5b57\u6bb5\u4e0d\u80fd\u88ab\u6307\u5b9a\u3002"}}},message:{invalid:{action:{en:'If you specify "Process Action" for the action event, please indicate its action name.',
ja:"\u52d5\u4f5c\u30a4\u30d9\u30f3\u30c8\u306b\u300c\u30d7\u30ed\u30bb\u30b9\u30a2\u30af\u30b7\u30e7\u30f3\u300d\u3092\u6307\u5b9a\u3057\u305f\u5834\u5408\u306f\u3001\u305d\u306e\u30a2\u30af\u30b7\u30e7\u30f3\u540d\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u5728\u64cd\u4f5c\u4e8b\u4ef6\u4e2d\u6307\u5b9a\u4e86\u201c\u8fc7\u7a0b\u64cd\u4f5c\u201d\uff0c\u8bf7\u6307\u5b9a\u5176\u64cd\u4f5c\u540d\u79f0\u3002"},label:{index:{en:'If you specify "Bulk Execution from List View" for the action event, please input its execution button label.',
ja:"\u52d5\u4f5c\u30a4\u30d9\u30f3\u30c8\u306b\u300c\u4e00\u89a7\u753b\u9762\u304b\u3089\u306e\u4e00\u62ec\u5b9f\u884c\u300d\u3092\u6307\u5b9a\u3057\u305f\u5834\u5408\u306f\u3001\u305d\u306e\u5b9f\u884c\u30dc\u30bf\u30f3\u306e\u30e9\u30d9\u30eb\u30c6\u30ad\u30b9\u30c8\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u5728\u64cd\u4f5c\u4e8b\u4ef6\u4e2d\u6307\u5b9a\u4e86\u201c\u4ece\u5217\u8868\u5c4f\u5e55\u7684\u6279\u91cf\u6267\u884c\u201d\uff0c\u8bf7\u8f93\u5165\u5176\u6267\u884c\u6309\u94ae\u7684\u6807\u7b7e\u540d\u79f0\u3002"}},
message:{index:{en:'If you specify "Bulk Execution from List View" for the action event, please input its execution confirmation dialog message.',ja:"\u52d5\u4f5c\u30a4\u30d9\u30f3\u30c8\u306b\u300c\u4e00\u89a7\u753b\u9762\u304b\u3089\u306e\u4e00\u62ec\u5b9f\u884c\u300d\u3092\u6307\u5b9a\u3057\u305f\u5834\u5408\u306f\u3001\u305d\u306e\u5b9f\u884c\u78ba\u8a8d\u30c0\u30a4\u30a2\u30ed\u30b0\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u5728\u64cd\u4f5c\u4e8b\u4ef6\u4e2d\u6307\u5b9a\u4e86\u201c\u4ece\u5217\u8868\u5c4f\u5e55\u7684\u6279\u91cf\u6267\u884c\u201d\uff0c\u8bf7\u8f93\u5165\u5176\u6267\u884c\u786e\u8ba4\u5bf9\u8bdd\u6846\u7684\u6d88\u606f\u3002"}},
numbering:{en:"Please enter the number of digits for numbering.",ja:"\u63a1\u756a\u6841\u6570\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u8f93\u5165\u7f16\u53f7\u7684\u4f4d\u6570\u3002"}}},prompt:{error:{message:{en:"Enter the error message",ja:"\u30a8\u30e9\u30fc\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u5165\u529b",zh:"\u8bf7\u8f93\u5165\u9519\u8bef\u6d88\u606f"}},url:{en:"Enter the destination URL",ja:"\u9077\u79fb\u5148URL\u3092\u5165\u529b",zh:"\u8f93\u5165\u76ee\u6807URL"}}}},
kb.constants);