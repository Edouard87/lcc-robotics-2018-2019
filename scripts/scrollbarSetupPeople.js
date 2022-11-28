(function($){
  $(window).on("load",function(){
    $(".people-container").mCustomScrollbar({
      theme:"dark-thin",
      axis: "x",
      scrollButtons:{
      enable:false
      }
    });
  });
})(jQuery);
