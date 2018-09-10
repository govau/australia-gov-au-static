/**
 * Quick link carousel on the homepage, responsive
 * Created using PHP Storm on 30th Mar 2015, jason.guo@xing.net.au
 */
jQuery(function($) {
    var jcarousel = $('.homepage-quick-links-carousel .carousel-inner');
    var numVisible = 4;
    var numSlides = 4;
    var $bullets;
    var slideControlMargin = 21; // margin in pixels between the coloured dots and prev/next control links
    /*
     * Set the number of slides visiable for different screen resolution below
     * For example, view port wider than 850px will see 4 slides, b/t 600px and 850px will see 2 slides etc
     */
    jcarousel
        .on('jcarousel:create', function () {
            var carousel = $(this),
                width = carousel.innerWidth();
            if (width >= 850) {
                numVisible = 4;
            } else if (width >= 600) {
                numVisible = 3;
            } else if (width >= 450) {
                numVisible = 2;
            } else {
                numVisible = 1;
            }
            width = width / numVisible;
            carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
            carousel.jcarousel('items').css({ height : 'auto' });
            $('.carousel-items .carousel-item .views-row').css({ height : 'auto' });

            var maxHeight = 101 + Math.max.apply(null, carousel.jcarousel('items').map(function () {
                return $(this).height();
            }).get());

            carousel.jcarousel('items').css({ height : maxHeight });

            $('.carousel-items .carousel-item .views-row').css({ height : '100%' });
            carousel.addClass('initialized');
        })
        .on('jcarousel:reload', function () {
            var carousel = $(this),
                width = carousel.innerWidth();
            if (width >= 850) {
                numVisible = 4;
            } else if (width >= 600) {
                numVisible = 3;
            } else if (width >= 450) {
                numVisible = 2;
            } else {
                numVisible = 1;
            }
            width = width / numVisible;
            carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
            carousel.jcarousel('items').css({ height : 'auto' });
            $('.carousel-items .carousel-item .views-row').css({ height : 'auto' });

            var maxHeight = Math.max.apply(null, carousel.jcarousel('items').map(function () {
                return $(this).height();
            }).get());

            carousel.jcarousel('items').css({ height : maxHeight });

            $('.carousel-items .carousel-item .views-row').css({ height : '100%' });
            carousel.addClass('initialized');
        })
        .jcarousel({
            wrap: 'circular'
        });

    $('.jcarousel-control-prev')
        .jcarouselControl({
            target: '-=1'
        });

    $('.jcarousel-control-next')
        .jcarouselControl({
            target: '+=1'
        });
    /*
     * Pagination and highlighting of active (visible) slides.
     * We want to make sure the correct number of dots are highlighted for different screen resolution
     */
    $('.jcarousel-pagination')
        .on('jcarouselpagination:active', 'a', function() {
            $bullets = $('.jcarousel-pagination').children();
            numSlides = $bullets.length;
            // Margins are added by JS to ensure the correct display in Internet Explorer
            $(".jcarousel-control-prev").css('margin-right', slideControlMargin * numSlides / 2);
            $(".jcarousel-control-next").css('margin-left', 5 + slideControlMargin * numSlides / 2);
            var firstSlideIndex = $(this).index();
            $bullets.slice(0, numSlides).removeClass('active');
            if (numSlides - (firstSlideIndex + numVisible) >= 0) {
                $bullets.slice(firstSlideIndex, numVisible + firstSlideIndex).addClass('active');
            } else {
                $bullets.slice(firstSlideIndex, numSlides).addClass('active');
                $bullets.slice(0, 0 - (numSlides - (firstSlideIndex + numVisible))).addClass('active');
            }
        })
        .on('jcarouselpagination:inactive', 'a', function() {
            $(this).removeClass('active');
        })
        .on('click', function(e) {
            e.preventDefault();
        })
        .jcarouselPagination({
            perPage: 1,
            item: function(page) {
                return '<a role="button" tabindex="-1" href="#' + page + '" id="ci-' + page + '">' + page + '</a>';
            }
        });
    /*
     * Bind keyboard arrow keys to the slide control links.
     */
    $(document).keydown(function (e) {
        if (e.which == 37) { // when left arrow is pressed
            $('.homepage-quick-links-carousel .jcarousel-control-prev').click();
        } else if (e.which == 39) {//right arrow
            $('.homepage-quick-links-carousel .jcarousel-control-next').click();
        }
    });

    $(document).ready(function() {
        $('.carousel-items .carousel-item').each(function() {
           $(this).touchwipe({
               wipeLeft: function() { $('.homepage-quick-links-carousel .jcarousel-control-next').click(); },
               wipeRight: function() { $('.homepage-quick-links-carousel .jcarousel-control-prev').click(); },
               min_move_x: 20,
               preventDefaultEvents: false
           });
        });
    });

    // Setup for on end of page resize...
    var resizeId;
    $(window).resize( function() {
      clearTimeout(resizeId);
      resizeId = setTimeout(doneResizing, 500);
    });
    // on page resize...
    function doneResizing() {
      $('.jcarousel').jcarousel('reload');
    };

});
