import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Select from "../form/Select";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function SignInForm() {

  const { startLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [empresaId, setEmpresa] = useState("");
  const [loading, setLoading] = useState(false);

  const empresasOptions = [
    { value: "1", label: "INDHECA" },
    { value: "2", label: "TIBERNAL" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await startLogin({ usuario, contrasena,empresaId });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¡Ingresa tu correo electrónico y contraseña para iniciar sesión!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Usuario <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    type="text"
                    placeholder="Usuario" 
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Escribe tu contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                    />
                  <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      data-testid="password-toggle"
                    >
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEyeSlash} className="size-5" />
                      ) : (
                        <FontAwesomeIcon icon={faEye} className="size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>
                    Empresa <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Select
                      options={empresasOptions}
                      placeholder="Selecciona una empresa"
                      onChange={(value) => setEmpresa(value)}
                      defaultValue={empresaId}
                    />
                    {/* Icono de flecha para el select (opcional, para estética) */}
                    <span className="absolute h-5 w-5 -translate-y-1/2 pointer-events-none right-4 top-1/2">
                      <svg className="fill-gray-500" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Olvidaste tu contraseña?
                  </Link>
                </div>
                <div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="md"
                    disabled={loading}
                  >
                    {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
