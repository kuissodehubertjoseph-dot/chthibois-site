// ==========================================================================
// Chthibois — panier (localStorage, simulé, partagé entre toutes les pages)
// ==========================================================================
window.ChthiboisCart = (function () {
  var KEY = 'chthibois_cart';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    renderBadge();
  }
  function add(item) {
    var items = read();
    var existing = items.find(function (i) {
      return i.id === item.id && i.delivery === item.delivery && i.size === item.size;
    });
    if (existing) { existing.qty += item.qty; }
    else { items.push(item); }
    write(items);
  }
  function removeAt(index) { var items = read(); items.splice(index, 1); write(items); }
  function updateQtyAt(index, qty) {
    var items = read();
    if (items[index]) { items[index].qty = Math.max(1, parseInt(qty, 10) || 1); }
    write(items);
  }
  function clear() { write([]); }
  function count() { return read().reduce(function (sum, i) { return sum + i.qty; }, 0); }
  function total() { return read().reduce(function (sum, i) { return sum + i.qty * i.price; }, 0); }
  function renderBadge() {
    var n = count();
    document.querySelectorAll('[data-cart-badge]').forEach(function (b) {
      b.textContent = n;
      b.hidden = n === 0;
    });
    var floatingCount = document.querySelector('[data-floating-cart-count]');
    var floating = document.querySelector('.floating-cart');
    if (floatingCount) { floatingCount.textContent = n; }
    if (floating) { floating.classList.toggle('is-empty', n === 0); }
  }

  function injectFloatingCart() {
    if (document.querySelector('.floating-cart')) return;
    var a = document.createElement('a');
    a.href = 'panier.html';
    a.className = 'floating-cart is-empty';
    a.setAttribute('aria-label', 'Voir mon panier');
    a.innerHTML = '<span class="floating-cart-icon" aria-hidden="true"><i class="fa-solid fa-cart-shopping"></i></span>' +
      '<span class="floating-cart-count" data-floating-cart-count>0</span>';
    document.body.appendChild(a);
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectFloatingCart();
    renderBadge();
  });

  return { read: read, add: add, removeAt: removeAt, updateQtyAt: updateQtyAt, clear: clear, count: count, total: total, renderBadge: renderBadge };
})();

