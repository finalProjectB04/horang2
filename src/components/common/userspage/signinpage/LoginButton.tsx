interface LoginButtonProps {
  onClick: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
    로그인
  </button>
);

export default LoginButton;
