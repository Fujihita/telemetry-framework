/*
_______________________________________________________________________

   SIM800A.h - SIM800A driver library
_______________________________________________________________________
*/

#ifndef SIM800A_h
#define SIM800A_h

#include "Arduino.h"
#include "SoftwareSerial.h"

class SIM800A
{
  public:
  SIM800A(int pin_RX, int pin_TX);
  void login(String APN, String USER, String PASSWORD);
  void connect(String URL);
  String post(String body);
  String IMEI();
  String get();

  private:
  SoftwareSerial _SIM800A;
  String waitFor(String phrase);
};

#endif