//All carousels on the page
var carousels = document.querySelectorAll( '[id$="-carousel"]' );

carousels.forEach( function ( carousel, i ) {

  var carouselID          = carousel.id;
  var carouselHeading     = document.querySelector( '#' + carouselID + ' h2:first-child>span' ).innerHTML;
  var carouselCardList    = document.querySelectorAll( '#' + carouselID + ' .react-multi-carousel-track li' );
  var carouselButtonLeft  = document.querySelector( '#' + carouselID + ' .carousel-button-group .prev' );
  var carouselButtonRight = document.querySelector( '#' + carouselID + ' .carousel-button-group .next' );

  carouselButtonLeft.addEventListener( 'click', function ( e ) {
      dataLayer.push({
        event: 'carousel_button_click',
        direction: 'left',
        carouselHeading: carouselHeading,
        carouselNumber: i + 1
      });
  });

  carouselButtonRight.addEventListener( 'click', function ( e ) {
      dataLayer.push({
        event: 'carousel_button_click',
        direction: 'right',
        carouselHeading: carouselHeading,
        carouselNumber: i + 1
      });
  });

  //loop through each item in the carousel
  carouselCardList.forEach( function (card, j) {
    //get the heading inside the card
    var cardTitle = card.getElementsByTagName( 'h3' )[ 0 ].innerHTML; // on click send data to layer

    card.addEventListener( 'mouseup', function ( e ) {

      //detect middle and left click only
      if( e.button === 0 || e.button === 1 ){
        dataLayer.push({
          event: 'carousel_card_click',
          carouselNumber: i + 1,
          carouselHeading: carouselHeading,
          cardNumber: j + 1,
          cardTitle: cardTitle
        });
      }
    });
  });
});
