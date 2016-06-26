#!/usr/bin/env node
'use strict';

const meow = require('meow');
const CordovaConfig = require('cordova-config');

const cli = meow({
	help: [`
		Usage
		  $ cordova-config <actions> <config> <value> <options>

		Examples
		  $ cordova-config set name "New Name"
		  $ cordova-config set name "New Name" --config=../config.xml
		  $ cordova-config add hook after_prepare script/after_prepare.js --config=../config.xml
		  $ cordova-config rm access-origin "*" --config=../fixtures/config.xml

		Actions and config
		  set: name desc author version android-version ios-version
		  add: preference access-origin xml hook
		  rm: access-origin

		Values
		  See 'cordova-config' to find value signature of the method

		Options
		  --config: path of config.xml if not set? use a current path for reading
	`]
});

const COMMANDS = {
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
	const config = new CordovaConfig(cli.flags.config || './config.xml');
	const command = config[COMMANDS[cli.input.shift() + '-' + cli.input.shift()]];
	const args = cli.input;

	if (!command) {
		throw new Error('Unknown command');
	}

	// apply value to config
	command.apply(config, args);

	// write config.xml
	config.writeSync();
} catch (err) {
	console.error(err);
	cli.showHelp(-1);
}
