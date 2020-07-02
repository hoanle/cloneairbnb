# CloneAirBnb

To clone AirBnb
  - User can register account, become host or normal user
  - User can see experience (tour)

# Api notes:
  - Headers: "Authorization" : "Bearer ${token}"
  - 
# User
- #### Create user
  - **params** : email, name, password, introduction (opt), country (opt) 
  - **return success** : 
    >  { "status": "success", "data": { "user": { "verified": false, "role": "user", "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan", "email": "lehoan1@gmail.com" }, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWZkOGY2ZGNkYTU2ZjQyZTBlY2ZlZTkiLCJpYXQiOjE1OTM2NzY1NjcsImV4cCI6MTU5NDg4NjE2N30.hpoMlzJzqbFrQRDB7rz7oX6aNd-2a6O3pI0KYBjyjHk" } }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Param is missing" }  
