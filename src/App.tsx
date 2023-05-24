import React, { useState } from "react";
import app from './App.module.css'
import cheemImg from './assets/cheem.png'
import catImg from './assets/catmeme.png'

const App: React.FC = () => {
  interface Pet {
    accuracy: number;
    class: string;
  }
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<Pet>({accuracy: 0, class: ''});
  const [showResult, setShowResult] = useState<boolean>(false);
  const acceptedFileTypes = ['image/jpeg', 'image/png'];

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const fileType = file.type;
      const isFileTypeAccepted = acceptedFileTypes.includes(fileType);
      if(isFileTypeAccepted) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
      else {
        alert('Only JPEG and PNG files are accepted');
        setSelectedFile(null);
        setPreviewUrl('');
      }
      
    } else {
      setSelectedFile(null);
    }
  };
  

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("http://127.0.0.1:8000/v1/classify/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      setShowResult(true);
    }
  };
  console.log(result);
  

  return (
    <>
      <div className={app.container}>
        <div className={app.header}>
          <img className={app.headerCheem} src={cheemImg}></img>
          <h5>Dog and Cat Classification with Group 10</h5>
          <img className={app.headerCheem} src={catImg}></img>
        </div>
        <div className={app.content}>
          <input type="file" onChange={handleFileInputChange}/>
          {previewUrl && <img src={previewUrl} alt="preview" className={app.previewPicture}/>}
          {previewUrl && <button onClick={handleFileUpload}>Classification</button>}
          {showResult && <div className={app.popup}>
              <div className={app.popupContent}>
                <div className={app.popupHeader}>
                  <h4>Result</h4>
                </div>
                <div className={app.popupResult}>
                  <p><span>Class:</span> {result.class}</p>
                  <p><span>Accuracy:</span> {result.accuracy}</p>
                  <button onClick={() => {setShowResult(false)}}>Continue</button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default App;
