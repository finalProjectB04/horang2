import { PropsWithChildren } from "react";
import ReactDOM from "react-dom";

const BackDrop = ({ children }: PropsWithChildren) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex justify-center items-center">{children}</div>,
    document.body,
  );
};

export default BackDrop;
