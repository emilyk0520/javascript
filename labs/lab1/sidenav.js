const sidenav = {

    //array containing nav button labes
    navLabels : ['home', 'about', 'design', 'usability', 'programming', 'clients', 'contact'],

    //function to create side nav
    generateNavigation : function() {

        //start making nav
        document.write('<nav>');
        document.write('<ul id="globalnav">');

        //generate nav buttons
        for (const label of this.navLabels){
            document.write(`<li><a href="${label}.html">${label}</a></li>`);
        }

        //closing off navigation
        document.write('</ul>');
        document.write('</nav>');

    }
}