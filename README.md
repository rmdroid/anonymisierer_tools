# Anonymisierer-Tools: vollständige Produktfamilie DE/EN

Ziel: https://anonymisierer-tools.de/ — lokal fertig gebaut, noch nicht veröffentlicht.

`index.html` direkt im Browser öffnen. Kein Webserver und keine Installation erforderlich. Unterordner und Dateien zusammenlassen. `styles.css`, `site.js` und `privacy.js` werden von allen Plattformen genutzt. Bilder sind separate lokale Dateien. Die Mac-Beispieldemo bleibt direkt in der jeweiligen HTML.

## Seiten

| Produkt | Deutsch | Englisch |
| --- | --- | --- |
| Mac | index.html | index_eng.html |
| iPhone/iPad | ios/index.html | ios/index_eng.html |
| Chrome | chrome/index.html | chrome/index_eng.html |
| Windows-Vormerkung | windows/index.html | windows/index_eng.html |

Der Sprachwechsel hält die jeweilige Plattform. Produktlinks bleiben innerhalb des neuen Auftritts. Die bisherige separate Web-Demo und externe Store-/Kontaktziele bleiben extern. Windows ist ausdrücklich geplant, ohne zugesagtes Datum, Preis oder fertigen Funktionsumfang.

Mac bleibt die Startseite mit Beispieldemo, echten App-Ansichten, Einzel-, Zehner- und Volumenlizenzen. Die iOS-Seiten zeigen echte iPhone- und iPad-Aufnahmen, lokale Text-/Bildbearbeitung, Teilen-Menü und die Grenze der PDF-Textausgabe. Die Chrome-Seiten zeigen die echte Erweiterung, kostenlosen Store-Einstieg und die optionale lokale Gemini-Nano-Erkennung. Es werden keine Mac-Funktionen auf andere Produkte übertragen.

## Lemon Squeezy: Ursache und Korrektur

Der entfernte eigene Lazy-Loader lud Lemon.js erst beim Kaufklick. Das tatsächlich ausgelieferte Skript initialisiert `window.LemonSqueezy` jedoch beim `window.load`-Ereignis. Dieses Ereignis war dann bereits vorbei. Deshalb zeigte der alte Code trotz geladenem Skript einen Fehler.

Jetzt gilt exakt das Muster der funktionierenden Originalseite:

- Kaufverweise mit der Klasse `lemonsqueezy-button`.
- Reguläres `<script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>` auf beiden Mac-Seiten.
- Kein eigener Checkout-Loader, kein zusätzliches `Url.Open`, kein erzwungenes neues Tab.
- Original-Kaufziele erhalten: DE-Einzellizenz `e8c17f14-daf8-4dd8-a0bf-7b8970f471d8`, EN-Einzellizenz `76a8cd83-9858-4888-b082-b2a51296de9f`, Zehnerlizenz in beiden Sprachen `f69f289c-85a2-440d-85bd-d532d741baf9`.

Die Einbindung wurde mit dem tatsächlichen heruntergeladenen Lemon.js in einer simulierten DOM-Umgebung geprüft: window.load initialisiert den Anbieter, alle sechs Kaufverweise erzeugen das richtige Overlay-Iframe, schließen entfernt es wieder. Dieser Test ersetzt weder einen echten Browser-/Netzwerk-Integrationstest noch eine Bestellung. Ohne JavaScript bleiben normale Kaufverweise als Fallback erhalten.

## Rechtstexte und Datenschutz

Impressum, Datenschutz und Mac-EULA öffnen in einem schließbaren Iframe-Popup. Schließen per ×, Escape oder Außenklick; Fokus kehrt ohne Scrollsprung zurück. Direkte Dateien bleiben ohne JavaScript lesbar.

Alle deutschen und englischen Rechtsinhalte wurden aus den jeweiligen Originalseiten übernommen und zeichengetreu verglichen. Die iOS-Seiten haben ihre eigene ursprüngliche Datenschutzerklärung. Die EULA ist die Mac-EULA und wird auf anderen Plattformen entsprechend bezeichnet.

