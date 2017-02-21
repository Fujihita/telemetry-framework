# telemetry-framework

This repository contains the webserver portion of a framework for internet of things telemetry solutions using Nodejs web stack.

The framework is composed of hardware and software components spanning across two environments. The first, the node client, is the remote or inaccessible environment. The node client is an Arduino microcontroller attached to sensors and actuators. It sends and receives data to the server using a GPRS internet gateway provided by SIM800A module. The second, the webserver, is the nearby and accessible environment. The webserver provides RESTful API endpoints to interact with node clients and a web interface to interact with web users. It is written in a web stack consisting of Nodejs, Angularjs, HTML, CSS and SQL database.

All node clients have a registered profile and a configuration for every sensor or actuator attached to them. The webserver configuration can be changed by the web user at any time and the behavior of the node client’s firmware will update itself to reflect the change. Two forms of GPS, multiple voltage levels power supply, extensible driver manager library, and modularized hardware design provide a wide range of tools for the development of derivative telemetry solutions.

## stats
Version: 1.0.0

Project started: Thursday 13 October 2016

Project published: Wednesday 22 February 2017

Live demo: http://telemetryapp.azurewebsites.net/map