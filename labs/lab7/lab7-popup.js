'use strict';

const popup = {

button : document.querySelector('form input[value="Close Window"]'),
fieldsList : document.querySelector('form ul'),

init : function() {

    // add click listener that closes window
    this.button.addEventListener('click', this.closeWindow, false);

    this.displayInformation();

},

displayInformation : function() {

    // extract information in localStorage
    const name = localStorage.getItem('voter_data');
    const email = localStorage.getItem('email_data');    
    const city = localStorage.getItem('city_data'); 
    const state = localStorage.getItem('state_data');
    const age = localStorage.getItem('age_data');
    const gender = localStorage.getItem('gender_data');
    const choice = localStorage.getItem('choice_data');

    // add to array in order of appearance on page
    const informationArray = [name, email, city, state, age, gender, choice];

    // set up an array to contain list items
    const listItemList = [];

    // identify first list item and add to array first
    let listItem = popup.fieldsList.firstElementChild;
    listItemList.push(listItem);

    // reassign next element sibling as listItem if exists and add to array
    while (listItem = listItem.nextElementSibling) {
        listItemList.push(listItem);
    }

    const listLength = listItemList.length;

    // append from localStorage information array to corresponding list item
    for (let i = 0; i < listLength; i++) {
        listItemList[i].appendChild(document.createTextNode(informationArray[i]));
    }

},

closeWindow : function() {
    window.close();
}
 
}

popup.init();