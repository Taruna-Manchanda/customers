process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http'); 
let app = require('../app');
let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe('Customers', () => {
    beforeEach((done) => { 
        done();       
    });

    let id="";
    describe('/POST customer', () => {
        it('it should POST a customer', (done) => {
            let customer = {
                firstName: "Mark",
                lastName: "Tolkien",
                phone: "0736394343",
                gender: "male"
            };
            chai.request(app).post('/customers').send(customer).end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('id');
                id=res.body.id;
                res.body.should.not.have.property('errors');
                done();
            });
        });
    });

    describe('/GET customers/'+id, () => {
      it('it should GET customers by id', (done) => {
        chai.request(app).get('/customers/'+id).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('firstName').eql('Mark');
            res.body.should.have.property('lastName');
            res.body.should.have.property('gender');
            res.body.should.have.property('phone');
            //res.body.length.should.not.be.eql(0);
            done();
        });
      });
  });

  describe('/GET customers', () => {
    it('it should GET all the customers', (done) => {
        chai.request(app).get('/customers').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.not.be.eql(0);
            done();
        });
    });
});

describe('/PUT/:id customer', () => {
    it('it should UPDATE a customer given the id', (done) => {
        let customer = {
            firstName: "Mark",
            lastName: "Tolkien",
            phone: "0736394343",
            gender: "male",
            id : id
        };
        console.log('test id to delete='+id);
        chai.request(app).put('/customers/'+id).send(customer).end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});

});



