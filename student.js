var listOfChallenges=[];
var currentChallenge=undefined;
const DEFAULT={'id':'[ create a new list ]','text':'','placeholder':'Type or paste your vocabulary here.\nDo it like this:\nKatze = cat\nHund = dog'};
function server_create_new_challenge(list,id) {return create_new_challenge(list,id)}
function server_get_question(reverse) {let r=currentChallenge.get_question(reverse,config.mc_count); return JSON.parse(r)}
function server_check(word) {return currentChallenge.check(word)}
function server_lookup(A) {return JSON.parse(currentChallenge.lookup(A))}
function server_get_stats() {return JSON.parse(currentChallenge.get_stats())}
function server_get_challenge() {let r=currentChallenge.get_challenge(); return r}

var config = new Configuration();
function Configuration() {
	this.list = '';
	this.mc = false; // mode: multiple-choice
	this.mc_count = 3; // number of options shown with multiple-choice (min 3, max 8, default 3) (will also apply for check if mode is not mc)
	this.rrand = true; // ask in random order (own language<>foreign language)
	this.reverse = false; // always ask in reverse order (own language<>foreign language)
	this.delay_ok = 250; // delay if selected the correct answer, before switching to next question
	this.delay_error = 0; // delay if selected the wrong answer, before showing the correct answer
}

function go() {
	get(()=>{show_start()});
}
function get(callback) {
	// get list of Challenges from API
	callAPI('GET',window.location.href.replace(/[^/]*$/,'')+'api',{},(r)=>{
		if (IsJsonString(r)) {
			listOfChallenges=[];
			JSON.parse(r).forEach((i)=>{
				listOfChallenges.push(server_create_new_challenge(JSON.stringify(i.list),i.id));
				console.log(i.id,i.list);
			})
			listOfChallenges.sort((a,b)=>{return (a.id>b.id)?1:-1});
			listOfChallenges.push(server_create_new_challenge(TXTtoJSON(DEFAULT.text),DEFAULT.id));
		}
		callback();
	});
}
function callAPI(method,apicall,reqobj,callback) {
	if (!(apicall).startsWith('http')) {console.log('API-call to '+apicall+' aborted');callback();return true;}
	var t=stopwatch();
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {if (this.readyState == 4) {
		console.log(method+' '+apicall+': '+stopwatch(t)+'ms'); 
		if (this.status<500) {callback(this.responseText)} else {callback()}}
	};
	req.open(method,apicall,true);
	req.setRequestHeader("Content-Type","application/json;charset=UTF-8");
	req.send(JSON.stringify(reqobj));
}
function stopwatch(time) {if (typeof time != 'undefined') {return new Date()-time} else {return new Date()}}

