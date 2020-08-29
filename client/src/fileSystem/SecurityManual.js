import React from 'react';
import Document from "../components/Document";

const securityManual = (
    <Document>
        <div className="security-manual">
        <div className="note">
            <p>Jason,</p>
            <p>As requested, I've attached a copy of the security system invoice below for your records. Let me know if there's anything else you need.</p>
            <p>Katie</p>
        </div>

        <div className="invoice">
        <h3>INVOICE</h3>
        <p>
            PrimeGuard Security Solutions<br/>
            3697 Wescam Court<br/>
            +1 555-867-4092<br/>
        </p>

        <h6>BILL TO:</h6>
        <p>U.S. Department of Extraterrestrial Intelligence</p>

        <table>
          <tr>
            <th>Description</th>
            <th>Unit Cost</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>L37P1 - LASER TRIP WIRE</td>
            <td>900.00</td>
            <td><span className="redacted">XX</span></td>
            <td><span className="redacted">XXXX</span></td>
          </tr>
          <tr>
            <td>M22Y4 - MOTION SENSOR</td>
            <td>200.00</td>
            <td><span className="redacted">XX</span></td>
            <td><span className="redacted">XXXX</span></td>
          </tr>
          <tr>
            <td>C89X2 - CAMERA</td>
            <td>50.00</td>
            <td><span className="redacted">XX</span></td>
            <td><span className="redacted">XXXX</span></td>
          </tr>
        </table>

        <h6 className="total">Total Due: 5100.00</h6>

        <div className="special-notes">
        <h3>Installation Notes</h3>
        <p>Note: Use all electrical hookups for maximum coverage.</p>
        <h6>L37P1 - LASER TRIP WIRE</h6>
        <ul>
            <li>
                Best for long straight distances, install in longest hallways.
            </li>
            <li>
                Requires 2 units to operate.
            </li>
            <li>
                Redundantly wired, will not fail due to electrical failure.
            </li>
            <li>
                Issues detecting reflective surfaces.
            </li>
        </ul>
        <h6>M22Y4 - MOTION SENSOR</h6>
        <ul>
            <li>
                Short 360° coverage, install if at least 270° coverage.
            </li>
            <li>
                Redundantly wired, will not fail due to electrical failure.
            </li>
        </ul>
        <h6>C89X2 - CAMERA</h6>
        <ul>
            <li>
                Long narrow cone of coverage.
            </li>
            <li>
                Occassionally lose signal due to electrical failure.
            </li>
        </ul>
        </div>
        </div>
        </div>
    </Document>
);

export default securityManual;