var AdmZip = require('adm-zip');
var request = require('request');
var x2js = require('xml2json')
var baseUrl = "https://donnees.roulez-eco.fr/opendata/"
export var instantane = "instantane"
export var jour = "jour"
export var annee = "annee"

export function getData(url: string) {
    return new Promise(function (resolve, reject) {
        console.log("Requesting ",baseUrl + url)
        request.get({url: baseUrl + url, encoding: null}, (err: any, res: unknown, body: any) => {
            if(err) reject(err);
            try {
                var zip = new AdmZip(body);
                var zipEntries = zip.getEntries();
                var rawXML = ""
                zipEntries.forEach((entry: { entryName: string; }) => {
                    if (entry.entryName.slice(-4) == ".xml") {
                        rawXML = zip.readFile(entry);
                    }
                });
                res = x2js.toJson(rawXML.toString())
                resolve(res);
            }catch (e) {
                reject(err);
            }

        });
    });
}




