import Link from "next/link";

const SignInLink: React.FC = () => (
  <div className="text-center mt-4">
    <p className="text-grey-500 mb-2">계정이 없으신가요?</p>
    <Link href="/signup" className="text-black underline">
      회원가입
    </Link>
  </div>
);

export default SignInLink;
