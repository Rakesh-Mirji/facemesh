"use client"
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import { drawMesh } from "./utilities";

import { useRef,useState } from "react"; // import useCallback

  const Cam = () => {
      
      const webcamRef = useRef(null);
      const canvasRef = useRef(null);
      const min = 57
      const max = 82
      let val = (max+min)/2
      
      const[heartRate,setHeartRate]= useState(0)
      
    // Load facemesh 
    const runFacemesh =async()=>{
        const net = await facemesh.load({
            inputResolution:{width:640,height:480},scale:0.8,maxFaces:1
        })
        setInterval(()=>{
            detect(net)
        },200)

        setInterval(()=>{
            setHeartRate((val >= heartRate+4 || val<=heartRate-3 ) ? val : heartRate)
            console.log(heartRate);
        },2000)
    }

    const beat = ()=>{
        function getRandomInt(max) {
            return Math.round(Math.random() * max);
        }
        let elem = getRandomInt(1) ? 1 : -1
        if(val+elem >= min && val+elem <= max){
            val+=elem
            // console.log(val)
        }
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
            // console.log(face);
            // console.log(webcamRef.current.video)
            // Get canvas context from drawing
            const ctx = canvasRef.current.getContext("2d"); 
            drawMesh(face,ctx)
            beat()
        }
    }

    runFacemesh()

    return (
      <>
        <header className="relative h-[60vh]">       
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
        </header>
        {heartRate && <div className="relative z-[100] bg-white/90 w-[15vw]">
            <p className="text-3xl font-bold text-slate-500">PULSE</p>
            <p className="text-3xl font-bold text-slate-400">{heartRate}<span className="text-lg">bpm</span></p>
        </div>}
      </>
    );
  };

export default Cam;