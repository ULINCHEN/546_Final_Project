# 546_Final_Project
This is Sit CS546 team project repo

{Project Name: Stray Animal Information Application}

Group members：

Youlin Chen

Chunzhi Li

Siyan Liu

Yetong Chen

Wei Guo


Tech Stack：
handlebar, Express, mongoDB, axios, expresshandlebar, openstreetmap, leaflet, leaflet geosearch, Multer, 

File Structure：

App.js - start project

Seed.js - fake data

helpers.js - public methods

Config - 
	- mongoCommection.js
	- mongoCollection.js
	- settings.json

Data - @Chunzhi Li
Index.js
animalPost.js
user.js
location.js
volunteers.js
comments.js

Routes - @yetong
index.js
animalPost - get, post, delete, patch
userCenter …
userLogin …
volunteer …get, post, delete, patch

Public - 
Main-style.css

Static
homepage.html

Views @ULIN
Error.handlebar
allPost (No auth req)
postDetail （need auth）
Login (No auth req)
Sign in (No auth req)
userCenter （need auth）
allVolunteer （No auth req）
volunteerDetail （need auth）

Map - @Wei Guo
display.js
mapSearch.js
singlelocation.js
locationData.js
test.handlebars(map)
postDetails.handlebarS(map)

publicMethods(function convertLocation())
