const year = document.querySelector('#year');
const form = document.querySelector('.signup-form');
const status = document.querySelector('.form-note');

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailField = form.elements.namedItem('email');

    if (!(emailField instanceof HTMLInputElement)) {
      status.textContent = 'Please enter a valid email address to join the newsletter.';
      return;
    }

    emailField.value = emailField.value.trim();
    const email = emailField.value;

    if (!emailField.checkValidity()) {
      status.textContent = email
        ? 'Please enter a valid email address to join the newsletter.'
        : 'Please enter your email address to join the newsletter.';
      emailField.reportValidity();
      return;
    }

    status.textContent = `Thanks for joining, ${email}. PureEssence updates are on the way.`;
    form.reset();
  });
}
