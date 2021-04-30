'use strict';

const workflow = {

priorityButton : document.getElementsByName('actionButton')[0],

highlightButton : document.getElementsByName('actionButton')[1],

typeButton : document.getElementsByName('actionButton')[2],

lowPriorityRow : document.querySelectorAll('#projectsTbl tbody tr[data-priority=low]'),

//each row of table
tableRows : document.querySelectorAll('#projectsTbl tbody tr'),

//column that holds type information
typeColumns : document.querySelectorAll('#projectsTbl tbody th + td'),

//"Type" heading
typeHeading : document.querySelectorAll('#projectsTbl thead th')[1],




init : function() {

    this.priorityButton.addEventListener('click', this.togglePriority, false);
    this.highlightButton.addEventListener('click', this.toggleHighlight, false);
    this.typeButton.addEventListener('click', this.toggleType, false);

},



togglePriority : function() {

    const theClass = (this.value === 'Hide Low Priority') ? 'none' : '';
    this.value = (this.value === 'Hide Low Priority') ? 'Show Low Priority' : 'Hide Low Priority';

    for (const row of workflow.lowPriorityRow){
        row.style.display = theClass;
    }

},




toggleHighlight : function() {

    const theBoolean = (this.value === 'Highlight Current Row') ? true : false;
    this.value = (this.value === 'Highlight Current Row') ? 'Remove Row Highlight' : 'Highlight Current Row';

    if (theBoolean) {//if button is clicked, adds event listeners
        for (const row of workflow.tableRows){
            row.addEventListener('mouseenter', workflow.highlightOn, false);
            row.addEventListener('mouseleave', workflow.highlightOff, false);
        }
    }

    else if (!theBoolean) {//if button is NOT clicked, removes event listeners
        for (const row of workflow.tableRows){
            row.removeEventListener('mouseenter', workflow.highlightOn, false);
            row.removeEventListener('mouseleave', workflow.highlightOff, false);
        }
    }

},




highlightOn : function() {

    //adds "highlight" class that has a CSS style written for background color
    this.classList.add('highlight');

},




highlightOff : function() {
    
    //removes "highlight" class
    this.classList.remove('highlight');

},




toggleType : function() {

    const theClass = (this.value === 'Hide Type Column') ? 'none' : '';
    this.value = (this.value === 'Hide Type Column') ? 'Show Type Column' : 'Hide Type Column';

    //hides both the heading for type column and entire type column
    workflow.typeHeading.style.display = theClass;
    for (const column of workflow.typeColumns){
        column.style.display = theClass;
    }

}


}

workflow.init();