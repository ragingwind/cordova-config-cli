'use strict';

import test from 'ava';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

test('should be set all of values coming over from cli', t => {
	shell.exec(sh('set name "New name"'));
	t.ok(matchup('<name>New name</name>'));

	shell.exec(sh('set desc "New desc"'));
	t.ok(matchup('<description>New desc</description>'));

	shell.exec(sh('set author "New name" new@email http://newwebsite.com'));
	t.ok(matchup('<author email="new@email" href="http://newwebsite.com">New name</author>'));

	shell.exec(sh('set version 1.0.0'));
	t.ok(matchup('version="1.0.0"'));

	shell.exec(sh('set android-version 23'));
	t.ok(matchup('android-versionCode="23"'));

	shell.exec(sh('set ios-version 1.0.0'));
	t.ok(matchup('ios-CFBundleVersion="1.0.0"'));

	shell.exec(sh('add preference new-name new-value'));
	t.ok(matchup('<preference name="new-name" value="new-value" />'));

	shell.exec(sh('add access-origin new-origin'));
	t.ok(matchup('<access origin="new-origin" />'));
	shell.exec(sh('add access-origin "**"'));
	t.ok(matchup('<access origin="\\*\\*" />'));

	shell.exec(sh('add access-origin remove-origin'));
	t.ok(matchup('<access origin="remove-origin" />'));
	shell.exec(sh('rm access-origin remove-origin'));
	t.ok(!matchup('<access origin="remove-origin" />'));

	shell.exec(sh('set id com.my.new.app'));
	t.ok(matchup('id="com.my.new.app"'));

	shell.exec(sh('add hook after_prepare script/after_prepare.js'));
	t.ok(matchup('<hook src="script/after_prepare.js" type="after_prepare" />'));
});
