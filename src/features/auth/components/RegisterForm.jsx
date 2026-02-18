import Input from "./Input"
import Button from "./Button"

export default function RegisterForm() {
  return (
    <div className="bg-white w-full max-w-md p-8 shadow-sm rounded-sm">

      <h2 className="text-2xl font-semibold text-center mb-2">
        Crear cuenta
      </h2>

      <p className="text-center text-gray-500 text-sm mb-6">
        Ingrese su información abajo
      </p>

      <div className="space-y-6">
        <Input type="text" placeholder="Nombre" />
        <Input type="text" placeholder="Email" />
        <Input type="password" placeholder="Contraseña" />
      </div>

      <div className="mt-6 space-y-4">
        <Button variant="primary" className="w-full">
          Crear cuenta
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿Ya tiene una cuenta?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Inicie sesión
        </a>
      </p>

    </div>
  )
}
