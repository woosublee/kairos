// 사이트 언어: 브라우저 언어가 한국어면 한국어, 그 밖에는 영어로 보인다(앱과 같은 규칙).
// 페이지 위 'English / 한국어'로 고르면 이 브라우저에 기억한다.
// 개인정보처리방침·지원처럼 긴 문서는 data-lang-block="ko"/"en" 블록 두 개를 두고 하나만 보인다.
// 그 밖의 HTML은 한국어로 쓰고, 영어는 같은 요소의 data-en(내용), data-en-alt, data-en-aria-label, data-en-title,
// data-en-href, data-en-src, data-en-content(meta) 속성에 둔다. <head>에서 이 파일을 읽고,
// 본문 끝(다른 스크립트보다 먼저)에서 KairosI18n.apply()를 부른다.
(function () {
  var KEY = 'kairos-lang';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var browser = (navigator.languages && navigator.languages[0]) || navigator.language || 'ko';
  var lang = saved === 'ko' || saved === 'en' ? saved : (/^ko\b/i.test(browser) ? 'ko' : 'en');
  document.documentElement.lang = lang;
  window.KairosLang = lang;

  var ATTRS = ['alt', 'aria-label', 'title', 'href', 'src', 'content'];
  function apply() {
    // 긴 문서(개인정보처리방침, 지원)는 언어별 블록을 통째로 두고 지금 언어만 보인다.
    document.querySelectorAll('[data-lang-block]').forEach(function (el) { el.hidden = el.getAttribute('data-lang-block') !== lang; });
    if (lang === 'en') {
      document.querySelectorAll('[data-en]').forEach(function (el) { el.innerHTML = el.getAttribute('data-en'); });
      ATTRS.forEach(function (a) {
        document.querySelectorAll('[data-en-' + a + ']').forEach(function (el) { el.setAttribute(a, el.getAttribute('data-en-' + a)); });
      });
    }
    document.querySelectorAll('.lang-switch').forEach(function (el) {
      var other = lang === 'en' ? 'ko' : 'en';
      el.textContent = other === 'en' ? 'English' : '한국어';
      el.setAttribute('lang', other);
      el.setAttribute('href', '#');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        try { localStorage.setItem(KEY, other); } catch (err) {}
        location.reload();
      });
    });
  }
  // 한국어/영어 두 값 중 지금 언어의 것을 고른다(스크립트가 만드는 문구용).
  window.KairosI18n = { lang: lang, apply: apply, t: function (ko, en) { return lang === 'en' ? en : ko; } };
})();
