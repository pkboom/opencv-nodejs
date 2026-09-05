/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import {
  FacemarkAAM, FacemarkAAMParams, FacemarkLBF, FacemarkLBFParams, Point2, Rect,
} from '../../../typings';
import { generateAPITests } from '../../utils/generateAPITests';
import { clearTmpData, getTmpDataFilePath } from '../../utils/testUtils';
import { TestContext } from '../model';

export default (args: TestContext) => (Facemark: typeof FacemarkLBF | typeof FacemarkAAM, FacemarkParams: typeof FacemarkLBFParams | typeof FacemarkAAMParams) => {
  const { getTestImg } = args;

  describe('constructor', () => {
    it('is constructable without args', () => {
      expect(() => new Facemark()).to.not.throw();
    });

    it('is constructable from args', () => {
      const params = new FacemarkParams();
      expect(() => new (Facemark as any)(params).to.not.throw());
    });
  });

  describe('trained model tests', () => {
    let facemark: FacemarkLBF | FacemarkAAM;

    before(() => {
      facemark = new Facemark();
    });

    describe('fit', () => {
      const expectOutput = (res: Point2[][]) => {
        expect(res).to.be.an('array');
      };

      const faces: Rect[] = [];

      generateAPITests({
        getDut: () => facemark,
        methodName: 'fit',
        methodNameSpace: 'Facemark',
        getRequiredArgs: () => [getTestImg().bgrToGray(), faces],
        expectOutput,
      });
    });

    describe('save and load', () => {
      beforeEach(() => {
        clearTmpData();
      });
      afterEach(() => {
        clearTmpData();
      });

      it('should save and load from xml', () => {
        const file = getTmpDataFilePath('testFacemark.xml');
        facemark.save(file);
        const facemarkNew = new Facemark();
        facemarkNew.load(file);
      });
    });
  });
};
