function changeImg(src, clicked) {

  var imgButtons = document.getElementsByClassName("img-button")
  var target = document.getElementById("main-img-change")
  target.src = src
  // window.alert(clicked)

  if (clicked == 1) {

    imgButtons[0].style.border = "1px solid #e77600"
    imgButtons[0].style.boxShadow = "0 0 3px 2px rgba(228,121,17,.5)"

    imgButtons[1].style.border = "1px solid #000000"
    imgButtons[1].style.boxShadow = "none"

  } else if (clicked == 2) {

    imgButtons[1].style.border = "1px solid #e77600"
    imgButtons[1].style.boxShadow = "0 0 3px 2px rgba(228,121,17,.5)"

    imgButtons[0].style.border = "1px solid #000000"
    imgButtons[0].style.boxShadow = "none"

  }



}
