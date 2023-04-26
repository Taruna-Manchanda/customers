## Customers Service 



It gives an interface to manage customers data in Firestore thru API's 

It is hosted at - https://taruna-manchanda.appspot.com/

It offers below features :
 
:arrow_right: Retrieve an existing customer using customer id 

 GET https://taruna-manchanda.appspot.com/customers/c5843090-d3ef-11e9-b548-f15247596573/
 
       sample response payload
       {
        "email": "hossa.p@gmail.com",
        "id": "c5843090-d3ef-11e9-b548-f15247596573",
        "mobile": 7674893356,
        "lastName": "Rustam Ji",
        "gender": "female",
        "firstName": "Posir",
        "dob": "01-01-1976"
    }

:arrow_right: Retrieve all customers

GET https://taruna-manchanda.appspot.com/customers/

    sample response payload
  
    {
        "dob": "01-02-1176",
        "email": "martha.p@gmail.com",
        "id": "8af5c3b0-d482-11e9-a048-af3bdb3994a5",
        "mobile": 76744533567,
        "lastName": "Payne",
        "gender": "female",
        "firstName": "Martha"
    },
    {
        "email": "hossa.p@gmail.com",
        "id": "c5843090-d3ef-11e9-b548-f15247596573",
        "mobile": 7674893356,
        "lastName": "Rustam Ji",
        "gender": "female",
        "firstName": "Posir",
        "dob": "01-01-1976"
    }


:arrow_right: Retrieve customers by gender

GET https://taruna-manchanda.appspot.com/customers?gender=female

    sample response payload
    
    {
        "dob": "01-02-1176",
        "email": "martha.p@gmail.com",
        "id": "8af5c3b0-d482-11e9-a048-af3bdb3994a5",
        "mobile": 76744533567,
        "lastName": "Payne",
        "gender": "female",
        "firstName": "Martha"
    },
    {
        "email": "hossa.p@gmail.com",
        "id": "c5843090-d3ef-11e9-b548-f15247596573",
        "mobile": 7674893356,
        "lastName": "Rustam Ji",
        "gender": "female",
        "firstName": "Posir",
        "dob": "01-01-1976"
    }


:arrow_right: Create a new customer

POST https://taruna-manchanda.appspot.com/customers/

    sample request payload 
      {
        "email": "martha.p@gmail.com",
        "mobile": 76744533567,
        "lastName": "Payne",
        "gender": "female",
        "firstName": "Martha",
        "dob": "01-02-1176"
    }
    
      

:arrow_right: Update an existing customer using customer id

PUT https://taruna-manchanda.appspot.com/customers/c5843090-d3ef-11e9-b548-f15247596573

    sample request payload
      { "lastName": "Pasir",
        "mobile": 7674893356
    }

====
Test comment