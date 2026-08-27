const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const bookingForm = document.querySelector('#booking-form');
const formNote = document.querySelector('#form-note');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (bookingForm && formNote) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Treatment: ${service}`,
      '',
      message
    ].join('\n');

    window.location.href = `mailto:hello@pureessencebeauty.co.uk?subject=${encodeURIComponent(
      `Booking request from ${name}`
    )}&body=${encodeURIComponent(body)}`;
    formNote.textContent = 'Thanks — your email app should now be ready to send your request.';
  });
}
