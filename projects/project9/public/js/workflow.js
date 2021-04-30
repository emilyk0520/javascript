"use strict";

const wf = {

    // action buttons
    buttonsArea : document.querySelector('#actionForm'),
    
    // reference to main element  
    contentArea : document.querySelector('#content'),
    
    // reference to data table of work items
    dataTable : document.querySelector('#projectsTbl'),

    // reference to header row/cells of table
    headerRow : document.querySelector('#projectsTbl thead tr'),
    headerCells : document.querySelectorAll('#projectsTbl thead tr th'),
  
    // reference to tbody within data table
    dataRowHolder : document.querySelector('#projectsTbl tbody'),

    // reference to 'Recent Changes' container
    recentChanges : document.querySelector('#recentChangesList'),

    // flags indicating if each button is pressed
    hideLowPriority : false,
    highlightOn : false,
    hideTypeColumn : false,

    init : function() {

      if (wf.buttonsArea){
        // create buttons to control table effects and recent changes ul and restore if set
        this.createButtons();
        this.restoreButtonSettings();
        
        // assign button event handlers
        this.buttonsArea.addEventListener('click', this.setDisplay, false);
      }

      // call JSON file to generate 'Recent Changes' sidebar
      this.fetchJSON('/public/json/recent-changes.json');
  
      
      if (wf.dataTable){
        // assign data row / header row event handlers
        this.dataTable.addEventListener('mouseover', this.rowHighlight, false);
        this.dataTable.addEventListener('mouseout', this.rowHighlight, false);
        this.headerRow.addEventListener('click', this.toggleSortArrowDisplay, false);

        // restore table sort settings
        this.restoreTableSettings();
      }
  
    },

    createButtons : function() {

      // creating buttons area
      wf.buttonsArea.insertAdjacentHTML('afterbegin', '<input type="button" name="actionButton" value="Hide Low Priority" />');
      wf.buttonsArea.insertAdjacentHTML('afterbegin', '<input type="button" name="actionButton" value="Highlight Current Row" />');
      wf.buttonsArea.insertAdjacentHTML('afterbegin', '<input type="button" name="actionButton" value="Hide Type Column" />');

      // references to individual buttons for use later
      wf.hidePriorityButton = document.querySelector('#content input[value="Hide Low Priority"]');
      wf.highlightButton = document.querySelector('#content input[value="Highlight Current Row"]');
      wf.hideTypeButton = document.querySelector('#content input[value="Hide Type Column"]');

    },
    
    setDisplay : function(evt) {

        const theButton = wf.findTarget(evt, 'input', this);

        if (!theButton) { return; }
    
      // use button value to determine what to do
      switch(theButton.value) {
      
        case 'Hide Low Priority': 
        
          wf.hideLowPriority = true;
          wf.contentArea.className = 'hidePriority';
          theButton.value = 'Show Low Priority';
          break;
        
        case 'Show Low Priority': 
        
          wf.hideLowPriority = false;
          wf.contentArea.className = '';
          theButton.value = 'Hide Low Priority';
          break;
        
        case 'Highlight Current Row': 
        
          wf.highlightOn = true;
          wf.dataRowHolder.className = 'allowHighlight';
          theButton.value = 'Remove Row Highlight';
          break;
      
        case 'Remove Row Highlight': 
        
          wf.highlightOn = false;
          wf.dataRowHolder.className = '';
          theButton.value = 'Highlight Current Row';
          break;
        
        case 'Hide Type Column': 
        
          wf.hideTypeColumn = true;
          wf.dataTable.className = 'hideColumn';
          theButton.value = 'Show Type Column';
          break;
        
        case 'Show Type Column':
  
          wf.hideTypeColumn = false;
          wf.dataTable.className = '';
          theButton.value = 'Hide Type Column';
          break;     
        
      }

      // store button settings whenever there is a change
      wf.storeButtonSettings();
    
    },
    
    rowHighlight : function(evt) {

        const theRow = wf.findTarget(evt, 'tr', this);
        if (!theRow) { return; }
        theRow.id = (theRow.id) ? '' : 'currentRow';
    
    },

    toggleSortArrowDisplay : function(evt) {

      const theCell = wf.findTarget(evt, 'a', this);
      if (!theCell) { return; }

      // prevent URL from changing
      evt.preventDefault();

      // empty all header cells' id attribute
      for (const cell of wf.headerCells){
        cell.id = '';
      }

      // clicked header cell has identifying class assigned
      theCell.parentNode.id = 'sortedColumn';

      // clear all header cells' icons except clicked cell
      for (const cell of wf.headerCells){
        if (cell.id !== 'sortedColumn'){
          cell.className = '';
        }
      }

      // toggle display of icon to up/down 
      theCell.parentNode.className = (theCell.parentNode.className === 'ascen') ? 'descen' : 'ascen';
          

      wf.sortRows(theCell.parentNode);

    },

    sortRows : function(clickedCell) {

      // array that will hold objects containing text content to be sorted and DOM reference to the row that contained that text 
      wf.sortColumnArray = [];

      const totalRowNumber = wf.dataRowHolder.rows.length; // contains number of rows in tbody

      for (let i=0; i<totalRowNumber; i++){
        const currentColumnCell = wf.dataRowHolder.rows[i].cells[(clickedCell.cellIndex)]; // pinpoints current cell in clicked column
        const textContent = currentColumnCell.innerText; // grabs text content from cell
        wf.sortColumnArray.push({text: textContent, rowReference: wf.dataRowHolder.rows[i] }); // adds text content and tr node as object to array
      }

      // store length for use later
      wf.sortColumnArrayLength = wf.sortColumnArray.length;

      // based on up/down arrow, sort accordingly
      switch (clickedCell.className){
        case 'ascen':
          
          if (clickedCell.textContent === 'ID') {
            wf.sortColumnArray.sort(wf.numericSort); 
          }
          else {
            wf.sortColumnArray.sort(wf.alphaSort); 
          }

        break;
        
        case 'descen':
          
          if (clickedCell.textContent === 'ID') {
            wf.sortColumnArray.sort(wf.numericReverse); 
          }
          else {
            wf.sortColumnArray.sort(wf.alphaReverse);
          }

        break;
      }

      // reconstruct table by appending rows to tbody in order they appear in the sorted array
      for (let i = 0; i < wf.sortColumnArrayLength; i++) {
        wf.dataRowHolder.appendChild(wf.sortColumnArray[i].rowReference);
      } 

      // store the sort settings
      wf.storeSortSettings(clickedCell);

    },

    /*CUSTOM SORT FUNCTIONS TO HANDLE OBJECTS*/
    numericSort : function(cell1, cell2) {
      return cell1.text - cell2.text;
    },

    numericReverse : function(cell1, cell2) {
      return cell2.text - cell1.text;
    },

    alphaSort : function(cell1, cell2) {

      if (cell1.text.toLowerCase() > cell2.text.toLowerCase()) { return 1; } 
      else if (cell1.text.toLowerCase() < cell2.text.toLowerCase()) { return -1; }
      return 0;

    },

    alphaReverse : function(cell1, cell2) {

      if (cell1.text.toLowerCase() > cell2.text.toLowerCase()) { return -1; } 
      else if (cell1.text.toLowerCase() < cell2.text.toLowerCase()) { return 1; }
      return 0;

    },

    storeSortSettings : function(clickedCell) {
      localStorage.setItem('sortDirection', clickedCell.className); // classname indicates direction of sort
      localStorage.setItem('sortedColumn', clickedCell.cellIndex); // clickedCell.cellIndex indicates column position
    },

    storeButtonSettings : function() {
      // stores flags that indicate button states
      localStorage.setItem('hideLowPriority', wf.hideLowPriority);
      localStorage.setItem('highlightOn', wf.highlightOn);
      localStorage.setItem('hideTypeColumn', wf.hideTypeColumn);
    },

    restoreButtonSettings : function() {

      wf.hideLowPriority = (localStorage.getItem('hideLowPriority')==='true') ? true : false;
      wf.highlightOn = (localStorage.getItem('highlightOn')==='true') ? true : false;
      wf.hideTypeColumn = (localStorage.getItem('hideTypeColumn')==='true') ? true : false;

      if (wf.hideLowPriority){
        wf.contentArea.className = 'hidePriority';
        wf.hidePriorityButton.value = 'Show Low Priority';
      }

      if (wf.highlightOn){
        wf.dataRowHolder.className = 'allowHighlight';
        wf.highlightButton.value = 'Remove Row Highlight';
      }

      if (wf.hideTypeColumn){
        wf.dataTable.className = 'hideColumn';
        wf.hideTypeButton.value = 'Show Type Column';
      }

    }, 

    restoreTableSettings : function() {

      const sortDirection = localStorage.getItem('sortDirection');
      const sortedColumn = localStorage.getItem('sortedColumn');

      // if no settings are stored related to sorting, default to an ascending sort of ID
      if (!sortDirection || !sortedColumn ){
        wf.headerRow.cells[0].className = 'ascen';
        wf.sortRows(wf.headerRow.cells[0]);
      }
      else {
        wf.headerRow.cells[sortedColumn].className = sortDirection;
        wf.sortRows(wf.headerRow.cells[sortedColumn]);
      }

    },

    fetchJSON : async function(url) {
      try {
        const response = await fetch(url, {method: 'GET', cache: 'no-cache' });
        const data = await response.json();

        // populate page with fetched data
        this.populateJSONData(data);
      }
      catch (error) {
        console.log(error);
      }
    },

    populateJSONData : function(data) {

      // set up different HTML
      if (data.changes) {
        const totalChanges = data.changes.length;

        let str = '<ul>';
 
        for (let i=0; i<totalChanges; i++) {
      
          str += '<li><a href="' + data.changes[i].id.toLowerCase() + '.html" ';
          str += 'title="' + data.changes[i].txt + '">';
          str += data.changes[i].id + '</a> ';
          str += '(' + data.changes[i].status + ')</li>';
 
        }

          str += '</ul>';

        // insert recent changes as li items into created ul
        wf.recentChanges.insertAdjacentHTML('beforeend', str);  

      }
    
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
  
  wf.init();