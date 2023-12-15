/*
* FileName "plugins.style.config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={};
	kb.field.load(kintone.app.getId()).then((fieldInfos) => {
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
									res.record.color.value=res.record.color.value.filter((item) => item.value.field.value);
									res.record.editable.value=res.record.editable.value.filter((item) => item.value.field.value);
									res.record.display.value=res.record.display.value.filter((item) => item.value.field.value);
									res.record.toggle.value=res.record.toggle.value.filter((item) => item.value.field.value);
									config.tab.push({label:item.label.html(),setting:res.record});
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
						((app) => {
							var res=kb.record.get(container.main.elm('.kb-flat'),app);
							if (!res.error) config.flat=res.record;
							else
							{
								kb.alert(kb.constants.common.message.invalid.record[kb.operator.language]);
								error=true;
							}
						})({
							id:vars.app.id,
							fields:vars.app.fields.flat
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
								page:{
									code:'page',
									type:'CHECK_BOX',
									label:'',
									required:true,
									noLabel:true,
									options:[
										{index:0,label:'create'},
										{index:1,label:'edit'},
										{index:2,label:'detail'},
										{index:3,label:'print'}
									]
								},
								color:{
									code:'color',
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
										backcolor:{
											code:'backcolor',
											type:'COLOR',
											label:'',
											required:false,
											noLabel:true,
											placeholder:kb.constants.config.prompt.color.backcolor[kb.operator.language]
										},
										forecolor:{
											code:'forecolor',
											type:'COLOR',
											label:'',
											required:false,
											noLabel:true,
											placeholder:kb.constants.config.prompt.color.forecolor[kb.operator.language]
										}
									}
								},
								editable:{
									code:'editable',
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
										state:{
											code:'state',
											type:'DROP_DOWN',
											label:'',
											required:false,
											noLabel:true,
											options:[
												{index:0,label:'disable'},
												{index:1,label:'enable'}
											]
										}
									}
								},
								display:{
									code:'display',
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
										state:{
											code:'state',
											type:'DROP_DOWN',
											label:'',
											required:false,
											noLabel:true,
											options:[
												{index:0,label:'hide'},
												{index:1,label:'show'}
											]
										}
									}
								},
								toggle:{
									code:'toggle',
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
										state:{
											code:'state',
											type:'DROP_DOWN',
											label:'',
											required:false,
											noLabel:true,
											options:[
												{index:0,label:'open'},
												{index:1,label:'close'}
											]
										}
									}
								}
							},
							flat:{
								reusecolor:{
									code:'reusecolor',
									type:'COLOR',
									label:'',
									required:false,
									noLabel:true,
									placeholder:kb.constants.config.prompt.color.reusecolor[kb.operator.language]
								}
							}
						}
					};
					var setup=(tab,app,record) => {
						kb.record.set(tab.panel,app,record);
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
										color:kb.table.activate(kb.table.create(app.fields.color),app),
										display:kb.table.activate(kb.table.create(app.fields.display),app),
										editable:kb.table.activate(kb.table.create(app.fields.editable),app),
										toggle:kb.table.activate(kb.table.create(app.fields.toggle),app)
									};
									tab.panel.addClass('kb-scope').attr('form-id','form_'+app.id)
									.append(
										kb.config[PLUGIN_ID].ui.fields.users.set(kb.config[PLUGIN_ID].ui.fields.conditions.set(kb.create('div').addClass('kb-config-tabbed-panel-block'),app),app)
										.append(kb.create('h1').html(kb.constants.config.caption.page[kb.operator.language]))
										.append(
											kb.create('section')
											.append(kb.field.activate(((res) => {
												res.elms('[type=checkbox]').each((element,index) => {
													element.closest('label').elm('span').html(kb.constants.config.caption.page[element.val()][kb.operator.language]);
												});
												return res;
											})(kb.field.create(app.fields.page)),app))
										)
									)
									.append(kb.create('h1').html(kb.constants.config.caption.color[kb.operator.language]))
									.append(
										kb.create('section')
										.append(((table) => {
											table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
												result.push({code:current.code,label:current.label});
												return result;
											}),'label','code');
											table.elm('thead').hide();
											return table;
										})(tab.tables.color))
									)
									.append(kb.create('h1').html(kb.constants.config.caption.editable[kb.operator.language]))
									.append(
										kb.create('section')
										.append(((table) => {
											table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
												if (!fieldInfos.disables.includes(current.code)) result.push({code:current.code,label:current.label});
												return result;
											}),'label','code');
											table.template.elm('[field-id=state]').elms('option').each((element,index) => {
												element.html(kb.constants.config.caption.editable[element.val()][kb.operator.language]);
											});
											table.elm('thead').hide();
											return table;
										})(tab.tables.editable))
									)
									.append(kb.create('h1').html(kb.constants.config.caption.display[kb.operator.language]))
									.append(
										kb.create('section')
										.append(((table) => {
											table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
												result.push({code:current.code,label:current.label});
												return result;
											},true,true),'label','code');
											table.template.elm('[field-id=state]').elms('option').each((element,index) => {
												element.html(kb.constants.config.caption.display[element.val()][kb.operator.language]);
											});
											table.elm('thead').hide();
											return table;
										})(tab.tables.display))
									)
									.append(kb.create('h1').html(kb.constants.config.caption.toggle[kb.operator.language]))
									.append(
										kb.create('section')
										.append(((table) => {
											table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,false,false,true),'label','code');
											table.template.elm('[field-id=state]').elms('option').each((element,index) => {
												element.html(kb.constants.config.caption.toggle[element.val()][kb.operator.language]);
											});
											table.elm('thead').hide();
											return table;
										})(tab.tables.toggle))
									);
									tab.tables.color.addRow();
									tab.tables.editable.addRow();
									tab.tables.display.addRow();
									tab.tables.toggle.addRow();
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
					((app) => {
						container.main.append(
							kb.create('div').addClass('kb-flat kb-scope').attr('form-id','form_'+app.id)
							.append(kb.create('h1').html(kb.constants.config.caption.reuse[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.reuse[kb.operator.language]))
								.append(kb.field.activate(kb.field.create(app.fields.reusecolor),app))
							)
						);
						container.main.elms('input,select,textarea').each((element,index) => element.initialize());
					})({
						id:vars.app.id,
						fields:vars.app.fields.flat
					});
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
						((setting) => {
							((app) => {
								kb.record.set(container.main.elm('.kb-flat'),app,setting);
							})({
								id:vars.app.id,
								fields:vars.app.fields.flat
							});
						})(JSON.parse(config.flat));
					}
					else kb.config[PLUGIN_ID].tabbed.add();
				}
				catch(error){kb.alert(kb.error.parse(error))}
			}
		);
	});
})(kintone.$PLUGIN_ID);
/*
Message definition by language
*/
kb.constants=kb.extend({
	config:{
		caption:{
			color:{
				en:'Field Coloring',
				ja:'フィールド配色',
				zh:'字段配色'
			},
			display:{
				en:'Field Display Switching',
				ja:'フィールド表示切替',
				zh:'字段显示切换',
				show:{
					en:'Display',
					ja:'表示する',
					zh:'显示'
				},
				hide:{
					en:'Hide',
					ja:'表示しない',
					zh:'隐藏'
				}
			},
			editable:{
				en:'Field Edit Restriction',
				ja:'フィールド編集制限',
				zh:'字段编辑限制',
				enable:{
					en:'Enabled',
					ja:'有効',
					zh:'有效'
				},
				disable:{
					en:'Disabled',
					ja:'無効',
					zh:'无效'
				}
			},
			toggle:{
				en:'Group Toggle',
				ja:'グループ開閉',
				zh:'组别开闭',
				open:{
					en:'Open',
					ja:'開ける',
					zh:'打开'
				},
				close:{
					en:'Close',
					ja:'閉じる',
					zh:'关闭'
				}
			},
			page:{
				en:'Allow action page',
				ja:'動作ページ',
				zh:'允许动作',
				create:{
					en:'Record Create Page',
					ja:'レコード追加画面',
					zh:'记录创建页面'
				},
				detail:{
					en:'Record Detail Page',
					ja:'レコード詳細画面',
					zh:'记录详情页'
				},
				edit:{
					en:'Record Edit Page',
					ja:'レコード編集画面',
					zh:'记录编辑页'
				},
				print:{
					en:'Record Print Page',
					ja:'レコード印刷画面',
					zh:'记录打印页'
				}
			},
			reuse:{
				en:'Highlighting during record reuse',
				ja:'レコード再利用時の強調表示',
				zh:'记录再利用时的高亮显示'
			}
		},
		description:{
			reuse:{
				en:'When reusing a record, please specify the color you want to change the background color of the button area to.',
				ja:'レコードを再利用した時にボタンエリアの背景色を変更したい場合は、その色を指定して下さい。',
				zh:'当重复使用记录时，请指定您希望更改按钮区域的背景颜色。'
			}
		},
		prompt:{
			color:{
				backcolor:{
					en:'BackColor',
					ja:'背景色',
					zh:'背景颜色'
				},
				forecolor:{
					en:'ForeColor',
					ja:'前景色',
					zh:'前景颜色'
				},
				reusecolor:{
					en:'Background color when reused',
					ja:'再利用時の背景色',
					zh:'重新使用时的背景色'
				}
			}
		}
	}
},kb.constants);
