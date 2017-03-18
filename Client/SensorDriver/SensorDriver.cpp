/*
_______________________________________________________________________

   SensorDriver.cpp - SensorDriver driver library
_______________________________________________________________________
*/

#include "Arduino.h"
#include "SensorDriver.h"

SensorDriver::SensorDriver()
{
  Port = 0;
  Class = "Generic";
  Cycle = 0;
  _timer = millis();
}

bool SensorDriver::update()
{
  if (millis() - _timer > Cycle * 1000L)
  {
    _timer = millis();
    return true;
  }
  else
    return false;
}

String SensorDriver::read()
{
  if (Class == "PH")
    return pH();
  else if (Class == "Temperature")
    return temperature();
  else if (Class == "Humidity")
    return humidity();
  else
    return generic();
}

String SensorDriver::temperature()
{
  pinMode(Port, INPUT);
  return String(digitalRead(Port));
}

String SensorDriver::humidity()
{
  pinMode(Port, INPUT);
  return String(digitalRead(Port));
}

String SensorDriver::pH()
{
  pinMode(Port, INPUT);
  return String(digitalRead(Port));
}

String SensorDriver::generic()
{
  pinMode(Port, INPUT);
  return String(digitalRead(Port));
}

void SensorDriver::write(String value)
{
  if (Class == "D_Actuator")
    digital_actuator(value);
}

void SensorDriver::digital_actuator(String value)
{
  pinMode(Port, OUTPUT);
  digitalWrite(Port, value.toInt());
}