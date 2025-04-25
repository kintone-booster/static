/*
* FileName "plugins.attachment.config.js"
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
							var res=kb.record.get(container.main.elm('.kb-flat'),app);
							if (!res.error)
							{
								if (res.record.usePlaceholder.value.length==0) res.record.placeholders.value=[];
								else res.record.placeholders.value=res.record.placeholders.value.filter((item) => item.value.field.value);
								if (res.record.useMultiline.value.length==0) res.record.multilines.value=[];
								else res.record.multilines.value=res.record.multilines.value.filter((item) => item.value.field.value);
								if (res.record.useTab.value.length==0) res.record.tabs.value=[];
								else res.record.tabs.value=res.record.tabs.value.filter((item) => item.value.field.value);
								if (res.record.useAttachmentViewer.value.length==0) res.record.onlyView.value=[];
								config.flat=res.record;
							}
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
							},
							flat:{
								useLookupNavi:{
									code:'useLookupNavi',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								usePlaceholder:{
									code:'usePlaceholder',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								placeholders:{
									code:'placeholders',
									type:'SUBTABLE',
									label:'',
									noLabel:true,
									fields:{
										field:{
											code:'field',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.placeholder.field[kb.operator.language],
											required:false,
											noLabel:false,
											options:[]
										},
										text:{
											code:'text',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.placeholder.text[kb.operator.language],
											required:false,
											noLabel:false,
											placeholder:''
										}
									}
								},
								useSearchBox:{
									code:'useSearchBox',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								useAttachmentViewer:{
									code:'useAttachmentViewer',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								onlyView:{
									code:'onlyView',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'onlyView'}
									]
								},
								useAlignTableButtons:{
									code:'useAlignTableButtons',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								useMultiline:{
									code:'useMultiline',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								multilines:{
									code:'multilines',
									type:'SUBTABLE',
									label:'',
									noLabel:true,
									fields:{
										field:{
											code:'field',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.multiline.field[kb.operator.language],
											required:false,
											noLabel:false,
											options:[]
										}
									}
								},
								useTableCopy:{
									code:'useTableCopy',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								useTableSort:{
									code:'useTableSort',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								useTab:{
									code:'useTab',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								tabs:{
									code:'tabs',
									type:'SUBTABLE',
									label:'',
									noLabel:true,
									fields:{
										field:{
											code:'field',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.tab.field[kb.operator.language],
											required:false,
											noLabel:false,
											options:[]
										}
									}
								},
								activeTabColor:{
									code:'activeTabColor',
									type:'COLOR',
									label:'',
									required:false,
									noLabel:true,
									placeholder:''
								},
								inactiveTabColor:{
									code:'inactiveTabColor',
									type:'COLOR',
									label:'',
									required:false,
									noLabel:true,
									placeholder:''
								},
								usePivotTranspose:{
									code:'usePivotTranspose',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								useBulkUpdate:{
									code:'useBulkUpdate',
									type:'CHECK_BOX',
									label:'',
									required:false,
									noLabel:true,
									options:[
										{index:0,label:'use'}
									]
								},
								permitUser:{
									code:'permitUser',
									type:'USER_SELECT',
									label:'',
									required:false,
									noLabel:true,
									guestuser:true
								},
								permitOrganization:{
									code:'permitOrganization',
									type:'ORGANIZATION_SELECT',
									label:'',
									required:false,
									noLabel:true
								},
								permitGroup:{
									code:'permitGroup',
									type:'GROUP_SELECT',
									label:'',
									required:false,
									noLabel:true
								}
							}
						}
					};
					/* flat */
					((app) => {
						container.main.append(
							kb.create('div').addClass('kb-flat kb-scope').attr('form-id','form_'+app.id)
							.append(kb.create('h1').html(kb.constants.config.caption.lookupNavi[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.lookupNavi[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.lookupNavi[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useLookupNavi)),app))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.placeholder[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.placeholder[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.placeholder[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.usePlaceholder)),app))
								.append(((table) => {
									table.addClass('kb-hidden').template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
										switch (current.type)
										{
											case 'LINK':
											case 'MULTI_LINE_TEXT':
											case 'NUMBER':
											case 'SINGLE_LINE_TEXT':
												if (!fieldInfos.disables.includes(current.code)) result.push({code:current.code,label:current.label});
												break;
										}
										return result;
									}),'label','code');
									return table;
								})(kb.table.activate(kb.table.create(app.fields.placeholders),app)))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.searchBox[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.searchBox[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.searchBox[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useSearchBox)),app))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.attachmentViewer[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.attachmentViewer[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.attachmentViewer[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useAttachmentViewer)),app))
								.append(kb.create('p').html(kb.constants.config.description.attachmentViewer.onlyView[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.attachmentViewer[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.onlyView)),app))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.alignTableButtons[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.alignTableButtons[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.alignTableButtons[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useAlignTableButtons)),app))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.multiline[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.multiline[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.multiline[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useMultiline)),app))
								.append(((table) => {
									table.addClass('kb-hidden').template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
										if (current.tableCode) result.push({code:current.code,label:current.label});
										return result;
									}),'label','code');
									return table;
								})(kb.table.activate(kb.table.create(app.fields.multilines),app)))
								.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.multiline.caution[kb.operator.language]))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.tableCopy[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.tableCopy[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.tableCopy[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useTableCopy)),app))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.tableSort[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.tableSort[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.tableSort[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useTableSort)),app))
								.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.tableSort.caution[kb.operator.language]))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.tab[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.tab[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.tab[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useTab)),app))
								.append(
									kb.create('div').addClass('kb-hidden')
									.append(((table) => {
										table.template.elm('[field-id=field]').elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
											switch (current.type)
											{
												case 'RADIO_BUTTON':
													if (!current.tableCode)
														if (!fieldInfos.disables.includes(current.code)) result.push({code:current.code,label:current.label});
													break;
											}
											return result;
										}),'label','code');
										return table;
									})(kb.table.activate(kb.table.create(app.fields.tabs),app)))
									.append(kb.create('p').html(kb.constants.config.description.tab.active[kb.operator.language]))
									.append(kb.field.activate(kb.field.create(app.fields.activeTabColor),app))
									.append(kb.create('p').html(kb.constants.config.description.tab.inactive[kb.operator.language]))
									.append(kb.field.activate(kb.field.create(app.fields.inactiveTabColor),app))
									.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.tab.caution[kb.operator.language]))
								)
							)
							.append(kb.create('h1').html(kb.constants.config.caption.pivotTranspose[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.pivotTranspose[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.pivotTranspose[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.usePivotTranspose)),app))
							)
							.append(kb.create('h1').html(kb.constants.config.caption.bulkUpdate[kb.operator.language]))
							.append(
								kb.create('section')
								.append(kb.create('p').html(kb.constants.config.description.bulkUpdate[kb.operator.language]))
								.append(kb.field.activate(((res) => {
									res.elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.bulkUpdate[element.val()][kb.operator.language]);
									});
									return res;
								})(kb.field.create(app.fields.useBulkUpdate)),app))
								.append(kb.create('p').html(kb.constants.config.description.bulkUpdate.permitUser[kb.operator.language]))
								.append(kb.field.activate(kb.field.create(app.fields.permitUser).css({width:'100%'}),app))
								.append(kb.create('p').html(kb.constants.config.description.bulkUpdate.permitOrganization[kb.operator.language]))
								.append(kb.field.activate(kb.field.create(app.fields.permitOrganization).css({width:'100%'}),app))
								.append(kb.create('p').html(kb.constants.config.description.bulkUpdate.permitGroup[kb.operator.language]))
								.append(kb.field.activate(kb.field.create(app.fields.permitGroup).css({width:'100%'}),app))
							)
						);
						/* event */
						kb.event.on('kb.change.usePlaceholder',(e) => {
							if (e.record.usePlaceholder.value.includes('use')) container.main.elm('[field-id=placeholders]').removeClass('kb-hidden');
							else container.main.elm('[field-id=placeholders]').addClass('kb-hidden');
							return e;
						});
						kb.event.on('kb.change.useMultiline',(e) => {
							if (e.record.useMultiline.value.includes('use')) container.main.elm('[field-id=multilines]').removeClass('kb-hidden');
							else container.main.elm('[field-id=multilines]').addClass('kb-hidden');
							return e;
						});
						kb.event.on('kb.change.useTab',(e) => {
							if (e.record.useTab.value.includes('use')) container.main.elm('[field-id=tabs]').closest('div').removeClass('kb-hidden');
							else container.main.elm('[field-id=tabs]').closest('div').addClass('kb-hidden');
							return e;
						});
						container.main.elms('input,select,textarea').each((element,index) => element.initialize());
					})({
						id:vars.app.id,
						fields:vars.app.fields.flat
					});
					/* setup */
					if (Object.keys(config).length!=0)
					{
						((setting) => {
							((app) => {
								kb.record.set(container.main.elm('.kb-flat'),app,setting)
								.then(() => {
									if ((setting.usePlaceholder || {value:[]}).value.includes('use')) container.main.elm('[field-id=placeholders]').removeClass('kb-hidden');
									else container.main.elm('[field-id=placeholders]').addClass('kb-hidden');
									if ((setting.useMultiline || {value:[]}).value.includes('use')) container.main.elm('[field-id=multilines]').removeClass('kb-hidden');
									else container.main.elm('[field-id=multilines]').addClass('kb-hidden');
									if ((setting.useTab || {value:[]}).value.includes('use')) container.main.elm('[field-id=tabs]').closest('div').removeClass('kb-hidden');
									else container.main.elm('[field-id=tabs]').closest('div').addClass('kb-hidden');
								});
							})({
								id:vars.app.id,
								fields:vars.app.fields.flat
							});
						})(JSON.parse(config.flat));
					}
					else
					{
						container.main.elm('.kb-flat').elm('[field-id=placeholders]').addRow();
						container.main.elm('.kb-flat').elm('[field-id=multilines]').addRow();
						container.main.elm('.kb-flat').elm('[field-id=tabs]').addRow();
					}
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
			alignTableButtons:{
				'en':'Align Table Operation Buttons to the Left',
				'ja':'テーブル操作ボタンを左寄せにする',
				'zh':'将表操作按钮左对齐',
				'zh-TW':'將表操作按鈕左對齊',
				use:{
					'en':'Align to the Left',
					'ja':'左寄せにする',
					'zh':'向左对齐',
					'zh-TW':'向左對齊'
				}
			},
			attachmentViewer:{
				'en':'View attachments with a dedicated viewer without downloading them',
				'ja':'添付ファイルをダウンロードせずに専用ビューワーで閲覧する',
				'zh':'在专用查看器中查看附件，无需下载',
				'zh-TW':'在專用檢視器中查看附件，無需下載',
				onlyView:{
					'en':'Prohibit downloading',
					'ja':'ダウンロードを禁止する',
					'zh':'禁止下载',
					'zh-TW':'禁止下載'
				},
				use:{
					'en':'View in a dedicated viewer',
					'ja':'専用ビューワーで閲覧する',
					'zh':'在专用查看器中查看',
					'zh-TW':'在專用檢視器中查看'
				}
			},
			bulkUpdate:{
				'en':'Use the bulk update function',
				'ja':'レコードの一括更新機能を使う',
				'zh':'使用批量更新功能',
				'zh-TW':'使用批次更新功能',
				use:{
					'en':'Display the bulk update button',
					'ja':'一括更新ボタンを表示する',
					'zh':'显示批量更新按钮',
					'zh-TW':'顯示批次更新按鈕'
				}
			},
			lookupNavi:{
				'en':'Display a link button to the source app in the lookup field',
				'ja':'ルックアップフィールドに参照元アプリへのリンクボタンを表示',
				'zh':'在查找字段中显示指向来源应用的链接按钮',
				'zh-TW':'在查詢欄位中顯示指向來源應用的連結按鈕',
				use:{
					'en':'Display the link button',
					'ja':'リンクボタンを表示する',
					'zh':'显示链接按钮',
					'zh-TW':'顯示連結按鈕'
				}
			},
			multiline:{
				'en':'Display Table in Multi-Row Layout',
				'ja':'多段行レイアウトでテーブルを表示する',
				'zh':'多行布局显示表格',
				'zh-TW':'多列版面顯示表格',
				field:{
					'en':'Fields for Line Breaks',
					'ja':'改行する位置のフィールド',
					'zh':'指定换行字段',
					'zh-TW':'指定換行欄位'
				},
				use:{
					'en':'Display Table in Multi-Row',
					'ja':'多段行でテーブルを表示する',
					'zh':'在多行中显示表格',
					'zh-TW':'以多列顯示表格'
				}
			},
			pivotTranspose:{
				'en':'Transpose the pivot table',
				'ja':'クロス集計表を転置する',
				'zh':'转置交叉表',
				'zh-TW':'轉置交叉表',
				use:{
					'en':'Switch the rows and columns of the pivot table',
					'ja':'クロス集計表の行列を入れ替える',
					'zh':'交换交叉表的行和列',
					'zh-TW':'交換交叉表的行與列'
				}
			},
			placeholder:{
				'en':'Display Hint in Input Field',
				'ja':'入力フィールドにヒントを表示',
				'zh':'在输入字段中显示提示',
				'zh-TW':'在輸入欄位中顯示提示',
				field:{
					'en':'Field',
					'ja':'フィールド',
					'zh':'字段',
					'zh-TW':'欄位'
				},
				text:{
					'en':'Content to Display',
					'ja':'表示内容',
					'zh':'显示的内容',
					'zh-TW':'顯示的內容'
				},
				use:{
					'en':'Display Hint',
					'ja':'入力ヒントを表示する',
					'zh':'显示提示',
					'zh-TW':'顯示提示'
				}
			},
			searchBox:{
				'en':'Use the Search Box for Additional Record Filtering',
				'ja':'レコードの追加絞り込みで検索窓を使う',
				'zh':'使用搜索窗口进行记录的额外筛选',
				'zh-TW':'使用搜尋視窗進行記錄的額外篩選',
				use:{
					'en':'Use the Search Box',
					'ja':'検索窓を使う',
					'zh':'使用搜索框',
					'zh-TW':'使用搜尋視窗'
				}
			},
			tab:{
				'en':'Style radio buttons like tabs',
				'ja':'ラジオボタンをタブ風にアレンジする',
				'zh':'将单选按钮设计为标签页风格',
				'zh-TW':'將單選按鈕設計為標籤頁風格',
				field:{
					'en':'Field',
					'ja':'フィールド',
					'zh':'字段',
					'zh-TW':'欄位'
				},
				use:{
					'en':'Make radio buttons look like tabs',
					'ja':'ラジオボタンをタブ風にする',
					'zh':'使单选按钮呈现标签页风格',
					'zh-TW':'使單選按鈕呈現標籤頁風格'
				}
			},
			tableCopy:{
				'en':'Copy Table Rows',
				'ja':'テーブル行のコピー',
				'zh':'复制表格行',
				'zh-TW':'複製表格列',
				use:{
					'en':'Enable copying of table rows',
					'ja':'テーブル行のコピーを可能にする',
					'zh':'启用复制表格行功能',
					'zh-TW':'啟用複製表格列功能'
				}
			},
			tableSort:{
				'en':'Table Sorting',
				'ja':'テーブルの並び替え',
				'zh':'表格排序',
				'zh-TW':'表格排序',
				use:{
					'en':'Enable table sorting',
					'ja':'テーブルの並び替えを可能にする',
					'zh':'启用表格排序',
					'zh-TW':'啟用表格排序'
				}
			}
		},
		description:{
			alignTableButtons:{
				'en':'Check the to align the table operation buttons to the left in the add or edit record screen.',
				'ja':'レコードの追加または編集画面において、テーブル操作ボタンを左寄せにする場合はチェックを付けて下さい。',
				'zh':'在添加或编辑记录界面中，若要将表操作按钮左对齐，请勾选此框。',
				'zh-TW':'在新增或編輯記錄介面中，若要將表操作按鈕左對齊，請勾選此框。'
			},
			attachmentViewer:{
				'en':'Check this to view the attached file in a dedicated viewer without downloading it on the record detail page.',
				'ja':'レコードの詳細画面において、添付ファイルをダウンロードせずに専用ビューワーで閲覧する場合はチェックを付けて下さい。',
				'zh':'如果您希望在记录详细页面中使用专用查看器查看附件文件而不下载，请勾选此项。',
				'zh-TW':'如果希望在記錄詳細頁面中使用專用檢視器檢視附件文件而不下載，請勾選此項。',
				onlyView:{
					'en':'Check this to prohibit downloading from the attachment viewer.',
					'ja':'添付ファイルビューワーからのダウンロードを禁止したい場合はチェックを付けて下さい。',
					'zh':'若要禁止從附件查看器中下載，請勾選此項。',
					'zh-TW':'若要禁止從附件檢視器中下載，請勾選此項。'
				}
			},
			bulkUpdate:{
				'en':'Check the box to update the displayed records in bulk on the list page.',
				'ja':'一覧画面において、表示中のレコードの一括更新行う場合はチェックを付けて下さい。',
				'zh':'要在列表页面上对显示的记录进行批量更新，请勾选复选框。',
				'zh-TW':'若需在列表頁面中批次更新顯示的記錄，請勾選此項。',
				permitGroup:{
					'en':'If you want to determine the execution permission based on the group the logged-in user belongs to, please specify the group to be permitted.',
					'ja':'ログインユーザーが所属するグループを実行許可の判断としたい場合は、許可するグループを指定して下さい。',
					'zh':'如果您想根据登录用户所属的组来决定执行权限，请指定允许的组。',
					'zh-TW':'若要根據登入用戶所屬群組決定執行權限，請指定允許的群組。'
				},
				permitOrganization:{
					'en':'If you want to determine the execution permission based on the organization the logged-in user belongs to, please specify the organization to be permitted.',
					'ja':'ログインユーザーが所属する組織を実行許可の判断としたい場合は、許可する組織を指定して下さい。',
					'zh':'如果您想根据登录用户所属的组织来决定执行权限，请指定允许的组织。',
					'zh-TW':'若要根據登入用戶所屬組織決定執行權限，請指定允許的組織。'
				},
				permitUser:{
					'en':'If you want to determine the execution permission based on the logged-in user, please specify the user to be permitted.',
					'ja':'ログインユーザーを実行許可の判断としたい場合は、許可するユーザーを指定して下さい。',
					'zh':'如果您想根据登录用户来决定执行权限，请指定允许的用户。',
					'zh-TW':'若要根據登入用戶決定執行權限，請指定允許的用戶。'
				}
			},
			lookupNavi:{
				'en':'Check this to display a link button to the source app in the lookup field on the add or edit record page.',
				'ja':'レコードの追加または編集画面において、ルックアップフィールドに参照元アプリへのリンクボタンを表示する場合はチェックを付けて下さい。',
				'zh':'在添加或编辑记录页面的查找字段中显示指向来源应用的链接按钮，请勾选此项。',
				'zh-TW':'在新增或編輯記錄頁面的查詢欄位中顯示指向來源應用的連結按鈕，請勾選此項。'
			},
			multiline:{
				'en':'Check this to split the table rows into multiple segments and specify the fields where you want the line breaks.',
				'ja':'テーブル行を複数段に分けて表示する場合はチェックを付け、改行する位置のフィールドを指定して下さい。',
				'zh':'如需将表格行分成多个段落，请勾选此选项，并指定您希望换行的字段位置。',
				'zh-TW':'若需將表格列分為多段，請勾選此項，並指定換行欄位的位置。',
				caution:{
					'en':'The line break will occur just before the field specified in the "Field for Line Breaks.',
					'ja':'「改行する位置のフィールド」に指定したフィールドの直前で改行となります。',
					'zh':'换行将发生在“指定换行字段”中指定字段的前面。',
					'zh-TW':'換行將發生在「指定換行欄位」中指定欄位的前面。'
				}
			},
			pivotTranspose:{
				'en':'Switch the rows and columns of the pivot table Check the box to switch the rows and columns of the pivot table in the chart screen.',
				'ja':'グラフ画面において、クロス集計表の行列を入れ替えて表示する場合はチェックを付けて下さい。',
				'zh':'在图表界面中，如果需要将交叉表的行列互换显示，请勾选此项。',
				'zh-TW':'若需在圖表畫面中交換交叉表的列與行，請勾選此項。'
			},
			placeholder:{
				'en':'Check this to display hints in input fields on the add or edit record page.',
				'ja':'レコードの追加または編集画面において、入力フィールドにヒントを表示する場合はチェックを付けて下さい。',
				'zh':'在添加或编辑记录页面的输入字段中显示提示，请勾选此项。',
				'zh-TW':'若需在新增或編輯記錄頁面的輸入欄位顯示提示，請勾選此項。'
			},
			searchBox:{
				'en':'If you want to place a search box on the view screen to further narrow down the displayed records, please check the box.',
				'ja':'一覧画面に検索窓を配置して、表示しているレコードの追加絞り込みを行う場合はチェックを付けて下さい。',
				'zh':'如果您希望在列表视图页面上放置一个搜索框，以进一步筛选显示的记录，请勾选该选项。',
				'zh-TW':'如果您希望在列表檢視頁面上放置一個搜尋框，以進一步篩選顯示的記錄，請勾選該選項。'
			},
			tab:{
				'en':'Check this if you want to display the radio buttons in a tab-like style on the add/edit/detail record screen.',
				'ja':'レコードの追加/編集/詳細画面において、ラジオボタンをタブ風にアレンジして表示する場合はチェックを付けて下さい。',
				'zh':'如果您希望在添加/编辑/详情画面中以标签风格显示单选按钮，请勾选此项。',
				'zh-TW':'如果您希望在新增/編輯/詳細畫面中以標籤風格顯示單選按鈕，請勾選此項。',
				active:{
					'en':'Background color of the active tab',
					'ja':'アクティブタブの背景色',
					'zh':'活动标签页的背景颜色',
					'zh-TW':'活動標籤頁的背景顏色'
				},
				caution:{
					'en':'If you want the background color to be transparent, please leave the input field blank.',
					'ja':'背景色を透明にしたい場合は、入力欄を空にして下さい。',
					'zh':'如果希望背景颜色为透明，请将输入栏留空。',
					'zh-TW':'如果希望背景顏色為透明，請將輸入欄留空。'
				},
				inactive:{
					'en':'Background color of the inactive tab',
					'ja':'非アクティブタブの背景色',
					'zh':'非活动标签页的背景颜色',
					'zh-TW':'非活動標籤頁的背景顏色'
				}
			},
			tableCopy:{
				'en':'Check this to enable copying of table rows on the add or edit record page.',
				'ja':'レコードの追加または編集画面において、テーブル行のコピーを可能にする場合はチェックを付けて下さい。',
				'zh':'在添加或编辑记录页面启用表格行复制，请勾选此项。',
				'zh-TW':'在新增或編輯記錄頁面啟用表格列複製，請勾選此項。'
			},
			tableSort:{
				'en':'Check this to enable sorting of table rows on the add or edit record page.',
				'ja':'レコードの追加または編集画面において、テーブル行の並び替えを可能にする場合はチェックを付けて下さい。',
				'zh':'在添加或编辑记录页面启用表格行排序，请勾选此项。',
				'zh-TW':'在新增或編輯記錄頁面啟用表格行排序，請勾選此項。',
				caution:{
					'en':'Fields that can be sorted are limited to single input fields such as text strings or dates, and single selection fields such as dropdowns.',
					'ja':'並び替えが可能なフィールドは文字列や日付のような単一入力フィールドかドロップダウンのような単一選択式フィールドのみとなります。',
					'zh':'仅支持排序的字段为单输入字段，例如字符串或日期，以及单选字段，例如下拉菜单。',
					'zh-TW':'僅支援排序的欄位為單一輸入欄位，例如字串或日期，以及單選欄位，例如下拉選單。'
				}
			}
		}
	}
},kb.constants);
