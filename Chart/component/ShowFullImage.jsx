import { useEffect, useState } from "react";

function App({ functionName }) {
  const [imageUrls, setImageUrls] = useState([]);
  const [lastFolderName, setLastFolderName] = useState("");

  useEffect(() => {
    if (!functionName) return;

   
    let relativePath = functionName.replace(/^.*?(CameraFails)/, "$1");
    relativePath = relativePath.replace(/\\/g, "/");
    const basePath = "C:/" + relativePath;

  
    const parts = functionName.split(/[/\\]/);
    const lastFolder = parts[parts.length - 1];
    setLastFolderName(lastFolder);

   
    const fetchImages = () => {
      fetch("http://localhost:5000/all-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: basePath }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Images not found");
          return res.json();
        })
        .then((data) => {
            console.log("data",data.images)
           setImageUrls(data.images)
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setImageUrls([]);
        });
    };

    fetchImages();
    const interval = setInterval(fetchImages, 10000); 

    return () => clearInterval(interval);
  }, [functionName]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        All Images in Folder: <span className="text-purple-600">{lastFolderName}</span>
      </h1>
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url.src}
              alt={`Image ${index + 1}`}
              className="w-full object-cover border rounded shadow"
            />
          ))}
        </div>
      ) : (
        <p className="text-red-500">Loading or No images found.</p>
      )}
    </div>
  );
}

export default App;
