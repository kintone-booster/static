/*
* FileName "plugins.upsert.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	var apply=(settings,record,silent=false) => {
		return new Promise((resolve,reject) => {
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
								kb.field.load(setting.app.value).then((fieldInfos) => {
									var target={
										id:setting.app.value,
										fields:fieldInfos.origin
									};
									((fields) => {
										var criterias=[];
										var filters=[];
										var mappings=[];
										var tables={};
										var increments={
											record:1,
											row:1,
											progress:{
												record:0,
												row:0
											}
										};
										var deepRecurse=() => {
											var files=[];
											var create={
												field:(fieldInfo,index) => {
													var res=null;
													if (fieldInfo.tableCode)
													{
														if (result[fieldInfo.tableCode].value.length>index) res=result[fieldInfo.tableCode].value[index].value[fieldInfo.code];
														else res=kb.record.create({fields:{empty:mapping.internal}}).empty;
													}
													else res=result[fieldInfo.code];
													return kb.extend({type:fieldInfo.type},res);
												},
												record:(origin) => {
													increments.row.each((index) => {
														var record=((param) => {
															var res=kb.filter.scan(target,origin,param.query);
															if (!res)
																if (setting.pattern.value=='upsert')
																{
																	for (var key in param.rows)
																		if (kb.filter.result[key].value.length==0)
																		{
																			origin[key].value.push({value:kb.extend({},param.rows[key])});
																			kb.filter.result[key]={value:[origin[key].value.last()]};
																		}
																	res=kb.filter.result;
																}
															return res;
														})((() => {
															var res={
																rows:{},
																query:[]
															};
															increments.progress.row=index;
															criterias.each((criteria,index) => {
																if (criteria.external.tableCode)
																{
																	if (!(criteria.external.tableCode in res.rows)) res.rows[criteria.external.tableCode]=kb.record.create(target.fields[criteria.external.tableCode],false);
																	res.rows[criteria.external.tableCode][criteria.external.code]=cast(criteria.external,create.field(criteria.internal,increments.progress.row));
																	res.query.push(kb.filter.query.create(criteria.external,criteria.operator,create.field(criteria.internal,increments.progress.row)));
																}
															});
															filters.each((filter,index) => {
																if (filter.field.tableCode) res.query.push(filter.field.code+' '+filter.operator+' '+filter.value);
															});
															res.query=res.query.join(' and ');
															return res;
														})());
														if (record)
														{
															mappings.each((mapping,index) => {
																if (mapping.external.tableCode)
																{
																	if (mapping.external.tableCode in tables)
																	{
																		origin[mapping.external.tableCode]={value:tables[mapping.external.tableCode]};
																		tables[mapping.external.tableCode].each((row,index) => {
																			row.value[mapping.external.code]=cast(mapping.external,create.field(mapping.internal,index));
																			if (mapping.external.type=='FILE')
																				if (row.value[mapping.external.code].value)
																					Array.prototype.push.apply(files,row.value[mapping.external.code].value);
																		});
																	}
																	else
																	{
																		record[mapping.external.tableCode].value.each((row,index) => {
																			row.value[mapping.external.code]=cast(mapping.external,create.field(mapping.internal,increments.progress.row));
																			if (mapping.external.type=='FILE')
																				if (row.value[mapping.external.code].value)
																					Array.prototype.push.apply(files,row.value[mapping.external.code].value);
																		});
																	}
																}
																else
																{
																	origin[mapping.external.code]=cast(mapping.external,create.field(mapping.internal,increments.progress.record));
																	if (mapping.external.type=='FILE')
																		if (origin[mapping.external.code].value)
																			Array.prototype.push.apply(files,origin[mapping.external.code].value);
																}
															});
														}
													});
													return origin;
												}
											};
											var cast=(fieldInfo,value) => {
												switch (fieldInfo.type)
												{
													case 'CHECK_BOX':
													case 'FILE':
													case 'GROUP_SELECT':
													case 'MULTI_SELECT':
													case 'ORGANIZATION_SELECT':
													case 'USER_SELECT':
														if (!Array.isArray(value.value)) value.value=[value.value];
														break;
												}
												value.type=fieldInfo.type;
												return (fieldInfo.lookup)?kb.extend({lookup:true},value):value;
											};
											var formula=(records) => {
												records.each((record,index) => {
													setting.formula.value.each((formula,index) => {
														if (formula.value.field.value in fields.external)
															((fieldInfo) => {
																if (fieldInfo.tableCode)
																{
																	record[fieldInfo.tableCode].value.each((row,index) => {
																		row.value[fieldInfo.code].value=kb.formula.calculate(formula.value,row.value,record,record,fields.external);
																		if (fieldInfo.lookup) row.value[fieldInfo.code].lookup=true;
																	});
																}
																else
																{
																	record[fieldInfo.code].value=kb.formula.calculate(formula.value,record,record,record,fields.external);
																	if (fieldInfo.lookup) record[fieldInfo.code].lookup=true;
																}
															})(fields.external[formula.value.field.value]);
													});
												});
												return records;
											};
											if (setting.pattern.value=='insert')
											{
												((records) => {
													kb.file.clone(files,true).then(() => {
														kb.view.records.set(setting.app.value,{post:records},silent)
														.then((resp) => {
															increments.progress.record++;
															if (increments.progress.record<increments.record) deepRecurse();
															else finish();
														})
														.catch((error) => {
															kb.alert(kb.error.parse(error));
															reject();
														});
													});
												})(formula([create.record(kb.record.create(target))]));
											}
											else
											{
												kb.view.records.get(
													setting.app.value,
													(() => {
														var res=[];
														criterias.each((criteria,index) => {
															if (!criteria.external.tableCode) res.push(kb.filter.query.create(criteria.external,criteria.operator,create.field(criteria.internal,increments.progress.record)));
														});
														filters.each((filter,index) => {
															if (!filter.field.tableCode) res.push(filter.field.code+' '+filter.operator+' '+filter.value);
														})
														return res.join(' and ');
													})()
												)
												.then((records) => {
													records=((records) => {
														var res=[];
														if (records.length!=0) res=records.map((item) => create.record(item));
														else
														{
															if (setting.pattern.value=='upsert')
																((criterias) => {
																	res.push(create.record((() => {
																		var res=kb.record.create(target);
																		criterias.each((criteria,index) => {
																			if (criteria.external.tableCode) res[criteria.external.tableCode]={value:[]};
																			else res[criteria.external.code]=cast(criteria.external,create.field(criteria.internal,increments.progress.record));
																		});
																		return res;
																	})()));
																})(criterias.filter((item) => !kb.field.reserved.includes(item.external.type)));
														}
														return formula(res);
													})(records);
													kb.file.clone(files,true).then(() => {
														kb.view.records.set(
															setting.app.value,
															{
																post:records.filter((item) => !item['$id'].value),
																put:records.reduce((result,current) => {
																	if (current['$id'].value) result.push(kb.view.records.transform(current));
																	return result;
																},[])
															},
															silent
														)
														.then((resp) => {
															increments.progress.record++;
															if (increments.progress.record<increments.record) deepRecurse();
															else finish();
														})
														.catch((error) => {
															kb.alert(kb.error.parse(error));
															reject();
														});
													});
												})
												.catch((error) => {
													kb.alert(kb.error.parse(error));
													reject();
												})
											}
										};
										if (setting.mapping.value.some((item) => !((item.value.external.value in fields.external) && (item.value.internal.value in fields.internal))))
										{
											kb.alert('No field to transfer was found');
											reject();
											return;
										}
										if (setting.criteria.value.some((item) => !((item.value.external.value in fields.external) && (item.value.internal.value in fields.internal))))
										{
											kb.alert('No field to transfer was found');
											reject();
											return;
										}
										setting.mapping.value.each((mapping,index) => {
											((external,internal) => {
												if (external.tableCode)
												{
													tables[external.tableCode]=((rows) => {
														var range=(rows)?rows.length:1;
														if (internal.tableCode)
															range=(range<result[internal.tableCode].value.length)?result[internal.tableCode].value.length:range;
														return new Array(range).fill().map(() => ({value:kb.record.create(target.fields[external.tableCode],false)}));
													})(tables[external.tableCode]);
												}
												else
												{
													if (internal.tableCode)
													{
														if (result[internal.tableCode].value.length==0) increments.record=0;
														else increments.record=(increments.record<result[internal.tableCode].value.length)?result[internal.tableCode].value.length:increments.record;
													}
												}
												mappings.push({
													external:external,
													internal:internal
												});
											})(fields.external[mapping.value.external.value],fields.internal[mapping.value.internal.value]);
										});
										setting.criteria.value.each((criteria,index) => {
											((external,operator,internal) => {
												if (external.tableCode)
												{
													if (external.tableCode in tables) delete tables[external.tableCode];
													if (internal.tableCode)
														increments.row=(increments.row<result[internal.tableCode].value.length)?result[internal.tableCode].value.length:increments.row;
												}
												else
												{
													if (internal.tableCode)
													{
														if (result[internal.tableCode].value.length==0) increments.record=0;
														else increments.record=(increments.record<result[internal.tableCode].value.length)?result[internal.tableCode].value.length:increments.record;
													}
												}
												criterias.push({
													external:external,
													operator:operator,
													internal:internal
												});
											})(fields.external[criteria.value.external.value],criteria.value.operator.value,fields.internal[criteria.value.internal.value]);
										});
										kb.filter.query.parse(setting.filter.value).each((query,index) => {
											filters.push({
												field:fields.external[query.field],
												operator:query.operator,
												value:query.value
											});
										});
										if (increments.record!=0)
										{
											increments.progress.record=0;
											increments.progress.row=0;
											deepRecurse();
										}
										else finish();
									})({
										external:fieldInfos.parallelize,
										internal:vars.fieldInfos.parallelize
									});
								})
								.catch((error) => {
									kb.alert(kb.error.parse(error));
									reject();
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
				})(settings[index]);
			};
			if (!silent) kb.loadStart();
			recurse(0,() => {
				if (!silent) kb.loadEnd();
				resolve();
			});
		});
	};
	kintone.events.on([
		'app.record.create.submit.success',
		'app.record.detail.process.proceed',
		'app.record.detail.show',
		'app.record.edit.submit.success',
		'app.record.index.show',
		'mobile.app.record.create.submit.success',
		'mobile.app.record.detail.process.proceed',
		'mobile.app.record.detail.show',
		'mobile.app.record.edit.submit.success',
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
								((settings) => {
									if (settings.length!=0)
									{
										switch (vars.type)
										{
											case 'create':
											case 'edit':
												apply(settings,e.record).then((resp) => resolve(e)).catch(() => {});
												break;
											case 'process':
												((settings) => {
													if (settings.length!=0) apply(settings,e.record).then((resp) => resolve(e)).catch(() => {});
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
																		'kb-upsert-button'+index.toString(),
																		setting.label.value,
																		setting.message.value,
																		() => apply([setting],e.record).then((resp) => kb.alert('Done!')).catch(() => {})
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
																		'kb-upsert-button'+index.toString(),
																		setting.label.value,
																		setting.message.value,
																		() => {
																			kb.view.records.get(
																				vars.app.id,
																				((vars.mobile)?kintone.mobile.app:kintone.app).getQueryCondition()
																			)
																			.then((records) => {
																				let deepRecurse=(index,callback) => {
																					apply([setting],records[index],true)
																					.then((resp) => {
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
																					deepRecurse(0,() => kb.alert('Done!'));
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
								})(((!vars.config)?vars.config=JSON.parse(config.tab):vars.config).reduce((result,current) => {
									if (((vars.mobile)?['both','mobile']:['both','pc']).includes(current.setting.device.value) && current.setting.event.value.includes(vars.type)) result.push(current.setting);
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
			})(
				e.type.split('.').first()=='mobile',
				((type) => {
					switch (type)
					{
						case 'submit':
							type=e.type.split('.').slice(-3).first();
							break;
					}
					return type;
				})(e.type.split('.').slice(-2).first())
			);
		});
	});
	kb.event.on('kb.upsert.call',(e) => {
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
						try
						{
							((settings) => {
								if (settings.length!=0) apply(settings,e.record,true).then((resp) => resolve(e)).catch(() => resolve(e));
								else resolve(e);
							})(((!vars.config)?vars.config=JSON.parse(config.tab):vars.config).reduce((result,current) => {
								if (((e.mobile)?['both','mobile']:['both','pc']).includes(current.setting.device.value) && current.setting.event.value.includes(e.pattern)) result.push(current.setting);
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
