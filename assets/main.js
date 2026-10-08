"use strict";

document.body.classList.add("has-js");

const translations = window.homepageTranslations;
const publications = [...document.querySelectorAll(".publication")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const publicationCount = document.querySelector(".publication-count");
const viewAllButton = document.querySelector(".view-all");
const toolbar = document.querySelector(".publication-toolbar");
const languageButtons = [...document.querySelectorAll("[data-language]")];
const languageSwitch = document.querySelector(".language-switch");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navigationLinks = [...navigation.querySelectorAll("a")];
let currentLanguage = "zh";
let currentFilter = "selected";

function translate(key, values = {}) {
  const template = translations[currentLanguage][key] ?? translations.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}

function updatePublicationLabels() {
  const visible = publications.filter((publication) => !publication.hidden).length;
  publicationCount.textContent = translate("publicationCount", { visible, total: publications.length });
  viewAllButton.querySelector("[data-i18n]").textContent = translate("viewAll", { total: publications.length });
  document.querySelector(".filter-total").textContent = publications.length;
  document.querySelectorAll("[data-citations]").forEach((element) => {
    element.textContent = translate(element.dataset.citations === "1" ? "citationSingle" : "citationCount", { count: element.dataset.citations });
  });
  document.querySelectorAll("[data-paper-link]").forEach((link) => {
    link.setAttribute("aria-label", translate("paperLinkLabel", { title: translate(link.dataset.paperLink) }));
  });
}

function setLanguage(language) {
  if (!Object.hasOwn(translations, language)) return;
  currentLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = translate("pageTitle");
  document.querySelector('meta[name="description"]').content = translate("pageDescription");
  document.querySelector('meta[property="og:title"]').content = translate("pageTitle");
  document.querySelector('meta[property="og:description"]').content = translate("pageDescription");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = translate(element.dataset.i18nAlt);
  });
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  languageSwitch.setAttribute("aria-label", translate("languageLabel"));
  menuButton.setAttribute("aria-label", translate(menuButton.getAttribute("aria-expanded") === "true" ? "closeMenu" : "openMenu"));
  updatePublicationLabels();
  // Some browsers restrict storage for local files or private browsing.
  try { localStorage.setItem("meng-li-language", language); } catch { /* Switching still works. */ }
}

function filterPublications(filter) {
  if (!filterButtons.some((button) => button.dataset.filter === filter)) return;
  currentFilter = filter;
  publications.forEach((publication) => {
    const topics = publication.dataset.topics.split(" ");
    publication.hidden = !(filter === "all" || (filter === "selected"
      ? publication.dataset.selected === "true"
      : topics.includes(filter)));
  });
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  viewAllButton.hidden = filter === "all";
  updatePublicationLabels();
}

toolbar.hidden = false;
languageSwitch.hidden = false;
menuButton.hidden = false;

let savedLanguage;
try { savedLanguage = localStorage.getItem("meng-li-language"); } catch { /* Use the default. */ }
setLanguage(savedLanguage === "en" ? "en" : "zh");
filterPublications(currentFilter);

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});
filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterPublications(button.dataset.filter));
});
viewAllButton.addEventListener("click", () => {
  filterPublications("all");
  filterButtons.find((button) => button.dataset.filter === "all").focus({ preventScroll: true });
  toolbar.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
});
document.querySelectorAll("[data-research-filter]").forEach((link) => {
  link.addEventListener("click", () => filterPublications(link.dataset.researchFilter));
});

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", translate("openMenu"));
  navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menuButton.setAttribute("aria-label", translate(expanded ? "openMenu" : "closeMenu"));
  navigation.classList.toggle("is-open", !expanded);
});
navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width: 1001px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

if ("IntersectionObserver" in window) {
  const sections = navigationLinks.map((link) => document.querySelector(link.hash));
  const visibleSections = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    const current = sections.find((section) => visibleSections.has(section));
    navigationLinks.forEach((link) => {
      if (current && link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-112px 0px -45% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
