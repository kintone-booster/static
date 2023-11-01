/*
* FileName "plugins.action.config.js"
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
													if (res.record.event.value.includes('detail'))
													{
														if (!res.record.label.value)
														{
															kb.alert(kb.constants.config.message.invalid.label.detail[kb.operator.language]);
															kb.config[PLUGIN_ID].tabbed.activate(item);
															error=true;
														}
														if (!res.record.message.value)
														{
															kb.alert(kb.constants.config.message.invalid.message.detail[kb.operator.language]);
															kb.config[PLUGIN_ID].tabbed.activate(item);
															error=true;
														}
													}
													else
													{
														if (res.record.event.value.includes('index'))
														{
															if (!res.record.label.value)
															{
																kb.alert(kb.constants.config.message.invalid.label.index[kb.operator.language]);
																kb.config[PLUGIN_ID].tabbed.activate(item);
																error=true;
															}
															if (!res.record.message.value)
															{
																kb.alert(kb.constants.config.message.invalid.message.index[kb.operator.language]);
																kb.config[PLUGIN_ID].tabbed.activate(item);
																error=true;
															}
														}
														else
														{
															res.record.label.value='';
															res.record.message.value='';
															res.record.view.value='';
														}
													}
												}
												if (!error)
												{
													if (res.record.fill.value.filter((item) => item.value.table.value).some((item) => !item.value.range.value))
													{
														kb.alert(kb.constants.config.message.invalid.fill[kb.operator.language]);
														kb.config[PLUGIN_ID].tabbed.activate(item);
														error=true;
													}
													else
													{
														if (res.record.formula.value.some((item) => {
															return item.value.formula.value.match(/(class |fetch\(|function\(|XMLHttpRequest\(|=>|var |let |const )/g);
														}))
														{
															kb.alert(kb.constants.config.message.invalid.formula[kb.operator.language]);
															kb.config[PLUGIN_ID].tabbed.activate(item);
															error=true;
														}
														else
														{
															res.record.clear.value=res.record.clear.value.filter((item) => item.value.table.value);
															res.record.fill.value=res.record.fill.value.filter((item) => item.value.table.value);
															res.record.formula.value=res.record.formula.value.filter((item) => item.value.field.value);
														}
													}
												}
												if (!error)
												{
													if (res.record.lookupApp.value)
													{
														((fields) => {
															var criteria={
																config:[],
																table:[]
															};
															var sort={
																config:res.record.lookupSort.value.filter((item) => item.value.field.value)
															};
															var mapping={
																config:[],
																table:[]
															};
															res.record.lookupCriteria.value.each((values,index) => {
																if (values.value.external.value && values.value.internal.value)
																{
																	criteria.config.push(values);
																	criteria.table.push(fields.internal[values.value.internal.value].tableCode);
																}
															});
															if (criteria.config.length==0)
															{
																kb.alert(kb.constants.config.message.invalid.lookup.criteria[kb.operator.language]);
																kb.config[PLUGIN_ID].tabbed.activate(item);
																error=true;
															}
															else
															{
																criteria.table=Array.from(new Set(criteria.table)).filter((item) => item);
																if (criteria.table.length>1)
																{
																	kb.alert(kb.constants.config.message.invalid.lookup.multiple[kb.operator.language]);
																	kb.config[PLUGIN_ID].tabbed.activate(item);
																	error=true;
																}
																else
																{
																	res.record.lookupMapping.value.each((values,index) => {
																		if (values.value.external.value && values.value.internal.value)
																		{
																			mapping.config.push(values);
																			mapping.table.push(fields.internal[values.value.internal.value].tableCode);
																		}
																	});
																	if (mapping.config.length==0)
																	{
																		kb.alert(kb.constants.config.message.invalid.lookup.mapping[kb.operator.language]);
																		kb.config[PLUGIN_ID].tabbed.activate(item);
																		error=true;
																	}
																	else
																	{
																		mapping.table=Array.from(new Set(mapping.table));
																		if (mapping.table.length>1)
																		{
																			kb.alert(kb.constants.config.message.invalid.lookup.incompatible[kb.operator.language]);
																			kb.config[PLUGIN_ID].tabbed.activate(item);
																			error=true;
																		}
																		else
																		{
																			if (mapping.table.first())
																			{
																				if (criteria.table.length>0)
																				{
																					if (mapping.table.first()!=criteria.table.first())
																					{
																						kb.alert(kb.constants.config.message.invalid.lookup.unmatch[kb.operator.language]);
																						kb.config[PLUGIN_ID].tabbed.activate(item);
																						error=true;
																					}
																				}
																			}
																			else
																			{
																				if (criteria.table.length!=0)
																				{
																					kb.alert(kb.constants.config.message.invalid.lookup.table[kb.operator.language]);
																					kb.config[PLUGIN_ID].tabbed.activate(item);
																					error=true;
																				}
																			}
																			if (!error)
																			{
																				res.record.lookupCriteria.value=criteria.config;
																				res.record.lookupSort.value=sort.config;
																				res.record.lookupMapping.value=mapping.config;
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
													else
													{
														res.record.lookupCriteria.value=[];
														res.record.lookupSort.value=[];
														res.record.lookupMapping.value=[];
													}
												}
												if (!error)
												{
													if (res.record.userSource.value)
													{
														res.record.userMapping.value=res.record.userMapping.value.filter((item) => item.value.item.value && item.value.field.value);
														res.record.userCustomItem.value=res.record.userCustomItem.value.filter((item) => item.value.item.value && item.value.field.value);
														config.tab.push({label:item.label.html(),setting:res.record});
													}
													else
													{
														res.record.userMapping.value=[];
														res.record.userCustomItem.value=[];
														config.tab.push({label:item.label.html(),setting:res.record});
													}
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
													{index:0,label:'change'},
													{index:1,label:'create'},
													{index:2,label:'edit'},
													{index:3,label:'reuse'},
													{index:4,label:'process'},
													{index:5,label:'detail'},
													{index:6,label:'index'}
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
											view:{
												code:'view',
												type:'DROP_DOWN',
												label:kb.constants.config.caption.view[kb.operator.language],
												required:false,
												noLabel:false,
												options:[]
											},
											clear:{
												code:'clear',
												type:'SUBTABLE',
												label:'',
												noLabel:true,
												fields:{
													table:{
														code:'table',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.clear.table[kb.operator.language],
														required:false,
														noLabel:true,
														options:[]
													}
												}
											},
											fill:{
												code:'fill',
												type:'SUBTABLE',
												label:'',
												noLabel:true,
												fields:{
													table:{
														code:'table',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.fill.table[kb.operator.language],
														required:false,
														noLabel:true,
														options:[]
													},
													range:{
														code:'range',
														type:'SINGLE_LINE_TEXT',
														label:kb.constants.config.caption.fill.range[kb.operator.language],
														required:false,
														noLabel:true
													}
												}
											},
											formula:{
												code:'formula',
												type:'SUBTABLE',
												label:'',
												noLabel:true,
												fields:{
													field:{
														code:'field',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.formula.field[kb.operator.language],
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
														contents:'<span class="kb-icon kb-icon-arrow kb-icon-arrow-left"></span>'
													},
													formula:{
														code:'formula',
														type:'SINGLE_LINE_TEXT',
														label:kb.constants.config.caption.formula.formula[kb.operator.language],
														required:false,
														noLabel:true
													}
												}
											},
											lookupApp:{
												code:'lookupApp',
												type:'DROP_DOWN',
												label:'',
												required:false,
												noLabel:true,
												options:[]
											},
											lookupCriteria:{
												code:'lookupCriteria',
												type:'SUBTABLE',
												label:'',
												noLabel:true,
												fields:{
													external:{
														code:'external',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.lookup.external[kb.operator.language],
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
														label:kb.constants.config.caption.lookup.internal[kb.operator.language],
														required:false,
														noLabel:true,
														options:[]
													}
												}
											},
											lookupIgnore:{
												code:'lookupIgnore',
												type:'CHECK_BOX',
												label:'',
												required:false,
												noLabel:true,
												options:[
													{index:0,label:'ignore'}
												]
											},
											lookupFilter:{
												code:'lookupFilter',
												type:'CONDITION',
												label:'',
												required:false,
												noLabel:true,
												app:{
													id:kintone.app.getId(),
													fields:fieldInfos.parallelize
												}
											},
											lookupSort:{
												code:'lookupSort',
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
											lookupMapping:{
												code:'lookupMapping',
												type:'SUBTABLE',
												label:'',
												noLabel:true,
												fields:{
													external:{
														code:'external',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.lookup.external[kb.operator.language],
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
														label:kb.constants.config.caption.lookup.internal[kb.operator.language],
														required:false,
														noLabel:true,
														options:[]
													}
												}
											},
											lookupLimited:{
												code:'lookupLimited',
												type:'CHECK_BOX',
												label:'',
												required:false,
												noLabel:true,
												options:[
													{index:0,label:'limited'}
												]
											},
											lookupOverwrite:{
												code:'lookupOverwrite',
												type:'CHECK_BOX',
												label:'',
												required:false,
												noLabel:true,
												options:[
													{index:0,label:'overwrite'}
												]
											},
											lookupReset:{
												code:'lookupReset',
												type:'CHECK_BOX',
												label:'',
												required:false,
												noLabel:true,
												options:[
													{index:0,label:'reset'}
												]
											},
											userSource:{
												code:'userSource',
												type:'DROP_DOWN',
												label:'',
												required:false,
												noLabel:true,
												options:[]
											},
											userMapping:{
												code:'userMapping',
												type:'SUBTABLE',
												label:'',
												noLabel:true,
												fields:{
													item:{
														code:'item',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.user.item[kb.operator.language],
														required:false,
														noLabel:true,
														options:[
															{index:0,label:''},
															{index:1,label:'code'},
															{index:2,label:'name'},
															{index:3,label:'email'},
															{index:4,label:'phone'},
															{index:5,label:'mobilePhone'},
															{index:6,label:'extensionNumber'},
															{index:7,label:'callto'},
															{index:8,label:'url'},
															{index:9,label:'employeeNumber'},
															{index:10,label:'joinDate'},
															{index:11,label:'birthDate'},
															{index:12,label:'description'}
														]
													},
													guide:{
														code:'guide',
														type:'SPACER',
														label:'',
														required:false,
														noLabel:true,
														contents:'<span class="kb-icon kb-icon-arrow kb-icon-arrow-right"></span>'
													},
													field:{
														code:'field',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.user.field[kb.operator.language],
														required:false,
														noLabel:true,
														options:[]
													}
												}
											},
											userCustomItem:{
												code:'userCustomItem',
												type:'SUBTABLE',
												label:'',
												noLabel:true,
												fields:{
													item:{
														code:'item',
														type:'SINGLE_LINE_TEXT',
														label:kb.constants.config.caption.user.item[kb.operator.language],
														required:false,
														noLabel:true
													},
													guide:{
														code:'guide',
														type:'SPACER',
														label:'',
														required:false,
														noLabel:true,
														contents:'<span class="kb-icon kb-icon-arrow kb-icon-arrow-right"></span>'
													},
													field:{
														code:'field',
														type:'DROP_DOWN',
														label:kb.constants.config.caption.user.field[kb.operator.language],
														required:false,
														noLabel:true,
														options:[]
													}
												}
											},
											userPrimaryOrganization:{
												code:'userPrimaryOrganization',
												type:'DROP_DOWN',
												label:'',
												required:false,
												noLabel:true,
												options:[]
											},
											userOrganization:{
												code:'userOrganization',
												type:'DROP_DOWN',
												label:'',
												required:false,
												noLabel:true,
												options:[]
											},
											userGroup:{
												code:'userGroup',
												type:'DROP_DOWN',
												label:'',
												required:false,
												noLabel:true,
												options:[]
											},
											userOverwrite:{
												code:'userOverwrite',
												type:'CHECK_BOX',
												label:'',
												required:false,
												noLabel:true,
												options:[
													{index:0,label:'overwrite'}
												]
											}
										},
										flat:{
										}
									}
								};
								var setup=(tab,app,record) => {
									kb.record.set(tab.panel,app,(() => {
										if (record.event.value.includes('process')) tab.panel.elm('[field-id=action]').closest('section').removeClass('kb-hidden');
										if (record.event.value.includes('detail')) tab.panel.elm('[field-id=label]').closest('section').removeClass('kb-hidden');
										if (record.event.value.includes('detail')) tab.panel.elm('[field-id=message]').closest('section').removeClass('kb-hidden');
										if (record.event.value.includes('index')) tab.panel.elm('[field-id=label]').closest('section').removeClass('kb-hidden');
										if (record.event.value.includes('index')) tab.panel.elm('[field-id=message]').closest('section').removeClass('kb-hidden');
										if (record.event.value.includes('index')) tab.panel.elm('[field-id=view]').closest('section').removeClass('kb-hidden');
										tab.panel.elm('[field-id=lookupApp]').elm('select').val(record.lookupApp.value).rebuild().then((fields) => {
											tab.tables.lookupCriteria.clearRows();
											record.lookupCriteria.value.each((values,index) => {
												if (values.value.external.value in fields.criteria)
													((row) => {
														row.elm('[field-id=external]').elm('select').val(values.value.external.value).rebuild().then((fields) => {
															if (values.value.internal.value in fields)
															{
																row.elm('[field-id=operator]').elm('select').val(values.value.operator.value);
																row.elm('[field-id=internal]').elm('select').val(values.value.internal.value);
															}
														});
													})(tab.tables.lookupCriteria.addRow());
											});
											if (tab.tables.lookupCriteria.tr.length==0) tab.tables.lookupCriteria.addRow();
											tab.tables.lookupSort.clearRows();
											record.lookupSort.value.each((values,index) => {
												if (values.value.field.value in fields.sort)
													((row) => {
														row.elm('[field-id=field]').elm('select').val(values.value.field.value);
														row.elm('[field-id=order]').elm('select').val(values.value.order.value);
													})(tab.tables.lookupSort.addRow());
											});
											if (tab.tables.lookupSort.tr.length==0) tab.tables.lookupSort.addRow();
											tab.tables.lookupMapping.clearRows();
											record.lookupMapping.value.each((values,index) => {
												if (values.value.external.value in fields.mapping)
													((row) => {
														row.elm('[field-id=external]').elm('select').val(values.value.external.value).rebuild().then((fields) => {
															if (values.value.internal.value in fields) row.elm('[field-id=internal]').elm('select').val(values.value.internal.value);
														});
													})(tab.tables.lookupMapping.addRow());
											});
											if (tab.tables.lookupMapping.tr.length==0) tab.tables.lookupMapping.addRow();
											((field) => {
												field.elm('.kb-guide').empty();
												if (record.lookupFilter.value)
												{
													field.elm('input').val(record.lookupFilter.value);
													record.lookupFilter.value.split(' and ').each((value,index) => field.guide(value));
												}
												else field.elm('input').val('');
											})(tab.panel.elm('[field-id=lookupFilter]').elm('.kb-field-value'));
										});
										tab.panel.elm('[field-id=userSource]').elm('select').val(record.userSource.value).rebuild().then((fields) => {
											tab.tables.userMapping.clearRows();
											record.userMapping.value.each((values,index) => {
												if (values.value.field.value in fields.mapping)
													((row) => {
														row.elm('[field-id=item]').elm('select').val(values.value.item.value);
														row.elm('[field-id=field]').elm('select').val(values.value.field.value);
													})(tab.tables.userMapping.addRow());
											});
											if (tab.tables.userMapping.tr.length==0) tab.tables.userMapping.addRow();
											tab.tables.userCustomItem.clearRows();
											record.userCustomItem.value.each((values,index) => {
												if (values.value.field.value in fields.custom)
													((row) => {
														row.elm('[field-id=item]').elm('input').val(values.value.item.value);
														row.elm('[field-id=field]').elm('select').val(values.value.field.value);
													})(tab.tables.userCustomItem.addRow());
											});
											if (tab.tables.userCustomItem.tr.length==0) tab.tables.userCustomItem.addRow();
											((field) => {
												if (record.userPrimaryOrganization.value in fields.organization) field.elm('select').val(record.userPrimaryOrganization.value);
												else field.elm('select').val('');
											})(tab.panel.elm('[field-id=userPrimaryOrganization]').elm('.kb-field-value'));
											((field) => {
												if (record.userOrganization.value in fields.organization) field.elm('select').val(record.userOrganization.value);
												else field.elm('select').val('');
											})(tab.panel.elm('[field-id=userOrganization]').elm('.kb-field-value'));
											((field) => {
												if (record.userGroup.value in fields.group) field.elm('select').val(record.userGroup.value);
												else field.elm('select').val('');
											})(tab.panel.elm('[field-id=userGroup]').elm('.kb-field-value'));
										});
										return record;
									})())
									.then(() => {
										tab.tables.formula.tr.each((element,index) => {
											element.elm('select').rebuild();
										});
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
												tab.fields={
													external:{},
													internal:fieldInfos
												};
												tab.tables={
													fill:kb.table.activate(kb.table.create(app.fields.fill),app),
													clear:kb.table.activate(kb.table.create(app.fields.clear),app),
													formula:kb.table.create(app.fields.formula,false,false,false).addClass('kb-mapping').spread((row,index) => {
														/* event */
														row.elm('.kb-table-row-add').on('click',(e) => {
															tab.tables.formula.insertRow(row);
														});
														row.elm('.kb-table-row-del').on('click',(e) => {
															kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
																tab.tables.formula.delRow(row);
															});
														});
														/* modify elements */
														((cells) => {
															cells.field.on('change',(e) => e.currentTarget.rebuild()).rebuild=() => {
																if (cells.field.val()) kb.formula.field.set(cells.formula,tab.fields.internal.parallelize[cells.field.val()]);
															};
														})({
															field:row.elm('[field-id=field]').elm('select'),
															guide:row.elm('[field-id=guide]').css({width:'100%'}).parentNode.addClass('kb-mapping-guide'),
															formula:row.elm('[field-id=formula]').css({width:'450px'}).elm('.kb-field-value')
														});
													},(table,index) => {
														if (table.tr.length==0) table.addRow();
													},false),
													lookupCriteria:kb.table.create(app.fields.lookupCriteria,false,false,false).spread((row,index) => {
														/* event */
														row.elm('.kb-table-row-add').on('click',(e) => {
															tab.tables.lookupCriteria.insertRow(row);
														});
														row.elm('.kb-table-row-del').on('click',(e) => {
															kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
																tab.tables.lookupCriteria.delRow(row);
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
													lookupMapping:kb.table.create(app.fields.lookupMapping,false,false,false).addClass('kb-mapping').spread((row,index) => {
														/* event */
														row.elm('.kb-table-row-add').on('click',(e) => {
															tab.tables.lookupMapping.insertRow(row);
														});
														row.elm('.kb-table-row-del').on('click',(e) => {
															kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
																tab.tables.lookupMapping.delRow(row);
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
																					if (!tab.fields.internal.disables.includes(fieldInfo.code))
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
													lookupSort:kb.table.activate(kb.table.create(app.fields.lookupSort),app),
													userMapping:kb.table.activate(kb.table.create(app.fields.userMapping).addClass('kb-mapping'),app),
													userCustomItem:kb.table.activate(kb.table.create(app.fields.userCustomItem).addClass('kb-mapping'),app)
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
													.append(kb.create('section').addClass('kb-hidden').append(kb.field.activate(kb.field.create(app.fields.label).css({width:'100%'}),app)))
													.append(kb.create('section').addClass('kb-hidden').append(kb.field.activate(kb.field.create(app.fields.message).css({width:'100%'}),app)))
													.append(
														kb.create('section').addClass('kb-hidden')
														.append(kb.field.activate(((res) => {
															res.elm('select').empty().assignOption(([{code:'',label:kb.constants.config.caption.view.all[kb.operator.language]}]).concat(viewInfos.list.map((item) => {
																return {code:item.id,label:item.name};
															})),'label','code');
															return res;
														})(kb.field.create(app.fields.view)),app))
													)
												)
												.append(kb.create('h1').html(kb.constants.config.caption.clear[kb.operator.language]))
												.append(
													kb.create('section')
													.append(((table) => {
														table.template.elm('[field-id=table]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,null,true,false),'label','code');
														return table;
													})(tab.tables.clear))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.clear[kb.operator.language]))
												)
												.append(kb.create('h1').html(kb.constants.config.caption.fill[kb.operator.language]))
												.append(
													kb.create('section')
													.append(((table) => {
														table.template.elm('[field-id=table]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,null,true,false),'label','code');
														table.template.elm('[field-id=range]').css({width:'450px'});
														return table;
													})(tab.tables.fill))
													.append(kb.create('p').addClass('kb-hint').html(kb.constants.config.description.fill.hint[kb.operator.language]))
													.append(
														kb.create('p').addClass('kb-hint').html(
															((anchor) => {
																return kb.constants.config.description.fill.link[kb.operator.language]+'<br>'+anchor.outerHTML;
															})(
																kb.create('a')
																.attr('href','https://kintone-booster.com/'+kb.operator.language+'/rows.html')
																.attr('target','_blank')
																.html('https://kintone-booster.com/'+kb.operator.language+'/rows.html')
															)
														)
													)
												)
												.append(kb.create('h1').html(kb.constants.config.caption.formula[kb.operator.language]))
												.append(
													kb.create('section')
													.append(((table) => {
														table.template.elm('[field-id=field]').elm('select').empty().assignOption(((fieldInfos) => {
															var res={};
															for (var key in fieldInfos)
																((fieldInfo) => {
																	if (!tab.fields.internal.disables.includes(fieldInfo.code))
																		if (fieldInfo.type!='FILE')
																			res[fieldInfo.code]=fieldInfo;
																})(fieldInfos[key]);
															return [{code:'',label:''}].concat(Object.values(res));
														})(tab.fields.internal.parallelize),'label','code');
														return table;
													})(tab.tables.formula))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.formula.fixed[kb.operator.language]))
													.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.formula.process[kb.operator.language]))
													.append(
														kb.create('p').addClass('kb-hint').html(
															((anchor) => {
																return kb.constants.config.description.formula.link[kb.operator.language]+'<br>'+anchor.outerHTML;
															})(
																kb.create('a')
																.attr('href','https://kintone-booster.com/'+kb.operator.language+'/functions.html')
																.attr('target','_blank')
																.html('https://kintone-booster.com/'+kb.operator.language+'/functions.html')
															)
														)
													)
												)
												.append(kb.create('h1').html(kb.constants.config.caption.lookup[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.create('h1').html(kb.constants.config.caption.lookup.app[kb.operator.language]))
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
																									if (!fieldInfo.tableCode) res[fieldInfo.code]=fieldInfo;
																								})(fieldInfos[key]);
																							return res;
																						})(tab.fields.external.criterias),
																						mapping:((fieldInfos) => {
																							var res={};
																							for (var key in fieldInfos)
																								((fieldInfo) => {
																									if (!fieldInfo.tableCode)
																										if (fieldInfo.type!='FILE') res[fieldInfo.code]=fieldInfo;
																								})(fieldInfos[key]);
																							return res;
																						})(tab.fields.external.parallelize),
																						sort:tab.fields.external.sorts
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
																	})(tab.tables.lookupCriteria,tab.tables.lookupSort,tab.tables.lookupMapping,tab.panel.elm('[field-id=lookupFilter]').elm('.kb-field-value'));
																});
															};
															return res;
														})(kb.field.activate(kb.field.create(app.fields.lookupApp),app)))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.lookup.criteria[kb.operator.language]))
													.append(
														kb.create('section')
														.append(tab.tables.lookupCriteria)
														.append(kb.field.activate(((res) => {
															res.elm('input').closest('label').elm('span').html(kb.constants.config.caption.lookup.ignore[kb.operator.language]);
															return res;
														})(kb.field.create(app.fields.lookupIgnore).css({width:'100%'})),app))
														.append(kb.create('p').html(kb.constants.config.caption.lookup.filter[kb.operator.language]))
														.append(kb.field.activate(kb.field.create(app.fields.lookupFilter),app))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.lookup.sort[kb.operator.language]))
													.append(
														kb.create('section')
														.append(((table) => {
															table.template.elm('[field-id=order]').elm('select').elms('option').each((element,index) => {
																element.html(kb.constants.config.caption.lookup.sort.order[kb.operator.language][index]);
															});
															table.elm('thead').hide();
															return table;
														})(tab.tables.lookupSort))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.lookup.mapping[kb.operator.language]))
													.append(
														kb.create('section')
														.append(tab.tables.lookupMapping)
														.append(kb.field.activate(((res) => {
															res.elm('input').closest('label').elm('span').html(kb.constants.config.caption.lookup.limited[kb.operator.language]);
															return res;
														})(kb.field.create(app.fields.lookupLimited).css({width:'100%'})),app))
														.append(kb.field.activate(((res) => {
															res.elm('input').closest('label').elm('span').html(kb.constants.config.caption.lookup.overwrite[kb.operator.language]);
															return res;
														})(kb.field.create(app.fields.lookupOverwrite).css({width:'100%'})),app))
														.append(kb.field.activate(((res) => {
															res.elm('input').closest('label').elm('span').html(kb.constants.config.caption.lookup.reset[kb.operator.language]);
															return res;
														})(kb.field.create(app.fields.lookupReset).css({width:'100%'})),app))
														.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.lookup.mapping[kb.operator.language]))
													)
												)
												.append(kb.create('h1').html(kb.constants.config.caption.user[kb.operator.language]))
												.append(
													kb.create('section')
													.append(kb.create('h1').html(kb.constants.config.caption.user.source[kb.operator.language]))
													.append(
														kb.create('section')
														.append(((res) => {
															res.elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
																switch (current.type)
																{
																	case 'USER_SELECT':
																		result.push({code:current.code,label:current.label});
																		break;
																}
																return result;
															}),'label','code').on('change',(e) => e.currentTarget.rebuild()).rebuild=() => {
																return new Promise((resolve,reject) => {
																	((mapping,custom,primary,organization,group) => {
																		mapping.clearRows();
																		mapping.template.elm('[field-id=field]').css({width:'100%'}).elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																		custom.clearRows();
																		custom.template.elm('[field-id=field]').css({width:'100%'}).elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																		primary.elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																		organization.elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																		group.elm('select').empty().assignOption([{code:'',label:''}],'label','code');
																		if (res.elm('select').val())
																		{
																			resolve(((tableCode) => {
																				var res={
																					custom:((fieldInfos) => {
																						var res={};
																						for (var key in fieldInfos)
																							((fieldInfo) => {
																								if (!fieldInfo.lookup && fieldInfo.tableCode==tableCode)
																									if (['SINGLE_LINE_TEXT','USER_SELECT'].includes(fieldInfo.type))
																										res[fieldInfo.code]=fieldInfo;
																							})(fieldInfos[key]);
																						return res;
																					})(tab.fields.internal.parallelize),
																					group:((fieldInfos) => {
																						var res={};
																						for (var key in fieldInfos)
																							((fieldInfo) => {
																								if (!fieldInfo.lookup && fieldInfo.tableCode==tableCode)
																									if (['GROUP_SELECT'].includes(fieldInfo.type))
																										res[fieldInfo.code]=fieldInfo;
																							})(fieldInfos[key]);
																						return res;
																					})(tab.fields.internal.parallelize),
																					mapping:((fieldInfos) => {
																						var res={};
																						for (var key in fieldInfos)
																							((fieldInfo) => {
																								if (!fieldInfo.lookup && fieldInfo.tableCode==tableCode)
																									if (['MULTI_LINE_TEXT','SINGLE_LINE_TEXT'].includes(fieldInfo.type))
																										res[fieldInfo.code]=fieldInfo;
																							})(fieldInfos[key]);
																						return res;
																					})(tab.fields.internal.parallelize),
																					organization:((fieldInfos) => {
																						var res={};
																						for (var key in fieldInfos)
																							((fieldInfo) => {
																								if (!fieldInfo.lookup && fieldInfo.tableCode==tableCode)
																									if (['ORGANIZATION_SELECT'].includes(fieldInfo.type))
																										res[fieldInfo.code]=fieldInfo;
																							})(fieldInfos[key]);
																						return res;
																					})(tab.fields.internal.parallelize)
																				};
																				mapping.template.elm('[field-id=field]').elm('select').assignOption(Object.values(res.mapping),'label','code');
																				custom.template.elm('[field-id=field]').elm('select').assignOption(Object.values(res.custom),'label','code');
																				primary.elm('select').assignOption(Object.values(res.organization),'label','code');
																				organization.elm('select').assignOption(Object.values(res.organization),'label','code');
																				group.elm('select').assignOption(Object.values(res.group),'label','code');
																				mapping.addRow();
																				custom.addRow();
																				return res;
																			})(tab.fields.internal.parallelize[res.elm('select').val()].tableCode));
																		}
																		else
																		{
																			mapping.addRow();
																			custom.addRow();
																			resolve({
																				custom:{},
																				group:{},
																				mapping:{},
																				organization:{}
																			});
																		}
																	})(
																		tab.tables.userMapping,
																		tab.tables.userCustomItem,
																		tab.panel.elm('[field-id=userPrimaryOrganization]').elm('.kb-field-value'),
																		tab.panel.elm('[field-id=userOrganization]').elm('.kb-field-value'),
																		tab.panel.elm('[field-id=userGroup]').elm('.kb-field-value')
																	);
																});
															};
															return res;
														})(kb.field.activate(kb.field.create(app.fields.userSource),app)))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.user.mapping[kb.operator.language]))
													.append(
														kb.create('section')
														.append(((table) => {
															table.template.elm('[field-id=item]').elm('select').elms('option').each((element,index) => {
																if (index>0) element.html(kb.constants.config.caption.user.item[element.val()][kb.operator.language]);
															});
															table.template.elm('[field-id=guide]').css({width:'100%'}).parentNode.addClass('kb-mapping-guide');
															return table;
														})(tab.tables.userMapping))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.user.custom[kb.operator.language]))
													.append(
														kb.create('section')
														.append(((table) => {
															table.template.elm('[field-id=guide]').css({width:'100%'}).parentNode.addClass('kb-mapping-guide');
															return table;
														})(tab.tables.userCustomItem))
														.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.user.custom[kb.operator.language]))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.user.primaryOrganization[kb.operator.language]))
													.append(
														kb.create('section')
														.append(kb.field.activate(kb.field.create(app.fields.userPrimaryOrganization),app))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.user.organization[kb.operator.language]))
													.append(
														kb.create('section')
														.append(kb.field.activate(kb.field.create(app.fields.userOrganization),app))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.user.group[kb.operator.language]))
													.append(
														kb.create('section')
														.append(kb.field.activate(kb.field.create(app.fields.userGroup),app))
													)
													.append(kb.create('h1').html(kb.constants.config.caption.user.overwrite[kb.operator.language]))
													.append(
														kb.create('section')
														.append(kb.field.activate(((res) => {
															res.elm('input').closest('label').elm('span').html(kb.constants.config.caption.user.overwrite.overwrite[kb.operator.language]);
															return res;
														})(kb.field.create(app.fields.userOverwrite).css({width:'100%'})),app))
													)
												);
												tab.panel.elm('[field-id=lookupApp]').elm('select').rebuild().then((fields) => {
													tab.tables.lookupCriteria.clearRows();
													tab.tables.lookupSort.clearRows();
													tab.tables.lookupMapping.clearRows();
													tab.tables.lookupCriteria.addRow();
													tab.tables.lookupSort.addRow();
													tab.tables.lookupMapping.addRow();
												});
												tab.panel.elm('[field-id=userSource]').elm('select').rebuild().then((fields) => {
													tab.tables.userMapping.clearRows();
													tab.tables.userCustomItem.clearRows();
													tab.tables.userMapping.addRow();
													tab.tables.userCustomItem.addRow();
												});
												tab.tables.clear.addRow();
												tab.tables.fill.addRow();
												tab.tables.formula.addRow();
												/* event */
												kb.event.on('kb.change.event',(e) => {
													if (e.container==tab.panel)
													{
														tab.panel.elm('[field-id=action]').closest('section').addClass('kb-hidden');
														tab.panel.elm('[field-id=view]').closest('section').addClass('kb-hidden');
														tab.panel.elm('[field-id=label]').closest('section').addClass('kb-hidden');
														tab.panel.elm('[field-id=message]').closest('section').addClass('kb-hidden');
														if (e.record.event.value.includes('process')) tab.panel.elm('[field-id=action]').closest('section').removeClass('kb-hidden');
														if (e.record.event.value.includes('detail')) tab.panel.elm('[field-id=label]').closest('section').removeClass('kb-hidden');
														if (e.record.event.value.includes('detail')) tab.panel.elm('[field-id=message]').closest('section').removeClass('kb-hidden');
														if (e.record.event.value.includes('index')) tab.panel.elm('[field-id=label]').closest('section').removeClass('kb-hidden');
														if (e.record.event.value.includes('index')) tab.panel.elm('[field-id=message]').closest('section').removeClass('kb-hidden');
														if (e.record.event.value.includes('index')) tab.panel.elm('[field-id=view]').closest('section').removeClass('kb-hidden');
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
													setting.lookupApp=(setting.lookupApp || setting.app);
													setting.lookupCriteria=(setting.lookupCriteria || setting.criteria);
													setting.lookupIgnore=(setting.lookupIgnore || setting.ignore);
													setting.lookupFilter=(setting.lookupFilter || setting.filter);
													setting.lookupSort=(setting.lookupSort || setting.sort);
													setting.lookupMapping=(setting.lookupMapping || setting.mapping);
													setting.lookupLimited=(setting.lookupLimited || setting.limited);
													setting.lookupOverwrite=(setting.lookupOverwrite || setting.overwrite);
													setting.lookupReset=(setting.lookupReset || setting.reset);
													setting.userSource=(setting.userSource || {value:''});
													setting.userMapping=(setting.userMapping || {value:[]});
													setting.userCustomItem=(setting.userCustomItem || {value:[]});
													setting.userPrimaryOrganization=(setting.userPrimaryOrganization || {value:''});
													setting.userOrganization=(setting.userOrganization || {value:''});
													setting.userGroup=(setting.userGroup || {value:''});
													setting.userOverwrite=(setting.userOverwrite || {value:[]});
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
								else
								{
									((tab) => {
										tab.panel.elm('[field-id=lookupApp]').elm('select').rebuild().then((fields) => {
											tab.tables.lookupCriteria.clearRows();
											tab.tables.lookupSort.clearRows();
											tab.tables.lookupMapping.clearRows();
											tab.tables.lookupCriteria.addRow();
											tab.tables.lookupSort.addRow();
											tab.tables.lookupMapping.addRow();
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
			fill:{
				en:'Add table rows',
				ja:'テーブル行追加',
				zh:'添加表格行',
				table:{
					en:'Table',
					ja:'テーブル',
					zh:'表'
				},
				range:{
					en:'Minimum number of rows or calculation formula',
					ja:'下限行数または計算式',
					zh:'最低行数或计算公式'
				}
			},
			clear:{
				en:'Delete table rows',
				ja:'テーブル行削除',
				zh:'删除表格行',
				table:{
					en:'Table',
					ja:'テーブル',
					zh:'表'
				}
			},
			event:{
				en:'Action Available Event',
				ja:'動作イベント',
				zh:'可操作事件',
				change:{
					en:'After Field Value Change',
					ja:'フィールド値変更',
					zh:'字段变更后'
				},
				create:{
					en:'After Record Creation Shown',
					ja:'レコード追加画面表示後',
					zh:'记录创建显示后'
				},
				detail:{
					en:'Clicking the button on the record detail page',
					ja:'レコード詳細画面でのボタンクリック',
					zh:'在记录详细页面上点击按钮'
				},
				edit:{
					en:'After Record Edit Shown',
					ja:'レコード編集画面表示後',
					zh:'记录编辑显示后'
				},
				index:{
					en:'Bulk Execution from List View',
					ja:'一覧画面からの一括実行',
					zh:'从列表屏幕的批量执行'
				},
				process:{
					en:'Process Action',
					ja:'プロセスアクション',
					zh:'过程操作'
				},
				reuse:{
					en:'After Record Reuse Shown',
					ja:'レコード再利用画面表示後',
					zh:'记录再利用显示后'
				}
			},
			formula:{
				en:'Inserting fixed values or calculation results',
				ja:'固定値や計算結果を挿入',
				zh:'插入固定值或计算结果',
				field:{
					en:'Field',
					ja:'フィールド',
					zh:'字段'
				},
				formula:{
					en:'Fixed value or function',
					ja:'固定値または関数',
					zh:'固定值或函数'
				}
			},
			label:{
				en:'Execution Button Label',
				ja:'実行ボタンのラベルテキスト',
				zh:'执行按钮的标签名称'
			},
			lookup:{
				en:'Lookup',
				ja:'ルックアップ',
				zh:'Lookup',
				app:{
					en:'Datasource App',
					ja:'参照元アプリ',
					zh:'参考源应用'
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
				ignore:{
					en:'If the linkage field of this app is empty, ignore the linkage',
					ja:'このアプリの関連付けフィールドが空である場合は、その関連付けを無視する',
					zh:'如果此应用的关联字段为空，则忽略该关联'
				},
				internal:{
					en:'This App',
					ja:'このアプリのフィールド',
					zh:'此应用的字段'
				},
				limited:{
					en:'Limit the records to be retrieved to the first one in the sort order',
					ja:'取得するレコードを並び順の先頭レコードのみにする',
					zh:'将获取的记录限制为排在最前面的一个'
				},
				mapping:{
					en:'Copy Field Mappings',
					ja:'コピーするフィールド',
					zh:'复制字段映射'
				},
				overwrite:{
					en:'Always overwrite with the retrieved value',
					ja:'取得した値で常に上書きをする',
					zh:'始终用检索到的值覆盖'
				},
				reset:{
					en:'If the record cannot be retrieved, clear the field',
					ja:'レコードが取得出来なかった場合は、フィールドを空にする',
					zh:'如果无法获取记录，请清空字段'
				},
				sort:{
					en:'Order of records displayed on the selection screen',
					ja:'選択画面に表示するレコードの並び順',
					zh:'选择屏幕上显示的记录顺序',
					order:{
						ja:['昇順','降順'],
						en:['ASC','DESC'],
						zh:['升序','降序']
					}
				}
			},
			message:{
				en:'Execution Confirmation Dialog Message',
				ja:'実行確認ダイアログのメッセージ',
				zh:'执行确认对话框的消息'
			},
			user:{
				en:'Copy User Informations',
				ja:'ユーザー情報のコピー',
				zh:'复制用户信息',
				custom:{
					en:'Copy Customized Items',
					ja:'カスタマイズ項目をコピー',
					zh:'复制自定义项目'
				},
				field:{
					en:'Field',
					ja:'フィールド',
					zh:'字段'
				},
				group:{
					en:'Copy the Affiliated Group',
					ja:'所属グループをコピー',
					zh:'复制所属团队'
				},
				item:{
					en:'Item',
					ja:'項目',
					zh:'项目',
					birthDate:{
						en:'Birthday',
						ja:'誕生日',
						zh:'生日'
					},
					callto:{
						en:'Skype Name',
						ja:'Skype名',
						zh:'Skype用户名'
					},
					code:{
						en:'Login Name',
						ja:'ログイン名',
						zh:'登录名称'
					},
					description:{
						en:'About Me',
						ja:'コメント',
						zh:'简介'
					},
					email:{
						en:'E-mail Address',
						ja:'メールアドレス',
						zh:'邮件地址'
					},
					employeeNumber:{
						en:'Employee ID',
						ja:'従業員ID',
						zh:'员工编号'
					},
					extensionNumber:{
						en:'Extension',
						ja:'内線',
						zh:'分机号'
					},
					joinDate:{
						en:'Hire Date',
						ja:'入社日',
						zh:'入职日期'
					},
					mobilePhone:{
						en:'Mobile Phone',
						ja:'携帯電話',
						zh:'手机'
					},
					name:{
						en:'Display Name',
						ja:'表示名',
						zh:'显示名称'
					},
					phone:{
						en:'Phone',
						ja:'電話番号',
						zh:'电话号码'
					},
					url:{
						en:'URL',
						ja:'URL',
						zh:'URL'
					}
				},
				mapping:{
					en:'Copy Profile Items',
					ja:'プロフィール項目をコピー',
					zh:'复制配置文件项目'
				},
				organization:{
					en:'Copy the Affiliated Department',
					ja:'所属組織をコピー',
					zh:'复制所属组织'
				},
				overwrite:{
					en:'"Overwrite Option',
					ja:'上書き判定',
					zh:'覆盖选项',
					overwrite:{
						en:'Always overwrite with the retrieved value',
						ja:'取得した値で常に上書きをする',
						zh:'始终用检索到的值覆盖'
					}
				},
				primaryOrganization:{
					en:'Copy the Primary Department',
					ja:'優先する組織をコピー',
					zh:'复制优先的组织'
				},
				source:{
					en:'Source Field',
					ja:'コピー元フィールド',
					zh:'源字段'
				}
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
			clear:{
				en:'If a field within the table trying to delete rows is specified in the "Conditions for operation", only the table rows that meet those conditions will be subject to deletion.',
				ja:'行の削除をしようとしているテーブル内のフィールドを動作条件に指定した場合は、その条件に該当するテーブル行のみが削除の対象となります。',
				zh:'如果在尝试删除行的表中指定了"操作的条件"的字段，那么只有满足这些条件的表行将成为删除的对象。'
			},
			fill:{
				hint:{
					en:'In the "Minimum number of rows or calculation formula" field, you can set not only a fixed value but also a function to obtain the number of days in the month to which the date in the date field belongs.',
					ja:'「下限行数または計算式」には、固定値はもちろん、日付フィールドの日付が属する月の日数を取得する関数をセットすることも可能です。',
					zh:'在"最小行数或计算公式"字段中，您不仅可以设置固定值，还可以设置一个函数，用以获取日期字段中的日期所属月份的天数。'
				},
				link:{
					en:'Please check the URL below for how to specify the number of days as the count of rows and for inserting fixed values or functions into the fields of the added rows.',
					ja:'上記の日数を行数に指定する方法と追加した行のフィールドへの固定値または関数の挿入は以下のURLをご確認下さい。',
					zh:'关于如何将上述天数指定为行数，以及在添加的行的字段中插入固定值或函数的方法，请查看下面的URL。'
				}
			},
			formula:{
				fixed:{
					en:'When entering a fixed value, please enclose it in double quotes.',
					ja:'固定値を入力する場合は、ダブルクォーテーションで囲うようにして下さい。',
					zh:'当输入固定值时，请用双引号括起来。'
				},
				link:{
					en:'You can refer to the available functions from the URL below.',
					ja:'利用可能な関数は以下のURLから参照して下さい。',
					zh:'您可以从下面的URL参考可用的功能。'
				},
				process:{
					en:'When executing multiple functions on fields within a table, the process starts with the functions in the upper row, processing all table rows, and then proceeds to the functions in the lower rows.',
					ja:'複数の関数をテーブル内フィールドに対して実行する場合は、上段の関数から順に、全てのテーブル行に対して処理を行った上で、下段の関数へと進んでいきます。',
					zh:'当在表内字段上执行多个函数时，处理会从上行的函数开始，处理所有表行，然后继续到下行的函数。'
				}
			},
			lookup:{
				mapping:{
					en:'When copying to a table, please note that all destination fields must be within the same table.',
					ja:'テーブルにコピーする場合は、コピー先フィールドが全て同一テーブル内にある必要がありますので、ご注意ください。',
					zh:'当您要复制到表格时，请注意所有目标字段都必须在同一表格内。'
				}
			},
			status:{
				en:'There are fields that cannot be modified during process action execution, so please check the URL below.',
				ja:'プロセスアクション実行時には書き換えることが出来ないフィールドがありますので、下記URLをご確認ください。',
				zh:'在执行过程操作时，有一些字段是无法修改的，请查看以下URL。'
			},
			user:{
				custom:{
					en:'Please enter "Field Code" in the item column.',
					ja:'項目欄には「項目コード」を入力して下さい。',
					zh:'请在项目栏中输入“项目代码”。'
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
				fill:{
					en:'Please enter the "Minimum number of rows or calculation formula".',
					ja:'「下限行数または計算式」を入力して下さい。',
					zh:'请输入“最低行数或计算公式”。'
				},
				formula:{
					en:'Contains characters that cannot be used in the formula.',
					ja:'計算式に使用出来ない文字が含まれています。',
					zh:'表达式中包含无效字符。'
				},
				label:{
					detail:{
						en:'If you specify "Clicking the button on the record detail page" for the action event, please input its execution button label.',
						ja:'動作イベントに「レコード詳細画面でのボタンクリック」を指定した場合は、その実行ボタンのラベルテキストを入力して下さい。',
						zh:'如果在操作事件中指定了“在记录详细页面上点击按钮”，请输入其执行按钮的标签名称。'
					},
					index:{
						en:'If you specify "Bulk Execution from List View" for the action event, please input its execution button label.',
						ja:'動作イベントに「一覧画面からの一括実行」を指定した場合は、その実行ボタンのラベルテキストを入力して下さい。',
						zh:'如果在操作事件中指定了“从列表屏幕的批量执行”，请输入其执行按钮的标签名称。'
					}
				},
				lookup:{
					criteria:{
						en:'Please specify the Reference association.',
						ja:'参照するレコードの関連付けを指定して下さい。',
						zh:'请指定参考关联记录。'
					},
					incompatible:{
						en:'You cannot specify a field in a different table or a field that does not belong to any table for the Copy Field Mappings.',
						ja:'コピーするフィールドに異なるテーブル内のフィールド、もしくはテーブルに属さないフィールドを指定することは出来ません。',
						zh:'在复制字段映射中，您不能指定来自不同表的字段或不属于表的字段。'
					},
					mapping:{
						en:'Please specify the Copy Field Mappings.',
						ja:'コピーするフィールドを指定して下さい。',
						zh:'请指定复制字段映射。'
					},
					multiple:{
						en:'You cannot specify a field in a different table for the Reference association.',
						ja:'参照するレコードの関連付けに異なるテーブル内のフィールドを指定することは出来ません。',
						zh:'您不能为参考关联记录指定不同表中的字段。'
					},
					table:{
						en:'If no field within the table is specified in the Copy Field Mappings, it is not possible to specify a field within the table for the Reference association.',
						ja:'コピーするフィールドにテーブル内のフィールドの指定がない場合は、参照するレコードの関連付けにテーブル内のフィールドを指定することは出来ません。',
						zh:'如果在复制字段映射中没有指定表内的字段，那么无法在参考关联记录中指定表内的字段。'
					},
					unmatch:{
						en:'If a field within the table is specified in the Copy Field Mappings, it is not possible to specify a field from a different table for the Reference association.',
						ja:'コピーするフィールドにテーブル内のフィールドを指定した場合は、参照するレコードの関連付けに異なるテーブル内のフィールドを指定することは出来ません。',
						zh:'如果在复制字段映射中指定了表内的字段，那么无法在参考关联记录中指定另一个表内的字段。'
					}
				},
				message:{
					detail:{
						en:'If you specify "Clicking the button on the record detail page" for the action event, please input its execution confirmation dialog message.',
						ja:'動作イベントに「レコード詳細画面でのボタンクリック」を指定した場合は、その実行確認ダイアログのメッセージを入力して下さい。',
						zh:'如果在操作事件中指定了“在记录详细页面上点击按钮”，请输入其执行确认对话框的消息。'
					},
					index:{
						en:'If you specify "Bulk Execution from List View" for the action event, please input its execution confirmation dialog message.',
						ja:'動作イベントに「一覧画面からの一括実行」を指定した場合は、その実行確認ダイアログのメッセージを入力して下さい。',
						zh:'如果在操作事件中指定了“从列表屏幕的批量执行”，请输入其执行确认对话框的消息。'
					}
				}
			}
		}
	}
},kb.constants);
