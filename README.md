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