const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;
const path = require('path')

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const db = mysql.createConnection({
  host: "localhost",
  database: "instrumentshop",
  user: "root",
  password: ""
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});
app.use('/photo', express.static(path.join(__dirname, 'photo')));
app.use('/photo', express.static(path.join(__dirname, 'public, index.html')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/:nama', (req, res) => {
  const nama = req.params.nama.toLowerCase();

  db.query(
    'SELECT * FROM instrument WHERE LOWER(nama) = ?',
    [nama],
    (err, results) => {
      if (err) return res.status(500).send('Database error');
      if (results.length === 0) return res.status(404).send('Alat musik tidak ditemukan');

      const alat = results[0];
        console.log(results)
      const templatePath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(templatePath, 'utf8', (err, html) => {
        if (err) return res.status(500).send('Error loading template');

        const finalHtml = html
          .replace(/{{nama}}/g, alat.nama)
          .replace(/{{gambar}}/g, alat.gambar);

        res.send(finalHtml);
      });
    }
  );
});
app.get('/api/instrument', (req, res) => {
  db.query('SELECT * FROM instrument', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/api/instrument/:nama', (req, res) => {
  const nama = req.params.nama.toLowerCase();
  db.query('SELECT * FROM instrument WHERE LOWER(nama) = ?', [nama], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Alat musik tidak ditemukan');
    res.json(results);
  });
});