"use client"
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import { drawMesh } from "./utilities";

import { useRef } from "react"; // import useCallback

  const App = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
  
    // Load facemesh 
    const runFacemesh =async()=>{
        const net = await  facemesh.load({
            inputResolution:{width:"100vw"},scale:0.8
        })
        setInterval(()=>{
            detect(net)
        },150)
    }


    // Detect function
    const detect = async(net)=>{
        if(typeof webcamRef.current!=undefined && webcamRef.current != null && webcamRef.current.video.readyState===4){
            // Get Video properties 
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // set video width
            webcamRef.current.video.width = videoWidth
            webcamRef.current.video.height = videoHeight

            // set canvas width
            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight

            // Make detection
            const face = await net.estimateFaces(video);
            // console.log(face.length);

            // Get canvas context from drawing
            const ctx = canvasRef.current.getContext("2d"); 
            drawMesh(face,ctx)
        }
    }

    runFacemesh()

    return (
      <>
      <header className="relative bg-red-200">
            <Webcam 
            audio={false} 
            ref={webcamRef}
            style={{
                position:"absolute",
                left:0,
                right:0,
                textAlign:"center",
                zIndex:9,
                width:"100vw",
                // height:"50vh",
                border:"2px solid black"
            }} 
            />

            <canvas
            ref={canvasRef}
            style={{
                position:"absolute",
                left:0,
                right:0,
                textAlign:"center",
                zIndex:9,
                width:"100vw",
                // height:"50vh",
                border:"2px solid black"
            }}         
            />
            Face data
      </header>

      </>
    );
  };

export default App;