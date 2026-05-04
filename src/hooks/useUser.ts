import queryClient from "@/lib/query";
import { getUser } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function useUser() {
  const {
    data: user,
    isError,
    ...rest
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      // Invalidate the queries and clear the cache if no token
      queryClient.invalidateQueries();
      queryClient.clear();
      navigate("/auth/login");
    }
  }, [isError, navigate]);

  return { user, ...rest };
}
