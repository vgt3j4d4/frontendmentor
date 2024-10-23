const CURRENT_VALUE_SELECTOR = ".activity-card__current-value";
const PREVIOUS_VALUE_SELECTOR = ".activity-card__previous-value";
const FREQUENCY_BTN_SELECTOR = ".frequency-btn";
const FREQUENCY_ITEM_SELECTOR = ".activity-report__frequency-item";
const ACTIVE_FREQUENCY_ITEM_CLS = "activity-report__frequency-item--active";
const EMPTY_VALUE = "0hrs";
const FREQUENCY_LABEL_MAP = new Map([
  ["daily", "Yesterday"],
  ["weekly", "Last Week"],
  ["monthly", "Last Month"],
]);

async function getTrackingData() {
  let jsonData = {};
  try {
    const data = await fetch("./data.json");
    jsonData = await data.json();
  } catch (error) {
    console.error("Error fetching data.json", error);
  } finally {
    return jsonData;
  }
}

/**
 * Generates a map of data categorized by frequency from tracking data.
 *
 * @param {Array} trackingData - Array of tracking data objects where each object
 * contains a title and timeframes broken down by frequency (daily, weekly, monthly).
 * @returns {Map} A map where each key is a frequency (e.g., 'daily') and the value
 * is an array of objects. Each object contains the title of the activity and its
 * current and previous timeframe values for that frequency.
 */
function getFrequencyMap(trackingData) {
  const frequencyMap = new Map();
  trackingData.forEach((category) => {
    const { title, timeframes } = category;
    Object.keys(timeframes).forEach((frequency) => {
      const { current, previous } = timeframes[frequency];
      if (!frequencyMap.has(frequency)) {
        frequencyMap.set(frequency, [{ title, current, previous }]);
      } else {
        const frequencyData = frequencyMap.get(frequency);
        frequencyData.push({ title, current, previous });
      }
    });
  });
  return frequencyMap;
}

function selectFrequencyButton(button) {
  document.querySelectorAll(FREQUENCY_ITEM_SELECTOR).forEach((item) => {
    item.classList.remove(ACTIVE_FREQUENCY_ITEM_CLS);
  });
  button.parentElement.classList.add(ACTIVE_FREQUENCY_ITEM_CLS);
}

function displayFrequencyData(frequency, frequencyMap) {
  if (!frequency) {
    console.error("Frequency is not defined.");
    return;
  }

  const data = frequencyMap.get(frequency);
  if (!data || data.length === 0) {
    console.error("There is no data for the selected frequency.");
    return;
  }

  clearValues();

  data.forEach((category) => {
    const { title, current, previous } = category;
    const cardContent = document.querySelector(
      `.activity-card__content[data-title="${title}"]`
    );
    if (!cardContent) {
      console.error("Current value is not defined.");
      return;
    }
    const currentValueEl = cardContent.querySelector(CURRENT_VALUE_SELECTOR);
    if (currentValueEl) {
      currentValueEl.innerHTML = `${current}hrs`;
    }
    const previousValueEl = cardContent.querySelector(PREVIOUS_VALUE_SELECTOR);
    if (previousValueEl) {
      previousValueEl.innerHTML = `${FREQUENCY_LABEL_MAP.get(
        frequency
      )} - ${previous}hrs`;
    }
  });
}

function clearValues() {
  document.querySelectorAll(CURRENT_VALUE_SELECTOR).forEach((element) => {
    element.innerHTML = EMPTY_VALUE;
  });
  document.querySelectorAll(PREVIOUS_VALUE_SELECTOR).forEach((element) => {
    element.innerHTML = EMPTY_VALUE;
  });
}

(function main() {
  let trackingData;
  let frequencyMap = new Map();

  document.addEventListener("DOMContentLoaded", async () => {
    trackingData = await getTrackingData();
    if (
      !trackingData ||
      !Array.isArray(trackingData) ||
      trackingData.length === 0
    ) {
      console.error("There is no tracking data.");
      return;
    }

    frequencyMap = getFrequencyMap(trackingData);

    const frequencyButtons = document.querySelectorAll(FREQUENCY_BTN_SELECTOR);
    if (!frequencyButtons || frequencyButtons.length === 0) {
      return;
    }

    // By default select the first button and display its data.
    const firstButton = frequencyButtons[0];
    selectFrequencyButton(firstButton);
    displayFrequencyData(firstButton.dataset.frequency, frequencyMap);

    frequencyButtons.forEach((button) => {
      button.addEventListener("click", ($event) => {
        $event.preventDefault();
        selectFrequencyButton(button);
        displayFrequencyData($event.target.dataset.frequency, frequencyMap);
      });
    });
  });
})();
