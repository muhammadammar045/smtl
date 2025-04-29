"use client"

import { z } from "zod"

export const userSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).max(15),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }).max(20),
})
