/*
* FileName "main.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';window.KintoneBoosterInjector=class{constructor(){this.fields={}}build(m,n){try{window.kb.attachment=new KintoneBoosterAttachment,window.kb.field=new KintoneBoosterField,window.kb.filter=new KintoneBoosterFilter,window.kb.formula=new KintoneBoosterFormula,window.kb.record=new KintoneBoosterRecord,window.kb.table=new KintoneBoosterTable,kb.field.load(m).then(k=>{this.app={id:m,fields:k.origin};this.queries=(a=>{var b={id:"",fields:{},pattern:"",sender:""};"id"in a&&(b.id=kb.isNumeric(a.id)?
a.id:"");"pattern"in a&&(b.pattern=a.pattern);"pre"in a&&(b.fields=JSON.parse((new TextDecoder).decode(Uint8Array.from(atob(decodeURIComponent(a.pre)).split("").map(d=>d.charCodeAt(0))))));"sender"in a&&(b.sender=decodeURIComponent(a.sender));return b})(kb.queries());this.setting=kb.extend({ui:{}},n);kb.elm("body").append((a=>{this.setting.ui.container=a;this.queries.pattern=="detail"&&this.setting.ui.container.addClass("kb-uneditable");return a})(kb.create("div").addClass("kb-injector")).append(kb.create("div").addClass("kb-injector-main").append((a=>
this.setting.ui.header=a)(kb.create("header").addClass("kb-injector-header")).append(kb.create("div").addClass("kb-injector-header-title").html(this.setting.title)).append(kb.create("div").addClass("kb-injector-header-description").html(this.setting.description?this.setting.description.replace(/\n/g,"<br>"):"")).append(kb.create("div").addClass("kb-injector-header-space"))).append((a=>this.setting.ui.body=a)(kb.create("main").addClass("kb-injector-body"))).append((a=>{this.setting.ui.footer=a;this.setting.ui.buttons=
{ok:kb.create("button").addClass("kb-injector-button").html(kb.constants.injector.caption.button.submit[kb.operator.language])};return a.append(this.setting.ui.buttons.ok)})(kb.create("footer").addClass("kb-injector-footer")))));((a,b,d)=>{this.setting.fields.each((c,g)=>{c.code in this.app.fields&&((e,f)=>{switch(f.type){case "SUBTABLE":if("alter"in e){e.alter.label&&(f.label=e.alter.label.replace(/\n/g,"<br>"));for(var h in e.alter.fields)h in f.fields&&e.alter.fields[h].label&&(f.fields[h].label=
e.alter.fields[h].label.replace(/\n/g,"<br>"))}f.noLabel||a.append(kb.create("div").append(kb.create("span").addClass("kb-table-caption").html(f.label)));a.append(kb.table.activate(kb.table.create(f,!0,!1,!0,!0),this.app));break;default:"alter"in e&&e.alter.label&&(f.label=e.alter.label.replace(/\n/g,"<br>")),f.lookup&&Array.prototype.push.apply(d,f.lookup.fieldMappings.map(l=>l.field)),a.append(kb.field.activate(kb.field.create(f,!0),this.app))}})(c,this.app.fields[c.code])});b.each((c,g)=>{c.code in
this.app.fields&&(e=>{switch(e.type){case "SUBTABLE":a.append(kb.table.activate(kb.table.create(e),this.app).addClass("kb-unuse"));break;default:a.append(kb.field.activate(kb.field.create(e),this.app).addClass("kb-unuse"))}})(this.app.fields[c.code])});d.each((c,g)=>{a.elm('[field-id="'+CSS.escape(c)+'"]')&&a.elm('[field-id="'+CSS.escape(c)+'"]').addClass("kb-readonly")});a.addClass("kb-scope").attr("form-id","form_"+this.app.id).append(kb.create("input").attr("type","hidden").attr("data-type","id")).elms("input,select,textarea").each((c,
g)=>c.initialize())})(this.setting.ui.body,Object.values(this.app.fields).reduce((a,b)=>{this.setting.fields.some(d=>d.code==b.code)||a.push(b);return a},[]),[]);this.setting.ui.buttons.ok.on("click",a=>{a=kb.record.get(this.setting.ui.body,this.app);a.error||kb.event.call("kb.submit.call",{record:a.record,pattern:this.queries.id?"edit":"create"}).then(b=>{b.error?(kb.record.set(this.setting.ui.body,this.app,b.record),callback(!0)):(kb.loadStart(),kb.event.call(this.queries.id?"kb.edit.submit":"kb.create.submit",
{container:this.setting.ui.body,record:b.record}).then(d=>{d.error||kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],()=>{kb.loadStart();kb.record.api.set(this.app.id,{post:this.queries.id?[]:[d.record],put:this.queries.id?[{id:this.queries.id,record:d.record}]:[]},!0,!0).then(c=>{c&&(this.queries.id=c);kb.api(kb.api.url("/api/record"),"GET",{app:this.app.id,id:this.queries.id}).then(g=>{kb.event.call(this.queries.id?"kb.edit.submit.success":"kb.create.submit.success",{container:d.container,
record:g.record}).then(e=>{e.error||kb.event.call("kb.upsert.call",{record:g.record,pattern:this.queries.id?"edit":"create"}).then(f=>{f.error?(kb.record.set(this.setting.ui.body,this.app,f.record),callback(!0)):kb.event.call("kb.mail.call",{record:g.record,pattern:this.queries.id?"edit":"create"}).then(h=>{h.error||kb.event.call("kb.omail.call",{record:g.record,pattern:this.queries.id?"edit":"create"}).then(l=>{l.error||(this.setting.ui.body.removeAttr("unsaved"),kb.alert("Done!",()=>{this.queries.sender?
window.parent.postMessage("Done",this.queries.sender):window.location.reload(!0)}))}).catch(()=>{})}).catch(()=>{})}).catch(()=>{})})}).catch(g=>kb.alert(kb.error.parse(g)))}).catch(c=>kb.alert(kb.error.parse(c)))})}))}).catch(()=>{})});window.on("beforeunload",a=>{this.setting.ui.body.hasAttribute("unsaved")&&(a.returnValue=kb.constants.injector.message.confirm.changed[kb.operator.language])});this.queries.id?kb.api(kb.api.url("/api/record"),"GET",{app:this.app.id,id:this.queries.id}).then(a=>{kb.event.call("kb.edit.load",
{container:this.setting.ui.body,record:a.record}).then(b=>{b.error||kb.event.call("kb.action.call",{container:this.setting.ui.body,record:b.record,pattern:"edit"}).then(d=>{kb.event.call("kb.style.call",{container:this.setting.ui.body,record:d.record,pattern:"edit"}).then(c=>{kb.record.set(this.setting.ui.body.removeAttr("unsaved"),this.app,c.record).then(()=>{kb.event.call("kb.edit.load.complete",{container:this.setting.ui.body});this.setting.ui.body.elm("input,select,textarea").focus()})}).catch(()=>
{})}).catch(()=>{})})}).catch(a=>kb.alert(kb.error.parse(a))):kb.event.call("kb.create.load",{container:this.setting.ui.body,record:(()=>{kb.record.clear(this.setting.ui.body,this.app);var a=kb.record.get(this.setting.ui.body,this.app,!0).record;for(var b in this.queries.fields)a[b]=this.queries.fields[b];return a})()}).then(a=>{a.error||kb.event.call("kb.action.call",{container:this.setting.ui.body,record:a.record,pattern:"create"}).then(b=>{kb.event.call("kb.style.call",{container:this.setting.ui.body,
record:b.record,pattern:"create"}).then(d=>{kb.record.set(this.setting.ui.body.removeAttr("unsaved"),this.app,d.record).then(()=>{kb.event.call("kb.create.load.complete",{container:this.setting.ui.body});this.setting.ui.body.elm("input,select,textarea").focus()})}).catch(()=>{})}).catch(()=>{})})})}catch(k){kb.alert(kb.error.parse(k))}}};window.kb.injector||(window.kb.injector=new KintoneBoosterInjector);
kb.constants=kb.extend({injector:{caption:{button:{submit:{en:"Submit",ja:"\u9001\u4fe1",zh:"\u63d0\u4ea4","zh-TW":"\u63d0\u4ea4"}}},description:{},message:{confirm:{changed:{en:"Your changes have not been saved.<br>Can I continue?",ja:"\u5909\u66f4\u304c\u4fdd\u5b58\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002<br>\u3053\u306e\u307e\u307e\u7d9a\u884c\u3057\u307e\u3059\u304b\uff1f",zh:"\u66f4\u6539\u5c1a\u672a\u4fdd\u5b58\u3002<br>\u662f\u5426\u7ee7\u7eed\uff1f","zh-TW":"\u66f4\u6539\u5c1a\u672a\u4fdd\u5b58\u3002<br>\u662f\u5426\u7e7c\u7e8c\uff1f"}},
invalid:{}}}},kb.constants);