/*
* FileName "plugins.linkage.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(F=>{var d={},I=(n,w)=>new Promise((G,A)=>{kb.field.load(n.app.value).then(u=>{(x=>{n.criteria.value.some(p=>!(p.value.external.value in x.external&&p.value.internal.value in x.internal))?(kb.alert("No field to linkage was found"),A()):n.mapping.value.some(p=>!(p.value.external.value in x.external))?(kb.alert("No field to linkage was found"),A()):(p=>{kb.view.records.get(n.app.value,p).then(g=>{0!=g.length?((r,t)=>{G((m=>{m.records.sort((b,h)=>{var k=0;n.sort.value.each((a,f)=>{var c=
f=null;switch(u.parallelize[a.value.field.value].type){case "CALC":switch(u.parallelize[a.value.field.value].format){case "NUMBER":case "NUMBER_DIGIT":f=b[a.value.field.value].value?parseFloat(b[a.value.field.value].value):0,c=h[a.value.field.value].value?parseFloat(h[a.value.field.value].value):0}break;case "CATEGORY":case "CHECK_BOX":case "CREATOR":case "FILE":case "GROUP_SELECT":case "MODIFIER":case "MULTI_SELECT":case "ORGANIZATION_SELECT":case "STATUS_ASSIGNEE":case "USER_SELECT":f=JSON.stringify(b[a.value.field.value].value);
c=JSON.stringify(h[a.value.field.value].value);break;case "NUMBER":f=b[a.value.field.value].value?parseFloat(b[a.value.field.value].value):0;c=h[a.value.field.value].value?parseFloat(h[a.value.field.value].value):0;break;default:f=b[a.value.field.value].value,c=h[a.value.field.value].value}switch(a.value.order.value){case "asc":f>c&&(k=1);f<c&&(k=-1);break;case "desc":f>c&&(k=-1),f<c&&(k=1)}if(k)return KB_BREAK});return k});return m})(r.reduce((m,b)=>{Array(t?b[t].value.length:1).fill().map(()=>({})).each((h,
k)=>{h.$id=b.$id;for(var a in u.parallelize)u.parallelize[a].tableCode?u.parallelize[a].tableCode==t&&(h[a]=b[t].value[k].value[a]):h[a]=b[a];m.records.push(h)});return m},{offset:0,records:[]})))})(g.reduce((r,t)=>{(t=kb.filter.scan({fields:u.origin},t,p))&&r.push(t);return r},[]),Array.from(new Set(n.mapping.value.map(r=>u.parallelize[r.value.external.value].tableCode))).join("")):G({offset:0,records:[]})}).catch(g=>{kb.alert(kb.error.parse(g));A()})})(n.criteria.value.reduce((p,g)=>{p.push(kb.filter.query.create(x.external[g.value.external.value],
g.value.operator.value,w[g.value.internal.value]));return p},kb.filter.query.parse(n.filter.value).map(p=>x.external[p.field].code+" "+p.operator+" "+p.value)).join(" and "))})({external:u.parallelize,internal:d.fieldInfos.parallelize})}).catch(u=>{kb.alert(kb.error.parse(u));A()})});kintone.events.on("app.record.create.show app.record.detail.show app.record.edit.show app.record.index.show mobile.app.record.create.show mobile.app.record.detail.show mobile.app.record.edit.show mobile.app.record.index.show".split(" "),
n=>new Promise((w,G)=>{((A,u)=>{d.mobile=A;d.type=u;kb.config[F].config.get().then(x=>{0!=Object.keys(x).length?kb.field.load(kb.config[F].app,!0).then(p=>{d.app={id:kb.config[F].app,fields:p.origin};d.fieldInfos=p;try{(g=>{if(0!=g.length){var r=(m,b,h)=>{var k=(a=>Array.from(new Set(a.map(f=>d.fieldInfos.parallelize[f.value.internal.value].tableCode))).reduce((f,c)=>{b[c].value=[];f[c]={fields:a.filter(e=>d.fieldInfos.parallelize[e.value.internal.value].tableCode==c),row:kb.record.create(d.fieldInfos.origin[c],
!1)};return f},{}))(m.mapping.value.reduce((a,f)=>{f.value.internal.value in d.fieldInfos.parallelize&&a.push(f);return a},[]));h.each((a,f)=>{for(var c in k)b[c].value.push((e=>{k[c].fields.each((v,y)=>{if(v.value.internal.value in d.fieldInfos.parallelize)switch(d.fieldInfos.parallelize[v.value.internal.value].type){case "lookup":y=a[v.value.external.value];e[v.value.internal.value]={lookup:!0,search:"search"in y?y.search:"",value:y.value};break;default:e[v.value.internal.value].value=a[v.value.external.value].value}});
return{value:e}})(kb.extend({},k[c].row)))});return b};d.mobile&&kb.elm("body").addClass("kb-mobile");switch(d.type){case "create":case "edit":case "detail":var t=m=>{(b=>{(h=>{h&&kb.field.load(b.app.value).then(k=>{(a=>{((f,c)=>{var e={},v=kb.create("button").addClass("kb-linkage-container-button").html(b.label.value).on("click",q=>{kb.confirm(b.message.value,()=>{kb.event.call("kb.action.call",{container:kb.elm("body"),record:r(b,(d.mobile?kintone.mobile.app.record:kintone.app.record).get().record,
e.records),mobile:d.mobile,pattern:"change",fields:(l=>l.reduce((z,C)=>z=z.concat(Object.keys(d.fieldInfos.tables[C].fields)),l))(b.mapping.value.reduce((l,z)=>{z.value.internal.value in d.fieldInfos.parallelize&&l.push(d.fieldInfos.parallelize[z.value.internal.value].tableCode);return l},[])),stopPropagation:!0,workplace:"record"}).then(l=>{kb.event.call("kb.style.call",{container:l.container,record:l.record,mobile:l.mobile,pattern:"$id"in l.record?l.record.$id.value?"edit":"create":"create",workplace:l.workplace}).then(z=>
{(d.mobile?kintone.mobile.app.record:kintone.app.record).set({record:z.record})}).catch(()=>{})}).catch(()=>{})})}),y=kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-left").on("click",q=>{e.offset-=c;D()}),E=kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-right").on("click",q=>{e.offset+=c;D()}),J=kb.create("button").addClass("kb-icon kb-icon-reload").on("click",q=>{H((d.mobile?kintone.mobile.app.record:kintone.app.record).get().record)}),B=kb.create("span").addClass("kb-linkage-container-monitor").html(""),
D=()=>{var q=e.records.slice(e.offset,e.offset+c);f.clearRows();q.each((l,z)=>{(C=>{kb.record.set(C.elm("[form-id=form_"+a.id+"]"),a,l).then(()=>{C.elm(".kb-view-row-edit").attr("href",kb.record.page.detail(d.mobile,a.id,l.$id.value)).attr("target","_blank");h.parentNode.show()})})(f.addRow())});switch(kb.operator.language){case "en":B.html(e.records.length.toString()+"records in total");break;case "ja":B.html("\u7dcf"+e.records.length.toString()+"\u884c");break;case "zh":B.html("\u5171"+e.records.length.toString()+
"\u6761\u8bb0\u5f55")}0<e.offset?y.removeAttr("disabled"):y.attr("disabled","disabled");e.offset+(c==q.length?c:q.length)<e.records.length?E.removeAttr("disabled"):E.attr("disabled","disabled")},H=q=>{I(b,q).then(l=>{e=l;D()}).catch(()=>{e={offset:0,records:[]};D()})};switch(d.type){case "create":case "edit":h.append(kb.create("div").addClass("kb-linkage-container-footer").append(B).append(J).append(y).append(E).append(v));break;case "detail":h.append(kb.create("div").addClass("kb-linkage-container-footer").append(B).append(J).append(y).append(E))}kintone.events.on(b.criteria.value.reduce((q,
l)=>{q.push("app.record.create.change."+l.value.internal.value);q.push("app.record.edit.change."+l.value.internal.value);q.push("mobile.app.record.create.change."+l.value.internal.value);q.push("mobile.app.record.edit.change."+l.value.internal.value);return q},[]),q=>H(q.record));H(n.record)})(kb.view.create(h.addClass("kb-linkage-container"),a,a.view.id,d.mobile).elm(".kb-view"),parseInt(b.limit.value))})({id:b.app.value,disables:[],fields:k.parallelize,view:{id:"linkage_"+b.app.value+"_"+b.container.value,
buttons:["delete"],fields:b.mapping.value.map(a=>a.value.external.value),mode:"viewer"}})}).catch(()=>{})})((d.mobile?kintone.mobile.app.record:kintone.app.record).getSpaceElement(b.container.value));m++;m<g.length&&t(m)})(g[m])};t(0);w(n);break;case "index":t=m=>{(b=>{kb.filter.auth(b.user.value,b.organization.value,b.group.value).then(h=>{h&&(b.view.value&&b.view.value!=n.viewId.toString()||kb.button.create(d.mobile,d.type,"kb-linkage-button"+m.toString(),b.label.value,b.message.value,()=>{kb.view.records.get(d.app.id,
(d.mobile?kintone.mobile.app:kintone.app).getQueryCondition()).then(k=>{var a=[];let f=(c,e)=>{I(b,k[c]).then(v=>{a.push(kb.view.records.transform(r(b,k[c],v.records)));kb.progressUpdate();c++;c<k.length?f(c,e):e()}).catch(()=>{})};0!=k.length?(kb.progressStart(k.length),f(0,()=>{kb.view.records.set(d.app.id,{put:a}).then(c=>kb.alert("Done!",()=>window.location.reload(!0))).catch(c=>kb.alert(kb.error.parse(c)))})):kb.alert("There are no records.")}).catch(k=>kb.alert(kb.error.parse(k)))}));m++;m<
g.length&&t(m)}).catch(h=>{m++;m<g.length&&t(m)})})(g[m])},t(0),w(n)}}else w(n)})(JSON.parse(x.tab).map((g,r)=>kb.extend({sIndex:{value:r.toString()}},g.setting)).reduce((g,r)=>{switch(d.type){case "index":r.bulk.value.includes("bulk")&&g.push(r);break;default:g.push(r)}return g},[]))}catch(g){kb.alert(kb.error.parse(g)),w(n)}}).catch(p=>w(n)):w(n)}).catch(x=>w(n))})("mobile"==n.type.split(".").first(),n.type.split(".").slice(-2).first())}))})(kintone.$PLUGIN_ID);