/*
_______________________________________________________________________

   SIM800A.cpp - SIM800A driver library
_______________________________________________________________________
*/

#include "Arduino.h"
#include "SoftwareSerial.h"
#include "SIM800A.h"

SIM800A::SIM800A(int pin_RX, int pin_TX) : _SIM800A(pin_RX, pin_TX)
{
  _SIM800A.begin(9600);
}

String SIM800A::waitFor(String phrase)
{
  unsigned long timeout = millis();
  String stream = "";
  while (stream.substring(stream.length() - phrase.length()) != phrase)
  {
    if (_SIM800A.available())
    {
      char temp = _SIM800A.read();
      stream += temp;
    }
    if (millis() - timeout > 4000)
      return "ERROR";
  }
  return stream.substring(0, stream.length() - phrase.length() - 1);
}

String SIM800A::IMEI()
{
  _SIM800A.println("AT+CGSN");
  _SIM800A.flush();

  String temp = waitFor("OK");
  temp.trim();
  return temp.substring(10, 25);
}

void SIM800A::login(String APN, String USER, String PASSWORD)
{
  String x = "";
  Serial.println("Logging into APN...");
  _SIM800A.println("AT+SAPBR=3,1,\"Contype\",\"GPRS\"");
  _SIM800A.flush();
  x = waitFor("OK");
  if (x == "ERROR")
    return;

  String temp = "AT+SAPBR=3,1,\"APN\",\"" + APN + "\"";
  if (USER != "")
    temp += ",\"" + USER + "\"";
  if (PASSWORD != "")
    temp += ",\"" + PASSWORD + "\"";
  _SIM800A.println(temp);
  _SIM800A.flush();
  x = waitFor("OK");
  if (x == "ERROR")
    return;

  _SIM800A.println("AT+SAPBR=1,1");
  _SIM800A.flush();
  x = waitFor("OK");
  x = "";
}

void SIM800A::connect(String URL)
{
  String x = "";
  Serial.println("Connecting to server...");
  _SIM800A.println("AT+HTTPTERM");
  _SIM800A.flush();
  x = waitFor("OK");

  _SIM800A.println("AT+HTTPINIT");
  _SIM800A.flush();
  x = waitFor("OK");
  if (x == "ERROR")
    return;

  _SIM800A.println("AT+HTTPPARA=\"CID\",1");
  _SIM800A.flush();
  x = waitFor("OK");
  if (x == "ERROR")
    return;

  _SIM800A.println("AT+HTTPPARA=\"URL\",\"" + URL + "\"");
  _SIM800A.flush();
  x = waitFor("OK");
  x = "";
  if (x == "ERROR")
    return;
}

String SIM800A::get()
{
  String x = ""; // tracker variable for garbage disposal
  Serial.println("Sending HTTP GET request...");

  _SIM800A.println("AT+HTTPACTION=0");
  _SIM800A.flush();
  x = waitFor("+HTTPACTION: ");
  if (x == "ERROR")
    return x;
  
  _SIM800A.println("AT+HTTPREAD");
  _SIM800A.flush();
  x = waitFor("+HTTPREAD: ");
  if (x == "ERROR")
    return x;
  x = waitFor("OK");
  x = x.substring(x.indexOf("\r")+2);
  return x;
}

String SIM800A::post(String body)
{
  String x = ""; // tracker variable for garbage disposal
  Serial.println("Sending HTTP POST request...");

  _SIM800A.println("AT+HTTPPARA=\"CONTENT\",\"application/json\"");
  _SIM800A.flush();
  x = waitFor("OK");
    if (x == "ERROR")
    return x;

  _SIM800A.println("AT+HTTPDATA=" + String(body.length()) + ",20000");
  _SIM800A.flush();
  x = waitFor("DOWNLOAD");
    if (x == "ERROR")
    return x;

  _SIM800A.println(body);
  _SIM800A.flush();
  x = waitFor("OK");
    if (x == "ERROR")
    return x;

  _SIM800A.println("AT+HTTPACTION=1");
  x = waitFor("OK");
  if (x == "ERROR")
    return x;
    
  x = waitFor("+HTTPACTION: ");
  if (x == "ERROR")
    return x;

  _SIM800A.println("AT+HTTPREAD");
  _SIM800A.flush();
  x = waitFor("+HTTPREAD: ");
  if (x == "ERROR")
    return x;
  x = waitFor("OK");
  x = x.substring(x.indexOf("\r")+2);
  return x;
}