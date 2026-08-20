const $container = document.querySelector(".reports");
const fetchUrl = "../data.json";
const CARD_DELAY = {
  initial: 50,
  step: 50,
  unit: "ms"
};

function renderFetchError(err) {
  const $errorMessage = document.createElement("span");

  $errorMessage.textContent = `Error ${err.status}: ${err.statusText || "An error has ocurred"}`;
  $errorMessage.classList.add("error");

  $container.appendChild($errorMessage);
}

// With fetch + async - await
/* async function getData(url) {
  if (url === undefined) return console.error("There is no an url to fetch");

  const res = await fetch(url);

  if (!res.ok) throw { status: res.status, statusText: res.statusText };

  const json = await res.json();

  return json;
} */

// With axios + async - await
async function getData(url) {
  if (url === undefined) return console.error("There is no an url to fetch");

  const res = await axios.get(url);

  return res.data;
}

function createCard({ title, timeframes }, delay) {
  const $reportCard = document.createElement("section");
  const { daily, weekly, monthly } = timeframes;
  const variantFormat = (title) => title.toLowerCase().split(" ").join("-");
  const hoursFormat = (time) => `${time}${time === 1 ? "hr" : "hrs"}`;

  $reportCard.classList.add("report-card");
  $reportCard.style.setProperty("--delay", `${delay}${CARD_DELAY.unit}`);
  $reportCard.setAttribute("data-variant", variantFormat(title));

  $reportCard.innerHTML = `
    <div class="report-card__image"></div>
    <div class="report-card__main">
    <div class="report-card__title-container">
      <h2 class="report-card__title">${title}</h2>
      <button class="report-card__menu-btn"><img src="images/icon-ellipsis.svg" alt="${title} open menu"></button>
    </div>
    <div class="report-card__content" data-name="daily" data-current>
      <span class="report-card__time">${hoursFormat(daily.current)}</span>
      <span class="report-card__previous">Previous - ${hoursFormat(daily.previous)}</span>
    </div>
    <div class="report-card__content" data-name="weekly">
      <span class="report-card__time">${hoursFormat(weekly.current)}</span>
      <span class="report-card__previous">Last week - ${hoursFormat(weekly.current)}</span>
    </div>
    <div class="report-card__content" data-name="monthly">
      <span class="report-card__time">${hoursFormat(monthly.current)}</span>
      <span class="report-card__previous">Last month - ${hoursFormat(monthly.current)}</span>
    </div>
  </div>
  `;

  return $reportCard;
}

async function populateCards() {
  try {
    const reports = await getData(fetchUrl);
    const $fragment = document.createDocumentFragment();

    let delay = CARD_DELAY.initial;

    reports.forEach((report) => {
      const $card = createCard(report, delay);
      $fragment.appendChild($card);

      delay += CARD_DELAY.step;
    });

    $container.appendChild($fragment);
  } catch (err) {
    renderFetchError(err);
  }
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
    const selectedValue = e.target.value;

    filterCards(selectedValue);
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
