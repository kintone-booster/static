/*
* FileName "plugins.submit.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	kb.field.load(kintone.app.getId()).then((fieldInfos) => {
		kb.status.load(kintone.app.getId()).then((statusInfos) => {
			kb.apps.load().then((appInfos) => {
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
											if (!error)
											{
												if (res.record.event.value.includes('process'))
												{
													if (!res.record.action.value)
													{
														kb.alert(kb.constants.config.message.invalid.action[kb.operator.language]);
														kb.config[PLUGIN_ID].tabbed.activate(item);
														error=true;
													}
												}
												else res.record.action.value='';
											}
											if (!error)
											{
												if (res.record.numberingField.value)
												{
													if (!res.record.numberingDigits.value)
													{
														kb.alert(kb.constants.config.message.invalid.numbering[kb.operator.language]);
														kb.config[PLUGIN_ID].tabbed.activate(item);
														error=true;
													}
												}
											}
											if (!error)
											{
												res.record.numberingGroup.value=res.record.numberingGroup.value.filter((item) => item.value.field.value);
												res.record.promptField.value=res.record.promptField.value.filter((item) => item.value.field.value);
												res.record.verifyField.value=res.record.verifyField.value.filter((item) => item.value.field.value);
												res.record.errorField.value=res.record.errorField.value.filter((item) => item.value.field.value).filter((item) => item.value.message.value);
												res.record.duplicateCriteria.value=res.record.duplicateCriteria.value.filter((item) => item.value.external.value).filter((item) => item.value.internal.value);
												config.tab.push({label:item.label.html(),setting:res.record});
											}
										}
										else
										{
											kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]);
											kb.config[PLUGIN_ID].tabbed.activate(item);
											error=true;
										}
										return error;
									});
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
										event:{
											code:'event',
											type:'CHECK_BOX',
											label:'',
											required:true,
											noLabel:true,
											options:[
												{index:0,label:'create'},
												{index:1,label:'edit'},
												{index:2,label:'process'}
											]
										},
										action:{
											code:'action',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.action[kb.operator.language],
											required:false,
											noLabel:false,
											options:[]
										},
										numberingField:{
											code:'numberingField',
											type:'DROP_DOWN',
											label:'',
											required:false,
											noLabel:true,
											options:[]
										},
										numberingGroup:{
											code:'numberingGroup',
											type:'SUBTABLE',
											label:'',
											noLabel:true,
											fields:{
												field:{
													code:'field',
													type:'DROP_DOWN',
													label:'',
													required:false,
													noLabel:true,
													options:[]
												}
											}
										},
										numberingDigits:{
											code:'numberingDigits',
											type:'NUMBER',
											label:'',
											required:false,
											noLabel:true
										},
										promptField:{
											code:'promptField',
											type:'SUBTABLE',
											label:'',
											noLabel:true,
											fields:{
												field:{
													code:'field',
													type:'DROP_DOWN',
													label:'',
													required:false,
													noLabel:true,
													options:[]
												}
											}
										},
										promptOverwrite:{
											code:'promptOverwrite',
											type:'CHECK_BOX',
											label:'',
											required:false,
											noLabel:true,
											options:[
												{index:0,label:'overwrite'}
											]
										},
										verifyField:{
											code:'verifyField',
											type:'SUBTABLE',
											label:'',
											noLabel:true,
											fields:{
												field:{
													code:'field',
													type:'DROP_DOWN',
													label:'',
													required:false,
													noLabel:true,
													options:[]
												}
											}
										},
										verifyMessage:{
											code:'verifyMessage',
											type:'SINGLE_LINE_TEXT',
											label:'',
											required:false,
											noLabel:true,
											placeholder:''
										},
										errorFilter:{
											code:'errorFilter',
											type:'CONDITION',
											label:'',
											required:false,
											noLabel:true,
											app:{
												id:kintone.app.getId(),
												fields:fieldInfos.parallelize
											}
										},
										errorMessage:{
											code:'errorMessage',
											type:'SINGLE_LINE_TEXT',
											label:'',
											required:false,
											noLabel:true,
											placeholder:''
										},
										errorField:{
											code:'errorField',
											type:'SUBTABLE',
											label:'',
											noLabel:true,
											fields:{
												field:{
													code:'field',
													type:'DROP_DOWN',
													label:'',
													required:false,
													noLabel:true,
													options:[]
												},
												message:{
													code:'message',
													type:'SINGLE_LINE_TEXT',
													label:'',
													required:false,
													noLabel:true,
													placeholder:kb.constants.config.prompt.error.message[kb.operator.language]
												}
											}
										},
										duplicateCriteria:{
											code:'duplicateCriteria',
											type:'SUBTABLE',
											label:'',
											noLabel:true,
											fields:{
												external:{
													code:'external',
													type:'DROP_DOWN',
													label:kb.constants.config.caption.duplicate.destination[kb.operator.language],
													required:false,
													noLabel:true,
													options:[]
												},
												operator:{
													code:'operator',
													type:'DROP_DOWN',
													label:'',
													required:false,
													noLabel:true,
													options:[]
												},
												internal:{
													code:'internal',
													type:'DROP_DOWN',
													label:kb.constants.config.caption.duplicate.source[kb.operator.language],
													required:false,
													noLabel:true,
													options:[]
												}
											}
										},
										url:{
											code:'url',
											type:'SINGLE_LINE_TEXT',
											label:'',
											required:false,
											noLabel:true,
											placeholder:kb.constants.config.prompt.url[kb.operator.language]
										}
									},
									flat:{
									}
								}
							};
							var setup=(tab,app,record) => {
								kb.record.set(tab.panel,app,(() => {
									if (record.event.value.includes('process')) tab.panel.elm('[field-id=action]').closest('section').removeClass('kb-hidden');
									return record;
								})())
								.then(() => {
									tab.tables.duplicateCriteria.clearRows();
									record.duplicateCriteria.value.each((values,index) => {
										if (values.value.external.value in fieldInfos.criterias)
											((row) => {
												row.elm('[field-id=external]').elm('select').val(values.value.external.value).rebuild().then((fields) => {
													if (values.value.internal.value in fields)
													{
														row.elm('[field-id=operator]').elm('select').val(values.value.operator.value);
														row.elm('[field-id=internal]').elm('select').val(values.value.internal.value);
													}
												});
											})(tab.tables.duplicateCriteria.addRow());
									});
									if (tab.tables.duplicateCriteria.tr.length==0) tab.tables.duplicateCriteria.addRow();
								});
							};
							((fieldInfos) => {
								for (var key in fieldInfos) vars.app.fields.tab[key]=fieldInfos[key];
							})(kb.config[PLUGIN_ID].ui.fields.conditions.get(fieldInfos));
							((fieldInfos) => {
								for (var key in fieldInfos) vars.app.fields.tab[key]=fieldInfos[key];
							})(kb.config[PLUGIN_ID].ui.fields.users.get(fieldInfos));
							/* tabbed */
							kb.config[PLUGIN_ID].tabbed=new KintoneBoosterConfigTabbed(
								container,
								{
									add:(tab) => {
										((app) => {
											tab.tables={
												numberingGroup:kb.table.activate(kb.table.create(app.fields.numberingGroup),app),
												promptField:kb.table.activate(kb.table.create(app.fields.promptField),app),
												verifyField:kb.table.activate(kb.table.create(app.fields.verifyField),app),
												errorField:kb.table.activate(kb.table.create(app.fields.errorField),app),
												duplicateCriteria:kb.table.create(app.fields.duplicateCriteria,false,false,false).spread((row,index) => {
													/* event */
													row.elm('.kb-table-row-add').on('click',(e) => {
														tab.tables.duplicateCriteria.insertRow(row);
													});
													row.elm('.kb-table-row-del').on('click',(e) => {
														kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
															tab.tables.duplicateCriteria.delRow(row);
														});
													});
													/* modify elements */
													((cells) => {
														cells.external.on('change',(e) => e.currentTarget.rebuild()).rebuild=() => {
															return new Promise((resolve,reject) => {
																cells.operator.empty();
																cells.internal.empty().assignOption([{code:'',label:''}],'label','code');
																if (cells.external.val())
																{
																	resolve((() => {
																		var res={};
																		cells.operator.assignOption(kb.filter.query.operator(fieldInfos.parallelize[cells.external.val()]),'label','code');
																		for (var key in fieldInfos.parallelize)
																			((fieldInfo) => {
																				if (!fieldInfo.tableCode)
																					if (kb.field.typing(fieldInfo,fieldInfos.parallelize[cells.external.val()],true)) res[fieldInfo.code]=fieldInfo;
																			})(fieldInfos.parallelize[key]);
																		cells.internal.assignOption(Object.values(res),'label','code');
																		return res;
																	})());
																}
																else resolve({});
															});
														};
													})({
														external:row.elm('[field-id=external]').elm('select'),
														operator:row.elm('[field-id=operator]').elm('select'),
														internal:row.elm('[field-id=internal]').elm('select')
													});
												},(table,index) => {
													if (table.tr.length==0) table.addRow();
												},false)
											};
											tab.panel.addClass('kb-scope').attr('form-id','form_'+app.id)
											.append(
												kb.config[PLUGIN_ID].ui.fields.users.set(kb.config[PLUGIN_ID].ui.fields.conditions.set(kb.create('div').addClass('kb-config-tabbed-panel-block'),app),app)
												.append(kb.create('h1').html(kb.constants.config.caption.event[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.field.activate(((res) => {
														res.elms('[type=checkbox]').each((element,index) => {
															element.closest('label').elm('span').html(kb.constants.config.caption.event[element.val()][kb.operator.language]);
														});
														return res;
													})(kb.field.create(app.fields.event)),app))
												)
												.append(
													kb.create('section').addClass('kb-hidden')
													.append(kb.field.activate(((res) => {
														res.elm('select').empty().assignOption(([{code:'',label:''}]).concat(statusInfos.actions.map((item) => {
															return {code:item.key,label:item.name+'&nbsp;('+item.from+'&nbsp;&gt;&nbsp;'+item.to+')'};
														})),'label','code');
														return res;
													})(kb.field.create(app.fields.action)),app))
												)
											)
											.append(kb.create('h1').html(kb.constants.config.caption.numbering[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.create('h1').html(kb.constants.config.caption.numbering.field[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.field.activate(((res) => {
														res.elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
															switch (current.type)
															{
																case 'SINGLE_LINE_TEXT':
																	if (!current.tableCode)
																		if (!current.expression) result.push({code:current.code,label:current.label});
																	break;
															}
															return result;
														}),'label','code');
														return res;
													})(kb.field.create(app.fields.numberingField)),app))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.numbering.caution[kb.operator.language]))
												)
												.append(kb.create('h1').html(kb.constants.config.caption.numbering.group[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.create('p').html(kb.constants.config.description.numbering.group[kb.operator.language]))
													.append(((table) => {
														table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
															switch (current.type)
															{
																case 'DROP_DOWN':
																case 'RADIO_BUTTON':
																case 'SINGLE_LINE_TEXT':
																	if (!current.tableCode) result.push({code:current.code,label:current.label});
																	break;
															}
															return result;
														}),'label','code');
														table.elm('thead').hide();
														return table;
													})(tab.tables.numberingGroup))
												)
												.append(kb.create('h1').html(kb.constants.config.caption.numbering.digits[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.create('p').html(kb.constants.config.description.numbering.digits[kb.operator.language]))
													.append(kb.field.activate(kb.field.create(app.fields.numberingDigits),app))
												)
											)
											.append(kb.create('h1').html(kb.constants.config.caption.prompt[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.create('h1').html(kb.constants.config.caption.prompt.field[kb.operator.language]))
												.append(
													kb.create('section')
													.append(((table) => {
														table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
															if (!current.tableCode)
																if (!fieldInfos.disables.includes(current.code))
																	if (current.type!='FILE' && !current.lookup) result.push({code:current.code,label:current.label});
															return result;
														}),'label','code');
														table.elm('thead').hide();
														return table;
													})(tab.tables.promptField))
													.append(kb.field.activate(((res) => {
														res.elm('input').closest('label').elm('span').html(kb.constants.config.caption.prompt.overwrite[kb.operator.language]);
														return res;
													})(kb.field.create(app.fields.promptOverwrite).css({width:'100%'})),app))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.prompt.caution[kb.operator.language]))
												)
											)
											.append(kb.create('h1').html(kb.constants.config.caption.verify[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.create('h1').html(kb.constants.config.caption.verify.field[kb.operator.language]))
												.append(
													kb.create('section')
													.append(((table) => {
														table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
															if (!current.tableCode)
																if (current.type!='FILE') result.push({code:current.code,label:current.label});
															return result;
														}),'label','code');
														table.elm('thead').hide();
														return table;
													})(tab.tables.verifyField))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.verify.caution[kb.operator.language]))
												)
												.append(kb.create('h1').html(kb.constants.config.caption.verify.message[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.field.activate(kb.field.create(app.fields.verifyMessage).css({width:'100%'}),app))
												)
											)
											.append(kb.create('h1').html(kb.constants.config.caption.error[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.create('h1').html(kb.constants.config.caption.error.filter[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.field.activate(kb.field.create(app.fields.errorFilter),app))
												)
												.append(kb.create('h1').html(kb.constants.config.caption.error.message[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.field.activate(kb.field.create(app.fields.errorMessage).css({width:'100%'}),app))
												)
												.append(kb.create('h1').html(kb.constants.config.caption.error.field[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.create('p').html(kb.constants.config.description.error.field[kb.operator.language]))
													.append(((table) => {
														table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
															result.push({code:current.code,label:current.label});
															return result;
														}),'label','code');
														table.elm('thead').hide();
														return table;
													})(tab.tables.errorField))
												)
											)
											.append(kb.create('h1').html(kb.constants.config.caption.duplicate[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.create('h1').html(kb.constants.config.caption.duplicate.criteria[kb.operator.language]))
												.append(
													kb.create('section')
													.append(((table) => {
														table.template.elm('[field-id=external]').elm('select').empty().assignOption([{code:'',label:''}].concat(Object.values(fieldInfos.criterias)),'label','code');
														return table;
													})(tab.tables.duplicateCriteria))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.duplicate.hint[kb.operator.language]))
												)
											)
											.append(kb.create('h1').html(kb.constants.config.caption.url[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.field.activate(kb.field.create(app.fields.url).css({width:'100%'}),app))
												.append(kb.create('p').addClass('kb-hint').html(kb.constants.config.description.url.hint[kb.operator.language]))
												.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.url.caution[kb.operator.language]))
											);
											tab.tables.numberingGroup.addRow();
											tab.tables.promptField.addRow();
											tab.tables.verifyField.addRow();
											tab.tables.errorField.addRow();
											tab.tables.duplicateCriteria.addRow();
											/* event */
											kb.event.on('kb.change.event',(e) => {
												if (e.container==tab.panel)
												{
													tab.panel.elm('[field-id=action]').closest('section').addClass('kb-hidden');
													if (e.record.event.value.includes('process')) tab.panel.elm('[field-id=action]').closest('section').removeClass('kb-hidden');
												}
												return e;
											});
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
							/* flat */
							container.main.append(
								kb.create('p').addClass('kb-hint').html(
									((anchor) => {
										return kb.constants.config.description.status[kb.operator.language]+'<br>'+anchor.outerHTML;
									})((() => {
										var res=null;
										switch (kb.operator.language)
										{
											case 'en':
												res=kb.create('a')
												.attr('href','https://kintone.dev/en/docs/kintone/js-api/events/record-details-event/#overwrite-field-values')
												.attr('target','_blank')
												.html('https://kintone.dev/en/docs/kintone/js-api/events/record-details-event/#overwrite-field-values')
												break;
											case 'ja':
												res=kb.create('a')
												.attr('href','https://cybozu.dev/ja/kintone/docs/js-api/events/event-object-actions/#record-details-overwrite-field-values')
												.attr('target','_blank')
												.html('https://cybozu.dev/ja/kintone/docs/js-api/events/event-object-actions/#record-details-overwrite-field-values')
												break;
											case 'zh':
												res=kb.create('a')
												.attr('href','https://cybozudev.kf5.com/hc/kb/article/206907/#step4')
												.attr('target','_blank')
												.html('https://cybozudev.kf5.com/hc/kb/article/206907/#step4')
												break;
										}
										return res;
									})())
								)
							);
							/* setup */
							if (Object.keys(config).length!=0)
							{
								((settings) => {
									settings.each((setting) => {
										((app,tab) => {
											setting.setting=((setting) => {
												setting.duplicateCriteria=(setting.duplicateCriteria || {value:[]});
												return setting;
											})(setting.setting);
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
	});
})(kintone.$PLUGIN_ID);
/*
Message definition by language
*/
kb.constants=kb.extend({
	config:{
		caption:{
			action:{
				en:'Action Name',
				ja:'アクション名',
				zh:'操作名称'
			},
			duplicate:{
				en:'Confirm Registration of Existing Record',
				ja:'条件に合致するレコードが登録済みであれば、登録するかどうか確認をする',
				zh:'确认已存在记录的注册',
				criteria:{
					en:'Associating records',
					ja:'レコードの関連付け',
					zh:'记录的关联'
				},
				destination:{
					en:'Destination',
					ja:'このアプリのフィールド',
					zh:'这个应用的字段'
				},
				source:{
					en:'Source',
					ja:'このレコードのフィールド',
					zh:'这条记录的字段'
				}
			},
			error:{
				en:'If it meets additional conditions, make it an error',
				ja:'追加条件に合致したらエラーにする',
				zh:'如果满足额外的条件，将其视为错误',
				field:{
					en:'Display message for each field',
					ja:'フィールド毎にメッセージを表示',
					zh:'每个字段显示消息'
				},
				filter:{
					en:'Additional conditions to be considered as error',
					ja:'エラーとする追加条件',
					zh:'被视为错误的附加条件'
				},
				message:{
					en:'Error message',
					ja:'エラーメッセージ',
					zh:'错误消息'
				}
			},
			event:{
				en:'Action Available Event',
				ja:'動作イベント',
				zh:'可操作事件',
				create:{
					en:'Submit on record creation',
					ja:'レコード追加画面での保存ボタンクリック',
					zh:'在记录创建时提交'
				},
				edit:{
					en:'Submit on record editing',
					ja:'レコード編集画面での保存ボタンクリック',
					zh:'在记录编辑时提交'
				},
				process:{
					en:'Process Action',
					ja:'プロセスアクション',
					zh:'过程操作'
				}
			},
			numbering:{
				en:'Automatically number it',
				ja:'自動採番する',
				zh:'自动编号',
				digits:{
					en:'Number of digits',
					ja:'採番桁数',
					zh:'编号位数'
				},
				field:{
					en:'Field to save',
					ja:'保存先フィールド',
					zh:'保存字段'
				},
				group:{
					en:'Numbering group',
					ja:'採番グループ',
					zh:'编号组'
				}
			},
			prompt:{
				en:'Show a popup prompting for input',
				ja:'入力を促すポップアップを表示する',
				zh:'显示一个提示输入的弹窗',
				field:{
					en:'Field to prompt input',
					ja:'入力を促すフィールド',
					zh:'提示输入的字段'
				},
				overwrite:{
					en:'Even if already inputted, prompt to enter again',
					ja:'入力済みであっても、改めて入力を促す',
					zh:'即使已输入，也重新提示输入'
				}
			},
			url:{
				en:'Navigate to the specified URL after event processing',
				ja:'イベント処理後に指定したURLへ遷移する',
				zh:'事件处理后转到指定的URL'
			},
			verify:{
				en:'Show a popup to confirm the input content',
				ja:'入力内容の確認をするポップアップを表示する',
				zh:'显示一个确认输入内容的弹窗',
				field:{
					en:'Field to confirm input contents',
					ja:'入力内容を確認するフィールド',
					zh:'确认输入内容的字段'
				},
				message:{
					en:'Message to be displayed at the top of the popup screen',
					ja:'ポップアップ画面上部に表示するメッセージ',
					zh:'在弹出屏幕顶部显示的消息'
				}
			}
		},
		description:{
			duplicate:{
				hint:{
					en:'Setting conditions in multiple tabs will result in an OR search.',
					ja:'複数のタブに分けて条件を設定するとOR検索になります。',
					zh:'在多个标签中设置条件将变成或搜索。'
				}
			},
			error:{
				field:{
					en:'If you want to display error messages for each field, please specify them.',
					ja:'フィールド毎にエラーメッセージを表示したい場合は、それらを指定して下さい。',
					zh:'如果您想为每个字段显示错误信息，请指定它们。'
				}
			},
			numbering:{
				digits:{
					en:'Please input the number of digits to align with leading zeros.',
					ja:'先頭をゼロで揃える為の桁数を入力して下さい。',
					zh:'请输入用于使前导零对齐的位数。'
				},
				group:{
					en:'If you want to number by group, please specify the field for grouping.',
					ja:'グループ毎に採番を行いたい場合は、グループ化する為のフィールドを指定して下さい。',
					zh:'如果您想按组编号，请指定用于分组的字段。'
				},
				caution:{
					en:'It will only operate if the field specified in the "Field to save" is empty.',
					ja:'保存先フィールドに指定したフィールドが空の場合のみの動作になります。',
					zh:'只有当指定的“保存字段”为空时才会操作。'
				}
			},
			prompt:{
				caution:{
					en:'Fields within a table cannot be specified.',
					ja:'テーブル内フィールドは指定出来ません。',
					zh:'表内字段不能被指定。'
				}
			},
			status:{
				en:'Due to kintone\'s specifications, there are fields that cannot be modified. Please check the URL below.',
				ja:'kintoneの仕様により、書き換えることが出来ないフィールドがありますので、下記URLをご確認ください。',
				zh:'由于kintone的规范，有些字段不能被修改。请检查以下的URL。'
			},
			url:{
				caution:{
					en:'There is no transition after "Process Action" is executed.',
					ja:'プロセスアクション実行後の遷移はありません。',
					zh:'执行"Process Action"后不会进行转换。'
				},
				hint:{
					en:'To insert the value of a field at any position in URL, please enclose the field code of the field to be inserted with %.',
					ja:'URLの任意の位置にフィールドの値を挿入する場合は、挿入するフィールドのフィールドコードを、%で囲って入力して下さい。',
					zh:'要在URL的任意位置插入字段值，请用%包围要插入的字段的字段代码。'
				}
			},
			verify:{
				caution:{
					en:'Fields within a table cannot be specified.',
					ja:'テーブル内フィールドは指定出来ません。',
					zh:'表内字段不能被指定。'
				}
			}
		},
		message:{
			invalid:{
				action:{
					en:'If you specify "Process Action" for the action event, please indicate its action name.',
					ja:'動作イベントに「プロセスアクション」を指定した場合は、そのアクション名を指定して下さい。',
					zh:'如果在操作事件中指定了“过程操作”，请指定其操作名称。'
				},
				numbering:{
					en:'Please enter the number of digits for numbering.',
					ja:'採番桁数を入力して下さい。',
					zh:'请输入编号的位数。'
				}
			}
		},
		prompt:{
			error:{
				message:{
					en:'Enter the error message',
					ja:'エラーメッセージを入力',
					zh:'请输入错误消息'
				}
			},
			url:{
				en:'Enter the destination URL',
				ja:'遷移先URLを入力',
				zh:'输入目标URL'
			}
		}
	}
},kb.constants);
