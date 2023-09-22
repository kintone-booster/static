/*
* FileName "plugins.calendar.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(q){var h={},t=function(l,c){(function(a){var n=new FullCalendar.Calendar(l.addClass("kb-calendar"),{buttonText:function(){var b={};switch(kb.operator.language){case "en":b={month:"month",week:"week",day:"day"};break;case "ja":b={month:"\u6708",week:"\u9031",day:"\u65e5"};break;case "zh":b={month:"\u6708",week:"\u5468",day:"\u65e5"}}return b}(),customButtons:{pickup:{text:"",click:function(b){kb.pickupDate(n.getDate().format("Y-m-d"),function(d){n.gotoDate(new Date(d))})}}},editable:a.editable,
eventDurationEditable:!a.singleDay,headerToolbar:{left:"prev,next,pickup,title",right:Object.values(a.type).join(",")},initialDate:a.session.date,initialView:function(b){switch(b){case "day":b=a.type.day;break;case "month":b=a.type.month;break;case "week":b=a.type.week}return b}(a.session.initial),navLinks:!0,nowIndicator:a.singleDay?!1:a.time.start||a.time.end,selectable:a.editable,timeZone:"local",datesSet:function(b){sessionStorage.setItem("kb-calendar-"+c.view.value,JSON.stringify({date:n.getDate().toISOString(),
initial:b.view.type}));window.scrollTo(0,0)},eventChange:function(b){kb.view.records.set(h.app.id,{put:function(){var d={id:b.event.extendedProps.recordId,record:{}};(function(g){a.tableCode?d.record[a.tableCode]={value:h.records[b.event.extendedProps.recordId][a.tableCode].value.map(function(e){e.id==b.event.extendedProps.rowId&&(e.value[c.start.value]={value:a.time.start?g.start.toISOString():g.start.format("Y-m-d")});return e})}:d.record[c.start.value]={value:a.time.start?g.start.toISOString():
g.start.format("Y-m-d")};a.singleDay||(a.tableCode?d.record[a.tableCode]={value:h.records[b.event.extendedProps.recordId][a.tableCode].value.map(function(e){e.id==b.event.extendedProps.rowId&&(e.value[c.end.value]={value:a.time.end?g.end.toISOString():g.end.format("Y-m-d")});return e})}:d.record[c.end.value]={value:a.time.end?g.end.toISOString():g.end.format("Y-m-d")})})({start:b.event.start,end:function(){var g=null;a.singleDay||(g=a.time.end?b.event.end:a.time.start?0==b.event.end.getHours()+b.event.end.getMinutes()?
b.event.end.calc("-1 day"):b.event.end:b.event.end.calc((b.event.allDay?"-1":"0")+" day"));return g}()});return[d]}()}).then(function(d){})["catch"](function(d){return kb.alert(kb.error.parse(d))})},eventDidMount:function(b){b.el.elms(".fc-event-time,.fc-event-title").each(function(d,g){d.on("touchstart,mousedown",function(e){e.stopPropagation()}).on("click",function(e){kb.confirm(kb.constants.calendar.message.confirm.edit[kb.operator.language],function(){sessionStorage.setItem("kb-calendar-edit",
JSON.stringify({href:window.location.href}));window.location.href=b.event.extendedProps.url});e.stopPropagation();e.preventDefault()})})},events:function(b,d,g){kb.view.records.get(h.app.id,function(e){var p=[],m=function(f,k,r){return a.timeStamp[f]?((a.time[f]?k.calc(r+" second").getTime():k.calc(r+" day").getTime())/1E3).toString():'"'+(a.time[f]?k.calc(r+" second").toISOString():k.calc(r+" day").format("Y-m-d"))+'"'};p.push(function(){var f=[];f.push(c.start.value+(a.tableCode?' not in ("")':
'!=""'));f.push(c.start.value+">"+m("start",b.start,"-1"));f.push(c.start.value+"<"+m("start",b.end,"1"));return"("+f.join(" and ")+")"}());a.singleDay||(p.push(function(){var f=[];f.push(c.end.value+(a.tableCode?' not in ("")':'!=""'));f.push(c.end.value+">"+m("end",b.start,"-1"));f.push(c.end.value+"<"+m("end",b.end,"1"));return"("+f.join(" and ")+")"}()),p.push(function(){var f=[];f.push(c.start.value+"<"+m("start",b.start,"0"));f.push(c.end.value+">"+m("end",b.end,"0"));return"("+f.join(" and ")+
")"}()));return(e?"("+e+") and ":"")+"("+p.join(" or ")+")"}((h.mobile?kintone.mobile.app:kintone.app).getQueryCondition())).then(function(e){var p=function(m,f){var k=function(){m++;m<e.length?p(m,f):f()};kb.event.call("kb.style.call",{record:e[m],mobile:h.mobile,pattern:"detail",workplace:"view"}).then(function(r){return k()})["catch"](function(r){return k()})};h.records={};0!=e.length?p(0,function(){d(function(m){return m.map(function(f){return{title:kb.field.stringify(h.fieldInfos.parallelize[c.title.value],
f[c.title.value].value," / "),start:function(k){a.singleDay||a.time.start||a.time.end&&(k=(new Date(k)).calc(kb.timezoneOffset()+" hour").toISOString());return k}(f[c.start.value].value),end:function(k){a.singleDay||(a.time.start?a.time.end||(k=(new Date(k)).calc("1 day").calc(kb.timezoneOffset()+" hour").toISOString()):a.time.end||(k=(new Date(k)).calc("1 day").format("Y-m-d")));return k}(a.singleDay?null:f[c.end.value].value),backgroundColor:f[c.title.value].backcolor,borderColor:f[c.title.value].backcolor,
textColor:f[c.title.value].forecolor,extendedProps:{recordId:f.$id.value,rowId:"$rowId"in f?f.$rowId:-1,url:kb.record.page.edit(h.mobile,kb.config[q].app,f.$id.value)}}})}(e.reduce(function(m,f){h.records[f.$id.value]=f;a.tableCode?m=m.concat(f[a.tableCode].value.map(function(k){k.value.$id=f.$id;k.value.$rowId=k.id;return k.value})):m.push(f);return m},[])))}):d([])})["catch"](function(e){return kb.alert(kb.error.parse(e))})},select:function(b){(function(d){a.singleDay?d.start.format("Y-m-d")==d.end.format("Y-m-d")&&
kb.confirm(function(){var g=kb.constants.calendar.message.confirm.create.single[kb.operator.language];return g=g.replace(/%date%/,d.start.format(a.time.start?"Y-m-d H:i":"Y-m-d"))}(),function(){sessionStorage.setItem("kb-calendar-create",JSON.stringify({href:window.location.href,start:{code:c.start.value,tableCode:a.tableCode,value:a.time.start?d.start.toISOString():d.start.format("Y-m-d")}}));window.location.href=kb.record.page.add(h.mobile,kb.config[q].app)}):kb.confirm(function(){var g=kb.constants.calendar.message.confirm.create.multi[kb.operator.language];
g=g.replace(/%start%/,d.start.format(a.time.start?"Y-m-d H:i":"Y-m-d"));return g=g.replace(/%end%/,d.end.format(a.time.end?"Y-m-d H:i":"Y-m-d"))}(),function(){sessionStorage.setItem("kb-calendar-create",JSON.stringify({href:window.location.href,start:{code:c.start.value,tableCode:a.tableCode,value:a.time.start?d.start.toISOString():d.start.format("Y-m-d")},end:{code:c.end.value,tableCode:a.tableCode,value:a.time.end?d.end.toISOString():d.end.format("Y-m-d")}}));window.location.href=kb.record.page.add(h.mobile,
kb.config[q].app)})})({start:b.start,end:a.time.end?b.end:b.end.calc((b.allDay?"-1":"0")+" day")});n.unselect()}});n.setOption("locale",kb.operator.language);n.render()})(function(a){var n=a.start.isEditable&&a.end.isEditable,b=!c.end.value;var d=(d=sessionStorage.getItem("kb-calendar-"+c.view.value))?JSON.parse(d):{date:(new Date).format("Y-m-d"),initial:c.initial.value};return{editable:n,singleDay:b,session:d,tableCode:h.fieldInfos.parallelize[c.title.value].tableCode,time:{start:a.start.isDateTime,
end:a.end.isDateTime},timeStamp:{start:a.start.isTimeStamp,end:a.end.isTimeStamp},type:{month:"dayGridMonth",week:c.end.value?a.start.isDateTime||a.end.isDateTime?"timeGridWeek":"dayGridWeek":"dayGridWeek",day:c.end.value?a.start.isDateTime||a.end.isDateTime?"timeGridDay":"dayGridDay":"dayGridDay"}}}({start:function(a){switch(a.type){case "CALC":switch(a.format){case "DATE":a.isDateTime=!1;a.isEditable=!1;break;case "DATETIME":a.isDateTime=!0,a.isEditable=!1}a.isTimeStamp=!0;break;case "CREATED_TIME":case "UPDATED_TIME":a.isDateTime=
!0;a.isEditable=!1;a.isTimeStamp=!1;break;case "DATE":a.isDateTime=!1;a.isEditable=!0;a.isTimeStamp=!1;break;case "DATETIME":a.isDateTime=!0,a.isEditable=!0,a.isTimeStamp=!1}return a}(h.fieldInfos.parallelize[c.start.value]),end:function(a){switch(a.type){case "CALC":switch(a.format){case "DATE":a.isDateTime=!1;a.isEditable=!1;break;case "DATETIME":a.isDateTime=!0,a.isEditable=!1}a.isTimeStamp=!0;break;case "CREATED_TIME":case "UPDATED_TIME":a.isDateTime=!0;a.isEditable=!1;a.isTimeStamp=!1;break;
case "DATE":a.isDateTime=!1;a.isEditable=!0;a.isTimeStamp=!1;break;case "DATETIME":a.isDateTime=!0;a.isEditable=!0;a.isTimeStamp=!1;break;default:a.isDateTime=!1,a.isEditable=!0,a.isTimeStamp=!1}return a}(c.end.value?h.fieldInfos.parallelize[c.end.value]:{type:""})}))};kintone.events.on(["app.record.index.show","mobile.app.record.index.show"],function(l){return new Promise(function(c,a){(function(n,b){h.mobile=n;h.type=b;kb.config[q].config.get().then(function(d){0!=Object.keys(d).length?kb.field.load(kb.config[q].app,
!0).then(function(g){h.app={id:kb.config[q].app,fields:g.origin};h.fieldInfos=g;h.records={};try{(function(e){if(e){e.title.value&&(e.title.value in h.fieldInfos.parallelize||c(l));e.start.value&&(e.start.value in h.fieldInfos.parallelize||c(l));e.end.value&&(e.end.value in h.fieldInfos.parallelize||c(l));var p=kb.elm("#kb-calendar");p&&t(p,e)}c(l)})(JSON.parse(d.tab).reduce(function(e,p){p.setting.view.value==l.viewId&&(e=p.setting);return e},null))}catch(e){kb.alert(kb.error.parse(e)),c(l)}})["catch"](function(g){return c(l)}):
c(l)})["catch"](function(d){return c(l)})})("mobile"==l.type.split(".").first(),l.type.split(".").slice(-2).first())})});kintone.events.on(["app.record.create.show","mobile.app.record.create.show"],function(l){return new Promise(function(c,a){(function(n){n&&(function(b){b.start&&((b.start.tableCode?l.record[b.start.tableCode].value.first().value[b.start.code]:l.record[b.start.code]).value=b.start.value);b.end&&((b.end.tableCode?l.record[b.end.tableCode].value.first().value[b.end.code]:l.record[b.end.code]).value=
b.end.value);kintone.events.on(["app.record.create.submit.success","mobile.app.record.create.submit.success"],function(d){return new Promise(function(g,e){d.url=b.href;g(d)})})}(JSON.parse(n)),sessionStorage.removeItem("kb-calendar-create"));c(l)})(sessionStorage.getItem("kb-calendar-create"))})});kintone.events.on(["app.record.edit.show","mobile.app.record.edit.show"],function(l){return new Promise(function(c,a){(function(n){n&&(function(b){(function(d){d.parentNode.insertBefore(d.clone().on("click",
function(g){window.location.href=b.href}),d.hide().nextElementSibling)})(kb.elm(".gaia-ui-actionmenu-cancel"));kintone.events.on(["app.record.edit.submit.success","mobile.app.record.edit.submit.success"],function(d){return new Promise(function(g,e){d.url=b.href;g(d)})})}(JSON.parse(n)),sessionStorage.removeItem("kb-calendar-edit"));c(l)})(sessionStorage.getItem("kb-calendar-edit"))})})})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({calendar:{message:{confirm:{create:{multi:{en:"Start Date: %start%<br>End Date: %end%<br>Would you like to add a record with the above details?",ja:"\u958b\u59cb\u65e5\u4ed8: %start%<br>\u7d42\u4e86\u65e5\u4ed8: %end%<br>\u4e0a\u8a18\u5185\u5bb9\u3067\u30ec\u30b3\u30fc\u30c9\u3092\u8ffd\u52a0\u3057\u307e\u3059\u304b\uff1f",zh:"\u5f00\u59cb\u65e5\u671f: %start%<br>\u7ed3\u675f\u65e5\u671f: %end%<br>\u60a8\u60f3\u6839\u636e\u4e0a\u8ff0\u5185\u5bb9\u6dfb\u52a0\u8bb0\u5f55\u5417\uff1f"},
single:{en:"Date: %date%<br>Would you like to add a record with the above content?",ja:"\u65e5\u4ed8: %date%<br>\u4e0a\u8a18\u5185\u5bb9\u3067\u30ec\u30b3\u30fc\u30c9\u3092\u8ffd\u52a0\u3057\u307e\u3059\u304b\uff1f",zh:"\u65e5\u671f: %date%<br>\u60a8\u60f3\u6dfb\u52a0\u4e0a\u8ff0\u5185\u5bb9\u7684\u8bb0\u5f55\u5417\uff1f"}},edit:{en:"Do you want to edit the record?",ja:"\u30ec\u30b3\u30fc\u30c9\u3092\u7de8\u96c6\u3057\u307e\u3059\u304b\uff1f",zh:"\u60a8\u60f3\u7f16\u8f91\u8fd9\u6761\u8bb0\u5f55\u5417\uff1f"}}}}},
kb.constants);