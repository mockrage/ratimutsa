/**
 * Rate Limiting Utility
 * Implements in-memory rate limiting for API endpoints
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitStore>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the window
   */
  maxRequests: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Optional custom identifier (defaults to IP address)
   */
  identifier?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier for the client (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}:${config.windowMs}`;
  
  let store = rateLimitStore.get(key);
  
  // Initialize or reset if window expired
  if (!store || store.resetTime < now) {
    store = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, store);
  }
  
  // Increment request count
  store.count++;
  
  const remaining = Math.max(0, config.maxRequests - store.count);
  const success = store.count <= config.maxRequests;
  
  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: store.resetTime,
  };
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict rate limit for authentication endpoints
   * 5 requests per 15 minutes
   */
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  /**
   * Moderate rate limit for order creation
   * 10 requests per 10 minutes
   */
  ORDER_CREATION: {
    maxRequests: 10,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
  
  /**
   * Lenient rate limit for general API endpoints
   * 100 requests per 15 minutes
   */
  GENERAL: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  /**
   * Very strict rate limit for sensitive operations
   * 3 requests per 30 minutes
   */
  SENSITIVE: {
    maxRequests: 3,
    windowMs: 30 * 60 * 1000, // 30 minutes
  },
} as const;

/**
 * Middleware helper to apply rate limiting to API routes
 * 
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await applyRateLimit(request, RateLimitPresets.AUTH);
 *   if (!rateLimitResult.success) {
 *     return NextResponse.json(
 *       { error: 'Too many requests. Please try again later.' },
 *       { 
 *         status: 429,
 *         headers: {
 *           'X-RateLimit-Limit': rateLimitResult.limit.toString(),
 *           'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
 *           'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
 *         }
 *       }
 *     );
 *   }
 *   // ... rest of your handler
 * }
 * ```
 */
export async function applyRateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const identifier = config.identifier || getClientIdentifier(request);
  return checkRateLimit(identifier, config);
}
