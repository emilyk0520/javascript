'use strict';

const timesheet = {

//stores checkbox input elements
checkboxCells : document.querySelectorAll('table tbody tr input[name=deleteRow]'),

//stores time input elements under Time column
textInputCells : document.querySelectorAll('table tbody input[name^=hoursTask]'),

init : function() {

    /*CENTERS CHECKBOXES*/
    this.centerCheckboxes();
    
    /*SPECIFICATIONS FOR (NON-)BILLABLE*/
    this.notBillable();

},

centerCheckboxes : function() {

    for (const cell of timesheet.checkboxCells) {
        cell.parentNode.classList.add('action');
    }

},

notBillable : function() {

    for (const cell of timesheet.textInputCells) {

        //checks text content of client cell
        if (cell.parentNode.parentNode.firstElementChild.firstChild.nodeValue === "Non-Billable"){

            /*DISABLES INPUT AREA FOR TIME*/
            cell.setAttribute('disabled', 'true');

            /*ADDS MESSAGE TO DESCRIPTION*/
            const descCell = cell.parentNode.nextElementSibling; //reference to Description cell
            
            const theMessage = (!descCell.firstChild) ? 'Non-Billable' : ' (Non-Billable)'; //message customized based on if descCell has content
            descCell.appendChild(document.createTextNode(theMessage));

        }

        else {

            //adds "Hours" to time input for billable clients
            cell.parentNode.appendChild(document.createTextNode(' Hours'));

        }
    }
    
}

}
timesheet.init();