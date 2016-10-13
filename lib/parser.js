
var TEMPLATES = {
	LE: [
		{
			id: 'Наименование',
			key: 'name',
			data: [
				{ id: 'Полное наименование',		key: 'full'},
				{ id: 'Сокращенное наименование',	key: 'short'},
			]
		},
		{
			id: 'Адрес (место нахождения)',
			key: 'addr',
			data: [
				{ id: 'Почтовый индекс',					key: 'postcode' },
				{ id: 'Субъект Российской Федерации',		key: 'region' },
				{ id: 'Район (улус и т.п.)',				key: 'district' },
				{ id: 'Город (волость и т.п.)',				key: 'city' },
				{ id: 'Населенный пункт (село и т.п.)',		key: 'locality' },
				{ id: 'Улица (проспект, переулок и т.д.)',	key: 'street' },
				{ id: 'Дом (владение и т.п.)',				key: 'build' },
				{ id: 'Корпус (строение и т.п.)',			key: 'block' },
				
			]
		},
		{
			id: 'Сведения о регистрации',
			key: 'reg',
			data: [
				{ id: 'ОГРН',				key: 'ogrn'},
				{ id: 'Дата регистрации',	key: 'regdate'},
			]
		},
		{
			id: 'Сведения о регистрирующем органе по месту нахождения юридического лица',
		},
		{
			id: 'Сведения о прекращении',
			key: 'termination',
			data: [
				{ id: 'Дата прекращения',	key: 'date'},
			]
		},
		{
			id: 'Сведения об учете в налоговом органе',
			key: 'fns',
			data: [
				{ id: 'ИНН', key: 'inn'},
				{ id: 'КПП', key: 'kpp'},
				{ id: 'Наименование налогового органа', key: 'ifns' },
			]
		},
		{
			id: 'Сведения о регистрации в качестве страхователя в территориальном органе Пенсионного фонда Российской Федерации',
			key: 'pfr',
			data: [
				{ id: 'Регистрационный номер', key: 'regnum'},
				{ id: 'Наименование территориального органа Пенсионного фонда', key: 'dpfr'},
			]
		},
		{
			id: 'Сведения о регистрации в качестве страхователя в исполнительном органе Фонда социального страхования Российской Федерации',
			key: 'fss',
			data: [
				{ id: 'Регистрационный номер', key: 'regnum'},
				{ id: 'Наименование исполнительного органа Фонда социального страхования', key: 'dfss'},
			]
		},
		{
			id: 'Сведения об уставном капитале (складочном капитале, уставном фонде, паевых взносах)',
		},
		{
			id: 'Сведения о лице, имеющем право без доверенности действовать от имени юридического лица',
			key: 'head',
			data: [
				{ id: 'Фамилия',			key: 'surname'},
				{ id: 'Имя',				key: 'name'},
				{ id: 'Отчество',			key: 'patronymic'},
				{ id: 'ИНН',				key: 'inn'},
				{ id: 'Должность',			key: 'position'},
				{ id: 'Контактный телефон',	key: 'phone'},
			]
		},
		{
			id: 'Сведения о видах экономической деятельности по Общероссийскому классификатору видов экономической деятельности (ОКВЭД ОК 029-2014 КДЕС. Ред. 2)'
		}
	],
	SE: {
		SE: [
			{
				id: 'Фамилия, имя, отчество (при наличии) индивидуального предпринимателя',
				key: 'common',
				data: [
					{ id: 'Фамилия',	key: 'surname'},
					{ id: 'Имя',		key: 'name'},
					{ id: 'Отчество',	key: 'patronymic'},
					{ id: 'Пол',		key: 'sex'},
				]
			},
			{
				id: 'Сведения о гражданстве',
				key: 'citizenship',
				data: [
					{ id: 'Гражданство',	key: 'citizenship'},
				]
			},
			{
				id: 'Сведения о регистрации индивидуального предпринимателя',
				key: 'reg',
				data: [
					{ id: 'ОГРНИП',				key: 'ogrn'},
					{ id: 'Дата регистрации',	key: 'regdate'},
				]
			},
			{
				id: 'Сведения о регистрирующем органе по месту жительства индивидуального предпринимателя',
			},
			{
				id: 'Сведения об учете в налоговом органе',
				key: 'fns',
				data: [
					{ id: 'Идентификационный номер налогоплательщика (ИНН)', key: 'inn'},
					{ id: 'Наименование налогового органа', key: 'ifns' },
				]
			},
			{
				id: 'Сведения о регистрации в качестве страхователя в территориальном органе Пенсионного фонда Российской Федерации',
				key: 'pfr',
				data: [
					{ id: 'Регистрационный номер', key: 'regnum'},
					{ id: 'Наименование территориального органа Пенсионного фонда', key: 'dpfr'},
				]
			},
			{
				id: 'Сведения о видах экономической деятельности по Общероссийскому классификатору видов экономической деятельности (ОКВЭД ОК 029-2014 КДЕС. Ред. 2)'
			}
		],
		KFH: [
			{
				id: 'Фамилия, имя, отчество (при наличии) индивидуального предпринимателя',
				key: 'common',
				data: [
					{ id: 'Фамилия',	key: 'surname'},
					{ id: 'Имя',		key: 'name'},
					{ id: 'Отчество',	key: 'patronymic'},
					{ id: 'Пол',		key: 'sex'},
				]
			},
			{
				id: 'Сведения о гражданстве',
				key: 'citizenship',
				data: [
					{ id: 'Гражданство',	key: 'citizenship'},
				]
			},
			{
				id: 'Сведения о регистрации крестьянского (фермерского) хозяйства',
				key: 'reg',
				data: [
					{ id: 'ОГРНИП',				key: 'ogrn'},
					{ id: 'Дата регистрации',	key: 'regdate'},
				]
			},
			{
				id: 'Сведения о регистрирующем органе по месту жительства главы крестьянского (фермерского) хозяйстве',
			},
			{
				id: 'Сведения об учете в налоговом органе',
				key: 'fns',
				data: [
					{ id: 'Идентификационный номер налогоплательщика (ИНН)', key: 'inn'},
					{ id: 'Наименование налогового органа', key: 'ifns' },
				]
			},
			{
				id: 'Сведения о регистрации в качестве страхователя в территориальном органе Пенсионного фонда Российской Федерации',
				key: 'pfr',
				data: [
					{ id: 'Регистрационный номер', key: 'regnum'},
					{ id: 'Наименование территориального органа Пенсионного фонда', key: 'dpfr'},
				]
			},
			{
				id: 'Сведения о видах экономической деятельности по Общероссийскому классификатору видов экономической деятельности (ОКВЭД ОК 029-2014 КДЕС. Ред. 2)'
			}
		]
	}
};

var SIGN_ENTITY_TYPE = {
	LE: 'ЕДИНЫЙ ГОСУДАРСТВЕННЫЙ РЕЕСТР ЮРИДИЧЕСКИХ ЛИЦ',
	SE: 'ЕДИНЫЙ ГОСУДАРСТВЕННЫЙ РЕЕСТР ИНДИВИДУАЛЬНЫХ ПРЕДПРИНИМАТЕЛЕЙ'
};

var SIGN_SOLE_ENTITY_TYPE = {
	SE: 'Сведения об индивидуальном предпринимателе',
	KFH: 'Сведения о крестьянском (фермерском) хозяйстве, главой которого является'
};

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
		case SIGN_ENTITY_TYPE.LE:
		{
			return TEMPLATES.LE;
		}
		case SIGN_ENTITY_TYPE.SE:
		{
			switch(src[1]) {
				case SIGN_SOLE_ENTITY_TYPE.SE:
				{
					return TEMPLATES.SE.SE;
				}
				case SIGN_SOLE_ENTITY_TYPE.KFH:
				{
					return TEMPLATES.SE.KFH;
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
