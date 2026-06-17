const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const quoteText = document.querySelector("#rotating-quote");
const quoteCaption = document.querySelector("#quote-caption");
const quoteButton = document.querySelector("#quote-button");
const tributeForm = document.querySelector("#tribute-form");
const tributeList = document.querySelector("#tribute-list");
const tributeMessage = document.querySelector("#tribute-message");
const tributeAuthor = document.querySelector("#tribute-author");
const characterCount = document.querySelector("#character-count");
const year = document.querySelector("#year");

const quotes = [
  {
    text: "\"Thou shalt reproduce before thou shalt patch.\"",
    caption: "A rotating engineering proverb"
  },
  {
    text: "\"A failing test is just prophecy with better formatting.\"",
    caption: "From the book of CI"
  },
  {
    text: "\"When in doubt, ask what Rudy would name this variable.\"",
    caption: "Naming is a sacred act"
  },
  {
    text: "\"Friday deploys are permitted only after sufficient offerings to observability.\"",
    caption: "A production reliability warning"
  }
];

let quoteIndex = 0;
let storedTributes = [];

try {
  storedTributes = JSON.parse(localStorage.getItem("rudyTributes") || "[]");
} catch (error) {
  storedTributes = [];
}

if (!Array.isArray(storedTributes)) {
  storedTributes = [];
}

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function closeMenu() {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

function rotateQuote() {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  quoteText.textContent = quotes[quoteIndex].text;
  quoteCaption.textContent = quotes[quoteIndex].caption;
}

function createTributeCard(message, author) {
  const card = document.createElement("article");
  card.className = "tribute-card";

  const copy = document.createElement("p");
  copy.textContent = `"${message}"`;

  const byline = document.createElement("span");
  byline.textContent = author;

  card.append(copy, byline);
  return card;
}

function renderStoredTributes() {
  storedTributes.forEach(({ message, author }) => {
    tributeList.prepend(createTributeCard(message, author));
  });
}

function saveTribute(message, author) {
  storedTributes.unshift({ message, author });
  try {
    localStorage.setItem("rudyTributes", JSON.stringify(storedTributes.slice(0, 12)));
  } catch (error) {
    storedTributes = storedTributes.slice(0, 12);
  }
}

function updateCharacterCount() {
  characterCount.textContent = tributeMessage.value.length;
}

function setActiveNavLink() {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  let visibleSection = sections[0];

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 120) {
      visibleSection = section;
    }
  });

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    link.classList.toggle("is-active", target === visibleSection);
  });
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

quoteButton.addEventListener("click", rotateQuote);

tributeMessage.addEventListener("input", updateCharacterCount);

tributeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = tributeMessage.value.trim();
  const author = tributeAuthor.value.trim();

  if (!message || !author) {
    return;
  }

  tributeList.prepend(createTributeCard(message, author));
  saveTribute(message, author);
  tributeForm.reset();
  updateCharacterCount();
});

window.addEventListener("scroll", () => {
  updateHeader();
  setActiveNavLink();
});

year.textContent = new Date().getFullYear();
renderStoredTributes();
updateHeader();
setActiveNavLink();
updateCharacterCount();
