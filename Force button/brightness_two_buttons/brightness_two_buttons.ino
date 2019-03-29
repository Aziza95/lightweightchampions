const int brightnessUp = 9;     // the number of the pushbutton pin
const int brightnessDown = 8;     // the number of the pushbutton pin
const int ledPin =  11;      // the number of the LED pin
const int maxBrightness = 3; //this can be any number - it's the number of steps between dimmest and brightest. 

// variables will change:
int brightness = maxBrightness;
int interval=1;

void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);      
  // initialize the pushbutton pins as an input:
  pinMode(brightnessUp, INPUT);     
  pinMode(brightnessDown, INPUT);   
  Serial.begin(9600);
}

void loop(){
    if (digitalRead(brightnessUp) == HIGH && brightness < maxBrightness){ 
      brightness = brightness + interval; 
      //if the brightness Up button is pushed, add one degree of brightness to the current level
      Serial.println(brightness); //for debugging purposes
    }
    if (digitalRead(brightnessDown) == HIGH && brightness > 0){
      brightness = brightness - interval;
      //if the brightness Down button is pushed, subtract one degree of brightness from the current level
      Serial.println(brightness); //for debugging purposes
    }
    delay(1);
    analogWrite(11, map(brightness, 0, 5, 0, 255));    
    //this code maps the max brightness constant to the max LED brightness
  
}
