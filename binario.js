/* ══════════════════════════════════════════════════════════════════════
   BINARIO — il secondo motore del percorso Advanced.

   Non e' una shell: e' un foglio per i numeri. Ci scrivi un numero o una
   addizione, e ti dice le tre maniere di leggerlo, con il riporto che
   avanza una colonna alla volta.

   Perche' un secondo motore e non una riga dentro terminale.js: un
   calcolatore binario non e' un prompt di shell. Gli ingressi invece sono
   condivisi perche' quelli si', e stanno in ingressi.js.

   CONVENZIONE sugli equivalenti. Il campo e' un modulo sul binario, quindi
   quello che scrivi e' binario: 1010 vale 10. Con un prefisso scegli gli
   altri: d10 vale 10 in decimale, xA vale 10 in esadecimale. I prefissi
   sono quelli veri di C, Python e Java: non sono un vezzo di questo esercizio.

   ══════════════════════════════════════════════════════════════════════ */

/* ── lettura di un numero ───────────────────────────────────────────── */
var BASI={b:2,d:10,x:16};

function leggiValore(t){
  t=String(t==null?'':t).trim();
  if(!t)return {err:'non hai scritto niente'};
  var base=2,resto=t;
  var m=/^([bdx])(.+)$/i.exec(t);
  if(m){base=BASI[m[1].toLowerCase()];resto=m[2]}
  /* ordine importante: in esadecimale le cifre sono 0-9 e a-f, quindi il
     controllo su g-z va PRIMA di quello generico. Prima era dopo, e non lo
     raggiungeva mai: il messaggio dedicato era codice morto. */
  if(base===16&&/[g-zG-Z]/.test(resto))
    return {err:'in esadecimale le cifre vanno da 0 a 9 e poi da a a f: «'+t+'» va oltre.'};
  if(!/^[0-9a-fA-F]+$/.test(resto))
    return {err:'«'+t+'» non è un numero: ci sono caratteri che non sono cifre.'};
  if(base===2&&/[2-9]/.test(resto)){
    var fuori=resto.match(/[2-9]/)[0];
    return {err:'in binario le cifre sono solo 0 e 1, e in «'+t+'» c’è anche il '+fuori
             +'. Se intendevi un numero decimale, mettici davanti la d: d'+resto};
  }
  var n=parseInt(resto,base);
  if(isNaN(n))return {err:'«'+t+'» non l’ho capito.'};
  return {n:n,base:base,testo:t};
}

/* un numero con il suo prefisso, per riecheggiarlo */
function conPrefisso(n,base){
  if(base===10)return 'd'+n;
  if(base===16)return 'x'+n.toString(16).toUpperCase();
  return '0b'+n.toString(2);
}
function inBinario(n){return n.toString(2)}

/* ── l'addizione, colonna per colonna ──────────────────────────────────
   Non e' una scorciatoia: e' un ciclo da destra a sinistra che porta un
   riporto. Ed e' la descrizione letterale di quello che fa un processore. */
function sommaBin(a,b){
  var L=Math.max(a.length,b.length),A=a.split(''),B=b.split('');
  while(A.length<L)A.unshift('0');
  while(B.length<L)B.unshift('0');
  var riporto=0,colonne=[];
  for(var i=L-1;i>=0;i--){
    var x=+A[i],y=+B[i],s=x+y+riporto;
    var scrivi=s%2,nuovo=s>=2?1:0;
    colonne.push({i:i,a:A[i],b:B[i],r:riporto,s:s,scrivi:scrivi,riporto:nuovo});
    riporto=nuovo;
  }
  colonne.reverse();
  var corpo='';
  for(var j=0;j<colonne.length;j++)corpo+=colonne[j].scrivi;
  return {colonne:colonne,risultato:(riporto?'1':'')+corpo,riportoFinale:riporto};
}
function rigaColonna(c){
  return 'bit '+c.i+':  '+c.a+'+'+c.b+(c.r?'+'+c.r:'')+' = '+c.s
       +'   →   scrivi '+c.scrivi+(c.riporto?', il riporto riparte':'');
}

/* ── il comando, come risposta ──────────────────────────────────────── */
var BYTE=8;

