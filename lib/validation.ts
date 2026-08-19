import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;
const studentIdRegex = /^[A-Za-z0-9]{4,20}$/;

export const participantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  student_id: z
    .string()
    .min(4, "Student ID must be at least 4 characters")
    .max(20)
    .regex(studentIdRegex, "Student ID must be alphanumeric (4-20 chars)"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Phone must be a valid 10-digit Indian mobile number"),
});

export const registrationSchema = z.object({
  event_id: z.number().int().positive("Please select an event"),
  team_name: z.string().min(2, "Team name must be at least 2 characters").max(100),
  college_name: z.string().min(2, "College name is required").max(200),
  department: z.string().min(2, "Department is required").max(100),
  members: z
    .array(participantSchema)
    .min(2, "At least 2 members required")
    .max(4, "Maximum 4 members allowed"),
});

export type ParticipantInput = z.infer<typeof participantSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
