// <nowiki>


(function($) {


/*
 ****************************************
 *** twinklestub.js: Tag module
 ****************************************
 * Mode of invocation:     Tab ("Stub")
 * Active on:              Existing articles
 * Config directives in:   FriendlyConfig
 * Note:                   customised friendlytag module (for SEWP)
 */

Twinkle.stub = function friendlytag() {
	// redirect tagging
	if (Morebits.isPageRedirect()) {
		Twinkle.stub.mode = '重定向';
	// file tagging
	} else if (mw.config.get('wgNamespaceNumber') === 6 && !document.getElementById('mw-sharedupload') && document.getElementById('mw-imagepage-section-filehistory')) {
		Twinkle.stub.mode = wgULS('文件', '檔案');
	// article/draft article tagging
	} else if (((mw.config.get('wgNamespaceNumber') === 0 || mw.config.get('wgNamespaceNumber') === 118) && mw.config.get('wgCurRevisionId')) || (Morebits.pageNameNorm === Twinkle.getPref('sandboxPage'))) {
		Twinkle.stub.mode = wgULS('条目', '條目');
		Twinkle.addPortletLink(Twinkle.stub.callback, '小作品', 'friendly-tag', wgULS('标记小作品', '標記小作品'));
	}
};

Twinkle.stub.callback = function friendlytagCallback() {
	var Window = new Morebits.simpleWindow(630, Twinkle.stub.mode === 'article' ? 450 : 400);
	Window.setScriptName('Twinkle');
	Window.addFooterLink('小作品說明', 'Wikipedia:小作品');
	Window.addFooterLink(wgULS('小作品设置', '小作品設定'), 'WP:TW/PREF#stub');
	Window.addFooterLink(wgULS('Twinkle帮助', 'Twinkle說明'), 'WP:TW/DOC#stub');

	var form = new Morebits.quickForm(Twinkle.stub.callback.evaluate);

	if (document.getElementsByClassName('patrollink').length) {
		form.append({
			type: 'checkbox',
			list: [
				{
					label: wgULS('标记页面为已巡查', '標記頁面為已巡查'),
					value: 'patrolPage',
					name: 'patrolPage',
					checked: Twinkle.getPref('markStubbedPagesAsPatrolled')
				}
			]
		});
	}

	switch (Twinkle.stub.mode) {
		case '條目':
		case '条目':
			Window.setTitle(wgULS('条目小作品标记', '條目小作品標記'));

			form.append({
				type: 'select',
				name: 'sortorder',
				label: wgULS('查看列表：', '檢視列表：'),
				tooltip: wgULS('您可以在Twinkle参数设置（WP:TWPREFS）中更改此项。', '您可以在Twinkle偏好設定（WP:TWPREFS）中更改此項。'),
				event: Twinkle.stub.updateSortOrder,
				list: [
					{ type: 'option', value: 'cat', label: wgULS('按类型', '按類別'), selected: Twinkle.getPref('stubArticleSortOrder') === 'cat' },
					{ type: 'option', value: 'alpha', label: '按字母', selected: Twinkle.getPref('stubArticleSortOrder') === 'alpha' }
				]
			});

			form.append({ type: 'div', id: 'tagWorkArea' });
			break;

		default:
			alert('Twinkle.stub：未知模式 ' + Twinkle.stub.mode);
			break;
	}

	form.append({ type: 'submit' });

	var result = form.render();
	Window.setContent(result);
	Window.display();

	if (Twinkle.stub.mode === '条目' || Twinkle.stub.mode === '條目') {
		// fake a change event on the sort dropdown, to initialize the tag list
		var evt = document.createEvent('Event');
		evt.initEvent('change', true, true);
		result.sortorder.dispatchEvent(evt);
	}
};

Twinkle.stub.checkedTags = [];

Twinkle.stub.updateSortOrder = function(e) {
	var sortorder = e.target.value;

	Twinkle.stub.checkedTags = e.target.form.getChecked('articleTags');
	if (!Twinkle.stub.checkedTags) {
		Twinkle.stub.checkedTags = [];
	}

	var container = new Morebits.quickForm.element({ type: 'fragment' });

	// function to generate a checkbox, with appropriate subgroup if needed
	var makeCheckbox = function(tag, description) {
		var checkbox = { value: tag, label: '{{' + tag + '}}: ' + description };
		if (Twinkle.stub.checkedTags.indexOf(tag) !== -1) {
			checkbox.checked = true;
		}

		return checkbox;
	};

	// append any custom tags
	if (Twinkle.getPref('customStubList').length) {
		container.append({ type: 'header', label: wgULS('自定义模板', '自訂模板') });
		var customcheckboxes = [];
		$.each(Twinkle.getPref('customStubList'), function(_, item) {
			customcheckboxes.push(makeCheckbox(item.value, item.label));
		});
		container.append({
			type: 'checkbox',
			name: 'articleTags',
			list: customcheckboxes
		});
	}

	// categorical sort order
	if (sortorder === 'cat') {
		// function to iterate through the tags and create a checkbox for each one
		var doCategoryCheckboxes = function(subdiv, array) {
			var checkboxes = [];
			$.each(array, function(k, tag) {
				var description = Twinkle.stub.article.tags[tag];
				checkboxes.push(makeCheckbox(tag, description));
			});
			subdiv.append({
				type: 'checkbox',
				name: 'articleTags',
				list: checkboxes
			});
		};

		var i = 0;
		// go through each category and sub-category and append lists of checkboxes
		$.each(Twinkle.stub.article.tagCategories, function(title, content) {
			container.append({ type: 'header', id: 'tagHeader' + i, label: title });
			var subdiv = container.append({ type: 'div', id: 'tagSubdiv' + i++ });
			if ($.isArray(content)) {
				doCategoryCheckboxes(subdiv, content);
			} else {
				$.each(content, function(subtitle, subcontent) {
					subdiv.append({ type: 'div', label: [Morebits.htmlNode('b', subtitle)] });
					doCategoryCheckboxes(subdiv, subcontent);
				});
			}
		});
	// alphabetical sort order
	} else {
		var checkboxes = [];
		$.each(Twinkle.stub.article.tags, function(tag, description) {
			checkboxes.push(makeCheckbox(tag, description));
		});
		container.append({
			type: 'checkbox',
			name: 'articleTags',
			list: checkboxes
		});
	}

	var $workarea = $(e.target.form).find('div#tagWorkArea');
	var rendered = container.render();
	$workarea.empty().append(rendered);

	// style adjustments
	$workarea.find('h5').css({ 'font-size': '110%' });
	$workarea.find('h5:not(:first-child)').css({ 'margin-top': '1em' });
	$workarea.find('div').filter(':has(span.quickformDescription)').css({ 'margin-top': '0.4em' });

	// add a link to each template's description page
	$.each(Morebits.quickForm.getElements(e.target.form, 'articleTags'), function(index, checkbox) {
		var $checkbox = $(checkbox);
		var link = Morebits.htmlNode('a', '>');
		link.setAttribute('class', 'tag-template-link');
		link.setAttribute('href', mw.util.getUrl('Template:' +
			Morebits.string.toUpperCaseFirstChar(checkbox.values)));
		link.setAttribute('target', '_blank');
		$checkbox.parent().append(['\u00A0', link]);
	});
};


// Tags for ARTICLES start here

Twinkle.stub.article = {};

// A list of all article tags, in alphabetical order
// To ensure tags appear in the default "categorized" view, add them to the tagCategories hash below.

Twinkle.stub.article.tags = {
	'actor-stub': wgULS('演员', '演員'),
	'asia-stub': wgULS('亚洲', '亞洲'),
	'bio-stub': '人物',
	'biology-stub': wgULS('生物学', '生物學'),
	'chem-stub': wgULS('化学', '化學'),
	'europe-stub': wgULS('欧洲', '歐洲'),
	'expand list': '未完成列表',
	'food-stub': '食物',
	'france-geo-stub': wgULS('法国地理', '法國地理'),
	'geo-stub': '地理位置',
	'hist-stub': wgULS('历史或历史学', '歷史或歷史學'),
	'JP-stub': '日本',
	'lit-stub': wgULS('文学', '文學'),
	'math-stub': wgULS('数学', '數學'),
	'med-stub': wgULS('医学', '醫學'),
	'mil-stub': wgULS('军事', '軍事'),
	'movie-stub': wgULS('电影', '電影'),
	'music-stub': wgULS('音乐', '音樂'),
	'physics-stub': wgULS('物理学', '物理學'),
	'politic-stub': '政治',
	'religion-stub': '宗教',
	'science-stub': wgULS('科学', '科學'),
	'sport-stub': wgULS('体育', '體育'),
	'stub': '通用小作品',
	'switzerland-stub': '瑞士',
	'tech-stub': '科技',
	'transp-stub': '交通',
	'TV-stub': wgULS('电视', '電視'),
	'UK-stub': wgULS('英国', '英國'),
	'US-bio-stub': wgULS('美国人物', '美國人物'),
	'US-geo-stub': wgULS('美国地理', '美國地理'),
	'US-stub': wgULS('美国', '美國'),
	'weather-stub': wgULS('天气和特别的天气事件', '天氣和特別的天氣事件')
};

// A list of tags in order of category
// Tags should be in alphabetical order within the categories
// Add new categories with discretion - the list is long enough as is!

/* eslint-disable quote-props */
Twinkle.stub.article.tagCategories = {
	'通用模板': [
		'stub',
		'expand list'
	],
	[wgULS('国家和地理', '國家和地理')]: [
		'asia-stub',
		'europe-stub',
		'france-geo-stub',
		'geo-stub',
		'JP-stub',
		'switzerland-stub',
		'UK-stub',
		'US-bio-stub',
		'US-geo-stub',
		'US-stub'
	],
	[wgULS('杂项', '雜項')]: [
		'food-stub',
		'hist-stub',
		'mil-stub',
		'politic-stub',
		'religion-stub',
		'transp-stub'
	],
	'人物': [
		'actor-stub',
		'bio-stub',
		'US-bio-stub'
	],
	[wgULS('科学', '科學')]: [
		'biology-stub',
		'chem-stub',
		'math-stub',
		'med-stub',
		'physics-stub',
		'science-stub',
		'weather-stub'
	],
	[wgULS('体育', '體育')]: [
		'sport-stub'
	],
	[wgULS('技术', '技術')]: [
		'tech-stub'
	],
	[wgULS('艺术', '藝術')]: [
		'actor-stub',
		'lit-stub',
		'movie-stub',
		'music-stub',
		'TV-stub'
	]
};
/* eslint-enable quote-props */

// Tags for REDIRECTS start here



Twinkle.stub.callbacks = {
	main: function(pageobj) {
		var params = pageobj.getCallbackParameters(),
			tagRe, summaryText = '加入',
			tags = [], groupableTags = [], i, totalTags;

		// Remove tags that become superfluous with this action
		var pageText = pageobj.getPageText();

		var addTag = function friendlytagAddTag(tagIndex, tagName) {

			pageText += '\n{{' + tagName + '}}';

			if (tagIndex > 0) {
				if (tagIndex === (totalTags - 1)) {
					summaryText += '和';
				} else if (tagIndex < (totalTags - 1)) {
					summaryText += '、';
				}
			}

			summaryText += '{{[[';
			summaryText += tagName.indexOf(':') !== -1 ? tagName : 'Template:' + tagName + '|' + tagName;
			summaryText += ']]}}';
		};

		// Check for preexisting tags and separate tags into groupable and non-groupable arrays
		for (i = 0; i < params.tags.length; i++) {
			tagRe = new RegExp('(\\{\\{' + params.tags[i] + '(\\||\\}\\}))', 'im');
			if (!tagRe.exec(pageText)) {
				tags = tags.concat(params.tags[i]);
			} else {
				Morebits.status.info(wgULS('信息', '資訊'), wgULS('在页面上找到{{' + params.tags[i] +
					'}}…跳过', '在頁面上找到{{' + params.tags[i] +
					'}}…跳過'));
			}
		}

		tags = tags.concat(groupableTags);

		tags.sort();
		totalTags = tags.length;
		$.each(tags, addTag);

		summaryText += wgULS('标记到', '標記到') + Twinkle.stub.mode;

		pageobj.setPageText(pageText);
		pageobj.setEditSummary(summaryText);
		pageobj.setWatchlist(Twinkle.getPref('watchStubbedPages'));
		pageobj.setMinorEdit(Twinkle.getPref('markStubbedPagesAsMinor'));
		pageobj.setCreateOption('nocreate');
		pageobj.save();

		if (params.patrol) {
			pageobj.patrol();
		}
	}
};

Twinkle.stub.callback.evaluate = function friendlytagCallbackEvaluate(e) {
	var form = e.target;
	var params = {};
	if (form.patrolPage) {
		params.patrol = form.patrolPage.checked;
	}

	switch (Twinkle.stub.mode) {
		case '條目':
		case '条目':
			params.tags = form.getChecked('articleTags');
			params.group = false;
			break;
		case '文件':
		case '檔案':
			params.tags = form.getChecked('imageTags');
			break;
		case '重定向':
			params.tags = form.getChecked('redirectTags');
			break;
		default:
			alert('Twinkle.stub：未知模式 ' + Twinkle.stub.mode);
			break;
	}

	if (!params.tags.length) {
		alert(wgULS('必须选择至少一个标记！', '必須選擇至少一個標記！'));
		return;
	}

	Morebits.simpleWindow.setButtonsEnabled(false);
	Morebits.status.init(form);

	Morebits.wiki.actionCompleted.redirect = mw.config.get('wgPageName');
	Morebits.wiki.actionCompleted.notice = wgULS('标记完成，在几秒内刷新页面', '標記完成，在幾秒內重新整理頁面');
	if (Twinkle.stub.mode === '重定向') {
		Morebits.wiki.actionCompleted.followRedirect = false;
	}

	var wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), wgULS('正在标记', '正在標記') + Twinkle.stub.mode);
	wikipedia_page.setCallbackParameters(params);
	switch (Twinkle.stub.mode) {
		case '條目':
		case '条目':
		/* falls through */
		case '重定向':
			wikipedia_page.load(Twinkle.stub.callbacks.main);
			return;
		case '文件':
		case '檔案':
			wikipedia_page.load(Twinkle.stub.callbacks.file);
			break;
		default:
			alert('Twinkle.stub：未知模式 ' + Twinkle.stub.mode);
			break;
	}
};

Twinkle.addInitCallback(Twinkle.stub, 'stub');
})(jQuery);


// </nowiki>
