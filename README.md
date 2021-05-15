# Spotify Music Room

Music player/remote-controller app made with React and Django. User can host a room and link it to his spotify account(premium). Guests of the room can control
host's spotify music player, vote and suggest to play songs.


## 1. Getting Spotify credentials

### 1.1. Login/Sign Up to Spotify

Here is the [link](https://developer.spotify.com/my-applications/). After you login/sign up, create an app. Now you can get your Client ID & Client Secret. You will also have to configure Redirect URIs to http://127.0.0.1:8000/spotify/redirect.

![spotify sajt](https://user-images.githubusercontent.com/21371592/29612125-745cbbf2-8800-11e7-9238-474b01e0e9a8.jpg)

### 1.2. Credentials
Download this github repository. 

Paste the Client ID and Client Secret in credentials.py of spotify directory.


![app js fajl](https://github.com/satyap54/music-room/blob/main/Screenshot%20from%202021-05-15%2015-37-44.png)


## 2. Set Up and Running the app

### 2.1. Installing

Run: 
```
npm install
```

### 2.2. Python modules
```
  Python 3.x
  Django 3.2.3
  corsheaders
  django-channels
```

### 2.3. Starting the app
Finally, start react app with: (in frontend directory)
```
npm run dev
```

Start server with: 
```
python manage.py runserver
```
## TODO(s):
  1) Add Audio visualization (using p5 or canvas)
  2) Fix redirect fails 
