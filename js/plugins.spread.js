/*
* FileName "plugins.spread.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(y){var q,g,A;kintone.events.on(["app.record.index.show","mobile.app.record.index.show"],function(n){return new Promise(function(u,C){(function(D,E){q=D;kb.config[y].config.get().then(function(z){0!=Object.keys(z).length?kb.field.load(kb.config[y].app,!0).then(function(r){g={id:kb.config[y].app,disables:r.disables.reduce(function(b,d){d in r.parallelize&&b.push(r.parallelize[d]);return b},[]),fields:function(b,d){var t={},k;for(k in b){var f=b[k];f.tableCode?f.tableCode in t||(t[f.tableCode]=
d[f.tableCode]):t[k]=f}return t}(r.parallelize,r.tables),view:{}};A=r;try{(function(b){b?function(d){var t=function(){d.elm(".kb-view").elms("[unsaved=unsaved]").each(function(k,f){k.removeAttr("unsaved").removeClass("kb-unsaved")});window.location.reload(!0)};q&&kb.elm("body").addClass("kb-mobile");d.append(kb.create("div").addClass("kb-spread-toolbar").append(kb.create("button").addClass("kb-spread-toolbar-button kb-spread-toolbar-button-submit").html(kb.constants.common.caption.button.submit[kb.operator.language]).on("click",
function(k){(function(f,v){var w=[],h={post:[],put:[]},m={submit:function(c,a){if(0!=f.length){var p=kb.record.get(f[c],g);p.error?a(!0):kb.event.call("kb.submit.call",{record:p.record,mobile:q,numbering:v,pattern:p.record.$id.value?"edit":"create",workplace:"view"}).then(function(e){e.error?(kb.record.set(f[c],g,e.record),a(!0)):(Object.values(A.parallelize).filter(function(l){return"FILE"==l.type}).each(function(l,x){l.tableCode?e.record[l.tableCode].value.each(function(B,F){B.value[l.code].value&&
Array.prototype.push.apply(w,B.value[l.code].value)}):e.record[l.code].value&&Array.prototype.push.apply(w,e.record[l.code].value)}),e.record.$id.value?h.put.push({id:e.record.$id.value,record:e.record}):h.post.push(e.record),c++,c<f.length?m.submit(c,a):a())})["catch"](function(){})}else a()},success:function(c,a,p,e){var l=function(){c++;c<h[a].length?m.success(c,a,p,e):"post"==a?m.success(0,"put",p,e):e()};0!=h[a].length?kb.event.call("kb."+p+".call",{record:"post"==a?h[a][c]:h[a][c].record,mobile:q,
pattern:"post"==a?"create":"edit",workplace:"view"}).then(function(x){x.error||("post"==a?h[a][c]=x.record:h[a][c].record=x.record,l())})["catch"](function(){}):l()}};m.submit(0,function(c){c||(0!=h.post.length+h.put.length?(kb.loadStart(),kb.event.call("kb.view.submit",{container:d.elm(".kb-view"),records:h,viewId:b.view.value}).then(function(a){a.error||kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],function(){kb.loadStart();kb.file.clone(w,!0).then(function(){kb.view.records.set(g.id,
a.records,!0,!0).then(function(p){kb.event.call("kb.view.submit.success",{container:a.container,records:a.records,viewId:a.viewId}).then(function(e){e.error||m.success(0,"post","mail",function(){m.success(0,"post","upsert",function(){kb.alert("Done!",function(){return t()})})})})})["catch"](function(p){kb.alert(kb.error.parse(p));C()})})})})):kb.alert(kb.constants.common.message.invalid.submit[kb.operator.language]))})})(d.elm(".kb-view").elms("[unsaved=unsaved]"),{})})).append(kb.create("button").addClass("kb-spread-toolbar-button").html(kb.constants.common.caption.button.cancel[kb.operator.language]).on("click",
function(k){0!=d.elm(".kb-view").elms("[unsaved=unsaved]").length&&kb.confirm(kb.constants.common.message.confirm.cancel[kb.operator.language],function(){return t()})})));kb.view.load(g.id).then(function(k){g.view={buttons:b.buttons.value,fields:k.list.reduce(function(f,v){return v.id==b.view.value?v.fields:f},[]),mode:b.mode.value};kb.event.call("kb.attachment.call",{mode:"placeholder",fields:g.fields}).then(function(f){(function(v){n.records.each(function(w,h){(function(m){kb.event.call("kb.action.call",
{container:m.elm("[form-id=form_"+g.id+"]"),record:w,mobile:q,pattern:"editor"==b.mode.value?"edit":"dummy",workplace:"view"}).then(function(c){kb.event.call("kb.style.call",{container:m.elm("[form-id=form_"+g.id+"]"),record:c.record,mobile:c.mobile,pattern:"editor"==b.mode.value?"edit":"detail",workplace:c.workplace}).then(function(a){kb.record.set(m.elm("[form-id=form_"+g.id+"]"),g,a.record).then(function(){m.elm(".kb-view-row-edit").attr("href",kb.record.page.detail(q,g.id,a.record.$id.value));
d.parentNode.show()})})["catch"](function(){})})["catch"](function(){})})(v.addRow())})})(kb.view.create(d,g,b.view.value,q).elm(".kb-view"));u(n)})["catch"](function(){})});window.on("beforeunload",function(k){0!=d.elm(".kb-view").elms("[unsaved=unsaved]").length&&(k.returnValue=kb.constants.common.message.confirm.changed[kb.operator.language])})}(kb.elm(q?".gaia-mobile-v2-indexviewpanel-tableview":"#view-list-data-gaia").addClass("kb-view-container").empty()):u(n)})(JSON.parse(z.flat).setting.value.reduce(function(b,
d){d.value.view.value==n.viewId.toString()&&(b=d.value);return b},null))}catch(b){kb.alert(kb.error.parse(b)),u(n)}})["catch"](function(r){return u(n)}):u(n)})["catch"](function(z){return u(n)})})("mobile"==n.type.split(".").first(),n.type.split(".").slice(-2).first())})})})(kintone.$PLUGIN_ID);