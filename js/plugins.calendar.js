/*
* FileName "plugins.calendar.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	var apply=(container,setting) => {
		((viewInfo) => {
			var calendar=new FullCalendar.Calendar(container.addClass('kb-calendar'),{
				buttonText:(() => {
					var res={};
					switch (kb.operator.language)
					{
						case 'en':
							res={month:'month',week:'week',day:'day'};
							break;
						case 'ja':
							res={month:'月',week:'週',day:'日'};
							break;
						case 'zh':
							res={month:'月',week:'周',day:'日'};
							break;
					}
					return res;
				})(),
				customButtons:{
					pickup:{
						text:'',
						click:(e) => {
							kb.pickupDate(calendar.getDate().format('Y-m-d'),(date) => {
								calendar.gotoDate(new Date(date));
							});
						}
					}
				},
				editable:viewInfo.editable,
				eventDurationEditable:(!viewInfo.singleDay),
				firstDay:parseInt((setting.first || {value:'0'}).value),
				headerToolbar:{
					left:'prev,next,pickup,title',
					right:Object.values(viewInfo.type).join(',')
				},
				initialDate:viewInfo.session.date,
				initialView:((initial) => {
					var res='';
					switch (initial)
					{
						case 'day':
							res=viewInfo.type.day;
							break;
						case 'month':
							res=viewInfo.type.month;
							break;
						case 'week':
							res=viewInfo.type.week;
							break;
						default:
							res=initial;
							break;
					}
					return res;
				})(viewInfo.session.initial),
				navLinks:true,
				nowIndicator:((!viewInfo.singleDay)?(viewInfo.time.start || viewInfo.time.end):false),
				selectable:viewInfo.editable,
				timeZone:'local',
				datesSet:(info) => {
					sessionStorage.setItem('kb-calendar-'+setting.view.value,JSON.stringify({date:calendar.getDate().toISOString(),initial:info.view.type}));
					window.scrollTo(0,0);
				},
				eventChange:(info) => {
					kb.view.records.set(
						vars.app.id,
						{
							put:(() => {
								var res={id:info.event.extendedProps.recordId,record:{}};
								((changed) => {
									if (!viewInfo.tableCode) res.record[setting.start.value]={value:(viewInfo.time.start)?changed.start.toISOString():changed.start.format('Y-m-d')};
									else
									{
										res.record[viewInfo.tableCode]={value:vars.records[info.event.extendedProps.recordId][viewInfo.tableCode].value.map((item) => {
											if (item.id==info.event.extendedProps.rowId) item.value[setting.start.value]={value:(viewInfo.time.start)?changed.start.toISOString():changed.start.format('Y-m-d')};
											return item;
										})};
									}
									if (!viewInfo.singleDay)
									{
										if (!viewInfo.tableCode) res.record[setting.end.value]={value:(viewInfo.time.end)?changed.end.toISOString():changed.end.format('Y-m-d')};
										else
										{
											res.record[viewInfo.tableCode]={value:vars.records[info.event.extendedProps.recordId][viewInfo.tableCode].value.map((item) => {
												if (item.id==info.event.extendedProps.rowId) item.value[setting.end.value]={value:(viewInfo.time.end)?changed.end.toISOString():changed.end.format('Y-m-d')};
												return item;
											})};
										}
									}
								})({
									start:info.event.start,
									end:(() => {
										var res=null;
										if (!viewInfo.singleDay)
										{
											if (viewInfo.time.end) res=info.event.end;
											else
											{
												if (viewInfo.time.start)
												{
													if (info.event.end.getHours()+info.event.end.getMinutes()==0) res=info.event.end.calc('-1 day');
													else res=info.event.end;
												}
												else res=info.event.end.calc(((info.event.allDay)?'-1':'0')+' day');
											}
										}
										return res;
									})()
								});
								return [res];
							})()
						}
					)
					.then((resp) => {})
					.catch((error) => kb.alert(kb.error.parse(error)))
				},
				eventDidMount:(info) => {
					info.el.elms('.fc-event-time,.fc-event-title').each((element,index) => {
						element
						.on('touchstart,mousedown',(e) => {
							e.stopPropagation();
						})
						.on('click',(e) => {
							kb.confirm(kb.constants.calendar.message.confirm.edit[kb.operator.language],() => {
								((isDetail) => {
									if (!isDetail) sessionStorage.setItem('kb-calendar-edit',JSON.stringify({href:window.location.href}));
									window.location.href=info.event.extendedProps.url;
								})((setting.page || {value:[]}).value.includes('detail'));
							});
							e.stopPropagation();
							e.preventDefault();
						})
					});
				},
				events:(info,success,failure) => {
					kb.view.records.get(
						vars.app.id,
						((query) => {
							var res=[];
							var stringify=(type,date,pattern) => {
								var res='';
								if (viewInfo.timeStamp[type]) res=(((viewInfo.time[type])?date.calc(pattern+' second').getTime():date.calc(pattern+' day').getTime())/1000).toString();
								else res='"'+((viewInfo.time[type])?date.calc(pattern+' second').toISOString():date.calc(pattern+' day').format('Y-m-d'))+'"';
								return res;
							};
							res.push((() => {
								var res=[];
								res.push(setting.start.value+((viewInfo.tableCode)?' not in ("")':'!=""'));
								res.push(setting.start.value+'>'+stringify('start',info.start,'-1'));
								res.push(setting.start.value+'<'+stringify('start',info.end,'1'));
								return '('+res.join(' and ')+')';
							})());
							if (!viewInfo.singleDay)
							{
								res.push((() => {
									var res=[];
									res.push(setting.end.value+((viewInfo.tableCode)?' not in ("")':'!=""'));
									res.push(setting.end.value+'>'+stringify('end',info.start,'-1'));
									res.push(setting.end.value+'<'+stringify('end',info.end,'1'));
									return '('+res.join(' and ')+')';
								})());
								res.push((() => {
									var res=[];
									res.push(setting.start.value+'<'+stringify('start',info.start,'0'));
									res.push(setting.end.value+'>'+stringify('end',info.end,'0'));
									return '('+res.join(' and ')+')';
								})());
							}
							return ((query)?'('+query+') and ':'')+'('+res.join(' or ')+')';
						})(((vars.mobile)?kintone.mobile.app:kintone.app).getQueryCondition())
					)
					.then((records) => {
						var recurse=(index,callback) => {
							var finish=() => {
								index++;
								if (index<records.length) recurse(index,callback);
								else callback();
							};
							kb.event.call('kb.style.call',{container:kb.elm('body'),record:records[index],mobile:vars.mobile,pattern:'detail',workplace:'view'})
							.then((param) => finish())
							.catch((error) => finish());
						};
						vars.records={};
						if (records.length!=0)
						{
							recurse(0,() => {
								success(((records) => {
									return records.map((item) => {
										return {
											title:kb.field.stringify(vars.fieldInfos.parallelize[setting.title.value],item[setting.title.value].value,' / '),
											start:((value) => {
												var res=value;
												if (!viewInfo.singleDay)
													if (!viewInfo.time.start)
														if (viewInfo.time.end) res=new Date(res).calc(kb.timezoneOffset()+' hour').toISOString();
												return res;
											})(item[setting.start.value].value),
											end:((value) => {
												var res=value;
												if (!viewInfo.singleDay)
													if (viewInfo.time.start)
													{
														if (!viewInfo.time.end) res=new Date(res).calc('1 day').calc(kb.timezoneOffset()+' hour').toISOString();
													}
													else
													{
														if (!viewInfo.time.end) res=new Date(res).calc('1 day').format('Y-m-d');
													}
												return res;
											})((!viewInfo.singleDay)?item[setting.end.value].value:null),
											backgroundColor:item[setting.title.value].backcolor,
											borderColor:item[setting.title.value].backcolor,
											textColor:item[setting.title.value].forecolor,
											extendedProps:{
												recordId:item['$id'].value,
												rowId:(('$rowId' in item)?item['$rowId']:-1),
												url:((isDetail,addId,recordId) => {
													return (isDetail)?kb.record.page.detail(vars.mobile,addId,recordId):kb.record.page.edit(vars.mobile,addId,recordId);
												})((setting.page || {value:[]}).value.includes('detail'),kb.config[PLUGIN_ID].app,item['$id'].value),
											}
										};
									});
								})(records.reduce((result,current) => {
									vars.records[current['$id'].value]=current;
									if (viewInfo.tableCode)
									{
										result=result.concat(current[viewInfo.tableCode].value.map((item) => {
											item.value['$id']=current['$id'];
											item.value['$rowId']=item.id;
											return item.value;
										}));
									}
									else result.push(current);
									return result;
								},[])));
							});
						}
						else success([]);
					})
					.catch((error) => kb.alert(kb.error.parse(error)))
				},
				select:(info) => {
					((selected) => {
						if (viewInfo.singleDay)
						{
							if (selected.start.format('Y-m-d')==selected.end.format('Y-m-d'))
							{
								kb.confirm(
									(() => {
										var res=kb.constants.calendar.message.confirm.create.single[kb.operator.language];
										res=res.replace(/%date%/,selected.start.format((viewInfo.time.start)?'Y-m-d H:i':'Y-m-d'));
										return res;
									})(),
									() => {
										sessionStorage.setItem('kb-calendar-create',JSON.stringify({
											href:window.location.href,
											start:{
												code:setting.start.value,
												tableCode:viewInfo.tableCode,
												value:(viewInfo.time.start)?selected.start.toISOString():selected.start.format('Y-m-d')
											}
										}));
										window.location.href=kb.record.page.add(vars.mobile,kb.config[PLUGIN_ID].app);
									}
								);
							}
						}
						else
						{
							kb.confirm(
								(() => {
									var res=kb.constants.calendar.message.confirm.create.multi[kb.operator.language];
									res=res.replace(/%start%/,selected.start.format((viewInfo.time.start)?'Y-m-d H:i':'Y-m-d'));
									res=res.replace(/%end%/,selected.end.format((viewInfo.time.end)?'Y-m-d H:i':'Y-m-d'));
									return res;
								})(),
								() => {
									sessionStorage.setItem('kb-calendar-create',JSON.stringify({
										href:window.location.href,
										start:{
											code:setting.start.value,
											tableCode:viewInfo.tableCode,
											value:(viewInfo.time.start)?selected.start.toISOString():selected.start.format('Y-m-d')
										},
										end:{
											code:setting.end.value,
											tableCode:viewInfo.tableCode,
											value:(viewInfo.time.end)?selected.end.toISOString():selected.end.format('Y-m-d')
										}
									}));
									window.location.href=kb.record.page.add(vars.mobile,kb.config[PLUGIN_ID].app);
								}
							);
						}
					})({
						start:info.start,
						end:(viewInfo.time.end)?info.end:info.end.calc(((info.allDay)?'-1':'0')+' day')
					});
					calendar.unselect();
				}
			});
			calendar.setOption('locale',kb.operator.language);
			calendar.render();
		})(((timeInfos) => {
			return {
				editable:(timeInfos.start.isEditable && timeInfos.end.isEditable),
				singleDay:(!setting.end.value),
				session:((session) => {
					return (session)?JSON.parse(session):{date:new Date().format('Y-m-d'),initial:setting.initial.value};
				})(sessionStorage.getItem('kb-calendar-'+setting.view.value)),
				tableCode:vars.fieldInfos.parallelize[setting.title.value].tableCode,
				time:{
					start:timeInfos.start.isDateTime,
					end:timeInfos.end.isDateTime
				},
				timeStamp:{
					start:timeInfos.start.isTimeStamp,
					end:timeInfos.end.isTimeStamp
				},
				type:{
					month:'dayGridMonth',
					week:((setting.end.value)?((timeInfos.start.isDateTime || timeInfos.end.isDateTime)?'timeGridWeek':'dayGridWeek'):'dayGridWeek'),
					day:((setting.end.value)?((timeInfos.start.isDateTime || timeInfos.end.isDateTime)?'timeGridDay':'dayGridDay'):'dayGridDay')
				}
			};
		})({
			start:((fieldInfo) => {
				switch (fieldInfo.type)
				{
					case 'CALC':
						switch (fieldInfo.format)
						{
							case 'DATE':
								fieldInfo.isDateTime=false;
								fieldInfo.isEditable=false;
								break;
							case 'DATETIME':
								fieldInfo.isDateTime=true;
								fieldInfo.isEditable=false;
								break;
						}
						fieldInfo.isTimeStamp=true;
						break;
					case 'CREATED_TIME':
					case 'UPDATED_TIME':
						fieldInfo.isDateTime=true;
						fieldInfo.isEditable=false;
						fieldInfo.isTimeStamp=false;
						break;
					case 'DATE':
						fieldInfo.isDateTime=false;
						fieldInfo.isEditable=true;
						fieldInfo.isTimeStamp=false;
						break;
					case 'DATETIME':
						fieldInfo.isDateTime=true;
						fieldInfo.isEditable=true;
						fieldInfo.isTimeStamp=false;
						break;
				}
				return fieldInfo;
			})(vars.fieldInfos.parallelize[setting.start.value]),
			end:((fieldInfo) => {
				switch (fieldInfo.type)
				{
					case 'CALC':
						switch (fieldInfo.format)
						{
							case 'DATE':
								fieldInfo.isDateTime=false;
								fieldInfo.isEditable=false;
								break;
							case 'DATETIME':
								fieldInfo.isDateTime=true;
								fieldInfo.isEditable=false;
								break;
						}
						fieldInfo.isTimeStamp=true;
						break;
					case 'CREATED_TIME':
					case 'UPDATED_TIME':
						fieldInfo.isDateTime=true;
						fieldInfo.isEditable=false;
						fieldInfo.isTimeStamp=false;
						break;
					case 'DATE':
						fieldInfo.isDateTime=false;
						fieldInfo.isEditable=true;
						fieldInfo.isTimeStamp=false;
						break;
					case 'DATETIME':
						fieldInfo.isDateTime=true;
						fieldInfo.isEditable=true;
						fieldInfo.isTimeStamp=false;
						break;
					default:
						fieldInfo.isDateTime=false;
						fieldInfo.isEditable=true;
						fieldInfo.isTimeStamp=false;
						break;
				}
				return fieldInfo;
			})((setting.end.value)?vars.fieldInfos.parallelize[setting.end.value]:{type:''})
		}));
	};
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
							vars.records={};
							try
							{
								((setting) => {
									if (setting)
									{
										if (setting.title.value)
											if (!(setting.title.value in vars.fieldInfos.parallelize))
											{
												resolve(e);
											}
										if (setting.start.value)
											if (!(setting.start.value in vars.fieldInfos.parallelize))
											{
												resolve(e);
											}
										if (setting.end.value)
											if (!(setting.end.value in vars.fieldInfos.parallelize))
											{
												resolve(e);
											}
										((container) => {
											if (container) apply(container,setting);
										})(kb.elm('#kb-calendar'));
										resolve(e);
									}
									else resolve(e);
								})(JSON.parse(config.tab).map((item,index) => kb.extend({sIndex:{value:index.toString()}},item.setting)).reduce((result,current) => {
									if (current.view.value==e.viewId.toString()) result=current;
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
	kintone.events.on([
		'app.record.create.show',
		'mobile.app.record.create.show'
	],(e) => {
		return new Promise((resolve,reject) => {
			((param) => {
				if (param)
				{
					((param) => {
						if (param.start) ((param.start.tableCode)?e.record[param.start.tableCode].value.first().value[param.start.code]:e.record[param.start.code]).value=param.start.value;
						if (param.end) ((param.end.tableCode)?e.record[param.end.tableCode].value.first().value[param.end.code]:e.record[param.end.code]).value=param.end.value;
						kintone.events.on([
							'app.record.create.submit.success',
							'mobile.app.record.create.submit.success'
						],(e) => {
							return new Promise((resolve,reject) => {
								e.url=param.href;
								resolve(e);
							});
						});
					})(JSON.parse(param));
					sessionStorage.removeItem('kb-calendar-create');
					resolve(e);
				}
				else resolve(e);
			})(sessionStorage.getItem('kb-calendar-create'));
		});
	});
	kintone.events.on([
		'app.record.edit.show',
		'mobile.app.record.edit.show'
	],(e) => {
		return new Promise((resolve,reject) => {
			((param) => {
				if (param)
				{
					((param) => {
						((button) => {
							button.parentNode.insertBefore(button.clone().removeAttr('disabled').on('click',(e) => {
								window.location.href=param.href;
							}),button.hide().nextElementSibling);
						})(kb.elm((e.type.split('.').first()=='mobile')?'.gaia-mobile-v2-app-record-edittoolbar-cancel':'.gaia-ui-actionmenu-cancel'));
						kintone.events.on([
							'app.record.edit.submit.success',
							'mobile.app.record.edit.submit.success'
						],(e) => {
							return new Promise((resolve,reject) => {
								e.url=param.href;
								resolve(e);
							});
						});
					})(JSON.parse(param));
					sessionStorage.removeItem('kb-calendar-edit');
					resolve(e);
				}
				else resolve(e);
			})(sessionStorage.getItem('kb-calendar-edit'));
		});
	});
})(kintone.$PLUGIN_ID);
/*
Message definition by language
*/
kb.constants=kb.extend({
	calendar:{
		message:{
			confirm:{
				create:{
					multi:{
						en:'Start Date: %start%<br>End Date: %end%<br>Would you like to add a record with the above details?',
						ja:'開始日付: %start%<br>終了日付: %end%<br>上記内容でレコードを追加しますか？',
						zh:'开始日期: %start%<br>结束日期: %end%<br>您想根据上述内容添加记录吗？'
					},
					single:{
						en:'Date: %date%<br>Would you like to add a record with the above content?',
						ja:'日付: %date%<br>上記内容でレコードを追加しますか？',
						zh:'日期: %date%<br>您想添加上述内容的记录吗？'
					}
				},
				edit:{
					en:'Do you want to edit the record?',
					ja:'レコードを編集しますか？',
					zh:'您想编辑这条记录吗？'
				}
			}
		}
	}
},kb.constants);
