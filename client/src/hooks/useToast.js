import { useContext } from "react";
import { ToastContext } from "../components/ui/toastContext";

export function useToast(){
    return useContext(ToastContext)
}