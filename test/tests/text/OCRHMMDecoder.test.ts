import path from 'path';
import { expect } from 'chai';
import { getTestContext } from '../model';
import { generateAPITests } from '../../utils/generateAPITests';
import { OCRHMMDecoderRunWithInfoRet, OCRHMMDecoder } from '../../../typings';
import toTest from '../toTest';

if (toTest.text) {
  const { cv, getTestImg } = getTestContext();

  const getClassifier = () => cv.loadOCRHMMClassifierCNN(path.resolve('../data/text-models/OCRBeamSearch_CNN_model_data.xml.gz'));

  const getMask = () => new cv.Mat(getTestImg().rows, getTestImg().cols, cv.CV_8U, 1);

  describe('constructor', () => {
    /* missing */
  });

  const vocabulary = 'abcdefghijklmnopqrstuvwxyz';
  const transitionP = new cv.Mat(62, 62, cv.CV_64F, 1.0);
  const emissionP = cv.Mat.eye(62, 62, cv.CV_64F);

  describe('run', () => {
    const confidence = 1;

    let dut: OCRHMMDecoder;
    before(() => {
      dut = new cv.OCRHMMDecoder(getClassifier(), vocabulary, transitionP, emissionP);
    });

    generateAPITests({
      getDut: () => dut,
      methodName: 'run',
      methodNameSpace: 'OCRHMMDecoder',
      getRequiredArgs: () => ([
        getTestImg().bgrToGray(),
        confidence,
      ]),
      getOptionalArg: getMask,
      expectOutput: (ret: string) => {
        expect(ret).to.be.an('string');
      },
    });
  });

  describe('runWithInfo', () => {
    let dut: OCRHMMDecoder;
    before(() => {
      dut = new cv.OCRHMMDecoder(getClassifier(), vocabulary, transitionP, emissionP);
    });

    generateAPITests({
      getDut: () => dut,
      methodName: 'runWithInfo',
      methodNameSpace: 'OCRHMMDecoder',
      getRequiredArgs: () => ([
        getTestImg().bgrToGray(),
      ]),
      getOptionalArg: getMask,
      expectOutput: (ret: OCRHMMDecoderRunWithInfoRet) => {
        expect(ret).to.have.property('outputText');
        expect(ret).to.have.property('rects');
        expect(ret).to.have.property('words');
        expect(ret).to.have.property('confidences');
      },
    });
  });
}
