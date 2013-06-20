/**
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var params   = window.location.href.match(/\?.{0,}/g),
	formdata = new FormData(),
	filter 	 = ['mean_frame_time (ms)', 'load_time (ms)', 'Layout (ms)'],
	plotData = {};

params = (params) ? params[0].slice(1).split('&') : null;

var parse = function (data) {
	data = JSON.parse(data);
	var results = data.map(filterResults);
	plot();
};


/*
	filters through the results
	separates the base results from the rest
*/
var filterResults = function (d) {
	filter.forEach(function baseOrStandard (f) {
		if (d.result[f] || d.result[f + ' base']) {
			if (plotData[f]) {
				if (d.test.match(/base/g))
					plotData[f][0] = d.result[f + ' base'];
				else
					plotData[f].push(d.result[f]);
			} else {
				if (d.test.match(/base/g))
					plotData[f] = [d.result[f + ' base']];
				else
					plotData[f] = ['', d.result[f]];
			}
		}
	});
};

/*
	Get the data
*/
var submit = function (formData, cb) {

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/dashboard/get', true);
	xhr.onload = function xhrLoaded (e) {
		if (this.status == 200) {
			cb(this.response);
		}
	};
	xhr.send(formData);

};

(function plot () {

	var l = params.length;
	params.forEach(function urlParams (p) {
		p = p.split('=');

		formdata.append(p[0],p[1]);
		if(--l === 0) {
			submit(formdata, parse);
		}
	});

})();