import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/VerificationEmail";
import { ApiResponse } from "@/Types/ApiResponse";

export async function sendVerificationEmail (
    email:  string,
    username:   string,
    verifyCode: string
): Promise <ApiResponse> {
    try {

        await resend.emails.send({
            from: 'askIt@resend.dev',
            to: email,
            subject: 'Ask-It | Verification code',
            react: VerificationEmail({username, otp: verifyCode})
        })

        return {
            success: true,
            message: 'Verification email send successfully',
        }

    } catch (emailError) {
        
        console.error(`Error sendign verification email: ${emailError}`)
        return {
            success: false,
            message: 'Failed to send verification email',
        }
    }
}
