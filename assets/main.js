/* NexChair — static prototype behaviour */

// Replace with the client's WhatsApp number (country code, no + or spaces), e.g. "919876543210"
const WHATSAPP_NUMBER = "";

const PRODUCTS = [
  { id: "nx-t1", code: "NX-T1", name: "NX Task Mesh",     cat: "ergonomic", tag: "Ergonomic task",     arms: "3D",    back: "mesh",        backLabel: "Mesh",    features: ["lumbar", "slider"] },
  { id: "nx-p2", code: "NX-P2", name: "NX Pro Mesh",      cat: "ergonomic", tag: "Ergonomic task",     arms: "4D",    back: "mesh",        backLabel: "Mesh",    features: ["lumbar", "headrest", "slider", "synchro"] },
  { id: "nx-h1", code: "NX-H1", name: "NX Home Compact",  cat: "wfh",       tag: "Ergonomic task",     arms: "2D",    back: "mesh",        backLabel: "Mesh",    features: ["lumbar"] },
  { id: "nx-e1", code: "NX-E1", name: "NX Executive",     cat: "executive", tag: "Executive",          arms: "3D",    back: "leatherette", backLabel: "Leather", features: ["headrest", "synchro"] },
  { id: "nx-e2", code: "NX-E2", name: "NX Board",         cat: "executive", tag: "Executive",          arms: "Fixed", back: "foam",        backLabel: "Foam",    features: [] },
  { id: "nx-g1", code: "NX-G1", name: "NX Studio",        cat: "gaming",    tag: "Gaming",             arms: "4D",    back: "foam",        backLabel: "Foam",    features: ["lumbar", "headrest"] },
  { id: "nx-v1", code: "NX-V1", name: "NX Nest",          cat: "visitor",   tag: "Visitor & training", arms: "None",  back: "mesh",        backLabel: "Mesh",    features: [] },
  { id: "nx-v2", code: "NX-V2", name: "NX Stack",         cat: "visitor",   tag: "Visitor & training", arms: "Fixed", back: "foam",        backLabel: "Foam",    features: [] },
  { id: "nx-s1", code: "NX-S1", name: "NX Draft Stool",   cat: "drafting",  tag: "Drafting stools",    arms: "None",  back: "foam",        backLabel: "Foam",    features: [] },
];

