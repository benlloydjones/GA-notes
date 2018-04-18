window.addEventListener('DOMContentLoaded', () => {

  // Task 1
  const button = document.getElementById('toggle');
  const circle = document.getElementsByClassName('circle')[0];

  button.addEventListener('click', () => {
    circle.classList.toggle('pulse');
  });

  // Task 2
  const select = document.querySelector('select');
  const chosenCity = document.getElementById('city');

  select.addEventListener('change', (event) => {
    const value = event.target.value;
    chosenCity.innerHTML = value;
  });

  // Task 3
  const names = document.getElementsByClassName('name');
  const current = document.getElementById('current');

  for(let i = 0; i < names.length; i++) {
    names[i].addEventListener('mouseover', (event) => {
      const currentName = event.target.innerHTML;
      current.innerHTML = currentName;
    });

    names[i].addEventListener('mouseout', () => {
      current.innerHTML = '';
    });
  }

  // Task 4
  const form = document.getElementById('subscribe');
  const submit = document.querySelector('.submit');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submit.innerHTML = 'Submitted!';
    submit.classList.add('submitted');
  });

  // Task 5
  const heading = document.querySelector('h1');

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    console.log(scroll);
    if (scroll > 40) {
      heading.classList.add('fadeOutUp');
    } else {
      heading.classList.remove('fadeOutUp');
    }
  });

});
