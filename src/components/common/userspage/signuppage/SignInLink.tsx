import Link from "next/link";

const SignUpLinks: React.FC = () => {
  return (
    <div className="text-center mt-4">
      <p className="text-gray-500 mb-2">이미 계정이 있으신가요?</p>
      <Link href="/signin" className="text-black underline">
        로그인하기
      </Link>
    </div>
  );
};

export default SignUpLinks;
