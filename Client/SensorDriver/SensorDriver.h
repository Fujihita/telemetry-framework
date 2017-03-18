/*
_______________________________________________________________________

   Sensor.h - Sensor driver library
_______________________________________________________________________
*/

#ifndef SensorDriver_h
#define SensorDriver_h

#include "Arduino.h"

class SensorDriver
{
  public:
  SensorDriver();
  String read();
  void write(String value);
  bool update();
  byte Port;
  String Class;
  int Cycle;

  private:
  long _timer;
  String temperature();
  String humidity();
  String pH();
  String generic();
  void digital_actuator(String value);
};

#endif