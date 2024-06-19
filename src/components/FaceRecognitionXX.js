import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import "./FaceRecognition.css";

const FaceRecognition = () => {
  const [loading, setLoading] = useState(true);
  const [webcamOn, setWebcamOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const start = async () => {
      try {
        console.log("Loading models...");
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        ]);
        console.log("Models loaded");
        setLoading(false);
      } catch (error) {
        console.error("Error loading models: ", error);
      }
    };

    start();
  }, []);

  const startWebcam = async () => {
    const video = document.getElementById("videoInput");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      video.srcObject = stream;

      video.onloadeddata = () => {
        console.log("Video data loaded");
        recognizeFaces(video);
      };

      setWebcamOn(true);
    } catch (error) {
      console.error("Error accessing media devices: ", error);
    }
  };

  const stopWebcam = () => {
    const video = document.getElementById("videoInput");
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    video.srcObject = null;

    setWebcamOn(false);
  };

  const recognizeFaces = async (video) => {
    const labeledDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    video.addEventListener("play", () => {
      console.log("Video play event triggered");

      setInterval(async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceDescriptors();

          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

          const results = resizedDetections.map((d) => {
            const bestMatch = faceMatcher.findBestMatch(d.descriptor);
            return {
              label: bestMatch.label,
              distance: bestMatch.distance,
            };
          });

          results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            const label = result.label === "unknown" ? "Unknown" : result.label;
            const confidence = ((1 - result.distance) * 100).toFixed(2);
            const text = `${label} (${confidence}%)`;

            const drawBox = new faceapi.draw.DrawBox(box, { label: text });
            drawBox.draw(canvas);
          });
        } catch (error) {
          console.error("Error during face detection: ", error);
        }
      }, 100);
    });
  };

  const loadLabeledImages = async () => {
    const labels = ["Rahul Das", "Akashdeep Baruah"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 5; i++) {
          try {
            const img = await faceapi.fetchImage(
              `${process.env.PUBLIC_URL}/labeled_images/${label}/${i}.jpg`
            );
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections.descriptor);
          } catch (error) {
            console.error(`Error loading image for ${label}:`, error);
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

  return (
    <div>
      <h1>Face Recognition</h1>
      {loading && <p>Loading models...</p>}
      <div className="video-container">
        <video
          id="videoInput"
          width="720"
          height="550"
          autoPlay
          muted
          style={{ display: webcamOn ? "block" : "none" }}
        ></video>
        <div
          className="black-box"
          style={{
            display: webcamOn ? "none" : "block",
            width: "720px",
            height: "550px",
          }}
        ></div>
      </div>
      <br />
      <button onClick={webcamOn ? stopWebcam : startWebcam}>
        {webcamOn ? "Close Webcam" : "Open Webcam"}
      </button>
      <br />
      <button onClick={() => navigate("/")}>Go Back Home</button>
    </div>
  );
};

export default FaceRecognition;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as faceapi from "face-api.js";
// import "../styles/FaceRecognition.css";

// const FaceRecognition = () => {
//   const [loading, setLoading] = useState(true);
//   const [webcamOn, setWebcamOn] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const start = async () => {
//       try {
//         console.log("Loading models...");
//         await Promise.all([
//           faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//           faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//           faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
//         ]);
//         console.log("Models loaded");
//         setLoading(false);
//       } catch (error) {
//         console.error("Error loading models: ", error);
//       }
//     };

//     start();
//   }, []);

//   const startWebcam = async () => {
//     const video = document.getElementById("videoInput");

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//       });
//       video.srcObject = stream;

//       video.onloadeddata = () => {
//         console.log("Video data loaded");
//         recognizeFaces(video);
//       };

//       setWebcamOn(true);
//     } catch (error) {
//       console.error("Error accessing media devices: ", error);
//     }
//   };

//   const stopWebcam = () => {
//     const video = document.getElementById("videoInput");
//     const stream = video.srcObject;
//     const tracks = stream.getTracks();

//     tracks.forEach((track) => track.stop());
//     video.srcObject = null;

//     setWebcamOn(false);
//   };

//   const recognizeFaces = async (video) => {
//     const labeledDescriptors = await loadLabeledImages();
//     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);

//     video.addEventListener("play", async () => {
//       console.log("Video play event triggered");
//       const canvas = faceapi.createCanvasFromMedia(video);
//       document.querySelector(".video-container").append(canvas);

//       const displaySize = { width: video.width, height: video.height };
//       faceapi.matchDimensions(canvas, displaySize);

//       setInterval(async () => {
//         try {
//           const detections = await faceapi
//             .detectAllFaces(video)
//             .withFaceLandmarks()
//             .withFaceDescriptors();

//           const resizedDetections = faceapi.resizeResults(
//             detections,
//             displaySize
//           );

//           const canvasCtx = canvas.getContext("2d");
//           canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

//           const results = resizedDetections.map((d) => {
//             const bestMatch = faceMatcher.findBestMatch(d.descriptor);
//             return {
//               label: bestMatch.label,
//               distance: bestMatch.distance,
//             };
//           });

//           results.forEach((result, i) => {
//             const box = resizedDetections[i].detection.box;
//             const label = result.label === "unknown" ? "Unknown" : result.label;
//             const confidence = ((1 - result.distance) * 100).toFixed(2);
//             const text = `${label} (${confidence}%)`;

//             const drawBox = new faceapi.draw.DrawBox(box, { label: text });
//             drawBox.draw(canvas);
//           });
//         } catch (error) {
//           console.error("Error during face detection: ", error);
//         }
//       }, 100);
//     });
//   };

//   const loadLabeledImages = async () => {
//     const labels = ["Rahul Das", "Akashdeep Baruah"];
//     return Promise.all(
//       labels.map(async (label) => {
//         const descriptions = [];
//         for (let i = 1; i <= 5; i++) {
//           try {
//             const img = await faceapi.fetchImage(
//               `${process.env.PUBLIC_URL}/labeled_images/${label}/${i}.jpg`
//             );
//             const detections = await faceapi
//               .detectSingleFace(img)
//               .withFaceLandmarks()
//               .withFaceDescriptor();
//             descriptions.push(detections.descriptor);
//           } catch (error) {
//             console.error(`Error loading image for ${label}:`, error);
//           }
//         }
//         return new faceapi.LabeledFaceDescriptors(label, descriptions);
//       })
//     );
//   };

//   return (
//     <div className="container">
//       <h1>Face Recognition</h1>
//       {loading && <p>Loading models...</p>}
//       <div className="video-container">
//         <video
//           id="videoInput"
//           width="720"
//           height="550"
//           autoPlay
//           muted
//           style={{ display: webcamOn ? "block" : "none" }}
//         ></video>
//         <div
//           className="black-box"
//           style={{
//             display: webcamOn ? "none" : "block",
//             width: "720px",
//             height: "550px",
//           }}
//         ></div>
//       </div>
//       <div className="controls">
//         <button
//           onClick={webcamOn ? stopWebcam : startWebcam}
//           className="webcam-button"
//         >
//           {webcamOn ? "Close Webcam" : "Open Webcam"}
//         </button>
//         <button onClick={() => navigate("/")} className="home-button">
//           Go Back Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FaceRecognition;
