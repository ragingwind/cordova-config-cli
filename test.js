'use strict';

import fs from 'fs';
import path from 'path';
import os from 'os';
import test from 'ava';
import execa from 'execa';

const tmp = path.join(os.tmpdir(), 'config.xml');

function matchup(exp) {
	return fs.readFileSync(tmp).toString().match(new RegExp(exp)) !== null;
}

function sh(commands) {
	return [['node ./cli.js', commands, '--config=' + tmp].join(' ')];
}

test.cb.before(t => {
	fs.createReadStream('./fixtures/config.xml').pipe(fs.createWriteStream(tmp).on('close', () => {
		t.end();
	}));
});

test('should be set all of values coming over from cli', async t => {
	await execa.shell(sh('set name "New name"'));
	t.true(matchup('<name>New name</name>'));

	await execa.shell(sh('set desc "New desc"'));
	t.true(matchup('<description>New desc</description>'));

	await execa.shell(sh('set author "New name" new@email http://newwebsite.com'));
	t.true(matchup('<author email="new@email" href="http://newwebsite.com">New name</author>'));

	await execa.shell(sh('set version 1.0.0'));
	t.true(matchup('version="1.0.0"'));

	await execa.shell(sh('set android-version 23'));
	t.true(matchup('android-versionCode="23"'));

	await execa.shell(sh('set ios-version 1.0.0'));
	t.true(matchup('ios-CFBundleVersion="1.0.0"'));

	await execa.shell(sh('add preference new-name new-value'));
	t.true(matchup('<preference name="new-name" value="new-value" />'));

	await execa.shell(sh('add access-origin new-origin'));
	t.true(matchup('<access origin="new-origin" />'));
	await execa.shell(sh('add access-origin "**"'));
	t.true(matchup('<access origin="\\*\\*" />'));

	await execa.shell(sh('add access-origin remove-origin'));
	t.true(matchup('<access origin="remove-origin" />'));
	await execa.shell(sh('rm access-origin remove-origin'));
	t.true(!matchup('<access origin="remove-origin" />'));

	await execa.shell(sh('set id com.my.new.app'));
	t.true(matchup('id="com.my.new.app"'));

	await execa.shell(sh('add hook after_prepare script/after_prepare.js'));
	t.true(matchup('<hook src="script/after_prepare.js" type="after_prepare" />'));
});
