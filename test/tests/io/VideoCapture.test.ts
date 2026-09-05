 
import { VideoCapture } from '@pkboom/opencv-nodejs';
import { expect } from 'chai';
import path from 'path';
import { assertMetaData } from '../../utils/matTestUtils';
import { getTestContext } from '../model';
import toTest from '../toTest';

if (toTest.io && !process.env.BINDINGS_DEBUG) {
  const { cv, getTestVideoPath } = getTestContext();

  describe('constructor', () => {
    it(`can be opened from valid video file ${path.resolve(getTestVideoPath())}`, () => {
      expect(() => new cv.VideoCapture(getTestVideoPath())).to.not.throw();
    });
  });

  describe('constructor with specified caps', () => {
    it(`can be opened from valid video file ${path.resolve(getTestVideoPath())}`, () => {
      expect(() => new cv.VideoCapture(getTestVideoPath(), cv.CAP_ANY)).to.not.throw();
    });
  });

  describe(`read cap ${getTestVideoPath()}`, () => {
    let cap: VideoCapture | undefined;
    before(() => {
      cap = new cv.VideoCapture(getTestVideoPath());
    });

    describe('sync', () => {
      it('should read a frame', () => {
        const frame = cap.read();
        expect(frame).to.be.instanceOf(cv.Mat);
        assertMetaData(frame)(360, 640, cv.CV_8UC3);
      });
    });

    describe('async', () => {
      it('should read a frame', async () => {
        const frame = await cap.readAsync();
        expect(frame).to.be.instanceOf(cv.Mat);
        assertMetaData(frame)(360, 640, cv.CV_8UC3);
      });
    });
  });

  describe('VideoCapture properties', () => {
    it(`should get properties ${getTestVideoPath()}`, () => {
      const cap = new cv.VideoCapture(getTestVideoPath());
      expect(cap.get(cv.CAP_PROP_FRAME_WIDTH)).to.equal(640);
      expect(cap.get(cv.CAP_PROP_FRAME_HEIGHT)).to.equal(360);
    });
  });

  const expectSeekedNear = (cap: VideoCapture, requestedMsec: number) => {
    const msec = cap.get(cv.CAP_PROP_POS_MSEC);
    const frameIntervalMsec = 1000 / cap.get(cv.CAP_PROP_FPS);
    expect(Math.abs(msec - requestedMsec)).to.be.at.most(
      frameIntervalMsec,
      `seeking to ${requestedMsec}ms landed at ${msec}ms, more than one frame (${frameIntervalMsec}ms) away`,
    );
  };

  describe('VideoCapture set', () => {
    it(`should set properties ${getTestVideoPath()}`, () => {
      const cap = new cv.VideoCapture(getTestVideoPath());
      const wasSet = cap.set(cv.CAP_PROP_POS_MSEC, 1000);
      expect(wasSet).to.equal(true);
      expectSeekedNear(cap, 1000);
    });
  });

  describe('VideoCapture setAsync', () => {
    it(`should set properties ${getTestVideoPath()}`, async () => {
      const cap = new cv.VideoCapture(getTestVideoPath());
      const wasSet = await cap.setAsync(cv.CAP_PROP_POS_MSEC, 1000);
      expect(wasSet).to.equal(true);
      expectSeekedNear(cap, 1000);
    });
  });
}
