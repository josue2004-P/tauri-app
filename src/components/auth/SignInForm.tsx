import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function SignInForm() {

  const { startLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await startLogin({ email, password});
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
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    type="text"
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      data-testid="password-toggle"
                    >
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEyeSlash as IconProp} className="size-5" />
                      ) : (
                        <FontAwesomeIcon icon={faEye as IconProp} className="size-5" />
                      )}
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
