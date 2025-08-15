// import { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { CloudUpload as DropCloudIcon } from "lucide-react";

// function UploadForm({ onUpload }) {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadResult, setUploadResult] = useState(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     setSelectedFile(acceptedFiles[0]);
//   }, []);

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const res = await fetch("http://127.0.0.1:5000/watermark", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       setUploadResult(data);
//       if (onUpload) onUpload(data);
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     disabled: uploading,
//   });

//   return (
//     <div className="max-w-md mx-auto mt-10">
//   {/* Dropzone */}
//     <div
//       {...getRootProps()}
//       className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors duration-200
//         ${uploading ? "opacity-50 cursor-not-allowed" : ""}
//         ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
//     >
//       <input {...getInputProps()} />
//       <DropCloudIcon className="text-blue-500 w-16 h-16 mb-4" />
//       <p className="text-gray-600 text-center">
//         {uploading
//           ? "Uploading..."
//           : isDragActive
//           ? "Drop the file here..."
//           : "Drag & drop your image here or click to select"}
//       </p>
//     </div>

//     {/* File info + Upload button */}
//     {selectedFile && (
//       <div className="mt-4 flex justify-between items-center p-2 bg-gray-100 rounded w-full">
//         <p className="text-gray-700 truncate">{selectedFile.name}</p>
//         <button
//           onClick={handleUpload}
//           disabled={uploading}
//           className={`ml-2 px-4 py-2 rounded text-white font-semibold transition
//             ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
//         >
//           {uploading ? "Uploading..." : "Upload"}
//         </button>
//       </div>
//     )}

//     {/* Upload result */}
//     {uploadResult?.image_base64 && (
//       <div className="mt-4 text-center">
//         <p className="text-sm text-green-800 break-all">
//           SHA-256 Hash: <code>{uploadResult.hash}</code>
//         </p>
//         <p className="font-semibold mb-2">Watermarked Image:</p>
//         <img
//           src={`data:image/png;base64,${uploadResult.image_base64}`}
//           alt="Watermarked"
//           className="mx-auto max-w-full rounded-lg border"
//         />
//         <a
//           href={`data:image/png;base64,${uploadResult.image_base64}`}
//           download="watermarked.png"
//           className="mt-2 inline-block px-5 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition"
//         >
//           Download
//         </a>
//       </div>
//     )}
// </div>
//   );
// }

// export default UploadForm;

import { useCallback, useState } from "react";
import { CloudUpload } from "lucide-react";

function UploadForm({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:5000/watermark", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
      if (onUpload) onUpload(data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // Simple dropzone implementation without react-dropzone dependency
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onDrop([files[0]]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onDrop([files[0]]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          w-full h-48 flex flex-col items-center justify-center 
          border-2 border-dashed rounded-xl p-6 cursor-pointer 
          transition-all duration-200 hover:border-blue-400 hover:bg-blue-50
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          ${selectedFile ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"}
        `}
        onClick={() => !uploading && document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <CloudUpload className="text-blue-500 w-16 h-16 mb-4" />
        <p className="text-gray-600 text-center font-medium">
          {uploading
            ? "Uploading..."
            : "Drag & drop your image here or click to select"}
        </p>
        {selectedFile && (
          <p className="text-blue-600 text-sm mt-2 font-semibold">
            {selectedFile.name}
          </p>
        )}
      </div>

      {/* Upload button */}
      {selectedFile && (
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`
              px-8 py-3 rounded-lg font-semibold text-white
              transition-all duration-200 transform hover:scale-105
              ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
              }
            `}
          >
            {uploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload & Watermark"
            )}
          </button>
        </div>
      )}

      {/* Upload result */}
      {uploadResult?.image_base64 && (
        <div className="space-y-4 p-6 bg-white rounded-xl shadow-lg border">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">SHA-256 Hash:</span>
            </p>
            <code className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full break-all">
              {uploadResult.hash}
            </code>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-4">Watermarked Image</h3>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <img
                src={`data:image/png;base64,${uploadResult.image_base64}`}
                alt="Watermarked"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <a
              href={`data:image/png;base64,${uploadResult.image_base64}`}
              download="watermarked.png"
              className="
                inline-flex items-center px-6 py-3 
                bg-green-500 hover:bg-green-600 
                text-white font-semibold rounded-lg 
                shadow-lg hover:shadow-xl 
                transition-all duration-200 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              "
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadForm;