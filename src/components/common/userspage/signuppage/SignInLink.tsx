"use client";

import Link from "next/link";

const SignUpLinks: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 mx-4">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <div className="text-center mt-4">
        <p className="text-gray-500 mb-2">이미 계정이 있으신가요?</p>
        <Link href="/signin" className="text-black underline">
          로그인하기
        </Link>
      </div>
    </>
  );
};

export default SignUpLinks;
