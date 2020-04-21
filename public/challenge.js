function Challenge (list,id) {
	this.id = id||0;
	try {this.list=JSON.parse(list)} catch (e) {this.list=[]}
	this.not_answered = this.list.map(function(e) {return new Word(e.A,e.B)});
	this.lookups = [];
	this.wrong_answers = [];
	return this;
}

function Word (A,B) {
	this.A = A;
	this.B = B;
	return this;
}

function Question (A,B_list) {
	this.A = A;
	this.B_list = B_list;
	return this;
}

function Stats (c) {
	this.todo = c.not_answered.length;
	this.ok = c.list.length-this.todo;
	this.assist = c.lookups.length;
	this.error = c.wrong_answers.length;
	return this;
}

function create_new_challenge(list,id) {
	return new Challenge(list,id);
}

Challenge.prototype.get_challenge = function () {
	return JSON.stringify(this);
}

Challenge.prototype.get_question = function (reverse,options_count) {
	if (this.not_answered.length<1) {return JSON.stringify({})}
	// select random Word from not_answered
	let ask_for = this.not_answered[Math.floor(Math.random() * this.not_answered.length)];
	let options = [];
	// show 3 options minimum, 8 options maximum, 3 options as default
	if (!options_count||(options_count<3)||(options_count>8)) {options_count=3}
	// reverse questioning if requested
	if (reverse) {
		options.push(ask_for.A);
		// add random false answers from this.list
		while (options.length<Math.min(options_count,this.list.length)) {
			options.push(this.list[Math.floor(Math.random() * this.list.length)].A);
			options = [...new Set(options)]; 
		}
		return JSON.stringify(new Question(ask_for.B,shuffle_list(options)));
	} else {
		options.push(ask_for.B);
		// add random false answers from this.list
		while (options.length<Math.min(options_count,this.list.length)) {
			options.push(this.list[Math.floor(Math.random() * this.list.length)].B);
			options = [...new Set(options)]; 
		}
		return JSON.stringify(new Question(ask_for.A,shuffle_list(options)));
	}
}

Challenge.prototype.get_stats = function () {
	return JSON.stringify(new Stats(this));
}

Challenge.prototype.check = function (word) {
	let found = this.list.find(function(e) {return ( ((e.A==word.A)&&(e.B==word.B)) || ((e.A==word.B)&&(e.B==word.A)) )})
	if (found==undefined) {
		this.wrong_answers.push(word);
		return false;
	} else {
		this.not_answered = this.not_answered.filter(function(e) {return ( ((e.A==word.A)&&(e.B==word.B)) || ((e.A==word.B)&&(e.B==word.A)) )?undefined:e});
		return true;
	}
}

Challenge.prototype.lookup = function (A) {
	let word = {};
	let found = this.list.find(function(e) {return (A==e.A)})
	if (found) {
		word=new Word(found.A,found.B);
	} else {
		found = this.list.find(function(e) {return (A==e.B)})
		word=new Word(found.B,found.A);
	}
	this.lookups.push(word);
	return JSON.stringify(word);
}

function shuffle_list(list) {
	return list.sort(function() {return Math.random() - 0.5});
}
