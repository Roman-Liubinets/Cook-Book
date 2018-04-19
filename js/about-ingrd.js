var fs = require('fs');

function IngrdInfo() {

}

IngrdInfo.prototype.readInfo = function () {
    return fs.readFileSync('./text/about-ingrd.txt');
    // зчитує щось з файлу
};
IngrdInfo.prototype.writeInfo = function (data) {
    return fs.writeFile('./text/about-ingrd.txt', data, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    }); // запис у файл, повністю перезаписує файл
};

global.IngrdInfo = IngrdInfo;
