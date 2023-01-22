/// <reference lib="webworker" />

import { NormalizeCommonJSImport } from '../functions/normalize-common-js-import.funtion';


addEventListener('message', async ({ data: input }) => {
  let response;
  const parser = await NormalizeCommonJSImport(import('xlsx-populate/browser/xlsx-populate.min'));
  response = await (await import('../functions/xlsx.function')).ProcessReport(parser, input);
  postMessage(response);
});
