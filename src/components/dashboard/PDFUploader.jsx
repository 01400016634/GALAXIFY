import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { extractResume } from '../../services/gemini';

// Set up the worker for PDF.js (Vite compatible)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PDFUploader = ({ setFormData }) => {
  const [loading, setLoading] = useState(false);

  const readPdfAsText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. BLOCK DOUBLE CLICKS: If we are already loading, do nothing!
    if (loading) return; 

    setLoading(true);

    try {
      // 2. Read the PDF and convert to text
      const fileText = await readPdfAsText(file);

      // 3. Send to Gemini
      const extractedData = await extractResume(fileText);

      // 4. Update your Dashboard state
      if (extractedData) {
        setFormData(prev => ({
          ...prev,
          // Forcefully overwrite the name and designation with AI data!
          personal: { 
            ...prev.personal, 
            name: extractedData.personal?.name || prev.personal.name,
            designation: extractedData.personal?.designation || prev.personal.designation
          },
          // Catch 'about', 'summary', or 'objective' from the resume!
          about: extractedData.about || extractedData.objective || extractedData.summary || prev.about,
          
          skills: extractedData.skills || prev.skills,
          experience: extractedData.experience || prev.experience,
          research: extractedData.research || prev.research,
        }));
        alert("✅ Resume successfully extracted and applied!");
      }
    } catch (error) {
      console.error("PDF Extraction Failed:", error);
      if (error.message && error.message.includes('429')) {
        alert("⏳ Free tier speed limit reached! Please wait exactly 60 seconds before trying again.");
      } else {
        alert("❌ Something went wrong reading the PDF.");
      }
    } finally {
      // 5. UNLOCK THE BUTTON
      setLoading(false);
      // Reset the file input so you can upload the same file again if needed
      e.target.value = null; 
    }
  };

  return (
    <div className="bg-black/20 p-4 rounded-xl border border-white/5 mt-6">
      <h3 className="text-sm font-bold text-white mb-2">Auto-Fill with Resume</h3>
      <label className={`flex items-center justify-center gap-2 w-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-md p-3 transition-colors text-sm font-bold ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-500/20 cursor-pointer'}`}>
        {loading ? "Extracting AI Data (Please Wait)..." : "Upload PDF Resume"}
        <input 
          type="file" 
          accept="application/pdf" 
          className="hidden" 
          onChange={handleFileUpload} 
          disabled={loading} // Physically disable the input while loading
        />
      </label>
    </div>
  );
};

export default PDFUploader;