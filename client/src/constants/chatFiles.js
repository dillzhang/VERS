import React from 'react';

import warehouse_1dark_preview from "../warehouse_images/warehouse-1dark-preview.jpg";
import warehouse_2thermal_preview from "../warehouse_images/warehouse-2thermal-preview.jpg";
import warehouse_3powered_preview from "../warehouse_images/warehouse-3powered-preview.jpg";

const chatFilesCreator = (openApplication) => ({
    backpack: <div className="backpack"><p>Backpack</p><ul><li>Thermal Camera</li><li>Mirror</li><li>Multi-tool</li></ul></div>,
    warehouse: <img onClick={() => { openApplication("warehouse") }} src="/warehouse.jpg" alt="Warehouse exterior" />,
    floor_plan_4: <div className="file"><p><img className="icon" src="/desktop/file.svg" alt="File icon" /> floor4.bp</p></div>,

    no_thermal_warehouse: <img onClick={() => { openApplication("no_thermal_warehouse") }} src={warehouse_1dark_preview} alt="Warehouse" />,

    thermal_warehouse: <img onClick={() => { openApplication("thermal_warehouse") }} src={warehouse_2thermal_preview} alt="Warehouse (thermal)" />,

    thermal_warehouse_wires: <img onClick={() => { openApplication("thermal_warehouse_wires") }} src={warehouse_3powered_preview} alt="Warehouse (thermal, power on)" />,

    elevator_landing: <img onClick={() => { openApplication("elevator_landing") }} src="/hallways/hallway.jpg" alt="Hallways outside elevator" />,
    vault_door: <img onClick={() => { openApplication("vault_door") }} src="/vault/door.jpg" alt="Vault door" />,

    tubes: <img onClick={() => { openApplication("tubes") }} src="/vault/tubes.jpg" alt="Tubes" />,
    brain: <img onClick={() => { openApplication("brain") }} src="/vault/brain.jpg" alt="Brain" />,
    baby: <img onClick={() => { openApplication("baby") }} src="/vault/baby.jpg" alt="Baby" />,
    cameras: <img onClick={() => { openApplication("cameras") }} src="/vault/cameras.jpg" alt="Cameras" />,
    powder: <img onClick={() => { openApplication("powder") }} src="/vault/powder.jpg" alt="Powder" />,
    subject1: <img onClick={() => { openApplication("subject1") }} src="/vault/subject1.jpg" alt="Subject" />,
    subject2: <img onClick={() => { openApplication("subject2") }} src="/vault/subject2.jpg" alt="Subject" />,
    computer: <img onClick={() => { openApplication("computer") }} src="/vault/computer.jpg" alt="Computer" />,

    languageTranscript1: <div className="file pointer" onClick={() => { openApplication("languageTranscript1") }} ><p><img className="icon" src="/desktop/file.svg" alt="File icon" />transcript_20160103.pdf</p></div>,
    languageTranscript2: <div className="file pointer" onClick={() => { openApplication("languageTranscript2") }} ><p><img className="icon" src="/desktop/file.svg" alt="File icon" />transcript_20160521.pdf</p></div>,
    alienArticle: <div className="file pointer" onClick={() => { openApplication("alienArticle") }} ><p><img className="icon" src="/desktop/file.svg" alt="File icon" />journal_20151113.pdf</p></div>,
});

export default chatFilesCreator;