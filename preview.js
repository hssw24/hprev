document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('editor');
  const preview = document.getElementById('preview');
  if (!ta || !preview) {
    console.error('Editor oder Preview nicht gefunden');
    return;
  }
/*
  function updatePreview() {
    console.log('updatePreview:', ta.value);
    preview.srcdoc = ta.value;
    
  }
*/
function updatePreview() {
  const ta = document.getElementById('editor');
  const content = ta.value || ta.textContent || '';
  preview.srcdoc = content;
}

  // initial
  updatePreview();

  // bei jeder Eingabe
  ta.addEventListener('input', updatePreview);
});