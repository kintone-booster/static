/*
* FileName "plugins.upsert.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(N){var l={},M=function(g,v,x){x=void 0===x?!1:x;return new Promise(function(E,y){var I=function(B,m){var n=function(){B++;x||kb.progressStart(g.length);B<g.length?I(B,m):m()};(function(c){var e=kb.filter.scan(l.app,v,c.condition.value);e?kb.filter.auth(c.user.value,c.organization.value,c.group.value).then(function(z){z?kb.field.load(c.app.value).then(function(w){var C={id:c.app.value,fields:w.origin};(function(p){var F=[],K=[],P=[],G={},A=1,L=1,D=0,J=0,O=function(){var k=[],t={field:function(a,
d){var r=a.tableCode?e[a.tableCode].value.length>d?e[a.tableCode].value[d].value[a.code]:kb.record.create({fields:{empty:mapping.internal}}).empty:e[a.code];return kb.extend({type:a.type},r)},record:function(a){L.each(function(d){var r=function(b){var h=kb.filter.scan(C,a,b.query);if(!h&&"upsert"==c.pattern.value){for(var f in b.rows)0==kb.filter.result[f].value.length&&(a[f].value.push({value:kb.extend({},b.rows[f])}),kb.filter.result[f]={value:[a[f].value.last()]});h=kb.filter.result}return h}(function(){var b=
{rows:{},query:[]};J=d;F.each(function(h,f){h.external.tableCode&&(h.external.tableCode in b.rows||(b.rows[h.external.tableCode]=kb.record.create(C.fields[h.external.tableCode],!1)),b.rows[h.external.tableCode][h.external.code]=q(h.external,t.field(h.internal,J)),b.query.push(kb.filter.query.create(h.external,h.operator,t.field(h.internal,J))))});K.each(function(h,f){h.field.tableCode&&b.query.push(h.field.code+" "+h.operator+" "+h.value)});b.query=b.query.join(" and ");return b}());r&&P.each(function(b,
h){b.external.tableCode?b.external.tableCode in G?(a[b.external.tableCode]={value:G[b.external.tableCode]},G[b.external.tableCode].each(function(f,H){f.value[b.external.code]=q(b.external,t.field(b.internal,H));"FILE"==b.external.type&&f.value[b.external.code].value&&Array.prototype.push.apply(k,f.value[b.external.code].value)})):r[b.external.tableCode].value.each(function(f,H){f.value[b.external.code]=q(b.external,t.field(b.internal,J));"FILE"==b.external.type&&f.value[b.external.code].value&&Array.prototype.push.apply(k,
f.value[b.external.code].value)}):(a[b.external.code]=q(b.external,t.field(b.internal,D)),"FILE"==b.external.type&&a[b.external.code].value&&Array.prototype.push.apply(k,a[b.external.code].value))})});return a}},q=function(a,d){return a.lookup?kb.extend({lookup:!0},d):d},u=function(a){a.each(function(d,r){c.formula.value.each(function(b,h){b.value.field.value in p.external&&function(f){f.tableCode?d[f.tableCode].value.each(function(H,Q){H.value[f.code].value=kb.formula.calculate(b.value,H.value,d,
d,p.external);f.lookup&&(H.value[f.code].lookup=!0)}):(d[f.code].value=kb.formula.calculate(b.value,d,d,d,p.external),f.lookup&&(d[f.code].lookup=!0))}(p.external[b.value.field.value])})});return a};"insert"==c.pattern.value?function(a){kb.file.clone(k,!0).then(function(){kb.view.records.set(c.app.value,{post:a},x).then(function(d){D++;D<A?O():n()})["catch"](function(d){kb.alert(kb.error.parse(d));y()})})}(u([t.record(kb.record.create(C))])):kb.view.records.get(c.app.value,function(){var a=[];F.each(function(d,
r){d.external.tableCode||a.push(kb.filter.query.create(d.external,d.operator,t.field(d.internal,D)))});K.each(function(d,r){d.field.tableCode||a.push(d.field.code+" "+d.operator+" "+d.value)});return a.join(" and ")}()).then(function(a){a=function(d){var r=[];0!=d.length?r=d.map(function(b){return t.record(b)}):"upsert"==c.pattern.value&&function(b){r.push(t.record(function(){var h=kb.record.create(C);b.each(function(f,H){f.external.tableCode?h[f.external.tableCode]={value:[]}:h[f.external.code]=
q(f.external,t.field(f.internal,D))});return h}()))}(F.filter(function(b){return!kb.field.reserved.includes(b.external.type)}));return u(r)}(a);kb.file.clone(k,!0).then(function(){kb.view.records.set(c.app.value,{post:a.filter(function(d){return!d.$id.value}),put:a.reduce(function(d,r){r.$id.value&&d.push(kb.view.records.transform(r));return d},[])},x).then(function(d){D++;D<A?O():n()})["catch"](function(d){kb.alert(kb.error.parse(d));y()})})})["catch"](function(a){kb.alert(kb.error.parse(a));y()})};
c.mapping.value.some(function(k){return!(k.value.external.value in p.external&&k.value.internal.value in p.internal)})?(kb.alert("No field to transfer was found"),y()):c.criteria.value.some(function(k){return!(k.value.external.value in p.external&&k.value.internal.value in p.internal)})?(kb.alert("No field to transfer was found"),y()):(c.mapping.value.each(function(k,t){(function(q,u){q.tableCode?G[q.tableCode]=function(a){a=a?a.length:1;u.tableCode&&(a=a<e[u.tableCode].value.length?e[u.tableCode].value.length:
a);return Array(a).fill().map(function(){return{value:kb.record.create(C.fields[q.tableCode],!1)}})}(G[q.tableCode]):u.tableCode&&(A=0==e[u.tableCode].value.length?0:A<e[u.tableCode].value.length?e[u.tableCode].value.length:A);P.push({external:q,internal:u})})(p.external[k.value.external.value],p.internal[k.value.internal.value])}),c.criteria.value.each(function(k,t){var q=p.external[k.value.external.value],u=k.value.operator.value,a=p.internal[k.value.internal.value];q.tableCode?(q.tableCode in G&&
delete G[q.tableCode],a.tableCode&&(L=L<e[a.tableCode].value.length?e[a.tableCode].value.length:L)):a.tableCode&&(A=0==e[a.tableCode].value.length?0:A<e[a.tableCode].value.length?e[a.tableCode].value.length:A);F.push({external:q,operator:u,internal:a})}),kb.filter.query.parse(c.filter.value).each(function(k,t){K.push({field:p.external[k.field],operator:k.operator,value:k.value})}),0!=A?(J=D=0,O()):n())})({external:w.parallelize,internal:l.fieldInfos.parallelize})})["catch"](function(w){kb.alert(kb.error.parse(w));
y()}):n()})["catch"](function(z){kb.alert(kb.error.parse(z));y()}):n()})(g[B])};x||kb.progressStart(g.length);I(0,function(){x||kb.progressEnd();E()})})};kintone.events.on("app.record.create.submit.success app.record.detail.process.proceed app.record.detail.show app.record.edit.submit.success app.record.index.show mobile.app.record.create.submit.success mobile.app.record.detail.process.proceed mobile.app.record.detail.show mobile.app.record.edit.submit.success mobile.app.record.index.show".split(" "),
function(g){return new Promise(function(v,x){(function(E,y){l.mobile=E;l.type=y;kb.config[N].config.get().then(function(I){0!=Object.keys(I).length?kb.field.load(kb.config[N].app,!0).then(function(B){l.app={id:kb.config[N].app,fields:B.origin};l.fieldInfos=B;try{(function(m){if(0!=m.length)switch(l.type){case "create":case "edit":M(m,g.record).then(function(c){return v(g)})["catch"](function(){});break;case "process":(function(c){0!=c.length?M(c,g.record).then(function(e){return v(g)})["catch"](function(){}):
v(g)})(m.filter(function(c){return c.action.value==g.action.value+":"+g.status.value+":"+g.nextStatus.value}));break;case "detail":var n=function(c){(function(e){kb.filter.scan(l.app,g.record,e.condition.value)?kb.filter.auth(e.user.value,e.organization.value,e.group.value).then(function(z){z&&kb.button.create(l.mobile,l.type,"kb-upsert-button"+c.toString(),e.label.value,e.message.value,function(){return M([e],g.record).then(function(w){return kb.alert("Done!")})["catch"](function(){})});c++;c<m.length&&
n(c)})["catch"](function(z){c++;c<m.length&&n(c)}):(c++,c<m.length&&n(c))})(m[c])};n(0);v(g);break;case "index":n=function(c){(function(e){kb.filter.auth(e.user.value,e.organization.value,e.group.value).then(function(z){z&&(e.view.value&&e.view.value!=g.viewId.toString()||kb.button.create(l.mobile,l.type,"kb-upsert-button"+c.toString(),e.label.value,e.message.value,function(){kb.view.records.get(l.app.id,(l.mobile?kintone.mobile.app:kintone.app).getQueryCondition()).then(function(w){var C=function(p,
F){M([e],w[p],!0).then(function(K){kb.progressUpdate();p++;p<w.length?C(p,F):F()})["catch"](function(){})};0!=w.length?(kb.progressStart(w.length),C(0,function(){return kb.alert("Done!")})):kb.alert("There are no records.")})["catch"](function(w){return kb.alert(kb.error.parse(w))})}));c++;c<m.length&&n(c)})["catch"](function(z){c++;c<m.length&&n(c)})})(m[c])},n(0),v(g)}else v(g)})((l.config?l.config:l.config=JSON.parse(I.tab)).reduce(function(m,n){(l.mobile?["both","mobile"]:["both","pc"]).includes(n.setting.device.value)&&
n.setting.event.value.includes(l.type)&&m.push(n.setting);return m},[]))}catch(m){kb.alert(kb.error.parse(m)),v(g)}})["catch"](function(B){return v(g)}):v(g)})["catch"](function(I){return v(g)})})("mobile"==g.type.split(".").first(),function(E){switch(E){case "submit":E=g.type.split(".").slice(-3).first()}return E}(g.type.split(".").slice(-2).first()))})})})(kintone.$PLUGIN_ID);