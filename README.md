WildDex


How To Deploy

1. Clone the repo and open the project

2. Install the dependecies needed with npm install in both server folder and client folder

3. In server folder: gcloud app deploy --version 1

4. In client folder: npm run build, then gcloud app deploy --version 1

API Documentation

Register a user:
POST /api/auth/register
Data format: { "email": "user@example.com", "password": "secure123" }

Login:
POST /api/auth/login
Data format: { "email": "user@example.com", "password": "secure123" }

Check for auth cookie:
GET /api/auth/check

Logout:
POST /api/auth/logout

Upload Image (Requires Auth):
POST /api/upload/
Data format: Form data with image file (png or jpg) and optionally latitude and longitude (floats)

Get User's Images (Requires Auth):
GET /api/upload/images

