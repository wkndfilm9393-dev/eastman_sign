// Eastman Film Lab website: mobile nav, scroll reveal, hero video, estimate builder.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile nav toggle
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Hero video: the markup has no autoplay, so visitors who prefer reduced motion keep the still poster.
  const video = document.querySelector(".hero__media video");
  if (video && !reduceMotion) video.play().catch(() => {});

  // Fade sections in as they scroll into view.
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // ---------- Estimate builder (pricing.html) ----------
  const form = document.querySelector("#builder");
  if (!form) return;

  // Prices are read from the price list on the same page, so there is only one place to edit them.
  // Each price cell has data-price="<process>.<format>.<quality>" and shows the sign value (e.g. 6.0).
  const UNIT = Number(form.dataset.unit); // won per 1.0 on the price list
  const price = (key) => {
    const el = document.querySelector(`[data-price="${key}"]`);
    return el ? parseFloat(el.textContent) : NaN;
  };
  const won = (n) => "₩" + Math.round(n).toLocaleString("ko-KR");

  const NAMES = {
    process: { c41: "C-41 컬러", bw: "B&W 흑백", e6: "E-6 슬라이드" },
    format: { "35": "35mm", "120": "120 중형" },
    quality: { basic: "Basic 일반화질", high: "High 고화질" },
    print: { "3x5": "3×5", "4x6": "4×6", "5x7": "5×7" },
  };

  const counts = { rolls: 1, prints: 0 };
  const val = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value;

  form.querySelectorAll(".stepper").forEach((s) => {
    const key = s.dataset.count;
    const min = Number(s.dataset.min || 0);
    const max = Number(s.dataset.max || 999);
    const out = s.querySelector("output");
    s.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      counts[key] = Math.min(max, Math.max(min, counts[key] + Number(btn.dataset.step)));
      out.textContent = counts[key];
      update();
    });
  });
  form.addEventListener("change", update);

  function update() {
    const process = val("process");
    const format = val("format");
    // E-6 has one price, and 120 has no Basic/High split, so the quality choice only applies to 35mm C-41 and B&W.
    const hasQuality = process !== "e6" && format === "35";
    const hasFormat = process !== "e6";
    form.querySelector("#q-quality").hidden = !hasQuality;
    form.querySelector("#q-format").hidden = !hasFormat;
    form.querySelector("#q-print-size").hidden = counts.prints === 0;

    let key, label;
    if (process === "e6") {
      key = "e6"; label = NAMES.process.e6;
    } else if (format === "120") {
      key = `${process}.120`; label = `${NAMES.process[process]} · ${NAMES.format["120"]}`;
    } else {
      const q = val("quality");
      key = `${process}.35.${q}`; label = `${NAMES.process[process]} · ${NAMES.quality[q]}`;
    }
    const rollPrice = price(key) * UNIT;
    const lines = [[`${label} × ${counts.rolls}롤`, rollPrice * counts.rolls]];

    if (counts.prints > 0) {
      const size = val("print");
      lines.push([`인화 ${NAMES.print[size]} × ${counts.prints}장`, price(`print.${size}`) * UNIT * counts.prints]);
    }

    const total = lines.reduce((sum, [, v]) => sum + v, 0);
    document.querySelector("#summary-lines").innerHTML = lines
      .map(([l, v]) => `<li><span>${l}</span><span>${won(v)}</span></li>`)
      .join("");
    document.querySelector("#summary-total").textContent = won(total);
  }

  update();
})();
