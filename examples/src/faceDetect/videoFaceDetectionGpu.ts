import { Mat } from '@pkboom/opencv-nodejs';
import { cv, getResourcePath } from '../utils.js';
import { runVideoFaceDetection } from './commons.js';

const videoFile = getResourcePath('people.mp4');

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

function detectFaces(img: Mat) {
  const options = {
    scaleFactor: 1.1,
    minNeighbors: 10,
  };
  return classifier.detectMultiScaleGpu(img.bgrToGray(), options).objects;
}

runVideoFaceDetection(videoFile, detectFaces);
