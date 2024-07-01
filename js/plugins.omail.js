/*
* FileName "plugins.omail.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(x=>{var d={},A=(b,g,B=!1)=>new Promise((r,p)=>{var l="",q=(e,h)=>{var c=()=>{e++;e<b.length?q(e,h):h()};(a=>{var n=kb.filter.scan(d.app,g,a.condition.value);n?kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(t=>{if(t){var w=(k,m,v)=>{"HTML"==a.format.value&&(k=k.replace(/\r/g,"").replace(/\n/g,"<br>"));for(var f in m)k=k.replace(new RegExp("%"+f+"%","g"),kb.field.stringify(d.fieldInfos.parallelize[f],m[f].value," / ",!0));for(f in v)k=k.replace(new RegExp("%"+f+"%",
"g"),kb.field.stringify(d.fieldInfos.parallelize[f],v[f].value," / ",!0));return k};(k=>{var m=v=>{(f=>{var E=(u,y)=>{0!=f.attachment.length?kb.file.download(f.attachment[u],!0).then(z=>{kb.field.blobToBase64(z,C=>{f.attachment[u].data=C;u++;u<f.attachment.length?E(u,y):y()})}).catch(z=>{kb.alert(kb.error.parse(z));p()}):y()};E(0,()=>{kb.encrypt(JSON.stringify(f.data),l).then(u=>{var y=fetch,z="https://api.kintone-booster.com/mail/oauth/"+kb.operator.language,C=JSON,F=C.stringify;f.data=u.data;f.iv=
u.iv;f.tag=u.tag;y(z,{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest"},body:F.call(C,f)}).then(D=>{D.json().then(G=>{switch(D.status){case 200:v++;v<k.length?m(v):c();break;default:kb.alert(kb.error.parse(G)),p()}})}).catch(D=>{kb.alert(kb.error.parse(D));p()})}).catch(u=>{p()})})})(k[v])};0!=k.length?m(0):c()})((()=>{var k=[];(d.fieldInfos.parallelize[a.to.value].tableCode?n[d.fieldInfos.parallelize[a.to.value].tableCode].value:[{value:n}]).each((m,v)=>{m.value[a.to.value].value&&k.push({data:{client_id:a.client_id.value,
client_secret:a.client_secret.value,author:a.author.value,sender:a.sender.value,subdomain:location.host.split(".")[0],provider:(f=>{f="";switch(a.provider.value){case "GMail":f="google";break;case "Exchange Online":f="microsoft"}return f})(a.provider.value),to:m.value[a.to.value].value,cc:w(a.cc.value,n,d.fieldInfos.parallelize[a.to.value].tableCode?m.value:{}),bcc:w(a.bcc.value,n,d.fieldInfos.parallelize[a.to.value].tableCode?m.value:{}),html:"HTML"==a.format.value},subject:w(a.subject.value,n,d.fieldInfos.parallelize[a.to.value].tableCode?
m.value:{}),body:w(a.body.value,n,d.fieldInfos.parallelize[a.to.value].tableCode?m.value:{}),attachment:(()=>{var f=[];a.attachment.value&&a.attachment.value in d.fieldInfos.parallelize&&(f=(d.fieldInfos.parallelize[a.attachment.value].tableCode?m.value:n)[a.attachment.value].value);return f})()})});return k})())}else c()}).catch(t=>{kb.alert(kb.error.parse(t));p()}):c()})(b[e])};fetch("https://api.kintone-booster.com/mail/oauth/"+kb.operator.language,{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>
{e.json().then(h=>{switch(e.status){case 200:l=h.passphrase;B||kb.loadStart();q(0,()=>{B||kb.loadEnd();r()});break;default:kb.alert(kb.error.parse(h)),p()}})}).catch(e=>{kb.alert(kb.error.parse(e));p()})});kintone.events.on("app.record.create.submit.success app.record.detail.process.proceed app.record.detail.show app.record.edit.submit.success app.record.index.show mobile.app.record.create.submit.success mobile.app.record.detail.process.proceed mobile.app.record.detail.show mobile.app.record.edit.submit.success mobile.app.record.index.show".split(" "),
b=>new Promise((g,B)=>{((r,p)=>{d.mobile=r;d.type=p;kb.config[x].config.get().then(l=>{0!=Object.keys(l).length?kb.field.load(kb.config[x].app,!0).then(q=>{d.app={id:kb.config[x].app,fields:q.origin};d.fieldInfos=q;try{(e=>{if(0!=e.length)switch(d.type){case "create":case "edit":A(e,b.record).then(c=>g(b)).catch(()=>{});break;case "process":(c=>{0!=c.length?A(c,b.record).then(a=>g(b)).catch(()=>{}):g(b)})(e.filter(c=>c.action.value==b.action.value+":"+b.status.value+":"+b.nextStatus.value));break;
case "detail":var h=c=>{(a=>{kb.filter.scan(d.app,b.record,a.condition.value)?kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(n=>{n&&kb.button.create(d.mobile,d.type,"kb-mail-button"+c.toString(),a.label.value,a.message.value,()=>A([a],b.record).then(t=>kb.alert("Done!")).catch(()=>{}));c++;c<e.length&&h(c)}).catch(n=>{c++;c<e.length&&h(c)}):(c++,c<e.length&&h(c))})(e[c])};h(0);g(b);break;case "index":h=c=>{(a=>{kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(n=>
{n&&(a.view.value&&a.view.value!=b.viewId.toString()||kb.button.create(d.mobile,d.type,"kb-mail-button"+c.toString(),a.label.value,a.message.value,()=>{kb.view.records.get(d.app.id,(d.mobile?kintone.mobile.app:kintone.app).getQueryCondition()).then(t=>{let w=(k,m)=>{A([a],t[k],!0).then(v=>{kb.progressUpdate();k++;k<t.length?w(k,m):m()}).catch(()=>{})};0!=t.length?(kb.progressStart(t.length),w(0,()=>kb.alert("Done!"))):kb.alert("There are no records.")}).catch(t=>kb.alert(kb.error.parse(t)))}));c++;
c<e.length&&h(c)}).catch(n=>{c++;c<e.length&&h(c)})})(e[c])},h(0),g(b)}else g(b)})(JSON.parse(l.tab).map((e,h)=>kb.extend({sIndex:{value:h.toString()}},e.setting)).reduce((e,h)=>{(d.mobile?["both","mobile"]:["both","pc"]).includes(h.device.value)&&h.event.value.includes(d.type)&&e.push(h);return e},[]))}catch(e){kb.alert(kb.error.parse(e)),g(b)}}).catch(q=>g(b)):g(b)}).catch(l=>g(b))})("mobile"==b.type.split(".").first(),(r=>{switch(r){case "submit":r=b.type.split(".").slice(-3).first()}return r})(b.type.split(".").slice(-2).first()))}));
kb.event.on("kb.mail.call",b=>new Promise((g,B)=>{kb.config[x].config.get().then(r=>{0!=Object.keys(r).length?kb.field.load(kb.config[x].app,!0).then(p=>{d.app={id:kb.config[x].app,fields:p.origin};d.fieldInfos=p;try{(l=>{0!=l.length?A(l,b.record,!0).then(q=>g(b)).catch(()=>g(b)):g(b)})(JSON.parse(r.tab).map((l,q)=>kb.extend({sIndex:{value:q.toString()}},l.setting)).reduce((l,q)=>{(b.mobile?["both","mobile"]:["both","pc"]).includes(q.device.value)&&q.event.value.includes(b.pattern)&&l.push(q);return l},
[]))}catch(l){kb.alert(kb.error.parse(l)),g(b)}}).catch(p=>g(b)):g(b)}).catch(r=>g(b))}))})(kintone.$PLUGIN_ID);