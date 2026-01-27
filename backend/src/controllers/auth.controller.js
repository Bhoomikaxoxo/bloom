const authService = require('../services/auth.service');
const {
    signupSchema,
    loginSchema,
    refreshSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validators/auth.validators');

// Signup
const signup = async (req, res, next) => {
    try {
        const validatedData = signupSchema.parse(req.body);
        const result = await authService.signup(
            validatedData.email,
            validatedData.password,
            validatedData.name
        );

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Login
const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const result = await authService.login(
            validatedData.email,
            validatedData.password
        );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Refresh token
const refresh = async (req, res, next) => {
    try {
        const validatedData = refreshSchema.parse(req.body);
        const result = await authService.refreshAccessToken(validatedData.refreshToken);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Logout
const logout = async (req, res, next) => {
    try {
        const validatedData = refreshSchema.parse(req.body);
        const result = await authService.logout(validatedData.refreshToken);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
    try {
        const validatedData = forgotPasswordSchema.parse(req.body);
        const result = await authService.forgotPassword(validatedData.email);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
const resetPassword = async (req, res, next) => {
    try {
        const validatedData = resetPasswordSchema.parse(req.body);
        const result = await authService.resetPassword(
            validatedData.token,
            validatedData.password
        );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword
};
