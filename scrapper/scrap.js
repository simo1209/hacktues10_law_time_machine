const fetch = require('node-fetch');
const parse = require('node-html-parser').default
const fs = require('fs');
const { time } = require('console');

let ids;

const firstId = 100;

try{
  ids = Number(process.argv[2]);
} catch(e) {
  throw new Error('invalid argument, should be a number');
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let romanMap = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4,
  'V': 5,
  'VI': 6,
  'VII': 7,
  'VIII': 8,
  'IX': 9,
  'X': 10,
  'XI': 11,
  'XII': 12
}

if(!fs.existsSync('./laws_changes')) {
  fs.mkdirSync('./laws_changes');
}
(async() => {
for(let i = 0; i < ids; i++){
  await delay(300)
  fetch(`https://www.ciela.net/svobodna-zona-darjaven-vestnik/issue/${firstId+i}/published`)
    .then((response) => response.text())
    .then((body) => {

      let root = parse(body);
      
      let lis = root.getElementsByTagName('li')

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
      let [count, date_month] = issue.split('от');
      
      //console.log(count, date_month);
      let [date, month] = date_month.split('.')

      let timestamp = new Date(`${year}-${romanMap[month]}-${date}`).toISOString().split('T')[0]

      links.forEach((link, idx) => {
          let fullUrl = 'https://www.ciela.net/'+link;
          fetch(fullUrl)
            .then((response) => response.text())
            .then((body) => {
              const root = parse(body)
              let textEl = root.getElementById('LatestEditionRepealed');
              if(textEl) {
                let header = fullUrl + '\n' + count;
                let finalText = root.getElementById('LatestEditionRepealed').text
                fs.writeFile(`./laws_changes/${timestamp}.${idx}.txt`, header +'\n' + finalText, (err) => {
                  if (err) throw err;
                });
              }
            })
        }
      )   
    })
    .catch((e) => {
      console.log(e.errno)
    })
}
})()