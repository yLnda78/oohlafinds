/* oohlafinds - shared behaviour: nav, product cards, filters, collections */
(function () {
  "use strict";
  var D = window.OOHLA;
  if (!D) return;
  var NS = "http://www.w3.org/2000/svg";

  var MOTIFS = {
    diamond: '<path d="M50 10 L84 40 L50 90 L16 40Z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M16 40H84M34 40L50 10L66 40L50 90L34 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>',
    lips: '<path d="M10 52Q28 24 50 40Q72 24 90 52Q70 82 50 82Q30 82 10 52Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M12 52Q50 62 88 52" fill="none" stroke="currentColor" stroke-width="3"/>',
    cat: '<path d="M22 44L26 12L46 28ZM78 44L74 12L54 28Z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="56" r="30" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="3"/><circle cx="39" cy="52" r="3.5" fill="currentColor"/><circle cx="61" cy="52" r="3.5" fill="currentColor"/><path d="M44 64Q50 70 56 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    star: '<path d="M50 6L61 38L94 38L67 58L77 90L50 70L23 90L33 58L6 38L39 38Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>',
    butterfly: '<path id="w" d="M48 50C30 8 4 22 14 46C18 56 30 56 36 54C20 62 20 86 40 80C46 78 48 64 48 50Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M52 50C70 8 96 22 86 46C82 56 70 56 64 54C80 62 80 86 60 80C54 78 52 64 52 50Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M50 40V70M46 30Q50 38 54 30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    heart: '<path d="M50 88C8 56 14 18 38 22C46 24 50 32 50 32C50 32 54 24 62 22C86 18 92 56 50 88Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>',
    bubbles: '<circle cx="38" cy="40" r="24" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="3"/><circle cx="68" cy="64" r="20" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="3"/><circle cx="64" cy="26" r="10" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="3"/>',
    sparkle: '<path d="M50 8C54 36 64 46 92 50C64 54 54 64 50 92C46 64 36 54 8 50C36 46 46 36 50 8Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>'
  };
  var EXT = '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9"/></svg>';

  function motifSvg(name) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 100 100");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = MOTIFS[name] || MOTIFS.sparkle; // static markup only (no user data)
    return s;
  }
  var colByName = {};
  D.collections.forEach(function (c) { colByName[c.name] = c; });

  function placeholder(col, withText) {
    var c = colByName[col] || D.collections[0];
    var d = document.createElement("div");
    d.className = "ph";
    d.style.setProperty("--c1", c.c1);
    d.style.setProperty("--c2", c.c2);
    d.appendChild(motifSvg(c.motif));
    if (withText) {
      var t = document.createElement("span");
      t.textContent = c.name;
      d.appendChild(t);
    }
    return d;
  }

  function cover(c) {
    var d = placeholder(c.name, false);
    if (!c.cover) return d;
    var im = new Image();
    im.alt = ""; im.decoding = "async";
    im.onload = function () { d.classList.add("has-cover"); d.replaceChildren(im); };
    im.src = c.cover;
    return d;
  }

  function card(p) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.className = "card";
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", p.name + " - opens on " + p.marketplace + " in a new tab");

    var media = document.createElement("div");
    media.className = "card__media";
    var img = new Image();
    img.alt = p.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = function () { media.replaceChildren(placeholder(p.collection, true)); };
    img.onload = function () { media.classList.add("has-img"); };
    img.src = p.image;
    media.appendChild(img);

    var body = document.createElement("div");
    body.className = "card__body";
    var meta = document.createElement("div");
    meta.className = "card__meta";
    var cat = document.createElement("span");
    cat.textContent = p.category;
    var chip = document.createElement("span");
    chip.className = "chip chip--" + p.marketplace.toLowerCase();
    chip.textContent = p.marketplace;
    meta.append(cat, chip);
    var h = document.createElement("h3");
    h.textContent = p.name;
    var cta = document.createElement("span");
    cta.className = "card__cta";
    cta.innerHTML = "Shop Now " + EXT;
    body.append(meta, h, cta);

    a.append(media, body);
    li.appendChild(a);
    return li;
  }
  function fill(el, list) { el.replaceChildren.apply(el, list.map(card)); }

  /* ---------- nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus();
      }
    });
  }
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- footer social + marketplace (from products.js) ---------- */
  var soc = document.getElementById("social-links");
  if (soc) D.site.social.forEach(function (s) {
    var li = document.createElement("li"), a = document.createElement("a");
    a.textContent = s.name;
    if (s.url) { a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer"; }
    else { a.href = "#"; a.setAttribute("aria-disabled", "true"); a.title = "Add your link in js/products.js"; a.addEventListener("click", function (e) { e.preventDefault(); }); }
    li.appendChild(a); soc.appendChild(li);
  });
  document.querySelectorAll("[data-marketplaces]").forEach(function (ul) {
    D.site.marketplaces.forEach(function (m) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.textContent = m.name; a.href = m.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      li.appendChild(a); ul.appendChild(li);
    });
  });

  /* ---------- home: featured ---------- */
  var feat = document.getElementById("featured-grid");
  if (feat) fill(feat, D.products.filter(function (p) { return p.featured; }));

  var colTiles = document.getElementById("collection-tiles");
  if (colTiles) D.collections.slice(0, 7).forEach(function (c) {
    var n = D.products.filter(function (p) { return p.collection === c.name; }).length;
    var li = document.createElement("li"), a = document.createElement("a");
    a.className = "col-tile"; a.href = "collections.html#" + c.slug;
    var ph = cover(c);
    var h = document.createElement("h3"); h.textContent = c.name;
    var s = document.createElement("span"); s.className = "n"; s.textContent = n + (n === 1 ? " piece" : " pieces");
    a.append(ph, h, s); li.appendChild(a); colTiles.appendChild(li);
  });

  /* ---------- shop: filters ---------- */
  var shopGrid = document.getElementById("shop-grid");
  if (shopGrid) {
    var filters = document.getElementById("filters");
    var count = document.getElementById("result-count");
    var empty = document.getElementById("empty");
    var clearBox = document.getElementById("collection-note");
    var params = new URLSearchParams(location.search);
    var state = { cat: "All Products", col: null };
    var wantCat = params.get("category"), wantCol = params.get("collection");
    if (wantCat && D.categories.indexOf(wantCat) > -1) state.cat = wantCat;
    if (wantCol && colByName[wantCol]) state.col = wantCol;

    var names = ["All Products"].concat(D.categories);
    names.forEach(function (name) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "filter"; b.dataset.cat = name;
      var n = name === "All Products" ? D.products.length : D.products.filter(function (p) { return p.category === name; }).length;
      b.append(document.createTextNode(name));
      var sm = document.createElement("small"); sm.textContent = n; b.appendChild(sm);
      b.addEventListener("click", function () { state.cat = name; render(true); });
      filters.appendChild(b);
    });

    function render(push) {
      var list = D.products.filter(function (p) {
        return (state.cat === "All Products" || p.category === state.cat) && (!state.col || p.collection === state.col);
      });
      fill(shopGrid, list);
      filters.querySelectorAll(".filter").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)); });
      count.textContent = "Showing " + list.length + " of " + D.products.length + " pieces";
      empty.hidden = list.length > 0;
      clearBox.replaceChildren();
      if (state.col) {
        var t = document.createElement("span"); t.textContent = "Collection: " + state.col;
        var x = document.createElement("button"); x.type = "button"; x.textContent = "Clear collection";
        x.addEventListener("click", function () { state.col = null; render(true); });
        clearBox.append(t, x);
      }
      if (push && history.replaceState) {
        var q = new URLSearchParams();
        if (state.cat !== "All Products") q.set("category", state.cat);
        if (state.col) q.set("collection", state.col);
        history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
      }
    }
    render(false);
  }

  /* ---------- collections page ---------- */
  var colRoot = document.getElementById("collections-root");
  if (colRoot) {
    var jump = document.getElementById("jump");
    D.collections.forEach(function (c) {
      var list = D.products.filter(function (p) { return p.collection === c.name; });
      if (!list.length) return;
      var ja = document.createElement("a"); ja.href = "#" + c.slug; ja.textContent = c.name; jump.appendChild(ja);

      var sec = document.createElement("section"); sec.className = "collection"; sec.id = c.slug;
      sec.setAttribute("aria-labelledby", c.slug + "-h");
      var wrap = document.createElement("div"); wrap.className = "wrap";
      var head = document.createElement("div"); head.className = "collection__head";
      var txt = document.createElement("div");
      var h = document.createElement("h2"); h.id = c.slug + "-h"; h.textContent = c.name;
      var p = document.createElement("p"); p.textContent = c.blurb + " (" + list.length + (list.length === 1 ? " piece)" : " pieces)");
      txt.append(h, p);
      var more = document.createElement("a"); more.className = "btn btn--white";
      more.href = "shop.html?collection=" + encodeURIComponent(c.name); more.textContent = "View in shop";
      head.append(cover(c), txt, more);
      var ul = document.createElement("ul"); ul.className = "grid"; fill(ul, list);
      wrap.append(head, ul); sec.appendChild(wrap); colRoot.appendChild(sec);
    });
  }
})();
