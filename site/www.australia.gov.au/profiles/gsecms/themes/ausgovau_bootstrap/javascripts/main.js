/**
 * AusGovAu main JavaScript file
 */
jQuery(function ($) {
    var AusGov, Modernizr;

    (function ($, window, document, undefined) {

        'use strict';

        /**
         * Object for namespacing theme functions.
         */

        AusGov = {

            /**
             * Initialiser.
             */

            init: function () {
                AusGov.initTouchDeviceDetection();
                AusGov.initNonEmptyInputs();
                AusGov.initKeyboardHelper();
                AusGov.initMobileMenu();
                AusGov.initTableOfContentsScroll();
                AusGov.initBackToTopScroll();
            },

            /**
             * Init Modernizr Touch Class
             */

            initTouchDeviceDetection: function () {
                if (Modernizr && Modernizr.touch) {
                    $('body').addClass('touch');
                }
            },

            /**
             * Keep class on the inputs if they're non empty (ie. user has typed into them).
             */

            initNonEmptyInputs: function () {
                var inputs = $('input,textarea');
                inputs.change(function () {
                    if ($(this).val() === '') {
                        $(this).removeClass('not-empty');
                    } else {
                        $(this).addClass('not-empty');
                    }
                });
            },

            /**
             * Keep class on focused menu items so we can keep subnav open
             */

            initKeyboardHelper: function () {
                var mainNavItems = $('#nav-primary > ul > li > a');

                if (mainNavItems.length === 0) {
                    return;
                }

                mainNavItems.each(function () {
                    $(this).focus(
                        function () {
                            $(this).parent().siblings().removeClass('focus');
                            $(this).parent().addClass('focus');
                        });
                });
            },

            /**
             * Init mobile nav events
             */

            initMobileMenu: function () {

                // Init Toggle
                var toggle = $('#nav-toggle a, #mobile-overlay');
                toggle.click(function (event) {
                    event.preventDefault();
                    $('body').toggleClass('menu-open');
                    $('body').removeClass('sub-menu-open');
                    $('.selected-sub-menu').removeClass('selected-sub-menu');
                });

                // Init submenu slide
                var subMenuItems = $('#nav-primary li.expanded > a');
                subMenuItems.click(function (event) {
                    // Only on mobile
                    if ($('#is_mobile').is(':visible')) {
                        event.preventDefault();
                        $('body').removeClass('sub-menu-open');
                        $('.selected-sub-menu').removeClass('selected-sub-menu');
                        $(this).siblings('.sub-menu').toggleClass('selected-sub-menu');
                        $('body').toggleClass('sub-menu-open');
                    }

                });

                var closeSubMenu = $('#nav-primary a.sub-menu-back');
                closeSubMenu.click(function (event) {
                    event.preventDefault();
                    $('body').removeClass('sub-menu-open');
                    $('.selected-sub-menu').removeClass('selected-sub-menu');
                });

                // Init secondary nav
                var secondaryNavToggle = $('#secondary-nav-toggle a');
                secondaryNavToggle.click(function (event) {
                    event.preventDefault();
                    $('body').toggleClass('secondary-menu-open');
                });

            },

            /**
             * Init table of contents scrollto animation
             */

            initTableOfContentsScroll: function () {
                var toc = $('#nav-toc');
                toc.find('a').click(function (event) {
                    event.preventDefault();
                    var href = $(this).attr('href');
                    var target = $(href);

                    if (target.length !== 0) {
                        $('body,html').stop().animate({
                            'scrollTop': target.offset().top
                        }, 800, 'swelling');
                    }

                });
            },

            /**
             * Init back to top button animation
             */

            initBackToTopScroll: function () {
                var btt = $('#back-to-top');
                btt.find('a').click(function (event) {
                    event.preventDefault();
                    $('body,html').stop().animate({
                        'scrollTop': 0
                    }, 800, 'swelling');
                });
            },


            /**
             * Homepage tiles/cards - make them have an even height.
             */

            setTileHight: function () {
                if ($(window).width() >= 550) {
                    var maxHeightTiles = Math.max.apply(null, $('#homepage-topic-tiles .row .leaf').map(function () {
                        return $(this).height();
                    }).get());

                    $('#homepage-topic-tiles .row .leaf').css('height', maxHeightTiles);
                }
            }
        };

        /**
         * Run the initialiser
         */

        $(document).ready(function () {
            AusGov.init();

            AusGov.setTileHight();

            var $window = $(window);
            $('section[data-type="background"]').each(function () {
                // declare the variable to affect the defined data-type
                var $scroll = $(this);
                $(window).scroll(function () {
                    // HTML5 proves useful for helping with creating JS functions!
                    // also, negative value because we're scrolling upwards
                    var yPos = -($window.scrollTop() / $scroll.data('speed'));

                    // background position
                    var coords = '50% ' + yPos + 'px';

                    // move the background
                    $scroll.css({backgroundPosition: coords});
                }); // end window scroll
            });  // end section function


            // if content or homepage....
            //   $('#content a, body.front a').filter(function() {
            $('a').filter(function () {
                return this.hostname && this.hostname !== location.hostname;
            }).append('<span class="sr-only"> - external site</span>');


            // listen for hover over sub-menu
            $('#nav-primary ul.menu li.expanded .sub-menu').mouseenter(function () {
                $(this).parent().addClass('active');
            });
            // when hovering off, remove the class...
            $('#nav-primary ul.menu li.expanded .sub-menu').mouseleave(function () {
                $('#nav-primary ul.menu li.expanded').removeClass('active');
            });

            $('#nav-toggle').click(function () {
                $('#nav-primary ul.menu').css('display', 'table');
            });

            if(typeof CKEDITOR != 'undefined') {
                CKEDITOR.dtd.a.h2 = 1;
                CKEDITOR.dtd.a.div = 1;
                CKEDITOR.dtd.i.h2 = 1;
                CKEDITOR.dtd.i.h3 = 1;
                CKEDITOR.dtd.i.div = 1;
                CKEDITOR.dtd.h2.i = 1;
                CKEDITOR.dtd.h3.i = 1;
                CKEDITOR.dtd.div.i = 1;
            }

        });

        // Setup for on end of page resize...
        var resizeId;
        $(window).resize(function () {
            clearTimeout(resizeId);
            resizeId = setTimeout(doneResizing, 500);
        });
        // on page resize...
        function doneResizing() {
            AusGov.setTileHight();
        };


        /**
         * A really swell easing function.
         *
         * @param x float Position in animation as a percentage (i.e. 0.47).
         * @param t int Milliseconds since the start of the animation.
         * @param b int Start value, hardcoded to 0.
         * @param c int End value, hardcoded to 1.
         * @param d int Duration of the animation in milliseconds.
         * @return float Value between 0 and 1, indicating the adjusted position of the animation.
         */

        $.easing.swelling = function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        };

        /* New JS from DTA work */
        /*=============================*/


        // Feedback tool
        // -----------------

            // Are we running any A/B experiments? [see govtest.js]
            // Which ones are the user in?
            var govTestExperiment = '';

            if ( window.govtest ){
                for(var exp in govtest.activeExperiments){
                    if(govtest.activeExperiments.hasOwnProperty(exp)) {
                        govTestExperiment += '[' + exp + ':' + govtest.activeExperiments[exp].active + ']';
                    }
                }
            }

            // Setup clickyness
            $('.ag-feedback .ag-answer').click(function(event){
              event.preventDefault();
              // Get my value
              var answer = $(this).attr('data-answer');
              // Track with GA
              console.log('GA: Find answer? '+answer);
              ga('send', 'event','Find answer?', answer, govTestExperiment);
              // Show thanks result
              $('.ag-question').slideUp();
              $('.ag-result').slideDown().slideDown().attr( "role", "alert" ).focus();
              console.log(govTestExperiment);
              return false;
            });
            

    })(jQuery, window, document);

    // Smooth scrolling for all other anchors on non-front pages
    $('body.not-front a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            || location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 10
                }, 500);
                jQuery('#' + this.hash.slice(1) + ' h2').addClass('anchorHighlight');
                return false;
            }
        }
    });
    // Smooth scrolling for homepage anchor links wrapped in class = block-anchor-link
    $('body.front .block-anchor-link a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            || location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 10
                }, 500);
                jQuery('#' + this.hash.slice(1) + ' h2').addClass('anchorHighlight');
                return false;
            }
        }
    });

    $(document).delegate('.views-reset-button .form-submit', 'click', function (event) {
        event.preventDefault();
        $('form').each(function () {
            $('form select option').removeAttr('selected');
            $('form input[type=text]').attr('value', '');
            this.reset();
        });
        $('.views-submit-button .form-submit').click();
        return false;
    });


    jQuery(window).load(function() {
        jQuery('div.views-field-edit-node > div.contextual-links-wrapper > a').each(function() {
            var theHtml = jQuery(this).html();
            if(theHtml.indexOf('Edit Node') != -1) {
                jQuery(this).parent().parent().hide();
                var edit_node = jQuery(this).attr('href');
                var pattern = '/[0-9]+/';
                var matches = edit_node.match(pattern);
                if(matches) {
                    var nid = matches[0];
                    var qs = [], hash;
                    var q = edit_node.split('?')[1];
                    if(q != undefined){
                        q = q.split('&');
                        for(var i = 0; i < q.length; i++){
                            hash = q[i].split('=');
                            qs.push(hash[1]);
                            qs[hash[0]] = hash[1];
                        }
                    }
                    var lock_token = '';
                    if(qs['content_lock_token'].length > 0) {
                        lock_token = '?content_lock_token=' + qs['content_lock_token'];
                    }
                    nid = nid.slice(1,-1);
                    jQuery(this).parent().parent().parent().prepend("<div class='views-field views-field-edit-node contextual-links-region'>" +
                        "<div class='field-content contextual-links-wrapper contextual-links-processed'>" +
                        "<a id='" + nid + "' href='#' class='contextual-links-trigger'>Configure</a>" +
                        "<ul class='contextual-links contextual-links-edit-node'>" +
                        "<li><a class='footnote' href='/node/" + nid + "'>View Node</a></li>" +
                        "<li><a class='footnote' href='/node/" + nid + "/edit" + lock_token + "'>Edit Node</a></li>" +
                        "<li><a class='footnote' href='/node/" + nid + "/field_view'>View Properties</a></li>" +
                        "</ul></div></div>");
                }
            }
        });

        jQuery('.contextual-links-trigger').each(function() {
            jQuery(this).next('ul').hide();
            jQuery(this).click(function(e) {
                var node_id = jQuery(this).attr("id");
                if(typeof node_id !== "undefined") {
                    e.preventDefault();
                    jQuery(this).next('ul').toggle();
                }
            });

            jQuery(this).closest('.contextual-links-wrapper').mouseleave(function() {
                jQuery('.contextual-links-trigger').each(function() {
                    jQuery(this).next('ul').hide();
                    jQuery(this).removeClass("contextual-links-hide");
                });
            });
        });

        jQuery('li.views-ui-edit').each(function() {
            jQuery(this).parent().parent().hide();
        });
    });

});
