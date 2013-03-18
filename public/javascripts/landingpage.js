var dashboard = document.querySelector('#dashboard-link');
var testNav = document.querySelector('.test-navigation');
var liButton = document.querySelector('li.button');
var liButtonNoTheme = document.querySelector('li.button_no_theme');

liButton.addEventListener('mouseover', function () {

	document.querySelector('ul.button_no_theme').classList.remove('active');
	document.querySelector('ul.button').classList.add('active');

}, false);

liButtonNoTheme.addEventListener('mouseover', function () {

	document.querySelector('ul.button').classList.remove('active');
	document.querySelector('ul.button_no_theme').classList.add('active');

}, false);

[].forEach.call(document.querySelectorAll('li a'), function (el) {

	el.addEventListener('click', function (e) {

		document.querySelector('#holder').innerHTML = '';

		e.preventDefault();
		var params   = this.href.match(/\?.{0,}/g)[0].slice(1).split('&');
		var l = params.length;
		var formdata = new FormData();

		res[0] = [];
		res[1] = [];
		res[2] = [];

		resx[0] = [];
		resx[1] = [];
		resx[2] = [];

		params.forEach(function (p) {
			p = p.split('=');

			formdata.append(p[0],p[1]);
			if(--l === 0) {
				submit(formdata, function (data) {
					plot(data, 550, 300);
				});
			}
		});

	});

});

dashboard.addEventListener('mouseover', function () {

	testNav.classList.add('active');

}, false);