import { type LoginFormData, loginSchema } from "@/schemas/login.schema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hexagon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import loginImg from "../../assets/loginImg.png";

import { useLoginMutation } from "@/features/auth/services/authApi";

export default function Login() {
    const navigate=useNavigate()
  const [login,{isLoading}]=useLoginMutation();
  const florm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormData) => {
    console.log("Form Submitted");
    navigate('/projects')
      const response= await login(data).unwrap();
      localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
  };
  return (
    <div className="lg:flex h-screen w-full">
      <div className="flex flex-col h-full lg:w-[40%] bg-secondary">
        <div className="h-[40%] w-full px-15 pt-10 space-y-6">
          <div className="w-full flex items-center justify-center gap-2">
            <Hexagon size={50} className="text-3xl  text-primary" />
            <h1 className="text-4xl font-semibold tracking-tight text-primary">Helix Enterprise</h1>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h3 className="text-3xl font-semibold tracking-tight text-black">
              Build Better Teams,{" "}
            </h3>
            <h3 className="text-3xl font-semibold tracking-tight text-black">Alocate Smarter </h3>
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <p>Manage engineers, allocate resources efficiently, and deliver</p>
            <p> deliver projects with completevisibility across your organization</p>
            <p>.</p>
          </div>
        </div>
        <div className="h-[60%]">
          <img className="h-full w-full" src={loginImg}></img>
        </div>
      </div>

      <div className="h-full lg:w-[60%] bg-primary">
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl">
            <CardContent className="p-10">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold tracking-tight text-primary">Login</h1>

                <p className="text-sm text-muted-foreground">
                  Login in to Helix Enterprise, project allocation platform.
                </p>
              </div>

              <form className="mt-10 space-y-6" onSubmit={florm.handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 rounded-xl"
                    {...florm.register("email")}
                  />
                  {florm.formState.errors.email && (
                    <p className="text-sm text-red-500">{florm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 rounded-xl"
                    {...florm.register("password")}
                  />

                  {florm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {florm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                //   disabled={isLoading}
                  className="h-12 w-full rounded-xl text-base hover:scale-102 active:scale-97"
                  type="submit"
                >
                  {isLoading ? "Signing In..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
