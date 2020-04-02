#include <MQTT.h>


#define PHSensorPin A0 
#define WaterLevelSensorPin A2   
#define LightPin A4        
#define Offset 0.00           
#define LED 13
#define samplingInterval 20
#define MotorDuration 10000
#define printInterval 30000 //Intervalle entre chaque envoi
#define ArrayLenth  40    
int pHArray[ArrayLenth];   
int pHArrayIndex=0;

//sonde Temp
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DS1881.h>
                     
#define WATER_TEMP_PIN A1 
OneWire oneWire(WATER_TEMP_PIN); 
DallasTemperature sensors(&oneWire);

//moteur
int GND=5; //Connecté à ardouino pin GND
int IN1=2; //Connecté à ardouino pin 2
int IN2=3; //Connecté à ardouino pin 3
int ENA=4; //Connecté à ardouino pin 3 

void setup(void)
{
  pinMode(ENA,OUTPUT); 
  pinMode(IN1,OUTPUT);
  pinMode(IN2,OUTPUT);

  //moteur à l'arret
  digitalWrite(IN1,LOW);
  digitalWrite(IN2,LOW);
  analogWrite(ENA,0);
   MQTT myMqtt()
  //sonde ph
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
  Serial.println("pH meter experiment!");    

  //niveau d'eau
  Serial.begin(9600);  // Communication started with 9600 baud
  pinMode(10,OUTPUT);

//  //sonde Tmp
//  Serial.begin(9600);
  
}
void loop(void)
{
  
  //capteur niveau d'eau
  int WaterLevelsensor=analogRead(WaterLevelSensorPin); 
  int LightSensor = analogRead(LightPin); 
  static unsigned long samplingTime = millis();
  static unsigned long printTime = millis();
  static float pHValue,voltage;
  if(millis()-samplingTime > samplingInterval)
  {
    
      pHArray[pHArrayIndex++]=analogRead(PHSensorPin);
      if(pHArrayIndex==ArrayLenth)pHArrayIndex=0;
      voltage = avergearray(pHArray, ArrayLenth)*5.0/1024;
      pHValue = 3.5*voltage+Offset;
      samplingTime=millis();
  }
  if(millis() - printTime > printInterval)   //Envoi des données en fonction de l'interval donnée plus haut
  {
        Serial.print(voltage,2);
        Serial.println(pHValue,2);
        Serial.println(sensor);   //valeur capteur niveau de l'eau
        digitalWrite(LED,digitalRead(LED)^1);
        printTime=millis();
         // On récupère la température de la sonde
        sensors.requestTemperatures();
        double dTempWater = sensors.getTempCByIndex(0);

        // On imprime la température
        Serial.print("Température de l'eau: ");
        Serial.print(dTempWater);
        Serial.println("°C");
        //Envoi des informations dans l'ordre : PH - Niveau d'eau - Température de l'eau
        char* stringSend = "PHSensor="+pHValue + ";WaterLevelSensor=" + WaterLevelsensor + ";TemperatureSensor=" + dTempWater + ";LightSensor=" + LightSensor;
        //ouverture du volet
        //sens1
        analogWrite(ENA,0); //vitesse
        digitalWrite(IN1,LOW); //sens du moteur (0.0 arret), (0.1 gauche droite), (1.0 droite gauche)
        digitalWrite(IN2,HIGH);
        analogWrite(ENA,255);
        delay(60);
        analogWrite(ENA,35);
        //Temps de fonctionnement du moteur
        delay(MotorDuration);
        //fermeture du volet
        //arret du moteur avant inversement des sens
        analogWrite(ENA,0);
        digitalWrite(IN1,HIGH);
        digitalWrite(IN2,LOW);
        analogWrite(ENA,255);
        delay(60);
        analogWrite(ENA,35);
        
  }
}
double avergearray(int* arr, int number){
  int i;
  int max,min;
  double avg;
  long amount=0;
  if(number<=0){
    Serial.println("Error number for the array to avraging!/n");
    return 0;
  }
  if(number<5){   //less than 5, calculated directly statistics
    for(i=0;i<number;i++){
      amount+=arr[i];
    }
    avg = amount/number;
    return avg;
  }else{
    if(arr[0]<arr[1]){
      min = arr[0];max=arr[1];
    }
    else{
      min=arr[1];max=arr[0];
    }
    for(i=2;i<number;i++){
      if(arr[i]<min){
        amount+=min;        //arr<min
        min=arr[i];
      }else {
        if(arr[i]>max){
          amount+=max;    //arr>max
          max=arr[i];
        }else{
          amount+=arr[i]; //min<=arr<=max
        }
      }//if
    }//for
    avg = (double)amount/(number-2);
  }//if
  return avg;
}
