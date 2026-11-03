/* Переключение цвета шторы: меняет data-color на <html>, CSS показывает нужные фото.
   Цвет выбирают в двух местах (у фото и в расчёте цены) — оба переключателя держим одинаковыми. */
(function () {
  'use strict';

  var root = document.documentElement;
  var inputs = document.querySelectorAll('input[name="color"], input[name="calc-color"]');

  function setColor(value) {
    root.setAttribute('data-color', value);
    for (var j = 0; j < inputs.length; j++) inputs[j].checked = inputs[j].value === value;
  }

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', function (e) {
      if (e.target.checked) setColor(e.target.value);
    });
  }
  // браузер может восстановить выбор после «назад»
  var restored = document.querySelector('input[name="color"]:checked');
  if (restored) setColor(restored.value);
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

/* Расчёт цены: «на окно / на балконную дверь» (ширина 1,60 или 1,00 м) + высота → цена из таблицы
   «Все размеры и цены». Цвет на цену не влияет. Пустая ячейка таблицы = цены пока нет, показываем «по запросу».
   Ячейка с data-common — самый распространённый вариант, у такой высоты в списке появляется пометка. */
(function () {
  'use strict';

  var calc = document.querySelector('.calc');
  if (!calc) return;

  var priceEl = calc.querySelector('[data-calc="price"]');
  var specEl = calc.querySelector('[data-calc="spec"]');
  var metaEl = calc.querySelector('[data-calc="meta"]');
  var heights = calc.querySelectorAll('input[name="height"]');
  var widths = calc.querySelectorAll('.pick__w');

  function checked(name) {
    return document.querySelector('input[name="' + name + '"]:checked');
  }
  function cellFor(kind, height) {
    return calc.querySelector('td[data-w="' + kind + '"][data-h="' + height + '"]');
  }

  function update() {
    var kind = checked('kind');
    var height = checked('height');
    var color = checked('calc-color');
    if (!kind || !height) return;

    var width = kind.value === '160' ? '1,60' : '1,00';
    var i;
    for (i = 0; i < widths.length; i++) widths[i].textContent = width;

    // пометка «частый выбор» у высот, которые в прайсе отмечены как самые распространённые
    for (i = 0; i < heights.length; i++) {
      var tag = heights[i].parentNode.querySelector('.pick__tag');
      var c = cellFor(kind.value, heights[i].value);
      if (tag) tag.hidden = !(c && c.hasAttribute('data-common'));
    }

    var cell = cellFor(kind.value, height.value);
    var price = cell ? cell.textContent.trim() : '';
    priceEl.textContent = price || 'Цена по запросу';
    priceEl.classList.toggle('is-request', !price);

    var parts = [width + ' × ' + height.getAttribute('data-label') + '\u00a0м'];
    if (color) parts.push(color.nextElementSibling.textContent.trim().toLowerCase());
    specEl.textContent = parts.join(' / ');

    var n = height.getAttribute('data-panels');
    metaEl.textContent = n + '\u00a0' + (n === '4' ? 'панели' : 'панелей');
  }

  document.addEventListener('change', function (e) {
    var n = e.target.name;
    if (n === 'kind' || n === 'height' || n === 'color' || n === 'calc-color') update();
  });
  update();
})();
