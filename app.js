const express = require('express');
const app = express();
const uuidv1 = require('uuid/v1');
const { Firestore } = require('@google-cloud/firestore');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//private key of appengine service accout. this is required to run code from local machine.
const privKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsd68RfudK84fr\nH8Hwy3bm+vzy0Yau8MsT16v/Ap8IytoWrmi2sdJMMjw7EODrdtX1S+DLV98vAeak\nkVwtAfSR+eFICueck5F+CZ54Un3yg7aEMvnEXZoxRSIRF0aEPAl1nKLbanbKe9iz\n23q68nB+8+HoZl3WLQ3k+knFeMKqUDzp5E7xyJBq639/A8aScILKNh1yzNEmsJm9\ncEIOJYQUjkJPn8mrElqrT5d0GTUd09DdVA4josB4kzkmWrkOAo02LOcLnc3ff+gw\nPy1VrJCuGcI0yY9QbR77hRwWSZRD4Ky8ASvsnj2acm1QiuuoevwNXlVFjPv9jdwo\n6fVjPdDHAgMBAAECggEAJXesx0q/+ab1YK2aBvNUxfJB0IiXT1sNayaf/Xr2zMSw\n41uJcSMpchc5wYU1r8G10p/k2pgg6sfpcNgJY9e4Z5wXBn0j+v6ODYkObcpSBUT6\n+jZOz4ucK1b/AyKA1cprLatVMACthOip18z3GTUBHntiGQhgG17XVWbQbv+AntoK\nxT54y/rs1Orw992UttFwD5fwFJPfVYDfa8p+dLIsCuR19CbiASU0I9WiiPSabAuK\nv5q54Os13HmQ3wc7ciJIN4QLklJJ7CGNFZPSCJhuhc+PPXRZH1StJjf8nqD5RvHW\nMb1nb2/OJuHWg0S5SZaUoI3Y+Gl9wbDgnrutqM/WiQKBgQDqFGMyvCPjIi2TePDj\nCCXPIstWIM3YiiAxkwMxr0QxSBIDzJPjlbnaTiojOvaA8ZSjtPXM+6ap2rejEGnj\nLStng9aiMGvevCJHvYpjYF1ltKTfgpmXov+42bJ8AlVyGpokxq2/aE80uQ5dfJgw\nYwkIIp0QKc1qbK0lW+5TrJ627wKBgQC8nkNooyaQUfFuACX0tqylDZelccTJiAkR\nUOpLg8GZ6UW4dHL4YNMrZTuQR8mOyc/qZtn9KN06fBmvch3sKKRmQomQ+IrDaRqy\n4ow7QYxINzWzU1+moFT/4LrwS/PrW4nZKF8Llfht20lfE2y6voU7s9Vam860j+Lt\n2Lpa0NHDqQKBgQDnxbYPF0DFdiMAgWCqu3eMaFxDdIm9Xc7Qp0sjV/JChaToxBiu\n4KK8aGbKqWhIdmuByP0UsRvt1NW9jNP7j88JWP4da6pzSX7738315gW0XbBeaxcf\nkNJ5unxC06C9MV/tCBgjjOnYP1/c6zBZwMXBm1w/E9UECoVKl4McsLAaWwKBgBZm\nWS0JCyBiiuB8ZgWM2C310keUnkEsxZ7n1BtJt2k22c/RDIJQxWNG727wB5DMiMOW\nmVbGTpeOe2JplAIixXtbdYjg62HPjpsl6m9zFlzRKbB1O0vHiLCmmKzG6F3QDiva\n7oaqtckeHLWM0gHPdHUlozXSgRbSa6nBbkgwumiZAoGAXd4qD3/utdswoJP01cvv\njKNR03eGzLxwvexjRRkdDq32/zdSVYqR3DL5w8eTfJLQBBS2f90niGnMZ7nYKxju\nIRWMIzSDdHMHfv0N2xXmSyDcJEaKdUtSlTiCSdsVuZUg23T4AAESOjTJOrUdd4sd\n58r7Im8ORZyEE/HzE/oqs74=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n');

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

    //set the generated universal id as the id of the customer.
    customer.id = id;
    console.log('app.post received customer data=' + JSON.stringify(customer));

    db.collection('customers').doc(id).set(customer).then(() => {
        console.log("Document successfully written!");
        res.status(201).send({id : id}).end();
    }).catch(function (err) {
        console.log(err);
        res.status(500).end();              
    });
    
});

// to update customer data
app.put('/customers/:id', function (req, res) {
    let customer = req.body;
    var custId = req.params.id;
    console.log('deleting customer id '+ custId );
    let docRef = db.collection('customers').doc(custId);
    docRef.update(customer).then( () => {
        console.log('Document updated.');
        res.status(200).end();  
    }).catch(function (err) {
        // send 404 Not found error in this case becuase customer with this id is not found and so update fails
        console.log('Document updated failed. ');
        console.log(err);
        res.status(404).end();  
    });   
    
});


//to get all customers from DB  collection 
// also filter by gender is supported using query parameters
app.get('/customers', function (req, res) {
    console.log("Retrieving list of documents in collection");

    let gender=req.query.gender;
    let querySnapshot;

    if(gender){
        // return customers after filtering with gender in where clause
        querySnapshot=db.collection('customers').where('gender', '==' , gender).get();
    }else{
        // return all customer without any filter.
        querySnapshot=db.collection('customers').get();
    }
    querySnapshot.then(function (querySnapshot) {
        let docs = [];
        querySnapshot.forEach(function (doc) {
            //add each doc in the array
            docs.push(doc.data());
        });
        console.log('docs.length='+docs.length);
        res.status(200).json(docs).end();

    }).catch(function (err) {
        console.log(err);
        res.status(500).end();                
    });
});

// to get customer by id
app.get('/customers/:id', function (req, res) {
    var custId = req.params.id;
    db.collection('customers').doc(custId).get().then(doc => {
        if (doc.exists) {
            console.log("Document data:", JSON.stringify(doc.data()));
            res.status(200).json(doc.data()).end();
        } else {
            //return 404 Not found if no record is found with this id
            console.log("No such document!");
            res.status(404).end();
        }
    }).catch(function (err) {
        console.error(err);
        res.status(500).end();            
    });
});


//to delete customer  by id 
app.delete('/customers/:id',function(req,res){
var id = req.params.id;
console.log('id='+id);
let docRef=db.collection('customers').doc(id);
docRef.get().then( (doc)=> {
    if (!doc.exists) {
        console.log("customer not found");
        res.status(404).send("Customer not found.").end();
    }else{
        docRef.delete();
        console.log("customer deleted");
        res.status(204).send("deleted succesfully").end();
    }
}).catch(function (err) {
    console.error(err);
    res.status(500).end();            
});

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('App listening on port ' + PORT);
});


module.exports = app;

