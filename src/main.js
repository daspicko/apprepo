import "./style.css";

// ── Tool Data ────────────────────────────────────────
const tools = [
  // Productivity
  { id: "calculator",       icon: "🧮", name: "Calculator",         desc: "Crunch numbers quickly with a clean calculator.",   category: "productivity", url: "#" },
  { id: "date-formatter",   icon: "📅", name: "Date Formatter",     desc: "Convert and format dates between any format.",       category: "productivity", url: "#" },
  { id: "invoice-gen",      icon: "🧾", name: "Invoice Generator",  desc: "Create professional invoices in seconds.",           category: "productivity", url: "#" },
  { id: "pomodoro",         icon: "⏱️", name: "Pomodoro Timer",     desc: "Stay focused with timed work sessions.",             category: "productivity", url: "#" },
  { id: "notes",            icon: "📝", name: "Quick Notes",        desc: "Jot down ideas without leaving your browser.",       category: "productivity", url: "#" },
  { id: "todo",             icon: "✅", name: "To-Do List",         desc: "Manage tasks with a minimal to-do app.",             category: "productivity", url: "#" },

  // Data Tools
  { id: "csv-viewer",       icon: "📊", name: "CSV Viewer",         desc: "View and explore CSV files in a sortable table.",    category: "data",        url: "#" },
  { id: "json-formatter",   icon: "🧰", name: "JSON Formatter",     desc: "Pretty-print and validate JSON data.",               category: "data",        url: "#" },
  { id: "base64",           icon: "🔣", name: "Base64 Encoder",     desc: "Encode and decode Base64 strings instantly.",        category: "data",        url: "#" },
  { id: "markdown-preview", icon: "📄", name: "Markdown Preview",   desc: "Live-preview Markdown with syntax highlighting.",   category: "data",        url: "#" },
  { id: "unit-converter",   icon: "📐", name: "Unit Converter",     desc: "Convert units for length, weight, volume & more.",  category: "data",        url: "#" },

  // Development
  { id: "regex-tester",     icon: "🔎", name: "Regex Tester",       desc: "Build and test regular expressions live.",           category: "development", url: "#" },
  { id: "color-picker",     icon: "🎨", name: "Color Picker",       desc: "Pick colors and copy HEX, RGB, or HSL values.",     category: "development", url: "#" },
  { id: "password-maker",   icon: "🔐", name: "Password Maker",     desc: "Generate strong, random passwords on demand.",       category: "development", url: "#" },
  { id: "lorem-gen",        icon: "📃", name: "Lorem Generator",    desc: "Generate placeholder text for your layouts.",        category: "development", url: "#" },
  { id: "diff-checker",     icon: "🔀", name: "Diff Checker",       desc: "Compare two texts and spot the differences.",        category: "development", url: "#" },

  // Design Helpers
  { id: "gradient-maker",   icon: "🌈", name: "Gradient Maker",     desc: "Create beautiful CSS gradients visually.",           category: "design",      url: "#" },
  { id: "shadow-gen",       icon: "🖼️", name: "Shadow Generator",   desc: "Design and export CSS box-shadow values.",          category: "design",      url: "#" },
  { id: "font-preview",     icon: "🔤", name: "Font Preview",       desc: "Preview Google Fonts side by side.",                 category: "design",      url: "#" },
  { id: "image-resizer",    icon: "🖼️", name: "Image Resizer",      desc: "Resize and crop images right in the browser.",      category: "design",      url: "#" },

  // Health tools
  { id: "zalihe-krvi", icon: "🩸", name: "Zalihe Krvi",       desc: "Prikaz zaliha krvi po bolničkim centrima.",         category: "health", url: "https://zalihe-krvi.apprepo.eu" },
].filter(tool => tool && tool.url && tool.url.endsWith("apprepo.eu"));

// ── State ────────────────────────────────────────────
let activeCategory = "all";
let searchQuery = "";
let favorites = JSON.parse(localStorage.getItem("toolbox-favs") || "[]");

// ── DOM refs ─────────────────────────────────────────
const toolGrid        = document.getElementById("toolGrid");
const favoritesGrid   = document.getElementById("favoritesGrid");
const favoritesSection = document.getElementById("favoritesSection");
const searchInput     = document.getElementById("searchInput");
const noResults       = document.getElementById("noResults");
const categoryBtns    = document.querySelectorAll(".cat-btn");

// ── Render ───────────────────────────────────────────
function isFav(id) {
  return favorites.includes(id);
}

function createCard(tool, isFavoriteCard = false) {
  const card = document.createElement("a");
  card.href = tool.url;
  card.target = "_blank";
  card.className = "tool-card";
  card.dataset.category = tool.category;
  card.dataset.id = tool.id;

  card.innerHTML = `
    <button class="card-fav ${isFav(tool.id) ? "is-fav" : ""}" title="Toggle favorite" data-fav="${tool.id}">
      ${isFav(tool.id) ? "★" : "☆"}
    </button>
    <span class="card-icon">${tool.icon}</span>
    <span class="card-name">${tool.name}</span>
    <span class="card-desc">${tool.desc}</span>
    <span class="card-category">${tool.category}</span>
  `;

  // Prevent link navigation when clicking the fav button
  card.querySelector(".card-fav").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(tool.id);
  });

  return card;
}

function render() {
  // Filter tools
  const filtered = tools.filter((t) => {
    const matchesCat = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery) ||
      t.desc.toLowerCase().includes(searchQuery) ||
      t.category.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  // Main grid
  toolGrid.innerHTML = "";
  filtered.forEach((t) => toolGrid.appendChild(createCard(t)));

  noResults.hidden = filtered.length > 0;

  // Favorites grid
  const favTools = tools.filter((t) => favorites.includes(t.id));
  favoritesSection.hidden = favTools.length === 0;
  favoritesGrid.innerHTML = "";
  favTools.forEach((t) => favoritesGrid.appendChild(createCard(t, true)));
}

// ── Favorites toggle ─────────────────────────────────
function toggleFav(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("toolbox-favs", JSON.stringify(favorites));
  render();
}

// ── Events ───────────────────────────────────────────
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  render();
});

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    render();
  });
});

// ── Init ─────────────────────────────────────────────
render();
