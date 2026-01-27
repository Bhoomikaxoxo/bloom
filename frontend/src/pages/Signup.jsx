import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function Signup() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const signupMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/auth/signup', data);
            return response.data.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser(data.user);
            navigate('/notes');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signupMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Slate
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Create your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    {signupMutation.isError && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {signupMutation.error.response?.data?.error?.message || 'Signup failed'}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={signupMutation.isPending}
                    >
                        {signupMutation.isPending ? 'Creating account...' : 'Sign up'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </Card>
        </div>
    );
}
