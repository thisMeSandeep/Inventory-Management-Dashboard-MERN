import Button from './UI/Button'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const EmailVerifiedScreen = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-black">
                        Email Verified!
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Your email has been successfully verified.
                    </p>
                </div>

                <div className="border border-neutral-200 p-6 rounded-sm">
                    <Link to="/login">
                        <Button className="w-full">
                            Continue to Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EmailVerifiedScreen