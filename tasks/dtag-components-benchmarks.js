/*
 * Creates and executes Telemetry benchmarks for all components
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

	grunt.registerMultiTask('testcase_prepare',
		'Initialize DTAG Components Testcases',
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
					exec('grunt components', {cwd: src},
						function (error, stdout, stderr) {
						if (error) {
							grunt.log.error(error);
							done();
						}

						// copy files

						grunt.file.copy(
							src + '/dist/stylesheets/components.min.css',
							dest + '/stylesheets/' + testcase + '.css');

						if (scripts.length > 0) {
							grunt.file.copy(
								src + '/dist/scripts/main.js',
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

						json = {
							description: 'Test: ' + testcase,
							pages: [
								{
									url: 'file:///' + testcase + '-nojs.html',
									smoothness: {
										action: 'scroll'
									}
								}
							]
						};

						if (scripts.length > 0) {
							grunt.file.write(
								dest + '/' + testcase + '-js.html',
								jade.renderFile('views/testcase-js.jade', {
									title: 'Test: ' + testcase,
									stylesheet: 'stylesheets/' + testcase + '.css',
									component: html,
									script: 'scripts/' + testcase + '.js'
								}));

							json.pages.push({
								url: 'file:///' + testcase + '-js.html',
								smoothness: {
									action: 'scroll'
								}
							});
						}

						grunt.file.write(
							dest + '/' + testcase + '.json',
							JSON.stringify(json, null, 2));

						done();
					}); // exec
				}); // init
		}); //registerTask

	grunt.registerMultiTask('testcase_run',
		'Run Telemetry benchmark on DTAG Components',
		function() {
			var options = this.options(),
				testcase = this.target,
				perf_dir = options.perf_dir,
				perf_tool = options.perf_tool || 'run_multipage_benchmarks',
				pagesets = options.pagesets,
				relative = path.relative(perf_dir, pagesets),
				done = this.async();

			grunt.log.writeflags(options, 'Options');

			exec('./' + perf_tool + ' ' +
				'--browser=system loading_benchmark ' +
				relative + '/' + testcase + '.json',
				{ cwd: perf_dir },
				function (error, stdout, stderr) {
					if (error) {
						grunt.log.error(error);
						done();
					}

					exec('./' + perf_tool + ' ' +
						'--browser=system smoothness_benchmark ' +
						relative + '/' + testcase + '.json',
						{ cwd: perf_dir },
						function (error, stdout, stderr) {
							if (error) {
								grunt.log.error(error);
								done();
							}

							grunt.log.writeln(stdout);
							done();
						});
				});
		});

};
