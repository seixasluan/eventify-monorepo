type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="bg-indigo-600 text-white py-3 px-5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
    >
      {children}
    </button>
  );
}