// ==========================================================================
// Chthibois — script principal (vanilla JS)
// ==========================================================================
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Sticky header on scroll ---------------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* set --header-h for mobile menu offset */
  function setHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  /* ---------------- Mobile hamburger menu ---------------- */
  var hamburger = document.querySelector('.hamburger');
  var mainNav = document.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      var expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('is-open', !expanded);
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });
  }

  /* ---------------- Submenu toggles (mobile tap / desktop hover handled in CSS) ---------------- */
  var navToggles = document.querySelectorAll('.nav-toggle');
  navToggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (window.innerWidth > 920) return; // desktop uses hover
      e.preventDefault();
      var li = btn.closest('li');
      var wasOpen = li.classList.contains('open');
      li.parentElement.querySelectorAll('li.open').forEach(function (openLi) {
        if (openLi !== li) openLi.classList.remove('open');
      });
      li.classList.toggle('open', !wasOpen);
    });
  });

  /* Close mobile menu when a plain link is clicked */
  if (mainNav) {
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 920) {
          mainNav.classList.remove('is-open');
          if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Subtle scroll parallax on tilted photo frames ---------------- */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        var offset = Math.max(-14, Math.min(14, progress * -14));
        el.style.transform = 'translateY(' + offset + 'px)';
      });
      ticking = false;
    }
    document.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ---------------- Animated counters ---------------- */
  var counters = document.querySelectorAll('[data-counter]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var counterIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterIo.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------------- Lightbox (equipe.html / materiel-forestier.html) ---------------- */
  var lightboxTriggers = document.querySelectorAll('[data-lightbox]');
  if (lightboxTriggers.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Fermer l\'agrandissement">&times;</button>' +
      '<img src="" alt="" />' +
      '<div class="lightbox-cap"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lightbox-cap');
    var lastFocused = null;

    function openLightbox(src, alt, caption) {
      lastFocused = document.activeElement;
      lbImg.src = src;
      lbImg.alt = alt || '';
      lbCap.textContent = caption || '';
      lb.classList.add('is-open');
      lb.querySelector('.lightbox-close').focus();
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lb.classList.remove('is-open');
      lbImg.src = '';
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    lightboxTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var img = trigger.querySelector('img');
        var caption = trigger.getAttribute('data-caption') || (img ? img.alt : '');
        openLightbox(img ? img.src : trigger.getAttribute('href'), img ? img.alt : '', caption);
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ---------------- Reviews carousel ---------------- */
  var track = document.querySelector('.review-track');
  if (track) {
    var prevBtn = document.querySelector('[data-review-prev]');
    var nextBtn = document.querySelector('[data-review-next]');
    function scrollByCard(dir) {
      var card = track.querySelector('.review-card');
      var gap = 22;
      var amount = card ? (card.offsetWidth + gap) * dir : 300 * dir;
      track.scrollBy({ left: amount, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });
  }

  /* ---------------- Contact form validation (simulated submit) ---------------- */
  var form = document.querySelector('.contact-form');
  if (form) {
    var fields = form.querySelectorAll('[required]');

    function validateField(field) {
      var row = field.closest('.form-row');
      if (!row) return true;
      var valid = field.checkValidity();
      if (field.type === 'email' && field.value.trim() !== '') {
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = emailRe.test(field.value.trim());
      }
      row.classList.toggle('has-error', !valid);
      row.classList.toggle('is-valid', valid && field.value.trim() !== '');
      return valid;
    }

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.closest('.form-row').classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) {
        var firstError = form.querySelector('.has-error input, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }
      var successEl = form.querySelector('.form-success') || document.querySelector('.form-success');
      form.querySelectorAll('input, textarea').forEach(function (f) { f.disabled = true; });
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Message envoyé ✓'; }
      if (successEl) successEl.classList.add('is-visible');
    });
  }

  /* ---------------- Product detail form (simulated add to cart) ---------------- */
  var productForm = document.querySelector('[data-product-form]');
  if (productForm) {
    var sizeSelectEl = productForm.querySelector('[data-size-select]');
    var priceDisplayEls = document.querySelectorAll('[data-product-price-display]');
    var deliverySelectEl = productForm.querySelector('[data-delivery-select]');
    var deliveryNoticeEl = productForm.querySelector('[data-delivery-notice]');
    var qtyInputEl = productForm.querySelector('[data-qty-input]');

    if (sizeSelectEl && priceDisplayEls.length) {
      sizeSelectEl.addEventListener('change', function () {
        var opt = sizeSelectEl.options[sizeSelectEl.selectedIndex];
        var price = opt.getAttribute('data-price');
        var html = price
          ? price.replace('.', ',') + '&nbsp;€'
          : '<span class="from">Dès</span>345,00&nbsp;€';
        priceDisplayEls.forEach(function (el) { el.innerHTML = html; });
        productForm.setAttribute('data-product-price', price || '345.00');
      });
    }

    if (deliverySelectEl && deliveryNoticeEl && qtyInputEl) {
      deliverySelectEl.addEventListener('change', function () {
        var isFarDelivery = deliverySelectEl.value === 'livraison+30';
        deliveryNoticeEl.hidden = !isFarDelivery;
        if (isFarDelivery) {
          qtyInputEl.min = 2;
          if ((parseInt(qtyInputEl.value, 10) || 1) < 2) { qtyInputEl.value = 2; }
        } else {
          qtyInputEl.min = 1;
        }
      });
    }

    productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var selects = productForm.querySelectorAll('select[required]');
      var allValid = true;
      selects.forEach(function (sel) {
        var valid = sel.value !== '';
        sel.style.borderColor = valid ? '' : '#b3261e';
        if (!valid) allValid = false;
      });
      if (!allValid) { return; }

      var deliverySel = productForm.querySelector('#delivery-mode');
      var sizeSel = productForm.querySelector('#log-size');
      var qtyInput = productForm.querySelector('.qty-input');

      window.ChthiboisCart.add({
        id: productForm.getAttribute('data-product-id'),
        name: productForm.getAttribute('data-product-name'),
        price: parseFloat(productForm.getAttribute('data-product-price')),
        image: productForm.getAttribute('data-product-image'),
        delivery: deliverySel ? deliverySel.value : '',
        deliveryLabel: deliverySel ? deliverySel.options[deliverySel.selectedIndex].text : '',
        size: sizeSel ? sizeSel.value : '',
        sizeLabel: sizeSel ? sizeSel.options[sizeSel.selectedIndex].text : '',
        qty: qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1
      });

      var cartLink = document.querySelector('.cart-link');
      if (cartLink) {
        cartLink.classList.add('is-bumped');
        setTimeout(function () { cartLink.classList.remove('is-bumped'); }, 400);
      }

      var successEl = productForm.querySelector('[data-product-success]');
      var btn = productForm.querySelector('.btn-addcart');
      if (btn) { btn.textContent = 'Ajouté ✓'; setTimeout(function () { btn.textContent = 'Ajouter au panier'; }, 2200); }
      if (successEl) {
        successEl.classList.add('is-visible');
        setTimeout(function () { successEl.classList.remove('is-visible'); }, 2200);
      }
    });
  }

  /* ---------------- Quick add to cart (simple products, no options) ---------------- */
  document.querySelectorAll('[data-quick-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.ChthiboisCart.add({
        id: btn.getAttribute('data-product-id'),
        name: btn.getAttribute('data-product-name'),
        price: parseFloat(btn.getAttribute('data-product-price')),
        image: btn.getAttribute('data-product-image'),
        delivery: '', deliveryLabel: '', size: '', sizeLabel: '',
        qty: 1
      });

      var cartLink = document.querySelector('.cart-link');
      if (cartLink) {
        cartLink.classList.add('is-bumped');
        setTimeout(function () { cartLink.classList.remove('is-bumped'); }, 400);
      }
      var floating = document.querySelector('.floating-cart');
      if (floating) {
        floating.classList.add('is-bumped');
        setTimeout(function () { floating.classList.remove('is-bumped'); }, 400);
      }

      var original = btn.textContent;
      btn.textContent = 'Ajouté ✓';
      btn.disabled = true;
      setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 1800);
    });
  });

  /* ---------------- Cart page rendering ---------------- */
  var cartPage = document.querySelector('[data-cart-page]');
  if (cartPage) {
    var emptyEl = cartPage.querySelector('[data-cart-empty]');
    var filledEl = cartPage.querySelector('[data-cart-filled]');
    var confirmEl = cartPage.querySelector('[data-cart-confirm]');
    var itemsEl = cartPage.querySelector('[data-cart-items]');
    var subtotalEl = cartPage.querySelector('[data-cart-subtotal]');

    function money(n) { return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }

    function renderCartPage() {
      var items = window.ChthiboisCart.read();
      if (!items.length) {
        emptyEl.hidden = false;
        filledEl.hidden = true;
        return;
      }
      emptyEl.hidden = true;
      filledEl.hidden = false;
      itemsEl.innerHTML = '';
      items.forEach(function (item, index) {
        var row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML =
          '<img src="' + item.image + '" alt="" loading="lazy">' +
          '<div class="cart-item-info">' +
            '<h4>' + item.name + '</h4>' +
            '<p class="cart-item-options">' + (item.sizeLabel ? 'Taille : ' + item.sizeLabel : '') + (item.deliveryLabel ? (item.sizeLabel ? ' · ' : '') + 'Livraison : ' + item.deliveryLabel : '') + '</p>' +
            '<div class="cart-item-row">' +
              '<label>Qté <input type="number" class="qty-input" min="1" max="99" value="' + item.qty + '" data-cart-qty="' + index + '"></label>' +
              '<button type="button" class="cart-item-remove" data-cart-remove="' + index + '">Retirer</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item-total">' + money(item.qty * item.price) + '</div>';
        itemsEl.appendChild(row);
      });
      subtotalEl.textContent = money(window.ChthiboisCart.total());

      itemsEl.querySelectorAll('[data-cart-qty]').forEach(function (input) {
        input.addEventListener('change', function () {
          window.ChthiboisCart.updateQtyAt(parseInt(input.getAttribute('data-cart-qty'), 10), input.value);
          renderCartPage();
        });
      });
      itemsEl.querySelectorAll('[data-cart-remove]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          window.ChthiboisCart.removeAt(parseInt(btn.getAttribute('data-cart-remove'), 10));
          renderCartPage();
        });
      });
    }
    renderCartPage();

    var checkoutBtn = cartPage.querySelector('[data-cart-checkout]');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        window.ChthiboisCart.clear();
        filledEl.hidden = true;
        emptyEl.hidden = true;
        confirmEl.hidden = false;
        confirmEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
    }
  }

  /* ---------------- Cookie banner (visual only) ---------------- */
  var cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner) {
    try {
      if (localStorage.getItem('chthibois_cookies') === 'ok') {
        cookieBanner.remove();
      } else {
        cookieBanner.querySelectorAll('button').forEach(function (btn) {
          btn.addEventListener('click', function () {
            try { localStorage.setItem('chthibois_cookies', 'ok'); } catch (err) {}
            cookieBanner.remove();
          });
        });
      }
    } catch (err) {
      cookieBanner.remove();
    }
  }

})();
