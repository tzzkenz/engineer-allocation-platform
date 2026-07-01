import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/features/auth/services/employeeApi";
import { employeeCreateSchema } from "@/schemas/employeeCreateSchema";
import { type EmployeeFormData } from "@/schemas/employeeForm";
import { employeeUpdateSchema } from "@/schemas/employeeUpdateSchema";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useGetEmployeeByIdQuery } from "@/features/auth/services/employeeApi";
import { useEffect } from "react";
export default function FormField() {
  const [updateEmployee, { isLoading: isUpdateLoading }] = useUpdateEmployeeMutation();
  const [createEmployee, { isLoading: isCreateLoading }] = useCreateEmployeeMutation();
  const isLoading = isCreateLoading || isUpdateLoading;
  const { emp_id } = useParams();
  const isEdit = !!emp_id;
  const schema = isEdit ? employeeUpdateSchema : employeeCreateSchema;
  const navigate = useNavigate();
  const { data: employee, isLoading: isEmployeeLoading } =
  useGetEmployeeByIdQuery(Number(emp_id), {
    skip: !isEdit,
  });

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      experience: 0,
      date_of_joining: "",
      system_role_id: 1,
    },
  });
  useEffect(() => {
  if (!employee) return;

  form.reset({
    name: employee.name,
    email: employee.email,
    experience: employee.experience,
    date_of_joining: employee.date_of_joining,
    system_role_id: employee.system_role_id,
  });
}, [employee, form]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (isEdit) {
        await updateEmployee({
          employee_id: Number(emp_id),

          employee: {
            name: data.name,
            email: data.email,
            experience: data.experience,
            date_of_joining: data.date_of_joining,
            system_role_id: data.system_role_id,
          },
        }).unwrap();

        console.log("Employee Updated");
      } else {
        const response = await createEmployee({
          name: data.name,
          email: data.email,
          password: data.password!,
          experience: data.experience,
          date_of_joining: data.date_of_joining,
          system_role_id: data.system_role_id,
        }).unwrap();

        navigate(`/employee/${response.id}/edit`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Card className=" w-full h-full flex justify-center ">
      <CardContent className="flex flex-col gap-10 h-full">
        <form className="space-y-8 " onSubmit={form.handleSubmit(onSubmit)}>
          <div className="sm:flex gap-5">
            <div className="w-full">
              <Label className="ml-2 pb-2">
                FULL NAME<span className="text-red-500">*</span>
              </Label>
              <Input placeholder="eg:Amal Thomas" {...form.register("name")} />

              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            {!isEdit && (
              <div className="w-full">
                <Label className="ml-2 pb-2">
                  PASSWORD <span className="text-red-500">*</span>
                </Label>

                <Input
                  type="password"
                  placeholder="Enter password"
                  {...form.register("password")}
                />

                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            )}
            
          </div>

          <div className="sm:flex gap-5 ">
            <div className="w-full">
              <Label className="ml-2 pb-2">
                EMAIL ADDRESS <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="eg:amal@helix.com" {...form.register("email")} />

              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            
            </div>
          <div className="w-full">
              <Label className="ml-2 pb-2">
                JOINING DATE <span className="text-red-500">*</span>
              </Label>
              <Input type="date" {...form.register("date_of_joining")} />

              {form.formState.errors.date_of_joining && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.date_of_joining.message}
                </p>
              )}
            </div>
            
          </div>
          <div className="sm:flex gap-5">
            <div className="w-full">
              <Label className="ml-2 pb-2">
                TOTAL EXPERIENCE <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                {...form.register("experience", {
                  valueAsNumber: true,
                })}
              />

              {form.formState.errors.experience && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.experience.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Label className="ml-2 pb-2">
                SELECT ROLE <span className="text-red-500">*</span>
              </Label>

              <Controller
                control={form.control}
                name="system_role_id"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="bg-[#F2F3F9] w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="1">HR</SelectItem>
                      <SelectItem value="2">QA</SelectItem>
                      <SelectItem value="3">DEVOPS</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {form.formState.errors.system_role_id && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.system_role_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end ">
            <Button className="px-10 mr-10" type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Employee"
                  : "Create Employee"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
