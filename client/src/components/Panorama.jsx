import React from 'react';

import { Pannellum } from "pannellum-react";

function Panorama (props) {

    return (
      <div>
        <Pannellum
            width="800px"
            height="400px"
            image={props.image}
            pitch={10}
            yaw={180}
            hfov={500}
            autoLoad
            author=""
            title=""
            orientationOnByDefault={false}
            draggable
            keyboardZoom
            mouseZoom
            preview=""
            previewAuthor=""
            previewTitle=""
            showControls
            showFullscreenCtrl
            showZoomCtrl
            onLoad={()=>{}}
            onScenechange={(id)=>{console.log("Scene has change on " + id);}}
            onScenechangefadedone={()=>{console.log("panorama loaded");}}
            onError={(err)=>{console.log("Error" , err);}}
            onErrorcleared={()=>{console.log("Error Cleared");}}
            onMousedown={(evt)=>{console.log("Mouse Down" , evt);}}
            onMouseup={(evt)=>{console.log("Mouse Up", evt);}}
            onTouchstart={(evt)=>{console.log("Touch Start", evt);}}
            onTouchend={(evt)=>{console.log("Touch End", evt);}}
            hotspotDebug={false}
        >
        </Pannellum>
      </div>
    )
  }


export default Panorama;
