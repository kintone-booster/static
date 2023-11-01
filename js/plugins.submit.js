/*
* FileName "plugins.submit.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	var apply=(settings,record,silent=false,numbering={}) => {
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
								var handlers={
									error:(callback) => {
										try
										{
											if (setting.errorMessage.value || setting.errorField.value.length!=0)
											{
												if (kb.filter.scan(vars.app,record,setting.errorFilter.value))
												{
													setting.errorField.value.each((field,index) => {
														if (field.value.field.value in vars.fieldInfos.parallelize)
															record[field.value.field.value].error=field.value.message.value;
													});
													if (!silent) kb.loadEnd();
													resolve({
														error:true,
														message:setting.errorMessage.value
													});
												}
												else callback();
											}
											else callback();
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									},
									numbering:(callback) => {
										try
										{
											if (setting.numberingField.value in vars.fieldInfos.parallelize)
											{
												if (!record[setting.numberingField.value].value)
												{
													var prefix='';
													var query=setting.numberingGroup.value.reduce((result,current) => {
														if (current.value.field.value in vars.fieldInfos.parallelize)
														{
															prefix+=record[current.value.field.value].value;
															switch (vars.fieldInfos.parallelize[current.value.field.value].type)
															{
																case 'DROP_DOWN':
																case 'RADIO_BUTTON':
																	result.push(current.value.field.value+' in ("'+record[current.value.field.value].value+'")');
																	break;
																default:
																	result.push(current.value.field.value+'="'+record[current.value.field.value].value+'"');
																	break;
															}
														}
														return result;
													},('$id' in record)?['$id!='+record['$id'].value]:[]);
													if (prefix in numbering)
													{
														numbering[prefix]++;
														record[setting.numberingField.value].value=prefix+numbering[prefix].toString().lpad('0',parseInt(setting.numberingDigits.value));
														callback();
													}
													else
													{
														kintone.api(
															kintone.api.url('/k/v1/records',true),
															'GET',
															{
																app:vars.app.id,
																query:query.join(' and ')+' order by '+setting.numberingField.value+' desc limit 1 offset 0'
															}
														)
														.then((resp) => {
															var increment=((records) => {
																var res=0;
																if (records.length!=0) res=parseInt((records.first()[setting.numberingField.value].value || ' ').replace(/[ ]+/g,'').replace(new RegExp('^'+prefix,'g'),''));
																res++;
																return res;
															})(resp.records);
															numbering[prefix]=increment;
															record[setting.numberingField.value].value=prefix+increment.toString().lpad('0',parseInt(setting.numberingDigits.value));
															callback();
														})
														.catch((error) => {
															kb.alert(kb.error.parse(error));
															reject();
														});
													}
												}
												else callback();
											}
											else callback();
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									},
									prompt:(callback) => {
										try
										{
											((fields) => {
												if (fields.length!=0)
												{
													((form) => {
														fields.each((field,index) => {
															form.append(kb.field.activate(kb.field.create(field).css({width:'100%'}),vars.app,false));
														});
														if (!silent) kb.loadEnd();
														(new KintoneBoosterPopupform(form,600,'full',{
															ok:() => {
																var res=kb.record.get(form,vars.app,true);
																fields.each((field,index) => {
																	record[field.code].value=res.record[field.code].value;
																});
																if (!silent) kb.loadStart();
																callback();
															},
															cancel:() => {
																if (!silent) kb.loadStart();
																callback();
															}
														})).show();
													})(kb.create('div').addClass('kb-scope').attr('form-id','form_'+vars.app.id));
												}
												else callback();
											})(setting.promptField.value.reduce((result,current) => {
												if (current.value.field.value in vars.fieldInfos.parallelize)
												{
													if (setting.promptOverwrite.value.includes('overwrite')) result.push(vars.fieldInfos.parallelize[current.value.field.value]);
													else
													{
														if (kb.field.isEmpty(record[current.value.field.value].value))
															result.push(vars.fieldInfos.parallelize[current.value.field.value]);
													}
												}
												return result;
											},[]));
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									},
									verify:(callback) => {
										try
										{
											((fields) => {
												if (fields.length!=0)
												{
													((form) => {
														fields.each((field,index) => {
															form.append(kb.field.activate(kb.field.create(field).addClass('kb-readonly').css({width:'100%'}),vars.app,false));
														});
														kb.record.set(form,vars.app,record);
														if (!silent) kb.loadEnd();
														(new KintoneBoosterPopupform(form,600,'full',{
															ok:() => {
																if (!silent) kb.loadStart();
																callback();
															},
															cancel:() => {
																if (!silent) kb.loadEnd();
																resolve({error:true});
															}
														})).show();
													})(kb.create('div').addClass('kb-scope kb-verify').attr('form-id','form_'+vars.app.id).append(kb.create('p').html(setting.verifyMessage.value)));
												}
												else callback();
											})(setting.verifyField.value.reduce((result,current) => {
												if (current.value.field.value in vars.fieldInfos.parallelize)
													result.push(vars.fieldInfos.parallelize[current.value.field.value]);
												return result;
											},[]));
										}
										catch(error)
										{
											kb.alert(kb.error.parse(error));
											reject();
										}
									}
								};
								handlers.numbering(() => {
									handlers.prompt(() => {
										handlers.verify(() => {
											handlers.error(() => {
												finish();
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
				})(settings[index]);
			};
			if (!silent) kb.loadStart();
			recurse(0,() => {
				if (!silent) kb.loadEnd();
				resolve({error:false});
			});
		});
	};
	kintone.events.on([
		'app.record.create.submit',
		'app.record.detail.process.proceed',
		'app.record.edit.submit',
		'mobile.app.record.create.submit',
		'mobile.app.record.detail.process.proceed',
		'mobile.app.record.edit.submit'
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
												apply(settings,e.record)
												.then((resp) => {
													if (resp.error) e.error=('message' in resp)?resp.message:kb.constants.submit.message.cancel.submit[kb.operator.language];
													resolve(e);
												})
												.catch(() => {
													e.error=kb.constants.submit.message.cancel.submit[kb.operator.language];
													resolve(e);
												});
												((settings) => {
													if (settings.length!=0)
													{
														kintone.events.on(((vars.mobile)?'mobile.':'')+'app.record.'+vars.type+'.submit.success',(e) => {
															return new Promise((resolve,reject) => {
																var assign=(target,record) => {
																	for (var key in record)
																		target=target.replace(new RegExp('%'+key+'%','g'),kb.field.stringify(vars.fieldInfos.parallelize[key],record[key].value,' / '));
																	return target;
																};
																var recurse=(index) => {
																	((setting) => {
																		if (kb.filter.scan(vars.app,e.record,setting.condition.value))
																		{
																			kb.filter.auth(setting.user.value,setting.organization.value,setting.group.value)
																			.then((auth) => {
																				if (auth) e.url=assign(setting.url.value,e.record);
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
															});
														});
													}
												})(settings.filter((item) => item.url.value));
												break;
											case 'process':
												((settings) => {
													if (settings.length!=0)
													{
														apply(settings,e.record)
														.then((resp) => {
															if (resp.error) e.error=('message' in resp)?resp.message:kb.constants.submit.message.cancel.submit[kb.operator.language];
															resolve(e);
														})
														.catch(() => {
															e.error=kb.constants.submit.message.cancel.submit[kb.operator.language];
															resolve(e);
														});
													}
													else resolve(e);
												})(settings.filter((item) => item.action.value==e.action.value+':'+e.status.value+':'+e.nextStatus.value));
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
			})(e.type.split('.').first()=='mobile',e.type.split('.').slice(-2).first());
		});
	});
	kb.event.on('kb.submit.call',(e) => {
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
								if (settings.length!=0)
								{
									apply(settings,e.record,true,e.numbering)
									.then((resp) => {
										if (resp.error)
										{
											e.error=true;
											if (resp.message) kb.alert(resp.message,() => resolve(e));
											else resolve(e);
										}
										else resolve(e);
									})
									.catch(() => {
										e.error=true;
										resolve(e);
									});
								}
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
/*
Message definition by language
*/
kb.constants=kb.extend({
	submit:{
		message:{
			cancel:{
				process:{
					en:'The process action was canceled.',
					ja:'プロセスアクションがキャンセルされました。',
					zh:'进程操作已被取消。'
				},
				submit:{
					en:'The submit was canceled.',
					ja:'保存がキャンセルされました。',
					zh:'保存已被取消。'
				}
			}
		}
	}
},kb.constants);
