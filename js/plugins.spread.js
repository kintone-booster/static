/*
* FileName "plugins.spread.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(v){var n,f;kintone.events.on(["app.record.index.show","mobile.app.record.index.show"],function(m){return new Promise(function(r,z){(function(A,B){n=A;kb.config[v].config.get().then(function(w){0!=Object.keys(w).length?kb.field.load(kb.config[v].app,!0).then(function(t){f={id:kb.config[v].app,disables:t.disables.reduce(function(c,d){d in t.parallelize&&c.push(t.parallelize[d]);return c},[]),fields:function(c,d){var p={},l;for(l in c){var e=c[l];e.tableCode?e.tableCode in p||(p[e.tableCode]=
d[e.tableCode]):p[l]=e}return p}(t.parallelize,t.tables),view:{}};try{(function(c){c?function(d){var p=function(){d.elm(".kb-view").elms("[unsaved=unsaved]").each(function(l,e){l.removeAttr("unsaved").removeClass("kb-unsaved")});window.location.reload(!0)};n&&kb.elm("body").addClass("kb-mobile");d.append(kb.create("div").addClass("kb-spread-toolbar").append(kb.create("button").addClass("kb-spread-toolbar-button kb-spread-toolbar-button-submit").html(kb.constants.common.caption.button.submit[kb.operator.language]).on("click",
function(l){(function(e,u){var g={post:[],put:[]},q={submit:function(b,a){if(0!=e.length){var h=kb.record.get(e[b],f);h.error?a(!0):kb.event.call("kb.submit.call",{record:h.record,mobile:n,numbering:u,pattern:h.record.$id.value?"edit":"create",workplace:"view"}).then(function(k){k.error?(kb.record.set(e[b],f,k.record),a(!0)):(k.record.$id.value?g.put.push({id:k.record.$id.value,record:k.record}):g.post.push(k.record),b++,b<e.length?q.submit(b,a):a())})["catch"](function(){})}else a()},success:function(b,
a,h,k){var y=function(){b++;b<g[a].length?q.success(b,a,h,k):"post"==a?q.success(0,"put",h,k):k()};0!=g[a].length?kb.event.call("kb."+h+".call",{record:"post"==a?g[a][b]:g[a][b].record,mobile:n,pattern:"post"==a?"create":"edit",workplace:"view"}).then(function(x){x.error||("post"==a?g[a][b]=x.record:g[a][b].record=x.record,y())})["catch"](function(){}):y()}};q.submit(0,function(b){b||(0!=g.post.length+g.put.length?(kb.loadStart(),kb.event.call("kb.view.submit",{container:d.elm(".kb-view"),records:g,
viewId:c.view.value}).then(function(a){a.error||kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],function(){kb.loadStart();kb.view.records.set(f.id,a.records,!0,!0).then(function(h){kb.event.call("kb.view.submit.success",{container:a.container,records:a.records,viewId:a.viewId}).then(function(k){k.error||q.success(0,"post","mail",function(){q.success(0,"post","upsert",function(){kb.alert("Done!",function(){return p()})})})})})["catch"](function(h){kb.alert(kb.error.parse(h));
z()})})})):kb.alert(kb.constants.common.message.invalid.submit[kb.operator.language]))})})(d.elm(".kb-view").elms("[unsaved=unsaved]"),{})})).append(kb.create("button").addClass("kb-spread-toolbar-button").html(kb.constants.common.caption.button.cancel[kb.operator.language]).on("click",function(l){0!=d.elm(".kb-view").elms("[unsaved=unsaved]").length&&kb.confirm(kb.constants.common.message.confirm.cancel[kb.operator.language],function(){return p()})})));kb.view.load(f.id).then(function(l){f.view=
{buttons:c.buttons.value,fields:l.list.reduce(function(e,u){return u.id==c.view.value?u.fields:e},[]),mode:c.mode.value};kb.event.call("kb.attachment.call",{mode:"placeholder",fields:f.fields}).then(function(e){(function(u){m.records.each(function(g,q){(function(b){kb.event.call("kb.action.call",{container:b.elm("[form-id=form_"+f.id+"]"),record:g,mobile:n,pattern:"editor"==c.mode.value?"edit":"dummy",workplace:"view"}).then(function(a){kb.event.call("kb.style.call",{container:b.elm("[form-id=form_"+
f.id+"]"),record:a.record,mobile:a.mobile,pattern:"editor"==c.mode.value?"edit":"detail",workplace:a.workplace}).then(function(h){kb.record.set(b.elm("[form-id=form_"+f.id+"]"),f,h.record).then(function(){b.elm(".kb-view-row-edit").attr("href",kb.record.page.detail(n,f.id,h.record.$id.value));d.parentNode.show()})})["catch"](function(){})})["catch"](function(){})})(u.addRow())})})(kb.view.create(d,f,c.view.value,n).elm(".kb-view"));r(m)})["catch"](function(){})});window.on("beforeunload",function(l){0!=
d.elm(".kb-view").elms("[unsaved=unsaved]").length&&(l.returnValue=kb.constants.common.message.confirm.changed[kb.operator.language])})}(kb.elm(n?".gaia-mobile-v2-indexviewpanel-tableview":"#view-list-data-gaia").addClass("kb-view-container").empty()):r(m)})(JSON.parse(w.flat).setting.value.reduce(function(c,d){d.value.view.value==m.viewId.toString()&&(c=d.value);return c},null))}catch(c){kb.alert(kb.error.parse(c)),r(m)}})["catch"](function(t){return r(m)}):r(m)})["catch"](function(w){return r(m)})})("mobile"==
m.type.split(".").first(),m.type.split(".").slice(-2).first())})})})(kintone.$PLUGIN_ID);