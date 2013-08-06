/*
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*global module:false, require:false, process:false*/


module.exports = function(grunt) {
	'use strict';

	var config = grunt.file.readJSON('package.json').config;

	if (grunt.file.exists('config.json')) {
		grunt.util._.extend(config, grunt.file.readJSON('config.json'));
	}

	grunt.initConfig({
		config: config,
		pagesets: 'page_sets',
		testcase_prepare: {
			options: {
				src: '<%= config["toolbox-path"] %>',
				dest: '<%= pagesets %>'
			}
			// actual cases will be added below from config
		},
		testcase_run: {
			options: {
				perf_dir: '<%= config.perf.path %>',
				perf_tool: '<%= config.perf.tool %>',
				pagesets: '<%= pagesets %>'
			}
		},
		testcase_submit: {
			options: {
				host: '<%= config.server.host %>',
				port: '<%= config.server.port %>',
				commit: 'snapshot',
				device: 'browser'
			},
			buttons: 'page_sets/buttons.out',
			checkboxes: 'page_sets/checkboxes.out'
		},
		copy: {
			assets: {
				files: [{
					expand: true,
					src: [
						'fonts/**',
						'images/**',
						'scripts/require-jquery.min.js'
					],
					dest: '<%= pagesets %>/',
					cwd: '<%= config["toolbox-path"] %>/dist/'
				}]
			}
		},
		clean: {
			page_sets: '<%= pagesets %>'
		},
		hub: {
			clean: {
				src: '<%= config["toolbox-path"] %>/Gruntfile.js',
				tasks: ['clean-all']
			},
			components: {
				src: '<%= hub.clean.src %>',
				tasks: ['components']
			}
		}
	});

	// add test cases from config to task configuration
	grunt.util._.each(grunt.config('config.testcases'),
		function (data, name) {
			grunt.config(['testcase_prepare', name, 'options'], data);
			grunt.log.writeln('Added testcase_prepare:' + name);
	});

	// detect and add actual tests
	var path = require('path'),
		tests = grunt.file.expand(
		grunt.config('pagesets') + '/*.json'
	).map(function (filepath) {
		return path.basename(filepath, '.json')
	}).forEach(function (name) {
		grunt.config(['testcase_run', name], {});
		grunt.log.writeln('Added testcase_run:' + name);
	});

	//Load local tasks
	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-hub');

	grunt.registerTask('build', ['clean:page_sets', 'testcase_prepare', 'copy:assets']);

	grunt.registerTask('clean-all', ['clean', 'hub:clean']);

	// grunt.registerTask('default', '', function(platform, theme) {
	//	 if (chromiumSrc === "") grunt.fail.warn("Set CHROMIUM_SRC to point to the correct location\n");
	//	 grunt.task.run('check_chromium_src', 'perf:'.concat(platform || 'mobile').concat(':').concat(theme || 'light'), 'copy:telemetry');
	// });
	grunt.registerTask('default', ['telemetry-submit']);
};

