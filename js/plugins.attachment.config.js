/*
* FileName "plugins.attachment.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(h){var g={};kb.field.load(kintone.app.getId()).then(function(k){kb.config[h].build({submit:function(e,d){try{var b=!1;d.tab=[];d.flat={};(function(a){a=kb.record.get(e.main.elm(".kb-flat"),a);a.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),b=!0):(a.record.placeholders.value=0==a.record.usePlaceholder.value.length?[]:a.record.placeholders.value.filter(function(c){return c.value.field.value}),0==a.record.useAttachmentViewer.value.length&&(a.record.onlyView.value=
[]),d.flat=a.record)})({id:g.app.id,fields:g.app.fields.flat});d.tab=JSON.stringify(d.tab);d.flat=JSON.stringify(d.flat);return b?!1:d}catch(a){return kb.alert(kb.error.parse(a)),!1}}},function(e,d){try{g.app={id:h,fields:{tab:{},flat:{useLookupNavi:{code:"useLookupNavi",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"use"}]},usePlaceholder:{code:"usePlaceholder",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"use"}]},placeholders:{code:"placeholders",
type:"SUBTABLE",label:"",noLabel:!0,fields:{field:{code:"field",type:"DROP_DOWN",label:kb.constants.config.caption.placeholder.field[kb.operator.language],required:!1,noLabel:!1,options:[]},text:{code:"text",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.placeholder.text[kb.operator.language],required:!1,noLabel:!1,placeholder:""}}},useSearchBox:{code:"useSearchBox",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"use"}]},useAttachmentViewer:{code:"useAttachmentViewer",
type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"use"}]},onlyView:{code:"onlyView",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"onlyView"}]},useAlignTableButtons:{code:"useAlignTableButtons",type:"CHECK_BOX",label:"",required:!1,noLabel:!0,options:[{index:0,label:"use"}]}}}},function(b){e.main.append(kb.create("div").addClass("kb-flat kb-scope").attr("form-id","form_"+b.id).append(kb.create("h1").html(kb.constants.config.caption.lookupNavi[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.lookupNavi[kb.operator.language])).append(kb.field.activate(function(a){a.elms("[type=checkbox]").each(function(c,
f){c.closest("label").elm("span").html(kb.constants.config.caption.lookupNavi[c.val()][kb.operator.language])});return a}(kb.field.create(b.fields.useLookupNavi)),b))).append(kb.create("h1").html(kb.constants.config.caption.placeholder[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.placeholder[kb.operator.language])).append(kb.field.activate(function(a){a.elms("[type=checkbox]").each(function(c,f){c.closest("label").elm("span").html(kb.constants.config.caption.placeholder[c.val()][kb.operator.language])});
return a}(kb.field.create(b.fields.usePlaceholder)),b)).append(function(a){a.addClass("kb-hidden").template.elm("[field-id=field]").elm("select").empty().assignOption(kb.config[h].ui.options.fields(k,function(c,f){switch(f.type){case "LINK":case "MULTI_LINE_TEXT":case "NUMBER":case "SINGLE_LINE_TEXT":k.disables.includes(f.code)||c.push({code:f.code,label:f.label})}return c}),"label","code");return a}(kb.table.activate(kb.table.create(b.fields.placeholders),b)))).append(kb.create("h1").html(kb.constants.config.caption.searchBox[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.searchBox[kb.operator.language])).append(kb.field.activate(function(a){a.elms("[type=checkbox]").each(function(c,
f){c.closest("label").elm("span").html(kb.constants.config.caption.searchBox[c.val()][kb.operator.language])});return a}(kb.field.create(b.fields.useSearchBox)),b))).append(kb.create("h1").html(kb.constants.config.caption.attachmentViewer[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.attachmentViewer[kb.operator.language])).append(kb.field.activate(function(a){a.elms("[type=checkbox]").each(function(c,f){c.closest("label").elm("span").html(kb.constants.config.caption.attachmentViewer[c.val()][kb.operator.language])});
return a}(kb.field.create(b.fields.useAttachmentViewer)),b)).append(kb.create("p").html(kb.constants.config.description.attachmentViewer.onlyView[kb.operator.language])).append(kb.field.activate(function(a){a.elms("[type=checkbox]").each(function(c,f){c.closest("label").elm("span").html(kb.constants.config.caption.attachmentViewer[c.val()][kb.operator.language])});return a}(kb.field.create(b.fields.onlyView)),b))).append(kb.create("h1").html(kb.constants.config.caption.alignTableButtons[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.description.alignTableButtons[kb.operator.language])).append(kb.field.activate(function(a){a.elms("[type=checkbox]").each(function(c,
f){c.closest("label").elm("span").html(kb.constants.config.caption.alignTableButtons[c.val()][kb.operator.language])});return a}(kb.field.create(b.fields.useAlignTableButtons)),b))));kb.event.on("kb.change.usePlaceholder",function(a){a.record.usePlaceholder.value.includes("use")?e.main.elm("[field-id=placeholders]").removeClass("kb-hidden"):e.main.elm("[field-id=placeholders]").addClass("kb-hidden");return a});e.main.elms("input,select,textarea").each(function(a,c){return a.initialize()})}({id:g.app.id,
fields:g.app.fields.flat}),0!=Object.keys(d).length?function(b){(function(a){kb.record.set(e.main.elm(".kb-flat"),a,b).then(function(){b.usePlaceholder.value.includes("use")?e.main.elm("[field-id=placeholders]").removeClass("kb-hidden"):e.main.elm("[field-id=placeholders]").addClass("kb-hidden")})})({id:g.app.id,fields:g.app.fields.flat})}(JSON.parse(d.flat)):e.main.elm(".kb-flat").elm("[field-id=placeholders]").addRow()}catch(b){kb.alert(kb.error.parse(b))}})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{alignTableButtons:{en:"Align Table Operation Buttons to the Left",ja:"\u30c6\u30fc\u30d6\u30eb\u64cd\u4f5c\u30dc\u30bf\u30f3\u3092\u5de6\u5bc4\u305b\u306b\u3059\u308b",zh:"\u5c06\u8868\u64cd\u4f5c\u6309\u94ae\u5de6\u5bf9\u9f50",use:{en:"Align to the Left",ja:"\u5de6\u5bc4\u305b\u306b\u3059\u308b",zh:"\u5411\u5de6\u5bf9\u9f50"}},attachmentViewer:{en:"View attachments with a dedicated viewer without downloading them",ja:"\u6dfb\u4ed8\u30d5\u30a1\u30a4\u30eb\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u305b\u305a\u306b\u5c02\u7528\u30d3\u30e5\u30fc\u30ef\u30fc\u3067\u95b2\u89a7\u3059\u308b",
zh:"\u5728\u4e13\u7528\u67e5\u770b\u5668\u4e2d\u67e5\u770b\u9644\u4ef6\uff0c\u65e0\u9700\u4e0b\u8f7d",onlyView:{en:"Prohibit downloading",ja:"\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3092\u7981\u6b62\u3059\u308b",zh:"\u7981\u6b62\u4e0b\u8f7d"},use:{en:"View in a dedicated viewer",ja:"\u5c02\u7528\u30d3\u30e5\u30fc\u30ef\u30fc\u3067\u95b2\u89a7\u3059\u308b",zh:"\u5728\u4e13\u7528\u67e5\u770b\u5668\u4e2d\u67e5\u770b"}},lookupNavi:{en:"Display a link button to the source app in the lookup field",ja:"\u30eb\u30c3\u30af\u30a2\u30c3\u30d7\u30d5\u30a3\u30fc\u30eb\u30c9\u306b\u53c2\u7167\u5143\u30a2\u30d7\u30ea\u3078\u306e\u30ea\u30f3\u30af\u30dc\u30bf\u30f3\u3092\u8868\u793a",
zh:"\u5728\u67e5\u627e\u5b57\u6bb5\u4e2d\u663e\u793a\u6307\u5411\u6765\u6e90\u5e94\u7528\u7684\u94fe\u63a5\u6309\u94ae",use:{en:"Display the link button",ja:"\u30ea\u30f3\u30af\u30dc\u30bf\u30f3\u3092\u8868\u793a\u3059\u308b",zh:"\u663e\u793a\u94fe\u63a5\u6309\u94ae"}},placeholder:{en:"Display Hint in Input Field",ja:"\u5165\u529b\u30d5\u30a3\u30fc\u30eb\u30c9\u306b\u30d2\u30f3\u30c8\u3092\u8868\u793a",zh:"\u5728\u8f93\u5165\u5b57\u6bb5\u4e2d\u663e\u793a\u63d0\u793a",field:{en:"Field",ja:"\u30d5\u30a3\u30fc\u30eb\u30c9",
zh:"\u5b57\u6bb5"},text:{en:"Content to Display",ja:"\u8868\u793a\u5185\u5bb9",zh:"\u663e\u793a\u7684\u5185\u5bb9"},use:{en:"Display Hint",ja:"\u5165\u529b\u30d2\u30f3\u30c8\u3092\u8868\u793a\u3059\u308b",zh:"\u663e\u793a\u63d0\u793a"}},searchBox:{en:"Use the Search Box for Additional Record Filtering",ja:"\u30ec\u30b3\u30fc\u30c9\u306e\u8ffd\u52a0\u7d5e\u308a\u8fbc\u307f\u3067\u691c\u7d22\u7a93\u3092\u4f7f\u3046",zh:"\u4f7f\u7528\u641c\u7d22\u7a97\u53e3\u8fdb\u884c\u8bb0\u5f55\u7684\u989d\u5916\u7b5b\u9009",
use:{en:"Use the Search Box",ja:"\u691c\u7d22\u7a93\u3092\u4f7f\u3046",zh:"\u4f7f\u7528\u641c\u7d22\u6846"}}},description:{alignTableButtons:{en:"Check the to align the table operation buttons to the left in the add or edit record screen.",ja:"\u30ec\u30b3\u30fc\u30c9\u306e\u8ffd\u52a0\u307e\u305f\u306f\u7de8\u96c6\u753b\u9762\u306b\u304a\u3044\u3066\u3001\u30c6\u30fc\u30d6\u30eb\u64cd\u4f5c\u30dc\u30bf\u30f3\u3092\u5de6\u5bc4\u305b\u306b\u3059\u308b\u5834\u5408\u306f\u30c1\u30a7\u30c3\u30af\u3092\u4ed8\u3051\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5728\u6dfb\u52a0\u6216\u7f16\u8f91\u8bb0\u5f55\u754c\u9762\u4e2d\uff0c\u82e5\u8981\u5c06\u8868\u64cd\u4f5c\u6309\u94ae\u5de6\u5bf9\u9f50\uff0c\u8bf7\u52fe\u9009\u6b64\u6846\u3002"},attachmentViewer:{en:"Check this to view the attached file in a dedicated viewer without downloading it on the record detail page.",ja:"\u30ec\u30b3\u30fc\u30c9\u306e\u8a73\u7d30\u753b\u9762\u306b\u304a\u3044\u3066\u3001\u6dfb\u4ed8\u30d5\u30a1\u30a4\u30eb\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u305b\u305a\u306b\u5c02\u7528\u30d3\u30e5\u30fc\u30ef\u30fc\u3067\u95b2\u89a7\u3059\u308b\u5834\u5408\u306f\u30c1\u30a7\u30c3\u30af\u3092\u4ed8\u3051\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5982\u679c\u60a8\u5e0c\u671b\u5728\u8bb0\u5f55\u8be6\u7ec6\u9875\u9762\u4e2d\u4f7f\u7528\u4e13\u7528\u67e5\u770b\u5668\u67e5\u770b\u9644\u4ef6\u6587\u4ef6\u800c\u4e0d\u4e0b\u8f7d\uff0c\u8bf7\u52fe\u9009\u6b64\u9879\u3002",onlyView:{en:"Check this to prohibit downloading from the attachment viewer.",ja:"\u6dfb\u4ed8\u30d5\u30a1\u30a4\u30eb\u30d3\u30e5\u30fc\u30ef\u30fc\u304b\u3089\u306e\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3092\u7981\u6b62\u3057\u305f\u3044\u5834\u5408\u306f\u30c1\u30a7\u30c3\u30af\u3092\u4ed8\u3051\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u82e5\u8981\u7981\u6b62\u5f9e\u9644\u4ef6\u67e5\u770b\u5668\u4e2d\u4e0b\u8f09\uff0c\u8acb\u52fe\u9078\u6b64\u9805\u3002"}},lookupNavi:{en:"Check this to display a link button to the source app in the lookup field on the add or edit record page.",ja:"\u30ec\u30b3\u30fc\u30c9\u306e\u8ffd\u52a0\u307e\u305f\u306f\u7de8\u96c6\u753b\u9762\u306b\u304a\u3044\u3066\u3001\u30eb\u30c3\u30af\u30a2\u30c3\u30d7\u30d5\u30a3\u30fc\u30eb\u30c9\u306b\u53c2\u7167\u5143\u30a2\u30d7\u30ea\u3078\u306e\u30ea\u30f3\u30af\u30dc\u30bf\u30f3\u3092\u8868\u793a\u3059\u308b\u5834\u5408\u306f\u30c1\u30a7\u30c3\u30af\u3092\u4ed8\u3051\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5728\u6dfb\u52a0\u6216\u7f16\u8f91\u8bb0\u5f55\u9875\u9762\u7684\u67e5\u627e\u5b57\u6bb5\u4e2d\u663e\u793a\u6307\u5411\u6765\u6e90\u5e94\u7528\u7684\u94fe\u63a5\u6309\u94ae\uff0c\u8bf7\u52fe\u9009\u6b64\u9879\u3002"},placeholder:{en:"Check this to display hints in input fields on the add or edit record page.",ja:"\u30ec\u30b3\u30fc\u30c9\u306e\u8ffd\u52a0\u307e\u305f\u306f\u7de8\u96c6\u753b\u9762\u306b\u304a\u3044\u3066\u3001\u5165\u529b\u30d5\u30a3\u30fc\u30eb\u30c9\u306b\u30d2\u30f3\u30c8\u3092\u8868\u793a\u3059\u308b\u5834\u5408\u306f\u30c1\u30a7\u30c3\u30af\u3092\u4ed8\u3051\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5728\u6dfb\u52a0\u6216\u7f16\u8f91\u8bb0\u5f55\u9875\u9762\u7684\u8f93\u5165\u5b57\u6bb5\u4e2d\u663e\u793a\u63d0\u793a\uff0c\u8bf7\u52fe\u9009\u6b64\u9879\u3002"},searchBox:{en:"Check this to perform additional filtering of the records displayed in the list using the search box on the tabular list page.",ja:"\u8868\u5f62\u5f0f\u306e\u4e00\u89a7\u753b\u9762\u306b\u304a\u3044\u3066\u3001\u691c\u7d22\u7a93\u3092\u4f7f\u3063\u3066\u4e00\u89a7\u306b\u8868\u793a\u3057\u3066\u3044\u308b\u30ec\u30b3\u30fc\u30c9\u306e\u8ffd\u52a0\u7d5e\u308a\u8fbc\u307f\u3092\u884c\u3046\u5834\u5408\u306f\u30c1\u30a7\u30c3\u30af\u3092\u4ed8\u3051\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5982\u679c\u60a8\u5e0c\u671b\u5728\u8868\u683c\u5f62\u5f0f\u7684\u5217\u8868\u9875\u9762\u4e0a\u4f7f\u7528\u641c\u7d22\u6846\u5bf9\u663e\u793a\u5728\u5217\u8868\u4e2d\u7684\u8bb0\u5f55\u8fdb\u884c\u989d\u5916\u7684\u7b5b\u9009\uff0c\u8bf7\u52fe\u9009\u6b64\u9879\u3002"}}}},kb.constants);