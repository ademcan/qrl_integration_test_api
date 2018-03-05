//
//
//
// let grpc = require('grpc');
// let temp = require('temp').track();
// let fs = require("fs-extra");
// //let qrllib = require("qrllib");
// let qrllib = require('./node_modules/qrllib/build/libjsqrl.js');
// var assert = require('assert');
//
// async function fetchRemoteProto(nodeAddr) {
//     let protoDescriptor = grpc.load('/Users/abilican/Desktop/QRL/qrl/protos/qrlbase.proto');
//     let client = new protoDescriptor.qrl.Base(nodeAddr, grpc.credentials.createInsecure());
//
//     return new Promise( (resolve) => {
//         client.getNodeInfo({}, function (err, nodeInfo) {
//             if (err) {
//                 // TODO: Handle errors
//                 throw err;
//             }
//
//             // TODO: Check version, etc.
//
//             // WORKAROUND: Copy timestamp  (I am investigating how to avoid this step)
//             let requiredFile = '/tmp/google/protobuf/timestamp.proto';
//             if (!fs.existsSync(requiredFile))
//             {
//                 fs.ensureDirSync('/tmp/google/protobuf');
//                 fs.copySync('timestamp.proto', requiredFile, { overwrite : true });
//             }
//
//             // At the moment, we can only load from a file..
//             temp.open('proto', (err, info) => {
//                 if (!err) {
//                     fs.write(info.fd, nodeInfo.grpcProto);
//                     fs.close(info.fd, function () {
//                         let remoteProtoDescriptor = grpc.load(info.path);
//                         resolve(remoteProtoDescriptor);
//                     });
//                 }
//             });
//         });
//     });
// }
//
//
// async function getQRLClient(nodeAddr) {
//     return new Promise(resolve => {
//         const remoteProto = fetchRemoteProto(nodeAddr);
//         remoteProto.then(function (remoteProto) {
//             let client = new remoteProto.qrl.PublicAPI(nodeAddr, grpc.credentials.createInsecure());
//             resolve(client);
//         });
//     });
// }
//
//
// stringToBytes = (convertMe) => {
//   // Convert String to Binary First
//   const thisBinary = qrllib.hstr2bin(convertMe)
//   // Now convert to Bytes
//   return binaryToBytes(thisBinary)
// }
//
// // Convert Binary object to Bytes
// binaryToBytes = (convertMe) => {
//   // Convert Binary to Bytes
//   const thisBytes = new Uint8Array(convertMe.size())
//   for (let i = 0; i < convertMe.size(); i += 1) {
//     thisBytes[i] = convertMe.get(i)
//   }
//   return thisBytes
// }
//
//
// // NOTE: Avoid creating the client many times..
// // NOTE: gRPC uses HTTP2 so ideally there should be a single persistent connection
// let qrlClient = getQRLClient('104.237.3.185:9009');
//
//
//
//
//
// describe('GetAddressState', function() {
//     describe('#indexOf()', function() {
//         it('should return wallets balance', function() {
//             qrlClient.then( function (qrlClient) {
//                 qrlClient.getAddressState({address : testaddress}, (err, response) => {
//                     if (err){
//                         console.log("Error: ", err.message);
//                         return;
//                     }
//                     assert.equal([1,2,3].indexOf(4), -1);
//                 });
//             });
//
//         });
//     });
// });
//
//
//
//
// qrlClient.then( function (qrlClient) {
//
//     // This is just a short example
//     mnemonic = 'mosaic jolt ashen karma circus taut align give infant argue judge thomas wholly sunny swarm bounty boyish much jet fellow giggle jolly dagger milky venom rhine artist dinghy fig youth khowar ego';
//     genwallet = 'Qada446e9ac25b11299e0615de8bd1b7f5404ce0052fbb27db7ada425904a5aea6063deb3';
//     mywallet = 'Q85fc7a44a202597e8c112a1b0d726f8c1524208896b4f6abafa87c9fc0b2503dfe303486';
//
//     // true address
//     testaddress = 'Q01050048a8b31d8dda8a25c5c0d02994fe87e54032ba67910657ade9114d0cdff2eeb5f6285446';
//     testaddress = '01050048a8b31d8dda8a25c5c0d02994fe87e54032ba67910657ade9114d0cdff2eeb5f6285446';
//
//     // qrllib.mnemonic2bin();
//
//     // const thisBinary = qrllib.str2bin('382a52f8ba9c2d33ad807c2cdd');
//     // console.log(binaryToBytes(thisBinary));
//     testaddress = stringToBytes(testaddress);
//     // testaddress = qrllib.hstr2bin(testaddress);
//     // console.log(testaddress);
//
//
//
//
//     // Get some genesis address state
//     qrlClient.getAddressState({address : testaddress}, (err, response) => {
//         if (err){
//             console.log("Error: ", err.message);
//             return;
//         }
//
//         // describe('Array', function() {
//         //     describe('#indexOf()', function() {
//         //         it('should return -1 when the value is not present', function() {
//         //             assert.equal([1,2,3].indexOf(4), -1);
//         //         });
//         //     });
//         // });
//
//         // console.log("State", response.state);
//         // console.log("Address: %s        Balance: %d", response.state.address, response.state.balance);
//     });
//
//
//
//     // qrlClient.getStats({include_timeseries : true}, (err, response) => {
//     //     if (err){
//     //         console.log("Error: ", err.message);
//     //         return;
//     //     }
//     //     console.log("Stats: %s", response.coins_emitted);
//     // });
//
//
//
//     // qrlClient.getAddressState({address : genwallet}, (err, response) => {
//     //     if (err){
//     //         console.log("Error: ", err.message);
//     //         return;
//     //     }
//     //     console.log("Address: %s        Balance: %d", response.state.address, response.state.balance);
//     // });
//     //
//     // tx = {
//     //     address_from: mywallet,
//     //     address_to: mywallet,
//     //     amount : 100,
//     //     fee : 1,
//     //     xmss_pk : Buffer.from([0x01]),
//     //     xmss_ots_index: 1
//     // };
//     //
//     // qrlClient.transferCoins(tx, (err, response) => {
//     //     if (err){
//     //         console.log("Error: ", err.message);
//     //         return;
//     //     }
//     //
//     //     //console.log(response);
//     //
//     //     qrlClient.pushTransaction( { transaction_signed : response.transaction_unsigned }, (err, response) => {
//     //         if (err){
//     //             console.log("Error: ", err.message);
//     //             return;
//     //         }
//     //         console.log(response);
//     //     });
//     // });
//
// });
