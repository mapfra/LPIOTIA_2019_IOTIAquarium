#include <MQTT.h>
#include <ESP8266WiFi.h>

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

#define DIN_pin D5 
#define CS_pin D3 
#define CLK_pin D1 

int A[8] = {0x18, 0x24, 0x42, 0x42, 0x7E, 0x42, 0x42, 0x42} ;

//MQTT
#define CLIENT_ID "Arduino_Client"
//ip
#define IP_ADRR ""
// create MQTT object
MQTT myMqtt(CLIENT_ID, IP_ADRR, 1883);

//WIFI
char* ssid     = "";
char* password = "";

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


//Seuil des capteurs
int SeuilpHValue =5;
int SeuilWaterLevelsensor = 50;
int SeuildTempWater = 35;
int SeuilLightSensor = 50;
void setup(void)
{
  
  pinMode(ENA,OUTPUT); 
  pinMode(IN1,OUTPUT);
  pinMode(IN2,OUTPUT);
  //MQTT Setup
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Connecting to MQTT server");  

  // setup callbacks
  const char* User = "rbetti";
  const char* Pwd = "rbetti";
  myMqtt.setUserPwd(User,Pwd);
  Serial.println("connect mqtt...");
  myMqtt.connect();
  
  //moteur à l'arret
  digitalWrite(IN1,LOW);
  digitalWrite(IN2,LOW);
  analogWrite(ENA,0);
  
  //sonde ph
  pinMode(LED,OUTPUT);
  Serial.begin(9600);
  Serial.println("pH meter experiment!");    

  //Matrice Led
  pinMode(CLK_pin,OUTPUT);
  pinMode(CS_pin,OUTPUT);
  pinMode(DIN_pin,OUTPUT);
 
  
  Init_MAX7219() ;
  clear_matrix() ;
  //niveau d'eau
  Serial.begin(9600);  // Communication started with 9600 baud
  pinMode(10,OUTPUT);

//  //sonde Tmp
//  Serial.begin(9600);
  
}
void loop(void)
{
   static unsigned long samplingTime = millis();
  static unsigned long printTime = millis();
  static float pHValue,voltage;
  
  //capteur niveau d'eau
  int WaterLevelsensor=analogRead(WaterLevelSensorPin); 
  int LightSensor = analogRead(LightPin); 
  
  pHArray[pHArrayIndex++]=analogRead(PHSensorPin);
  if(pHArrayIndex==ArrayLenth)pHArrayIndex=0;
  voltage = avergearray(pHArray, ArrayLenth)*5.0/1024;
  pHValue = 3.5*voltage+Offset;
  samplingTime=millis();
  sensors.requestTemperatures();
  // On récupère la température de la sonde
  double dTempWater = sensors.getTempCByIndex(0);

  
  if(millis() - printTime > printInterval)   //Envoi des données en fonction de l'interval donnée plus haut
  {
        Serial.print(voltage,2);
        Serial.println(pHValue,2);
        Serial.println(sensor);   //valeur capteur niveau de l'eau
        digitalWrite(LED,digitalRead(LED)^1);
        printTime=millis();
        // On imprime la température
        Serial.print("Température de l'eau: ");
        Serial.print(dTempWater);
        Serial.println("°C");
        //Envoi des informations dans l'ordre : PH - Niveau d'eau - Température de l'eau
        char* stringSend = "PHSensor="+pHValue + ";WaterLevelSensor=" + WaterLevelsensor + ";TemperatureSensor=" + dTempWater + ";LightSensor=" + LightSensor;
        //Envoi des informations via MQTT
        myMqtt.publish(topic, stringSend);  
  }
  if(SeuilpHValue >= phValue || SeuilWaterLevelsensor >= WaterLevelsensor || SeuildTempWater >= dTempWater || SeuilLightSensor >= LightSensor)
  {
      char* stringSend = "PHSensor="+pHValue + ";WaterLevelSensor=" + WaterLevelsensor + ";TemperatureSensor=" + dTempWater + ";LightSensor=" + LightSensor;
      //Envoi des informations via MQTT
      myMqtt.publish(topic, stringSend);
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
void clear_matrix(void) {
  int clean[8] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00} ;
  write_matrix(clean) ;
}