Bekannte Originalstellen wurden auf ausdrückliche Anweisung nicht umformuliert: Der EULA-Verweis zur Datenschutzerklärung ist noch ein Platzhalter. Die Datenschutzerklärungen erwähnen Google Fonts, während das neue Design Systemschriften nutzt, und nennen Umami, jedoch nicht den bereits auf der ursprünglichen Mac-Seite vorhandenen zweiten Statistikdienst Rybbit. Dies ist keine rechtliche Prüfung der Originaltexte.

Der Datenschutzhinweis nennt beide Statistikdienste. Umami und Rybbit starten erst nach Zustimmung, bei lokaler file://-Ansicht überhaupt nicht. Die vorhandenen IDs wurden übernommen. Widerruf, Tab-Synchronisierung und Fokus ohne Scrollsprung sind implementiert. Für die neue Domain müssen die Annahme der Statistik und getrennte Berichte nach Hostname/Quelle noch im laufenden System geprüft werden. Es wurde keine neue Analyse-Property oder automatische Besucheraufteilung erstellt. Klicks werden nicht als Käufe gezählt.

## Formulare

Bestehender Webhook: https://n8n.top-beraternetzwerk.de/webhook/termine

Felder und plattformspezifische Routing-Schlüssel wurden übernommen, einschließlich des eigenen iOS-Newsletter-Schlüssels und der Chrome-Plattformanfrage. Texte, Statusmeldungen und Bedienbeschriftungen sind DE/EN vorhanden. Ungültige Eingaben werden nicht versendet; Fehler behalten Eingaben; nur eine bestätigte HTTP-Erfolgsantwort zeigt Erfolg. Lokale Dateipfade und URL-Suchparameter werden nicht im Payload übermittelt.

Der CORS-Preflight hat POST für https://anonymisierer-tools.de erlaubt. Im Entwicklungsprozess wurden keine echten Formulare abgesendet und keine Käufe ausgelöst. Beim tatsächlichen Absenden in der Seite werden reale Anfragen verschickt.

## Prüfen und veröffentlichen

- Alle acht Produktseiten öffnen und den Sprachwechsel ausprobieren.
- Produktnavigation, Galerie, Mac-Demo, Rechtstext-Popup und Windows-Vormerkung testen.
- Beide Mac-Sprachen: Einzel- und Zehnerkauf als Overlay prüfen.
- Desktop und schmale Mobilansicht kontrollieren. Es wurde keine visuelle Browserprüfung durchgeführt.
- Vor Veröffentlichung prüfen, ob Domain und Hosting bereit sind. Die bestehende Website bleibt unberührt.

Das aktualisierte `../anonymisierer-tools-upload.zip` enthält alle Produktionsdateien mit Unterordnern. Inhalt direkt in das Webroot der neuen Domain hochladen. Vergleichsentwurf und Arbeitsnotizen sind nicht enthalten.

Sitemap enthält alle veröffentlicht vorgesehenen HTML-Seiten und deren Sprachverknüpfungen. Canonicals, Social-Metadaten, strukturierte Produktdaten, robots.txt und llms.txt beziehen sich auf die neue Domain. Jede Produktseite hat eine H1; unbekannte Windows-Angebotsdaten werden nicht als fertiges Angebot ausgezeichnet.

## Weiterbearbeitung

`../bau/build.py` erzeugt alle HTML-Seiten, das gemeinsame CSS, Sitemap und llms.txt. Mac-DE-Vorlage: `../bau/mac-de.html`. Englische Übersetzungen: `../bau/mac-translations.json`. Plattformtexte befinden sich in `build.py`. `site.js` und `privacy.js` sind die gemeinsamen, direkt bearbeitbaren Controller. Die nummerierte Datei `mac-english.txt` ist nur der historische Übersetzungsentwurf.

Nach Änderungen: `python3 anonymiserer/bau/build.py`. Anschließend Prüfungen und ZIP aktualisieren. Die Prüfdateien in `../bau/` bleiben außerhalb des Uploads.
