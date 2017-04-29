#include <ESP8266WiFi.h>
#include <DNSServer.h>  
#include <ESP8266WebServer.h> 
#include <WiFiManager.h> 
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <DriverManager.h>

#define GET_INTERVAL 2000
#define HOST "telemetryapp.azurewebsites.net"
#define HOST_IP "23.101.27.182"

int NodeID = 0;
byte port_number = 0;
unsigned long timer = 0;

WiFiManager wifiManager;
DriverManager driver[10];

void setup() {
  Serial.begin(9600);
  delay(10);
    
  while(NodeID == 0){
  connectWifi();
  registerNode();
  }
}

void loop() {
 if (millis() - timer > GET_INTERVAL)
 {  
    loadDrivers(getConfig()); 
    timer = millis();
    for(int i = 0; i < port_number; i++)
    {
      if (!driver[i].isSensor())
      {
        String response = getLatest(driver[i].Port);
        if (response != "")
          driver[i].write(response);
      }   
    }
     
 }
 for(int i = 0; i < port_number; i++)
    {
      if ((driver[i].update()) && (driver[i].Cycle > 0))
      {  
          String report = createReport(driver[i].Port, "0");
          if (driver[i].isSensor())
            report = createReport(driver[i].Port,driver[i].read());
          else
            driver[i].write("0");
          sendHttp(createPostReq("/api/data", report));
      }   
    }
}

/*
 * Node client wifi functions
 */

void connectWifi()
{
  wifiManager.setAPCallback(configModeCallback);
  wifiManager.setConfigPortalTimeout(90);
  wifiManager.setDebugOutput(true);
  wifiManager.autoConnect("ESP8266_Config", "admin");
}

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

void registerNode()
{
  String body = "{\"DeviceID\":\"" + WiFi.macAddress() + "\"}";
  String response = sendHttp(createPostReq("/api/profile?action=new", body));
  response = response.substring(response.indexOf("\"NodeID\":")+9);
  NodeID = response.substring(0,response.indexOf("}")).toInt();
}

String getConfig()
{
  String response = sendHttp(createGetReq("/api/config/" + String(NodeID)));
  return response;
}

String getLatest(byte Port)
{
  String response = sendHttp(createGetReq("/api/latest/" + String(NodeID) + "/" + String(Port)));
  Serial.println(response);
  return response;
}

String sendHttp(String request)
{
      //Serial.println("Requesting...");
      //Serial.println(request);
      WiFiClient client;
      if (!client.connect(HOST_IP, 80)) {
      Serial.println("Connection failed");       
      return "Connection failed";
      }
      client.print(request);
      delay(100);

      String line = "";
      while (client.available()) {
      line = client.readStringUntil('\r');
      }
      line.trim();
      //Serial.println(line);
      return line;
}

/*
 * Schema functions to construct http requests
 */

String createReport(byte Port, String Reading)
{
  String body = "{\"NodeID\":\"" + String(NodeID) + "\",\"Port\":\"" + String(Port) + "\",\"Reading\":\"" + Reading + "\"}";
  return body;
}

String createGetReq(String path)
{
return (String("GET ") + String(path) + " HTTP/1.1\r\n" +
               "Host: " + HOST + "\r\n" +
               "Connection: close\r\n\r\n");
}

String createPostReq(String path, String payload)
{
return (String("POST ") + String(path) + " HTTP/1.1\r\n" +
               "Host: " + HOST + "\r\n" +
               "Content-Type: application/json\r\n" +
               "Content-Length: " + String(payload.length()) + "\r\n" +
               "Connection: close\r\n"+
               "\r\n" +
               payload + "\r\n");
}

void loadDrivers(String response)
{
  port_number = 0;
  while(response.indexOf("\"Port") != -1)
  {
    String temp = response.substring(response.indexOf("\"Port"),response.indexOf("\"}")+1);
    temp = temp.substring(temp.indexOf("\"Port\":")+7);
    driver[port_number].Port = temp.substring(0,temp.indexOf(",")).toInt();
    temp = temp.substring(temp.indexOf("\"Cycle\":")+8);
    driver[port_number].Cycle = temp.substring(0,temp.indexOf(",")).toInt();
    temp = temp.substring(temp.indexOf("\"Class\":\"")+9);
    driver[port_number].Class = temp.substring(0,temp.indexOf("\""));    
    port_number++;
    response = response.substring(response.indexOf("}")+1);
  }
}

