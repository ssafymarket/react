import { useState, useRef, ChangeEvent } from 'react';
import { IMAGE_UPLOAD } from '@/utils/constants';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (files: File[]) => void;
  error?: string;
}

export const ImageUpload = ({ images, onImagesChange, error }: ImageUploadProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 현재 이미지 + 새로운 이미지가 최대 개수를 초과하는지 확인
    const totalFiles = images.length + files.length;

    if (totalFiles > IMAGE_UPLOAD.maxCount) {
      alert(`이미지는 최대 ${IMAGE_UPLOAD.maxCount}개까지 업로드 가능합니다.`);
      return;
    }

    // 파일 타입 검증
    const invalidFiles = files.filter(
      (file) => !IMAGE_UPLOAD.acceptedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert('JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증
    const maxSizeBytes = IMAGE_UPLOAD.maxSizeMB * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSizeBytes);

    if (oversizedFiles.length > 0) {
      alert(`각 이미지는 ${IMAGE_UPLOAD.maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    // 이미지 추가
    const newImages = [...images, ...files];
    onImagesChange(newImages);

    // 미리보기 URL 생성
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // 미리보기 URL 해제 및 제거
    URL.revokeObjectURL(previewUrls[index]);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);

    const newPreviewUrls = [...previewUrls];
    const [movedUrl] = newPreviewUrls.splice(fromIndex, 1);
    newPreviewUrls.splice(toIndex, 0, movedUrl);
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          상품 이미지 ({images.length}/{IMAGE_UPLOAD.maxCount})
        </label>
        {images.length < IMAGE_UPLOAD.maxCount && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            이미지 추가
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_UPLOAD.acceptedTypes.join(',')}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
          >
            <img
              src={url}
              alt={`미리보기 ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* 순서 표시 */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded">
              {index + 1}
            </div>

            {/* 컨트롤 버튼 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              {/* 왼쪽으로 이동 */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleMoveImage(index, index - 1)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="왼쪽으로 이동"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* 삭제 */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-2 bg-danger text-white rounded-full hover:bg-red-600 transition-colors"
                title="삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 오른쪽으로 이동 */}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleMoveImage(index, index + 1)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="오른쪽으로 이동"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* 첫 이미지 추가 영역 */}
        {images.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">
              이미지 추가
              <br />
              (최소 {IMAGE_UPLOAD.minCount}개)
            </span>
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        • 이미지는 {IMAGE_UPLOAD.minCount}~{IMAGE_UPLOAD.maxCount}개까지 업로드 가능합니다.
        <br />
        • 각 이미지는 {IMAGE_UPLOAD.maxSizeMB}MB 이하여야 합니다.
        <br />
        • 첫 번째 이미지가 대표 이미지로 표시됩니다.
      </p>
    </div>
  );
};
