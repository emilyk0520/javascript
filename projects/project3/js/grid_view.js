'use strict';

const grid = {

    // reference to the data table holding all rows/cells
    table : document.getElementById('data'),

    // reference to the div holding entire help box
    helpWrapper : document.querySelector('#helpWrapper'),

    init: function() {

        // creates help box
        this.helpBoxArea.setUpHelpBox();

        // adds event listeners
        this.helpBoxArea.link.addEventListener('click', this.helpBoxArea.toggleHelpBoxDisplay, false);
        this.table.addEventListener('click', this.specialEffects, false);

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

    helpBoxArea : {

        // element nodes for the help box
        link : document.createElement('a'),
        helpBox : document.createElement('ul'),
        img : document.createElement('img'),
        li1 : document.createElement('li'),
        li2 : document.createElement('li'),
        li3 : document.createElement('li'),

        setUpHelpBox : function() {

            // assigning various attributes
            this.link.href = '#';
            this.link.id = 'helpIcon';
            this.link.setAttribute('aria-controls', 'helpBox');
            this.link.setAttribute('aria-expanded', 'false');
            this.img.src = 'i/help.png';
            this.img.alt = 'Help';
            this.img.width = '17';
            this.img.height = '17';
            this.helpBox.id = 'helpBox';
            this.helpBox.classList.add('remove');
    
            // assembling and appending help box
            this.li1.appendChild(document.createTextNode('To lock a cell (prevent edits) SHIFT + click on the cell; to unlock repeat this process.'));
            this.li2.appendChild(document.createTextNode('To highlight a cell ALT + click on the cell; to remove the highlight repeat the process.'));
            this.li3.appendChild(document.createTextNode("To clear a cell's value CTRL + click on the cell."));
            this.helpBox.appendChild(this.li1);
            this.helpBox.appendChild(this.li2);
            this.helpBox.appendChild(this.li3);
            this.link.appendChild(this.img);
            grid.helpWrapper.appendChild(this.link);
            grid.helpWrapper.appendChild(this.helpBox);

        },

        toggleHelpBoxDisplay : function(evt) {

            const path = grid.helpBoxArea;

            // prevent default so URL doesn't change
            evt.preventDefault();
    
            // toggles 'remove' class to toggle display
            const displayOff = path.helpBox.classList.toggle('remove');
    
            // sets 'aria-expanded' attribute based on if 'remove' class toggled on or off
            if (!displayOff) {
                path.helpBox.setAttribute('aria-expanded', 'true');
            }
            
            else {
                path.helpBox.setAttribute('aria-expanded', 'false');
            }
    
        },
    
    },

    specialEffects : function(evt) {

        const theCell = grid.findTarget(evt, 'input', this);

        if (!theCell) { return; }

        // if shift key is clicked 
        if (theCell && evt.shiftKey) {
            
            // toggle 'readonly' class to toggle display
            const locked = theCell.classList.toggle('readonly');

            // sets/removes 'readOnly' and 'title' based on if 'readonly' display toggled on or off 
            if (locked) {

                theCell.setAttribute('readOnly', 'true');
                theCell.setAttribute('title', 'The cell is locked and cannot be edited; SHIFT + click to unlock it');

            }
            
            else {

                theCell.removeAttribute('readOnly');
                theCell.removeAttribute('title');

            }
            
        }

        // if alt key is clicked
        if (theCell && evt.altKey) {

            theCell.classList.toggle('marked');

        }

        // if control key is clicked
        if (theCell && evt.ctrlKey) {

            theCell.value = '';

        }
    }

};

grid.init();