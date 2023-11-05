/*
* FileName "plugins.spread.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(u){var b={};kintone.events.on(["app.record.index.show","mobile.app.record.index.show"],function(m){return new Promise(function(r,y){(function(z,A){b.mobile=z;b.type=A;kb.config[u].config.get().then(function(v){0!=Object.keys(v).length?kb.field.load(kb.config[u].app,!0).then(function(p){b.app={id:kb.config[u].app,disables:p.disables.reduce(function(c,e){e in p.parallelize&&c.push(p.parallelize[e]);return c},[]),fields:function(c,e){var q={},k;for(k in c){var f=c[k];f.tableCode?f.tableCode in
q||(q[f.tableCode]=e[f.tableCode]):q[k]=f}return q}(p.parallelize,p.tables),view:{}};b.fieldInfos=p;try{(function(c){c?function(e){var q=function(){e.elm(".kb-view").elms("[unsaved=unsaved]").each(function(k,f){k.removeAttr("unsaved").removeClass("kb-unsaved")});window.location.reload(!0)};b.mobile&&kb.elm("body").addClass("kb-mobile");e.append(kb.create("div").addClass("kb-spread-toolbar").append(kb.create("button").addClass("kb-spread-toolbar-button kb-spread-toolbar-button-submit").html(kb.constants.common.caption.button.submit[kb.operator.language]).on("click",
function(k){(function(f,t){var g={post:[],put:[]},l={submit:function(d,a){if(0!=f.length){var n=kb.record.get(f[d],b.app);n.error?a(!0):kb.event.call("kb.submit.call",{record:n.record,mobile:b.mobile,numbering:t,pattern:n.record.$id.value?"edit":"create",workplace:"view"}).then(function(h){h.error?(kb.record.set(f[d],b.app,h.record),a(!0)):(h.record.$id.value?g.put.push({id:h.record.$id.value,record:h.record}):g.post.push(h.record),d++,d<f.length?l.submit(d,a):a())})["catch"](function(){})}else a()},
success:function(d,a,n,h){var x=function(){d++;d<g[a].length?l.success(d,a,n,h):"post"==a?l.success(0,"put",n,h):h()};0!=g[a].length?kb.event.call("kb."+n+".call",{record:"post"==a?g[a][d]:g[a][d].record,mobile:b.mobile,pattern:"post"==a?"create":"edit",workplace:"view"}).then(function(w){w.error||("post"==a?g[a][d]=w.record:g[a][d].record=w.record,x())})["catch"](function(){}):x()}};l.submit(0,function(d){d||(0!=g.post.length+g.put.length?(kb.loadStart(),kb.event.call("kb.view.submit",{container:e.elm(".kb-view"),
records:g,viewId:c.view.value}).then(function(a){a.error||kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],function(){kb.loadStart();kb.view.records.set(b.app.id,a.records,!0,!0).then(function(n){kb.event.call("kb.view.submit.success",{container:a.container,records:a.records,viewId:a.viewId}).then(function(h){h.error||l.success(0,"post","mail",function(){l.success(0,"post","upsert",function(){kb.alert("Done!",function(){return q()})})})})})["catch"](function(n){kb.alert(kb.error.parse(n));
y()})})})):kb.alert(kb.constants.common.message.invalid.submit[kb.operator.language]))})})(e.elm(".kb-view").elms("[unsaved=unsaved]"),{})})).append(kb.create("button").addClass("kb-spread-toolbar-button").html(kb.constants.common.caption.button.cancel[kb.operator.language]).on("click",function(k){0!=e.elm(".kb-view").elms("[unsaved=unsaved]").length&&kb.confirm(kb.constants.common.message.confirm.cancel[kb.operator.language],function(){return q()})})));kb.view.load(b.app.id).then(function(k){b.app.view=
{buttons:c.buttons.value,fields:k.list.reduce(function(f,t){return t.id==c.view.value?t.fields:f},[]),mode:c.mode.value};(function(f){m.records.each(function(t,g){(function(l){kb.event.call("kb.action.call",{container:l.elm("[form-id=form_"+b.app.id+"]"),record:t,mobile:b.mobile,pattern:"editor"==c.mode.value?"edit":"dummy",workplace:"view"}).then(function(d){kb.event.call("kb.style.call",{container:l.elm("[form-id=form_"+b.app.id+"]"),record:d.record,mobile:d.mobile,pattern:"editor"==c.mode.value?
"edit":"detail",workplace:d.workplace}).then(function(a){kb.record.set(l.elm("[form-id=form_"+b.app.id+"]"),b.app,a.record).then(function(){l.elm(".kb-view-row-edit").attr("href",kb.record.page.detail(b.mobile,b.app.id,a.record.$id.value));e.parentNode.show()})})["catch"](function(){})})["catch"](function(){})})(f.addRow())})})(kb.view.create(e,b.app,c.view.value,b.mobile).elm(".kb-view"));r(m)});window.on("beforeunload",function(k){0!=e.elm(".kb-view").elms("[unsaved=unsaved]").length&&(k.returnValue=
kb.constants.common.message.confirm.changed[kb.operator.language])})}(kb.elm(b.mobile?".gaia-mobile-v2-indexviewpanel-tableview":"#view-list-data-gaia").addClass("kb-view-container").empty()):r(m)})((b.config?b.config:b.config=JSON.parse(v.flat)).setting.value.map(function(c,e){return kb.extend({sIndex:{value:e.toString()}},c)}).reduce(function(c,e){e.value.view.value==m.viewId.toString()&&(c=e.value);return c},null))}catch(c){kb.alert(kb.error.parse(c)),r(m)}})["catch"](function(p){return r(m)}):
r(m)})["catch"](function(v){return r(m)})})("mobile"==m.type.split(".").first(),m.type.split(".").slice(-2).first())})})})(kintone.$PLUGIN_ID);