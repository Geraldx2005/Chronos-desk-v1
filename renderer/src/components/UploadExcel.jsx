import { useState, useCallback, useRef } from "react";
import { CloudUpload } from "@mui/icons-material";
import ExcelJS from "exceljs";

export default function UploadExcel({ setCoupons }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const parseExcelFile = useCallback(async (file) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const buffer = await readFileAsArrayBuffer(file);
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error("No worksheets found in the Excel file");
      }

      const headers = [];
      const firstRow = worksheet.getRow(1);
      
      // Extract headers
      firstRow.eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value?.toString().trim() || `Column${colNumber}`;
      });

      // Extract data rows
      const data = [];
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const rowData = {};
        
        let hasData = false;
        row.eachCell((cell, colNumber) => {
          if (cell.value != null) {
            rowData[headers[colNumber]] = cell.value;
            hasData = true;
          }
        });
        
        if (hasData) {
          data.push(rowData);
        }
      }

      return data;
    } catch (err) {
      throw new Error(`Failed to parse Excel file: ${err.message}`);
    }
  }, []);

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      // Clear the invalid file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await parseExcelFile(file);
      setCoupons(data);
    } catch (err) {
      setError(err.message);
      console.error("Error processing Excel file:", err);
    } finally {
      setIsLoading(false);
      // Reset input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [parseExcelFile, setCoupons]);

  return (
    <div className="flex flex-col items-center gap-3">
      <label className={`
        w-xs h-20 flex justify-center items-center gap-2 px-4 mb-5 
        text-sm text-denim-700 bg-denim-100 border border-denim-700 
        rounded-md cursor-pointer hover:bg-denim-200 transition
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-denim-700 border-t-transparent rounded-full animate-spin" />
            <h1 className="font-bold text-lg">Extracting data from xls...</h1>
          </div>
        ) : (
          <>
            <CloudUpload fontSize="large" />
            <h1 className="font-bold text-lg">Upload file</h1>
          </>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleFile} 
          accept=".xlsx,.xls"
          disabled={isLoading}
        />
      </label>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded border border-red-200 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}