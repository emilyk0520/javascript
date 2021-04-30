"use strict";

const dg = {

  // reference to the data table
  dataTable : document.getElementById('data'),

  // reference to submit button
  submitBtn : document.getElementById('submitBtn'),

  // reference to paragraph holding error message
  errorMessageContainer : document.querySelector('#submitHolder p#error'),

  // readonly inputs node list (dynamic)
  lockedInputs : document.getElementById('data').getElementsByClassName('readonly'),
  
  // marked inputs node list (dynamic)
  highlightedInputs : document.getElementById('data').getElementsByClassName('marked'),

  // invalid inputs node list (dynamic)
  invalidInputs : document.getElementById('data').getElementsByClassName('invalid'),

  // buttons for mass unlocks and highlight removal
  clearLocksBtn : document.createElement('input'),
  clearHighlightsBtn : document.createElement('input'),

  init : function() {

    // assign listeners to the table for event delegation
    this.dataTable.addEventListener('click', this.updateCell, false);
    this.dataTable.addEventListener('mouseover', this.showMeasureSubject, false);
    this.dataTable.addEventListener('input', this.validateData, false);

    // assign listeners for window events
    window.addEventListener('unload', this.storeLocksHighlights, false);
    window.addEventListener('DOMContentLoaded', this.scanTableValidation, false);

    // set up the help icon and text
    this.generateHelp();

    // set up the div with the two buttons to clear locks and highlights
    this.generateClearingControls();

    // restores locks/highlight effects based on localStorage
    this.restoreLocksHighlights();
  },

  generateHelp : function() {
  
    // wrapper element for image and help box
    const wrapper = document.getElementById('helpWrapper');
    
    // code string for image and help box
    let str = '<a href="#" id="helpIcon" aria-controls="helpBox" aria-expanded="false">'
    str += '<img src="i/help.png" alt="Help"></a>';
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
  
  // set up the div with the two buttons to clear locks and highlights
  generateClearingControls : function() {

    const container = document.createElement('div');
    container.id = 'clearingControls';
    this.clearLocksBtn.type = this.clearHighlightsBtn.type = 'button';
    this.clearLocksBtn.value = 'Unlock Cells';
    this.clearHighlightsBtn.value = 'Remove Cell Highlights';
    this.clearLocksBtn.className = this.clearHighlightsBtn.className = 'hide';
    container.appendChild(this.clearLocksBtn);
    container.appendChild(this.clearHighlightsBtn);
    container.addEventListener('click', this.clearFieldSettings, false);
    document.querySelector('body').appendChild(container);
  
  },

  // removing either all locks or all highlights as well as the related control button
  clearFieldSettings : function(evt) {
  
    const btn = dg.findTarget(evt, 'input', this);
    
    if (!btn) { return; }
    
    if (btn.value === 'Unlock Cells') {
    
      while (dg.lockedInputs.length) {
        dg.lockedInputs[0].readOnly = false;
        dg.lockedInputs[0].title = '';

        // sequencing matters here - drop the input out of the node list last to avoid
        // errors related to trying to set attributes on undefined element node references
        dg.lockedInputs[0].classList.remove('readonly');
      }

    }
    
    else {

      while (dg.highlightedInputs.length) {
        dg.highlightedInputs[0].classList.remove('marked');
      }
    
    }

    // remove the control button
    btn.classList.toggle('hide'); 
  
  },

  showMeasureSubject : function(evt) {

    // reference to the td moused over
    const theCell = dg.findTarget(evt, 'td', this);
    
    // we can skip the lookup if there is already a title provided
    if (!theCell || theCell.title) { return; }
        
    // locate the subject
    const subject = theCell.parentNode.cells[0].firstChild.nodeValue;
    
    // locate the measure
    const measure = dg.dataTable.rows[0].cells[theCell.cellIndex].firstChild.nodeValue;
    
    // build and assign the title
    theCell.title = subject + ', ' + measure;
  
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
    
      textBox.readOnly = (textBox.readOnly) ? false : true;
      textBox.classList.toggle('readonly');
      textBox.title = (textBox.title) ? '' : 'The cell is locked and cannot be edited; SHIFT + click to unlock it';
      dg.lockedInputs.length ? dg.clearLocksBtn.classList.remove('hide') : dg.clearLocksBtn.classList.add('hide');

    }
    
    // if the ALT key was pressed highlight the text input or remove its highlight
    if (evt.altKey) {

      textBox.classList.toggle('marked');
      dg.highlightedInputs.length ? dg.clearHighlightsBtn.classList.remove('hide') : dg.clearHighlightsBtn.classList.add('hide');
   
    }
    
    // if the CTRL key was pressed wipe the text input value
    if (evt.ctrlKey) {
    
      textBox.value = '';
    
    }
  
  },

  scanTableValidation : function () {

    // regex for validation
    dg.pattern = /^[0-9.]+$/; 

    // total rows in table
    const totalRows = dg.dataTable.rows.length;

    // loop through entire table for inputs that aren't empty to run validation
    for (let i=1; i<totalRows; i++){
      for (let j=1, col; col = dg.dataTable.rows[i].cells[j]; j++) {

        const reloadedInput = dg.dataTable.rows[i].cells[j].firstElementChild;

        if (reloadedInput.value.length > 0){ // if non-empty input exists in table, run validation
          const noError = dg.pattern.test(reloadedInput.value);

          // set invalid class based on validation result
          (noError || reloadedInput.value.length === 0) ? reloadedInput.classList.remove('invalid') : reloadedInput.classList.add('invalid');

          if (dg.invalidInputs.length > 0) {

            if (dg.errorMessageContainer.childNodes.length === 0){
                dg.errorMessageContainer.appendChild(document.createTextNode('Saving disabled until invalid data is corrected.'));
            }
    
            dg.submitBtn.setAttribute('disabled', 'disabled');
          }
    
          else {
            dg.submitBtn.removeAttribute('disabled');
            dg.errorMessageContainer.textContent = '';
          }
        }
      }
    }
  },

  validateData : function(evt) {

    const textBox = dg.findTarget(evt, 'input', this);

    if (!textBox) { return; }
    const noError = dg.pattern.test(textBox.value);

    // set invalid class based on validation result
    (noError || textBox.value.length === 0) ? textBox.classList.remove('invalid') : textBox.classList.add('invalid');

    if (dg.invalidInputs.length > 0) { // if inputs with the invalid class exist

        if (dg.errorMessageContainer.childNodes.length === 0){ // only add error text if it doesn't exist
            dg.errorMessageContainer.appendChild(document.createTextNode('Saving disabled until invalid data is corrected.'));
        }

        dg.submitBtn.setAttribute('disabled', 'disabled');
    }

    else {
        dg.submitBtn.removeAttribute('disabled');
        dg.errorMessageContainer.textContent = '';
    }
},

  storeLocksHighlights : function() {
  
  let highlightedLength = 0; // count of how many highlighted inputs
  for (const cell of dg.highlightedInputs) {
      const cellPos = cell.parentNode.cellIndex; // store column position
      const rowPos = cell.parentNode.parentNode.rowIndex; // store row position

      // store both positions in local storage 
      localStorage.setItem('highlightrow' + highlightedLength + '_' + dg.submitBtn.nextElementSibling.value, rowPos);
      localStorage.setItem('highlightcell' + highlightedLength + '_' + dg.submitBtn.nextElementSibling.value, cellPos);

      highlightedLength++;
  }

  let lockedLength = 0; // count of how many locked inputs
  for (const cell of dg.lockedInputs) {
      const cellPos = cell.parentNode.cellIndex; // store column position
      const rowPos = cell.parentNode.parentNode.rowIndex; // store row position

      // store both positions in local storage
      localStorage.setItem('lockrow' + lockedLength + '_' + dg.submitBtn.nextElementSibling.value, rowPos);
      localStorage.setItem('lockcell' + lockedLength + '_' + dg.submitBtn.nextElementSibling.value, cellPos);

      lockedLength++;
  }

  // store the studyID from hidden variable
  localStorage.setItem('studyID', dg.submitBtn.nextElementSibling.value);

  // store the length of the list of highlighted inputs and locked inputs
  localStorage.setItem('highlightList_length', highlightedLength);
  localStorage.setItem('lockList_length', lockedLength);
  },

  restoreLocksHighlights : function() {

    const highlightedFieldsRowArray = [];
    const highlightedFieldsCellArray = [];
    const lockedFieldsRowArray = [];
    const lockedFieldsCellArray = [];

    // get unique studyID first, to get specific data
    const studyID = localStorage.getItem('studyID'); 
    
    const highlightListLength = parseInt(localStorage.getItem('highlightList_length')); // number of highlighted inputs
    const lockListLength = parseInt(localStorage.getItem('lockList_length')); // number of locked inputs

    for (let i = 0; i < highlightListLength; i++) {
      highlightedFieldsRowArray.push(localStorage.getItem('highlightrow' + i + '_' + studyID));
      const rowPos = parseInt(highlightedFieldsRowArray[i]);

      highlightedFieldsCellArray.push(localStorage.getItem('highlightcell' + i + '_' + studyID));
      const cellPos = parseInt(highlightedFieldsCellArray[i]);

      // add marked class for highlight effect based on stored row and col positions
      dg.dataTable.rows[rowPos].cells[cellPos].firstElementChild.className = 'marked';
    }

    for (let i = 0; i < lockListLength; i++) {
      lockedFieldsRowArray.push(localStorage.getItem('lockrow' + i + '_' + studyID));
      const rowPosi = parseInt(lockedFieldsRowArray[i]);

      lockedFieldsCellArray.push(localStorage.getItem('lockcell' + i + '_' + studyID));
      const cellPosi = parseInt(lockedFieldsCellArray[i]);

      // add readonly class for locked effect and lock input based on stored row and col positions
      dg.dataTable.rows[rowPosi].cells[cellPosi].firstElementChild.className = 'readonly';
      dg.dataTable.rows[rowPosi].cells[cellPosi].firstElementChild.readOnly = (dg.dataTable.rows[rowPosi].cells[cellPosi].firstElementChild.readOnly) ? false : true;
      dg.dataTable.rows[rowPosi].cells[cellPosi].firstElementChild.title = (dg.dataTable.rows[rowPosi].cells[cellPosi].firstElementChild.title) ? '' : 'The cell is locked and cannot be edited; SHIFT + click to unlock it';
    }

    // show/hide clear buttons based on if locked/highlighted inputs exists
    dg.lockedInputs.length ? dg.clearLocksBtn.classList.remove('hide') : dg.clearLocksBtn.classList.add('hide');
    dg.highlightedInputs.length ? dg.clearHighlightsBtn.classList.remove('hide') : dg.clearHighlightsBtn.classList.add('hide');

  },
  
  findTarget : function(evt, targetNode, container) {
    let currentNode = evt.target;
    while (currentNode && currentNode !== container) {  
      if (currentNode.nodeName.toLowerCase() === targetNode.toLowerCase()) { return currentNode; }
      else { currentNode = currentNode.parentNode; }
    }
    return false;
  }

}

dg.init();