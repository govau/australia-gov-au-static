var headings = document.querySelectorAll('h2');


for( i = 0 ; i < headings.length; i++ ) {
  var headingText = headings[ i ].innerHTML;

  //generate anchor ID, get heading text and replace space with _. Remove any non letters
  var anchorID = headingText.replace(/\s+/g, '_').replace(/\W/g, '').toLowerCase();

  headings[ i ].classList.add('anchor');
  headings[ i ].innerHTML = '<a class="icon icon--link" aria-hidden="true" href="#' + anchorID + '"></a><span id="' + anchorID + '">' + headingText + '</span>';
}
