
var EGRUL_PDF_SCHEMA = require('./schema')
var fs = require('fs');
var spawn = require('child_process').spawn;

fs.readdir('pdfs', function(err, files){
	if (err)
		throw err;
	
	var f = files

	var less = spawn('less', f, {
        cwd: 'pdfs'
    });
    
    less.stdout.setEncoding('utf8');

    var pdfData = '';
    
    less.stdout.on('data', function(data) {
        pdfData += data;
    });

    less.stdout.on('end', function() {
        // parse the data using the parse function defined below, executed once per pdf
        // the parse function appends the parsed, extracted data to the global jsonData
        // returns null if everything went well 
        var err = parse(pdfData);
        //if (err === null) console.log(file + ' parsed.');
        //callback(err);
    });
    
});

/**
 * @returns {RegExp} String converted to RegExp with escaped spec symbols  
 */
var normilize_re = function(src, start_line) {
	return new RegExp((start_line ? '^' : '') +
		src
		.replace('.', '\\.')
		.replace('(', '\\(')
		.replace(')', '\\)')
		.replace(',', '\\,')
		.replace('-', '\\-')
	);
}

/**
 * @returns {Array} First and Last line index of the section name  
 */
var get_sect_indx = function(src, dst_name) {
	var chunk = {
		name: '',
		indx: undefined
	};
	
	for (var i = 0; i < src.length; i++) {
		
		// if in the first section line searching now
		if ('' === chunk.name) {
			// if this line contents first line substring of section name
			if( normilize_re(src[i], true).test(dst_name) ) {
	
				chunk.name = src[i];
				chunk.indx = i;
				// if line substring is equal to section name
				if (chunk.name === dst_name)
					return [chunk.indx, i];
			}
		
		// if first section line is detected
		} else {
			// if line contents substring of section name
			if( normilize_re(src[i], false).test(dst_name) ) {
				chunk.name += ' ' +  src[i];
			
				// if line substring is equal to section name
				if (chunk.name === dst_name)
					return [chunk.indx, i];

			} else {
				return undefined;
			}
		}
	}
	return undefined;
}

var parse_items = function(src, sign) {

	//sign_consistent = false
	var item = {
		sign: {
			val: '',
			is_consistent: false
		},
		val: ''
	}

	src.some(function(line){

		// item's first line sign
		var sign_match = /^\d{1,2}\s+(\W+[^\s])\s{2,}/g.exec(line);
			
		// if in the first section line searching now
		if ('' === item.sign.val) {
			
			// if this line contents first line substring of item's name
			if (sign_match && normilize_re(sign_match[1], true).test(sign)) {
				var val_match = /^\d{1,2}\s+\W+[^\s]\s{2,}(.+)/g.exec(line);
				
				item.sign.val = sign_match[1];
				if (val_match[1] !== null)
					item.val = val_match[1];
				
				// if line substring is equal to item's sign
				if (item.sign.val === sign)
					item.sign.is_consistent = true;
			}
		
		// if first section line is detected and next item reached
		} else if (sign_match) {
			return true;

		// if first section line is detected and the item filling continue now
		} else {
			
			// if the sign is consistent
			if (item.sign.is_consistent) {
			
				item.val += ' ' + line.replace(/^\s+|\s+$/gm,'');
			
			// if the sign is not consistent now
			} else {
				var l_s = line
					// splitting by the ranges, consisting of not less than two spaces
					.split(/(\s{2,})/g)
					// filtering empty strings and strings consisting from spaces only
					.filter(function(i){return i !== '' && !(/(^\s+$)/g.test(i))})
					// trimming the leading and the trailng spaces
					.map(function(i){return i.replace(/^\s+|\s+$/gm,'')});

				item.sign.val += ' ' + l_s[0];
				if (2 === l_s.length)
					item.val += ' ' + l_s[1];
				
				// if line substring is equal to item's sign
				if (item.sign.val === sign)
					item.sign.is_consistent = true;
			}
		}
		return false;

	});

	return item.sign.is_consistent ? item.val : undefined;
}

/**
 * @returns {Array} First and Last line index of the section name  
 */
var parse_sects = function(src, skel) {
	var _src = src.slice()
	var cur_key = undefined;
	var cur_item_signs = undefined;
	egrul = {};
	
	skel.forEach(function(s){
		var range = get_sect_indx(_src, s.id);

		if (range !== undefined) {
			var s_items = _src.splice(0, range[1]).splice(0, range[0]);
			if (cur_key !== undefined){
				cur_item_signs.forEach(function(f){
					var v = parse_items(s_items, f.id);
					if (v !== undefined)
						egrul[cur_key][f.key] = v;
				});
			}

			cur_key = s.key;
			cur_item_signs = s.data;

			if (cur_key !== undefined)
				egrul[cur_key] = {};
		}
	});

	return egrul;
}

var get_entity_type = function(src) {

	switch(src[0]) {
		case EGRUL_PDF_SCHEMA.SIGN_ENTITY_TYPE.LE:
		{
			return EGRUL_PDF_SCHEMA.SCHEMA.LE;
		}
		case EGRUL_PDF_SCHEMA.SIGN_ENTITY_TYPE.SE:
		{
			switch(src[1]) {
				case EGRUL_PDF_SCHEMA.SIGN_SOLE_ENTITY_TYPE.SE:
				{
					return EGRUL_PDF_SCHEMA.SCHEMA.SE.SE;
				}
				case EGRUL_PDF_SCHEMA.SIGN_SOLE_ENTITY_TYPE.KFH:
				{
					return EGRUL_PDF_SCHEMA.SCHEMA.SE.KFH;
				}
				default:
					return undefined
			}	
		}
		default:
			return undefined;
	}
}

var normalize = function(data) {
	return data
	// split to lines
	.split(/(\r?\n)/g)
	// filter by '\n' and 'empty string'
	.filter(function(i){ return i !== '\n' && i !== ''; })
	// trim leading spaces
	.map(function(i){ return i.replace(/^\s+/gm,'')})
	// delete footer's first string 
	.filter(function(i){ return 'Сведения с сайта ФНС России' !== i; })
	// delete footer's second string
	.filter(function(i){ return !(/Страница\s{1,2}\d{1,2}\s{1,2}из\s{1,2}/.test(i)); })
}

var trim = function(src, skel) {
	// trim leading
	var dst = (function(_l){
		for (var i in _l)
			if (/№\s{1,2}п\/п/.test(_l[i]))
				return _l.slice(+i + 2);
		return [];
	})(src);

	if(!dst.length)
		console.log('ERROR! CAN NOT FIND THE START BIT!!')
	
	// trim trailing
	var trail_indx = get_sect_indx(dst, skel[skel.length - 1].id);
	if (trail_indx !== undefined)
		dst = dst.slice(0, trail_indx[0]).concat(skel[skel.length - 1].id);
	else
		console.log('ERROR! CAN NOT FIND THE STOP BIT!!!!!!!!!')
	
	
	if(!dst.length)
		console.log('ERROR! CAN NOT FIND THE STOP BIT!!')
	return dst
}

var parse = function (data) {
	
	var lines = normalize(data);

	// detect entity type
	var skel = get_entity_type(lines);

	if ( undefined === skel )
		console.log('ERROR! CAN NOT DETECT THE ENTITY TYPE!!')

	lines = trim(lines, skel)
	
	var dict = parse_sects(lines, skel);
	console.log(dict)
	return lines
}
