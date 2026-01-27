const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

// Generate tokens
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    });
};

// Signup
const signup = async (email, password, name) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            name
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
        }
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt
        }
    });

    return { user, accessToken, refreshToken };
};

// Login
const login = async (email, password) => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt
        }
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        },
        accessToken,
        refreshToken
    };
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
    // Verify refresh token
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }

    // Check if refresh token exists and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken }
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new AppError('Refresh token expired or revoked', 401);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Revoke old refresh token
    await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revoked: true }
    });

    // Store new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: newRefreshToken,
            userId: decoded.userId,
            expiresAt
        }
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Logout
const logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError('Refresh token required', 400);
    }

    // Revoke refresh token
    const token = await prisma.refreshToken.findUnique({
        where: { token: refreshToken }
    });

    if (token) {
        await prisma.refreshToken.update({
            where: { token: refreshToken },
            data: { revoked: true }
        });
    }

    return { message: 'Logged out successfully' };
};

// Forgot password
const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    // Don't reveal if user exists or not for security
    if (!user) {
        return { message: 'If that email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store reset token (we'll use a temporary table or add fields to User model)
    // For now, we'll add it to user model - this requires migration
    // Placeholder: In production, send email with reset link

    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log('Reset link: http://localhost:5173/reset-password?token=' + resetToken);

    return { message: 'If that email exists, a reset link has been sent' };
};

// Reset password
const resetPassword = async (token, newPassword) => {
    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // In production, find user by resetTokenHash and check expiry
    // For now, this is a placeholder

    throw new AppError('Password reset not fully implemented yet', 501);
};

module.exports = {
    signup,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
};
