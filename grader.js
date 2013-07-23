#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var util = require('util');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var PROCESSFILE_DEFAULT = 'process.html';
var myArgs = process.argv.slice(2);

var assertFileExists = function(infile) {
	var instr = infile.toString();
	if(!fs.existsSync(instr)){
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1);
	}
	return instr;
};

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for( var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;
};

var clone = function(fn) {
	return fn.bind({});
};

var buildfn = function(){
	var response2console = function(result, response) {
		//console.error(" in response2console\n");
		//console.error(program.file); 
		fs.writeFileSync(program.file, result); 
		processfile(program.file); 
	};
	return response2console;
};

var processfile = function(filename) {
	//console.error("in function processfile\n");
	var checkJson = checkHtmlFile(filename, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
}

if( require.main == module) {
	program
		.option('-c, --checks checks.json', './Desktop/', clone(assertFileExists), CHECKSFILE_DEFAULT)
		.option('-f, --file index.html', './Desktop/', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url http://localhost:8890', 'http://localhost:8890')
		.parse(process.argv);
        
	var filename = ""; 
	
	if( myArgs[2] == '--url') {
		//console.error(" processing url\n");
		program.file = PROCESSFILE_DEFAULT; 
		var response2console = buildfn();
		rest.get(myArgs[3]).on('complete', response2console);
	}		
	else
	{
		//console.error("processing file\n"); 
		//console.error(myArgs[3]); 
		program.file = myArgs[3]		
		processfile(program.file); 
	}
}
else
{
	exports.checkHtmlFile = checkHtmlFile;
}
