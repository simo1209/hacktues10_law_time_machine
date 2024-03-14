const fetch = require('node-fetch');
const parse = require('node-html-parser').default
const fs = require('fs')


if(!fs.existsSync('./laws_changes')) {
  fs.mkdirSync('./laws_changes');
}
for(let i = 0; i < 100; i++){

  fetch(`https://www.ciela.net/svobodna-zona-darjaven-vestnik/issue/${7000+i}/published`)
    .then((response) => response.text())
    .then((body) => {

      let root = parse(body);
      
      let lis = root.getElementsByTagName('li')
      //console.log(lis)
      let links = [];
      lis.forEach((li) => {
        if(li.text.indexOf('ЗАКОН ЗА ИЗМЕНЕНИЕ') != -1) {
          links.push(li.getElementsByTagName('a')[0].getAttribute('href'))
        }
      })
      if(links.length == 0 ) return;
      
      let bcText = root.getElementById('breadcrumbs');
      let year = bcText.childNodes[5].text.replace(/[\r\n]|\s+/g, '')
      year = year.substring(0, year.length-7);

      let issue = root.getElementsByTagName('h1')[0].text.split(',')[1];

      let meta = year + issue;
      
      links.forEach((link, idx) =>
        fetch('https://www.ciela.net/'+link)
          .then((response) => response.text())
          .then((body) => {
            const root = parse(body)
            let textEl = root.getElementById('LatestEditionRepealed');
            if(!textEl) {
              //console.log(root)
            } else {
            let finalText = root.getElementById('LatestEditionRepealed').text
              fs.writeFile('./laws_changes/'+i+'.'+idx+'.txt', meta +'\n' + finalText, (err) => {
                if (err) throw err;
              });
            }
          })
      )   
    })
}
