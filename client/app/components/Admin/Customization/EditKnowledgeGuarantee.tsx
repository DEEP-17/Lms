import { useEditKnowledgeGuaranteeMutation, useGetKnowledgeGuaranteeDataQuery } from '@/redux/features/Layout/layoutApi';
import { Image as ImageIcon, Loader2, Save, Upload } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface KnowledgeGuaranteeData {
  title: string;
  description: string;
  buttonText: string;
  image: string | { public_id: string; url: string };
}


const EditKnowledgeGuarantee: FC = () => {
  const [knowledgeGuarantee, setKnowledgeGuarantee] = useState<KnowledgeGuaranteeData>({
    title: '',
    description: '',
    buttonText: '',
    image: ''
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { data, isLoading: isLoadingData } = useGetKnowledgeGuaranteeDataQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const [editKnowledgeGuarantee, { isLoading: isUpdating }] = useEditKnowledgeGuaranteeMutation();

  useEffect(() => {
    if (data?.layout?.knowledgeGuarantee) {
      console.log('KnowledgeGuarantee data:', data.layout.knowledgeGuarantee);
      setKnowledgeGuarantee(data.layout.knowledgeGuarantee);
      // Handle both string and object image formats from backend
      const imageUrl = typeof data.layout.knowledgeGuarantee.image === 'string'
        ? data.layout.knowledgeGuarantee.image
        : data.layout.knowledgeGuarantee.image?.url || '';
      console.log('Setting previewImage to:', imageUrl);
      setPreviewImage(imageUrl);
    }
  }, [data]);

  // Additional useEffect to ensure previewImage is updated when knowledgeGuarantee.image changes
  useEffect(() => {
    if (knowledgeGuarantee.image) {
      const imageUrl = typeof knowledgeGuarantee.image === 'string'
        ? knowledgeGuarantee.image
        : knowledgeGuarantee.image?.url || '';
      if (imageUrl && !previewImage) {
        console.log('Updating previewImage from knowledgeGuarantee:', imageUrl);
        setPreviewImage(imageUrl);
      }
    }
  }, [knowledgeGuarantee.image, previewImage]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB');
        return;
      }

      setImageFile(file);
      setUploadingImage(true);

      // Create preview and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setPreviewImage(base64Data);
        setKnowledgeGuarantee({
          ...knowledgeGuarantee,
          image: base64Data // Send base64 string to backend
        });
        setUploadingImage(false);
        toast.success('Image selected successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB');
        return;
      }

      setImageFile(file);
      setUploadingImage(true);

      // Create preview and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setPreviewImage(base64Data);
        setKnowledgeGuarantee({
          ...knowledgeGuarantee,
          image: base64Data // Send base64 string to backend
        });
        setUploadingImage(false);
        toast.success('Image selected successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!knowledgeGuarantee.title.trim() || !knowledgeGuarantee.description.trim() || !knowledgeGuarantee.buttonText.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await editKnowledgeGuarantee({
        type: "KnowledgeGuarantee",
        title: knowledgeGuarantee.title,
        description: knowledgeGuarantee.description,
        buttonText: knowledgeGuarantee.buttonText,
        image: knowledgeGuarantee.image
      }).unwrap();
      toast.success('Knowledge Guarantee section updated successfully!');
    } catch{
      toast.error('Failed to update Knowledge Guarantee section');
    }
  };

  const RequiredStar = () => <span className="text-red-500 ml-1">*</span>;

  if (isLoadingData) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Knowledge Guarantee</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage the knowledge guarantee section of your landing page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Section Title <RequiredStar />
              </label>
              <input
                type="text"
                required
                value={knowledgeGuarantee.title}
                onChange={(e) => setKnowledgeGuarantee({ ...knowledgeGuarantee, title: e.target.value })}
                placeholder="Guarantee of Knowledge"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Description <RequiredStar />
              </label>
              <textarea
                required
                value={knowledgeGuarantee.description}
                onChange={(e) => setKnowledgeGuarantee({ ...knowledgeGuarantee, description: e.target.value })}
                placeholder="Describe your knowledge guarantee and training expertise..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none"
              />
            </div>

            {/* Button Text */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Button Text <RequiredStar />
              </label>
              <input
                type="text"
                required
                value={knowledgeGuarantee.buttonText}
                onChange={(e) => setKnowledgeGuarantee({ ...knowledgeGuarantee, buttonText: e.target.value })}
                placeholder="Explore Courses"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Section Image
            </label>
            <input
              type="file"
              accept="image/*"
              id="knowledge-guarantee-image"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploadingImage}
            />
            <label
              htmlFor="knowledge-guarantee-image"
              className={`w-full h-[300px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer relative transition-all duration-300 group ${uploadingImage
                ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-700/50 cursor-not-allowed'
                : dragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadingImage ? (
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Processing image...
                  </p>
                </div>
              ) : (previewImage || (typeof knowledgeGuarantee.image === 'string' ? knowledgeGuarantee.image : knowledgeGuarantee.image?.url)) ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewImage || (typeof knowledgeGuarantee.image === 'string' ? knowledgeGuarantee.image : knowledgeGuarantee.image?.url)}
                    alt="Knowledge Guarantee Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Click or drag to change image</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-xl border-2 border-gray-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
                {knowledgeGuarantee.title || 'Knowledge Guarantee Title'}
              </h2>
              <p className="text-black dark:text-gray-400 mb-8 max-w-xl leading-relaxed text-lg">
                {knowledgeGuarantee.description || 'Knowledge guarantee description will appear here...'}
              </p>
              <button>
                {knowledgeGuarantee.buttonText || 'Button Text'}
              </button>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img
                src={previewImage || (typeof knowledgeGuarantee.image === 'string' ? knowledgeGuarantee.image : knowledgeGuarantee.image?.url) || '/knowledge.png'}
                alt="Knowledge Guarantee"
                className="rounded-2xl shadow-xl w-full max-w-md object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isUpdating || uploadingImage}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-cyan-50 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold transition cursor-pointer"
          >
            <Save className="h-5 w-5" />
            <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditKnowledgeGuarantee; 