/*
* FileName "ui.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
window.KintoneBoosterFilter=class extends KintoneBoosterDialog{
	/* constructor */
	constructor(){
		super(999996,false,false);
		/* setup properties */
		this.handler=null;
		this.table=null;
		this.result={};
		this.status={};
		/* query */
		this.query={
			create:(lhs,operator,rhs) => {
				var res='';
				switch (rhs.type)
				{
					case 'CHECK_BOX':
					case 'MULTI_SELECT':
						res=(rhs.value)?'('+rhs.value.reduce((result,current) => {
							if (current) result.push('"'+current+'"');
							return result;
						},[]).join(',')+')':'()';
						break;
					case 'CREATOR':
					case 'MODIFIER':
						res=(rhs.value)?'('+rhs.value.code+')':'()';
						break;
					case 'DROP_DOWN':
					case 'RADIO_BUTTON':
					case 'STATUS':
						res='("'+((rhs.value)?rhs.value:'')+'")';
						break;
					case 'GROUP_SELECT':
					case 'ORGANIZATION_SELECT':
					case 'STATUS_ASSIGNEE':
					case 'USER_SELECT':
						res=(rhs.value)?'('+rhs.value.reduce((result,current) => {
							if (current.code) result.push('"'+current.code+'"');
							return result;
						},[]).join(',')+')':'()';
						break;
					case 'NUMBER':
					case 'RECORD_NUMBER':
						if (operator.match(/in/)) res='('+((kb.isNumeric(rhs.value))?rhs.value:'')+')';
						else res=((kb.isNumeric(rhs.value))?rhs.value:'null');
						break;
					default:
						if (operator.match(/in/)) res='("'+((rhs.value)?rhs.value:'')+'")';
						else res='"'+((rhs.value)?rhs.value:'')+'"';
						break;
				}
				return lhs.code+' '+operator+' '+res;
			},
			operator:(fieldInfo) => {
				var res=[];
				if (fieldInfo)
					switch (fieldInfo.type)
					{
						case 'CALC':
						case 'CREATED_TIME':
						case 'DATE':
						case 'DATETIME':
						case 'NUMBER':
						case 'RECORD_NUMBER':
						case 'TIME':
						case 'UPDATED_TIME':
							if (fieldInfo.tableCode)
							{
								res.push({code:'in',label:kb.constants.filter.operator.equal[kb.operator.language]});
								res.push({code:'not in',label:kb.constants.filter.operator.notequal[kb.operator.language]});
							}
							else
							{
								res.push({code:'=',label:kb.constants.filter.operator.equal[kb.operator.language]});
								res.push({code:'!=',label:kb.constants.filter.operator.notequal[kb.operator.language]});
							}
							res.push({code:'<=',label:kb.constants.filter.operator.less.equal[kb.operator.language]});
							res.push({code:'<',label:kb.constants.filter.operator.less[kb.operator.language]});
							res.push({code:'>=',label:kb.constants.filter.operator.greater.equal[kb.operator.language]});
							res.push({code:'>',label:kb.constants.filter.operator.greater[kb.operator.language]});
							break;
						case 'CHECK_BOX':
						case 'CREATOR':
						case 'DROP_DOWN':
						case 'GROUP_SELECT':
						case 'MODIFIER':
						case 'MULTI_SELECT':
						case 'ORGANIZATION_SELECT':
						case 'RADIO_BUTTON':
						case 'STATUS':
						case 'STATUS_ASSIGNEE':
						case 'USER_SELECT':
							res.push({code:'in',label:kb.constants.filter.operator.in[kb.operator.language]});
							res.push({code:'not in',label:kb.constants.filter.operator.notin[kb.operator.language]});
							break;
						case 'FILE':
						case 'MULTI_LINE_TEXT':
						case 'RICH_TEXT':
							res.push({code:'like',label:kb.constants.filter.operator.like[kb.operator.language]});
							res.push({code:'not like',label:kb.constants.filter.operator.notlike[kb.operator.language]});
							break;
						case 'LINK':
						case 'SINGLE_LINE_TEXT':
							if (fieldInfo.tableCode)
							{
								res.push({code:'in',label:kb.constants.filter.operator.equal[kb.operator.language]});
								res.push({code:'not in',label:kb.constants.filter.operator.notequal[kb.operator.language]});
							}
							else
							{
								res.push({code:'=',label:kb.constants.filter.operator.equal[kb.operator.language]});
								res.push({code:'!=',label:kb.constants.filter.operator.notequal[kb.operator.language]});
							}
							res.push({code:'like',label:kb.constants.filter.operator.like[kb.operator.language]});
							res.push({code:'not like',label:kb.constants.filter.operator.notlike[kb.operator.language]});
							break;
					}
				return res;
			},
			parse:(query) => {
				var res=[];
				query.split(' and ').map((item) => item.match(/^([^!><= ]+|(?:(?!(?:not in|in|not like|like).)*))[ ]*([!><=]+|not in|in|not like|like)[ ]*(.*)$/)).each((query,index) => {
					if (query)
					{
						res.push({
							field:query[1].trim(),
							operator:query[2].trim(),
							value:query[3].trim()
						})
					}
				});
				return res;
			}
		};
		/* modify elements */
		this.container.css({
			height:'calc(100% - 1em)',
			width:'55em'
		});
		this.contents.addClass('kb-filterbuilder').css({
			padding:'0'
		});
	}
	/* auth */
	auth(user,organization,group){
		return new Promise((resolve,reject) => {
			var get=() => {
				return new Promise((resolve,reject) => {
					kintone.api(kintone.api.url('/v1/user/organizations',true),'GET',{code:kb.operator.code})
					.then((resp) => {
						if (resp.organizationTitles)
							kb.operator.organizations=resp.organizationTitles.map((item) => item.organization.code);
						kintone.api(kintone.api.url('/v1/user/groups',true),'GET',{code:kb.operator.code})
						.then((resp) => {
							if (resp.groups)
								kb.operator.groups=resp.groups.map((item) => item.code);
							resolve();
						})
						.catch((error) => reject(error));
					})
					.catch((error) => reject(error));
				});
			}
			var verify=() => {
				var res=true;
				if (user.length+organization.length+group.length!=0)
				{
					res=false;
					if (!res)
						if (user.length!=0)
							res=(user.includes(kb.operator.code));
					if (!res)
						if (organization.length!=0)
							res=kb.operator.organizations.some((item) => organization.map((item) => item.code).includes(item));
					if (!res)
						if (group.length!=0)
							res=kb.operator.groups.some((item) => group.map((item) => item.code).includes(item));
				}
				return res;
			}
			if (!('organizations' in kb.operator)) get().then(() => resolve(verify())).catch((error) => kb.alert(kb.error.parse(error)));
			else resolve(verify());
		});
	}
	/* build */
	build(app,query,callback){
		var fieldInfos=app.fields;
		var fields=(exclude) => {
			var res=[];
			res.push({
				code:'',
				label:''
			});
			for (var key in fieldInfos)
				((fieldInfo) => {
					switch (fieldInfo.type)
					{
						case 'COLOR':
						case 'CATEGORY':
						case 'CONDITION':
						case 'GROUP':
						case 'HR':
						case 'LABEL':
						case 'REFERENCE_TABLE':
						case 'SPACER':
							break;
						default:
							res.push({
								code:key,
								label:fieldInfos[key].label
							});
							break;
					}
				})(fieldInfos[key]);
			return res;
		};
		var setup=() => {
			/* get status */
			kintone.api(kintone.api.url('/k/v1/app/status',true),'GET',{app:app.id})
			.then((resp) => {
				this.status=resp;
				/* create table */
				this.table=kb.table.create({
					code:'queries',
					type:'SUBTABLE',
					label:'',
					noLabel:true,
					fields:{
						fields:{
							code:'fields',
							type:'DROP_DOWN',
							label:'',
							required:false,
							noLabel:true,
							options:[]
						},
						operators:{
							code:'operators',
							type:'DROP_DOWN',
							label:'',
							required:false,
							noLabel:true,
							options:[]
						},
						values:{
							code:'values',
							type:'SPACER',
							label:'',
							required:false,
							noLabel:true,
							contents:''
						}
					}
				}).spread((row,index) => {
					/* event */
					row.elm('.kb-table-row-add').on('click',(e) => {
						this.table.insertRow(row);
					});
					row.elm('.kb-table-row-del').on('click',(e) => {
						kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
							this.table.delRow(row);
						});
					});
					/* modify elements */
					((row) => {
						((cells) => {
							cells.fields.empty().assignOption(fields(),'label','code').on('change',(e) => e.currentTarget.rebuild()).rebuild=() => {
								return new Promise((resolve,reject) => {
									cells.operators.empty();
									cells.values.empty();
									if (cells.fields.val())
									{
										((fieldInfo) => {
											cells.operators.assignOption(kb.filter.query.operator(fieldInfo),'label','code');
											((field) => {
												cells.values.value={
													get:(operator) => {
														var res='';
														switch (fieldInfo.type)
														{
															case 'CHECK_BOX':
															case 'DROP_DOWN':
															case 'MULTI_SELECT':
															case 'RADIO_BUTTON':
															case 'STATUS':
																res=[];
																field.elms('input').each((element,index) => {
																	if (element.checked) res.push('"'+element.val()+'"');
																});
																res='('+res.join(',')+')';
																break;
															case 'CREATED_TIME':
															case 'DATE':
															case 'DATETIME':
															case 'UPDATED_TIME':
																((elements) => {
																	switch (elements.pattern.val())
																	{
																		case 'today':
																			res='TODAY()';
																			break;
																		case 'manually':
																			switch (fieldInfo.type)
																			{
																				case 'DATE':
																					res='"'+elements.date.val()+'"';
																					break;
																				case 'CREATED_TIME':
																				case 'DATETIME':
																				case 'UPDATED_TIME':
																					if (elements.date.val())
																					{
																						if (!elements.hour.val()) elements.hour.val('00');
																						if (!elements.minute.val()) elements.minute.val('00');
																					}
																					if (elements.date.val() && elements.hour.val() && elements.minute.val())
																						res='"'+(elements.date.val()+' '+elements.hour.val()+':'+elements.minute.val()+':00').parseDateTime().format('ISO')+'"';
																					break;
																			}
																			break;
																		default:
																			res=elements.pattern.val().toUpperCase().replace(/ /g,'_')+'("'+elements.interval.val()+'","'+elements.unit.val()+'")';
																			break;
																	}
																	if (operator.match(/in/)) res='('+res+')';
																})({
																	pattern:field.elm('[field-id=pattern]').elm('select'),
																	date:field.elm('[field-id=value]').elm('input'),
																	hour:(field.elm('[field-id=value]').elm('.kb-hour'))?field.elm('[field-id=value]').elm('.kb-hour').elm('select'):null,
																	minute:(field.elm('[field-id=value]').elm('.kb-minute'))?field.elm('[field-id=value]').elm('.kb-minute').elm('select'):null,
																	interval:field.elm('[field-id=interval]').elm('input'),
																	unit:field.elm('[field-id=unit]').elm('select')
																});
																break;
															case 'CREATOR':
															case 'GROUP_SELECT':
															case 'MODIFIER':
															case 'ORGANIZATION_SELECT':
															case 'STATUS_ASSIGNEE':
															case 'USER_SELECT':
																res='('+JSON.parse(field.elm('input').val()).map((item) => '"'+item.code+'"').join(',').replace(/["']{1}LOGINUSER\(\)["']{1}/g,'LOGINUSER()')+')';
																break;
															case 'NUMBER':
															case 'RECORD_NUMBER':
																res=field.elm('input').val();
																if (operator.match(/in/)) res='('+res+')';
																break;
															case 'TIME':
																res='""';
																if (field.elm('.kb-hour').elm('select').val())
																	if (!field.elm('.kb-minute').elm('select').val()) field.elm('.kb-minute').elm('select').val('00');
																if (field.elm('.kb-minute').elm('select').val())
																	if (!field.elm('.kb-hour').elm('select').val()) field.elm('.kb-hour').elm('select').val('00');
																if (field.elm('.kb-hour').elm('select').val() && field.elm('.kb-minute').elm('select').val())
																	res='"'+field.elm('.kb-hour').elm('select').val()+':'+field.elm('.kb-minute').elm('select').val()+'"';
																if (operator.match(/in/)) res='('+res+')';
																break;
															default:
																res='"'+field.elm('input').val()+'"';
																if (operator.match(/in/)) res='('+res+')';
																break;
														}
														return res;
													},
													set:(value) => {
														switch (fieldInfo.type)
														{
															case 'CHECK_BOX':
															case 'DROP_DOWN':
															case 'MULTI_SELECT':
															case 'RADIO_BUTTON':
															case 'STATUS':
																var values=value.split(',').map((item) => item.trim()).reduce((result,current) => {
																	if (current) result.push(current.replace(/(^["']{1}|["']{1}$)/g,''));
																	return result;
																},[]);
																field.elms('input').each((element,index) => element.checked=values.includes(element.val()));
																break;
															case 'CREATED_TIME':
															case 'DATE':
															case 'DATETIME':
															case 'UPDATED_TIME':
																((elements) => {
																	if (value.toLowerCase().match(/^today/g)) elements.pattern.val('today').dispatchEvent(new Event('change'));
																	else
																	{
																		if (value.toLowerCase().match(/^from_/g))
																		{
																			elements.pattern.val(value.toLowerCase().replace(/\(.*$/g,'').replace(/_/g,' ')).dispatchEvent(new Event('change'));
																			elements.interval.val(value.toLowerCase().match(/^[^"']+["']{1}([0-9-]*)["']{1}/)[1]);
																			elements.unit.val(value.toLowerCase().match(/^[^"']+["']{1}([0-9-]*)["']{1}[ ]*,[ ]*["']{1}([^"']*)["']{1}/)[2]);
																		}
																		else
																		{
																			elements.pattern.val('manually').dispatchEvent(new Event('change'));
																			switch (fieldInfo.type)
																			{
																				case 'DATE':
																					elements.date.val(value.replace(/(^["']{1}|["']{1}$)/g,''));
																					break;
																				case 'CREATED_TIME':
																				case 'DATETIME':
																				case 'UPDATED_TIME':
																					var date=value.replace(/(^["']{1}|["']{1}$)/g,'').parseDateTime();
																					elements.date.val(date.format('Y-m-d'));
																					elements.hour.val(date.format('H'));
																					elements.minute.val(date.format('i'));
																					break;
																			}
																		}
																	}
																})({
																	pattern:field.elm('[field-id=pattern]').elm('select'),
																	date:field.elm('[field-id=value]').elm('input'),
																	hour:(field.elm('[field-id=value]').elm('.kb-hour'))?field.elm('[field-id=value]').elm('.kb-hour').elm('select'):null,
																	minute:(field.elm('[field-id=value]').elm('.kb-minute'))?field.elm('[field-id=value]').elm('.kb-minute').elm('select'):null,
																	interval:field.elm('[field-id=interval]').elm('input'),
																	unit:field.elm('[field-id=unit]').elm('select')
																});
																break;
															case 'CREATOR':
															case 'MODIFIER':
															case 'STATUS_ASSIGNEE':
															case 'USER_SELECT':
																var values=value.split(',').map((item) => item.trim()).reduce((result,current) => {
																	if (current)
																		((code) => {
																			((user) => {
																				if (user.length!=0) result.push(((user) => {
																					return {code:user.code.value,name:user.name.value};
																				})(user.first()));
																			})(([{code:{value:'LOGINUSER()'},name:{value:'Login user'}}].concat(kb.roleSet.user)).filter((item) => item.code.value==code));
																		})(current.replace(/(^["']{1}|["']{1}$)/g,''));
																	return result;
																},[]);
																field.elm('input').val(JSON.stringify(values));
																field.elm('.kb-guide').empty();
																values.each((value,index) => field.elm('.kb-field-value').guide(value));
																break;
															case 'GROUP_SELECT':
																var values=value.split(',').map((item) => item.trim()).reduce((result,current) => {
																	if (current)
																		((code) => {
																			((group) => {
																				if (group.length!=0) result.push(((group) => {
																					return {code:group.code.value,name:group.code.value};
																				})(group.first()));
																			})(kb.roleSet.group.filter((item) => item.code.value==code));
																		})(current.replace(/(^["']{1}|["']{1}$)/g,''));
																	return result;
																},[]);
																field.elm('input').val(JSON.stringify(values));
																field.elm('.kb-guide').empty();
																values.each((value,index) => field.elm('.kb-field-value').guide(value));
																break;
															case 'ORGANIZATION_SELECT':
																var values=value.split(',').map((item) => item.trim()).reduce((result,current) => {
																	if (current)
																		((code) => {
																			((organization) => {
																				if (organization.length!=0) result.push(((organization) => {
																					return {code:organization.code.value,name:organization.code.value};
																				})(organization.first()));
																			})(kb.roleSet.organization.filter((item) => item.code.value==code));
																		})(current.replace(/(^["']{1}|["']{1}$)/g,''));
																	return result;
																},[]);
																field.elm('input').val(JSON.stringify(values));
																field.elm('.kb-guide').empty();
																values.each((value,index) => field.elm('.kb-field-value').guide(value));
																break;
															case 'TIME':
																var values=value.replace(/(^["']{1}|["']{1}$)/g,'').split(':').filter((item) => item);
																if (values.length==2)
																{
																	field.elm('.kb-hour').elm('select').val(values[0]);
																	field.elm('.kb-minute').elm('select').val(values[1]);
																}
																else
																{
																	field.elm('.kb-hour').elm('select').val('');
																	field.elm('.kb-minute').elm('select').val('');
																}
																break;
															default:
																field.elm('input').val(value.replace(/(^["']{1}|["']{1}$)/g,''));
																break;
														}
													}
												}
												field.elms('input,select,textarea').each((element,index) => element.initialize());
												cells.values.append(field);
											})(((fieldInfo) => {
												var res=null;
												fieldInfo.code='value';
												fieldInfo.label='';
												fieldInfo.required=false;
												fieldInfo.noLabel=true;
												switch (fieldInfo.type)
												{
													case 'CALC':
													case 'RECORD_NUMBER':
														res=kb.field.create({
															code:'value',
															type:'NUMBER',
															label:'',
															required:false,
															noLabel:true,
															digit:false
														});
														break;
													case 'CREATOR':
													case 'MODIFIER':
													case 'STATUS_ASSIGNEE':
														((fieldInfo) => {
															fieldInfo.type='USER_SELECT';
															fieldInfo.loginuser=true;
															res=kb.field.activate(kb.field.create(fieldInfo),((app) => {
																app.fields[fieldInfo.code]=fieldInfo;
																return app;
															})({id:'filterbuilder',fields:{}}));
														})(kb.extend({},fieldInfo));
														break;
													case 'CREATED_TIME':
													case 'DATE':
													case 'DATETIME':
													case 'UPDATED_TIME':
														res=kb.create('div')
														.append(
															((field) => {
																field.addClass('kb-filterbuilder-date').elm('select').assignOption([
																	{code:'today',label:kb.constants.filter.pattern.today[kb.operator.language]},
																	{code:'from today',label:kb.constants.filter.pattern.from.today[kb.operator.language]},
																	{code:'from thisweek',label:kb.constants.filter.pattern.from.thisweek[kb.operator.language]},
																	{code:'from thismonth',label:kb.constants.filter.pattern.from.thismonth[kb.operator.language]},
																	{code:'from thisyear',label:kb.constants.filter.pattern.from.thisyear[kb.operator.language]},
																	{code:'manually',label:kb.constants.filter.pattern.manually[kb.operator.language]}
																],'label','code').on('change',(e) => {
																	switch (e.currentTarget.val())
																	{
																		case 'today':
																			res.elm('[field-id=value]').hide();
																			res.elm('[field-id=interval]').hide();
																			res.elm('[field-id=unit]').hide();
																			break;
																		case 'manually':
																			res.elm('[field-id=value]').css({display:'inline-block'});
																			res.elm('[field-id=interval]').hide();
																			res.elm('[field-id=unit]').hide();
																			break;
																		default:
																			res.elm('[field-id=value]').hide();
																			res.elm('[field-id=interval]').css({display:'inline-block'});
																			res.elm('[field-id=unit]').css({display:'inline-block'});
																			break;
																	}
																});
																return field;
															})(kb.field.create({
																code:'pattern',
																type:'DROP_DOWN',
																label:'',
																required:false,
																noLabel:true,
																options:[]
															}))
														)
														.append(
															((fieldInfo) => {
																if (['createdtime','modifiedtime'].includes(fieldInfo.type)) fieldInfo.type='datetime';
																return kb.field.activate(kb.field.create(fieldInfo),((app) => {
																	app.fields[fieldInfo.code]=fieldInfo;
																	return app;
																})({id:'filterbuilder',fields:{}})).addClass('kb-filterbuilder-date').hide()
															})(kb.extend({},fieldInfo))
														)
														.append(
															kb.field.create({
																code:'interval',
																type:'NUMBER',
																label:'',
																required:false,
																noLabel:true,
																digit:false
															}).addClass('kb-filterbuilder-date').css({width:'5em'}).hide()
														)
														.append(
															kb.field.create({
																code:'unit',
																type:'DROP_DOWN',
																label:'',
																required:false,
																noLabel:true,
																options:[
																	{index:0,label:'day'},
																	{index:1,label:'month'},
																	{index:2,label:'year'}
																]
															}).addClass('kb-filterbuilder-date').hide()
														);
														break;
													case 'DROP_DOWN':
													case 'RADIO_BUTTON':
														res=((field) => {
															return field.append(
																((field) => {
																	((options) => {
																		options.reduce((result,current) => {
																			result[current.index]=current;
																			return result;
																		},Array(options.length).fill('')).each((option,index) => {
																			field
																			.append(
																				kb.create('label')
																				.append(kb.create('input').attr('type','checkbox').val(option.label))
																				.append(kb.create('span').html((option.label)?option.label:'&#9251;'))
																			);
																		});
																	})(Object.values(fieldInfo.options));
																	return field;
																})(kb.create('div').addClass('kb-field-value'))
															);
														})(kb.create('div').addClass('kb-field').attr('field-id','value'));
														break;
													case 'FILE':
													case 'MULTI_LINE_TEXT':
													case 'RICH_TEXT':
														res=kb.field.create({
															code:'value',
															type:'SINGLE_LINE_TEXT',
															label:'',
															required:false,
															noLabel:true
														});
														break;
													case 'STATUS':
														res=((field) => {
															return field.append(
																((field) => {
																	Object.values(this.status.states).each((state,index) => {
																		field
																		.append(
																			kb.create('label')
																			.append(kb.create('input').attr('type','checkbox').attr('data-type',fieldInfo.type).val(state.name))
																			.append(kb.create('span').html((state.name)?state.name:'&#9251;'))
																		);
																	});
																	return field;
																})(kb.create('div').addClass('kb-field-value'))
															);
														})(kb.create('div').addClass('kb-field').attr('field-id','value'));
														break;
													default:
														((fieldInfo) => {
															switch (fieldInfo.type)
															{
																case 'NUMBER':
																	fieldInfo.unit='';
																	break;
																case 'USER_SELECT':
																	fieldInfo.loginuser=true;
																	break;
															}
															res=kb.field.activate(kb.field.create(fieldInfo),((app) => {
																app.fields[fieldInfo.code]=fieldInfo;
																return app;
															})({id:'filterbuilder',fields:{}}));
														})(kb.extend({},fieldInfo));
														break;
												}
												return res;
											})(kb.extend({},fieldInfo)));
										})(fieldInfos[cells.fields.val()]);
									}
									resolve({});
								});
							};
						})({
							fields:row.elm('[field-id=fields]').elm('select'),
							operators:row.elm('[field-id=operators]').elm('select'),
							values:row.elm('[field-id=values]').css({padding:'0'})
						});
					})(row.addClass('kb-scope').attr('form-id','form_filterbuilder'));
				},(table,index) => {
					if (table.tr.length==0) table.addRow();
				},false);
				this.contents.empty()
				.append(kb.create('span').addClass('kb-table-caption').html(kb.constants.filter.caption.filter[kb.operator.language]))
				.append(this.table);
				if (query)
				{
					((fields) => {
						kb.filter.query.parse(query).each((query,index) => {
							if (fields.some((item) => item.code==query.field))
								((row) => {
									row.elm('[field-id=fields]').elm('select').val(query.field).rebuild().then(() => {
										row.elm('[field-id=operators]').elm('select').val(query.operator);
										row.elm('[field-id=values]').value.set(query.value.replace(/^(\()(.+)(\))$/,'$2'));
									});
								})(this.table.addRow());
						});
					})(fields());
					if (this.table.tr.length==0) this.table.addRow();
				}
				else this.table.addRow();
				/* setup handler */
				if (this.handler) this.ok.off('click',this.handler);
				this.handler=(e) => {
					var queries=[];
					this.table.tr.each((element,index) => {
						var fields=element.elm('[field-id=fields]').elm('select');
						var operators=element.elm('[field-id=operators]').elm('select');
						var values=element.elm('[field-id=values]');
						if (fields.val()) queries.push(fields.val()+' '+operators.val()+' '+values.value.get(operators.val()));
					});
					this.hide();
					callback(queries.join(' and '));
				};
				this.ok.on('click',this.handler);
				this.cancel.on('click',(e) => this.hide());
				/* show */
				super.show();
			})
			.catch((error) => kb.alert(kb.error.parse(error)));
		};
		if (kb.roleSet.user.length==0) kb.roleSet.load().then(() => setup());
		else setup();
	}
	/* expand */
	expand(app,query,parallelize=true){
		var queries=this.query.parse(query);
		var comparison=(fieldInfo,query) => {
			var TODAY=(type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-d'));
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_TODAY=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-d')).calc(interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_THISWEEK=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-d')).calc('-'+new Date().getDay().toString()+' day,'+interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_THISMONTH=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-01')).calc(interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_THISYEAR=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-01-01')).calc(interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			return ((value) => {
				var res='';
				switch (fieldInfo.type)
				{
					case 'CREATED_TIME':
					case 'DATETIME':
					case 'UPDATED_TIME':
						if (value.toLowerCase().match(/^from_/g))
						{
							switch (operator)
							{
								case '>':
									((value) => {
										res=query.field+' >= '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime","1")'));
									break;
								case '>=':
									((value) => {
										res=query.field+' >= '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime")'));
									break;
								case '<':
									((value) => {
										res=query.field+' < '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime")'));
									break;
								case '<=':
									((value) => {
										res=query.field+' < '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime","1")'));
									break;
								case '!=':
								case 'not in':
									((value) => {
										res+=query.field+' < '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime")'));
									res+=' or ';
									((value) => {
										res+=query.field+' >= '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime","1")'));
									res='('+res+')';
									break;
								case '=':
								case 'in':
									((value) => {
										res+=query.field+' >= '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime")'));
									res+=' and ';
									((value) => {
										res+=query.field+' < '+((query.operator.match(/in/))?'('+value+')':value);
									})(eval(value.replace(/\)$/g,'')+',"datetime","1")'));
									res='('+res+')';
									break;
							}
						}
						else res=query.field+' '+query.operator+' '+((query.operator.match(/in/))?'('+value+')':value);
						break;
					case 'DATE':
						((value) => {
							res=query.field+' '+query.operator+' '+((query.operator.match(/in/))?'('+value+')':value);
						})((value.toLowerCase().match(/^from_/g))?eval(value):value);
						break;
				}
				return res;
			})(query.value.replace(/^(\()(.+)(\))$/,'$2'));
		};
		((fieldInfos) => {
			queries.reduce((result,current) => {
				if (current.field in fieldInfos)
					((fieldInfo) => {
						switch (fieldInfo.type)
						{
							case 'CREATED_TIME':
							case 'DATE':
							case 'DATETIME':
							case 'UPDATED_TIME':
								result.push(comparison(fieldInfo,current));
								break;
							default:
								result.push(current.field+' '+current.operator+' '+current.value);
								break;
						}
					})(fieldInfos[current.field]);
				return result;
			},[]);
		})((parallelize)?kb.field.parallelize(app.fields):kb.extend({},app.fields));
		return queries.join(' and ');
	}
	/* scanning */
	scan(app,record,query,parallelize=true){
		var matches=0;
		var queries=this.query.parse(query);
		var comparison=(fieldInfo,lhs,operator,rhs) => {
			var formula='';
			var CONTAIN_CODE=() => {
				var res=false;
				((values) => {
					switch (operator)
					{
						case 'not in':
							if (values.length>0) res=(!values.some((item) => rhs.includes(item.code)));
							else res=(rhs.length!=0);
							break;
						case 'in':
							if (values.length>0) res=(values.some((item) => rhs.includes(item.code)));
							else res=(rhs.length==0);
							break;
					}
				})(Array.isArray(lhs.value)?lhs.value:[lhs.value])
				return res;
			};
			var CONTAIN_FILE=() => {
				var res=false;
				switch (operator)
				{
					case 'not like':
						if (lhs.value.length>0) res=(!lhs.value.some((item) => (rhs)?item.name.match(new RegExp(rhs,'g')):!item.name));
						else res=rhs;
						break;
					case 'like':
						if (lhs.value.length>0) res=(lhs.value.some((item) => (rhs)?item.name.match(new RegExp(rhs,'g')):!item.name));
						else res=!rhs;
						break;
				}
				return res;
			};
			var CONTAIN_MULTIPLE=() => {
				var res=false;
				switch (operator)
				{
					case 'not in':
						if (lhs.value.length>0) res=(!lhs.value.some((item) => rhs.includes(item)));
						else res=(rhs.length!=0);
						break;
					case 'in':
						if (lhs.value.length>0) res=(lhs.value.some((item) => rhs.includes(item)));
						else res=(rhs.length==0);
						break;
				}
				return res;
			};
			var TODAY=(type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-d'));
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_TODAY=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-d')).calc(interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_THISWEEK=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-d')).calc('-'+new Date().getDay().toString()+' day,'+interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_THISMONTH=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-m-01')).calc(interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			var FROM_THISYEAR=(interval,unit,type='date',adddays='0') => {
				var date=new Date(new Date().format('Y-01-01')).calc(interval+' '+unit);
				return (type!='date')?date.calc(adddays+' day,'+date.getTimezoneOffset().toString()+' minute').format('ISO'):date.format('Y-m-d');
			};
			switch (fieldInfo.type)
			{
				case 'CHECK_BOX':
				case 'MULTI_SELECT':
				case 'STATUS':
					rhs=rhs.split(',').map((item) => item.trim()).reduce((result,current) => {
						if (current) result.push(current.replace(/(^["']{1}|["']{1}$)/g,''));
						return result;
					},[]);
					formula='CONTAIN_MULTIPLE()';
					break;
				case 'CREATOR':
				case 'GROUP_SELECT':
				case 'MODIFIER':
				case 'ORGANIZATION_SELECT':
				case 'STATUS_ASSIGNEE':
				case 'USER_SELECT':
					rhs=rhs.split(',').map((item) => item.trim().replace(/LOGINUSER\(\)/g,kb.operator.code)).reduce((result,current) => {
						if (current) result.push(current.replace(/(^["']{1}|["']{1}$)/g,''));
						return result;
					},[]);
					formula='CONTAIN_CODE()';
					break;
				case 'CREATED_TIME':
				case 'DATETIME':
				case 'UPDATED_TIME':
					switch (operator)
					{
						case 'not in':
							operator='!=';
							break;
						case 'in':
							operator='=';
							break;
					}
					if (rhs.toLowerCase().match(/^today/g))
					{
						switch (operator)
						{
							case '>':
								formula='lhs.value >= FROM_TODAY("1","day","datetime")';
								break;
							case '>=':
								formula='lhs.value >= TODAY("datetime")';
								break;
							case '<':
								formula='lhs.value < TODAY("datetime")';
								break;
							case '<=':
								formula='lhs.value < FROM_TODAY("1","day","datetime")';
								break;
							case '!=':
								formula='(lhs.value < TODAY("datetime") || lhs.value >= FROM_TODAY("1","day","datetime"))';
								break;
							case '=':
								formula='(lhs.value >= TODAY("datetime") && lhs.value < FROM_TODAY("1","day","datetime"))';
								break;
						}
					}
					else
					{
						if (rhs.toLowerCase().match(/^from_/g))
						{
							rhs=rhs.replace(/\)$/g,'');
							switch (operator)
							{
								case '>':
									formula='lhs.value >= '+rhs+',"datetime","1")';
									break;
								case '>=':
									formula='lhs.value >= '+rhs+',"datetime")';
									break;
								case '<':
									formula='lhs.value < '+rhs+',"datetime")';
									break;
								case '<=':
									formula='lhs.value < '+rhs+',"datetime","1")';
									break;
								case '!=':
									formula='(lhs.value < '+rhs+',"datetime") || lhs.value >= '+rhs+',"datetime","1"))';
									break;
								case '=':
									formula='(lhs.value >= '+rhs+',"datetime") && lhs.value < '+rhs+',"datetime","1"))';
									break;
							}
						}
						else formula='lhs.value '+((operator=='=')?'==':operator)+' '+rhs;
					}
					break;
				case 'DROP_DOWN':
				case 'RADIO_BUTTON':
					rhs=rhs.split(',').map((item) => item.trim()).reduce((result,current) => {
						if (current) result.push(current.replace(/(^["']{1}|["']{1}$)/g,''));
						return result;
					},[]);
					switch (operator)
					{
						case 'not in':
							formula='!rhs.includes(lhs.value)';
							break;
						case 'in':
							formula='rhs.includes(lhs.value)';
							break;
					}
					break;
				case 'FILE':
					rhs=rhs.replace(/(^["']{1}|["']{1}$)/g,'');
					formula='CONTAIN_FILE()';
					break;
				case 'MULTI_LINE_TEXT':
				case 'RICH_TEXT':
					switch (operator)
					{
						case 'not like':
							((pattern) => {
								formula=(pattern)?'!((lhs.value)?lhs.value:\'\').match(/(?:'+pattern+')/g)':'lhs.value';
							})(rhs.replace(/(^["']{1}|["']{1}$)/g,''));
							break;
						case 'like':
							((pattern) => {
								formula=(pattern)?'((lhs.value)?lhs.value:\'\').match(/(?:'+pattern+')/g)':'!lhs.value';
							})(rhs.replace(/(^["']{1}|["']{1}$)/g,''));
							break;
					}
					break;
				case 'NUMBER':
				case 'RECORD_NUMBER':
					switch (operator)
					{
						case 'not in':
							operator='!=';
							break;
						case 'in':
							operator='=';
							break;
					}
					formula=((rhs) => {
						return '(kb.isNumeric(lhs.value)?parseFloat(lhs.value):null) '+((operator=='=')?'==':operator)+' '+((rhs!='0')?rhs.replace(/^0/g,''):rhs);
					})((kb.isNumeric(rhs.replace(/(^["']{1}|["']{1}$)/g,'')))?rhs.replace(/(^["']{1}|["']{1}$)/g,''):'null');
					break;
				default:
					switch (operator)
					{
						case 'not in':
							operator='!=';
							break;
						case 'in':
							operator='=';
							break;
					}
					switch (operator)
					{
						case 'not like':
							((pattern) => {
								formula=(pattern)?'!((lhs.value)?lhs.value:\'\').match(/(?:'+pattern+')/g)':'lhs.value';
							})(rhs.replace(/(^["']{1}|["']{1}$)/g,''));
							break;
						case 'like':
							((pattern) => {
								formula=(pattern)?'((lhs.value)?lhs.value:\'\').match(/(?:'+pattern+')/g)':'!lhs.value';
							})(rhs.replace(/(^["']{1}|["']{1}$)/g,''));
							break;
						default:
							formula='((lhs.value)?lhs.value:\'\') '+((operator=='=')?'==':operator)+' '+rhs;
							break;
					}
					break;
			}
			return eval(formula);
		};
		this.result=(() => {
			var res={};
			for (var key in record) res[key]=record[key];
			return res;
		})();
		((fieldInfos) => {
			queries.each((query,index) => {
				if (query.field in fieldInfos)
					((fieldInfo) => {
						if (fieldInfo.tableCode)
						{
							this.result[fieldInfo.tableCode]={value:this.result[fieldInfo.tableCode].value.filter((item) => {
								return (fieldInfo.code in item.value)?(comparison(fieldInfo,item.value[fieldInfo.code],query.operator,query.value.replace(/^(\()(.+)(\))$/,'$2'))):false;
							})};
							if (this.result[fieldInfo.tableCode].value.length>0) matches++;
						}
						else
						{
							if (fieldInfo.code in this.result)
								if (comparison(fieldInfo,this.result[fieldInfo.code],query.operator,query.value.replace(/^(\()(.+)(\))$/,'$2'))) matches++;
						}
					})(fieldInfos[query.field]);
			});
		})((parallelize)?kb.field.parallelize(app.fields):kb.extend({},app.fields));
		return (queries.length==matches)?this.result:false;
	}
};
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
						res[key]={value:[]};
						break;
					case 'RADIO_BUTTON':
						((options) => {
							res[key]={value:(options.length!=0)?options.reduce((result,current) => {
								result[current.index]=current;
								return result;
							},Array(options.length).fill('')).first().label:''};
						})(Object.values(fieldInfo.options));
						break;
					case 'SUBTABLE':
						res[key]={value:[{value:this.create(fieldInfo,false)}]};
						break;
					default:
						if (!['CALC','CATEGORY','CREATED_TIME','CREATOR','MODIFIER','RECORD_NUMBER','REFERENCE_TABLE','STATUS','STATUS_ASSIGNEE','UPDATED_TIME'].includes(fieldInfo.type)) res[key]={value:''};
						break;
				}
			})(app.fields[key]);
		/* reserved field */
		if (isRecord) res['$id']={value:''};
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
							case 'CHECK_BOX':
							case 'MULTI_SELECT':
								res.record[fieldInfo.code]={
									value:(() => {
										var res=[];
										field.elms('input').each((element,index) => {
											if (element.checked && !element.parentNode.hasClass('kb-hidden')) res.push(element.val());
										});
										return res;
									})()
								};
								break;
							case 'DATETIME':
								res.record[fieldInfo.code]={
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
									value:field.elm('select').val()
								};
								break;
							case 'FILE':
							case 'GROUP_SELECT':
							case 'ORGANIZATION_SELECT':
							case 'USER_SELECT':
								res.record[fieldInfo.code]={
									value:((field.elm('input').val())?JSON.parse(field.elm('input').val()):[])
								};
								break;
							case 'NUMBER':
								res.record[fieldInfo.code]={
									value:((kb.isNumeric(field.elm('input').val()))?parseFloat(field.elm('input').val()):field.elm('input').val())
								};
								break;
							case 'RADIO_BUTTON':
								res.record[fieldInfo.code]={
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
									value:field.elm('textarea').val()
								};
								break;
							case 'TIME':
								res.record[fieldInfo.code]={
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
							case 'SUBTABLE':
								res.record[fieldInfo.code]={
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
							default:
								if (!['CALC','CATEGORY','CREATED_TIME','CREATOR','MODIFIER','RECORD_NUMBER','REFERENCE_TABLE','STATUS','STATUS_ASSIGNEE','UPDATED_TIME'].includes(fieldInfo.type))
									res.record[fieldInfo.code]={
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
									field.elm('.kb-guide').html(value.name);
									break;
								case 'CREATED_TIME':
								case 'UPDATED_TIME':
									if (value.value) field.elm('.kb-guide').html(new Date(value.value).format('Y-m-d H:i'));
									else field.elm('.kb-guide').html('');
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
									switch (fieldInfo.protocol)
									{
										case 'MAIL':
											field.elm('.kb-guide').empty().append(
												kb.create('a').attr('href','mailto:'+value.value).html(value.value)
											);
											break;
										case 'CALL':
											field.elm('.kb-guide').empty().append(
												kb.create('a').attr('href','tel:'+value.value).html(value.value)
											);
											break;
										case 'WEB':
											field.elm('.kb-guide').empty().append(
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
window.KintoneBoosterField=class{
	/* constructor */
	constructor(){
		this.cache={};
	}
	/* activate */
	activate(field,app){
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
						kb.event.call('kb.action.call',{
							record:param.record,
							workplace:(container.closest('.kb-view'))?'view':'record'
						})
						.then((param) => {
							kb.record.set(container,app,param.record);
							((event) => {
								container.attr('unsaved','unsaved').dispatchEvent(event);
							})(new Event('change'));
						});
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
									catch(error){
										kb.alert(kb.error.parse(error));
									}
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
								field.recordPicker=new KintoneBoosterRecordPicker(type,true,((fieldInfo.loginuser)?[{code:{value:'LOGINUSER()'},name:{value:'Login user'}}]:[]));
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
						this.get(fieldInfo.lookup.relatedApp.app).then((resp) => {
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
						case 'SINGLE_LINE_TEXT':
							if (fieldInfo.lookup)
							{
								field.addClass('kb-lookup')
								.append(kb.create('input').addClass('kb-lookup-search').attr('type','text').attr('data-type','text'))
								.append(kb.create('button').addClass('kb-icon kb-icon-lookup kb-search'))
								.append(kb.create('button').addClass('kb-icon kb-icon-del kb-clear'));
							}
							else field.addClass('kb-text').append(kb.create('input').attr('type','text').attr('data-type','text'));
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
										tables.push(current.code);
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
										result[current]=resp.properties[current]
										if (current in ids.table) result[current].id=ids.table[current];
										return result;
									},{}),
									changes:((exclude) => {
										var res=[]
										res=Object.values(fieldInfos).reduce((result,current) => {
											if (!exclude.includes(current.code)) result.push(current.code);
											return result;
										},[]);
										return res.concat(tables);
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
									disables:(() => {
										var res=[];
										for (var key in fieldInfos)
											((fieldInfo) => {
												if (fieldInfo.expression) res.push(fieldInfo.code);
												if (fieldInfo.lookup)
													((mappings) => {
														if (mappings.length!=0) res=res.concat(mappings);
													})(fieldInfo.lookup.fieldMappings.map((item) => item.field));
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
											})(fieldInfos[key])
										return res;
									})(),
									placed:(() => {
										var res={};
										sorted.each((sort,index) => {
											res[sort]=fieldInfos[sort];
										});
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
		if (value)
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
						res=(isfilter)?true:!receiver.expression;
						break;
			}
		}
		if (!res)
			switch (sender.type)
			{
				case 'CALC':
					if (receiver.type==sender.type) res=((receiver.format==sender.format) && isfilter);
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
								res=((isfilter)?['NUMBER','RECORD_NUMBER']:['NUMBER']).includes(receiver.type);
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
					if (receiver.type=='CALC') res=((receiver.format=='DATETIME') && isfilter);
					else res=((isfilter)?['CREATED_TIME','DATETIME','UPDATED_TIME']:['DATETIME']).includes(receiver.type);
					break;
				case 'CREATOR':
				case 'MODIFIER':
				case 'STATUS_ASSIGNEE':
				case 'USER_SELECT':
					res=((isfilter)?['CREATOR','MODIFIER','STATUS_ASSIGNEE','USER_SELECT']:['USER_SELECT']).includes(receiver.type);
					break;
				case 'DATE':
					if (receiver.type=='CALC') res=((receiver.format=='DATE') && isfilter);
					else res=(receiver.type==sender.type);
					break;
				case 'DROP_DOWN':
				case 'RADIO_BUTTON':
					res=['DROP_DOWN','LINK','RADIO_BUTTON'].includes(receiver.type);
					break;
				case 'GROUP_SELECT':
				case 'LINK':
				case 'MULTI_LINE_TEXT':
				case 'ORGANIZATION_SELECT':
				case 'RICH_TEXT':
				case 'STATUS':
				case 'TIME':
					res=(receiver.type==sender.type);
					break;
				case 'NUMBER':
				case 'RECORD_NUMBER':
					if (receiver.type=='CALC') res=((receiver.format=='NUMBER') && isfilter);
					else res=((isfilter)?['NUMBER','RECORD_NUMBER']:['NUMBER']).includes(receiver.type);
					break;
				case 'SINGLE_LINE_TEXT':
					res=(isfilter)?['DROP_DOWN','RADIO_BUTTON','LINK','MULTI_LINE_TEXT','NUMBER','RECORD_NUMBER','RICH_TEXT'].includes(receiver.type):['LINK','MULTI_LINE_TEXT','RICH_TEXT'].includes(receiver.type);
					break;
			}
		return res;
	}
	/* create objectUrl */
	objectUrl(data,type){
		var datas=atob(data);
		var buffer=new Uint8Array(datas.length);
		var url=window.URL || window.webkitURL;
		datas.length.each((index) => buffer[index]=datas.charCodeAt(index));
		return url.createObjectURL(new Blob([buffer.buffer],{type:type}));
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
								workplace:(container.closest('.kb-view'))?'view':'record'
							})
							.then((param) => {
								kb.record.set(container,app,param.record);
								((event) => {
									container.attr('unsaved','unsaved').dispatchEvent(event);
								})(new Event('change'));
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
								workplace:(container.closest('.kb-view'))?'view':'record'
							})
							.then((param) => {
								kb.record.set(container,app,param.record);
								((event) => {
									container.attr('unsaved','unsaved').dispatchEvent(event);
								})(new Event('change'));
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
									workplace:(container.closest('.kb-view'))?'view':'record'
								})
								.then((param) => {
									kb.record.set(container,app,param.record);
									((event) => {
										container.attr('unsaved','unsaved').dispatchEvent(event);
									})(new Event('change'));
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
	/* activate */
	create(table,isform,isview,isstacked){
		return ((res) => {
			if (!isview && !isstacked) res.append(kb.create('thead').append(kb.create('tr')));
			res.append(kb.create('tbody').append(kb.create('tr').addClass('kb-scope').attr('row-idx','')));
			for (var key in table.fields)
				((fieldInfo) => {
					if (!isview && !isstacked)
						res.elm('thead tr').append(kb.create('th').append(kb.create('span').html(fieldInfo.label)));
					res.elm('tbody tr').append(kb.create('td').append(kb.field.create(((fieldInfo) => {
						if (!isstacked) fieldInfo.noLabel=true;
						return fieldInfo;
					})(kb.extend({},fieldInfo)))));
				})(table.fields[key]);
			if (!isview && !isstacked) res.elm('thead tr').append(kb.create('th').addClass('kb-table-button'+((isform)?' kb-table-button-extension':'')));
			res.elm('tbody tr').append(
				kb.create('td').addClass('kb-table-button'+((isform)?' kb-table-button-extension':''))
				.append(kb.create('button').addClass('kb-icon kb-icon-add kb-table-row-add'))
				.append(kb.create('button').addClass('kb-icon kb-icon-copy kb-table-row-copy').css({display:((isform)?'inline-block':'none')}))
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
			set:(app,records) => {
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
								kb.progressUpdate();
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
									records:records.put.slice(offset,offset+100)
								}
							)
							.then((resp) => {
								kb.progressUpdate();
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
					kb.progressStart(Math.ceil(records.post.length/100)+Math.ceil(records.put.length/100));
					post(0,() => {
						put(0,() => {
							kb.progressEnd();
							resolve();
						});
					});
				});
			}
		};
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
if (!window.kb.filter) window.kb.filter=new KintoneBoosterFilter();
if (!window.kb.record) window.kb.record=new KintoneBoosterRecord();
/* Added UI operation functions */
if (!window.kb.field) window.kb.field=new KintoneBoosterField();
if (!window.kb.table) window.kb.table=new KintoneBoosterTable();
if (!window.kb.view) window.kb.view=new KintoneBoosterView();
/*
Message definition by language
*/
kb.constants=kb.extend({
	common:{
		caption:{
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
				}
			},
			invalid:{
				record:{
					en:'There is an error in the input data.',
					ja:'入力内容に誤りがあります。',
					zh:'输入内容有误。'
				}
			}
		}
	},
	filter:{
		caption:{
			filter:{
				en:'Filter',
				ja:'条件',
				zh:'条件'
			},
			sort:{
				en:'Sort by',
				ja:'並び順',
				zh:'排序'
			}
		},
		pattern:{
			from:{
				today:{
					en:'from today',
					ja:'今日から',
					zh:'从今天开始'
				},
				thisweek:{
					en:'from thisweek',
					ja:'今週から',
					zh:'从本周开始'
				},
				thismonth:{
					en:'from thismonth',
					ja:'今月から',
					zh:'从本月开始'
				},
				thisyear:{
					en:'from thisyear',
					ja:'今年から',
					zh:'从今年开始'
				}
			},
			manually:{
				en:'manually',
				ja:'日付を指定',
				zh:'指定日期'
			},
			today:{
				en:'today',
				ja:'今日',
				zh:'今天'
			}
		},
		operator:{
			equal:{
				en:'equal',
				ja:'等しい',
				zh:'相等'
			},
			notequal:{
				en:'not equal',
				ja:'等しくない',
				zh:'不相等'
			},
			greater:{
				en:'greater than',
				ja:'より後',
				zh:'之后',
				equal:{
					en:'greater than or equal',
					ja:'以降',
					zh:'以后'
				}
			},
			in:{
				en:'any of',
				ja:'いずれかを含む',
				zh:'包含任一'
			},
			notin:{
				en:'not any of',
				ja:'いずれも含まない',
				zh:'都不包含'
			},
			like:{
				en:'like',
				ja:'キーワードを含む',
				zh:'包含关键字'
			},
			notlike:{
				en:'not like',
				ja:'キーワードを含まない',
				zh:'不包含关键字'
			},
			less:{
				en:'less than',
				ja:'より前',
				zh:'之前',
				equal:{
					en:'less than or equal',
					ja:'以前',
					zh:'以前'
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
