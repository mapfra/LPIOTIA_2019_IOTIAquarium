#include <ESP8266WiFi.h>
#include <MQTT.h>

void myDataCb(String& topic, String& data);
void myPublishedCb();
void myDisconnectedCb();
void myConnectedCb();

#define CLIENT_ID "Arduino_Client"

// create MQTT object
MQTT myMqtt(CLIENT_ID, "192.168.1.3", 1883);

//
char* ssid     = "Bbox-A281C6D8";
char* password = "D251DED17FAFA3FF36463AD44D363D";


//
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
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

  delay(10);
}

//
void loop() {


  String topic("/value");
  Serial.println("connect mqtt...");
  
  String valueStr("testdurand");

  // publish value to topic
  bool test = myMqtt.publish(topic, valueStr);
  Serial.println(test);  
  delay(1000);
}


/*
 * 
 */
void myConnectedCb()
{
  Serial.println("connected to MQTT server");
}

void myDisconnectedCb()
{
  Serial.println("disconnected. try to reconnect...");
  delay(500);
  myMqtt.connect();
}

void myPublishedCb()
{
  //Serial.println("published.");
}

void myDataCb(String& topic, String& data)
{
  
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(data);
}
