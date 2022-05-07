const hamburger = document.querySelector(".hamburger");
const navList = document.getElementById("nav-list-group");
const form = document.getElementById("form");
const linkInput = document.getElementById("link-input");
const errorMessage = document.getElementById("error-message");
hamburger.addEventListener("click", () => {
  navList.classList.toggle("hide--nav-list");
});
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
  <code class="code" data-id="shortened-link">https://rel.ink/k4lKyk</code>
  <button class="btn btn__sec" data-id="copy-btn">copy</button>
  `;
  form.insertAdjacentElement("afterend", container);
  container.addEventListener("click", copyToClipBoard);
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
      console.log(child.textContent);
      const shortenedLink = child.textContent;
      navigator.clipboard.writeText(shortenedLink);
    }
  });
}
