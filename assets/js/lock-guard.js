(function () {
  var s = document.currentScript, url = s && s.dataset.lock, fresh = s && s.dataset.fresh === '1';
  function mark() { try { sessionStorage.setItem('gatePassed', '1'); } catch (e) {} }
  function check() {
    var ok = true;
    try { ok = sessionStorage.getItem('gatePassed') === '1'; } catch (e) {}
    if (!ok && url) location.replace(url);
  }
  if (fresh) mark();
  check();
  addEventListener('pageshow', function (e) { if (e.persisted) check(); });
})();