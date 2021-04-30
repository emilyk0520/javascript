'use strict';

const realTime = {

//holds container div
container : document.getElementById('container'),

//holds all the input fields/textarea
inputFields : document.querySelectorAll('.formList li input[type=text], .formList li textarea'),

/*ELEMENTS THAT ARE REFERENCED LATER*/
link : document.createElement('a'),

descTxt : document.createElement('div'),

vurlTxt : document.createElement('div'),

init : function() {

    /*CREATE PREVIEW AREA*/
    this.createPreview();

    /*ADDS EVENT LISTENERS*/
    for (const field of this.inputFields) {
        field.addEventListener('input', this.matchInput, false);
    }

},

createPreview : function() {

    /*MAKING NECESSARY ELEMENTS*/
    const previewContainer = document.createElement('div');

    const heading = document.createElement('h3');

    const adSpace = document.createElement('div');

    const title = document.createElement('div');

    /*SETTING IDS*/
    previewContainer.id = 'preview';
    
    adSpace.id = 'adspace';
    
    title.id = 'title';
   
    realTime.descTxt.id = 'desc_txt';
    
    realTime.vurlTxt.id = 'vurl_txt';

    /*APPENDING CHILDREN IN NECESSARY ORDER*/
    heading.appendChild(document.createTextNode('Real-time Ad Preview\u003a'));

    title.appendChild(realTime.link);

    adSpace.appendChild(title);

    adSpace.appendChild(realTime.descTxt);

    adSpace.appendChild(realTime.vurlTxt);

    previewContainer.appendChild(heading);

    previewContainer.appendChild(adSpace);

    realTime.container.appendChild(previewContainer);
},

matchInput : function() {
        
    switch(this.id) {//depending on id of the input box that is triggering event, different area of preview is changed

        case 'txt':

            realTime.link.textContent = this.value;
            break;
            
        case 't_url':

            realTime.link.href = this.value;
            break;

        case 'desc':

            realTime.descTxt.textContent = this.value;
            break;

        case 'v_url':

            realTime.vurlTxt.textContent = this.value;
            break;

    }
}
    
}

realTime.init();