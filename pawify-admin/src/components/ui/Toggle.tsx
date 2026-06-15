
interface ToggleProps {
  active: boolean
  onChange: () => void
}

export const Toggle = ({ active, onChange }: ToggleProps) => {
  return (
    <button
      role="switch"
      onClick={onChange}
      className={`relative w-13 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${active ? "bg-active-status" : "bg-inactive-status"}`}
    >
      <span
        className={`absolute h-5 w-5 top-0.5 right-6.5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${active ? "translate-x-6" : "-translate-x-1"
          }`}
      />
    </button>

  )
}