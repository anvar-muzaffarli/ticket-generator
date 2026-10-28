// Sağ klik menyusunu və tərtibatçı alətlərinin qısayollarını bağlayır
export function installGuard() {
  document.addEventListener('contextmenu', e => {
    if (e.target.closest('input, textarea')) return; // mətn sahələrində yapışdırmaq üçün saxlanılır
    e.preventDefault();
  });
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    const mod = e.ctrlKey || e.metaKey;
    const blocked =
      e.key === 'F12' ||
      (mod && e.shiftKey && ['i', 'j', 'c', 'k'].includes(k)) ||
      (mod && e.altKey && ['i', 'j', 'c', 'u'].includes(k)) ||
      (mod && ['u', 's'].includes(k));
    if (blocked) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('dragstart', e => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
}
