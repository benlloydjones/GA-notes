$(() => {
  console.log('JS Loaded');
  const $list = $('#donuts');
  const $form = $('#new-donut');
  const $flavor = $('#flavor');
  const $style = $('#style');

  getDonuts(); // get all donuts when the page loads
  $form.on('submit', createDonut); // create a new donut on form submit
  $list.on('click', 'button', deleteDonut); // delete a donut


  function getDonuts() {
    $.get('http://localhost:3000/donuts')
      .done((donuts) => {
        donuts.forEach((donut) => {
          showDonut(donut);
        });
      });
  }

  function showDonut(donut) {
    $list.prepend(`
      <li>${donut.flavor} - <em>${donut.style}</em> <button data-id="${donut.id}">Delete</button></li>
    `);
  }

  function createDonut(e) {
    e.preventDefault();
    const newDonut = {
      style: $style.val(),
      flavor: $flavor.val()
    };

    $.ajax({
      url: 'http://localhost:3000/donuts',
      method: 'POST',
      data: JSON.stringify(newDonut),
      contentType: 'application/json'
    })
      .done((donut) => {
        showDonut(donut);
        $flavor.val('');
      });
  }

  function deleteDonut(e) {
    const id = $(e.target).data('id');
    $.ajax({
      url: `http://localhost:3000/donuts/${id}`,
      method: 'DELETE'
    })
      .done(() => {
        $(e.target).parent().remove();
      });
  }

}); // closing DOM content loaded
