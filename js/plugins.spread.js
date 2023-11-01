/*
* FileName "plugins.spread.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
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
								disables:fieldInfos.disables.reduce((result,current) => {
									if (current in fieldInfos.parallelize) result.push(fieldInfos.parallelize[current]);
									return result;
								},[]),
								fields:((fieldInfos,tableInfos) => {
									var res={};
									for (var key in fieldInfos)
										((fieldInfo) => {
											if (fieldInfo.tableCode)
											{
												if (!(fieldInfo.tableCode in res)) res[fieldInfo.tableCode]=tableInfos[fieldInfo.tableCode];
											}
											else res[key]=fieldInfo;
										})(fieldInfos[key]);
									return res;
								})(fieldInfos.parallelize,fieldInfos.tables),
								view:{}
							}
							vars.fieldInfos=fieldInfos;
							try
							{
								((setting) => {
									if (setting)
									{
										((container) => {
											var reload=() => {
												container.elm('.kb-view').elms('[unsaved=unsaved]').each((element,index) => {
													element.removeAttr('unsaved').removeClass('kb-unsaved');
												});
												window.location.reload(true);
											};
											if (vars.mobile) kb.elm('body').addClass('kb-mobile');
											container
											.append(
												kb.create('div').addClass('kb-spread-toolbar')
												.append(
													kb.create('button').addClass('kb-spread-toolbar-button kb-spread-toolbar-button-submit')
													.html(kb.constants.common.caption.button.submit[kb.operator.language])
													.on('click',(e) => {
														((containers,numbering) => {
															var records={
																post:[],
																put:[]
															};
															var recurse={
																submit:(index,callback) => {
																	let finish=() => {
																		index++;
																		if (index<containers.length) recurse.submit(index,callback);
																		else callback();
																	};
																	if (containers.length!=0)
																	{
																		var res=kb.record.get(containers[index],vars.app);
																		if (!res.error)
																		{
																			kb.event.call('kb.submit.call',{
																				record:res.record,
																				mobile:vars.mobile,
																				numbering:numbering,
																				pattern:((!res.record['$id'].value)?'create':'edit'),
																				workplace:'view'
																			})
																			.then((param) => {
																				if (!param.error)
																				{
																					if (param.record['$id'].value) records.put.push({id:param.record['$id'].value,record:param.record});
																					else records.post.push(param.record);
																					finish();
																				}
																				else
																				{
																					kb.record.set(containers[index],vars.app,param.record);
																					callback(true);
																				}
																			})
																			.catch(() => {});
																		}
																		else callback(true);
																	}
																	else callback();
																},
																success:(index,method,name,callback) => {
																	let finish=() => {
																		index++;
																		if (index<records[method].length) recurse.success(index,method,name,callback);
																		else
																		{
																			if (method=='post') recurse.success(0,'put',name,callback);
																			else callback();
																		}
																	};
																	if (records[method].length!=0)
																	{
																		kb.event.call('kb.'+name+'.call',{
																			record:((method=='post')?records[method][index]:records[method][index].record),
																			mobile:vars.mobile,
																			pattern:((method=='post')?'create':'edit'),
																			workplace:'view'
																		})
																		.then((param) => {
																			if (!param.error)
																			{
																				if (method=='post') records[method][index]=param.record;
																				else records[method][index].record=param.record;
																				finish();
																			}
																		})
																		.catch(() => {});
																	}
																	else finish();
																}
															};
															recurse.submit(0,(error) => {
																if (!error)
																{
																	if (records.post.length+records.put.length!=0)
																	{
																		kb.loadStart();
																		kb.event.call('kb.view.submit',{
																			container:container.elm('.kb-view'),
																			records:records,
																			viewId:setting.view.value
																		})
																		.then((param) => {
																			if (!param.error)
																				kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],() => {
																					kb.loadStart();
																					kb.view.records.set(vars.app.id,param.records,true,true)
																					.then((resp) => {
																						kb.event.call('kb.view.submit.success',{
																							container:param.container,
																							records:param.records,
																							viewId:param.viewId
																						})
																						.then((param) => {
																							if (!param.error)
																							{
																								recurse.success(0,'post','mail',() => {
																									recurse.success(0,'post','upsert',() => {
																										kb.alert('Done!',() => reload());
																									});
																								});
																							}
																						});
																					})
																					.catch((error) => {
																						kb.alert(kb.error.parse(error));
																						reject();
																					});
																				});
																		});
																	}
																	else kb.alert(kb.constants.common.message.invalid.submit[kb.operator.language]);
																}
															});
														})(container.elm('.kb-view').elms('[unsaved=unsaved]'),{});
													})
												)
												.append(
													kb.create('button').addClass('kb-spread-toolbar-button')
													.html(kb.constants.common.caption.button.cancel[kb.operator.language])
													.on('click',(e) => {
														if (container.elm('.kb-view').elms('[unsaved=unsaved]').length!=0)
														{
															kb.confirm(kb.constants.common.message.confirm.cancel[kb.operator.language],() => reload());
														}
													})
												)
											);
											kb.view.load(vars.app.id).then((viewInfos) => {
												vars.app.view={
													buttons:setting.buttons.value,
													fields:viewInfos.list.reduce((result,current) => result=(current.id==setting.view.value)?current.fields:result,[]),
													mode:setting.mode.value
												};
												((table) => {
													e.records.each((record,index) => {
														((row) => {
															kb.event.call('kb.action.call',{
																record:record,
																mobile:vars.mobile,
																pattern:((setting.mode.value=='editor')?'edit':'dummy'),
																workplace:'view'
															})
															.then((param) => {
																kb.event.call('kb.style.call',{
																	record:param.record,
																	mobile:param.mobile,
																	pattern:((setting.mode.value=='editor')?'edit':'detail'),
																	workplace:param.workplace
																})
																.then((param) => {
																	kb.record.set(row.elm('[form-id=form_'+vars.app.id+']'),vars.app,param.record)
																	.then(() => {
																		row.elm('.kb-view-row-edit').attr('href',kb.record.page.detail(vars.mobile,vars.app.id,param.record['$id'].value));
																		container.parentNode.show();
																	});
																})
																.catch(() => {});
															})
															.catch(() => {});
														})(table.addRow());
													});
												})(kb.view.create(container,vars.app,setting.view.value,vars.mobile).elm('.kb-view'));
												resolve(e);
											});
											/* beforeunload event */
											window.on('beforeunload',(e) => {
												if (container.elm('.kb-view').elms('[unsaved=unsaved]').length!=0) e.returnValue=kb.constants.common.message.confirm.changed[kb.operator.language];
											});
										})(kb.elm((vars.mobile)?'.gaia-mobile-v2-indexviewpanel-tableview':'#view-list-data-gaia').addClass('kb-view-container').empty());
									}
									else resolve(e);
								})(((!vars.config)?vars.config=JSON.parse(config.flat):vars.config).setting.value.reduce((result,current) => {
									if (current.value.view.value==e.viewId.toString()) result=current.value;
									return result;
								},null));
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
})(kintone.$PLUGIN_ID);
