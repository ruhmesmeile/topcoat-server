/*
 * Submit testcases results to Topcoat server
 */

/*global module*/

module.exports = function (grunt) {
	'use strict';

	// submit benchmark data
	//
	// NOTE: may only be called with one unique source file, as more would
	// break Grunt's asynchronicity.
	//
	grunt.registerMultiTask('testcase_submit',
		'Submit benchmark data to Topcoat server',
		function() {
			var options = this.options(),
				submitData = require('../lib/submitData'),
				date = options.date || new Date().toISOString(),
				name = options.commit + ' ' + date,
				done = this.async(),
				test = this.target,
				file = this.filesSrc[0]; // only one file allowed

			grunt.log.writeflags(options, this.name);

			grunt.log.writeln('Submitting ' + test + ' (' + name + ')');
			submitData(name,
				file,
				{
					device: options.device,
					test: test
				}, {
					host: options.host,
					port: options.port
				}, done);
		});

};
