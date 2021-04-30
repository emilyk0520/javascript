'use strict';

const news = {
 
  // this is the area where the data will be displayed
  newsArea : document.getElementById('newsholder'),
 
  // this will reference the body tag; we will modify its id attribute
  theBody : document.querySelector('body'),
  
  // this will hold the JSON data
  newsData : null,
  
  // this will hold the Last Modified date retrieved this time
  currentDate : 0,
  
  // this will hold the Last Modified date retrieved last time
  lastDate : 0,
  
  // counter tracking the fade progress
  // also used to control display of background color for fade
  fadeState : 0,
 
  // interval timer for fade
  fadeTimer : null,
  
  // direction of fade
  fadeDirection : 'in',
 
  init : function() {
    
    // fetch JSON data needed for News Headlines area
    this.fetchJSON();
    
    // set the interval for data refresh
    news.newsRefresh = setInterval(news.pullNewData, 30000);
    
  },

  fetchJSON : async function() {

    try {
      const response = await fetch('news_data.json?', {method: 'GET', cache: 'no-cache' });
      news.newsData = await response.json();
      news.currentDate = Date.parse(response.headers.get('Last-Modified'));
      news.populateNews();
    }

    catch (error) {
      console.log(error);
    }
    
  },
  
  // pull the news data again
  pullNewData : function() {
    news.fetchJSON();
  },
  
  // output the news headings into the page
  populateNews : function() {
 
    this.newsArea.innerHTML = '';
      
    const newsHeader = document.createElement('h2');
    const headerTxt = document.createTextNode('News Headlines');
    this.newsArea.appendChild(newsHeader).appendChild(headerTxt);
    
    // store the total number of news items retrieved this time
    this.totalNewsItems = this.newsData.newsItems.length;
 
    for (let i=0; i<this.totalNewsItems; i++) {
      const newPara = document.createElement('p');
      const newLink = document.createElement('a');
      const lineBreak = document.createElement('br');
      const newsTitle = document.createTextNode(this.newsData.newsItems[i].heading);
      newLink.href = this.newsData.newsItems[i].url;
      newPara.appendChild(newLink).appendChild(newsTitle);
      this.newsArea.appendChild(newPara);
    }
 
    // check to see if Last Modified on current data is more recent than stored Last Modified from previously called data
    // if there is a difference, show the fade effect because the data has changed
    if (news.currentDate > news.lastDate) {
      this.fadeTimer = setInterval(news.fade,100);
    }

    // store the last modified date from fetch for comparison with new fetch
    news.lastDate = news.currentDate;
 
  },
  
  // cycle through background colors for the news area 
  // by assigning different id values to the body
  fade : function() {
        
    if (news.fadeState >= 0 && news.fadeState < 5 && news.fadeDirection === 'in') {
        
      news.theBody.id = 'darker' + news.fadeState;
      news.fadeState += 1;
    
    }
    
    else if (news.fadeState >= 0 && news.fadeState < 5 && news.fadeDirection === 'out') {
    
      news.theBody.id = 'darker' + news.fadeState;
      news.fadeState -= 1;     
      
    }
    
    else if (news.fadeState === 5) {
    
      news.fadeDirection = 'out';
      news.fadeState = 4;
      news.theBody.id = 'darker' + news.fadeState;
    
    }
    
    else {
    
      news.theBody.id = '';
      news.fadeDirection = 'in';
      news.fadeState = 0;
      clearInterval(news.fadeTimer);
    
    }
    
  },
 
}
 
news.init();