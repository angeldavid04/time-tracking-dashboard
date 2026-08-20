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

/* --- OLD STYLE --- */
// With XMLHTTPRequest
/* function getData(url) {
  const request = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        const json = JSON.parse(xhr.responseText);

        resolve(json);
      } else {
        reject({ status: xhr.status, statusText: xhr.statusText });
      }
    });

    xhr.open("GET", url);
    xhr.send();
  });

  return request;
} */

// With fetch
/* function getData(url) {
  const request = fetch(fetchUrl)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => json);

  return request;
} */

// With axios
/* function getData(url) {
  const request = axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response;
    });

  return request;
} */

/* --- NEW STYLE --- */
// With fetch + async - await
/* async function getData(url) {
  const res = await fetch(url);

  if (!res.ok) throw { status: res.status, statusText: res.statusText };

  const json = await res.json();

  return json;
} */

// With axios + async - await
async function getData(url) {
  try {
    const res = await axios.get(url);

    return res.data;
  } catch (err) {
    throw err.response;
  }
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
      <span class="report-card__previous">Last week - ${hoursFormat(weekly.previous)}</span>
    </div>
    <div class="report-card__content" data-name="monthly">
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
