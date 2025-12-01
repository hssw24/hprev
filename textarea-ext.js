        // Funktion, um den Text zu laden
        function ladeTextdatei() {
            // Der Pfad zu deiner Textdatei
            const dateiPfad = 'inhalt.txt';

            // Das <textarea>-Element anhand seiner ID finden
            const textbereich = document.getElementById('editor');

            // Verwende die 'fetch' API, um die Datei asynchron zu laden.
            // 'fetch' ist eine moderne, einfache Art, Daten vom Server zu holen.
            fetch(dateiPfad)
                // Wenn die Datei erfolgreich geladen wurde (Antwort erhalten):
                .then(response => {
                    // Prüfen, ob der Ladevorgang erfolgreich war (Status 200)
                    if (!response.ok) {
                        // Wenn nicht erfolgreich, einen Fehler werfen.
                        throw new Error(`HTTP-Fehler: ${response.status}`);
                    }
                    // Die Antwort als reinen Text (String) auslesen
                    return response.text();
                })
                // Wenn der Text erfolgreich ausgelesen wurde:
                .then(textInhalt => {
                    // Den geladenen Text in die 'value'-Eigenschaft der Textarea einfügen.
                    textbereich.value = textInhalt;
                    
 

// Falls du in preview.js einen listener auf 'input' hast:
textbereich.dispatchEvent(new Event('input', { bubbles: true }));                  
                    
                })
                // Wenn ein Fehler auftritt (z.B. Datei nicht gefunden):
                .catch(error => {
                    // Eine Fehlermeldung in die Textarea schreiben und den Fehler in der Konsole anzeigen
                    textbereich.value = `Fehler beim Laden der Datei: ${error.message}`;
                    console.error('Ladefehler:', error);
                });
        }

        // Starte die Funktion, sobald das Skript geladen ist
        ladeTextdatei();
