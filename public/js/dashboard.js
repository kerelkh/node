$('.count').each(function () {
  $(this).prop('Counter',0).animate({
      Counter: $(this).text()
  }, {
      duration: 4000,
      easing: 'swing',
      step: function (now) {
          $(this).text(Math.ceil(now));
      }
  });
});

tinymce.init({
    selector: 'textarea#body',
    width: 700,
    height: 500,
    plugins: 'link image code',
    content_style: 'body { font-family: Nunito, sans-serif'
 });