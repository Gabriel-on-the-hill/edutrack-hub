/**
 * AUTHENTICATION & AUTHORIZATION MODULE
 * 
 * SECURITY IMPROVEMENTS IN THIS VERSION:
 * ✅ httpOnly cookies instead of localStorage (prevents XSS token theft)
 * ✅ Role-based access control (RBAC) for admin routes
 * ✅ No hardcoded JWT secret fallback (fail fast if missing, placeholder or short)
 * ✅ CSRF token generation and verification
 * ✅ Password hashing with bcrypt
 * 
 * Provides:
 * - JWT token generation and verification
 * - httpOnly cookie management
 * - Role-based access control (RBAC)
 * - Password hashing and verification
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import crypto from 'crypto';

// ============================================================================
// CONFIGURATION
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET;

// Values that must never be used to sign tokens (published in .env.example / docs)
const KNOWN_PLACEHOLDER_SECRETS = new Set([
  'your-super-secret-jwt-key-minimum-32-characters',
]);
const MIN_SECRET_LENGTH = 32;

/**
 * Return the JWT signing secret, refusing to work with a missing,
 * placeholder or short value. Checked on first use rather than at import,
 * so a misconfigured deployment fails every sign/verify call loudly
 * instead of silently signing sessions with a public key.
 */
export function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error(
      'JWT_SECRET environment variable is not set.\n' +
      'Please add JWT_SECRET to your .env.local file.\n' +
      'Generate one with: openssl rand -base64 48'
    );
  }
  if (KNOWN_PLACEHOLDER_SECRETS.has(JWT_SECRET)) {
    throw new Error(
      'JWT_SECRET is still the placeholder value from .env.example. ' +
      'Replace it with a freshly generated random secret.'
    );
  }
  if (JWT_SECRET.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters long.`
    );
  }
  return JWT_SECRET;
}

const JWT_EXPIRY = '7d'; // Token expires in 7 days
const COOKIE_NAME = 'eth_session'; // Cookie name for session storage

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Generate a JWT token
 * 
 * @param {Object} payload - Data to encode in token (user id, role, etc.)
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  try {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRY });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
}

/**
 * Verify a JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload if valid, null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

/**
 * Set authentication cookie (httpOnly, secure, sameSite)
 * 
 * SECURITY FEATURES:
 * - httpOnly: Prevents JavaScript from accessing the cookie (XSS protection)
 * - secure: Only sent over HTTPS in production
 * - sameSite: CSRF protection
 * 
 * @param {string} token - JWT token to set in cookie
 * @param {boolean} isProduction - Whether running in production
 * @returns {string} Set-Cookie header value
 */
export function setAuthCookie(token, isProduction = false) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true, // ✅ XSS Protection: JS cannot access this cookie
    secure: isProduction, // ✅ Only send over HTTPS in production
    sameSite: 'lax', // ✅ CSRF Protection
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Clear authentication cookie
 * 
 * @returns {string} Set-Cookie header value to clear cookie
 */
export function clearAuthCookie() {
  return serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Immediately expire the cookie
  });
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Middleware to require authentication
 * 
 * Usage in API route:
 * ```javascript
 * export default function handler(req, res) {
 *   if (req.method !== 'GET') return res.status(405).end();
 *   
 *   const auth = requireAuth(req, res);
 *   if (!auth) return; // requireAuth already sent error response
 *   
 *   // Now you can use auth.user
 *   console.log('Authenticated user:', auth.user);
 * }
 * ```
 * 
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Object|null} { user: decoded_token } or null if not authenticated
 */
export function requireAuth(req, res) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({
      message: 'Unauthorized: No authentication token found',
      code: 'NO_TOKEN',
    });
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      message: 'Unauthorized: Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
    return null;
  }

  return { user: payload };
}

/**
 * Middleware to require specific roles (RBAC)
 * 
 * Usage in API route:
 * ```javascript
 * export default function handler(req, res) {
 *   if (req.method !== 'GET') return res.status(405).end();
 *   
 *   const auth = requireRole(req, res, ['admin']);
 *   if (!auth) return; // requireRole already sent error response
 *   
 *   // Now you can safely access admin-only data
 * }
 * ```
 * 
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['admin', 'tutor'])
 * @returns {Object|null} { user: decoded_token } or null if not authorized
 */
export function requireRole(req, res, allowedRoles = []) {
  const auth = requireAuth(req, res);
  if (!auth) return null;

  // If no specific roles required, just need to be authenticated
  if (!allowedRoles || allowedRoles.length === 0) {
    return auth;
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(auth.user.role)) {
    res.status(403).json({
      message: `Forbidden: This action requires one of these roles: ${allowedRoles.join(', ')}`,
      code: 'INSUFFICIENT_ROLE',
      requiredRoles: allowedRoles,
      userRole: auth.user.role,
    });
    return null;
  }

  return auth;
}

// ============================================================================
// PASSWORD HASHING
// ============================================================================

/**
 * Hash a password using bcrypt
 * 
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against its hash
 * 
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {Promise<boolean>} True if password matches hash
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ============================================================================
// CSRF TOKEN MANAGEMENT
// ============================================================================

/**
 * Generate a CSRF token
 * 
 * @returns {string} Random CSRF token
 */
export function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token from request
 * 
 * @param {Object} req - Next.js request object
 * @param {string} expectedToken - Expected CSRF token from session
 * @returns {boolean} True if token is valid
 */
export function verifyCsrfToken(req, expectedToken) {
  const token = req.headers['x-csrf-token'] || req.body?.csrfToken;
  return token && token === expectedToken;
}

// ============================================================================
// USER ROLE DEFINITIONS - Simplified for MVP
// ============================================================================

/**
 * Valid user roles in the system
 */
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
};

/**
 * Check if a role is valid
 * 
 * @param {string} role - Role to validate
 * @returns {boolean} True if role is valid
 */
export function isValidRole(role) {
  return Object.values(USER_ROLES).includes(role);
}

/**
 * Get role permissions
 * 
 * @param {string} role - User role
 * @returns {Array<string>} Array of permissions for the role
 */
export function getRolePermissions(role) {
  const permissions = {
    [USER_ROLES.STUDENT]: [
      'view_classes',
      'enroll_class',
      'view_dashboard',
      'view_resources',
    ],
    [USER_ROLES.ADMIN]: [
      'manage_users',
      'manage_classes',
      'view_analytics',
      'manage_enrollments',
      'manage_payments',
      'manage_resources',
    ],
  };

  return permissions[role] || [];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user has a specific permission
 * 
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export function hasPermission(role, permission) {
  const permissions = getRolePermissions(role);
  return permissions.includes(permission);
}

/**
 * Create a user payload for token
 * 
 * @param {Object} user - User object from database
 * @returns {Object} Payload to encode in JWT
 */
/**
 * Get current user from request
 * 
 * @param {Object} req - Next.js request object
 * @returns {Object|null} User object or null if not authenticated
 */
export function getCurrentUser(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Create a user payload for token
 * 
 * @param {Object} user - User object from database
 * @returns {Object} Payload to encode in JWT
 */
export function createUserPayload(user) {
  return {
    uid: user.id,
    email: user.email,
    role: user.userType || USER_ROLES.STUDENT,
    name: `${user.firstName} ${user.lastName}`,
  };
}

/**
 * Extract token from Authorization header (legacy support)
 * 
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

export default {
  generateToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
  requireRole,
  hashPassword,
  comparePassword,
  generateCsrfToken,
  verifyCsrfToken,
  USER_ROLES,
  isValidRole,
  getRolePermissions,
  hasPermission,
  createUserPayload,
  extractTokenFromHeader,
};

