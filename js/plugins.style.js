/*
* FileName "plugins.style.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	var apply=(settings,record,workplace='record') => {
		var performed=false;
		var indexes=(() => {
			var res={};
			var spare=0;
			if (workplace=='record')
				for (var key in record)
					if (key in vars.fieldInfos.tables)
						record[key].value.each((row,index) => {
							if (row.id==null)
							{
								spare++;
								row.id=spare;
							}
							res[row.id]=index;
						},{});
			return res;
		})();
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
								setting.color.value.map((item) => item.value).each((color,index) => {
									if (color.field.value in vars.fieldInfos.parallelize)
										((fieldInfo) => {
											switch (workplace)
											{
												case 'record':
													if (fieldInfo.tableCode)
													{
														if (fieldInfo.tableCode in result)
														{
															((handler) => {
																if (!vars.mobile)
																{
																	if (kb.elms('.subtable-'+vars.fieldInfos.tables[fieldInfo.tableCode].id+' tbody tr').length!=record[fieldInfo.tableCode].value.length)
																	{
																		let observer=new MutationObserver(() => {
																			if (kb.elms('.subtable-'+vars.fieldInfos.tables[fieldInfo.tableCode].id+' tbody tr').length==record[fieldInfo.tableCode].value.length)
																			{
																				handler();
																				observer.disconnect();
																			}
																		});
																		observer.observe(kb.elm('.subtable-'+vars.fieldInfos.tables[fieldInfo.tableCode].id),{childList:true,subtree:true});
																	}
																	else handler();
																}
																else handler();
															})(() => {
																result[fieldInfo.tableCode].value.each((row,index) => {
																	if (fieldInfo.code in row.value)
																		((field) => {
																			if (field)
																			{
																				field[indexes[row.id]].value.css({
																					backgroundColor:color.backcolor.value,
																					color:color.forecolor.value
																				});
																				if (color.backcolor.value) field[indexes[row.id]].value.addClass('kb-inherit-backcolor');
																				else field[indexes[row.id]].value.removeClass('kb-inherit-backcolor');
																				if (color.forecolor.value) field[indexes[row.id]].value.addClass('kb-inherit-forecolor');
																				else field[indexes[row.id]].value.removeClass('kb-inherit-forecolor');
																			}
																		})(kb.field.get(fieldInfo,vars.mobile,vars.type));
																});
															});
														}
													}
													else
													{
														if (fieldInfo.code in result)
															((field) => {
																if (field)
																{
																	field.value.css({
																		backgroundColor:color.backcolor.value,
																		color:color.forecolor.value
																	});
																	if (color.backcolor.value) field.value.addClass('kb-inherit-backcolor');
																	else field.value.removeClass('kb-inherit-backcolor');
																	if (color.forecolor.value) field.value.addClass('kb-inherit-forecolor');
																	else field.value.removeClass('kb-inherit-forecolor');
																}
															})(kb.field.get(fieldInfo,vars.mobile,vars.type));
													}
													break;
												case 'view':
													if (fieldInfo.tableCode)
													{
														if (fieldInfo.tableCode in result)
															result[fieldInfo.tableCode].value.each((row,index) => {
																if (fieldInfo.code in row.value)
																{
																	row.value[fieldInfo.code].backcolor=color.backcolor.value;
																	row.value[fieldInfo.code].forecolor=color.forecolor.value;
																}
															});
													}
													else
													{
														if (fieldInfo.code in result)
														{
															result[fieldInfo.code].backcolor=color.backcolor.value;
															result[fieldInfo.code].forecolor=color.forecolor.value;
														}
													}
													break;
											}
										})(vars.fieldInfos.parallelize[color.field.value]);
								});
								setting.display.value.map((item) => item.value).each((display,index) => {
									switch (workplace)
									{
										case 'record':
											((vars.mobile)?kintone.mobile.app.record:kintone.app.record).setFieldShown(display.field.value,(display.state.value=='show'));
											break;
										case 'view':
											if (display.field.value in vars.fieldInfos.groups)
											{
												vars.fieldInfos.groups[display.field.value].fields.map((item) => item.code).each((field,index) => {
													if (field in vars.fieldInfos.parallelize)
														if (field in result)
															result[field].hidden=(display.state.value=='hide');
												});
											}
											else
											{
												if (display.field.value in vars.fieldInfos.tables)
												{
													if (display.field.value in result)
														result[display.field.value].hidden=(display.state.value=='hide');
												}
												else
												{
													((fieldInfo) => {
														if (fieldInfo.tableCode)
														{
															if (fieldInfo.tableCode in result)
																result[fieldInfo.tableCode].value.each((row,index) => {
																	if (fieldInfo.code in row.value)
																		row.value[fieldInfo.code].hidden=(display.state.value=='hide');
																});
														}
														else
														{
															if (fieldInfo.code in result)
																result[fieldInfo.code].hidden=(display.state.value=='hide');
														}
													})(vars.fieldInfos.parallelize[display.field.value]);
												}
											}
											break;
									}
								});
								setting.toggle.value.map((item) => item.value).each((toggle,index) => {
									switch (workplace)
									{
										case 'record':
											((vars.mobile)?kintone.mobile.app.record:kintone.app.record).setGroupFieldOpen(toggle.field.value,(toggle.state.value=='open'));
											break;
									}
								});
								if (['create','edit'].includes(vars.type))
									setting.editable.value.map((item) => item.value).each((editable,index) => {
										if (editable.field.value in vars.fieldInfos.parallelize)
											((fieldInfo) => {
												if (!vars.fieldInfos.disables.includes(fieldInfo.code))
												{
													if (fieldInfo.tableCode)
													{
														if (fieldInfo.tableCode in result)
															result[fieldInfo.tableCode].value.each((row,index) => {
																if (fieldInfo.code in row.value)
																{
																	row.value[fieldInfo.code].disabled=(editable.state.value=='disable');
																	if (workplace=='record') performed=true;
																}
															});
													}
													else
													{
														if (fieldInfo.code in result)
														{
															result[fieldInfo.code].disabled=(editable.state.value=='disable');
															if (workplace=='record') performed=true;
														}
													}
												}
											})(vars.fieldInfos.parallelize[editable.field.value]);
									});
							}
							finish();
						})
						.catch((error) => {
							kb.alert(kb.error.parse(error));
							reject();
						});
					}
					else finish();
				})(settings[index]);
			};
			recurse(0,() => resolve({performed:performed}));
		});
	};
	kintone.events.on([
		'app.record.create.show',
		'app.record.detail.show',
		'app.record.edit.show',
		'app.record.print.show',
		'mobile.app.record.create.show',
		'mobile.app.record.detail.show',
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
						if (e.reuse)
						{
							((setting) => {
								if ('reusecolor' in setting)
									if (setting.reusecolor.value)
										kintone.app.record.getHeaderMenuSpaceElement().nextSibling.firstElementChild.css({backgroundColor:setting.reusecolor.value});
							})(JSON.parse(config.flat));
						}
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
										if (['create','edit'].includes(vars.type))
										{
											kintone.events.on(fieldInfos.changes.reduce((result,current) => {
												result.push('app.record.create.change.'+current);
												result.push('app.record.edit.change.'+current);
												result.push('mobile.app.record.create.change.'+current);
												result.push('mobile.app.record.edit.change.'+current);
												return result;
											},[]),(e) => {
												apply(settings,e.record,'record')
												.then((resp) => {
													if (resp.performed) ((vars.mobile)?kintone.mobile.app.record:kintone.app.record).set(e);
												})
												.catch(() => {});
												return e;
											});
										}
										apply(settings,e.record,'record').then((resp) => resolve(e)).catch(() => {});
									}
									else resolve(e);
								})(JSON.parse(config.tab).reduce((result,current) => {
									if (((vars.mobile)?['both','mobile']:['both','pc']).includes(current.setting.device.value) && current.setting.page.value.includes(vars.type)) result.push(current.setting);
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
			})(e.type.split('.').first()=='mobile',e.type.split('.').slice(-2).first());
		});
	});
	kb.event.on('kb.style.call',(e) => {
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
								if (settings.length!=0) apply(settings,e.record,(e.workplace)?e.workplace:'record').then((resp) => resolve(e)).catch(() => {});
								else resolve(e);
							})(JSON.parse(config.tab).reduce((result,current) => {
								if (((e.mobile)?['both','mobile']:['both','pc']).includes(current.setting.device.value) && current.setting.page.value.includes(e.pattern)) result.push(current.setting);
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
