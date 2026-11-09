/* Volkswagen Auto Hub — interactive demo logic */
"use strict";

const currencySettings = {
  INR: { symbol: "₹", rate: 93.83, locale: "en-IN" },
  USD: { symbol: "$", rate: 1, locale: "en-US" },
  EUR: { symbol: "€", rate: 0.92, locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.79, locale: "en-GB" },
  JPY: { symbol: "¥", rate: 155, locale: "ja-JP" }
};

const cars = [
  { id: 1, name: "Volkswagen Taigun GT", type: "SUV", year: 2024, km: "New", price: 18500, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80", description: "A compact SUV-style sample listing with a sporty appearance." },
  { id: 2, name: "Volkswagen Virtus", type: "Sedan", year: 2023, km: "12,500 km", price: 16000, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80", description: "A sedan-style sample listing for browsing and UI testing." },
  { id: 3, name: "Volkswagen Golf GTI", type: "Hatchback", year: 2022, km: "21,000 km", price: 27000, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80", description: "A hatchback-style sample listing with a performance theme." },
  { id: 4, name: "Volkswagen Tiguan", type: "SUV", year: 2024, km: "New", price: 31500, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80", description: "A larger SUV-style sample listing." },
  { id: 5, name: "Volkswagen ID.4", type: "Electric", year: 2024, km: "5,000 km", price: 39000, image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80", description: "An electric vehicle sample card. Listing is illustrative." },
  { id: 6, name: "Volkswagen Polo", type: "Hatchback", year: 2021, km: "34,000 km", price: 12500, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80", description: "A compact hatchback sample listing." }
];

const trackingSamples = {
  "VW-8829-X9": { status: "In transit", active: 3, eta: "Sample ETA: 18 Dec 2026", location: "Demo update: vehicle is shown as travelling from the dispatch port to the destination port." },
  "VW-1042-DE": { status: "Factory processing", active: 2, eta: "Sample ETA: 28 Dec 2026", location: "Demo update: vehicle is shown in the factory preparation stage." }
};

let activeFilter = "All";
let selectedCurrency = "INR";

const $ = (selector) => document.querySelector(selector);

function formatPrice(usdPrice) {
  const setting = currencySettings[selectedCurrency];
  const amount = usdPrice * setting.rate;
  return new Intl.NumberFormat(setting.locale, {
    style: "currency",
    currency: selectedCurrency,
    maximumFractionDigits: 0
  }).format(amount);
}

function renderCars() {
  const query = $("#carSearch").value.trim().toLowerCase();
  const visibleCars = cars.filter((car) => {
    const matchesFilter = activeFilter === "All" ||
      car.type === activeFilter ||
      (activeFilter === "SUV" && car.type === "SUV");
    const matchesSearch = car.name.toLowerCase().includes(query) || car.type.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  $("#carGrid").innerHTML = visibleCars.length ? visibleCars.map((car) => `
    <article class="car-card">
      <div class="car-image-wrap"><img class="car-image" src="${car.image}" alt="${car.name}" loading="lazy"></div>
      <div class="car-info">
        <span class="car-type">${car.type}</span>
        <h3>${car.name}</h3>
        <div class="car-meta"><span>◷ ${car.year}</span><span>⌁ ${car.km}</span></div>
        <div class="car-bottom"><span class="car-price">${formatPrice(car.price)}</span>
          <button class="details-button" type="button" data-car-id="${car.id}">Details</button>
        </div>
      </div>
    </article>`).join("") : `<div class="no-results">No matching sample cars found. Try another search.</div>`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

$("#currencySelect").addEventListener("change", (event) => {
  selectedCurrency = event.target.value;
  renderCars();
});

$("#carSearch").addEventListener("input", renderCars);
$("#filterRow").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-filter]");
  if (!chip) return;
  activeFilter = chip.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach((button) => button.classList.toggle("active", button === chip));
  renderCars();
});

$("#carGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-car-id]");
  if (!button) return;
  const car = cars.find((item) => item.id === Number(button.dataset.carId));
  if (car) showToast(`${car.name}: ${car.description}`);
});

$("#valuationForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const model = $("#model").value;
  const year = Number($("#year").value);
  const mileage = Number($("#mileage").value);
  const condition = Number($("#condition").value);
  const currentYear = new Date().getFullYear();

  if (!model || !Number.isFinite(year) || year < 2005 || year > currentYear || !Number.isFinite(mileage) || mileage < 0) {
    showToast("Please enter valid vehicle details.");
    return;
  }

  const baseValues = { Virtus: 14500, Taigun: 16500, Tiguan: 27000, Polo: 9000, Golf: 22000, "ID.4": 33000 };
  const ageFactor = Math.max(0.35, 1 - (currentYear - year) * 0.075);
  const mileageFactor = Math.max(0.55, 1 - mileage / 250000);
  const estimateUSD = baseValues[model] * ageFactor * mileageFactor * condition;
  $("#valuationResult").hidden = false;
  $("#valuationResult").innerHTML = `<b>Estimated sample value</b><strong>${formatPrice(estimateUSD)}</strong><p>${model} · ${year} · ${mileage.toLocaleString()} km. This is a basic formula-based estimate, not an AI result, market quote or purchase offer.</p>`;
});

function renderTracking(code) {
  const sample = trackingSamples[code.toUpperCase()];
  if (!sample) {
    $("#trackingResult").innerHTML = `<div class="empty-state"><span class="empty-icon">!</span><h3>Tracking ID not found</h3><p>Use VW-8829-X9 or VW-1042-DE to test this demo.</p></div>`;
    return;
  }
  const stages = ["Order placed", "Factory", "Shipping", "Delivered"];
  $("#trackingResult").innerHTML = `
    <div class="track-head"><div><p class="eyebrow">Tracking ID: ${code.toUpperCase()}</p><h3>Vehicle journey</h3></div><span class="status-pill">${sample.status}</span></div>
    <div class="track-line">${stages.map((stage, index) => `<div class="track-stage ${index < sample.active ? "done" : ""}"><span class="track-dot">${index < sample.active ? "✓" : index + 1}</span>${stage}</div>`).join("")}</div>
    <p class="muted">${sample.eta}</p><p class="track-location">⌖ ${sample.location}</p>
    <p class="hint">Demo-only status. This page is not connected to Volkswagen's order, VIN, shipping or GPS systems.</p>`;
}

$("#trackingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const code = $("#trackingCode").value.trim();
  if (!code) return;
  renderTracking(code);
});
document.querySelectorAll(".sample-code").forEach((button) => {
  button.addEventListener("click", () => {
    $("#trackingCode").value = button.dataset.code;
    renderTracking(button.dataset.code);
  });
});

$("#menuToggle").addEventListener("click", () => {
  const isOpen = $("#navLinks").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
});
$("#navLinks").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $("#navLinks").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
  }
});

