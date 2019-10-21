$(document).ready(function() {

  // Always show nav bg on mobile devices
  if ($(window).width() < 768) {
    $("nav.navbar").addClass("navbar-bg");
  }
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $("nav.navbar").addClass("navbar-bg");
    }
  });

  // Change navbar background after scroll
  $(window).scroll(function() {
    if ($(this).width() > 768) {
      if ($(this).scrollTop() > 0) {
        //$( 'nav.navbar' ).removeClass("header-bg-top");
        $("nav.navbar").addClass("navbar-bg");
      } else {
        $("nav.navbar").removeClass("navbar-bg");
        //$( 'nav.navbar' ).addClass("header-bg-top");
      }
    }
  });

  // Close Navbar on mobile after clicking
  $('.nav-item').click(function(){
    $('#navbarNavAltMarkup').removeClass('show');
    $('button.navbar-toggler').addClass('collapsed');
  });

  // Highlight Section in Navbar
  $(window).scroll(function() {
    var position = $(this).scrollTop();

    $(".section").each(function() {
      var target = $(this).offset().top;
      var id = $(this).attr("id");

      if (position + 10 >= target) {
        $(".navbar-nav > a").removeClass("active");
        $(".navbar-nav > a[href=\\#" + id + "]").addClass("active");
      }
    });
  });

  // Smooth scrolling
  var scrollLink = $(".smoothscroll");

  scrollLink.click(function(e) {
    e.preventDefault();
    $("body,html").animate(
      {
        scrollTop: $(this.hash).offset().top
      },
      1000
    );
  });
});
