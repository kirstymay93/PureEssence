const year = document.querySelector('#year');
const form = document.querySelector('.signup-form');
const status = document.querySelector('.form-note');

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim();

    if (!email) {
      status.textContent = 'Please enter your email address to join the newsletter.';
      return;
    }

    status.textContent = `Thanks for joining, ${email}. PureEssence updates are on the way.`;
    form.reset();
  });
}
