import React from 'react';
import Document from "../components/Document";

const securityManual = (
    <Document>
        <h2>Security Sensors</h2>
        <h3>Requirements</h3>
        <ul>
            <li>
                Use all electrical hookups for maximum coverage
            </li>
            <li>
                Use entire budget of $5,100
            </li>
        </ul>
        <h3>Laser Trip Wires</h3>
        <ul>
            <li>
                Best for long straight distances, install in longest hallways
            </li>
            <li>
                Requires 2 modules to operate
            </li>
            <li>
                Redundantly wired, will not fail due to electrical failure
            </li>
            <li>
                Issues detecting reflective surfaces
            </li>
            <li>
                $900 per module
            </li>
        </ul>
        <h3>Motion Sensors</h3>
        <ul>
            <li>
                Short 360° coverage, install if at least 270° coverage
            </li>
            <li>
                Redundantly wired, will not fail due to electrical failure
            </li>
            <li>
                $200 per sensor
            </li>
        </ul>
        <h3>Security Cameras</h3>
        <ul>
            <li>
                Long narrow cone of coverage
            </li>
            <li>
                Occassionally lose signal due to electrical failure
            </li>
            <li>
                $50 per sensor
            </li>
        </ul>
    </Document>
);

export default securityManual;