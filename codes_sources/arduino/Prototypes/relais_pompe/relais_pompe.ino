void setup() {
  // établie la liaison avec la sortie
 
 pinMode(10,OUTPUT);
}

void loop() {
  //active le ventilateur pour 2 min
  digitalWrite(10, HIGH);
  delay(1000);
  digitalWrite(10,LOW);
  delay(5000);

}
