import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ImageUpload } from '@/components/products/ImageUpload';
import { createPost } from '@/api/post';
import { CATEGORIES, IMAGE_UPLOAD } from '@/utils/constants';

export const ProductNewPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState({
    images: '',
    title: '',
    category: '',
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 초기화
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImagesChange = (files: File[]) => {
    setImages(files);
    setErrors((prev) => ({ ...prev, images: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      images: '',
      title: '',
      category: '',
      price: '',
    };

    // 이미지 검증
    if (images.length < IMAGE_UPLOAD.minCount) {
      newErrors.images = `이미지는 최소 ${IMAGE_UPLOAD.minCount}개 이상 업로드해야 합니다.`;
    }

    // 제목 검증
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    // 카테고리 검증
    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    // 가격 검증
    const price = parseInt(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = '올바른 가격을 입력해주세요.';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createPost({
        files: images,
        title: formData.title,
        price: parseInt(formData.price),
        category: formData.category,
        description: formData.description || undefined,
      });

      if (response.success) {
        alert(response.message || '게시글이 작성되었습니다.');
        navigate(`/products/${response.postId}`);
      } else {
        alert(response.message || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || '게시글 작성에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-20 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            ← 뒤로가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">내 물건 팔기</h1>
          <p className="text-gray-600 mt-2">물건 정보를 입력하고 판매글을 작성해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 사진 등록 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">사진 등록 *</h3>
            <ImageUpload images={images} onImagesChange={handleImagesChange} error={errors.images} />
          </div>

          {/* 제목 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">제목 *</h3>
            <input
              type="text"
              name="title"
              placeholder="상품명을 입력해주세요"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={50}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.title ? 'border-danger' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.title && <p className="text-sm text-danger">{errors.title}</p>}
              <p className="text-sm text-gray-500 ml-auto">{formData.title.length}/50</p>
            </div>
          </div>

          {/* 카테고리 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">카테고리 *</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.category ? 'border-danger' : 'border-gray-300'
              }`}
            >
              <option value="">카테고리를 선택해주세요</option>
              {CATEGORIES.filter((cat) => cat !== '전체').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-danger mt-2">{errors.category}</p>}
          </div>

          {/* 가격 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">가격 *</h3>
            <div className="relative">
              <input
                type="number"
                name="price"
                placeholder="가격을 입력해주세요"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.price ? 'border-danger' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.price && <p className="text-sm text-danger mt-2">{errors.price}</p>}
          </div>

          {/* 상품 설명 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">상품 설명 (선택)</h3>
            <textarea
              name="description"
              placeholder="상품에 대한 자세한 설명을 입력해주세요&#10;&#10;• 상품 상태&#10;• 구매 시기&#10;• 사용감&#10;• 교환/환불 가능 여부 등"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">{formData.description.length}/1000</p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? '작성 중...' : '작성완료'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
