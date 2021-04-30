'use strict';

const styling = {

    //the "Highlight Answers" button
    theButton : document.getElementById('highlight'),

    //the answers to be highlighted and unhighlighted
    theAnswers : document.querySelectorAll('h3 + p'),

    //adds click event listener to the button
    init : function() {

        this.theButton.addEventListener('click', this.highlightAnswers, false);

    },

    //function to highlight answers
    highlightAnswers : function() {

        const theClass = (this.value === 'Highlight Answers') ? 'visualBox' : '';
        const theValue = (this.value === 'Highlight Answers') ? 'Remove Highlight' : 'Highlight Answers';

        for (const answer of styling.theAnswers){

            answer.className = theClass;

        }

        this.value = theValue;

    }
}

styling.init();