/*
* FileName "formula.js"
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
				var res=false;
				if (!res)
					if (user.length!=0)
						res=(user.includes(kb.operator.code));
				if (!res)
					if (organization.length!=0)
						res=kb.operator.organizations.some((item) => organization.map((item) => item.code).includes(item));
				if (!res)
					if (group.length!=0)
						res=kb.operator.groups.some((item) => group.map((item) => item.code).includes(item));
				return res;
			}
			if (kb.operator.isGuest && user.includes('GUESTUSER()')) resolve(true);
			else
			{
				if (user.length+organization.length+group.length!=0)
				{
					if (!('organizations' in kb.operator)) get().then(() => resolve(verify())).catch((error) => kb.alert(kb.error.parse(error)));
					else resolve(verify());
				}
				else resolve(true);
			}
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
			kb.status.load(app.id).then((statusInfos) => {
				this.status=statusInfos;
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
			});
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
window.KintoneBoosterFormula=class{
	/* constructor */
	constructor(){
		this.field={
			set:(field,fieldInfo) => {
				switch (fieldInfo.type)
				{
					case 'CHECK_BOX':
					case 'MULTI_SELECT':
						field.addClass('kb-assist').append(
							kb.create('button').addClass('kb-icon kb-icon-lookup kb-search').on('click',(e) => {
								kb.pickupMultiple(
									Object.values(fieldInfo.options).reduce((result,current) => {
										result[current.index]={label:{value:current.label}};
										return result;
									},Array(fieldInfo.options.length).fill('')),
									{label:{align:'left',text:'option'}},
									(resp) => field.elm('input').val('"'+resp.map((item) => item.label.value).join(',')+'"')
								);
							})
						);
						break;
					case 'GROUP_SELECT':
					case 'ORGANIZATION_SELECT':
					case 'USER_SELECT':
						((type) => {
							field.addClass('kb-assist').append(
								kb.create('button').addClass('kb-icon kb-icon-'+type+' kb-search').on('click',(e) => {
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
											field.elm('input').val('"'+records.reduce((result,current) => {
												if (current['code'].value=='LOGINUSER()') result.push(current['code'].value);
												else result.push(current['code'].value+':'+current['name'].value);
												return result;
											},[]).join(',')+'"');
										}
									);
								})
							);
							field.recordPicker=new KintoneBoosterRecordPicker(type,true,((type=='user')?[{code:{value:'LOGINUSER()'},name:{value:'Login user'}}]:[]));
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
						break;
				}
			}
		};
	}
	calculate(param,row,record,origin,fieldInfos){
		if (param.field.value in fieldInfos)
		{
			var IF=(condition,exprIfTrue,exprIfFalse) => {
				return condition?exprIfTrue:exprIfFalse;
			};
			var LIKE=(value,pattern) => {
				return TO_STRING(value).match(new RegExp(TO_STRING(pattern),'g'))
			};
			var AND=(...args) => {
				return (args.length>0)?args.filter((item) => item).length==args.length:true;
			};
			var OR=(...args) => {
				return (args.length>0)?args.some((item) => item):false;
			};
			var AGE=(value) => {
				if (isNaN(Date.parse(TO_STRING(value)))) return null;
				else
				{
					return ((date) => {
						var thisyear=new Date(new Date().getFullYear(),date.getMonth(),date.getDate());
						return (new Date().getFullYear()-date.getFullYear())+((thisyear.getTime()>new Date().getTime())?-1:0);
					})(new Date(TO_STRING(value)))
				}
			};
			var ASC=(value) => {
				var map={
					'ア':'ｱ','イ':'ｲ','ウ':'ｳ','エ':'ｴ','オ':'ｵ',
					'カ':'ｶ','キ':'ｷ','ク':'ｸ','ケ':'ｹ','コ':'ｺ',
					'サ':'ｻ','シ':'ｼ','ス':'ｽ','セ':'ｾ','ソ':'ｿ',
					'タ':'ﾀ','チ':'ﾁ','ツ':'ﾂ','テ':'ﾃ','ト':'ﾄ',
					'ナ':'ﾅ','ニ':'ﾆ','ヌ':'ﾇ','ネ':'ﾈ','ノ':'ﾉ',
					'ハ':'ﾊ','ヒ':'ﾋ','フ':'ﾌ','ヘ':'ﾍ','ホ':'ﾎ',
					'マ':'ﾏ','ミ':'ﾐ','ム':'ﾑ','メ':'ﾒ','モ':'ﾓ',
					'ヤ':'ﾔ','ユ':'ﾕ','ヨ':'ﾖ',
					'ラ':'ﾗ','リ':'ﾘ','ル':'ﾙ','レ':'ﾚ','ロ':'ﾛ',
					'ワ':'ﾜ','ヲ':'ｦ','ン':'ﾝ',
					'ァ':'ｧ','ィ':'ｨ','ゥ':'ｩ','ェ':'ｪ','ォ':'ｫ',
					'ッ':'ｯ','ャ':'ｬ','ュ':'ｭ','ョ':'ｮ',
					'ガ':'ｶﾞ','ギ':'ｷﾞ','グ':'ｸﾞ','ゲ':'ｹﾞ','ゴ':'ｺﾞ',
					'ザ':'ｻﾞ','ジ':'ｼﾞ','ズ':'ｽﾞ','ゼ':'ｾﾞ','ゾ':'ｿﾞ',
					'ダ':'ﾀﾞ','ヂ':'ﾁﾞ','ヅ':'ﾂﾞ','デ':'ﾃﾞ','ド':'ﾄﾞ',
					'バ':'ﾊﾞ','ビ':'ﾋﾞ','ブ':'ﾌﾞ','ベ':'ﾍﾞ','ボ':'ﾎﾞ',
					'パ':'ﾊﾟ','ピ':'ﾋﾟ','プ':'ﾌﾟ','ペ':'ﾍﾟ','ポ':'ﾎﾟ',
					'ヴ':'ｳﾞ','ヷ':'ﾜﾞ','ヺ':'ｦﾞ',
					'。':'｡','、':'､','ー':'ｰ','「':'｢','」':'｣',
					'・':'･','”':'"','’':'\'','‘':'`','￥':'\\',
					'　':' ','〜':'~'
				};
				return TO_STRING(value)
				.replace(/[\uFF01-\uFF5E]/g,(s) => String.fromCharCode(s.charCodeAt(0)-0xFEE0))
				.replace(/[\u3041-\u3096]/g,(s) => String.fromCharCode(s.charCodeAt(0)+0x60))
				.replace(new RegExp('('+Object.keys(map).join('|')+')','g'),(s) => map[s]);
			};
			var DATE_CALC=(value,pattern) => {
				var value=TO_STRING(value);
				var type=value.match(/^[0-9]{1,2}:[0-9]{1,2}$/g)?'TIME':((value.replace(/[^0-9]+/g,'').length>8)?'DATETIME':'DATE');
				return ((date) => {
					if (isNaN(Date.parse(date))) return null;
					else
					{
						date=new Date(date).calc(TO_STRING(pattern));
						switch (fieldInfos[param.field.value].type)
						{
							case 'DATE':
								date=date.format('Y-m-d');
								break;
							case 'DATETIME':
								date=date.format('ISO');
								break;
							case 'TIME':
								date=date.format('H:i');
								break;
							default:
								switch (type)
								{
									case 'DATE':
										date=date.format('Y-m-d');
										break;
									case 'DATETIME':
										date=date.format('ISO');
										break;
									case 'TIME':
										date=date.format('H:i');
										break;
								}
								break;
						}
						return date;
					}
				})((type=='TIME')?new Date('2020-01-01').calc(value.split(':').first()+' hour,'+value.split(':').last()+' minute').format('ISO'):value);
			};
			var DATE_DIFF=(from,to,format) => {
				from=TO_STRING(from);
				to=TO_STRING((to=='TODAY')?'':to);
				if (isNaN(Date.parse(from))) return '';
				else
				{
					return ((from,to,res) => {
						var year=0;
						var month=0;
						var day=0;
						var days=parseInt(from.format('d'))-1;
						var keep={
							from:from.calc('first-of-month'),
							to:to.calc('first-of-month')
						};
						if (keep.from.format('Y-m-d')==keep.to.format('Y-m-d')) day=Math.floor((to.getTime()-from.getTime())/(1000*60*60*24));
						else
						{
							while (keep.from.getTime()<keep.to.getTime())
							{
								if (keep.from.calc('1 month,'+days.toString()+' day')<to)
								{
									month++;
									if (month>11)
									{
										year++;
										month=0;
									}
									day=Math.floor((to.getTime()-keep.from.calc('1 month,'+days.toString()+' day').getTime())/(1000*60*60*24));
								}
								else day=Math.floor((to.getTime()-keep.from.calc(days.toString()+' day').getTime())/(1000*60*60*24));
								keep.from=keep.from.calc('1 month');
							}
						}
						return res
						.replace(/Y/g,year.toString())
						.replace(/FM/g,((year*12)+month).toString())
						.replace(/M/g,month.toString())
						.replace(/FD/g,Math.floor((to.getTime()-from.getTime())/(1000*60*60*24)).toString())
						.replace(/D/g,day.toString());
					})(new Date(from),(isNaN(Date.parse(to)))?new Date():new Date(to),TO_STRING(format));
				}
			};
			var DATE_FORMAT=(value,format) => {
				return (!isNaN(Date.parse(TO_STRING(value))))?new Date(TO_STRING(value)).format(format):'';
			};
			var DATE_STRING=(value) => {
				return (!isNaN(Date.parse(TO_STRING(value))))?((date) => {
					var year=date.getFullYear().toString();
					var month=('0'+(date.getMonth()+1)).slice(-2);
					var day=('0'+date.getDate()).slice(-2);
					var era='';
					if (date>new Date('2019/4/30'))
					{
						era='令和';
						year-=2018;
					}
					else if (date>new Date('1989/1/7'))
					{
						era='平成';
						year-=1988;
					}
					else if (date>new Date('1926/12/24'))
					{
						era='昭和';
						year-=1925;
					}
					else if (date>new Date('1912/7/29'))
					{
						era='大正';
						year-=1911;
					}
					else
					{
						era='明治';
						year-=1867;
					}
					return era+('0'+year).slice(-2)+'年'+month+'月'+day+'日';
				})(new Date(TO_STRING(value))):'';
			};
			var LEN=(value) => {
				return TO_STRING(value).length;
			};
			var LENB=(value) => {
				return encodeURI(TO_STRING(value)).replace(/%../g,'*').length;
			};
			var LEFT=(value,len) => {
				return TO_STRING(value).substring(0,TO_NUMBER(len));
			};
			var RIGHT=(value,len) => {
				return TO_STRING(value).slice(TO_NUMBER(len)*-1);
			};
			var MID=(value,start,len) => {
				return TO_STRING(value).substring(TO_NUMBER(start)-1,TO_NUMBER(start)+TO_NUMBER(len)-1);
			};
			var LINES=(value,index) => {
				var res=TO_STRING(value).split('\n');
				return (res.length<index)?'':res[index-1];
			};
			var LPAD=(value,len,pad) => {
				return TO_STRING(value).padStart(len,pad);
			};
			var RPAD=(value,len,pad) => {
				return TO_STRING(value).padEnd(len,pad);
			};
			var MAX=(code,bool=false) => {
				return ((code,record) => {
					var res=null;
					if (code in fieldInfos)
						((fieldInfo) => {
							if (fieldInfo.tableCode)
							{
								switch (fieldInfo.type)
								{
									case 'DATE':
									case 'DATETIME':
										var rows=record[fieldInfo.tableCode].value.filter((item) => !isNaN(Date.parse(item.value[code].value)));
										if (rows.length!=0)
										{
											res='';
											rows.each((row,index) => {
												if (res<row.value[code].value) res=row.value[code].value;
											});
										}
										break;
									case 'NUMBER':
										var rows=record[fieldInfo.tableCode].value.filter((item) => kb.isNumeric(item.value[code].value));
										if (rows.length!=0)
										{
											res=0;
											rows.each((row,index) => {
												if (res<parseFloat(row.value[code].value)) res=parseFloat(row.value[code].value);
											});
										}
										break;
									case 'TIME':
										var rows=record[fieldInfo.tableCode].value.filter((item) => item.value[code].value.match(/[0-9]{2}:[0-9]{2}/));
										if (rows.length!=0)
										{
											res='';
											rows.each((row,index) => {
												if (res<row.value[code].value) res=row.value[code].value;
											});
										}
										break;
								}
							}
						})(fieldInfos[code]);
					return res;
				})(TO_STRING(code),(bool)?record:origin);
			};
			var MIN=(code,bool=false) => {
				return ((record) => {
					var res=null;
					if (code in fieldInfos)
						((fieldInfo) => {
							if (fieldInfo.tableCode)
							{
								switch (fieldInfo.type)
								{
									case 'DATE':
										var rows=record[fieldInfo.tableCode].value.filter((item) => !isNaN(Date.parse(item.value[code].value)));
										if (rows.length!=0)
										{
											res='9999-12-31';
											rows.each((row,index) => {
												if (res>row.value[code].value) res=row.value[code].value;
											});
										}
										break;
									case 'DATETIME':
										var rows=record[fieldInfo.tableCode].value.filter((item) => !isNaN(Date.parse(item.value[code].value)));
										if (rows.length!=0)
										{
											res='9999-12-31T23:59:59Z';
											rows.each((row,index) => {
												if (res>row.value[code].value) res=row.value[code].value;
											});
										}
										break;
									case 'NUMBER':
										var rows=record[fieldInfo.tableCode].value.filter((item) => kb.isNumeric(item.value[code].value));
										if (rows.length!=0)
										{
											res=Number.MAX_SAFE_INTEGER;
											rows.each((row,index) => {
												if (res>parseFloat(row.value[code].value)) res=parseFloat(row.value[code].value);
											});
										}
										break;
									case 'TIME':
										var rows=record[fieldInfo.tableCode].value.filter((item) => item.value[code].value.match(/[0-9]{2}:[0-9]{2}/));
										if (rows.length!=0)
										{
											res='23:59';
											rows.each((row,index) => {
												if (res>row.value[code].value) res=row.value[code].value;
											});
										}
										break;
								}
							}
						})(fieldInfos[code]);
					return res;
				})(TO_STRING(code),(bool)?record:origin);
			};
			var MATH=(formula) => {
				return TO_STRING(formula).match(/[0-9 ()?:+*/%-]+/)?eval(TO_STRING(formula)):null;
			};
			var NOW=() => {
				var res='';
				switch (fieldInfos[param.field.value].type)
				{
					case 'DATE':
						res=new Date().format('Y-m-d');
						break;
					case 'DATETIME':
						res=new Date().format('ISO');
						break;
					case 'TIME':
						res=new Date().format('H:i');
						break;
				}
				return res;
			};
			var REPLACE=(value,pattern,replacement) => {
				return TO_STRING(value).replace(new RegExp(TO_STRING(pattern),'g'),TO_STRING(replacement));
			};
			var ROWS=(code,bool=false) => {
				return ((code,record) => {
					var res=null;
					if (code in record) res=record[code].value.length;
					return res;
				})(TO_STRING(code),(bool)?record:origin);
			};
			var TODAY=() => {
				return new Date().format('Y-m-d');
			};
			var TO_NUMBER=(value) => {
				var res=0;
				switch (typeof value)
				{
					case 'number':
					case 'string':
						res=(kb.isNumeric(value))?parseFloat(value):0;
						break;
				}
				return res;
			};
			var TO_STRING=(value) => {
				var res='';
				switch (typeof value)
				{
					case 'number':
					case 'string':
						res=value.toString();
						break;
				}
				return res;
			};
			var WEEK_CALC=(value) => {
				return (!isNaN(Date.parse(value)))?new Date(value).getDay():-1;
			};
			var result=(answer,fieldInfo) => {
				var res=null;
				switch (fieldInfo.type)
				{
					case 'CATEGORY':
					case 'CHECK_BOX':
					case 'MULTI_SELECT':
						res=[];
						if (answer) res=(Array.isArray(answer))?answer:answer.toString().split(',').map((item) => item.trim());
						break;
					case 'FILE':
						res=[];
						break;
					case 'GROUP_SELECT':
					case 'ORGANIZATION_SELECT':
					case 'STATUS_ASSIGNEE':
					case 'USER_SELECT':
						res=[];
						if (answer)
						{
							res=((Array.isArray(answer))?answer:answer.toString().split(',').map((item) => item.trim())).reduce((result,current) => {
								if (current=='LOGINUSER()') result.push({code:kb.operator.code,name:kb.operator.name});
								else result.push({code:current.split(':').first(),name:current.split(':').last()});
								return result;
							},[]);
						}
						break;
					case 'NUMBER':
					case 'RECORD_NUMBER':
						res=((kb.isNumeric(answer))?parseFloat(answer):null);
						break;
					default:
						res=(answer)?((Array.isArray(answer))?answer.join(','):answer.toString()):'';
						break;
				}
				return res;
			};
			try
			{
				var formula=param.formula.value.replace(/([^!><]{1})[ ]*=/g,'$1==');
				var reserved=[];
				for (var key in fieldInfos)
					((fieldInfo) => {
						formula=((formula) => {
							var adjust=(fieldInfo,value) => {
								var res='';
								switch (fieldInfo.type)
								{
									case 'CALC':
										switch(fieldInfo.format)
										{
											case 'NUMBER':
											case 'NUMBER_DIGIT':
												res=(value)?value:'null';
												break;
											default:
												res='"'+((value || value==0)?value:'')+'"';
												break;
										}
										break;
									case 'CATEGORY':
									case 'CHECK_BOX':
									case 'MULTI_SELECT':
										res='"'+value.join(',')+'"';
										break;
									case 'CREATOR':
									case 'MODIFIER':
										res='"'+((value.name)?value.name:'')+'"';
										break;
									case 'FILE':
									case 'GROUP_SELECT':
									case 'ORGANIZATION_SELECT':
									case 'STATUS_ASSIGNEE':
									case 'USER_SELECT':
										res='"'+value.map((item) => item.name).join(',')+'"';
										break;
									case 'NUMBER':
									case 'RECORD_NUMBER':
										res=(value || value==0)?value:'null';
										break;
									default:
										res='`'+((value || value==0)?value.replace(/[`\\^$.*+?()[\]{}|]/g,'\\$&'):'')+'`';
										break;
								}
								return res;
							}
							if (formula.match(new RegExp('%'+fieldInfo.code+'%')))
							{
								if (fieldInfo.tableCode)
								{
									if (fieldInfo.code in row)
										formula=formula.replace(new RegExp('(%'+fieldInfo.code+'%)','g'),adjust(fieldInfo,row[fieldInfo.code].value));
								}
								else formula=formula.replace(new RegExp('(%'+fieldInfo.code+'%)','g'),adjust(fieldInfo,record[fieldInfo.code].value));
							}
							return formula;
						})(
							formula
							.replace(new RegExp('(MIN|MAX|ROWS)\\([ ]*(%'+fieldInfo.code+'%)[ ]*\\)','g'),(match,functions,field) => {
								reserved.push(functions+'("'+field+'"")');
								return 'calculate_'+reserved.length.toString();
							})
							.replace(new RegExp('(MIN|MAX|ROWS)\\([ ]*(%'+fieldInfo.code+'%)[ ]*,[ ]*(true|false)\\)','g'),(match,functions,field,bool) => {
								reserved.push(functions+'("'+field+'",'+bool+')');
								return 'calculate_'+reserved.length.toString();
							})
						);
					})(fieldInfos[key]);
				reserved.each((reserved,index) => {
					formula=formula.replace(new RegExp('calculate_'+(index+1).toString(),'g'),reserved);
				});
				return result(eval(formula),fieldInfos[param.field.value]);
			}
			catch(e)
			{
				return result(null,fieldInfos[param.field.value]);
			}
		}
		else return null;
	}
}
if (!window.kb.filter) window.kb.filter=new KintoneBoosterFilter();
if (!window.kb.formula) window.kb.formula=new KintoneBoosterFormula();
/*
Message definition by language
*/
kb.constants=kb.extend({
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
	}
},kb.constants);
