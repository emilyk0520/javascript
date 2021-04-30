'use strict';

const tbl = {

  // reference to the data table
  theTable : document.getElementsByTagName('table')[0],

  // reference to the first row of the table (holding header cells)
  headerRow : document.getElementsByTagName('table')[0].rows[0],

  init : function() {

    // assign mouse events to table    
    this.theTable.addEventListener('mouseover', this.addRemoveHighlight, false);
    this.theTable.addEventListener('mouseout', this.addRemoveHighlight, false);    
  
  },

  addRemoveHighlight : function(evt) {

    const targetCell = tbl.findTarget(evt, 'td', this);
 
    if (targetCell) {

      //highlight cell moused over
      targetCell.classList.toggle('highlight');
       
      //highlight row header cell
      targetCell.parentNode.cells[0].classList.toggle('highlight');

      // highlight column header cell
      tbl.headerRow.cells[targetCell.cellIndex].classList.toggle('highlight');

      // references to the row/cell index of the targetCell
      const rowLocation = targetCell.parentNode.rowIndex;
      const columnLocation = targetCell.cellIndex;

      // sets vertical path highlight 
      for (let i = 1; i < rowLocation; i++) {
        tbl.theTable.rows[i].cells[columnLocation].classList.toggle('path');
      }

      // sets horizontal path highlight
      for (let i = 1; i < columnLocation; i++) {
        tbl.theTable.rows[rowLocation].cells[i].classList.toggle('path');
      }

    }

  },
  
  findTarget : function(evt, targetNode, container) {
    let currentNode = evt.target;
    while (currentNode && currentNode !== container) {  
      if (currentNode.nodeName.toLowerCase() === targetNode) { return currentNode; }
      else { currentNode = currentNode.parentNode; } 
    }
    return false;
  }
  
}

tbl.init();