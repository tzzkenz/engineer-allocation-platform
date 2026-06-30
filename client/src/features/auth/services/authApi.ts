import employeeBaseApi from "@shared/api/base.api";
import type { LoginRequest,LoginResponse } from "@shared/api/types";

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