const CATS = {
  all: "All", ergonomic: "Ergonomic task", executive: "Executive", gaming: "Gaming",
  visitor: "Visitor & training", drafting: "Drafting stools", wfh: "Work-from-home",
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Header ---------- */
const menuBtn = $(".menu-btn");
if (menuBtn) menuBtn.addEventListener("click", () => $(".site-header").classList.toggle("open"));

/* ---------- WhatsApp links ---------- */
function openWhatsApp(text) {
  const msg = encodeURIComponent(text || "Hi NexChair, I'd like to know more about your chairs.");
  if (!WHATSAPP_NUMBER) {
    alert("Prototype: the WhatsApp number will be connected here.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank", "noopener");
}
document.addEventListener("click", (e) => {
  const wa = e.target.closest("[data-wa]");
  if (wa) { e.preventDefault(); openWhatsApp(wa.dataset.wa); }

  const enq = e.target.closest("[data-enquire]");
  if (enq) {
    e.preventDefault();
    enq.classList.toggle("added");
    const orig = enq.dataset.label || enq.textContent;
    enq.dataset.label = orig;
    enq.textContent = enq.classList.contains("added") ? "Added ✓" : orig;
  }
});

/* ---------- Home carousel ---------- */
const car = $(".carousel");
if (car) {
  $$("[data-car]").forEach((b) =>
    b.addEventListener("click", () => {
      const card = car.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 18 : 300;
      car.scrollBy({ left: b.dataset.car === "next" ? step : -step, behavior: "smooth" });
    })
  );
}

/* ---------- Home spec finder ---------- */
const finder = $("#finder");
if (finder) {
  finder.addEventListener("submit", (e) => {
    e.preventDefault();
    const back = $("#f-back").value;
    location.href = "range.html" + (back ? `?back=${back}` : "");
  });
}

/* ---------- Range page ---------- */
const grid = $("#range-grid");
if (grid) {
  const params = new URLSearchParams(location.search);
  const state = {
    cat: CATS[params.get("cat")] ? params.get("cat") : "all",
    back: new Set(params.get("back") ? [params.get("back")] : []),
    arms: new Set(),
    features: new Set(),
    sort: "rec",
    compare: new Set(),
  };

  const armKey = (a) => (a === "None" ? "armless" : a === "Fixed" ? "fixed" : a === "4D" ? "4d" : "2d3d");
  const armLabel = { fixed: "Fixed arms", "2d3d": "2D / 3D arms", "4d": "4D arms", armless: "Armless" };
  const backLabel = { mesh: "Mesh", foam: "Moulded foam", leatherette: "Leatherette" };
  const featLabel = { lumbar: "Adjustable lumbar", headrest: "Headrest", slider: "Seat slider", synchro: "Synchro-tilt" };

  function card(p) {
    const checked = state.compare.has(p.id) ? "checked" : "";
    return `
    <article class="prod-card">
      <div class="prod-media">
        <span class="tag">${p.tag}</span>
        <label class="compare-chk"><input type="checkbox" data-compare="${p.id}" ${checked}> Compare</label>
        <img src="assets/chair.svg" alt="">
      </div>
      <div class="prod-body">
        <span class="prod-code">${p.code}</span>
        <h3>${p.name}</h3>
        <div class="spec-mini mono">
          <div><small>Load</small>[–] kg</div>
          <div><small>Arms</small>${p.arms}</div>
          <div><small>Back</small>${p.backLabel}</div>
        </div>
        <div class="price-row"><span>[₹ PRICE]</span><a href="specifications.html?model=${p.id}">Full specs</a></div>
        <div class="btn-pair">
          <a href="contact.html?model=${p.id}" class="btn btn-dark btn-sm">Enquire</a>
          <a href="#" class="btn btn-outline-wa btn-sm" data-wa="Hi NexChair, I'm interested in the ${p.name} (${p.code}).">WhatsApp</a>
        </div>
      </div>
    </article>`;
  }

  function render() {
    let list = PRODUCTS.filter((p) =>
      (state.cat === "all" || p.cat === state.cat) &&
      (!state.back.size || state.back.has(p.back)) &&
      (!state.arms.size || state.arms.has(armKey(p.arms))) &&
      [...state.features].every((f) => p.features.includes(f))
    );
    if (state.sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === "za") list = [...list].sort((a, b) => b.name.localeCompare(a.name));

    grid.innerHTML = list.length
      ? list.map(card).join("")
      : `<div class="empty">No chairs match these filters. <br><button class="btn btn-outline btn-sm" style="margin-top:14px" id="empty-clear">Clear filters</button></div>`;

    $("#count").textContent = `${list.length} chair${list.length === 1 ? "" : "s"}`;

    // Active filter chips
    const chips = [
      ...[...state.back].map((v) => ({ k: "back", v, t: backLabel[v] })),
      ...[...state.arms].map((v) => ({ k: "arms", v, t: armLabel[v] })),
      ...[...state.features].map((v) => ({ k: "features", v, t: featLabel[v] })),
    ];
    $("#active-chips").innerHTML = chips
      .map((c) => `<button class="active-chip" data-k="${c.k}" data-v="${c.v}">${c.t} ×</button>`)
      .join("");

    // Sync pills & checkboxes
    $$(".pill").forEach((b) => b.classList.toggle("active", b.dataset.cat === state.cat));
    $$("[data-filter]").forEach((i) => (i.checked = state[i.dataset.filter].has(i.value)));

    // Compare bar
    $("#cmp-count").textContent = state.compare.size;
    $("#cmp-btn").textContent = `Compare (${state.compare.size})`;
    $(".compare-bar").classList.toggle("show", state.compare.size > 0);
  }

  $$(".pill").forEach((b) => b.addEventListener("click", () => { state.cat = b.dataset.cat; render(); }));
  $$("[data-filter]").forEach((i) =>
    i.addEventListener("change", () => {
      const set = state[i.dataset.filter];
      i.checked ? set.add(i.value) : set.delete(i.value);
      render();
    })
  );
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  function clearAll() {
    state.cat = "all"; state.back.clear(); state.arms.clear(); state.features.clear();
    $$(".filters input[type=radio]").forEach((r) => (r.checked = false));
    render();
  }
  $("#clear-all").addEventListener("click", clearAll);

  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".active-chip");
    if (chip) { state[chip.dataset.k].delete(chip.dataset.v); render(); }
    if (e.target.id === "empty-clear") clearAll();
    if (e.target.closest(".swatch")) e.target.closest(".swatch").classList.toggle("on");
  });
  grid.addEventListener("change", (e) => {
    const id = e.target.dataset.compare;
    if (!id) return;
    if (e.target.checked) {
      if (state.compare.size >= 3) { e.target.checked = false; alert("You can compare up to 3 chairs."); return; }
      state.compare.add(id);
    } else state.compare.delete(id);
    render();
  });
  const goCompare = () => {
    const ids = [...state.compare].join(",");
    location.href = `specifications.html?model=${state.compare.values().next().value || "nx-p2"}&compare=${ids}#compare`;
  };
  $("#cmp-btn").addEventListener("click", goCompare);
  $("#cmp-go").addEventListener("click", goCompare);

  const ft = $(".filter-toggle");
  if (ft) ft.addEventListener("click", () => $(".filters").classList.toggle("open"));

  $$(".pager button").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.page === "next") return;
      $$(".pager button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
    })
  );

  render();
}

