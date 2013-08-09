/*
 * Runs Telemetry benchmarks using telemetry tools from Chrome
 */

/*global module*/

module.exports = function (grunt) {
	'use strict';

	var exec = require('child_process').exec,
		path = require('path');

	// runs testcases using Chrome Telemetry tools
	grunt.registerMultiTask('testcase_run',
		'Run Telemetry benchmark on DTAG Components',
		function() {
			var options = this.options(),
				testcase = this.target,
				perf_dir = options.perf_dir,
				perf_tool = options.perf_tool,
				pagesets = options.pagesets,
				relative = path.relative(perf_dir, pagesets),
				done = this.async();

			grunt.log.writeflags(options, 'Options');

			exec('./' + perf_tool + ' ' +
				'--browser=system loading_benchmark ' +
				'--output=' + relative + '/' + testcase + '_loading.csv ' +
				relative + '/' + testcase + '.json',
				{ cwd: perf_dir },
				function (error, stdout, stderr) {
					if (error) {
						grunt.log.error(error);
						done(false);
					}

					exec('./' + perf_tool + ' ' +
						'--browser=system smoothness_benchmark ' +
						'--output=' + relative + '/' + testcase + '_smoothness.csv ' +
						relative + '/' + testcase + '.json',
						{ cwd: perf_dir },
						function (error, stdout, stderr) {
							if (error) {
								grunt.log.error(error);
								done(false);
							}

							grunt.log.writeln(stdout);
							done();
						});
				});
		});
};
