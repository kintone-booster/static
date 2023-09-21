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
		kb.config[PLUGIN_ID].build(
			{
				submit:(container,config) => {
					var error=false;
					config.tab=[];
					config.flat={};
					config.tab=JSON.stringify(config.tab);
					config.flat=JSON.stringify(config.flat);
					return !(error)?config:false;
				}
			},
			(container,config) => {
				vars.app={
					id:PLUGIN_ID,
					fields:{
						tab:{
						},
						flat:{
						}
					}
				};
				/* tabbed */
				kb.config[PLUGIN_ID].tabbed=new KintoneBoosterConfigTabbed(
					container,
					{
						add:(tab) => {
							((app) => {
								tab.panel.addClass('kb-scope').attr('form-id','form_'+app.id);
								tab.panel.elms('input,select,textarea').each((element,index) => element.initialize());
							})({
								id:vars.app.id,
								fields:vars.app.fields.tab
							});
						},
						copy:(source,destination) => {
							((app) => {
								kb.record.set(destination.panel,app,kb.record.get(source.panel,app,true).record);
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

				}
				else kb.config[PLUGIN_ID].tabbed.add();
			}
		);
	});
})(kintone.$PLUGIN_ID);
