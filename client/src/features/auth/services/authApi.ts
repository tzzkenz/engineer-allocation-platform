import employeeBaseApi from "@shared/api/base.api";
import type { LoginRequest,LoginResponse } from "@shared/api/types";

export const authApi=employeeBaseApi.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation<LoginResponse,LoginRequest>({
            query:(formData)=>({
                url:"/auth/login",
                method:"POST",
                body:formData,
            }),
        }),
    }),
});
export const {useLoginMutation}= authApi