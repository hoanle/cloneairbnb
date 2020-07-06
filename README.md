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
  - **params** : email, name, password, introduction (opt), country (opt), images (file for avatar, use form_data)
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
- #### Create Experiences
  - **path**: /experiences (POST)
  - **params** : title, description, duration (int), price (int), languages (array, enum: ['vi', 'ko', 'en']), images (file, Optional), imageUrls (Optional, array of image url, in case images not working), tags (array of tag name, for example: "summer camp"), location
  - **return success** : 
    >  { "status": "OK", "data": { "nRating": 0, "imageUrls": [ "blablae", "blablae" ], "languages": [ "en", "ko" ], "tags": [ { "_id": "5f0161d44cb7617b14263c7b", "tag": "autumn camp", "__v": 0 }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp", "__v": 0 } ], "_id": "5f01816938d7d38d8737c30c", "title": "This is an experience 4", "location": "vn", "price": 0, "duration": 60, "description": "This is a description 4", "userId": "5efd8f6dcda56f42e0ecfee9", "images": [], "__v": 0 } }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Something broken" } 
- #### Get Experience List
  - **path**: /experiences (GET)
  - **params** : tags, seperated by ','. For example: /experiences?tags=summer,winter,spring
  - **return success** : 
    >  { "status": "OK", "data": [ { "nRating": 0, "imageUrls": [], "languages": [ "en", "ko" ], "tags": [ { "_id": "5f0161d44cb7617b14263c7b", "tag": "autumn camp" }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" } ], "_id": "5f017b01600f4c8c48c41322", "title": "This is an experience 4", "location": "vn", "price": 0, "duration": 60, "description": "This is a description 4", "userId": { "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan" }, "images": [], "__v": 0 }, { "nRating": 0, "imageUrls": [], "languages": [ "en", "ko" ], "tags": [ { "_id": "5f0161d44cb7617b14263c7b", "tag": "autumn camp" }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" } ], "_id": "5f017b54b298d58c56bd5ff3", "title": "This is an experience 4", "location": "vn", "price": 0, "duration": 60, "description": "This is a description 4", "userId": { "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan" }, "images": [], "__v": 0 }, { "nRating": 0, "imageUrls": [ "blablae", "blablae" ], "languages": [ "en", "ko" ], "tags": [ { "_id": "5f0161d44cb7617b14263c7b", "tag": "autumn camp" }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" } ], "_id": "5f01816938d7d38d8737c30c", "title": "This is an experience 4", "location": "vn", "price": 0, "duration": 60, "description": "This is a description 4", "userId": { "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan" }, "images": [], "__v": 0 } ] }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Something broken" } 
- #### Get Tag List
  - **path**: /tags (GET)
  - **params** : 
  - **return success** : 
    >  { "status": "success", "data": [ { "_id": "5f0160a0be426c7a1f4f25af", "tag": "winter camp" }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" }, { "_id": "5f0161452d8ca57ad0a4a8e3", "tag": "spring camp" }, { "_id": "5f0161d44cb7617b14263c7b", "tag": "autumn camp" }, { "_id": "5f019cdff0aebb943f606baf", "tag": "cooking" }, { "_id": "5f019cdff0aebb943f606bb0", "tag": "dinner" } ] }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Something broken" } 

- #### Search experience
  - **path**: /experiences/search (GET)
  - **params** :  tags, priceMin, priceMax, durationMin, durationMax, languages, averageRatingMin, groupSizeMax, page, perPage
  - **sample request**: https://localhost:5000/experiences/search?tags=summer camp&priceMin=500
  - **return success** : 
    >  { "status": "success", "data": { "experienceList": [ { "nRating": 0, "imageUrls": [], "languages": [], "tags": [ { "_id": "5f0160a0be426c7a1f4f25af", "tag": "winter camp" }, { "_id": "5f0161452d8ca57ad0a4a8e3", "tag": "spring camp" } ], "groupSize": 1, "_id": "5f0161bd4cb7617b14263c79", "title": "This is an experience 2", "location": "vn", "price": 200, "duration": 60, "description": "This is a description 2", "userId": "5efd8f6dcda56f42e0ecfee9", "images": [], "__v": 0 }, { "nRating": 0, "imageUrls": [], "languages": [], "tags": [ { "_id": "5f0160a0be426c7a1f4f25af", "tag": "winter camp" }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" } ], "groupSize": 1, "_id": "5f0161c84cb7617b14263c7a", "title": "This is an experience 1", "location": "vn", "price": 0, "duration": 60, "description": "This is a description 1", "userId": "5efd8f6dcda56f42e0ecfee9", "images": [], "__v": 0 }, { "nRating": 0, "imageUrls": [], "languages": [], "tags": [ { "_id": "5f0161d44cb7617b14263c7b", "tag": "autumn camp" }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" } ], "groupSize": 1, "_id": "5f0161d44cb7617b14263c7c", "title": "This is an experience 3", "location": "vn", "price": 1000, "duration": 60, "description": "This is a description 3", "userId": "5efd8f6dcda56f42e0ecfee9", "images": [], "__v": 0 }, { "nRating": 0, "imageUrls": [], "languages": [], "tags": [ { "_id": "5f0161d44cb7617b14263c7b", "tag": "autumn camp" }, { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" } ], "groupSize": 1, "_id": "5f016a6ea12ac27f6f18b829", "title": "This is an experience 3", "location": "vn", "price": 0, "duration": 60, "description": "This is a description 3", "userId": "5efd8f6dcda56f42e0ecfee9", "images": [], "__v": 0 } ], "pagination": { "pageNum": 1, "perPageNum": 4, "totalPages": 14 } } }
  - **Returns error**
    > { "code": 400, "status": "fail", "message": "Something broken" } 
- #### Get experience detail
  - **path**: /experiences/:experienceId (GET)
  - **params** :  
  - **sample request**: https://localhost:5000/experiences/5f0161bd4cb7617b14263c79
  - **return success** : 
    >  { "status": "success", "data": { "experience": { "nRating": 0, "imageUrls": [], "languages": [], "tags": [ { "_id": "5f0160a0be426c7a1f4f25af", "tag": "winter camp" }, { "_id": "5f0161452d8ca57ad0a4a8e3", "tag": "spring camp" } ], "groupSize": 1, "_id": "5f0161bd4cb7617b14263c79", "title": "This is an experience 2", "location": "vn", "price": 200, "duration": 60, "description": "This is a description 2", "userId": { "_id": "5efd8f6dcda56f42e0ecfee9", "name": "Le Hoan" }, "images": [], "__v": 0 } } }
  - **Returns error**
    > { "code": 404, "status": "fail", "message": "Can not find experience with id 5f0161bd4cb7617b14263e79" }
- #### Update experience detaul
  - **path**: /experiences/:experienceId (PUT)
  - **params** :  title, location, price, duration, description, tags, languages, groupSize,
  - **sample request**: https://localhost:5000/experiences/5f0161bd4cb7617b14263c79
  - **return success** : 
    >  { "status": "success", "data": { "nRating": 0, "imageUrls": [], "languages": [ "en", "ko" ], "tags": [ { "_id": "5f0160a0be426c7a1f4f25b0", "tag": "summer camp" }, { "_id": "5f0367670e156be61eaa792c", "tag": "hehe camp" } ], "groupSize": 20, "_id": "5f034e402e2279e0ba91fd7b", "title": "Update title", "location": "Ohio", "price": 77, "duration": 23, "averageRating": 4.996154072694116, "description": "Update description", "userId": "5eff6f6fa322b45ee6753af7", "images": [ { "_id": "5f034e402e2279e0ba91fd7c", "url": "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1652939-media_library/original/ad1fb68a-e94b-48be-a43b-152a7a440db9.jpeg", "public_id": null }, { "_id": "5f034e402e2279e0ba91fd7d", "url": "https://a0.muscache.com/im/pictures/9ce74372-c1cc-4cdb-8e90-2ae9bd78a8a8.jpg", "public_id": null }, { "_id": "5f034e402e2279e0ba91fd7e", "url": "https://a0.muscache.com/im/pictures/297a891f-8e59-4cdd-a3da-60cbfad2ac74.jpg", "public_id": null }, { "_id": "5f034e402e2279e0ba91fd7f", "url": "https://a0.muscache.com/im/pictures/83317b88-e55a-4d29-9212-ebbf1b5aa956.jpg", "public_id": null } ], "__v": 11, "createdAt": "2020-07-06T18:01:57.304Z", "updatedAt": "2020-07-06T18:06:13.823Z" } }
  - **Returns error**
    > { "code": 404, "status": "fail", "message": "Can not find experience with id 5f0161bd4cb7617b14263e79" }