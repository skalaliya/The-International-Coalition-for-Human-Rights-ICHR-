import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Video, FileText, Image as ImageIcon, LayoutDashboard, LogOut, CheckCircle, UploadCloud, Link as LinkIcon, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { newsItems, videoItems, addNews, deleteNews, addVideo, deleteVideo, login, logout, isAuthenticated } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'videos'>('overview');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Form States
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // News Form
  const [newsForm, setNewsForm] = useState({ title: '', summary: '', source: '', category: 'News' });
  const [newsFile, setNewsFile] = useState<File | null>(null);

  // Video Form
  const [videoForm, setVideoForm] = useState({ title: '', description: '', duration: '', videoUrl: '' });
  const [videoThumbFile, setVideoThumbFile] = useState<File | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (!success) {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('title', newsForm.title);
    formData.append('summary', newsForm.summary);
    formData.append('source', newsForm.source || 'ICHR Admin');
    formData.append('category', newsForm.category);
    formData.append('date', new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    if (newsFile) {
        formData.append('image', newsFile);
    }

    const success = await addNews(formData);

    setIsUploading(false);
    if (success) {
        setIsAddingNews(false);
        setNewsForm({ title: '', summary: '', source: '', category: 'News' });
        setNewsFile(null);
    } else {
        alert("Failed to create news article. Check server connection.");
    }
  };

  const submitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('title', videoForm.title);
    formData.append('description', videoForm.description);
    formData.append('duration', videoForm.duration || '00:00');
    formData.append('date', new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    formData.append('videoUrl', videoForm.videoUrl || '#');
    if (videoThumbFile) {
        formData.append('thumbnail', videoThumbFile);
    }

    const success = await addVideo(formData);

    setIsUploading(false);
    if (success) {
        setIsAddingVideo(false);
        setVideoForm({ title: '', description: '', duration: '', videoUrl: '' });
        setVideoThumbFile(null);
    } else {
        alert("Failed to create video. Check server connection.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1F4E6F] rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">ICHR CMS Portal</h2>
            <p className="text-slate-500 mt-2">Secure Backend Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                className={`w-full px-4 py-3 rounded-lg border ${loginError ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-[#1F4E6F] outline-none transition-all`}
                placeholder="Hint: admin"
              />
              {loginError && <p className="text-red-500 text-xs mt-2">Invalid credentials</p>}
            </div>
            <button className="w-full bg-[#1F4E6F] hover:bg-[#163a55] text-white font-bold py-3 rounded-lg transition-colors shadow-md">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1F4E6F] text-white flex-shrink-0">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold">ICHR Backend</h2>
          <p className="text-xs text-blue-300 mt-1">v3.0.0 (API Connected)</p>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'news' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}
          >
            <FileText className="w-5 h-5" /> News & Blogs
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'videos' ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}
          >
            <Video className="w-5 h-5" /> Videos
          </button>
        </nav>
        <div className="p-4 mt-auto border-t border-blue-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-blue-200 hover:text-white px-4 py-2">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">System Overview</h1>
            <p className="text-slate-500 mb-8">Connected to production database (SQLite)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 font-medium">Published Articles</h3>
                  <FileText className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{newsItems.length}</p>
                <p className="text-sm text-green-500 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> API Sync Active</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 font-medium">Uploaded Videos</h3>
                  <Video className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{videoItems.length}</p>
                <p className="text-sm text-green-500 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> API Sync Active</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Backend Connection Established</h3>
              <p className="text-blue-700">All content is being served from the local Express server. File uploads are persisted to disk.</p>
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="max-w-5xl animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Manage News & Blogs</h1>
              <button 
                onClick={() => setIsAddingNews(!isAddingNews)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                {isAddingNews ? 'Cancel' : <><Plus className="w-5 h-5" /> Add New Article</>}
              </button>
            </div>

            {isAddingNews && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8 animate-fade-in">
                <h3 className="text-xl font-bold mb-6 text-slate-800">Create New Article</h3>
                <form onSubmit={submitNews} className="space-y-6">
                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                      <input 
                        required
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                        className="w-full px-4 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                      <select 
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                        className="w-full px-4 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none"
                      >
                        <option value="News">News</option>
                        <option value="Blog">Blog</option>
                        <option value="Press Release">Press Release</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Summary</label>
                    <textarea 
                      required
                      value={newsForm.summary}
                      onChange={(e) => setNewsForm({...newsForm, summary: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" 
                    />
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNewsFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="news-upload"
                    />
                    <label htmlFor="news-upload" className="cursor-pointer flex flex-col items-center">
                      {newsFile ? (
                        <div className="flex items-center gap-2 text-rose-500 font-bold">
                            <CheckCircle className="w-5 h-5" /> {newsFile.name}
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 text-slate-300 mb-2" />
                          <span className="text-slate-600 font-medium">Upload Cover Image (Max 10MB)</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button disabled={isUploading} type="submit" className="bg-[#1F4E6F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#163a55] disabled:opacity-50">
                      {isUploading ? 'Uploading...' : 'Publish Article'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {newsItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <img src={item.imageUrl} alt="" className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-rose-500 uppercase">{item.category}</span>
                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500 truncate">{item.summary}</p>
                    <span className="text-xs text-slate-400 mt-1 block">{item.date}</span>
                  </div>
                  <button onClick={() => deleteNews(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO TAB */}
        {activeTab === 'videos' && (
          <div className="max-w-5xl animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Manage Videos</h1>
              <button 
                onClick={() => setIsAddingVideo(!isAddingVideo)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                {isAddingVideo ? 'Cancel' : <><Plus className="w-5 h-5" /> Add New Video</>}
              </button>
            </div>

            {isAddingVideo && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8 animate-fade-in">
                <h3 className="text-xl font-bold mb-6 text-slate-800">Upload New Video</h3>
                <form onSubmit={submitVideo} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Video Title</label>
                      <input 
                        required
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                        className="w-full px-4 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (e.g. 12:45)</label>
                      <input 
                        value={videoForm.duration}
                        onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                        className="w-full px-4 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea 
                      required
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-2 rounded border border-slate-300 focus:ring-2 focus:ring-[#1F4E6F] outline-none" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Thumbnail Upload */}
                     <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setVideoThumbFile(e.target.files?.[0] || null)}
                        className="hidden" 
                        id="video-thumb-upload"
                      />
                      <label htmlFor="video-thumb-upload" className="cursor-pointer flex flex-col items-center">
                        {videoThumbFile ? (
                           <div className="flex items-center gap-2 text-rose-500 font-bold">
                            <CheckCircle className="w-5 h-5" /> {videoThumbFile.name}
                           </div>
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                            <span className="text-sm text-slate-600">Upload Thumbnail (Image)</span>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Video Source */}
                    <div className="border border-slate-200 rounded-lg p-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <LinkIcon className="w-4 h-4" /> Embed External URL
                        </label>
                        <input 
                            placeholder="https://youtube.com/..."
                            value={videoForm.videoUrl}
                            onChange={(e) => { setVideoForm({...videoForm, videoUrl: e.target.value}); }}
                            className="w-full px-3 py-2 rounded border border-slate-300 text-sm"
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            To maintain backend performance in this demo, we recommend using external URLs (YouTube/Vimeo). 
                            File upload for raw video is not enabled in this specific form view to save bandwidth.
                        </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button disabled={isUploading} type="submit" className="bg-[#1F4E6F] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#163a55] disabled:opacity-50">
                        {isUploading ? 'Uploading...' : 'Add Video'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                  <div className="relative aspect-video bg-slate-900">
                    <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{item.duration}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                       <button onClick={() => deleteVideo(item.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                    <p className="text-xs text-slate-400 mt-3">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};