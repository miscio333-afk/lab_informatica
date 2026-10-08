/* ══════════════════════════════════════════════════════════════════════
   INGRESSI — i tre modi in cui si arriva a un pannello di laboratorio.

   Condiviso da ogni motore (terminale.js, binario.js): prima esisteva solo
   dentro terminale.js, e un secondo motore avrebbe significato copiare
   venti righe — con dentro la trappola che aveva reso morto "Laboratorio"
   per tre moduli.

   LA TRAPPOLA, per iscritto: il pulsante della modale iniziale può essere
   scritto a mano nel modulo. Se la guardia dice "se esiste, esci", il
   pulsante resta in pagina senza handler: sembra cliccabile e non fa
   niente. È successo. Quindi qui la guardia dice "se esiste, aggancialo":
  |idempotente vuol dire che non ne creo due, non che non lo tocco.

   Contratto:
     ingressi({
       apri:            funzione da chiamare quando cliccano
       etichettaQuiz:   testo del pulsante sulla card finale del quiz
       etichettaBenvenuto: testo del pulsante nella modale iniziale
       card:            id del contenitore dove mettere il pulsante quiz
       hash:            parola del deep-link, senza il '#'
     })

   Restituisce {card, benvenuto, profondo} cosi' un motore puo' richiamarle.
   ══════════════════════════════════════════════════════════════════════ */
function ingressi(o){
  function T(id){return document.getElementById(id)}

  /* 1 — pulsante sulla card finale del quiz */
  function card(){
    var q=T(o.card);if(!q)return;
    var b=T('ql');
    if(!b){
      b=document.createElement('button');b.id='ql';
      b.textContent=o.etichettaQuiz||'Vai al laboratorio';
      q.appendChild(b);
    }
    b.onclick=function(){o.apri()};
  }

  /* 2 — terza scelta nella modale iniziale */
  function benvenuto(){
    var box=T('wquiz');
    if(!box||!box.parentNode)return;
    var b=T('wlab');
    if(!b){
      b=document.createElement('button');b.id='wlab';
      b.textContent=o.etichettaBenvenuto||'Laboratorio';
      box.parentNode.insertBefore(b,box.nextSibling);
    }
    b.onclick=function(){var w=T('wstart');if(w)w.remove();o.apri()};
  }

  /* 3 — deep-link: arrivo diretto al pannello */
  function profondo(){
    if(typeof location==='undefined')return;
    var h=String(o.hash||'lab');
    if(!(location.hash==='#'+h||new RegExp('[?&]'+h+'\\b').test(location.search||'')))return;
    var w=T('wstart');if(w)w.remove();
    var q=T('qw');if(q)q.remove();
    o.apri();
  }

  card();benvenuto();profondo();
  /* Aggancio subito quello che c'e', poi riprovo qualche volta e smetto.
     Chiamare subito conta: se l'intervallo viene rallentato o bloccato —
     e in una scheda in secondo piano lo succede — il pulsante deve esserci
     lo stesso. Il vecchio interval del terminale girava per sempre. */
  var tentativi=0;
  var _p=setInterval(function(){
    benvenuto();card();
    if(++tentativi>3)clearInterval(_p);        /* ~0,5 s: il pulsante c'e' gia' */
  },120);
  if(typeof _p==='object'&&_p&&_p.unref)_p.unref();

  return {card:card,benvenuto:benvenuto,profondo:profondo};
}
if(typeof module!=='undefined'&&module.exports)module.exports={ingressi:ingressi};
