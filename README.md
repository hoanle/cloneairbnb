# CloneAirBnb

To clone AirBnb
  - User can register account, become host or normal user
  - User can see experience (tour)

# Api notes:
  - Headers: "Authorization" : "Bearer ${token}"
  - 
# User
- #### Create user
  - **path**: users/register (POST)
  - **params** : email, name, password, introduction (opt), country (opt) 
  - **return success** : 
    >  { "status": "success", "data": { "user": { "verified": false, "role": "user", "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan", "email": "lehoan1@gmail.com" }, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWZkOGY2ZGNkYTU2ZjQyZTBlY2ZlZTkiLCJpYXQiOjE1OTM2NzY1NjcsImV4cCI6MTU5NDg4NjE2N30.hpoMlzJzqbFrQRDB7rz7oX6aNd-2a6O3pI0KYBjyjHk" } }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Param is missing" }  
- #### Login user
  - **path**: /auth/login (POST)
  - **params** : email, password
  - **return success** : 
    >  { "status": "success", "data": { "user": { "verified": false, "role": "user", "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan", "email": "lehoan1@gmail.com" }, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWZkOGY2ZGNkYTU2ZjQyZTBlY2ZlZTkiLCJpYXQiOjE1OTM2Nzk5OTIsImV4cCI6MTU5NDg4OTU5Mn0.8BDylFyzeEqcXCOyew1jK5PKXiEsl5fjOVKsHZnZb4c" } }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Password is incorrect" }  
- #### Logout user
  - **path**: /auth/logout (POST)
  - **params** : 
  - **return success** : 
    >  { "status": "success", "data": null }
  - **Returns error**
    > { "code": 401, "status": "fail", "message": "Invalid token" } 
- #### Login facebook
  - **path**: /auth/facebook/login (GET)
  - **params** : 
  - **return success** : 
    >  {"status":"success","data":{"user":{"verified":false,"role":"user","_id":"5efdf842d81331001780916b","name":"Hoan Le","email":"hoanle@gmail.com"},"token":".eyJfaWQiOiI1ZWZkZjg0MmQ4MTMzMTAwMTc4MDkxNmIiLCJpYXQiOjE1OTM3MDI1NjksImV4cCI6MTU5NDkxMjE2OX0.lj60MqeQaHPlvSuAVx9uSDcECBCoOd7Nvu-YGQV_3Qo"}}
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Something broken" } 
- #### get user list
  - **path**: /users (GET)
  - **params** : role (opt)
  - **return success** : 
    >  { "status": "success", "data": { "userList": [ { "verified": false, "role": "user", "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan", "email": "lehoan1@gmail.com" }, { "verified": false, "role": "user", "_id": "5efdf5691cb05749f99ae67a", "name": "Hoan Le", "email": "hoanle@xtaypro.com" } ] } }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Something broken" } 
- #### Login google
  - **path**: /auth/google/login (GET)
  - **params** : 
  - **return success** : 
    >  {"status":"success","data":{"user":{"verified":false,"role":"user","_id":"5efdf842d81331001780916b","name":"Hoan Le","email":"hoanle@gmail.com"},"token":".eyJfaWQiOiI1ZWZkZjg0MmQ4MTMzMTAwMTc4MDkxNmIiLCJpYXQiOjE1OTM3MDI1NjksImV4cCI6MTU5NDkxMjE2OX0.lj60MqeQaHPlvSuAVx9uSDcECBCoOd7Nvu-YGQV_3Qo"}}
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Something broken" } 