'use strict';

const https = require('https');
const vow = require('vow');
const querystring = require('querystring');
const egrulpp = require('egrulpp');
const EGRUL_NALOG_RU = require('./egrulpg.const');
const config = require('./egrulpg.config');
const path = require('path');
const fs = require('fs');
/**
 * 'GET' request to the 'egrul.nalog.ru'
 *
 * @param {object} opt - GET options
 * @param {string} enc - response data encoding
 * @return {object} raw response data
 */
function __req_get(opt, enc='utf8') {
 	var d = vow.defer();
 	var data = '';
 	
 	var req = https.request(opt, res => {
        res.setEncoding(enc);
        res.on('data', chunk => data += chunk );
        res.on('end', () => d.resolve(data) );
    });

 	req.on('error', e => d.reject(e) );
    req.end();

 	return d.promise();
}

/**
 * 'POST' request to the 'egrul.nalog.ru'
 *
 * @param {object} opt - POST options
 * @param {object} post_data - POST data
 * @param {string} enc - response data encoding
 * @return {object} raw response data
 */
function __req_post(opt, post_data, enc='utf8') {
 	var d = vow.defer();
 	var data = '';
 	
 	var req = https.request(opt, res => {
        res.setEncoding(enc);
        res.on('data', chunk => data += chunk );
        res.on('end', () => d.resolve(data) );
    });

 	req.write(post_data)
 	req.on('error', e => d.reject(e) );
    req.end();

 	return d.promise();
}


/**
 * Makes request options 
 *
 * @param {string} path - path at egrul.nalog.ru
 * @param {string} method - request method 'GET' or 'POST'
 * @param {object} headers - request headers object
 * @return {object} options object
 */
function __make_opt(path, method='GET', headers=undefined){
   var opt = {
		hostname: EGRUL_NALOG_RU.EGRUL_NALOG_HOST_NAME,
		port: 443,
		path: path,
		method: method,
	}

	if (headers !== undefined)
		opt.headers = headers;

	return opt;
}

/**
 * Retrieves CAPTCHA token
 *
 * @return {string} CAPTCHA token
 */
function __get_captcha_token() {
	var d = vow.defer()
	
	__req_get( __make_opt( EGRUL_NALOG_RU.EGRUL_NALOG_PATH_CAPTCHA + '?' + querystring
				.stringify({ r: (new Date()).valueOf() }))
	).then(
	res => {
		if (/^[0-9a-fA-F]+$/g.test(res))
			d.resolve(res);
		else
			d.reject(res);
	},
	err =>  d.reject(err)	
	);

	return d.promise();
}

/**
 * Retrieves WebP format CAPTCHA image
 *
 * @param {string} token - CAPTCHA token
 * @return {binary} WebP image raw data
 */
function __get_captcha_imgage(token) {
	var d = vow.defer();

	__req_get( __make_opt( EGRUL_NALOG_RU.EGRUL_NALOG_PATH_CAPTCHA + '?' + querystring
				.stringify({ a: token })),
			 'binary'
	).then(
	res => d.resolve(res),
	err => d.reject(err)
	);

	return d.promise();
}

/**
 * Makes the query data parameters for egrul.nalog.ru
 *
 * @param {string} ogrninn - inn or ogrn of the searched entity
 * @param {boolean} ul - 'true' if the kind of the entity is 'ul', otherwise 'fl'
 * @param {string} captcha - CAPTCHA
 * @param {string} token - CAPTCHA image token
 * @return {object} dictionary of the required query params
 */
function __make_query_data(ogrninn, ul, captcha, token) {
	
	return querystring.stringify({
		kind: (ul ? 'ul' : 'fl'),
		srchUl: 'ogrn',
		ogrninnul: (ul ? ogrninn : ''),
		namul: '',
		regionul: '',
		srchFl: 'ogrn',
		ogrninnfl: (ul ? '' : ogrninn),
		fam: '',
		nam: '',
		otch: '',
		region: '',
		captcha: captcha,
		captchaToken: token
	});
}

