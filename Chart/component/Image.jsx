import { useEffect, useState } from "react";

function App({ functionName }) {
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    if (functionName) {
      
      let relativePath = functionName.replace(/^.*?CameraFails/, "CameraFails");

     
      relativePath = relativePath.replace(/\\/g, "/");

     
      setImagePath(`/${relativePath}`);
    }
  }, [functionName]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Image from Public Folder</h1>
      {imagePath && <img src={imagePath} alt="Dynamic" className="w-64 h-auto" />}
    </div>
  );
}

export default App;
