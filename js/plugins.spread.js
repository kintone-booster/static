/*
* FileName "plugins.spread.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(v=>{var p,g;kintone.events.on(["app.record.index.show","mobile.app.record.index.show"],l=>new Promise((r,z)=>{((A,B)=>{p=A;kb.config[v].config.get().then(w=>{0!=Object.keys(w).length?kb.field.load(kb.config[v].app,!0).then(t=>{g={id:kb.config[v].app,disables:t.disables.reduce((b,d)=>{d in t.parallelize&&b.push(t.parallelize[d]);return b},[]),fields:((b,d)=>{var q={},m;for(m in b){var f=b[m];f.tableCode?f.tableCode in q||(q[f.tableCode]=d[f.tableCode]):q[m]=f}return q})(t.parallelize,t.tables),view:{}};
try{(b=>{b?(d=>{var q=()=>{d.elm(".kb-view").elms("[unsaved=unsaved]").each((m,f)=>{m.removeAttr("unsaved").removeClass("kb-unsaved")});window.location.reload(!0)};p&&kb.elm("body").addClass("kb-mobile");d.append(kb.create("div").addClass("kb-spread-toolbar").append(kb.create("button").addClass("kb-spread-toolbar-button kb-spread-toolbar-button-submit").html(kb.constants.common.caption.button.submit[kb.operator.language]).on("click",m=>{((f,u)=>{var h={post:[],put:[]},n={submit:(c,a)=>{if(0!=f.length){var k=
kb.record.get(f[c],g);k.error?a(!0):kb.event.call("kb.submit.call",{record:k.record,mobile:p,numbering:u,pattern:k.record.$id.value?"edit":"create",workplace:"view"}).then(e=>{e.error?(kb.record.set(f[c],g,e.record),a(!0)):(e.record.$id.value?h.put.push({id:e.record.$id.value,record:e.record}):h.post.push(e.record),c++,c<f.length?n.submit(c,a):a())}).catch(()=>{})}else a()},success:(c,a,k,e)=>{let y=()=>{c++;c<h[a].length?n.success(c,a,k,e):"post"==a?n.success(0,"put",k,e):e()};0!=h[a].length?kb.event.call("kb."+
k+".call",{record:"post"==a?h[a][c]:h[a][c].record,mobile:p,pattern:"post"==a?"create":"edit",workplace:"view"}).then(x=>{x.error||("post"==a?h[a][c]=x.record:h[a][c].record=x.record,y())}).catch(()=>{}):y()}};n.submit(0,c=>{c||(0!=h.post.length+h.put.length?(kb.loadStart(),kb.event.call("kb.view.submit",{container:d.elm(".kb-view"),records:h,viewId:b.view.value}).then(a=>{a.error||kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],()=>{kb.loadStart();kb.view.records.set(g.id,
a.records,!0,!0).then(k=>{kb.event.call("kb.view.submit.success",{container:a.container,records:a.records,viewId:a.viewId}).then(e=>{e.error||n.success(0,"post","report",()=>{n.success(0,"post","mail",()=>{n.success(0,"post","omail",()=>{n.success(0,"post","upsert",()=>{kb.alert("Done!",()=>q())})})})})})}).catch(k=>{kb.alert(kb.error.parse(k));z()})})})):kb.alert(kb.constants.common.message.invalid.submit[kb.operator.language]))})})(d.elm(".kb-view").elms("[unsaved=unsaved]"),{})})).append(kb.create("button").addClass("kb-spread-toolbar-button").html(kb.constants.common.caption.button.cancel[kb.operator.language]).on("click",
m=>{0!=d.elm(".kb-view").elms("[unsaved=unsaved]").length&&kb.confirm(kb.constants.common.message.confirm.cancel[kb.operator.language],()=>q())})));"viewer"==b.mode.value&&d.elm(".kb-spread-toolbar").addClass("kb-hidden");kb.view.load(g.id).then(m=>{g.view={buttons:b.buttons.value,fields:m.list.reduce((f,u)=>u.id==b.view.value?u.fields:f,[]),mode:b.mode.value};kb.event.call("kb.attachment.call",{mode:"placeholder",fields:g.fields}).then(f=>{(u=>{l.records.each((h,n)=>{(c=>{kb.event.call("kb.action.call",
{container:c.elm("[form-id=form_"+g.id+"]"),record:h,mobile:p,pattern:"editor"==b.mode.value?"edit":"dummy",workplace:"view"}).then(a=>{kb.event.call("kb.style.call",{container:c.elm("[form-id=form_"+g.id+"]"),record:a.record,mobile:a.mobile,pattern:"editor"==b.mode.value?"edit":"detail",workplace:a.workplace}).then(k=>{kb.event.call("kb.cascade.call",k).then(e=>{kb.record.set(c.elm("[form-id=form_"+g.id+"]"),g,e.record).then(()=>{c.elm(".kb-view-row-edit").attr("href",kb.record.page.detail(p,g.id,
e.record.$id.value));n==l.records.length-1&&d.parentNode.show()})}).catch(()=>{})}).catch(()=>{})}).catch(()=>{})})(u.addRow())})})(kb.view.create(d,g,b.view.value,p,!0).elm(".kb-view"));r(l)}).catch(()=>{})});window.on("beforeunload",m=>{0!=d.elm(".kb-view").elms("[unsaved=unsaved]").length&&(m.returnValue=kb.constants.common.message.confirm.changed[kb.operator.language])})})(kb.elm(p?".gaia-mobile-v2-indexviewpanel-tableview":"#view-list-data-gaia").addClass("kb-view-container").empty()):r(l)})(JSON.parse(w.flat).setting.value.reduce((b,
d)=>{d.value.view.value==l.viewId.toString()&&(b=d.value);return b},null))}catch(b){kb.alert(kb.error.parse(b)),r(l)}}).catch(t=>r(l)):r(l)}).catch(w=>r(l))})("mobile"==l.type.split(".").first(),l.type.split(".").slice(-2).first())}))})(kintone.$PLUGIN_ID);
