/*
* FileName "plugins.calendar.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(r=>{var k={},u=(l,c)=>{(a=>{var n=new FullCalendar.Calendar(l.addClass("kb-calendar"),{buttonText:(()=>{var b={};switch(kb.operator.language){case "en":b={month:"month",week:"week",day:"day"};break;case "ja":b={month:"\u6708",week:"\u9031",day:"\u65e5"};break;case "zh":b={month:"\u6708",week:"\u5468",day:"\u65e5"};break;case "zh-TW":b={month:"\u6708",week:"\u9031",day:"\u5929"}}return b})(),customButtons:{pickup:{text:"",click:b=>{kb.pickupDate(n.getDate().format("Y-m-d"),e=>{n.gotoDate(new Date(e))})}}},
contentHeight:"auto",editable:a.editable,eventDurationEditable:!a.singleDay,firstDay:parseInt((c.first||{value:"0"}).value),headerToolbar:{left:"prev,next,pickup,title",right:Object.values(a.type).join(",")},height:"auto",initialDate:a.session.date,initialView:(b=>{switch(b){case "day":b=a.type.day;break;case "month":b=a.type.month;break;case "week":b=a.type.week}return b})(a.session.initial),navLinks:!0,nowIndicator:a.singleDay?!1:a.time.start||a.time.end,selectable:a.editable,timeZone:"local",datesSet:b=>
{sessionStorage.setItem("kb-calendar-"+c.view.value,JSON.stringify({date:n.getDate().toISOString(),initial:b.view.type}));window.scrollTo(0,0)},eventChange:b=>{kb.view.records.set(k.app.id,{put:(()=>{var e={id:b.event.extendedProps.recordId,record:{}};(g=>{a.tableCode?e.record[a.tableCode]={value:k.records[b.event.extendedProps.recordId][a.tableCode].value.map(d=>{d.id==b.event.extendedProps.rowId&&(d.value[c.start.value]={value:a.time.start?g.start.toISOString():g.start.format("Y-m-d")});return d})}:
e.record[c.start.value]={value:a.time.start?g.start.toISOString():g.start.format("Y-m-d")};!a.singleDay&&g.end&&(a.tableCode?e.record[a.tableCode]={value:k.records[b.event.extendedProps.recordId][a.tableCode].value.map(d=>{d.id==b.event.extendedProps.rowId&&(d.value[c.end.value]={value:a.time.end?g.end.toISOString():g.end.format("Y-m-d")});return d})}:e.record[c.end.value]={value:a.time.end?g.end.toISOString():g.end.format("Y-m-d")})})({start:b.event.start,end:(()=>{var g=null;a.singleDay||b.event.end&&
(g=a.time.end?b.event.end:a.time.start?0==b.event.end.getHours()+b.event.end.getMinutes()?b.event.end.calc("-1 day"):b.event.end:b.event.end.calc((b.event.allDay?"-1":"0")+" day"));return g})()});return[e]})()}).then(e=>{}).catch(e=>kb.alert(kb.error.parse(e)))},eventDidMount:b=>{b.el.elms(".fc-event-time,.fc-event-title").each((e,g)=>{e.on("touchstart,mousedown",d=>{d.stopPropagation()}).on("click",d=>{kb.confirm(kb.constants.calendar.message.confirm.edit[kb.operator.language],()=>{(c.page||{value:[]}).value.includes("detail")||
sessionStorage.setItem("kb-calendar-edit",JSON.stringify({href:window.location.href}));window.location.href=b.event.extendedProps.url});d.stopPropagation();d.preventDefault()})})},events:(b,e,g)=>{kb.view.records.get(k.app.id,(d=>{var p=[],m=(f,h,q)=>a.timeStamp[f]?((a.time[f]?h.calc(q+" second").getTime():h.calc(q+" day").getTime())/1E3).toString():'"'+(a.time[f]?h.calc(q+" second").toISOString():h.calc(q+" day").format("Y-m-d"))+'"';p.push((()=>{var f=[];f.push(c.start.value+(a.tableCode?' not in ("")':
'!=""'));f.push(c.start.value+">"+m("start",b.start,"-1"));f.push(c.start.value+"<"+m("start",b.end,"1"));return"("+f.join(" and ")+")"})());a.singleDay||(p.push((()=>{var f=[];f.push(c.end.value+(a.tableCode?' not in ("")':'!=""'));f.push(c.end.value+">"+m("end",b.start,"-1"));f.push(c.end.value+"<"+m("end",b.end,"1"));return"("+f.join(" and ")+")"})()),p.push((()=>{var f=[];f.push(c.start.value+"<"+m("start",b.start,"0"));f.push(c.end.value+">"+m("end",b.end,"0"));return"("+f.join(" and ")+")"})()));
return(d?"("+d+") and ":"")+"("+p.join(" or ")+")"})((k.mobile?kintone.mobile.app:kintone.app).getQueryCondition()),(d=>{d=d.match(/order by/g)?d.replace(/^.*order by/g,""):"";return(d=d.replace(/limit [0-9]+/g,"").replace(/ offset [0-9]+/g,"").replace(/^[ ]+/g,"").replace(/[ ]+$/g,""))?d:"$id asc"})((k.mobile?kintone.mobile.app:kintone.app).getQuery())).then(d=>{var p=(m,f)=>{kb.event.call("kb.style.call",{container:kb.elm("body"),record:d[m],mobile:k.mobile,pattern:"detail",workplace:"view"}).then(h=>
{m++;m<d.length?p(m,f):f()}).catch(h=>{m++;m<d.length?p(m,f):f()})};k.records={};0!=d.length?p(0,()=>{e((m=>m.map(f=>(h=>{(c.allday||{value:[]}).value.includes("enabled")&&n.view.type.match(/^timeGrid/g)&&h.start&&h.end&&"00:00"==(new Date(h.start)).format("H:i")&&"00:00"==(new Date(h.end)).format("H:i")&&(h.allDay=!0);return h})({title:kb.field.stringify(k.fieldInfos.parallelize[c.title.value],f[c.title.value].value," / "),start:(h=>{a.singleDay||a.time.start||a.time.end&&(h=(new Date(h)).calc(kb.timezoneOffset()+
" hour").toISOString());return h})(f[c.start.value].value),end:(h=>{a.singleDay||(a.time.start?a.time.end||(h=(new Date(h)).calc("1 day").calc(kb.timezoneOffset()+" hour").toISOString()):a.time.end||(h=(new Date(h)).calc("1 day").format("Y-m-d")));return h})(a.singleDay?null:f[c.end.value].value),backgroundColor:f[c.title.value].backcolor,borderColor:f[c.title.value].backcolor,textColor:f[c.title.value].forecolor,extendedProps:{recordId:f.$id.value,rowId:"$rowId"in f?f.$rowId:-1,url:((h,q,t)=>h?kb.record.page.detail(k.mobile,
q,t):kb.record.page.edit(k.mobile,q,t))((c.page||{value:[]}).value.includes("detail"),kb.config[r].app,f.$id.value)}})))(d.reduce((m,f)=>{k.records[f.$id.value]=f;a.tableCode?m=m.concat(f[a.tableCode].value.map(h=>{h.value.$id=f.$id;h.value.$rowId=h.id;return h.value})):m.push(f);return m},[])))}):e([])}).catch(d=>kb.alert(kb.error.parse(d)))},select:b=>{(e=>{a.singleDay?e.start.format("Y-m-d")==e.end.format("Y-m-d")&&kb.confirm((()=>{var g=kb.constants.calendar.message.confirm.create.single[kb.operator.language];
return g=g.replace(/%date%/,e.start.format(a.time.start?"Y-m-d H:i":"Y-m-d"))})(),()=>{sessionStorage.setItem("kb-calendar-create",JSON.stringify({href:window.location.href,start:{code:c.start.value,tableCode:a.tableCode,value:a.time.start?e.start.toISOString():e.start.format("Y-m-d")}}));window.location.href=kb.record.page.add(k.mobile,kb.config[r].app)}):kb.confirm((()=>{var g=kb.constants.calendar.message.confirm.create.multi[kb.operator.language];g=g.replace(/%start%/,e.start.format(a.time.start?
"Y-m-d H:i":"Y-m-d"));return g=g.replace(/%end%/,e.end.format(a.time.end?"Y-m-d H:i":"Y-m-d"))})(),()=>{sessionStorage.setItem("kb-calendar-create",JSON.stringify({href:window.location.href,start:{code:c.start.value,tableCode:a.tableCode,value:a.time.start?e.start.toISOString():e.start.format("Y-m-d")},end:{code:c.end.value,tableCode:a.tableCode,value:a.time.end?e.end.toISOString():e.end.format("Y-m-d")}}));window.location.href=kb.record.page.add(k.mobile,kb.config[r].app)})})({start:b.start,end:a.time.end?
b.end:b.end.calc((b.allDay?"-1":"0")+" day")});n.unselect()}});n.setOption("locale",kb.operator.language);n.render()})((a=>{var n=a.start.isEditable&&a.end.isEditable,b=!c.end.value;var e=(e=sessionStorage.getItem("kb-calendar-"+c.view.value))?JSON.parse(e):{date:(new Date).format("Y-m-d"),initial:c.initial.value};return{editable:n,singleDay:b,session:e,tableCode:k.fieldInfos.parallelize[c.title.value].tableCode,time:{start:a.start.isDateTime,end:a.end.isDateTime},timeStamp:{start:a.start.isTimeStamp,
end:a.end.isTimeStamp},type:{month:"dayGridMonth",week:c.end.value?a.start.isDateTime||a.end.isDateTime?"timeGridWeek":"dayGridWeek":"dayGridWeek",day:c.end.value?a.start.isDateTime||a.end.isDateTime?"timeGridDay":"dayGridDay":"dayGridDay"}}})({start:(a=>{switch(a.type){case "CALC":switch(a.format){case "DATE":a.isDateTime=!1;a.isEditable=!1;break;case "DATETIME":a.isDateTime=!0,a.isEditable=!1}a.isTimeStamp=!0;break;case "CREATED_TIME":case "UPDATED_TIME":a.isDateTime=!0;a.isEditable=!1;a.isTimeStamp=
!1;break;case "DATE":a.isDateTime=!1;a.isEditable=!0;a.isTimeStamp=!1;break;case "DATETIME":a.isDateTime=!0,a.isEditable=!0,a.isTimeStamp=!1}return a})(k.fieldInfos.parallelize[c.start.value]),end:(a=>{switch(a.type){case "CALC":switch(a.format){case "DATE":a.isDateTime=!1;a.isEditable=!1;break;case "DATETIME":a.isDateTime=!0,a.isEditable=!1}a.isTimeStamp=!0;break;case "CREATED_TIME":case "UPDATED_TIME":a.isDateTime=!0;a.isEditable=!1;a.isTimeStamp=!1;break;case "DATE":a.isDateTime=!1;a.isEditable=
!0;a.isTimeStamp=!1;break;case "DATETIME":a.isDateTime=!0;a.isEditable=!0;a.isTimeStamp=!1;break;default:a.isDateTime=!1,a.isEditable=!0,a.isTimeStamp=!1}return a})(c.end.value?k.fieldInfos.parallelize[c.end.value]:{type:""})}))};kintone.events.on(["app.record.index.show","mobile.app.record.index.show"],l=>new Promise((c,a)=>{((n,b)=>{k.mobile=n;k.type=b;kb.config[r].config.get().then(e=>{0!=Object.keys(e).length?kb.field.load(kb.config[r].app,!0).then(g=>{k.app={id:kb.config[r].app,fields:g.origin};
k.fieldInfos=g;k.records={};try{(d=>{if(d){d.title.value&&(d.title.value in k.fieldInfos.parallelize||c(l));d.start.value&&(d.start.value in k.fieldInfos.parallelize||c(l));d.end.value&&(d.end.value in k.fieldInfos.parallelize||c(l));var p=kb.elm("#kb-calendar");p&&u(p,d)}c(l)})(JSON.parse(e.tab).map((d,p)=>kb.extend({sIndex:{value:p.toString()}},d.setting)).reduce((d,p)=>{p.view.value==l.viewId.toString()&&(d=p);return d},null))}catch(d){kb.alert(kb.error.parse(d)),c(l)}}).catch(g=>c(l)):c(l)}).catch(e=>
c(l))})("mobile"==l.type.split(".").first(),l.type.split(".").slice(-2).first())}));kintone.events.on(["app.record.create.show","mobile.app.record.create.show"],l=>new Promise((c,a)=>{(n=>{n&&((b=>{b.start&&((b.start.tableCode?l.record[b.start.tableCode].value.first().value[b.start.code]:l.record[b.start.code]).value=b.start.value);b.end&&((b.end.tableCode?l.record[b.end.tableCode].value.first().value[b.end.code]:l.record[b.end.code]).value=b.end.value);kintone.events.on(["app.record.create.submit.success",
"mobile.app.record.create.submit.success"],e=>new Promise((g,d)=>{e.url=b.href;g(e)}))})(JSON.parse(n)),sessionStorage.removeItem("kb-calendar-create"));c(l)})(sessionStorage.getItem("kb-calendar-create"))}));kintone.events.on(["app.record.edit.show","mobile.app.record.edit.show"],l=>new Promise((c,a)=>{(n=>{n&&((b=>{(e=>{e.parentNode.insertBefore(e.clone().removeAttr("disabled").on("click",g=>{window.location.href=b.href}),e.hide().nextElementSibling)})(kb.elm("mobile"==l.type.split(".").first()?
".gaia-mobile-v2-app-record-edittoolbar-cancel":".gaia-ui-actionmenu-cancel"));kintone.events.on(["app.record.edit.submit.success","mobile.app.record.edit.submit.success"],e=>new Promise((g,d)=>{e.url=b.href;g(e)}))})(JSON.parse(n)),sessionStorage.removeItem("kb-calendar-edit"));c(l)})(sessionStorage.getItem("kb-calendar-edit"))}))})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({calendar:{message:{confirm:{create:{multi:{en:"Start Date: %start%<br>End Date: %end%<br>Would you like to add a record with the above details?",ja:"\u958b\u59cb\u65e5\u4ed8: %start%<br>\u7d42\u4e86\u65e5\u4ed8: %end%<br>\u4e0a\u8a18\u5185\u5bb9\u3067\u30ec\u30b3\u30fc\u30c9\u3092\u8ffd\u52a0\u3057\u307e\u3059\u304b\uff1f",zh:"\u5f00\u59cb\u65e5\u671f: %start%<br>\u7ed3\u675f\u65e5\u671f: %end%<br>\u60a8\u60f3\u6839\u636e\u4e0a\u8ff0\u5185\u5bb9\u6dfb\u52a0\u8bb0\u5f55\u5417\uff1f",
"zh-TW":"\u958b\u59cb\u65e5\u671f: %start%<br>\u7d50\u675f\u65e5\u671f: %end%<br>\u60a8\u60f3\u6839\u64da\u4e0a\u8ff0\u5167\u5bb9\u65b0\u589e\u8a18\u9304\u55ce\uff1f"},single:{en:"Date: %date%<br>Would you like to add a record with the above content?",ja:"\u65e5\u4ed8: %date%<br>\u4e0a\u8a18\u5185\u5bb9\u3067\u30ec\u30b3\u30fc\u30c9\u3092\u8ffd\u52a0\u3057\u307e\u3059\u304b\uff1f",zh:"\u65e5\u671f: %date%<br>\u60a8\u60f3\u6dfb\u52a0\u4e0a\u8ff0\u5185\u5bb9\u7684\u8bb0\u5f55\u5417\uff1f","zh-TW":"\u65e5\u671f: %date%<br>\u60a8\u60f3\u65b0\u589e\u4e0a\u8ff0\u5167\u5bb9\u7684\u8a18\u9304\u55ce\uff1f"}},
edit:{en:"Do you want to open the record?",ja:"\u30ec\u30b3\u30fc\u30c9\u3092\u958b\u304d\u307e\u3059\u304b\uff1f",zh:"\u60a8\u8981\u6253\u5f00\u8bb0\u5f55\u5417\uff1f","zh-TW":"\u60a8\u8981\u6253\u958b\u8a18\u9304\u55ce\uff1f"}}}}},kb.constants);
