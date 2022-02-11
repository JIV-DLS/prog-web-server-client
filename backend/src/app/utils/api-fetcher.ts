const AdmZip = require('adm-zip');
const request = require('request');
const x2j = require('xml-js');


export function getData(url) {
    return new Promise(function (resolve, reject) {
        request.get({url: url, encoding: null}, (err, res, body) => {
            if(err) reject(err);
            var zip = new AdmZip(body);
            var zipEntries = zip.getEntries();
            var rawXML = ""
            zipEntries.forEach((entry) => {
                if (entry.entryName.slice(-4) == ".xml") {
                    rawXML = zip.readFile(entry);
                }
            });
            res = x2j.xml2json(rawXML);
            resolve(res);
        });
    });
}




