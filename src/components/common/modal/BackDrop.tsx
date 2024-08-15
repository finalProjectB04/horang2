import { PropsWithChildren } from "react";
import ReactDOM from "react-dom";

const BackDrop = ({ children }: PropsWithChildren) => {
  return ReactDOM.createPortal(
    <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-[9999] ">{children}</div>,
    document.body,
  );
};

export default BackDrop;
