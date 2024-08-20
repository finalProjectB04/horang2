interface PasswordInputProps {
  password: string;
  setPassword: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ password, setPassword }) => (
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-grey-700">
      비밀번호
    </label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      className="mt-1 block w-full sm:max-w-[280px] px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder="비밀번호를 입력해주세요"
    />
  </div>
);

export default PasswordInput;
