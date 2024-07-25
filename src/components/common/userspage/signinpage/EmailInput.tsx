interface EmailInputProps {
  email: string;
  setEmail: (value: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => (
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      이메일 주소
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required
    />
  </div>
);

export default EmailInput;