function show_start(list,mc,mc_count,rrand,reverse,delay_ok,delay_error) {
	if (mc!==undefined) {config.mc=mc}
	if (mc_count!==undefined) {config.mc_count=mc_count}
	if (rrand!==undefined) {config.rrand=rrand}
	if (reverse!==undefined) {config.reverse=reverse}
	if (delay_ok!==undefined) {config.delay_ok=delay_ok}
	if (delay_error!==undefined) {config.delay_error=delay_error}
	let optionsList=undefined;
	// generate optionsList and select currentChallenge
	if (listOfChallenges.length>0) {
		let sel = document.createElement("select");
		sel.id='select_list';
		sel.onchange=()=>{sel.options[sel.selectedIndex].fkt()}
		let there_is_a_selected_option=false;
		listOfChallenges.forEach((le)=>{
			let opt = document.createElement("option");
			opt.value=le.id;
			opt.text=le.id;
			let select_this_one=currentChallenge&&(le.id==currentChallenge.id);
			there_is_a_selected_option=there_is_a_selected_option||select_this_one;
			if (currentChallenge) {opt.selected=select_this_one||undefined}
			opt.fkt=()=>{
				currentChallenge=server_create_new_challenge(JSON.stringify(le.list),le.id);
				show_start()
			};
			sel.appendChild(opt);
		});
		if (!there_is_a_selected_option) {
			currentChallenge=server_create_new_challenge(JSON.stringify(listOfChallenges[0].list),listOfChallenges[0].id);
		}
		optionsList=sel;
	}
	if (list!==undefined) {config.list=list} else {config.list=currentChallenge?LISTtoTXT(currentChallenge.list):'Hund = dog \nKatze = cat \nMaus = mouse'}
	let s=document.getElementById('stats');
	s.innerHTML='';
	let e=document.getElementById('main');
	e.innerHTML='';//'<div class=label><span style=font-weight:bold>VCBLRY*</span> input</div>';
	let advanced_options=' <a href=# onclick="ta.hidden=!ta.hidden">edit</a> | <a href=# onclick=open_upload_dialog()>import</a>';
	e.innerHTML+='<div class=label><span style=font-weight:bold>VCBLRY*</span> trainer &nbsp; '+advanced_options+'</div>';
	e.innerHTML+='<input id=import hidden type=file accept="application/json,text/plain" onchange="openFile(event,'+((v)=>{ta.value=v;updateVocabularyList();})+')">';
	let ta=document.createElement('textarea');
	let vl=document.createElement('div');
	vl.id='vl';
	ta.id='ta';
	ta.rows=10;
	ta.value=config.list;
	ta.placeholder=DEFAULT.placeholder;
	ta.hidden=!currentChallenge?false:(currentChallenge.id!=DEFAULT.id);
	if (optionsList!=undefined) {
		let e2=e.appendChild(optionsList);
		e2.focus();
	}
	let timeout=undefined;
	ta.onkeyup=function(){
		clearTimeout(timeout);
		timeout = setTimeout(function() {updateVocabularyList()}, 0);
	}
	e.appendChild(ta);

	// START-button
	newBUTTON(e,[],'btn','start',function(){
		config.list=ta.value;
		let currentID = document.getElementById('select_list')?document.getElementById('select_list').options[document.getElementById('select_list').selectedIndex].value:undefined;
		if ((currentID==DEFAULT.id)&&(ta.value)) {currentID = prompt('Please enter a name for your new list.\n(If you don\'t give it at name, it will not be saved.)','');}
		if (currentID==DEFAULT.id) {currentID=null}
		let currentList = TXTtoJSON(ta.value);
		if (!currentChallenge||(currentChallenge&&currentChallenge.id!=currentID)||(currentChallenge.not_answered&&currentChallenge.not_answered.length<1)) {
			currentChallenge = server_create_new_challenge(currentList,currentID);
		}
		
		// save Challenge to server	(don't know if it changed... we just do it)
		let out={};
		out.id=currentID;
		out.list=JSON.parse(currentList);
		if ((out.id!='')&&(out.id!==null)) {callAPI('POST',window.location.href.replace(/[^/]*$/,'')+'api',out,()=>{
			get(()=>{
				// server will delete Challenges with no content - if so, show_start instead of showing no questions
				if (out.list=='') {currentChallenge=undefined; show_start()} else {show_question()}
			});
		})} else {
			show_question();
		}

	});

	// OPTIONS-buttons
	let boodiv = document.createElement("div");
	boodiv.style.width='100%';
	boodiv.style.display='flex';
	// toogle A>B, B>A (config.reverse), A|B>B|A (config.rrand)
	let ab   = newBUTTON(boodiv,[],'btn_mini_off','A > B',function(){config.reverse=false; config.rrand=false; doboo()});
	let abba = newBUTTON(boodiv,[],'btn_mini_off','A|B > B|A',function(){config.rrand=true; doboo()});
	let ba   = newBUTTON(boodiv,[],'btn_mini_off','B > A',function(){config.reverse=true; config.rrand=false; doboo()});
	ab.style.flex='auto'; ab.style.borderRadius='0.4rem 0 0 0.4rem'; 
	abba.style.flex='auto'; abba.style.borderRadius='0'; 
	ba.style.flex='auto'; ba.style.borderRadius='0 0.4rem 0.4rem 0'; 
	e.appendChild(boodiv);
	// toogle multiple-choice-mode (config.mc)
	let mcb  = newBUTTON(e,[],'btn_mini_off','MC',function(){config.mc=!config.mc; doboo()});
	doboo();
	
	function doboo() {
		boo(ab,!config.rrand&&!config.reverse);
		boo(ba,!config.rrand&&config.reverse);
		boo(abba,config.rrand);
		boo(mcb,config.mc);
		function boo(e,on) {e.classList.toggle('btn_mini_off',!on); e.classList.toggle('btn_mini_on',on)}
	}

	e.appendChild(vl);
	updateVocabularyList();
}
function updateVocabularyList() {vl.innerHTML=createVocabularyList(JSON.parse(TXTtoJSON(ta.value,true)))}
function createVocabularyList(list,highlight_list) {
	// remove empty items/rows from list
	list=list.filter((i)=>{return i.A||i.B});
	return '<div class=vlHeader><span style=font-weight:bold>'+(currentChallenge?(currentChallenge.id||'VCBLRY*</span> list')+'</span>':'VCBLRY*</span> list')+' ('+list.length+')</div>'+list.reduce(function(a,c){
		let res='';
		// check if it's a valid word-tupel
		if (c.A&&c.B) {
			// check if item is included in hightlight_list
			if (highlight_list && highlight_list.some(function (i){return ((c.A==i.A)||(c.B==i.A))})) {
				res='<div><div class=vlAh>'+c.A+'</div><div class=vlBh>'+c.B+'</div></div><div class=clear></div>';
			} else {
				res='<div><div class=vlA>'+c.A+'</div><div class=vlB>'+c.B+'</div></div><div class=clear></div>';
			}
		}
		else if (c.A) {res='<div class=vlAB>'+c.A+'</div><div class=clear></div>';}
		return a+res;
	},'<div class=vl>')+'</div>';
}
function TXTtoJSON(list,get_res_all) {
	if (IsJsonString(list)) {return list}
	let l=list.split(/\n/);
	let res=[]; // contains all valid word-tupels
	let res_all=[]; // contains all rows (including unvalid ones)
	l.forEach(function(l){
		let w=l.trim().split(/\ {2,}|\t{1,}|\||=|:/);
		if (w.length==2&&w[0]&&w[1]) {
			let o=new Object; o.A=w[0].trim(); o.B=w[1].trim();
			res.push(o);
			res_all.push(o);
		} else {
			let o=new Object; o.A=l.trim(); o.B='';
			res_all.push(o);
		};
	})
	return JSON.stringify(get_res_all?res_all:res);
}
function IsJsonString(str) {let json=undefined; try {json=JSON.parse(str)} catch (e) {return false}; return json[0]?true:false}
function LISTtoTXT(list) {
	return list.reduce((a,c)=>{return a+c.A+' = '+c.B+'\n'},'');
}

