/* Переключение цвета шторы: меняет data-color на <html>, CSS показывает нужные фото */
(function () {
  'use strict';

  var root = document.documentElement;
  var inputs = document.querySelectorAll('input[name="color"]');

  function setColor(value) {
    root.setAttribute('data-color', value);
  }

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', function (e) {
      if (e.target.checked) setColor(e.target.value);
    });
    // браузер может восстановить выбор после «назад»
    if (inputs[i].checked) setColor(inputs[i].value);
  }
})();

/* Бургер-меню (планшет и телефон): открывает навигацию на весь экран.
   Закрывается по нажатию на пункт, на крестик, по Esc и при переходе на ширину ПК. */
(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var nav = document.getElementById('site-nav');
  if (!burger || !nav) return;

  var root = document.documentElement;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    root.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  burger.addEventListener('click', function () {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });

  if (window.matchMedia) {
    var desktop = window.matchMedia('(min-width: 900px)');
    var onChange = function (mq) { if (mq.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }
})();

/* Плавающая кнопка «Позвонить» (телефон): скрыта, пока видны кнопки первого экрана,
   чтобы не перекрывать их. Без поддержки IntersectionObserver кнопка просто видна всегда. */
(function () {
  'use strict';

  var callbar = document.querySelector('.callbar');
  var heroActions = document.querySelector('.hero__actions');
  if (!callbar || !heroActions || !('IntersectionObserver' in window)) return;

  new IntersectionObserver(function (entries) {
    callbar.classList.toggle('is-hidden', entries[0].isIntersecting);
  }).observe(heroActions);
})();
