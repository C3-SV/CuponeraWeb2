export default function Button({ children, variant = "primary", className = "", ...props }) {

  const styles = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 border border-orange-600/20",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
  }

  return (
    <button
      {...props}
      className={`px-3 py-1 rounded-sm text-sm h-9 inline-flex items-center justify-center transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
