const SUBSCRIPTION_API_DELAY_MS = 3000; // milliseconds
const ERROR_MESSAGES = new Map([
  ["typeMismatch", "Valid email required"],
  ["valueMissing", "Email required"],
]);
const VALIDATION_ERROR_CLS = ".email-validation-error";
const SUBSCRIBING_TEXT = "Subscribing...";

document.addEventListener("DOMContentLoaded", () => {
  const stayUpdatedDialog = document.querySelector("#stay-updated");
  stayUpdatedDialog.showModal();

  const form = document.querySelector("#subscribe-form");
  const inputEmail = form.querySelector("input[name='email']");
  inputEmail.addEventListener("input", () => clearErrors(form));
});

async function subscribe($event) {
  $event.preventDefault();
  const form = document.querySelector("#subscribe-form");
  const submitBtn = form.querySelector("input[type='submit']");
  const submitBtnText = submitBtn.value;

  submitBtn.value = SUBSCRIBING_TEXT;
  form.setAttribute("inert", "");
  try {
    clearErrors(form);
    if (isValidSubscription(form)) {
      const data = getFormData(form);
      const result = await callSubscriptionApi(data);
      if (result.success) {
        const stayUpdatedDialog = document.querySelector("#stay-updated");
        const successDialogContent = getSuccessDialog();

        const successDialog = document.querySelector("#success");
        successDialog.appendChild(successDialogContent);
        // Append the recently subscribed email to the success dialog
        successDialog.querySelector(
          ".success-dialog__description strong"
        ).innerHTML = data.email;

        successDialog.addEventListener("close", () =>
          setTimeout(reloadPage, 1000)
        );
        const dismissBtn = successDialog.querySelector(
          ".success-dialog__dismiss-btn"
        );
        dismissBtn.addEventListener("click", () => {
          successDialog.close();
          // Reload the page after 1s just in case :shrug:
          setTimeout(reloadPage, 1000);
        });

        stayUpdatedDialog.close();
        successDialog.showModal();
      } else {
        // TODO: show errors from backend
      }
    } else {
      displayErrors(form);
    }
  } finally {
    form.removeAttribute("inert");
    submitBtn.value = submitBtnText;
  }
}

function getSuccessDialog() {
  const successTemplate = document.querySelector("#success-template");
  const successDialogContent = successTemplate.content.cloneNode(true);
  return successDialogContent;
}

function clearErrors(form) {
  const inputEmail = form.querySelector("input[name='email']");
  if (!inputEmail) return;
  inputEmail.classList.remove("invalid-email");
  const emailValidationError = form.querySelector(VALIDATION_ERROR_CLS);
  emailValidationError.innerText = "";
}

function isValidSubscription(form) {
  const inputEmail = form.querySelector("input[name='email']");
  return inputEmail && inputEmail.checkValidity();
}

function getFormData(form) {
  const data = {};
  for (const field of form.elements) {
    if (field.name && field.value) data[field.name] = field.value;
  }
  return data;
}

async function callSubscriptionApi(_data) {
  return new Promise((resolve, _reject) => {
    /** simulates a delay */
    setTimeout(() => {
      resolve({ success: true });
    }, getRandomDelay(SUBSCRIPTION_API_DELAY_MS));
  });
}

function getRandomDelay(maxDelay = SUBSCRIPTION_API_DELAY_MS) {
  return Math.floor(Math.random() * maxDelay);
}

function displayErrors(form) {
  const inputEmail = form.querySelector("input[name='email']");
  if (!inputEmail) return;
  inputEmail.classList.add("invalid-email");

  const emailValidationError =
    inputEmail.parentNode.querySelector(VALIDATION_ERROR_CLS);
  if (inputEmail.validity.typeMismatch) {
    emailValidationError.innerText = ERROR_MESSAGES.get("typeMismatch");
    return;
  }
  if (inputEmail.validity.valueMissing) {
    emailValidationError.innerText = ERROR_MESSAGES.get("valueMissing");
    return;
  }
}

function reloadPage() {
  location.reload();
}
