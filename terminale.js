// ==== MOTORE DEL TERMINALE — puro, senza DOM (testabile in node) ====
var HOME='/home/matte';
var BASE={dir:true,home:{dir:true,matte:{dir:true,
  'leggiomi.txt':'Aula Informatica — 20 moduli interattivi.\nOgni lezione è un file HTML: zoom continuo + 6 domande.\nIl percorso Advanced è in lab.html.\nVedi index.html per il corso base.',
  'appunti.txt':'APPUNTI DEL TERMINALE\n\nIl prompt matte@lab:~$ dice: sono matte, sul computer lab,\nnella tua cartella: ti ascolto.\n\nComandi che ti servono:\n  ls        elenca i file\n  cd        cambia cartella\n  pwd       dove sei\n  cat       leggi un file\n  man CMD   spiega un comando\n\nSegno: ~ = la tua cartella home. / = la radice.\nSei dentro ~/Compiti: digita cd .. per tornare indietro.',
  lezioni:{dir:true,
    '1.txt':'1. Le parole inglesi',
    '2.txt':'2. Chi fa cosa',
    '3.txt':'3. Dal testo al bit',
    '4.txt':'4. Dal pixel al bit',
    '5.txt':'5. Dal suono al bit',
    '6.txt':'6. La memoria',
    '7.txt':'7. File e cartelle',
    '8.txt':'8. Dentro il computer',
    '9.txt':'9. Le parole dei componenti',
    '10.txt':'10. Da internet al pacchetto',
    '11.txt':'11. Dal click al programma',
    '12.txt':'12. Le variabili',
    '13.txt':'13. Le condizioni',
    '14.txt':'14. I cicli',
    '15.txt':'15. Ordinare le cose',
    '16.txt':'16. L’impronta digitale',
    '17.txt':'17. Password e sicurezza',
    '18.txt':'18. Virus e antivirus',
    '19.txt':'19. L’IA che impara',
    '20.txt':'20. Fake news e fact-checking'},
  Compiti:{dir:true,
    'matematica.txt':'ESERCIZIO 3 — Derivate\n\nf(x) = 4x^3 - 3x + 1\nf\'(x) = 12x^2 - 3\n\nCompito per venerdì. Portare il libro.',
    'inglese.txt':'HOMEWORK — Present Perfect\n\nI have lived in Milan since 2019.\nShe has just left.\n\nRemember: ever/never, for/since, already/yet.'},
  Foto:{dir:true,'gita.jpg':'«binario: 2c ff d8 ff e0 ... 89504e47 ...»'},
  Musica:{dir:true}}},
  etc:{dir:true,hosts:'127.0.0.1  localhost\n::1        localhost'}};

var MAN={
  help:'Elenca tutti i comandi del terminale.',
  ls:'Elenca i file e le cartelle. Con un nome, mostra il contenuto di quella cartella.',
  pwd:'Stampa il percorso della cartella in cui ti trovi.',
  cd:'Cambia cartella. cd .. sale di un livello, cd ~ torna a casa, cd / va alla radice.',
  cat:'Mostra il contenuto di un file di testo. Funziona solo sui file di testo.',
  tree:'Disegna l’albero delle cartelle, a partire da dove sei.',
  echo:'Ripete quello che scrivi. Serve per capire come trattano gli spazi.',
  mkdir:'Crea una cartella nuova. mkdir Prove.',
  touch:'Crea un file vuoto. touch pippo.txt.',
  rm:'Cancella un file o una cartella vuota. Non si può annullare.',
  clear:'Pulisce il terminale.',
  man:'Spiega un comando. Prova: man ls'};

