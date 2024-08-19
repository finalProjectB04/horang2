import { useModal } from "@/context/modal.context";
import { useState } from "react";

const useCustomConfirm = () => {
  const modal = useModal();
  const [resolveReject, setResolveReject] = useState<{
    resolve: (value: boolean) => void;
    reject: (reason?: string) => void;
  } | null>(null);

  const confirm = (message: string) => {
    return new Promise<boolean>((resolve, reject) => {
      setResolveReject({ resolve, reject });

      const handleConfirmClick = () => {
        resolve(true);
        modal.confirmClose();
      };

      const handleCancelClick = () => {
        resolve(false);
        modal.confirmClose();
      };

      modal.confirmOpen({
        title: "확인",
        content: (
          <div className="text-center">
            <p>{message}</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="px-4 py-1 bg-primary-400 text-white font-semibold border border-grey-200 rounded hover:opacity-85 active:opacity-75"
                onClick={handleConfirmClick}
              >
                확인
              </button>
              <button
                className="px-4 py-1 bg-grey-400 text-white font-semibold border border-grey-200 rounded hover:opacity-85 active:opacity-75"
                onClick={handleCancelClick}
              >
                취소
              </button>
            </div>
          </div>
        ),
      });
    });
  };

  return confirm;
};

export default useCustomConfirm;
