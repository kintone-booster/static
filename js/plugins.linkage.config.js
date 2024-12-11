/*
* FileName "plugins.linkage.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(m=>{var p={};kb.field.load(kintone.app.getId()).then(w=>{kb.view.load(kintone.app.getId()).then(z=>{kb.apps.load().then(A=>{kb.config[m].build({submit:(x,n)=>{try{var l=!1;n.tab=[];n.flat={};(a=>{kb.config[m].tabbed.tabs.some(c=>{var b=kb.record.get(c.panel,a);b.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),kb.config[m].tabbed.activate(c),l=!0):l||(h=>{var d=b.record.criteria.value.filter(f=>f.value.external.value&&f.value.internal.value),g=b.record.sort.value.filter(f=>
f.value.field.value),e=[],k=[];d.length==0?(kb.alert(kb.constants.config.message.invalid.criteria[kb.operator.language]),kb.config[m].tabbed.activate(c),l=!0):(b.record.mapping.value.each((f,y)=>{f.value.external.value&&(e.push(f),k.push(h.external[f.value.external.value].tableCode))}),e.length==0?(kb.alert(kb.constants.config.message.invalid.mapping[kb.operator.language]),kb.config[m].tabbed.activate(c),l=!0):(k=Array.from(new Set(k.filter(f=>f))),k.length>1?(kb.alert(kb.constants.config.message.invalid.multiple[kb.operator.language]),
kb.config[m].tabbed.activate(c),l=!0):(e.filter(f=>f.value.internal.value)!=0&&(b.record.label.value||(kb.alert(kb.constants.config.message.invalid.label[kb.operator.language]),kb.config[m].tabbed.activate(c),l=!0),b.record.message.value||(kb.alert(kb.constants.config.message.invalid.message[kb.operator.language]),kb.config[m].tabbed.activate(c),l=!0)),l||(parseInt(b.record.limit.value)<1||parseInt(b.record.limit.value)>500?(kb.alert(kb.constants.config.message.invalid.limit[kb.operator.language]),
kb.config[m].tabbed.activate(c),l=!0):(b.record.bulk.value.includes("bulk")||(b.record.view.value=""),b.record.criteria.value=d,b.record.sort.value=g,b.record.mapping.value=e,n.tab.push({label:c.label.html(),setting:b.record}))))))})({external:c.fields.external.parallelize,internal:c.fields.internal.parallelize});return l});n.tab.length!=Array.from(new Set(n.tab.map(c=>c.setting.container.value))).length&&(kb.alert(kb.constants.config.message.invalid.duplicate[kb.operator.language]),l=!0)})({id:p.app.id,
fields:p.app.fields.tab});n.tab=JSON.stringify(n.tab);n.flat=JSON.stringify(n.flat);return l?!1:n}catch(a){return kb.alert(kb.error.parse(a)),!1}}},(x,n)=>{try{p.app={id:m,fields:{tab:{container:{code:"container",type:"DROP_DOWN",label:"",required:!0,noLabel:!0,options:[]},app:{code:"app",type:"DROP_DOWN",label:"",required:!0,noLabel:!0,options:[]},criteria:{code:"criteria",type:"SUBTABLE",label:"",noLabel:!0,fields:{external:{code:"external",type:"DROP_DOWN",label:kb.constants.config.caption.external[kb.operator.language],
required:!1,noLabel:!0,options:[]},operator:{code:"operator",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[]},internal:{code:"internal",type:"DROP_DOWN",label:kb.constants.config.caption.internal[kb.operator.language],required:!1,noLabel:!0,options:[]}}},filter:{code:"filter",type:"CONDITION",label:"",required:!1,noLabel:!0,app:{id:kintone.app.getId(),fields:w.parallelize}},sort:{code:"sort",type:"SUBTABLE",label:"",noLabel:!0,fields:{field:{code:"field",type:"DROP_DOWN",label:"",required:!1,
noLabel:!0,options:[]},order:{code:"order",type:"DROP_DOWN",label:"",required:!1,noLabel:!0,options:[{index:0,label:"asc"},{index:1,label:"desc"}]}}},mapping:{code:"mapping",type:"SUBTABLE",label:"",noLabel:!0,fields:{external:{code:"external",type:"DROP_DOWN",label:kb.constants.config.caption.external[kb.operator.language],required:!1,noLabel:!0,options:[]},guide:{code:"guide",type:"SPACER",label:"",required:!1,noLabel:!0,contents:'<span class="kb-icon kb-icon-arrow kb-icon-arrow-right"></span>'},
internal:{code:"internal",type:"DROP_DOWN",label:kb.constants.config.caption.internal[kb.operator.language],required:!1,noLabel:!0,options:[]}}},label:{code:"label",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.label[kb.operator.language],required:!1,noLabel:!1,placeholder:""},message:{code:"message",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.message[kb.operator.language],required:!1,noLabel:!1,placeholder:""},user:{code:"user",type:"USER_SELECT",label:kb.constants.config.caption.user[kb.operator.language],
required:!1,noLabel:!1,guestuser:!0},organization:{code:"organization",type:"ORGANIZATION_SELECT",label:kb.constants.config.caption.organization[kb.operator.language],required:!1,noLabel:!1},group:{code:"group",type:"GROUP_SELECT",label:kb.constants.config.caption.group[kb.operator.language],required:!1,noLabel:!1},bulk:{code:"bulk",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"bulk"}]},view:{code:"view",type:"DROP_DOWN",label:kb.constants.config.caption.view[kb.operator.language],
required:!1,noLabel:!1,options:[]},limit:{code:"limit",type:"NUMBER",label:"",required:!0,noLabel:!0}},flat:{}}};var l=(a,c,b)=>{kb.record.set(a.panel,c,(()=>{a.panel.elm("[field-id=app]").elm("select").val(b.app.value).rebuild().then(h=>{a.tables.criteria.clearRows();b.criteria.value.each((d,g)=>{d.value.external.value in h.criteria&&(e=>{e.elm("[field-id=external]").elm("select").val(d.value.external.value).rebuild().then(k=>{d.value.internal.value in k&&(e.elm("[field-id=operator]").elm("select").val(d.value.operator.value),
e.elm("[field-id=internal]").elm("select").val(d.value.internal.value))})})(a.tables.criteria.addRow())});a.tables.criteria.tr.length==0&&a.tables.criteria.addRow();a.tables.sort.clearRows();b.sort.value.each((d,g)=>{d.value.field.value in h.sort&&(g=a.tables.sort.addRow(),g.elm("[field-id=field]").elm("select").val(d.value.field.value),g.elm("[field-id=order]").elm("select").val(d.value.order.value))});a.tables.sort.tr.length==0&&a.tables.sort.addRow();a.tables.mapping.clearRows();b.mapping.value.each((d,
g)=>{d.value.external.value in h.mapping&&(e=>{e.elm("[field-id=external]").elm("select").val(d.value.external.value).rebuild().then(k=>{d.value.internal.value in k&&e.elm("[field-id=internal]").elm("select").val(d.value.internal.value)})})(a.tables.mapping.addRow())});a.tables.mapping.tr.length==0&&a.tables.mapping.addRow();(d=>{d.elm(".kb-guide").empty();b.filter.value?(d.elm("input").val(b.filter.value),b.filter.value.split(" and ").each((g,e)=>d.guide(g))):d.elm("input").val("")})(a.panel.elm("[field-id=filter]").elm(".kb-field-value"))});
return b})())};kb.config[m].tabbed=new KintoneBoosterConfigTabbed(x,{add:a=>{(c=>{a.fields={external:{},internal:w};a.tables={criteria:kb.table.create(c.fields.criteria,!1,!1,!1).spread((b,h)=>{b.elm(".kb-table-row-add").on("click",d=>{a.tables.criteria.insertRow(b)});b.elm(".kb-table-row-del").on("click",d=>{kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],()=>{a.tables.criteria.delRow(b)})});(d=>{d.external.on("change",g=>g.currentTarget.rebuild()).rebuild=()=>new Promise((g,
e)=>{d.operator.empty();d.internal.empty().assignOption([{code:"",label:""}],"label","code");if(d.external.val()){e={};d.operator.assignOption(kb.filter.query.operator(a.fields.external.parallelize[d.external.val()]),"label","code");for(var k in a.fields.internal.parallelize){var f=a.fields.internal.parallelize[k];f.tableCode||kb.field.typing(f,a.fields.external.parallelize[d.external.val()],!0)&&(e[f.code]=f)}d.internal.assignOption(Object.values(e),"label","code");g(e)}else g({})})})({external:b.elm("[field-id=external]").elm("select"),
operator:b.elm("[field-id=operator]").elm("select"),internal:b.elm("[field-id=internal]").elm("select")})},(b,h)=>{b.tr.length==0&&b.addRow()},!1),mapping:kb.table.create(c.fields.mapping,!1,!1,!1).addClass("kb-mapping").spread((b,h)=>{b.elm(".kb-table-row-add").on("click",d=>{a.tables.mapping.insertRow(b)});b.elm(".kb-table-row-del").on("click",d=>{kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],()=>{a.tables.mapping.delRow(b)})});(d=>{d.external.on("change",g=>g.currentTarget.rebuild()).rebuild=
()=>new Promise((g,e)=>{d.internal.empty().assignOption([{code:"",label:""}],"label","code");if(d.external.val()){e={};for(var k in a.fields.internal.parallelize){var f=a.fields.internal.parallelize[k];f.tableCode&&(a.fields.internal.disables.includes(f.code)||["FILE"].includes(f.type)||kb.field.typing(a.fields.external.parallelize[d.external.val()],f)&&(e[f.code]=f))}d.internal.assignOption(Object.values(e),"label","code");g(e)}else g({})})})({external:b.elm("[field-id=external]").elm("select"),
internal:b.elm("[field-id=internal]").elm("select")})},(b,h)=>{b.tr.length==0&&b.addRow()},!1),sort:kb.table.activate(kb.table.create(c.fields.sort),c)};a.panel.addClass("kb-scope").attr("form-id","form_"+c.id).append(kb.create("h1").html(kb.constants.config.caption.container[kb.operator.language])).append(kb.create("section").append((b=>{b.elm("select").empty().assignOption([{elementId:""}].concat(a.fields.internal.spacers),"elementId","elementId");return b})(kb.field.activate(kb.field.create(c.fields.container),
c))).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.container[kb.operator.language]))).append(kb.create("h1").html(kb.constants.config.caption.app[kb.operator.language])).append(kb.create("section").append((b=>{b.elm("select").empty().assignOption([{appId:"",name:""}].concat(A),"name","appId").on("change",h=>h.currentTarget.rebuild()).rebuild=()=>new Promise((h,d)=>{((g,e,k,f)=>{g.clearRows();g.template.elm("[field-id=external]").css({width:"100%"}).elm("select").empty().assignOption([{code:"",
label:""}],"label","code");g.template.elm("[field-id=operator]").css({width:"100%"}).elm("select").empty();g.template.elm("[field-id=internal]").css({width:"100%"}).elm("select").empty().assignOption([{code:"",label:""}],"label","code");e.clearRows();e.template.elm("[field-id=field]").css({width:"100%"}).elm("select").empty().assignOption([{code:"",label:""}],"label","code");k.clearRows();k.template.elm("[field-id=external]").css({width:"100%"}).elm("select").empty().assignOption([{code:"",label:""}],
"label","code");k.template.elm("[field-id=internal]").css({width:"100%"}).elm("select").empty().assignOption([{code:"",label:""}],"label","code");k.template.elm("[field-id=guide]").css({width:"100%"}).parentNode.addClass("kb-mapping-guide");b.elm("select").val()?kb.field.load(b.elm("select").val()).then(y=>{a.fields.external=y;h((B=>{var v={criteria:(r=>{var t={},u;for(u in r){var q=r[u];t[q.code]=q}return t})(a.fields.external.criterias),mapping:(r=>{var t={},u;for(u in r){var q=r[u];["CATEGORY"].includes(q.type)||
(t[q.code]=q)}return t})(a.fields.external.parallelize),sort:a.fields.external.parallelize};g.template.elm("[field-id=external]").elm("select").assignOption(Object.values(v.criteria),"label","code");k.template.elm("[field-id=external]").elm("select").assignOption(Object.values(v.mapping),"label","code");e.template.elm("[field-id=field]").elm("select").assignOption(Object.values(v.sort),"label","code");g.addRow();k.addRow();e.addRow();f.reset({id:B,fields:a.fields.external.parallelize});return v})(b.elm("select").val()))}):
(g.addRow(),k.addRow(),e.addRow(),f.reset({id:null,fields:{}}),h({criteria:{},mapping:{},sort:{}}))})(a.tables.criteria,a.tables.sort,a.tables.mapping,a.panel.elm("[field-id=filter]").elm(".kb-field-value"))});return b})(kb.field.activate(kb.field.create(c.fields.app),c)))).append(kb.create("h1").html(kb.constants.config.caption.criteria[kb.operator.language])).append(kb.create("section").append(a.tables.criteria).append(kb.create("p").html(kb.constants.config.caption.filter[kb.operator.language])).append(kb.field.activate(kb.field.create(c.fields.filter).css({width:"100%"}),
c))).append(kb.create("h1").html(kb.constants.config.caption.sort[kb.operator.language])).append(kb.create("section").append((b=>{b.template.elm("[field-id=order]").elm("select").elms("option").each((h,d)=>{h.html(kb.constants.config.caption.sort.order[kb.operator.language][d])});b.elm("thead").hide();return b})(a.tables.sort))).append(kb.create("h1").html(kb.constants.config.caption.mapping[kb.operator.language])).append(kb.create("section").append(a.tables.mapping).append(kb.create("h1").html(kb.constants.config.caption.copy[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.copy[kb.operator.language])).append(kb.field.activate(kb.field.create(c.fields.label).css({width:"100%"}),
c)).append(kb.field.activate(kb.field.create(c.fields.message).css({width:"100%"}),c)).append(kb.field.activate(kb.field.create(c.fields.user).css({width:"100%"}),c)).append(kb.field.activate(kb.field.create(c.fields.organization).css({width:"100%"}),c)).append(kb.field.activate(kb.field.create(c.fields.group).css({width:"100%"}),c)).append(kb.field.activate((b=>{b.elms("[type=checkbox]").each((h,d)=>{h.closest("label").elm("span").html(kb.constants.config.caption[h.val()][kb.operator.language])});
return b})(kb.field.create(c.fields.bulk).css({width:"100%"})),c)).append(kb.field.activate((b=>{b.elm("select").empty().assignOption([{code:"",label:kb.constants.config.caption.view.all[kb.operator.language]}].concat(z.list.map(h=>({code:h.id,label:h.name}))),"label","code");return b})(kb.field.create(c.fields.view)),c)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.copy.caution[kb.operator.language])))).append(kb.create("h1").html(kb.constants.config.caption.limit[kb.operator.language])).append(kb.create("section").append(kb.field.activate(kb.field.create(c.fields.limit),
c)));a.panel.elm("[field-id=app]").elm("select").rebuild().then(b=>{a.tables.criteria.clearRows();a.tables.sort.clearRows();a.tables.mapping.clearRows();a.tables.criteria.addRow();a.tables.sort.addRow();a.tables.mapping.addRow()});a.panel.elms("input,select,textarea").each((b,h)=>b.initialize())})({id:p.app.id,fields:p.app.fields.tab})},copy:(a,c)=>{var b={id:p.app.id,fields:p.app.fields.tab};l(c,b,kb.record.get(a.panel,b,!0).record)},del:a=>{}});Object.keys(n).length!=0?(a=>{a.each(c=>{var b={id:p.app.id,
fields:p.app.fields.tab},h=kb.config[m].tabbed.add();l(h,b,c.setting);h.label.html(c.label)})})(JSON.parse(n.tab)):(a=>{a.panel.elm("[field-id=app]").elm("select").rebuild().then(c=>{a.tables.criteria.clearRows();a.tables.sort.clearRows();a.tables.mapping.clearRows();a.tables.criteria.addRow();a.tables.sort.addRow();a.tables.mapping.addRow()})})(kb.config[m].tabbed.add())}catch(a){kb.alert(kb.error.parse(a))}})})})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{app:{en:"Datasource App",ja:"\u53c2\u7167\u5143\u30a2\u30d7\u30ea",zh:"\u53c2\u8003\u6e90\u5e94\u7528","zh-TW":"\u53c3\u8003\u6e90\u61c9\u7528"},bulk:{en:"Place a button on the list view page as well, so that bulk copying can be done.",ja:"\u4e00\u89a7\u753b\u9762\u306b\u3082\u30dc\u30bf\u30f3\u3092\u914d\u7f6e\u3057\u3066\u3001\u4e00\u62ec\u30b3\u30d4\u30fc\u304c\u51fa\u6765\u308b\u3088\u3046\u306b\u3059\u308b",zh:"\u5728\u5217\u8868\u89c6\u56fe\u9875\u9762\u4e0a\u4e5f\u653e\u7f6e\u4e00\u4e2a\u6309\u94ae\uff0c\u4ee5\u4fbf\u8fdb\u884c\u6279\u91cf\u590d\u5236\u3002",
"zh-TW":"\u5728\u5217\u8868\u8996\u5716\u9801\u9762\u4e0a\u4e5f\u653e\u7f6e\u4e00\u500b\u6309\u9215\uff0c\u4ee5\u4fbf\u9032\u884c\u6279\u91cf\u8907\u88fd\u3002"},container:{en:"Blank Space for Displaying Records",ja:"\u53c2\u7167\u3059\u308b\u30ec\u30b3\u30fc\u30c9\u3092\u8868\u793a\u3059\u308b\u30b9\u30da\u30fc\u30b9\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u7528\u4e8e\u663e\u793a\u8bb0\u5f55\u7684\u7a7a\u767d\u680f","zh-TW":"\u7528\u65bc\u986f\u793a\u8a18\u9304\u7684\u7a7a\u767d\u6b04"},copy:{en:"Auxiliary Settings for Copy Function",
ja:"\u30b3\u30d4\u30fc\u6a5f\u80fd\u306b\u95a2\u3059\u308b\u8ffd\u52a0\u8a2d\u5b9a",zh:"\u590d\u5236\u529f\u80fd\u7684\u8f85\u52a9\u8bbe\u7f6e","zh-TW":"\u8907\u88fd\u529f\u80fd\u7684\u8f14\u52a9\u8a2d\u7f6e"},criteria:{en:"Reference association",ja:"\u53c2\u7167\u3059\u308b\u30ec\u30b3\u30fc\u30c9\u306e\u95a2\u9023\u4ed8\u3051",zh:"\u53c2\u8003\u5173\u8054\u8bb0\u5f55","zh-TW":"\u53c3\u8003\u95dc\u806f\u8a18\u9304"},external:{en:"Datasource App",ja:"\u53c2\u7167\u5143\u30a2\u30d7\u30ea\u306e\u30d5\u30a3\u30fc\u30eb\u30c9",
zh:"\u53c2\u8003\u6e90\u5e94\u7528\u7684\u5b57\u6bb5","zh-TW":"\u53c3\u8003\u6e90\u61c9\u7528\u7684\u5b57\u6bb5"},filter:{en:"Narrow it down further",ja:"\u3055\u3089\u306b\u7d5e\u308a\u8fbc\u3080",zh:"\u8fdb\u4e00\u6b65\u7f29\u5c0f","zh-TW":"\u9032\u4e00\u6b65\u7e2e\u5c0f"},group:{en:"If you want to use the group to which the logged-in user belongs as a basis for copy permission, please specify the group that is permitted.",ja:"\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc\u304c\u6240\u5c5e\u3059\u308b\u30b0\u30eb\u30fc\u30d7\u3092\u30b3\u30d4\u30fc\u8a31\u53ef\u306e\u5224\u65ad\u3068\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u8a31\u53ef\u3059\u308b\u30b0\u30eb\u30fc\u30d7\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5982\u679c\u60a8\u60f3\u4ee5\u767b\u5f55\u7528\u6237\u6240\u5c5e\u7684\u7ec4\u4f5c\u4e3a\u590d\u5236\u6743\u9650\u7684\u5224\u65ad\u4f9d\u636e\uff0c\u8bf7\u6307\u5b9a\u5141\u8bb8\u7684\u7ec4\u3002","zh-TW":"\u5982\u679c\u60a8\u60f3\u4ee5\u767b\u5165\u7528\u6236\u6240\u5c6c\u7684\u7fa4\u7d44\u4f5c\u70ba\u8907\u88fd\u6b0a\u9650\u7684\u5224\u65b7\u4f9d\u64da\uff0c\u8acb\u6307\u5b9a\u5141\u8a31\u7684\u7fa4\u7d44\u3002"},internal:{en:"This App",ja:"\u3053\u306e\u30a2\u30d7\u30ea\u306e\u30d5\u30a3\u30fc\u30eb\u30c9",
zh:"\u6b64\u5e94\u7528\u7684\u5b57\u6bb5","zh-TW":"\u6b64\u61c9\u7528\u7684\u5b57\u6bb5"},label:{en:"Copy Button Label",ja:"\u30b3\u30d4\u30fc\u30dc\u30bf\u30f3\u306e\u30e9\u30d9\u30eb\u30c6\u30ad\u30b9\u30c8",zh:"\u590d\u5236\u6309\u94ae\u6807\u7b7e\u6587\u672c","zh-TW":"\u8907\u88fd\u6309\u9215\u6a19\u7c64\u6587\u672c"},limit:{en:"Max Records to Display at a Time",ja:"\u4e00\u5ea6\u306b\u8868\u793a\u3059\u308b\u6700\u5927\u30ec\u30b3\u30fc\u30c9\u6570",zh:"\u4e00\u6b21\u6700\u591a\u663e\u793a\u8bb0\u5f55\u6570",
"zh-TW":"\u4e00\u6b21\u6700\u591a\u986f\u793a\u8a18\u9304\u6578"},mapping:{en:"Display Field and Destination Field for Copying",ja:"\u8868\u793a\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u3068\u30b3\u30d4\u30fc\u5148\u30d5\u30a3\u30fc\u30eb\u30c9",zh:"\u663e\u793a\u5b57\u6bb5\u548c\u590d\u5236\u76ee\u6807\u5b57\u6bb5","zh-TW":"\u986f\u793a\u5b57\u6bb5\u548c\u8907\u88fd\u76ee\u6a19\u5b57\u6bb5"},message:{en:"Confirmation Message Before Starting Copy",ja:"\u30b3\u30d4\u30fc\u958b\u59cb\u524d\u306e\u78ba\u8a8d\u30e1\u30c3\u30bb\u30fc\u30b8",
zh:"\u590d\u5236\u5f00\u59cb\u524d\u7684\u786e\u8ba4\u4fe1\u606f","zh-TW":"\u8907\u88fd\u958b\u59cb\u524d\u7684\u78ba\u8a8d\u4fe1\u606f"},organization:{en:"If you want to use the organization to which the logged-in user belongs as a basis for copy permission, please specify the organization that is permitted.",ja:"\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc\u304c\u6240\u5c5e\u3059\u308b\u7d44\u7e54\u3092\u30b3\u30d4\u30fc\u8a31\u53ef\u306e\u5224\u65ad\u3068\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u8a31\u53ef\u3059\u308b\u7d44\u7e54\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5982\u679c\u60a8\u60f3\u4ee5\u767b\u5f55\u7528\u6237\u6240\u5c5e\u7684\u7ec4\u7ec7\u4f5c\u4e3a\u590d\u5236\u6743\u9650\u7684\u5224\u65ad\u4f9d\u636e\uff0c\u8bf7\u6307\u5b9a\u5141\u8bb8\u7684\u7ec4\u7ec7\u3002","zh-TW":"\u5982\u679c\u60a8\u60f3\u4ee5\u767b\u5165\u7528\u6236\u6240\u5c6c\u7684\u7d44\u7e54\u4f5c\u70ba\u8907\u88fd\u6b0a\u9650\u7684\u5224\u65b7\u4f9d\u64da\uff0c\u8acb\u6307\u5b9a\u5141\u8a31\u7684\u7d44\u7e54\u3002"},sort:{en:"Order of Records Displayed",ja:"\u8868\u793a\u3059\u308b\u30ec\u30b3\u30fc\u30c9\u306e\u4e26\u3073\u9806",
zh:"\u663e\u793a\u8bb0\u5f55\u7684\u987a\u5e8f","zh-TW":"\u986f\u793a\u8a18\u9304\u7684\u9806\u5e8f",order:{ja:["\u6607\u9806","\u964d\u9806"],en:["ASC","DESC"],zh:["\u5347\u5e8f","\u964d\u5e8f"],"zh-TW":["\u5347\u5e8f","\u964d\u5e8f"]}},user:{en:"If you want to use the logged-in user as a basis for copy permission, please specify the user that is permitted.",ja:"\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc\u3092\u30b3\u30d4\u30fc\u8a31\u53ef\u306e\u5224\u65ad\u3068\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u8a31\u53ef\u3059\u308b\u30e6\u30fc\u30b6\u30fc\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5982\u679c\u60a8\u60f3\u4ee5\u767b\u5f55\u7528\u6237\u672c\u8eab\u4f5c\u4e3a\u590d\u5236\u6743\u9650\u7684\u5224\u65ad\u4f9d\u636e\uff0c\u8bf7\u6307\u5b9a\u5141\u8bb8\u7684\u7528\u6237\u3002","zh-TW":"\u5982\u679c\u60a8\u60f3\u4ee5\u767b\u5165\u7528\u6236\u672c\u8eab\u4f5c\u70ba\u8907\u88fd\u6b0a\u9650\u7684\u5224\u65b7\u4f9d\u64da\uff0c\u8acb\u6307\u5b9a\u5141\u8a31\u7684\u7528\u6236\u3002"},view:{en:"Executable List View",ja:"\u5b9f\u884c\u53ef\u80fd\u306a\u4e00\u89a7\u753b\u9762",zh:"\u53ef\u6267\u884c\u7684\u5217\u8868\u5c4f\u5e55",
"zh-TW":"\u53ef\u57f7\u884c\u7684\u5217\u8868\u756b\u9762",all:{en:"No restrictions",ja:"\u5236\u9650\u3057\u306a\u3044",zh:"\u4e0d\u9650\u5236","zh-TW":"\u4e0d\u9650\u5236"}}},description:{container:{en:"Blank Spaces without an Element ID are not eligible.",ja:"\u8981\u7d20ID\u304c\u672a\u5165\u529b\u306e\u30b9\u30da\u30fc\u30b9\u30d5\u30a3\u30fc\u30eb\u30c9\u306f\u5bfe\u8c61\u5916\u3067\u3059\u3002",zh:"\u672a\u8f93\u5165\u5143\u7d20ID\u7684\u7a7a\u767d\u680f\u4e0d\u9002\u7528\u3002","zh-TW":"\u672a\u8f38\u5165\u5143\u7d20ID\u7684\u7a7a\u767d\u6b04\u4e0d\u9069\u7528\u3002"},
copy:{en:"When copying a referenced record to a table within the app, specify the destination field (This App) and also make the following settings.",ja:"\u53c2\u7167\u3057\u305f\u30ec\u30b3\u30fc\u30c9\u3092\u30a2\u30d7\u30ea\u5185\u306e\u30c6\u30fc\u30d6\u30eb\u306b\u30b3\u30d4\u30fc\u3059\u308b\u5834\u5408\u306f\u3001\u30b3\u30d4\u30fc\u5148\u30d5\u30a3\u30fc\u30eb\u30c9\uff08\u3053\u306e\u30a2\u30d7\u30ea\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\uff09\u3092\u6307\u5b9a\u3057\u305f\u4e0a\u3067\u3001\u4ee5\u4e0b\u306e\u8a2d\u5b9a\u3082\u884c\u3063\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5728\u5c06\u5f15\u7528\u7684\u8bb0\u5f55\u590d\u5236\u5230\u5e94\u7528\u5185\u7684\u8868\u4e2d\u65f6\uff0c\u8bf7\u6307\u5b9a\u76ee\u6807\u5b57\u6bb5\uff08\u6b64\u5e94\u7528\u7684\u5b57\u6bb5\uff09\uff0c\u5e76\u8fdb\u884c\u4ee5\u4e0b\u8bbe\u7f6e\u3002","zh-TW":"\u5c07\u53c3\u8003\u7684\u8a18\u9304\u8907\u88fd\u5230\u61c9\u7528\u5167\u7684\u8868\u683c\u6642\uff0c\u8acb\u6307\u5b9a\u76ee\u6a19\u5b57\u6bb5\uff08\u6b64\u61c9\u7528\u7684\u5b57\u6bb5\uff09\uff0c\u4e26\u9032\u884c\u4ee5\u4e0b\u8a2d\u7f6e\u3002",
caution:{en:"This copy function is for overwriting the destination table, and is not for adding rows while keeping the existing ones.",ja:"\u3053\u3061\u3089\u306e\u30b3\u30d4\u30fc\u6a5f\u80fd\u306f\u3001\u30b3\u30d4\u30fc\u5148\u3068\u306a\u308b\u30c6\u30fc\u30d6\u30eb\u3092\u4e0a\u66f8\u304d\u30b3\u30d4\u30fc\u3059\u308b\u3082\u306e\u3067\u3042\u308a\u3001\u65e2\u5b58\u306e\u884c\u3092\u6b8b\u3057\u3066\u884c\u306e\u8ffd\u52a0\u3092\u3059\u308b\u3082\u306e\u3067\u306f\u3054\u3056\u3044\u307e\u305b\u3093\u3002",
zh:"\u6b64\u590d\u5236\u529f\u80fd\u7528\u4e8e\u8986\u76d6\u76ee\u6807\u8868\u683c\uff0c\u5e76\u975e\u5728\u4fdd\u7559\u73b0\u6709\u884c\u7684\u540c\u65f6\u6dfb\u52a0\u884c\u3002","zh-TW":"\u6b64\u8907\u88fd\u529f\u80fd\u7528\u65bc\u8986\u84cb\u76ee\u6a19\u8868\u683c\uff0c\u800c\u975e\u5728\u4fdd\u7559\u73fe\u6709\u884c\u7684\u540c\u6642\u6dfb\u52a0\u884c\u3002"}}},message:{invalid:{criteria:{en:"Please specify the Reference association.",ja:"\u53c2\u7167\u3059\u308b\u30ec\u30b3\u30fc\u30c9\u306e\u95a2\u9023\u4ed8\u3051\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u8bf7\u6307\u5b9a\u53c2\u8003\u5173\u8054\u8bb0\u5f55\u3002","zh-TW":"\u8acb\u6307\u5b9a\u53c3\u8003\u95dc\u806f\u8a18\u9304\u3002"},duplicate:{en:"The same Blank Space cannot be specified in different tabs.",ja:"\u7570\u306a\u308b\u30bf\u30d6\u3067\u540c\u3058\u30b9\u30da\u30fc\u30b9\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3059\u308b\u3053\u3068\u306f\u51fa\u6765\u307e\u305b\u3093\u3002",zh:"\u4e0d\u80fd\u5728\u4e0d\u540c\u7684\u6807\u7b7e\u9875\u4e2d\u6307\u5b9a\u76f8\u540c\u7684\u7a7a\u767d\u680f\u3002",
"zh-TW":"\u4e0d\u80fd\u5728\u4e0d\u540c\u7684\u6a19\u7c64\u9801\u4e2d\u6307\u5b9a\u76f8\u540c\u7684\u7a7a\u767d\u6b04\u3002"},label:{en:"If a destination field is specified, enter the label text for its copy button.",ja:"\u30b3\u30d4\u30fc\u5148\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u305f\u5834\u5408\u306f\u3001\u305d\u306e\u30b3\u30d4\u30fc\u30dc\u30bf\u30f3\u306e\u30e9\u30d9\u30eb\u30c6\u30ad\u30b9\u30c8\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u6307\u5b9a\u4e86\u76ee\u6807\u5b57\u6bb5\uff0c\u8bf7\u8f93\u5165\u5176\u590d\u5236\u6309\u94ae\u7684\u6807\u7b7e\u6587\u672c\u3002",
"zh-TW":"\u5982\u679c\u6307\u5b9a\u4e86\u76ee\u6a19\u5b57\u6bb5\uff0c\u8acb\u8f38\u5165\u5176\u8907\u88fd\u6309\u9215\u7684\u6a19\u7c64\u6587\u672c\u3002"},limit:{en:"The number of records to display must be entered within the range of 1 to 500.",ja:"\u8868\u793a\u3059\u308b\u30ec\u30b3\u30fc\u30c9\u6570\u306f1\u304b\u3089500\u306e\u7bc4\u56f2\u5185\u3067\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u663e\u793a\u7684\u8bb0\u5f55\u6570\u5fc5\u987b\u57281\u5230500\u7684\u8303\u56f4\u5185\u8f93\u5165\u3002",
"zh-TW":"\u986f\u793a\u7684\u8a18\u9304\u6578\u5fc5\u9808\u57281\u5230500\u7684\u7bc4\u570d\u5167\u8f38\u5165\u3002"},mapping:{en:"Please specify the field to display.",ja:"\u8868\u793a\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u8981\u663e\u793a\u7684\u5b57\u6bb5\u3002","zh-TW":"\u8acb\u6307\u5b9a\u8981\u986f\u793a\u7684\u5b57\u6bb5\u3002"},message:{en:"If a destination field is specified, enter the confirmation message before starting the copy.",
ja:"\u30b3\u30d4\u30fc\u5148\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3057\u305f\u5834\u5408\u306f\u3001\u305d\u306e\u30b3\u30d4\u30fc\u958b\u59cb\u524d\u306e\u78ba\u8a8d\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u5982\u679c\u6307\u5b9a\u4e86\u76ee\u6807\u5b57\u6bb5\uff0c\u8bf7\u8f93\u5165\u5f00\u59cb\u590d\u5236\u524d\u7684\u786e\u8ba4\u6d88\u606f\u3002","zh-TW":"\u5982\u679c\u6307\u5b9a\u4e86\u76ee\u6a19\u5b57\u6bb5\uff0c\u8acb\u8f38\u5165\u958b\u59cb\u8907\u88fd\u524d\u7684\u78ba\u8a8d\u6d88\u606f\u3002"},
multiple:{en:"You cannot specify a field from a different table for the field to be displayed.",ja:"\u8868\u793a\u3059\u308b\u30d5\u30a3\u30fc\u30eb\u30c9\u306b\u7570\u306a\u308b\u30c6\u30fc\u30d6\u30eb\u5185\u306e\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u6307\u5b9a\u3059\u308b\u3053\u3068\u306f\u51fa\u6765\u307e\u305b\u3093\u3002",zh:"\u4e0d\u80fd\u4e3a\u8981\u663e\u793a\u7684\u5b57\u6bb5\u6307\u5b9a\u4e0d\u540c\u8868\u4e2d\u7684\u5b57\u6bb5\u3002","zh-TW":"\u4e0d\u80fd\u70ba\u8981\u986f\u793a\u7684\u5b57\u6bb5\u6307\u5b9a\u4e0d\u540c\u8868\u4e2d\u7684\u5b57\u6bb5\u3002"}}}}},
kb.constants);