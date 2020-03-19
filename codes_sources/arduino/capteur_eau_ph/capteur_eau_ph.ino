
#define SensorPin A0            //pH meter Analog output to Arduino Analog Input 0
#define Offset 0.00            //deviation compensate
#define LED 13
#define samplingInterval 20
#define printInterval 800
#define ArrayLenth  40    //times of collection
int pHArray[ArrayLenth];   //Store the average value of the sensor feedback
int pHArrayIndex=0;

////sonde Temp
//#include <OneWire.h>
//#include <DallasTemperature.h>
//#include <DS1881.h>
//                     
//#define WATER_TEMP_PIN A1 
//OneWire oneWire(WATER_TEMP_PIN); 
//DallasTemperature sensors(&oneWire);

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

  //sonde ph
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
  Serial.println("pH meter experiment!");    //Test the serial monitor

  //niveau d'eau
  Serial.begin(9600);  // Communication started with 9600 baud
  pinMode(10,OUTPUT);

//  //sonde Tmp
//  Serial.begin(9600);
  
}
void loop(void)
{
  
  //capteur niveau d'eau
  int sensor=analogRead(A1); // Incoming analog signal read and appointed sensor
  
  static unsigned long samplingTime = millis();
  static unsigned long printTime = millis();
  static float pHValue,voltage;
  if(millis()-samplingTime > samplingInterval)
  {
    
      pHArray[pHArrayIndex++]=analogRead(SensorPin);
      if(pHArrayIndex==ArrayLenth)pHArrayIndex=0;
      voltage = avergearray(pHArray, ArrayLenth)*5.0/1024;
      pHValue = 3.5*voltage+Offset;
      samplingTime=millis();
  }
  if(millis() - printTime > printInterval)   //Every 800 milliseconds, print a numerical, convert the state of the LED indicator
  {
        Serial.print("Voltage:");
        Serial.print(voltage,2);
        Serial.print("    pH value: ");
        Serial.println(pHValue,2);
        Serial.println(sensor);   //valeur capteur niveau de l'eau
        digitalWrite(LED,digitalRead(LED)^1);
        printTime=millis();
//         // On récupère la température de la sonde
//        sensors.requestTemperatures();
//        double dTempWater = sensors.getTempCByIndex(0);
//      
//        // On imprime la température
//        Serial.print("Température de l'eau: ");
//        Serial.print(dTempWater);
//        Serial.println("°C");
        
        //ouverture du volet
        //sens1
        analogWrite(ENA,0); //vitesse
        digitalWrite(IN1,LOW); //sens du moteur (0.0 arret), (0.1 gauche droite), (1.0 droite gauche)
        digitalWrite(IN2,HIGH);
        analogWrite(ENA,255);
        delay(60);
        analogWrite(ENA,35);
        delay(10000);
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
