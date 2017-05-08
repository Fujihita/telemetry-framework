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
  bool isSensor();
  void save(String value);
  String load();
  bool update();
  byte Port;
  String Class;
  bool snooze;
  unsigned long Cycle;

  private:
  unsigned long _timer;
  String _value;
  String humidity();
  String generic();
  void actuator_digital(String value);
  void actuator_analog(String value);
  void toggle_digital(String value);
  void toggle_analog(String value);
};

#endif