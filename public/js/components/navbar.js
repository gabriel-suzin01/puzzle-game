class CustomNavbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <a href="${document.querySelector("[data-page='home']") ? "#" : "/public/home.html"}">
        <img class="icon" src="/public/resources/icon.png" />
      </a>
      <ul class="links-list">
        <li class="link">
          <a href="${document.querySelector("[data-page='solve']") ? "#" : "/public/solve.html"}">Solve</a>
        </li>
        <li class="link">
          <a href="${document.querySelector("[data-page='create']") ? "#" : "/public/create.html"}">Create</a>
        </li>
      </ul>
    `;
  }
}

customElements.define("ctm-navbar", CustomNavbar);
