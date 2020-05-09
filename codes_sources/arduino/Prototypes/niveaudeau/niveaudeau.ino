void setup(){
Serial.begin(9600);  // Communication started with 9600 baud
 pinMode(10,OUTPUT);
}
void loop(){
 
int sensor=analogRead(A1); // Incoming analog signal read and appointed sensor
Serial.println(sensor);   //Wrote serial port

//active le ventilateur pour 2 min
digitalWrite(10, HIGH);
delay(1000);
digitalWrite(10,LOW);
delay(5000);
}
