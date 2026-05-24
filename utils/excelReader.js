// ─────────────────────────────────────────────────────────────────────────────
// FILE: utils/excelReader.js
// PURPOSE: Reusable Excel data reader for Data-Driven Testing
// AUTHOR: QA Automation Team
// ─────────────────────────────────────────────────────────────────────────────

// LINE 1: Import the 'xlsx' package (SheetJS) using CommonJS require()
// This gives us the 'XLSX' object with methods to read workbooks and sheets
const XLSX = require('xlsx');

// LINE 2: Import Node.js built-in 'path' module
// We use path.resolve() to build absolute file paths
// This ensures the file path works regardless of which directory you run the test from
const path = require('path');

// LINE 3: Import Node.js built-in 'fs' (File System) module
// Used to check if the Excel file exists BEFORE attempting to read it
// Without this check, a missing file would throw an unhelpful "file not found" crash
const fs = require('fs');


// ─────────────────────────────────────────────────────────────────────────────
// CLASS: ExcelReader
// A class-based module gives us a clean API and makes it reusable
// across multiple spec files (login, registration, profile, etc.)
// ─────────────────────────────────────────────────────────────────────────────
class ExcelReader {

  // ──────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // Called when you do: new ExcelReader('./testData/loginTestData.xlsx')
  // @param {string} filePath - Relative path to the Excel file
  // ──────────────────────────────────────────────────────────────────────────
  constructor(filePath) {

    // path.resolve() converts a relative path to an absolute path
    // process.cwd() returns the current working directory (the project root when
    // you run 'npx playwright test')
    // Example: '/home/user/project/testData/loginTestData.xlsx'
    this.filePath = path.resolve(process.cwd(), filePath);

    // Store the sheet name — defaults to the first sheet if not specified
    // We'll use null here and handle it in the read method
    this.sheetName = null;
  }


  // ──────────────────────────────────────────────────────────────────────────
  // METHOD: readSheet(sheetName)
  // Reads ALL rows from a specific sheet and returns them as objects
  // @param {string} sheetName - Optional. Defaults to first sheet if not provided.
  // @returns {Array} - Array of row objects with column names as keys
  // ──────────────────────────────────────────────────────────────────────────
  readSheet(sheetName) {

    // SAFETY CHECK: Verify the file exists before trying to read it
    // fs.existsSync() returns true/false — it does NOT throw an error if missing
    // This gives us a clean, descriptive error message instead of a raw crash
    if (!fs.existsSync(this.filePath)) {
      // throw new Error() stops execution and reports the issue clearly
      // Including the full path in the error helps diagnose path mismatches
      throw new Error(
        `[ExcelReader] File not found: ${this.filePath}\n
         Ensure the file exists and the path is correct relative to project root.`
      );
    }

    // XLSX.readFile() reads the physical .xlsx file from disk
    // It parses the binary .xlsx format and returns a "workbook" object
    // The workbook contains all sheets, named ranges, and metadata
    const workbook = XLSX.readFile(this.filePath);

    // Determine which sheet to read:
    // If caller provided a sheetName, use it. Otherwise use the first sheet.
    // workbook.SheetNames is an array of all sheet names: ['Sheet1', 'LoginData', ...]
    // workbook.SheetNames[0] is always the first (leftmost) tab
    const targetSheet = sheetName || workbook.SheetNames[0];

    // SAFETY CHECK: Verify the named sheet actually exists in this workbook
    // Prevents cryptic errors from typos like 'LoginDat' instead of 'LoginData'
    if (!workbook.SheetNames.includes(targetSheet)) {
      throw new Error(
        `[ExcelReader] Sheet "${targetSheet}" not found.\n
         Available sheets: ${workbook.SheetNames.join(', ')}`
      );
    }

    // workbook.Sheets is an object: { 'Sheet1': {cellData...}, 'Sheet2': {cellData...} }
    // We access our target sheet's raw cell data using bracket notation
    const worksheet = workbook.Sheets[targetSheet];

    // XLSX.utils.sheet_to_json() converts the worksheet into an array of objects
    // Each row becomes an object: { TC_ID: 'TC001', Username: 'admin', ... }
    // The FIRST row becomes the object keys (column headers)
    // Options:
    //   defval: '' — if a cell is empty, use empty string instead of undefined
    //               Without this, missing cells are omitted from the row object entirely
    //   raw: false — convert all values to strings (prevents numbers being returned as numbers)
    //               This ensures TC_ID '001' stays '001' not 1
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: false
    });

    // Log a summary to help with debugging during development
    // console.info does NOT appear in Playwright's test output (goes to stderr)
    console.info(`[ExcelReader] Read ${rows.length} rows from sheet: ${targetSheet}`);

    return rows;
  }


  // ──────────────────────────────────────────────────────────────────────────
  // METHOD: getTestData(sheetName)
  // The PRIMARY method used by spec files.
  // Reads ALL rows → filters to Run=Y → returns only executable test cases
  // @param {string} sheetName - Optional sheet name
  // @returns {Array} - Only rows where Run column equals 'Y'
  // ──────────────────────────────────────────────────────────────────────────
  getTestData(sheetName) {

    // Get all rows from the sheet using readSheet()
    // This will throw an error if the file or sheet doesn't exist
    const allRows = this.readSheet(sheetName);

    // .filter() creates a NEW array containing only rows that pass the test
    // We check if the Run column (trimmed, uppercased) equals 'Y'
    // .trim() removes accidental spaces: ' Y ' becomes 'Y'
    // .toUpperCase() handles lowercase: 'y' becomes 'Y'
    const filteredRows = allRows.filter(row => {
      const runFlag = String(row.Run).trim().toUpperCase();
      return runFlag === 'Y';
    });

    // Warn if no rows are marked for execution — likely a data setup issue
    if (filteredRows.length === 0) {
      console.warn('[ExcelReader] WARNING: No rows with Run=Y found. Check your Excel file.');
    }

    console.info(`[ExcelReader] Executing ${filteredRows.length} of ${allRows.length} rows (Run=Y)`);

    return filteredRows;
  }


  // ──────────────────────────────────────────────────────────────────────────
  // STATIC FACTORY METHOD: fromFile(filePath)
  // Convenience method — lets you skip 'new ExcelReader(...)' when you just
  // want the data in one line: ExcelReader.fromFile('./path').getTestData()
  // @param {string} filePath - Path to the Excel file
  // @returns {ExcelReader} - A new ExcelReader instance
  // ──────────────────────────────────────────────────────────────────────────
  static fromFile(filePath) {
    return new ExcelReader(filePath);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// EXPORT: CommonJS module export
// module.exports makes ExcelReader available when other files do:
//   const ExcelReader = require('../utils/excelReader');
// This is the CommonJS equivalent of: export default ExcelReader
// ─────────────────────────────────────────────────────────────────────────────
module.exports = ExcelReader;