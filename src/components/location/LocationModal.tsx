import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAgree }) => {
  console.log("Modal Props:", { isOpen, onClose, onAgree });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">위치 정보 수신 동의</h2>
        <p className="mb-4">
          본 앱은 내 위치를 기반으로 주변 관광지를 제공합니다.
          <br />
          위치 정보 수신에 동의하시면, 내 위치 반경 50km 내의 관광지를 지도에서 확인할 수 있습니다.
        </p>
        <div className="flex justify-end space-x-4">
          <button onClick={onAgree} className="bg-primary-300 text-white px-4 py-2 rounded hover:bg-primary-500">
            동의
          </button>
          <button onClick={onClose} className="bg-grey-400 text-white px-4 py-2 rounded hover:bg-grey-600">
            거부
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