function isDir(n){return n&&n.dir===true}
function parts(p){return p.split('/').filter(Boolean)}
function at(abs){var n=FS;for(var i=0;i<parts(abs).length;i++){var k=parts(abs)[i];if(!isDir(n)||!(k in n))return null;n=n[k]}return (n===null||n===undefined)?null:n}
function normalize(cwd,p){
  p=(p||'').trim();
  if(!p)p='~';
  if(p==='~')p=HOME;
  else if(p==='~/'||p==='~')p=HOME;
  else if(p[0]=='/'||p[0]=='~'){if(p[0]=='~')p=HOME+p.slice(1)}
  else p=cwd+'/'+p;
  var out=[],segs=p.split('/');
  for(var i=0;i<segs.length;i++){
    var s=segs[i];
    if(!s||s==='.')continue;
    if(s==='..')out.pop();
    else out.push(s);
  }
  return '/'+out.join('/');
}
function disp(abs){return abs===HOME?'~':(abs.indexOf(HOME+'/')===0?'~'+abs.slice(HOME.length):abs)}
function isText(n){return typeof n==='string'&&n.charAt(0)!=='«'}
function err(t){return {lines:[{text:t,cls:'err'}]}}
function out(t,cls){return {lines:[{text:t,cls:cls||'out'}]}}

// wildcard: nome che contiene *
function match(pat,name){
  if(pat.indexOf('*')<0)return pat===name;
  var re=new RegExp('^'+pat.split('*').map(function(x){return x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}).join('.*')+'$');
  return re.test(name);
}
function resolveTargets(cwd,arg,wantDir){
  if(!arg)return {node:at(cwd),abs:cwd};
  var abs0=arg[0]==='/';var seg=arg.split('/'),acc=[];
  for(var i=0;i<seg.length;i++){if(!seg[i])continue;acc.push(seg[i]);if(i<seg.length-1){
    var sub=acc.join('/');if(abs0)sub='/'+sub;var a=normalize(cwd,sub);if(!isDir(at(a)))return null;}}
  var abs=normalize(cwd,arg),node=at(abs);
  if(node===null)return null;
  return {node:node,abs:abs};
}

