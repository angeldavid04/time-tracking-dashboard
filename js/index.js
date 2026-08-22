const $container = document.querySelector(".reports");
const fetchUrl = "data.json";
const CARD_DELAY = {
  initial: 50,
  step: 50,
  unit: "ms"
};

function renderFetchError({ status, statusText }) {
  const $errorMessage = document.createElement("span");

  $errorMessage.textContent = `Error ${status}: ${statusText || "An error has occurred"}`;
  $errorMessage.classList.add("error");

  $container.appendChild($errorMessage);
}

async function getData(url) {
  const res = await fetch(url);
  if (!res.ok) throw { status: res.status, statusText: res.statusText };
  return res.json();
}

function createCard({ title, timeframes }, delay) {
  const $reportCard = document.createElement("section");
  const { daily, weekly, monthly } = timeframes;

  const attributeFormat = (text) => text.toLowerCase().split(" ").join("-");
  const hoursFormat = (time) => `${time}${time === 1 ? "hr" : "hrs"}`;

  $reportCard.classList.add("report-card");
  $reportCard.style.setProperty("--delay", `${delay}${CARD_DELAY.unit}`);
  $reportCard.setAttribute("data-variant", attributeFormat(title));

  $reportCard.innerHTML = `
    <div class="report-card__image"></div>
    <div class="report-card__main">
      <div class="report-card__title-container">
        <h2 class="report-card__title">${title}</h2>
        <button type="button" class="report-card__menu-btn"><img src="images/icon-ellipsis.svg" alt="${title} open menu"></button>
      </div>
      <div class="report-card__content" data-timeframe="daily" data-current>
        <span class="report-card__time">${hoursFormat(daily.current)}</span>
        <span class="report-card__previous">Previous - ${hoursFormat(daily.previous)}</span>
      </div>
      <div class="report-card__content" data-timeframe="weekly">
        <span class="report-card__time">${hoursFormat(weekly.current)}</span>
        <span class="report-card__previous">Last week - ${hoursFormat(weekly.previous)}</span>
      </div>
      <div class="report-card__content" data-timeframe="monthly">
        <span class="report-card__time">${hoursFormat(monthly.current)}</span>
        <span class="report-card__previous">Last month - ${hoursFormat(monthly.previous)}</span>
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

function filterCards(timeframe) {
  const $cardTimeframes = document.querySelectorAll(".report-card__content");

  $cardTimeframes.forEach(($timeframe) => {
    $timeframe.getAttribute("data-timeframe") === timeframe
      ? $timeframe.setAttribute("data-current", "")
      : $timeframe.removeAttribute("data-current");
  });
}

populateCards();

document.addEventListener("change", (e) => {
  if (e.target.matches(".report-card__radio")) {
    const currentTimeframe = e.target.value;

    filterCards(currentTimeframe);
  }
});
