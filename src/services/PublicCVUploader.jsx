import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

const PublicCVUploader = ({ formData, setFormData }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(formData.publicResumeUrl ? "Existing Resume" : null);

  const handleUploadClick = () => {
    document.getElementById('resume-upload-input').click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const storageRef = ref(storage, `resumes/${currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setFormData(prev => ({ ...prev, publicResumeUrl: downloadURL }));
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Upload Resume</h3>
      
      <div 
        className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center mb-4 cursor-pointer hover:bg-white/5 transition-colors group"
        onClick={handleUploadClick}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
          <FileText className="text-red-400" size={24} />
        </div>
        <p className="text-xs text-slate-400">Click to select PDF</p>
      </div>

      {fileName && (
        <div className="flex items-center gap-2 text-sm text-green-400 mb-4 bg-green-500/10 p-2 rounded border border-green-500/20">
          <CheckCircle size={16} />
          <span className="truncate max-w-full">Resume Uploaded: {fileName}</span>
        </div>
      )}

      <input id="resume-upload-input" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />

      <button onClick={handleUploadClick} disabled={uploading} className={`w-full py-2 rounded-lg font-bold text-white transition-all shadow-lg ${uploading ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:brightness-110 shadow-blue-900/20'}`}>
        {uploading ? <div className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Uploading...</div> : "Upload"}
      </button>
    </div>
  );
};

export default PublicCVUploader;