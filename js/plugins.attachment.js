/*
* FileName "plugins.attachment.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
((PLUGIN_ID) => {
	var vars={forceUpdate:false,observers:[]};
	var createField={
		file:(fieldInfo) => {
			const element=new Kuc.Attachment({
				className:'control-gaia kb-attachment-field-'+fieldInfo.id,
				label:'',
				language:kb.operator.language,
				message:(() => {
					var res='';
					switch (kb.operator.language)
					{
						case 'en':
							res='(Maximum: 1 GB)';
							break;
						case 'ja':
							res='(最大1 GB)';
							break;
						case 'zh':
							res='(最大1 GB)';
							break;
						case 'zh-TW':
							res='(最大1 GB)';
							break;
					}
					return res;
				})(),
				requiredIcon:fieldInfo.required
			});
			Object.defineProperty(
				element,
				'value',
				{
					get(){
						return this.files;
					},
					set(value){
						var res=[];
						var recurse=(index,callback) => {
							kb.file.download(value[index],true)
							.then((blob) => {
								res.push(new File([blob],value[index].name,{type:value[index].contentType}));
								index++;
								if (index<value.length) recurse(index,callback);
								else callback(res);
							})
							.catch((error) => {
								kb.alert(kb.error.parse(error));
								this.files=[];
							});
						};
						if (Array.isArray(value) && value.length!=0) recurse(0,(resp) => this.files=resp);
						else this.files=[];
					},
					enumerable:true,
					configurable:true
				}
			);
			return element;
		}
	};
	var expandSetting=(setting) => {
		var res={};
		if (setting.useMultiline.value.includes('use') && !vars.mobile)
		{
			for (var key in vars.fieldInfos.tables)
				((tableInfo) => {
					var columns=Object.keys(tableInfo.fields).filter((item) => setting.multilines.value.map((item) => item.value.field.value).includes(item));
					if (columns.length!=0)
					{
						((lines) => {
							res[tableInfo.id]={
								tableInfo:tableInfo,
								lines:lines
							};
						})(Object.keys(tableInfo.fields).reduce((result,current) => {
							if (columns.includes(current))
								if (result.last().length!=0) result.push([]);
							result.last().push(vars.fieldInfos.parallelize[current].id);
							return result;
						},[[]]));
					}
				})(vars.fieldInfos.tables[key]);
		}
		return [setting,res];
	};
	var observeTable=(tableInfo,record,handlers) => {
		((observer) => {
			observer.observe(kb.elm('.subtable-'+tableInfo.id),{childList:true,subtree:true});
			if (kb.elms('.subtable-'+tableInfo.id+' tbody tr').length==record[tableInfo.code].value.length) handlers.each((handler,index) => handler({record:record}));
			vars.observers.push(observer);
		})(new MutationObserver(() => {
			handlers.each((handler,index) => handler({record:record}));
		}));
	};
	var tabAdjust=(container,prev,next,coord=0) => {
		if (container.scrollWidth>container.clientWidth)
		{
			if (container.scrollLeft+coord>0) prev.removeAttr('disabled');
			else prev.attr('disabled','disabled');
			if (container.scrollLeft+coord<container.scrollWidth-container.clientWidth) next.removeAttr('disabled');
			else next.attr('disabled','disabled');
		}
		else
		{
			prev.attr('disabled','disabled');
			next.attr('disabled','disabled');
		}
	};
	kintone.events.on([
		'app.record.create.show',
		'app.record.edit.show',
		'mobile.app.record.create.show',
		'mobile.app.record.edit.show'
	],(e) => {
		return new Promise((resolve,reject) => {
			((mobile,type) => {
				vars.mobile=mobile;
				vars.type=type;
				vars.observers.each((observer,index) => observer.disconnect());
				vars.observers=[];
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
								(([setting,multilineInfos]) => {
									var observes={};
									if (setting.useLookupNavi.value.includes('use'))
									{
										Object.values(vars.fieldInfos.parallelize).filter((item) => item.lookup).each((fieldInfo,index) => {
											((handler) => {
												if (fieldInfo.tableCode)
												{
													((tableInfo) => {
														if (!(tableInfo.code in observes)) observes[tableInfo.code]=[];
														observes[tableInfo.code].push(handler);
													})(vars.fieldInfos.tables[fieldInfo.tableCode]);
												}
												else handler({record:e.record});
											})((e) => {
												((field) => {
													if (field)
														(Array.isArray(field)?field:[field]).each((field,index) => {
															if (!field.value.parentNode.elm('.kb-attachment-lookup-operation'))
																field.value.parentNode.css({alignItems:'center'}).insertBefore(
																	kb.create('button').addClass('kb-icon kb-icon-open kb-attachment-lookup-operation')
																	.on('click',(e) => {
																		((value,app) => {
																			if (value)
																			{
																				kb.view.records.get(
																					app,
																					kb.filter.query.create({code:fieldInfo.lookup.relatedKeyField},'=',{type:fieldInfo.type,value:value})
																				)
																				.then((records) => {
																					if (records.length!=0) window.open(kb.record.page.detail(vars.mobile,app,records.first()['$id'].value));
																				})
																				.catch((error) => kb.alert(kb.error.parse(error)))
																			}
																			else window.open(kb.record.page.add(vars.mobile,app));
																		})(field.value.elm('input[type=text]').val(),fieldInfo.lookup.relatedApp.app);
																	}),
																	field.value.nextSibling
																);
														});
												})(kb.field.get(fieldInfo,vars.mobile,vars.type));
											});
										});
									}
									if (setting.usePlaceholder.value.includes('use'))
									{
										setting.placeholders.value.map((item) => item.value).each((placeholder,index) => {
											if (placeholder.field.value in vars.fieldInfos.parallelize)
												((fieldInfo) => {
													((handler) => {
														if (fieldInfo.tableCode)
														{
															((tableInfo) => {
																if (!(tableInfo.code in observes)) observes[tableInfo.code]=[];
																observes[tableInfo.code].push(handler);
															})(vars.fieldInfos.tables[fieldInfo.tableCode]);
														}
														else handler({record:e.record});
													})((e) => {
														((field) => {
															if (field)
																(Array.isArray(field)?field:[field]).each((field,index) => {
																	if (vars.mobile) field.value.attr('placeholder',placeholder.text.value);
																	else field.value.elm('input[type=text],textarea').attr('placeholder',placeholder.text.value);
																});
														})(kb.field.get(fieldInfo,vars.mobile,vars.type));
													});
												})(vars.fieldInfos.parallelize[placeholder.field.value]);
										});
									}
									if (setting.useAlignTableButtons.value.includes('use') && !vars.mobile)
									{
										Object.values(fieldInfos.tables).filter((item) => !Object.keys(multilineInfos).includes(item.id)).each((table,index) => {
											((tableInfo,table) => {
												if (e.record[tableInfo.code].value.length!=0)
												{
													((row) => {
														row.prepend(row.elm('[class^="subtable-operation-gaia"]'));
													})(table.addClass('kb-attachment-subtable-operation').elm('thead').elm('tr'));
													if (!(tableInfo.code in observes)) observes[tableInfo.code]=[];
													observes[tableInfo.code].push((e) => {
														table.elms('tbody tr').each((row,index) => {
															if (Array.from(row.elms('td').last().classList).some(className => className.startsWith('subtable-operation-gaia')))
																row.prepend(row.elm('[class^="subtable-operation-gaia"]'));
														});
													});
												}
											})(table,kb.elm('.subtable-'+table.id));
										});
									}
									if (setting.useMultiline.value.includes('use') && !vars.mobile)
									{
										for (var key in multilineInfos)
											((multilineInfo,table) => {
												var reformat=(multilineInfo,rows,isHead) => {
													var shrinks=[];
													if (rows)
														rows.elms('tr').each((row,index) => {
															if (!row.hasClass('kb-attachment-subtable-multi'))
															{
																((container) => {
																	if (setting.useAlignTableButtons.value.includes('use')) row.addClass('kb-attachment-subtable-multi').append(container);
																	else row.addClass('kb-attachment-subtable-multi').prepend(container);
																	multilineInfo.lines.each((columns,index) => {
																		container.append(((contents) => {
																			columns.each((column,index) => {
																				var properties={};
																				if (isHead)
																				{
																					if (column) contents.append(row.elm('.label-'+column).addClass('kb-attachment-subtable-multi-cell').css(properties));
																					else contents.append(kb.create('th').addClass('subtable-label-gaia kb-attachment-subtable-multi-cell').css(properties));
																				}
																				else
																				{
																					properties['width']=table.elm('thead').elm('.label-'+column).css('width');
																					if (column) contents.append(row.elm('.field-'+column).closest('td').addClass('kb-attachment-subtable-multi-cell').css(properties));
																					else contents.append(kb.create('td').addClass('kb-attachment-subtable-multi-cell').css(properties));
																				}
																				if (index==columns.length-1) shrinks.push(contents.lastElementChild);
																			});
																			return contents;
																		})(kb.create('div').css({alignItems:'stretch',display:'flex'})));
																	});
																	if (isHead)
																	{
																		((max) => {
																			kb.children(container).each((element,index) => {
																				var width=kb.children(element).reduce((result,current) => {
																					result+=current.outerWidth(false)
																					return result;
																				},0);
																				if (width<max) kb.children(element).last().css({flex:'1'});
																			});
																		})(container.firstElementChild.outerWidth(false));
																	}
																})((isHead)?kb.create('th').addClass('subtable-label-gaia'):kb.create('td'));
															}
														});
													if (!isHead) shrinks.each((element,index) => element.css({flex:'1'}))
												};
												if (e.record[multilineInfo.tableInfo.code].value.length!=0)
												{
													if (setting.useAlignTableButtons.value.includes('use')) table.addClass('kb-attachment-subtable-operation');
													reformat(multilineInfo,table.elm('thead'),true);
													if (!(multilineInfo.tableInfo.code in observes)) observes[multilineInfo.tableInfo.code]=[];
													observes[multilineInfo.tableInfo.code].push((e) => {
														reformat(multilineInfo,table.elm('tbody'),false);
													});
												}
											})(multilineInfos[key],kb.elm('.subtable-'+multilineInfos[key].tableInfo.id));
									}
									if (!('useTableCopy' in setting))
									{
										kb.alert(kb.error.config.update('Boost! Attachment'));
										setting.useTableCopy={value:[]};
									}
									if ((setting.useTableCopy.value.includes('use') || setting.useTableSort.value.includes('use')) && !vars.mobile)
									{
										if (typeof Kuc==='object')
										{
											Object.values(vars.fieldInfos.tables).each((table,index) => {
												((tableInfo,table) => {
													var keep={
														index:null,
														fields:{}
													};
													var set=(record) => {
														kb.event.call('kb.action.call',{
															container:kb.elm('body'),
															record:record,
															mobile:vars.mobile,
															pattern:'change',
															fields:[tableInfo.code].concat(Object.keys(tableInfo.fields)),
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
																kb.event.call('kb.cascade.call',param)
																.then((param) => {
																	((vars.mobile)?kintone.mobile.app.record:kintone.app.record).set({record:param.record});
																})
																.catch(() => {});
															})
															.catch(() => {});
														})
														.catch(() => {});
													};
													((handler) => {
														if (!(tableInfo.code in observes)) observes[tableInfo.code]=[];
														observes[tableInfo.code].push(handler);
													})((e) => {
														((record) => {
															record[tableInfo.code].value.each((row,index) => {
																Object.values(tableInfo.fields).filter((item) => item.type=='FILE').each((fieldInfo) => {
																	((field) => {
																		if (Array.isArray(field) && field.length!=0)
																		{
																			((field) => {
																				if (!field.nextSibling || !field.nextSibling.tagName.toLowerCase().startsWith('kuc'))
																				{
																					field.hide().insertAdjacentElement('afterend',createField.file(fieldInfo));
																					field.nextSibling.value=record[tableInfo.code].value[index].value[fieldInfo.code].value;
																				}
																				if (kb.isNumeric(keep.index) && keep.index==index)
																				{
																					field.nextSibling.files=keep.fields[fieldInfo.id];
																					keep={
																						index:null,
																						fields:{}
																					};
																				}
																			})(field[index]);
																		}
																	})(kb.field.get(fieldInfo,vars.mobile,vars.type));
																});
															});
														})((() => { try { return kintone.app.record.get().record; } catch { return e.record; } })());
														if (setting.useTableCopy.value.includes('use'))
														{
															table.elms('[class^="subtable-operation-gaia"]').each((element,index) => {
																((add,copy) => {
																	if (add)
																		if (!element.elm('.kb-attachment-subtable-copy'))
																		{
																			element.insertBefore(
																				copy.on('click',(e) => {
																					((index,record) => {
																						((copies) => {
																							keep={
																								index:index+1,
																								fields:Object.values(tableInfo.fields).filter((item) => item.type=='FILE').reduce((result,current) => {
																									result[current.id]=[...table.elms('tbody .kb-attachment-field-'+current.id)[index].files];
																									return result;
																								},{})
																							};
																							for (let key in copies)
																								if (copies[key].value===undefined)
																								{
																									switch (tableInfo.fields[key].type)
																									{
																										case 'CHECK_BOX':
																										case 'FILE':
																										case 'GROUP_SELECT':
																										case 'MULTI_SELECT':
																										case 'ORGANIZATION_SELECT':
																										case 'USER_SELECT':
																											copies[key].value=[];
																											break;
																										default:
																											copies[key].value=null;
																											break;
																									}
																								}
																							record[tableInfo.code].value.splice(index+1,0,{value:copies});
																							set(record);
																						})(kb.extend({},record[tableInfo.code].value[index].value));
																					})(table.elms('.kb-attachment-subtable-copy').indexOf(copy),kintone.app.record.get().record);
																				}),
																				add.nextSibling
																			);
																		}
																})(element.elm('button'),kb.create('button').addClass('kb-icon kb-icon-copy kb-attachment-subtable-copy'));
															});
														}
													});
													if (setting.useTableSort.value.includes('use'))
													{
														Object.values(tableInfo.fields).each((fieldInfo,index) => {
															var sort=(values,desc) => {
																var isNumeric=(() => {
																	var res=false;
																	if (fieldInfo.type=='NUMBER') res=true;
																	else
																	{
																		switch (fieldInfo.type)
																		{
																			case 'CALC':
																				switch (fieldInfo.format)
																				{
																					case 'NUMBER':
																					case 'NUMBER_DIGIT':
																						res=true;
																						break;
																				}
																				break;
																		}
																	}
																	return res;
																})();
																values.each((row,index) => row.rowIndex=index);
																return values.sort((a, b) => {
																	var reference=(desc)?(b.value[fieldInfo.code].value || ''):(a.value[fieldInfo.code].value || '');
																	var compare=(desc)?(a.value[fieldInfo.code].value || ''):(b.value[fieldInfo.code].value || '');
																	return reference.localeCompare(compare,undefined,isNumeric?{numeric:true}:undefined);
																});
															};
															if (['CALC','DATE','DATETIME','DROP_DOWN','LINK','NUMBER','RADIO_BUTTON','SINGLE_LINE_TEXT','TIME'].includes(fieldInfo.type))
																table.elm('thead .label-'+fieldInfo.id).on('click',(e) => {
																	((column,record,multi) => {
																		((className) => {
																			if (column.hasClass(className+'desc')) column.removeClass(className+'desc').addClass(className+'asc');
																			else column.removeClass(className+'asc').addClass(className+'desc');
																			column.closest('tr').elms('[class*="'+CSS.escape(className)+'"]').each((element,index) => {
																				if (element!=column) element.removeClass(className+'asc').removeClass(className+'desc');
																			});
																			record[tableInfo.code].value=sort(record[tableInfo.code].value,column.hasClass(className+'desc'));
																		})('kb-attachment-subtable-sort-');
																		((position) => {
																			Object.values(tableInfo.fields).filter((item) => item.type=='FILE').each((fieldInfo,index) => {
																				if (multi)
																				{
																					((columnIndex,fields) => {
																						table.elms('tbody tr').each((row,index) => row.elms('.kb-attachment-subtable-multi-cell')[columnIndex].append(fields[position[index]]));
																					})(
																						table.elms('thead .kb-attachment-subtable-multi-cell').indexOf(table.elm('thead .label-'+fieldInfo.id)),
																						table.elms('tbody .kb-attachment-field-'+fieldInfo.id)
																					);
																				}
																				else
																				{
																					((columnIndex,fields) => {
																						table.elms('tbody tr').each((row,index) => row.elms('td')[columnIndex].append(fields[position[index]]));
																					})(
																						Array.from(column.parentNode.children).indexOf(table.elm('thead .label-'+fieldInfo.id)),
																						table.elms('tbody .kb-attachment-field-'+fieldInfo.id)
																					);
																				}
																			});
																		})(record[tableInfo.code].value.map((item) => item.rowIndex));
																		set(record);
																	})(e.currentTarget,kintone.app.record.get().record,table.elm('thead tr').hasClass('kb-attachment-subtable-multi'));
																});
														});
													}
													if (!vars.forceUpdate) vars.forceUpdate=(Object.values(tableInfo.fields).filter((item) => item.type=='FILE').length!=0);
												})(table,kb.elm('.subtable-'+table.id),true);
											});
										}
										else kb.alert(kb.error.config.reinstall('Boost! Attachment','https://kintone-booster.com/'+kb.operator.language.substring(0,2)+'/attachment.html'));
									}
									if (setting.useTab.value.includes('use'))
									{
										setting.tabs.value.map((item) => item.value).each((tab,index) => {
											if (tab.field.value in vars.fieldInfos.origin)
												((fieldInfo) => {
													((field) => {
														if (field)
														{
															field.addClass('kb-attachment-tab-operation'+((vars.mobile)?' kb-mobile':''));
															((container,prev,next) => {
																container.elms('.input-radio-item-cybozu,.radio-gaia').each((element,index) => {
																	element.addClass('kb-attachment-tab');
																});
																container.append(kb.create('span').addClass('kb-attachment-tab-spacer'));
																container.parentNode.insertBefore(
																	prev.on('click',(e) => {
																		((coord) => {
																			tabAdjust(container,prev,next,coord);
																			container.scrollBy({left:coord});
																		})(Math.floor(container.clientWidth/-2));
																	}),
																	container
																);
																container.parentNode.insertBefore(
																	next.on('click',(e) => {
																		((coord) => {
																			tabAdjust(container,prev,next,coord);
																			container.scrollBy({left:coord});
																		})(Math.ceil(container.clientWidth/2));
																	}),
																	container.nextSibling
																);
																tabAdjust(container,prev,next);
															})(
																field.elm('.input-radio-item-cybozu,.radio-gaia').parentNode.addClass('kb-attachment-tab-container'),
																kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-left'),
																kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-right')
															);
														}
													})(kb.field.get(fieldInfo,vars.mobile,vars.type));
												})(vars.fieldInfos.parallelize[tab.field.value]);
										});
										var activeTabColor=setting.activeTabColor.value || 'transparent';
										var inactiveTabColor=setting.inactiveTabColor.value || 'transparent';
										if (!kb.elm('.kb-tab-style'))
											kb.elm('head').append(
												kb.create('style')
												.addClass('kb-tab-style')
												.attr('type','text/css')
												.text(`
.kb-attachment-tab label{
	background-color:${inactiveTabColor};
}
.kb-attachment-tab input:checked+label{
	background-color:${activeTabColor};
}
`)
											);
									}
									if (vars.forceUpdate)
									{
										kintone.events.on(['app.record.create.submit.success','app.record.edit.submit.success',],function(e){
											return new kintone.Promise(function(resolve,reject){
												try
												{
													var recurse=(index,files,callback) => {
														var deepRecurse=(index,files,callback) => {
															if (files.field.length!=0)
															{
																((file) => {
																	kb.file.upload(file,true).then((resp) => {
																		files.record.push({
																			contentType:file.contentType,
																			fileKey:resp.fileKey,
																			name:file.name,
																			size:file.size
																		});
																		index++;
																		if (index<files.field.length) deepRecurse(index,files,callback);
																		else callback();
																	});
																})(files.field[index]);
															}
															else callback();
														};
														deepRecurse(0,files[index],() => {
															index++;
															if (index<files.length) recurse(index,files,callback);
															else callback();
														});
													};
													vars.observers.each((observer,index) => observer.disconnect());
													vars.observers=[];
													kb.loadStart();
													recurse(
														0,
														Object.values(vars.fieldInfos.tables).reduce((result,current) => {
															((table) => {
																Object.values(current.fields).filter((item) => item.type=='FILE').each((fieldInfo,index) => {
																	table.elms('tbody .kb-attachment-field-'+fieldInfo.id).each((element,index) => {
																		e.record[current.code].value[index].value[fieldInfo.code].value=[];
																		result.push({
																			field:element.value,
																			record:e.record[current.code].value[index].value[fieldInfo.code].value
																		})
																	});
																});
															})(kb.elm('.subtable-'+current.id));
															return result;
														},[]),
														() => {
															var record={};
															record['$id']=e.record['$id'];
															Object.keys(vars.fieldInfos.tables).each((table,index) => record[table]=e.record[table]);
															kb.view.records.set(kintone.app.getId(),{put:[kb.view.records.transform(record)]},false)
															.then((resp) => {
																kb.loadEnd();
																resolve(e);
															})
															.catch((error) => kb.alert(kb.error.parse(error),() => resolve(e)));
														}
													);
												}
												catch(error)
												{
													kb.alert(kb.error.parse(error),() => resolve(e));
												}
											});
										});
									}
									for (var key in observes)
										((tableInfo,handlers) => {
											observeTable(tableInfo,e.record,handlers);
										})(vars.fieldInfos.tables[key],observes[key]);
								})(expandSetting(JSON.parse(config.flat)));
								resolve(e);
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
		'app.record.detail.show',
		'mobile.app.record.detail.show',
	],(e) => {
		return new Promise((resolve,reject) => {
			((mobile,type) => {
				vars.mobile=mobile;
				vars.type=type;
				vars.observers.each((observer,index) => observer.disconnect());
				vars.observers=[];
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
								(([setting,multilineInfos]) => {
									var observes={};
									if (setting.useAttachmentViewer.value.includes('use'))
									{
										Object.values(vars.fieldInfos.parallelize).filter((item) => item.type=='FILE').each((fieldInfo,index) => {
											((handler) => {
												if (fieldInfo.tableCode)
												{
													((tableInfo) => {
														if (!(tableInfo.code in observes)) observes[tableInfo.code]=[];
														observes[tableInfo.code].push(handler);
													})(vars.fieldInfos.tables[fieldInfo.tableCode]);
												}
												else handler({record:e.record});
											})((e) => {
												((field) => {
													if (field)
														(Array.isArray(field)?field:[field]).each((field,index) => {
															((files) => {
																((vars.mobile)?kb.children(field.value):field.value.elm('ul').elms('li')).each((element,index) => {
																	if (element.elm('a') && !element.elm('.kb-attachment-file-operation'))
																	{
																		((file) => {
																			if (file.length!=0)
																			{
																				element.prepend(
																					kb.create('span').addClass('kb-attachment-file-operation')
																					.html(file.first().name)
																					.on('click',(e) => kb.attachment.show(file.first(),!setting.onlyView.value.includes('onlyView')))
																				);
																				files=files.filter((item) => item!=file.first());
																			}
																		})(files.filter((item) => item.name==element.elm('a').html()));
																	}
																});
															})((fieldInfo.tableCode)?e.record[fieldInfo.tableCode].value[index].value[fieldInfo.code].value:e.record[fieldInfo.code].value);
														});
												})(kb.field.get(fieldInfo,vars.mobile,vars.type));
											});
										});
									}
									if (setting.useMultiline.value.includes('use') && !vars.mobile)
									{
										for (var key in multilineInfos)
											((multilineInfo,table) => {
												var reformat=(multilineInfo,rows,isHead) => {
													var shrinks=[];
													if (rows)
														rows.elms('tr').each((row,index) => {
															if (!row.hasClass('kb-attachment-subtable-multi'))
															{
																((container) => {
																	row.addClass('kb-attachment-subtable-multi').prepend(container);
																	multilineInfo.lines.each((columns,index) => {
																		container.append(((contents) => {
																			columns.each((column,index) => {
																				var properties={};
																				if (isHead)
																				{
																					if (column) contents.append(row.elm('.label-'+column).addClass('kb-attachment-subtable-multi-cell').css(properties));
																					else contents.append(kb.create('th').addClass('subtable-label-gaia kb-attachment-subtable-multi-cell').css(properties));
																				}
																				else
																				{
																					properties['width']=table.elm('thead').elm('.label-'+column).css('width');
																					if (column) contents.append(row.elm('.field-'+column).closest('td').addClass('kb-attachment-subtable-multi-cell').css(properties));
																					else contents.append(kb.create('td').addClass('kb-attachment-subtable-multi-cell').css(properties));
																				}
																				if (index==columns.length-1) shrinks.push(contents.lastElementChild);
																			});
																			return contents;
																		})(kb.create('div').css({alignItems:'stretch',display:'flex'})));
																	});
																	if (isHead)
																	{
																		((max) => {
																			kb.children(container).each((element,index) => {
																				var width=kb.children(element).reduce((result,current) => {
																					result+=current.outerWidth(false)
																					return result;
																				},0);
																				if (width<max) kb.children(element).last().css({flex:'1'});
																			});
																		})(container.firstElementChild.outerWidth(false));
																	}
																})((isHead)?kb.create('th').addClass('subtable-label-gaia'):kb.create('td'));
															}
														});
													if (!isHead) shrinks.each((element,index) => element.css({flex:'1'}))
												};
												if (e.record[multilineInfo.tableInfo.code].value.length!=0)
												{
													reformat(multilineInfo,table.elm('thead'),true);
													if (!(multilineInfo.tableInfo.code in observes)) observes[multilineInfo.tableInfo.code]=[];
													observes[multilineInfo.tableInfo.code].push((e) => {
														reformat(multilineInfo,table.elm('tbody'),false);
													});
												}
											})(multilineInfos[key],kb.elm('.subtable-'+multilineInfos[key].tableInfo.id));
									}
									if (!('useTab' in setting))
									{
										kb.alert(kb.error.config.update('Boost! Attachment'));
										setting.useTab={value:[]};
									}
									if (setting.useTab.value.includes('use'))
									{
										setting.tabs.value.map((item) => item.value).each((tab,index) => {
											if (tab.field.value in vars.fieldInfos.origin)
												((fieldInfo) => {
													((field) => {
														if (field)
														{
															((container,options) => {
																options.each((option,index) => {
																	container.elm('.kb-attachment-tab-container').append(
																		kb.create('span').addClass('kb-attachment-tab')
																		.append(
																			kb.create('input').attr('type','radio').attr('id',fieldInfo.code+'_'+index).attr('name',fieldInfo.code).attr('value',option.label)
																			.on('change',(e) => {
																				((record) => {
																					kb.event.call('kb.style.call',{
																						container:kb.elm('body'),
																						record:(() => {
																							record[fieldInfo.code].value=kb.elms('[name="'+CSS.escape(fieldInfo.code)+'"]').find((item) => item.checked).attr('value');
																							return record;
																						})(),
																						mobile:vars.mobile,
																						pattern:'edit',
																						workplace:'record'
																					})
																					.then((param) => {})
																					.catch(() => {});
																				})(((vars.mobile)?kintone.mobile.app.record:kintone.app.record).get().record);
																			})
																		)
																		.append(kb.create('label').attr('for',fieldInfo.code+'_'+index).html(option.label))
																	);
																});
																container.elm('.kb-attachment-tab-container').append(kb.create('span').addClass('kb-attachment-tab-spacer'));
																field.css({display:'none'}).parentNode.insertBefore(container,field.nextSibling);
																((container,prev,next) => {
																	prev.on('click',(e) => {
																		((coord) => {
																			tabAdjust(container,prev,next,coord);
																			container.scrollBy({left:coord});
																		})(Math.floor(container.clientWidth/-2));
																	});
																	next.on('click',(e) => {
																		((coord) => {
																			tabAdjust(container,prev,next,coord);
																			container.scrollBy({left:coord});
																		})(Math.ceil(container.clientWidth/2));
																	});
																	tabAdjust(container,prev,next);
																})(container.elm('.kb-attachment-tab-container'),container.elm('.kb-icon-arrow-left'),container.elm('.kb-icon-arrow-right'));
															})(
																kb.create('div').addClass('kb-attachment-tab-operation'+((vars.mobile)?' kb-mobile':''))
																.append(kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-left'))
																.append(kb.create('div').addClass('kb-attachment-tab-container'))
																.append(kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-right')),
																Object.values(fieldInfo.options).reduce((result,current) => {
																	result[current.index]=current;
																	return result;
																},[])
															);
															((option) => {
																if (option) option.checked=true;
															})(kb.elm('[name="'+CSS.escape(fieldInfo.code)+'"][value="'+CSS.escape(e.record[fieldInfo.code].value)+'"]'));
														}
													})(kb.field.get(fieldInfo,vars.mobile,vars.type));
												})(vars.fieldInfos.parallelize[tab.field.value]);
										});
										var activeTabColor=setting.activeTabColor.value || 'transparent';
										var inactiveTabColor=setting.inactiveTabColor.value || 'transparent';
										if (!kb.elm('.kb-tab-style'))
											kb.elm('head').append(
												kb.create('style')
												.addClass('kb-tab-style')
												.attr('type','text/css')
												.text(`
.kb-attachment-tab label{
	background-color:${inactiveTabColor};
}
.kb-attachment-tab input:checked+label{
	background-color:${activeTabColor};
}
`)
											);
									}
									for (var key in observes)
										((tableInfo,handlers) => {
											observeTable(tableInfo,e.record,handlers);
										})(vars.fieldInfos.tables[key],observes[key]);
								})(expandSetting(JSON.parse(config.flat)));
								resolve(e);
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
		'app.record.index.show',
		'mobile.app.record.index.show'
	],(e) => {
		return new Promise((resolve,reject) => {
			((mobile,type) => {
				vars.mobile=mobile;
				vars.type=type;
				vars.observers.each((observer,index) => observer.disconnect());
				vars.observers=[];
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
								((setting) => {
									var advance=() => {
										if (setting.useSearchBox.value.includes('use'))
										{
											kb.view.load(vars.app.id).then((viewInfos) => {
												((handler) => {
													if (kb.roleSet.user.length==0) kb.roleSet.load().then(() => handler());
													else handler();
												})(() => {
													((viewInfo) => {
														var keys=(() => {
															var res={};
															var references={};
															var accessibles=((accessDatas) => {
																return Object.keys(accessDatas).reduce((result,current) => {
																	if (accessDatas[current]!='NONE') result.push(current);
																	return result;
																},[]);
															})(cybozu.data.page.FIELD_ACCESSIBILITY || cybozu.data.page.FIELD_ACCESS_CONTROL.right.fields);
															var cast=(type) => {
																var fieldTypes={
																	CREATED_AT:'CREATED_TIME',
																	DECIMAL:'NUMBER',
																	EDITOR:'RICH_TEXT',
																	MODIFIED_AT:'UPDATED_TIME',
																	MULTIPLE_CHECK:'CHECK_BOX',
																	MULTIPLE_SELECT:'MULTI_SELECT',
																	MULTIPLE_LINE_TEXT:'MULTI_LINE_TEXT',
																	RECORD_ID:'RECORD_NUMBER',
																	SINGLE_CHECK:'RADIO_BUTTON',
																	SINGLE_SELECT:'DROP_DOWN'
																};
																return (type in fieldTypes)?fieldTypes[type]:type;
															};
															Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).each((field,index) => {
																if (accessibles.includes(field.id))
																{
																	if (field.type=='REFERENCE_TABLE') references[field.id]=field.var;
																	else
																	{
																		res[field.var]={
																			id:'f'+field.id,
																			type:cast(field.type)
																		}
																		switch (res[field.var].type)
																		{
																			case 'CHECK_BOX':
																			case 'DROP_DOWN':
																			case 'MULTI_SELECT':
																			case 'RADIO_BUTTON':
																				res[field.var].option=(() => {
																					var res={};
																					if ('options' in field.properties)
																						if (Array.isArray(field.properties.options))
																							field.properties.options.each((option,index) => {
																								if (option.valid) res[option.label]=option.id;
																							});
																					return res;
																				})();
																				break;
																			case 'STATUS':
																				res[field.var].status=(() => {
																					var res={};
																					((statusData) => {
																						if ((typeof statusData.useStatus==='string')?(statusData.useStatus=='true'):statusData.useStatus)
																							statusData.states.each((state,index) => {
																								if (state.valid) res[state.label]=state.id;
																							});
																					})(cybozu.data.page.STATUS_DATA);
																					return res;
																				})();
																				break;
																		}
																	}
																}
															});
															Object.values(cybozu.data.page.FORM_DATA.schema.subTable).map((item) => Object.values(item.fieldList)).flat().each((field,index) => {
																if (accessibles.includes(field.id))
																{
																	res[field.var]={
																		id:'f'+field.id,
																		type:cast(field.type)
																	}
																	switch (res[field.var].type)
																	{
																		case 'CHECK_BOX':
																		case 'DROP_DOWN':
																		case 'MULTI_SELECT':
																		case 'RADIO_BUTTON':
																			res[field.var].option=(() => {
																				var res={};
																				if ('options' in field.properties)
																					if (Array.isArray(field.properties.options))
																						field.properties.options.each((option,index) => {
																							if (option.valid) res[option.label]=option.id;
																						});
																				return res;
																			})();
																			break;
																	}
																}
															});
															cybozu.data.page.FORM_DATA.referenceTables.each((reference,index) => {
																if (reference.masterApp.schema && accessibles.includes(reference.fieldId))
																{
																	((unaccessibles,referenceId,status) => {
																		Object.values(reference.masterApp.schema.table.fieldList).each((field,index) => {
																			if (!unaccessibles.includes(field.id))
																			{
																				res[references[referenceId]+'.'+field.var]={
																					id:'f'+referenceId+'.f'+field.id,
																					type:cast(field.type)
																				}
																				switch (res[references[referenceId]+'.'+field.var].type)
																				{
																					case 'CHECK_BOX':
																					case 'DROP_DOWN':
																					case 'MULTI_SELECT':
																					case 'RADIO_BUTTON':
																						res[references[referenceId]+'.'+field.var].option=(() => {
																							var res={};
																							if ('options' in field.properties)
																								if (Array.isArray(field.properties.options))
																									field.properties.options.each((option,index) => {
																										if (option.valid) res[option.label]=option.id;
																									});
																							return res;
																						})();
																						break;
																					case 'STATUS':
																						res[references[referenceId]+'.'+field.var].status=(() => {
																							var res={};
																							if ((typeof status.useStatus==='string')?(status.useStatus=='true'):status.useStatus)
																								status.states.each((state,index) => {
																									if (state.valid) res[state.label]=state.id;
																								});
																							return res;
																						})();
																						break;
																				}
																			}
																		});
																	})(reference.masterApp.unAccessibleFieldIds,reference.fieldId,reference.masterApp.status);
																}
															});
															return res;
														})();
														var handlers={
															build:(callback) => {
																var logical=viewInfo.filterCond.match(/ and /g)?' and ':' or ';
																var queries=viewInfo.filterCond.split(logical).filter((item) => item);
																var adjust=(index,callback) => {
																	if (queries.length!=0)
																	{
																		((field) => {
																			if (field.info)
																			{
																				var pattern=new RegExp('[/\\\\^$*+?.()|[\\]{}]','g');
																				var purseCodes=function(query){
																					var res={
																						groups:[],
																						organizations:[],
																						users:[]
																					};
																					var target='';
																					if (query.match(/ in /g))
																					{
																						((codes) => {
																							codes.each((code,index) => {
																								if (code.replace(/^[ ]+/g,'').replace(/[ ]+$/g,'').match(/^\"/g))
																								{
																									var code=code.replace(/^[ \"]+/g,'').replace(/[ \"]+$/g,'')
																									switch (code)
																									{
																										case 'GROUP':
																											target='groups';
																											break;
																										case 'ORGANIZATION':
																											target='organizations';
																											break;
																										case 'USER':
																											target='users';
																											break;
																										default:
																											if (!target) target='users';
																											res[target].push(code);
																											break;
																									}
																								}
																							});
																						})(query.split(' in ').last().replace(/^\(/g,'').replace(/\)$/g,'').split(','));
																					}
																					return res;
																				}
																				switch (field.info.type)
																				{
																					case 'CHECK_BOX':
																					case 'DROP_DOWN':
																					case 'MULTI_SELECT':
																					case 'RADIO_BUTTON':
																						for (var key in field.info.option)
																							if (field.query.match(new RegExp('"'+key.replace(pattern,'\\$&')+'"')))
																								field.query=field.query.replace(new RegExp('"'+key.replace(pattern,'\\$&')+'"'),'"'+field.info.option[key]+'"');
																						break;
																					case 'CREATOR':
																					case 'MODIFIER':
																					case 'USER_SELECT':
																						((codes) => {
																							kb.roleSet.group.filter((item) => codes.groups.includes(item.code.value)).each((group,index) => {
																								if (field.query.match(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"')))
																									field.query=field.query.replace(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"'),'"'+group.info.id+'"');
																							});
																							kb.roleSet.organization.filter((item) => codes.organizations.includes(item.code.value)).each((organization,index) => {
																								if (field.query.match(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"')))
																									field.query=field.query.replace(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"'),'"'+organization.info.id+'"');
																							});
																							kb.roleSet.user.filter((item) => codes.users.includes(item.code.value)).each((user,index) => {
																								if (field.query.match(new RegExp('"'+user.code.value.replace(pattern,'\\$&')+'"')))
																									field.query=field.query.replace(new RegExp('"'+user.code.value.replace(pattern,'\\$&')+'"'),'"'+user.info.id+'"');
																							});
																						})(purseCodes(field.query));
																						break;
																					case 'GROUP_SELECT':
																						((codes) => {
																							kb.roleSet.group.filter((item) => codes.groups.includes(item.code.value)).each((group,index) => {
																								if (field.query.match(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"')))
																									field.query=field.query.replace(new RegExp('"'+group.code.value.replace(pattern,'\\$&')+'"'),'"'+group.info.id+'"');
																							});
																						})(purseCodes(field.query));
																						break;
																					case 'ORGANIZATION_SELECT':
																						((codes) => {
																							kb.roleSet.organization.filter((item) => codes.organizations.includes(item.code.value)).each((organization,index) => {
																								if (field.query.match(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"')))
																									field.query=field.query.replace(new RegExp('"'+organization.code.value.replace(pattern,'\\$&')+'"'),'"'+organization.info.id+'"');
																							});
																						})(purseCodes(field.query));
																						break;
																					case 'STATUS':
																						for (var key in field.info.status)
																							if (field.query.match(new RegExp('"'+key.replace(pattern,'\\$&')+'"')))
																								field.query=field.query.replace(new RegExp('"'+key.replace(pattern,'\\$&')+'"'),'"'+field.info.status[key]+'"');
																						break;
																				}
																				queries[index]=field.query;
																			}
																			else queries[index]='';
																			index++;
																			if (index<queries.length) adjust(index,callback);
																			else callback(queries.filter((item) => item).join(logical));
																		})(((matches) => {
																			var res={
																				info:null,
																				query:''
																			}
																			if (matches.length>1)
																				if (matches.last() in keys)
																				{
																					res.info=keys[matches.last()];
																					res.query=queries[index].replace(new RegExp(matches.last().replace(/[\/\\^$*+?.()|\[\]{}]/g,'\\$&')),res.info.id);
																				}
																			return res;
																		})(queries[index].match(/^([^ ]+)/)));
																	}
																	else callback('');
																};
																adjust(0,(queries) => {
																	callback(queries);
																});
															},
															search:(query) => {
																var keyword=kb.elm('.kb-attachment-search-operation').elm('.kb-keyword').elm('input');
																var target=kb.elm('.kb-attachment-search-operation').elm('.kb-target').elm('select');
																var url=kintone.api.url('/k/', true).replace(/\.json/g,'')+((vars.mobile)?'m/'+vars.app.id:vars.app.id)+'/?view='+e.viewId.toString();
																var build=(fieldInfo,value) => {
																	return ((unequal,value) => {
																		var res='';
																		if (value=='EMPTY')
																		{
																			switch (fieldInfo.type)
																			{
																				case 'CHECK_BOX':
																				case 'DROP_DOWN':
																				case 'MULTI_SELECT':
																				case 'RADIO_BUTTON':
																				case 'STATUS':
																					res=keys[fieldInfo.code].id+((unequal)?' not':'')+' in ("")';
																					break;
																				case 'FILE':
																				case 'LINK':
																				case 'MULTI_LINE_TEXT':
																				case 'RICH_TEXT':
																				case 'SINGLE_LINE_TEXT':
																					res=keys[fieldInfo.code].id+((unequal)?' !':' ')+'= ""';
																					break;
																			}
																		}
																		else
																		{
																			switch (fieldInfo.type)
																			{
																				case 'CHECK_BOX':
																				case 'DROP_DOWN':
																				case 'MULTI_SELECT':
																				case 'RADIO_BUTTON':
																					if (value in keys[fieldInfo.code].option)
																						res=keys[fieldInfo.code].id+((unequal)?' not':'')+' in ("'+keys[fieldInfo.code].option[value].replace(/"/g,'\\"')+'")';
																					break;
																				case 'FILE':
																				case 'LINK':
																				case 'MULTI_LINE_TEXT':
																				case 'RICH_TEXT':
																				case 'SINGLE_LINE_TEXT':
																					res=keys[fieldInfo.code].id+((unequal)?' not':'')+' like "'+value.replace(/"/g,'\\"')+'"';
																					break;
																				case 'STATUS':
																					if (value in keys[fieldInfo.code].status)
																						res=keys[fieldInfo.code].id+((unequal)?' not':'')+' in ("'+keys[fieldInfo.code].status[value].replace(/"/g,'\\"')+'")';
																					break;
																			}
																		}
																		return res;
																	})(value.match(/^!/g),value.replace(/^!/g,''));
																};
																if (keyword.val())
																{
																	var queries=((keywords) => {
																		var res=((target.val())?[viewInfo.fields[target.val()]]:Object.values(viewInfo.fields)).reduce((result,current) => {
																			result.push(keywords.map((item) => build(current,item)).join(' or '));
																			return result.filter((item) => item);
																		},[]).map((item) => '('+item+')');
																		return (query)?['('+query+')'].concat(res.join(' or ')).join(' and '):res.join(' or ');
																	})(keyword.val().split(/[ 　]/).filter((item) => item));
																	if (queries) window.location.href=url+'&keyword='+keyword.val()+'&target='+target.val()+'&q='+encodeURIComponent(queries);
																	else window.location.href=url;
																}
																else window.location.href=url;
															}
														};
														viewInfo.fields=viewInfo.fields.reduce((result,current) => {
															if (current in keys)
																switch (vars.fieldInfos.parallelize[current].type)
																{
																	case 'CHECK_BOX':
																	case 'DROP_DOWN':
																	case 'FILE':
																	case 'LINK':
																	case 'MULTI_LINE_TEXT':
																	case 'MULTI_SELECT':
																	case 'RADIO_BUTTON':
																	case 'RICH_TEXT':
																	case 'SINGLE_LINE_TEXT':
																		result[current]=vars.fieldInfos.parallelize[current];
																		break;
																}
															return result;
														},{});
														if (Object.keys(viewInfo.fields).length!=0)
														{
															handlers.build((query) => {
																((container) => {
																	if (!container.elm('.kb-attachment-search-operation'))
																	{
																		((app) => {
																			container.addClass('kb-scope').attr('form-id','form_'+app.id)
																			.append(
																				kb.create('div').addClass('kb-attachment-search-operation'+((vars.mobile)?' kb-mobile':''))
																				.append(kb.field.activate(((res) => {
																					res.elm('select').empty().assignOption([{code:'',label:'All'}].concat(Object.values(viewInfo.fields).map((item) => {
																						return {code:item.code,label:item.label};
																					})),'label','code');
																					return res;
																				})(kb.field.create(app.fields.target).addClass('kb-target')),app))
																				.append(kb.field.activate(kb.field.create(app.fields.keyword).addClass('kb-keyword'),app))
																				.append(
																					kb.create('button').addClass('kb-icon kb-icon-lookup').on('click',(e) => {
																						handlers.search(query);
																					})
																				)
																				.append(
																					kb.create('button').addClass('kb-icon kb-icon-del').on('click',(e) => {
																						e.currentTarget.parentNode.elm('.kb-keyword').elm('input').val('');
																						handlers.search(query);
																					})
																				)
																			);
																			kb.record.set(container,app,((param) => {
																				var res={};
																				if ('keyword' in param) res.keyword={value:param.keyword};
																				if ('target' in param) res.target={value:param.target};
																				return res;
																			})(kb.queries()));
																			/* event */
																			kb.event.on('kb.change.keyword',(e) => {
																				if (e.container==container) handlers.search(query);
																				return e;
																			});
																		})({
																			id:'AttachmentSearch',
																			fields:{
																				target:{
																					code:'target',
																					type:'DROP_DOWN',
																					label:'',
																					required:false,
																					noLabel:true,
																					options:[
																						{index:0,label:'open'},
																						{index:1,label:'close'}
																					]
																				},
																				keyword:{
																					code:'keyword',
																					type:'SINGLE_LINE_TEXT',
																					label:'',
																					required:false,
																					noLabel:true,
																					placeholder:''
																				}
																			}
																		});
																	}
																})(((vars.mobile)?kintone.mobile.app.getHeaderSpaceElement():kintone.app.getHeaderMenuSpaceElement()));
																resolve(e);
															});
														}
														else resolve(e);
													})(viewInfos.origin.reduce((result,current) => {
														if (current.id==e.viewId.toString())
														{
															switch (e.viewType)
															{
																case 'list':
																	result=current;
																	break;
																default:
																	result.filterCond=current.filterCond;
																	break;
															}
														}
														return result;
													},{
														fields:Object.values(vars.fieldInfos.parallelize).reduce((result,current) => {
															if (!current.tableCode) result.push(current.code);
															return result;
														},[]),
														filterCond:''
													}));
												});
											});
										}
										else resolve(e);
									};
									if (!('useBulkUpdate' in setting))
									{
										kb.alert(kb.error.config.update('Boost! Attachment'));
										setting.useBulkUpdate={value:[]};
									}
									if (setting.useBulkUpdate.value.includes('use') && e.viewType=='list')
									{
										kb.filter.auth(setting.permitUser.value,setting.permitOrganization.value,setting.permitGroup.value)
										.then((auth) => {
											if (auth)
											{
												kb.icon.create(
													vars.mobile,
													vars.type,
													'kb-attachment-button',
													'refresh',
													() => {
														kb.record.builder.build(
															Object.values(vars.fieldInfos.placed).reduce((result,current) => {
																if (!vars.fieldInfos.disables.includes(current.code))
																	if (!current.tableCode) result[current.code]=current;
																return result;
															},{}),
															null,
															(result) => {
																kb.view.records.get(
																	vars.app.id,
																	((vars.mobile)?kintone.mobile.app:kintone.app).getQueryCondition()
																)
																.then((records) => {
																	if (records.length!=0)
																	{
																		kb.confirm(kb.constants.common.message.confirm.submit[kb.operator.language],() => {
																			kb.view.records.set(vars.app.id,{put:records.map((item) => ({
																				id:item['$id'].value,
																				record:kb.extend({},result)
																			}))})
																			.then((resp) => kb.alert('Done!',() => window.location.reload(true)))
																			.catch((error) => kb.alert(kb.error.parse(error)));
																		});
																	}
																	else kb.alert('There are no records.');
																})
																.catch((error) => kb.alert(kb.error.parse(error)))
														});
												});
											}
											advance();
										})
										.catch((error) => advance());
									}
									else advance();
								})(JSON.parse(config.flat));
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
		'app.report.show',
		'mobile.app.report.show'
	],(e) => {
		return new Promise((resolve,reject) => {
			((mobile,type) => {
				vars.mobile=mobile;
				vars.type=type;
				vars.observers.each((observer,index) => observer.disconnect());
				vars.observers=[];
				/* get config */
				kb.config[PLUGIN_ID].config.get()
				.then((config) => {
					if (Object.keys(config).length!=0)
					{
						try
						{
							((setting) => {
								if (!('usePivotTranspose' in setting))
								{
									kb.alert(kb.error.config.update('Boost! Attachment'));
									setting.usePivotTranspose={value:[]};
								}
								if (setting.usePivotTranspose.value.includes('use'))
								{
									if (!kb.elm('.kb-pivottranspose-style'))
									{
										kb.elm('head').append(
											kb.create('style')
											.addClass('kb-pivottranspose-style')
											.attr('type','text/css')
											.text(`
.gaia-report-crosstable{
	border:1px solid #e3e7e8;
	border-collapse:collapse;
	border-spacing:0;
	writing-mode:vertical-lr;
}
.gaia-report-crosstable :is(colgroup,tr){
	background-color:transparent !important;
	border:none !important;
}
.gaia-report-crosstable tr :is(td,th){
	border:1px solid #e3e7e8;
	writing-mode:horizontal-tb;
	white-space:nowrap;
}
.gaia-report-crosstable tr>td:first-child{
	background-color:transparent !important;
}
.gaia-report-crosstable .gaia-report-crosstable-row-group .gaia-report-crosstable-groupname{
	background-color:transparent !important;
}
.gaia-report-crosstable .gaia-report-crosstable-row-total .gaia-report-crosstable-groupname{
	background-color:transparent !important;
}
.gaia-report-crosstable .gaia-report-crosstable-row-subtotal .gaia-report-crosstable-groupvalue{
	background-color:transparent !important;
}
.gaia-report-crosstable:has(td[rowspan]) .gaia-report-crosstable-row-group>td:nth-child(2n+1){
	background-color:#f5f5f5;
}
.gaia-report-crosstable:has(td[rowspan]) .gaia-report-crosstable-row-total>td:nth-child(2n+1){
	background-color:#f5f5f5;
}
.gaia-report-crosstable:has(td[rowspan]) .gaia-report-crosstable-row-subtotal:has(td[rowspan])>td:nth-child(2n+1){
	background-color:#f5f5f5;
}
.gaia-report-crosstable:has(td[rowspan]) .gaia-report-crosstable-row-subtotal:not(:has(td[rowspan]))>td:nth-child(2n){
	background-color:#f5f5f5;
}
.gaia-report-crosstable:not(:has(td[rowspan])) .gaia-report-crosstable-row-group>td:nth-child(2n){
	background-color:#f5f5f5;
}
.gaia-report-crosstable:not(:has(td[rowspan])) .gaia-report-crosstable-row-total>td:nth-child(2n){
	background-color:#f5f5f5;
}
.gaia-report-crosstable:not(:has(td[rowspan])) .gaia-report-crosstable-row-subtotal>td:nth-child(2n){
	background-color:#f5f5f5;
}
`)
										);
									}
								}
								resolve(e);
							})(JSON.parse(config.flat));
						}
						catch(error)
						{
							kb.alert(kb.error.parse(error));
							resolve(e);
						}
					}
					else resolve(e);
				})
				.catch((error) => resolve(e));
			})(e.type.split('.').first()=='mobile',e.type.split('.').slice(-2).first());
		});
	});
	kb.event.on('kb.attachment.call',(e) => {
		return new Promise((resolve,reject) => {
			/* get config */
			kb.config[PLUGIN_ID].config.get()
			.then((config) => {
				if (Object.keys(config).length!=0)
				{
					try
					{
						((setting) => {
							switch (e.mode)
							{
								case 'download':
									e.downloadable=(setting.useAttachmentViewer.value.includes('use'))?(!setting.onlyView.value.includes('onlyView')):true;
									break;
								case 'placeholder':
									if (setting.usePlaceholder.value.includes('use'))
									{
										((fieldInfos) => {
											setting.placeholders.value.map((item) => item.value).each((placeholder,index) => {
												if (placeholder.field.value in fieldInfos)
													((fieldInfo) => {
														if (fieldInfo.tableCode) e.fields[fieldInfo.tableCode].fields[fieldInfo.code].placeholder=placeholder.text.value;
														else e.fields[fieldInfo.code].placeholder=placeholder.text.value;
													})(fieldInfos[placeholder.field.value]);
											});
										})(kb.field.parallelize(e.fields));
									}
									break;
							}
							resolve(e);
						})(JSON.parse(config.flat));
					}
					catch(error)
					{
						kb.alert(kb.error.parse(error));
						resolve(e);
					}
				}
				else resolve(e);
			})
			.catch((error) => resolve(e));
		});
	});
})(kintone.$PLUGIN_ID);
