// ==UserScript==
// @name         WhatsApp Bot
// @namespace    http://www.3399.podserver.info/
// @version      1.0 BETA
// @description  A whatsapp bot just for fun
// @author       I3399I
// @match        https://web.whatsapp.com/
// @grant        Thanks for Macr's Warehouse making this good WS send msg method!
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//Character used to indentify commands
var any = '/';

//Do debug or not
var doDebug = true;

var lastId;
var id;
var msgText;
var args;

//Get the CMD request
$(document).bind('DOMNodeInserted', function(e) {
	msgText = $('#main > div > div.pane-chat-msgs.pane-chat-body.lastTabIndex > div.message-list > div:last > div > div > div.message-text > span.emojitext.selectable-text').html();
	id = $('#main > div > div.pane-chat-msgs.pane-chat-body.lastTabIndex > div.message-list > div:last > div > div > div.message-text > span.emojitext.selectable-text').attr('data-reactid');
	if (lastId !== id){
		if (stringStartsWith(msgText, any)) {
			debug("Detected a command");
			parseCmd(msgText);
		}
	};
	lastId = id;
});

//CMD constructor
function cmd(nm, syntax, desc) {
	this.nm = nm;
	this.syntax = syntax;
	this.desc = desc;
	this.run = function (args) {
		console.log('EXECUTED ' + this.nm + ' IN DEFAULT MODE');
	};
};

//Start of CMD area

var help = new cmd('help', '[CMD]', 'Used for help');
help.run = function(args) {
	var found = false;

	for (var i = 0; i < cmds.length; i++) {
		if(args[1] == cmds[i].nm){
			debug("[HELP CMD] Found " + args[1] + " CMD");
			send(cmds[i].nm.charAt(0).toUpperCase() + cmds[i].nm.slice(1) + "\n" + cmds[i].desc + '\nSyntax: ' + any + cmds[i].nm + ' ' + cmds[i].syntax);
			found = true;
		};
	};

	if (!found)
		send('No CMD with name ' + args[1]);
};

var say = new cmd('say', '[msg]', 'A command that makes me say something');
say.run = function(args) {
	args[0] = "";
	send(args.join(' '));
};

var test = new cmd('test', '', 'A debug command');
test.run = function(args) {
};

//All the CMDs, used for listing/searching
var cmds = [help, say, test];

//End of CMD area

//Parse the CMDs
function parseCmd(msg) {
	msg = msg.slice(1, msg.length);
	debug("Got '" + msg + "' CMD request.");
	args = msg.split(' ');
	for (var i = 0; i < cmds.length; i++) {
		if(args[0] == cmds[i].nm){
			debug("Executed " + args[0] + " CMD");
			cmds[i].run(args);
		};
	};
};

//By: http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
function stringStartsWith(string, prefix) {
	return string.slice(0, prefix.length) == prefix;
};

function debug(msg) {
	if(doDebug)
		console.log("[DEBUG]  " + msg + "\n");
}

function send(msg){
	setTimeout(function() {
		spam(msg);
	}, 100)
}

//Based on http://macr1408.260mb.org/wspam2.html
function dispatch(target, eventType, char) {
	var evt = document.createEvent("TextEvent");    
	evt.initTextEvent (eventType, true, true, window, char, 0, "en-US");
	target.focus();
	target.dispatchEvent(evt);
}

//Based on http://macr1408.260mb.org/wspam2.html
function spam(msg){
	texto = msg;
	campo = document.getElementsByClassName("input")[1];
	dispatch(campo, "textInput", texto); 
	var input = document.getElementsByClassName("icon btn-icon icon-send");
	input[0].click();
	setTimeout(function(){ }, 50);
}