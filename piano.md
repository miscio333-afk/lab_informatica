# Corso base di informatica — Piano

Corso per ragazzi delle superiori. Ogni lezione è un singolo file HTML autonomo:
zoom continuo (Three.js, algoritmo di van Wijk) + quiz bloccanti a ogni tappa.

## Come funziona ogni modulo

- 6 livelli annidati (canvas 2D dentro scene Three.js), zoom senza stacchi
- 6 domande multiple choice, una per tappa: lo slider/play si sbloccano solo con risposta esatta
- Card finale con punteggio "primo tentativo" + pulsante di restart
- Comandi: ▶/❚❚ play-pausa, slider per scrub, spazio = play-pausa
- All'avvio: scelta **"▶ Guarda la lezione"** (zoom libero, nessun quiz) oppure **"❓ Vai alle domande"**
- Alla fine del quiz: **"▶ Rivedi la lezione"** riapre lo zoom in modalità ripasso (pulsante ✕ per uscire)
- Solo dipendenza: Three.js r128 da CDN (senza rete la pagina resta nera)

## Moduli realizzati (cartella CII_pixel) — 20 moduli

L'ordine di questa tabella è quello del percorso didattico (vedi sotto), non quello di `index.html`.
Le trofei nel formato `m_xxx` sono le chiavi salvate in `localStorage` sotto `cii_badges`.

### Blocco 1 · Le parole e chi fa cosa

| # | Trofeo | File | Tema | Catena zoom |
|---|--------|------|------|-------------|
| 1 | 🎓 DIZIONARIO VIVENTE | Le parole inglesi | lessico generale | HARDWARE → hard+ware → soft+ware → file/folder → web/password/cloud → bit/bug/pixel (falena 1947) |
| 2 | 🏠 PADRONE DI CASA | Chi fa cosa | OS/app/browser/rete | frasi-confusione → OS padrone di casa → app inquiline → browser finestra sul cielo → Google bibliotecario → pila a strati (metafora CIELO: internet sopra tutto) |

### Blocco 2 · I dati diventano bit

| # | Trofeo | File | Tema | Catena zoom |
|---|--------|------|------|-------------|
| 3 | ✍️ SCRIBA DIGITALE | Dal testo al bit | testo → numeri → binario | pagina "Ciao" → parola → lettera C → codice 67 → 8 bit → interruttore 0/1 |
| 4 | 👑 RE DEI PIXEL | Dal pixel al bit | immagine → RGB → bit | (come da file) |
| 5 | 🎵 MAESTRO D'ONDA | Dal suono al bit | suono → campioni → bit | (come da file) |
| 6 | 🐘 MEMORIA DI FERRO | La memoria | unità di misura | film 2 GB → KB/MB/GB → byte → tabella pesi → 2¹⁰=1024 → bit |
| 7 | 🗂️ ARCHIVISTA SUPREMO | File e cartelle | organizzazione + backup | disegno → nome.estensione → scatole → albero → backup 2×2 → bit |

### Blocco 3 · L'hardware

| # | Trofeo | File | Tema | Catena zoom |
|---|--------|------|------|-------------|
| 8 | 🔧 CHIRURGO DEI CHIP | Dentro il computer | hardware fisico | **8 livelli, non 6**: case → scheda → corrente → RAM → SSD → GPU → CPU → transistor → bit |
| 9 | 🔤 CACCIATORE DI SIGLE | Le parole dei componenti | lessico hardware | sigle → motherboard → CPU/GPU → RAM/ROM → SSD/USB/HDMI → transistor |

### Blocco 4 · La rete

| # | Trofeo | File | Tema | Catena zoom |
|---|--------|------|------|-------------|
| 10 | 🌐 NAVIGATORE ESPERTO | Da internet al pacchetto | rete | chat → 3 pacchetti → IP → mappa nodi → protocollo → bit su cavo |

### Blocco 5 · Pensiero computazionale

| # | Trofeo | File | Tema | Catena zoom |
|---|--------|------|------|-------------|
| 11 | 🍕 PIZZAIOLO DEL CODICE | Dal click al programma | dal tap al codice | pulsante pizza → ricetta → 3 mattoni → codice → esecuzione cieca → bit |
| 12 | 📦 MAGO DELLE SCATOLE | Le variabili | memoria di lavoro | scatola punti=0 → 0→1 → punti/vite → tipi → punti+1 → 3 = due bit accesi |
| 13 | 🔀 GIUDICE SUPREMO | Le condizioni | se/allora | bivio → sì/no → rombo → if/else → E/O → vero/falso = 1/0 |
| 14 | 🔁 RE DELLA RIPETIZIONE | I cicli | ripetizioni | 100 fogli → 1 riga → contatore i → freno → loop infinito → contare in bit |
| 15 | 🫧 DOMATORE DI BOLLE | Ordinare le cose | algoritmi di ordinamento | 7 carte → confronto 5-vs-2 → scambio → passata → bolla dell'8 → bubble sort in 3 righe |

### Blocco 6 · Civiltà digitale (chiusura)

I 5 moduli nuovi. Condividono la struttura: **tutti partono da una situazione riconoscibile
dalla vita dello studente e finiscono su "…anche questo, alla fine, sono bit"**, chiudendo il
cerchio aperto dal Blocco 2.