/* ---------- Specifications page ---------- */
const pdp = $("#pdp");
if (pdp) {
  const params = new URLSearchParams(location.search);
  const p = PRODUCTS.find((x) => x.id === params.get("model")) || PRODUCTS[1];
  $$("[data-p]").forEach((el) => {
    const k = el.dataset.p;
    el.textContent = k === "back" ? p.backLabel : p[k];
  });
  document.title = `${p.name} — Specifications | NexChair`;
  $$("[data-wa-model]").forEach((el) => (el.dataset.wa = `Hi NexChair, please share the spec sheet for the ${p.name} (${p.code}).`));
  $$("[data-enquire-link]").forEach((el) => (el.href = `contact.html?model=${p.id}`));

  $$(".thumb").forEach((t) =>
    t.addEventListener("click", () => {
      $$(".thumb").forEach((x) => x.classList.remove("on"));
      t.classList.add("on");
    })
  );

  // Compare table
  let ids = (params.get("compare") || "").split(",").filter((id) => PRODUCTS.some((x) => x.id === id));
  if (!ids.includes(p.id)) ids.unshift(p.id);
  if (ids.length < 3) {
    PRODUCTS.filter((x) => x.cat === p.cat && !ids.includes(x.id)).forEach((x) => ids.length < 3 && ids.push(x.id));
    PRODUCTS.filter((x) => !ids.includes(x.id)).forEach((x) => ids.length < 3 && ids.push(x.id));
  }
  const cols = ids.slice(0, 3).map((id) => PRODUCTS.find((x) => x.id === id));
  const rows = [
    ["Price", () => "[₹ PRICE]"],
    ["Lumbar", (c) => (c.features.includes("lumbar") ? "Adjustable" : "Fixed / —")],
    ["Arms", (c) => c.arms],
    ["Back", (c) => c.backLabel],
    ["Headrest", (c) => (c.features.includes("headrest") ? "Yes" : "—")],
    ["Seat slider", (c) => (c.features.includes("slider") ? "Yes" : "—")],
    ["Max user weight", () => "[–] kg"],
    ["Warranty", () => "[X] yrs"],
  ];
  const hl = (c) => (c.id === p.id ? ' class="hl"' : "");
  $("#compare-table").innerHTML = `
    <thead><tr><th>Specification</th>${cols.map((c) => `<th${hl(c)}>${c.name}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .map(([label, fn]) => `<tr><th>${label}</th>${cols.map((c) => `<td${hl(c)}>${fn(c)}</td>`).join("")}</tr>`)
      .join("")}</tbody>`;

  // Tabs scroll-highlight
  $$(".tabs a").forEach((a) =>
    a.addEventListener("click", () => {
      $$(".tabs a").forEach((x) => x.classList.remove("on"));
      a.classList.add("on");
    })
  );
}

/* ---------- Contact form ---------- */
const form = $("#enquiry-form");
if (form) {
  const params = new URLSearchParams(location.search);
  const p = PRODUCTS.find((x) => x.id === params.get("model"));
  if (p) $("#c-model").value = p.id;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    $(".form-done").style.display = "block";
    form.querySelectorAll("input, select, textarea, button").forEach((el) => (el.disabled = true));
    $(".form-done").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}
