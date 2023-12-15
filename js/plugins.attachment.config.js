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
						);
						/* event */
						kb.event.on('kb.change.usePlaceholder',(e) => {
							if (e.record.usePlaceholder.value.includes('use')) container.main.elm('[field-id=placeholders]').removeClass('kb-hidden');
							else container.main.elm('[field-id=placeholders]').addClass('kb-hidden');
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
									if (setting.usePlaceholder.value.includes('use')) container.main.elm('[field-id=placeholders]').removeClass('kb-hidden');
									else container.main.elm('[field-id=placeholders]').addClass('kb-hidden');
								});
							})({
								id:vars.app.id,
								fields:vars.app.fields.flat
							});
						})(JSON.parse(config.flat));
					}
					else container.main.elm('.kb-flat').elm('[field-id=placeholders]').addRow();
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
				en:'Align Table Operation Buttons to the Left',
				ja:'テーブル操作ボタンを左寄せにする',
				zh:'将表操作按钮左对齐',
				use:{
					en:'Align to the Left',
					ja:'左寄せにする',
					zh:'向左对齐'
				}
			},
			attachmentViewer:{
				en:'View attachments with a dedicated viewer without downloading them',
				ja:'添付ファイルをダウンロードせずに専用ビューワーで閲覧する',
				zh:'在专用查看器中查看附件，无需下载',
				onlyView:{
					en:'Prohibit downloading',
					ja:'ダウンロードを禁止する',
					zh:'禁止下载'
				},
				use:{
					en:'View in a dedicated viewer',
					ja:'専用ビューワーで閲覧する',
					zh:'在专用查看器中查看'
				}
			},
			lookupNavi:{
				en:'Display a link button to the source app in the lookup field',
				ja:'ルックアップフィールドに参照元アプリへのリンクボタンを表示',
				zh:'在查找字段中显示指向来源应用的链接按钮',
				use:{
					en:'Display the link button',
					ja:'リンクボタンを表示する',
					zh:'显示链接按钮'
				}
			},
			placeholder:{
				en:'Display Hint in Input Field',
				ja:'入力フィールドにヒントを表示',
				zh:'在输入字段中显示提示',
				field:{
					en:'Field',
					ja:'フィールド',
					zh:'字段'
				},
				text:{
					en:'Content to Display',
					ja:'表示内容',
					zh:'显示的内容'
				},
				use:{
					en:'Display Hint',
					ja:'入力ヒントを表示する',
					zh:'显示提示'
				}
			},
			searchBox:{
				en:'Use the Search Box for Additional Record Filtering',
				ja:'レコードの追加絞り込みで検索窓を使う',
				zh:'使用搜索窗口进行记录的额外筛选',
				use:{
					en:'Use the Search Box',
					ja:'検索窓を使う',
					zh:'使用搜索框'
				}
			}
		},
		description:{
			alignTableButtons:{
				en:'Check the to align the table operation buttons to the left in the add or edit record screen.',
				ja:'レコードの追加または編集画面において、テーブル操作ボタンを左寄せにする場合はチェックを付けて下さい。',
				zh:'在添加或编辑记录界面中，若要将表操作按钮左对齐，请勾选此框。'
			},
			attachmentViewer:{
				en:'Check this to view the attached file in a dedicated viewer without downloading it on the record detail page.',
				ja:'レコードの詳細画面において、添付ファイルをダウンロードせずに専用ビューワーで閲覧する場合はチェックを付けて下さい。',
				zh:'如果您希望在记录详细页面中使用专用查看器查看附件文件而不下载，请勾选此项。',
				onlyView:{
					en:'Check this to prohibit downloading from the attachment viewer.',
					ja:'添付ファイルビューワーからのダウンロードを禁止したい場合はチェックを付けて下さい。',
					zh:'若要禁止從附件查看器中下載，請勾選此項。'
				}
			},
			lookupNavi:{
				en:'Check this to display a link button to the source app in the lookup field on the add or edit record page.',
				ja:'レコードの追加または編集画面において、ルックアップフィールドに参照元アプリへのリンクボタンを表示する場合はチェックを付けて下さい。',
				zh:'在添加或编辑记录页面的查找字段中显示指向来源应用的链接按钮，请勾选此项。'
			},
			placeholder:{
				en:'Check this to display hints in input fields on the add or edit record page.',
				ja:'レコードの追加または編集画面において、入力フィールドにヒントを表示する場合はチェックを付けて下さい。',
				zh:'在添加或编辑记录页面的输入字段中显示提示，请勾选此项。'
			},
			searchBox:{
				en:'Check this to perform additional filtering of the records displayed in the list using the search box on the tabular list page.',
				ja:'表形式の一覧画面において、検索窓を使って一覧に表示しているレコードの追加絞り込みを行う場合はチェックを付けて下さい。',
				zh:'如果您希望在表格形式的列表页面上使用搜索框对显示在列表中的记录进行额外的筛选，请勾选此项。'
			}
		}
	}
},kb.constants);
