const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { readdir, readFile } = require('node:fs/promises')

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
app.use('/file',express.static(__dirname+'/node_modules/d3/dist/'));

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

let papers = {};
/*
fs.readdir(, (err, data)=>{
  console.log('dir', err, data);
  for (const file of data) {
    if (file.endsWith('json'){
      fs.readFile(`./public/laws_json/${file}`, (err, data))
    }
  }
})
*/
(async function(){
  try {
    const files = await readdir('./public/laws_json/');
    for (const file of files){
      if (file.endsWith('json')) {
        const contents = await readFile(`./public/laws_json/${file}`, { encoding: 'utf8' });
        let paper_name = file.replace('.json', '');
        try{

          papers[paper_name] = JSON.parse(contents);

        }catch (e) {
          console.error('not a json', file);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } 

  console.log(Object.keys(papers))
})();

app.post('/get_paper', (req, res) => {
  
  res.json(papers[req.body.name]);
  
});

app.get('/papers', (req, res) => {

  res.json(Object.keys(papers).map(function (title, id){
    return {id, title};
  }));

})

app.listen(port);
console.log('Server started at http://localhost:' + port);
