
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded());
const uuidv1 = require('uuid/v1');
const privKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsd68RfudK84fr\nH8Hwy3bm+vzy0Yau8MsT16v/Ap8IytoWrmi2sdJMMjw7EODrdtX1S+DLV98vAeak\nkVwtAfSR+eFICueck5F+CZ54Un3yg7aEMvnEXZoxRSIRF0aEPAl1nKLbanbKe9iz\n23q68nB+8+HoZl3WLQ3k+knFeMKqUDzp5E7xyJBq639/A8aScILKNh1yzNEmsJm9\ncEIOJYQUjkJPn8mrElqrT5d0GTUd09DdVA4josB4kzkmWrkOAo02LOcLnc3ff+gw\nPy1VrJCuGcI0yY9QbR77hRwWSZRD4Ky8ASvsnj2acm1QiuuoevwNXlVFjPv9jdwo\n6fVjPdDHAgMBAAECggEAJXesx0q/+ab1YK2aBvNUxfJB0IiXT1sNayaf/Xr2zMSw\n41uJcSMpchc5wYU1r8G10p/k2pgg6sfpcNgJY9e4Z5wXBn0j+v6ODYkObcpSBUT6\n+jZOz4ucK1b/AyKA1cprLatVMACthOip18z3GTUBHntiGQhgG17XVWbQbv+AntoK\nxT54y/rs1Orw992UttFwD5fwFJPfVYDfa8p+dLIsCuR19CbiASU0I9WiiPSabAuK\nv5q54Os13HmQ3wc7ciJIN4QLklJJ7CGNFZPSCJhuhc+PPXRZH1StJjf8nqD5RvHW\nMb1nb2/OJuHWg0S5SZaUoI3Y+Gl9wbDgnrutqM/WiQKBgQDqFGMyvCPjIi2TePDj\nCCXPIstWIM3YiiAxkwMxr0QxSBIDzJPjlbnaTiojOvaA8ZSjtPXM+6ap2rejEGnj\nLStng9aiMGvevCJHvYpjYF1ltKTfgpmXov+42bJ8AlVyGpokxq2/aE80uQ5dfJgw\nYwkIIp0QKc1qbK0lW+5TrJ627wKBgQC8nkNooyaQUfFuACX0tqylDZelccTJiAkR\nUOpLg8GZ6UW4dHL4YNMrZTuQR8mOyc/qZtn9KN06fBmvch3sKKRmQomQ+IrDaRqy\n4ow7QYxINzWzU1+moFT/4LrwS/PrW4nZKF8Llfht20lfE2y6voU7s9Vam860j+Lt\n2Lpa0NHDqQKBgQDnxbYPF0DFdiMAgWCqu3eMaFxDdIm9Xc7Qp0sjV/JChaToxBiu\n4KK8aGbKqWhIdmuByP0UsRvt1NW9jNP7j88JWP4da6pzSX7738315gW0XbBeaxcf\nkNJ5unxC06C9MV/tCBgjjOnYP1/c6zBZwMXBm1w/E9UECoVKl4McsLAaWwKBgBZm\nWS0JCyBiiuB8ZgWM2C310keUnkEsxZ7n1BtJt2k22c/RDIJQxWNG727wB5DMiMOW\nmVbGTpeOe2JplAIixXtbdYjg62HPjpsl6m9zFlzRKbB1O0vHiLCmmKzG6F3QDiva\n7oaqtckeHLWM0gHPdHUlozXSgRbSa6nBbkgwumiZAoGAXd4qD3/utdswoJP01cvv\njKNR03eGzLxwvexjRRkdDq32/zdSVYqR3DL5w8eTfJLQBBS2f90niGnMZ7nYKxju\nIRWMIzSDdHMHfv0N2xXmSyDcJEaKdUtSlTiCSdsVuZUg23T4AAESOjTJOrUdd4sd\n58r7Im8ORZyEE/HzE/oqs74=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n');
const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({
    projectId: 'taruna-manchanda',
    credentials: {
        private_key: privKey,
        client_email: 'taruna-manchanda@appspot.gserviceaccount.com'
    }
});
// to add customer data
app.post('/customers', function (req, res) {
    
    let customer = req.body;
    let id = uuidv1();
    customer.id = id;
    console.log('app.post received customer data=' + customer);
    db.collection('customers').doc(id).set(customer).then(() => {
        console.log("Document successfully written!");
        res.status(201).send(id).end();
    });
    
});
// to update customer data
app.put('/customers/:id', function (req, res) {
    let customer = req.body;
    var custId = req.params.id;

    let docRef = db.collection('customers').doc(custId);
    docRef.update(customer).then( () => {
        console.log('Document updated.');
        res.status(200).end();  
    }).catch(function () {
        console.log('Document updated failed.');
        res.status(404).end();  
    });
     
    
});


//to get all customers in collection and by gender 
app.get('/customers', function (req, res) {
    console.log("Retrieving list of documents in collection");
    let gender=req.query.gender;
    let querySnapshot;
    if(gender){
        querySnapshot=db.collection('customers').where('gender', '==' , gender).get();
    }else{
        querySnapshot=db.collection('customers').get();
    }
    querySnapshot.then(function (querySnapshot) {
        let docs = [];
        querySnapshot.forEach(function (doc) {
            docs.push(doc.data());
        });
        console.log(docs.length);
        console.log(docs);
        res.json(docs);
    });
});

// to get customer by id
app.get('/customers/:id', function (req, res) {
    var custId = req.params.id;
    db.collection('customers').doc(custId).get().then(doc => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            res.status(200).json(doc.data()).end();
        } else {
            console.log("No such document!");
            res.status(404).end();
        }
    });
});




var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at ", host, port)
})