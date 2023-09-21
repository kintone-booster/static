/*
* FileName "config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
window.KintoneBoosterConfig=function(pluginId){var $jscomp$this=this;this.app=location.href.match(/\/m\//g)?kintone.mobile.app.getId():kintone.app.getId();this.subdomain=location.host.split(".")[0];this.cache=null;this.config={size:function(value){return[].concat($jscomp.arrayFromIterable(value)).reduce(function(result,current,idx,arr){var code=current.charCodeAt(0);if(code<=127)result=result+1;else if(code<=2047)result=result+2;else if(code>=55296&&code<=57343){arr[idx+1]="";result=result+4}else result=
result+(code<65535?3:4);return result},0)},clear:function(){return new Promise(function(resolve,reject){fetch("https://api.kintone-booster.com/config?id="+pluginId+"&subdomain="+$jscomp$this.subdomain+"&app="+$jscomp$this.app,{method:"DELETE",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(function(response){response.json().then(function(json){switch(response.status){case 200:resolve();break;default:kb.alert(kb.error.parse(json));reject();break}})})["catch"](function(error){console.log("Failed to connect to the server.");
reject()})})},get:function(){return new Promise(function(resolve,reject){try{if(!$jscomp$this.cache)(function(config){if(Object.keys(config).exceeded)fetch("https://api.kintone-booster.com/config?id="+pluginId+"&subdomain="+$jscomp$this.subdomain+"&app="+$jscomp$this.app,{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(function(response){response.json().then(function(json){switch(response.status){case 200:$jscomp$this.cache="result"in json?typeof json.result==="string"?{}:json.result:
{};resolve($jscomp$this.cache);break;default:kb.alert(kb.error.parse(json));reject();break}})})["catch"](function(error){console.log("Failed to connect to the server.");reject()});else{$jscomp$this.cache=config;resolve($jscomp$this.cache)}})(kintone.plugin.app.getConfig(pluginId));else resolve($jscomp$this.cache)}catch(error){kb.alert(kb.error.parse(error));reject()}})},set:function(config){try{if($jscomp$this.config.size(JSON.stringify(config))>255E3)fetch("https://api.kintone-booster.com/config",
{method:"PUT",headers:{"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({id:pluginId,subdomain:$jscomp$this.subdomain,app:$jscomp$this.app,datas:config})}).then(function(response){response.json().then(function(json){switch(response.status){case 200:kintone.plugin.app.setConfig({exceeded:true});break;default:kb.alert(kb.error.parse(json));break}})})["catch"](function(error){console.log("Failed to connect to the server.")});else kintone.plugin.app.setConfig(config)}catch(error){kb.alert(kb.error.parse(error))}}};
this.ui={fields:{conditions:{get:function(fieldInfos){return{condition:{code:"condition",type:"CONDITION",label:"",required:false,noLabel:true,app:{id:kintone.app.getId(),fields:fieldInfos.parallelize}},device:{code:"device",type:"RADIO_BUTTON",label:"",required:true,noLabel:true,options:[{index:0,label:"both"},{index:1,label:"pc"},{index:2,label:"mobile"}]}}},set:function(container,app){return container.append(kb.create("h1").html(kb.constants.config.caption.conditions[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.caption.conditions.condition[kb.operator.language])).append(kb.field.activate(kb.field.create(app.fields.condition),
app))).append(kb.create("section").append(kb.field.activate(function(res){res.elms("[data-name="+app.fields.device.code+"]").each(function(element,index){element.closest("label").elm("span").html(kb.constants.config.caption.conditions.device[element.val()][kb.operator.language])});return res}(kb.field.create(app.fields.device)),app)))}},users:{get:function(fieldInfos){return{user:{code:"user",type:"USER_SELECT",label:"",required:false,noLabel:true},organization:{code:"organization",type:"ORGANIZATION_SELECT",
label:"",required:false,noLabel:false},group:{code:"group",type:"GROUP_SELECT",label:"",required:false,noLabel:false}}},set:function(container,app){return container.append(kb.create("h1").html(kb.constants.config.caption.users[kb.operator.language])).append(kb.create("section").append(kb.create("p").html(kb.constants.config.caption.users.user[kb.operator.language])).append(kb.field.activate(kb.field.create(app.fields.user),app))).append(kb.create("section").append(kb.create("p").html(kb.constants.config.caption.users.organization[kb.operator.language])).append(kb.field.activate(kb.field.create(app.fields.organization),
app))).append(kb.create("section").append(kb.create("p").html(kb.constants.config.caption.users.group[kb.operator.language])).append(kb.field.activate(kb.field.create(app.fields.group),app)))}}},options:{fields:function(fieldInfos,filter,tables,groups){var res=[{code:"",label:""}];if(filter)res=res.concat(Object.values(fieldInfos.placed).reduce(filter,[]));if(tables)res=res.concat(Object.values(fieldInfos.tables).map(function(item){return{code:item.code,label:item.label}}));if(groups)res=res.concat(Object.values(fieldInfos.groups).map(function(item){return{code:item.code,
label:item.label}}));return res}}}};
window.KintoneBoosterConfig.prototype.build=function(options,callback,config){var $jscomp$this=this;try{(function(container){if(container){container.parentNode.css({width:"calc(100% - "+container.parentNode.siblings().reduce(function(result,current){return result+current.outerWidth()},16)+"px)"});container.append(function(main){container.main=main;return main}(kb.create("main").addClass("kb-config-main"))).append(function(footer){container.footer=footer;return footer}(kb.create("footer").addClass("kb-config-footer")));if(options.submit)container.footer.append(function(button){switch(kb.operator.language){case "en":button.text("Save");
break;case "ja":button.text("\u4fdd\u5b58\u3059\u308b");break;case "zh":button.text("\u4fdd\u5b58");break}return button}(kb.create("button").addClass("kb-config-footer-button kb-config-footer-button-submit").on("click",function(){(function(config){if(config)kb.confirm(kb.constants.common.message.confirm.save[kb.operator.language],function(){$jscomp$this.config.set(config)})})(options.submit(container,{}))}))).append(function(button){switch(kb.operator.language){case "en":button.text("Cancel");break;
case "ja":button.text("\u30ad\u30e3\u30f3\u30bb\u30eb");break;case "zh":button.text("\u53d6\u6d88");break}return button}(kb.create("button").addClass("kb-config-footer-button kb-config-footer-button-cancel").on("click",function(e){return history.back()}))).append(function(button){switch(kb.operator.language){case "en":button.text("Export configuration file");break;case "ja":button.text("\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u66f8\u304d\u51fa\u3057");break;case "zh":button.text("\u5bfc\u51fa\u914d\u7f6e\u6587\u4ef6");
break}return button}(kb.create("button").addClass("kb-config-footer-button kb-config-footer-button-export").on("click",function(e){$jscomp$this.config.get().then(function(config){return kb.downloadText(JSON.stringify(config),"config.json")})["catch"](function(error){})}))).append(function(button){switch(kb.operator.language){case "en":button.text("Import configuration file");break;case "ja":button.text("\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u8aad\u307f\u8fbc\u307f");break;case "zh":button.text("\u5bfc\u5165\u914d\u7f6e\u6587\u4ef6");
break}return button}(kb.create("button").addClass("kb-config-footer-button kb-config-footer-button-import").on("click",function(e){(function(file){kb.elm("body").append(file.on("change",function(e){if(e.currentTarget.files){var reader=new FileReader;reader.onload=function(readData){return $jscomp$this.build(options,callback,readData.target.result)};reader.readAsText(e.currentTarget.files.first())}else document.body.removeChild(file)}));file.click()})(kb.create("input").attr("type","file").attr("accept",
".json").css({display:"none"}))})));if(!config)$jscomp$this.config.get().then(function(config){return callback(container,config)})["catch"](function(error){});else callback(container,config)}})(kb.elm(".kb-config-container"))}catch(error){kb.alert(kb.error.parse(error))}};
window.KintoneBoosterConfigTabbed=function(container,callback){var $jscomp$this=this;this.tabs=[];this.callback=callback;this.container=container;this.container.main.append(kb.create("div").addClass("kb-hidden kb-config-tabbed-tab-scroller")).append(function(tabs){$jscomp$this.container.tabs=tabs;return tabs.append(kb.create("div").addClass("kb-hidden kb-config-tabbed-tab-guide"))}(kb.create("div").addClass("kb-config-tabbed-tabs"))).append(function(panels){$jscomp$this.container.panels=panels;return panels}(kb.create("div").addClass("kb-config-tabbed-panels")));
(function(container,scroller){(function(buttons){var observer={mutation:null,resize:null};var adjust=function(coord){coord=coord===void 0?0:coord;if(container.scrollWidth>container.clientWidth){if(container.scrollLeft+coord>0)buttons.prev.removeAttr("disabled");else buttons.prev.attr("disabled","disabled");if(container.scrollLeft+coord<container.scrollWidth-container.clientWidth)buttons.next.removeAttr("disabled");else buttons.next.attr("disabled","disabled");scroller.removeClass("kb-hidden")}else scroller.addClass("kb-hidden")};
observer.mutation=new MutationObserver(function(){return adjust()});observer.mutation.disconnect();observer.mutation.observe(container,{childList:true});observer.resize=new ResizeObserver(function(){return adjust()});observer.resize.disconnect();observer.resize.observe(container);scroller.append(buttons.prev.on("click",function(e){(function(coord){adjust(coord);container.scrollBy({left:coord})})(Math.floor(container.clientWidth/-2))})).append(buttons.next.on("click",function(e){(function(coord){adjust(coord);
container.scrollBy({left:coord})})(Math.ceil(container.clientWidth/2))}))})({prev:kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-left"),next:kb.create("button").addClass("kb-icon kb-icon-arrow kb-icon-arrow-right")})})(this.container.elm(".kb-config-tabbed-tabs"),this.container.elm(".kb-config-tabbed-tab-scroller"));kb.event.on("kb.drag.start",function(e){var keep={element:e.element,guide:$jscomp$this.container.tabs.elm(".kb-config-tabbed-tab-guide")};var handler={move:function(e){var element=
document.elementFromPoint(e.pageX,e.pageY);if(element)if(element!=keep.guide)(function(rect){if(element.hasClass("kb-config-tabbed-tab"))element.parentNode.insertBefore(keep.guide.removeClass("kb-hidden"),e.pageX<rect.left+rect.width*.5?element:element.nextElementSibling)})(element.getBoundingClientRect())},end:function(e){if(keep.guide.visible())keep.guide.parentNode.insertBefore(keep.element.removeClass("kb-hidden"),keep.guide.addClass("kb-hidden").nextElementSibling);else keep.element.removeClass("kb-hidden");
$jscomp$this.tabs=$jscomp$this.container.tabs.elms(".kb-config-tabbed-tab").map(function(item,index){item.removeClass("kb-dragging").index=index;return item});window.off("mousemove,touchmove",handler.move);window.off("mouseup,touchend",handler.end);e.stopPropagation();e.preventDefault()}};(function(rect){keep.guide.css({width:rect.width.toString()+"px"});keep.element.addClass("kb-hidden").parentNode.insertBefore(keep.guide.removeClass("kb-hidden"),keep.element.nextElementSibling)})(keep.element.getBoundingClientRect());
$jscomp$this.tabs.each(function(tab,index){tab.addClass("kb-dragging")});window.on("mousemove,touchmove",handler.move);window.on("mouseup,touchend",handler.end)})};window.KintoneBoosterConfigTabbed.prototype.activate=function(target){this.tabs.each(function(tab,index){if(index==target.index){tab.addClass("kb-activate");tab.panel.show()}else{tab.removeClass("kb-activate");tab.panel.hide()}});return target};
window.KintoneBoosterConfigTabbed.prototype.add=function(index){var $jscomp$this=this;return function(tab){var handler=function(e){var pointer=e.changedTouches?Array.from(e.changedTouches).first():e;kb.event.call("kb.drag.start",{element:tab,page:{x:pointer.pageX,y:pointer.pageY}});window.off("touchmove,mousemove",handler)};$jscomp$this.container.panels.append(tab.panel);if(kb.isNumeric(index)){$jscomp$this.container.tabs.insertBefore(tab,$jscomp$this.tabs[index].nextElementSibling);$jscomp$this.tabs.splice(index+
1,0,tab)}else{$jscomp$this.container.tabs.append(tab);$jscomp$this.tabs.push(tab)}$jscomp$this.tabs.each(function(tab,index){tab.index=index});$jscomp$this.callback.add(function(){tab.label.html(function(){var res="";switch(kb.operator.language){case "en":res="Setting";break;case "ja":res="\u8a2d\u5b9a";break;case "zh":res="\u8bbe\u7f6e";break}return res+($jscomp$this.tabs.filter(function(item){return item.label.html().match(new RegExp("^"+res+"[1-9]{1}[0-9]*$","g"))}).length+1).toString()}());return tab}());
$jscomp$this.activate(tab);tab.on("touchstart,mousedown",function(e){window.on("touchmove,mousemove",handler);e.stopPropagation();e.preventDefault()}).on("touchend,mouseup",function(e){window.off("touchmove,mousemove",handler);$jscomp$this.activate(tab);e.stopPropagation();e.preventDefault()});return tab}(function(){var res=kb.create("div").addClass("kb-config-tabbed-tab").append(kb.create("span").addClass("kb-config-tabbed-tab-label").on("dblclick",function(e){e.currentTarget.parentNode.elm(".kb-config-tabbed-tab-prompt").val(e.currentTarget.html()).show("inline-block").focus();
e.currentTarget.hide();e.stopPropagation();e.preventDefault()})).append(kb.create("input").attr("type","text").addClass("kb-config-tabbed-tab-prompt").hide().on("touchstart,mousedown",function(e){e.stopPropagation()}).on("blur",function(e){e.currentTarget.parentNode.elm(".kb-config-tabbed-tab-label").html(e.currentTarget.val()).show("inline-block");e.currentTarget.hide();e.stopPropagation();e.preventDefault()})).append(kb.create("button").addClass("kb-icon kb-icon-add").on("touchstart,mousedown",
function(e){e.stopPropagation()}).on("click",function(e){$jscomp$this.add(res.index);e.stopPropagation();e.preventDefault()})).append(kb.create("button").addClass("kb-icon kb-icon-copy").on("touchstart,mousedown",function(e){e.stopPropagation()}).on("click",function(e){$jscomp$this.add(res.index);switch(kb.operator.language){case "en":$jscomp$this.tabs[res.index+1].label.html($jscomp$this.tabs[res.index].label.html()+" Copy");break;case "ja":$jscomp$this.tabs[res.index+1].label.html($jscomp$this.tabs[res.index].label.html()+
" \u30b3\u30d4\u30fc");break;case "zh":$jscomp$this.tabs[res.index+1].label.html($jscomp$this.tabs[res.index].label.html()+" \u590d\u5236");break}$jscomp$this.copy(res.index,res.index+1);e.stopPropagation();e.preventDefault()})).append(kb.create("button").addClass("kb-icon kb-icon-del").on("touchstart,mousedown",function(e){e.stopPropagation()}).on("click",function(e){kb.confirm(kb.constants.common.message.confirm["delete"][kb.operator.language],function(){$jscomp$this.del(res.index)});e.stopPropagation();
e.preventDefault()}));res.label=res.elm(".kb-config-tabbed-tab-label");res.panel=kb.create("div").addClass("kb-config-tabbed-panel");return res}())};window.KintoneBoosterConfigTabbed.prototype.copy=function(source,destination){this.callback.copy(this.tabs[source],this.tabs[destination])};
window.KintoneBoosterConfigTabbed.prototype.del=function(index){var $jscomp$this=this;(function(tab){$jscomp$this.container.panels.removeChild(tab.panel);$jscomp$this.container.tabs.removeChild(tab);$jscomp$this.tabs.splice(index,1);$jscomp$this.tabs.each(function(tab,index){tab.index=index});$jscomp$this.callback.del(index);if($jscomp$this.tabs.length==0)$jscomp$this.add();else $jscomp$this.activate($jscomp$this.tabs[$jscomp$this.tabs.length>index?index:index-1])})(this.tabs[index])};
if(typeof kb.config==="undefined")kb.config={};kb.config[kintone.$PLUGIN_ID]=new KintoneBoosterConfig(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{conditions:{en:"Conditions for operation",ja:"\u52d5\u4f5c\u6761\u4ef6",zh:"\u64cd\u4f5c\u7684\u6761\u4ef6",condition:{en:"Please specify the conditions for the record to be executable with the set content.",ja:"\u8a2d\u5b9a\u3057\u305f\u5185\u5bb9\u3092\u5b9f\u884c\u51fa\u6765\u308b\u30ec\u30b3\u30fc\u30c9\u306e\u6761\u4ef6\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u6307\u5b9a\u5177\u6709\u6240\u8bbe\u7f6e\u5185\u5bb9\u7684\u8bb0\u5f55\u7684\u53ef\u6267\u884c\u6761\u4ef6\u3002"},
device:{both:{en:"Execute on both PC and mobile versions",ja:"PC\u7248\u3068\u30e2\u30d0\u30a4\u30eb\u7248\u306e\u4e21\u65b9\u3067\u5b9f\u884c",zh:"\u5728PC\u548c\u79fb\u52a8\u7248\u672c\u4e0a\u90fd\u6267\u884c"},mobile:{en:"Execute on mobile version only",ja:"\u30e2\u30d0\u30a4\u30eb\u7248\u306e\u307f\u3067\u5b9f\u884c",zh:"\u4ec5\u5728\u79fb\u52a8\u7248\u672c\u4e0a\u6267\u884c"},pc:{en:"Execute on PC version only",ja:"PC\u7248\u306e\u307f\u3067\u5b9f\u884c",zh:"\u4ec5\u5728PC\u7248\u672c\u4e0a\u6267\u884c"}}},
users:{en:"Authorized users",ja:"\u8a31\u53ef\u30e6\u30fc\u30b6\u30fc",zh:"\u83b7\u5f97\u6388\u6743\u7684\u7528\u6237",group:{en:"In addition to the operational conditions, if you want to determine the execution permission based on the group the logged-in user belongs to, please specify the group to be permitted.",ja:"\u52d5\u4f5c\u6761\u4ef6\u306b\u52a0\u3048\u3001\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc\u304c\u6240\u5c5e\u3059\u308b\u30b0\u30eb\u30fc\u30d7\u3092\u5b9f\u884c\u8a31\u53ef\u306e\u5224\u65ad\u3068\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u8a31\u53ef\u3059\u308b\u30b0\u30eb\u30fc\u30d7\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u9664\u4e86\u64cd\u4f5c\u6761\u4ef6\u5916\uff0c\u5982\u679c\u60a8\u60f3\u6839\u636e\u767b\u5f55\u7528\u6237\u6240\u5c5e\u7684\u7ec4\u6765\u51b3\u5b9a\u6267\u884c\u6743\u9650\uff0c\u8bf7\u6307\u5b9a\u5141\u8bb8\u7684\u7ec4\u3002"},organization:{en:"In addition to the operational conditions, if you want to determine the execution permission based on the organization the logged-in user belongs to, please specify the organization to be permitted.",ja:"\u52d5\u4f5c\u6761\u4ef6\u306b\u52a0\u3048\u3001\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc\u304c\u6240\u5c5e\u3059\u308b\u7d44\u7e54\u3092\u5b9f\u884c\u8a31\u53ef\u306e\u5224\u65ad\u3068\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u8a31\u53ef\u3059\u308b\u7d44\u7e54\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u9664\u4e86\u64cd\u4f5c\u6761\u4ef6\u5916\uff0c\u5982\u679c\u60a8\u60f3\u6839\u636e\u767b\u5f55\u7528\u6237\u6240\u5c5e\u7684\u7ec4\u7ec7\u6765\u51b3\u5b9a\u6267\u884c\u6743\u9650\uff0c\u8bf7\u6307\u5b9a\u5141\u8bb8\u7684\u7ec4\u7ec7\u3002"},user:{en:"In addition to the operational conditions, if you want to determine the execution permission based on the logged-in user, please specify the user to be permitted.",ja:"\u52d5\u4f5c\u6761\u4ef6\u306b\u52a0\u3048\u3001\u30ed\u30b0\u30a4\u30f3\u30e6\u30fc\u30b6\u30fc\u3092\u5b9f\u884c\u8a31\u53ef\u306e\u5224\u65ad\u3068\u3057\u305f\u3044\u5834\u5408\u306f\u3001\u8a31\u53ef\u3059\u308b\u30e6\u30fc\u30b6\u30fc\u3092\u6307\u5b9a\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u9664\u4e86\u64cd\u4f5c\u6761\u4ef6\u5916\uff0c\u5982\u679c\u60a8\u60f3\u6839\u636e\u767b\u5f55\u7528\u6237\u6765\u51b3\u5b9a\u6267\u884c\u6743\u9650\uff0c\u8bf7\u6307\u5b9a\u5141\u8bb8\u7684\u7528\u6237\u3002"}}}}},kb.constants);