| # | Trofeo | File | Catena zoom |
|---|--------|------|-------------|
| 16 | 🕵️ CACCIATORE DI TRACCE | Impronta digitale | storia "gratis?" → il like non è gratis (3 dati regalati) → il database non cancella → il profilo pubblicitario → l'asta in tempo reale → bit |
| 17 | 🔑 GUARDIA DELLE CHIAVI | Password e sicurezza | password ****** → l'hash (impronta a senso unico) → l'attacco a dizionario → la lunghezza batte i ghirigori → i due fattori (due lucchetti) → bit |
| 18 | 🦠 CACCIATORE DI VIRUS | Virus e antivirus | l'allegato sospetto → il contagio (1 file → tutta la rete) → l'antivirus guardia → gli aggiornamenti come vaccino → la quarantena → bit |
| 19 | 🤖 ALLENATORE DI IA | L'IA che impara | micio.jpg → 10 000 foto con etichetta → il modello (che cosa conta) → sbaglia e si corregge → indovina cose mai viste → bit |
| 20 | 📰 CACCIATORE DI BUFALE | Fake news e fact-checking | il post virale → l'emozione corre più del vero → la fonte fantasma → la foto rubata al passato → i 3 controlli → bit |

Demo/sperimentazioni (senza quiz): `index.html` (Aula Informatica — landing + bacheca trofei),
`demo-aula.html`, `Zoom senza fine — dalla scrivania ai numeri.html`.

Extra: `Milionario dei pixel.html` (gioco a squadre, 6 domande + 3 aiuti), `masterclass.html`
(diploma, sbloccato a 20 trofei).

## Ordine consigliato in classe

1. **Le parole inglesi** (toglie la paura, gancio leggero)
2. **Chi fa cosa** (mette ordine: OS/app/browser/rete)
3. **Testo → pixel → suono → memoria → file e cartelle** (i dati)
4. **Dentro il computer + parole dei componenti** (l'hardware)
5. **Internet/pacchetti** (la rete; frase-ponte: "i pacchetti viaggiano nelle onde del cielo-rete")
6. **Click→programma → variabili → condizioni → cicli → ordinare** (pensiero computazionale, in quest'ordine)
7. **Impronta → password → virus → IA → fake news** (civiltà digitale: privacy, sicurezza, percezione)

Ogni modulo = ~1 ora con discussione + mini-laboratorio suggerito nelle card.
Corso completo = 20 ore. Con il Blocco 6 diventa un percorso di **informatica + cittadinanza
digitale** adatto anche a un secondo anno.

## Moduli proposti, non ancora realizzati

- Diritto d'autore e licenze (copyright → Creative Commons → citare le fonti)
- Tabelle e fogli di calcolo (righe/colonne → formule che ricalcolano)
- L'email viaggia davvero? (lettera → server postali → recapito)
- I backup sul serio (2-3-1, copia offline, la regola del 3-2-1)

## Note tecniche / debiti

### Strutturali (ancora da fare)

- `masterclass.html`: la soglia è `n>=20` ma la mappa dei trofei da stampare sul diploma
  ne contiene **solo 15** → i 5 trofei del Blocco 6 non vengono mai elencati. **Bug aperto.**
- `CIIBADGES` (presente in tutti i 20 moduli HTML) ha **chiavi duplicate** in 3 file:
  Fake news (`m_ia`, `m_password`, `m_virus`), IA (`m_ia`), Virus (`m_virus`).
  Innocuo a runtime (stesso valore), ma da ripulire in un cleanup.

### Audio

- I 15 moduli storici usano `opt{N}_{M}.mp3` (lettura di ogni opzione di risposta, 45 file/cartella)
- I 5 moduli nuovi usano `ltr_{a..d}.mp3` (una voce per opzione, 25 file/cartella)
- **4 cartelle su 5 dei moduli nuovi sono placeholder**: `audio-password`, `audio-virus`,
  `audio-ia`, `audio-fakenews` hanno `q*.mp3` da 3,8 KB / 0,40 s (identici byte per byte,
  ≈ silenzio). Solo `audio-impronta` contiene voce TTS reale (3,97 s).
  Tutti gli `src` puntano a file esistenti → nessun 404, ma **4 moduli su 5 si leggono senza voce**.
- Audio legacy/orfano da valutare: `audio-lettere-ollio/`, `audio-lettere-stanlio/`,
  `audio-lettere-toto/`, `audio-letters/`, `audio-milionario15/`

### Debiti noti (ereditati)

- Three.js r128 da cdnjs: nessun fallback offline; valutare copia locale di three.min.js
- `roundRect` con fallback a `rect` su browser vecchi
- Slider durante `playing`: possibile salto di `tm` (manca flag "seeking")
- Quiz mescolati con `Math.random`: non deterministici, nessun deep-link alla domanda
- Persistenza: `localStorage` unico per browser/dispositivo → il progresso si perde cambiando pc
- Accessibilità: canvas senza testo alternativo, slider senza `aria-valuetext`
- Emoji nei canvas: resa dipendente dal sistema (verificare su PC scolastici)