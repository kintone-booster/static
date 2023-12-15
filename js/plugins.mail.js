/*
* FileName "plugins.mail.js"
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
			var passphrase='';
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
								var assign=(target,record,row) => {
									if (setting.format.value=='HTML') target=target.replace(/\r/g,'').replace(/\n/g,'<br>');
									for (var key in record)
										target=target.replace(new RegExp('%'+key+'%','g'),kb.field.stringify(vars.fieldInfos.parallelize[key],record[key].value,' / '));
									for (var key in row)
										target=target.replace(new RegExp('%'+key+'%','g'),kb.field.stringify(vars.fieldInfos.parallelize[key],row[key].value,' / '));
									return target;
								};
								((bodies) => {
									var send=(index) => {
										((body) => {
											var download=(index,callback) => {
												if (body.attachment.length!=0)
												{
													kb.file.download(body.attachment[index],true)
													.then((resp) => {
														kb.field.blobToBase64(resp,(base64) => {
															body.attachment[index].data=base64;
															index++;
															if (index<body.attachment.length) download(index,callback);
															else callback();
														})
													})
													.catch((error) => {
														kb.alert(kb.error.parse(error));
														reject();
													});
												}
												else callback();
											};
											download(0,() => {
												kb.encrypt(JSON.stringify(body.data),passphrase).then((encrypted) => {
													fetch(
														'https://api.kintone-booster.com/mail/'+kb.operator.language,
														{
															method:'POST',
															headers:{
																'X-Requested-With':'XMLHttpRequest'
															},
															body:JSON.stringify((() => {
																body.data=encrypted.data;
																body.iv=encrypted.iv;
																body.tag=encrypted.tag;
																return body;
															})())
														}
													)
													.then((response) => {
														response.json().then((json) => {
															switch (response.status)
															{
																case 200:
																	index++;
																	if (index<bodies.length) send(index);
																	else finish();
																	break;
																default:
																	kb.alert(kb.error.parse(json));
																	reject();
																	break;
															}
														});
													})
													.catch((error) => {
														kb.alert(kb.error.parse(error));
														reject();
													});
												})
												.catch((error) => {
													reject();
												});
											});
										})(bodies[index]);
									};
									if (bodies.length!=0) send(0);
									else finish();
								})((() => {
									var res=[];
									((vars.fieldInfos.parallelize[setting.to.value].tableCode)?result[vars.fieldInfos.parallelize[setting.to.value].tableCode].value:[{value:result}]).each((record,index) => {
										if (record.value[setting.to.value].value)
											res.push({
												data:{
													mail:setting.mail.value,
													sender:setting.sender.value,
													host:setting.host.value,
													port:setting.port.value,
													author:setting.author.value,
													pwd:setting.pwd.value,
													secure:setting.secure.value,
													to:record.value[setting.to.value].value,
													cc:setting.cc.value,
													bcc:setting.bcc.value,
													html:(setting.format.value=='HTML')
												},
												subject:assign(setting.subject.value,result,(vars.fieldInfos.parallelize[setting.to.value].tableCode)?record.value:{}),
												body:assign(setting.body.value,result,(vars.fieldInfos.parallelize[setting.to.value].tableCode)?record.value:{}),
												attachment:(() => {
													var res=[];
													if (setting.attachment.value)
														if (setting.attachment.value in vars.fieldInfos.parallelize)
															res=((record) => {
																return record[setting.attachment.value].value;
															})(((vars.fieldInfos.parallelize[setting.attachment.value].tableCode)?record.value:result));
													return res;
												})()
											});
									});
									return res;
								})());
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
			fetch(
				'https://api.kintone-booster.com/mail/'+kb.operator.language,
				{
					method:'GET',
					headers:{
						'X-Requested-With':'XMLHttpRequest'
					}
				}
			)
			.then((response) => {
				response.json().then((json) => {
					switch (response.status)
					{
						case 200:
							passphrase=json.passphrase;
							if (!silent) kb.loadStart();
							recurse(0,() => {
								if (!silent) kb.loadEnd();
								resolve();
							});
							break;
						default:
							kb.alert(kb.error.parse(json));
							reject();
							break;
					}
				});
			})
			.catch((error) => {
				kb.alert(kb.error.parse(error));
				reject();
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
																		'kb-mail-button'+index.toString(),
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
																		'kb-mail-button'+index.toString(),
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
	kb.event.on('kb.mail.call',(e) => {
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
