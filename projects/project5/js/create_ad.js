'use strict';

const realTime = {

//holds container div
container : document.getElementById('container'),

//holds the form
form : document.getElementById('form'),

//holds lists containing form inputs/keywords
formList : document.getElementsByClassName('formList')[0],
keyList : document.getElementById('keyList'),

// live preview elements that are referenced later
link : document.createElement('a'),
descTxt : document.createElement('div'),
vurlTxt : document.createElement('div'),

// counter for how many keywords are added
keywordCounter : 0,

init : function() {

    // create preview area and add directions 
    this.createPreview();
    this.addDirections();

    // sets up event delegation for updating live preview and adding keywords
    this.form.addEventListener('keyup', this.matchInput, false);
    this.form.addEventListener('click', this.addKeyWord, false);
    

},

createPreview : function() {

    // create necessary elements
    const previewContainer = document.createElement('div');
    const heading = document.createElement('h3');
    const adSpace = document.createElement('div');
    const title = document.createElement('div');

    // setting attributes
    previewContainer.id = 'preview';
    adSpace.id = 'adspace';
    title.id = 'title';
    realTime.descTxt.id = 'desc_txt';
    realTime.vurlTxt.id = 'vurl_txt';

    // appending children in necessary order
    heading.appendChild(document.createTextNode('Real-time Ad Preview\u003a'));
    title.appendChild(realTime.link);
    adSpace.appendChild(title);
    adSpace.appendChild(realTime.descTxt);
    adSpace.appendChild(realTime.vurlTxt);
    previewContainer.appendChild(heading);
    previewContainer.appendChild(adSpace);
    realTime.container.appendChild(previewContainer);
},

addDirections : function() {

    // create necessary elements
    const msg1 = document.createElement('p');
    const msg2 = document.createElement('p');
    const addBtn = document.createElement('input');

    // setting attributes
    msg1.id = 'msg1';
    msg2.id = 'msg2';
    addBtn.id = 'addAnotherBtn';
    addBtn.type = 'button';
    addBtn.value = 'Add Another';

    // appending children in necessary order
    msg1.appendChild(document.createTextNode("'Title URL' and 'Visible URL' are added to the preview when valid; if invalid their field name is red and boldface."));
    msg2.appendChild(document.createTextNode('Up to 5 keywords / keyphrases can be entered.'));
    msg2.appendChild(addBtn);

    // insert into DOM
    realTime.formList.parentNode.insertBefore(msg1, realTime.formList);
    realTime.keyList.parentNode.insertBefore(msg2, realTime.keyList);

},

matchInput : function(evt) {

    const inputField = realTime.findTarget(evt, 'input', realTime.form);

      // if the click path did not involve a text input, look for textarea instead
      if (!inputField) {

        const textBox = realTime.findTarget(evt, 'textarea', realTime.form);

        // if no textarea, stop
        if (!textBox) { return; }

        // update preview with textbox text content if id matches
        if (textBox.id === 'desc') {
          realTime.descTxt.textContent = textBox.value;
        }

      } 
        
    // depending on id of the input box that is triggering event, different action taken
    switch(inputField.id) { 

        case 'txt':

            realTime.link.textContent = inputField.value;
            break;
            
        // if t_url or v_url, run validation
        case 't_url':

            realTime.validateURL('t_url', inputField); // pass id and input
            break;

        case 'v_url':

            realTime.validateURL('v_url', inputField); // pass id and input
            break;

    }
},

validateURL : function(id, field) {

  // regex pattern based on id of field 
  const pattern = (id === 't_url') ? /^(http|https):\/\/(([\w\-])+\.)+([\w]{2,6})$/ : /^(([\w\-])+\.)+([\w]{2,6})$/;

  if (field.value.length > 0) {
    const noError = pattern.test(field.value);

    // toggle error display based on if validation is passed
    noError ? realTime.toggleErrorBehavior(id, field, 'off') : realTime.toggleErrorBehavior(id, field, 'on');
  }

  // if field is empty, turn off error
  else {
    realTime.toggleErrorBehavior(id, field, 'off');
    
    // if working with the Title URL, remove href if empty
    if (id === 't_url'){
      realTime.link.removeAttribute('href');
    }
  }

},

toggleErrorBehavior : function(id, field, toggle) {

  switch (toggle) {

    case 'off':

      // based on id, show live preview
      id === 't_url' ? realTime.link.href = field.value : realTime.vurlTxt.textContent = field.value;

      // turn off errors
      field.parentNode.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      realTime.form.querySelector('input[type="submit"]').removeAttribute('disabled');

      break;

    case 'on':

      // based on id, stop preview behavior
      id === 't_url' ? realTime.link.removeAttribute('href') : realTime.vurlTxt.textContent = '';

      // turn on errors
      field.parentNode.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      realTime.form.querySelector('input[type="submit"]').setAttribute('disabled', 'disabled');
  
      break;

  }

},

addKeyWord : function(evt) {

  const addBtn = realTime.findTarget(evt, 'input', this);

  if (!addBtn) { return; }

  // target specific button based on id
  if (addBtn.id === 'addAnotherBtn') {

    const str = '<li><input type="text" size="30" name="keyphrase[]" /></li>';
    
    // add to the keywordCounter to keep track of how many keywords
    realTime.keywordCounter++;

    realTime.keyList.insertAdjacentHTML('beforeend', str);

    // once 4 have been added, remove button
    if (realTime.keywordCounter === 4) {
      addBtn.classList.add('rem');
    }

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
    
}
realTime.init();