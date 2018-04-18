$(() => {
  console.log('loaded');

  const $burger = $('.navbar-burger');
  const $menu = $('.navbar-menu');

  $burger.on('click', () => {
    $burger.toggleClass('is-active');
    $menu.toggleClass('is-active');
  });
});
