// /* global faceapi */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import "../styles/VideoFeed.css";
const FaceRecognition = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const video = document.getElementById("videoInput");

    const start = async () => {
      try {
        console.log("Loading models...");
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        ]);
        console.log("Models loaded");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = stream;

        video.onloadeddata = () => {
          console.log("Video data loaded");
          recognizeFaces();
        };

        setLoading(false);
      } catch (error) {
        console.error(
          "Error loading models or accessing media devices: ",
          error
        );
      }
    };

    const recognizeFaces = async () => {
      const labeledDescriptors = await loadLabeledImages();
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);

      video.addEventListener("play", async () => {
        console.log("Video play event triggered");
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

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

            const canvasCtx = canvas.getContext("2d");
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            const results = resizedDetections.map((d) => {
              const bestMatch = faceMatcher.findBestMatch(d.descriptor);
              return {
                label: bestMatch.label,
                distance: bestMatch.distance,
              };
            });

            results.forEach((result, i) => {
              const box = resizedDetections[i].detection.box;
              const label =
                result.label === "unknown" ? "Unknown" : result.label;
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

    start();

    return () => {};
  }, []);
  return (
    <div>
      <h1>Face Recognition</h1>
      {loading && <p>Loading models...</p>}
      <video id="videoInput" width="720" height="550" muted controls></video>
      <br />
      <button onClick={() => navigate("/")} className="Goback">
        Go Back Home
      </button>
    </div>
  );
};

export default FaceRecognition;
