#include <SIM800A.h>
#include <SensorDriver.h>
#define APN_NAME "v-internet"
#define APN_USER ""
#define APN_PASSWORD ""
#define HOST_URL ""

SIM800A waygate(5,4); // RX, TX

byte port_number = 0;
int NodeID = 0;

SensorDriver driver[10];

unsigned long timer = 0;
int timeout = 0;

void setup() {
  Serial.begin(9600);
  while(NodeID == 0){
  waygate.login(APN_NAME,APN_USER,APN_PASSWORD);
  registerNode();
  }
}

void loop() {
 if (millis() - timer > timeout * 1000L)
 {  
    getConfig();
    timer = millis();
 }
 for(int i = 0; i < port_number; i++)
    {
      if (driver[i].update())
      {  
      String postBody = createPostBody(String(NodeID), String(driver[i].Port), driver[i].read());
      postReport(postBody);
      }
    }
}

String createPostBody(String NodeID, String Port, String Reading)
{
  String postBody = "{\"NodeID\":\"" + NodeID + "\",\"Port\":\"" + Port + "\",\"Reading\":\"" + Reading + "\"}";
  return postBody;
}

void registerNode()
{
  waygate.connect(HOST_URL + "/profile?action=new");
  String body = "{\"DeviceID\":\""+ waygate.IMEI() + "\"}";
  String temp = waygate.post(body);
  temp = temp.substring(temp.indexOf("\"NodeID\":")+9);
  NodeID = temp.substring(0,temp.indexOf("}")).toInt();
}

void postReport(String body)
{
  waygate.connect(HOST_URL + "/api/data");
  String stream = waygate.post(body);
}

void getConfig()
{
  waygate.connect(HOST_URL + "/api/config/" + String(NodeID));
  String data = waygate.get();
  if (data == "ERROR")
    return;
  data.trim();
  Serial.println(data);
  port_number = 0;
  
  while(data.indexOf("\"Port") != -1)
  {
    String temp = data.substring(data.indexOf("\"Port"),data.indexOf("\"}")+1);
    temp = temp.substring(temp.indexOf("\"Port\":")+7);
    driver[port_number].Port = temp.substring(0,temp.indexOf(",")).toInt();
    temp = temp.substring(temp.indexOf("\"Cycle\":")+8);
    driver[port_number].Cycle = temp.substring(0,temp.indexOf(",")).toInt();
    temp = temp.substring(temp.indexOf("\"Class\":\"")+9);
    driver[port_number].Class = temp.substring(0,temp.indexOf("\""));    
    if ((port_number == 0) || (driver[port_number].Cycle < timeout))
      timeout = driver[port_number].Cycle;
    port_number++;
    data = data.substring(data.indexOf("}")+1);
  }
}

