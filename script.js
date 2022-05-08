const hamburger = document.querySelector(".hamburger"),
  navList = document.getElementById("nav-list-group"),
  form = document.getElementById("form"),
  linkInput = document.getElementById("link-input"),
  errorMessage = document.getElementById("error-message");

window.addEventListener("click", handleDisplayNavBar);
window.addEventListener("DOMContentLoaded", getFromStorage);
form.addEventListener("submit", handleSubmitForm);

/**
 * If the clicked element is not among the elements inside the nav bar, then it adds hide--nav-list class.
 */
function handleDisplayNavBar(e) {
  const el = e.target;
  if (el === hamburger) navList.classList.toggle("hide--nav-list");
  if (
    !(
      el.classList.contains("nav__link") ||
      el.classList.contains("nav-list") ||
      el.classList.contains("btn__sign-up") ||
      el.parentNode.classList.contains("nav") ||
      el.parentNode.classList.contains("nav-list")
    )
  )
    navList.classList.add("hide--nav-list");
}
/**
 * If the input is empty or doesn't match the regular expression, add an error class to the input and
 * display an error message. Otherwise, remove the error class and display the link.
 */
function handleSubmitForm(e) {
  const linkToShorten = linkInput.value;
  const re = /.[\D]$/i; //must end with dot followed by a letter
  if (!linkToShorten.trim() || !re.test(linkToShorten)) {
    linkInput.classList.add("form__input--error");
    errorMessage.textContent = "Please add a link";
  } else {
    errorMessage.textContent = "";
    linkInput.classList.remove("form__input--error");
    addNewLinkElement(linkToShorten);
  }
  linkInput.value = "";
  e.preventDefault();
}

/**
 * It takes a link, shortens it, then creates a new element with the shortened link, and adds the
 * shortened link and the original link to the local storage.
 * @param linkToShorten - The link that the user wants to shorten.
 */
function addNewLinkElement(linkToShorten) {
  shortenLink(linkToShorten).then((shortLink) => {
    if (!shortLink) return;
    createNewElement(linkToShorten, shortLink);
    addToStorage("short", shortLink);
    addToStorage("long", linkToShorten);
  });
}

/**
 * It takes a link as an argument, and returns a shortened link
 * @param link - The link you want to shorten
 * @returns The shortened link.
 */
async function shortenLink(link) {
  const fetchUrl = `https://api.shrtco.de/v2/shorten?url=${link}`;
  try {
    const data = await fetch(fetchUrl);
    const res = await data.json();
    if (!res.ok) throw Error(data.statusText);
    const { full_short_link: shortenedLink } = res.result;
    return shortenedLink;
  } catch {
    return "";
  }
}

/**
 * It creates a new div element, sets its class to "align link__container", and inserts the longLinkText and shortLinkText into the innerHTML of the div element.
 * It then inserts the div element after the form element.
 *
 * Finally, it adds an event listener to the div element that listens for a click event and calls the copyToClipBoard function.
 * @param longLinkText - the long link that the user entered
 * @param shortLinkText - the shortened link
 */
function createNewElement(longLinkText, shortLinkText) {
  const container = document.createElement("div");
  container.setAttribute("class", "align link__container");
  container.innerHTML = ` 
  <p class="container__title">${longLinkText}</p>
  <code class="code" data-id="shortened-link">${shortLinkText}</code>
  <button class="btn btn__sec" data-id="copy-btn">copy</button>
  `;
  form.insertAdjacentElement("afterend", container);
  container.addEventListener("click", copyToClipBoard);
}
/**
 * If the user clicks on the copy button, then copy the short link to the clipboard and change the
 * button text to "copied!" for 3 seconds.
 */
function copyToClipBoard(e) {
  const btn = e.currentTarget.lastElementChild;
  const shortLink = btn.previousElementSibling;
  if (e.target === btn) {
    navigator.clipboard.writeText(shortLink.textContent).then(() => {
      btn.textContent = "copied!";
      btn.classList.add("item-copied");
      setTimeout(() => {
        btn.textContent = "copy";
        btn.classList.remove("item-copied");
      }, 3000);
    });
  }
}
/**
 * If there is no item in sessionStorage with the key of the length of the link, then add the link to sessionStorage with the key of the length of the link. If there is an item in sessionStorage with the key of the length of the link, then add the link to the array of links in sessionStorage with the key of the length of the link.
 * @param length - the length of the link
 * @param link - the link that the user entered
 */
function addToStorage(length, link) {
  if (sessionStorage.getItem(`${length}`) === null) {
    sessionStorage.setItem(`${length}`, JSON.stringify([link]));
  } else {
    const linkArr = JSON.parse(sessionStorage.getItem(`${length}`));
    linkArr.push(link);
    sessionStorage.setItem(`${length}`, JSON.stringify(linkArr));
  }
}
/**
 * If there is a shortLinkArr in sessionStorage, then for each item in the shortLinkArr, create a new element in the DOM with the corresponding longLinkArr item.
 */
function getFromStorage() {
  const shortLinkArr = JSON.parse(sessionStorage.getItem("short"));
  const longLinkArr = JSON.parse(sessionStorage.getItem("long"));
  if (shortLinkArr && longLinkArr) {
    for (let i = 0; i < shortLinkArr.length; i++) {
      createNewElement(longLinkArr[i], shortLinkArr[i]);
    }
  }
}
