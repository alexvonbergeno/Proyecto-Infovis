Dataset
https://www.kaggle.com/datasets/gyaswanth297/world-population-insights-1970-2022

Se utiliza la enumeración CCA3 para los paises:
https://docs.rs/countires/latest/countires/enum.CCA3.html

Se cruzan los datos del dataset con un nuevo dataset para obtener las coordenadas de cada pais (LAT y LON):
https://www.kaggle.com/datasets/liewyousheng/geolocation?select=countries.csv

Para utilizar distintos archivos es necesario crear un servidor virtual para correr la aplicación. Si solo se abre el archivo HTML va a dar un error de CORS (cross origin request). En VSCode existe una extension que facilita servir la pagina localmente https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer