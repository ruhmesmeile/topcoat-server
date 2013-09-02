/*
 * Creates Telemetry benchmarks for all components
 */

module.exports = function (grunt) {
	'use strict';

	var exec = require('child_process').exec,
		path = require('path'),
		jade = require('jade');

	/**
	 * Initializer for newest `config.json` build process
	 */
	function initConfigJson(dir, sass, scripts, done) {
		grunt.file.write(path.join(dir, 'config.json'), JSON.stringify({
			sass: sass,
			scripts: scripts,
			jquery: true,
			ie: []
		}, null, 2));

		// simulate exec call
		done(null, '', '');
	}

	/**
	 * Initializer for older `init.js` build process
	 */
	function initJs(dir, sass, scripts, done) {
		var args = ['ie:none'], i,
			cmd = './init.js components';

		for (i = 0; i < sass.length; i++) {
			args.push('sass:' + sass[i]);
		}

		if (scripts.length > 0) {
			for (i = 0; i < scripts.length; i++) {
				args.push('js:' + scripts[i]);
			}
		} else {
			args.push('js:none');
		}

		cmd = cmd + ' ' + args.join(' ');

		grunt.log.subhead('Running ' + cmd);
		exec(cmd, {cwd: dir}, done);
	}

	/**
	 * Initializer for oldest yeoman build process
	 */
	function initYeoman(dir, sass, scripts, done) {
		var args = ['ie:none'], i,
			cmd = 'yes | yeoman init dtag:components';

		for (i = 0; i < sass.length; i++) {
			args.push('sass:' + sass[i]);
		}

		if (scripts.length > 0) {
			for (i = 0; i < scripts.length; i++) {
				args.push('js:' + scripts[i]);
			}
		} else {
			args.push('js:none');
		}

		cmd = cmd + ' ' + args.join(' ');

		grunt.log.subhead('Running ' + cmd)
		exec(cmd, {cwd: dir}, done);
	}

	/**
	 * Detects build process style and returns matching init function
	 */
	function detectInit(dir) {
		if (grunt.file.exists(path.join(dir, 'lib/generators'))) {
			grunt.log.writeln('Detected yeoman style initializer');
			return initYeoman;
		} else if (grunt.file.exists(path.join(dir, 'init.js'))) {
			grunt.log.writeln('Detected init.js style initializer');
			return initJs;
		} else {
			var pkg = grunt.file.readJSON(path.join(dir, 'package.json'));
			if (pkg.config && pkg.config.sass && pkg.config.sass.length > 0) {
				grunt.log.writeln('Detected config.json style initializer');
				return initConfigJson;
			}
		}
		grunt.log.error('Unknown build process or wrong toolbox directory');
	}

	grunt.registerMultiTask('testcase_build',
		'Build DTAG Components Testcases',
		function () {
			var options = this.options(),
				src = options.src,
				dest = options.dest,
				sass = options.sass,
				scripts = options.scripts,
				html = options.html,
				testcase = this.target,
				done = this.async(),
				init, json;

			grunt.log.writeflags(options, 'Options');

			init = detectInit(src);

			init(src, sass, scripts,
				function (error, stdout, stderr) {
					if (error) {
						grunt.log.error(error);
						done();
					}
					grunt.log.writeln(stdout);

					// run grunt
					// @TODO: evaluate use of grunt-hub here
					exec('grunt components', {cwd: src},
						function (error, stdout, stderr) {
							var srcFile, requireScript = false;

							if (error) {
								grunt.log.error(error);
								done();
							}

							grunt.log.writeln(stdout);

							// copy files

							[
								src + '/build/components/dist/stylesheets/components.css',
								src + '/build/components/dist/stylesheets/components.min.css',
								src + '/dist/stylesheets/components.css',
								src + '/dist/stylesheets/components.min.css'
							].forEach(function (filepath) {
								if (grunt.file.exists(filepath)) {
									srcFile = filepath;
								}
							});

							if (!srcFile) {
								grunt.log.error('No CSS file found. Aborting.');
								return false;
							}

							grunt.log.writeln('Using', srcFile);
							grunt.file.copy(srcFile,
								dest + '/stylesheets/' + testcase + '.css');

							if (scripts.length > 0) {
								srcFile = false;

								[
									src + '/build/components/dist/scripts/main.js',
									src + '/build/components/dist/scripts/main.min.js',
									src + '/dist/scripts/main.js',
									src + '/dist/scripts/main.min.js',
									src + '/dist/scripts/dtag.js',
									src + '/dist/scripts/dtag.min.js'
								].forEach(function (filepath) {
									if (grunt.file.exists(filepath)) {
										srcFile = filepath;
									}
								});

								if (!srcFile) {
									grunt.log.error('No JS file found. Aborting.');
									return false;
								}

								if (!srcFile.match(/dtag/)) {
									requireScript = true;
								}

								grunt.log.writeln('Using', srcFile);
								grunt.file.copy(srcFile,
									dest + '/scripts/' + testcase + '.js');
							}

							// create templates

							grunt.file.write(
								dest + '/' + testcase + '-nojs.html',
								jade.renderFile('views/testcase-nojs.jade', {
									title: 'Test: ' + testcase,
									stylesheet: 'stylesheets/' + testcase + '.css',
									component: html
								}));

							grunt.file.write(
								dest + '/' + testcase + '-nojs.json',
								JSON.stringify({
									description: 'Test: ' + testcase,
									pages: [
										{
											url: 'file:///' + testcase + '-nojs.html',
											smoothness: {
												action: 'scroll'
											}
										}
									]
								}));

							if (scripts.length > 0) {
								grunt.file.write(
									dest + '/' + testcase + '-js.html',
									jade.renderFile('views/testcase-js.jade', {
										title: 'Test: ' + testcase,
										stylesheet: 'stylesheets/' + testcase + '.css',
										component: html,
										script: 'scripts/' + testcase + '.js',
										requireScript: requireScript
									}));

								grunt.file.write(
									dest + '/' + testcase + '-js.json',
									JSON.stringify({
										description: 'Test: ' + testcase,
										pages: [
											{
												url: 'file:///' + testcase + '-nojs.html',
												smoothness: {
													action: 'scroll'
												}
											}
										]
									}));
							}

							// get commit SHA and modify testcase_submit config
							exec('git log -1 --pretty=format:"%H %ci"', {cwd: src},
								function(error, stdout, stderr) {
									if (error) {
										// silently ignore
										done();
									}

									grunt.config('testcase_submit.options.name',
										stdout);
									done();
								});

						}); // exec
				}); // init
		}); //registerTask

};
