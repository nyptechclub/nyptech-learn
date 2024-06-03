"use client"
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    })
});

const Page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    });
    const router = useRouter();
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/course", values);
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("Course created");
        } catch {
            toast.error("Course could not be added, please report this incident");
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your course</h1>
                <p>What would you like to name your course? You can change this later.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Advanced Procrastinating"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>What will you teach in this course?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Page;
