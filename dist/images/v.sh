FOR /F %%G IN ('dir /B *.gif') DO echo ^<img src="%%G"^ width="40"^>^ %%G^<br^> >> gifs.html

