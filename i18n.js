// 사이트 언어: 브라우저 언어가 한국어면 한국어, 그 밖에는 영어로 보인다(앱과 같은 규칙).
// 페이지 위 'English / 한국어'는 ?lang=en|ko 주소로 이동하고, 고른 언어는 이 브라우저에 기억한다.
// 검색 로봇은 고른 언어가 없으면 한국어로 둔다(같은 주소의 한국어 색인이 영어로 바뀌지 않게).
// 개인정보처리방침·지원처럼 긴 문서는 data-lang-block="ko"/"en" 블록 두 개를 두고 하나만 보인다.
// 그 밖의 HTML은 한국어로 쓰고, 영어는 같은 요소의 data-en(내용), data-en-alt, data-en-aria-label, data-en-title,
// data-en-href, data-en-src, data-en-content(meta) 속성에 둔다. <head>에서 이 파일을 읽고,
// 본문 끝(다른 스크립트보다 먼저)에서 KairosI18n.apply()를 부른다.
(function () {
  var KEY = 'kairos-lang';
  var root = document.documentElement;
  var asked = (location.search.match(/[?&]lang=(ko|en)\b/) || [])[1];
  var saved = null;
  try {
    if (asked) localStorage.setItem(KEY, asked);
    saved = localStorage.getItem(KEY);
  } catch (e) {}
  var chosen = asked || saved;
  var browser = (navigator.languages && navigator.languages[0]) || navigator.language || 'ko';
  var bot = /bot|crawl|spider|slurp/i.test(navigator.userAgent);
  var lang = chosen === 'ko' || chosen === 'en' ? chosen : (bot || /^ko\b/i.test(browser) ? 'ko' : 'en');
  root.lang = lang;
  window.KairosLang = lang;
  // 영어는 바꿔 끼우기 전 한국어가 먼저 보이지 않게 apply()까지 본문을 숨긴다(style.css의 .i18n-pending).
  if (lang === 'en') root.classList.add('i18n-pending');

  var ATTRS = ['alt', 'aria-label', 'title', 'href', 'src', 'content'];
  function apply() {
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
      el.setAttribute('hreflang', other);
      el.setAttribute('href', location.pathname + '?lang=' + other + location.hash);
    });
    root.classList.remove('i18n-pending');
  }
  // 한국어/영어 두 값 중 지금 언어의 것을 고른다(스크립트가 만드는 문구용).
  window.KairosI18n = { lang: lang, apply: apply, t: function (ko, en) { return lang === 'en' ? en : ko; } };
})();
