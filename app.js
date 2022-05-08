const hamburger = document.querySelector(".hamburger");
const navList = document.getElementById("nav-list-group");
const form = document.getElementById("form");
const linkInput = document.getElementById("link-input");
const errorMessage = document.getElementById("error-message");

function handleDisplayNavBar(e) {
  if (e.target === hamburger) navList.classList.toggle("hide--nav-list");
  /* Checking if the clicked element is not among the elements inside the nav bar.
If it's not, then it adds hide--nav-list class */
  if (
    !(
      e.target.classList.contains("nav__link") ||
      e.target.classList.contains("nav-list") ||
      e.target.classList.contains("btn__sign-up") ||
      e.target.parentNode.classList.contains("nav") ||
      e.target.parentNode.classList.contains("nav-list")
    )
  )
    navList.classList.add("hide--nav-list");
}
document.addEventListener("click", handleDisplayNavBar);
form.addEventListener("submit", handleSubmitForm);

function handleSubmitForm(e) {
  const linkToShorten = linkInput.value;
  if (!linkToShorten.length || linkToShorten.trim() === "") {
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

function addNewLinkElement(linkToShorten) {
  const container = document.createElement("div");
  container.setAttribute("class", "align link__container");
  container.innerHTML = ` 
  <p class="container__title">${linkToShorten}</p>
  <code class="code" data-id="shortened-link"></code>
  <button class="btn btn__sec" data-id="copy-btn">copy</button>
  `;
  form.insertAdjacentElement("afterend", container);
  container.addEventListener("click", copyToClipBoard);

  const containerChildren = container.children;
  shortenLink(linkToShorten).then((shortLink) => {
    Array.from(containerChildren).forEach((child) => {
      if (child.dataset.id === "shortened-link") child.textContent = shortLink;
    });
  });
}
async function shortenLink(link) {
  const fetchUrl = `https://api.shrtco.de/v2/shorten?url=${link}`;
  try {
    const data = await fetch(fetchUrl);
    const res = await data.json();
    if (!res.ok) throw new TypeError("Error");
    const { full_short_link: shortenedLink } = res.result;
    return shortenedLink;
  } catch (error) {
    console.log(error.name);
  }
}

function copyToClipBoard(e) {
  if (e.target.dataset.id === "copy-btn") {
    e.target.textContent = "copied!";
    e.target.classList.add("item-copied");

    setTimeout(() => {
      e.target.textContent = "copy";
      e.target.classList.remove("item-copied");
    }, 2000);
  }
  const containerChildren = e.currentTarget.children;
  Array.from(containerChildren).forEach((child) => {
    if (child.dataset.id === "shortened-link") {
      const shortenedLink = child.textContent;
      navigator.clipboard.writeText(shortenedLink);
    }
  });
}
