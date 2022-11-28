var magnify = document.getElementById("magnify");
var subtitle = document.getElementById("subtitle");

function changeImage(address, text) {

  magnify.src = address;
  subtitle.innerHTML = text;

};