const chatPanel = $("#chatPanel");
$("#chatLauncher").addEventListener("click", () => { chatPanel.hidden = !chatPanel.hidden; });
$("#chatClose").addEventListener("click", () => { chatPanel.hidden = true; });

function addChatMessage(message, className) {
  const element = document.createElement("p");
  element.className = className;
  element.textContent = message;
  $("#chatMessages").appendChild(element);
  $("#chatMessages").scrollTop = $("#chatMessages").scrollHeight;
}
function getDemoReply(question) {
  const text = question.toLowerCase();
  if (text.includes("price") || text.includes("value") || text.includes("sell")) return "Use the Sell a Car form to calculate a sample estimate. It is a learning demo, not a real market valuation.";
  if (text.includes("track") || text.includes("order") || text.includes("vin")) return "Try demo tracking ID VW-8829-X9 or VW-1042-DE in the tracking section.";
  if (text.includes("car") || text.includes("model") || text.includes("buy")) return "Explore the sample listings in Explore Volkswagen Cars. Use the category filters or search box.";
  if (text.includes("company") || text.includes("volkswagen") || text.includes("about")) return "Volkswagen was founded in Germany in 1937. This website is an independent student project, not an official company website.";
  return "I can help with the sample car listings, demo valuation, tracking IDs and the About section. This assistant uses preset replies, not a live AI service.";
}
$("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#chatInput");
  const message = input.value.trim();
  if (!message) return;
  addChatMessage(message, "user-message");
  input.value = "";
  window.setTimeout(() => addChatMessage(getDemoReply(message), "bot-message"), 350);
});

$("#currentYear").textContent = new Date().getFullYear();
renderCars();
