#include "opencv_modules.h"

#ifdef HAVE_OPENCV_FACE

#include "EigenFaceRecognizer.h"
#include "FisherFaceRecognizer.h"
#include "LBPHFaceRecognizer.h"
#include "face.h"

#include "FacemarkAAM.h"
#include "FacemarkAAMData.h"
#include "FacemarkAAMParams.h"
#include "FacemarkLBF.h"
#include "FacemarkLBFParams.h"

NAN_MODULE_INIT(Face::Init) {
  EigenFaceRecognizer::Init(target);
  FisherFaceRecognizer::Init(target);
  LBPHFaceRecognizer::Init(target);
  FacemarkAAM::Init(target);
  FacemarkAAMData::Init(target);
  FacemarkAAMParams::Init(target);
  FacemarkLBF::Init(target);
  FacemarkLBFParams::Init(target);
};

#endif
