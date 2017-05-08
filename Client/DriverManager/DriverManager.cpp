/*
_______________________________________________________________________

   DriverManager.cpp - DriverManager driver library
_______________________________________________________________________
*/

#include "Arduino.h"
#include "DriverManager.h"

DriverManager::DriverManager()
{
  Port = 0;
  Class = "Generic";
  Cycle = 0;
  _timer = millis();
  _value = "";
  snooze = false;
}

String DriverManager::load()
{
  return _value;
}

void DriverManager::save(String value)
{
  _value = value;
}

bool DriverManager::update()
{
  Serial.println(millis() - _timer);
  if (millis() - _timer > Cycle * 1000UL)
  {
    _timer = millis();
    return true;
  }
  else
    return false;
}

bool DriverManager::isSensor()
{
  if (read() != "")
    return true;
  else
    return false;
}

String DriverManager::read()
{
  if (Class == "Humidity")
    return humidity();
  else return "";
}

String DriverManager::humidity()
{
  pinMode(Port, INPUT);
  return String(digitalRead(Port));
}

String DriverManager::generic()
{
  pinMode(Port, INPUT);
  return String(digitalRead(Port));
}

void DriverManager::write(String value)
{
  if (Class == "ActuatorD")
    actuator_digital(value);
  else if (Class == "ActuatorA")
    actuator_analog(value);
  else if (Class == "ToggleD")
    toggle_digital(value);
  else if (Class == "ToggleA")
    toggle_analog(value);
}

void DriverManager::actuator_digital(String value)
{
  pinMode(Port, OUTPUT);
  Cycle = value.toInt();  
  if (Cycle > 0)
  {
    digitalWrite(Port, 0);
  }
  else
  {
    digitalWrite(Port, 1);
  }
}

void DriverManager::actuator_analog(String value)
{
  analogWrite(Port, value.toInt());
}

void DriverManager::toggle_digital(String value)
{
  pinMode(Port, OUTPUT);
  _timer = millis();
  if (value.toInt() > 0)
  {
    digitalWrite(Port, 1);
  }
  else
  {
    digitalWrite(Port, 0);
  }
}

void DriverManager::toggle_analog(String value)
{
  _timer = millis();
  analogWrite(Port, value.toInt());
}