/**
 * Parses search query response
 *
 * @param {string} res_json - response json
 * @return {object} data		- single entity object
 * @return {string} data.kind	- kind of the entity: 'ul' or 'fl'
 * @return {string} data.ogrn	- OGRN of the entity
 * @return {string} data.inn	- INN of the entity
 * @return {string} data.dtreg	- entity registration date 
 * @return {string} data.name	- entity name
 * @return {string} data.token	- entity PDF-data file token
 * @return {string} data.se		- type of the 'fl' entity (kind: 'fl' ONLY): 'IP' or 'KFH'
 * @return {string} data.kpp	- KPP of the 'ul' entity (kind: 'ul' ONLY)
 * @return {object} data.addr	- registration addres of the 'ul' entity (kind: 'ul' ONLY)
 * @return {string} data.postcode	- postal code
 * @return {string} data.region		- country region
 * @return {string} data.district	- region district
 * @return {string} data.city		- city
 * @return {string} data.locality	- city or district locality
 * @return {string} data.street		- street
 * @return {string} data.build		- build
 * @return {string} data.block		- block of the build
 * @return {string} data.apart		- apart of the build
 * @return {string} data.ext		- yet unknown
 */
function __parse_query_res(res_json, cb) {

	var res = JSON.parse(res_json);
	
	if (res.ERRORS !== undefined) {
		if (res.ERRORS.captcha !== undefined) {
			cb('ERR_EGRUL_CAPTCHA', res.ERRORS.captcha);
		} else if (res.ERRORS.ogrninnul !== undefined) {
			cb('ERR_EGRUL_OGRNINNUL', res.ERRORS.ogrninnul);
		} else if (res.ERRORS.ogrninnfl !== undefined) {
			cb('ERR_EGRUL_OGRNINNFL', res.ERRORS.ogrninnfl);
		} else {
			cb('ERR_EGRUL_UNKNOWN', res.ERRORS);
		}
		return;
	}

	// if egrul has entry for this entity
	if (res.rows !== undefined && res.rows.length) {
		
		// filters the ended entities
		res.rows = res.rows.filter(i => undefined === i.DTEND).map(i => {
			i.DTREG = ((new Date(i.DTREG.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'))).valueOf());
			return i;
		});

		// if egrul has more than one active entries for this entity
		if (res.rows.length > 1) {
			let max_dreg = Math.max.apply(null, res.rows.map(i => i.DTREG))
			res.rows = res.rows.filter(i => max_dreg === i.DTREG)
		}

		if (!res.rows.length) {
			cb('ALL ENTITIES ARE ENDED');
			return;
		} 
		
		var data = {
			kind: res.query.kind,
			ogrn: res.rows[0].OGRN,
			inn: res.rows[0].INN,
			dtreg: res.rows[0].DTREG,
			name: res.rows[0].NAME,
			token: res.rows[0].T
		};

		switch (res.query.kind) {
		case 'fl':
			switch (res.rows[0].IDVIDIP){
			case '1':
				data.se = 'IP';
				break;
			case '2':
				data.se = 'KFH';
				break;
			default:
				cb(`UNDEFINED SOLE TRADER TYPE: ${data.se}`);
				return;
			}
			break;
		case 'ul':
			data.kpp = res.rows[0].KPP;
			let __t_a = res.rows[0].ADRESTEXT.split(',');
			if (10 !== __t_a.length) {
				cb('ADRESS HAS UNEXPECTED NUMBER OF FILEDS: ${__t_a.length}', __t_a);
				return;
			}
			data.addr = {
				postcode:	__t_a[0],
				region:		__t_a[1],
				district:	__t_a[2],
				city:		__t_a[3],
				locality:	__t_a[4],
				street:		__t_a[5],
				build:		__t_a[6],
				block:		__t_a[7],
				apart:		__t_a[8],
				ext:		__t_a[9],
			};
			break;
		default:
			cb(`UNDEFINED ENTITY TYPE: ${res.query.kind}`);
			return;
		}
		cb(null, data);
		return;
	// egrul has no any entries for this entity
	} else {
		cb('EGRUL HAS NO ANY ENTRIES FOR THIS ENTITY');
		return;
	}
}


/**
 * Fetches PDF EGRUL data file
 *
 * @param {string} token - PDF token
 * @return {binary} PDF raw data
 */
function __fetch_pdf(token) {
	var d = vow.defer();
	
	__req_get(__make_opt( EGRUL_NALOG_RU.EGRUL_NALOG_PATH_PDF + '/' + token), 'binary' )
	.then(
	res => d.resolve(res),
	err => d.reject(err)
	);

	return d.promise();
}

/**
 * Retreives CAPTCHA
 *
 * @return {object} captcha - captcha data
 * @return {string} captcha.t - captcha token
 * @return {object} captcha.r - captcha raw webp image data
 */
var get_captcha = function() {
	var d = vow.defer();
	
	__get_captcha_token()
	.then(
	token => __get_captcha_imgage(token)
		.then(
		raw_img => d.resolve({ t: token, r: raw_img }),
		err => d.reject(err)
		),
	err => d.reject(err)
	);

	return d.promise();
}

/**
 * Retreives EGRUL data from PDF
 *
 * @param {string} ogrninn - OGRN or INN
 * @param {boolean} ul - flag: true if ul, otherwise false ('fl')
 * @param {string} captcha - captcha's user input
 * @param {string} token - captcha token
 * @return {object} data - EGRUL data
 * @return {object} data.i			- single entity object
 * @return {string} data.i.kind		- kind of the entity: 'ul' or 'fl'
 * @return {string} data.i.ogrn		- OGRN of the entity
 * @return {string} data.i.inn		- INN of the entity
 * @return {string} data.i.dtreg	- entity registration date 
 * @return {string} data.i.name		- entity name
 * @return {string} data.i.token	- entity PDF-data file token
 * @return {string} data.i.se		- type of the 'fl' entity (kind: 'fl' ONLY): 'IP' or 'KFH'
 * @return {string} data.i.kpp		- KPP of the 'ul' entity (kind: 'ul' ONLY)
 * @return {object} data.i.addr		- registration addres of the 'ul' entity (kind: 'ul' ONLY)
 * @return {string} data.i.postcode	- postal code
 * @return {string} data.i.region	- country region
 * @return {string} data.i.district	- region district
 * @return {string} data.i.city		- city
 * @return {string} data.i.locality	- city or district locality
 * @return {string} data.i.street	- street
 * @return {string} data.i.build	- build
 * @return {string} data.i.block	- block of the build
 * @return {string} data.i.apart	- apart of the build
 * @return {string} data.i.ext		- yet unknown
 * @return {object} data.r			- PDF raw data
 */
var get_egrul_raw = function(ogrninn, ul, captcha, token) {
	var d = vow.defer();

	var post_data = __make_query_data(ogrninn, ul, captcha, token);
	__req_post(
		__make_opt(
			'/',
			'POST',
			{
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			}),
		post_data
	)
	.then(
	res => {
		__parse_query_res(res, (err, data) => {
			if (err){
				return d.reject(err);
			}
			
			return __fetch_pdf(data.token)
			.then(
			res => d.resolve({ i: data, r: res }),
			err => d.reject(err)
			);
	
		});
	},
	err => d.reject(err)
	);

	return d.promise();	
}

/**
 * Retreives EGRUL data from PDF
 *
 * @param {string} ogrninn - OGRN or INN
 * @param {boolean} ul - flag: true if ul, otherwise false ('fl')
 * @param {string} captcha - captcha's user input
 * @param {string} token - captcha token
 * @return {object} EGRUL data

 */
var get_egrul = function(ogrninn, ul, captcha, token) {
	var d = vow.defer();

	get_egrul_raw(ogrninn, ul, captcha, token)
	.then(
	res => {
		var pdf_file_name = `${ogrninn}_${(new Date()).valueOf()}.pdf`;
		fs.writeFile(path.join(path.resolve(path.join(path.resolve(__dirname), config.PDF_STORAGE_PATH)) ,pdf_file_name), res.r, 'binary', err => {
			if (err)
				return d.reject(err, res);

			egrulpp.parse(pdf_file_name, path.resolve(path.join(path.resolve(__dirname), config.PDF_STORAGE_PATH)))
			.then(
			res => d.resolve(res),
			err => d.reject(err)
			);
		});
	},
	err => d.reject(err)
	);

	return d.promise();	
}

module.exports.get_captcha = get_captcha;
module.exports.get_egrul_raw = get_egrul_raw;
module.exports.get_egrul = get_egrul;