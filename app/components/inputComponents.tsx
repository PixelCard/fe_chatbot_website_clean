interface InputFieldProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute; // Type an toàn cho thẻ input (text, email, password, tel...)
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type = 'text', 
  placeholder, 
  name 
}) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <input 
        type={type} 
        id={name}
        name={name}
        placeholder={placeholder} 
        className="w-full rounded border border-gray-300 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 transition-colors focus:border-[#6bb536] focus:outline-none focus:ring-1 focus:ring-[#6bb536]"
      />
    </div>
  );
};

export { InputField };