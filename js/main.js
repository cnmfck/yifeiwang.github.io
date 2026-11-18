/* ==========================================================================
   Yifei Wang — personal site
   Version: v1.2 (2026-11-18)
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
      opening: "Your email app should open with the message filled in. If nothing happens, write to yifei9430@gmail.com.",
      subjectPrefix: "Website enquiry"
    },
    zh: {
      copied: "已复制。",
      copyFailed: "复制没有成功，请手动选中文字复制。",
      showing: function (n, total) { return "共 " + total + " 项，当前显示 " + n + " 项。"; },
      required: "请填写这一项。",
      emailInvalid: "请输入有效的邮箱地址，例如 name@example.com。",
      opening: "邮件应用会打开并自动填好内容。如果没有反应，请直接发邮件到 yifei9430@gmail.com。",
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

    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var key = c.getAttribute("data-filter");
        run(key);
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
     4. Portfolio detail dialog
     Each .work has a hidden .work__detail. "Read more" copies it into
     the <dialog>. portfolio.html#work-id opens that piece directly.
     ------------------------------------------------------------------ */
  var dialog = document.getElementById("story");
  if (dialog && typeof dialog.showModal === "function") {
    var body = dialog.querySelector(".story__body");
    var catSlot = dialog.querySelector(".story__cat");
    var lastTrigger = null;

    function openWork(work, trigger) {
      var detail = work.querySelector(".work__detail");
      if (!detail) return;
      body.innerHTML = detail.innerHTML;
      var heading = body.querySelector("h2");
      if (heading) heading.id = "story-heading";
      var cat = work.querySelector(".work__cat");
      catSlot.innerHTML = cat ? cat.innerHTML : "";
      lastTrigger = trigger || null;
      dialog.showModal();
      dialog.scrollTop = 0;
      body.setAttribute("tabindex", "-1");
      body.focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(history.state, "", window.location.pathname + window.location.search + "#" + work.id);
    }

    document.querySelectorAll(".work").forEach(function (work) {
      work.querySelectorAll(".work__open, .work__media").forEach(function (t) {
        t.addEventListener("click", function () { openWork(work, work.querySelector(".work__open")); });
      });
    });

    dialog.querySelector(".story__close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      if (history.replaceState) history.replaceState(history.state, "", window.location.pathname + window.location.search);
      if (lastTrigger) lastTrigger.focus();
    });

    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target && target.classList.contains("work")) openWork(target);
    }
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
     Skipped entirely when the visitor prefers reduced motion; all content
     is visible without it.
     ------------------------------------------------------------------ */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
            if (/^[，。、；：？！）」』》…]$/.test(tok) && frag.lastChild && frag.lastChild.className === "w") {
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

  if (!reduce) {
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
        var offset = (r.top + r.height / 2 - vh / 2) * f;
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
        var deg = (now - t0) * 0.012 + window.scrollY * 0.25;
        badge.style.setProperty("--rot", (deg % 360).toFixed(2) + "deg");
        requestAnimationFrame(spin);
      })(t0);
    }

    // Custom cursor for mouse users
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var cursor = document.createElement("div");
      cursor.className = "cursor"; cursor.setAttribute("aria-hidden", "true");
      var label = document.createElement("span"); cursor.appendChild(label);
      document.body.appendChild(cursor);
      var cx = -100, cy = -100, tx = -100, ty = -100;
      window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; cursor.classList.add("is-on"); }, { passive: true });
      document.addEventListener("mouseleave", function () { cursor.classList.remove("is-on"); });
      (function follow() {
        cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
        cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
        requestAnimationFrame(follow);
      })();
      document.addEventListener("mouseover", function (e) {
        var t = e.target.closest && e.target.closest("[data-cursor]");
        if (t) {
          label.textContent = t.getAttribute("data-cursor-" + currentLang()) || t.getAttribute("data-cursor-en") || "";
          cursor.classList.add("is-big");
        } else {
          cursor.classList.remove("is-big");
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     7. Footer year
     ------------------------------------------------------------------ */
  document.querySelectorAll("[data-year-now]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
