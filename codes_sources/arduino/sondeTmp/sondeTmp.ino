#include <OneWire.h>
#include <DallasTemperature.h>
                     
#define WATER_TEMP_PIN 8
OneWire oneWire(WATER_TEMP_PIN); 
DallasTemperature sensors(&oneWire);


void setup() 
{
  // On initialise la connexion série
  Serial.begin(9600);
  delay(2000);

  // On imprime un texte de bienvenu
  Serial.println("Salut je me réveille");
}

void loop() 
{
  // On récupère la température de la sonde
  sensors.requestTemperatures();
  double dTempWater = sensors.getTempCByIndex(0);

  // On imprime la température
  Serial.print("Température de l'eau: ");
  Serial.print(dTempWater);
  Serial.println("°C");

  // On attends 5 secondes
  delay(5000);
}
