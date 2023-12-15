/*
* FileName "core.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
window.KB_BREAK='__kb_break';
window.KB_CONTINUE='__kb__continue';
window.KB_SKIP='__kb__skip';
window.KintoneBooster=class{
	/* constructor */
	constructor(){
		/* setup properties */
		this.error=null;
		this.event=null;
		this.operator=null;
		this.roleSet=null;
		this.eventHandlers={};
		this.popups={
			alert:null,
			loader:null,
			progress:null,
			multiPicker:null,
			colorPicker:null,
			datePicker:null
		};
		this.file={
			clone:(files,silent=false) => {
				return new Promise((resolve,reject) => {
					var recurse=(index,callback) => {
						((file) => {
							kb.file.download(file,silent).then((blob) => {
								kb.file.upload(new File([blob],file.name,{type:file.contentType}),silent).then((resp) => {
									file.fileKey=resp.fileKey;
									index++;
									if (index<files.length) recurse(index,callback);
									else callback();
								});
							})
							.catch((error) => {
								index++;
								if (index<files.length) recurse(index,callback);
								else callback();
							});
						})(files[index]);
					};
					if (files.length!=0)
					{
						if (!silent) kb.loadStart();
						recurse(0,() => resolve());
					}
					else resolve();
				});
			},
			download:(file,silent=false) => {
				return new Promise((resolve,reject) => {
					if (!silent) kb.loadStart();
					fetch(kintone.api.url('/k/v1/file',true)+'?fileKey='+file.fileKey,{
						method:'GET',
						headers:{
							'X-Requested-With':'XMLHttpRequest'
						}
					})
					.then((response) => {
						if (!silent) kb.loadEnd();
						response.blob().then((blob) => {
							switch (response.status)
							{
								case 200:
									resolve(blob);
									break;
								default:
									reject({message:response.statusText,status:response.status});
									break;
							}
						});
					})
					.catch((error) => {
						if (!silent) kb.loadEnd();
						((error) => {
							switch (error.status)
							{
								case 400:
									reject({message:'INVALID_TOKEN',status:error.status});
									break;
								case 401:
									reject({message:'UNAUTHORIZED',status:error.status});
									break;
								case 500:
									reject({message:'INTERNAL_SERVER_ERROR',status:error.status});
									break;
								case 502:
									reject({message:'BAD_GATEWAY',status:error.status});
									break;
								case 404:
									reject({message:'NOT_FOUND',status:error.status});
									break;
								default:
									reject({message:'UNHANDLED_ERROR',status:error.status});
									break;
							}
						})(Error(error));
					})
				});
			},
			upload:(file,silent=false) => {
				return new Promise((resolve,reject) => {
					if (!silent) kb.loadStart();
					fetch(kintone.api.url('/k/v1/file',true),{
						method:'POST',
						headers:{
							'X-Requested-With':'XMLHttpRequest'
						},
						body:((filedata) => {
							var blob=new Blob([file],{type:file.type});
							filedata.append('__REQUEST_TOKEN__',kintone.getRequestToken());
							filedata.append('file',blob,file.name);
							return filedata;
						})(new FormData())
					})
					.then((response) => {
						if (!silent) kb.loadEnd();
						response.json().then((json) => {
							switch (response.status)
							{
								case 200:
									resolve({
										contentType:file.type,
										fileKey:json.fileKey,
										name:file.name
									});
									break;
								default:
									reject(json);
									break;
							}
						});
					})
					.catch((error) => {
						if (!silent) kb.loadEnd();
						((error) => {
							switch (error.status)
							{
								case 400:
									reject({message:'INVALID_TOKEN',status:error.status});
									break;
								case 401:
									reject({message:'UNAUTHORIZED',status:error.status});
									break;
								case 500:
									reject({message:'INTERNAL_SERVER_ERROR',status:error.status});
									break;
								case 502:
									reject({message:'BAD_GATEWAY',status:error.status});
									break;
								case 404:
									reject({message:'NOT_FOUND',status:error.status});
									break;
								default:
									reject({message:'UNHANDLED_ERROR',status:error.status});
									break;
							}
						})(Error(error));
					})
				});
			}
		};
	}
	/* show alert */
	alert(message,callback){
		this.loadEnd();
		this.progressEnd();
		this.popups.alert.alert(message,callback);
	}
	/* get children */
	children(element){
		return Array.from(element.children);
	}
	/* copy to clipboard */
	clipboard(value){
		var input=kb.create('input').attr('type','text').val(value);
		kb.elm('body').append(input);
		input.select();
		document.execCommand('copy');
		document.body.removeChild(input);
	}
	/* show confirm */
	confirm(message,callback,cancelcapture){
		this.loadEnd();
		this.progressEnd();
		this.popups.alert.confirm(message,callback,cancelcapture);
	}
	/* create element */
	create(tagname){
		return document.createElement(tagname);
	}
	/* check device */
	device(){
		var ua=navigator.userAgent;
		if (ua.indexOf('iPhone')>0 || ua.indexOf('iPod')>0 || ua.indexOf('Android')>0 && ua.indexOf('Mobile')>0 || ua.indexOf('Windows Phone')>0) return 'sp';
		if (ua.indexOf('iPad')>0 || ua.indexOf('Android')>0) return 'tab';
		return 'other';
	}
	/* download text file */
	downloadText(values,filename){
		var url=window.URL || window.webkitURL;
		var a=kb.create('a')
		.attr('href',url.createObjectURL(new Blob([new Uint8Array([0xEF,0xBB,0xBF]),values],{type:'text/plain'})))
		.attr('target','_blank')
		.attr('download',filename)
		.css({display:'none'});
		kb.elm('body').append(a);
		a.click();
		document.body.removeChild(a);
	}
	/* get elements */
	elm(selectors){
		return document.querySelector(selectors);
	}
	elms(selectors){
		return Array.from(document.querySelectorAll(selectors));
	}
	/* encrypt */
	encrypt(data,passphrase){
		return new Promise((resolve,reject) => {
			window.crypto.subtle.importKey('raw',new TextEncoder().encode(passphrase),{name:'AES-GCM',length:256},false,['encrypt'])
			.then((key) => {
				((iv) => {
					window.crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,new TextEncoder().encode(data))
					.then((encrypted) => {
						let bytes=new Uint8Array(encrypted);
						resolve({
							data:btoa(String.fromCharCode(...bytes.slice(0,bytes.length-16))),
							iv:btoa(String.fromCharCode(...iv)),
							tag:btoa(String.fromCharCode(...bytes.slice(bytes.length-16)))
						});
					});
				})(window.crypto.getRandomValues(new Uint8Array(12)));
			}).catch((error) => {
				kb.alert(kb.error.parse(error));
				reject();
			});
		});
	}
	/* extend array */
	extend(target,source){
		var copy=(target,source) => {
			if (source instanceof Function) return source;
			if (source instanceof HTMLElement) return source;
			if (Array.isArray(source)) target=source.map((item) => copy({},item));
			else
			{
				if (source instanceof Object)
				{
					for (var key in source)
					{
						if (key!=='__proto__')
						{
							if (key in target)
							{
								if ([source[key],target[key]].every((item) => (item instanceof Object && !(item instanceof Array)))) target[key]=copy(target[key],source[key]);
							}
							else
							{
								if (source[key] instanceof Object) target[key]=copy({},source[key]);
								else target[key]=source[key];
							}
						}
					}
				}
				else return source;
			}
			return target;
		};
		return copy(target,source);
	}
	/* show input */
	input(message,callback,type,defaults){
		this.loadEnd();
		this.progressEnd();
		this.popups.alert.input(message,callback,type,defaults);
	}
	/* check number */
	isNumeric(value){
		if (typeof value==='string') return value.match(/^-?[0-9]+(\.[0-9]+)*$/g);
		if (typeof value==='number') return !isNaN(value);
		return false;
	}
	/* hide loader */
	loadEnd(){
		this.popups.loader.hide();
	}
	/* show loader */
	loadStart(){
		this.progressEnd();
		this.popups.loader.show();
	}
	/* show colorPicker */
	pickupColor(callback){
		this.popups.colorPicker.show(callback);
	}
	/* show datePicker */
	pickupDate(activedate,callback){
		this.popups.datePicker.show(activedate,callback,true);
	}
	/* show multiPicker */
	pickupMultiple(records,columninfos,callback,selected){
		this.popups.multiPicker.show(records,columninfos,callback,selected);
	}
	/* hide progress */
	progressEnd(){
		this.popups.progress.hide();
	}
	/* show progress */
	progressStart(max){
		this.loadEnd();
		this.popups.progress.show(max);
	}
	/* update progress */
	progressUpdate(){
		this.popups.progress.update();
	}
	/* get query strings */
	queries(){
		var res={};
		var searches=decodeURI(window.location.search).split('?');
		if (searches.length>1)
		{
			searches=searches.last().replace(/#.*$/g,'').split('&');
			for(var i=0;i<searches.length;i++)
			{
				var search=searches[i].split('=');
				res[search[0]]=search[1];
			}
		}
		return res;
	}
	/* document loaded */
	ready(callback){
		if (!this.popups.alert)
		{
			/* setup login user */
			this.operator=kintone.getLoginUser();
			/* setup properties */
			this.apps=new KintoneBoosterApps();
			this.error=new KintoneBoosterError();
			this.event=new KintoneBoosterEvent();
			this.roleSet=new KintoneBoosterRoleset();
			this.status=new KintoneBoosterStatus();
			this.popups.datePicker=new KintoneBoosterDatePicker();
			this.popups.colorPicker=new KintoneBoosterColorPicker();
			this.popups.multiPicker=new KintoneBoosterMultipicker();
			this.popups.progress=new KintoneBoosterProgress();
			this.popups.loader=new KintoneBoosterLoader();
			this.popups.alert=new kintoneBoosterAlert();
			/* setup validation method */
			kb.elms('input,select,textarea').each((element,index) => element.initialize());
		}
		/* platform */
		switch (navigator.platform.replace(/^(iPad|iPhone|Linux|Mac|Win).*$/g,'$1'))
		{
			case 'iPad':
			case 'iPhone':
			case 'Mac':
				kb.elm('body').addClass('mac');
				break;
			case 'Linux':
				kb.elm('body').addClass('linux');
				break;
			case 'Win':
				kb.elm('body').addClass('win');
				break;
		}
		if (callback) callback(this);
	}
	/* scroll to element */
	scroll(pos,duration){
		var counter=0;
		var keep=performance.now();
		var param=(window.pageYOffset-pos)/2;
		var step=(timestamp) => {
			var diff=timestamp-keep;
			if (diff>100) diff=30;
			counter+=Math.PI/(duration/diff);
			if (counter>=Math.PI) return;
			window.scrollTo(0,Math.round(pos+param+param*Math.cos(counter)));
			keep=timestamp;
			window.requestAnimationFrame(step);
		}
		window.requestAnimationFrame(step);
	}
	scrollTo(pos,duration){
		this.scroll(window.pageYOffset+pos,duration);
	}
	scrollTop(duration){
		this.scroll(0,duration);
	}
	/* themeColor */
	themeColor(){
		return {
			backcolor:'#f0f0f0',
			forecolor:'#263238'
		};
	}
	/* timezoneOffset */
	timezoneOffset(){
		return ((offset) => {
			return ((offset>0)?'+':'-')+Math.floor(Math.abs(offset)).toString();
		})(new Date().getTimezoneOffset()/60);
	}
};
window.KintoneBoosterApps=class{
	/* constructor */
	constructor(){}
	/* load */
	load(){
		return new Promise((resolve,reject) => {
			var offset=0;
			var records=[];
			var get=(callback) => {
				kintone.api(kintone.api.url('/k/v1/apps',true),'GET',{offset:offset})
				.then((resp) => {
					Array.prototype.push.apply(records,resp.apps);
					offset+=100;
					if (resp.apps.length==100) get(callback);
					else callback();
				})
				.catch((error) => kb.alert(kb.error.parse(error)));
			};
			get(() => resolve(records));
		});
	}
};
window.KintoneBoosterError=class{
	/* constructor */
	constructor(){
		this.config={
			update:(name) => {
				var res='';
				switch (kb.operator.language)
				{
					case 'en':
						res='Due to an update of the plugin "'+name+'", some configuration information has changed.<br>For safe operation, please open the plugin settings page, make no changes, and simply click the "Save" button to update the settings.';
						break;
					case 'ja':
						res=name+'のアップデートに伴い、一部の設定情報に変更が生じております。<br>安全な運用のため、一度プラグインの設定画面を開き、特に変更を行わずに、そのまま「保存」ボタンをクリックして設定情報の更新を行って下さい。';
						break;
					case 'zh':
						res='由于插件“'+name+'”的更新，部分配置信息已发生变化。<br>为了安全操作，请打开插件的设置页面，不做任何更改，然后直接点击“保存”按钮来更新设置。';
						break;
				}
				return res;
			}
		};
	}
	/* parse */
	parse(error){
		var res=[];
		if (typeof error==='string') res.push(error);
		else
		{
			res.push(('message' in error)?error.message:(('error' in error)?error.error.message:''));
			if ('errors' in error)
				for (var key in error.errors)
					res.push(key.replace(/^record\./g,'').replace(/\.value(\[[0-9]+\]|)/g,'')+':'+error.errors[key].messages.join(','));
		}
		return res.join('<br>');
	}
};
window.KintoneBoosterEvent=class{
	/* constructor */
	constructor(){
		this.eventHandlers={};
	}
	/* setup event handler */
	on(events,handler){
		((Array.isArray(events))?events:events.split(',').map((item) => item.trim())).each((type,index) => {
			if (type)
			{
				if (!(type in this.eventHandlers)) this.eventHandlers[type]=[];
				this.eventHandlers[type].push(handler);
			}
		});
		return this;
	}
	/* clear event handler */
	off(events,handler){
		((Array.isArray(events))?events:events.split(',').map((item) => item.trim())).each((type,index) => {
			if (type)
			{
				if (type in this.eventHandlers)
					this.eventHandlers[type]=this.eventHandlers[type].filter((item) => item!==handler);
			}
		});
		return this;
	}
	/* call event */
	call(type,param){
		var call=(index,param,callback) => {
			var handler=this.eventHandlers[type][index];
			var promise=(handler,param) => {
				return new Promise((resolve,reject) => {
					resolve(handler(param));
				});
			};
			promise(handler,param).then((resp) => {
				if (resp!== null && typeof(resp) === 'object' && resp.constructor === Object) param=resp;
				if (!param.error)
				{
					index++;
					if (index<this.eventHandlers[type].length) call(index,param,callback);
					else callback(param);
				}
				else callback(param);
			});
		};
		return new Promise((resolve,reject) => {
			Object.assign(param,{
				type:type,
				error:false
			});
			if (type in this.eventHandlers)
			{
				if (this.eventHandlers[type].length!=0) call(0,param,(param) => resolve(param));
				else resolve(param);
			}
			else resolve(param);
		});
	}
};
window.KintoneBoosterRoleset=class{
	/* constructor */
	constructor(){
		/* setup properties */
		this.group=[];
		this.organization=[];
		this.user=[];
	}
	/* load record */
	load(){
		return new Promise((resolve,reject) => {
			var group=() => {
				return new Promise((resolve,reject) => {
					var offset=0;
					var records=[];
					var get=(callback) => {
						kintone.api(kintone.api.url('/v1/groups',true)+'?size=100&offset='+offset,'GET',{})
						.then((resp) => {
							Array.prototype.push.apply(records,resp.groups.map((item) => {
								return {code:{value:item.code},name:{value:item.name},info:item};
							}));
							offset+=100;
							if (resp.groups.length==100) get(callback);
							else callback();
						})
						.catch((error) => reject(error));
					};
					get(() => resolve(records));
				});
			};
			var organization=() => {
				return new Promise((resolve,reject) => {
					var offset=0;
					var records=[];
					var get=(callback) => {
						kintone.api(kintone.api.url('/v1/organizations',true)+'?size=100&offset='+offset,'GET',{})
						.then((resp) => {
							Array.prototype.push.apply(records,resp.organizations.map((item) => {
								return {code:{value:item.code},name:{value:item.name},info:item};
							}));
							offset+=100;
							if (resp.organizations.length==100) get(callback);
							else callback();
						})
						.catch((error) => reject(error));
					};
					get(() => resolve(records));
				});
			};
			var user=() => {
				return new Promise((resolve,reject) => {
					var offset=0;
					var records=[];
					var get=(callback) => {
						kintone.api(kintone.api.url('/v1/users',true)+'?size=100&offset='+offset,'GET',{})
						.then((resp) => {
							Array.prototype.push.apply(records,resp.users.map((item) => {
								return {code:{value:item.code},name:{value:item.name},info:item};
							}));
							offset+=100;
							if (resp.users.length==100) get(callback);
							else callback();
						})
						.catch((error) => reject(error));
					};
					get(() => resolve(records));
				});
			}
			group()
			.then((resp) => {
				this.group=resp;
				organization()
				.then((resp) => {
					this.organization=resp;
					user()
					.then((resp) => {
						this.user=resp;
						resolve();
					})
					.catch((error) => kb.alert(kb.error.parse(error)));
				})
				.catch((error) => kb.alert(kb.error.parse(error)));
			})
			.catch((error) => kb.alert(kb.error.parse(error)));
		});
	}
};
window.KintoneBoosterStatus=class{
	/* constructor */
	constructor(){}
	/* load */
	load(app){
		return new Promise((resolve,reject) => {
			kintone.api(kintone.api.url('/k/v1/app/status',true),'GET',{app:app})
			.then((resp) => {
				if (resp.actions)
				{
					resp.actions=resp.actions.reduce((result,current) => {
						current.key=current.name+':'+current.from+':'+current.to;
						result.push(current);
						return result;
					},[]);
				}
				else
				{
					resp.actions=[];
					resp.states={};
				}
				resolve(resp);
			})
			.catch((error) => kb.alert(kb.error.parse(error)));
		});
	}
};
window.KintoneBoosterDialog=class{
	/* constructor */
	constructor(zIndex,disuseheader,disusefooter){
		/* setup properties */
		this.parts={
			button:kb.create('button').addClass('kb-dialog-button').css({
				backgroundColor:'transparent',
				border:'none',
				boxSizing:'border-box',
				color:'#42a5f5',
				cursor:'pointer',
				display:'inline-block',
				fontSize:'1em',
				height:'2em',
				lineHeight:'2em',
				outline:'none',
				margin:'0',
				padding:'0',
				position:'relative',
				textAlign:'center',
				verticalAlign:'top',
				width:'50%'
			}),
			div:kb.create('div').css({
				boxSizing:'border-box',
				position:'relative',
				verticalAlign:'top'
			}),
			icon:kb.create('img').css({
				backgroundColor:'transparent',
				border:'none',
				boxSizing:'border-box',
				cursor:'pointer',
				display:'block',
				height:'1.5em',
				margin:'0.25em',
				position:'absolute',
				width:'1.5em'
			}),
			input:kb.create('input').css({
				backgroundColor:'transparent',
				border:'none',
				boxSizing:'border-box',
				display:'inline-block',
				fontSize:'1em',
				height:'2em',
				lineHeight:'1.5em',
				margin:'0',
				outline:'none',
				padding:'0.25em',
				position:'relative',
				verticalAlign:'top',
				width:'100%'
			}),
			select:kb.create('select').css({
				backgroundColor:'transparent',
				border:'none',
				boxSizing:'border-box',
				display:'inline-block',
				fontSize:'1em',
				height:'2em',
				lineHeight:'1.5em',
				margin:'0',
				outline:'none',
				padding:'0.25em',
				position:'relative',
				verticalAlign:'top',
				width:'100%',
				appearance:'none',
				mozAppearance:'none',
				webkitAppearance:'none'
			}),
			span:kb.create('span').css({
				boxSizing:'border-box',
				display:'inline-block',
				margin:'0',
				padding:'0',
				position:'relative',
				verticalAlign:'top'
			}),
			table:kb.create('table').css({
				border:'none',
				borderCollapse:'collapse',
				margin:'0',
				width:'100%'
			}),
			td:kb.create('td').css({
				border:'none',
				borderBottom:'1px solid #42a5f5',
				boxSizing:'border-box',
				lineHeight:'1.5em',
				margin:'0',
				padding:'0.25em 0.5em',
				textAlign:'left'
			}),
			th:kb.create('th').css({
				border:'none',
				boxSizing:'border-box',
				fontWeight:'normal',
				lineHeight:'2em',
				margin:'0',
				padding:'0',
				position:'sticky',
				textAlign:'center',
				top:'0',
				zIndex:'2'
			})
		};
		this.cover=this.parts.div.clone().addClass('kb-dialog').css({
			alignItems:'center',
			backgroundColor:'rgba(0,0,0,0.5)',
			display:'none',
			height:'100%',
			justifyContent:'center',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:zIndex
		});
		this.container=this.parts.div.clone().css({
			borderRadius:'0.25em',
			boxShadow:'0 0 3px rgba(0,0,0,0.35)',
			cursor:'default',
			maxHeight:'calc(100% - 1em)',
			maxWidth:'calc(100% - 1em)',
			padding:'2em 0 calc(2em + 1px) 0'
		});
		this.contents=this.parts.div.clone().css({
			height:'100%',
			overflowX:'hidden',
			overflowY:'auto',
			padding:'1em',
			width:'100%'
		});
		this.header=this.parts.div.clone().css({
			borderTopLeftRadius:'0.25em',
			borderTopRightRadius:'0.25em',
			boxShadow:'0 1px 0 #42a5f5',
			height:'2em',
			left:'0',
			lineHeight:'2em',
			overflow:'hidden',
			padding:'0 2em 0 0',
			position:'absolute',
			textAlign:'center',
			textOverflow:'ellipsis',
			top:'0',
			whiteSpace:'nowrap',
			width:'100%'
		});
		this.footer=this.parts.div.clone().css({
			borderTop:'1px solid #42a5f5',
			bottom:'0',
			left:'0',
			position:'absolute',
			textAlign:'center',
			width:'100%'
		});
		this.ok=this.parts.button.clone().html('OK');
		this.cancel=this.parts.button.clone().html('Cancel');
		this.close=this.parts.icon.clone().css({
			right:'0',
			top:'0'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9pJREFUeNpiYKAUMMIY/VMmvgdSAjB+YU4+WI4JSbFAQXYeA5KG/+gKGCZMncSArAhDAUyRm7MriCmI4gZkY0GSQDd8IMoXAAFEHf//RxL/ALRbkAldAuo1AQxvgSRA3kL3syDIn8gS6HaCjHqPHN54AUAAUceraMENdwISwAh6RmyaQJ7btXc3ik4kMbgh6CkAbBtMIyjoYEkGybD3OJMPephjS3M4/YyezNEAONqpEtoAATREEa5Egh5oWAMKW2j/x2UTeoJnwqYxMyUdRROMj24wzkQC04BuEDJgRrK1AUg5gNhnzp1lMDUyYbCxtGb4+/cvw/Q5M+EaPLw8GXdu23EAr80kA5CfQPjHjx9gjM4m2s8wpyI7mXZRhaTgA5bcxDh40jZAAI3mZmLToQMsF0DBAWBEHqC6xUCL1gOpABLM3QB0SCDZFpNhIdEOYMRjKUrhCSqJ2NnZGX7+/Ik1h+KRJ67QRYrD/biKRGQLCDkIChzR0wALDoUOhMol5BofvW2Ew7wDxBR8B/BVAiALQT4EWQiiQXx8lQI28wZXHA9oqh7QfEzLkmvkAYAAGkWjYNC1QAqQilNQkTiBZhZDG/31BJQ1Ah3RQBWLcXS5CQGCoyFMBCw1IMNScE8cqpc8i4HgPAXp5zxZFkPrY5ShAlERUZwGgeTQhxDQzSBoMTReMYYWosMjsVoOEgPJYQECULOI9vF6dIGlK5djtRzZUpgaQmbhsxijsff6zWsMy9EtBakhtuFIUv8a3XIiLCU7VWO1HHk0DMQm1VKyLAYFL3Q8FT4Ehy+1U8Vi9DjFleAosfgAIUtBwYstwRHbOcBlcSC2PIwtIaFbToxZOC2GFvAfsOVlbAkJ2XIsIy8fyOkf/6ekssc33EMocRlSYK/hoKyPB28LhFZtrlEw/AFAgPas6AZBIIZeiAM5gNG4gTH+KyM4gSPoBuq/MW5gNA7AJrCBXrEm98HJtQVE6Av9BO6l7bV91UehUHRfhQismlAxQfpcmi/St6chPZq3FJq1mjC2Bhvj35tzkGFPs2sFYRQ59taGDURkYi225JPGCWPIXhsiWkR8ygn5SBC66Y/IGvxviueo18Nlc4SrcMHm6XQ5kwQKmKwXs3m+ufqgZH8XPLOQCVuyK8xX0oFDiHPfQ0BeH+og/JR4qoiAkGjQ4M8diSFfttQU8BG6Pe5mMhqLibqcQ0rXgPBBVm2Fw8MG2SUO5uqBQqKk80WmZ6B4mNXmhYQ0GMiPQk9nemkJPZxf/1WXJV+OEz0ea+NRZS/NLVE1YE2dono3POh4qAJAxyQehUKh+Cu8AL45fzrg+n0KAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.hide();
			e.stopPropagation();
			e.preventDefault();
		});
		/* integrate elements */
		kb.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(this.contents)
			)
			.on('mousedown,touchstart',(e) => e.stopPropagation())
		);
		if (!disuseheader)
		{
			this.container
			.append(this.header)
			.append(this.close)
		}
		else this.container.css({paddingTop:'0'});
		if (!disusefooter)
		{
			this.container.append(
				this.footer
				.append(this.ok.css({
					borderBottomLeftRadius:'0.25em'
				}))
				.append(this.cancel.css({
					borderBottomRightRadius:'0.25em'
				}))
			);
		}
		else this.container.css({paddingBottom:'0'});
		/* embed stylesheet */
		if (!kb.elm('.kb-dialog-style'))
		{
			kb.elm('head').append(
				kb.create('style')
				.addClass('kb-dialog-style')
				.attr('media','screen')
				.attr('type','text/css')
				.text((() => {
					var res='';
					res+='.kb-dialog *{';
					res+='  box-sizing:border-box;';
					res+='  font-family:system-ui,sans-serif;';
					res+='  line-height:1.5em;';
					res+='  position:relative;';
					res+='  vertical-align:top;';
					res+='  -webkit-overflow-scrolling:touch;';
					res+='  -webkit-text-size-adjust:100%;';
					res+='}';
					res+='.kb-dialog-button:hover{';
					res+='  background-color:#42a5f5 !important;';
					res+='  color:rgba(255,255,255,1) !important;';
					res+='}';
					return res;
				})())
			);
		}
	}
	/* show */
	show(){
		this.container.css({
			backgroundColor:kb.themeColor().backcolor,
			color:kb.themeColor().forecolor
		});
		this.container.elms('input,select').each((element,index) => {
			element.css({
				backgroundColor:kb.themeColor().backcolor,
				color:kb.themeColor().forecolor
			});
		});
		this.cover.show('flex');
		return this;
	}
	/* hide */
	hide(){
		this.cover.hide();
		return this;
	}
};
window.kintoneBoosterAlert=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(){
		super(999999,true,false);
		/* setup properties */
		this.handler=null;
		this.prompt=this.parts.input.clone().css({
			border:'1px solid #42a5f5',
			marginTop:'0.25em'
		})
		.on('keydown',(e) => {
			var code=e.keyCode||e.which;
			if (code==13)
			{
				this.ok.focus();
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});
		this.cancel.on('click',(e) => this.hide());
		/* resize event */
		window.on('resize',(e) => {
			this.contents
			.css({height:'auto'})
			.css({height:this.container.innerHeight().toString()+'px'});
		});
	}
	/* show alert */
	alert(message,callback){
		/* setup handler */
		if (this.handler)
		{
			this.ok.off('click',this.handler);
			this.cancel.off('click',this.handler);
		}
		this.handler=(e) => {
			this.hide();
			if (callback) callback();
		};
		this.ok.on('click',this.handler);
		/* setup styles */
		this.ok.css({
			borderBottomRightRadius:'0.25em',
			borderRight:'none',
			width:'100%'
		});
		this.cancel.css({display:'none'});
		/* setup message */
		if (message.nodeName) this.contents.empty().append(message);
		else this.contents.html(message);
		/* modify elements */
		this.container.css({minWidth:''});
		/* show */
		this.show();
	}
	/* show confirm */
	confirm(message,callback,cancelcapture){
		/* setup handler */
		if (this.handler)
		{
			this.ok.off('click',this.handler);
			this.cancel.off('click',this.handler);
		}
		this.handler=(e) => {
			this.hide();
			if (callback) callback(e.currentTarget==this.cancel);
		};
		this.ok.on('click',this.handler);
		if (cancelcapture) this.cancel.on('click',this.handler);
		/* setup styles */
		this.ok.css({
			borderBottomRightRadius:'0',
			borderRight:'1px solid #42a5f5',
			width:'50%'
		});
		this.cancel.css({display:'inline-block'});
		/* setup message */
		if (message.nodeName) this.contents.empty().append(message);
		else this.contents.html(message);
		/* modify elements */
		this.container.css({minWidth:'8em'});
		/* show */
		this.show();
	}
	/* show input */
	input(message,callback,type,defaults){
		/* setup handler */
		if (this.handler)
		{
			this.ok.off('click',this.handler);
			this.cancel.off('click',this.handler);
		}
		this.handler=(e) => {
			this.hide();
			if (callback) callback(this.prompt.val());
		};
		this.ok.on('click',this.handler);
		/* setup styles */
		this.ok.css({
			borderBottomRightRadius:'0',
			borderRight:'1px solid #42a5f5',
			width:'50%'
		});
		this.cancel.css({display:'inline-block'});
		/* setup message */
		if (message.nodeName) this.contents.empty().append(message);
		else this.contents.empty().append(this.parts.span.clone().html(message));
		this.contents.append(this.prompt.attr('type',(type)?type:'password').val((defaults)?defaults:''))
		/* modify elements */
		this.container.css({minWidth:'8em'});
		/* show */
		this.show();
	}
	/* show */
	show(){
		super.show();
		this.contents
		.css({height:'auto'})
		.css({height:this.container.innerHeight().toString()+'px'});
		this.ok.focus();
		return this;
	}
};
window.KintoneBoosterCalendar=class{
	/* constructor */
	constructor(minimalise){
		/* setup properties */
		this.minimalise=minimalise;
		this.calendar=kb.create('table').css({
			borderCollapse:'collapse',
			margin:'0',
			width:'100%'
		});
		/* create cells */
		((cell,weeks) => {
			this.calendar.append(
				((head) => {
					head.append(kb.create('tr'));
					weeks.each((week,index) => head.elm('tr').append(cell.clone().html(week)));
					return head;
				})(kb.create('thead'))
			);
			this.calendar.append(
				((body) => {
					(weeks.length*6).each((index) => {
						if (index%weeks.length==0) body.append(kb.create('tr'));
						body.elms('tr').last().append(cell.clone());
					});
					return body;
				})(kb.create('tbody'))
			);
		})(kb.create('td').css({
			boxSizing:'border-box',
			margin:'0',
			padding:'0',
			textAlign:'center',
			width:'calc(100% / 7)'
		}),kb.constants.weeks[kb.operator.language]);
	}
	/* show calendar */
	show(month,activedate,callback){
		var cell=0;
		var styles={
			active:{
				backgroundColor:'#42a5f5',
				color:'#ffffff'
			},
			normal:{
				backgroundColor:'',
				color:kb.themeColor().forecolor
			},
			saturday:{
				backgroundColor:'',
				color:'#42a5f5'
			},
			sunday:{
				backgroundColor:'',
				color:'#fa8273'
			},
			today:{
				backgroundColor:'#ffb46e',
				color:'#ffffff'
			}
		};
		this.calendar.elms('tbody tr').each((element,index) => {
			element.css({display:'table-row'});
			element.elms('td').each((element,index) => {
				var day=month;
				var span=cell-month.getDay();
				var style=styles.normal;
				/* initialize */
				element.empty();
				/* not process if it less than the first of this month */
				if (span<0)
				{
					element.css(style).html('&nbsp;').off('click');
					cell++;
					return;
				}
				else day=day.calc(span.toString()+' day');
				/* not process it if it exceeds the end of this month */
				if (day.format('Y-m')!=month.format('Y-m'))
				{
					element.css(style).html('&nbsp;').off('click');
					cell++;
					if (this.minimalise)
						if (cell%7==1) element.closest('tr').hide();
					return;
				}
				/* setup styles */
				switch ((cell+1)%7)
				{
					case 0:
						style=styles.saturday;
						break;
					case 1:
						style=styles.sunday;
						break;
				}
				if (day.format('Y-m-d')==new Date().format('Y-m-d')) style=styles.today;
				if (activedate)
					if (day.format('Y-m-d')==activedate.format('Y-m-d')) style=styles.active;
				element.off('click').on('click',(e) => {
					if (callback)
						if (callback.select) callback.select(element,day);
				});
				if (callback)
					if (callback.create) callback.create(element,day,style);
				cell++;
			});
		});
	}
};
window.KintoneBoosterColorPicker=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(){
		super(999997,false,false);
		/* setup properties */
		this.callback=null;
		this.colors={
			hue:[
				'#d93636',
				'#d95136',
				'#d96c36',
				'#d98736',
				'#d9a336',
				'#d9be36',
				'#d9d936',
				'#bed936',
				'#a3d936',
				'#87d936',
				'#6cd936',
				'#51d936',
				'#36d936',
				'#36d951',
				'#36d96c',
				'#36d987',
				'#36d9a3',
				'#36d9be',
				'#36d9d9',
				'#36bed9',
				'#36a3d9',
				'#3687d9',
				'#366cd9',
				'#3651d9',
				'#3636d9',
				'#5136d9',
				'#6c36d9',
				'#8736d9',
				'#a336d9',
				'#be36d9',
				'#d936d9',
				'#d936be',
				'#d936a3',
				'#d93687',
				'#d9366c',
				'#d93651',
				'#ffffff',
				'#eeeeee',
				'#bdbdbd',
				'#757575',
				'#424242',
				'#000000'
			],
			mellow:[
				'#72afd5',
				'#4394c7',
				'#9ebdb5',
				'#8b8bbb',
				'#6565a4',
				'#b2b2d2',
				'#afdea6',
				'#7ac86a',
				'#8ed081',
				'#fde549',
				'#fef19a',
				'#fde75e',
				'#6b999e',
				'#6d9c92',
				'#598288',
				'#a1cae3',
				'#cf6371',
				'#e7b1b8',
				'#d8838d',
				'#ef6643',
				'#d1b1c8',
				'#e08e45',
				'#9ec5ab',
				'#e3c567',
				'#baab68',
				'#ed1c24',
				'#77966d',
				'#a69888',
				'#f2f7f2',
				'#426b69',
				'#bcaa99',
				'#f0803c',
				'#bf211e',
				'#ea9010',
				'#437c90',
				'#e85f5c',
				'#ffffff',
				'#eeeeee',
				'#bdbdbd',
				'#757575',
				'#424242',
				'#000000'
			],
			forest:[
				'#347321',
				'#44780a',
				'#558620',
				'#1b5e20',
				'#8ba03e',
				'#90b566',
				'#638538',
				'#79ae37',
				'#87bc42',
				'#61964b',
				'#3d7085',
				'#64988e',
				'#345644',
				'#6b7f5c',
				'#b0b17c',
				'#ecddba',
				'#e1c584',
				'#b4a18f',
				'#c89660',
				'#a17d5e',
				'#796e63',
				'#89542f',
				'#692f11',
				'#913636',
				'#ad5f52',
				'#473c31',
				'#473731',
				'#786159',
				'#ad9b95',
				'#a39a8e',
				'#6e6262',
				'#70624d',
				'#997e6e',
				'#bdb1a4',
				'#bdbca4',
				'#87866c',
				'#ffffff',
				'#eeeeee',
				'#bdbdbd',
				'#757575',
				'#424242',
				'#000000'
			],
			emotion:[
				'#f8b195',
				'#f67280',
				'#c06c84',
				'#6c5b7b',
				'#355c7d',
				'#99b898',
				'#feceab',
				'#ff847c',
				'#e84a5f',
				'#a8a7a7',
				'#cc527a',
				'#e8175d',
				'#a8e6ce',
				'#dcedc2',
				'#ffd3b5',
				'#ffaaa6',
				'#ff8c94',
				'#a7226e',
				'#ec2049',
				'#f26b38',
				'#f7db4f',
				'#2f9599',
				'#e1f5c4',
				'#ede574',
				'#f9d423',
				'#fc913a',
				'#ff4e50',
				'#e5fcc2',
				'#9de0ad',
				'#45ada8',
				'#547980',
				'#fe4365',
				'#fc9d9a',
				'#f9cdad',
				'#c8c8a9',
				'#83af9b',
				'#ffffff',
				'#eeeeee',
				'#bdbdbd',
				'#757575',
				'#424242',
				'#000000'
			]
		};
		this.input=this.parts.input.clone().css({
			borderBottomLeftRadius:'0.25em',
			width:'calc(100% - 5em)'
		})
		.attr('placeholder',kb.constants.dialog.color.prompt[kb.operator.language])
		.attr('type','text');
		this.theme=this.parts.select.clone().css({
			textAlign:'center',
			width:'calc(100% + 2em)'
		})
		.assignOption(Object.keys(this.colors).map((item) => ({id:item})),'id','id')
		.on('change',(e) => {
			this.contents.elms('div').each((element,index) => {
				element.css({
					backgroundColor:this.colors[this.theme.val()][index]
				})
			});
		});
		this.ok.css({
			borderBottomLeftRadius:'',
			borderBottomRightRadius:'0.25em',
			width:'5em'
		})
		.on('click',(e) => {
			if (!this.input.val()) kb.alert(kb.constants.dialog.color.message.invalid[kb.operator.language]);
			else
			{
				if (this.callback) this.callback('#'+this.input.val().replace(/#/g,''));
				this.hide();
			}
		});
		this.cancel.css({display:'none'});
		/* modify elements */
		this.container.css({
			height:'calc(352px + 4em)',
			width:'300px'
		});
		this.contents.css({
			padding:'3px 2px 2px 2px',
			textAlign:'center'
		});
		this.header.append(this.theme);
		this.footer.insertBefore(this.input,this.ok);
		/* create cells */
		this.colors.hue.each((color,index) => {
			this.contents.append(
				this.parts.div.clone().css({
					backgroundColor:color,
					cursor:'pointer',
					display:'inline-block',
					height:'calc((100% / 7) - 4px)',
					margin:'2px',
					width:'calc((100% / 6) - 4px)'
				})
				.on('click',(e) => {
					if (this.callback) this.callback(this.colors[this.theme.val()][index]);
					this.hide();
				})
			);
		});
	}
	/* show color */
	show(callback){
		/* setup callback */
		if (callback) this.callback=callback;
		/* setup elements */
		this.input.val('');
		/* show */
		super.show();
	}
};
window.KintoneBoosterDatePicker=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(){
		super(999997,false,true);
		/* setup properties */
		this.callback=null;
		this.activedate=null;
		this.month=new Date().calc('first-of-month');
		this.feed=this.parts.icon.clone().css({top:'0px'});
		this.calendar=new KintoneBoosterCalendar();
		this.caption=this.parts.span.clone().css({
			display:'block',
			lineHeight:'2em',
			padding:'0px 2em',
			textAlign:'center',
			width:'100%'
		});
		this.prev=this.feed.clone()
		.css({left:'0px'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjZJREFUeNpiYKAJ6J8y8T+MzYIm0QCk6pHFmNA016ObhqKgMCefkfoOBggg6vr9Psz/LLgCBcVb6BI4gxSvQqJMAQggugYDinNYSNVAUDOxHmbCJghNRo2ENDMSG+VASoGq6RMggIY7Agbae6Limdh4ZyGgaT2QCiAphRGbyliwaALZtJ7s5EksYCTF2ehJE6fNUIUbqFIIUFQuYUskAwcAAmgUUTP3F5CUpSi0DD07TqCZxUDLQBXBfVL1sZBpmQCQoiiPsJCRIQWoES3ENAn2AykHaic+Rlr6GF8DgJGWcUx1i4lN1TS1GF8+HpC2FqGSa+QBgAAaRaNgFBBVcJDVm6BCL4uo2ouFShYaAKnzNG/6oFkKstCALm0uarS7mMi0tJ+ujT1i+79UtRhav/ZTKwewUDubULN5S5MRO4KJC9pu+kB3i6GWC4KoAWvQkxL0hFqYJOdjqIET6BLUWCwHBbsg3S2GWv4B6vsLdLUYyQGGQMqQ5omL2IKG6omL3tluFIwCkgFAgPbN6AZAGASi1XQQR3BD3aSrGhLilzZqoQK9iwu8RLnrUfFAEORKbla63NNSRbq21KPZOCQFqJIqC133wAxJt2FU+uZsCHRPF9d+QgFzq7FJlwymgHk/U3pCdgfmgpMm7PL3p5MVIU8bsTQUpbtxcRsxB6xtI9Ka02CaPL7SLdFSLUtrDi2TwJq2ZB5YOni4ApaIlm6Bvx4eQgC/8fVQwE9sLizwnc3hbwMIgobRAdIK28oCHbudAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			/* calc months */
			this.month=this.month.calc('-1 month,first-of-month');
			/* show calendar */
			this.show();
		});
		this.next=this.feed.clone()
		.css({right:'0px'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi1JREFUeNpiYKAa6J8y8T8Q30cXZ0LjK4AU4lMANw3GZkGXLMzJZ2QgpIskABBAVPI/Xr9DA6gBn7/rcUri9DNJACCAaO9lXICRkGZ8HmQkxWZ0g5iIdGEjNhew4NHwAKhBkWaBCxBAwwUBo+o9sWqxRZUAsamMiUDJtJ4szVAQgM8VTMRmFiAOIEszLsBCjCJcOYuQzRvwZUkWUm2jWiIZOAAQQKMIW8QV0MJcRmKyExI3EJjsNgyExchAEeiIBwNhMTIQBDriw0BYDAMfgA4QHAiLkcEBoCMcKSo1aeFjallMchxTYjFFqZpUi6mWjwes5Bp5ACCARtEoGJlNn/+0KESI7RD0U7vRTEpPRADqewN6WwwD54GWnx/Ixh5Z9TBVOn1A8B7osP6BsBgECshplzENVLZjona2JzbbUdtiogdDaGHxB2K69dS2uJDe7WqSBy+o4eMJ5IyYUOpjsksuci2+ALTQkBIXk2OxIdDSC5TGDwuJ2USQWomRidrZZBSMggEHAAHaNaMbAEEYiBLDgo7AJo7gaI7gCI5giMSAn0LLNb0XBuAlhF4LXIQQU3Q/vZfcnsPI2jNPtSZck+e66W/utCjcpPzw/DC4vAjXZPHNk/DbDxT53YvwVz6pvecACNec5aY/vAg3zb5UmUMVFitzFoSHlrklOCMa2OPQI40qLHZpIQmrlKXZwurBI06SnBYtNYUhmgdpYbj2UEIYegAwStjMiIcQQkxxA49895hLUEtfAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			/* calc months */
			this.month=this.month.calc('1 month,first-of-month');
			/* show calendar */
			this.show();
		});
		/* modify elements */
		this.calendar.calendar.css({marginTop:'0.25em',width:'calc(17.5em + 8px)'}).elms('td').each((element,index) => {
			element.css({
				border:'1px solid #42a5f5',
				height:'2.5em',
				lineHeight:'2.5em',
				width:'2.5em'
			});
		});
		this.container.css({
			height:'calc(22.25em + 8px)'
		});
		this.contents.css({padding:'0 0.5em'})
		.append(
			this.parts.div.clone()
			.append(this.caption)
			.append(this.prev)
			.append(this.next)
		)
		.append(this.calendar.calendar);
		this.header.css({boxShadow:'none'});
	}
	/* show calendar */
	show(activedate,callback,init){
		/* setup properties */
		if (activedate)
		{
			if (activedate.match(/^[0-9]{4}(-|\/){1}[0-1]?[0-9]{1}(-|\/){1}[0-3]?[0-9]{1}$/g))
			{
				this.activedate=new Date(activedate.replace(/-/g,'\/'));
				this.month=this.activedate.calc('first-of-month');
			}
		}
		else
		{
			if (init)
			{
				this.activedate=null;
				this.month=new Date().calc('first-of-month');
			}
		}
		if (callback) this.callback=callback;
		/* setup calendar */
		this.caption.html(this.month.format('Y-m'));
		this.calendar.show(this.month,this.activedate,{
			create:(cell,date,style) => {
				cell.css(style).css({cursor:'pointer',fontWeight:'normal'}).html(date.getDate().toString());
			},
			select:(cell,date) => {
				if (this.callback) this.callback(date.format('Y-m-d'));
				this.hide();
			}
		});
		/* show */
		super.show();
	}
};
window.KintoneBoosterMultipicker=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(){
		super(999997,true,false);
		/* setup properties */
		this.callback=null;
		this.table=null;
		this.columnInfos={};
		this.records=[];
		this.selection=[];
		this.ok.css({
			borderRight:'1px solid #42a5f5'
		}).on('click',(e) => {
			if (this.callback) this.callback(this.selection.map((item) => this.records[item]));
			this.hide();
		});
		this.cancel.on('click',(e) => this.hide());
		/* modify elements */
		this.container.css({
			height:'calc(34.5em + 15px)',
			minWidth:'16em'
		});
		this.contents.css({
			padding:'0px'
		});
	}
	/* show records */
	show(records,columnInfos,callback,selected){
		var cell=null;
		var row=null;
		var div=this.parts.div.clone().css({
			borderBottom:'1px solid #42a5f5',
			padding:'0px 0.5em'
		});
		var td=this.parts.td.clone().css({cursor:'pointer'});
		var th=this.parts.th.clone().css({
			backgroundColor:kb.themeColor().backcolor,
			lineHeight:'2.5em'
		});
		/* check records */
		if(records instanceof Array)
		{
			if (records.length!=0)
			{
				/* setup properties */
				this.callback=callback;
				this.columnInfos=columnInfos;
				this.records=records;
				this.selection=[];
				/* create table */
				this.table=this.parts.table.clone()
				.append(kb.create('thead').append(kb.create('tr')))
				.append(kb.create('tbody').append(kb.create('tr')));
				for (var key in this.columnInfos)
				{
					this.table.elm('thead tr').append(
						th.clone().css({
							display:(('display' in this.columnInfos[key])?this.columnInfos[key].display:'table-cell'),
							width:(('width' in this.columnInfos[key])?this.columnInfos[key].width:'auto')
						})
						.append(div.clone().html(('text' in this.columnInfos[key])?this.columnInfos[key].text:''))
					);
					cell=td.clone().css({
						display:(('display' in this.columnInfos[key])?this.columnInfos[key].display:'table-cell'),
						textAlign:(('align' in this.columnInfos[key])?this.columnInfos[key].align:'left')
					})
					.attr('id',key);
					if ('decimals' in this.columnInfos[key]) cell.attr('data-decimals',this.columnInfos[key].decimals);
					this.table.elm('tbody tr').append(cell);
				}
				this.table.elms('thead tr th').first().css({
					borderTopLeftRadius:'0.25em'
				});
				this.table.elms('thead tr th').last().css({
					borderTopRightRadius:'0.25em'
				});
				this.contents.empty().append(
					this.table.spread((row,index) => {
						row.on('click',(e) => {
							if (!this.selection.includes(index))
							{
								this.selection.push(index);
								row.css({
									backgroundColor:'rgba(66,165,245,0.5)',
									color:''
								});
							}
							else
							{
								this.selection=this.selection.filter((item) => item!=index);
								row.css({
									backgroundColor:'transparent',
									color:kb.themeColor().forecolor
								});
							}
						});
					})
				);
				/* append records */
				this.table.clearRows();
				this.records.each((record,index) => {
					row=this.table.addRow();
					for (var key in this.columnInfos)
					{
						if (row.elm('#'+key).hasAttribute('data-decimals'))
						{
							if (record[key].value) row.elm('#'+key).html(Number(record[key].value).comma(row.elm('#'+key).attr('data-decimals')));
							else row.elm('#'+key).html(record[key].value);
						}
						else row.elm('#'+key).html(record[key].value);
					}
					if (selected)
					{
						if (selected.some((item) => {
							var exists=true;
							for (var key in item) if (item[key].value!=record[key].value) exists=false;
							return exists;
						}))
						{
							this.selection.push(index);
							row.css({
								backgroundColor:'rgba(66,165,245,0.5)',
								color:''
							});
						}
					}
				});
				/* show */
				super.show();
			}
			else kb.alert(kb.constants.common.message.notfound[kb.operator.language]);
		}
		else kb.alert(kb.constants.common.message.invalid.parameter[kb.operator.language]);
	}
}
window.KintoneBoosterLoader=class{
	/* constructor */
	constructor(){
		var span=kb.create('span');
		var keyframes={};
		var vendors=['-webkit-',''];
		/* initialize valiable */
		keyframes['0%']={
			'transform':'translateY(0);'
		};
		keyframes['25%']={
			'transform':'translateY(0);'
		};
		keyframes['50%']={
			'transform':'translateY(-0.5em);'
		};
		keyframes['100%']={
			'transform':'translateY(0);'
		};
		span.css({
			color:'#ffffff',
			display:'inline-block',
			lineHeight:'2em',
			padding:'0px 1px',
			verticalAlign:'top',
			WebkitAnimationName:'loading',
			WebkitAnimationDuration:'1s',
			WebkitAnimationTimingFunction:'ease-out',
			WebkitAnimationIterationCount:'infinite',
			animationName:'loading',
			animationDuration:'1s',
			animationTimingFunction:'ease-out',
			animationIterationCount:'infinite'
		});
		/* setup properties */
		this.cover=kb.create('div').css({
			backgroundColor:'rgba(0,0,0,0.5)',
			boxSizing:'border-box',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999998'
		});
		this.container=kb.create('p').css({
			bottom:'0',
			fontSize:'0.8em',
			height:'2em',
			left:'0',
			margin:'auto',
			maxHeight:'100%',
			maxWidth:'100%',
			overflow:'hidden',
			padding:'0px',
			position:'absolute',
			right:'0',
			textAlign:'center',
			top:'0',
			width:'100%'
		});
		/* append styles */
		kb.elm('head').append(
			kb.create('style')
			.attr('media','screen')
			.attr('type','text/css')
			.text(vendors.map((item) => '@'+item+'keyframes loading'+JSON.stringify(keyframes).replace(/:{/g,'{').replace(/[,"]/g,'')).join(' '))
		);
		/* integrate elements */
		kb.elm('body')
		.append(
			this.cover
			.append(
				this.container
				.append(
					kb.create('span').css({
						color:'#ffffff',
						display:'inline-block',
						lineHeight:'2em',
						paddingRight:'0.25em',
						verticalAlign:'top'
					})
					.html('Please wait a moment')
				)
				.append(span.clone().css({animationDelay:'0s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.1s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.2s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.3s'}).html('.'))
				.append(span.clone().css({animationDelay:'0.4s'}).html('.'))
			)
		);
	}
	/* show */
	show(){
		this.cover.css({display:'block',zIndex:kb.popups.alert.cover.style.zIndex-1});
	}
	/* hide */
	hide(){
		this.cover.css({display:'none'});
	}
};
window.KintoneBoosterPopupform=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(innerElements,width,height,callbacks){
		super(999996,false,false);
		/* setup properties */
		if (kb.isNumeric(width)) this.container.css({width:width+'px'});
		else
		{
			if (width=='full') this.container.css({width:'100%'});
		}
		if (kb.isNumeric(height)) this.container.css({height:height+'px'});
		else
		{
			if (height=='full') this.container.css({height:'100%'});
		}
		this.ok.css({
			borderRight:'1px solid #42a5f5'
		}).on('click',(e) => {
			callbacks.ok();
			this.hide();
		});
		this.cancel.on('click',(e) => {
			callbacks.cancel();
			this.hide();
		});
		this.close.hide();
		/* modify elements */
		this.contents.css({overflow:'auto',padding:'0.5em'}).append(innerElements.css({margin:'0px auto'}))
	}
};
window.KintoneBoosterPopupwindow=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(innerElements,width,height,buttons,callback){
		super(999996,false,true);
		/* setup properties */
		if (kb.isNumeric(width)) this.container.css({width:width+'px'});
		else
		{
			if (width=='full') this.container.css({width:'100%'});
		}
		if (kb.isNumeric(height)) this.container.css({height:height+'px'});
		else
		{
			if (height=='full') this.container.css({height:'100%'});
		}
		this.close.off('click').on('click',(e) => {
			this.hide();
			if (callback) callback();
			e.stopPropagation();
			e.preventDefault();
		});
		/* modify elements */
		if (Array.isArray(buttons))
		{
			this.header.css({textAlign:'left'});
			buttons.each((button,index) => this.header.append(this.parts.icon.clone().attr('src',button.src)).on('click',(e) => button.handler()));
		}
		this.contents.css({overflow:'auto',padding:'0.5em'}).append(innerElements.css({margin:'0px auto'}))
	}
};
window.KintoneBoosterProgress=class{
	/* constructor */
	constructor(){
		/* setup properties */
		this.counter=0;
		this.cover=kb.create('div').css({
			backgroundColor:'rgba(0,0,0,0.5)',
			boxSizing:'border-box',
			display:'none',
			height:'100%',
			left:'0px',
			position:'fixed',
			top:'0px',
			width:'100%',
			zIndex:'999998'
		});
		this.container=kb.create('p').css({
			bottom:'0',
			fontSize:'0.8em',
			height:'2em',
			left:'0',
			margin:'auto',
			maxHeight:'100%',
			maxWidth:'100%',
			overflow:'hidden',
			padding:'0px',
			position:'absolute',
			right:'0',
			textAlign:'center',
			top:'0',
			width:'100%'
		});
		this.monitor=kb.create('span').css({
			color:'#ffffff',
			display:'inline-block',
			lineHeight:'2em',
			verticalAlign:'top'
		});
		this.progress=kb.create('div').css({
			backgroundColor:'#ffffff',
			bottom:'0',
			display:'inline-block',
			height:'1em',
			left:'0',
			position:'absolute',
			width:'0'
		});
		/* integrate elements */
		kb.elm('body')
		.append(
			this.cover
			.append(this.container.append(this.monitor))
			.append(this.progress)
		);
	}
	/* update */
	update(){
		this.counter++;
		this.monitor.html(Math.ceil((this.counter/this.max)*100).toString()+'% complete');
		this.progress.css({width:'calc(100% * '+(this.counter/this.max).toString()+')'});
		this.cover.css({display:'block'});
	}
	/* show */
	show(max){
		this.counter=0;
		this.max=(max)?max:1;
		this.monitor.html('');
		this.progress.css({width:'0'});
		this.cover.css({display:'block',zIndex:kb.popups.alert.cover.style.zIndex-1});
	}
	/* hide */
	hide(){
		this.cover.css({display:'none'});
	}
};
/*
DOM extention
*/
HTMLDocument.prototype.off=function(type,handler){
	((Array.isArray(type))?type:type.split(',').map((item) => item.trim())).each((type,index) => {
		if (type)
		{
			if (handler) this.removeEventListener(type,handler);
			else
			{
				if (this in kb.eventHandlers)
					if (type in kb.eventHandlers[this])
						kb.eventHandlers[this][type].each((handler,index) => this.removeEventListener(type,handler));
			}
		}
	});
	return this;
}
HTMLDocument.prototype.on=function(type,handler){
	((Array.isArray(type))?type:type.split(',').map((item) => item.trim())).each((type,index) => {
		if (type)
		{
			if (!(this in kb.eventHandlers)) kb.eventHandlers[this]={};
			if (!(type in kb.eventHandlers[this])) kb.eventHandlers[this][type]=[];
			kb.eventHandlers[this][type].push(handler);
			this.addEventListener(type,handler);
		}
	});
	return this;
}
HTMLElement.prototype.addClass=function(classname){
	classname.split(' ').each((classname,index) => {
		if (classname) this.classList.add(classname);
	});
	return this;
}
HTMLElement.prototype.append=function(element){
	this.appendChild(element);
	return this;
}
HTMLElement.prototype.attr=function(name,value){
	if (typeof value!=='undefined')
	{
		this.setAttribute(name,value);
		return this;
	}
	else return this.getAttribute(name);
}
HTMLElement.prototype.clone=function(){
	var clone=this.cloneNode(true);
	if (this.tagName.toLowerCase()=='select') clone.value=this.value;
	else clone.elms('select').each((element,index) => element.value=this.elms('select')[index].value);
	return clone;
}
HTMLElement.prototype.css=function(properties){
	if (typeof properties!=='string')
	{
		for (var key in properties) this.style[key]=properties[key];
		return this;
	}
	else return (this.currentStyle)?this.currentStyle[properties]:document.defaultView.getComputedStyle(this,null).getPropertyValue(properties);
}
HTMLElement.prototype.elm=function(selectors){
	return this.querySelector(selectors);
}
HTMLElement.prototype.elms=function(selectors){
	return Array.from(this.querySelectorAll(selectors));
}
HTMLElement.prototype.empty=function(){
	this.innerHTML='';
	return this;
}
HTMLElement.prototype.hasClass=function(className){
	return this.classList.contains(className);
}
HTMLElement.prototype.hide=function(){
	var event=new Event('hide');
	this.css({display:'none'});
	this.elms('*').each((element,index) => {
		if (typeof element.visible==='function')
			if (!element.visible()) element.dispatchEvent(event);
	});
	return this;
}
HTMLElement.prototype.html=function(value){
	if (typeof value!=='undefined')
	{
		this.innerHTML=value;
		return this;
	}
	else return this.innerHTML;
}
HTMLElement.prototype.innerHeight=function(){
	var paddingTop=this.css('padding-top');
	var paddingBottom=this.css('padding-bottom');
	if (!paddingTop) paddingTop='0';
	if (!paddingBottom) paddingBottom='0';
	return this.clientHeight-parseFloat(paddingTop)-parseFloat(paddingBottom);
}
HTMLElement.prototype.innerWidth=function(){
	var paddingLeft=this.css('padding-left');
	var paddingRight=this.css('padding-right');
	if (!paddingLeft) paddingLeft='0';
	if (!paddingRight) paddingRight='0';
	return this.clientWidth-parseFloat(paddingLeft)-parseFloat(paddingRight);
}
HTMLElement.prototype.initialize=function(){
	this.alert=kb.create('div').css({
		display:'none',
		margin:'-0.5em 0px 0px 0px',
		transition:'none',
		zIndex:kb.popups.alert.cover.style.zIndex-4
	})
	.append(
		kb.create('img').css({
			display:'block',
			height:'0.75em',
			margin:'0px 0px 0px 1.5em',
			position:'relative',
			width:'0.75em'
		})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkVGNzA3QTE1RTc4MTFFOEI5MDA5RUE2NDFCQTUzNDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkVGNzA3QTI1RTc4MTFFOEI5MDA5RUE2NDFCQTUzNDciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRUY3MDc5RjVFNzgxMUU4QjkwMDlFQTY0MUJBNTM0NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRUY3MDdBMDVFNzgxMUU4QjkwMDlFQTY0MUJBNTM0NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkBlNTAAAADNSURBVHja7NHBCcJAFATQZNBcYwmSmycPlpI2bCVgAVqAVmAFHmxqncAKQVyz+/N/grADc0iyy0Be6ZwrlgiKhZKH83Ae/v/h1X23l9499vfZk2hYOHpgO7ZkH+xzjl9dsze2Ytfsld3MMXxhm8Hzlj1bD/eu7Zf3rf9mMvx2DaXzZ1SHh66hVP5MrTn86RpK48+qDIdcQ4nyxkRXsTcmuoq9oeAq8oaSa7I3FF2TvKHomuQNZddobxi4RnnDyHXUG0auo94wdP3p/RJgAMw4In5GE/6/AAAAAElFTkSuQmCC')
	)
	.append(
		kb.create('span').css({
			backgroundColor:'#b7282e',
			borderRadius:'0.25em',
			color:'#ffffff',
			display:'block',
			lineHeight:'2em',
			margin:'0px',
			minWidth:'max-content',
			padding:'0px 0.5em',
			position:'relative'
		})
	);
	var transition=(e) => {
		var code=e.keyCode||e.which;
		if (code==13)
		{
			var elements=kb.elms('button[tabstop=tabstop],input,select,textarea').filter((element) => {
				var exists=0;
				if (element.visible())
				{
					if (element.hasAttribute('tabindex'))
						if (element.attr('tabindex')=='-1') exists++;
					if (element.tagName.toLowerCase()=='input')
						if (element.type.toLowerCase().match(/(color|file)/g)) exists++;
				}
				else exists++;
				return exists==0;
			});
			var total=elements.length;
			var index=elements.indexOf(e.currentTarget)+(e.shiftKey?-1:1);
			elements[(index<0)?total-1:((index>total-1)?0:index)].focus();
			e.stopPropagation();
			e.preventDefault();
			return false;
		}
	};
	/* setup focus transition */
	switch (this.tagName.toLowerCase())
	{
		case 'input':
			switch (this.type.toLowerCase())
			{
				case 'button':
				case 'color':
				case 'file':
				case 'image':
				case 'reset':
					break;
				default:
					this
					.on('keydown',transition)
					.on('focus',(e) => this.beforevalue=e.currentTarget.val())
					.on('blur',(e) => {
						if (e.currentTarget.hasAttribute('data-padding'))
						{
							var param=e.currentTarget.attr('data-padding').split(':');
							var value=e.currentTarget.val();
							if (param.length==3)
							{
								if (value===undefined || value===null) value='';
								if (param[2]=='L') e.currentTarget.val(value.toString().lpad(param[0],param[1]));
								else  e.currentTarget.val(value.toString().rpad(param[0],param[1]));
							}
						}
					});
					break;
			}
			break;
		case 'select':
			this
			.on('keydown',transition)
			.on('focus',(e) => this.beforevalue=e.currentTarget.val());
			break;
	}
	/* setup required */
	if (this.hasAttribute('required'))
	{
		var placeholder=this.attr('placeholder');
		if (placeholder) placeholder=placeholder.replace(/^required /g,'')
		this.attr('placeholder','* '+((placeholder)?placeholder:''));
	}
	/* setup validation */
	if (this.hasAttribute('data-type'))
		switch (this.attr('data-type'))
		{
			case 'alphabet':
				this.attr('pattern','^[A-Za-z!"#$%&\'\\(\\)*,\\-.\\/:;<>?@\\[\\]\\^_`\\{\\|\\}~ \\\\]+$');
				break;
			case 'alphanum':
				this.attr('pattern','^[0-9A-Za-z!"#$%&\'\\(\\)*,\\-.\\/:;<>?@\\[\\]\\^_`\\{\\|\\}~ \\\\]+$');
				break;
			case 'color':
				this.attr('pattern','^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$');
				break;
			case 'date':
				this.attr('pattern','^[1-9][0-9]{3}[\\-.\\/]+([1-9]{1}|0[1-9]{1}|1[0-2]{1})[\\-.\\/]+([1-9]{1}|[0-2]{1}[0-9]{1}|3[01]{1})$')
				.on('focus',(e) => e.currentTarget.val(e.currentTarget.val().replace(/[^0-9]+/g,'')))
				.on('blur',(e) => {
					var value=e.currentTarget.val().replace(/[^0-9]+/g,'');
					if (value.length==8) e.currentTarget.val(value.substring(0,4)+'-'+value.substring(4,6)+'-'+value.substring(6,8));
				});
				break;
			case 'datetime':
				this.attr('pattern','^[1-9][0-9]{3}[\\-.\\/]+([1-9]{1}|0[1-9]{1}|1[0-2]{1})[\\-.\\/]+([1-9]{1}|[0-2]{1}[0-9]{1}|3[01]{1}) [0-9]{1,2}:[0-9]{1,2}$');
				break;
			case 'mail':
				this.attr('pattern','^[0-9A-Za-z]+[0-9A-Za-z.!#$%&\'*+\\-\\/?\\^_`\\{\\|\\}~\\\\]*@[0-9A-Za-z]+[0-9A-Za-z._\\-]*\\.[a-z]+$');
				break;
			case 'number':
				this.attr('pattern','^[0-9,\\-.]+$')
				.css({textAlign:'right'})
				.on('focus',(e) => e.currentTarget.val(e.currentTarget.val().replace(/[^-0-9.]+/g,'')))
				.on('blur',(e) => {
					var value=e.currentTarget.val().replace(/[^-0-9.]+/g,'');
					if (value) e.currentTarget.val(Number(value).comma(this.attr('data-decimals')));
				});
				break;
			case 'nondemiliternumber':
				this.attr('pattern','^[0-9\\-.]+$').css({textAlign:'right'});
				break;
			case 'postalcode':
				this.attr('pattern','^[0-9]{3}-?[0-9]{4}$')
				.on('focus',(e) => e.currentTarget.val(e.currentTarget.val().replace(/[^0-9]+/g,'')))
				.on('blur',(e) => {
					var value=e.currentTarget.val().replace(/[^0-9]+/g,'');
					if (value.length==7) e.currentTarget.val(value.substring(0,3)+'-'+value.substring(3,7));
				});
				break;
			case 'tel':
				this.attr('pattern','^0[0-9]{1,3}-?[0-9]{2,4}-?[0-9]{3,4}$');
				break;
			case 'time':
				this.attr('pattern','^[0-9]{1,2}:[0-9]{1,2}$');
				break;
			case 'url':
				this.attr('pattern','^https?:\\/\\/[0-9A-Za-z!"#$%&\'\\(\\)*,\\-.\\/:;<>?@\\[\\]\\^_`\\{\\|\\}~=\\\\]+$');
				break;
			case 'urldirectory':
				this.attr('pattern','^[0-9a-z\\-_.!\']+$');
				break;
		}
	/* integrate elements */
	switch (this.tagName.toLowerCase())
	{
		case 'select':
			this.parentNode.parentNode.append(this.alert);
			break;
		default:
			this.parentNode.append(this.alert);
			break;
	}
	/* validation event */
	return this.on('invalid',(e) => {
		/* validate required */
		if (e.currentTarget.validity.valueMissing) this.alert.elm('span').html(kb.constants.common.message.invalid.required[kb.operator.language]).parentNode.show();
		/* validate pattern */
		if (e.currentTarget.validity.patternMismatch) this.alert.elm('span').html(kb.constants.common.message.invalid.unmatch.pattern[kb.operator.language]).parentNode.show();
		/* validate type */
		if (e.currentTarget.validity.typeMismatch) this.alert.elm('span').html(kb.constants.common.message.invalid.unmatch.format[kb.operator.language]).parentNode.show();
	}).on('focus',(e) => this.alert.hide());
}
HTMLElement.prototype.isEmpty=function(){
	var exists=false;
	this.elms('input,select,textarea').each((element,index) => {
		switch (element.tagName.toLowerCase())
		{
			case 'input':
				switch (element.type.toLowerCase())
				{
					case 'button':
					case 'image':
					case 'radio':
					case 'reset':
						break;
					case 'checkbox':
						if (!exists) exists=element.checked;
						break;
					case 'color':
						if (!exists) exists=(element.val()!='#000000');
						break;
					case 'range':
						var max=(element.max)?parseFloat(element.max):100;
						var min=(element.min)?parseFloat(element.min):0;
						if (!exists) exists=(element.val()!=(max-min)/2);
						break;
					default:
						if (!exists) exists=(element.val());
						break;
				}
				break;
			case 'select':
				if (!exists) exists=(element.selectedIndex);
				break;
			default:
				if (!exists) exists=(element.val());
				break;
		}
	});
	return !exists;
}
HTMLElement.prototype.off=function(type,handler){
	((Array.isArray(type))?type:type.split(',').map((item) => item.trim())).each((type,index) => {
		if (type)
		{
			if (handler) this.removeEventListener(type,handler);
			else
			{
				if (this in kb.eventHandlers)
					if (type in kb.eventHandlers[this])
						kb.eventHandlers[this][type].each((handler,index) => this.removeEventListener(type,handler));
			}
		}
	});
	return this;
}
HTMLElement.prototype.on=function(type,handler,bubbling=false){
	((Array.isArray(type))?type:type.split(',').map((item) => item.trim())).each((type,index) => {
		if (type)
		{
			if (!(this in kb.eventHandlers)) kb.eventHandlers[this]={};
			if (!(type in kb.eventHandlers[this])) kb.eventHandlers[this][type]=[];
			kb.eventHandlers[this][type].push(handler);
			this.addEventListener(type,handler,bubbling);
		}
	});
	return this;
}
HTMLElement.prototype.outerHeight=function(includemargin){
	if (includemargin)
	{
		var marginTop=this.css('margin-top');
		var marginBottom=this.css('margin-bottom');
		if (!marginTop) marginTop='0';
		if (!marginBottom) marginBottom='0';
		return this.getBoundingClientRect().height+parseFloat(marginTop)+parseFloat(marginBottom);
	}
	return this.getBoundingClientRect().height;
}
HTMLElement.prototype.outerWidth=function(includemargin){
	if (includemargin)
	{
		var marginLeft=this.css('margin-left');
		var marginRight=this.css('margin-right');
		if (!marginLeft) marginLeft='0';
		if (!marginRight) marginRight='0';
		return this.getBoundingClientRect().width+parseFloat(marginLeft)+parseFloat(marginRight);
	}
	return this.getBoundingClientRect().width;
}
HTMLElement.prototype.popup=function(width,height,buttons,callback){
	return new KintoneBoosterPopupwindow(this,width,height,buttons,callback);
}
HTMLElement.prototype.removeAttr=function(name){
	this.removeAttribute(name);
	return this;
}
HTMLElement.prototype.removeClass=function(className){
	this.classList.remove(className);
	return this;
}
HTMLElement.prototype.show=function(type='block'){
	var event=new Event('show');
	this.css({display:type});
	this.elms('*').each((element,index) => {
		if (typeof element.visible==='function')
			if (element.visible()) element.dispatchEvent(event);
	});
	return this;
}
HTMLElement.prototype.siblings=function(selectors){
	var elements=(typeof selectors!=='undefined')?Array.from(this.parentNode.querySelectorAll(selectors)):kb.children(this.parentNode);
	return elements.filter((item) => item!=this);
}
HTMLElement.prototype.spread=function(addcallback,delcallback,autoadd=true){
	/* setup properties */
	this.container=this.elm('tbody');
	this.tr=kb.children(this.container);
	this.template=this.tr.first().clone();
	this.addRow=(putcallback=true) => {
		var row=this.template.clone();
		this.container.append(row);
		/* setup properties */
		this.tr=kb.children(this.container);
		/* setup handler */
		var handler=(e) => {
			if (autoadd)
				if (e.currentTarget.value)
					if (!this.tr.last().isEmpty()) this.addRow();
		};
		row.elms('input,select,textarea').each((element,index) => {
			switch (element.initialize().tagName.toLowerCase())
			{
				case 'input':
					switch (element.type.toLowerCase())
					{
						case 'button':
						case 'image':
						case 'radio':
						case 'reset':
							break;
						case 'checkbox':
						case 'color':
						case 'date':
						case 'datetime-local':
						case 'file':
						case 'month':
						case 'range':
						case 'time':
						case 'week':
							element.on('change',handler);
							break;
						case 'number':
							element.on('mouseup,keyup',handler);
							break;
						default:
							element.on('keyup',handler);
							break;
					}
					break;
				case 'select':
					element.on('change',handler);
					break;
				case 'textarea':
					element.on('keyup',handler);
					break;
			}
		});
		if (putcallback)
			if (addcallback) addcallback(row,this.tr.length-1);
		return row;
	};
	this.delRow=(row) => {
		var index=this.tr.indexOf(row);
		this.container.removeChild(row);
		/* setup properties */
		this.tr=kb.children(this.container);
		if (autoadd)
		{
			if (this.tr.length==0) this.addRow();
			else
			{
				if (!this.tr.last().isEmpty()) this.addRow();
			}
		}
		if (delcallback) delcallback(this,index);
	};
	this.insertRow=(row) => {
		var add=this.addRow(false);
		this.container.insertBefore(add,row.nextSibling);
		/* setup properties */
		this.tr=kb.children(this.container);
		if (addcallback) addcallback(add,this.tr.indexOf(add));
		return add;
	};
	this.clearRows=() => {
		this.tr.each((element,index) => this.container.removeChild(element));
		/* setup properties */
		this.tr=[];
	};
	/* setup rows */
	this.clearRows();
	if (autoadd) this.addRow();
	return this;
}
HTMLElement.prototype.text=function(value){
	if (typeof value!=='undefined')
	{
		this.textContent=value;
		return this;
	}
	else
	{
		var value=this.textContent;
		if (value)
			if (this.hasAttribute('data-type'))
				switch (this.attr('data-type'))
				{
					case 'date':
						if (value.length==8)
							if (kb.isNumeric(value))
								value=value.substring(0,4)+'-'+value.substring(4,6)+'-'+value.substring(6,8);
						break;
					case 'number':
						value=value.replace(/,/g,'');
						break;
				}
		return value;
	}
}
HTMLElement.prototype.val=function(value){
	if (typeof value!=='undefined')
	{
		this.value=value;
		return this;
	}
	else
	{
		var value=this.value;
		if (value)
			if (this.hasAttribute('data-type'))
				switch (this.attr('data-type'))
				{
					case 'date':
						if (value.length==8)
							if (kb.isNumeric(value))
								value=value.substring(0,4)+'-'+value.substring(4,6)+'-'+value.substring(6,8);
						break;
					case 'number':
						value=value.replace(/,/g,'');
						break;
				}
		return value;
	}
}
HTMLElement.prototype.visible=function(){
	return !(this.getBoundingClientRect().width==0 && this.getBoundingClientRect().height==0);
}
HTMLSelectElement.prototype.assignOption=function(records,label,value){
	records.each((record,index) => {
		this.append(
			kb.create('option')
			.attr('value',record[value])
			.html(record[label])
		);
	});
	return this;
}
HTMLSelectElement.prototype.selectedText=function(){
	if (this.options.length!=0)	return (this.selectedIndex!=-1)?this.options[this.selectedIndex].textContent:'';
	else return '';
}
Window.prototype.off=function(type,handler){
	((Array.isArray(type))?type:type.split(',').map((item) => item.trim())).each((type,index) => {
		if (type)
		{
			if (handler) this.removeEventListener(type,handler);
			else
			{
				if (this in kb.eventHandlers)
					if (type in kb.eventHandlers[this])
						kb.eventHandlers[this][type].each((handler,index) => this.removeEventListener(type,handler));
			}
		}
	});
	return this;
}
Window.prototype.on=function(type,handler){
	((Array.isArray(type))?type:type.split(',').map((item) => item.trim())).each((type,index) => {
		if (type)
		{
			if (!(this in kb.eventHandlers)) kb.eventHandlers[this]={};
			if (!(type in kb.eventHandlers[this])) kb.eventHandlers[this][type]=[];
			kb.eventHandlers[this][type].push(handler);
			this.addEventListener(type,handler);
		}
	});
	return this;
}
/*
Array extention
*/
Array.prototype.each=function(handler){
	for (var i=0;i<this.length;i++)
	{
		var result=handler(this[i],i);
		if (result===KB_BREAK) break;
		if (result===KB_SKIP) i++;
	}
}
Array.prototype.first=function(){
	return this[0];
}
Array.prototype.last=function(){
	return this[this.length-1];
}
/*
Date extention
*/
Date.prototype.calc=function(pattern){
	var date=this;
	pattern.split(',').map((item) => item.trim()).each((pattern,index) => {
		var year=date.getFullYear();
		var month=date.getMonth()+1;
		var day=date.getDate();
		var hour=date.getHours();
		var minute=date.getMinutes();
		var second=date.getSeconds();
		//first day of year
		if (pattern.match(/^first-of-year$/g)) {month=1;day=1};
		//first day of month
		if (pattern.match(/^first-of-month$/g)) day=1;
		//add years
		if (pattern.match(/^-?[0-9]+[ ]*year$/g)) year+=parseInt(pattern.match(/^-?[0-9]+/g));
		//add months
		if (pattern.match(/^-?[0-9]+[ ]*month$/g))
		{
			month+=parseInt(pattern.match(/^-?[0-9]+/g));
			//check of next year
			while (month<1) {year--;month+=12;}
			while (month>12) {year++;month-=12;}
			//check of next month
			var check=new Date(year,(month-1),day);
			if (check.getMonth()+1!=month)
			{
				check=new Date(year,month,1);
				check.setDate(0);
				day=check.getDate();
			}
		}
		//add day
		if (pattern.match(/^-?[0-9]+[ ]*day$/g)) day+=parseInt(pattern.match(/^-?[0-9]+/g));
		//add hour
		if (pattern.match(/^-?[0-9]+[ ]*hour$/g)) hour+=parseInt(pattern.match(/^-?[0-9]+/g));
		//add minute
		if (pattern.match(/^-?[0-9]+[ ]*minute$/g)) minute+=parseInt(pattern.match(/^-?[0-9]+/g));
		//add second
		if (pattern.match(/^-?[0-9]+[ ]*second$/g)) second+=parseInt(pattern.match(/^-?[0-9]+/g));
		date=new Date(year,(month-1),day,hour,minute,second);
	});
	return date;
}
Date.prototype.format=function(pattern){
	var year=this.getFullYear().toString();
	var month=('0'+(this.getMonth()+1)).slice(-2);
	var day=('0'+this.getDate()).slice(-2);
	var hour=('0'+this.getHours()).slice(-2);
	var minute=('0'+this.getMinutes()).slice(-2);
	var second=('0'+this.getSeconds()).slice(-2);
	//iso 8601
	if (pattern.match(/^ISO$/g)) return this.toISOString().replace(/[0-9]{2}\.[0-9]{3}Z$/g,'00Z');
	//iso 8601
	if (pattern.match(/^ISOSEC$/g)) return this.toISOString().replace(/\.[0-9]{3}Z$/g,'Z');
	//Others
	return pattern.replace(/Y/g,year).replace(/y/g,year.slice(-2)).replace(/m/g,month).replace(/d/g,day).replace(/H/g,hour).replace(/h/g,(hour%12).toString()).replace(/i/g,minute).replace(/s/g,second);
}
/*
FileList extention
*/
FileList.prototype.first=function(){
	return this[0];
}
FileList.prototype.last=function(){
	return this[this.length-1];
}
/*
Number extention
*/
Number.prototype.comma=function(decimals){
	return (!isNaN(this))?((res) => {
		res[0]=res[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
		return res.join('.');
	})((kb.isNumeric(decimals))?this.toFloor(parseInt(decimals)).split('.'):String(this).split('.')):'';
}
Number.prototype.each=function(handler){
	for (var i=0;i<this;i++)
	{
		var result=handler(i);
		if (result===KB_BREAK) break;
		if (result===KB_SKIP) i++;
	}
}
Number.prototype.toFloor=function(decimals){
	return ((res) => {
		if (res.length>1) res[1]=res[1].rpad('0',decimals).substring(0,decimals);
		return res.join('.');
	})(String(this).split('.'));
}
/*
String extention
*/
String.prototype.lpad=function(pattern,length){
	var padding='';
	length.each((index) => padding+=pattern);
	return (padding+this).slice(length*-1);
}
String.prototype.rpad=function(pattern,length){
	var padding='';
	length.each((index) => padding+=pattern);
	return (this+padding).slice(0,length);
}
String.prototype.parseDateTime=function(){
	var format=this;
	if (isNaN(Date.parse(format)))
	{
		if (format.match(/T/g))
		{
			format=format.replace(/\//g,'-');
			if (!format.match(/(\+[0-9]{2}:?[0-9]{2}|Z$)/g)) format+='Z';
		}
		else format=format.replace(/-/g,'\/');
	}
	return new Date(format);
}
if (!window.kb) window.kb=new KintoneBooster();
/*
Message definition by language
*/
if (!window.kb.constants)
	kb.constants={
		common:{
			message:{
				invalid:{
					parameter:{
						en:'There is a defect in the specified parameter',
						ja:'指定されたパラメータに不備があります',
						zh:'指定的参数无效。'
					},
					required:{
						en:'Required',
						ja:'必須項目です',
						zh:'这是必填项'
					},
					unmatch:{
						format:{
							en:'Input value not matched to its input format',
							ja:'入力形式と一致していません',
							zh:'输入格式不匹配'
						},
						pattern:{
							en:'Input value not matched to its input pattern',
							ja:'入力パターンと一致していません',
							zh:'输入模式不匹配'
						}
					}
				},
				notfound:{
					en:'No data was found that matches your request',
					ja:'入力内容に一致するデータが見つかりませんでした',
					zh:'找不到与输入内容匹配的数据。'
				}
			},
			prompt:{
				keyword:{
					en:'Enter a keyword',
					ja:'キーワードを入力',
					zh:'输入关键词'
				}
			}
		},
		dialog:{
			color:{
				message:{
					invalid:{
						en:'Please Enter a color code.',
						ja:'カラーコードを入力して下さい。',
						zh:'请输入颜色代码。'
					}
				},
				prompt:{
					en:'Enter hexadecimal color code',
					ja:'16進数のカラーコードを入力',
					zh:'请输入十六进制的颜色代码'
				}
			}
		},
		weeks:{
			en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
			ja:['日','月','火','水','木','金','土'],
			zh:['日','一','二','三','四','五','六']
		}
	};
kb.ready();
if (!window.kb_authorize_handler) window.kb_authorize_handler=(e) => {
	if (localStorage.getItem('kb-installed'))
	{
		((installed,subdomain) => {
			if (installed.calc('3 month')<new Date())
			{
				((announced) => {
					if (announced!=new Date().format('Y-m-d'))
					{
						((announcetime) => {
							if (announcetime<new Date().getHours())
							{
								localStorage.setItem('kb-announced-'+kintone.app.getId(),new Date().format('Y-m-d'));
								localStorage.removeItem('kb-announcetime-'+kintone.app.getId());
								var fetchDual=(topLevel) => {
									fetch(
										'https://api.kintone-booster.'+topLevel+'/authorize?id='+subdomain,
										{
											method:'GET',
											headers:{
												'X-Requested-With':'XMLHttpRequest'
											}
										}
									)
									.then((response) => {
										response.json().then((json) => {
											switch (response.status)
											{
												case 200:
													if (json.result!='ok')
													{
														kb.confirm(
															(() => {
																var res='';
																switch (kb.operator.language)
																{
																	case 'en':
																		res='Boost! is free to download and use, but you must purchase a license to use it without this message. <br>Do you want to proceed with the purchase process?';
																		break;
																	case 'ja':
																		res='Boost! は無料でダウンロードして使用できますが、このメッセージを表示しないで使用するにはライセンスを購入する必要があります。<br>このまま購入手続きを行いますか？';
																		break;
																	case 'zh':
																		res='Boost! 可以免费下载和使用，但若要无此消息使用，您必须购买许可证。<br>您想继续购买过程吗？';
																		break;
																}
																return res;
															})(),
															() => window.open('https://kintone-booster.com/'+kb.operator.language+'/license.html?subdomain='+subdomain)
														);
													}
													break;
												default:
													if (topLevel=='com') fetchDual('net');
													else console.log(json.error);
													break;
											}
										});
									})
									.catch((error) => {
										if (topLevel=='com') fetchDual('net');
										else console.log(error);
									});
								};
								fetchDual('com');
							}
						})((() => {
							var res=null;
							if (localStorage.getItem('kb-announcetime-'+kintone.app.getId())) res=parseInt(localStorage.getItem('kb-announcetime-'+kintone.app.getId()));
							else
							{
								var hour=new Date().getHours();
								res=(hour<15)?(Math.floor(Math.random()*(15-hour))+hour):hour-1;
								localStorage.setItem('kb-announcetime-'+kintone.app.getId(),res.toString());
							}
							return res;
						})());
					}
				})((localStorage.getItem('kb-announced-'+kintone.app.getId()))?localStorage.getItem('kb-announced-'+kintone.app.getId()):new Date().calc('-1 day').format('Y-m-d'));
			}
		})(new Date(localStorage.getItem('kb-installed')),location.host.split('.')[0]);
	}
	else localStorage.setItem('kb-installed',new Date().format('Y-m-d'));
	return e;
};
kintone.events.off('app.record.index.show',window.kb_authorize_handler);
kintone.events.on('app.record.index.show',window.kb_authorize_handler);
