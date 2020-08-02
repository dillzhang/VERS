import React, { Component } from 'react';
import Document from "../components/Document";

const securityManual = (
    <Document>
        <h2>Security Sensors</h2>
        <p>
            Each floor of our compound is required to have a suite of sensors to detect unauthorized
            personnel. This document will serve as a guide for install sensors. Please adhere to these
            guidelines in order to ensure the security of our compound.    
        </p>
        <h3>Laser Trip Wires</h3>
        <p> 
            Laser Trip Wires use laser to monitor long straight distances. A transmitter and reciever are
            attached at each end and lasers are maintained between the two. When the beam is interrupted,
            an alarm will sound. However, we have experienced trouble with reflective surfaces. They are 
            redundantly wired so they cannot be remotely deactivated. Since these are most expensive of 
            sensors, we can only afford into install two sets per a floor. To maximize value, we will
            install them on our longest hallways.
        </p>
        <h3>Motion Sensors</h3>
        <p>
            Motion sensors can detect motion and will sound alarms if unauthorized movement is detected. They
            are redundantly wired so they cannot be remotely deactivated. Each sensor is capable of 360° of coverage.
            Since they have to be mounted to a surface, we can never achieve 360° coverage. To maximize value, we
            place motion sensors on corner where we can achieve at least 270° coverage. For their cost, we can
            put four per a floor.
        </p>
        <h3>Security Cameras</h3>
        <p>
            Security Cameras relay footage to our Guard Station. The offer a long narrow cone of coverage. As the cheapest 
            of our sensors, we can afford to place them wherever we have an electrical connection. They will occassionally
            lose signal. We cannot determine whether this is due to them being accessed remotely or their cheap quality. In
            order to counteract their signal lost, when three or more cameras go out, we send the guard to patrol the floor. 
        </p>
    </Document>
);

export default securityManual;