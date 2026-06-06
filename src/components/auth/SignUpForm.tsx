import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { invoke } from "@tauri-apps/api/core";

import Label from "../form/Label";
import Input from "../form/input/InputField";

interface UserInput {
  name: string;
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [formData, setFormData] = useState<UserInput>({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true); 

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setLocalError("Todos los campos marcados con (*) son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const response = await invoke("register_user_command", { 
        userData: {
          id: null,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          is_activo: true, 
          email_verified_at: null,
          remember_token: null,
          created_at: null,
          updated_at: null
        }
      });

      console.log("¡Usuario guardado con éxito en SQLite!", response);
      alert("¡Usuario registrado con éxito en Lab Piedad!");
      
      setFormData({ name: "", email: "", password: "" });

    } catch (err) {
      console.error("Error devuelto por el backend de Rust:", err);
      setLocalError(err as string);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prueba local de captura de datos para el catálogo de usuarios.
            </p>
          </div>
          
          <div>
            {localError && (
              <div className="mb-4 p-4 bg-red-950/40 border border-red-900 text-red-400 text-sm rounded-lg">
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                
                {/* */}
                <div>
                  <Label>
                    Full Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name (e.g. Josué Pérez)"
                  />
                </div>

                {/* */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                {/* */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 flex items-center"
                    >
                      {showPassword ? (
                        <FontAwesomeIcon 
                          icon={faEye as IconProp} 
                          className="text-gray-500 dark:text-gray-400 w-5 h-5" 
                        />
                      ) : (
                        <FontAwesomeIcon 
                          icon={faEyeSlash as IconProp} 
                          className="text-gray-500 dark:text-gray-400 w-5 h-5" 
                        />
                      )}
                    </span>
                  </div>
                </div>

                {/* */}
                <div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-700/50"
                  >
                    {loading ? "Guardando en SQLite..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}