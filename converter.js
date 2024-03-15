const { exec } = require('child_process');
exec('ls ./scrapper/laws_changes/', (err, stdout, stderr) => {
    if (err) {
      return;
    }
    stdout.split('\n').filter(n => n != '')
      .forEach((n) => {
          console.log(n)
          let extStart = n.lastIndexOf('.');
          let name = n.substring(0, extStart);
          console.log(name)
          exec(`PYTHONPATH=newspaper2tree python3 newspaper2tree/src/newspaper2tree.py scrapper/laws_changes/${n} > ./visualization/public/laws_json/${name + '.json'}`, 
            (err, stdout, stderr) => {
                console.log(stdout)
            })
      })
  });
