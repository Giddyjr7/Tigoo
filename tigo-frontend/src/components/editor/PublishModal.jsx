import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PublishModal({ isOpen, onClose, postData, isSaving, onSave, existingPost }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(existingPost?.category?.id || '');
    const [tagsInput, setTagsInput] = useState(existingPost?.tags?.map(t => typeof t === 'object' ? t.name : t).join(', ') || '');
    const [coverImage, setCoverImage] = useState(existingPost?.coverImageUrl || '');
    const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (existingPost && isOpen) {
            setSelectedCategory(existingPost.category?.id || '');
            setTagsInput(existingPost.tags?.map(t => typeof t === 'object' ? t.name : t).join(', ') || '');
            setCoverImage(existingPost.coverImageUrl || '');
            setExcerpt(existingPost.excerpt || '');
        }
    }, [existingPost, isOpen]);

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const res = await api.get('/api/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError('Failed to load categories');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleSave = async (status) => {
        setError('');
        if (!postData.title?.trim()) {
            setError('Title cannot be empty');
            return;
        }
        if (!postData.content || Object.keys(postData.content).length === 0) {
            setError('Content cannot be empty');
            return;
        }

        const tagNames = tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        const payload = {
            title: postData.title,
            content: JSON.stringify(postData.content),
            excerpt: excerpt.trim() || null,
            coverImageUrl: coverImage.trim() || null,
            categoryId: selectedCategory ? parseInt(selectedCategory, 10) : null,
            tagNames,
            status: status // 'PUBLISHED' or 'DRAFT'
        };

        try {
            await onSave(payload);
        } catch (err) {
            console.error("Save error:", err);
            setError(err.response?.data?.message || 'Failed to save post. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-bg border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-text-h">Publish Story</h2>
                    <button onClick={onClose} className="p-2 text-text hover:text-text-h transition-colors rounded-full hover:bg-hover">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Category</label>
                        {isLoadingCategories ? (
                            <div className="flex items-center gap-2 text-text text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" /> Loading categories...
                            </div>
                        ) : (
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-social-bg border border-border text-text rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="">Select a category (optional)</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Tags</label>
                        <input 
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="technology, programming, life (comma separated)"
                            className="w-full bg-social-bg border border-border text-text rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Cover Image URL</label>
                        <input 
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-social-bg border border-border text-text rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        {coverImage && (
                            <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden border border-border">
                                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text mb-2">Excerpt</label>
                        <textarea 
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Write a brief summary of your story..."
                            rows={3}
                            className="w-full bg-social-bg border border-border text-text rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        ></textarea>
                        <p className="text-xs text-text-muted mt-1">Optional. If left blank, one will be generated from your content.</p>
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-social-bg flex items-center justify-end gap-4">
                    <button 
                        onClick={() => handleSave('DRAFT')}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-full text-text hover:bg-hover transition-colors disabled:opacity-50"
                    >
                        Save as Draft
                    </button>
                    <button 
                        onClick={() => handleSave('PUBLISHED')}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}
