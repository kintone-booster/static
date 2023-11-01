/*
* FileName "plugins.mail.config.js"
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
												if (res.record.attachment.value)
												{
													if (fieldInfos.parallelize[res.record.to.value].tableCode)
													{
														if (fieldInfos.parallelize[res.record.attachment.value].tableCode)
															if (fieldInfos.parallelize[res.record.attachment.value].tableCode!=fieldInfos.parallelize[res.record.to.value].tableCode)
															{
																kb.alert(kb.constants.config.message.invalid.unmatch.intable[kb.operator.language]);
																kb.config[PLUGIN_ID].tabbed.activate(item);
																error=true;
															}
													}
													else
													{
														if (fieldInfos.parallelize[res.record.attachment.value].tableCode)
														{
															kb.alert(kb.constants.config.message.invalid.unmatch.outtable[kb.operator.language]);
															kb.config[PLUGIN_ID].tabbed.activate(item);
															error=true;
														}
													}
												}
												if (!error) config.tab.push({label:item.label.html(),setting:res.record});
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
												{index:2,label:'process'},
												{index:3,label:'detail'},
												{index:4,label:'index'}
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
										mail:{
											code:'mail',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.mail[kb.operator.language],
											required:true,
											noLabel:false,
											format:'mail'
										},
										sender:{
											code:'sender',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.sender[kb.operator.language],
											required:true,
											noLabel:false,
											format:'text'
										},
										host:{
											code:'host',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.host[kb.operator.language],
											required:true,
											noLabel:false,
											format:'alphanum'
										},
										port:{
											code:'port',
											type:'NUMBER',
											label:kb.constants.config.caption.port[kb.operator.language],
											required:true,
											noLabel:false
										},
										author:{
											code:'author',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.author[kb.operator.language],
											required:true,
											noLabel:false,
											format:'alphanum'
										},
										pwd:{
											code:'pwd',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.pwd[kb.operator.language],
											required:true,
											noLabel:false,
											format:'password'
										},
										secure:{
											code:'secure',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.secure[kb.operator.language],
											required:false,
											noLabel:false,
											options:[
												{index:0,label:''},
												{index:1,label:'STARTTLS'},
												{index:2,label:'SSL\/TLS'}
											]
										},
										to:{
											code:'to',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.to[kb.operator.language],
											required:true,
											noLabel:false,
											options:[]
										},
										cc:{
											code:'cc',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.cc[kb.operator.language],
											required:false,
											noLabel:false
										},
										bcc:{
											code:'bcc',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.bcc[kb.operator.language],
											required:false,
											noLabel:false
										},
										attachment:{
											code:'attachment',
											type:'DROP_DOWN',
											label:kb.constants.config.caption.attachment[kb.operator.language],
											required:false,
											noLabel:false,
											options:[]
										},
										subject:{
											code:'subject',
											type:'SINGLE_LINE_TEXT',
											label:kb.constants.config.caption.subject[kb.operator.language],
											required:true,
											noLabel:false
										},
										body:{
											code:'body',
											type:'MULTI_LINE_TEXT',
											label:kb.constants.config.caption.body[kb.operator.language],
											required:true,
											noLabel:false,
											lines:10
										},
										format:{
											code:'format',
											type:'RADIO_BUTTON',
											label:kb.constants.config.caption.format[kb.operator.language],
											required:true,
											noLabel:false,
											options:[
												{index:0,label:'TEXT'},
												{index:1,label:'HTML'}
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
									return record;
								})());
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
											.append(kb.create('h1').html(kb.constants.config.caption.server[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.mail),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.sender),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.host),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.port),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.author),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.pwd),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.secure),app)))
											)
											.append(kb.create('h1').html(kb.constants.config.caption.send[kb.operator.language]))
											.append(
												kb.create('section')
												.append(kb.create('div').append(kb.field.activate(((res) => {
													res.elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
														switch (current.type)
														{
															case 'LINK':
																if (current.protocol=='MAIL') result.push({code:current.code,label:current.label});
																break;
															case 'SINGLE_LINE_TEXT':
																if (!current.lookup) result.push({code:current.code,label:current.label});
																break;
														}
														return result;
													}),'label','code');
													return res;
												})(kb.field.create(app.fields.to)),app)))
												.append(kb.create('p').addClass('kb-hint').html(kb.constants.config.description.multi[kb.operator.language]))
												.append(kb.create('p').addClass('kb-caution').html(kb.constants.config.description.to[kb.operator.language]))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.cc).css({width:'100%'}),app)))
												.append(kb.create('p').addClass('kb-hint').html(kb.constants.config.description.cc[kb.operator.language]))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.bcc).css({width:'100%'}),app)))
												.append(kb.create('p').addClass('kb-hint').html(kb.constants.config.description.bcc[kb.operator.language]))
												.append(kb.create('div').append(kb.field.activate(((res) => {
													res.elm('select').empty().assignOption(kb.config[PLUGIN_ID].ui.options.fields(fieldInfos,(result,current) => {
														switch (current.type)
														{
															case 'FILE':
																result.push({code:current.code,label:current.label});
																break;
														}
														return result;
													}),'label','code');
													return res;
												})(kb.field.create(app.fields.attachment)),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.subject).css({width:'100%'}),app)))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.body).css({width:'100%'}),app)))
												.append(kb.create('p').addClass('kb-hint').html(kb.constants.config.description.body[kb.operator.language]))
												.append(kb.create('div').append(kb.field.activate(kb.field.create(app.fields.format).css({width:'100%'}),app)))
											);
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
			attachment:{
				en:'Attachment Field',
				ja:'添付ファイルフィールド',
				zh:'附件字段'
			},
			author:{
				en:'User Name',
				ja:'認証ユーザー名',
				zh:'认证用户名'
			},
			bcc:{
				en:'BCC EMail Addresss',
				ja:'BCCメールアドレス',
				zh:'BCC 电子邮件地址'
			},
			body:{
				en:'Body',
				ja:'本文',
				zh:'正文'
			},
			cc:{
				en:'CC EMail Addresss',
				ja:'CCメールアドレス',
				zh:'CC 电子邮件地址'
			},
			event:{
				en:'Action Available Event',
				ja:'動作イベント',
				zh:'可操作事件',
				create:{
					en:'After Record Creation Success',
					ja:'レコード追加画面でのレコード保存成功後',
					zh:'记录创建成功后'
				},
				detail:{
					en:'Clicking the button on the record detail page',
					ja:'レコード詳細画面でのボタンクリック',
					zh:'在记录详细页面上点击按钮'
				},
				edit:{
					en:'After Record Edit Success',
					ja:'レコード編集画面でのレコード保存成功後',
					zh:'记录编辑成功后'
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
				}
			},
			format:{
				en:'Content Type',
				ja:'コンテンツ形式',
				zh:'内容类型'
			},
			host:{
				en:'Server Name',
				ja:'サーバー名',
				zh:'服务器名称'
			},
			label:{
				en:'Execution Button Label',
				ja:'実行ボタンのラベルテキスト',
				zh:'执行按钮的标签名称'
			},
			mail:{
				en:'Sender EMail Address',
				ja:'送信メールアドレス',
				zh:'发送邮件地址'
			},
			message:{
				en:'Execution Confirmation Dialog Message',
				ja:'実行確認ダイアログのメッセージ',
				zh:'执行确认对话框的消息'
			},
			port:{
				en:'Port',
				ja:'ポート番号',
				zh:'端口号'
			},
			pwd:{
				en:'Password',
				ja:'認証パスワード',
				zh:'认证密码'
			},
			secure:{
				en:'Connection Security',
				ja:'接続の保護',
				zh:'连接安全'
			},
			send:{
				en:'Email Sending Settings',
				ja:'メール送信設定',
				zh:'邮件发送设置'
			},
			sender:{
				en:'Sender Name',
				ja:'差出人名',
				zh:'发件人名'
			},
			server:{
				en:'SMTP Server Settings',
				ja:'送信SMTPサーバー設定',
				zh:'SMTP服务器设置'
			},
			subject:{
				en:'Subject',
				ja:'件名',
				zh:'主题'
			},
			to:{
				en:'Recipient EMail Address',
				ja:'送信先メールアドレスフィールド',
				zh:'发送至电子邮件地址字段'
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
			bcc:{
				en:'If you enter multiple email addresses, separate them with commas.',
				ja:'複数のメールアドレスはカンマ区切りで入力。',
				zh:'请输入多个电子邮件地址，用逗号分隔。'
			},
			body:{
				en:'To insert the value of a field at any position in the Subject/Body, please enclose the field code of the field to be inserted with %.',
				ja:'件名・本文の任意の位置にフィールドの値を挿入する場合は、挿入するフィールドのフィールドコードを、%で囲って入力して下さい。',
				zh:'要在主题/正文的任意位置插入字段值，请用%包围要插入的字段的字段代码。'
			},
			cc:{
				en:'If you enter multiple email addresses, separate them with commas/',
				ja:'複数のメールアドレスはカンマ区切りで入力。',
				zh:'请输入多个电子邮件地址，用逗号分隔。'
			},
			multi:{
				en:'Please specify a string field with email addresses separated by commas when designating multiple recipients.',
				ja:'複数のメールアドレスを送信先に指定する場合は、メールアドレスがカンマ区切りで入力された文字列フィールドを指定して下さい。',
				zh:'请在指定多个收件人时，指定一个用逗号分隔的电子邮件地址的字符串字段。'
			},
			to:{
				en:'Please note that if you specify a field within a table as the recipient email address field, the fields to be inserted into the subject and body, as well as the attachment file field, must be limited to fields belonging to the same table.',
				ja:'送信先メールアドレスフィールドにテーブル内フィールドを指定した場合は、件名・本文の任意に挿入するフィールドや添付ファイルフィールドが同じテーブルに属するフィールドに限定されますので、ご注意ください。',
				zh:'请注意，如果您在收件人电子邮件地址字段中指定了表内字段，插入到主题和正文的字段以及附件文件字段必须限于属于同一表的字段。'
			}
		},
		message:{
			invalid:{
				action:{
					en:'If you specify "Process Action" for the action event, please indicate its action name.',
					ja:'動作イベントに「プロセスアクション」を指定した場合は、そのアクション名を指定して下さい。',
					zh:'如果在操作事件中指定了“过程操作”，请指定其操作名称。'
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
				},
				unmatch:{
					intable:{
						en:'You must specify the attachment field in the same table when you specify the recipient email address field in a table.',
						ja:'送信先メールアドレスフィールドがテーブル内フィールドである場合は、添付ファイルフィールドも同じテーブル内フィールドである必要があります。',
						zh:'如果发送至电子邮件地址字段位于表格内，则附件字段也必须位于同一表格内。'
					},
					outtable:{
						en:'You must specify the out of table attachment field when you specify the out of table recipient email address field.',
						ja:'送信先メールアドレスフィールドがテーブル外フィールドである場合は、添付ファイルフィールドもテーブル外フィールドである必要があります。',
						zh:'如果发送至电子邮件地址字段位于表格外，则附件字段也必须位于表格外。'
					}
				}
			}
		}

	}
},kb.constants);