var CMD={
help:function(st,args){
  var ks=Object.keys(MAN).sort(),out=[];
  out.push('comandi disponibili:');
  ks.forEach(function(k){out.push('  '+k)});
  out.push('');
  out.push('man <comando>  spiega un comando.  clear  pulisce.');
  return {lines:out.map(function(t){return {text:t,cls:'out'}})};
},
ls:function(st,args){
  var pat=args[0]||null;
  var hasWild=!!pat&&pat.indexOf('*')>=0;
  var t=hasWild?{node:at(st.cwd),abs:st.cwd}:resolveTargets(st.cwd,pat,true);
  if(!t||!isDir(t.node))return err('ls: '+pat+': cartella non trovata');
  var ks=Object.keys(t.node).filter(function(k){return k!=='dir'});
  var dirs=hasWild?[]:ks.filter(function(k){return isDir(t.node[k])}).sort();
  var files=ks.filter(function(k){return !isDir(t.node[k])})
             .filter(function(k){return !pat||match(pat,k)}).sort();
  var lines=[],all=dirs.map(function(d){return d+'/'}).concat(files);
  if(!all.length)return out('(vuoto)');
  for(var i=0;i<all.length;i+=4)lines.push(all.slice(i,i+4).map(function(s){return '  '+s}).join(''));
  return {lines:lines.map(function(s){return {text:s,cls:'out'}})};
},
pwd:function(st){return out(st.cwd)},
cd:function(st,args){
  var abs=normalize(st.cwd,args[0]||'~'),n=at(abs);
  if(!n)return err('cd: '+args[0]+': cartella non trovata');
  if(!isDir(n))return err('cd: '+args[0]+': non è una cartella');
  st.cwd=abs;return {lines:[]};
},
cat:function(st,args){
  if(!args.length)return err('cat: devi dire quale file leggere');
  var lines=[],bad=false;
  args.forEach(function(a){
    var t=resolveTargets(st.cwd,a,false);
    if(!t){lines.push({text:'cat: '+a+': nessun file con questo nome',cls:'err'});bad=true;return}
    if(isDir(t.node)){lines.push({text:'cat: '+a+': è una cartella, non un file',cls:'err'});bad=true;return}
    if(!isText(t.node)){lines.push({text:a+': non è un file di testo (binario)',cls:'err'});bad=true;return}
    t.node.split('\n').forEach(function(l){lines.push({text:l,cls:'out'})});
  });
  return {lines:lines};
},
tree:function(st,args){
  var start=resolveTargets(st.cwd,args[0],true);
  if(!start||!isDir(start.node))return err('tree: '+args[0]+': cartella non trovata');
  var lines=[{text:disp(start.abs),cls:'out'}];
  (function walk(node,prefix,depth){
    if(depth>3)return;
    var ks=Object.keys(node).filter(function(k){return k!=='dir'}).sort();
    ks.forEach(function(k,i){
      var last=i===ks.length-1;
      lines.push({text:prefix+(last?'└── ':'├── ')+k+(isDir(node[k])?'/':''),cls:'out'});
      if(isDir(node[k]))walk(node[k],prefix+(last?'    ':'│   '),depth+1);
    });
  })(start.node,'',1);
  return {lines:lines};
},
echo:function(st,args){return out(args.join(' '))},
mkdir:function(st,args){
  if(!args.length)return err('mkdir: serve un nome');
  var abs=normalize(st.cwd,args[0]),n=at(abs);
  if(n)return err('mkdir: '+args[0]+': esiste già');
  st.root=st.root;var segs=parts(abs),parent=at('/'+segs.slice(0,-1).join('/'));
  if(!parent||!isDir(parent))return err('mkdir: '+args[0]+': cartella non trovata');
  parent[segs[segs.length-1]]={dir:true};return {lines:[]};
},
touch:function(st,args){
  if(!args.length)return err('touch: serve un nome');
  var abs=normalize(st.cwd,args[0]),n=at(abs),segs=parts(abs);
  var parent=at('/'+segs.slice(0,-1).join('/'));
  if(n)return {lines:[]};
  if(!parent||!isDir(parent))return err('touch: '+args[0]+': cartella non trovata');
  parent[segs[segs.length-1]]='';return {lines:[]};
},
rm:function(st,args){
  if(!args.length)return err('rm: serve un nome');
  var abs=normalize(st.cwd,args[0]),n=at(abs),segs=parts(abs);
  if(n===null)return err('rm: '+args[0]+': non esiste');
  if(isDir(n)&&Object.keys(n).filter(function(k){return k!=='dir'}).length)
    return err('rm: '+args[0]+': non vuota (usa rm -r, ma qui no)');
  var parent=at('/'+segs.slice(0,-1).join('/'));
  if(!parent)return err('rm: non puoi cancellare questo');
  delete parent[segs[segs.length-1]];
  return {lines:[]};
},
man:function(st,args){
  if(!args.length)return err('man: che comando vuoi sapere? prova: man ls');
  var c=args[0];
  if(!MAN[c])return err('man: nessun comando chiamato '+c);
  return out(MAN[c]);
},
clear:function(){return {lines:[],clear:true}}
};

function exec(state,line){
  line=(line||'').trim();
  if(!line)return {lines:[]};
  // pipe: solo "cat file | wc -l"
  if(line.indexOf('|')>=0){
    var pp=line.split('|').map(function(x){return x.trim()});
    if(pp.length===2&&pp[1]==='wc -l'){
      var catres=CMD.cat(state,pp[0].replace(/^cat\s+/,'').split(/\s+/));
      if(catres.lines.some(function(l){return l.cls==='err'}))return catres;
      return out(String(catres.lines.length));
    }
    return err('pipe: impara solo "cat file | wc -l"');
  }
  var sp=line.split(/\s+/),c=sp[0],args=sp.slice(1);
  if(!CMD[c])return err(c+': comando non trovato. Prova help.');
  return CMD[c](state,args);
}
function cloneFS(n){if(typeof n!=='object'||n===null)return n;var o={};for(var k in n)o[k]=cloneFS(n[k]);return o}
function newState(){FS=cloneFS(BASE);return {cwd:HOME}}
/* ═══════════════════════════════════════════════════════════════
   LABORATORIO — interfaccia condivisa, guidata dalla configurazione
   ═══════════════════════════════════════════════════════════════ */
