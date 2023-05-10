const modal = document.querySelector("#modal");
const modalShow = document.querySelector("#show-modal");
const modalClose = document.querySelector("#close-modal");
const bookmarkForm = document.querySelector("#bookmark-form");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const bookmarksContainer = document.querySelector("#bookmarks-container");

let bookmarks = {};

// Show Modal, Focus on Input
const showModal = function () {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};

// Modal Event Listener
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (event) =>
  event.target === modal ? modal.classList.remove("show-modal") : ""
);

// Validate form

const validate = function (nameValue, url) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!nameValue || !url) {
    alert("Please submit values for both fields.");
    return false;
  }

  if (!url.match(regex)) {
    alert("Please provide a valid address");
    return false;
  }

  return true;
};

// Build bookmarks DOM
const buildBookmark = function () {
  // Remove all bookmark elements
  bookmarksContainer.textContent = "";
  // Build items
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];

    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-xmark");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://www.google.com/s2/u/0/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

// Fetch bookmarks from localStorage
const fetchBookmarks = function () {
  // Get bookmars from localStorage if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }

  buildBookmark();
};

// Delete bookmark
const deleteBookmark = function (id) {
  console.log(bookmarks);

  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

// Handle data from form
const storeBookmark = function (e) {
  e.preventDefault();

  console.log(e.target);
  const nameValue = websiteNameEl.value;
  let url = websiteUrlEl.value;
  if (!url.includes("http://", "https://")) {
    url = `https://${url}`;
  }
  if (!validate(nameValue, url)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: url,
  };

  bookmarks[url] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On Load, fetch bookmarks
fetchBookmarks();
