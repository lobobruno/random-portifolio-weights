const fs = require('fs');

function randBetween(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomPortifolio(stockQtd, minPart) {
  let portifolio = [];
  for (let i = 0; i < stockQtd - 1; i++) {
    let total = portifolio.reduce((a, b) => a + b, 0);
    let upper = 100 - minPart * (stockQtd - i) - total;
    let rand = randBetween(minPart, upper);
    portifolio.push(rand);
  }
  portifolio.push(100 - portifolio.reduce((a, b) => a + b, 0));
  portifolio = shuffleArray(portifolio);
  return portifolio;
}
function clearFile(outputFile) {
  try {
    fs.unlinkSync(outputFile);
  } catch (error) {}
  fs.writeFileSync(outputFile, '');
}

function createCombination(qtdCombinacoe, stockQtd, minPart, outputFile) {
  let portifolio_csv = new Set();
  let lastQtd = 0;
  let repeat = 0;

  if (minPart * stockQtd < 100) {
    while (portifolio_csv.size < qtdCombinacoe && repeat < 10000) {
      let portifolio = getRandomPortifolio(stockQtd, minPart, outputFile);
      let sep = '\t';
      let line = portifolio.join(sep).replace(/\./g, ',');
      line = `"${stockQtd}_${minPart}"${sep}${line}`;
      portifolio_csv.add(line);
      if (lastQtd == portifolio_csv.size) {
        repeat++;
      } else {
        lastQtd = portifolio_csv.size;
      }
    }

    fs.appendFileSync(outputFile, Array.from(portifolio_csv).join('\n'));
    fs.appendFileSync(outputFile, '\n');
  }
  console.log(
    `Done... ${stockQtd} / ${minPart}`,
    outputFile,
    portifolio_csv.size,
    'lines',
  );
}
/*
let stockQtd = 19;
let minPart = 0;
let outputFile = `weights_${stockQtd}_${minPart}.csv`;
*/
let outputFile = 'weights_full.csv';
clearFile(outputFile);

for (let stockQtd = 2; stockQtd <= 19; stockQtd++) {
  for (let minPart = 0; minPart <= 10; minPart++) {
    //let outputFile = `weights_${stockQtd}_${minPart}.csv`;
    createCombination(1000, stockQtd, minPart, outputFile);
  }
}
