type TextAreaProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export default function TextArea({ label, ...props }: TextAreaProps) {
  return (
    <div>
      {label && (
        <label className="block text-md font-medium text-zinc-700 ml-1">
          <b>{label}</b>
        </label>
      )}
      <textarea
        {...props}
        className="w-full mt-1 px-4 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 placeholder:text-zinc-400"
      />
    </div>
  );
}
