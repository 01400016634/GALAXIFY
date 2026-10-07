import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { User, Camera, Upload, RefreshCw, Save, Mail, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    bio: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || '',
        bio: 'Creative developer building immersive 3D experiences.' // Placeholder as Auth doesn't store bio by default
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSync = () => {
    // Attempt to find the Google provider data
    const googleProvider = currentUser?.providerData.find(p => p.providerId === 'google.com');
    if (googleProvider?.photoURL) {
      setFormData(prev => ({ ...prev, photoURL: googleProvider.photoURL }));
      setStatus({ type: 'success', message: 'Photo synced from Google!' });
    } else {
      setStatus({ type: 'error', message: 'No linked Google account found.' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a production app, you would upload this file to Firebase Storage here.
      // For this UI demo, we create a local preview URL.
      const localUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, photoURL: localUrl }));
      setStatus({ type: 'success', message: 'Image selected. Click Save to apply.' });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await updateProfile(currentUser, {
        displayName: formData.displayName,
        photoURL: formData.photoURL
      });
      // Note: To save 'bio', you would typically write to a Firestore document here.
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400">Update your personal information here.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Left Section: Profile Picture */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black/40">
                {formData.photoURL ? (
                  <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <User size={64} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition-colors shadow-lg">
                <Camera size={18} className="text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button onClick={handleGoogleSync} className="flex items-center justify-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2 px-4 rounded-lg transition-all">
                <RefreshCw size={14} /> Sync from Google
              </button>
            </div>
          </div>

          {/* Right Section: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><User size={14} /> Full Name</label>
              <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Your Name" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><Mail size={14} /> Email Address</label>
              <input type="email" value={formData.email} disabled className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2"><FileText size={14} /> About Me</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Tell us a bit about yourself..." />
            </div>

            <div className="pt-4 flex items-center justify-between">
              {status.message && (
                <div className={`flex items-center gap-2 text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </div>
              )}
              <button onClick={handleSave} disabled={loading} className={`ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/20 hover:brightness-110 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>{loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;