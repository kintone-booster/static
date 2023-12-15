/*
* FileName "plugins.action.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	var apply=(settings,record,container,workplace='record') => {
		return new Promise((resolve,reject) => {
			var latest=JSON.stringify(kb.record.simplify({fields:vars.fieldInfos.origin},record));
			var recurse=(index,callback) => {
				var finish=() => {
					index++;
					if (index<settings.length) recurse(index,callback);
					else callback();
				};
				((setting) => {
					var result=kb.filter.scan(vars.app,record,setting.condition.value);
					if (result)
					{
						kb.filter.auth(setting.user.value,setting.organization.value,setting.group.value)
						.then((auth) => {
							if (auth)
							{
								var handlers={
									clear:(callback) => {
										try
										{
											setting.clear.value.map((item) => item.value).each((clear,index) => {
												if (clear.table.value in vars.fieldInfos.tables)
												{
													record[clear.table.value].value=record[clear.table.value].value.filter((item) => {
														return !result[clear.table.value].value.includes(item);
													});
													result[clear.table.value].value=[];
												}
											});
											callback();
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									},
									fill:(callback) => {
										try
										{
											setting.fill.value.map((item) => item.value).each((fill,index) => {
												if (fill.table.value in vars.fieldInfos.tables)
												{
													((range) => {
														range=(kb.isNumeric(range))?parseInt(range)-result[fill.table.value].value.length:0;
														if (range>0)
														{
															new Array(range).fill().map(() => kb.record.create(vars.fieldInfos.origin[fill.table.value],false)).each((row,index) => {
																if (record[fill.table.value]==result[fill.table.value]) record[fill.table.value].value.push({value:row});
																else
																{
																	record[fill.table.value].value.push({value:row});
																	result[fill.table.value].value.push({value:row});
																}
															});
														}
													})(kb.formula.calculate({field:{value:Object.values(vars.fieldInfos.parallelize).first().code},formula:fill.range},result,result,record,vars.fieldInfos.parallelize));
												}
											});
											callback();
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									},
									formula:(callback) => {
										try
										{
											setting.formula.value.map((item) => item.value).each((formula,index) => {
												if (formula.field.value in vars.fieldInfos.parallelize)
													((fieldInfo) => {
														if (fieldInfo.tableCode)
														{
															result[fieldInfo.tableCode].value.each((row,index) => {
																row.value[fieldInfo.code].value=kb.formula.calculate(formula,row.value,result,record,vars.fieldInfos.parallelize);
																if (fieldInfo.type=='lookup') row.value[fieldInfo.code].lookup=true;
															});
														}
														else
														{
															result[fieldInfo.code].value=kb.formula.calculate(formula,result,result,record,vars.fieldInfos.parallelize);
															if (fieldInfo.type=='lookup') result[fieldInfo.code].lookup=true;
														}
													})(vars.fieldInfos.parallelize[formula.field.value]);
											});
											callback();
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									},
									lookup:(callback) => {
										try
										{
											if (setting.lookupApp.value)
											{
												kb.field.load(setting.lookupApp.value).then((fieldInfos) => {
													((fields) => {
														var mappings=[];
														var targets=[];
														var deepRecurse=(index,target) => {
															var cast=(fieldInfo,value) => {
																return (fieldInfo.lookup)?kb.extend({lookup:true},value):value;
															};
															kb.view.records.get(
																setting.lookupApp.value,
																target.query,
																target.sort
															)
															.then((records) => {
																if (records.length!=0)
																{
																	((handler) => {
																		if (setting.lookupLimited.value.includes('limited') || records.length==1) handler(records.first());
																		else
																		{
																			vars.picker.show(
																				{
																					app:setting.lookupApp.value,
																					query:target.query,
																					sort:target.sort,
																					picker:mappings.reduce((result,current) => {
																						result[current.external.code]=current.external;
																						return result;
																					},{})
																				},
																				(record) => handler(record)
																			);
																		}
																	})((record) => {
																		mappings.each((mapping,index) => {
																			if (!setting.lookupOverwrite.value.includes('overwrite'))
																				if (!kb.field.isEmpty(target.record[mapping.internal.code].value)) return;
																			target.record[mapping.internal.code]=cast(mapping.internal,record[mapping.external.code]);
																		});
																		index++;
																		if (index<targets.length) deepRecurse(index,targets[index]);
																		else
																		{
																			container.latest.action[setting.sIndex.value].lookup=simplify();
																			callback();
																		}
																	});
																}
																else
																{
																	if (setting.lookupReset.value.includes('reset'))
																	{
																		mappings.each((mapping,index) => {
																			target.record[mapping.internal.code]=cast(mapping.internal,kb.record.create({fields:{empty:mapping.internal}}).empty);
																		});
																	}
																	index++;
																	if (index<targets.length) deepRecurse(index,targets[index]);
																	else
																	{
																		container.latest.action[setting.sIndex.value].lookup=simplify();
																		callback();
																	}
																}
															})
															.catch((error) => {
																kb.alert(kb.error.parse(error));
																reject();
															})
														};
														var simplify=() => {
															return ((fieldInfos) => {
																return JSON.stringify(targets.reduce((result,current) => {
																	result.push(current.query);
																	result.push(kb.record.simplify({fields:fieldInfos},current.record));
																	return result;
																},[]));
															})(mappings.reduce((result,current) => {
																result[current.internal.code]=current.internal;
																return result;
															},{}));
														};
														if (setting.lookupCriteria.value.some((item) => !((item.value.external.value in fields.external) && (item.value.internal.value in fields.internal))))
														{
															kb.alert('No field to lookup was found');
															reject();
															return;
														}
														if (setting.lookupMapping.value.some((item) => !((item.value.external.value in fields.external) && (item.value.internal.value in fields.internal))))
														{
															kb.alert('No field to lookup was found');
															reject();
															return;
														}
														mappings=setting.lookupMapping.value.map((item) => {
															return {
																external:fields.external[item.value.external.value],
																internal:fields.internal[item.value.internal.value]
															};
														});
														targets=((records) => {
															return records.map((item) => {
																return {
																	query:setting.lookupCriteria.value.reduce((result,current) => {
																		((criteria) => {
																			((record) => {
																				if (setting.lookupIgnore.value.includes('ignore'))
																					if (kb.field.isEmpty(record[criteria.internal.code].value)) return;
																				result.push(kb.filter.query.create(criteria.external,criteria.operator,record[criteria.internal.code]));
																			})((criteria.internal.tableCode)?item.value:record);
																		})({
																			external:fields.external[current.value.external.value],
																			operator:current.value.operator.value,
																			internal:fields.internal[current.value.internal.value]
																		});
																		return result;
																	},kb.filter.query.parse(setting.lookupFilter.value).map((item) => fields.external[item.field].code+' '+item.operator+' '+item.value)).join(' and '),
																	sort:((setting.lookupSort.value.length!=0)?setting.lookupSort.value.map((item) => item.value.field.value+' '+item.value.order.value):['$id asc']).join(','),
																	record:item.value
																};
															});
														})(((tableCode) => {
															return (tableCode)?result[tableCode].value:[{value:record}];
														})(Array.from(new Set(mappings.map((item) => item.internal.tableCode))).first()));
														if (targets.length!=0)
														{
															if (container.latest.action[setting.sIndex.value].lookup)
																if (container.latest.action[setting.sIndex.value].lookup==simplify())
																{
																	callback();
																	return;
																}
															deepRecurse(0,targets.first());
														}
														else callback();
													})({
														external:fieldInfos.origin,
														internal:vars.fieldInfos.parallelize
													});
												})
												.catch((error) => {
													kb.alert(kb.error.parse(error));
													reject();
												});
											}
											else callback();
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									},
									user:(callback) => {
										try
										{
											if (setting.userSource.value)
											{
												((handler) => {
													if (kb.roleSet.user.length==0) kb.roleSet.load().then(() => handler());
													else handler();
												})(() => {
													var mappings=[];
													var targets=[];
													var deepRecurse=(index,target) => {
														((userInfos) => {
															mappings.each((mapping,index) => {
																if (mapping.isCustom)
																{
																	switch (mapping.field.type)
																	{
																		case 'USER_SELECT':
																			mapping.value=userInfos.reduce((result,current) => {
																				if ('customItemValues' in current)
																					((item) => {
																						if (item.length!=0)
																							((id) => {
																								((user) => {
																									if (user.length!=0)
																										if (!result.some((item) => item.code==user.first().info.code))
																											result.push({code:user.first().info.code,name:user.first().info.name});
																								})(kb.roleSet.user.filter((item) => item.info.id==id));
																							})(item.first().value);
																					})(current.customItemValues.filter((item) => item.code==mapping.item));
																				return Array.from(new Set(result)).filter((item) => item);
																			},[]);
																			break;
																		default:
																			mapping.value=userInfos.reduce((result,current) => {
																				if ('customItemValues' in current)
																					((item) => {
																						if (item.length!=0) result.push(item.first().value);
																					})(current.customItemValues.filter((item) => item.code==mapping.item));
																				return Array.from(new Set(result)).filter((item) => item);
																			},[]).join(',');
																			break;
																	}
																}
																else
																{
																	switch (mapping.item)
																	{
																		case 'groups':
																		case 'organizations':
																			mapping.value=userInfos.map((item) => item.code);
																			break;
																		case 'primaryOrganization':
																			mapping.value=userInfos.reduce((result,current) => {
																				if (mapping.item in current)
																				{
																					((organization) => {
																						if (organization.length!=0)
																							if (!result.some((item) => item.code==organization.first().info.code))
																								result.push({code:organization.first().info.code,name:organization.first().info.name});
																					})(kb.roleSet.organization.filter((item) => item.info.id==current[mapping.item]));
																				}
																				return result;
																			},[]);
																			break;
																		default:
																			mapping.value=userInfos.reduce((result,current) => {
																				if (mapping.item in current) result.push(current[mapping.item]);
																				return Array.from(new Set(result)).filter((item) => item);
																			},[]).join(',');
																			break;
																	}
																}
															});
														})(target[setting.userSource.value].value.reduce((result,current) => {
															((userInfos) => {
																if (userInfos.length!=0) result.push(userInfos.first().info);
															})(kb.roleSet.user.filter((item) => item.info.code==current.code));
															return result;
														},[]));
														var cast=(index,callback) => {
															((mapping,handler) => {
																var deepCast=(index,value,callback) => {
																	switch (mapping.item)
																	{
																		case 'groups':
																			kintone.api(kintone.api.url('/v1/user/groups',true),'GET',{code:mapping.value[index]})
																			.then((resp) => {
																				if (resp.groups)
																				{
																					value=value.concat(resp.groups.map((item) => ({code:item.code,name:item.name})));
																					index++;
																					if (index<mapping.value.length) deepCast(index,value,callback);
																					else callback(value);
																				}
																			})
																			.catch((error) => {
																				kb.alert(kb.error.parse(error));
																				reject();
																			});
																			break;
																		case 'organizations':
																			kintone.api(kintone.api.url('/v1/user/organizations',true),'GET',{code:mapping.value[index]})
																			.then((resp) => {
																				if (resp.organizationTitles)
																				{
																					value=value.concat(resp.organizationTitles.map((item) => ({code:item.organization.code,name:item.organization.name})));
																					index++;
																					if (index<mapping.value.length) deepCast(index,value,callback);
																					else callback(value);
																				}
																			})
																			.catch((error) => {
																				kb.alert(kb.error.parse(error));
																				reject();
																			});
																			break;
																	}
																}
																if (!setting.userOverwrite.value.includes('overwrite'))
																	if (!kb.field.isEmpty(target[mapping.field.code].value)) handler();
																switch (mapping.item)
																{
																	case 'groups':
																	case 'organizations':
																		if (mapping.value.length!=0) deepCast(0,[],(value) => {
																			target[mapping.field.code].value=value;
																			handler();
																		});
																		else
																		{
																			target[mapping.field.code].value=mapping.value;
																			handler();
																		}
																		break;
																	default:
																		target[mapping.field.code].value=mapping.value;
																		handler();
																		break;
																}
															})(
																mappings[index],
																() => {
																	index++;
																	if (index<mappings.length) cast(index,callback);
																	else callback();
																}
															);
														};
														cast(0,() => {
															index++;
															if (index<targets.length) deepRecurse(index,targets[index]);
															else
															{
																container.latest.action[setting.sIndex.value].user=simplify();
																callback();
															}
														});
													};
													var simplify=() => {
														return ((fieldInfos) => {
															return JSON.stringify(targets.map((item) => kb.record.simplify({fields:fieldInfos},item)));
														})(mappings.reduce((result,current) => {
															result[current.field.code]=current.field;
															return result;
														},((source) => {
															var res={};
															res[source]=vars.fieldInfos.parallelize[source];
															return res;
														})(setting.userSource.value)));
													};
													if (setting.userCustomItem.value.some((item) => !(item.value.field.value in vars.fieldInfos.parallelize)))
													{
														kb.alert('No field to user informations was found');
														reject();
														return;
													}
													if (setting.userMapping.value.some((item) => !(item.value.field.value in vars.fieldInfos.parallelize)))
													{
														kb.alert('No field to user informations was found');
														reject();
														return;
													}
													setting.userCustomItem.value.each((item,index) => {
														mappings.push({
															isCustom:true,
															item:item.value.item.value,
															field:vars.fieldInfos.parallelize[item.value.field.value],
															value:[]
														});
													});
													setting.userMapping.value.each((item,index) => {
														mappings.push({
															isCustom:false,
															item:item.value.item.value,
															field:vars.fieldInfos.parallelize[item.value.field.value],
															value:[]
														});
													});
													if (setting.userPrimaryOrganization.value)
														if (setting.userPrimaryOrganization.value in vars.fieldInfos.parallelize)
															mappings.push({
																isCustom:false,
																item:'primaryOrganization',
																field:vars.fieldInfos.parallelize[setting.userPrimaryOrganization.value],
																value:[]
															});
													if (setting.userOrganization.value)
														if (setting.userOrganization.value in vars.fieldInfos.parallelize)
															mappings.push({
																isCustom:false,
																item:'organizations',
																field:vars.fieldInfos.parallelize[setting.userOrganization.value],
																value:[]
															});
													if (setting.userGroup.value)
														if (setting.userGroup.value in vars.fieldInfos.parallelize)
															mappings.push({
																isCustom:false,
																item:'groups',
																field:vars.fieldInfos.parallelize[setting.userGroup.value],
																value:[]
															});
													targets=((tableCode) => {
														return (tableCode)?result[tableCode].value:[{value:record}];
													})(vars.fieldInfos.parallelize[setting.userSource.value].tableCode).map((item) => item.value);
													if (targets.length!=0)
													{
														if (container.latest.action[setting.sIndex.value].user)
															if (container.latest.action[setting.sIndex.value].user==simplify())
															{
																callback();
																return;
															}
														if (mappings.length!=0) deepRecurse(0,targets.first());
														else callback();
													}
													else callback();
												});
											}
											else callback();
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									}
								};
								handlers.clear(() => {
									handlers.fill(() => {
										handlers.formula(() => {
											handlers.lookup(() => {
												handlers.user(() => {
													finish();
												});
											});
										});
									});
								});
							}
							else finish();
						})
						.catch((error) => {
							kb.alert(kb.error.parse(error));
							reject();
						});
					}
					else finish();
				})(((setting) => {
					if (!container.latest) container.latest={action:{}};
					else
					{
						if (!container.latest.action) container.latest.action={};
					}
					if (!(setting.sIndex.value in container.latest.action)) container.latest.action[setting.sIndex.value]={lookup:'[]',user:'[]'};
					return setting;
				})(settings[index]));
			};
			recurse(0,() => {
				resolve({record:record,performed:(latest!=JSON.stringify(kb.record.simplify({fields:vars.fieldInfos.origin},record)))});
			});
		});
	};
	kintone.events.on([
		'app.record.create.show',
		'app.record.detail.process.proceed',
		'app.record.detail.show',
		'app.record.edit.show',
		'app.record.index.show',
		'mobile.app.record.create.show',
		'mobile.app.record.detail.process.proceed',
		'mobile.app.record.detail.show',
		'mobile.app.record.edit.show',
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
							vars.picker=new KintoneBoosterRecordPicker('record');
							try
							{
								if (['create','edit','reuse'].includes(vars.type))
								{
									((settings) => {
										if (settings.length!=0)
										{
											vars.latest={record:'',time:null};
											kintone.events.on(fieldInfos.changes.reduce((result,current) => {
												result.push('app.record.create.change.'+current);
												result.push('app.record.edit.change.'+current);
												result.push('mobile.app.record.create.change.'+current);
												result.push('mobile.app.record.edit.change.'+current);
												return result;
											},[]),(e) => {
												var triggers=settings.filter((item) => {
													return ((fields) => {
														return !fields.first() || fields.includes(e.type.split('.').last());
													})(item.triggers.value.map((item) => item.value.field.value));
												});
												if ((() => {
													var res=true;
													if (vars.latest.record)
													{
														res=false;
														if (vars.latest.record==JSON.stringify(kb.record.simplify({fields:fieldInfos.origin},e.record))) vars.latest={record:'',time:null};
														else
														{
															if (vars.latest.time<new Date().getTime()-5000)
															{
																vars.latest={record:'',time:null};
																res=true;
															}
														}
													}
													if (res)
													{
														if (['DATETIME','TIME'].includes(e.changes.field.type))
															((field) => {
																if (field)
																	(Array.isArray(field)?field:[field]).each((element,index) => {
																		if (element.elm('.control-errors-content-gaia')) res=false;
																	});
															})(kb.field.get(fieldInfos.parallelize[e.type.split('.').last()],vars.mobile,vars.type));
													}
													return res;
												})())
												{
													if (triggers.length!=0)
													{
														apply(triggers,e.record,kb.elm('body'),'record')
														.then((resp) => {
															kb.event.call('kb.style.call',{container:kb.elm('body'),record:e.record,mobile:vars.mobile,pattern:((vars.type=='reuse')?'create':vars.type),workplace:'record'})
															.then((param) => {
																if (resp.performed || param.performed)
																{
																	if (resp.performed) vars.latest={record:JSON.stringify(kb.record.simplify({fields:fieldInfos.origin},param.record)),time:new Date().getTime()};
																	else vars.latest={record:'',time:null};
																	((vars.mobile)?kintone.mobile.app.record:kintone.app.record).set(e);
																}
															})
															.catch(() => {});
														})
														.catch(() => {});
														return e;
													}
													else
													{
														kb.event.call('kb.style.call',{container:kb.elm('body'),record:e.record,mobile:vars.mobile,pattern:((vars.type=='reuse')?'create':vars.type),workplace:'record'})
														.then((param) => {
															if (param.performed)
															{
																vars.latest={record:'',time:null};
																((vars.mobile)?kintone.mobile.app.record:kintone.app.record).set(e);
															}
														})
														.catch(() => {});
													}
												}
											});
											kb.event.on('kb.action.installed',(e) => ({installed:true}));
										}
										else kb.event.on('kb.action.installed',(e) => ({installed:false}));
									})(JSON.parse(config.tab).map((item,index) => kb.extend({sIndex:{value:index.toString()}},item.setting)).reduce((result,current) => {
										if (((vars.mobile)?['both','mobile']:['both','pc']).includes(current.device.value) && current.event.value.includes('change')) result.push(current);
										return result;
									},[]));
								}
								((settings) => {
									if (settings.length!=0)
									{
										switch (vars.type)
										{
											case 'create':
											case 'edit':
											case 'reuse':
												apply(settings,e.record,kb.elm('body'),'record').then((resp) => resolve(e)).catch(() => {});
												break;
											case 'process':
												((settings) => {
													if (settings.length!=0) apply(settings,e.record,kb.elm('body'),'record').then((resp) => resolve(e)).catch(() => {});
													else resolve(e);
												})(settings.filter((item) => item.action.value==e.action.value+':'+e.status.value+':'+e.nextStatus.value));
												break;
											case 'detail':
												var recurse=(index) => {
													((setting) => {
														if (kb.filter.scan(vars.app,e.record,setting.condition.value))
														{
															kb.filter.auth(setting.user.value,setting.organization.value,setting.group.value)
															.then((auth) => {
																if (auth)
																{
																	kb.button.create(
																		vars.mobile,
																		vars.type,
																		'kb-action-button'+index.toString(),
																		setting.label.value,
																		setting.message.value,
																		() => {
																			apply([setting],e.record,kb.elm('body'),'record')
																			.then((resp) => {
																				kb.view.records.set(vars.app.id,{put:[kb.view.records.transform(resp.record)]})
																				.then((resp) => kb.alert('Done!',() => window.location.reload(true)))
																				.catch((error) => kb.alert(kb.error.parse(error)));
																			})
																			.catch(() => {})
																		}
																	);
																}
																index++;
																if (index<settings.length) recurse(index);
															})
															.catch((error) => {
																index++;
																if (index<settings.length) recurse(index);
															});
														}
														else
														{
															index++;
															if (index<settings.length) recurse(index);
														}
													})(settings[index]);
												};
												recurse(0);
												resolve(e);
												break;
											case 'index':
												var recurse=(index) => {
													((setting) => {
														kb.filter.auth(setting.user.value,setting.organization.value,setting.group.value)
														.then((auth) => {
															if (auth)
															{
																if (!setting.view.value || setting.view.value==e.viewId.toString())
																	kb.button.create(
																		vars.mobile,
																		vars.type,
																		'kb-action-button'+index.toString(),
																		setting.label.value,
																		setting.message.value,
																		() => {
																			kb.view.records.get(
																				vars.app.id,
																				((vars.mobile)?kintone.mobile.app:kintone.app).getQueryCondition()
																			)
																			.then((records) => {
																				var puts=[];
																				let deepRecurse=(index,callback) => {
																					apply([setting],records[index],kb.create('div'),'record')
																					.then((resp) => {
																						if (resp.performed) puts.push(kb.view.records.transform(resp.record));
																						kb.progressUpdate();
																						index++;
																						if (index<records.length) deepRecurse(index,callback);
																						else callback();
																					})
																					.catch(() => {});
																				};
																				if (records.length!=0)
																				{
																					kb.progressStart(records.length);
																					deepRecurse(0,() => {
																						kb.view.records.set(vars.app.id,{put:puts})
																						.then((resp) => kb.alert('Done!',() => window.location.reload(true)))
																						.catch((error) => kb.alert(kb.error.parse(error)));
																					});
																				}
																				else kb.alert('There are no records.');
																			})
																			.catch((error) => kb.alert(kb.error.parse(error)))
																		});
															}
															index++;
															if (index<settings.length) recurse(index);
														})
														.catch((error) => {
															index++;
															if (index<settings.length) recurse(index);
														});
													})(settings[index]);
												};
												recurse(0);
												resolve(e);
												break;
										}
									}
									else resolve(e);
								})(JSON.parse(config.tab).map((item,index) => kb.extend({sIndex:{value:index.toString()}},item.setting)).reduce((result,current) => {
									if (((vars.mobile)?['both','mobile']:['both','pc']).includes(current.device.value) && current.event.value.includes(vars.type)) result.push(current);
									return result;
								},[]));
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
			})(e.type.split('.').first()=='mobile',(e.reuse)?'reuse':e.type.split('.').slice(-2).first());
		});
	});
	kb.event.on('kb.action.call',(e) => {
		return new Promise((resolve,reject) => {
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
						vars.picker=new KintoneBoosterRecordPicker('record');
						try
						{
							((settings) => {
								if (settings.length!=0)
								{
									var triggers=(() => {
										var res=settings;
										if (e.pattern=='change')
										{
											res=settings.filter((item) => {
												return ((fields) => {
													return ('fields' in e)?(!fields.first() || e.fields.some((item) => fields.includes(item))):(!fields.first() || fields.includes(e.field));
												})(item.triggers.value.map((item) => item.value.field.value));
											});
										}
										return res;
									})();
									if (triggers.length!=0)
									{
										apply(triggers,e.record,e.container,(e.workplace)?e.workplace:'record')
										.then((resp) => {
											if (e.stopPropagation) vars.latest={record:JSON.stringify(kb.record.simplify({fields:fieldInfos.origin},e.record)),time:new Date().getTime()};
											e.performed=resp.performed;
											resolve(e);
										})
										.catch(() => resolve(e));
									}
									else resolve(e);
								}
								else resolve(e);
							})(JSON.parse(config.tab).map((item,index) => kb.extend({sIndex:{value:index.toString()}},item.setting)).reduce((result,current) => {
								if (((e.mobile)?['both','mobile']:['both','pc']).includes(current.device.value) && current.event.value.includes(e.pattern)) result.push(current);
								return result;
							},[]));
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
		});
	});
})(kintone.$PLUGIN_ID);
