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
	function initConfigJson(components, scripts, done) {
		grunt.file.write('config.json', JSON.stringify({
			sass: components,
			js: scripts,
			jquery: true,
			ie: []
		}));
		done(null, '', '');
	}

	/**
	 * Initializer for older `init.js` build process
	 */
	function initJs(components, scripts, done) {
		var args = ['ie:none'], i,
			cmd = './init.js components';

		for (i = 0; i < components.length; i++) {
			args.push('sass:' + components[i]);
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
		exec(cmd, done);
	}

	/**
	 * Initializer for oldest yeoman build process
	 */
	function initYeoman(components, scripts, done) {
		var args = ['ie:none'], i,
			cmd = 'yes | yeoman init dtag:components';

		for (i = 0; i < components.length; i++) {
			args.push('sass:' + components[i]);
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
		exec(cmd, done);
	}

	/**
	 * Detects build process style and returns matching init function
	 */
	function detectInit() {
		if (grunt.file.exists('lib/generators')) {
			grunt.log.writeln('Detected yeoman style initializer');
			return initYeoman;
		} else if (grunt.file.exists('init.js')) {
			grunt.log.writeln('Detected init.js style initializer');
			return initJs;
		} else {
			var pkg = grunt.file.readJSON('package.json');
			if (pkg.config && pkg.config.sass && pkg.config.sass.length > 0) {
				grunt.log.writeln('Detected config.json style initializer');
				return initConfigJson;
			}
		}
		grunt.log.error('Unknown build process or wrong folder');
	}

	grunt.registerTask('dtag_init', 'Initialize DTAG Components',
		function () {
			var options = this.options(),
				cwd = process.cwd(),
				done = this.async(),
				init;

			process.chdir(options.toolbox);

			init = detectInit();

			init(['buttons'], [], function (error, stdout, stderr) {
				if (error) {
					grunt.log.error('Error');
					console.log(error);
					process.chdir(cwd);
					done();
				}
				console.log(stdout);
				process.chdir(cwd);
				done();
			});
		});

	grunt.registerTask('dtag_build', 'Build DTAG Components',
		function () {
			var options = this.options(),
				cwd = process.cwd(),
				done = this.async();

			process.chdir(options.toolbox);

			// run grunt
			exec('grunt components', function (error, stdout, stderr) {
				if (error) {
					grunt.log.error('Error');
					console.log(error);
					process.chdir(cwd);
					done();
				}

				process.chdir(cwd);

				// copy files
				grunt.config('copy.dtag_build', {
					files: {
						'<%= pagesets %>/stylesheets/buttons.css':
							'<%= config.toolbox %>/' +
								'dist/stylesheets/components.min.css',
					}
				});
				grunt.task.run('copy:assets');
				grunt.task.run('copy:dtag_build');

				grunt.file.write(grunt.config('pagesets')+ '/buttons.html',
					jade.renderFile('views/testcase-nojs.jade', {
						title: 'Buttons Test',
						stylesheet: 'stylesheets/buttons.css',
						component: '<button class="button">Button</button>'
					}));

				grunt.file.write(grunt.config('pagesets') + '/buttons.json',
					JSON.stringify({
						description: 'Buttons Test',
						pages: [
							{
								url: 'file:///buttons.html',
								smoothness: {
									action: 'scrolling_action'
								}
							}
						]
					}));

				done();
			})
		});

	grunt.registerTask('dtag_benchmark',
		'Run Telemetry benchmark on DTAG Components',
		function() {
			var options = this.options(),
				done = this.async();

			exec('./run_multipage_benchmarks ' +
				'--browser=system loading_benchmark ' +
				path.relative(grunt.config('perf'), grunt.config('pagesets')) +
				'/buttons.json',
				{ cwd: grunt.config('perf') },
				function (error, stdout, stderr) {
					if (error) {
						grunt.log.error('Error');
						console.log(error);
						done();
					}

					grunt.log.writeln(stdout);
					done();
				});
		});

};
