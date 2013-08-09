/*
 * Prepare task configuration of
 * testcase_build, testcase_run, and testcase_submit
 */

/*global module*/

module.exports = function (grunt) {
	'use strict';

	// add test cases from config to task configuration
	grunt.registerTask('testcase_build_prepare', 'Prepare `testcase_build`',
		function () {
			var options = this.options({
					target: 'testcase_build',
					testcases: []
				});

			grunt.util._.each(options.testcases,
				function (data, name) {
					grunt.config([options.target, name, 'options'], data);
					grunt.log.writeln('Added ' + options.target + ':' + name);
				});
		});

	// prepare multitask from filenames
	grunt.registerMultiTask('testcase_prepare',
		'Scans pagesets and creates `testcase_run` and ' +
		'`testcase_submit` configuration',
		function() {
			var path = require('path'),
				options = this.options(),
				configname = options.configname || this.target,
				pagesets = options.pagesets,
				ext = options.ext;

			grunt.log.writeln('Configuring ' + configname);

			this.filesSrc.forEach(function (filepath) {
				var name = path.basename(filepath, ext);
				grunt.config([configname, name], [filepath]);
				grunt.log.writeln('Added ' + configname + ':' + name);
			});
		});

};
