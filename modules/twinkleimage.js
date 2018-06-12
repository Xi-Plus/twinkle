//<nowiki>
// vim: set noet sts=0 sw=8:


(function($){


/*
 ****************************************
 *** twinkleimage.js: Image CSD module
 ****************************************
 * Mode of invocation:     Tab ("DI")
 * Active on:              File pages with a corresponding file which is local (not on Commons)
 * Config directives in:   TwinkleConfig
 */

Twinkle.image = function twinkleimage() {
	if (mw.config.get('wgNamespaceNumber') === 6 &&
			!document.getElementById("mw-sharedupload") &&
			document.getElementById("mw-imagepage-section-filehistory")) {

		Twinkle.addPortletLink(Twinkle.image.callback, wgUVS("图权", "圖權"), "tw-di", wgUVS("提交文件快速删除", "提交檔案快速刪除"));
	}
};

Twinkle.image.callback = function twinkleimageCallback() {
	var Window = new Morebits.simpleWindow( 600, 330 );
	Window.setTitle( wgUVS("文件快速删除候选", "檔案快速刪除候選") );
	Window.setScriptName( "Twinkle" );
	Window.addFooterLink( wgUVS("快速删除方针", "快速刪除方針"), "WP:CSD" );
	Window.addFooterLink( wgUVS("Twinkle帮助", "Twinkle說明"), "WP:TW/DOC#image" );

	var form = new Morebits.quickForm( Twinkle.image.callback.evaluate );
	form.append( {
			type: 'checkbox',
			list: [
				{
					label: wgUVS('通知上传者', '通知上傳者'),
					value: 'notify',
					name: 'notify',
					tooltip: wgUVS("如果您在标记同一用户的很多文件，请取消此复选框以避免使用户对话页过载。", "如果您在標記同一用戶的很多檔案，請取消此複選框以避免使用戶對話頁過載。"),
					checked: Twinkle.getPref('notifyUserOnDeli')
				}
			]
		}
	);
	var field = form.append( {
			type: 'field',
			label: wgUVS('需要的动作', '需要的動作')
		} );
	field.append( {
			type: 'radio',
			name: 'type',
			list: [
				{
					label: wgUVS('没有来源（CSD F3）', '沒有來源（CSD F3）'),
					value: 'no source',
					checked: true,
					tooltip: wgUVS('本图像并未注明原始出处，其声称的版权信息无法予以查证', '本圖像並未注明原始出處，其聲稱的版權資訊無法予以查證')
				},
				{
					label: wgUVS('没有版权（CSD F4）', '沒有版權（CSD F4）'),
					value: 'no license',
					tooltip: wgUVS('本档案缺少版权信息', '本檔案缺少版權資訊')
				}
			]
		} );
	form.append( { type:'submit' } );

	var result = form.render();
	Window.setContent( result );
	Window.display();

	// We must init the parameters
	var evt = document.createEvent( "Event" );
	evt.initEvent( 'change', true, true );
	result.type[0].dispatchEvent( evt );
};

Twinkle.image.callback.evaluate = function twinkleimageCallbackEvaluate(event) {
	var type;

	var notify = event.target.notify.checked;
	var types = event.target.type;
	for( var i = 0; i < types.length; ++i ) {
		if( types[i].checked ) {
			type = types[i].values;
			break;
		}
	}

	var csdcrit;
	switch( type ) {
		case 'no source':
			csdcrit = "f3";
			break;
		case 'no license':
			csdcrit = "f4";
			break;
		default:
			throw new Error( "Twinkle.image.callback.evaluate：未知条款" );
	}

	var lognomination = Twinkle.getPref('logSpeedyNominations') && Twinkle.getPref('noLogOnSpeedyNomination').indexOf(csdcrit.toLowerCase()) === -1;
	var templatename = type;

	var params = {
		'type': type,
		'templatename': templatename,
		'normalized': csdcrit,
		'lognomination': lognomination
	};
	Morebits.simpleWindow.setButtonsEnabled( false );
	Morebits.status.init( event.target );

	Morebits.wiki.actionCompleted.redirect = mw.config.get('wgPageName');
	Morebits.wiki.actionCompleted.notice = wgUVS("标记完成", "標記完成");

	// Tagging image
	var wikipedia_page = new Morebits.wiki.page( mw.config.get('wgPageName'), wgUVS('添加删除标记', '加入刪除標記') );
	wikipedia_page.setCallbackParameters( params );
	wikipedia_page.load( Twinkle.image.callbacks.taggingImage );

	// Notifying uploader
	if( notify ) {
		wikipedia_page.lookupCreator(Twinkle.image.callbacks.userNotification);
	} else {
		// add to CSD log if desired
		if (lognomination) {
			params.fromDI = true;
			Twinkle.speedy.callbacks.user.addToLog(params, null);
		}
		// No auto-notification, display what was going to be added.
		var noteData = document.createElement( 'pre' );
		noteData.appendChild( document.createTextNode( "{{subst:Uploadvionotice|" + Morebits.pageNameNorm + "}}--~~~~" ) );
		Morebits.status.info( '提示', wgUVS([ '这些内容应贴进上传者对话页：', document.createElement( 'br' ),  noteData ], [ '這些內容應貼進上傳者對話頁：', document.createElement( 'br' ),  noteData ]) );
	}
};

Twinkle.image.callbacks = {
	taggingImage: function(pageobj) {
		var text = pageobj.getPageText();
		var params = pageobj.getCallbackParameters();

		// remove "move to Commons" tag - deletion-tagged files cannot be moved to Commons
		text = text.replace(/\{\{(mtc|(copy |move )?to ?commons|move to wikimedia commons|copy to wikimedia commons)[^}]*\}\}/gi, "");
		// Adding discussion
		var wikipedia_page = new Morebits.wiki.page("Wikipedia:檔案存廢討論/無版權訊息或檔案來源", wgUVS("添加快速删除记录项", "加入快速刪除記錄項"));
		wikipedia_page.setFollowRedirect(true);
		wikipedia_page.setCallbackParameters(params);
		wikipedia_page.load(Twinkle.image.callbacks.imageList);

		var tag = "{{subst:" + params.templatename + "/auto";
		tag += "}}\n";

		pageobj.setPageText(tag + text);
		pageobj.setEditSummary(wgUVS("请求快速删除（[[WP:CSD#", "請求快速刪除（[[WP:CSD#") + params.normalized.toUpperCase() + "|CSD " + params.normalized.toUpperCase() + "]]）：" + params.type + Twinkle.getPref('summaryAd'));
		switch (Twinkle.getPref('deliWatchPage')) {
			case 'yes':
				pageobj.setWatchlist(true);
				break;
			case 'no':
				pageobj.setWatchlistFromPreferences(false);
				break;
			default:
				pageobj.setWatchlistFromPreferences(true);
				break;
		}
		pageobj.setCreateOption('nocreate');
		pageobj.save();
	},
	userNotification: function(pageobj) {
		var params = pageobj.getCallbackParameters();
		var initialContrib = pageobj.getCreator();

		// disallow warning yourself
		if (initialContrib === mw.config.get('wgUserName')) {
			pageobj.getStatusElement().warn(wgUVS("您（" + initialContrib + "）创建了该页，跳过通知", "您（" + initialContrib + "）建立了該頁，跳過通知"));
		} else {
			var talkPageName = 'User talk:' + initialContrib;
			Morebits.wiki.flow.check(talkPageName, function () {
				var flowpage = new Morebits.wiki.flow(talkPageName, wgUVS("通知上传者(", "通知上傳者(") + initialContrib + ")");
				flowpage.setTopic(wgUVS("请补充文件[[:", "請補充檔案[[:") + Morebits.pageNameNorm + wgUVS("]]的版权或来源信息", "]]的版權或來源資訊"));
				flowpage.setContent("{{subst:Uploadvionotice|" + Morebits.pageNameNorm + "|flow=yes}}");
				flowpage.newTopic();
			}, function () {
				var usertalkpage = new Morebits.wiki.page(talkPageName, wgUVS("通知上传者(", "通知上傳者(") + initialContrib + ")");
				var notifytext = "\n{{subst:Uploadvionotice|" + Morebits.pageNameNorm + "}}--~~~~";
				usertalkpage.setAppendText(notifytext);
				usertalkpage.setEditSummary(wgUVS("通知：文件[[", "通知：檔案[[") + Morebits.pageNameNorm + wgUVS("]]快速删除提名", "]]快速刪除提名") + Twinkle.getPref('summaryAd'));
				usertalkpage.setCreateOption('recreate');
				switch (Twinkle.getPref('deliWatchUser')) {
					case 'yes':
						usertalkpage.setWatchlist(true);
						break;
					case 'no':
						usertalkpage.setWatchlistFromPreferences(false);
						break;
					default:
						usertalkpage.setWatchlistFromPreferences(true);
						break;
				}
				usertalkpage.setFollowRedirect(true);
				usertalkpage.append();
			});
		}

		// add this nomination to the user's userspace log, if the user has enabled it
		if (params.lognomination) {
			params.fromDI = true;
			Twinkle.speedy.callbacks.user.addToLog(params, initialContrib);
		}
	},
	imageList: function(pageobj) {
		var text = pageobj.getPageText();
		var params = pageobj.getCallbackParameters();

		pageobj.setPageText(text + "\n* [[:" + Morebits.pageNameNorm + "]]--~~~~");
		pageobj.setEditSummary(wgUVS("添加[[", "加入[[") + Morebits.pageNameNorm + "]]。" + Twinkle.getPref('summaryAd'));
		pageobj.setCreateOption('recreate');
		pageobj.save();
	}

};
})(jQuery);


//</nowiki>
