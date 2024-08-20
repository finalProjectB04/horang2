interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => (
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-grey-700">
      이메일 주소
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      className="mt-1 block w-full sm:max-w-[280px] px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder="이메일을 입력해주세요"
    />
  </div>
);

export default EmailInput;
