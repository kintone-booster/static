/*
* FileName "plugins.gantt.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
(function(t){var d={},v=function(k,c){(function(b){var n=null,q=function(a){var h=[],g=[];b.subTask&&a[b.subTask].value.each(function(e,f){e.value[c.subtaskStart.value].value&&e.value[c.subtaskEnd.value].value&&g.push({id:"task_"+a.$id.value.toString()+"_"+f.toString(),name:kb.field.stringify(d.fieldInfos.parallelize[c.subtaskTitle.value],e.value[c.subtaskTitle.value].value," / "),start:function(m){return b.time.subTask.start?m:(new Date(m)).calc(kb.timezoneOffset()+" hour").toISOString()}(e.value[c.subtaskStart.value].value),
end:function(m){return b.time.subTask.end?m:(new Date(m)).calc(kb.timezoneOffset()+" hour").toISOString()}(e.value[c.subtaskEnd.value].value),progress:c.subtaskProgress.value?e.value[c.subtaskProgress.value].value:null,dependencies:"task_"+a.$id.value.toString()+(0<f?"_"+(f-1).toString():""),group:"task_"+a.$id.value.toString(),colors:{back:e.value[c.subtaskTitle.value].backcolor,fore:e.value[c.subtaskTitle.value].forecolor},resizable:{left:b.editable.subTask.start,right:b.editable.subTask.end}})});
h.push({id:"task_"+a.$id.value.toString(),name:kb.field.stringify(d.fieldInfos.parallelize[c.taskTitle.value],a[c.taskTitle.value].value," / "),start:function(e){return b.time.task.start?e:(new Date(e)).calc(kb.timezoneOffset()+" hour").toISOString()}(a[c.taskStart.value].value),end:function(e){return b.time.task.end?e:(new Date(e)).calc(kb.timezoneOffset()+" hour").toISOString()}(a[c.taskEnd.value].value),progress:c.taskProgress.value?a[c.taskProgress.value].value:null,dependencies:"",group:"task_"+
a.$id.value.toString(),colors:{back:a[c.taskTitle.value].backcolor,fore:a[c.taskTitle.value].forecolor},resizable:{left:b.editable.task.start,right:b.editable.task.end}});h=h.concat(g);d.records[a.$id.value]=a;return h},l=function(a,h){kb.view.records.get(d.app.id,function(g){var e=[];e.push(function(){var f=[];f.push(c.taskStart.value+'!=""');f.push(c.taskStart.value+'>"'+(b.time.task?(new Date(a.start)).calc("-1 second").toISOString():(new Date(a.start)).calc("-1 day").format("Y-m-d"))+'"');f.push(c.taskStart.value+
'<"'+(b.time.task?(new Date(a.end)).calc("1 second").toISOString():(new Date(a.end)).calc("1 day").format("Y-m-d"))+'"');return"("+f.join(" and ")+")"}());b.subTask&&e.push(function(){var f=[];f.push(c.subtaskStart.value+' not in ("")');f.push(c.subtaskStart.value+'>"'+(b.time.task?(new Date(a.start)).calc("-1 second").toISOString():(new Date(a.start)).calc("-1 day").format("Y-m-d"))+'"');f.push(c.subtaskStart.value+'<"'+(b.time.task?(new Date(a.end)).calc("1 second").toISOString():(new Date(a.end)).calc("1 day").format("Y-m-d"))+
'"');return"("+f.join(" and ")+")"}());return(g?"("+g+") and ":"")+"("+e.join(" or ")+")"}((d.mobile?kintone.mobile.app:kintone.app).getQueryCondition())).then(function(g){var e=function(f,m){var u=function(){f++;f<g.length?e(f,m):m()};kb.event.call("kb.style.call",{container:kb.elm("body"),record:g[f],mobile:d.mobile,pattern:"detail",workplace:"view"}).then(function(r){return u()})["catch"](function(r){return u()})};d.records={};d.tasks=[];0!=g.length?e(0,function(){g.each(function(f,m){d.tasks=
d.tasks.concat(q(f))});h()}):h()})["catch"](function(g){return kb.alert(kb.error.parse(g))})},p=function(a){0!=Object.keys(a.record).length&&kb.view.records.set(d.app.id,{put:[a]},!0).then(function(h){var g=JSON.stringify(d.records[a.id]);kb.event.call("kb.style.call",{container:kb.elm("body"),record:d.records[a.id],mobile:d.mobile,pattern:"detail",workplace:"view"}).then(function(e){g!=JSON.stringify(e.record)&&function(f){d.tasks=d.tasks.filter(function(m){return m.group!="task_"+e.record.$id.value.toString()});
Array.prototype.splice.apply(d.tasks,[f,0].concat(q(e.record)));n.refresh(d.tasks)}(d.tasks.findIndex(function(f){return f.id=="task_"+e.record.$id.value.toString()}))})["catch"](function(e){return finish()})})["catch"](function(h){return kb.alert(kb.error.parse(h))})};k.empty().append(function(a){var h={Day:{en:"Day",ja:"\u65e5",zh:"\u65e5"},Week:{en:"Week",ja:"\u9031",zh:"\u5468"},Month:{en:"Month",ja:"\u6708",zh:"\u6708"},"Half Day":{en:"Half Day",ja:"12\u6642\u9593\u6bce",zh:"\u6bcf12\u5c0f\u65f6"},
"Quarter Day":{en:"Quarter Day",ja:"6\u6642\u9593\u6bce",zh:"\u6bcf6\u5c0f\u65f6"}};a.append(kb.create("div").addClass("kb-gantt-header-filter").append(kb.create("span").addClass("kb-gantt-guide").html("From:")).append(kb.create("button").addClass("kb-gantt-button kb-gantt-pickup-button").on("click",function(g){(function(e){kb.pickupDate(b.session.start,function(f){b.session.start=f;e.html(b.session.start)})})(g.currentTarget.nextElementSibling)})).append(kb.create("span").addClass("kb-gantt-guide").html(b.session.start)).append(kb.create("span").addClass("kb-gantt-guide").html("&nbsp;&nbsp;To:")).append(kb.create("button").addClass("kb-gantt-button kb-gantt-pickup-button").on("click",
function(g){(function(e){kb.pickupDate(b.session.end,function(f){b.session.end=f;e.html(b.session.end)})})(g.currentTarget.nextElementSibling)})).append(kb.create("span").addClass("kb-gantt-guide").html(b.session.end)).append(kb.create("button").addClass("kb-gantt-button kb-gantt-search-button").on("click",function(g){return l(b.session,function(){return n.refresh(d.tasks)})}))).append(kb.create("div").addClass("kb-gantt-header-mode"));(function(g){for(var e in h)(function(f){g.append(function(m){h[f].button=
m;return m.on("click",function(){n.change_view_mode(f);for(var u in h){var r=u;h[r].button==m?h[r].button.addClass("kb-gantt-button-active"):h[r].button.removeClass("kb-gantt-button-active")}})}(kb.create("button").addClass("kb-gantt-button"+(b.session.initial==f?" kb-gantt-button-active":"")).html(h[f][kb.operator.language])))})(e)})(a.elm(".kb-gantt-header-mode"));return a}(kb.create("div").attr("id","kb-gantt-header"))).append(kb.create("div").attr("id","kb-gantt-main"));l(b.session,function(){n=
new Gantt("#kb-gantt-main",d.tasks,{start:b.session.start,end:b.session.end,header_height:50,column_width:30,view_modes:["Quarter Day","Half Day","Day","Week","Month"],bar_height:20,bar_corner_radius:3,arrow_curve:5,padding:18,view_mode:b.session.initial,language:"en",custom_popup_html:null,on_click:function(a){kb.confirm(kb.constants.gantt.message.confirm.edit[kb.operator.language],function(){var h=(c.page||{value:[]}).value.includes("detail"),g=kb.config[t].app,e=a.id.replace(/task_/g,"").split("_").first();
h||sessionStorage.setItem("kb-gantt-edit",JSON.stringify({href:window.location.href}));window.location.href=h?kb.record.page.detail(d.mobile,g,e):kb.record.page.edit(d.mobile,g,e)})},on_date_change:function(a){(function(h){var g={id:h.first(),record:{}};a.each(function(e,f){if(0==f)b.editable.task.start&&(g.record[c.taskStart.value]=d.records[h.first()][c.taskStart.value],g.record[c.taskStart.value].value=b.time.task.start?e._start.toISOString():e._start.format("Y-m-d")),b.editable.task.end&&(g.record[c.taskEnd.value]=
d.records[h.first()][c.taskEnd.value],g.record[c.taskEnd.value].value=b.time.task.end?e._end.toISOString():e._end.calc("-1 day").format("Y-m-d"));else if(b.editable.subTask.start||b.editable.subTask.end)g.record[b.subTask]=d.records[h.first()][b.subTask],b.editable.subTask.start&&(g.record[b.subTask].value[f-1].value[c.subtaskStart.value].value=b.time.subTask.start?e._start.toISOString():e._start.format("Y-m-d")),b.editable.subTask.end&&(g.record[b.subTask].value[f-1].value[c.subtaskEnd.value].value=
b.time.subTask.end?e._end.toISOString():e._end.calc("-1 day").format("Y-m-d"))});p(g)})(a.first().id.replace(/task_/g,"").split("_"))},on_progress_change:function(a,h){var g=a.id.replace(/task_/g,"").split("_"),e=a.id==a.group,f={id:g.first(),record:{}};e?c.taskProgress.value&&(f.record[c.taskProgress.value]=d.records[g.first()][c.taskProgress.value],f.record[c.taskProgress.value].value=h):c.subtaskProgress.value&&(f.record[b.subTask]=d.records[g.first()][b.subTask],f.record[b.subTask].value[g.last()].value[c.subtaskProgress.value].value=
h);p(f)},on_view_change:function(a){}})})})(function(b){var n=b(d.fieldInfos.parallelize[c.taskStart.value]),q=b(d.fieldInfos.parallelize[c.taskEnd.value]),l=b(c.subtaskStart.value?d.fieldInfos.parallelize[c.subtaskStart.value]:{type:""});b=b(c.subtaskEnd.value?d.fieldInfos.parallelize[c.subtaskEnd.value]:{type:""});var p={task:{start:n.isEditable,end:q.isEditable},subTask:{start:l.isEditable,end:b.isEditable}};var a=(a=sessionStorage.getItem("kb-gantt-"+c.view.value))?JSON.parse(a):{start:(new Date).format("Y-m-d"),
end:(new Date).calc("1 month,-1 day").format("Y-m-d"),initial:c.initial.value};return{editable:p,session:a,subTask:c.subtaskTitle.value?d.fieldInfos.parallelize[c.subtaskTitle.value].tableCode:"",time:{task:{start:n.isDateTime,end:q.isDateTime},subTask:{start:l.isDateTime,end:b.isDateTime}}}}(function(b){switch(b.type){case "CALC":switch(b.format){case "DATE":b.isDateTime=!1;b.isEditable=!1;break;case "DATETIME":b.isDateTime=!0,b.isEditable=!1}break;case "CREATED_TIME":case "UPDATED_TIME":b.isDateTime=
!0;b.isEditable=!1;break;case "DATE":b.isDateTime=!1;b.isEditable=!0;break;case "DATETIME":b.isDateTime=!0;b.isEditable=!0;break;default:b.isDateTime=!1,b.isEditable=!0}return b}))};kintone.events.on(["app.record.index.show","mobile.app.record.index.show"],function(k){return new Promise(function(c,b){(function(n,q){d.mobile=n;d.type=q;kb.config[t].config.get().then(function(l){0!=Object.keys(l).length?kb.field.load(kb.config[t].app,!0).then(function(p){d.app={id:kb.config[t].app,fields:p.origin};
d.fieldInfos=p;d.records={};d.tasks=[];try{(function(a){if(a){a.taskTitle.value&&(a.taskTitle.value in d.fieldInfos.parallelize||c(k));a.taskStart.value&&(a.taskStart.value in d.fieldInfos.parallelize||c(k));a.taskEnd.value&&(a.taskEnd.value in d.fieldInfos.parallelize||c(k));a.taskProgress.value&&(a.taskProgress.value in d.fieldInfos.parallelize||c(k));a.subtaskTitle.value&&(a.subtaskTitle.value in d.fieldInfos.parallelize||c(k));a.subtaskStart.value&&(a.subtaskStart.value in d.fieldInfos.parallelize||
c(k));a.subtaskEnd.value&&(a.subtaskEnd.value in d.fieldInfos.parallelize||c(k));a.subtaskProgress.value&&(a.subtaskProgress.value in d.fieldInfos.parallelize||c(k));var h=kb.elm("#kb-gantt");h&&v(h,a)}c(k)})(JSON.parse(l.tab).map(function(a,h){return kb.extend({sIndex:{value:h.toString()}},a.setting)}).reduce(function(a,h){h.view.value==k.viewId.toString()&&(a=h);return a},null))}catch(a){kb.alert(kb.error.parse(a)),c(k)}})["catch"](function(p){return c(k)}):c(k)})["catch"](function(l){return c(k)})})("mobile"==
k.type.split(".").first(),k.type.split(".").slice(-2).first())})});kintone.events.on(["app.record.edit.show","mobile.app.record.edit.show"],function(k){return new Promise(function(c,b){(function(n){n&&(function(q){(function(l){l.parentNode.insertBefore(l.clone().removeAttr("disabled").on("click",function(p){window.location.href=q.href}),l.hide().nextElementSibling)})(kb.elm("mobile"==k.type.split(".").first()?".gaia-mobile-v2-app-record-edittoolbar-cancel":".gaia-ui-actionmenu-cancel"));kintone.events.on(["app.record.edit.submit.success",
"mobile.app.record.edit.submit.success"],function(l){return new Promise(function(p,a){l.url=q.href;p(l)})})}(JSON.parse(n)),sessionStorage.removeItem("kb-gantt-edit"));c(k)})(sessionStorage.getItem("kb-gantt-edit"))})})})(kintone.$PLUGIN_ID);kb.constants=kb.extend({gantt:{message:{confirm:{edit:{en:"Do you want to open the record?",ja:"\u30ec\u30b3\u30fc\u30c9\u3092\u958b\u304d\u307e\u3059\u304b\uff1f",zh:"\u60a8\u8981\u6253\u5f00\u8bb0\u5f55\u5417\uff1f"}}}}},kb.constants);