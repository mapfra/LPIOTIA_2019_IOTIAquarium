# ARDUINO

  ## Materiel nécessaires
  
    - Arduino MEGA WIFI
    - Sonde PH
    - Matrice LED
    - Sonde Température
    - Capteur de niveau d'eau
    - Luxmètre
    - Pompe à eau
    - Moteur à clapet (nourriture)
    - Switch
    - Relais pont H
    - Raspberry Pi
    
  ## Bibliothèques nécessaire pour le code arduino
  
    Pour permettre le lancement du sketch arduino, il faut pour cela télécharger des bibliothèques qui se trouvent dans:
        Croquis -> Inclure une bibliothèque -> Gérer les bibliothèques
    Il faudra ensuite télécharger les bibliothèques suivantes :
      Ces 2 bibliothèques permettront de récupérer la température :
        - OneWire
        - DallasTemperature
      Ces bibliothèques permettent d'effectuer l'échange avec le broker :
        - ESP8266WiFi
        - MQTT
  
  ## Sources
  
    - OneWire : https://www.arduinolibraries.info/libraries/one-wire
    - DallasTemperature : https://www.arduinolibraries.info/libraries/dallas-temperature
    - ESP8266WIFI : https://arduino-esp8266.readthedocs.io/en/latest/esp8266wifi/readme.html
    - MQTT : https://www.arduinolibraries.info/libraries/mqtt
