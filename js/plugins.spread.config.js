/*
* FileName "plugins.spread.config.js"
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
								var res=kb.record.get(container.main.elm('.kb-flat'),app);
								if (!res.error)
								{
									if (res.record.setting.value.length!=Array.from(new Set(res.record.setting.value.map((item) => item.value.view.value))).length)
									{
										kb.alert(kb.constants.config.message.invalid.duplicate[kb.operator.language]);
										error=true;
									}
									else config.flat=res.record;
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
									setting:{
										code:'setting',
										type:'SUBTABLE',
										label:'',
										noLabel:true,
										fields:{
											view:{
												code:'view',
												type:'DROP_DOWN',
												label:kb.constants.config.caption.view[kb.operator.language],
												required:true,
												noLabel:false,
												options:[]
											},
											mode:{
												code:'mode',
												type:'RADIO_BUTTON',
												label:kb.constants.config.caption.mode[kb.operator.language],
												required:true,
												noLabel:false,
												options:[
													{index:0,label:'editor'},
													{index:1,label:'viewer'}
												]
											},
											buttons:{
												code:'buttons',
												type:'CHECK_BOX',
												label:kb.constants.config.caption.buttons[kb.operator.language],
												required:false,
												noLabel:false,
												options:[
													{index:0,label:'detail'},
													{index:1,label:'delete'},
													{index:2,label:'add'},
													{index:3,label:'clone'}
												]
											}
										}
									},
								}
							}
						};
						/* flat */
						((app) => {
							container.main.append(
								kb.create('div').addClass('kb-flat kb-scope').attr('form-id','form_'+app.id)
								.append(((table) => {
									table.template.elm('[field-id=view]').elm('select').empty().assignOption(
										([{code:'20',label:kb.constants.config.caption.view.all[kb.operator.language]}]).concat(viewInfos.list.map((item) => ({code:item.id,label:item.name}))),
										'label',
										'code'
									);
									table.template.elms('[data-name='+app.fields.setting.fields.mode.code+']').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.mode[element.val()][kb.operator.language]);
									});
									table.template.elm('[field-id='+app.fields.setting.fields.buttons.code+']').elms('[type=checkbox]').each((element,index) => {
										element.closest('label').elm('span').html(kb.constants.config.caption.buttons[element.val()][kb.operator.language]);
									});
									return table;
								})(kb.table.activate(kb.table.create(app.fields.setting),app)))
							);
							/* event */
							kb.event.on('kb.change.mode',(e) => {
								switch (e.record.setting.value[parseInt(e.container.attr('row-idx'))].value.mode.value)
								{
									case 'viewer':
										e.container.elm('[value=add]').parentNode.addClass('kb-hidden');
										e.container.elm('[value=clone]').parentNode.addClass('kb-hidden');
										break;
									case 'editor':
										e.container.elm('[value=add]').parentNode.removeClass('kb-hidden');
										e.container.elm('[value=clone]').parentNode.removeClass('kb-hidden');
										break;
								}
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
										container.main.elm('.kb-flat').elm('[field-id=setting]').tr.each((element,index) => {
											switch (setting.setting.value[index].value.mode.value)
											{
												case 'viewer':
													element.elm('[value=add]').parentNode.addClass('kb-hidden');
													element.elm('[value=clone]').parentNode.addClass('kb-hidden');
													break;
											}
										});
									});
								})({
									id:vars.app.id,
									fields:vars.app.fields.flat
								});
							})(JSON.parse(config.flat));
						}
						else container.main.elm('.kb-flat').elm('[field-id=setting]').addRow();
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
			buttons:{
				en:'Hide buttons',
				ja:'非表示にするボタン',
				zh:'隐藏按钮',
				detail:{
					en:'Open',
					ja:'開く',
					zh:'打开'
				},
				delete:{
					en:'Delete',
					ja:'削除',
					zh:'删除'
				},
				add:{
					en:'Create',
					ja:'新規作成',
					zh:'新建'
				},
				clone:{
					en:'Duplicate',
					ja:'複製',
					zh:'复制'
				}
			},
			mode:{
				en:'Mode',
				ja:'モード',
				zh:'模式',
				editor:{
					en:'Edit Mode',
					ja:'編集モード',
					zh:'编辑模式'
				},
				viewer:{
					en:'View Mode',
					ja:'閲覧モード',
					zh:'浏览模式'
				}
			},
			view:{
				en:'View',
				ja:'使用一覧',
				zh:'标题',
				all:{
					en:'(All records)',
					ja:'（すべて）',
					zh:'（全部）'
				}
			}
		},
		message:{
			invalid:{
				duplicate:{
					en:'You cannot specify the same list on different rows.',
					ja:'異なる行で同じ一覧を指定することは出来ません。',
					zh:'您不能在不同的行上指定相同的列表。'
				}
			}
		}
	}
},kb.constants);
