/* ==========================================================================
   Yifei Wang — personal site
   Version: v2.3 (2026-11-18)
   Plain JavaScript, no libraries. Each feature checks that its elements
   exist, so the same file works on every page.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ------------------------------------------------------------------
     1. Language
     The <head> of every page already set data-ui-lang before paint.
     Here we wire the toggle button, keep links and the URL in sync,
     and swap the page title.
     ------------------------------------------------------------------ */
  var STORAGE_KEY = "yw-lang";

  function currentLang() {
    return root.getAttribute("data-ui-lang") === "zh" ? "zh" : "en";
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked: URL param still works */ }
  }

  // Mark Chinese strings for screen readers and font selection.
  document.querySelectorAll('[data-lang="zh"]').forEach(function (el) {
    if (!el.hasAttribute("lang")) el.setAttribute("lang", "zh-Hans");
  });
  document.querySelectorAll('[data-lang="en"]').forEach(function (el) {
    if (!el.hasAttribute("lang")) el.setAttribute("lang", "en");
  });

  // Internal links carry ?lang=zh so the choice survives even without localStorage.
  function syncLinks(lang) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) return;
      if (!/\.html(\?|#|$)|^\.\/?(\?|#|$)|^\/(\?|#|$)/.test(href)) return;
      var hashIndex = href.indexOf("#");
      var hash = hashIndex > -1 ? href.slice(hashIndex) : "";
      var base = hashIndex > -1 ? href.slice(0, hashIndex) : href;
      var qIndex = base.indexOf("?");
      var path = qIndex > -1 ? base.slice(0, qIndex) : base;
      var params = new URLSearchParams(qIndex > -1 ? base.slice(qIndex + 1) : "");
      if (lang === "zh") params.set("lang", "zh"); else params.delete("lang");
      var qs = params.toString();
      a.setAttribute("href", path + (qs ? "?" + qs : "") + hash);
    });
  }

  function syncUrl(lang) {
    if (!window.history || !history.replaceState) return;
    var url = new URL(window.location.href);
    if (lang === "zh") url.searchParams.set("lang", "zh"); else url.searchParams.delete("lang");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }

  function applyLang(lang) {
    root.setAttribute("data-ui-lang", lang);
    root.setAttribute("lang", lang === "zh" ? "zh-Hans" : "en");
    var t = root.getAttribute("data-title-" + lang);
    if (t) document.title = t;
    document.querySelectorAll(".lang-toggle").forEach(function (b) {
      b.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
    });
    // Elements that cannot hold two <span>s (options, placeholders) keep both texts in attributes.
    document.querySelectorAll("[data-text-en]").forEach(function (el) {
      el.textContent = el.getAttribute("data-text-" + lang) || el.getAttribute("data-text-en");
    });
    document.querySelectorAll("[data-placeholder-en]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-placeholder-" + lang) || el.getAttribute("data-placeholder-en"));
    });
    document.querySelectorAll("img[data-alt-zh]").forEach(function (img) {
      if (!img.hasAttribute("data-alt-en")) img.setAttribute("data-alt-en", img.getAttribute("alt") || "");
      img.setAttribute("alt", lang === "zh" ? img.getAttribute("data-alt-zh") : img.getAttribute("data-alt-en"));
    });
    syncLinks(lang);
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  document.querySelectorAll(".lang-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentLang() === "en" ? "zh" : "en";
      saveLang(next);
      applyLang(next);
      syncUrl(next);
    });
  });
  applyLang(currentLang());

  // Small strings that JavaScript writes into the page.
  var STRINGS = {
    en: {
      copied: "Copied.",
      copyFailed: "Copy didn't work. Select the text and copy it manually.",
      showing: function (n, total) { return "Showing " + n + " of " + total + "."; },
      required: "Fill in this field.",
      emailInvalid: "Enter an email address like name@example.com.",
      opening: "Your email app should open with the message filled in. If nothing happens, write to 23sc16@queensu.ca.",
      subjectPrefix: "Website enquiry"
    },
    zh: {
      copied: "已复制。",
      copyFailed: "复制没有成功，请手动选中文字复制。",
      showing: function (n, total) { return "共 " + total + " 项，当前显示 " + n + " 项。"; },
      required: "请填写这一项。",
      emailInvalid: "请输入有效的邮箱地址，例如 name@example.com。",
      opening: "邮件应用会打开并自动填好内容。如果没有反应，请直接发邮件到 23sc16@queensu.ca。",
      subjectPrefix: "网站来信"
    }
  };
  function s(key) { return STRINGS[currentLang()][key]; }

  /* ------------------------------------------------------------------
     2. Mobile menu
     ------------------------------------------------------------------ */
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     3. Filters (Timeline and Portfolio)
     <div class="filters" data-target="#id"> holds .chip buttons with
     data-filter="all|key". Items carry data-tags="key other-key".
     ------------------------------------------------------------------ */
  document.querySelectorAll(".filters[data-target]").forEach(function (bar) {
    var scope = document.querySelector(bar.getAttribute("data-target"));
    if (!scope) return;
    var chips = bar.querySelectorAll(".chip");
    var items = scope.querySelectorAll("[data-tags]");
    var status = document.querySelector(bar.getAttribute("data-status") || "#none");
    var active = "all";

    function run(key) {
      active = key;
      var shown = 0;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-filter") === key)); });
      items.forEach(function (item) {
        var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
        var match = key === "all" || tags.indexOf(key) > -1;
        item.hidden = !match;
        if (match) shown++;
      });
      // Hide timeline years that end up empty.
      scope.querySelectorAll(".year").forEach(function (year) {
        year.hidden = !year.querySelector(".entry:not([hidden])");
      });
      if (status) status.textContent = key === "all" ? "" : s("showing")(shown, items.length);
      document.dispatchEvent(new CustomEvent("filterchange"));
    }

    // Sticky bars: mark when stuck; after filtering, bring the top of the list back into view.
    var sticky = bar.classList.contains("filters--sticky");
    function stickTop() { return parseFloat(getComputedStyle(bar).top) || 0; }
    if (sticky) {
      var onScroll = function () { bar.classList.toggle("is-stuck", window.scrollY > 0 && bar.getBoundingClientRect().top <= stickTop() + 1); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var key = c.getAttribute("data-filter");
        run(key);
        if (sticky && bar.classList.contains("is-stuck")) {
          var y = scope.getBoundingClientRect().top + window.scrollY - stickTop() - bar.offsetHeight - 12;
          if (window.scrollY > y) window.scrollTo({ top: y, behavior: "smooth" });
        }
        if (history.replaceState) {
          var url = new URL(window.location.href);
          if (key === "all") url.searchParams.delete("filter"); else url.searchParams.set("filter", key);
          history.replaceState(history.state, "", url.pathname + url.search + url.hash);
        }
      });
    });
    document.addEventListener("langchange", function () { run(active); });

    var initial = new URLSearchParams(window.location.search).get("filter");
    var valid = Array.prototype.some.call(chips, function (c) { return c.getAttribute("data-filter") === initial; });
    run(valid ? initial : "all");
  });

  /* ------------------------------------------------------------------
     4. Story dialog (Portfolio and Timeline)
     Each story is written once, in a hidden .story-src (id "src-<id>").
     Anything with data-story="<id>" opens it in the <dialog>, so a
     timeline entry and its portfolio card show the same content.
     page.html#<id> opens that story directly.
     ------------------------------------------------------------------ */
  var dialog = document.getElementById("story");
  if (dialog && typeof dialog.showModal === "function") {
    var body = dialog.querySelector(".story__body");
    var catSlot = dialog.querySelector(".story__cat");
    var lastTrigger = null;

    function openStory(id, trigger) {
      var src = document.getElementById("src-" + id);
      if (!src) return;
      var copy = src.cloneNode(true);
      var cat = copy.querySelector(".story-src__cat");
      catSlot.innerHTML = cat ? cat.innerHTML : "";
      if (cat) cat.parentNode.removeChild(cat);
      body.innerHTML = copy.innerHTML;
      var heading = body.querySelector("h2");
      if (heading) heading.id = "story-heading";
      if (root.getAttribute("data-ui-lang") === "zh") {
        body.querySelectorAll("img[data-alt-zh]").forEach(function (im) { im.alt = im.getAttribute("data-alt-zh"); });
      }
      lastTrigger = trigger || null;
      dialog.showModal();
      dialog.scrollTop = 0;
      body.setAttribute("tabindex", "-1");
      body.focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(history.state, "", window.location.pathname + window.location.search + "#" + id);
    }

    document.querySelectorAll("[data-story]").forEach(function (el) {
      el.addEventListener("click", function () {
        var trigger = el.matches("button, a") ? el : (el.parentNode.querySelector("button[data-story]") || null);
        openStory(el.getAttribute("data-story"), trigger);
      });
    });

    dialog.querySelector(".story__close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      if (history.replaceState) history.replaceState(history.state, "", window.location.pathname + window.location.search);
      if (lastTrigger) lastTrigger.focus();
    });

    if (window.location.hash) openStory(window.location.hash.slice(1));
  }

  /* ------------------------------------------------------------------
     5. Contact: copy email + compose-in-email-app form
     ------------------------------------------------------------------ */
  var copyStatus = document.querySelector(".copy-status");
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "absolute"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand("copy"); document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) { reject(e); }
    });
  }
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      copyText(btn.getAttribute("data-copy")).then(function () {
        btn.classList.add("is-done");
        if (copyStatus) copyStatus.textContent = s("copied");
        setTimeout(function () { btn.classList.remove("is-done"); }, 1600);
      }, function () { if (copyStatus) copyStatus.textContent = s("copyFailed"); });
    });
  });

  var form = document.getElementById("contact-form");
  if (form) {
    var formStatus = document.getElementById("form-status");
    function setError(field, msg) {
      var err = document.getElementById(field.id + "-error");
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg || "";
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email, topic = form.elements.topic, message = form.elements.message;
      var ok = true;
      [name, message].forEach(function (f) {
        if (!f.value.trim()) { setError(f, s("required")); ok = false; } else setError(f, "");
      });
      if (!email.value.trim()) { setError(email, s("required")); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, s("emailInvalid")); ok = false; }
      else setError(email, "");
      if (!ok) { var first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }

      var topicText = topic.options[topic.selectedIndex].text;
      var subject = s("subjectPrefix") + ": " + topicText + " (" + name.value.trim() + ")";
      var bodyText = message.value.trim() + "\n\n" + name.value.trim() + "\n" + email.value.trim();
      var to = form.getAttribute("data-to");
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(bodyText);
      if (formStatus) formStatus.textContent = s("opening");
    });
  }

  /* ------------------------------------------------------------------
     6. Motion
     Runs for every visitor (since v2.3), with distances kept small.
     All content is still readable if this script fails.
     ------------------------------------------------------------------ */
  var CJK = /[⺀-鿿豈-﫿＀-￯　-〿]/;

  // Wrap words (or single CJK characters, or letters with mode "chars") in masks.
  function splitText(el, mode) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var text = child.nodeValue;
          if (!text.trim()) return;
          var frag = document.createDocumentFragment();
          var tokens = mode === "chars" ? text.split("") : (text.match(/[⺀-鿿豈-﫿＀-￯　-〿]|[^\s⺀-鿿豈-﫿＀-￯　-〿]+|\s+/g) || []);
          tokens.forEach(function (tok) {
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            // Keep CJK closing punctuation on the same line as the character before it.
            if (/^[，。、；：？！）」』》…]+$/.test(tok) && frag.lastChild && frag.lastChild.className === "w") {
              frag.lastChild.firstChild.textContent += tok; return;
            }
            if (mode === "chars") {
              var c = document.createElement("span"); c.className = "ch"; c.style.setProperty("--i", i++); c.textContent = tok; frag.appendChild(c); return;
            }
            var w = document.createElement("span"); w.className = "w";
            var inner = document.createElement("span"); inner.textContent = tok; inner.style.setProperty("--i", i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains("script") && child.getAttribute("aria-hidden") !== "true") {
          walk(child);
        }
      });
    }
    walk(el);
    el.classList.add("split");
  }

  (function () {
    root.classList.add("motion");

    document.querySelectorAll(".cover__line").forEach(function (line) { splitText(line, "chars"); });
    document.querySelectorAll("[data-split]").forEach(function (el) { splitText(el, "words"); });

    // Reveal on scroll
    var revealables = document.querySelectorAll("[data-split], [data-reveal]");
    if ("IntersectionObserver" in window) {
      // Fully clipped elements report no visible area, so watch their parent instead.
      var watchMap = new Map();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          (watchMap.get(en.target) || []).forEach(function (el) { el.classList.add("is-in"); });
          io.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
      revealables.forEach(function (el) {
        var mode = el.getAttribute("data-reveal");
        var watched = (mode === "script" || mode === "wipe") ? el.parentElement : el;
        if (!watchMap.has(watched)) { watchMap.set(watched, []); io.observe(watched); }
        watchMap.get(watched).push(el);
      });
    } else {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    }

    // Count-up numbers
    var counters = document.querySelectorAll("[data-count]");
    function runCount(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var numEl = el.querySelector(".n") || el;
      var start = null, dur = 1600;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        numEl.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(frame);
      }
      numEl.textContent = "0";
      requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window && counters.length) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }

    // Scroll-linked effects, batched in one animation frame
    var badge = document.querySelector(".badge svg");
    var progress = document.querySelector(".read-progress");
    var parallax = document.querySelectorAll("[data-parallax]");
    var tl = document.querySelector(".timeline");
    var rail = tl && tl.querySelector(".timeline__rail");
    var tlEntries = tl ? tl.querySelectorAll(".entry") : [];
    var ticking = false, t0 = performance.now();

    function onFrame(now) {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      var docH = document.documentElement.scrollHeight - vh;
      if (progress) progress.style.setProperty("--p", docH > 0 ? (y / docH).toFixed(4) : 0);
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var offset = (r.top + r.height / 2 - vh / 2) * f * 0.6;
        el.style.setProperty("--py", offset.toFixed(1) + "px");
      });
      if (rail) {
        var rr = rail.getBoundingClientRect();
        var p = Math.min(Math.max((vh * 0.6 - rr.top) / rr.height, 0), 1);
        rail.style.setProperty("--tp", p.toFixed(4));
        tlEntries.forEach(function (en) { en.classList.toggle("is-past", en.getBoundingClientRect().top < vh * 0.6); });
      }
    }
    function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", requestFrame);
    document.addEventListener("filterchange", requestFrame);
    requestFrame();

    // Badge spins slowly and speeds up with scrolling
    if (badge) {
      (function spin(now) {
        var deg = (now - t0) * 0.01 + window.scrollY * 0.15;
        badge.style.setProperty("--rot", (deg % 360).toFixed(2) + "deg");
        requestAnimationFrame(spin);
      })(t0);
    }

    // 3D tilt with a light glare on large images (mouse only)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll("[data-tilt]").forEach(function (el) {
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          el.classList.add("is-tilting");
          el.style.setProperty("--ry", ((x - 0.5) * 8).toFixed(2) + "deg");
          el.style.setProperty("--rx", ((0.5 - y) * 7).toFixed(2) + "deg");
          el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
          el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
          el.style.setProperty("--ts", "1.02");
        });
        el.addEventListener("pointerleave", function () {
          el.classList.remove("is-tilting");
          ["--rx", "--ry", "--ts"].forEach(function (k) { el.style.removeProperty(k); });
        });
      });
    }

  })();

  /* ------------------------------------------------------------------
     7. Case study: jump inside the phone, and "Back" links
     ------------------------------------------------------------------ */
  var screen = document.querySelector(".phone__screen");
  document.querySelectorAll("[data-phone-jump]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!screen) return;
      var imgs = screen.querySelectorAll("img");
      var target = imgs[parseInt(btn.getAttribute("data-phone-jump"), 10)];
      if (!target) return;
      screen.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      document.querySelectorAll("[data-phone-jump]").forEach(function (b) { b.classList.toggle("is-current", b === btn); });
      // on narrow screens the phone sits above the list; bring it into view
      if (window.innerWidth < 960) screen.closest(".phone").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  if (screen && "IntersectionObserver" in window) {
    var partBtns = document.querySelectorAll("[data-phone-jump]");
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var idx = Array.prototype.indexOf.call(screen.querySelectorAll("img"), en.target);
        partBtns.forEach(function (b, i) { b.classList.toggle("is-current", i === idx); });
      });
    }, { root: screen, threshold: 0.35 });
    screen.querySelectorAll("img").forEach(function (im) { pio.observe(im); });
  }
  // Links to a spot on the same page scroll there without adding a history entry,
  // so the browser's Back button and the "Back" links below leave the page instead of
  // stepping through #anchors.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var id = a.getAttribute("href").slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!target.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (history.replaceState) history.replaceState(history.state, "", location.pathname + location.search + "#" + id);
  });

  // "Back" returns to the previous page on this site. If the visitor came from another
  // site, typed the address, or going back would not leave this page, it follows its link.
  var leaving = false;
  window.addEventListener("pagehide", function () { leaving = true; });
  document.querySelectorAll("[data-back]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var ref = null;
      try { ref = document.referrer ? new URL(document.referrer) : null; } catch (err) {}
      var fromSite = ref && ref.host === location.host && ref.pathname !== location.pathname;
      if (!fromSite || history.length < 2) return;
      e.preventDefault();
      var fallback = a.href;
      history.back();
      setTimeout(function () { if (!leaving) location.href = fallback; }, 600);
    });
  });

  /* ------------------------------------------------------------------
     8. Footer year
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-year-now]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ------------------------------------------------------------------
     9. Photo viewer (cosplay lookbook)
     Links with data-lightbox="<group>" open the large photo in a
     full-screen <dialog>; arrows, arrow keys and swipes move through
     the group. Captions come from data-alt-en / data-alt-zh.
     ------------------------------------------------------------------ */
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lightbox__caption");
    var lbCount = lb.querySelector(".lightbox__count");
    var lbGroup = [], lbAt = 0, lbTrigger = null;

    function lbShow(i) {
      lbAt = (i + lbGroup.length) % lbGroup.length;
      var a = lbGroup[lbAt];
      var alt = a.hasAttribute("data-nocap") ? "" : (a.getAttribute(root.getAttribute("data-ui-lang") === "zh" ? "data-alt-zh" : "data-alt-en") || "");
      var im0 = a.querySelector("img");
      lb.classList.add("is-loading");
      var pre = new Image();
      pre.onload = pre.onerror = function () {
        if (lbGroup[lbAt] !== a) return;
        lbImg.src = a.getAttribute("href");
        lb.classList.remove("is-loading");
      };
      pre.src = a.getAttribute("href");
      lbImg.alt = alt || (im0 ? im0.alt : "");
      lbCap.textContent = alt;
      lbCount.textContent = (lbAt + 1) + " / " + lbGroup.length;
    }

    document.querySelectorAll("a[data-lightbox]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        lbGroup = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox="' + a.getAttribute("data-lightbox") + '"]'));
        lbTrigger = a;
        lbImg.removeAttribute("src");
        lb.showModal();
        lbShow(lbGroup.indexOf(a));
      });
    });
    lb.querySelector(".lightbox__nav--prev").addEventListener("click", function () { lbShow(lbAt - 1); });
    lb.querySelector(".lightbox__nav--next").addEventListener("click", function () { lbShow(lbAt + 1); });
    lb.querySelector(".lightbox__close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); lbShow(lbAt - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); lbShow(lbAt + 1); }
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__figure")) lb.close();
    });
    var lbX = null;
    lb.addEventListener("touchstart", function (e) { lbX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (lbX === null) return;
      var dx = e.changedTouches[0].clientX - lbX;
      if (Math.abs(dx) > 40) lbShow(lbAt + (dx < 0 ? 1 : -1));
      lbX = null;
    }, { passive: true });
    lb.addEventListener("close", function () { if (lbTrigger) lbTrigger.focus(); });
  }


  /* ------------------------------------------------------------------
     10. 404 page: show the address that was asked for and suggest the
     closest real page. GitHub Pages serves 404.html for any missing
     address on the domain, so this runs for every broken link.
     ------------------------------------------------------------------ */
  var askedEl = document.querySelector("[data-missing-path]");
  if (askedEl && location.protocol !== "file:") {
    var path = decodeURIComponent(location.pathname);
    if (path && path !== "/" && !/\/404(\.html)?$/.test(path)) {
      askedEl.querySelector("code").textContent = path;
      askedEl.hidden = false;
      var pages = [
        { href: "timeline.html", en: "Timeline", zh: "经历", keys: ["timeline", "resume", "cv", "experience", "about", "education"] },
        { href: "portfolio.html", en: "Portfolio", zh: "作品", keys: ["portfolio", "work", "works", "projects", "project", "research"] },
        { href: "contact.html", en: "Contact", zh: "联系", keys: ["contact", "email", "mail", "linkedin", "phone"] },
        { href: "qcssa.html", en: "QCSSA campaigns", zh: "QCSSA 宣传作品", keys: ["qcssa", "wechat", "instagram", "campaign", "campaigns", "marketing", "posters"] },
        { href: "cosplay.html", en: "Cosplay lookbook", zh: "Cosplay 作品集", keys: ["cosplay", "cos", "lookbook", "kita", "misa", "mizuki", "makeup", "photos"] },
        { href: "writing.html", en: "Writing on film", zh: "电影与媒体写作", keys: ["writing", "film", "essays", "essay", "media", "papers"] },
        { href: "index.html", en: "Home", zh: "首页", keys: ["home", "index", "main"] }
      ];
      var words = path.toLowerCase().replace(/\.html?$/, "").split(/[^a-z0-9]+/).filter(Boolean);
      function dist(a, b) {
        var m = [], i, j;
        for (i = 0; i <= a.length; i++) { m[i] = [i]; }
        for (j = 0; j <= b.length; j++) { m[0][j] = j; }
        for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
          m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        return m[a.length][b.length];
      }
      var best = null, bestScore = Infinity;
      pages.forEach(function (pg) {
        words.forEach(function (w) {
          pg.keys.forEach(function (k) {
            var d = dist(w, k), limit = k.length <= 4 ? 1 : 2;
            if (d <= limit && d < bestScore) { bestScore = d; best = pg; }
          });
        });
      });
      if (best) {
        var guess = document.querySelector("[data-missing-guess]"), a = guess.querySelector("a");
        var zh = root.getAttribute("data-ui-lang") === "zh";
        a.href = best.href + (zh ? "?lang=zh" : "");
        a.textContent = zh ? best.zh : best.en;
        guess.hidden = false;
      }
    }
  }

})();
