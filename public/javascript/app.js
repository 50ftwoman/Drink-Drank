var $visitedBars,
    $nonVisitedBars,
    yelpInfo

function addToList(bar) {
  return $(`<li id="bar-${bar._id}" 
            class="index-items draggable">
            <div class="bar-box"> 
              ${bar.name.length > 30 ? 
              bar.name.substring(0,30) + '...' : bar.name}
            <br> 
            <a href="https://www.google.com/maps/place/${bar.name}">
              ${bar.address}
            </a> <br> 
              ${bar.location} 
            </div>
            <button class="delete"> </button></li>`).draggable({
    snap: "ul",
    stop: updateHandler,
    stack: ".draggable"
  })
}

function updateHandler() {
  var html = $(this),
      id = html.attr('id').slice(4);

  $.ajax({
    type: 'PATCH',
    url: 'bar/' + encodeURIComponent(id),
    data: {}
  }).then(
    function(jsonBar) {
      html.remove();

      var barHTML = addToList(jsonBar);

      if(jsonBar.visited) {
        $visitedBars.prepend(barHTML);
      } else {
        $nonVisitedBars.prepend(barHTML);
      }
    }
  )
}

function deleteHandler() {
  var html = $(this).parent(),
      id = html.attr('id').slice(4);

  $.ajax({
    type: 'DELETE',
    url: '/bar/' + id
  }).then(
    function() {
      html.remove();
    }
  )
}


$(document).ready(function(){
  $visitedBars = $('#drank-list');
  $nonVisitedBars = $('#drink-list');
  $searchButton = $('#search-button');

  // new droppable ul for visited bars
  $('#drank-list').droppable();

  // new droppable ul for unvisited bars
  $('#drink-list').droppable();

  $('.draggable').draggable({
    snap: 'ul',
    stop: updateHandler,
    stack: ".draggable"

  })

  $visitedBars.on('click', '.delete', deleteHandler);
  $nonVisitedBars.on('click', '.delete', deleteHandler);

})
