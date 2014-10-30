#!/usr/bin/env node

/**
 * Remove plugins from cordovaPlugins array after_plugin_rm
 */
var fs = require('fs');
var _ = require('../../../ops/node_modules/lodash');
var packageJSON = require('../../../ops/package.json');

packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];
_.each(process.env.CORDOVA_PLUGINS.split(','), function (plugin) {
  _.remove(packageJSON.cordovaPlugins, function (p) { return p === plugin; });
});

fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2));
