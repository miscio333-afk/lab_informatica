# Corso base di informatica — Piano

Corso per ragazzi delle superiori. Ogni lezione è un singolo file HTML autonomo:
zoom continuo (Three.js, algoritmo di van Wijk) + quiz bloccanti a ogni tappa.

## Come funziona ogni modulo

- 6 livelli annidati (canvas 2D dentro scene Three.js), zoom senza stacchi
- 6 domande multiple choice, una per tappa: lo slider/play si sbloccano solo con risposta esatta
- Card finale con punteggio "primo tentativo" + pulsante di restart
- Comandi: ▶/❚❚ play-pausa, slider per scrub, spazio = play-pausa
- Solo dipendenza: Three.js r128 da CDN (senza rete la pagina resta nera)

## Moduli realizzati (cartella CII_pixel)

| # | File | Tema | Catena zoom |
|---|------|------|-------------|
| 1 | Dal testo al bit | testo → numeri → binario | pagina "Ciao" → parola → lettera C → codice 67 → 8 bit → interruttore 0/1 |
| 2 | Dal pixel al bit | immagine → RGB → bit | (come da file) |
| 3 | Dal suono al bit | suono → campioni → bit | (come da file) |
| 4 | Dentro il computer | hardware fisico | case → scheda → CPU → transistor → bit |
| 5 | La memoria | unità di misura | film 2 GB → KB/MB/GB → byte → tabella pesi → 2¹⁰=1024 → bit |
| 6 | Da internet al pacchetto | rete | chat → 3 pacchetti → IP → mappa nodi → protocollo → bit su cavo |
| 7 | Le parole inglesi | lessico generale | HARDWARE → hard+ware → soft+ware → file/folder → web/password/cloud → bit/bug/pixel (falena 1947) |
| 8 | Le parole dei componenti | lessico hardware | sigle → motherboard → CPU/GPU → RAM/ROM → SSD/USB/HDMI → transistor |
| 9 | Chi fa cosa | OS/app/browser/rete | frasi-confusione → OS padrone di casa → app inquiline → browser finestra sul cielo → Google bibliotecario → pila a strati (metafora CIELO: internet sopra tutto) |
| 10 | Ordinare le cose | algoritmi di ordinamento | 7 carte → confronto 5-vs-2 → scambio → passata → bolla dell'8 → bubble sort in 3 righe |
| 11 | File e cartelle | organizzazione + backup | disegno → nome.estensione → scatole → albero → backup 2×2 → bit |
| 12 | Dal click al programma | dal tap al codice | pulsante pizza → ricetta → 3 mattoni → codice → esecuzione cieca → bit |
| 13 | Le condizioni | se/allora | bivio → sì/no → rombo → if/else → E/O → vero/falso = 1/0 |
| 14 | I cicli | ripetizioni | 100 fogli → 1 riga → contatore i → freno → loop infinito → contare in bit |
| 15 | Le variabili | memoria di lavoro | scatola punti=0 → 0→1 → punti/vite → tipi → punti+1 → 3 = due bit accesi |

Demo/sperimentazioni (senza quiz): `index.html` (Aula Informatica — zoom 3D Three.js),
`Zoom senza fine — dalla scrivania ai numeri.html`.

## Ordine consigliato in classe

1. Le parole inglesi (toglie la paura, gancio leggero)
2. Chi fa cosa (mette ordine: OS/app/browser/rete)
3. Testo → pixel → suono → memoria → file e cartelle (i dati)
4. Dentro il computer + parole dei componenti (l'hardware)
5. Internet/pacchetti (la rete; frase-ponte: "i pacchetti viaggiano nelle onde del cielo-rete")
6. Click→programma → variabili → condizioni → cicli → ordinare (pensiero computazionale, in quest'ordine)
7. Chiusura a scelta tra i proposti sotto

Ogni modulo = ~1 ora con discussione + mini-laboratorio suggerito nelle card.

## Moduli proposti, non ancora realizzati

- Password e sicurezza (hash → brute force: "quanto tempo per indovinarla?")
- Virus e antivirus (contagio → guardia → aggiornamenti/vaccini)
- L'IA che impara (foto → esempi → modello → previsione)
- La tua impronta digitale (like/storie → chi li vede davvero)
- Fake news e fact-checking (post → fonte → verifica)
- Diritto d'autore e licenze (copyright → Creative Commons → citare le fonti)
- Tabelle e fogli di calcolo (righe/colonne → formule che ricalcolano)
- L'email viaggia davvero? (lettera → server postali → recapito)

## Note tecniche / debiti

- Three.js r128 da cdnjs: nessun fallback offline; valutare copia locale di three.min.js
- `roundRect` con fallback a `rect` su browser vecchi
- Slider durante `playing`: possibile salto di `tm` (manca flag "seeking")
- Quiz mescolati con `Math.random`: non deterministici, nessun deep-link alla domanda
- Nessuna persistenza (localStorage): il progresso si perde al reload
- Accessibilità: canvas senza testo alternativo, slider senza `aria-valuetext`
- Emoji nei canvas: resa dipendente dal sistema (verificare su PC scolastici)
