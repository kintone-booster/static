/*
* FileName "plugins.calendar.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	kb.field.load(kintone.app.getId()).then((fieldInfos) => {
		kb.view.load(kintone.app.getId()).then((viewInfos) => {
			kb.config[PLUGIN_ID].build(
				{
					submit:(container,config) => {
						try
						{
							var error=false;
							config.tab=[];
							config.flat={};
							((app) => {
								kb.config[PLUGIN_ID].tabbed.tabs.some((item) => {
									var res=kb.record.get(item.panel,app);
									if (!res.error)
									{
										if (((record) => {
											var res=[];
											if (record.title.value) res.push(fieldInfos.parallelize[record.title.value].tableCode);
											if (record.start.value) res.push(fieldInfos.parallelize[record.start.value].tableCode);
											if (record.end.value) res.push(fieldInfos.parallelize[record.end.value].tableCode);
											return Array.from(new Set(res));
										})(res.record).length>1)
										{
											kb.alert(kb.constants.config.message.invalid.table[kb.operator.language]);
											kb.config[PLUGIN_ID].tabbed.activate(item);
											error=true;
										}
										else config.tab.push({label:item.label.html(),setting:res.record});
									}
									else
									{
										kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]);
										kb.config[PLUGIN_ID].tabbed.activate(item);
										error=true;
									}
									return error;
								});
								if (config.tab.length!=Array.from(new Set(config.tab.map((item) => item.setting.view.value))).length)
								{
									kb.alert(kb.constants.config.message.invalid.duplicate[kb.operator.language]);
									error=true;
								}
							})({
								id:vars.app.id,
								fields:vars.app.fields.tab
							});
							config.tab=JSON.stringify(config.tab);
							config.flat=JSON.stringify(config.flat);
							return !(error)?config:false;
						}
						catch(error)
						{
							kb.alert(kb.error.parse(error));
							return false;
						}
					}
				},
				(container,config) => {
					try
					{
						vars.app={
							id:PLUGIN_ID,
							fields:{
								tab:{
									view:{
										code:'view',
										type:'DROP_DOWN',
										label:'',
										required:true,
										noLabel:true,
										options:[]
									},
									title:{
										code:'title',
										type:'DROP_DOWN',
										label:'',
										required:true,
										noLabel:true,
										options:[]
									},
									start:{
										code:'start',
										type:'DROP_DOWN',
										label:'',
										required:true,
										noLabel:true,
										options:[]
									},
									end:{
										code:'end',
										type:'DROP_DOWN',
										label:'',
										required:false,
										noLabel:true,
										options:[]
									},
									initial:{
										code:'initial',
										type:'RADIO_BUTTON',
										label:'',
										required:true,
										noLabel:true,
										options:[
											{index:0,label:'month'},
											{index:1,label:'week'},
											{index:2,label:'day'}
										]
									},
									first:{
										code:'first',
										type:'RADIO_BUTTON',
										label:'',
										required:true,
										noLabel:true,
										options:[
											{index:0,label:'0'},
											{index:1,label:'1'},
											{index:2,label:'2'},
											{index:3,label:'3'},
											{index:4,label:'4'},
											{index:5,label:'5'},
											{index:6,label:'6'}
										]
									},
									page:{
										code:'page',
										type:'CHECK_BOX',
										label:'',
										required:false,
										noLabel:true,
										options:[
											{index:0,label:'detail'}
										]
									}
								},
								flat:{
								}
							}
						};
						var setup=(tab,app,record) => {
							kb.record.set(tab.panel,app,record);
						};
						/* tabbed */
						kb.config[PLUGIN_ID].tabbed=new KintoneBoosterConfigTabbed(
							container,
							{
								add:(tab) => {
									((app) => {
										tab.panel.addClass('kb-scope').attr('form-id','form_'+app.id)
										.append(kb.create('h1').html(kb.constants.config.caption.view[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.create('p').html(kb.constants.config.description.view[kb.operator.language]))
											.append(kb.field.activate(((res) => {
												res.elm('select').empty().assignOption(([{code:'',label:''}]).concat(viewInfos.custom.map((item) => {
													return {code:item.id,label:item.name};
												})),'label','code');
												return res;
											})(kb.field.create(app.fields.view)),app))
										)
										.append(kb.create('h1').html(kb.constants.config.caption.title[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.create('p').html(kb.constants.config.description.title[kb.operator.language]))
											.append(kb.field.activate(((res) => {
												res.elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
													result.push({code:current.code,label:current.label});
													return result;
												}),'label','code');
												return res;
											})(kb.field.create(app.fields.title)),app))
										)
										.append(kb.create('h1').html(kb.constants.config.caption.start[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.create('p').html(kb.constants.config.description.start[kb.operator.language]))
											.append(kb.field.activate(((res) => {
												res.elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
													switch (current.type)
													{
														case 'CALC':
															switch (current.format)
															{
																case 'DATE':
																case 'DATETIME':
																	result.push({code:current.code,label:current.label});
																	break;
															}
															break;
														case 'CREATED_TIME':
														case 'DATE':
														case 'DATETIME':
														case 'UPDATED_TIME':
															result.push({code:current.code,label:current.label});
															break;
													}
													return result;
												}),'label','code');
												return res;
											})(kb.field.create(app.fields.start)),app))
										)
										.append(kb.create('h1').html(kb.constants.config.caption.end[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.create('p').html(kb.constants.config.description.end[kb.operator.language]))
											.append(kb.field.activate(((res) => {
												res.elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
													switch (current.type)
													{
														case 'CALC':
															switch (current.format)
															{
																case 'DATE':
																case 'DATETIME':
																	result.push({code:current.code,label:current.label});
																	break;
															}
															break;
														case 'CREATED_TIME':
														case 'DATE':
														case 'DATETIME':
														case 'UPDATED_TIME':
															result.push({code:current.code,label:current.label});
															break;
													}
													return result;
												}),'label','code');
												return res;
											})(kb.field.create(app.fields.end)),app))
										)
										.append(kb.create('h1').html(kb.constants.config.caption.initial[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.create('p').html(kb.constants.config.description.initial[kb.operator.language]))
											.append(kb.field.activate(((res) => {
												res.elms('[data-name='+app.fields.initial.code+']').each((element,index) => {
													element.closest('label').elm('span').html(kb.constants.config.caption.initial[element.val()][kb.operator.language]);
												});
												return res;
											})(kb.field.create(app.fields.initial)),app))
										)
										.append(kb.create('h1').html(kb.constants.config.caption.first[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.create('p').html(kb.constants.config.description.first[kb.operator.language]))
											.append(kb.field.activate(((res) => {
												res.elms('[data-name='+app.fields.first.code+']').each((element,index) => {
													element.closest('label').elm('span').html(kb.constants.weeks[kb.operator.language][parseInt(element.val())]);
												});
												return res;
											})(kb.field.create(app.fields.first)),app))
										)
										.append(kb.create('h1').html(kb.constants.config.caption.page[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.create('p').html(kb.constants.config.description.page[kb.operator.language]))
											.append(kb.field.activate(((res) => {
												res.elms('[type=checkbox]').each((element,index) => {
													element.closest('label').elm('span').html(kb.constants.config.caption.page[element.val()][kb.operator.language]);
												});
												return res;
											})(kb.field.create(app.fields.page)),app))
											.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.page.caution[kb.operator.language]))
										);
										tab.panel.elms('input,select,textarea').each((element,index) => element.initialize());
									})({
										id:vars.app.id,
										fields:vars.app.fields.tab
									});
								},
								copy:(source,destination) => {
									((app) => {
										setup(destination,app,kb.record.get(source.panel,app,true).record);
									})({
										id:vars.app.id,
										fields:vars.app.fields.tab
									});
								},
								del:(index) => {}
							}
						);
						/* setup */
						if (Object.keys(config).length!=0)
						{
							((settings) => {
								settings.each((setting) => {
									((app,tab) => {
										setup(tab,app,setting.setting);
										tab.label.html(setting.label);
									})(
										{
											id:vars.app.id,
											fields:vars.app.fields.tab
										},
										kb.config[PLUGIN_ID].tabbed.add()
									);
								});
							})(JSON.parse(config.tab));
						}
						else kb.config[PLUGIN_ID].tabbed.add();
					}
					catch(error){kb.alert(kb.error.parse(error))}
				}
			);
		});
	});
})(kintone.$PLUGIN_ID);
/*
Message definition by language
*/
kb.constants=kb.extend({
	config:{
		caption:{
			start:{
				en:'Start Date',
				ja:'開始日',
				zh:'开始日期'
			},
			end:{
				en:'End Date',
				ja:'終了日時',
				zh:'结束日期'
			},
			first:{
				en:'The day that each week begins',
				ja:'週の始まり',
				zh:'每周起始日'
			},
			initial:{
				en:'Initial Calendar Display',
				ja:'カレンダーの初期表示',
				zh:'日历的初始显示',
				day:{
					en:'Day',
					ja:'日',
					zh:'日'
				},
				month:{
					en:'Month',
					ja:'月',
					zh:'月'
				},
				week:{
					en:'Week',
					ja:'週',
					zh:'周'
				}
			},
			page:{
				en:'Transition to the editing page',
				ja:'編集画面への遷移',
				zh:'转到编辑页面',
				detail:{
					en:'Go to the detail screen',
					ja:'遷移先ページを詳細画面にする',
					zh:'转到详细屏幕'
				}
			},
			title:{
				en:'Title',
				ja:'タイトル',
				zh:'标题'
			},
			view:{
				en:'View',
				ja:'使用一覧',
				zh:'标题'
			}
		},
		description:{
			start:{
				en:'Please specify the field to use as the Start Date.',
				ja:'開始日として使用するフィールドを指定してください。',
				zh:'请指定作为开始日期的字段。'
			},
			end:{
				en:'Please specify the field to use as the End Date.',
				ja:'終了日として使用するフィールドを指定してください。',
				zh:'请指定作为结束日期的字段。'
			},
			first:{
				en:'Please specify the day that starts the week.',
				ja:'週の始まりとなる曜日を指定して下さい。',
				zh:'请指定一周的开始是哪一天。'
			},
			initial:{
				en:'Please specify the display format of the calendar after showing the list view.',
				ja:'一覧画面を表示した後で表示するカレンダーの表示形式を指定して下さい。',
				zh:'请在显示列表视图后指定日历的显示格式。'
			},
			page:{
				en:'Please check if you want to make the page you transition to by clicking the title part of the event area a detail screen.',
				ja:'イベントエリアのタイトル部分をクリックして遷移するページを詳細画面にする場合は、チェックを付けて下さい。',
				zh:'如果您希望通过点击活动区域的标题部分进行的页面转为详细屏幕，请勾选。',
				caution:{
					en:'If you transition to the detailed view, please note that you will not return to the calendar page after completing the edits or canceling them.',
					ja:'詳細画面に遷移するようにした場合、編集完了・キャンセル後はカレンダーページには戻れませんのでご注意ください。',
					zh:'如果您切换到详细视图，请注意在完成编辑或取消后，您将不会返回到日历页面。'
				}
			},
			title:{
				en:'Please specify the field to use as the Title.',
				ja:'タイトルとして使用するフィールドを指定してください。',
				zh:'请指定作为标题的字段。'
			},
			view:{
				en:'Please specify the list to enable this plugin using the settings below.',
				ja:'以下の設定で、このプラグインを有効にする一覧を指定してください。',
				zh:'请使用以下设置选择启用此插件的列表。'
			}
		},
		message:{
			invalid:{
				duplicate:{
					en:'You cannot specify the same list in different tabs.',
					ja:'異なるタブで同じ一覧を指定することは出来ません。',
					zh:'在不同的标签中不能指定相同的列表。'
				},
				table:{
					en:'Check whether the specified fields are all from the same table or all from outside the table.',
					ja:'指定したフィールドがすべて同じテーブルのものであるか、すべてテーブル外のものであるかを確認してください。',
					zh:'请检查指定的字段是否全部来自同一张表，或者全部来自表外。'
				}
			}
		}
	}
},kb.constants);
