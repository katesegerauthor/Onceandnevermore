/* Once and Nevermore — A Camelot Anthology
   Author carousel + tiny helpers.
*/

const AUTHORS = [
  {
    name: "A. N. Author",
    story: "The Lake Remembers",
    img: "images/author-01.jpg",
    url: "https://example.com"
  },
  {
    name: "Briar Pendragon",
    story: "A Crown of Rowan",
    img: "images/author-02.jpg",
    url: "https://example.com"
  },
  {
    name: "Carys of Orkney",
    story: "Salt on the Sword",
    img: "images/author-03.jpg",
    url: "https://example.com"
  },
  {
    name: "Dorian Du Lac",
    story: "The Scabbard’s Oath",
    img: "images/author-04.jpg",
    url: "https://example.com"
  },
  {
    name: "Eira the Bard",
    story: "Ballad for a Broken Grail",
    img: "images/author-05.jpg",
    url: "https://example.com"
  },
  {
    name: "Faelan the Smith",
    story: "Iron, Ash, and Avalon's Breath",
    img: "images/author-06.jpg",
    url: "https://example.com"
  },
  {
    name: "Kate Seger",
    story: "Kate's Lovely Camelot Lunacy (Placeholder short story title!)",
    img: "images/Shadowsister.jpg",
    url: "https://kateseger.com/"
  },
  {
    name: "Lucius Montegrot",
    story: "The Peacemaker invades Camelot (Placeholder short story title!)",
    img: "images/Lucius.jpg",
    url: "https://www.whoisluciusmontegrot.com"
  }
];

(function initOnceNevermore(){
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Contact page “send raven” fallback
  window.ONCE_NEVERMORE_sendRaven = function(e){
    const form = e?.target;
    if (!form) return true;

    // If the developer has replaced action="#" with a real endpoint, let it submit normally.
    const action = (form.getAttribute("action") || "").trim();
    if (action && action !== "#") return true;

    e.preventDefault();

    const name = (form.name?.value || "").trim();
    const email = (form.email?.value || "").trim();
    const message = (form.message?.value || "").trim();

    const subject = encodeURIComponent("Once and Nevermore — Contact");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}\n`
    );

    // Replace the email below with your real inbox.
    const to = "editor@example.com";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    return false;
  };

  // Carousel
  const shell = document.getElementById("authorCarousel");
  if (!shell) return;

  const track = shell.querySelector(".carousel-track");
  const btnPrev = shell.querySelector(".carousel-btn.prev");
  const btnNext = shell.querySelector(".carousel-btn.next");

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  let active = 0;
  let timer = null;
  const cards = [];

  function signedDistance(i){
    const n = AUTHORS.length;
    let d = i - active;
    if (d > n/2) d -= n;
    if (d < -n/2) d += n;
    return d;
  }

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  function setActive(next){
    const n = AUTHORS.length;
    active = (next + n) % n;
    update();
  }

  function update(){
    const n = AUTHORS.length;

    for (let i = 0; i < n; i++){
      const card = cards[i];
      const d = signedDistance(i);
      const abs = Math.abs(d);

      const x = d * 210;                 // horizontal spread
      const s = clamp(1.15 - abs*0.14, 0.72, 1.15);
      const ry = clamp(d * -18, -60, 60);
      const op = clamp(1 - abs*0.18, 0.18, 1);
      const blur = clamp(abs * 0.35, 0, 1.4);

      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--s", `${s}`);
      card.style.setProperty("--ry", `${ry}deg`);
      card.style.setProperty("--op", `${op}`);
      card.style.setProperty("--blur", `${blur}px`);
      card.style.zIndex = String(100 - abs);

      if (i === active){
        card.classList.add("active");
        card.querySelector(".card-link")?.setAttribute("aria-current", "true");
      } else {
        card.classList.remove("active");
        card.querySelector(".card-link")?.removeAttribute("aria-current");
      }
    }
  }

  function stopAuto(){
    if (timer){
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAuto(){
    if (prefersReducedMotion) return;
    stopAuto();
    timer = window.setInterval(() => setActive(active + 1), 4400);
  }

  function build(){
    track.innerHTML = "";
    cards.length = 0;

    AUTHORS.forEach((a, idx) => {
      const li = document.createElement("li");
      li.className = "card";
      li.dataset.index = String(idx);

      const link = document.createElement("a");
      link.className = "card-link";
      link.href = a.url || "#";
      link.setAttribute("aria-label", `${a.name} — open chosen page`);
      if ((a.url || "").startsWith("http")){
        link.target = "_blank";
        link.rel = "noopener";
      }

      const img = document.createElement("img");
      img.src = a.img;
      img.alt = `${a.name} portrait`;
      img.loading = "lazy";
      img.decoding = "async";

      // If an image is missing, show a gentle fallback instead of a broken icon.
      img.addEventListener("error", () => {
        img.remove();
        const fallback = document.createElement("div");
        fallback.className = "img-fallback";
        fallback.textContent = a.name.trim().slice(0,1).toUpperCase();
        link.prepend(fallback);
      });

      const meta = document.createElement("div");
      meta.className = "card-meta";

      const h3 = document.createElement("h3");
      h3.textContent = a.name;

      const p = document.createElement("p");
      p.textContent = a.story || "";

      meta.appendChild(h3);
      meta.appendChild(p);

      link.appendChild(img);
      link.appendChild(meta);
      li.appendChild(link);

      link.addEventListener("click", (e) => {
        const i = Number(li.dataset.index);
        // First click focuses the author; second click (when active) follows the link.
        if (i !== active){
          e.preventDefault();
          setActive(i);
          return;
        }
        if (!a.url || a.url === "#"){
          e.preventDefault();
        }
      });

      track.appendChild(li);
      cards.push(li);
    });

    update();
  }

  // Input
  btnPrev?.addEventListener("click", () => setActive(active - 1));
  btnNext?.addEventListener("click", () => setActive(active + 1));

  shell.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft"){ e.preventDefault(); setActive(active - 1); }
    if (e.key === "ArrowRight"){ e.preventDefault(); setActive(active + 1); }
    if (e.key === "Home"){ e.preventDefault(); setActive(0); }
    if (e.key === "End"){ e.preventDefault(); setActive(AUTHORS.length - 1); }
  });

  // Hover / focus pauses auto-rotation
  shell.addEventListener("pointerenter", stopAuto);
  shell.addEventListener("pointerleave", startAuto);
  shell.addEventListener("focusin", stopAuto);
  shell.addEventListener("focusout", startAuto);

  // Touch swipe (simple)
  let startX = null;
  shell.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
  });
  shell.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setActive(active + 1);
    else setActive(active - 1);
  });

  build();
  startAuto();
})();