function openFile(event,callback) {
	let reader=new FileReader();
	reader.readAsText(event.target.files[0]);
	reader.onload=()=>{callback(reader.result)};
};
function open_upload_dialog() {
	// select the last element of options-list (which always is the "create-new"-option)
	if (document.getElementById('select_list')) {document.getElementById('select_list')[document.getElementById('select_list').options.length-1].fkt()};
	document.getElementById('import').click();
}

function show_stats(s) {
	if (s==undefined) {s=server_get_stats()}
	let e=document.getElementById('stats');
	e.innerHTML='';
	while (s.ok>0) {s.ok--;	e.appendChild(newDOT('ok'));}
	while (s.todo>0) {s.todo--;	e.appendChild(newDOT());}
	while (s.assist-s.error>0) {s.assist--;	e.appendChild(newDOT('assist'));}
	while (s.error>0) {s.error--; e.appendChild(newDOT('error'));}
	if (e.lastchild) {e.lastChild.classList.add('last')};
	e.onclick=()=>{if (currentChallenge.id!=0) {show_start()} else {confirm('Do you want to quit?')?show_start():undefined}};
	function newDOT(cl) {let d=document.createElement('div'); d.classList.add('dot',cl); return d;}
}

function show_question(q,is_started,is_assist) {
	let e=document.getElementById('main');
	e.innerHTML='';
	if (q==undefined) {q=server_get_question(config.reverse||(config.rrand&&Math.random()>=0.5))}
	// this is the end
	if (q.A==undefined) {show_result(); return true;}
	let btn_list=[];

	newBUTTON(e,btn_list,'wordA',q.A);
	let assist_answer=undefined;
	if (is_assist) {assist_answer = server_lookup(q.A)}
	show_stats();

	if (is_started||config.mc) {
		let i = 0;
		while (i<q.B_list.length) {
			let cl='wordB';
			if (is_assist) {
				if (assist_answer.B==q.B_list[i]) {
					newBUTTON(e,btn_list,cl,q.B_list[i],function(){show_question()});
				}
			} else {				
				newBUTTON(e,btn_list,cl,q.B_list[i],function(){answer(this,btn_list)},new Word(q.A,q.B_list[i]));
			}
			i++;
		}
	} else {
		newBUTTON(e,[],'optionHELP','?',function(){show_question(q,true,true)});
		newBUTTON(e,[],'optionOK','ok',function(){show_question(q,true)});
	}
}

function answer(btn,btn_list) {
	btn_list.forEach(function(b){
		b.classList='word wordB_disabled';
		b.onclick=undefined;
	});
	if (server_check(btn.answer)) {
		btn.classList='word wordB_ok';
		setTimeout(function(){show_question()},config.delay_ok);
	} else {
		btn.classList='word wordB_error';
		let l = server_lookup(btn.answer.A);
		btn_list.forEach(function(b){
			if ((b.answer.B==l.B)||(b.answer.B==l.A)) {setTimeout(function(){b.classList='word wordB';b.onclick=function(){show_question()};},config.delay_error)}
		});
	}
	show_stats();
}

function show_result() {
	show_stats();
	let challenge = JSON.parse(server_get_challenge());
	let e=document.getElementById('main');
	let res='<div class=results>';
	//res+=challenge.list.length+' Vokabeln<br>';
	//res+='<div style=font-size:0.8rem><i>'+challenge.list[0].A+'</i> bis <i>'+challenge.list[challenge.list.length-1].A+'</i></div>';
	//if (challenge.lookups.length-challenge.wrong_answers.length>0) {res+=(challenge.lookups.length-challenge.wrong_answers.length)+' Hilfen<br>';}
	res+='<div style=font-size:3rem>'+(100-Math.round((challenge.wrong_answers.length/(challenge.list.length||1))*100))+'%</div>';
	//res+='<div style=font-size:0.8rem>'+challenge.wrong_answers.length+' Fehler</div><p>';
	res+='</div>';
	e.innerHTML=res;
	e.innerHTML+=createVocabularyList(challenge.list,challenge.lookups)+'<p>';
	newBUTTON(e,[],'btn','ok',function(){show_start()});
}

function newBUTTON(e,btn_list,cl,text,fnc,answer) {
	let d=document.createElement('button');
	d.classList.add('word',cl);
	d.innerHTML=text;
	d.onclick=fnc;
	d.answer=answer;
	e.appendChild(d);
	if (cl=='wordB') {btn_list.push(d)};
	return d;
}
