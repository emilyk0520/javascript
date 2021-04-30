"use strict";

const dg = {

    // reference to body tag 
    body : document.querySelector('body'),

    // reference to the data table
    dataTable : document.getElementById('data'),

    // reference to the header row of table
    headerRow : document.getElementsByTagName('table')[0].rows[0],

    // reference to data cells
    cells : document.querySelectorAll('#data td input'),

    // count for inputs with readonly class set
    readonlyClassCount : 0,

    // count for inputs with marked class set
    markedClassCount : 0,
  
    init : function() {

        // assign click listeners to the data table for event delegation
        this.dataTable.addEventListener('click', this.updateCell, false);
        this.dataTable.addEventListener('mouseover', this.locateCell, false);
        
        // set up the help icon and text
        this.generateHelp();

        // set up controls area with buttons
        this.generateControls();
    
    },

    generateHelp : function() {
  
        // wrapper element for image and help box
        const wrapper = document.getElementById('helpWrapper');
    
        // code string for image and help box
        let str = '<a href="#" id="helpIcon" aria-controls="helpBox" aria-expanded="false">';
        str += '<img src="i/help.png" alt="Help" width="17" height="17" /></a>';
        str += '<ul id="helpBox" class="remove">';
        str += '<li>To lock a cell (prevent edits) SHIFT + click on the cell; to unlock repeat this process.</li>';
        str += '<li>To highlight a cell ALT + click on the cell; to remove the highlight repeat the process.</li>';
        str += '<li>To clear a cell\'s value CTRL + click on the cell.</li>';
        str += '</ul>';
        wrapper.innerHTML = str;

        this.theIcon = document.getElementById('helpIcon');
        this.instructions = document.getElementById('helpBox');

        // assign click event to the Help icon
        this.theIcon.addEventListener('click', this.showHideHelp, false);
        
    },
  
    generateControls : function() {

        // element nodes for the help box
        const controlBox = document.createElement('div');
        this.button1 = document.createElement('input');
        this.button2 = document.createElement('input');  

        // assigning various attributes
        controlBox.id = 'clearingControls';
        this.button1.type = 'button';
        this.button1.value = 'Unlock Cells';
        this.button1.className = 'hide';
        this.button2.type = 'button';
        this.button2.value = 'Remove Cell Highlights';
        this.button2.className = 'hide';
    
        // assembling and appending help box
        controlBox.appendChild(this.button1);
        controlBox.appendChild(this.button2);
        dg.body.appendChild(controlBox);

        // sets up click event to clear effects with event delegation
        controlBox.addEventListener('click', dg.clearEffects, false);

    },

    // toggle show/hide of the help box
    showHideHelp : function(evt) {
    
        dg.instructions.classList.toggle('remove');
        dg.theIcon.getAttribute('aria-expanded') === 'false' ? dg.theIcon.setAttribute('aria-expanded', 'true') : dg.theIcon.setAttribute('aria-expanded', 'false');
        evt.preventDefault();
    
    },
  
    updateCell : function(evt) {
  
        // reference to text input box clicked
        const textBox = dg.findTarget(evt, 'input', this);
    
        // if the click path did not involve a text input stop processing
        if (!textBox) { return; }
    
        // if the SHIFT key was pressed lock down the field or unlock the field
        if (evt.shiftKey) { 

            // locking/unlocking of field
            textBox.readOnly = (textBox.readOnly) ? false : true;
            const classExists = textBox.classList.toggle('readonly');
            textBox.title = (textBox.title) ? '' : 'The cell is locked and cannot be edited; SHIFT + click to unlock it';
              
            // if class was toggled on, add to class count
            if (classExists) {
                dg.readonlyClassCount += 1;
            }

            // if class was toggled off, remove from class count
            else {
                dg.readonlyClassCount -= 1;
            }

            // variables that identify relevant count/button to be passed to button display function
            const buttonX = dg.button1;
            const classCount = dg.readonlyClassCount;
            
            // tracks which inputs have classes assigned
            dg.toggleControlButtonDisplay(buttonX, classCount); 

        }
        
        // if the ALT key was pressed highlight the text input or remove its highlight
        if (evt.altKey) {

            // highlighting of field
            const classExists = textBox.classList.toggle('marked');

            // if class toggled on, add to class count
            if (classExists) {
                dg.markedClassCount += 1;
            }

            // if class toggled off, remove from class count
            else {
                dg.markedClassCount -= 1;
            }

            // variables that identify relevant count/button to be passed to button display function 
            const buttonX = dg.button2;
            const classCount = dg.markedClassCount;

            // tracks which inputs have classes assigned
            dg.toggleControlButtonDisplay(buttonX, classCount);

        }
        
        // if the CTRL key was pressed wipe the text input value
        if (evt.ctrlKey) {
        
            textBox.value = '';
        
        }
  
    },


    // shows/hides control button based on class count
    toggleControlButtonDisplay : function(buttonX, classCount) {

        // if count is greater than 0 (inputs with classes exist), show button
        if (classCount > 0) {
            buttonX.classList.remove('hide');
        }

        // if no inputs with classes, hide button
        else {
            buttonX.classList.add('hide');
        }
        
    },

    // global clearing of highlight/locking effect based on button 
    clearEffects : function(evt) {

        const theButton = dg.findTarget(evt, 'input', this);

        if (!theButton) { return; }

        switch (theButton.value) {
                
            // if button's value is 'Unlock Cells', remove readonly class and readonly attribute
            case 'Unlock Cells':

                for (const currentCell of dg.cells) {

                    currentCell.classList.remove('readonly');
                    currentCell.readOnly = false;
                    currentCell.title = '';

                }

                // set readonly class count back to 0
                dg.readonlyClassCount = 0;

                // hide the button again
                theButton.classList.add('hide');

                break;

            // if button's value is 'Remove Cell Highlights', remove marked class
            case 'Remove Cell Highlights':

                for (const currentCell of dg.cells) {
                    currentCell.classList.remove('marked');
                }

                // set marked class count back to 0
                dg.markedClassCount = 0;

                // hide the button again
                theButton.classList.add('hide');

                break;

            }

    },

    // provides title attr with cell location
    locateCell : function(evt) {

        const theCell = dg.findTarget(evt, 'td', this);

        if (!theCell) { return; }

        // contain text value of theCell's row header and column header
        const rowName = theCell.parentNode.cells[0].firstChild.nodeValue;
        const columnName = dg.headerRow.cells[theCell.cellIndex].firstChild.nodeValue;

        // set title to row name and column name
        theCell.title = `${rowName}, ${columnName}`;

    },

    findTarget : function(evt, targetNode, container) {
        let currentNode = evt.target;
        while (currentNode && currentNode !== container) {  
        if (currentNode.nodeName.toLowerCase() === targetNode.toLowerCase()) { return currentNode; }
        else { currentNode = currentNode.parentNode; }
        }
        return false;
    }

};

dg.init();