function analizza(linea){
  var t=String(linea==null?'':linea).trim();
  if(!t)return {vuoto:true};
  var p=/^(\S+)\s*\+\s*(\S+)$/.exec(t);
  if(p){
    var a=leggiValore(p[1]),b=leggiValore(p[2]);
    if(a.err)return {err:a.err};
    if(b.err)return {err:b.err};
    var s=sommaBin(inBinario(a.n),inBinario(b.n));
    return {tipo:'somma',a:a,b:b,s:s,
            testo:conPrefisso(a.n,a.base)+' + '+conPrefisso(b.n,b.base)+' = 0b'+s.risultato};
  }
  var v=leggiValore(t);
  if(v.err)return {err:v.err};
  return {tipo:'numero',v:v,
          testo:'0b'+inBinario(v.n)+'  =  d'+v.n+'  =  x'+v.n.toString(16).toUpperCase()};
}

/* l'overflow, detto per bene: quando il risultato non entra in un byte il
   computer NON avvisa. E' il punto onesto del modulo. */
function notaOverflow(n){
  if(n<=BYTE)return '';   /* 8 bit entrano in un byte: l'avviso parte da 9 */
  return 'il risultato ha '+n+' bit: in un byte ('+BYTE+' bit) non ci sta. Un computer che '
       +'tiene '+BYTE+' bit perde la cifra che non entra, e non dice niente.';
}

/* ── lo stato del laboratorio ───────────────────────────────────────── */
var BCFG=null,taskI=0,labDone=false,hist=[],histP=0,labOpen=false;
var _hookBin=null;

function B$(id){return document.getElementById(id)}
function bePt(){return 'binario@lab:~$'}
function bEl(t,c){return '<span class="'+(c||'')+'">'+t+'</span>\n'}
function bPrint(t){var sc=B$('bscreen');if(!sc)return;
  sc.insertAdjacentHTML('beforeend',t.replace(/\n/g,'<br>').replace(/  /g,'&nbsp;&nbsp;'));
  sc.scrollTop=sc.scrollHeight}
function bPrompt(){
  B$('bps').textContent=bePt();
  bPrint(bEl(bePt(),'ok')+(labDone?'':
    bEl('   compito '+(taskI+1)+' di '+BCFG.compiti.length,'dim')));
}
function bBanner(){
  var N=BCFG.compiti.length,box=B$('btask');
  if(!box)return;
  if(labDone){
    box.innerHTML='<span id="tprog">'+N+' / '+N+'</span><b>Laboratorio libero.</b> Prova '
      +BCFG.esempi.map(function(c){return '<b>'+c+'</b>'}).join(', ')+'.';
  }else if(taskI>=N){
    box.innerHTML='<span id="tprog">'+N+' / '+N+'</span><b>Laboratorio completato</b> — trofeo <b>'
      +BCFG.labNome+'</b> sbloccato.';
  }else{
    box.innerHTML='<span id="tprog">'+taskI+' / '+N+'</span>'+BCFG.compiti[taskI].q;
  }
}
function bOpen(){
  labOpen=true;
  if(!B$('blab'))buildBin();
  B$('blab').hidden=false;
  var q=B$('q');if(q)q.hidden=true;
  var l=B$('lad');if(l)l.style.visibility='hidden';
  var h=B$('hud');if(h)h.style.visibility='hidden';
  var c=B$('ctl');if(c)c.style.display='none';
  bBanner();
  bPrint(bEl(BCFG.modulo+' — laboratorio dei numeri','hi'));
  bPrint(bEl('Quello che scrivi è binario (1010). Con un prefisso scegli gli altri: '
             +'d255 decimale, xFF esadecimale. Per sommare: 1010 + 11.','dim'));
  bPrompt();
  B$('bin').focus();
}
function bClose(){
  labOpen=false;
  B$('blab').hidden=true;
  var l=B$('lad');if(l)l.style.visibility='visible';
  var h=B$('hud');if(h)h.style.visibility='visible';
  var c=B$('ctl');if(c)c.style.display='flex';
}
function bWin(){
  try{
    var w=JSON.parse(localStorage.getItem('lab_badges')||'{}');
    if(w[BCFG.labKey])return;
    w[BCFG.labKey]=1;localStorage.setItem('lab_badges',JSON.stringify(w));
  }catch(e){}
  bPrint(bEl(''));
  bPrint(bEl('  ╔══════════════════════════════════╗','hi'));
  bPrint(bEl('  ║   TROFEO: '+pad(BCFG.labNome,25)+'║','hi'));
  bPrint(bEl('  ╚══════════════════════════════════╝','hi'));
  bPrint(bEl('  Hai finito i '+BCFG.compiti.length+' compiti. Adesso conta tu.','ok'));
  bBanner();
}
function pad(t,n){var s=String(t);while(s.length<n)s+=' ';return s}

