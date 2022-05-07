const hamburger = document.querySelector(".hamburger");
const navList = document.getElementById("nav-list-group");
hamburger.addEventListener("click", () => {
  navList.classList.toggle("hide--nav-list");
});
