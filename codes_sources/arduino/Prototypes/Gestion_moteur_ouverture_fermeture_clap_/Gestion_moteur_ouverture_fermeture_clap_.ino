
int GND=5; //Connecté à ardouino pin GND
int IN1=2; //Connecté à ardouino pin 2
int IN2=3; //Connecté à ardouino pin 3
int ENA=4; //Connecté à ardouino pin 3 

void setup() {
  pinMode(ENA,OUTPUT);
  pinMode(IN1,OUTPUT);
  pinMode(IN2,OUTPUT);

  //moteur à l'arret
  digitalWrite(IN1,LOW);
  digitalWrite(IN2,LOW);
  analogWrite(ENA,0tuyyyyyyyyyyyyyè_    );
}

void loop() {
  //ouverture du volet
  //sens1
  analogWrite(ENA,0);
  digitalWrite(IN1,LOW);
  digitalWrite(IN2,HIGH);
  analogWrite(ENA,255);
  delay(60);
  analogWrite(ENA,35);
  delay(5000);
  
  //fermeture du volet
  //arret du moteur avant inversement des sens
  analogWrite(ENA,0);
  digitalWrite(IN1,HIGH);
  digitalWrite(IN2,LOW);
  analogWrite(ENA,255);
  delay(60);
  analogWrite(ENA,35);
  delay(5000);

}
