# -*- coding: utf-8 -*-
"""1) corregge i due bug ortografici reali trovati dal gate
   2) corregge la regola sull'elisione, che segnalava 'un altro' (corretto:
      solo il femminile elide, un'altra / un'ora)"""
import re, glob

# ---------- 1. bug reali nei moduli ----------
BUG = [
    ("cosa cè ", "cosa c'è "),
    ("se non cè ", "se non c'è "),
    ("dopo un ora", "dopo un'ora"),
]
corretti = 0
for f in sorted(glob.glob("*.html")):
    s = open(f, encoding="utf-8").read()
    orig = s
    for a, b in BUG:
        # dentro stringhe JS a apici singoli l'apostrofo va scappato
        s = s.replace(a, b.replace("'", "\\'"))
    if s != orig:
        n = sum(orig.count(a) for a, _ in BUG)
        open(f, "w", encoding="utf-8").write(s)
        print("  %-46s %d correzioni" % (f[:44], n))
        corretti += n

# ---------- 2. verifica: nessun c'è spoglio, nessun un + femminile ----------
residui = []
for f in sorted(glob.glob("*.html")):
    s = open(f, encoding="utf-8").read()
    for m in re.finditer(r"(?<![A-Za-zÀ-ÿ])cè(?![A-Za-zÀ-ÿ])", s):
        residui.append((f, m.group(0)))
    for m in re.finditer(r"(?<![A-Za-zÀ-ÿ])un (?:ora|immagine|amica|idea|ultima|operazione)(?![A-Za-zÀ-ÿ])", s):
        residui.append((f, m.group(0)))
assert not residui, "residui: %s" % residui[:6]
print("  nessun 'cè' spoglio, nessuna elisione femminile mancante ✅")
print("  corretti in tutto: %d" % corretti)

# ---------- 3. sintassi ----------
import subprocess
for f in sorted(glob.glob("*.html")):
    r = subprocess.run(["node", "-e",
        "const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');let ok=true;"
        "for(const m of s.matchAll(/<script(?:(?!src)[^>])*>([\\s\\S]*?)<\\/script>/g))"
        "{try{new Function(m[1])}catch(e){ok=false;console.log(e.message)}}"
        "console.log(ok?'OK':'ERRORE')", f], capture_output=True, text=True)
    esito = r.stdout.strip().split("\n")[-1]
    if esito != "OK":
        print("  ⚠ %-44s %s" % (f[:44], esito))
print("  sintassi ricontrollata su tutti i file")
