# cordova-config-cli [![Build Status](https://travis-ci.org/ragingwind/cordova-config-cli.svg?branch=master)](https://travis-ci.org/ragingwind/cordova-config-cli)

> CLI tool for [cordova-config](https://github.com/SamVerschueren/cordova-config). It exports APIs of cordova-config to cli


## Install

```
$ npm install --save cordova-config-cli
```


## CLI

```
$ npm install --global cordova-config-cli
```

### Usage

```sh
$ cordova-config <actions> <config> <value> <options>
```

### Examples

```sh
$ cordova-config set name "New Name"
$ cordova-config set name "New Name" --config=../config.xml
$ cordova-config add hook after_prepare script/after_prepare.js --config=../config.xml
$ cordova-config rm access-origin "*" --config=../fixtures/config.xml
```

### Actions and configs

- set: name, desc, author, version, android-version, ios-version
- add: preference, access-origin, xml, hook
- rm: access-origin

### Values

See `cordova-config` [APIs](https://github.com/SamVerschueren/cordova-config#api) to find value signature of the method

### Options

- --config: **required**, **string**, path of config.xml if not set? use a current path for reading'

## License

MIT © [Jimmy Moon](http://ragingwind.me)
