export default function Button({ children, variant = "primary" }) {

  const styles = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
  }

  return (
    <button
      className={`px-4 py-2 rounded-md transition ${styles[variant]}`}
    >
      {children}
    </button>
  )
}