function bRun(line){
  line=line==null?'':line;
  if(!line.trim()){bPrompt();return}
  hist.push(line);histP=hist.length;
  bPrint(bEl(bePt()+' '+line,'hi'));
  var r=analizza(line);
  if(r.vuoto){bPrompt();return}
  if(r.err){bPrint(bEl('  '+r.err,'err'));bPrompt();return}
  bPrint(bEl('  '+r.testo,'out'));
  if(r.tipo==='somma'){
    for(var i=0;i<r.s.colonne.length;i++)bPrint(bEl('  '+rigaColonna(r.s.colonne[i]),'dim'));
    var ov=notaOverflow(r.s.risultato.length);
    if(ov)bPrint(bEl('  ! '+ov,'err'));
  }
  var compito=taskI<BCFG.compiti.length?BCFG.compiti[taskI]:null;
  if(!labDone&&compito&&compito.ok.test(line.trim())){
    bPrint(bEl('  ✓ '+compito.q.replace(/<[^>]+>/g,''),'ok'));
    taskI++;
    if(taskI>=BCFG.compiti.length){labDone=true;bWin()}else bBanner();
  }
  bPrompt();
}

function buildBin(){
  var d=document.createElement('div');d.id='blab';d.hidden=true;
  d.innerHTML='<div id="lbhead"><b>laboratorio</b><small>'+BCFG.header+'</small>'
    +'<a id="lbhome" href="'+(BCFG.home||'lab.html')+'">🏠 Corso</a>'
    +'<button id="lbx">✕ Esci</button></div>'
    +'<div id="btask"></div><div id="bscreen"></div>'
    +'<div id="binrow"><span id="bps"></span><input id="bin" autocomplete="off" '
    +'autocapitalize="off" autocorrect="off" spellcheck="false" '
    +'aria-label="numero in binario"></div>'
    +'<div id="bchips"></div>';
  document.getElementById('st').appendChild(d);
  B$('lbx').onclick=bClose;
  B$('bin').addEventListener('keydown',function(e){
    if(e.key==='Enter'){var v=B$('bin').value;B$('bin').value='';bRun(v);e.preventDefault()}
    else if(e.key==='ArrowUp'){if(histP>0){histP--;B$('bin').value=hist[histP]}e.preventDefault()}
    else if(e.key==='ArrowDown'){
      if(histP<hist.length-1){histP++;B$('bin').value=hist[histP]}
      else{histP=hist.length;B$('bin').value=''}e.preventDefault()}
  });
  (BCFG.esempi||[]).forEach(function(c){
    var b=document.createElement('button');b.textContent=c;
    b.onclick=function(){B$('bin').value=c+' ';B$('bin').focus()};
    B$('bchips').appendChild(b);
  });
}

/* ── API pubblica ──────────────────────────────────────────────────── */
function binario(cfg){
  BCFG=cfg;
  if(cfg&&cfg.acc&&typeof document!=='undefined'&&document.documentElement
     &&document.documentElement.style)
    document.documentElement.style.setProperty('--labacc',cfg.acc);
  _hookBin=ingressi({
    apri:bOpen,
    etichettaQuiz:'🧮 Vai al laboratorio',
    etichettaBenvenuto:'🧮 Laboratorio',
    card:'q',
    hash:'lab'
  });
}
if(typeof module!=='undefined'&&module.exports)module.exports={
  binario:binario, analizza:analizza, sommaBin:sommaBin, leggiValore:leggiValore,
  bRun:bRun, inBinario:inBinario, notaOverflow:notaOverflow, rigaColonna:rigaColonna
};
