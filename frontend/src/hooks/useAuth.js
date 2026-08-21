import { useAuth as useAuthContext } from "../context";

export default function useAuth() {
  return useAuthContext();
}