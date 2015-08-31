'use strict';

var assert = require('assert');
var shell = require('shelljs');
var cpy = require('cpy');
var fs = require('fs');

function matchup (exp) {
  return fs.readFileSync('./.tmp/config.xml').toString().match(new RegExp(exp)) !== null;
}

function sh (commands) {
	return [['node ./cli.js', commands, '--config=./.tmp/config.xml'].join(' ')];
}

beforeEach(function (done) {
	cpy(['./fixtures/config.xml'], '.tmp', done);
});

it('should be set all of values coming over from cli', function () {
	shell.exec(sh('set name "New name"'));
	assert(matchup('<name>New name</name>'));
	
	shell.exec(sh('set desc "New desc"'));
	assert(matchup('<description>New desc</description>'));
	
	shell.exec(sh('set author "New name" new@email http://newwebsite.com'));
	assert(matchup('<author email="new@email" href="http://newwebsite.com">New name</author>'));

	shell.exec(sh('set version 1.0.0'));
	assert(matchup('version="1.0.0"'));
	
	shell.exec(sh('set android-version 23'));
	assert(matchup('android-versionCode="23"'));
	
	shell.exec(sh('set ios-version 1.0.0'));
	assert(matchup('ios-CFBundleVersion="1.0.0"'));
	
	shell.exec(sh('add preference new-name new-value'));
	assert(matchup('<preference name="new-name" value="new-value" />'));
	
	shell.exec(sh('add access-origin new-origin'));
	assert(matchup('<access origin="new-origin" />'));
	shell.exec(sh('add access-origin "**"'));
	assert(matchup('<access origin="\\*\\*" />'));
	
	shell.exec(sh('add access-origin remove-origin'));
	assert(matchup('<access origin="remove-origin" />'));
	shell.exec(sh('rm access-origin remove-origin'));
	assert(!matchup('<access origin="remove-origin" />'));
	
	shell.exec(sh('set id com.my.new.app'));
	assert(matchup('id="com.my.new.app"'));
	
	shell.exec(sh('add hook after_prepare script/after_prepare.js'));
	assert(matchup('<hook src="script/after_prepare.js" type="after_prepare" />'));
});
