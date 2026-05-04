import { QueryClient } from "@tanstack/react-query";
import { toastError } from "./utils";

/** The code is creating a new instance of the `QueryClient` class and configuring its default options. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 12, // 12 hours
    },
    mutations: {
      onError({ response }: any) {
        let errorTitle = "";

        if (typeof response === "string") {
          errorTitle = response;
        } else if (typeof response?.data?.message === "string") {
          errorTitle = response?.data?.message;
        } else {
          errorTitle = response?.data?.message?.join(", ");
        }

        toastError(errorTitle);
      },
    },
  },
});

export default queryClient;
