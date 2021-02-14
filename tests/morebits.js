QUnit.module('constants');
QUnit.test('userIsSysop', assert => {
	assert.true(Morebits.userIsSysop, 'Is sysop');
});
QUnit.test('pageNameNorm', assert => {
	assert.strictEqual(Morebits.pageNameNorm, 'Macbeth, King of Scotland', 'Normalized page title');
});

QUnit.module('methods');
QUnit.test('userIsInGroup', assert => {
	assert.true(Morebits.userIsInGroup('sysop'), 'Sysop');
	assert.true(Morebits.userIsInGroup('interface-admin'), 'Int-Admin');
	assert.false(Morebits.userIsInGroup('Founder'), 'Founder');
});

QUnit.test('pageNameRegex', assert => {
	assert.strictEqual(Morebits.pageNameRegex(mw.config.get('wgPageName')), '[Mm]acbeth,[_ ]King[_ ]of[_ ]Scotland', 'First character and spaces');
	assert.strictEqual(Morebits.pageNameRegex(''), '', 'Empty');
	assert.strictEqual(Morebits.pageNameRegex('a'), '[Aa]', 'Single character');
	assert.strictEqual(Morebits.pageNameRegex('#'), '#', 'Single same-case');
	assert.strictEqual(Morebits.pageNameRegex('*$, \{}(a) |.?+-^ [ ]'), '\\*\\$,[_ ]\\{\\}\\(a\\)[_ ]\\|\\.\\?\\+\\-\\^\[_ ]\\[[_ ]\\]', 'Special characters');
});
QUnit.test('namespaceRegex', assert => {
	assert.strictEqual(Morebits.namespaceRegex([6]), '(?:[Ff][Ii][Ll][Ee]|[Ff]|图像|圖像|档案|檔案|文件|[Ii][Mm][Aa][Gg][Ee])', 'Files');
	assert.strictEqual(Morebits.namespaceRegex(10), '(?:[Tt][Ee][Mm][Pp][Ll][Aa][Tt][Ee]|[Tt]|模板|样板|樣板)', 'Non-array singlet');
	assert.strictEqual(Morebits.namespaceRegex([4, 5]), '(?:[Ww][Ii][Kk][Ii][Pp][Ee][Dd][Ii][Aa]|[Ww][Ii][Kk][Ii][Pp][Ee][Dd][Ii][Aa][_ ][Tt][Aa][Ll][Kk]|维基百科|維基百科|[Ww][Pp]|维基百科讨论|维基百科对话|維基百科討論|維基百科對話|[Ww][Tt]|[Pp][Rr][Oo][Jj][Ee][Cc][Tt]|[Pp][Rr][Oo][Jj][Ee][Cc][Tt][_ ][Tt][Aa][Ll][Kk])', 'Project and project talk');
	assert.strictEqual(Morebits.namespaceRegex(0), '', 'Main');
	assert.strictEqual(Morebits.namespaceRegex(), '', 'Empty');
});

QUnit.test('isPageRedirect', assert => {
	assert.false(Morebits.isPageRedirect(), 'Is redirect');
});
