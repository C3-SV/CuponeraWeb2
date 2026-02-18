export default function Input({ type, placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border-b border-gray-400 bg-transparent py-2 focus:outline-none focus:border-orange-500"
    />
  )
}
