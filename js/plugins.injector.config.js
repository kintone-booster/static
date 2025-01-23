/*
* FileName "plugins.injector.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
'use strict';(u=>{var l={};kb.field.load(kintone.app.getId()).then(f=>{kb.apps.load().then(a=>{kb.config[u].build({submit:(d,b)=>{try{var e=!1;b.tab=[];b.flat={};(c=>{c=kb.record.get(d.main.elm(".kb-flat"),c);c.error?(kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]),e=!0):0!=c.record.injectors.value.filter(g=>g.value.config.value).length?c.record.injectors.value.length!=[...(new Set(c.record.injectors.value.map(g=>JSON.parse(g.value.config.value).directory)))].length?(kb.alert(kb.constants.config.message.invalid.duplicate[kb.operator.language]),
e=!0):b.flat=c.record:b.flat={injectors:{value:[]}}})({id:l.app.id,fields:l.app.fields.flat});b.tab=JSON.stringify(b.tab);b.flat=JSON.stringify(b.flat);kb.event.off("kb.config.submit.call").on("kb.config.submit.call",c=>new Promise((g,h)=>{var m={},p=(n,k)=>{0!=l.plugins.installed.length?(t=>{(new KintoneBoosterConfig(l.plugins.keys[t])).config.get().then(v=>{m[t]=JSON.parse(v.tab).map((q,r)=>kb.extend({sIndex:{value:r.toString()}},q.setting)).reduce((q,r)=>{["all","injector"].includes(r.device.value)&&
q.push(r);return q},[]);n++;n<l.plugins.installed.length?p(n,k):k()}).catch(v=>g({error:!0}))})(l.plugins.installed[n]):k()};p(0,()=>{(n=>{fetch("https://api.kintone-booster.com/injector",{method:"PUT",headers:{"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({app:n.appId,data:JSON.parse(b.flat).injectors.value.map(k=>JSON.parse(k.value.config.value)),generated:l.generated,host:location.host,plugins:m,space:location.href.match(/\/k\/guest/g)?n.spaceId:""})}).then(k=>{k.json().then(t=>{200!=
k.status?(kb.alert(kb.error.parse(result)),g({error:!0})):g({error:!1})})}).catch(k=>{kb.alert(kb.error.parse(k));g({error:!0})})})(a.filter(n=>n.appId==kintone.app.getId()).first())})}));return e?!1:b}catch(c){return kb.alert(kb.error.parse(c)),!1}}},(d,b)=>{try{l.app={id:u,fields:{tab:{},flat:{injectors:{code:"injectors",type:"SUBTABLE",label:"",noLabel:!0,fields:{config:{code:"config",type:"SINGLE_LINE_TEXT",label:"",required:!1,noLabel:!1,placeholder:""},button:{code:"button",type:"SPACER",label:"",
required:!1,noLabel:!1,contents:'<button class="kb-action-button kb-page-detail">'+kb.constants.config.caption.injector.button[kb.operator.language]+"</button>"},title:{code:"title",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.injector.title[kb.operator.language],required:!1,noLabel:!1,placeholder:""},url:{code:"url",type:"LINK",label:kb.constants.config.caption.injector.url[kb.operator.language],required:!1,noLabel:!1,placeholder:"",protocol:"WEB"}}}}}};l.generated=0!=Object.keys(b).length?
JSON.parse(b.flat).injectors.value.map(c=>JSON.parse(c.value.config.value).directory):[];l.plugins={installed:[],keys:{style:"ckcjgfhmgkibngjnopmehnelkbefdada",cascade:"opfedpcokeomicggpkgeohneamiecjpl",action:"ngaaagkoedlehckeeoedfgkgohoiadfc",submit:"edcbkmnbnafpajnoldenephicjinfefb",upsert:"mdoopilnocbcjobemcficcbljmbhghkn",mail:"emmdbdanlphcfhnieeanbkfaeeoclpdc",omail:"boglmlejjcpcoigcldcnmokbkcamianb"}};for(var e in l.plugins.keys)try{(c=>{c&&0!=Object.keys(c).length&&l.plugins.installed.push(e)})(kintone.plugin.app.getConfig(l.plugins.keys[e]))}catch(c){}(c=>
{c.tables={injector:kb.table.create(c.fields.injectors,!1,!1,!1).spread((g,h)=>{g.elm(".kb-table-row-add").on("click",m=>{c.tables.injector.insertRow(g)});g.elm(".kb-table-row-del").on("click",m=>{kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],()=>{c.tables.injector.delRow(g)})});g.elm("[field-id=button]").elm("button").on("click",m=>{((p,n)=>{n=n?JSON.parse(n):{title:"New "+p.name+" Injector",description:"",directory:"",operator:"",pass:"",basic:{operator:"",pass:""},
colors:{body:"#a1cae3",button:"#e08e45"},plugins:[],customize:{css:"",js:""},fields:[]};window.kb.injector||(window.kb.injector={builder:new KintoneBoosterInjectorBuilder});kb.injector.builder.show(n,f.origin,{id:p.appId,fields:f.origin},l.plugins.installed,k=>{kb.record.set(g,{id:l.app.id,fields:l.app.fields.flat.injectors.fields},{config:{disabled:!0,value:JSON.stringify(k)},title:{disabled:!0,value:k.title},url:{disabled:!0,value:"https://injector.kintone-booster.com/"+k.directory+"/"}})})})(a.filter(p=>
p.appId==kintone.app.getId()).first(),g.elm("[field-id=config]").elm("input").val())})},(g,h)=>{0==g.tr.length&&g.addRow()},!1)};d.main.append(kb.create("div").addClass("kb-flat kb-scope").attr("form-id","form_"+c.id).append(kb.create("p").css({marginBottom:"0.25em"}).html(kb.constants.config.description.injector[kb.operator.language])).append((g=>{g.elm("thead").elms("th").first().addClass("kb-hidden");g.template.elms("td").each((h,m)=>{switch(m){case 0:h.addClass("kb-hidden");break;case 1:h.elm("button").css({margin:"0"});
break;case 2:kb.record.set(h.parentNode,{id:l.app.id,fields:l.app.fields.flat.injectors.fields},{title:{disabled:!0,value:kb.constants.config.caption.injector.title.pending[kb.operator.language]},url:{disabled:!0,value:""}})}h.css({verticalAlign:"middle"})});return g})(c.tables.injector)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.url[kb.operator.language])).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.ip[kb.operator.language])).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.plugin[kb.operator.language])));
d.main.elms("input,select,textarea").each((g,h)=>g.initialize())})({id:l.app.id,fields:l.app.fields.flat});0!=Object.keys(b).length?(c=>{var g={id:l.app.id,fields:l.app.fields.flat};kb.record.set(d.main.elm(".kb-flat"),g,c)})(JSON.parse(b.flat)):d.main.elm(".kb-flat").elm("[field-id=injectors]").addRow()}catch(c){kb.alert(kb.error.parse(c))}})})});window.KintoneBoosterInjectorBuilder=class extends KintoneBoosterDialog{constructor(){super(999995,!1,!1);this.app={id:"injectorbuilder",fields:{title:{code:"title",
type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.builder.title[kb.operator.language],required:!0,noLabel:!1,format:"text"},description:{code:"description",type:"MULTI_LINE_TEXT",label:kb.constants.config.caption.builder.description[kb.operator.language],required:!1,noLabel:!1,lines:"5"},directory:{code:"directory",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.builder.directory[kb.operator.language],required:!0,noLabel:!1,format:"text"},operator:{code:"operator",type:"DROP_DOWN",
label:kb.constants.config.caption.builder.operator[kb.operator.language],required:!0,noLabel:!1,options:[]},pass:{code:"pass",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.builder.pass[kb.operator.language],required:!0,noLabel:!1,format:"password"},basicoperator:{code:"basicoperator",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.builder.basic.operator[kb.operator.language],required:!1,noLabel:!1,format:"text"},basicpass:{code:"basicpass",type:"SINGLE_LINE_TEXT",label:kb.constants.config.caption.builder.basic.pass[kb.operator.language],
required:!1,noLabel:!1,format:"password"},bodycolor:{code:"bodycolor",type:"COLOR",label:kb.constants.config.caption.builder.colors.body[kb.operator.language],required:!1,noLabel:!1},buttoncolor:{code:"buttoncolor",type:"COLOR",label:kb.constants.config.caption.builder.colors.button[kb.operator.language],required:!1,noLabel:!1},plugin:{code:"plugin",type:"CHECK_BOX",label:kb.constants.config.caption.builder.plugin[kb.operator.language],required:!1,noLabel:!1,options:[]},customizejs:{code:"customizejs",
type:"MULTI_LINE_TEXT",label:kb.constants.config.caption.builder.customize.js[kb.operator.language],required:!1,noLabel:!1,lines:"3"},customizecss:{code:"customizecss",type:"MULTI_LINE_TEXT",label:kb.constants.config.caption.builder.customize.css[kb.operator.language],required:!1,noLabel:!1,lines:"3"}}};this.builder={alter:class extends KintoneBoosterDialog{constructor(){super(999996,!1,!1);this.app={id:"alterbuilder",fields:{}};this.handler=null;this.header.css({paddingLeft:"0.25em",textAlign:"left"}).html("Caption Settings");
this.container.css({height:"auto",width:"35em"});this.contents.css({padding:"0"}).append(kb.create("div").addClass("kb-scope").attr("form-id","form_"+this.app.id));window.on("resize",f=>{this.contents.css({height:"auto"}).css({height:this.container.innerHeight().toString()+"px"})})}get(){return new Promise((f,a)=>{f(kb.record.get(this.contents,this.app))})}set(f){return new Promise((a,d)=>{d=kb.record;var b=d.set,e=this.contents,c=this.app,g={},h;for(h in f)g[h]={value:f[h].alter.label};b.call(d,
e,c,g);a()})}show(f,a){this.app.fields=(d=>{var b={},e;for(e in d){var c=d[e];b[c.code]={code:c.code,type:"MULTI_LINE_TEXT",label:c.label,required:!1,noLabel:!1}}return b})(f);(d=>{for(var b in this.app.fields)d.append(kb.field.activate(kb.field.create(this.app.fields[b]).css({width:"100%"}),this.app));d.elms("input,select,textarea").each((e,c)=>e.initialize())})(this.contents.elm(".kb-scope").empty());this.handler&&(this.ok.off("click",this.handler),this.cancel.off("click"));this.handler=d=>{this.get().then(b=>
{b.error||(a(b.record),this.hide())})};this.ok.on("click",this.handler);this.cancel.on("click",d=>this.hide());this.set(f).then(()=>{this.contents.css({height:"auto"}).css({height:this.container.innerHeight().toString()+"px"});super.show()})}}};this.keep={alter:{builder:null},app:{},fields:{},injector:{},nav:{},plugins:[]};this.lib={activate:(f,a,d=!1)=>{var b=e=>{e=e.changedTouches?Array.from(e.changedTouches).first():e;kb.event.call("kb.drag.start",{element:f,page:{x:e.pageX,y:e.pageY}});window.off("touchmove,mousemove",
b)};f.fieldInfo=a;d&&f.append(kb.create("button").addClass("kb-icon kb-icon-trash kb-builder-drag-button").on("touchstart,mousedown",e=>{e.stopPropagation()}).on("click",e=>{kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],()=>{f.parentNode.removeChild(f);this.lib.remodel()})})).append(kb.create("button").addClass("kb-icon kb-icon-setting kb-builder-drag-button").on("touchstart,mousedown",e=>{e.stopPropagation()}).on("click",e=>{this.keep.alter.builder.show((()=>{var c=
{};c[f.fieldInfo.code]=f.fieldInfo;if("SUBTABLE"==f.fieldInfo.type)for(var g in f.fieldInfo.fields){var h=f.fieldInfo.alter.fields[g],m=kb.extend({},f.fieldInfo.fields[g]);m.alter={label:h.label};c[m.code]=m}return c})(),c=>{f.fieldInfo.alter.label=c[f.fieldInfo.code].value;if("SUBTABLE"==f.fieldInfo.type)for(var g in f.fieldInfo.fields)f.fieldInfo.alter.fields[g].label=c[g].value;this.lib.remodel()})}));f.on("touchstart,mousedown",e=>{if(!f.hasAttribute("disabled"))window.on("touchmove,mousemove",
b);e.stopPropagation();e.preventDefault()}).on("touchend,mouseup",e=>{window.off("touchmove,mousemove",b)});return f},create:f=>{var a=null;switch(f.type){case "SUBTABLE":f.alter={label:f.alter?f.alter.label:"",fields:Object.keys(f.fields).reduce((b,e)=>{e in b||(b[e]={label:""});return b},f.alter?f.alter.fields:{})};for(var d in f.alter.fields)d in f.fields||delete f.alter.fields[d];a=kb.table.activate(kb.table.create(f,!0,!1,!0),kb.extend({id:this.app.id},this.keep.app));this.keep.app.fields[f.code].noLabel||
a.insertBefore(kb.create("span").addClass("kb-table-caption").html(this.keep.app.fields[f.code].label),a.elm("tbody"));break;default:switch(f.alter={label:f.alter?f.alter.label:""},a=kb.field.create(f),f.type){case "NUMBER":kb.field.activate(a,{id:"injectorbuilder",fields:(()=>{var b={};b[f.code]=f;return b})()})}}return this.lib.activate(a.attr("field-type","field"),f,!0)},init:()=>{this.contents.elm(".kb-builder-drag").insertBefore(this.contents.elm(".kb-builder-drag-guide"),null);kb.children(this.contents.elm(".kb-builder-drag")).each((f,
a)=>{f.hasClass("kb-builder-drag-guide")||f.parentNode.removeChild(f)})},remodel:()=>{this.keep.injector.fields=[];for(var f in this.keep.nav)this.keep.nav[f].removeAttr("disabled");kb.children(this.contents.elm(".kb-builder-drag")).each((a,d)=>{if(!a.hasClass("kb-builder-drag-guide")){switch(a.fieldInfo.type){case "NUMBER":a.elm(".kb-field-value").dispatchEvent(new Event("show"));a.fieldInfo.noLabel||(e=>{this.contents.elm('[field-id="'+CSS.escape(a.fieldInfo.code)+'"]').elm(".kb-field-caption").html(e.replace(/\n/g,
"<br>"))})(a.fieldInfo.alter.label||a.fieldInfo.label);break;case "SUBTABLE":0==a.tr.length&&a.addRow();a.fieldInfo.noLabel||(e=>{this.contents.elm('[field-id="'+CSS.escape(a.fieldInfo.code)+'"]').elm(".kb-table-caption").html(e.replace(/\n/g,"<br>"))})(a.fieldInfo.alter.label||a.fieldInfo.label);for(var b in a.fieldInfo.alter.fields)((e,c)=>{c.noLabel||(g=>{this.contents.elm('[field-id="'+CSS.escape(c.code)+'"]').elm(".kb-field-caption").html(g.replace(/\n/g,"<br>"))})(e.label||c.label)})(a.fieldInfo.alter.fields[b],
a.fieldInfo.fields[b]);break;default:a.fieldInfo.noLabel||(e=>{this.contents.elm('[field-id="'+CSS.escape(a.fieldInfo.code)+'"]').elm(".kb-field-caption").html(e.replace(/\n/g,"<br>"))})(a.fieldInfo.alter.label||a.fieldInfo.label)}this.keep.nav[a.fieldInfo.code].attr("disabled","disabled");this.keep.injector.fields.push({code:a.fieldInfo.code,type:a.fieldInfo.type,alter:a.fieldInfo.alter})}})}};this.header.css({paddingLeft:"0.25em",textAlign:"left"}).html("Injector Settings");this.container.css({height:"calc(100% - 1em)",
width:"calc(100% - 1em)"});this.contents.addClass("kb-builder").css({padding:"0"}).append(kb.create("main").addClass("kb-builder-main").append((f=>{f.append(kb.create("nav").addClass("kb-builder-nav").append(kb.create("div").addClass("kb-builder-nav-main"))).append(kb.create("div").addClass("kb-builder-block").append(kb.create("div").addClass("kb-builder-block-container").append(kb.create("div").addClass("kb-injector").append(kb.create("div").addClass("kb-injector-main").append(kb.create("header").addClass("kb-injector-header").append(kb.create("div").addClass("kb-injector-header-title")).append(kb.create("div").addClass("kb-injector-header-description"))).append(kb.create("main").addClass("kb-injector-body").append(((a,
d)=>{(new MutationObserver(()=>{d.visible()?a.addClass("kb-dragging"):a.removeClass("kb-dragging")})).observe(d,{attributes:!0});return a.append(d)})(kb.create("div").addClass("kb-builder-drag").attr("field-type","form"),kb.create("div").addClass("kb-hidden kb-builder-drag-guide")))).append(kb.create("footer").addClass("kb-injector-footer").append(kb.create("button").addClass("kb-injector-button").html(kb.constants.config.caption.builder.button.submit[kb.operator.language]))))))).append(kb.create("nav").addClass("kb-builder-nav").append(kb.create("div").addClass("kb-builder-nav-main").append(kb.field.activate(kb.field.create(this.app.fields.title).css({width:"100%"}),
this.app)).append(kb.field.activate(kb.field.create(this.app.fields.description).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.directory).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.operator).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.pass).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.basicoperator).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.basicpass).css({width:"100%"}),
this.app)).append(kb.field.activate(kb.field.create(this.app.fields.bodycolor).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.buttoncolor).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.plugin).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.customizejs).css({width:"100%"}),this.app)).append(kb.field.activate(kb.field.create(this.app.fields.customizecss).css({width:"100%"}),this.app)).append(kb.create("p").addClass("kb-caution").html(kb.constants.config.description.customize[kb.operator.language]))));
kb.event.on("kb.change.title",a=>{a.container.elm(".kb-injector-header-title").html(a.record.title.value?a.record.title.value:"");return a});kb.event.on("kb.change.description",a=>{a.container.elm(".kb-injector-header-description").html(a.record.description.value?a.record.description.value.replace(/\n/g,"<br>"):"");return a});kb.event.on("kb.change.directory",a=>{if(a.record.directory.value&&a.record.directory.value!=this.keep.injector.directory){var d=()=>{var b=kb.record,e=b.set,c=this.contents,
g=this.app,h=a.record;h.directory.value="";e.call(b,c,g,h)};fetch("https://api.kintone-booster.com/injector?directory="+a.record.directory.value,{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(b=>{b.json().then(e=>{switch(b.status){case 200:"ok"!=e.result&&(kb.alert(kb.constants.config.message.invalid.used[kb.operator.language]),d());break;default:kb.alert(kb.error.parse(e)),d()}})}).catch(b=>{kb.alert(kb.error.parse(b));d()})}return a});kb.event.on("kb.change.bodycolor",a=>{a.container.elm(".kb-injector").css({backgroundColor:a.record.bodycolor.value?
a.record.bodycolor.value:""});return a});kb.event.on("kb.change.buttoncolor",a=>{a.container.elm(".kb-injector-button").css({backgroundColor:a.record.buttoncolor.value?a.record.buttoncolor.value:""});return a});kb.event.on("kb.drag.start",a=>{var d=a.element.parentNode.hasClass("kb-builder-drag")?a.element:null,b=kb.extend({},a.element.fieldInfo),e=this.contents.elm(".kb-builder-drag-guide"),c={move:g=>{var h=document.elementFromPoint(g.pageX,g.pageY);h?h!=e&&(m=>{var p={setup:(n,k)=>{n.insertBefore(e.removeClass("kb-hidden"),
k)}};switch(h.attr("field-type")){case "field":g.pageY<m.top+.5*m.height?p.setup(h.parentNode,h):p.setup(h.parentNode,h.nextElementSibling);break;case "form":d||p.setup(h,null);break;default:d||e.addClass("kb-hidden")}})(h.getBoundingClientRect()):d||e.addClass("kb-hidden")},end:g=>{e.visible()?(e.parentNode.insertBefore((()=>d?d.removeClass("kb-hidden"):this.lib.create(b))(),e.nextElementSibling),this.contents.elm(".kb-builder-drag").insertBefore(e.addClass("kb-hidden"),null),this.lib.remodel()):
(d&&d.removeClass("kb-hidden"),this.contents.elm(".kb-builder-drag").insertBefore(e.addClass("kb-hidden"),null));window.off("mousemove,touchmove",c.move);window.off("mouseup,touchend",c.end);g.stopPropagation();g.preventDefault()}};d?(g=>{e.css({height:g.height.toString()+"px"});d.addClass("kb-hidden").parentNode.insertBefore(e.removeClass("kb-hidden"),d.nextElementSibling)})(d.getBoundingClientRect()):e.css({height:""});window.on("mousemove,touchmove",c.move);window.on("mouseup,touchend",c.end)});
return f})(kb.create("div").addClass("kb-scope kb-builder-block").attr("form-id","form_injectorbuilder"))));this.contents.elms("input,select,textarea").each((f,a)=>f.initialize());this.keep.alter.builder=new this.builder.alter}get(){return new Promise((f,a)=>{a={error:!1,injector:this.keep.injector};a.error=((d,b)=>{d.error||(0==b.fields.length?(d.error=!0,kb.alert(kb.constants.config.message.invalid.field[kb.operator.language])):b.fields.some(e=>!(e.code in this.keep.fields))&&(d.error=!0,kb.alert(kb.constants.config.message.invalid.unknown[kb.operator.language])),
d.error||(d.record.directory.value.match(/^[0-9a-z-_.!']+$/g)?["api","static"].includes(d.record.directory.value)?(d.error=!0,kb.alert(kb.constants.config.message.invalid.reserved[kb.operator.language])):(b.title=d.record.title.value,b.description=d.record.description.value,b.directory=d.record.directory.value,b.operator=d.record.operator.value,b.pass=d.record.pass.value,b.basic.operator=d.record.basicoperator.value,b.basic.pass=d.record.basicpass.value,b.colors.body=d.record.bodycolor.value,b.colors.button=
d.record.buttoncolor.value,b.plugins=d.record.plugin.value,b.customize.js=d.record.customizejs.value,b.customize.css=d.record.customizecss.value):(d.error=!0,kb.alert(kb.constants.config.message.invalid.characters[kb.operator.language]))));return d.error})(kb.record.get(this.contents,this.app),a.injector);f(a)})}set(){return new Promise((f,a)=>{kb.record.set(this.contents,this.app,(()=>{var d={title:{value:this.keep.injector.title},description:{value:this.keep.injector.description},directory:{value:this.keep.injector.directory},
operator:{value:this.keep.injector.operator},pass:{value:this.keep.injector.pass},basicoperator:{value:this.keep.injector.basic.operator},basicpass:{value:this.keep.injector.basic.pass},bodycolor:{value:this.keep.injector.colors.body},buttoncolor:{value:this.keep.injector.colors.button},plugin:{value:this.keep.injector.plugins},customizejs:{value:this.keep.injector.customize.js},customizecss:{value:this.keep.injector.customize.css}};(b=>{b.options.operator.empty().assignOption([{code:"",label:""}].concat(kb.roleSet.user.map(e=>
({code:e.code.value,label:e.name.value}))),"label","code");b.options.plugin.elms("label").each((e,c)=>e.parentNode.removeChild(e));this.keep.plugins.each((e,c)=>{c=b.options.plugin;var g=c.append,h=kb.create("label").append(kb.create("input").attr("type","checkbox").attr("data-type","checkbox").val(e)),m=h.append,p=kb.create("span"),n=p.html,k="";switch(e){case "style":k="Boost! Style";break;case "cascade":k="Boost! Cascade";break;case "action":k="Boost! Action";break;case "submit":k="Boost! Submit";
break;case "upsert":k="Boost! Upsert";break;case "mail":k="Boost! Mail";break;case "omail":k="Boost! OAuth Mail"}g.call(c,m.call(h,n.call(p,k)))});b.guides.title.html(d.title.value?d.title.value:"");b.guides.description.html(d.description.value?d.description.value.replace(/\n/g,"<br>"):"");b.guides.colors.body.css({backgroundColor:d.bodycolor.value?d.bodycolor.value:""});b.guides.colors.button.css({backgroundColor:d.buttoncolor.value?d.buttoncolor.value:""})})({guides:{title:this.contents.elm(".kb-injector-header-title"),
description:this.contents.elm(".kb-injector-header-description"),colors:{body:this.contents.elm(".kb-injector"),button:this.contents.elm(".kb-injector-button")}},options:{operator:this.contents.elm("[field-id=operator]").elm("select"),plugin:this.contents.elm("[field-id=plugin]").elm(".kb-field-value")}});(b=>{for(var e in this.keep.fields)(c=>{kb.field.reserved.includes(c.type)||c.expression||b.append(kb.create("div").addClass("kb-builder-nav-button").append((g=>{this.keep.nav[c.code]=g;return this.lib.activate(g,
c).append(kb.create("span").addClass("kb-builder-nav-button-item-label").html(c.label))})(kb.create("span").addClass("kb-builder-nav-button-item"))))})(this.keep.fields[e]);return b})(this.contents.elm(".kb-builder-nav-main").empty());(b=>{b.each((e,c)=>{if(e.code in this.keep.fields){c=this.contents.elm(".kb-builder-drag");var g=c.append,h=this.lib,m=h.create,p=kb.extend({},this.keep.fields[e.code]);p.alter=e.alter;g.call(c,m.call(h,p))}});this.lib.remodel()})(this.keep.injector.fields);return d})());
f()})}show(f,a,d,b,e){this.lib.init();this.keep.app=d;this.keep.fields=a;this.keep.injector=(c=>{"customize"in c||(c.customize={css:"",js:""});return c})(kb.extend({},f));this.keep.plugins=b;this.keep.nav={};this.contents.elms("input,select,textarea").each((c,g)=>{c.alert&&c.alert.hide()});this.handler&&(this.ok.off("click",this.handler),this.cancel.off("click"));this.handler=c=>{this.get().then(g=>{g.error||(e(this.keep.injector),this.hide())})};this.ok.on("click",this.handler);this.cancel.on("click",
c=>this.hide());(c=>{0==kb.roleSet.user.length?kb.roleSet.load().then(()=>c()):c()})(()=>{this.set().then(()=>{super.show()})})}}})(kintone.$PLUGIN_ID);
kb.constants=kb.extend({config:{caption:{builder:{basic:{operator:{en:"Basic Authentication User",ja:"Basic\u8a8d\u8a3c\u7528\u30e6\u30fc\u30b6\u30fc",zh:"Basic\u8ba4\u8bc1\u7528\u6237","zh-TW":"Basic\u8a8d\u8b49\u7528\u4f7f\u7528\u8005"},pass:{en:"Basic Authentication Password",ja:"Basic\u8a8d\u8a3c\u7528\u30d1\u30b9\u30ef\u30fc\u30c9",zh:"Basic\u8ba4\u8bc1\u5bc6\u7801","zh-TW":"Basic\u8a8d\u8b49\u7528\u5bc6\u78bc"}},button:{submit:{en:"Submit",ja:"\u9001\u4fe1",zh:"\u63d0\u4ea4","zh-TW":"\u63d0\u4ea4"}},
colors:{body:{en:"Background Color",ja:"\u30da\u30fc\u30b8\u80cc\u666f\u8272",zh:"\u80cc\u666f\u989c\u8272","zh-TW":"\u80cc\u666f\u984f\u8272"},button:{en:"Button Color",ja:"\u30dc\u30bf\u30f3\u80cc\u666f\u8272",zh:"\u6309\u94ae\u989c\u8272","zh-TW":"\u6309\u9215\u984f\u8272"}},customize:{css:{en:"Custom CSS URL",ja:"\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u7528CSS\u306e\u53c2\u7167\u5148URL",zh:"CSS\u81ea\u5b9a\u4e49URL","zh-TW":"CSS\u81ea\u8a02URL"},js:{en:"Custom JS URL",ja:"\u30ab\u30b9\u30bf\u30de\u30a4\u30ba\u7528JS\u306e\u53c2\u7167\u5148URL",
zh:"JS\u81ea\u5b9a\u4e49URL","zh-TW":"JS\u81ea\u8a02URL"}},directory:{en:"Directory Name",ja:"\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d",zh:"\u76ee\u5f55\u540d\u79f0","zh-TW":"\u76ee\u9304\u540d\u7a31"},description:{en:"Description",ja:"\u8aac\u660e",zh:"\u63cf\u8ff0","zh-TW":"\u63cf\u8ff0"},operator:{en:"Registered User",ja:"\u767b\u9332\u30e6\u30fc\u30b6\u30fc",zh:"\u6ce8\u518c\u7528\u6237","zh-TW":"\u8a3b\u518a\u7528\u6236"},pass:{en:"Password",ja:"\u30d1\u30b9\u30ef\u30fc\u30c9",zh:"\u5bc6\u7801",
"zh-TW":"\u5bc6\u78bc"},plugin:{en:"Linked plugins",ja:"\u9023\u52d5\u30d7\u30e9\u30b0\u30a4\u30f3",zh:"\u8054\u52a8\u63d2\u4ef6","zh-TW":"\u9023\u52d5\u5916\u639b"},title:{en:"Title",ja:"\u30bf\u30a4\u30c8\u30eb",zh:"\u6807\u9898","zh-TW":"\u6a19\u984c"}},injector:{button:{en:"Open Settings",ja:"\u8a2d\u5b9a\u753b\u9762\u3092\u958b\u304f",zh:"\u6253\u5f00\u8bbe\u7f6e","zh-TW":"\u958b\u555f\u8a2d\u5b9a"},title:{en:"Setting name",ja:"\u8a2d\u5b9a\u540d",zh:"\u8bbe\u7f6e\u540d\u79f0","zh-TW":"\u8a2d\u5b9a\u540d\u7a31",
pending:{en:"Not Yet Configured",ja:"\u672a\u8a2d\u5b9a",zh:"\u5c1a\u672a\u914d\u7f6e","zh-TW":"\u5c1a\u672a\u8a2d\u5b9a"}},url:{en:"URL",ja:"URL",zh:"URL","zh-TW":"URL"}}},description:{customize:{en:"If you want to add multiple files, please enter each URL separated by commas.",ja:"\u8907\u6570\u306e\u30d5\u30a1\u30a4\u30eb\u3092\u8ffd\u52a0\u3059\u308b\u5834\u5408\u306f\u3001\u305d\u308c\u305e\u308c\u306eURL\u3092\u30ab\u30f3\u30de\u533a\u5207\u308a\u3067\u5165\u529b\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u5982\u679c\u8981\u6dfb\u52a0\u591a\u4e2a\u6587\u4ef6\uff0c\u8bf7\u7528\u9017\u53f7\u5206\u9694\u8f93\u5165\u6bcf\u4e2aURL\u3002","zh-TW":"\u5982\u679c\u8981\u6dfb\u52a0\u591a\u500b\u6a94\u6848\uff0c\u8acb\u7528\u9017\u865f\u5206\u9694\u8f38\u5165\u6bcf\u500bURL\u3002"},injector:{en:'Click the "Open Settings" button and then create the form screen or specify the plugin you want to link.',ja:"\u300c\u8a2d\u5b9a\u753b\u9762\u3092\u958b\u304f\u300d\u30dc\u30bf\u30f3\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u3001\u30d5\u30a9\u30fc\u30e0\u753b\u9762\u306e\u4f5c\u6210\u3084\u9023\u52d5\u3055\u305b\u305f\u3044\u30d7\u30e9\u30b0\u30a4\u30f3\u306e\u6307\u5b9a\u3092\u884c\u3063\u3066\u4e0b\u3055\u3044\u3002",
zh:"\u70b9\u51fb\u201c\u6253\u5f00\u8bbe\u7f6e\u201d\u6309\u94ae\u7136\u540e\u521b\u5efa\u8868\u5355\u754c\u9762\u6216\u6307\u5b9a\u60a8\u8981\u94fe\u63a5\u7684\u63d2\u4ef6\u3002","zh-TW":"\u9ede\u64ca\u300c\u958b\u555f\u8a2d\u5b9a\u300d\u6309\u9215\uff0c\u7136\u5f8c\u5275\u5efa\u8868\u55ae\u754c\u9762\u6216\u6307\u5b9a\u60a8\u8981\u9023\u7d50\u7684\u5916\u639b\u3002"},ip:{en:'If you are restricting IP addresses, please allow "162.43.20.8".',ja:"IP\u30a2\u30c9\u30ec\u30b9\u5236\u9650\u3092\u884c\u3063\u3066\u3044\u308b\u5834\u5408\u306f\u300c162.43.20.8\u300d\u3092\u8a31\u53ef\u3057\u3066\u4e0b\u3055\u3044\u3002",
zh:'\u5982\u679c\u60a8\u6b63\u5728\u8fdb\u884cIP\u5730\u5740\u9650\u5236\uff0c\u8bf7\u5141\u8bb8 "162.43.20.8"\u3002',"zh-TW":'\u5982\u679c\u60a8\u6b63\u5728\u9032\u884cIP\u4f4d\u5740\u9650\u5236\uff0c\u8acb\u5141\u8a31 "162.43.20.8"\u3002'},plugin:{en:'When using linked plugins, the operation conditions must have "Execute on injector only" or "Execute on both PC and mobile versions, or on injector" checked.',ja:"\u9023\u52d5\u30d7\u30e9\u30b0\u30a4\u30f3\u3092\u4f7f\u7528\u3059\u308b\u5834\u5408\u306f\u3001\u305d\u308c\u3089\u306e\u52d5\u4f5c\u6761\u4ef6\u3067\u300c\u30a4\u30f3\u30b8\u30a7\u30af\u30bf\u30fc\u306e\u307f\u3067\u5b9f\u884c\u300d\u307e\u305f\u306f\u300cPC\u7248\u3068\u30e2\u30d0\u30a4\u30eb\u7248\u306e\u4e21\u65b9\u3001\u307e\u305f\u306f\u30a4\u30f3\u30b8\u30a7\u30af\u30bf\u30fc\u3067\u5b9f\u884c\u300d\u306b\u30c1\u30a7\u30c3\u30af\u304c\u4ed8\u3044\u3066\u3044\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002",
zh:"\u5f53\u4f7f\u7528\u8054\u52a8\u63d2\u4ef6\u65f6\uff0c\u5fc5\u987b\u5728\u5176\u64cd\u4f5c\u6761\u4ef6\u4e2d\u52fe\u9009\u201c\u4ec5\u4f7f\u7528Injector\u6267\u884c\u201d\u6216\u201c\u5728PC\u7248\u548c\u624b\u673a\u7248\u7684\u4e24\u8005\uff0c\u6216\u4f7f\u7528Injector\u6267\u884c\u201d\u3002","zh-TW":"\u7576\u4f7f\u7528\u9023\u52d5\u5916\u639b\u6642\uff0c\u5fc5\u9808\u5728\u5176\u64cd\u4f5c\u689d\u4ef6\u4e2d\u52fe\u9078\u300c\u50c5\u4f7f\u7528Injector\u57f7\u884c\u300d\u6216\u300c\u5728PC\u7248\u548c\u624b\u6a5f\u7248\u7684\u5169\u8005\uff0c\u6216\u4f7f\u7528Injector\u57f7\u884c\u300d\u3002"},
url:{en:"The URL will be accessible after the settings have been saved.",ja:"URL\u306f\u8a2d\u5b9a\u306e\u4fdd\u5b58\u5f8c\u306b\u30a2\u30af\u30bb\u30b9\u51fa\u6765\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3059\u3002",zh:"\u4fdd\u5b58\u8bbe\u7f6e\u540e\u5c06\u53ef\u4ee5\u8bbf\u95ee\u8be5URL\u3002","zh-TW":"\u4fdd\u5b58\u8a2d\u5b9a\u5f8c\u5c07\u53ef\u4ee5\u5b58\u53d6\u8a72URL\u3002"}},message:{invalid:{characters:{en:"The directory name contains invalid characters.",ja:"\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u306b\u4f7f\u7528\u51fa\u6765\u306a\u3044\u6587\u5b57\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\u3002",
zh:"\u76ee\u5f55\u540d\u79f0\u5305\u542b\u65e0\u6548\u5b57\u7b26\u3002","zh-TW":"\u76ee\u9304\u540d\u7a31\u5305\u542b\u7121\u6548\u5b57\u5143\u3002"},duplicate:{en:"You cannot specify the same directory name with different settings.",ja:"\u7570\u306a\u308b\u8a2d\u5b9a\u3067\u540c\u3058\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u3092\u6307\u5b9a\u3059\u308b\u3053\u3068\u306f\u51fa\u6765\u307e\u305b\u3093\u3002",zh:"\u4e0d\u80fd\u5728\u4e0d\u540c\u7684\u8bbe\u7f6e\u4e0b\u6307\u5b9a\u76f8\u540c\u7684\u76ee\u5f55\u540d\u79f0\u3002",
"zh-TW":"\u4e0d\u80fd\u5728\u4e0d\u540c\u7684\u8a2d\u5b9a\u4e0b\u6307\u5b9a\u76f8\u540c\u7684\u76ee\u9304\u540d\u7a31\u3002"},field:{en:"Please place the field.",ja:"\u30d5\u30a3\u30fc\u30eb\u30c9\u3092\u914d\u7f6e\u3057\u3066\u4e0b\u3055\u3044\u3002",zh:"\u8bf7\u653e\u7f6e\u5b57\u6bb5\u3002","zh-TW":"\u8acb\u653e\u7f6e\u6b04\u4f4d\u3002"},reserved:{en:"The entered directory name cannot be used.",ja:"\u5165\u529b\u3055\u308c\u305f\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u306f\u4f7f\u7528\u51fa\u6765\u307e\u305b\u3093\u3002",
zh:"\u8f93\u5165\u7684\u76ee\u5f55\u540d\u79f0\u65e0\u6cd5\u4f7f\u7528\u3002","zh-TW":"\u8f38\u5165\u7684\u76ee\u9304\u540d\u7a31\u7121\u6cd5\u4f7f\u7528\u3002"},unknown:{en:"An unknown field is placed.",ja:"\u4e0d\u660e\u306a\u30d5\u30a3\u30fc\u30eb\u30c9\u304c\u914d\u7f6e\u3055\u308c\u3066\u3044\u307e\u3059\u3002",zh:"\u653e\u7f6e\u4e86\u672a\u77e5\u5b57\u6bb5\u3002","zh-TW":"\u653e\u7f6e\u4e86\u672a\u77e5\u6b04\u4f4d\u3002"},used:{en:"The entered directory name is already in use.",ja:"\u5165\u529b\u3057\u305f\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u540d\u306f\u65e2\u306b\u306b\u4f7f\u7528\u3055\u308c\u3066\u3044\u307e\u3059\u3002",
zh:"\u8f93\u5165\u7684\u76ee\u5f55\u540d\u79f0\u5df2\u88ab\u4f7f\u7528\u3002","zh-TW":"\u8f38\u5165\u7684\u76ee\u9304\u540d\u7a31\u5df2\u88ab\u4f7f\u7528\u3002"}}}}},kb.constants);
