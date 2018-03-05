




let grpc = require('grpc');
let temp = require('temp').track();
let fs = require("fs-extra");
//let qrllib = require("qrllib");
let qrllib = require('./node_modules/qrllib/build/libjsqrl.js');
var assert = require('assert');
var expect = require('chai').expect

async function fetchRemoteProto(nodeAddr) {
    let protoDescriptor = grpc.load('/Users/abilican/Desktop/QRL/qrl/protos/qrlbase.proto');
    let client = new protoDescriptor.qrl.Base(nodeAddr, grpc.credentials.createInsecure());

    return new Promise( (resolve) => {
        client.getNodeInfo({}, function (err, nodeInfo) {
            if (err) {
                // TODO: Handle errors
                throw err;
            }

            // TODO: Check version, etc.

            // WORKAROUND: Copy timestamp  (I am investigating how to avoid this step)
            let requiredFile = '/tmp/google/protobuf/timestamp.proto';
            if (!fs.existsSync(requiredFile))
            {
                fs.ensureDirSync('/tmp/google/protobuf');
                fs.copySync('timestamp.proto', requiredFile, { overwrite : true });
            }

            // At the moment, we can only load from a file..
            temp.open('proto', (err, info) => {
                if (!err) {
                    fs.write(info.fd, nodeInfo.grpcProto);
                    fs.close(info.fd, function () {
                        let remoteProtoDescriptor = grpc.load(info.path);
                        resolve(remoteProtoDescriptor);
                    });
                }
            });
        });
    });
}


async function getQRLClient(nodeAddr) {
    return new Promise(resolve => {
        const remoteProto = fetchRemoteProto(nodeAddr);
        remoteProto.then(function (remoteProto) {
            let client = new remoteProto.qrl.PublicAPI(nodeAddr, grpc.credentials.createInsecure());
            resolve(client);
        });
    });
}


stringToBytes = (convertMe) => {
  // Convert String to Binary First
  const thisBinary = qrllib.hstr2bin(convertMe)
  // Now convert to Bytes
  return binaryToBytes(thisBinary)
}

// Convert Binary object to Bytes
binaryToBytes = (convertMe) => {
  // Convert Binary to Bytes
  const thisBytes = new Uint8Array(convertMe.size())
  for (let i = 0; i < convertMe.size(); i += 1) {
    thisBytes[i] = convertMe.get(i)
  }
  return thisBytes
}


// NOTE: Avoid creating the client many times..
// NOTE: gRPC uses HTTP2 so ideally there should be a single persistent connection
let qrlClient = getQRLClient('104.237.3.185:9009');


describe('GetAddressState', function() {
    describe('Wallet balance', function() {
        it('should connect to node', function() {

            var APIresponse = qrlClient.then( function (qrlClient) {
                console.log(qrlClient.ServiceClient);
                qrlClient.getAddressState({address : testaddress}, (err, response) => {
                    if (err){
                        console.log("Error: ", err.message);
                        return;
                    }
                });
            });


            var result = await APIrepsonse;
            expect(result).to.be.a('object');

            // qrlClient.then( function (qrlClient) {
            //     console.log(qrlClient.ServiceClient);
            //     // expect(response.state.address.length).to.equal(39);
            //     qrlClient.getAddressState({address : testaddress}, (err, response) => {
            //         if (err){
            //             console.log("Error: ", err.message);
            //             return;
            //         }
            //         // console.log(response.state.address.length)
            //
            //         expect(response).to.be.a('object');
            //         it('should expect response to be an object', function() {
            //             expect(response).to.be.a('object');
            //         });
            //
            //         it('should expect response to be an object', function() {
            //             expect(response.state.balance).to.be.a('string');
            //         });
            //         it('should expect address to be 39 bytes', function() {
            //             expect(response.state.address.length).to.equal(39);
            //         });
            //         // assert.equal([1,2,3].indexOf(4), -1);
            //     });
            // });
        });
    });
});
//
// describe('GetNodeState', function() {
//     describe('Node State', function() {
//         it('should return correct node state', function() {
//             qrlClient.then( function (qrlClient) {
//                 qrlClient.getNodeState({},(err, response) => {
//                     if (err){
//                         console.log("Error: ", err.message);
//                         return;
//                     }
//                     expect(response).to.be.a('object');
//                 });
//             });
//
//         });
//     });
// });


// describe('GetKnownPeers', function() {
//     describe('Node State', function() {
//         it('should return correct node state', function() {
//             qrlClient.then( function (qrlClient) {
//                 qrlClient.GetKnownPeers({},(err, response) => {
//                     if (err){
//                         console.log("Error: ", err.message);
//                         return;
//                     }
//
//                     console.log(response.type)
//                     assert.equal([1,2,3].indexOf(4), -1);
//                 });
//             });
//
//         });
//     });
// });




// rpc GetNodeState (GetNodeStateReq) returns (GetNodeStateResp);
// rpc GetKnownPeers (GetKnownPeersReq) returns (GetKnownPeersResp);
// rpc GetStats (GetStatsReq) returns (GetStatsResp);
// rpc GetAddressState (GetAddressStateReq) returns (GetAddressStateResp);
// rpc GetObject(GetObjectReq) returns (GetObjectResp);
// rpc GetLatestData(GetLatestDataReq) returns (GetLatestDataResp);
// rpc TransferCoins (TransferCoinsReq) returns (TransferCoinsResp);
// rpc PushTransaction (PushTransactionReq) returns (PushTransactionResp);
// rpc GetTokenTxn (TokenTxnReq) returns (TransferCoinsResp);
// rpc GetTransferTokenTxn (TransferTokenTxnReq) returns (TransferCoinsResp);
// rpc GetSlaveTxn (SlaveTxnReq) returns (TransferCoinsResp);
// rpc GetLatticePublicKeyTxn (LatticePublicKeyTxnReq) returns (TransferCoinsResp);
// // ------- Ephemeral API -------
// rpc PushEphemeralMessage (PushEphemeralMessageReq) returns (PushTransactionResp);
// rpc CollectEphemeralMessage (CollectEphemeralMessageReq) returns (CollectEphemeralMessageResp);
// // ------------------------------
// rpc GetTokenDetailedList (Empty) returns (TokenDetailedList);








