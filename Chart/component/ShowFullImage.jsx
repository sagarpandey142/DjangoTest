import { useEffect, useState } from "react";

function App({ functionName,onImageClick ,setShowModal,setModalImage}) {
  const [imageUrls, setImageUrls] = useState([]);
  const [lastFolderName, setLastFolderName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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
          setImageUrls(data.images);
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

  useEffect(() => {
    const handleClick = (e) => {
      
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  console.log("seke",selectedImage)
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        All Images in Folder:{" "}
        <span className="text-purple-600">{lastFolderName}</span>
      </h1>
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-[9999]"  onClick={(e) => e.stopPropagation()}  onMouseDown={(e)=>e.stopPropagation()} >
          {imageUrls.map((url, index) => (
            <div 
              key={index}
              className="relative cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation();
              
              setSelectedImage(url.src)
              onImageClick?.(url.src);
              setModalImage(url.src)
              setShowModal(true)
             
            }}
          >
            <img
              src={url.src}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover border rounded shadow hover:scale-105 transition-transform duration-200"
              // Remove all click handlers from the img element
            />
          </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500">Loading or No images found.</p>
      )}

      {selectedImage && (
  <div className="fixed inset-0 z-[9999] bg-blue-900 bg-opacity-90 flex items-center justify-center pointer-events-auto" onClick={(e) => e.stopPropagation()}  onMouseDown={(e)=>e.stopPropagation()}>
    <div className="relative w-full max-w-[90vw]  bg-white rounded-lg p-4 shadow-lg overflow-hidden">
      <button
        className="absolute top-10 right-2 bg-white text-black text-xl rounded-full px-3 py-1 shadow hover:bg-gray-300 z-10"
        onClick={(e) => {
          e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation();
          setSelectedImage(false);
          setShowModal(false); 
        }}
      >
        ✕
      </button>
      <img
        src={selectedImage}
        alt="Full View"
        className="max-h-[80vh] w-full object-contain rounded"
      />
    </div>
  </div>
)}


    </div>
  );
}

export default App;
