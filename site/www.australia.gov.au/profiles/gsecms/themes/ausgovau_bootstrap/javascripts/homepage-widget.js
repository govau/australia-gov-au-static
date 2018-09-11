/**
 * Set active State for the homepage widget
 * Created using PHP Storm on 8th May 2015, jason.guo@xing.net.au
 */
(function($) {
    Drupal.behaviors.myBehavior = {
        attach: function (context, settings) {
            //set active State for public holidays
            $('#public-holidays .state-set').click(function(event) {
                event.preventDefault();
                // remove the active class from any existing
                $('#public-holidays .state-set').removeClass('active');
                // then, set active class on the currently selected list item
                $(this).addClass('active');

                var $stateVal = '.public-holidays.' + $(this).data('state');
                $('.public-holidays').hide();
                $('#btn-active-state').text($(this).text());
                $($stateVal).fadeIn(400);

            });
            $(document).on('shown.bs.dropdown', function(event) {
                var dropdown = $(event.target);

                // Set aria-expanded to true
                dropdown.find('.dropdown-menu').attr('aria-expanded', true);

                // Set focus on the first link in the dropdown
                setTimeout(function() {
                    dropdown.find('.dropdown-menu li:first-child a').focus();
                }, 10);
            });

// On dropdown close
            $(document).on('hidden.bs.dropdown', function(event) {
                var dropdown = $(event.target);

                // Set aria-expanded to false
                dropdown.find('.dropdown-menu').attr('aria-expanded', false);

                // Set focus back to dropdown toggle
                dropdown.find('.dropdown-toggle').focus();
            });
            //code ends
        }
    };
})(jQuery);
