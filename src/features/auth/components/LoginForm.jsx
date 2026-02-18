import Input from "./Input"
import Button from "./Button"

export default function LoginForm() {
  return (
    <div className="bg-white w-full max-w-md p-8 shadow-sm rounded-sm">

      <h2 className="text-2xl font-semibold text-center mb-2">
        Inicio de sesión
      </h2>

      <p className="text-center text-gray-500 text-sm mb-6">
        Ingrese su cuenta
      </p>

      <div className="space-y-6">
        <Input type="text" placeholder="Correo o nombre de usuario" />
        <Input type="password" placeholder="Contraseña" />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button variant="primary">
          Iniciar sesión
        </Button>

        <a href="#" className="text-orange-500 text-sm hover:underline">
          ¿Olvidó su contraseña?
        </a>
      </div>

    </div>
  )
}
