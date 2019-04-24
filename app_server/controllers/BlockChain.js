const MerkleTree = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
var xlsx = require('excel4node');
var tx = require('./BlockChainController')
var fs = require('fs');
var Excel = require('exceljs');

module.exports.computeMerkleRoot=function(jsonData, proofDest) {
    var workbook = new xlsx.Workbook();
    var ws = workbook.addWorksheet('ProofData');
    const dataHash = jsonData.map(x => SHA256(JSON.stringify(x)))

    const tree = new MerkleTree(dataHash, SHA256)
    const root = tree.getRoot().toString('hex')

    for(var i = 0; i < jsonData.length; i++) {
        var item = jsonData[i]
        var itemStr = JSON.stringify(item)
        var leaf = SHA256(itemStr)

        // Store this following proof in DB as string
        var proof = JSON.stringify(tree.getProof(leaf))

        ws.cell(i + 1, 1).string(itemStr)
        ws.cell(i+ 1, 2).string(proof)
        // console.log(proof)
    }

    workbook.write(proofDest)

    return root
}

module.exports.publishOnBlockchain=function(root, size) {
    return tx.makeTransaction(root, true)
}

// -----------------------------------------------------------
/*
function verifyCertificates(root, dataFile) {
    var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const dataHash = data.map(x => SHA256(JSON.stringify(x)));
    const tree = new MerkleTree(dataHash, SHA256)
    // Verification
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(dataFile)
        .then(function() {
            var worksheet = workbook.getWorksheet(1);
            for(var i = 1; i <= 10; i++) {
                var row = worksheet.getRow(i);
                var cert = row.getCell(1).value;

                jsonProof = JSON.parse(row.getCell(2).value)
                for(var key in jsonProof) {
                    jsonProof[key].data = Buffer.from(jsonProof[key].data)
                }

                var leaf = SHA256(cert)
                console.log(tree.verify(jsonProof, leaf, root)) // true
            }
        });
}
*/

// -------------------------------------------------------------------
/*
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
console.log("Computing Merkle Root...")
const root = computeMerkleRoot(data, "Data.xlsx")
console.log(root)

console.log("Publishing root on Blockchain")
const txid = publishOnBlockchain(root, data.length)
*/
/*
console.log("Verifying Certificates")
const root = "e31800b98435c0067ef373fd6b40a07092d2f32373024a02d74441614e219d2d"
const dataFileName = "Data.xlsx"
verifyCertificates(root, dataFileName)*/