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
        testcase_prepare: {
            options: {
                src: '<%= config.toolbox %>',
                dest: '<%= pagesets %>'
            },
            buttons: {
                options: {
                    sass: ['buttons'],
                    scripts: [],
                    html: '<button class="button icon-synchronize">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>'
                }
            },
            checkboxes: {
                options: {
                    sass: ['checkboxes', 'labels'],
                    scripts: ['jquery.dtag_replaceForms'],
                    html: '<form>' +
                        '<div class="checkboxwrap">' +
                        '<input type="checkbox" checked="checked" value="" />' +
                        '<label>Checkbox</label></div>' +
                        '</form>'
                }
            },
            dropdown_select: {
                options: {
                    sass: ['buttons', 'dropdown_select', 'labels'],
                    scripts: ['jquery.dtag_replaceForms'],
                    html: '<form><select class="tk-dropdown"' +
                        ' style="width:200px;" aria-haspopup="true">' +
                        '<option value="dropdown_1">Dropdown 1</option>' +
                        '<option value="dropdown_2">Dropdown 2</option>' +
                        '<option value="dropdown_3">Dropdown 3</option>' +
                        '</select></form>'
                }
            },
            fontsizes: {
                options: {
                    sass: ['fontsizes'],
                    scripts: [],
                    html: '<p class="font-size-small">Lorem ipsum dolor' +
                        ' sit amet, consetetur sadipscing.</p>' +
                        '<p class="font-size-default">Lorem ipsum dolor' +
                        ' sit amet, consetetur sadipscing.</p>' +
                        '<p class="font-size-large">Lorem ipsum dolor' +
                        ' sit amet, consetetur sadipscing.</p>' +
                        '<p class="font-size-headline">Lorem ipsum dolor' +
                        ' sit amet, consetetur sadipscing.</p>'
                }
            },
            headers: {
                options: {
                    sass: ['buttons', 'headers'],
                    scripts: [],
                    html: '<div class="headlinewrap">' +
                        '<h1 class="headline underline">Headline</h1>' + 
                        '<div class="small right">' +
                        '<button class="button icon-only icon-synchronize">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '&nbsp;' +
                        '<button class="button icon-only icon-favorites">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</div></div>'
                }
            },
            inputfields: {
                options: {
                    sass: ['buttons', 'labels', 'inputfields'],
                    scripts: ['jquery.dtag_replaceForms'],
                    html: '<div class="input_text_button-group button-with-text" style="width:400px">' +
                        '<input type="text" placeholder="placeholder" class="embossed" />' +
                        '<button class="button embossed">' +
                        '<span class="buttontext">Button</span>' +
                        '</button></div>'
                }
            },
            labels: {
                options: {
                    sass: ['labels'],
                    scripts: [],
                    html: '<label style="width:300px">Lorem ipsum dolor' +
                        ' sit amet, consetetur sadipscing.</label><br />'
                }
            },
            list: {
                options: {
                    sass: ['fontsizes', 'headers', 'list'],
                    scripts: ['jquery.dtag_treelist'],
                    html: '<div class="headline underline">Headline</div>' +
                        '<ul class="list-decorated large multi-line">' +
                        '<li><span class="list-item-text-wrap">' +
                        '<span class="list-item-title">List item</span>' +
                        '<span class="list-item-description">' +
                        'Description</span></span></li>' +
                        '<ul class="list-decorated large multi-line">' +
                        '<li><span class="list-item-text-wrap">' +
                        '<span class="list-item-title">List item</span>' +
                        '<span class="list-item-description">' +
                        'Description</span></span></li>' +
                        '<ul class="list-decorated large multi-line">' +
                        '<li><span class="list-item-text-wrap">' +
                        '<span class="list-item-title">List item</span>' +
                        '<span class="list-item-description">' +
                        'Description</span></span></li>' +
                        '</ul>'
                }
            },
            radiobuttons: {
                options: {
                    sass: ['radiobuttons', 'labels'],
                    scripts: ['jquery.dtag_replaceForms'],
                    html: '<form>' +
                        '<div class="radiobuttonwrap" role="radiogroup">' +
                        '<input type="radio" value="" />' +
                        '<label>Radiobutton</label></div>' +
                        '</form>'
                }
            },
            tables: {
                options: {
                    sass: ['tables'],
                    scripts: ['jquery.dtag_tables'],
                    html: '<table class="table-decorated">' +
                        '<thead>' +
                        '<tr>' +
                        '<th class="icon">Icon</th>' +
                        '<th>Title</th>' +
                        '<th>Modified</th>' +
                        '<th>Favorite</th>' +
                        '<th>&nbsp;</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td><img src="images/small_list_graphic_multi_placeholder.png" alt="placeholder image" /></td>' +
                        '<td><a href="" title="" class="tr-title">Quisque eget odio ac</a></td>' +
                        '<td>2012-08-07</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-favorites small flat clean">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-download tooltip" title="Download">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '</tr>' +
                        '<tr class="$modifier_class">' +
                        '<td><img src="images/small_list_graphic_multi_placeholder.png" alt="placeholder image" /></td>' +
                        '<td>' +
                        '<a href="" title="" class="tr-title">Nulla at nulla justo</a>' +
                        '<span class="table-subtitle">Torquent per conubia nostra</span>' +
                        '</td>' +
                        '<td>2012-03-02</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-favorites small flat clean">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-download tooltip" title="Download">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><img src="images/small_list_graphic_multi_placeholder.png" alt="placeholder image" /></td>' +
                        '<td>' +
                        '<a href="" title="" class="tr-title">Duis aliquet egestas purus in</a>' +
                        '<span class="table-subtitle">Curabitur vulputate</span>' +
                        '</td>' +
                        '<td>2012-02-21</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-favorites small flat clean">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-download tooltip" title="Download">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><img src="images/small_list_graphic_multi_placeholder.png" alt="placeholder image" /></td>' +
                        '<td><a href="" class="tr-title">Class aptent taciti</a></td>' +
                        '<td>2012-01-07</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-favorites small flat clean">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-download tooltip" title="Download">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><img src="images/small_list_graphic_multi_placeholder.png" alt="placeholder image" /></td>' +
                        '<td><a href="" title="" class="tr-title">litora torquent per conubia</a></td>' +
                        '<td>2011-12-27</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-favorites small flat clean">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '<td class="table-reset-font-size centerd-table-content">' +
                        '<button class="button icon-only icon-download tooltip" title="Download">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Button</span>' +
                        '</button>' +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>'
                }
            },
            textareas: {
                options: {
                    sass: ['textareas'],
                    scripts: [],
                    html: '<textarea placeholder="placeholder"></textarea>'
                }
            },
            textlinks: {
                options: {
                    sass: ['fontsizes', 'textlinks'],
                    scripts: [],
                    html: '<p>' +
                        '<a href="" class="font-size-small">Small Link</a> ' +
                        '<a href="" class="font-size-default">Default Link</a> ' +
                        '<a href="" class="font-size-large">Large Link</a> ' +
                        '<a href="" class="font-size-headline">Headline Link</a>' +
                        '</p>'
                }
            },
            toolbar: {
                options: {
                    sass: ['buttons', 'fontsizes', 'toolbar'],
                    scripts: ['jquery.dtag_toolbar'],
                    html: '<menu type="toolbar" class="toolbar" role="toolbar">' +
                        '<li><button class="button icon-reply minimal">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Antworten</span>' +
                        '</button></li>' +
                        '<li><button class="button icon-download minimal">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Download</span>' +
                        '</button></li>' +
                        '<li><button class="button icon-only icon-move-to-trash rectangle">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Should not be visible</span>' +
                        '</button></li>' +
                        '<li><button class="button icon-folder minimal">' +
                        '<span aria-hidden="true" class="icon"></span>' +
                        '<span class="buttontext">Archivieren</span>' +
                        '</button></li>' +
                        '</menu>'
                }
            }
        },
        testcase_run: {
            options: {
                perf_dir: '<%= perf %>',
                perf_tool: 'run_multipage_benchmarks',
                pagesets: '<%= pagesets %>'
            },
            buttons: {},
            checkboxes: {},
            dropdown_select: {},
            fontsizes: {},
            headers: {},
            inputfields: {},
            labels: {},
            list: {},
            radiobuttons: {},
            tables: {},
            textareas: {},
            textlinks: {},
            toolbar: {}
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
                    cwd: '<%= config.toolbox %>/dist/'
                }]
            }
        },
        clean: {
            page_sets: '<%= pagesets %>'
        }
    });

    /*var pagesets = grunt.config('testcase_prepare'), data = {};
    delete pagesets.options;
    pagesets = grunt.util._.map(pagesets, function (pageset, name) {
        data[name] = pageset.options;
    });
    console.log(JSON.stringify(data, null, '\t'));
    process.exit();*/

    //Load local tasks
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['clean:page_sets', 'testcase_prepare', 'copy:assets']);

    // grunt.registerTask('default', '', function(platform, theme) {
    //     if (chromiumSrc === "") grunt.fail.warn("Set CHROMIUM_SRC to point to the correct location\n");
    //     grunt.task.run('check_chromium_src', 'perf:'.concat(platform || 'mobile').concat(':').concat(theme || 'light'), 'copy:telemetry');
    // });
    grunt.registerTask('default', ['telemetry-submit']);
};

