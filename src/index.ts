import {camelCase, kebabCase, pascalCase} from 'change-case';
import * as fs from 'fs';

const ignoredDirectoryNames: Array<string> = ['.git', '.github', 'node_modules', 'coverage', 'out', 'dist'];
const fileExtensionsToConsider = ['ts', 'js', 'tsx', 'jsx', 'snap'];
const fileExtensionsToDrop = ['test', 'tests', 'spec', 'specs', 'mock'].concat(fileExtensionsToConsider);

export enum Case {
    Pascal = 'Pascal',
    Camel = 'Camel',
    Kebab = 'Kebab'
}

export class CaseReport {
    constructor(public directory: string, public filenameWithExtensions: string, public fileName: string, public cases: Array<Case>) {
    }

    extensions(): string {
        return this.filenameWithExtensions.replace(this.fileName, '');
    }

    fullQualified(): string {
        return this.directory + '/' + this.filenameWithExtensions;
    }
}

export function filenameWithoutExtension(segment: string): string {
    let withoutExtensions = segment;
    for (let i: number = 0; i < fileExtensionsToDrop.length; ++i) {
        const extension = fileExtensionsToDrop[i];
        if (withoutExtensions.endsWith('.' + extension)) {
            // start at the beginning of the array again
            i = -1;
            withoutExtensions = withoutExtensions.substring(0, withoutExtensions.length - (1 + extension.length));
        }
    }
    return withoutExtensions;
}

const enumToFunction = (cased: Case): (anyCase: string) => string => {
    switch (cased) {
        case Case.Kebab:
            return kebabCase;
        case Case.Camel:
            return camelCase;
        case Case.Pascal:
            return pascalCase;
    }
};

export function sideBySide(report: CaseReport, cases: Array<Case>): string {
    const fileName = filenameWithoutExtension(report.fileName);
    const flup = cases.map(it => enumToFunction(it)(fileName) + report.extensions()).join('\n\t');
    return report.fullQualified() + ':\n\t' + flup + '\n';
}

export const walk = (dir: string): Array<CaseReport> => {
    let results: Array<CaseReport> = [];
    const list = fs.readdirSync(dir);

    list.forEach(function (segment) {
        const fullPath = dir + '/' + segment;
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (ignoredDirectoryNames.includes(segment)) {
                return;
            }
            results = results.concat(walk(fullPath));
        } else if (stat && stat.isFile()) {
            if (fileExtensionsToConsider.some(extension => segment.endsWith(`.${extension}`))) {
                let withoutExtensions = filenameWithoutExtension(segment);

                const cases: Array<Case> = [];
                if (withoutExtensions === camelCase(withoutExtensions)) {
                    cases.push(Case.Camel);
                }
                if (withoutExtensions === pascalCase(withoutExtensions)) {
                    cases.push(Case.Pascal);
                }
                if (withoutExtensions === kebabCase(withoutExtensions)) {
                    cases.push(Case.Kebab);
                }
                let caseReport = new CaseReport(dir, segment, withoutExtensions, cases);
                results.push(caseReport);
            }
        } else {
            throw new Error(fullPath + ' is not file nor a directory');
        }
    });
    return results;
};

function compatibleWith(result: Array<CaseReport>, cased: Case) {
    return result.filter(it => it.cases.includes(cased));
}

export function consistentWithReportLine(result: Array<CaseReport>, cased: Case) {
    let kebabCase = compatibleWith(result, cased);
    return cased + ' ' + result.length + '/' + kebabCase.length + '/' + (result.length - kebabCase.length);
}
