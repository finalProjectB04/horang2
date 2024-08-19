import React from "react";

type PermissionGuideModalProps = {
  onClose: () => void;
};

const PermissionGuideModal: React.FC<PermissionGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4">내 위치 설정</h2>
        <p className="mb-4 text-grey-700">사용기기의 설정에서 &quot;위치정보&quot; 사용을 허용해 주시기 바랍니다.</p>
        <p className="mb-4 text-grey-700">설정 - 개인정보 보호 및 보안 - 위치 서비스 - 위치 서비스</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary-400 text-white rounded">
          확인
        </button>
      </div>
    </div>
  );
};

export default PermissionGuideModal;
