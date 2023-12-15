/*
* FileName "plugins.linkage.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	var apply=(setting,record) => {
		return new Promise((resolve,reject) => {
			kb.field.load(setting.app.value).then((fieldInfos) => {
				((fields) => {
					if (setting.criteria.value.some((item) => !((item.value.external.value in fields.external) && (item.value.internal.value in fields.internal))))
					{
						kb.alert('No field to linkage was found');
						reject();
						return;
					}
					if (setting.mapping.value.some((item) => !(item.value.external.value in fields.external)))
					{
						kb.alert('No field to linkage was found');
						reject();
						return;
					}
					((query) => {
						kb.view.records.get(setting.app.value,query)
						.then((records) => {
							if (records.length!=0)
							{
								((records,tableCode) => {
									resolve(
										((res) => {
											res.records.sort((a,b) => {
												var res=0;
												setting.sort.value.each((sort,index) => {
													var compa=null;
													var compb=null;
													switch (fieldInfos.parallelize[sort.value.field.value].type)
													{
														case 'CALC':
															switch(fieldInfos.parallelize[sort.value.field.value].format)
															{
																case 'NUMBER':
																case 'NUMBER_DIGIT':
																	compa=(a[sort.value.field.value].value)?parseFloat(a[sort.value.field.value].value):0;
																	compb=(b[sort.value.field.value].value)?parseFloat(b[sort.value.field.value].value):0;
																	break;
																default:
																	break;
															}
															break;
														case 'CATEGORY':
														case 'CHECK_BOX':
														case 'CREATOR':
														case 'FILE':
														case 'GROUP_SELECT':
														case 'MODIFIER':
														case 'MULTI_SELECT':
														case 'ORGANIZATION_SELECT':
														case 'STATUS_ASSIGNEE':
														case 'USER_SELECT':
															compa=JSON.stringify(a[sort.value.field.value].value);
															compb=JSON.stringify(b[sort.value.field.value].value);
															break;
														case 'NUMBER':
															compa=(a[sort.value.field.value].value)?parseFloat(a[sort.value.field.value].value):0;
															compb=(b[sort.value.field.value].value)?parseFloat(b[sort.value.field.value].value):0;
															break;
														default:
															compa=a[sort.value.field.value].value;
															compb=b[sort.value.field.value].value;
															break;
													}
													switch (sort.value.order.value)
													{
														case 'asc':
															if (compa>compb) res=1;
															if (compa<compb) res=-1;
															break;
														case 'desc':
															if (compa>compb) res=-1;
															if (compa<compb) res=1;
															break;
													}
													if (res) return KB_BREAK;
												});
												return res;
											});
											return res;
										})(records.reduce((result,current) => {
											new Array((tableCode)?current[tableCode].value.length:1).fill().map(() => ({})).each((record,index) => {
												record['$id']=current['$id'];
												for (var key in fieldInfos.parallelize)
													if (fieldInfos.parallelize[key].tableCode)
													{
														if (fieldInfos.parallelize[key].tableCode==tableCode) record[key]=current[tableCode].value[index].value[key];
													}
													else record[key]=current[key];
												result.records.push(record);
											});
											return result;
										},{offset:0,records:[]}))
									);
								})(
									records.reduce((result,current) => {
										var res=kb.filter.scan({fields:fieldInfos.origin},current,query);
										if (res) result.push(res);
										return result;
									},[]),
									((mapping) => {
										return Array.from(new Set(mapping)).join('');
									})(setting.mapping.value.map((item) => fieldInfos.parallelize[item.value.external.value].tableCode))
								);
							}
							else resolve({offset:0,records:[]});
						})
						.catch((error) => {
							kb.alert(kb.error.parse(error));
							reject();
						})
					})(
						setting.criteria.value.reduce((result,current) => {
							result.push(
								kb.filter.query.create(
									fields.external[current.value.external.value],
									current.value.operator.value,
									record[current.value.internal.value]
								)
							);
							return result;
						},kb.filter.query.parse(setting.filter.value).map((item) => fields.external[item.field].code+' '+item.operator+' '+item.value)).join(' and ')
					);
				})({
					external:fieldInfos.parallelize,
					internal:vars.fieldInfos.parallelize
				});
			})
			.catch((error) => {
				kb.alert(kb.error.parse(error));
				reject();
			});
		});
	};
	kintone.events.on([
		'app.record.create.show',
		'app.record.detail.show',
		'app.record.edit.show',
		'app.record.index.show',
		'mobile.app.record.create.show',
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
							try
							{
								((settings) => {
									if (settings.length!=0)
									{
										var deploy=(setting,origin,records) => {
											var tables=Array.from(new Set(setting.mapping.value.map((item) => vars.fieldInfos.parallelize[item.value.internal.value].tableCode))).reduce((result,current) => {
												origin[current].value=[];
												result[current]={
													fields:setting.mapping.value.filter((item) => vars.fieldInfos.parallelize[item.value.internal.value].tableCode==current),
													row:kb.record.create(vars.fieldInfos.origin[current],false)
												};
												return result;
											},{});
											records.each((record,index) => {
												for (var key in tables)
													origin[key].value.push(((row) => {
														tables[key].fields.each((field,index) => {
															if (field.value.internal.value in vars.fieldInfos.parallelize)
																switch (vars.fieldInfos.parallelize[field.value.internal.value].type)
																{
																	case 'lookup':
																		row[field.value.internal.value]=((value) => {
																			return {
																				lookup:true,
																				search:(!('search' in value)?'':value.search),
																				value:value.value
																			};
																		})(record[field.value.external.value]);
																		break;
																	default:
																		row[field.value.internal.value].value=record[field.value.external.value].value;
																		break;
																}
														});
														return {value:row};
													})(kb.extend({},tables[key].row)));
											});
											return origin;
										};
										switch (vars.type)
										{
											case 'create':
											case 'edit':
											case 'detail':
												var recurse=(index) => {
													((setting) => {
														((container) => {
															if (container)
															{
																kb.field.load(setting.app.value).then((fieldInfos) => {
																	((app) => {
																		((table,limit) => {
																			var datas={};
																			var footers={
																				copy:kb.create('button').addClass('kb-linkage-container-button').html(setting.label.value).on('click',(e) => {
																					kb.confirm(setting.message.value,() => {
																						kb.event.call('kb.action.call',{
																							container:kb.elm('body'),
																							record:deploy(setting,((vars.mobile)?kintone.mobile.app.record:kintone.app.record).get().record,datas.records),
																							mobile:vars.mobile,
																							pattern:'change',
																							fields:((tables) => {
																								return tables.reduce((result,current) => {
																									result=result.concat(Object.keys(vars.fieldInfos.tables[current].fields));
																									return result;
																								},tables);
																							})(setting.mapping.value.map((item) => vars.fieldInfos.parallelize[item.value.internal.value].tableCode)),
																							stopPropagation:true,
																							workplace:'record'
																						})
																						.then((param) => {
																							kb.event.call('kb.style.call',{
																								container:param.container,
																								record:param.record,
																								mobile:param.mobile,
																								pattern:(('$id' in param.record)?((param.record['$id'].value)?'edit':'create'):'create'),
																								workplace:param.workplace
																							})
																							.then((param) => {
																								((vars.mobile)?kintone.mobile.app.record:kintone.app.record).set({record:param.record});
																							})
																							.catch(() => {});
																						})
																						.catch(() => {});
																					});
																				}),
																				prev:kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-left').on('click',(e) => {
																					datas.offset-=limit;
																					build();
																				}),
																				next:kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-right').on('click',(e) => {
																					datas.offset+=limit;
																					build();
																				}),
																				reload:kb.create('button').addClass('kb-icon kb-icon-reload').on('click',(e) => {
																					search(((vars.mobile)?kintone.mobile.app.record:kintone.app.record).get().record);
																				}),
																				total:kb.create('span').addClass('kb-linkage-container-monitor').html('')
																			};
																			var build=() => {
																				var records=datas.records.slice(datas.offset,datas.offset+limit);
																				table.clearRows();
																				records.each((record,index) => {
																					((row) => {
																						kb.record.set(row.elm('[form-id=form_'+app.id+']'),app,record)
																						.then(() => {
																							row.elm('.kb-view-row-edit').attr('href',kb.record.page.detail(vars.mobile,app.id,record['$id'].value)).attr('target','_blank');
																							container.parentNode.show();
																						});
																					})(table.addRow());
																				});
																				switch (kb.operator.language)
																				{
																					case 'en':
																						footers.total.html(datas.records.length.toString()+'records in total');
																						break;
																					case 'ja':
																						footers.total.html('総'+datas.records.length.toString()+'行');
																						break;
																					case 'zh':
																						footers.total.html('共'+datas.records.length.toString()+'条记录');
																						break;
																				}
																				if (datas.offset>0) footers.prev.removeAttr('disabled');
																				else footers.prev.attr('disabled','disabled');
																				if (datas.offset+((limit==records.length)?limit:records.length)<datas.records.length) footers.next.removeAttr('disabled');
																				else footers.next.attr('disabled','disabled');
																			};
																			var search=(record) => {
																				apply(setting,record)
																				.then((resp) => {
																					datas=resp;
																					build();
																				})
																				.catch(() => {
																					datas={offset:0,records:[]};
																					build();
																				});
																			};
																			switch (vars.type)
																			{
																				case 'create':
																				case 'edit':
																					container.append(
																						kb.create('div').addClass('kb-linkage-container-footer')
																						.append(footers.total)
																						.append(footers.reload)
																						.append(footers.prev)
																						.append(footers.next)
																						.append(footers.copy)
																					);
																					break;
																				case 'detail':
																					container.append(
																						kb.create('div').addClass('kb-linkage-container-footer')
																						.append(footers.total)
																						.append(footers.reload)
																						.append(footers.prev)
																						.append(footers.next)
																					);
																					break;
																			}
																			kintone.events.on(setting.criteria.value.reduce((result,current) => {
																				result.push('app.record.create.change.'+current.value.internal.value);
																				result.push('app.record.edit.change.'+current.value.internal.value);
																				result.push('mobile.app.record.create.change.'+current.value.internal.value);
																				result.push('mobile.app.record.edit.change.'+current.value.internal.value);
																				return result;
																			},[]),(e) => search(e.record));
																			search(e.record);
																		})(kb.view.create(container.addClass('kb-linkage-container'),app,app.view.id,vars.mobile).elm('.kb-view'),parseInt(setting.limit.value));
																	})({
																		id:setting.app.value,
																		disables:[],
																		fields:fieldInfos.parallelize,
																		view:{
																			id:'linkage_'+setting.app.value+'_'+setting.container.value,
																			buttons:['delete'],
																			fields:setting.mapping.value.map((item) => item.value.external.value),
																			mode:'viewer'
																		}
																	});
																})
																.catch(() => {});
															}
														})(((vars.mobile)?kintone.mobile.app.record:kintone.app.record).getSpaceElement(setting.container.value));
														index++;
														if (index<settings.length) recurse(index);
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
																		'kb-linkage-button'+index.toString(),
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
																					apply(setting,records[index])
																					.then((resp) => {
																						puts.push(kb.view.records.transform(deploy(setting,records[index],resp.records)));
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
									switch (vars.type)
									{
										case 'index':
											if (current.bulk.value.includes('bulk')) result.push(current);
											break;
										default:
											result.push(current);
											break;
									}
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
})(kintone.$PLUGIN_ID);
