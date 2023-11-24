/*
* FileName "plugins.mail.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(z){var e={},B=function(b,f,x){x=void 0===x?!1:x;return new Promise(function(t,n){var l="",p=function(d,g){var c=function(){d++;d<b.length?p(d,g):g()};(function(a){var q=kb.filter.scan(e.app,f,a.condition.value);q?kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(function(u){if(u){var A=function(h,m,v){"HTML"==a.format.value&&(h=h.replace(/\r/g,"").replace(/\n/g,"<br>"));for(var k in m)h=h.replace(new RegExp("%"+k+"%","g"),kb.field.stringify(e.fieldInfos.parallelize[k],
m[k].value," / "));for(k in v)h=h.replace(new RegExp("%"+k+"%","g"),kb.field.stringify(e.fieldInfos.parallelize[k],v[k].value," / "));return h};(function(h){var m=function(v){(function(k){var D=function(r,y){0!=k.attachment.length?kb.file.download(k.attachment[r],!0).then(function(w){kb.field.blobToBase64(w,function(C){k.attachment[r].data=C;r++;r<k.attachment.length?D(r,y):y()})})["catch"](function(w){kb.alert(kb.error.parse(w));n()}):y()};D(0,function(){kb.encrypt(JSON.stringify(k.data),l).then(function(r){var y=
fetch,w="https://api.kintone-booster.com/mail/"+kb.operator.language,C=JSON,F=C.stringify;k.data=r.data;k.iv=r.iv;k.tag=r.tag;y(w,{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest"},body:F.call(C,k)}).then(function(E){E.json().then(function(G){switch(E.status){case 200:v++;v<h.length?m(v):c();break;default:kb.alert(kb.error.parse(G)),n()}})})["catch"](function(E){kb.alert(kb.error.parse(E));n()})})["catch"](function(r){n()})})})(h[v])};0!=h.length?m(0):c()})(function(){var h=[];(e.fieldInfos.parallelize[a.to.value].tableCode?
q[e.fieldInfos.parallelize[a.to.value].tableCode].value:[{value:q}]).each(function(m,v){if(m.value[a.to.value].value){var k=h.push,D={mail:a.mail.value,sender:a.sender.value,host:a.host.value,port:a.port.value,author:a.author.value,pwd:a.pwd.value,secure:a.secure.value,to:m.value[a.to.value].value,cc:a.cc.value,bcc:a.bcc.value,html:"HTML"==a.format.value},r=A(a.subject.value,q,e.fieldInfos.parallelize[a.to.value].tableCode?m.value:{}),y=A(a.body.value,q,e.fieldInfos.parallelize[a.to.value].tableCode?
m.value:{}),w=[];a.attachment.value&&a.attachment.value in e.fieldInfos.parallelize&&(w=(e.fieldInfos.parallelize[a.attachment.value].tableCode?m.value:q)[a.attachment.value].value);k.call(h,{data:D,subject:r,body:y,attachment:w})}});return h}())}else c()})["catch"](function(u){kb.alert(kb.error.parse(u));n()}):c()})(b[d])};fetch("https://api.kintone-booster.com/mail/"+kb.operator.language,{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(function(d){d.json().then(function(g){switch(d.status){case 200:l=
g.passphrase;x||kb.loadStart();p(0,function(){x||kb.loadEnd();t()});break;default:kb.alert(kb.error.parse(g)),n()}})})["catch"](function(d){kb.alert(kb.error.parse(d));n()})})};kintone.events.on("app.record.create.submit.success app.record.detail.process.proceed app.record.detail.show app.record.edit.submit.success app.record.index.show mobile.app.record.create.submit.success mobile.app.record.detail.process.proceed mobile.app.record.detail.show mobile.app.record.edit.submit.success mobile.app.record.index.show".split(" "),
function(b){return new Promise(function(f,x){(function(t,n){e.mobile=t;e.type=n;kb.config[z].config.get().then(function(l){0!=Object.keys(l).length?kb.field.load(kb.config[z].app,!0).then(function(p){e.app={id:kb.config[z].app,fields:p.origin};e.fieldInfos=p;try{(function(d){if(0!=d.length)switch(e.type){case "create":case "edit":B(d,b.record).then(function(c){return f(b)})["catch"](function(){});break;case "process":(function(c){0!=c.length?B(c,b.record).then(function(a){return f(b)})["catch"](function(){}):
f(b)})(d.filter(function(c){return c.action.value==b.action.value+":"+b.status.value+":"+b.nextStatus.value}));break;case "detail":var g=function(c){(function(a){kb.filter.scan(e.app,b.record,a.condition.value)?kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(function(q){q&&kb.button.create(e.mobile,e.type,"kb-mail-button"+c.toString(),a.label.value,a.message.value,function(){return B([a],b.record).then(function(u){return kb.alert("Done!")})["catch"](function(){})});c++;c<d.length&&
g(c)})["catch"](function(q){c++;c<d.length&&g(c)}):(c++,c<d.length&&g(c))})(d[c])};g(0);f(b);break;case "index":g=function(c){(function(a){kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(function(q){q&&(a.view.value&&a.view.value!=b.viewId.toString()||kb.button.create(e.mobile,e.type,"kb-mail-button"+c.toString(),a.label.value,a.message.value,function(){kb.view.records.get(e.app.id,(e.mobile?kintone.mobile.app:kintone.app).getQueryCondition()).then(function(u){var A=function(h,
m){B([a],u[h],!0).then(function(v){kb.progressUpdate();h++;h<u.length?A(h,m):m()})["catch"](function(){})};0!=u.length?(kb.progressStart(u.length),A(0,function(){return kb.alert("Done!")})):kb.alert("There are no records.")})["catch"](function(u){return kb.alert(kb.error.parse(u))})}));c++;c<d.length&&g(c)})["catch"](function(q){c++;c<d.length&&g(c)})})(d[c])},g(0),f(b)}else f(b)})(JSON.parse(l.tab).map(function(d,g){return kb.extend({sIndex:{value:g.toString()}},d.setting)}).reduce(function(d,g){(e.mobile?
["both","mobile"]:["both","pc"]).includes(g.device.value)&&g.event.value.includes(e.type)&&d.push(g);return d},[]))}catch(d){kb.alert(kb.error.parse(d)),f(b)}})["catch"](function(p){return f(b)}):f(b)})["catch"](function(l){return f(b)})})("mobile"==b.type.split(".").first(),function(t){switch(t){case "submit":t=b.type.split(".").slice(-3).first()}return t}(b.type.split(".").slice(-2).first()))})});kb.event.on("kb.mail.call",function(b){return new Promise(function(f,x){kb.config[z].config.get().then(function(t){0!=
Object.keys(t).length?kb.field.load(kb.config[z].app,!0).then(function(n){e.app={id:kb.config[z].app,fields:n.origin};e.fieldInfos=n;try{(function(l){0!=l.length?B(l,b.record,!0).then(function(p){return f(b)})["catch"](function(){return f(b)}):f(b)})(JSON.parse(t.tab).map(function(l,p){return kb.extend({sIndex:{value:p.toString()}},l.setting)}).reduce(function(l,p){(b.mobile?["both","mobile"]:["both","pc"]).includes(p.device.value)&&p.event.value.includes(b.pattern)&&l.push(p);return l},[]))}catch(l){kb.alert(kb.error.parse(l)),
f(b)}})["catch"](function(n){return f(b)}):f(b)})["catch"](function(t){return f(b)})})})})(kintone.$PLUGIN_ID);