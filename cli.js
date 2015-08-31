#!/usr/bin/env node
'use strict';

var meow = require('meow');
var CordovaConfig = require('cordova-config');

var cli = meow({
	help: [
		'Usage',
		'  $ cordova-config <actions> <config> <value> <options>',
		'',
		'Examples',
		'  $ cordova-config set name "New Name"',
		'  $ cordova-config set name "New Name" --config=../config.xml',
		'  $ cordova-config add hook after_prepare script/after_prepare.js --config=../config.xml',
		'  $ cordova-config rm access-origin "*" --config=../fixtures/config.xml',
		'',
		'Actions and config',
		'  set: name, desc, author, version, android-version, ios-version',
		'  add: preference, access-origin, xml, hook',
		'  rm: access-origin',
		'',
		'Values',
		'  See `cordova-config` to find value signature of the method',
		'',
		'Options',
		'  --config: path of config.xml if not set? use a current path for reading'
	]
});

var COMMANDS = {
	'set-name': 'setName',
	'set-desc': 'setDescription',
	'set-author': 'setAuthor',
	'set-version': 'setVersion',
	'set-android-version': 'setAndroidVersionCode',
	'set-ios-version': 'setIOSBundleVersion',
	'add-preference': 'setPreference',
	'add-access-origin': 'setAccessOrigin',
	'rm-access-origin': 'removeAccessOrigin',
	'add-xml': 'addRawXML',
	'set-id': 'setID',
	'add-hook': 'addHook'
};
	
try {
	var config = new CordovaConfig(cli.flags.config || './config.xml');
	var command = config[COMMANDS[cli.input.shift() + '-' + cli.input.shift()]];
	var args = cli.input;
	
	if (!command) {
		throw new Error('Unknown command');
	}

	// apply value to config
	command.apply(config, args);
	
	// write config.xml
	config.writeSync();
} catch (e) {
	console.error(e);
	process.exit(-1);
}