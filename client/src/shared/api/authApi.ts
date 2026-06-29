import employeeBaseApi from "./base.api";
import type { LoginRequest,LoginResponse } from "./types";

export const authApi=employeeBaseApi.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation<LoginResponse,LoginRequest>({
            query:(credentials)=>({
                url:"/abcd",
                method:"POST",
                body:credentials,
            }),
        }),
    }),
});
export const {useLoginMutation}= authApi