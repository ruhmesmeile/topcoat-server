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
		testcase_build_prepare: {
			options: {
				target: 'testcase_build',
				testcases: config.testcases
			}
		},
		testcase_build: {
			options: {
				src: '<%= config["toolbox-path"] %>',
				dest: '<%= pagesets %>'
			}
			// actual targets will be inserted by `testcase_build_prepare`
		},
		testcase_prepare: {
			options: {
				pagesets: '<%= pagesets %>'
			},
			testcase_run: {
				options: {
					ext: '.json'
				},
				files: {
					src: '<%= pagesets %>/*.json'
				}
			},
			testcase_submit: {
				options: {
					ext: '.csv'
				},
				files: {
					src: '<%= pagesets %>/*.csv'
				}
			}
		},
		testcase_run: {
			options: {
				perf_dir: '<%= config.perf.path %>',
				perf_tool: '<%= config.perf.tool %>',
				pagesets: '<%= pagesets %>'
			}
			// actual targets will be inserted by `testcase_prepare`
		},
		testcase_submit: {
			options: {
				host: '<%= config.server.host %>',
				port: '<%= config.server.port %>',
				commit: 'snapshot',
				device: 'browser'
			}
			// actual targets will be inserted by `testcase_prepare`
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

	//Load local tasks
	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-hub');

	grunt.registerTask('build', 'Build testcases',
		['clean:page_sets', 'testcase_build_prepare',
			'testcase_build', 'copy:assets', 'hub:clean']);

	grunt.registerTask('run', 'Run testcases',
		['testcase_prepare:testcase_run', 'testcase_run']);

	grunt.registerTask('submit', 'Submit testcase data',
		['testcase_prepare:testcase_submit', 'testcase_submit']);

	grunt.registerTask('clean-all', 'Clean-up', ['clean', 'hub:clean']);

	grunt.registerTask('default', 'Build, run, and submit testcases',
		['build', 'run', 'submit', 'clean']);
};

