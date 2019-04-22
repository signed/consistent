import { filenameWithoutExtension, walk } from '../src/index';

describe('filenameWithoutExtension', () => {
    it('should drop single extension', () => {
        expect(filenameWithoutExtension('juhu.ts')).toEqual('juhu');
    });
    it('should drop multiple extensions', () => {
        expect(filenameWithoutExtension('juhu.test.ts')).toEqual('juhu');
    });
});

describe('integration run', () => {
    it('should ', () => {
        let result = walk('.');
        //result.forEach(console.log);
        let noCaseDetected = result.filter(it => it.cases.length === 0);
        console.log("total: "+ result.length);
        console.log('no case: ' + noCaseDetected.length);
        noCaseDetected.forEach(report => console.log(report.filenameWithExtensions));
    });
});
