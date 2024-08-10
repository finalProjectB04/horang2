import KakaoLoginButton from "../loginbutton/kakaologin/KakaoLoginButton";
import GoogleLoginButton from "../loginbutton/googleLoginbutton/GoogleLoginButton";

const SocialLoginButtons: React.FC = () => (
  <div className="flex flex-col space-y-4 mt-4 w-full max-w-full sm:max-w-[280px]">
    <KakaoLoginButton />
    <GoogleLoginButton />
  </div>
);

export default SocialLoginButtons;
