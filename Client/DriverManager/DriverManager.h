/*
_______________________________________________________________________

   Sensor.h - Sensor driver library
_______________________________________________________________________
*/

#ifndef DriverManager_h
#define DriverManager_h

#include "Arduino.h"

class DriverManager
{
  public:
  DriverManager();
  String read();
  void write(String value);
  bool update();
  byte Port;
  String Class;
  int Cycle;
  bool isSensor();

  private:
  long _timer;
  String humidity();
  String generic();
  void actuator_digital(String value);
  void actuator_analog(String value);
  void toggle_digital(String value);
  void toggle_analog(String value);
};

#endif