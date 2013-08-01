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
        perf: 'chromium/tools/perf',
        dtag_init: {
            options: '<%= config %>'
        },
        dtag_build: {
            options: '<%= config %>'
        },
        copy: {
            assets: {
                files: [{
                    expand: true,
                    src: [
                        'fonts/**',
                        'images/**'
                    ],
                    dest: '<%= pagesets %>/',
                    cwd: '<%= config.toolbox %>/dist/'
                }]
            }
        },
        clean: {
            page_sets: '<%= pagesets %>'
        }
    });

    //Load local tasks
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // grunt.registerTask('default', '', function(platform, theme) {
    //     if (chromiumSrc === "") grunt.fail.warn("Set CHROMIUM_SRC to point to the correct location\n");
    //     grunt.task.run('check_chromium_src', 'perf:'.concat(platform || 'mobile').concat(':').concat(theme || 'light'), 'copy:telemetry');
    // });
    grunt.registerTask('default', ['telemetry-submit']);
};

