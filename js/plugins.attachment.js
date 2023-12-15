/*
* FileName "plugins.attachment.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	var observeTable=(tableInfo,record,handler) => {
		if (['create','edit'].includes(vars.type))
		{
			kintone.events.on(
				[
					'app.record.create.change.'+tableInfo.code,
					'app.record.edit.change.'+tableInfo.code
				],
				handler
			);
		}
		if (kb.elms('.subtable-'+tableInfo.id+' tbody tr').length!=record[tableInfo.code].value.length)
		{
			let observer=new MutationObserver(() => {
				if (kb.elms('.subtable-'+tableInfo.id+' tbody tr').length==record[tableInfo.code].value.length)
				{
					handler({record:record});
					observer.disconnect();
				}
			});
			observer.observe(kb.elm('.subtable-'+tableInfo.id),{childList:true,subtree:true});
		}
		else handler({record:record});
	}
	kintone.events.on([
		'app.record.create.show',
		'app.record.edit.show',
		'mobile.app.record.create.show',
		'mobile.app.record.edit.show'
	],(e) => {
		return new Promise((resolve,reject) => {
			((mobile,type) => {
				vars.mobile=mobile;
				vars.type=type;
				/* get config */
				kb.config[PLUGIN_ID].config.get()
				.then((config) => {
					if (Object.keys(config).length!=0)
					{
						kb.field.load(kb.config[PLUGIN_ID].app,true).then((fieldInfos) => {
							vars.app={
								id:kb.config[PLUGIN_ID].app,
								fields:fieldInfos.origin
							}
							vars.fieldInfos=fieldInfos;
							try
							{
								((setting) => {
									if (setting.useLookupNavi.value.includes('use'))
									{
										Object.values(vars.fieldInfos.parallelize).filter((item) => item.lookup).each((fieldInfo,index) => {
											((handler) => {
												if (fieldInfo.tableCode) observeTable(vars.fieldInfos.tables[fieldInfo.tableCode],e.record,handler);
												else handler({record:e.record});
											})((e) => {
												((field) => {
													if (field)
														(Array.isArray(field)?field:[field]).each((field,index) => {
															if (!field.value.parentNode.elm('.kb-attachment-lookup-operation'))
																field.value.parentNode.css({alignItems:'center'}).insertBefore(
																	kb.create('button').addClass('kb-icon kb-icon-open kb-attachment-lookup-operation')
																	.on('click',(e) => {
																		((value,app) => {
																			if (value)
																			{
																				kb.view.records.get(
																					app,
																					kb.filter.query.create({code:fieldInfo.lookup.relatedKeyField},'=',{type:fieldInfo.type,value:value})
																				)
																				.then((records) => {
																					if (records.length!=0) window.open(kb.record.page.detail(vars.mobile,app,records.first()['$id'].value));
																				})
																				.catch((error) => kb.alert(kb.error.parse(error)))
																			}
																			else window.open(kb.record.page.add(vars.mobile,app));
																		})(field.value.elm('input[type=text]').val(),fieldInfo.lookup.relatedApp.app);
																	}),
																	field.value.nextSibling
																);
														});
												})(kb.field.get(fieldInfo,vars.mobile,vars.type));
											});
										});
									}
									if (setting.usePlaceholder.value.includes('use'))
									{
										setting.placeholders.value.map((item) => item.value).each((placeholder,index) => {
											if (placeholder.field.value in vars.fieldInfos.parallelize)
												((fieldInfo) => {
													((handler) => {
														if (fieldInfo.tableCode) observeTable(vars.fieldInfos.tables[fieldInfo.tableCode],e.record,handler);
														else handler({record:e.record});
													})((e) => {
														((field) => {
															if (field)
																(Array.isArray(field)?field:[field]).each((field,index) => {
																	if (vars.mobile) field.value.attr('placeholder',placeholder.text.value);
																	else field.value.elm('input[type=text],textarea').attr('placeholder',placeholder.text.value);
																});
														})(kb.field.get(fieldInfo,vars.mobile,vars.type));
													});
												})(vars.fieldInfos.parallelize[placeholder.field.value]);
										});
									}
									if (setting.useAlignTableButtons.value.includes('use') && !vars.mobile)
									{
										Object.values(fieldInfos.tables).each((table,index) => {
											((tableInfo,table) => {
												((row) => {
													row.prepend(row.elm('.subtable-operation-gaia'));
												})(table.addClass('kb-attachment-subtable-operation').elm('thead').elm('tr'));
												observeTable(tableInfo,e.record,(e) => {
													table.elms('tbody tr').each((row,index) => {
														if (row.elms('td').last().hasClass('subtable-operation-gaia')) row.prepend(row.elm('.subtable-operation-gaia'));
													});
												});
											})(table,kb.elm('.subtable-'+table.id));
										});
									}
								})(JSON.parse(config.flat));
								resolve(e);
							}
							catch(error)
							{
								kb.alert(kb.error.parse(error));
								resolve(e);
							}
						})
						.catch((error) => resolve(e));
					}
					else resolve(e);
				})
				.catch((error) => resolve(e));
			})(e.type.split('.').first()=='mobile',e.type.split('.').slice(-2).first());
		});
	});
	kintone.events.on([
		'app.record.detail.show',
		'mobile.app.record.detail.show',
	],(e) => {
		return new Promise((resolve,reject) => {
			((mobile,type) => {
				vars.mobile=mobile;
				vars.type=type;
				/* get config */
				kb.config[PLUGIN_ID].config.get()
				.then((config) => {
					if (Object.keys(config).length!=0)
					{
						kb.field.load(kb.config[PLUGIN_ID].app,true).then((fieldInfos) => {
							vars.app={
								id:kb.config[PLUGIN_ID].app,
								fields:fieldInfos.origin
							}
							vars.fieldInfos=fieldInfos;
							try
							{
								((setting) => {
									if (setting.useAttachmentViewer.value.includes('use'))
									{
										Object.values(vars.fieldInfos.parallelize).filter((item) => item.type=='FILE').each((fieldInfo,index) => {
											((handler) => {
												if (fieldInfo.tableCode) observeTable(vars.fieldInfos.tables[fieldInfo.tableCode],e.record,handler);
												else handler({record:e.record});
											})((e) => {
												((field) => {
													if (field)
														(Array.isArray(field)?field:[field]).each((field,index) => {
															((files) => {
																((vars.mobile)?kb.children(field.value):field.value.elm('ul').elms('li')).each((element,index) => {
																	if (element.elm('a'))
																	{
																		((file) => {
																			if (file.length!=0)
																			{
																				element.prepend(
																					kb.create('span').addClass('kb-attachment-file-operation')
																					.html(file.first().name)
																					.on('click',(e) => kb.attachment.show(file.first(),!setting.onlyView.value.includes('onlyView')))
																				);
																				files=files.filter((item) => item!=file.first());
																			}
																		})(files.filter((item) => item.name==element.elm('a').html()));
																	}
																});
															})((fieldInfo.tableCode)?e.record[fieldInfo.tableCode].value[index].value[fieldInfo.code].value:e.record[fieldInfo.code].value);
														});
												})(kb.field.get(fieldInfo,vars.mobile,vars.type));
											});
										});
									}
								})(JSON.parse(config.flat));
								resolve(e);
							}
							catch(error)
							{
								kb.alert(kb.error.parse(error));
								resolve(e);
							}
						})
						.catch((error) => resolve(e));
					}
					else resolve(e);
				})
				.catch((error) => resolve(e));
			})(e.type.split('.').first()=='mobile',e.type.split('.').slice(-2).first());
		});
	});
	kintone.events.on([
		'app.record.index.show',
		'mobile.app.record.index.show'
	],(e) => {
		return new Promise((resolve,reject) => {
			((mobile,type) => {
				vars.mobile=mobile;
				vars.type=type;
				/* get config */
				kb.config[PLUGIN_ID].config.get()
				.then((config) => {
					if (Object.keys(config).length!=0)
					{
						kb.field.load(kb.config[PLUGIN_ID].app,true).then((fieldInfos) => {
							vars.app={
								id:kb.config[PLUGIN_ID].app,
								fields:fieldInfos.origin
							}
							vars.fieldInfos=fieldInfos;
							try
							{
								((setting) => {
									if (setting.useSearchBox.value.includes('use') && e.viewType=='list')
									{
										kb.view.load(vars.app.id).then((viewInfos) => {
											((handler) => {
												if (kb.roleSet.user.length==0) kb.roleSet.load().then(() => handler());
												else handler();
											})(() => {
												((viewInfo) => {
													var keys=(() => {
														var res={};
														var references={};
														var accessibles=((accessDatas) => {
															return Object.keys(accessDatas).reduce((result,current) => {
																if (accessDatas[current]!='NONE') result.push(current);
																return result;
															},[]);
														})(cybozu.data.page.FIELD_ACCESSIBILITY || cybozu.data.page.FIELD_ACCESS_CONTROL.right.fields);
														var cast=(type) => {
															var fieldTypes={
																CREATED_AT:'CREATED_TIME',
																DECIMAL:'NUMBER',
																EDITOR:'RICH_TEXT',
																MODIFIED_AT:'UPDATED_TIME',
																MULTIPLE_CHECK:'CHECK_BOX',
																MULTIPLE_SELECT:'MULTI_SELECT',
																MULTIPLE_LINE_TEXT:'MULTI_LINE_TEXT',
																RECORD_ID:'RECORD_NUMBER',
																SINGLE_CHECK:'RADIO_BUTTON',
																SINGLE_SELECT:'DROP_DOWN'
															};
															return (type in fieldTypes)?fieldTypes[type]:type;
														};
														Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).each((field,index) => {
															if (accessibles.includes(field.id))
															{
																if (field.type=='REFERENCE_TABLE') references[field.id]=field.var;
																else
																{
																	res[field.var]={
																		id:'f'+field.id,
																		type:cast(field.type)
																	}
																	switch (res[field.var].type)
																	{
																		case 'CHECK_BOX':
																		case 'DROP_DOWN':
																		case 'MULTI_SELECT':
																		case 'RADIO_BUTTON':
																			res[field.var].option=(() => {
																				var res={};
																				if ('options' in field.properties)
																					if (Array.isArray(field.properties.options))
																						field.properties.options.each((option,index) => {
																							if (option.valid) res[option.label]=option.id;
																						});
																				return res;
																			})();
																			break;
																		case 'STATUS':
																			res[field.var].status=(() => {
																				var res={};
																				((statusData) => {
																					if ((typeof statusData.useStatus==='string')?(statusData.useStatus=='true'):statusData.useStatus)
																						statusData.states.each((state,index) => {
																							if (state.valid) res[state.label]=state.id;
																						});
																				})(cybozu.data.page.STATUS_DATA);
																				return res;
																			})();
																			break;
																	}
																}
															}
														});
														Object.values(cybozu.data.page.FORM_DATA.schema.subTable).map((item) => Object.values(item.fieldList)).flat().each((field,index) => {
															if (accessibles.includes(field.id))
															{
																res[field.var]={
																	id:'f'+field.id,
																	type:cast(field.type)
																}
																switch (res[field.var].type)
																{
																	case 'CHECK_BOX':
																	case 'DROP_DOWN':
																	case 'MULTI_SELECT':
																	case 'RADIO_BUTTON':
																		res[field.var].option=(() => {
																			var res={};
																			if ('options' in field.properties)
																				if (Array.isArray(field.properties.options))
																					field.properties.options.each((option,index) => {
																						if (option.valid) res[option.label]=option.id;
																					});
																			return res;
																		})();
																		break;
																}
															}
														});
														cybozu.data.page.FORM_DATA.referenceTables.each((reference,index) => {
															if (reference.masterApp.schema && accessibles.includes(reference.fieldId))
															{
																((unaccessibles,referenceId,status) => {
																	Object.values(reference.masterApp.schema.table.fieldList).each((field,index) => {
																		if (!unaccessibles.includes(field.id))
																		{
																			res[references[referenceId]+'.'+field.var]={
																				id:'f'+referenceId+'.f'+field.id,
																				type:cast(field.type)
																			}
																			switch (res[references[referenceId]+'.'+field.var].type)
																			{
																				case 'CHECK_BOX':
																				case 'DROP_DOWN':
																				case 'MULTI_SELECT':
																				case 'RADIO_BUTTON':
																					res[references[referenceId]+'.'+field.var].option=(() => {
																						var res={};
																						if ('options' in field.properties)
																							if (Array.isArray(field.properties.options))
																								field.properties.options.each((option,index) => {
																									if (option.valid) res[option.label]=option.id;
																								});
																						return res;
																					})();
																					break;
																				case 'STATUS':
																					res[references[referenceId]+'.'+field.var].status=(() => {
																						var res={};
																						if ((typeof status.useStatus==='string')?(status.useStatus=='true'):status.useStatus)
																							status.states.each((state,index) => {
																								if (state.valid) res[state.label]=state.id;
																							});
																						return res;
																					})();
																					break;
																			}
																		}
																	});
																})(reference.masterApp.unAccessibleFieldIds,reference.fieldId,reference.masterApp.status);
															}
														});
														return res;
													})();
													var handlers={
														build:(callback) => {
															var logical=viewInfo.filterCond.match(/ and /g)?' and ':' or ';
															var queries=viewInfo.filterCond.split(logical).filter((item) => item);
															var adjust=(index,callback) => {
																if (queries.length!=0)
																{
																	((field) => {
																		if (field.info)
																		{
																			var pattern=new RegExp('[/\\\\^$*+?.()|[\\]{}]','g');
																			var purseCodes=function(query){
																				var res={
																					groups:[],
																					organizations:[],
																					users:[]
																				};
																				var target='';
																				if (query.match(/ in /g))
																				{
																					((codes) => {
																						codes.each((code,index) => {
																							if (code.replace(/^[ ]+/g,'').replace(/[ ]+$/g,'').match(/^\"/g))
																							{
																								var code=code.replace(/^[ \"]+/g,'').replace(/[ \"]+$/g,'')
																								switch (code)
																								{
																									case 'GROUP':
																										target='groups';
																										break;
																									case 'ORGANIZATION':
																										target='organizations';
																										break;
																									case 'USER':
																										target='users';
																										break;
																									default:
																										if (!target) target='users';
																										res[target].push(code);
																										break;
																								}
																							}
																						});
																					})(query.split(' in ').last().replace(/^\(/g,'').replace(/\)$/g,'').split(','));
																				}
																				return res;
																			}
																			switch (field.info.type)
																			{
																				case 'CHECK_BOX':
																				case 'DROP_DOWN':
																				case 'MULTI_SELECT':
																				case 'RADIO_BUTTON':
																					for (var key in field.info.option)
																						if (field.query.match(new RegExp('"'+key.replace(pattern,'\\$&')+'"')))
																							field.query=field.query.replace(new RegExp('"'+key.replace(pattern,'\\$&')+'"'),'"'+field.info.option[key]+'"');
																					break;
																				case 'CREATOR':
																				case 'MODIFIER':
																				case 'USER_SELECT':
																					((codes) => {
																						kb.roleSet.group.filter((item) => codes.groups.includes(item.code.value)).each((group,index) => {
																							if (field.query.match(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"')))
																								field.query=field.query.replace(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"'),'"'+group.info.id+'"');
																						});
																						kb.roleSet.organization.filter((item) => codes.organizations.includes(item.code.value)).each((organization,index) => {
																							if (field.query.match(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"')))
																								field.query=field.query.replace(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"'),'"'+organization.info.id+'"');
																						});
																						kb.roleSet.user.filter((item) => codes.users.includes(item.code.value)).each((user,index) => {
																							if (field.query.match(new RegExp('"'+user.code.value.replace(pattern,'\\$&')+'"')))
																								field.query=field.query.replace(new RegExp('"'+user.code.value.replace(pattern,'\\$&')+'"'),'"'+user.info.id+'"');
																						});
																					})(purseCodes(field.query));
																					break;
																				case 'GROUP_SELECT':
																					((codes) => {
																						kb.roleSet.group.filter((item) => codes.groups.includes(item.code.value)).each((group,index) => {
																							if (field.query.match(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"')))
																								field.query=field.query.replace(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"'),'"'+group.info.id+'"');
																						});
																					})(purseCodes(field.query));
																					break;
																				case 'ORGANIZATION_SELECT':
																					((codes) => {
																						kb.roleSet.organization.filter((item) => codes.organizations.includes(item.code.value)).each((organization,index) => {
																							if (field.query.match(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"')))
																								field.query=field.query.replace(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"'),'"'+organization.info.id+'"');
																						});
																					})(purseCodes(field.query));
																					break;
																				case 'STATUS':
																					for (var key in field.info.status)
																						if (field.query.match(new RegExp('"'+key.replace(pattern,'\\$&')+'"')))
																							field.query=field.query.replace(new RegExp('"'+key.replace(pattern,'\\$&')+'"'),'"'+field.info.status[key]+'"');
																					break;
																			}
																			queries[index]=field.query;
																		}
																		else queries[index]='';
																		index++;
																		if (index<queries.length) adjust(index,callback);
																		else callback(queries.filter((item) => item).join(logical));
																	})(((matches) => {
																		var res={
																			info:null,
																			query:''
																		}
																		if (matches.length>1)
																			if (matches.last() in keys)
																			{
																				res.info=keys[matches.last()];
																				res.query=queries[index].replace(new RegExp(matches.last().replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&')),res.info.id);
																			}
																		return res;
																	})(queries[index].match(/^([^ ]+)/)));
																}
																else callback('');
															};
															adjust(0,(queries) => {
																callback(queries);
															});
														},
														search:(query) => {
															var keyword=kb.elm('.kb-attachment-search-operation').elm('.kb-keyword').elm('input');
															var target=kb.elm('.kb-attachment-search-operation').elm('.kb-target').elm('select');
															var url=kintone.api.url('/k/', true).replace(/\.json/g,'')+((vars.mobile)?'m/'+vars.app.id:vars.app.id)+'/?view='+e.viewId.toString();
															var build=(fieldInfo,value) => {
																return ((unequal,value) => {
																	var res='';
																	if (value=='EMPTY')
																	{
																		switch (fieldInfo.type)
																		{
																			case 'CHECK_BOX':
																			case 'DROP_DOWN':
																			case 'MULTI_SELECT':
																			case 'RADIO_BUTTON':
																			case 'STATUS':
																				res=keys[fieldInfo.code].id+((unequal)?' not':'')+' in ("")';
																				break;
																			case 'FILE':
																			case 'LINK':
																			case 'MULTI_LINE_TEXT':
																			case 'RICH_TEXT':
																			case 'SINGLE_LINE_TEXT':
																				res=keys[fieldInfo.code].id+((unequal)?' !':' ')+'= ""';
																				break;
																		}
																	}
																	else
																	{
																		switch (fieldInfo.type)
																		{
																			case 'CHECK_BOX':
																			case 'DROP_DOWN':
																			case 'MULTI_SELECT':
																			case 'RADIO_BUTTON':
																				if (value in keys[fieldInfo.code].option)
																					res=keys[fieldInfo.code].id+((unequal)?' not':'')+' in ("'+keys[fieldInfo.code].option[value].replace(/"/g,'\\"')+'")';
																				break;
																			case 'FILE':
																			case 'LINK':
																			case 'MULTI_LINE_TEXT':
																			case 'RICH_TEXT':
																			case 'SINGLE_LINE_TEXT':
																				res=keys[fieldInfo.code].id+((unequal)?' not':'')+' like "'+value.replace(/"/g,'\\"')+'"';
																				break;
																			case 'STATUS':
																				if (value in keys[fieldInfo.code].status)
																					res=keys[fieldInfo.code].id+((unequal)?' not':'')+' in ("'+keys[fieldInfo.code].status[value].replace(/"/g,'\\"')+'")';
																				break;
																		}
																	}
																	return res;
																})(value.match(/^!/g),value.replace(/^!/g,''));
															};
															if (keyword.val())
															{
																var queries=((keywords) => {
																	var res=((target.val())?[viewInfo.fields[target.val()]]:Object.values(viewInfo.fields)).reduce((result,current) => {
																		result.push(keywords.map((item) => build(current,item)).join(' or '));
																		return result.filter((item) => item);
																	},[]).map((item) => '('+item+')');
																	return (query)?['('+query+')'].concat(res.join(' or ')).join(' and '):res.join(' or ');
																})(keyword.val().split(/[ 　]/).filter((item) => item));
																if (queries) window.location.href=url+'&keyword='+keyword.val()+'&target='+target.val()+'&q='+encodeURIComponent(queries);
																else window.location.href=url;
															}
															else window.location.href=url;
														}
													};
													viewInfo.fields=viewInfo.fields.reduce((result,current) => {
														if (current in keys)
															switch (vars.fieldInfos.parallelize[current].type)
															{
																case 'CHECK_BOX':
																case 'DROP_DOWN':
																case 'FILE':
																case 'LINK':
																case 'MULTI_LINE_TEXT':
																case 'MULTI_SELECT':
																case 'RADIO_BUTTON':
																case 'RICH_TEXT':
																case 'SINGLE_LINE_TEXT':
																	result[current]=vars.fieldInfos.parallelize[current];
																	break;
															}
														return result;
													},{});
													if (Object.keys(viewInfo.fields).length!=0)
													{
														handlers.build((query) => {
															((container) => {
																if (!container.elm('.kb-attachment-search-operation'))
																{
																	((app) => {
																		container.addClass('kb-scope').attr('form-id','form_'+app.id)
																		.append(
																			kb.create('div').addClass('kb-attachment-search-operation'+((vars.mobile)?' kb-mobile':''))
																			.append(kb.field.activate(((res) => {
																				res.elm('select').empty().assignOption([{code:'',label:'All'}].concat(Object.values(viewInfo.fields).map((item) => {
																					return {code:item.code,label:item.label};
																				})),'label','code');
																				return res;
																			})(kb.field.create(app.fields.target).addClass('kb-target')),app))
																			.append(kb.field.activate(kb.field.create(app.fields.keyword).addClass('kb-keyword'),app))
																			.append(
																				kb.create('button').addClass('kb-icon kb-icon-lookup').on('click',(e) => {
																					handlers.search(query);
																				})
																			)
																			.append(
																				kb.create('button').addClass('kb-icon kb-icon-del').on('click',(e) => {
																					e.currentTarget.parentNode.elm('.kb-keyword').elm('input').val('');
																					handlers.search(query);
																				})
																			)
																		);
																		kb.record.set(container,app,((param) => {
																			var res={};
																			if ('keyword' in param) res.keyword={value:param.keyword};
																			if ('target' in param) res.target={value:param.target};
																			return res;
																		})(kb.queries()));
																		/* event */
																		kb.event.on('kb.change.keyword',(e) => {
																			if (e.container==container) handlers.search(query);
																			return e;
																		});
																	})({
																		id:'AttachmentSearch',
																		fields:{
																			target:{
																				code:'target',
																				type:'DROP_DOWN',
																				label:'',
																				required:false,
																				noLabel:true,
																				options:[
																					{index:0,label:'open'},
																					{index:1,label:'close'}
																				]
																			},
																			keyword:{
																				code:'keyword',
																				type:'SINGLE_LINE_TEXT',
																				label:'',
																				required:false,
																				noLabel:true,
																				placeholder:''
																			}
																		}
																	});
																}
															})(((vars.mobile)?kintone.mobile.app.getHeaderSpaceElement():kintone.app.getHeaderMenuSpaceElement()));
															resolve(e);
														});
													}
													else resolve(e);
												})(viewInfos.list.reduce((result,current) => {
													if (current.id==e.viewId.toString()) result=current;
													return result;
												},{
													fields:Object.values(vars.fieldInfos.parallelize).reduce((result,current) => {
														if (!current.tableCode) result.push(current.code);
														return result;
													},[]),
													filterCond:''
												}));
											});
										});
									}
									else resolve(e);
								})(JSON.parse(config.flat));
							}
							catch(error)
							{
								kb.alert(kb.error.parse(error));
								resolve(e);
							}
						})
						.catch((error) => resolve(e));
					}
					else resolve(e);
				})
				.catch((error) => resolve(e));
			})(e.type.split('.').first()=='mobile',e.type.split('.').slice(-2).first());
		});
	});
	kb.event.on('kb.attachment.call',(e) => {
		return new Promise((resolve,reject) => {
			/* get config */
			kb.config[PLUGIN_ID].config.get()
			.then((config) => {
				if (Object.keys(config).length!=0)
				{
					try
					{
						((setting) => {
							switch (e.mode)
							{
								case 'download':
									e.downloadable=(setting.useAttachmentViewer.value.includes('use'))?(!setting.onlyView.value.includes('onlyView')):true;
									break;
								case 'placeholder':
									if (setting.usePlaceholder.value.includes('use'))
									{
										((fieldInfos) => {
											setting.placeholders.value.map((item) => item.value).each((placeholder,index) => {
												if (placeholder.field.value in fieldInfos)
													((fieldInfo) => {
														if (fieldInfo.tableCode) e.fields[fieldInfo.tableCode].fields[fieldInfo.code].placeholder=placeholder.text.value;
														else e.fields[fieldInfo.code].placeholder=placeholder.text.value;
													})(fieldInfos[placeholder.field.value]);
											});
										})(kb.field.parallelize(e.fields));
									}
									break;
							}
							resolve(e);
						})(JSON.parse(config.flat));
					}
					catch(error)
					{
						kb.alert(kb.error.parse(error));
						resolve(e);
					}
				}
				else resolve(e);
			})
			.catch((error) => resolve(e));
		});
	});
})(kintone.$PLUGIN_ID);
