import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import iconCamera from '@/assets/icon_camera.svg';

export const ProductNewPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
  });

  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      alert('이미지는 최대 10장까지 업로드 가능합니다.');
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 호출
    alert('작성완료!');
    navigate('/');
  };

  const handleSaveDraft = () => {
    // TODO: 임시저장 API 호출
    alert('임시저장되었습니다.');
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
            <h3 className="font-bold text-gray-900 mb-4">사진 등록</h3>
            <div className="flex gap-4">
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <img src={iconCamera} alt="" className="w-8 h-8 mb-2" />
                <span className="text-sm text-gray-600">{images.length}/10</span>
              </label>
              {/* 업로드된 이미지 미리보기 */}
              {images.map((image, index) => (
                <div key={index} className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`업로드 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">제목</h3>
            <input
              type="text"
              name="title"
              placeholder="상품명을 입력해주세요"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">{formData.title.length}/50</p>
          </div>

          {/* 카테고리 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">카테고리</h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">카테고리를 선택해주세요</option>
              <option value="전자기기">전자기기</option>
              <option value="의류">의류</option>
              <option value="도서">도서</option>
              <option value="가구">가구</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 가격 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">가격</h3>
            <input
              type="number"
              name="price"
              placeholder="가격을 입력해주세요"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 상품 설명 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">상품 설명</h3>
            <textarea
              name="description"
              placeholder="상품에 대한 자세한 설명을 입력해주세요&#10;&#10;• 상품 상태&#10;• 구매 시기&#10;• 사용감&#10;• 교환/환불 가능 여부 등"
              value={formData.description}
              onChange={handleChange}
              required
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
              onClick={handleSaveDraft}
              className="px-8 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              임시저장
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              작성완료
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
