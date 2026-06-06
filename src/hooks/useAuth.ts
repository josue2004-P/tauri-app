import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import { onLogin, onLogout, onSetError } from "../store/slices/authSlice";
import { LoginUseCase, RenewTokenUseCase } from "../application/auth";
import type { LoginDto } from "../types/auth";

import Swal from "sweetalert2";
import { AxiosError } from "axios";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, token, user, isLoggedIn,checking, error } = useSelector(
    (state: RootState) => state.auth
  );

  const startLogin = async (datos: LoginDto) => {
    try {
      const useCase = new LoginUseCase();
      const response = await useCase.execute(datos);

      localStorage.setItem("access_token", response.access_token);
      dispatch(
        onLogin({
          id: response.user.id.toString(),
          token: response.access_token,
          user: response.user,
        })
      );
      navigate("/dashboard");
    } catch (err: unknown) {
      console.log(err)
      let errorMsg = "Error en el servidor";
      if (err instanceof AxiosError) {
        errorMsg = err.response?.data?.error || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      dispatch(onSetError(errorMsg));
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
      });
    }
  };

  const startRenewToken = useCallback(async () => {
    try {
      const useCase = new RenewTokenUseCase();
      const response = await useCase.execute();

      localStorage.setItem("access_token", response.access_token);

      dispatch(
        onLogin({
          id: response.user.id.toString(),
          token: response.access_token,
          user: response.user,
        })
      );
    } catch (err: unknown) {
      let errorMsg = "Error renovando token";

      if (err instanceof AxiosError) {
        errorMsg = err.response?.data?.error || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }

      localStorage.removeItem("access_token");
      dispatch(onSetError(errorMsg));
    }
  }, [dispatch]);

  const startLogout = () => {
    localStorage.removeItem("access_token");
    dispatch(onLogout());
    navigate("/login");
  };

  return {
    id,
    token,
    user,
    isLoggedIn,
    error,
    checking,

    startLogin,
    startRenewToken,
    startLogout,
  };
};