qrlClient.then( function (qrlClient) {

    // This is just a short example
    mnemonic = 'mosaic jolt ashen karma circus taut align give infant argue judge thomas wholly sunny swarm bounty boyish much jet fellow giggle jolly dagger milky venom rhine artist dinghy fig youth khowar ego';
    genwallet = 'Qada446e9ac25b11299e0615de8bd1b7f5404ce0052fbb27db7ada425904a5aea6063deb3';
    mywallet = 'Q85fc7a44a202597e8c112a1b0d726f8c1524208896b4f6abafa87c9fc0b2503dfe303486';

    // true address
    testaddress = 'Q01050048a8b31d8dda8a25c5c0d02994fe87e54032ba67910657ade9114d0cdff2eeb5f6285446';
    testaddress = '01050048a8b31d8dda8a25c5c0d02994fe87e54032ba67910657ade9114d0cdff2eeb5f6285446';

    // qrllib.mnemonic2bin();

    // const thisBinary = qrllib.str2bin('382a52f8ba9c2d33ad807c2cdd');
    // console.log(binaryToBytes(thisBinary));
    testaddress = stringToBytes(testaddress);
    // testaddress = qrllib.hstr2bin(testaddress);
    // console.log(testaddress);




    // Get some genesis address state
    qrlClient.getAddressState({address : testaddress}, (err, response) => {
        if (err){
            console.log("Error: ", err.message);
            return;
        }

        // describe('Array', function() {
        //     describe('#indexOf()', function() {
        //         it('should return -1 when the value is not present', function() {
        //             assert.equal([1,2,3].indexOf(4), -1);
        //         });
        //     });
        // });

        // console.log("State", response.state);
        // console.log("Address: %s        Balance: %d", response.state.address, response.state.balance);
    });



    // qrlClient.getStats({include_timeseries : true}, (err, response) => {
    //     if (err){
    //         console.log("Error: ", err.message);
    //         return;
    //     }
    //     console.log("Stats: %s", response.coins_emitted);
    // });



    // qrlClient.getAddressState({address : genwallet}, (err, response) => {
    //     if (err){
    //         console.log("Error: ", err.message);
    //         return;
    //     }
    //     console.log("Address: %s        Balance: %d", response.state.address, response.state.balance);
    // });
    //
    // tx = {
    //     address_from: mywallet,
    //     address_to: mywallet,
    //     amount : 100,
    //     fee : 1,
    //     xmss_pk : Buffer.from([0x01]),
    //     xmss_ots_index: 1
    // };
    //
    // qrlClient.transferCoins(tx, (err, response) => {
    //     if (err){
    //         console.log("Error: ", err.message);
    //         return;
    //     }
    //
    //     //console.log(response);
    //
    //     qrlClient.pushTransaction( { transaction_signed : response.transaction_unsigned }, (err, response) => {
    //         if (err){
    //             console.log("Error: ", err.message);
    //             return;
    //         }
    //         console.log(response);
    //     });
    // });

});




















//
// describe('GetAddressState', function() {
//     qrlClient.then( function (qrlClient) {
//         testaddress = '01050048a8b31d8dda8a25c5c0d02994fe87e54032ba67910657ade9114d0cdff2eeb5f6285446';
//         testaddress = stringToBytes(testaddress);
//         // Get some genesis address state
//         qrlClient.getAddressState({address : testaddress}, (err, response) => {
//             if (err){
//                 console.log("Error: ", err.message);
//                 return;
//             }
//             describe('GetAddressState', function() {
//                 describe('#checking address format', function() {
//                     it('should expect address to be 39 bytes', function() {
//                         expect(response.state.address.length).to.equal(39);
//                     });
//                 });
//             });
//         });
//     });
// });

















// describe('GetNodeState', function() {
//     qrlClient.then( function (qrlClient) {
//         it('Response has info property', async () => {
//             qrlClient.getNodeState({}, (err, response) => {
//                 if (err){
//                     console.log("Error: ", err.message);
//                     return;
//                 }
//                 expect(response).to.have.property('info');
//             });
//         });
//     });
// });










// describe('GetNodeState', function() {
//     it('Response has info property', async () => {
//         qrlClient.then( function (qrlClient) {
//             qrlClient.getNodeState({}, (err, response) => {
//                 if (err){
//                     console.log("Error: ", err.message);
//                     return;
//                 }
//                 expect(response).to.have.property('info');
//             });
//         });
//     });
//
//     it('Response has state property', async () => {
//         qrlClient.then( function (qrlClient) {
//             qrlClient.getNodeState({}, (err, response) => {
//                 if (err){
//                     console.log("Error: ", err.message);
//                     return;
//                 }
//                 expect(response.info).to.have.property('state');
//             });
//         });
//     });
//
//     it('Response has version property', async () => {
//         qrlClient.then( function (qrlClient) {
//             qrlClient.getNodeState({}, (err, response) => {
//                 if (err){
//                     console.log("Error: ", err.message);
//                     return;
//                 }
//                 expect(response.info).to.have.property('version');
//             });
//         });
//     });
// });
