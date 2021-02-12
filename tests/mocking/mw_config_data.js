// Includes only what's needed for morebits, util, and Title
mw.config.set({
	// Needed by Morebits
	pageTriageNamespaces: [0, 2, 118],
	wgArticleId: 18866,
	wgIsRedirect: false,
	wgPageName: 'Macbeth,_King_of_Scotland',
	wgRestrictionEdit: ['autoconfirmed'],
	wgUserGroups: ['interface-admin', 'oversight', 'patroller', 'sysop', '*', 'user', 'autoconfirmed'],
	wgUserName: 'Xiplus',

	// Needed by mw.util
	wgScript: '/w/index.php',
	wgArticlePath: '/wiki/$1',
	wgScriptPath: '/w',

	// Needed by mw.Title
	wgFormattedNamespaces: {
		'-1': 'Special',
		'-2': 'Media',
		0: '（條目）',
		1: 'Talk',
		2: 'User',
		3: 'User talk',
		4: 'Wikipedia',
		5: 'Wikipedia talk',
		6: 'File',
		7: 'File talk',
		8: 'MediaWiki',
		9: 'MediaWiki talk',
		10: 'Template',
		11: 'Template talk',
		12: 'Help',
		13: 'Help talk',
		14: 'Category',
		15: 'Category talk',
		100: 'Portal',
		101: 'Portal talk',
		102: 'WikiProject',
		103: 'WikiProject talk',
		118: 'Draft',
		119: 'Draft talk',
		828: 'Module',
		829: 'Module talk',
		2300: 'Gadget',
		2301: 'Gadget talk',
		2302: 'Gadget definition',
		2303: 'Gadget definition talk',
		2600: 'Topic'
	},
	wgNamespaceIds: {
		'media': -2,
		'special': -1,
		'': 0,
		'talk': 1,
		'user': 2,
		'user_talk': 3,
		'wikipedia': 4,
		'wikipedia_talk': 5,
		'file': 6,
		'file_talk': 7,
		'mediawiki': 8,
		'mediawiki_talk': 9,
		'template': 10,
		'template_talk': 11,
		'help': 12,
		'help_talk': 13,
		'category': 14,
		'category_talk': 15,
		'portal': 100,
		'portal_talk': 101,
		'wikiproject': 102,
		'wikiproject_talk': 103,
		'draft': 118,
		'draft_talk': 119,
		'module': 828,
		'module_talk': 829,
		'gadget': 2300,
		'gadget_talk': 2301,
		'gadget_definition': 2302,
		'gadget_definition_talk': 2303,
		'topic': 2600,
		'维基百科': 4,
		'維基百科': 4,
		'wp': 4,
		'维基百科讨论': 5,
		'维基百科对话': 5,
		'維基百科討論': 5,
		'維基百科對話': 5,
		't': 10,
		'wt': 5,
		'cat': 14,
		'h': 12,
		'p': 100,
		'草稿': 118,
		'u': 2,
		'ut': 3,
		'f': 6,
		'ft': 7,
		'主题': 100,
		'主题讨论': 101,
		'主題': 100,
		'主題討論': 101,
		'话题': 2600,
		'話題': 2600,
		'模块': 828,
		'模块讨论': 829,
		'模組': 828,
		'模組討論': 829,
		'專題': 102,
		'专题': 102,
		'維基專題': 102,
		'维基专题': 102,
		'pj': 102,
		'wpj': 102,
		'專題討論': 103,
		'专题讨论': 103,
		'專題對話': 103,
		'专题对话': 103,
		'維基專題討論': 103,
		'维基专题讨论': 103,
		'維基專題對話': 103,
		'维基专题对话': 103,
		'pjt': 103,
		'wpjt': 103,
		'媒体': -2,
		'媒體': -2,
		'特殊': -1,
		'对话': 1,
		'對話': 1,
		'讨论': 1,
		'討論': 1,
		'用户': 2,
		'用戶': 2,
		'用户对话': 3,
		'用戶對話': 3,
		'用户讨论': 3,
		'用戶討論': 3,
		'图像': 6,
		'圖像': 6,
		'档案': 6,
		'檔案': 6,
		'文件': 6,
		'图像对话': 7,
		'圖像對話': 7,
		'图像讨论': 7,
		'圖像討論': 7,
		'档案对话': 7,
		'檔案對話': 7,
		'档案讨论': 7,
		'檔案討論': 7,
		'文件对话': 7,
		'文件對話': 7,
		'文件讨论': 7,
		'文件討論': 7,
		'模板': 10,
		'样板': 10,
		'樣板': 10,
		'模板对话': 11,
		'模板對話': 11,
		'模板讨论': 11,
		'模板討論': 11,
		'样板对话': 11,
		'樣板對話': 11,
		'样板讨论': 11,
		'樣板討論': 11,
		'帮助': 12,
		'幫助': 12,
		'帮助对话': 13,
		'幫助對話': 13,
		'帮助讨论': 13,
		'幫助討論': 13,
		'分类': 14,
		'分類': 14,
		'分类对话': 15,
		'分類對話': 15,
		'分类讨论': 15,
		'分類討論': 15,
		'image': 6,
		'image_talk': 7,
		'媒体文件': -2,
		'mediawiki讨论': 9,
		'草稿讨论': 119,
		'模组': 828,
		'模组讨论': 829,
		'gadget talk': 2301,
		'gadget definition': 2302,
		'gadget definition talk': 2303,
		'mediawiki討論': 9,
		'草稿討論': 119,
		'使用者': 2,
		'使用者討論': 3,
		'使用說明': 12,
		'使用說明討論': 13,
		'project': 4,
		'project_talk': 5
	},
	wgCaseSensitiveNamespaces: []
});