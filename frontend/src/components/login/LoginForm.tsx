import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/store/slices/auth/auth.slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/schema/user.schema";
import { toast } from "react-toastify";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const navigate = useNavigate();

    const [login, { isLoading, error }] = useLoginMutation();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("password", data.password);

            const loginPromise = login(formData).unwrap();

            const result = await toast.promise(loginPromise, {
                pending: "Logging in...",
                success: "Login successful",
                error: "Login failed",
            });
            if (result.role === "student") navigate("/dashboard");
            else if (result.role === "parent") navigate("/parent/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Login to your account</h1>
                <p className='text-balance text-sm text-muted-foreground'>
                    Enter your credentials below to login to your account
                </p>
            </div>

            {error && (
                <div className='text-destructive text-sm text-center'>
                    {typeof error === "object" && "data" in error
                        ? (error.data as any)?.message || "Login failed"
                        : "An error occurred during login"}
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid gap-6'
                >
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='username'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex items-center'>
                                    <FormLabel>Password</FormLabel>
                                    <a
                                        href='#'
                                        className='ml-auto text-sm underline-offset-4 hover:underline'
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
