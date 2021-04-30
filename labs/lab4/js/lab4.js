const wf = {

  // reference to container for buttons
  buttonArea : document.getElementById('actionForm'),

  // reference to container for rows
  table : document.querySelector('#projectsTbl tbody'),

  // reference to main element  
  contentArea : document.querySelector('#content'),
  
  // reference to data table of work items
  dataTable : document.querySelector('#projectsTbl'),

  // reference to tbody within data table
  dataRowHolder : document.querySelector('#projectsTbl tbody'),

  init : function() {

    // assign button event handlers
    this.buttonArea.addEventListener('click', this.setDisplay, false);

    // assign data row event handlers
    this.table.addEventListener('mouseover', this.rowHighlight, false);
    this.table.addEventListener('mouseout', this.rowHighlight, false);

  },

  findTarget : function(evt, targetNode, container) {
 
    // start with the innermost element node
    let currentNode = evt.target;
 
    // move up through the element nodes, until we reach the containing one
    while (currentNode && currentNode !== container) {  
            
      // return a reference to the first node we match
      if (currentNode.nodeName.toLowerCase() === targetNode) { 
        return currentNode;
      }
            
      // no match yet; move up to the parent
      else { 
        currentNode = currentNode.parentNode; 
      }
          
    }
          
    // if we did not find a matching element node, return false
    return false;
  
  },
  
  setDisplay : function(evt) {
  
    const button = wf.findTarget(evt, 'input', this);

    if (!button){
      return;
    }

    // use button value to determine what to do
    switch(button.value) {
    
      case 'Hide Low Priority': 
        
        wf.contentArea.className = 'hidePriority';
        button.value = 'Show Low Priority';
        break;
        
      case 'Show Low Priority': 
      
        wf.contentArea.className = '';
        button.value = 'Hide Low Priority';
        break;
        
      case 'Highlight Current Row': 
        
        wf.dataRowHolder.className = 'allowHighlight';
        button.value = 'Remove Row Highlight';
        break;
      
      case 'Remove Row Highlight': 
        
        wf.dataRowHolder.className = '';
        button.value = 'Highlight Current Row';
        break;
      
      case 'Hide Type Column': 
        
        wf.dataTable.className = 'hideColumn';
        button.value = 'Show Type Column';
        break;
        
      case 'Show Type Column':
  
        wf.dataTable.className = '';
        button.value = 'Hide Type Column';
        break;    
    }  
  
  },
  
  rowHighlight : function(evt) {
  
    const row = wf.findTarget(evt, 'tr', this);

    if (!row) {
      return;
    }

    row.id = (row.id) ? '' : 'currentRow';
  
  }

};

wf.init();