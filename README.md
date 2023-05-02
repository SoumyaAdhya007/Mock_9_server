# Social Media App

It is a backend for a Social Media app that allows users to post, like and comment on posts.

## Dependencies
```
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.1.0",
    "nodemon": "^2.0.22"
```

## Models 

- User Model 
```
  name: {type:String, required:true},
  email: {type:String, required:true},
  password: {type:String, required:true},
  dob: {type:Date, required:true},
  bio: {type:String, required:true},
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
```
- Post Model
```
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    image: String,
    createdAt: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: Date
    }]
```

# Routes


| METHOD | ENDPOINT | DESCRIPTION | STATUS CODE |
| --- | --- | --- | --- |
| POST | /api/register | This endpoint  allow users to register. Hash the password on store. **body**: `{name, email, password,dob,bio}`. Date Should be in this formet **dob**:`{2023-05-02T07:06:34.428Z}` | 201 |
| GET | /api/users | This endpoint  return a list of all registered users. | 200 |
| POST | /api/users/:id/friends | This endpoint  allow the user to send a friend request to another user identified by its ID.**body**: `{userId}` | 201 |
| PATCH | /api/users/:id/friends/:friendId | This endpoint  allow users to accept or reject friend requests sent to them by another user identified by its ID.**body**: `{status:true or false}` | 204 |
| GET | /api/posts | This endpoint  return a list of all posts. | 200 |
| POST | /api/posts | This endpoint  allow the user to create a new post.**body**: `{user,text,image}` | 201 |
| PATCH | /api/posts/:id | This endpoint  allow users to update the text or image of a specific post identified by its ID. **body**: `{text or image}`| 204 |
| DELETE | /api/posts/:id | This endpoint  allow users to delete a specific post identified by its ID. | 202 |
| GET | /api/posts/:id | This endpoint return the details of a specific post identified by its ID. | 200 |

---


