/*
* FileName "main.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';window.KintoneBoosterEcho=class{constructor(){}build(l,k){try{window.kb.attachment=new KintoneBoosterAttachment,window.kb.field=new KintoneBoosterField,window.kb.filter=new KintoneBoosterFilter,window.kb.formula=new KintoneBoosterFormula,window.kb.record=new KintoneBoosterRecord,window.kb.table=new KintoneBoosterTable,window.kb.view=new KintoneBoosterView,kb.field.load(l).then(f=>{this.app={id:l,fields:((d,b)=>{var a={},c;for(c in d){var g=d[c];g.tableCode?g.tableCode in a||(a[g.tableCode]=
b[g.tableCode]):a[c]=g}return a})(f.parallelize,f.tables),view:{edit:k.injector.edit,fields:k.view.fields}};this.controller={access:new KintoneBoosterEchoAccessController(k.access,f.origin),injector:(d=>{d.contents.addClass("kb-echo-popup");return d})(new KintoneBoosterPopupwindow(kb.create("iframe").addClass("kb-echo-popup-contents"),"full","full",[]))};this.view={build:()=>{(d=>{kb.elm("body").append((b=>this.setting.ui.container=b)(kb.create("div").addClass("kb-echo")).append(kb.create("div").addClass("kb-echo-main").append((b=>
{this.setting.ui.header=b;return b.on("show",a=>d())})(kb.create("header").addClass("kb-echo-header")).append(kb.create("div").addClass("kb-echo-header-title").html(this.setting.title)).append(kb.create("div").addClass("kb-echo-header-description").html(this.setting.description?this.setting.description.replace(/\n/g,"<br>"):"")).append((b=>{b.append(kb.create("button").addClass("kb-icon kb-icon-filter").on("click",a=>{kb.filter.build(this.setting.filter.app,this.setting.filter.query,c=>{this.setting.filter.query=
c;this.setting.filter.offset=0;this.view.load().then(()=>{}).catch(()=>{})})}));switch(this.setting.view.type){case "CALENDAR":b.append((()=>{this.setting.filter.prev=kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-left").on("click",a=>{this.setting.filter.monitor.html((new Date(this.setting.filter.monitor.text()+"-01")).calc("-1 month").format("Y-m"));this.view.load().then(()=>{}).catch(()=>{})});return this.setting.filter.prev})()).append((()=>{this.setting.filter.next=kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-right").on("click",
a=>{this.setting.filter.monitor.html((new Date(this.setting.filter.monitor.text()+"-01")).calc("1 month").format("Y-m"));this.view.load().then(()=>{}).catch(()=>{})});return this.setting.filter.next})()).append((()=>{this.setting.filter.monitor=kb.create("span").addClass("kb-echo-header-filter-monitor").html((new Date).format("Y-m"));return this.setting.filter.monitor})()).append(kb.create("button").addClass("kb-icon kb-icon-date").on("click",a=>{kb.pickupDate(this.setting.filter.monitor.text()+"-01",
c=>{this.setting.filter.monitor.html((new Date(c)).format("Y-m"));this.view.load().then(()=>{}).catch(()=>{})})}));break;case "LIST":b.append((()=>{this.setting.filter.prev=kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-left").on("click",a=>{this.setting.filter.offset-=this.setting.filter.limit;this.view.load().then(()=>{}).catch(()=>{})});return this.setting.filter.prev})()).append((()=>{this.setting.filter.next=kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-right").on("click",
a=>{this.setting.filter.offset+=this.setting.filter.limit;this.view.load().then(()=>{}).catch(()=>{})});return this.setting.filter.next})()).append((()=>{this.setting.filter.monitor=kb.create("span").addClass("kb-echo-header-filter-monitor");return this.setting.filter.monitor})()).append(kb.create("div").addClass("kb-echo-header-filter-cases kb-dropdown").append(kb.create("select").assignOption([{code:25,label:"/25 rec"},{code:50,label:"/50 rec"},{code:100,label:"/100 rec"}],"label","code").val(this.setting.filter.limit).on("change",
a=>{this.setting.filter.offset=0;this.setting.filter.limit=parseInt(a.currentTarget.val());this.view.load().then(()=>{}).catch(()=>{})}))),this.setting.injector.add&&b.append(kb.create("button").addClass("kb-icon kb-icon-add").on("click",a=>kb.event.call("kb.create.call",{})))}return b})(kb.create("div").addClass("kb-echo-header-filter"))).append(kb.create("div").addClass("kb-echo-header-space"))).append((b=>{this.setting.ui.body=b;switch(this.setting.view.type){case "LIST":this.setting.ui.body.addClass("kb-view-container")}return b})(kb.create("main").addClass("kb-echo-body")))));
window.on("resize",b=>d())})(()=>{if(this.setting.ui.container.visible())switch(this.setting.ui.header.css({width:(this.setting.ui.container.innerWidth()-8).toString()+"px"}),this.setting.view.type){case "CALENDAR":this.setting.ui.body.elm(".kb-calendar")&&this.setting.ui.body.elm(".kb-calendar").elm("thead").css({top:this.setting.ui.header.outerHeight().toString()+"px"});break;case "LIST":this.setting.ui.body.elm(".kb-view")&&this.setting.ui.body.elm(".kb-view").elm("thead").css({top:this.setting.ui.header.outerHeight().toString()+
"px"})}});switch(this.setting.view.type){case "CALENDAR":this.setting.ui.calendar=new KintoneBoosterCalendar(!0);this.setting.ui.body.append(this.setting.ui.calendar.calendar.addClass("kb-calendar"));break;case "LIST":this.setting.ui.list=kb.view.create(this.setting.ui.body,this.app,this.setting.view.id).elm(".kb-view")}this.view.load().then(()=>{}).catch(()=>{})},load:()=>new Promise((d,b)=>{kb.loadStart();kb.api(kb.api.url("/api/records"),"GET",{app:this.app.id,query:(()=>{var a=[];this.setting.view.filterCond&&
a.push("("+this.setting.view.filterCond+")");this.setting.filter.query&&a.push("("+kb.filter.query.parse.expand(this.app,this.setting.filter.query).map(c=>c.field+" "+c.operator+" "+c.value).join(" and ")+")");switch(this.setting.view.type){case "CALENDAR":a.push((c=>{var g=[],e=(h,m)=>{switch(this.app.fields[this.setting.view.date].type){case "DATE":h=m=="prev"?h.calc("-1 day").format("Y-m-d"):h.calc("1 month").format("Y-m-d");break;default:h=m=="prev"?h.calc("-1 second").calc(kb.timezoneOffset()+
" hour").format("ISO"):h.calc("1 month").calc(kb.timezoneOffset()+" hour").format("ISO")}return h};g.push(this.setting.view.date+'!=""');g.push(this.setting.view.date+'>"'+e(c,"prev")+'"');g.push(this.setting.view.date+'<"'+e(c,"next")+'"');return"("+g.join(" and ")+")"})(new Date(this.setting.filter.monitor.text()+"-01")))}a=a.join(" and ");this.setting.view.sort&&(a+=" order by "+this.setting.view.sort);return a+=" limit "+this.setting.filter.limit+" offset "+this.setting.filter.offset})()}).then(a=>
{switch(this.setting.view.type){case "CALENDAR":kb.event.call("kb.view.load",{container:this.setting.ui.list,records:a.records,totalCount:Number(a.totalCount)}).then(c=>{if(c.error)kb.loadEnd(),b();else{var g=(e,h)=>{c.records.length!=0?kb.event.call("kb.style.call",{container:this.setting.ui.body,record:c.records[e],pattern:"detail"}).then(m=>{e++;e<c.records.length?g(e,h):h()}).catch(m=>{e++;e<c.records.length?g(e,h):h()}):h()};g(0,()=>{this.setting.ui.calendar.show(new Date(this.setting.filter.monitor.text()+
"-01"),null,{create:(e,h,m)=>{e.append((n=>{n.append(kb.create("span").addClass("kb-calendar-cell-guide").css(m).html(h.getDate().toString()));this.setting.view.title in this.app.fields&&((p,u)=>{p.noLabel=!0;u.each((t,v)=>{(q=>{n.append((r=>{r.append(kb.field.activate(kb.field.create(p).addClass("kb-picker kb-readonly").css({width:"100%"}),q));if(this.setting.injector.edit)r.on("click",w=>kb.event.call("kb.edit.call",{recordId:t.$id.value}));kb.record.set(r,q,t);return r})(kb.create("div").addClass("kb-scope kb-calendar-cell-item")))})({id:this.app.id,
fields:(()=>{var q={};q[p.code]=p;return q})()})})})(kb.extend({},this.app.fields[this.setting.view.title]),c.records.filter(p=>(new Date(p[this.setting.view.date].value)).getDate()==h.getDate()));this.setting.injector.add&&n.append(kb.create("button").addClass("kb-icon kb-icon-add kb-calendar-cell-button").on("click",p=>kb.event.call("kb.create.call",{date:h.format("Y-m-d")})));return n})(kb.create("div").addClass("kb-calendar-cell")))}});kb.loadEnd();this.setting.ui.container.show();kb.event.call("kb.view.load.complete",
{container:c.container});d()})}});break;case "LIST":kb.event.call("kb.view.load",{container:this.setting.ui.list,records:a.records,totalCount:Number(a.totalCount)}).then(c=>{if(c.error)kb.loadEnd(),b();else{var g=()=>{var e=this.setting.filter,h=e.monitor,m=h.html;var n=(e.offset+1).comma()+"&nbsp;-&nbsp;"+(e.offset+c.records.length).comma()+"&nbsp;of&nbsp;"+c.totalCount.comma();m.call(h,n);e.offset>0?e.prev.removeAttr("disabled"):e.prev.attr("disabled","disabled");e.offset+(e.limit==c.records.length?
e.limit:c.records.length)<c.totalCount?e.next.removeAttr("disabled"):e.next.attr("disabled","disabled");kb.loadEnd();this.setting.ui.container.show();kb.event.call("kb.view.load.complete",{container:c.container});d()};this.setting.ui.list.clearRows();c.totalCount!=0?c.records.each((e,h)=>{(m=>{kb.event.call("kb.style.call",{container:m.elm("[form-id=form_"+this.app.id+"]"),record:e,pattern:"detail"}).then(n=>{kb.record.set(m.elm("[form-id=form_"+this.app.id+"]"),this.app,n.record).then(()=>{h==a.records.length-
1&&g()})}).catch(()=>{})})(this.setting.ui.list.addRow())}):g()}})}}).catch(a=>{kb.alert(kb.error.parse(a));b()})})};this.setting=kb.extend({filter:{app:{id:l,fields:((d,b)=>{var a={};switch(k.view.type){case "CALENDAR":a[k.view.title]=d[k.view.title];break;case "LIST":for(var c in d)if(k.view.fields.includes(c))switch(d[c].type){case "SUBTABLE":var g=void 0,e=b[c];for(g in e.fields)a[g]=e.fields[g];break;default:a[c]=d[c]}}return a})(f.origin,f.tables)},query:"",offset:0,limit:100,monitor:null,prev:null,
next:null},ui:{container:null,header:null,body:null,calendar:null,list:null}},k);kb.event.on("kb.create.call",d=>{kb.api(kb.api.url("/api/access"),"GET",{}).then(b=>{(a=>{switch(k.view.type){case "CALENDAR":a[k.view.date]={value:d.date}}(c=>{var g=[];g.push("pre="+encodeURIComponent(c));g.push("sender="+encodeURIComponent(window.location.origin));this.controller.injector.contents.elm("iframe").hide().attr("src",this.setting.injector.add+"?"+g.join("&")).off("load").on("load",e=>e.currentTarget.show());
this.controller.injector.show()})(btoa((new TextEncoder).encode(JSON.stringify(a)).reduce((c,g)=>c+String.fromCharCode(g),"")))})(JSON.parse(atob(b.fields)))}).catch(b=>kb.alert(kb.error.parse(b)));return d});kb.event.on("kb.edit.call",d=>{var b=[];b.push("id="+d.recordId);b.push("pattern="+this.setting.injector.pattern);b.push("sender="+encodeURIComponent(window.location.origin));this.controller.injector.contents.elm("iframe").hide().attr("src",this.setting.injector.edit+"?"+b.join("&")).off("load").on("load",
a=>a.currentTarget.show());this.controller.injector.show();return d});window.addEventListener("message",d=>{event.origin=="https://injector.kintone-booster.com"&&event.data=="Done"&&this.view.load().then(()=>{this.controller.injector.hide()}).catch(()=>{})});Object.keys(this.controller.access.app.fields).length!=0?this.controller.access.show(()=>this.view.build()):this.view.build()})}catch(f){kb.alert(kb.error.parse(f))}}};
window.KintoneBoosterEchoAccessController=class extends KintoneBoosterDialog{constructor(l,k){super(999996,!1,!1);this.app={id:"access",fields:(()=>{var f=l.fields.reduce((d,b)=>{var a=k[b];switch(a.type){case "LINK":d[b]={code:b,type:"LINK",label:kb.constants.echo.caption.access.field[kb.operator.language].replace(/\*\*\*/g,a.label),required:!1,noLabel:!1,placeholder:"",protocol:a.protocol};break;case "NUMBER":d[b]={code:b,type:"NUMBER",label:kb.constants.echo.caption.access.field[kb.operator.language].replace(/\*\*\*/g,
a.label),required:!1,noLabel:!1,digit:a.digit};break;default:d[b]={code:b,type:"SINGLE_LINE_TEXT",label:kb.constants.echo.caption.access.field[kb.operator.language].replace(/\*\*\*/g,a.label),required:!1,noLabel:!1,placeholder:"",format:"text"}}return d},{});l.pass&&(f.$pass={code:"$pass",type:"SINGLE_LINE_TEXT",label:kb.constants.echo.caption.access.pass[kb.operator.language],required:!0,noLabel:!1,placeholder:"",format:"password"});return f})()};this.handler=null;this.header.css({paddingLeft:"0.25em",
textAlign:"left"}).html("Access Controller");this.container.css({height:"auto",width:"35em"});this.contents.css({padding:"0"}).append((f=>{for(var d in this.app.fields)f.append(kb.field.activate(kb.field.create(this.app.fields[d]).css({width:"100%"}),this.app));f.elms("input,select,textarea").each((b,a)=>b.initialize());return f})(kb.create("div").addClass("kb-scope").attr("form-id","form_"+this.app.id)));window.on("resize",f=>{this.contents.css({height:"auto"}).css({height:this.container.innerHeight().toString()+
"px"})})}get(){return new Promise((l,k)=>{var f=kb.record.get(this.contents,this.app);f.error?l(f):kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],()=>{kb.api(kb.api.url("/api/access"),"POST",(d=>{var b={};"$pass"in d&&(b.$pass=d.$pass.value,delete d.$pass);b.fields=(a=>{for(var c in a)a[c].type=this.app.fields[c].type;return a})(d);return b})(f.record)).then(d=>{d.result!="ok"&&(f.error=!0);l(f)}).catch(d=>{kb.alert(kb.error.parse(d));l({error:!0})})})})}set(){return new Promise((l,
k)=>{kb.api(kb.api.url("/api/access"),"GET",{}).then(f=>{kb.record.set(this.contents,this.app,(d=>{"$pass"in this.app.fields&&(d.$pass={value:""});return d})(JSON.parse(atob(f.fields))));l(!1)}).catch(f=>{kb.alert(kb.error.parse(f));l(!0)})})}show(l){this.handler&&(this.ok.off("click",this.handler),this.cancel.off("click"));this.handler=k=>{this.get().then(f=>{f.error||(l(),this.hide())})};this.ok.attr("tabstop","tabstop").on("click",this.handler);this.cancel.on("click",k=>this.hide());this.set().then(k=>
{k||(this.contents.css({height:"auto"}).css({height:this.container.innerHeight().toString()+"px"}),super.show(),this.contents.elm("input,select,textarea").focus())})}};window.kb.echo||(window.kb.echo=new KintoneBoosterEcho);
kb.constants=kb.extend({echo:{caption:{access:{field:{en:"Please enter ***.",ja:"***\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u8f93\u5165 ***\u3002"},pass:{en:"Please enter your password.",ja:"\u30d1\u30b9\u30ef\u30fc\u30c9\u3092\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u8f93\u5165\u60a8\u7684\u5bc6\u7801\u3002"}}},description:{},message:{confirm:{},invalid:{}}}},kb.constants);