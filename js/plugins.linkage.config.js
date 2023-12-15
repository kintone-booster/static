/*
* FileName "plugins.linkage.config.js"
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
												((fields) => {
													var criteria={
														config:res.record.criteria.value.filter((item) => (item.value.external.value && item.value.internal.value))
													};
													var sort={
														config:res.record.sort.value.filter((item) => item.value.field.value)
													};
													var mapping={
														config:[],
														table:[]
													};
													if (criteria.config.length==0)
													{
														kb.alert(kb.constants.config.message.invalid.criteria[kb.operator.language]);
														kb.config[PLUGIN_ID].tabbed.activate(item);
														error=true;
													}
													else
													{
														res.record.mapping.value.each((values,index) => {
															if (values.value.external.value)
															{
																mapping.config.push(values);
																mapping.table.push(fields.external[values.value.external.value].tableCode);
															}
														});
														if (mapping.config.length==0)
														{
															kb.alert(kb.constants.config.message.invalid.mapping[kb.operator.language]);
															kb.config[PLUGIN_ID].tabbed.activate(item);
															error=true;
														}
														else
														{
															mapping.table=Array.from(new Set(mapping.table.filter((item) => item)));
															if (mapping.table.length>1)
															{
																kb.alert(kb.constants.config.message.invalid.multiple[kb.operator.language]);
																kb.config[PLUGIN_ID].tabbed.activate(item);
																error=true;
															}
															else
															{
																if (mapping.config.filter((item) => item.value.internal.value)!=0)
																{
																	if (!res.record.label.value)
																	{
																		kb.alert(kb.constants.config.message.invalid.label[kb.operator.language]);
																		kb.config[PLUGIN_ID].tabbed.activate(item);
																		error=true;
																	}
																	if (!res.record.message.value)
																	{
																		kb.alert(kb.constants.config.message.invalid.message[kb.operator.language]);
																		kb.config[PLUGIN_ID].tabbed.activate(item);
																		error=true;
																	}
																}
																if (!error)
																{
																	if (parseInt(res.record.limit.value)<1 || parseInt(res.record.limit.value)>500)
																	{
																		kb.alert(kb.constants.config.message.invalid.limit[kb.operator.language]);
																		kb.config[PLUGIN_ID].tabbed.activate(item);
																		error=true;
																	}
																	else
																	{
																		if (!res.record.bulk.value.includes('bulk')) res.record.view.value='';
																		res.record.criteria.value=criteria.config;
																		res.record.sort.value=sort.config;
																		res.record.mapping.value=mapping.config;
																		config.tab.push({label:item.label.html(),setting:res.record});
																	}
																}
															}
														}
													}
												})({
													external:item.fields.external.parallelize,
													internal:item.fields.internal.parallelize
												});
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
									if (config.tab.length!=Array.from(new Set(config.tab.map((item) => item.setting.container.value))).length)
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
										container:{
											code:'container',
											type:'DROP_DOWN',
											label:'',
											required:true,
											noLabel:true,
											options:[]
										},
										app:{
											code:'app',
											type:'DROP_DOWN',
											label:'',
											required:true,
											noLabel:true,
											options:[]
										},
										criteria:{
											code:'criteria',
											type:'SUBTABLE',
											label:'',
											noLabel:true,
											fields:{
												external:{
													code:'external',
													type:'DROP_DOWN',
													label:kb.constants.config.caption.external[kb.operator.language],
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
													label:kb.constants.config.caption.internal[kb.operator.language],
													required:false,
													noLabel:true,
													options:[]
												}
											}
										},
										filter:{
											code:'filter',
											type:'CONDITION',
											label:'',
											required:false,
											noLabel:true,
											app:{
												id:kintone.app.getId(),
												fields:fieldInfos.parallelize
											}
										},
										sort:{
											code:'sort',
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
												order:{
													code:'order',
													type:'DROP_DOWN',
													label:'',
													required:false,
													noLabel:true,
													options:[
														{index:0,label:'asc'},
														{index:1,label:'desc'}
													]
												}
											}
										},
										mapping:{
											code:'mapping',
											type:'SUBTABLE',
											label:'',
											noLabel:true,
											fields:{
												external:{
													code:'external',
													type:'DROP_DOWN',
													label:kb.constants.config.caption.external[kb.operator.language],
													required:false,
													noLabel:true,
													options:[]
												},
												guide:{
													code:'guide',
													type:'SPACER',
													label:'',
													required:false,
													noLabel:true,
													contents:'<span class="kb-icon kb-icon-arrow kb-icon-arrow-right"></span>'
												},
												internal:{
													code:'internal',
													type:'DROP_DOWN',
													label:kb.constants.config.caption.internal[kb.operator.language],
													required:false,
													noLabel:true,
													options:[]
												}
											}
										},
										label:{
											code:'label',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.label[kb.operator.language],
											required:false,
											noLabel:false,
											placeholder:''
										},
										message:{
											code:'message',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.message[kb.operator.language],
											required:false,
											noLabel:false,
											placeholder:''
										},
										user:{
											code:'user',
											type:'USER_SELECT',
											label:kb.constants.config.caption.user[kb.operator.language],
											required:false,
											noLabel:false,
											guestuser:true
										},
										organization:{
											code:'organization',
											type:'ORGANIZATION_SELECT',
											label:kb.constants.config.caption.organization[kb.operator.language],
											required:false,
											noLabel:false
										},
										group:{
											code:'group',
											type:'GROUP_SELECT',
											label:kb.constants.config.caption.group[kb.operator.language],
											required:false,
											noLabel:false
										},
										bulk:{
											code:'bulk',
											type:'CHECK_BOX',
											label:'',
											required:false,
											noLabel:true,
											options:[
												{index:0,label:'bulk'}
											]
										},
										view:{
											code:'view',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.view[kb.operator.language],
											required:false,
											noLabel:false,
											options:[]
										},
										limit:{
											code:'limit',
											type:'NUMBER',
											label:'',
											required:true,
											noLabel:true
										}
									},
									flat:{
									}
								}
							};
							var setup=(tab,app,record) => {
								kb.record.set(tab.panel,app,(() => {
									tab.panel.elm('[field-id=app]').elm('select').val(record.app.value).rebuild().then((fields) => {
										tab.tables.criteria.clearRows();
										record.criteria.value.each((values,index) => {
											if (values.value.external.value in fields.criteria)
												((row) => {
													row.elm('[field-id=external]').elm('select').val(values.value.external.value).rebuild().then((fields) => {
														if (values.value.internal.value in fields)
														{
															row.elm('[field-id=operator]').elm('select').val(values.value.operator.value);
															row.elm('[field-id=internal]').elm('select').val(values.value.internal.value);
														}
													});
												})(tab.tables.criteria.addRow());
										});
										if (tab.tables.criteria.tr.length==0) tab.tables.criteria.addRow();
										tab.tables.sort.clearRows();
										record.sort.value.each((values,index) => {
											if (values.value.field.value in fields.sort)
												((row) => {
													row.elm('[field-id=field]').elm('select').val(values.value.field.value);
													row.elm('[field-id=order]').elm('select').val(values.value.order.value);
												})(tab.tables.sort.addRow());
										});
										if (tab.tables.sort.tr.length==0) tab.tables.sort.addRow();
										tab.tables.mapping.clearRows();
										record.mapping.value.each((values,index) => {
											if (values.value.external.value in fields.mapping)
												((row) => {
													row.elm('[field-id=external]').elm('select').val(values.value.external.value).rebuild().then((fields) => {
														if (values.value.internal.value in fields) row.elm('[field-id=internal]').elm('select').val(values.value.internal.value);
													});
												})(tab.tables.mapping.addRow());
										});
										if (tab.tables.mapping.tr.length==0) tab.tables.mapping.addRow();
										((field) => {
											field.elm('.kb-guide').empty();
											if (record.filter.value)
											{
												field.elm('input').val(record.filter.value);
												record.filter.value.split(' and ').each((value,index) => field.guide(value));
											}
											else field.elm('input').val('');
										})(tab.panel.elm('[field-id=filter]').elm('.kb-field-value'));
									});
									return record;
								})())
								.then(() => {
									tab.tables.formula.tr.each((element,index) => {
										element.elm('select').rebuild();
									});
								});
							};
							/* tabbed */
							kb.config[PLUGIN_ID].tabbed=new KintoneBoosterConfigTabbed(
								container,
								{
									add:(tab) => {
										((app) => {
											tab.fields={
												external:{},
												internal:fieldInfos
											};
											tab.tables={
												criteria:kb.table.create(app.fields.criteria,false,false,false).spread((row,index) => {
													/* event */
													row.elm('.kb-table-row-add').on('click',(e) => {
														tab.tables.criteria.insertRow(row);
													});
													row.elm('.kb-table-row-del').on('click',(e) => {
														kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
															tab.tables.criteria.delRow(row);
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
																		cells.operator.assignOption(kb.filter.query.operator(tab.fields.external.parallelize[cells.external.val()]),'label','code');
																		for (var key in tab.fields.internal.parallelize)
																			((fieldInfo) => {
																				if (!fieldInfo.tableCode)
																					if (kb.field.typing(fieldInfo,tab.fields.external.parallelize[cells.external.val()],true)) res[fieldInfo.code]=fieldInfo;
																			})(tab.fields.internal.parallelize[key]);
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
												},false),
												mapping:kb.table.create(app.fields.mapping,false,false,false).addClass('kb-mapping').spread((row,index) => {
													/* event */
													row.elm('.kb-table-row-add').on('click',(e) => {
														tab.tables.mapping.insertRow(row);
													});
													row.elm('.kb-table-row-del').on('click',(e) => {
														kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
															tab.tables.mapping.delRow(row);
														});
													});
													/* modify elements */
													((cells) => {
														cells.external.on('change',(e) => e.currentTarget.rebuild()).rebuild=() => {
															return new Promise((resolve,reject) => {
																cells.internal.empty().assignOption([{code:'',label:''}],'label','code');
																if (cells.external.val())
																{
																	resolve((() => {
																		var res={};
																		for (var key in tab.fields.internal.parallelize)
																			((fieldInfo) => {
																				if (fieldInfo.tableCode)
																					if (!tab.fields.internal.disables.includes(fieldInfo.code) && !['FILE'].includes(fieldInfo.type))
																						if (kb.field.typing(tab.fields.external.parallelize[cells.external.val()],fieldInfo)) res[fieldInfo.code]=fieldInfo;
																			})(tab.fields.internal.parallelize[key]);
																		cells.internal.assignOption(Object.values(res),'label','code');
																		return res;
																	})());
																}
																else resolve({});
															});
														};
													})({
														external:row.elm('[field-id=external]').elm('select'),
														internal:row.elm('[field-id=internal]').elm('select')
													});
												},(table,index) => {
													if (table.tr.length==0) table.addRow();
												},false),
												sort:kb.table.activate(kb.table.create(app.fields.sort),app)
											};
											tab.panel.addClass('kb-scope').attr('form-id','form_'+app.id)
											.append(kb.create('h1').html(kb.constants.config.caption.container[kb.operator.language]))
											.append(
												kb.create('section')
												.append(((res) => {
													res.elm('select').empty().assignOption(([{elementId:''}]).concat(tab.fields.internal.spacers),'elementId','elementId');
													return res;
												})(kb.field.activate(kb.field.create(app.fields.container),app)))
												.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.container[kb.operator.language]))
											)
											.append(kb.create('h1').html(kb.constants.config.caption.app[kb.operator.language]))
											.append(
												kb.create('section')
												.append(((res) => {
													res.elm('select').empty().assignOption(([{appId:'',name:''}]).concat(appInfos),'name','appId').on('change',(e) => e.currentTarget.rebuild()).rebuild=() => {
														return new Promise((resolve,reject) => {
															((criteria,sort,mapping,filter) => {
																criteria.clearRows();
																criteria.template.elm('[field-id=external]').css({width:'100%'}).elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																criteria.template.elm('[field-id=operator]').css({width:'100%'}).elm('select').empty();
																criteria.template.elm('[field-id=internal]').css({width:'100%'}).elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																sort.clearRows();
																sort.template.elm('[field-id=field]').css({width:'100%'}).elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																mapping.clearRows();
																mapping.template.elm('[field-id=external]').css({width:'100%'}).elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																mapping.template.elm('[field-id=internal]').css({width:'100%'}).elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																mapping.template.elm('[field-id=guide]').css({width:'100%'}).parentNode.addClass('kb-mapping-guide');
																if (res.elm('select').val())
																{
																	kb.field.load(res.elm('select').val()).then((fieldInfos) => {
																		tab.fields.external=fieldInfos;
																		resolve(((app) => {
																			var res={
																				criteria:((fieldInfos) => {
																					var res={};
																					for (var key in fieldInfos)
																						((fieldInfo) => {
																							res[fieldInfo.code]=fieldInfo;
																						})(fieldInfos[key]);
																					return res;
																				})(tab.fields.external.criterias),
																				mapping:((fieldInfos) => {
																					var res={};
																					for (var key in fieldInfos)
																						((fieldInfo) => {
																							if (!['CATEGORY'].includes(fieldInfo.type)) res[fieldInfo.code]=fieldInfo;
																						})(fieldInfos[key]);
																					return res;
																				})(tab.fields.external.parallelize),
																				sort:tab.fields.external.parallelize
																			};
																			criteria.template.elm('[field-id=external]').elm('select').assignOption(Object.values(res.criteria),'label','code');
																			mapping.template.elm('[field-id=external]').elm('select').assignOption(Object.values(res.mapping),'label','code');
																			sort.template.elm('[field-id=field]').elm('select').assignOption(Object.values(res.sort),'label','code');
																			criteria.addRow();
																			mapping.addRow();
																			sort.addRow();
																			filter.reset({id:app,fields:tab.fields.external.parallelize});
																			return res;
																		})(res.elm('select').val()));
																	});
																}
																else
																{
																	criteria.addRow();
																	mapping.addRow();
																	sort.addRow();
																	filter.reset({id:null,fields:{}});
																	resolve({
																		criteria:{},
																		mapping:{},
																		sort:{}
																	});
																}
															})(tab.tables.criteria,tab.tables.sort,tab.tables.mapping,tab.panel.elm('[field-id=filter]').elm('.kb-field-value'));
														});
													};
													return res;
												})(kb.field.activate(kb.field.create(app.fields.app),app)))
											)
											.append(kb.create('h1').html(kb.constants.config.caption.criteria[kb.operator.language]))
											.append(
												kb.create('section')
												.append(tab.tables.criteria)
												.append(kb.create('p').html(kb.constants.config.caption.filter[kb.operator.language]))
												.append(kb.field.activate(kb.field.create(app.fields.filter),app))
											)
											.append(kb.create('h1').html(kb.constants.config.caption.sort[kb.operator.language]))
											.append(
												kb.create('section')
												.append(((table) => {
													table.template.elm('[field-id=order]').elm('select').elms('option').each((element,index) => {
														element.html(kb.constants.config.caption.sort.order[kb.operator.language][index]);
													});
													table.elm('thead').hide();
													return table;
												})(tab.tables.sort))
											)
											.append(kb.create('h1').html(kb.constants.config.caption.mapping[kb.operator.language]))
											.append(
												kb.create('section')
												.append(tab.tables.mapping)
												.append(kb.create('h1').html(kb.constants.config.caption.copy[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.create('p').html(kb.constants.config.description.copy[kb.operator.language]))
													.append(kb.field.activate(kb.field.create(app.fields.label).css({width:'100%'}),app))
													.append(kb.field.activate(kb.field.create(app.fields.message).css({width:'100%'}),app))
													.append(kb.field.activate(kb.field.create(app.fields.user).css({width:'100%'}),app))
													.append(kb.field.activate(kb.field.create(app.fields.organization).css({width:'100%'}),app))
													.append(kb.field.activate(kb.field.create(app.fields.group).css({width:'100%'}),app))
													.append(kb.field.activate(((res) => {
														res.elms('[type=checkbox]').each((element,index) => {
															element.closest('label').elm('span').html(kb.constants.config.caption[element.val()][kb.operator.language]);
														});
														return res;
													})(kb.field.create(app.fields.bulk).css({width:'100%'})),app))
													.append(kb.field.activate(((res) => {
														res.elm('select').empty().assignOption(([{code:'',label:kb.constants.config.caption.view.all[kb.operator.language]}]).concat(viewInfos.list.map((item) => {
															return {code:item.id,label:item.name};
														})),'label','code');
														return res;
													})(kb.field.create(app.fields.view)),app))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.copy.caution[kb.operator.language]))
												)
											)
											.append(kb.create('h1').html(kb.constants.config.caption.limit[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.field.activate(kb.field.create(app.fields.limit),app))
											);
											tab.panel.elm('[field-id=app]').elm('select').rebuild().then((fields) => {
												tab.tables.criteria.clearRows();
												tab.tables.sort.clearRows();
												tab.tables.mapping.clearRows();
												tab.tables.criteria.addRow();
												tab.tables.sort.addRow();
												tab.tables.mapping.addRow();
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
							else
							{
								((tab) => {
									tab.panel.elm('[field-id=app]').elm('select').rebuild().then((fields) => {
										tab.tables.criteria.clearRows();
										tab.tables.sort.clearRows();
										tab.tables.mapping.clearRows();
										tab.tables.criteria.addRow();
										tab.tables.sort.addRow();
										tab.tables.mapping.addRow();
									});
								})(kb.config[PLUGIN_ID].tabbed.add());
							}
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
			app:{
				en:'Datasource App',
				ja:'参照元アプリ',
				zh:'参考源应用'
			},
			bulk:{
				en:'Place a button on the list view page as well, so that bulk copying can be done.',
				ja:'一覧画面にもボタンを配置して、一括コピーが出来るようにする',
				zh:'在列表视图页面上也放置一个按钮，以便进行批量复制。'
			},
			container:{
				en:'Blank Space for Displaying Records',
				ja:'参照するレコードを表示するスペースフィールド',
				zh:'用于显示记录的空白栏'
			},
			copy:{
				en:'Auxiliary Settings for Copy Function',
				ja:'コピー機能に関する追加設定',
				zh:'复制功能的辅助设置'
			},
			criteria:{
				en:'Reference association',
				ja:'参照するレコードの関連付け',
				zh:'参考关联记录'
			},
			external:{
				en:'Datasource App',
				ja:'参照元アプリのフィールド',
				zh:'参考源应用的字段'
			},
			filter:{
				en:'Narrow it down further',
				ja:'さらに絞り込む',
				zh:'进一步缩小'
			},
			group:{
				en:'If you want to use the group to which the logged-in user belongs as a basis for copy permission, please specify the group that is permitted.',
				ja:'ログインユーザーが所属するグループをコピー許可の判断としたい場合は、許可するグループを指定して下さい。',
				zh:'如果您想以登录用户所属的组作为复制权限的判断依据，请指定允许的组。'
			},
			internal:{
				en:'This App',
				ja:'このアプリのフィールド',
				zh:'此应用的字段'
			},
			label:{
				en:'Copy Button Label',
				ja:'コピーボタンのラベルテキスト',
				zh:'复制按钮标签文本'
			},
			limit:{
				en:'Max Records to Display at a Time',
				ja:'一度に表示する最大レコード数',
				zh:'一次最多显示记录数'
			},
			mapping:{
				en:'Display Field and Destination Field for Copying',
				ja:'表示するフィールドとコピー先フィールド',
				zh:'显示字段和复制目标字段'
			},
			message:{
				en:'Confirmation Message Before Starting Copy',
				ja:'コピー開始前の確認メッセージ',
				zh:'复制开始前的确认信息'
			},
			organization:{
				en:'If you want to use the organization to which the logged-in user belongs as a basis for copy permission, please specify the organization that is permitted.',
				ja:'ログインユーザーが所属する組織をコピー許可の判断としたい場合は、許可する組織を指定して下さい。',
				zh:'如果您想以登录用户所属的组织作为复制权限的判断依据，请指定允许的组织。'
			},
			sort:{
				en:'Order of Records Displayed',
				ja:'表示するレコードの並び順',
				zh:'显示记录的顺序',
				order:{
					ja:['昇順','降順'],
					en:['ASC','DESC'],
					zh:['升序','降序']
				}
			},
			user:{
				en:'If you want to use the logged-in user as a basis for copy permission, please specify the user that is permitted.',
				ja:'ログインユーザーをコピー許可の判断としたい場合は、許可するユーザーを指定して下さい。',
				zh:'如果您想以登录用户本身作为复制权限的判断依据，请指定允许的用户。'
			},
			view:{
				en:'Executable List View',
				ja:'実行可能な一覧画面',
				zh:'可执行的列表屏幕',
				all:{
					en:'No restrictions',
					ja:'制限しない',
					zh:'不限制'
				}
			}
		},
		description:{
			container:{
				en:'Blank Spaces without an Element ID are not eligible.',
				ja:'要素IDが未入力のスペースフィールドは対象外です。',
				zh:'未输入元素ID的空白栏不适用。'
			},
			copy:{
				en:'When copying a referenced record to a table within the app, specify the destination field (This App) and also make the following settings.',
				ja:'参照したレコードをアプリ内のテーブルにコピーする場合は、コピー先フィールド（このアプリのフィールド）を指定した上で、以下の設定も行って下さい。',
				zh:'在将引用的记录复制到应用内的表中时，请指定目标字段（此应用的字段），并进行以下设置。',
				caution:{
					en:'This copy function is for overwriting the destination table, and is not for adding rows while keeping the existing ones.',
					ja:'こちらのコピー機能は、コピー先となるテーブルを上書きコピーするものであり、既存の行を残して行の追加をするものではございません。',
					zh:'此复制功能用于覆盖目标表格，并非在保留现有行的同时添加行。'
				}
			}
		},
		message:{
			invalid:{
				criteria:{
					en:'Please specify the Reference association.',
					ja:'参照するレコードの関連付けを指定して下さい。',
					zh:'请指定参考关联记录。'
				},
				duplicate:{
					en:'The same Blank Space cannot be specified in different tabs.',
					ja:'異なるタブで同じスペースフィールドを指定することは出来ません。',
					zh:'不能在不同的标签页中指定相同的空白栏。'
				},
				label:{
					en:'If a destination field is specified, enter the label text for its copy button.',
					ja:'コピー先フィールドを指定した場合は、そのコピーボタンのラベルテキストを入力して下さい。',
					zh:'如果指定了目标字段，请输入其复制按钮的标签文本。'
				},
				limit:{
					en:'The number of records to display must be entered within the range of 1 to 500.',
					ja:'表示するレコード数は1から500の範囲内で入力して下さい。',
					zh:'显示的记录数必须在1到500的范围内输入。'
				},
				mapping:{
					en:'Please specify the field to display.',
					ja:'表示するフィールドを指定して下さい。',
					zh:'请指定要显示的字段。'
				},
				message:{
					en:'If a destination field is specified, enter the confirmation message before starting the copy.',
					ja:'コピー先フィールドを指定した場合は、そのコピー開始前の確認メッセージを入力して下さい。',
					zh:'如果指定了目标字段，请输入开始复制前的确认消息。'
				},
				multiple:{
					en:'You cannot specify a field from a different table for the field to be displayed.',
					ja:'表示するフィールドに異なるテーブル内のフィールドを指定することは出来ません。',
					zh:'不能为要显示的字段指定不同表中的字段。'
				}
			}
		}
	}
},kb.constants);
