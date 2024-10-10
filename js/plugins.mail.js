/*
* FileName "plugins.mail.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(z=>{var c={},B=(b,g,C=!1)=>new Promise((u,p)=>{var l="",q=(e,h)=>{var d=()=>{e++;e<b.length?q(e,h):h()};(a=>{var n=kb.filter.scan(c.app,g,a.condition.value);n?kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(v=>{if(v){var y=(k,m,w)=>{"HTML"==a.format.value&&(k=k.replace(/\r/g,"").replace(/\n/g,"<br>"));for(var f in m){var r=m[f].value;f in c.fieldInfos.parallelize&&("HTML"==a.format.value&&"MULTI_LINE_TEXT"==c.fieldInfos.parallelize[f].type&&(r=r.replace(/\r/g,"").replace(/\n/g,
"<br>")),k=k.replace(new RegExp("%"+f+"%","g"),kb.field.stringify(c.fieldInfos.parallelize[f],r," / ",!0)))}for(f in w)r=w[f].value,f in c.fieldInfos.parallelize&&("HTML"==a.format.value&&"MULTI_LINE_TEXT"==c.fieldInfos.parallelize[f].type&&(r=r.replace(/\r/g,"").replace(/\n/g,"<br>")),k=k.replace(new RegExp("%"+f+"%","g"),kb.field.stringify(c.fieldInfos.parallelize[f],r," / ",!0)));return k};(k=>{var m=w=>{(f=>{var r=(t,x)=>{0!=f.attachment.length?kb.file.download(f.attachment[t],!0).then(A=>{kb.field.blobToBase64(A,
D=>{f.attachment[t].data=D;t++;t<f.attachment.length?r(t,x):x()})}).catch(A=>{kb.alert(kb.error.parse(A));p()}):x()};r(0,()=>{kb.encrypt(JSON.stringify(f.data),l).then(t=>{var x=fetch,A="https://api.kintone-booster.com/mail/"+kb.operator.language,D=JSON,F=D.stringify;f.data=t.data;f.iv=t.iv;f.tag=t.tag;x(A,{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest"},body:F.call(D,f)}).then(E=>{E.json().then(G=>{switch(E.status){case 200:w++;w<k.length?m(w):d();break;default:kb.alert(kb.error.parse(G)),
p()}})}).catch(E=>{kb.alert(kb.error.parse(E));p()})}).catch(t=>{p()})})})(k[w])};0!=k.length?m(0):d()})((()=>{var k=[];(c.fieldInfos.parallelize[a.to.value].tableCode?n[c.fieldInfos.parallelize[a.to.value].tableCode].value:[{value:n}]).each((m,w)=>{if(m.value[a.to.value].value){w=k.push;var f={mail:a.mail.value,sender:a.sender.value,host:a.host.value,port:a.port.value,author:a.author.value,pwd:a.pwd.value,secure:a.secure.value,to:m.value[a.to.value].value,cc:y(a.cc.value,n,c.fieldInfos.parallelize[a.to.value].tableCode?
m.value:{}),bcc:y(a.bcc.value,n,c.fieldInfos.parallelize[a.to.value].tableCode?m.value:{}),html:"HTML"==a.format.value},r=y(a.subject.value,n,c.fieldInfos.parallelize[a.to.value].tableCode?m.value:{}),t=y(a.body.value,n,c.fieldInfos.parallelize[a.to.value].tableCode?m.value:{}),x=[];a.attachment.value&&a.attachment.value in c.fieldInfos.parallelize&&(x=(c.fieldInfos.parallelize[a.attachment.value].tableCode?m.value:n)[a.attachment.value].value);w.call(k,{data:f,subject:r,body:t,attachment:x})}});
return k})())}else d()}).catch(v=>{kb.alert(kb.error.parse(v));p()}):d()})(b[e])};fetch("https://api.kintone-booster.com/mail/"+kb.operator.language,{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>{e.json().then(h=>{switch(e.status){case 200:l=h.passphrase;C||kb.loadStart();q(0,()=>{C||kb.loadEnd();u()});break;default:kb.alert(kb.error.parse(h)),p()}})}).catch(e=>{kb.alert(kb.error.parse(e));p()})});kintone.events.on("app.record.create.submit.success app.record.detail.process.proceed app.record.detail.show app.record.edit.submit.success app.record.index.show mobile.app.record.create.submit.success mobile.app.record.detail.process.proceed mobile.app.record.detail.show mobile.app.record.edit.submit.success mobile.app.record.index.show".split(" "),
b=>new Promise((g,C)=>{((u,p)=>{c.mobile=u;c.type=p;kb.config[z].config.get().then(l=>{0!=Object.keys(l).length?kb.field.load(kb.config[z].app,!0).then(q=>{c.app={id:kb.config[z].app,fields:q.origin};c.fieldInfos=q;try{(e=>{if(0!=e.length)switch(c.type){case "create":case "edit":B(e,b.record).then(d=>g(b)).catch(()=>{});break;case "process":(d=>{0!=d.length?B(d,b.record).then(a=>g(b)).catch(()=>{}):g(b)})(e.filter(d=>d.action.value==b.action.value+":"+b.status.value+":"+b.nextStatus.value));break;
case "detail":var h=d=>{(a=>{kb.filter.scan(c.app,b.record,a.condition.value)?kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(n=>{n&&kb.button.create(c.mobile,c.type,"kb-mail-button"+d.toString(),a.label.value,a.message.value,()=>B([a],b.record).then(v=>kb.alert("Done!")).catch(()=>{}));d++;d<e.length&&h(d)}).catch(n=>{d++;d<e.length&&h(d)}):(d++,d<e.length&&h(d))})(e[d])};h(0);g(b);break;case "index":h=d=>{(a=>{kb.filter.auth(a.user.value,a.organization.value,a.group.value).then(n=>
{n&&(a.view.value&&a.view.value!=b.viewId.toString()||kb.button.create(c.mobile,c.type,"kb-mail-button"+d.toString(),a.label.value,a.message.value,()=>{kb.view.records.get(c.app.id,(c.mobile?kintone.mobile.app:kintone.app).getQueryCondition()).then(v=>{let y=(k,m)=>{B([a],v[k],!0).then(w=>{kb.progressUpdate();k++;k<v.length?y(k,m):m()}).catch(()=>{})};0!=v.length?(kb.progressStart(v.length),y(0,()=>kb.alert("Done!"))):kb.alert("There are no records.")}).catch(v=>kb.alert(kb.error.parse(v)))}));d++;
d<e.length&&h(d)}).catch(n=>{d++;d<e.length&&h(d)})})(e[d])},h(0),g(b)}else g(b)})(JSON.parse(l.tab).map((e,h)=>kb.extend({sIndex:{value:h.toString()}},e.setting)).reduce((e,h)=>{(c.mobile?["all","both","mobile"]:["all","both","pc"]).includes(h.device.value)&&h.event.value.includes(c.type)&&e.push(h);return e},[]))}catch(e){kb.alert(kb.error.parse(e)),g(b)}}).catch(q=>g(b)):g(b)}).catch(l=>g(b))})("mobile"==b.type.split(".").first(),(u=>{switch(u){case "submit":u=b.type.split(".").slice(-3).first()}return u})(b.type.split(".").slice(-2).first()))}));
kb.event.on("kb.mail.call",b=>new Promise((g,C)=>{kb.config[z].config.get().then(u=>{0!=Object.keys(u).length?kb.field.load(kb.config[z].app,!0).then(p=>{c.app={id:kb.config[z].app,fields:p.origin};c.fieldInfos=p;try{(l=>{0!=l.length?B(l,b.record,!0).then(q=>g(b)).catch(()=>g(b)):g(b)})(JSON.parse(u.tab).map((l,q)=>kb.extend({sIndex:{value:q.toString()}},l.setting)).reduce((l,q)=>{(b.mobile?["all","both","mobile"]:["all","both","pc"]).includes(q.device.value)&&q.event.value.includes(b.pattern)&&l.push(q);
return l},[]))}catch(l){kb.alert(kb.error.parse(l)),g(b)}}).catch(p=>g(b)):g(b)}).catch(u=>g(b))}))})(kintone.$PLUGIN_ID);