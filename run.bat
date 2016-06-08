cd %~dp0

@echo *** Start mongo db server ***
start cmd /k "C:\Users\Nofar Cohen Zedek\Desktop\Installs\mongodb-win32-x86_64-2.2.2\mongodb-win32-x86_64-2.2.2\bin\mongod.exe" --dbpath %a%\data\db

timeout 5

@echo *** Initialize data un mongo db ***
start cmd /k node initDB.js

@echo *** Start node server ***
start cmd /k node server.js

timeout 5
start chrome.exe "http://localhost:8080/screen=1"

@PAUSE