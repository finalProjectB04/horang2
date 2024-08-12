"use client";

import CommonModal from "@/components/common/modal/CommonModal";
import { createContext, PropsWithChildren, ReactNode, useContext, useState } from "react";

type ModalProps = {
  title: string;
  content: ReactNode | null;
  path?: string;
  type?: "normal" | "confirm";
};

type ModalContextValue = {
  open: (options: ModalProps) => void;
  close: () => void;
  confirmOpen: (options: ModalProps) => void;
  confirmClose: () => void;
};

const initialValue: ModalContextValue = {
  open: () => {},
  close: () => {},
  confirmOpen: () => {},
  confirmClose: () => {},
};

const ModalContext = createContext<ModalContextValue>(initialValue);

export const useModal = () => useContext(ModalContext);
export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modalOptions, setModalElements] = useState<ModalProps | null>(null);
  const [confirmOptions, setConfirmElements] = useState<ModalProps | null>(null);

  const value: ModalContextValue = {
    open: (options: ModalProps) => {
      setModalElements({ ...options, type: "normal" }); // 일반 모달
    },
    close: () => {
      setModalElements(null);
    },
    confirmOpen: (options: ModalProps) => {
      setConfirmElements({ ...options, type: "confirm" }); // 확인 모달
    },
    confirmClose: () => {
      setConfirmElements(null);
    },
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalOptions && (
        <CommonModal
          title={modalOptions.title}
          content={modalOptions.content}
          path={modalOptions.path}
          type={modalOptions.type}
        />
      )}
      {confirmOptions && (
        <CommonModal
          title={confirmOptions.title}
          content={confirmOptions.content}
          path={confirmOptions.path}
          type={confirmOptions.type}
        />
      )}
    </ModalContext.Provider>
  );
};
