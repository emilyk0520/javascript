'use strict';

const validation = {

    // reference to body element
    body : document.querySelector('body'),

    // reference to form itself
    form : document.querySelector('form'),

    // reference to all form input elements and node list count
    allInputs : document.getElementsByTagName('input'),
    totalInputs : 0,

    // reference to all form select elements and node list count
    allSelects : document.getElementsByTagName('select'),
    totalSelects : 0,

    init : function() {

        // stores lengths of node lists
        this.totalInputs = this.allInputs.length;
        this.totalSelects = this.allSelects.length;

        // generates and sets up container to hold warnings
        this.generateValidationWarnings();

        // adds 'submit' event to form for validation
        this.form.addEventListener('submit', this.validateForm, false);
    },

    generateValidationWarnings : function() {

        // creates all containers and elements
        const warningContainer = document.createElement('div');
        validation.warningText = document.createElement('p');
        validation.errorList = document.createElement('ul');

        // sets up default attributes
        warningContainer.id = 'errors';

        // appends containers in necessary order
        warningContainer.appendChild(validation.warningText);
        warningContainer.appendChild(validation.errorList);
        validation.body.insertBefore(warningContainer, validation.form);
    },

    validateForm : function(evt) {

        // default of empty warning container
        validation.errorList.innerHTML = '';
        validation.warningText.innerHTML = '';

        // looks through all text inputs on form (name-age)
        for (let i=0; i<validation.totalInputs; i++) {

            // first name validation - checks for empty input
            if (validation.allInputs[i].name === 'voter_data' && validation.allInputs[i].value === ''){
                validation.errorList.innerHTML += '<li>Please provide a name.</li>';
            }

            // email validation - checks for valid email
            if (validation.allInputs[i].name === 'email_data'){
                
                const emailPattern = /^([\w\.\-])+\@(([\w\-])+\.)+([\w]{2,6})+$/;
                const emailAddress = emailPattern.test(validation.allInputs[i].value);

                if (!emailAddress) {
                    validation.errorList.innerHTML += '<li>Please provide a valid email address.</li>';
                }

            }

            // city validation - checks for empty input
            if (validation.allInputs[i].name === 'city_data' && validation.allInputs[i].value === ''){
                validation.errorList.innerHTML += '<li>Please indicate a city.</li>';
            }

            // state validation - checks for valid state abbreviation
            if (validation.allInputs[i].name === 'state_data'){
                
                const statePattern = /^([a-z][a-z]|[A-Z][A-Z]|[A-Z][a-z])$/; // allows 'MI', 'Mi', 'mi', but not 'mI'
                const stateAbbreviation = statePattern.test(validation.allInputs[i].value);

                if (!stateAbbreviation) {
                    validation.errorList.innerHTML += '<li>Please provide a valid state abbreviation.</li>';
                }

            }

            // age validation - checks for valid age
            if (validation.allInputs[i].name === 'age_data'){
                
                const agePattern = /^\d{1,3}$/; // allows ages from 1 digit to 3
                const age = agePattern.test(validation.allInputs[i].value);

                if (!age) {
                    validation.errorList.innerHTML += '<li>Please provide a valid age.</li>';
                }

            }
        }

        // looks through all select menus (gender and candidate)
        for (let i=0; i<validation.totalSelects; i++) {
        
            // gender validation - checks for selection of gender
            if (validation.allSelects[i].name === 'gender_data' && validation.allSelects[i].selectedIndex <= 0) {
                validation.errorList.innerHTML += '<li>Please select a gender.</li>';
            }
            
            // candidate validation - checks for selection of candidate
            if (validation.allSelects[i].name === 'choice_data' && validation.allSelects[i].selectedIndex <= 0) {
                validation.errorList.innerHTML += '<li>Please select your candidate.</li>';
            }
        
        }

        // if errorList has any warnings added to it, show warnings and prevent form from submitting
        if (validation.errorList.firstElementChild) {
    
            validation.warningText.appendChild(document.createTextNode('Your poll results could not be processed due to the following errors\u003a'));

            evt.preventDefault();

        }
  
    }

}
validation.init();