var TCFG=null,labSt=null,taskI=0,labDone=false,hist=[],histP=0,labOpen=false;
function T$(id){return document.getElementById(id)}
function labEl(t,c){return '<span class="'+(c||'')+'">'+t+'</span>\n'}
function labPrint(t){var sc=T$('screen');if(!sc)return;sc.insertAdjacentHTML('beforeend',t.replace(/\n/g,'<br>').replace(/  /g,'&nbsp;&nbsp;'));sc.scrollTop=sc.scrollHeight}
function labPs(){return 'matte@lab:'+disp(labSt.cwd)+'$'}
function labPrompt(){
  T$('ps').textContent=labPs();
  labPrint(labEl(labPs(),'ok')+(!labDone&&taskI<TCFG.compiti.length?labEl('   compito '+(taskI+1)+' di '+TCFG.compiti.length,'dim'):''));
}
function labBanner(){
  var N=TCFG.compiti.length;
  if(labDone){
    T$('task').innerHTML='<span id="tprog">'+N+' / '+N+'</span><b>Laboratorio libero.</b> Il comando è tuo. Prova '+
      TCFG.libero.map(function(c){return '<b>'+c+'</b>'}).join(', ')+'.';
  }else if(taskI>=N){
    T$('task').innerHTML='<span id="tprog">'+N+' / '+N+'</span><b>Laboratorio completato</b> — trofeo <b>'+TCFG.labNome+'</b> sbloccato.';
  }else{
    T$('task').innerHTML='<span id="tprog">'+taskI+' / '+N+'</span>'+TCFG.compiti[taskI].q;
  }
}
function openLab(){
  labOpen=true;
  if(!labSt){labSt=newState();buildLab();}
  T$('lab').hidden=false;T$('q').hidden=true;
  T$('lad').style.visibility='hidden';
  if(T$('hud'))T$('hud').style.visibility='hidden';
  T$('ctl').style.display='none';
  labBanner();
  labPrint(labEl(TCFG.modulo+' — laboratorio del terminale','hi'));
  labPrint(labEl('Digita un comando e premi Invio. help elenca i comandi, man <nome> li spiega.','dim'));
  labPrompt();T$('in').focus();
}
function closeLab(){
  labOpen=false;
  T$('lab').hidden=true;T$('lad').style.visibility='visible';
  if(T$('hud'))T$('hud').style.visibility='visible';
  T$('ctl').style.display='flex';
}
function labWin(){
  try{
    var w=JSON.parse(localStorage.getItem('lab_badges')||'{}');
    if(w[TCFG.labKey])return;
    w[TCFG.labKey]=1;localStorage.setItem('lab_badges',JSON.stringify(w));
  }catch(e){}
  labPrint(labEl(''));
  labPrint(labEl('  ╔══════════════════════════════════╗','hi'));
  labPrint(labEl('  ║   TROFEO: '+pad(TCFG.labNome,25)+'║','hi'));
  labPrint(labEl('  ╚══════════════════════════════════╝','hi'));
  labPrint(labEl('  Hai finito i '+TCFG.compiti.length+' compiti. Il comando è tuo.','ok'));
  labBanner();
}
function pad(t,n){var s=String(t);while(s.length<n)s+=' ';return s}
function labRun(line){
  line=line||'';
  if(!line.trim()){labPrompt();return}
  hist.push(line);histP=hist.length;
  labPrint(labEl(labPs()+' '+line,'hi'));
  var r=exec(labSt,line);
  if(r.clear){T$('screen').innerHTML='';labPrompt();return}
  for(var i=0;i<r.lines.length;i++)labPrint(labEl(r.lines[i].text,r.lines[i].cls));
  var bad=r.lines.some(function(x){return x.cls==='err'});
  if(!labDone&&!bad&&taskI<TCFG.compiti.length&&TCFG.compiti[taskI].ok.test(line.trim())){
    labPrint(labEl('  ✓ '+TCFG.compiti[taskI].q.replace(/<[^>]+>/g,''),'ok'));
    taskI++;
    if(taskI>=TCFG.compiti.length){labDone=true;labWin()}else labBanner();
  }
  labPrompt();
}
function buildLab(){
  var d=document.createElement('div');d.id='lab';d.hidden=true;
  d.innerHTML='<div id="lhead"><b>laboratorio</b><small>'+TCFG.header+'</small>'+
    '<a id="lhome" href="'+(TCFG.home||'lab.html')+'">🏠 Corso</a><button id="lx">✕ Esci</button></div>'+
   '<div id="task"></div><div id="screen"></div>'+
   '<div id="inrow"><span id="ps"></span><input id="in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="linea di comando"></div>'+
   '<div id="chips"></div>';
  document.getElementById('st').appendChild(d);
  T$('lx').onclick=closeLab;
  T$('in').addEventListener('keydown',function(e){
    if(e.key==='Enter'){var v=T$('in').value;T$('in').value='';labRun(v);e.preventDefault()}
    else if(e.key==='ArrowUp'){if(histP>0){histP--;T$('in').value=hist[histP]}e.preventDefault()}
    else if(e.key==='ArrowDown'){if(histP<hist.length-1){histP++;T$('in').value=hist[histP]}else{histP=hist.length;T$('in').value=''}e.preventDefault()}
  });
  TCFG.chips.forEach(function(c){
    var b=document.createElement('button');b.textContent=c;
    b.onclick=function(){T$('in').value=c+' ';T$('in').focus()};
    T$('chips').appendChild(b);
  });
}
/* pulsante sulla card finale del quiz */
function labHookQuiz(){
  var q=T$('q');if(!q||T$('ql'))return;
  var b=document.createElement('button');b.id='ql';b.textContent='🖥️ Vai al laboratorio';
  b.onclick=openLab;q.appendChild(b);
}
/* terza scelta nella modale iniziale */
function labHookWelcome(){
  var box=document.getElementById('wquiz');
  if(!box||!box.parentNode||T$('wlab'))return;
  var b=document.createElement('button');b.id='wlab';b.textContent='🖥️ Laboratorio';
  b.onclick=function(){var w=T$('wstart');if(w)w.remove();openLab()};
  box.parentNode.insertBefore(b,box.nextSibling);
}
/* deep-link: arrivo diretto al laboratorio */
function labHookDeep(){
  if(typeof location==='undefined')return;
  if(!(location.hash==='#lab'||/[?&]lab\b/.test(location.search||'')))return;
  var w=T$('wstart');if(w)w.remove();
  var q=T$('qw');if(q)q.remove();
  openLab();
}
/* API pubblica */
function terminale(cfg){
  TCFG=cfg;
  /* il colore d'accento vive nella config: ogni modulo lo sceglie, il CSS condiviso lo usa */
  if(cfg&&cfg.acc&&typeof document!=='undefined'&&document.documentElement&&document.documentElement.style)
    document.documentElement.style.setProperty('--labacc',cfg.acc);
  labHookQuiz();labHookWelcome();
  var _p=setInterval(function(){if(T$('wstart')){clearInterval(_p);labHookWelcome()}},120);
  labHookDeep();
}
if(typeof module!=='undefined'&&module.exports)module.exports={terminale:terminale,exec:exec,newState:newState,at:at,isDir:isDir,disp:disp};
