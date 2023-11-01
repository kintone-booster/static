/*
* FileName "ui.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
window.KintoneBoosterRecord=class{
	/* constructor */
	constructor(){
		this.page={
			add:(mobile,app) => {
				return kintone.api.url('/k/',true).replace(/\.json/g,'')+((mobile)?'m/'+app:app)+'/edit';
			},
			detail:(mobile,app,id) => {
				return kintone.api.url('/k/',true).replace(/\.json/g,'')+((mobile)?'m/'+app:app)+'/show'+((mobile)?'?':'#')+'record='+id;
			},
			edit:(mobile,app,id) => {
				return kintone.api.url('/k/',true).replace(/\.json/g,'')+((mobile)?'m/'+app:app)+'/show'+((mobile)?'?':'#')+'record='+id+((mobile)?'#':'&')+'mode=edit';
			}
		}
	}
	/* create record */
	create(app,isRecord=true){
		var res={};
		for (var key in app.fields)
			((fieldInfo) => {
				switch (fieldInfo.type)
				{
					case 'CHECK_BOX':
					case 'CONDITION':
					case 'FILE':
					case 'GROUP_SELECT':
					case 'MULTI_SELECT':
					case 'ORGANIZATION_SELECT':
					case 'USER_SELECT':
						res[key]={type:fieldInfo.type,value:[]};
						break;
					case 'RADIO_BUTTON':
						((options) => {
							res[key]={type:fieldInfo.type,value:(options.length!=0)?options.reduce((result,current) => {
								result[current.index]=current;
								return result;
							},Array(options.length).fill('')).first().label:''};
						})(Object.values(fieldInfo.options));
						break;
					case 'SUBTABLE':
						res[key]={type:fieldInfo.type,value:[{value:this.create(fieldInfo,false)}]};
						break;
					default:
						if (!kb.field.reserved.includes(fieldInfo.type)) res[key]={type:fieldInfo.type,value:''};
						break;
				}
			})(app.fields[key]);
		/* reserved field */
		if (isRecord) res['$id']={type:'__ID__',value:''};
		return res;
	}
	/* get record */
	get(container,app,errorThrow){
		var res={
			error:false,
			record:{}
		};
		if (!errorThrow)
			for (var key in app.fields)
			{
				((field,fieldInfo) => {
					if (field)
					{
						if (fieldInfo.type!='SUBTABLE') field=field.elm('.kb-field-value');
						switch (fieldInfo.type)
						{
							case 'CHECK_BOX':
							case 'MULTI_SELECT':
								if (fieldInfo.required)
									if (!field.elms('input').some((item) => item.checked))
									{
										field.alert(kb.constants.common.message.invalid.required[kb.operator.language]);
										res.error=true;
									}
								break;
							case 'FILE':
							case 'GROUP_SELECT':
							case 'ORGANIZATION_SELECT':
							case 'USER_SELECT':
								if (fieldInfo.required)
									((value) => {
										if (value.length==0)
										{
											field.alert(kb.constants.common.message.invalid.required[kb.operator.language]);
											res.error=true;
										}
									})((field.elm('input').val())?JSON.parse(field.elm('input').val()):[]);
								break;
							case 'SUBTABLE':
								break;
							default:
								field.elms('input,select,textarea').each((element,index) => {
									if (!element.checkValidity()) res.error=true;
								});
								break;
						}
					}
				})(container.elm('[field-id="'+CSS.escape(key)+'"]'),app.fields[key]);
				if (res.error) break;
			}
		if (!res.error)
		{
			for (var key in app.fields)
				((field,fieldInfo) => {
					if (field)
					{
						if (fieldInfo.type!='SUBTABLE') field=field.elm('.kb-field-value');
						switch (fieldInfo.type)
						{
							case 'CALC':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:null
								};
								break;
							case 'CHECK_BOX':
							case 'MULTI_SELECT':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:(() => {
										var res=[];
										field.elms('input').each((element,index) => {
											if (element.checked && !element.parentNode.hasClass('kb-hidden')) res.push(element.val());
										});
										return res;
									})()
								};
								break;
							case 'CREATED_TIME':
							case 'UPDATED_TIME':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:((field.elm('input').val())?field.elm('input').val():new Date().format('ISO'))
								};
								break;
							case 'CREATOR':
							case 'MODIFIER':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:((field.elm('input').val())?JSON.parse(field.elm('input').val()):{code:kb.operator.code,name:kb.operator.name})
								};
								break;
							case 'DATETIME':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:(() => {
										var res='';
										if (field.elm('input').val())
										{
											if (!field.elm('.kb-hour').elm('select').val()) field.elm('.kb-hour').elm('select').val('00');
											if (!field.elm('.kb-minute').elm('select').val()) field.elm('.kb-minute').elm('select').val('00');
										}
										if (field.elm('input').val() && field.elm('.kb-hour').elm('select').val() && field.elm('.kb-minute').elm('select').val())
											res=(field.elm('input').val()+' '+field.elm('.kb-hour').elm('select').val()+':'+field.elm('.kb-minute').elm('select').val()+':00').parseDateTime().format('ISO');
										return res;
									})()
								};
								break;
							case 'DROP_DOWN':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:field.elm('select').val()
								};
								break;
							case 'FILE':
							case 'GROUP_SELECT':
							case 'ORGANIZATION_SELECT':
							case 'USER_SELECT':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:((field.elm('input').val())?JSON.parse(field.elm('input').val()):[])
								};
								break;
							case 'NUMBER':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:((kb.isNumeric(field.elm('input').val()))?parseFloat(field.elm('input').val()):field.elm('input').val())
								};
								break;
							case 'RADIO_BUTTON':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:(() => {
										var res='';
										field.elms('[data-name='+fieldInfo.code+']').each((element,index) => {
											if (element.checked && !element.parentNode.hasClass('kb-hidden')) res=element.val();
										});
										return res;
									})()
								};
								break;
							case 'MULTI_LINE_TEXT':
							case 'RICH_TEXT':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:field.elm('textarea').val()
								};
								break;
							case 'SUBTABLE':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:(() => {
										var rows=[];
										field.tr.each((element,index) => {
											var row=this.get(element,fieldInfo,errorThrow);
											if (row.error)
											{
												res.error=row.error;
												return PD_BREAK;
											}
											else rows.push({value:row.record});
										});
										return rows;
									})()
								};
								break;
							case 'TIME':
								res.record[fieldInfo.code]={
									type:fieldInfo.type,
									value:(() => {
										var res='';
										if (field.elm('.kb-hour').elm('select').val())
											if (!field.elm('.kb-minute').elm('select').val()) field.elm('.kb-minute').elm('select').val('00');
										if (field.elm('.kb-minute').elm('select').val())
											if (!field.elm('.kb-hour').elm('select').val()) field.elm('.kb-hour').elm('select').val('00');
										if (field.elm('.kb-hour').elm('select').val() && field.elm('.kb-minute').elm('select').val())
											res=field.elm('.kb-hour').elm('select').val()+':'+field.elm('.kb-minute').elm('select').val();
										return res;
									})()
								};
								break;
							default:
								if (!kb.field.reserved.includes(fieldInfo.type))
									res.record[fieldInfo.code]={
										type:fieldInfo.type,
										value:field.elm('input').val()
									};
								break;
						}
					}
				})(container.elm('[field-id="'+CSS.escape(key)+'"]'),app.fields[key]);
			/* reserved field */
			if (container.elm('[data-type=id]')) res.record['$id']={value:((container.elm('[data-type=id]').val())?parseInt(container.elm('[data-type=id]').val()):container.elm('[data-type=id]').val())};
		}
		else kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]);
		return res;
	}
	/* set record */
	set(container,app,record){
		return new Promise((resolve,reject) => {
			var assign=(container,app,record,callback) => {
				var res=[];
				for (var key in record)
					((field,fieldInfo,value) => {
						if (field)
						{
							if ('disabled' in value)
							{
								if (value.disabled) field.addClass('kb-disabled');
								else field.removeClass('kb-disabled');
							}
							if ('hidden' in value)
							{
								if (value.hidden) field.addClass('kb-hidden');
								else field.removeClass('kb-hidden');
							}
							if (fieldInfo.type!='SUBTABLE')
							{
								field=field.elm('.kb-field-value');
								if ('backcolor' in value)
								{
									if (value.backcolor) field.addClass('kb-force-backcolor').elm('.kb-guide').css({backgroundColor:value.backcolor});
									else field.removeClass('kb-force-backcolor').elm('.kb-guide').css({backgroundColor:''});
								}
								if ('forecolor' in value)
								{
									if (value.forecolor) field.addClass('kb-force-forecolor').elm('.kb-guide').css({color:value.forecolor});
									else field.removeClass('kb-force-forecolor').elm('.kb-guide').css({color:''});
								}
								if ('error' in value)
								{
									if (field.alert) field.alert(value.error);
									else
									{
										field.elms('input,select,textarea').each((element,index) => {
											if (element.alert) element.alert.elm('span').html(value.error).parentNode.show();
										});
									}
								}
								switch (fieldInfo.type)
								{
									case 'CALC':
									case 'CATEGORY':
									case 'CHECK_BOX':
									case 'CONDITION':
									case 'CREATED_TIME':
									case 'CREATOR':
									case 'FILE':
									case 'GROUP_SELECT':
									case 'MODIFIER':
									case 'MULTI_SELECT':
									case 'ORGANIZATION_SELECT':
									case 'RADIO_BUTTON':
									case 'RECORD_NUMBER':
									case 'REFERENCE_TABLE':
									case 'SPACER':
									case 'STATUS':
									case 'STATUS_ASSIGNEE':
									case 'UPDATED_TIME':
									case 'USER_SELECT':
										if ('backcolor' in value) field.css({backgroundColor:(value.backcolor)?value.backcolor:''});
										if ('forecolor' in value) field.css({color:(value.forecolor)?value.forecolor:''});
										break;
									default:
										field.elms('input,select,textarea').each((element,index) => {
											if ('backcolor' in value) element.css({backgroundColor:(value.backcolor)?value.backcolor:''});
											if ('forecolor' in value) element.css({color:(value.forecolor)?value.forecolor:''});
										});
										break;
								}
							}
							switch (fieldInfo.type)
							{
								case 'CALC':
								case 'RECORD_NUMBER':
								case 'STATUS':
									field.elm('.kb-guide').html(value.value);
									break;
								case 'CATEGORY':
									field.elm('.kb-guide').html(value.value.join('<br>'));
									break;
								case 'CHECK_BOX':
								case 'MULTI_SELECT':
									field.elms('input').each((element,index) => {
										element.checked=value.value.includes(element.val());
									});
									field.elm('.kb-guide').html(value.value.join('<br>'));
									break;
								case 'COLOR':
									field.css({backgroundColor:(value.value)?value.value:'transparent'}).elm('input').val(value.value);
									field.elm('.kb-guide').html(value.value);
									break;
								case 'CONDITION':
									field.elm('.kb-guide').empty();
									if (value.value)
									{
										field.elm('input').val(value.value);
										value.value.split(' and ').each((value,index) => field.guide(value));
									}
									else field.elm('input').val('');
									break;
								case 'CREATOR':
								case 'MODIFIER':
									field.elm('input').val(JSON.stringify(value.value));
									field.elm('.kb-guide').html(value.value.name);
									break;
								case 'CREATED_TIME':
								case 'UPDATED_TIME':
									if (value.value)
									{
										field.elm('input').val(value.value);
										field.elm('.kb-guide').html(new Date(value.value).format('Y-m-d H:i'));
									}
									else
									{
										field.elm('input').val('');
										field.elm('.kb-guide').html('');
									}
									break;
								case 'DATETIME':
									if (value.value)
									{
										var date=value.value.parseDateTime();
										field.elm('input').val(date.format('Y-m-d'));
										field.elm('.kb-hour').elm('select').val(date.format('H'));
										field.elm('.kb-minute').elm('select').val(date.format('i'));
										field.elm('.kb-guide').html(date.format('Y-m-d H:i'));
									}
									else
									{
										field.elm('input').val('');
										field.elm('.kb-hour').elm('select').val('');
										field.elm('.kb-minute').elm('select').val('');
										field.elm('.kb-guide').html('');
									}
									break;
								case 'DROP_DOWN':
									field.elm('select').val(value.value);
									field.elm('.kb-guide').html(field.elm('select').selectedText());
									break;
								case 'FILE':
								case 'GROUP_SELECT':
								case 'ORGANIZATION_SELECT':
								case 'USER_SELECT':
									field.elm('.kb-guide').empty();
									if (value.value)
									{
										field.elm('input').val(JSON.stringify(value.value));
										value.value.each((value,index) => field.guide(value));
									}
									else field.elm('input').val('[]');
									break;
								case 'LINK':
									field.elm('input').val(value.value);
									field.elm('.kb-guide').empty();
									if (value.value)
										switch (fieldInfo.protocol)
										{
											case 'MAIL':
												field.elm('.kb-guide').append(
													kb.create('a').attr('href','mailto:'+value.value).html(value.value)
												);
												break;
											case 'CALL':
												field.elm('.kb-guide').append(
													kb.create('a').attr('href','tel:'+value.value).html(value.value)
												);
												break;
											case 'WEB':
												field.elm('.kb-guide').append(
													kb.create('a').attr('href',value.value).attr('target','_blank').html(value.value)
												);
												break;
										}
									break;
								case 'MULTI_LINE_TEXT':
								case 'RICH_TEXT':
									field.elm('textarea').val(value.value);
									field.elm('.kb-guide').html(value.value.replace(/\n/g,'<br>'));
									break;
								case 'NUMBER':
									if (fieldInfo.digit)
									{
										if (kb.isNumeric(value.value))
										{
											field.elm('input').val(Number(value.value).comma(fieldInfo.displayScale));
											field.elm('.kb-guide').html(Number(value.value).comma(fieldInfo.displayScale));
										}
										else
										{
											field.elm('input').val(value.value);
											field.elm('.kb-guide').html(value.value);
										}
									}
									else
									{
										if (fieldInfo.displayScale)
										{
											if (kb.isNumeric(value.value))
											{
												field.elm('input').val(Number(value.value).toFloor(parseInt(fieldInfo.displayScale)));
												field.elm('.kb-guide').html(Number(value.value).toFloor(parseInt(fieldInfo.displayScale)));
											}
											else
											{
												field.elm('input').val(value.value);
												field.elm('.kb-guide').html(value.value);
											}
										}
										else
										{
											field.elm('input').val(value.value);
											field.elm('.kb-guide').html(value.value);
										}
									}
									if (fieldInfo.unit)
									{
										if (fieldInfo.unitPosition=='prefix') field.elm('.kb-guide').html(fieldInfo.unit+' '+field.elm('.kb-guide').text());
										else field.elm('.kb-guide').html(field.elm('.kb-guide').text()+' '+fieldInfo.unit);
									}
									break;
								case 'RADIO_BUTTON':
									field.elms('[data-name='+key+']').each((element,index) => {
										element.checked=(value.value==element.val());
									});
									field.elm('.kb-guide').html(value.value);
									break;
								case 'SPACER':
									break;
								case 'STATUS_ASSIGNEE':
									field.elm('.kb-guide').empty();
									if (value.value)
									{
										value.value.each((value,index) => {
											field.elm('.kb-guide')
											.append(
												kb.create('span').addClass('kb-guide-item')
												.append(kb.create('span').addClass('kb-guide-item-label').html(value.name))
											);
										});
									}
									break;
								case 'SUBTABLE':
									if (value.value.length==0) field.clearRows();
									else
									{
										field.tr.each((element,index) => {
											if (value.value.length>index)
												assign(element,fieldInfo,((values) => {
													if (value.disabled)
														for (var key in values) values[key].disabled=true;
													return values;
												})(value.value.map((item) => item.value)[index]),(unassinged) => res=res.concat(unassinged));
										});
										for (var i=field.tr.length;i<value.value.length;i++)
											assign(field.addRow(),fieldInfo,((values) => {
												if (value.disabled)
													for (var key in values) values[key].disabled=true;
												return values;
											})(value.value.map((item) => item.value)[i]),(unassinged) => res=res.concat(unassinged));
										field.tr.slice(value.value.length).each((element,index) => field.delRow(element));
									}
									if (field.tr.length==0)
										((row) => {
											if (value.disabled)
												assign(row,fieldInfo,((values) => {
													for (var key in values) values[key].disabled=true;
													return values;
												})(this.get(row,fieldInfo,true).record),(unassinged) => res=res.concat(unassinged));
										})(field.addRow());
									break;
								case 'TIME':
									if (value.value)
									{
										field.elm('.kb-hour').elm('select').val(value.value.split(':')[0]);
										field.elm('.kb-minute').elm('select').val(value.value.split(':')[1]);
										field.elm('.kb-guide').html(value.value);
									}
									else
									{
										field.elm('.kb-hour').elm('select').val('');
										field.elm('.kb-minute').elm('select').val('');
										field.elm('.kb-guide').html('');
									}
									break;
								default:
									field.elm('input').val(value.value);
									field.elm('.kb-guide').html(value.value);
									break;
							}
						}
					})(container.elm('[field-id="'+CSS.escape(key)+'"]'),app.fields[key],record[key]);
				/* reserved field */
				if ('$id' in record)
					if (container.elm('[data-type=id]')) container.elm('[data-type=id]').val(record['$id'].value);
				callback(res);
			};
			assign(container,app,record,(unassinged) => {
				if (container.hasOwnProperty('cleanup')) container.cleanup();
				resolve();
			});
		});
	}
	/* simplify record */
	simplify(app,record){
		var res={};
		for (var key in app.fields)
			((fieldInfo) => {
				switch (fieldInfo.type)
				{
					case 'CATEGORY':
					case 'CHECK_BOX':
					case 'MULTI_SELECT':
						res[key]={value:(key in record)?record[key].value.sort():[]};
						break;
					case 'CALC':
					case 'CREATED_TIME':
					case 'CREATOR':
					case 'FILE':
					case 'MODIFIER':
					case 'RECORD_NUMBER':
					case 'REFERENCE_TABLE':
					case 'SPACER':
					case 'STATUS':
					case 'UPDATED_TIME':
						break;
					case 'GROUP_SELECT':
					case 'ORGANIZATION_SELECT':
					case 'STATUS_ASSIGNEE':
					case 'USER_SELECT':
						res[key]={value:(key in record)?record[key].value.map((item) => item.code).sort():[]};
						break;
					case 'NUMBER':
						res[key]={value:(key in record)?(kb.isNumeric(record[key].value)?record[key].value.toString():''):''};
						break;
					case 'SUBTABLE':
						res[key]={value:record[key].value.reduce((result,current) => {
							result.push({value:this.simplify(fieldInfo,current.value)});
							return result;
						},[])};
						break;
					default:
						res[key]={value:(key in record)?(record[key].value || ' ').toString():''};
						break;
				}
			})(app.fields[key]);
		return res;
	}
};
window.KintoneBoosterRecordPicker=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(type,multiSelect,prepend){
		super(999997,false,!multiSelect);
		/* setup properties */
		this.multiSelect=multiSelect;
		this.prepend=prepend;
		this.type=type;
		this.limit=50;
		this.offset=0;
		this.table=null;
		this.fieldInfo={};
		this.records=[];
		this.selection=[];
		this.img=this.parts.icon.clone().css({top:'0px'});
		this.prev=this.img.clone()
		.css({right:'4em'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjZJREFUeNpiYKAJ6J8y8T+MzYIm0QCk6pHFmNA016ObhqKgMCefkfoOBggg6vr9Psz/LLgCBcVb6BI4gxSvQqJMAQggugYDinNYSNVAUDOxHmbCJghNRo2ENDMSG+VASoGq6RMggIY7Agbae6Limdh4ZyGgaT2QCiAphRGbyliwaALZtJ7s5EksYCTF2ehJE6fNUIUbqFIIUFQuYUskAwcAAmgUUTP3F5CUpSi0DD07TqCZxUDLQBXBfVL1sZBpmQCQoiiPsJCRIQWoES3ENAn2AykHaic+Rlr6GF8DgJGWcUx1i4lN1TS1GF8+HpC2FqGSa+QBgAAaRaNgFBBVcJDVm6BCL4uo2ouFShYaAKnzNG/6oFkKstCALm0uarS7mMi0tJ+ujT1i+79UtRhav/ZTKwewUDubULN5S5MRO4KJC9pu+kB3i6GWC4KoAWvQkxL0hFqYJOdjqIET6BLUWCwHBbsg3S2GWv4B6vsLdLUYyQGGQMqQ5omL2IKG6omL3tluFIwCkgFAgPbN6AZAGASi1XQQR3BD3aSrGhLilzZqoQK9iwu8RLnrUfFAEORKbla63NNSRbq21KPZOCQFqJIqC133wAxJt2FU+uZsCHRPF9d+QgFzq7FJlwymgHk/U3pCdgfmgpMm7PL3p5MVIU8bsTQUpbtxcRsxB6xtI9Ka02CaPL7SLdFSLUtrDi2TwJq2ZB5YOni4ApaIlm6Bvx4eQgC/8fVQwE9sLizwnc3hbwMIgobRAdIK28oCHbudAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.offset-=this.limit;
			/* search records */
			this.search();
		});
		this.next=this.img.clone()
		.css({right:'2em'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAi1JREFUeNpiYKAa6J8y8T8Q30cXZ0LjK4AU4lMANw3GZkGXLMzJZ2QgpIskABBAVPI/Xr9DA6gBn7/rcUri9DNJACCAaO9lXICRkGZ8HmQkxWZ0g5iIdGEjNhew4NHwAKhBkWaBCxBAwwUBo+o9sWqxRZUAsamMiUDJtJ4szVAQgM8VTMRmFiAOIEszLsBCjCJcOYuQzRvwZUkWUm2jWiIZOAAQQKMIW8QV0MJcRmKyExI3EJjsNgyExchAEeiIBwNhMTIQBDriw0BYDAMfgA4QHAiLkcEBoCMcKSo1aeFjallMchxTYjFFqZpUi6mWjwes5Bp5ACCARtEoGJlNn/+0KESI7RD0U7vRTEpPRADqewN6WwwD54GWnx/Ixh5Z9TBVOn1A8B7osP6BsBgECshplzENVLZjona2JzbbUdtiogdDaGHxB2K69dS2uJDe7WqSBy+o4eMJ5IyYUOpjsksuci2+ALTQkBIXk2OxIdDSC5TGDwuJ2USQWomRidrZZBSMggEHAAHaNaMbAEEYiBLDgo7AJo7gaI7gCI5giMSAn0LLNb0XBuAlhF4LXIQQU3Q/vZfcnsPI2jNPtSZck+e66W/utCjcpPzw/DC4vAjXZPHNk/DbDxT53YvwVz6pvecACNec5aY/vAg3zb5UmUMVFitzFoSHlrklOCMa2OPQI40qLHZpIQmrlKXZwurBI06SnBYtNYUhmgdpYbj2UEIYegAwStjMiIcQQkxxA49895hLUEtfAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.offset+=this.limit;
			/* search records */
			this.search();
		});
		this.submit=this.img.clone()
		.css({left:'0'})
		.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7BJREFUeNpiYKAa6J8yMQFK/yfbhP9Qej7RigkpOk+U1QABRLnf92MTZ4LSDkgKHbDpNiDoHZACvIqIChCAAKIIMeLwNtxHhTn5jCTFNHoo4FLPRISZ58mJNQdCwctIauIlKRzwAYAAGqKIkUBcNwIDp4GsRAIqFoC4gBiNAaTmEOQUZkBpWfCeXJtB4AFSMRgAYoNSE9Zyg5R0TVbaRteEnK4JZkn0TAA0rIGcwPxP+4KNWAAQQKO5mVCeg2WdA8DYP0Azi6FZTACILwAtMkQSB4ndxyZHjfbNf2LaE1RNsqBMQ4phUMsdSLEDV04+gBSkRJW3pMY5E45iA2RIIxC/x9cQhEbFeiB2pHqqhlYz/TikHUGOhLZXzpNS6TNSIT2A4nY/MQUuVS0mpibD5gCqt4NwOCARaPkCuhSJ0CyZMFo5wABAAI2iUTCwLRBoLVWAVBI10NRioIUK0JYG0UUhxRaj1TiBQEs2oLWu66FcQaDcB1ItZiHUu8bmK2hQw1op78kp85lw+HY9kUGpiFRnU24xEICaMwSDD+iwBzC3UstiEJhIpBlkta+ZqJAlBahtcT2RZhhQ0+IFxDRvkdrSgVSxGJhoEqHM9wRKs/1Q9RuoGdSCSL2E+WiW7oc5Cpbl8A3Jkduufo8jAT0AWqqIRQ1RDTtSuqmw+PwANPgCWm/CgNRWJTUa9Lja03gtp0Y+xpWi5+Nr3lJsMTRFJ5JqOTV8zAANUpyW08xiIiynncV4LBekW0MO1GQiawxwFAwrABCgXau9QRCIoYQJWMENdAJlBCZQJjCOwAZugE4AG+AGygSs4AjapJra8HF3HEcx96J/jCR91uu1r8+/PDw8/k+FUGw+jzhg9gGGT+iSMjJkLoMwzgxVS5v/xKG1Jp9tA+IfIIDOPDYRMZwRRgnozogq77dxysvZvwE2Z7E4wi17h2yMyMacI5Dl1dTZDjWCixjZZKyiiFm9EAmlmjrDOvMDlc5KE9FhQOwArHU3k1MSpqgtx3FzVbRMCW8tDnURq+AyzjCe108wO4uTZ8GOykNSlYYrqWEBJiMy25Dr7SvRiWs8WuQ7OIOpSveERalg9/j5/exJeqcVYeC7gUIUBd3i+Q9R7N5y8v0n/pDl7IRbyB/e733QvxmAwK+cQE+bSmHFVjC7F5RbVRQwirgI82vPrsE6cTFuXxTPc4NHtYiLszcbEofitlG5JUJphCFbuKdLNR77FM3lZdgw48om0MU49juIO1dMPDw8PJziBXvFttyY+HdhAAAAAElFTkSuQmCC')
		.on('click',(e) => {
			this.offset=0;
			/* search records */
			this.search();
		});
		this.input=this.parts.input.clone().css({
			paddingLeft:'2em',
			paddingRight:'4em'
		})
		.attr('placeholder',kb.constants.common.prompt.keyword[kb.operator.language])
		.attr('type','text')
		.on('keydown',(e) => {
			var code=e.keyCode||e.which;
			if (code==13)
			{
				this.offset=0;
				/* search records */
				this.search();
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});
		/* modify elements */
		this.container.css({
			height:'calc(34em + 16px)',
			minWidth:'16em'
		});
		this.contents.css({
			padding:'0px'
		});
		this.header.css({boxShadow:'none'})
		.append(this.input)
		.append(this.next)
		.append(this.prev)
		.append(this.submit)
	}
	/* search records */
	search(callback){
		switch (this.type)
		{
			case 'record':
				kintone.api(
					kintone.api.url('/k/v1/records',true),
					'GET',
					{
						app:this.fieldInfo.app,
						query:(() => {
							var res=[];
							if (this.fieldInfo.query) res.push(this.fieldInfo.query);
							if (this.input.val())
							{
								res.push(((keywords) => {
									var res=[];
									keywords.each((keyword,index) => {
										for (var key in this.fieldInfo.picker)
											((picker) => {
												switch (picker.type)
												{
													case 'LINK':
													case 'MULTI_LINE_TEXT':
													case 'RICH_TEXT':
													case 'SINGLE_LINE_TEXT':
														res.push(picker.code+' like "'+keyword+'"');
														break;
												}
											})(this.fieldInfo.picker[key]);
									});
									return '('+res.join(' or ')+')';
								})(this.input.val().replace(/[　 ]+/g,' ').split(' ').filter((item) => item)));
							}
							return res.join(' and ')+' order by '+((this.fieldInfo.sort)?this.fieldInfo.sort:'$id asc')+' limit '+this.limit+' offset '+this.offset;
						})()
					}
				)
				.then((resp) => {
					/* setup properties */
					this.records=resp.records;
					/* create table */
					this.table.clearRows();
					/* append records */
					this.records.each((record,index) => {
						((row) => {
							kb.record.set(row,{fields:this.fieldInfo.picker},record);
							if (this.multiSelect)
								if (this.selection.some((item) => item['$id'].value==record['$id'].value)) row.css({backgroundColor:'rgba(66,165,245,0.5)',color:''});
						})(this.table.addRow());
					});
					/* modify elements */
					if (this.offset>0) this.prev.show();
					else this.prev.hide();
					if (this.offset+((this.limit==this.records.length)?this.limit:this.records.length)<resp.total) this.next.show();
					else this.next.hide();
					if (callback) callback();
				})
				.catch((error) => kb.alert(kb.error.parse(error)));
				break;
			default:
				var setup=() => {
					var records=(() => {
						var res=(this.prepend)?this.prepend.concat(kb.roleSet[this.type]):kb.extend({},kb.roleSet[this.type]);
						if (this.input.val())
						{
							((keywords) => {
								res=res.filter((record) => {
									var exists=false;
									if (record['name'].value) exists=keywords.some((item) => (record['name'].value.match(new RegExp(item,'ig'))));
									return exists;
								});
							})(this.input.val().replace(/[　 ]+/g,' ').split(' ').filter((item) => item));
						}
						return res;
					})();
					/* setup properties */
					this.records=records.slice(this.offset,this.offset+this.limit);
					/* create table */
					this.table.clearRows();
					/* append records */
					this.records.each((record,index) => {
						((row) => {
							kb.record.set(row,{fields:this.fieldInfo.picker},record);
							if (this.multiSelect)
								if (this.selection.some((item) => item['code'].value==record['code'].value)) row.css({backgroundColor:'rgba(66,165,245,0.5)',color:''});
						})(this.table.addRow());
					});
					/* modify elements */
					if (this.offset>0) this.prev.show();
					else this.prev.hide();
					if (this.offset+((this.limit==this.records.length)?this.limit:this.records.length)<records.length) this.next.show();
					else this.next.hide();
					if (callback) callback();
				};
				if (kb.roleSet.user.length==0) kb.roleSet.load().then(() => setup());
				else setup();
				break;
		}
	}
	/* show records */
	show(fieldInfo,callback){
		var div=this.parts.div.clone().css({
			borderTop:'1px solid #42a5f5',
			borderBottom:'1px solid #42a5f5',
			lineHeight:'2em',
			padding:'0px 0.5em'
		});
		var td=this.parts.td.clone().css({cursor:'pointer',padding:'0',userSelect:'none'});
		var th=this.parts.th.clone().css({backgroundColor:kb.themeColor().backcolor});
		/* setup properties */
		this.offset=0;
		this.fieldInfo=fieldInfo;
		this.records=[];
		this.selection=[];
		/* setup elements */
		this.input.val('');
		/* create table */
		this.table=this.parts.table.clone().css({marginBottom:'0.5em'})
		.append(kb.create('thead').append(kb.create('tr')))
		.append(kb.create('tbody').append(kb.create('tr')));
		for (var key in this.fieldInfo.picker)
			((picker) => {
				this.table.elm('thead tr').append(
					th.clone()
					.append(div.clone().html(('label' in picker)?picker.label:''))
				);
				this.table.elm('tbody tr').append(
					td.clone()
					.append(kb.field.create(((fieldInfo) => {
						fieldInfo.noLabel=true;
						return fieldInfo;
					})(kb.extend({},picker))).css({width:'100%'}).addClass('kb-picker kb-readonly'))
				);
			})(this.fieldInfo.picker[key]);
		this.contents.empty().append(
			this.table.spread((row,index) => {
				row.on('click',(e) => {
					((record) => {
						if (this.multiSelect)
						{
							((filter) => {
								if (filter.length==this.selection.length)
								{
									this.selection.push(kb.extend({},record));
									row.css({backgroundColor:'rgba(66,165,245,0.5)',color:''});
								}
								else
								{
									this.selection=filter;
									row.css({backgroundColor:'transparent',color:kb.themeColor().forecolor});
								}
							})(this.selection.filter((item) => {
								return (this.type=='record')?(item['$id'].value!=record['$id'].value):(item['code'].value!=record['code'].value);
							}));
						}
						else
						{
							if (callback) callback(record);
							this.hide();
						}
					})(this.records[index]);
				});
				/* activation */
				((app) => {
					row.addClass('kb-scope').elms('.kb-field').each((element,index) => kb.field.activate(element,app));
				})({id:'recordPicker',fields:kb.extend({},this.fieldInfo.picker)})
			})
		);
		if (this.multiSelect)
		{
			/* setup handler */
			if (this.handler) this.ok.off('click',this.handler);
			this.handler=(e) => {
				if (callback) callback(this.selection);
				this.hide();
			};
			this.ok.on('click',this.handler);
			this.cancel.on('click',(e) => this.hide());
		}
		/* show */
		this.search(() => super.show());
	}
};
window.KintoneBoosterButton=class{
	/* constructor */
	constructor(){}
	/* create */
	create(mobile,type,id,label,message,handler){
		((element) => {
			if (element) element.parentNode.removeChild(element);
		})(kb.elm('#'+id));
		switch (type)
		{
			case 'detail':
				((mobile)?kintone.mobile.app.getHeaderSpaceElement():kintone.app.record.getHeaderMenuSpaceElement().css({padding:'0 0.75em 0 1em'}))
				.append(
					kb.create('button').addClass('kb-action-button '+((mobile)?'kb-action-button-mobile-detail':'kb-action-button-detail')).attr('id',id).html(label).on('click',(e) => {
						kb.confirm(message,() => handler());
					})
				);
				break;
			case 'index':
				((mobile)?kintone.mobile.app.getHeaderSpaceElement():kintone.app.getHeaderMenuSpaceElement())
				.append(
					kb.create('button').addClass('kb-action-button '+((mobile)?'kb-action-button-mobile-index':'kb-action-button-index')).attr('id',id).html(label).on('click',(e) => {
						kb.confirm(message,() => handler());
					})
				);
				break;
		}
	}
};
window.KintoneBoosterField=class{
	/* constructor */
	constructor(){
		this.cache={};
		this.reserved=['CATEGORY','CREATED_TIME','CREATOR','GROUP','HR','LABEL','MODIFIER','RECORD_NUMBER','REFERENCE_TABLE','SPACER','STATUS','STATUS_ASSIGNEE','UPDATED_TIME','__ID__','__REVISION__'];
	}
	/* activate */
	activate(field,app,callable=true){
		var fieldInfos=kb.field.parallelize(app.fields);
		var alert=() => {
			return kb.create('div').css({
				zIndex:kb.popups.alert.cover.style.zIndex-4
			})
			.append(
				kb.create('img')
				.attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkVGNzA3QTE1RTc4MTFFOEI5MDA5RUE2NDFCQTUzNDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkVGNzA3QTI1RTc4MTFFOEI5MDA5RUE2NDFCQTUzNDciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRUY3MDc5RjVFNzgxMUU4QjkwMDlFQTY0MUJBNTM0NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRUY3MDdBMDVFNzgxMUU4QjkwMDlFQTY0MUJBNTM0NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkBlNTAAAADNSURBVHja7NHBCcJAFATQZNBcYwmSmycPlpI2bCVgAVqAVmAFHmxqncAKQVyz+/N/grADc0iyy0Be6ZwrlgiKhZKH83Ae/v/h1X23l9499vfZk2hYOHpgO7ZkH+xzjl9dsze2Ytfsld3MMXxhm8Hzlj1bD/eu7Zf3rf9mMvx2DaXzZ1SHh66hVP5MrTn86RpK48+qDIdcQ4nyxkRXsTcmuoq9oeAq8oaSa7I3FF2TvKHomuQNZddobxi4RnnDyHXUG0auo94wdP3p/RJgAMw4In5GE/6/AAAAAElFTkSuQmCC')
			)
			.append(
				kb.create('span')
			);
		};
		var call=(type) => {
			((container,scope) => {
				if (field.elm('.kb-field-alert')) field.elm('.kb-field-alert').hide();
				else
				{
					field.elms('input,select,textarea').each((element,index) => {
						if (element.alert) element.alert.hide();
					});
				}
				kb.event.call(type,(() => {
					var res={
						container:scope,
						record:kb.record.get(container,app,true).record
					};
					return res;
				})())
				.then((param) => {
					if (!param.error)
					{
						if (callable)
						{
							kb.event.call('kb.action.call',{
								record:param.record,
								mobile:((location.href.match(/\/m\//g))?true:false),
								pattern:'change',
								workplace:(container.closest('.kb-view'))?'view':'record'
							})
							.then((param) => {
								kb.event.call('kb.style.call',{
									record:param.record,
									mobile:param.mobile,
									pattern:(('$id' in param.record)?((param.record['$id'].value)?'edit':'create'):'create'),
									workplace:param.workplace
								})
								.then((param) => {
									kb.record.set(container,app,param.record);
									((event) => {
										container.attr('unsaved','unsaved').dispatchEvent(event);
									})(new Event('change'));
								})
								.catch(() => {});
							});
						}
						else
						{
							kb.record.set(container,app,param.record);
							((event) => {
								container.attr('unsaved','unsaved').dispatchEvent(event);
							})(new Event('change'));
						}
					}
				});
			})(field.closest('[form-id=form_'+app.id+']'),field.closest('.kb-scope'));
		};
		if (field.attr('field-id'))
			((field,fieldInfo) => {
				if (!fieldInfo.lookup)
				{
					switch (fieldInfo.type)
					{
						case 'CHECK_BOX':
						case 'MULTI_SELECT':
							if (fieldInfo.required)
							{
								field.alert=(message) => {
									if (!field.elm('.kb-field-alert')) field.append(alert().addClass('kb-field-alert'));
									field.elm('.kb-field-alert').elm('span').html(message).parentNode.show();
								};
							}
							break;
						case 'COLOR':
							field.elm('.kb-search').on('click',(e) => {
								kb.pickupColor((color) => {
									field.css({backgroundColor:color}).elm('input').val(color);
									call('kb.change.'+fieldInfo.code);
								});
							});
							field.elm('input').on('change',(e) => {
								if (!e.currentTarget.val())
								{
									field.css({backgroundColor:'transparent'});
									call('kb.change.'+fieldInfo.code);
								}
								else
								{
									var color=e.currentTarget.val().replace(/#/g,'');
									if (color.match(/([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/g))
									{
										field.css({backgroundColor:'#'+color}).elm('input').val('#'+color);
										call('kb.change.'+fieldInfo.code);
									}
								}
							});
							break;
						case 'CONDITION':
							field.elm('.kb-search').on('click',(e) => {
								kb.filter.build(fieldInfo.app,field.elm('input').val(),(query) => {
									field.elm('input').val(query);
									call('kb.change.'+fieldInfo.code);
								});
							});
							field.reset=(app) => {
								fieldInfo.app=app;
								field.elm('input').val('');
								field.elm('.kb-guide').empty();
							};
							field.guide=(value) => {
								field.elm('.kb-guide').append(
									((guide) => {
										guide
										.append(
											kb.create('button').addClass('kb-icon kb-icon-del kb-guide-item-icon').on('click',(e) => {
												kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
													field.elm('input').val(field.elm('input').val().split(' and ').filter((item) => item!=value).join(' and '));
													call('kb.change.'+fieldInfo.code);
												});
											})
										)
										.append(kb.create('span').addClass('kb-guide-item-label').html(value));
										return guide;
									})(kb.create('span').addClass('kb-guide-item'))
								);
							};
							if (fieldInfo.required)
							{
								field.alert=(message) => {
									if (!field.elm('.kb-field-alert')) field.append(alert().addClass('kb-field-alert'));
									field.elm('.kb-field-alert').elm('span').html(message).parentNode.show();
								};
							}
							break;
						case 'DATE':
							field.elm('.kb-search').on('click',(e) => {
								kb.pickupDate(field.elm('input').val(),(date) => {
									field.elm('input').val(date);
									call('kb.change.'+fieldInfo.code);
								});
							});
							break;
						case 'DATETIME':
							field.elm('.kb-search').on('click',(e) => {
								kb.pickupDate(field.elm('input').val(),(date) => {
									field.elm('input').val(date);
									call('kb.change.'+fieldInfo.code);
								});
							});
							break;
						case 'FILE':
							field.elm('.kb-search').on('click',(e) => {
								((file) => {
									kb.elm('body').append(file.on('change',(e) => {
										if (e.currentTarget.files)
										{
											((data) => {
												kb.file.upload(Array.from(e.currentTarget.files).first())
												.then((resp) => {
													field.elm('input').val(((files) => {
														return JSON.stringify(files.concat(resp));
													})((field.elm('input').val())?JSON.parse(field.elm('input').val()):[]));
													call('kb.change.'+fieldInfo.code);
												})
												.catch((error) => kb.alert(kb.error.parse(error)))
												.finally(() => document.body.removeChild(file));
											})(Array.from(e.currentTarget.files).first());
										}
										else document.body.removeChild(file);
									}));
									file.click();
								})(kb.create('input').attr('type','file').css({display:'none'}));
							});
							field.guide=(file) => {
								field.elm('.kb-guide').append(
									((guide) => {
										guide
										.append(
											kb.create('button').addClass('kb-icon kb-icon-del kb-guide-item-icon').on('click',(e) => {
												kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
													field.elm('input').val(JSON.stringify(JSON.parse(field.elm('input').val()).filter((item) => item.fileKey!=file.fileKey)));
													call('kb.change.'+fieldInfo.code);
												});
											})
										)
										.append(
											kb.create('span').addClass('kb-guide-item-label').html(file.name).on('click',(e) => field.open(file))
										);
										return guide;
									})(kb.create('span').addClass('kb-guide-item'))
								);
							};
							field.open=(file) => {
								kb.file.download(file)
								.then((resp) => {
									try
									{
										var src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAFN++nkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA1FJREFUeNpiYKA66J8y8T8ynwmfJE6dQHYAjM9CtAlIihJIcjRAANHD71hdDxIA+RVdAbKf1wMFqeRXgACiqdcbQBiXPBMB/fVQTLxmoG3riRHDlXwWgIjCnHxGJOkPMHmYOCMx0QwDaIZRBgACaDgiYMDtxydPKJE4UKIZL8AVzwZA6jySkCEwji8QtBmoUQBIgbAhTCOIDxXHX4DgSl3Y5CjyMwspaRuvn6EJfwEOtQtIyhiEEsnAAYAAGkV0A4wUFDH/KSmPmYaEj4nJpcT6niQfQw01xCFtSEqQMxLwYT+QKsDmI6RyGV4eYwmRCUC5QpIsRjJEEaj5ARmJTwFI3ccV/CxEmHEfS2svEWjYArQG33yKi3ooCAQ1MXHIzQdaRqxFjtRI1aDgA5X+ClikQdHhSE60jAKaAoAAGkWjYBSgtF8pacOyUGC3AyUOH7Cmz8izmJGUxEREvB4AVouOtGhlvod2Y7GBD0BLBWnWoMdhOUmWEh3HoDYVrKkDteADNktBaogdcGMksZnTCLSkAcnnDEiWgsTriW0KMRKZkEDd8kQiQwcUMgmEEhwLgVKJ5LiDOjARKS04kFNkCkAb9h+gwXaBgG8NoNEjQK2yGmTQeWjD/gCozQ10xAekkaL1pJbduCz+gMfVIAve4x1LxjSLuOwEjdcNVCgZN+BKI4xEpFKi4w3JhwTTA6lFJqjL2o8rQQMtm0CPFgjesfhRMAoGDAAEaNdqbxCEgWhjGKAjMAKbyAg6ATM4gWECGQE2cBRGcAS5eI1VGvt110C8F/hDSNvX69217yqPQCAQbBnF69iuikbJevrh3ywshIUwrf82Md93E7QSjpXJR81NRelE4ixEi6alQOKsRMkI4+XCo/rU7wxAiBo9xFdEsU1X0XhY3sluk5VwhHo2q5c+dTHKm8Pi3fL2LotiP6DAAvHa09ddWQofNWHXvQ8YMMh6Y2iniStJ4wTARDWpuzWKtNTgkm6ZQ4FxnawUVhEOpv26kDFblp8jLFlblqypZ61itAgMFtTVqyVkP9C3J/UWwM3q0KoAYglDUeOW0Z/GaH4i5nEO/THneh7r0vNkgGhXYdt4YBWRKoiNmHeHPe60uh++any7595pCQQCgWDLeALGLWqyLWBxZQAAAABJRU5ErkJggg==';
										var download=() => {
											var a=kb.create('a')
											.css({display:'none'})
											.attr('href',this.objectUrl(resp,file.contentType))
											.attr('target','_blank')
											.attr('download',file.name);
											kb.elm('body').append(a);
											a.click();
											document.body.removeChild(a);
										};
										switch (file.contentType)
										{
											case 'application/javascript':
												fetch(new Request(this.objectUrl(resp,file.contentType)))
												.then((resp) => resp.text())
												.then((text) => {
													var lines=text.split('\n');
													kb.create('div')
													.append(
														((container) => {
															lines.each((line,index) => container.append(kb.create('code').css({display:'block'}).text(line)));
															return container
														})(kb.create('pre'))
													)
													.popup('full','full',[{src:src,handler:download}]).show();
												});
												break;
											case 'application/json':
												fetch(new Request(this.objectUrl(resp,file.contentType)))
												.then((resp) => resp.text())
												.then((text) => {
													kb.create('div').html(text.replace(/\n/g,'<br>')).popup('full','full',[{src:src,handler:download}]).show();
												});
												break;
											case 'application/pdf':
												kb.create('iframe').css({
													border:'none',
													height:'100%',
													outline:'none',
													width:'100%'
												})
												.attr('src',this.objectUrl(resp,file.contentType)).popup('full','full',[{src:src,handler:download}]).show();
												break;
											case 'audio/mpeg':
											case 'audio/x-m4a':
												kb.create('audio').css({
													outline:'none'
												})
												.attr('controls','controls')
												.attr('src',this.objectUrl(resp,file.contentType))
												.popup(null,null,[{src:src,handler:download}]).show();
												break;
											case 'image/bmp':
											case 'image/gif':
											case 'image/jpeg':
											case 'image/png':
												kb.create('img').css({
													maxHeight:'calc(100vh - 4em)',
													maxWidth:'calc(100vw - 2em)'
												}).attr('src',this.objectUrl(resp,file.contentType)).popup(null,null,[{src:src,handler:download}]).show();
												break;
											case 'text/plain':
											case 'text/css':
												fetch(new Request(this.objectUrl(resp,file.contentType)))
												.then((resp) => resp.text())
												.then((text) => {
													kb.create('div').html(text.replace(/\n/g,'<br>')).popup('full','full',[{src:src,handler:download}]).show();
												});
												break;
											case 'text/csv':
												fetch(new Request(this.objectUrl(resp,file.contentType)))
												.then((resp) => resp.text())
												.then((text) => {
													var csv=text.parseCSV();
													if (csv.length!=0)
														((table) => {
															csv.each((cells,index) => {
																table.append(
																	((row) => {
																		cells.each((cell,index) => row.append(kb.create('td').css({padding:'0.25em'}).html(cell.replace(/\n/g,'<br>'))));
																		return row;
																	})(kb.create('tr'))
																);
															});
															return table;
														})(kb.create('table')).popup(null,'full',[{src:src,handler:download}]).show();
												});
												break;
											case 'video/mp4':
											case 'video/mpeg':
												kb.create('video').css({
													maxHeight:'calc(100vh - 4em)',
													maxWidth:'calc(100vw - 2em)',
													outline:'none'
												})
												.attr('controls','controls')
												.attr('src',this.objectUrl(resp,file.contentType))
												.popup(null,null,[{src:src,handler:download}]).show();
												break;
											default:
												download();
												break;
										};
									}
									catch(error){kb.alert(kb.error.parse(error))}
								})
								.catch((error) => kb.alert(kb.error.parse(error)));
							};
							if (fieldInfo.required)
							{
								field.alert=(message) => {
									if (!field.elm('.kb-field-alert')) field.append(alert().addClass('kb-field-alert'));
									field.elm('.kb-field-alert').elm('span').html(message).parentNode.show();
								};
							}
							break;
						case 'GROUP_SELECT':
						case 'ORGANIZATION_SELECT':
						case 'USER_SELECT':
							((type) => {
								field.elm('.kb-search').on('click',(e) => {
									field.recordPicker.show(
										{
											picker:{
												name:{
													code:'name',
													type:'SINGLE_LINE_TEXT',
													label:kb.constants.picker.caption.name[kb.operator.language],
													required:false,
													noLabel:true
												}
											}
										},
										(records) => {
											((values) => {
												((codes) => {
													records.each((record,index) => {
														if (!codes.includes(record['code'].value))
															values.push({
																code:record['code'].value,
																name:record['name'].value
															});
													});
												})(values.map((item) => item.code));
												field.elm('input').val(JSON.stringify(values));
												call('kb.change.'+fieldInfo.code);
											})((field.elm('input').val())?JSON.parse(field.elm('input').val()):[]);
										}
									);
								});
								field.recordPicker=new KintoneBoosterRecordPicker(
									type,
									true,
									(() => {
										var res=[];
										if (fieldInfo.loginuser) res.push({code:{value:'LOGINUSER()'},name:{value:'Login user'}});
										if (fieldInfo.guestuser) res.push({code:{value:'GUESTUSER()'},name:{value:'Guest user'}});
										return res;
									})()
								);
								field.guide=(value) => {
									field.elm('.kb-guide').append(
										((guide) => {
											guide
											.append(
												kb.create('button').addClass('kb-icon kb-icon-del kb-guide-item-icon').on('click',(e) => {
													kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
														field.elm('input').val(JSON.stringify(JSON.parse(field.elm('input').val()).filter((item) => item.code!=value.code)));
														call('kb.change.'+fieldInfo.code);
													});
												})
											)
											.append(kb.create('span').addClass('kb-guide-item-label').html(value.name));
											return guide;
										})(kb.create('span').addClass('kb-guide-item'))
									);
								};
								if (fieldInfo.required)
								{
									field.alert=(message) => {
										if (!field.elm('.kb-field-alert')) field.append(alert().addClass('kb-field-alert'));
										field.elm('.kb-field-alert').elm('span').html(message).parentNode.show();
									};
								}
							})((() => {
								var res='';
								switch (fieldInfo.type)
								{
									case 'GROUP_SELECT':
										res='group';
										break;
									case 'ORGANIZATION_SELECT':
										res='organization';
										break;
									case 'USER_SELECT':
										res='user';
										break;
								}
								return res;
							})());
						case 'NUMBER':
							((handler) => {
								field.on('show',(e) => handler());
								handler();
							})(() => {
								if (field.elm('.kb-unit')) field.elm('input').css({width:'calc(100% - '+field.elm('.kb-unit').outerWidth(true)+'px)'});
								else field.elm('input').css({width:null});
							});
							break;
						case 'RADIO_BUTTON':
							field.elms('[data-name='+fieldInfo.code+']').each((element,index) => {
								element.closest('label').on('click',(e) => {
									((value) => {
										field.elms('[data-name='+fieldInfo.code+']').each((element,index) => element.checked=(value==element.val()));
										call('kb.change.'+fieldInfo.code);
									})(element.val());
									e.stopPropagation();
									e.preventDefault();
								});
							});
							break;
						case 'TIME':
								field.elm('.kb-hour').elm('select').on('change',(e) => {
									if (!e.currentTarget.val()) field.elm('.kb-minute').elm('select').val('');
									call('kb.change.'+fieldInfo.id);
								});
								field.elm('.kb-minute').elm('select').on('change',(e) => {
									if (!e.currentTarget.val()) field.elm('.kb-hour').elm('select').val('');
									call('kb.change.'+fieldInfo.id);
								});
								break;
					}
				}
				else
				{
					((handler) => {
						field.elm('.kb-search').on('click',(e) => {
							handler(field.elm('.kb-lookup-search').val(),kb.extend({},fieldInfo));
						});
						field.elm('.kb-clear').on('click',(e) => {
							kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
								field.lookup('').then(() => call('kb.change.'+fieldInfo.code));
							});
						});
						field.elm('input').on('change',(e) => {
							handler(e.currentTarget.val(),kb.extend({},fieldInfo));
						});
					})((search,fieldInfo) => {
						this.load(fieldInfo.lookup.relatedApp.app).then((resp) => {
							((fields) => {
								var get=() => {
									fieldInfo.picker=((picker) => {
										var res={};
										picker.each((picker,index) => {
											if (picker in fields.external) res[picker]=kb.extend({},fields.external[picker]);
										});
										if (Object.keys(res).length==0)
											res['$id']={
												code:'$id',
												type:'RECORD_NUMBER',
												label:kb.constants.picker.caption.recordnumber[kb.operator.language],
												required:false,
												noLabel:false
											};
										return res;
									})(fieldInfo.lookup.lookupPickerFields);
									field.recordPicker.show(
										{
											app:fieldInfo.lookup.relatedApp.app,
											query:fieldInfo.query,
											sort:(fieldInfo.lookup.sort || '$id asc'),
											picker:fieldInfo.picker
										},
										(record) => field.lookup(record['$id'].value).then(() => call('kb.change.'+fieldInfo.code))
									);
								};
								if (search)
								{
									fieldInfo.query=[fieldInfo.lookup.filterCond,fieldInfo.lookup.relatedKeyField+((fieldInfo.type=='NUMBER')?'=':' like ')+'"'+search+'"'].filter((item) => item).join(' and ');
									kintone.api(
										kintone.api.url('/k/v1/records',true),
										'GET',
										{
											app:fieldInfo.lookup.relatedApp.app,
											query:fieldInfo.query
										}
									)
									.then((resp) => {
										if (resp.records.length==1) field.lookup(resp.records.first()['$id'].value).then(() => call('kb.change.'+fieldInfo.code));
										else get();
									})
									.catch((error) => kb.alert(kb.error.parse(error)));
								}
								else
								{
									fieldInfo.query=fieldInfo.lookup.filterCond;
									get();
								}
							})({
								external:resp.parallelize,
								internal:fieldInfos
							});
						});
					});
					field.recordPicker=new KintoneBoosterRecordPicker('record');
					field.lookup=(id) => {
						return new Promise((resolve,reject) => {
							((scope) => {
								var clear=() => {
									kb.record.set(scope,((fieldInfo.tableCode)?app.fields[fieldInfo.tableCode]:app),(() => {
										return fieldInfo.lookup.fieldMappings.reduce((result,current) => {
											if (current.field in fieldInfos)
											{
												switch (fieldInfos[current.field].type)
												{
													case 'CHECK_BOX':
													case 'FILE':
													case 'GROUP_SELECT':
													case 'MULTI_SELECT':
													case 'ORGANIZATION_SELECT':
													case 'USER_SELECT':
														result[current.field]={value:[]};
														break;
													default:
														result[current.field]={value:''};
														break;
												}
											}
											return result;
										},((res) => {
											res[fieldInfo.code]={value:''};
											return res;
										})({}));
									})(),false).then(() => resolve());
								};
								if (id)
								{
									kintone.api(
										kintone.api.url('/k/v1/record',true),
										'GET',
										{
											app:fieldInfo.lookup.relatedApp.app,
											id:id
										}
									)
									.then((resp) => {
										if (resp.record)
										{
											kb.record.set(scope,((fieldInfo.tableCode)?app.fields[fieldInfo.tableCode]:app),(() => {
												return fieldInfo.lookup.fieldMappings.reduce((result,current) => {
													if ((current.relatedField in resp.record) && (current.field in fieldInfos))
														result[current.field]={value:resp.record[current.relatedField].value};
													return result;
												},((res) => {
													res[fieldInfo.code]={value:resp.record[fieldInfo.lookup.relatedKeyField].value};
													return res;
												})({}));
											})(),false).then(() => resolve());
										}
										else clear();
									})
									.catch((error) => kb.alert(kb.error.parse(error)));
								}
								else clear();
							})(field.closest('.kb-scope'));
						});
					};
				}
				field.elms('input,select,textarea').each((element,index) => {
					switch (fieldInfo.type)
					{
						case 'COLOR':
						case 'CONDITION':
						case 'FILE':
						case 'GROUP_SELECT':
						case 'ORGANIZATION_SELECT':
						case 'RADIO_BUTTON':
						case 'TIME':
						case 'USER_SELECT':
							break;
						default:
							element.on('change',(e) => call('kb.change.'+fieldInfo.code));
							break;
					}
				});
			})(field.elm('.kb-field-value'),fieldInfos[field.attr('field-id')]);
		return field;
	}
	/* from blob to Base64 */
	blobToBase64(blob,callback){
		var reader=new FileReader();
		reader.onload=() => {
			callback(reader.result.replace(/^data:.+;base64,/,''));
		};
		reader.readAsDataURL(blob);
	}
	/* create */
	create(fieldInfo){
		var time=(container) => {
			container
			.append(
				kb.create('div').addClass('kb-dropdown kb-hour').append(
					kb.create('select').assignOption((() => {
						var res=[{value:''}];
						(24).each((index) => res.push({value:index.toString().lpad('0',2)}));
						return res;
					})(),'value','value')
				)
			)
			.append(
				kb.create('div').addClass('kb-dropdown kb-minute').append(
					kb.create('select').assignOption((() => {
						var res=[{value:''}];
						(60).each((index) => res.push({value:index.toString().lpad('0',2)}));
						return res;
					})(),'value','value')
				)
			);
		};
		if (!('type' in fieldInfo)) throw new Error('You shoud setup [type] in field information');
		return ((field) => {
			field.append(kb.create('span').addClass('kb-field-caption').html(fieldInfo.label));
			if (fieldInfo.noLabel) field.elm('.kb-field-caption').addClass('kb-hidden');
			field.append(
				((field) => {
					switch (fieldInfo.type)
					{
						case 'CALC':
							switch (fieldInfo.format)
							{
								case 'NUMBER':
								case 'NUMBER_DIGIT':
									field.addClass('kb-number');
									break;
							}
							break;
						case 'CHECK_BOX':
						case 'MULTI_SELECT':
							((options) => {
								options.reduce((result,current) => {
									result[current.index]=current;
									return result;
								},Array(options.length).fill('')).each((option,index) => {
									field.addClass('kb-checkbox')
									.append(
										kb.create('label')
										.append(kb.create('input').attr('type','checkbox').val(option.label))
										.append(kb.create('span').html(option.label))
									);
								});
							})(Object.values(fieldInfo.options));
							break;
						case 'COLOR':
							field.addClass('kb-color')
							.append(kb.create('input').attr('type','text').attr('data-type','color'))
							.append(kb.create('button').addClass('kb-icon kb-icon-color kb-search'));
							break;
						case 'CONDITION':
							field.addClass('kb-condition')
							.append(kb.create('input').attr('type','hidden'))
							.append(kb.create('button').addClass('kb-icon kb-icon-filter kb-search'));
							break;
						case 'CREATOR':
						case 'CREATED_TIME':
						case 'MODIFIER':
						case 'UPDATED_TIME':
							field.append(kb.create('input').attr('type','hidden').attr('data-type',fieldInfo.type.toLowerCase()))
							break;
						case 'DATE':
							field.addClass('kb-date')
							.append(kb.create('input').attr('type','text').attr('data-type','date'))
							.append(kb.create('button').addClass('kb-icon kb-icon-date kb-search'));
							break;
						case 'DATETIME':
							time(
								field.addClass('kb-datetime')
								.append(kb.create('input').attr('type','text').attr('data-type','date'))
								.append(kb.create('button').addClass('kb-icon kb-icon-date kb-search'))
							);
							break;
						case 'DROP_DOWN':
							((options) => {
								field.addClass('kb-dropdown').append(kb.create('select').assignOption(options.reduce((result,current) => {
									result[current.index]=current;
									return result;
								},Array(options.length).fill('')),'label','label'));
							})(Object.values(fieldInfo.options));
							break;
						case 'FILE':
							field.addClass('kb-file')
							.append(kb.create('input').attr('type','hidden'))
							.append(kb.create('button').addClass('kb-icon kb-icon-file kb-search'));
							break;
						case 'GROUP_SELECT':
							field.addClass('kb-group')
							.append(kb.create('input').attr('type','hidden'))
							.append(kb.create('button').addClass('kb-icon kb-icon-group kb-search'));
							break;
						case 'LINK':
							switch (fieldInfo.protocol)
							{
								case 'WEB':
									field.addClass('kb-text').append(kb.create('input').attr('type','text').attr('data-type','url'));
									break;
								case 'CALL':
									field.addClass('kb-text').append(kb.create('input').attr('type','text').attr('data-type','tel'));
									break;
								case 'MAIL':
									field.addClass('kb-text').append(kb.create('input').attr('type','text').attr('data-type','mail'));
									break;
							}
							break;
						case 'MULTI_LINE_TEXT':
						case 'RICH_TEXT':
							field.addClass('kb-textarea').append(((res) => {
								if (fieldInfo.lines) res.css({height:'calc('+(parseFloat(fieldInfo.lines)*1.5).toString()+'em + 2px)'});
								return res;
							})(kb.create('textarea')));
							break;
						case 'NUMBER':
							if (fieldInfo.lookup)
							{
								field.addClass('kb-lookup')
								.append(kb.create('input').addClass('kb-lookup-search').attr('type','text').attr('data-type','nondemiliternumber'))
								.append(kb.create('button').addClass('kb-icon kb-icon-lookup kb-search'))
								.append(kb.create('button').addClass('kb-icon kb-icon-del kb-clear'));
							}
							else
							{
								field.addClass('kb-number').append(
									((res) => {
										if ('displayScale' in fieldInfo) res.attr('data-decimals',fieldInfo.displayScale);
										return res.attr('data-type',((fieldInfo.digit)?'number':'nondemiliternumber'));
									})(kb.create('input').attr('type','text'))
								);
								if (fieldInfo.unit)
									((unit) => {
										if (fieldInfo.unitPosition=='prefix') field.insertBefore(unit,field.elm('input'));
										else field.insertBefore(unit,field.elm('input').nextElementSibling);
									})(kb.create('span').addClass('kb-unit').html(fieldInfo.unit))
							}
							break;
						case 'ORGANIZATION_SELECT':
							field.addClass('kb-organization')
							.append(kb.create('input').attr('type','hidden'))
							.append(kb.create('button').addClass('kb-icon kb-icon-organization kb-search'));
							break;
						case 'RADIO_BUTTON':
							((options) => {
								options.reduce((result,current) => {
									result[current.index]=current;
									return result;
								},Array(options.length).fill('')).each((option,index) => {
									field.addClass('kb-radio')
									.append(
										(() => {
											var res=kb.create('label')
											.append(kb.create('input').attr('type','radio').attr('data-name',fieldInfo.code).val(option.label))
											.append(kb.create('span').html(option.label));
											if (index==0) res.elm('input').checked=true;
											return res;
										})()
									);
								});
							})(Object.values(fieldInfo.options));
							break;
						case 'RECORD_NUMBER':
							field.addClass('kb-id');
							break;
						case 'SINGLE_LINE_TEXT':
							if (fieldInfo.lookup)
							{
								field.addClass('kb-lookup')
								.append(kb.create('input').addClass('kb-lookup-search').attr('type','text').attr('data-type','text'))
								.append(kb.create('button').addClass('kb-icon kb-icon-lookup kb-search'))
								.append(kb.create('button').addClass('kb-icon kb-icon-del kb-clear'));
							}
							else
							{
								switch (fieldInfo.format)
								{
									case 'password':
										field.addClass('kb-text').append(kb.create('input').attr('type','password').attr('data-type',fieldInfo.type));
										break;
									default:
										field.addClass('kb-text').append(kb.create('input').attr('type','text').attr('data-type',(fieldInfo.format)?fieldInfo.format:'text'));
										break;
								}
							}
							break;
						case 'SPACER':
							field.html(fieldInfo.contents);
							break;
						case 'TIME':
							time(field);
							break;
						case 'USER_SELECT':
							field.addClass('kb-user')
							.append(kb.create('input').attr('type','hidden'))
							.append(kb.create('button').addClass('kb-icon kb-icon-user kb-search'));
							break;
					}
					return (fieldInfo.type!='SPACER')?field.append(kb.create('span').addClass('kb-guide')):field;
				})(kb.create('div').addClass('kb-field-value'))
			);
			switch (fieldInfo.type)
			{
				case 'CALC':
				case 'CATEGORY':
				case 'CONDITION':
				case 'CREATED_TIME':
				case 'CREATOR':
				case 'FILE':
				case 'GROUP_SELECT':
				case 'MODIFIER':
				case 'ORGANIZATION_SELECT':
				case 'RECORD_NUMBER':
				case 'REFERENCE_TABLE':
				case 'STATUS':
				case 'STATUS_ASSIGNEE':
				case 'UPDATED_TIME':
				case 'USER_SELECT':
					field.elm('.kb-guide').addClass('kb-fixed');
					break;
			}
			if (fieldInfo.required)
			{
				switch (fieldInfo.type)
				{
					case 'CALC':
					case 'CATEGORY':
					case 'CHECK_BOX':
					case 'CONDITION':
					case 'CREATED_TIME':
					case 'CREATOR':
					case 'FILE':
					case 'GROUP_SELECT':
					case 'MODIFIER':
					case 'MULTI_SELECT':
					case 'ORGANIZATION_SELECT':
					case 'RECORD_NUMBER':
					case 'REFERENCE_TABLE':
					case 'STATUS':
					case 'STATUS_ASSIGNEE':
					case 'UPDATED_TIME':
					case 'USER_SELECT':
						break;
					default:
						field.elms('input,select,textarea').each((element,index) => element.attr('required','required'));
						break;
				}
			}
			if (fieldInfo.placeholder) field.elms('input,select,textarea').each((element,index) => element.attr('placeholder',fieldInfo.placeholder));
			return field;
		})(kb.create('div').addClass('kb-field').attr('field-id',fieldInfo.code));
	}
	/* get */
	get(fieldInfo,mobile,type){
		var res=null;
		var selector='.input-checkbox-cybozu,.input-date-cybozu,.input-datetime-cybozu,.input-file-cybozu,.input-radio-cybozu,.input-text-outer-cybozu,.input-time-cybozu,.multipleselect-cybozu,.select-cybozu';
		if (fieldInfo.tableCode)
		{
			res=kb.elms('.field-'+fieldInfo.id).map((item) => {
				switch (type)
				{
					case 'create':
					case 'edit':
						if (mobile) item.value=(item.elm('input[type=text],textarea,ul'))?item.elm('input[type=text],textarea,ul'):item.elm('[class^=forms-]');
						else item.value=item.elm(selector);
						break;
					case 'detail':
					case 'print':
						if (mobile) item.value=item.elm('.value-'+fieldInfo.id);
						else item.value=item;
						break;
				}
				return item;
			});
		}
		else
		{
			res=kb.elm('.field-'+fieldInfo.id);
			switch (type)
			{
				case 'create':
				case 'edit':
					if (mobile) res.value=(res.elm('input[type=text],textarea,ul'))?res.elm('input[type=text],textarea,ul'):res.elm('[class^=forms-]');
					else res.value=res.elm(selector);
					break;
				case 'detail':
				case 'print':
					res.value=res.elm('.value-'+fieldInfo.id);
					break;
			}
		}
		return res;
	}
	/* empty check */
	isEmpty(value){
		var res=true;
		if (Array.isArray(value)) res=(value.length==0);
		else
		{
			switch (typeof value)
			{
				case 'object':
					res=(value===null || Object.keys(value).length==0);
					break;
				case 'number':
					res=Number.isNaN(value);
					break;
				case 'string':
					res=(value.toString().length==0);
					break;
			}
		}
		return res;
	}
	/* load */
	load(app,useid){
		return new Promise((resolve,reject) => {
			if (!(app in this.cache))
			{
				kintone.api(kintone.api.url('/k/v1/app/form/layout',true),'GET',{app:app})
				.then((resp) => {
					((layout) => {
						var groups=[];
						var tables=[];
						var sort=(layout) => {
							return layout.reduce((result,current) => {
								switch (current.type)
								{
									case 'GROUP':
										groups.push(current.code);
										result=result.concat(sort(current.layout));
										break;
									case 'ROW':
										result=current.fields.reduce((result,current) => {
											if ('code' in current) result.push(current.code);
											return result;
										},result);
										break;
									case 'SUBTABLE':
										tables.push({code:current.code,fields:current.fields});
										result=current.fields.reduce((result,current) => {
											if ('code' in current) result.push(current.code);
											return result;
										},result);
										break;
								}
								return result;
							},[]);
						};
						kintone.api(kintone.api.url('/k/v1/app/form/fields',true),'GET',{app:app,lang:'user'})
						.then((resp) => {
							((codes) => {
								codes.each((code,index) => {
									delete resp.properties[code];
								});
							})(Object.values(resp.properties).reduce((result,current) => {
								switch (current.type)
								{
									case 'CATEGORY':
										result.push(current.code);
										break;
									case 'STATUS':
										if (!current.enabled)
										{
											result.push(current.code);
											result.push(Object.values(resp.properties).filter((item) => item.type=='STATUS_ASSIGNEE').first().code);
										}
										break;
								}
								return result;
							},[]));
							((fieldInfos,sorted,ids) => {
								this.cache[app]={
									origin:resp.properties,
									groups:groups.reduce((result,current) => {
										result[current]=resp.properties[current]
										return result;
									},{}),
									tables:tables.reduce((result,current) => {
										result[current.code]=((fieldInfo) => {
											fieldInfo.fields=current.fields.reduce((result,current) => {
												result[current.code]=fieldInfos[current.code];
												return result;
											},{});
											return fieldInfo;
										})(resp.properties[current.code]);
										if (current.code in ids.table) result[current.code].id=ids.table[current.code];
										return result;
									},{}),
									changes:((exclude) => {
										var res=[]
										res=Object.values(fieldInfos).reduce((result,current) => {
											if (!exclude.includes(current.code)) result.push(current.code);
											return result;
										},[]);
										return res.concat(tables.map((item) => item.code));
									})((() => {
										var res=[];
										for (var key in fieldInfos)
											((fieldInfo) => {
												if (fieldInfo.expression) res.push(fieldInfo.code);
												if (fieldInfo.lookup)
													((mappings) => {
														if (mappings.length!=0) res=res.concat(mappings.slice(0,-1));
													})(fieldInfo.lookup.fieldMappings.map((item) => item.field));
											})(fieldInfos[key]);
										return Array.from(new Set(res));
									})()),
									criterias:(() => {
										var res={};
										sorted.each((sort,index) => {
											if (!['FILE','REFERENCE_TABLE'].includes(fieldInfos[sort].type)) res[sort]=fieldInfos[sort];
										});
										for (var key in fieldInfos)
											((fieldInfo) => {
												switch (fieldInfo.type)
												{
													case 'CALC':
													case 'CATEGORY':
													case 'CREATED_TIME':
													case 'CREATOR':
													case 'MODIFIER':
													case 'RECORD_NUMBER':
													case 'UPDATED_TIME':
														res[fieldInfo.code]=fieldInfo;
														break;
													case 'STATUS':
														if (fieldInfo.enabled)
														{
															res[fieldInfo.code]=fieldInfo;
															((fieldInfo) => {
																res[fieldInfo.code]=fieldInfo;
															})(Object.values(fieldInfos).filter((item) => item.type=='STATUS_ASSIGNEE').first())
														}
														break;
												}
											})(fieldInfos[key]);
										return res;
									})(),
									disables:(() => {
										var res=[];
										for (var key in fieldInfos)
											((fieldInfo) => {
												if (kb.field.reserved.includes(fieldInfo.type)) res.push(fieldInfo.code);
												else
												{
													if (fieldInfo.expression) res.push(fieldInfo.code);
													if (fieldInfo.lookup)
														((mappings) => {
															if (mappings.length!=0) res=res.concat(mappings);
														})(fieldInfo.lookup.fieldMappings.map((item) => item.field));
												}
											})(fieldInfos[key]);
										return Array.from(new Set(res));
									})(),
									parallelize:(() => {
										var res={};
										sorted.each((sort,index) => {
											res[sort]=fieldInfos[sort];
										});
										for (var key in fieldInfos)
											((fieldInfo) => {
												switch (fieldInfo.type)
												{
													case 'CREATED_TIME':
													case 'CREATOR':
													case 'MODIFIER':
													case 'RECORD_NUMBER':
													case 'UPDATED_TIME':
														res[fieldInfo.code]=fieldInfo;
														break;
													case 'STATUS':
														if (fieldInfo.enabled)
														{
															res[fieldInfo.code]=fieldInfo;
															((fieldInfo) => {
																res[fieldInfo.code]=fieldInfo;
															})(Object.values(fieldInfos).filter((item) => item.type=='STATUS_ASSIGNEE').first())
														}
														break;
												}
												if (fieldInfo.code in ids.field)
													if (fieldInfo.code in res)
														res[fieldInfo.code].id=ids.field[fieldInfo.code];
											})(fieldInfos[key]);
										return res;
									})(),
									placed:(() => {
										var res={};
										sorted.each((sort,index) => {
											if (!['REFERENCE_TABLE'].includes(fieldInfos[sort].type)) res[sort]=fieldInfos[sort];
										});
										return res;
									})(),
									sorts:(() => {
										var res={};
										sorted.each((sort,index) => {
											((fieldInfo) => {
												switch (fieldInfo.type)
												{
													case 'CALC':
													case 'CREATED_TIME':
													case 'CREATOR':
													case 'DATE':
													case 'DATETIME':
													case 'DROP_DOWN':
													case 'LINK':
													case 'MODIFIER':
													case 'NUMBER':
													case 'RADIO_BUTTON':
													case 'RECORD_NUMBER':
													case 'SINGLE_LINE_TEXT':
													case 'TIME':
													case 'UPDATED_TIME':
														if (!fieldInfo.tableCode) res[fieldInfo.code]=fieldInfo;
														break;
												}
											})(fieldInfos[sort]);
										});
										for (var key in fieldInfos)
											((fieldInfo) => {
												switch (fieldInfo.type)
												{
													case 'CALC':
													case 'CREATED_TIME':
													case 'CREATOR':
													case 'MODIFIER':
													case 'RECORD_NUMBER':
													case 'UPDATED_TIME':
														res[fieldInfo.code]=fieldInfo;
														break;
													case 'STATUS':
														if (fieldInfo.enabled) res[fieldInfo.code]=fieldInfo;
														break;
												}
											})(fieldInfos[key]);
										return res;
									})()
								};
								resolve(this.cache[app]);
							})(
								kb.field.parallelize(resp.properties),
								sort(layout),
								(() => {
									var res={
										field:{},
										table:{}
									};
									if (useid)
									{
										Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).each((field,index) => {
											res.field[field.var]=field.id;
										});
										if ('subTable' in cybozu.data.page.FORM_DATA.schema)
										{
											Object.values(cybozu.data.page.FORM_DATA.schema.subTable).each((table,index) => {
												res.table[table.var]=table.id;
												Object.values(table.fieldList).each((field,index) => {
													res.field[field.var]=field.id;
												});
											});
										}
									}
									return res;
								})()
							)
						})
						.catch((error) => kb.alert(kb.error.parse(error)));
					})(resp.layout);
				})
				.catch((error) => kb.alert(kb.error.parse(error)));
			}
			else resolve(this.cache[app]);
		});
	}
	/* parallelize */
	parallelize(fields){
		return ((fields) => {
			var res={};
			for (var key in fields)
				((fieldInfo) => {
					switch (fieldInfo.type)
					{
						case 'SUBTABLE':
							var tableCode=fieldInfo.code;
							for (var subkey in fieldInfo.fields)
							{
								fieldInfo.fields[subkey]=kb.extend({
									tableCode:tableCode
								},fieldInfo.fields[subkey]);
								res[fieldInfo.fields[subkey].code]=fieldInfo.fields[subkey];
							}
							break;
						default:
							fieldInfo=kb.extend({
								tableCode:''
							},fieldInfo);
							res[fieldInfo.code]=fieldInfo;
							break;
					}
				})(fields[key]);
			return res;
		})(kb.extend({},fields));
	}
	/* stringify */
	stringify(fieldInfo,value,separator){
		var res='';
		if (fieldInfo && value)
			switch (fieldInfo.type)
			{
				case 'CATEGORY':
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
					res=value.join(separator);
					break;
				case 'CREATOR':
				case 'MODIFIER':
					res=value.name;
					break;
				case 'CREATED_TIME':
				case 'DATETIME':
				case 'UPDATED_TIME':
					res=value.parseDateTime().format('Y-m-d H:i');
					break;
				case 'FILE':
				case 'GROUP_SELECT':
				case 'ORGANIZATION_SELECT':
				case 'STATUS_ASSIGNEE':
				case 'USER_SELECT':
					res=value.map((item) => item.name).join(separator);
					break;
				case 'MULTI_LINE_TEXT':
				case 'RICH_TEXT':
					res=value.replace(/\n/g,'');
					break;
				case 'NUMBER':
					if (kb.isNumeric(value))
					{
						if (fieldInfo.digit) res=Number(value).comma(fieldInfo.displayScale);
						else
						{
							if (fieldInfo.displayScale) res=Number(value).toFloor(parseInt(fieldInfo.displayScale));
							else res=value;
						}
					}
					if (fieldInfo.unit)
					{
						if (fieldInfo.unitPosition=='prefix') res=fieldInfo.unit+' '+res;
						else res=res+' '+fieldInfo.unit;
					}
					break;
				default:
					res=value;
					break;
			}
		return res;
	}
	/* typing */
	typing(sender,receiver,isFilter=false){
		var res=false;
		if (receiver.type=='SINGLE_LINE_TEXT')
		{
			switch (sender.type)
			{
					case 'CALC':
					case 'CREATED_TIME':
					case 'DATE':
					case 'DATETIME':
					case 'DROP_DOWN':
					case 'LINK':
					case 'NUMBER':
					case 'RADIO_BUTTON':
					case 'RECORD_NUMBER':
					case 'SINGLE_LINE_TEXT':
					case 'STATUS':
					case 'TIME':
					case 'UPDATED_TIME':
						res=(isFilter)?true:!receiver.expression;
						break;
			}
		}
		if (!res)
			switch (sender.type)
			{
				case 'CALC':
					if (receiver.type==sender.type) res=((receiver.format==sender.format) && isFilter);
					else
					{
						switch (sender.format)
						{
							case 'DATE':
							case 'DATETIME':
							case 'TIME':
								res=(receiver.type==sender.format);
								break;
							case 'NUMBER':
							case 'NUMBER_DIGIT':
								res=((isFilter)?['NUMBER','RECORD_NUMBER']:['NUMBER']).includes(receiver.type);
								break;
						}
					}
					break;
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
					res=['CHECK_BOX','MULTI_SELECT'].includes(receiver.type);
					break;
				case 'CREATED_TIME':
				case 'DATETIME':
				case 'UPDATED_TIME':
					if (receiver.type=='CALC') res=((receiver.format=='DATETIME') && isFilter);
					else res=((isFilter)?['CREATED_TIME','DATETIME','UPDATED_TIME']:['DATETIME']).includes(receiver.type);
					break;
				case 'CREATOR':
				case 'MODIFIER':
				case 'STATUS_ASSIGNEE':
				case 'USER_SELECT':
					res=((isFilter)?['CREATOR','MODIFIER','STATUS_ASSIGNEE','USER_SELECT']:['USER_SELECT']).includes(receiver.type);
					break;
				case 'DATE':
					if (receiver.type=='CALC') res=((receiver.format=='DATE') && isFilter);
					else res=(receiver.type==sender.type);
					break;
				case 'DROP_DOWN':
				case 'RADIO_BUTTON':
					res=['DROP_DOWN','LINK','RADIO_BUTTON'].includes(receiver.type);
					break;
				case 'FILE':
				case 'MULTI_LINE_TEXT':
				case 'RICH_TEXT':
					res=(isFilter)?false:(receiver.type==sender.type);
					break;
				case 'GROUP_SELECT':
				case 'LINK':
				case 'ORGANIZATION_SELECT':
				case 'STATUS':
				case 'TIME':
					res=(receiver.type==sender.type);
					break;
				case 'NUMBER':
				case 'RECORD_NUMBER':
					if (receiver.type=='CALC') res=((receiver.format=='NUMBER') && isFilter);
					else res=((isFilter)?['NUMBER','RECORD_NUMBER']:['NUMBER']).includes(receiver.type);
					break;
				case 'SINGLE_LINE_TEXT':
					res=(isFilter)?['DROP_DOWN','RADIO_BUTTON','LINK','MULTI_LINE_TEXT','RICH_TEXT'].includes(receiver.type):['LINK','MULTI_LINE_TEXT','RICH_TEXT'].includes(receiver.type);
					break;
			}
		return res;
	}
	/* create objectUrl */
	objectUrl(data,type){
		var blob=null;
		var url=window.URL || window.webkitURL;
		if (typeof data==='string')
		{
			var datas=atob(data);
			var buffer=new Uint8Array(datas.length);
			datas.length.each((index) => buffer[index]=datas.charCodeAt(index));
			blob=new Blob([buffer.buffer],{type:type});
		}
		else blob=data;
		return url.createObjectURL(blob);
	}
};
window.KintoneBoosterTable=class{
	/* constructor */
	constructor(){}
	/* activate */
	activate(table,app){
		/* setup spread */
		return table.spread((row,index) => {
			((container) => {
				/* event */
				row.elm('.kb-table-row-add').on('click',(e) => {
					table.insertRow(row);
					kb.event.call('kb.row.add.'+table.attr('field-id'),{
						container:table,
						record:kb.record.get(container,app,true).record,
						rowindex:parseInt(row.attr('row-idx'))+1
					})
					.then((param) => {
						if (!param.error)
						{
							kb.event.call('kb.action.call',{
								record:param.record,
								mobile:((location.href.match(/\/m\//g))?true:false),
								pattern:'change',
								workplace:(container.closest('.kb-view'))?'view':'record'
							})
							.then((param) => {
								kb.event.call('kb.style.call',{
									record:param.record,
									mobile:param.mobile,
									pattern:(('$id' in param.record)?((param.record['$id'].value)?'edit':'create'):'create'),
									workplace:param.workplace
								})
								.then((param) => {
									kb.record.set(container,app,param.record);
									((event) => {
										container.attr('unsaved','unsaved').dispatchEvent(event);
									})(new Event('change'));
								})
								.catch(() => {});
							});
						}
						else table.delRow(row);
					});
				});
				row.elm('.kb-table-row-copy').on('click',(e) => {
					table.insertRow(row);
					kb.event.call('kb.row.copy.'+table.attr('field-id'),{
						container:table,
						record:((record,index) => {
							record[table.attr('field-id')].value[index+1]=kb.extend({},record[table.attr('field-id')].value[index]);
							return record;
						})(kb.record.get(container,app,true).record,parseInt(row.attr('row-idx'))),
						rowindex:parseInt(row.attr('row-idx'))+1
					})
					.then((param) => {
						if (!param.error)
						{
							kb.event.call('kb.action.call',{
								record:param.record,
								mobile:((location.href.match(/\/m\//g))?true:false),
								pattern:'change',
								workplace:(container.closest('.kb-view'))?'view':'record'
							})
							.then((param) => {
								kb.event.call('kb.style.call',{
									record:param.record,
									mobile:param.mobile,
									pattern:(('$id' in param.record)?((param.record['$id'].value)?'edit':'create'):'create'),
									workplace:param.workplace
								})
								.then((param) => {
									kb.record.set(container,app,param.record);
									((event) => {
										container.attr('unsaved','unsaved').dispatchEvent(event);
									})(new Event('change'));
								})
								.catch(() => {});
							});
						}
						else table.delRow(row);
					});
				});
				row.elm('.kb-table-row-del').on('click',(e) => {
					kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
						kb.event.call('kb.row.del.'+table.attr('field-id'),{
							container:table,
							record:kb.record.get(container,app,true).record,
							rowindex:parseInt(row.attr('row-idx'))
						})
						.then((param) => {
							if (!param.error)
							{
								table.delRow(row);
								kb.event.call('kb.action.call',{
									record:kb.record.get(container,app,true).record,
									mobile:((location.href.match(/\/m\//g))?true:false),
									pattern:'change',
									workplace:(container.closest('.kb-view'))?'view':'record'
								})
								.then((param) => {
									kb.event.call('kb.style.call',{
										record:param.record,
										mobile:param.mobile,
										pattern:(('$id' in param.record)?((param.record['$id'].value)?'edit':'create'):'create'),
										workplace:param.workplace
									})
									.then((param) => {
										kb.record.set(container,app,param.record);
										((event) => {
											container.attr('unsaved','unsaved').dispatchEvent(event);
										})(new Event('change'));
									})
									.catch(() => {});
								});
							}
						});
					});
				});
				/* activation */
				row.elms('.kb-field').each((element,index) => kb.field.activate(element,app));
				/* setup row index */
				table.tr.each((element,index) => element.attr('row-idx',index));
			})(table.closest('[form-id=form_'+app.id+']'));
		},(table,index) => {
			if (table.tr.length==0) table.addRow();
			else
			{
				/* setup row index */
				table.tr.each((element,index) => element.attr('row-idx',index));
			}
		},false);
	}
	/* create */
	create(table,isForm,isView,isStacked){
		return ((res) => {
			if (!isView && !isStacked) res.append(kb.create('thead').append(kb.create('tr')));
			res.append(kb.create('tbody').append(kb.create('tr').addClass('kb-scope').attr('row-idx','')));
			for (var key in table.fields)
				((fieldInfo) => {
					if (!isView && !isStacked)
						res.elm('thead tr').append(kb.create('th').append(kb.create('span').html(fieldInfo.label)));
					res.elm('tbody tr').append(kb.create('td').append(kb.field.create(((fieldInfo) => {
						if (!isStacked) fieldInfo.noLabel=true;
						return fieldInfo;
					})(kb.extend({},fieldInfo)))));
				})(table.fields[key]);
			if (!isView && !isStacked) res.elm('thead tr').append(kb.create('th').addClass('kb-table-button'+((isForm)?' kb-table-button-extension':'')));
			res.elm('tbody tr').append(
				kb.create('td').addClass('kb-table-button'+((isForm)?' kb-table-button-extension':''))
				.append(kb.create('button').addClass('kb-icon kb-icon-add kb-table-row-add'))
				.append(kb.create('button').addClass('kb-icon kb-icon-copy kb-table-row-copy').css({display:((isForm)?'inline-block':'none')}))
				.append(kb.create('button').addClass('kb-icon kb-icon-del kb-table-row-del'))
			);
			/* setup to readonly field */
			for (var key in table.fields)
				((fieldInfo) => {
					if (fieldInfo.lookup)
					{
						fieldInfo.lookup.fieldMappings.each((mapping,index) => {
							if (mapping.field in table.fields)
								if (res.elm('[field-id="'+CSS.escape(mapping.field)+'"]')) res.elm('[field-id="'+CSS.escape(mapping.field)+'"]').addClass('kb-readonly');
						});
					}
				})(table.fields[key]);
			return res.attr('field-id',table.code);
		})(kb.create('table').addClass('kb-table'));
	}
};
window.KintoneBoosterView=class{
	/* constructor */
	constructor(){
		this.records={
			delete:(app,ids,silent=false) => {
				return new Promise((resolve,reject) => {
					var del=(offset,callback) => {
						if (ids.length!=0)
						{
							kintone.api(
								kintone.api.url('/k/v1/records',true),
								'DELETE',
								{
									app:app,
									ids:ids.slice(offset,offset+100)
								}
							)
							.then((resp) => {
								if (!silent) kb.progressUpdate();
								offset+=100;
								if (ids.slice(offset,offset+100).length>0) del(offset,callback);
								else callback();
							})
							.catch((error) => reject(error));
						}
						else callback();
					};
					if (!silent) kb.progressStart(Math.ceil(ids.length/100));
					del(0,() => {
						if (!silent) kb.progressEnd();
						resolve();
					});
				});
			},
			get:(app,query,sort) => {
				return new Promise((resolve,reject) => {
					((sort) => {
						var load=(records,offset,callback) => {
							kintone.api(kintone.api.url('/k/v1/records',true),'GET',{app:app,query:query+' order by '+sort+' limit 500 offset '+offset.toString()})
							.then((resp) => {
								Array.prototype.push.apply(records,resp.records);
								offset+=500;
								if (resp.records.length==500) load(records,offset,callback);
								else callback(records);
							})
							.catch((error) => reject(error));
						}
						kintone.api(kintone.api.url('/k/v1/records',true),'GET',{app:app,query:query,totalCount:true})
						.then((resp) => {
							if (resp.totalCount<10000) load([],0,(records) => resolve(records));
							else
							{
								kintone.api(kintone.api.url('/k/v1/records/cursor',true),'POST',{app:app,query:query+' order by '+sort,size:500})
								.then((resp) => {
									((cursorId) => {
										var fetch=(records,callback) => {
											kintone.api(kintone.api.url('/k/v1/records/cursor',true),'GET',{id:cursorId})
											.then((resp) => {
												Array.prototype.push.apply(records,resp.records);
												if (resp.next) fetch(records,callback);
												else callback(records);
											})
											.catch((error) => reject(error));
										};
										fetch([],(records) => resolve(records));
									})(resp.id);
								})
								.catch((error) => reject(error));
							}
						})
						.catch((error) => reject(error));
					})(sort || '$id asc');
				});
			},
			set:(app,records,silent=false,transform=false) => {
				return new Promise((resolve,reject) => {
					var post=(offset,callback) => {
						if (records.post.length!=0)
						{
							kintone.api(
								kintone.api.url('/k/v1/records',true),
								'POST',
								{
									app:app,
									records:records.post.slice(offset,offset+100)
								}
							)
							.then((resp) => {
								if (!silent) kb.progressUpdate();
								offset+=100;
								if (records.post.slice(offset,offset+100).length>0) post(offset,callback);
								else callback();
							})
							.catch((error) => reject(error));
						}
						else callback();
					};
					var put=(offset,callback) => {
						if (records.put.length!=0)
						{
							kintone.api(
								kintone.api.url('/k/v1/records',true),
								'PUT',
								{
									app:app,
									records:((records) => {
										if (transform)
											records=records.map((item) => this.records.transform(item.record));
										return records;
									})(records.put.slice(offset,offset+100))
								}
							)
							.then((resp) => {
								if (!silent) kb.progressUpdate();
								offset+=100;
								if (records.put.slice(offset,offset+100).length>0) put(offset,callback);
								else callback();
							})
							.catch((error) => reject(error));
						}
						else callback();
					};
					if (!('post' in records)) records.post=[];
					if (!('put' in records)) records.put=[];
					if (!silent) kb.progressStart(Math.ceil(records.post.length/100)+Math.ceil(records.put.length/100));
					post(0,() => {
						put(0,() => {
							if (!silent) kb.progressEnd();
							resolve();
						});
					});
				});
			},
			transform:(record) => {
				return {
					id:record['$id'].value,
					record:(() => {
						var res={};
						for (var key in record)
							if (!kb.field.reserved.includes(record[key].type)) res[key]=record[key];
						return res;
					})()
				};
			}
		};
	}
	/* create */
	create(container,app,viewId,isMobile){
		var style={
			key:() => {
				return 'view_'+app.id+'_'+viewId+'_'+location.host.split('.').first();
			},
			set:(initialize) => {
				var key=style.key();
				var css='[view-id=view_'+app.id+'_'+viewId+'] .kb-guide{min-width:auto !important;}';
				kb.elm('[view-id=view_'+app.id+'_'+viewId+']').elms('.kb-view-head-resizer').each((element,index) => {
					var cell=element.closest('.kb-view-head-cell');
					if (!cell.hasClass('kb-unuse'))
						((id) => {
							var width=(() => {
								var res=150;
								if (!initialize)
								{
									if (kb.elm('.kb_spread_style_'+CSS.escape(key)))
										if (kb.elm('.kb_spread_style_'+CSS.escape(key)).text().match(new RegExp('\\\[column-id="'+CSS.escape(id)+'"\\\]','g'))) res=cell.outerWidth(false);
								}
								return res;
							})();
							css+='[view-id=view_'+app.id+'_'+viewId+'] [column-id="'+CSS.escape(id)+'"]{max-width:'+width+'px;width:'+width+'px;}';
							css+='[view-id=view_'+app.id+'_'+viewId+'] [field-id="'+CSS.escape(id)+'"]{width:'+width+'px;}';
						})(cell.attr('column-id'));
				});
				/* embed stylesheet */
				if (kb.elm('.kb_spread_style_'+CSS.escape(key)))
					kb.elm('head').removeChild(kb.elm('.kb_spread_style_'+CSS.escape(key)));
				kb.elm('head').append(
					kb.create('style')
					.addClass('kb_spread_style_'+key)
					.attr('media','screen')
					.attr('type','text/css')
					.text(css)
				);
				localStorage.setItem(key,css);
			}
		};
		return container.append(
			((res,app,view) => {
				var span=0;
				var less=((isViewer) => {
					var res='';
					if (!isMobile)
					{
						res=(isViewer)?2:0;
						res+=view.buttons.length;
						res='kb-view-button_shave'+res.toString();
					}
					return res;
				})(view.mode=='viewer');
				var resize=(e,id) =>{
					var pointer=(e.changedTouches)?Array.from(e.changedTouches).first():e;
					var keep={
						cell:e.currentTarget.closest('.kb-view-head-cell'),
						position:pointer.pageX,
						width:e.currentTarget.closest('.kb-view-head-cell').outerWidth(false)
					};
					var handler={
						move:(e) => {
							var adjust=false;
							var pointer=(e.changedTouches)?Array.from(e.changedTouches).first():e;
							var width=keep.width+pointer.pageX-keep.position;
							keep.cell.css({maxWidth:width.toString()+'px',width:width.toString()+'px'});
							res.elms('[field-id="'+CSS.escape(id)+'"]').each((element,index) => element.css({width:width.toString()+'px'}));
							res.elms('[field-id="'+CSS.escape(id)+'"]').each((element,index) => {
								if (width<element.outerWidth(false))
								{
									width=element.outerWidth(false);
									adjust=true;
								}
							});
							if (adjust) keep.cell.css({maxWidth:width.toString()+'px',width:width.toString()+'px'});
							e.stopPropagation();
							e.preventDefault();
						},
						end:(e) => {
							style.set();
							kb.elm('body').removeClass('kb-resizing');
							window.off('mousemove,touchmove',handler.move);
							window.off('mouseup,touchend',handler.end);
							e.stopPropagation();
							e.preventDefault();
						}
					};
					kb.elm('body').addClass('kb-resizing');
					window.on('mousemove,touchmove',handler.move);
					window.on('mouseup,touchend',handler.end);
					e.stopPropagation();
					e.preventDefault();
				};
				res
				.append(kb.create('thead').append(kb.create('tr').addClass('kb-view-head')))
				.append(kb.create('tbody').append(kb.create('tr').addClass('kb-view-row')));
				res.elm('thead tr').append(kb.create('th').addClass('kb-view-head-cell kb-view-button '+less+' kb-view-guide'));
				res.elm('tbody tr').append(
					kb.create('td').addClass('kb-view-button '+less+' kb-view-guide')
					.append(kb.create('a').addClass('kb-icon kb-icon-edit kb-view-row-edit'+((view.buttons.includes('detail'))?' kb-unuse':'')))
					.append(kb.create('button').addClass('kb-icon kb-icon-add kb-view-row-add'+((view.buttons.includes('add') || view.mode=='viewer')?' kb-unuse':'')))
					.append(kb.create('button').addClass('kb-icon kb-icon-copy kb-view-row-copy'+((view.buttons.includes('clone') || view.mode=='viewer')?' kb-unuse':'')))
					.append(kb.create('button').addClass('kb-icon kb-icon-del kb-view-row-del'+((view.buttons.includes('delete'))?' kb-unuse':'')))
				);
				((fields) => {
					fields.concat(Object.keys(app.fields).filter((item) => (!fields.includes(item)))).each((field,index) => {
						((fieldinfo,unuse) => {
							switch (fieldinfo.type)
							{
								case 'SUBTABLE':
									for (var key in fieldinfo.fields)
									{
										res.elm('thead tr').append(
											((cell,fieldinfo) => {
												if (!unuse) span++;
												return cell.addClass('kb-view-head-cell'+((unuse)?' kb-unuse':'')).attr('column-id',fieldinfo.code)
												.append(kb.create('span').addClass('kb-view-head-caption').html(fieldinfo.label))
												.append(kb.create('span').addClass('kb-view-head-resizer').on('mousedown,touchstart',(e) => resize(e,fieldinfo.code)));
											})(kb.create('th'),fieldinfo.fields[key])
										);
										fieldinfo.fields[key].noLabel=(!isMobile);
									}
									if (view.mode!='viewer')
									{
										if (!unuse) span++;
										res.elm('thead tr').append(kb.create('th').addClass('kb-view-head-cell kb-view-button kb-view-button-tables'+((unuse)?' kb-unuse':'')));
									}
									break;
								default:
									res.elm('thead tr').append(
										((cell) => {
											if (!unuse) span++;
											return cell.addClass('kb-view-head-cell'+((unuse)?' kb-unuse':'')).attr('column-id',fieldinfo.code)
											.append(kb.create('span').addClass('kb-view-head-caption').html(fieldinfo.label))
											.append(kb.create('span').addClass('kb-view-head-resizer').on('mousedown,touchstart',(e) => resize(e,fieldinfo.code)));
										})(kb.create('th'))
									);
									fieldinfo.noLabel=(!isMobile);
									break;
							}
						})(app.fields[field],(view.fields.length!=0)?!view.fields.includes(field):false);
					});
					res.elm('tbody tr').append(
						((cell) => {
							fields.concat(Object.keys(app.fields).filter((item) => (!fields.includes(item)))).each((field,index) => {
								((fieldinfo,unuse) => {
									switch (fieldinfo.type)
									{
										case 'SUBTABLE':
											cell.append(
												kb.create('div').addClass('kb-view-row-cell'+((unuse)?' kb-unuse':'')).append(
													kb.table.create(fieldinfo,true,true,isMobile)
												)
											);
											break;
										default:
											cell.append(kb.field.create(fieldinfo).addClass('kb-view-row-cell'+((unuse)?' kb-unuse':'')));
											break;
									}
								})(app.fields[field],(view.fields.length!=0)?!view.fields.includes(field):false);
							});
							return cell
							.append(kb.create('input').attr('type','hidden').attr('data-type','id'));
						})(kb.create('td').addClass('kb-scope').attr('form-id','form_'+app.id).attr('colspan',span.toString()))
					);
				})((view.fields.length!=0)?view.fields:Object.keys(app.fields));
				/* setup to readonly field */
				if (view.mode=='viewer')
				{
					res.elms('.kb-field').each((element,index) => element.addClass('kb-readonly'));
					res.elms('.kb-table-button').each((element,index) => element.addClass('kb-readonly'));
				}
				else
				{
					app.disables.each((fieldinfo,index) => {
						if (res.elm('[field-id="'+CSS.escape(fieldinfo.code)+'"]')) res.elm('[field-id="'+CSS.escape(fieldinfo.code)+'"]').addClass('kb-readonly');
					});
				}
				/* setup spread */
				return res.spread((row,index) => {
					/* event */
					row.elm('[form-id=form_'+app.id+']').on('change',(e) => {
						row.addClass('kb-unsaved');
					});
					row.elm('.kb-view-row-add').on('click',(e) => {
						((row) => {
							kb.event.call('kb.view.add',{
								container:row.elm('[form-id=form_'+app.id+']'),
								record:kb.record.get(row.elm('[form-id=form_'+app.id+']'),app,true).record,
								viewId:viewId
							})
							.then((param) => {
								if (!param.error)
								{
									kb.event.call('kb.action.call',{
										record:param.record,
										mobile:isMobile,
										pattern:'create',
										workplace:'view'
									})
									.then((param) => {
										kb.event.call('kb.style.call',{
											record:param.record,
											mobile:param.mobile,
											pattern:param.pattern,
											workplace:param.workplace
										})
										.then((param) => {
											kb.record.set(row.elm('[form-id=form_'+app.id+']').attr('unsaved','unsaved'),app,param.record).then(() => {
												kb.event.call('kb.view.add.complete',{container:row.elm('[form-id=form_'+app.id+']'),viewId:viewId});
											});
											((event) => {
												row.elm('[form-id=form_'+app.id+']').dispatchEvent(event);
											})(new Event('change'));
										})
										.catch(() => {});
									})
									.catch(() => {});
								}
								else res.delRow(row);
							});
						})(res.insertRow(row));
					});
					row.elm('.kb-view-row-del').on('click',(e) => {
						((recordid) => {
							if (recordid)
							{
								kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
									kb.event.call('kb.view.delete',{
										container:row.elm('[form-id=form_'+app.id+']'),
										record:kb.record.get(row.elm('[form-id=form_'+app.id+']'),app,true).record,
										viewId:viewId
									})
									.then((param) => {
										if (!param.error)
											kb.view.records.delete(app.id,[recordid])
											.then((resp) => res.delRow(row))
											.catch((error) => kb.alert(kb.error.parse(error)));
									});
								});
							}
							else res.delRow(row);
						})(row.elm('[data-type=id]').val());
					});
					row.elm('.kb-view-row-copy').on('click',(e) => {
						kb.confirm(kb.constants.common.message.confirm.copy[kb.operator.language],() => {
							((record,row) => {
								var files=Object.values(kb.field.parallelize(app.fields)).reduce((result,current) => {
									if (current.type=='FILE')
									{
										if (current.tableCode)
										{
											record[current.tableCode].value.each((row,index) => {
												Array.prototype.push.apply(result,row.value[current.code].value);
											});
										}
										else Array.prototype.push.apply(result,record[current.code].value);
									}
									return result;
								},[]);
								kb.file.clone(files).then(() => {
									kb.event.call('kb.view.copy',{
										container:row.elm('[form-id=form_'+app.id+']'),
										record:((res) => {
											res['$id'].value='';
											return res;
										})(record),
										viewId:viewId
									})
									.then((param) => {
										if (!param.error)
										{
											kb.event.call('kb.action.call',{
												record:param.record,
												mobile:isMobile,
												pattern:'reuse',
												workplace:'view'
											})
											.then((param) => {
												kb.event.call('kb.style.call',{
													record:param.record,
													mobile:param.mobile,
													pattern:'create',
													workplace:param.workplace
												})
												.then((param) => {
													kb.record.set(row.elm('[form-id=form_'+app.id+']').attr('unsaved','unsaved'),app,param.record).then(() => {
														kb.event.call('kb.view.copy.complete',{container:row.elm('[form-id=form_'+app.id+']'),viewId:viewId});
													});
													((event) => {
														row.elm('[form-id=form_'+app.id+']').dispatchEvent(event);
													})(new Event('change'));
												})
												.catch(() => {});
											})
											.catch(() => {});
										}
										else res.delRow(row);
									});
								});
							})(kb.record.get(row.elm('[form-id=form_'+app.id+']'),app,true).record,res.insertRow(row));
						});
					});
					/* activation */
					row.elms('.kb-field').each((element,index) => {
						if (element.closest('.kb-scope').hasAttribute('form-id')) kb.field.activate(element,app);
					});
					row.elms('.kb-table').each((element,index) => {
						kb.table.activate(element,app).clearRows();
						element.addRow();
					});
				},(table,index) => {},false);
			})(kb.create('table').addClass('kb-view').attr('view-id','view_'+app.id+'_'+viewId),kb.extend({},app),kb.extend({},app).view)
		)
		.on('show',(e) => {
			var key=style.key();
			if (!isMobile)
				if (!kb.elm('.kb_spread_style_'+CSS.escape(key)))
				{
					if (localStorage.getItem(key))
					{
						kb.elm('head').append(
							kb.create('style')
							.addClass('kb_spread_style_'+key)
							.attr('media','screen')
							.attr('type','text/css')
							.text(localStorage.getItem(key))
						);
						style.set();
					}
					else
					{
						if (kb.elm('[view-id=view_'+app.id+'_'+viewId+']').elm('tbody').elms('tr').length!=0)
							style.set(true);
					}
				}
		});
	}
	/* load */
	load(app){
		return new Promise((resolve,reject) => {
			kintone.api(kintone.api.url('/k/v1/app/views',true),'GET',{app:app})
			.then((resp) => {
				((views) => {
					resolve({
						origin:views,
						calendar:views.filter((item) => item.type=='CALENDAR'),
						custom:views.filter((item) => item.type=='CUSTOM'),
						list:views.filter((item) => item.type=='LIST')
					});
				})(Object.values(resp.views).sort((a,b) => a.index-b.index));
			})
			.catch((error) => kb.alert(kb.error.parse(error)));
		});
	}
};
/* Added additional core functions */
if (!window.kb.record) window.kb.record=new KintoneBoosterRecord();
/* Added UI operation functions */
if (!window.kb.button) window.kb.button=new KintoneBoosterButton();
if (!window.kb.field) window.kb.field=new KintoneBoosterField();
if (!window.kb.table) window.kb.table=new KintoneBoosterTable();
if (!window.kb.view) window.kb.view=new KintoneBoosterView();
/*
Message definition by language
*/
kb.constants=kb.extend({
	common:{
		caption:{
			button:{
				cancel:{
					en:'Cancel',
					ja:'キャンセル',
					zh:'取消'
				},
				submit:{
					en:'Submit',
					ja:'保存',
					zh:'保存'
				}
			},
			sort:{
				asc:{
					en:'asc',
					ja:'昇順',
					zh:'升序'
				},
				desc:{
					en:'desc',
					ja:'降順',
					zh:'降序'
				}
			}
		},
		message:{
			confirm:{
				changed:{
					en:'Changes have not been saved.<br>Do you want to leave the page?',
					ja:'変更が保存されていません。<br>このままページを移動しますか？',
					zh:'更改尚未保存。<br>您是否要离开此页面？'
				},
				cancel:{
					en:'The edits you made will be lost. Are you sure?',
					ja:'編集した内容が失われますが、よろしいですか？',
					zh:'您编辑的内容将会丢失，确定吗？'
				},
				copy:{
					en:'Are you sure on copy?',
					ja:'コピーしてもよろしいですか？',
					zh:'我可以复制吗？'
				},
				delete:{
					en:'Are you sure on delete?',
					ja:'削除してもよろしいですか？',
					zh:'我可以删除吗？'
				},
				save:{
					en:'Are you sure on copy?',
					ja:'保存してもよろしいですか？',
					zh:'我可以保存吗？'
				},
				submit:{
					en:'Are you sure on submit?',
					ja:'送信してもよろしいですか？',
					zh:'我可以发送吗？'
				}
			},
			invalid:{
				record:{
					en:'There is an error in the input data.',
					ja:'入力内容に誤りがあります。',
					zh:'输入内容有误。'
				},
				submit:{
					en:'No data to submit was found.',
					ja:'編集中のデータがありません。',
					zh:'正在编辑的数据不存在。'
				}
			}
		}
	},
	picker:{
		caption:{
			name:{
				en:'Name',
				ja:'表示名',
				zh:'显示名称'
			},
			recordnumber:{
				en:'Record number',
				ja:'レコード番号',
				zh:'记录号'
			}
		}
	}
},kb.constants);
