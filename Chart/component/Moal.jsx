const ShowFullImages = ({ image, onClose }) => {
    console.log("images",image,onClose)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded">
          <img src={image} alt="Full Size" />
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  

  export default ShowFullImages