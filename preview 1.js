    // Elemente holen
    const ta = document.getElementById('editor');
    const preview = document.getElementById('preview');
//    const resetBtn = document.getElementById('reset');

    // Funktion: Inhalt der Textarea in iframe setzen (srcdoc = HTML string)
    function updatePreview() {
      // Direktes Setzen von srcdoc rendert das eingegebene HTML
      console.log(ta.value);
 //     console.log(document.getElementById('editor').value)
      preview.srcdoc = ta.value;
    }

    // Sofort initialisieren
    updatePreview();

    // Bei jeder Eingabe: aktualisieren (oninput ist mobilfreundlich)
    ta.addEventListener('input', updatePreview);



    // Reset-Button lädt ein kleines Beispiel (einfacher Komfort)
//    resetBtn.addEventListener('click', () => {
 //     ta.value = '';
  //    updatePreview();
//      ta.focus();
      // Standard: neu laden
//      window.location.reload();
//,''''    });
    