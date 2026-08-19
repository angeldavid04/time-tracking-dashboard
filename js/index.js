const $container = document.querySelector(".reports");
const fetchUrl = "../data.json";

async function getData(url) {
  if (url === undefined) return console.error("There is no an url to fetch");

  try {
    const res = await fetch(url);

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    const json = await res.json();

    return json;
  } catch (err) {
    console.error(
      `Error ${err.status}: ${err.statusText || "An error has ocurred"}`
    );
  }
}

function createCard({ title, timeframes }, delay) {
  const $reportCard = document.createElement("section");
  const { daily, weekly, monthly } = timeframes;
  const variantFormat = (title) => title.toLowerCase().split(" ").join("-");
  const hoursFormat = (time) => `${time}${time === 1 ? "hr" : "hrs"}`;

  $reportCard.classList.add("report-card");
  $reportCard.style.setProperty("--delay", `${delay}ms`);
  $reportCard.setAttribute("data-variant", variantFormat(title));

  $reportCard.innerHTML = `
  <div class="report-card__image"></div>
    <div class="report-card__main">
    <div class="report-card__title-container">
      <h2 class="report-card__title">${title}</h2>
      <button class="report-card__menu-btn"><img src="images/icon-ellipsis.svg" alt="open options menu"></button>
    </div>
    <div class="report-card__content" data-name="daily" data-current>
      <span class="report-card__time">${hoursFormat(daily.current)}</span>
      <span class="report-card__previous">Previous - ${hoursFormat(daily.previous)}</span>
    </div>
    <div class="report-card__content" data-name="weekly">
      <span class="report-card__time">${hoursFormat(weekly.current)}hs</span>
      <span class="report-card__previous">Previous - ${hoursFormat(weekly.current)}</span>
    </div>
    <div class="report-card__content" data-name="monthly">
      <span class="report-card__time">${hoursFormat(monthly.current)}rs</span>
      <span class="report-card__previous">Previous - ${hoursFormat(monthly.current)}</span>
    </div>
  </div>
  `;

  return $reportCard;
}

async function populateCards() {
  const reports = await getData(fetchUrl);
  const $fragment = document.createDocumentFragment();

  let delay = 100;
  reports.forEach((report) => {
    const $card = createCard(report, delay);
    $fragment.appendChild($card);

    delay += 100;
  });

  $container.appendChild($fragment);
}

function filterCards(selection) {
  const $cardContents = document.querySelectorAll(".report-card__content");

  $cardContents.forEach((content) => {
    content.getAttribute("data-name") === selection
      ? content.setAttribute("data-current", "")
      : content.removeAttribute("data-current");
  });
}

populateCards();

document.addEventListener("change", (e) => {
  if (e.target.matches(".report-card__radio")) {
    const selection = e.target.value;

    filterCards(selection);
  }
});

/* ---- CARD MODEL ----
<section class="report-card" data-variant="work">
  <div class="report-card__image">
  </div>
  <div class="report-card__main">
    <div class="report-card__title-container">
      <h2 class="report-card__title">Work</h2>
      <button class="report-card__menu-btn"><img src="images/icon-ellipsis.svg" alt="open options menu"></button>
    </div>
    <div class="report-card__content" data-name="daily" data-current> <!-- daily -->
      <span class="report-card__time">5hrs</span>
      <span class="report-card__previous">Previous - 7hrs</span>
    </div>
    <div class="report-card__content" data-name="weekly"> <!-- weekly -->
      <span class="report-card__time">32hrs</span>
      <span class="report-card__previous">Previous - 36hrs</span>
    </div>
    <div class="report-card__content" data-name="monthly"> <!-- monthly -->
      <span class="report-card__time">103hrs</span>
      <span class="report-card__previous">Previous - 128hrs</span>
    </div>
  </div>
</section>
*/
