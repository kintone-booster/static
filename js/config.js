/*
* FileName "config.js"
* Version: 1.0.0
* Copyright (c) 2023 Pandafirm LLC
* Distributed under the terms of the GNU Lesser General Public License.
* https://opensource.org/licenses/LGPL-2.1
*/
"use strict";
window.KintoneBoosterConfig=class{
	/* constructor */
	constructor(pluginId){
		/* setup properties */
		this.app=(location.href.match(/\/m\//g))?kintone.mobile.app.getId():kintone.app.getId();
		this.subdomain=location.host.split('.')[0];
		this.cache=null;
		this.config={
			size:(value) => {
				return [...value].reduce((result,current,idx,arr) => {
					const code=current.charCodeAt(0);
					if (code<=0x7f) result+=1;
					else
					{
						if (code<=0x7ff) result+=2
						else
						{
							if (code>=0xd800 && code<=0xdfff)
							{
								arr[idx+1]='';
								result+=4;
							}
							else result+=(code<0xffff)?3:4;
						}
					}
					return result;
				},0);
			},
			clear:() => {
				return new Promise((resolve,reject) => {
					fetch(
						'https://api.kintone-booster.com/config?id='+pluginId+'&subdomain='+this.subdomain+'&app='+this.app,
						{
							method:'DELETE',
							headers:{
								'X-Requested-With':'XMLHttpRequest'
							}
						}
					)
					.then((response) => {
						response.json().then((json) => {
							switch (response.status)
							{
								case 200:
									resolve();
									break;
								default:
									kb.alert(kb.error.parse(json));
									reject();
									break;
							}
						});
					})
					.catch((error) => {
						console.log('Failed to connect to the server.');
						reject();
					});
				});
			},
			get:() => {
				return new Promise((resolve,reject) => {
					try
					{
						if (!this.cache)
						{
							((config) => {
								if (Object.keys(config).exceeded)
								{
									fetch(
										'https://api.kintone-booster.com/config?id='+pluginId+'&subdomain='+this.subdomain+'&app='+this.app,
										{
											method:'GET',
											headers:{
												'X-Requested-With':'XMLHttpRequest'
											}
										}
									)
									.then((response) => {
										response.json().then((json) => {
											switch (response.status)
											{
												case 200:
													this.cache=(('result' in json)?((typeof json.result==='string')?{}:json.result):{});
													resolve(this.cache);
													break;
												default:
													kb.alert(kb.error.parse(json));
													reject();
													break;
											}
										});
									})
									.catch((error) => {
										console.log('Failed to connect to the server.');
										reject();
									});
								}
								else
								{
									this.cache=config;
									resolve(this.cache);
								}
							})(kintone.plugin.app.getConfig(pluginId));
						}
						else resolve(this.cache);
					}
					catch(error)
					{
						kb.alert(kb.error.parse(error));
						reject();
					}
				});
			},
			set:(config) => {
				try
				{
					if (this.config.size(JSON.stringify(config))>255000)
					{
						fetch(
							'https://api.kintone-booster.com/config',
							{
								method:'PUT',
								headers:{
									'X-Requested-With':'XMLHttpRequest'
								},
								body:JSON.stringify({
									id:pluginId,
									subdomain:this.subdomain,
									app:this.app,
									datas:config
								})
							}
						)
						.then((response) => {
							response.json().then((json) => {
								switch (response.status)
								{
									case 200:
										kintone.plugin.app.setConfig({exceeded:true});
										break;
									default:
										kb.alert(kb.error.parse(json));
										break;
								}
							});
						})
						.catch((error) => {
							console.log('Failed to connect to the server.');
						});
					}
					else kintone.plugin.app.setConfig(config);
				}
				catch(error){kb.alert(kb.error.parse(error))}
			}
		};
		this.ui={
			fields:{
				conditions:{
					get:(fieldInfos) => {
						return {
							condition:{
								code:'condition',
								type:'CONDITION',
								label:'',
								required:false,
								noLabel:true,
								app:{
									id:kintone.app.getId(),
									fields:fieldInfos.parallelize
								}
							},
							device:{
								code:'device',
								type:'RADIO_BUTTON',
								label:'',
								required:true,
								noLabel:true,
								options:[
									{index:0,label:'both'},
									{index:1,label:'pc'},
									{index:2,label:'mobile'}
								]
							}
						};
					},
					set:(container,app) => {
						return container
						.append(kb.create('h1').html(kb.constants.config.caption.conditions[kb.operator.language]))
						.append(
							kb.create('section')
							.append(kb.create('p').html(kb.constants.config.caption.conditions.condition[kb.operator.language]))
							.append(kb.field.activate(kb.field.create(app.fields.condition),app))
						)
						.append(
							kb.create('section')
							.append(kb.field.activate(((res) => {
								res.elms('[data-name='+app.fields.device.code+']').each((element,index) => {
									element.closest('label').elm('span').html(kb.constants.config.caption.conditions.device[element.val()][kb.operator.language]);
								});
								return res;
							})(kb.field.create(app.fields.device)),app))
						);
					}
				},
				users:{
					get:(fieldInfos) => {
						return {
							user:{
								code:'user',
								type:'USER_SELECT',
								label:'',
								required:false,
								noLabel:true,
								guestuser:true
							},
							organization:{
								code:'organization',
								type:'ORGANIZATION_SELECT',
								label:'',
								required:false,
								noLabel:true
							},
							group:{
								code:'group',
								type:'GROUP_SELECT',
								label:'',
								required:false,
								noLabel:true
							}
						};
					},
					set:(container,app) => {
						return container
						.append(kb.create('h1').html(kb.constants.config.caption.users[kb.operator.language]))
						.append(
							kb.create('section')
							.append(kb.create('p').html(kb.constants.config.caption.users.user[kb.operator.language]))
							.append(kb.field.activate(kb.field.create(app.fields.user),app))
						)
						.append(
							kb.create('section')
							.append(kb.create('p').html(kb.constants.config.caption.users.organization[kb.operator.language]))
							.append(kb.field.activate(kb.field.create(app.fields.organization),app))
						)
						.append(
							kb.create('section')
							.append(kb.create('p').html(kb.constants.config.caption.users.group[kb.operator.language]))
							.append(kb.field.activate(kb.field.create(app.fields.group),app))
						);
					}
				}
			},
			options:{
				fields:(fieldInfos,filter,tables,groups) => {
					var res=[{code:'',label:''}];
					if (filter) res=res.concat(Object.values(fieldInfos.placed).reduce(filter,[]));
					if (tables) res=res.concat(Object.values(fieldInfos.tables).map((item) => ({code:item.code,label:item.label})));
					if (groups) res=res.concat(Object.values(fieldInfos.groups).map((item) => ({code:item.code,label:item.label})));
					return res;
				}
			}
		}
	}
	/* build */
	build(options,callback,config){
		try
		{
			((container) => {
				if (container)
				{
					container.parentNode.css({width:'calc(100% - '+container.parentNode.siblings().reduce((result,current) => result+current.outerWidth(),16)+'px)'});
					container
					.append(((main) => {
						container.main=main;
						return main;
					})(kb.create('main').addClass('kb-config-main')))
					.append(((footer) => {
						container.footer=footer;
						return footer;
					})(kb.create('footer').addClass('kb-config-footer')));
					if (options.submit)
					{
						container.footer
						.append(((button) => {
							switch (kb.operator.language)
							{
								case 'en':
									button.text('Save');
									break;
								case 'ja':
									button.text('保存する');
									break;
								case 'zh':
									button.text('保存');
									break;
							}
							return button;
						})(kb.create('button').addClass('kb-config-footer-button kb-config-footer-button-submit').on('click',() => {
							((config) => {
								if (config)
									kb.confirm(kb.constants.common.message.confirm.save[kb.operator.language],() => {
										this.config.set(config);
									});
							})(options.submit(container,{}));
						})))
						.append(((button) => {
							switch (kb.operator.language)
							{
								case 'en':
									button.text('Cancel');
									break;
								case 'ja':
									button.text('キャンセル');
									break;
								case 'zh':
									button.text('取消');
									break;
							}
							return button;
						})(kb.create('button').addClass('kb-config-footer-button kb-config-footer-button-cancel').on('click',(e) => history.back())))
						.append(((button) => {
							switch (kb.operator.language)
							{
								case 'en':
									button.text('Export configuration file');
									break;
								case 'ja':
									button.text('設定ファイル書き出し');
									break;
								case 'zh':
									button.text('导出配置文件');
									break;
							}
							return button;
						})(kb.create('button').addClass('kb-config-footer-button kb-config-footer-button-export').on('click',(e) => {
							this.config.get()
							.then((config) => kb.downloadText(JSON.stringify(config),'config.json'))
							.catch((error) => {});
						})))
						.append(((button) => {
							switch (kb.operator.language)
							{
								case 'en':
									button.text('Import configuration file');
									break;
								case 'ja':
									button.text('設定ファイル読み込み');
									break;
								case 'zh':
									button.text('导入配置文件');
									break;
							}
							return button;
						})(kb.create('button').addClass('kb-config-footer-button kb-config-footer-button-import').on('click',(e) => {
							((file) => {
								kb.elm('body').append(file.on('change',(e) => {
									if (e.currentTarget.files)
									{
										var reader=new FileReader();
										reader.onload=((readData) => {
											var config={};
											try
											{
												config=JSON.parse(readData.target.result);
											}
											catch(error)
											{
												config={};
											}
											finally
											{
												this.build(options,callback,config)
											}
										});
										reader.readAsText(e.currentTarget.files.first());
									}
									else document.body.removeChild(file);
								}));
								file.click();
							})(kb.create('input').attr('type','file').attr('accept','.json').css({display:'none'}));
						})))
					}
					if (!config) this.config.get().then((config) => callback(container,config)).catch((error) => {});
					else callback(container,config)
				}
			})(kb.elm('.kb-config-container').empty());
		}
		catch(error){kb.alert(kb.error.parse(error))}
	}
};
window.KintoneBoosterConfigTabbed=class{
	/* constructor */
	constructor(container,callback){
		/* setup properties */
		this.tabs=[];
		this.callback=callback;
		this.container=container;
		this.container.main
		.append(kb.create('div').addClass('kb-hidden kb-config-tabbed-tab-scroller'))
		.append(
			((tabs) => {
				this.container.tabs=tabs;
				return tabs.append(kb.create('div').addClass('kb-hidden kb-config-tabbed-tab-guide'));
			})(kb.create('div').addClass('kb-config-tabbed-tabs'))
		)
		.append(
			((panels) => {
				this.container.panels=panels;
				return panels;
			})(kb.create('div').addClass('kb-config-tabbed-panels'))
		);
		/* tab scroller */
		((container,scroller) => {
			((buttons) => {
				var observer={
					mutation:null,
					resize:null
				};
				var adjust=(coord=0) => {
					if (container.scrollWidth>container.clientWidth)
					{
						if (container.scrollLeft+coord>0) buttons.prev.removeAttr('disabled');
						else buttons.prev.attr('disabled','disabled');
						if (container.scrollLeft+coord<container.scrollWidth-container.clientWidth) buttons.next.removeAttr('disabled');
						else buttons.next.attr('disabled','disabled');
						scroller.removeClass('kb-hidden');
					}
					else scroller.addClass('kb-hidden');
				};
				observer.mutation=new MutationObserver(() => adjust());
				observer.mutation.disconnect();
				observer.mutation.observe(container,{childList:true});
				observer.resize=new ResizeObserver(() => adjust());
				observer.resize.disconnect();
				observer.resize.observe(container);
				scroller
				.append(buttons.prev.on('click',(e) => {
					((coord) => {
						adjust(coord);
						container.scrollBy({left:coord});
					})(Math.floor(container.clientWidth/-2));
				}))
				.append(buttons.next.on('click',(e) => {
					((coord) => {
						adjust(coord);
						container.scrollBy({left:coord});
					})(Math.ceil(container.clientWidth/2));
				}));
			})({
				prev:kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-left'),
				next:kb.create('button').addClass('kb-icon kb-icon-arrow kb-icon-arrow-right')
			});
		})(this.container.elm('.kb-config-tabbed-tabs'),this.container.elm('.kb-config-tabbed-tab-scroller'));
		/* drag event */
		kb.event.on('kb.drag.start',(e) => {
			var keep={
				element:e.element,
				guide:this.container.tabs.elm('.kb-config-tabbed-tab-guide')
			};
			var handler={
				move:(e) => {
					var element=document.elementFromPoint(e.pageX,e.pageY);
					if (element)
						if (element!=keep.guide)
							((rect) => {
								if (element.hasClass('kb-config-tabbed-tab'))
									element.parentNode.insertBefore(keep.guide.removeClass('kb-hidden'),(e.pageX<rect.left+rect.width*0.5)?element:element.nextElementSibling);
							})(element.getBoundingClientRect());
				},
				end:(e) => {
					if (keep.guide.visible()) keep.guide.parentNode.insertBefore(keep.element.removeClass('kb-hidden'),keep.guide.addClass('kb-hidden').nextElementSibling);
					else keep.element.removeClass('kb-hidden');
					this.tabs=this.container.tabs.elms('.kb-config-tabbed-tab').map((item,index) => {
						item.removeClass('kb-dragging').index=index;
						return item;
					});
					window.off('mousemove,touchmove',handler.move);
					window.off('mouseup,touchend',handler.end);
					e.stopPropagation();
					e.preventDefault();
				}
			};
			((rect) => {
				keep.guide.css({width:rect.width.toString()+'px'});
				keep.element.addClass('kb-hidden').parentNode.insertBefore(keep.guide.removeClass('kb-hidden'),keep.element.nextElementSibling);
			})(keep.element.getBoundingClientRect());
			this.tabs.each((tab,index) => {
				tab.addClass('kb-dragging');
			});
			/* event */
			window.on('mousemove,touchmove',handler.move);
			window.on('mouseup,touchend',handler.end);
		});
	}
	/* activate */
	activate(target){
		this.tabs.each((tab,index) => {
			if (index==target.index)
			{
				tab.addClass('kb-activate');
				tab.panel.show();
			}
			else
			{
				tab.removeClass('kb-activate');
				tab.panel.hide();
			}
		});
		return target;
	}
	/* add */
	add(index){
		return ((tab) => {
			var handler=(e) => {
				var pointer=(e.changedTouches)?Array.from(e.changedTouches).first():e;
				kb.event.call(
					'kb.drag.start',
					{
						element:tab,
						page:{
							x:pointer.pageX,
							y:pointer.pageY
						}
					}
				);
				window.off('touchmove,mousemove',handler);
			};
			this.container.panels.append(tab.panel);
			if (kb.isNumeric(index))
			{
				this.container.tabs.insertBefore(tab,this.tabs[index].nextElementSibling);
				this.tabs.splice(index+1,0,tab);
			}
			else
			{
				this.container.tabs.append(tab);
				this.tabs.push(tab);
			}
			this.tabs.each((tab,index) => {
				tab.index=index;
			});
			this.callback.add((() => {
				tab.label.html((() => {
					var res='';
					switch (kb.operator.language)
					{
						case 'en':
							res='Setting';
							break;
						case 'ja':
							res='設定';
							break;
						case 'zh':
							res='设置';
							break;
					}
					return res+(this.tabs.filter((item) => {
						return item.label.html().match(new RegExp('^'+res+'[1-9]{1}[0-9]*$','g'));
					}).length+1).toString();
				})());
				return tab;
			})());
			this.activate(tab);
			/* event */
			tab
			.on('touchstart,mousedown',(e) => {
				window.on('touchmove,mousemove',handler);
				e.stopPropagation();
				e.preventDefault();
			})
			.on('touchend,mouseup',(e) => {
				window.off('touchmove,mousemove',handler);
				this.activate(tab)
				e.stopPropagation();
				e.preventDefault();
			});
			return tab;
		})((() => {
			var res=kb.create('div').addClass('kb-config-tabbed-tab')
			.append(
				kb.create('span').addClass('kb-config-tabbed-tab-label')
				.on('dblclick',(e) => {
					e.currentTarget.parentNode.elm('.kb-config-tabbed-tab-prompt').val(e.currentTarget.html()).show('inline-block').focus();
					e.currentTarget.hide();
					e.stopPropagation();
					e.preventDefault();
				})
			)
			.append(
				kb.create('input').attr('type','text').addClass('kb-config-tabbed-tab-prompt').hide()
				.on('touchstart,mousedown',(e) => {
					e.stopPropagation();
				})
				.on('blur',(e) => {
					e.currentTarget.parentNode.elm('.kb-config-tabbed-tab-label').html(e.currentTarget.val()).show('inline-block');
					e.currentTarget.hide();
					e.stopPropagation();
					e.preventDefault();
				})
			)
			.append(
				kb.create('button').addClass('kb-icon kb-icon-add')
				.on('touchstart,mousedown',(e) => {
					e.stopPropagation();
				})
				.on('click',(e) => {
					this.add(res.index);
					e.stopPropagation();
					e.preventDefault();
				})
			)
			.append(
				kb.create('button').addClass('kb-icon kb-icon-copy')
				.on('touchstart,mousedown',(e) => {
					e.stopPropagation();
				})
				.on('click',(e) => {
					this.add(res.index);
					switch (kb.operator.language)
					{
						case 'en':
							this.tabs[res.index+1].label.html(this.tabs[res.index].label.html()+' Copy');
							break;
						case 'ja':
							this.tabs[res.index+1].label.html(this.tabs[res.index].label.html()+' コピー');
							break;
						case 'zh':
							this.tabs[res.index+1].label.html(this.tabs[res.index].label.html()+' 复制');
							break;
					}
					this.copy(res.index,res.index+1);
					e.stopPropagation();
					e.preventDefault();
				})
			)
			.append(
				kb.create('button').addClass('kb-icon kb-icon-del')
				.on('touchstart,mousedown',(e) => {
					e.stopPropagation();
				})
				.on('click',(e) => {
					kb.confirm(kb.constants.common.message.confirm.delete[kb.operator.language],() => {
						this.del(res.index);
					});
					e.stopPropagation();
					e.preventDefault();
				})
			);
			res.label=res.elm('.kb-config-tabbed-tab-label');
			res.panel=kb.create('div').addClass('kb-config-tabbed-panel')
			return res;
		})());
	}
	/* copy */
	copy(source,destination){
		this.callback.copy(this.tabs[source],this.tabs[destination]);
	}
	/* del */
	del(index){
		((tab) => {
			this.container.panels.removeChild(tab.panel);
			this.container.tabs.removeChild(tab);
			this.tabs.splice(index,1);
			this.tabs.each((tab,index) => {
				tab.index=index;
			});
			this.callback.del(index);
			if (this.tabs.length==0) this.add();
			else this.activate(this.tabs[(this.tabs.length>index)?index:index-1]);
		})(this.tabs[index]);
	}
};
if (typeof kb.config==='undefined') kb.config={};
kb.config[kintone.$PLUGIN_ID]=new KintoneBoosterConfig(kintone.$PLUGIN_ID);
/*
Message definition by language
*/
kb.constants=kb.extend({
	config:{
		caption:{
			conditions:{
				en:'Conditions for operation',
				ja:'動作条件',
				zh:'操作的条件',
				condition:{
					en:'Please specify the conditions for the record to be executable with the set content.',
					ja:'設定した内容を実行出来るレコードの条件を指定して下さい。',
					zh:'请指定具有所设置内容的记录的可执行条件。'
				},
				device:{
					both:{
						en:'Execute on both PC and mobile versions',
						ja:'PC版とモバイル版の両方で実行',
						zh:'在PC和移动版本上都执行'
					},
					mobile:{
						en:'Execute on mobile version only',
						ja:'モバイル版のみで実行',
						zh:'仅在移动版本上执行'
					},
					pc:{
						en:'Execute on PC version only',
						ja:'PC版のみで実行',
						zh:'仅在PC版本上执行'
					}
				}
			},
			users:{
				en:'Authorized users',
				ja:'許可ユーザー',
				zh:'获得授权的用户',
				group:{
					en:'In addition to the operational conditions, if you want to determine the execution permission based on the group the logged-in user belongs to, please specify the group to be permitted.',
					ja:'動作条件に加え、ログインユーザーが所属するグループを実行許可の判断としたい場合は、許可するグループを指定して下さい。',
					zh:'除了操作条件外，如果您想根据登录用户所属的组来决定执行权限，请指定允许的组。'
				},
				organization:{
					en:'In addition to the operational conditions, if you want to determine the execution permission based on the organization the logged-in user belongs to, please specify the organization to be permitted.',
					ja:'動作条件に加え、ログインユーザーが所属する組織を実行許可の判断としたい場合は、許可する組織を指定して下さい。',
					zh:'除了操作条件外，如果您想根据登录用户所属的组织来决定执行权限，请指定允许的组织。'
				},
				user:{
					en:'In addition to the operational conditions, if you want to determine the execution permission based on the logged-in user, please specify the user to be permitted.',
					ja:'動作条件に加え、ログインユーザーを実行許可の判断としたい場合は、許可するユーザーを指定して下さい。',
					zh:'除了操作条件外，如果您想根据登录用户来决定执行权限，请指定允许的用户。'
				}
			}
		}
	}
},kb.constants);
