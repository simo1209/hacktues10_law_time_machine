const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
app.use('/file',express.static(__dirname+'/node_modules/d3/dist/'));

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

app.post('/get_paper', (req, res) => {
  
  let extStart = req.body.name.lastIndexOf('.');
  let name = req.body.name.substring(0, extStart) + '.json';
  fs.readFile('./public/'+name,((err, data) => {
    let file = data.toString()
    
    res.json(JSON.parse(file))
  }))

  console.log(name)
});

app.get('/papers', (req, res) => {
  
  exec('ls ../scrapper/laws_changes/', (err, stdout, stderr) => {
    if (err) {
      res.status(500);
      return;
    }
    res.json(stdout.split('\n').filter(n => n != '')
      .map(
        function (n, id) {
          return {
            id,
            title: n
          }
        }))
  });
})

app.listen(port);
console.log('Server started at http://localhost:' + port);