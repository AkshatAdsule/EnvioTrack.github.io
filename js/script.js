$(document).ready(function() {
  $(".section").click(loadPixelOnMouse);
  console.log("im in");
});


var pixels = ["ambulance.svg", "battery-half.svg", "chevron-left.svg",
  "chevron-right.svg", "diamond.svg", "emoticon-confused.svg", "file-text.svg",
  "food.svg", "hand.svg", "location.svg", "palette.svg", "question.svg",
  "ruler-triangle.svg", "stats-down.svg", "tshirt.svg"];

function randomPixel() {
  console.log("ok");
  var rand = Math.floor(Math.random() * pixels.length);
  var path = "img/pixel/" + pixels[rand];
  var html = "<img class='pixel' src='" + path + "'>";
  return $(html);
}

function loadPixels(num, container) {
  console.log(1);
  var $container = $(container);
  for (var i = 0; i < num; i++) {
    var pixel = randomPixel();
    $container.append(pixel);
    return pixel;
  }
}

function loadPixelOnMouse(e) {
  var $container = $(this);
  var offset = $container.offset();
  var pixel = loadPixels(1, $container);
  pixel.css({
    left: e.pageX - offset.left,
    top: e.pageY - offset.top
  });
}