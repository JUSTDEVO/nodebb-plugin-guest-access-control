const meta = require.main.require("./src/meta")
const user = require.main.require("./src/user")
const categories = require.main.require("./src/categories")
const plugins = require.main.require("./src/plugins")
const winston = require.main.require("winston")

const plugin = {}

// Default settings
const defaultSettings = {
  enabled: "off",
  enableForceRegistration: "off",
  customMessage: "Bu forumu görüntülemek için kayıt olmanız gerekmektedir.",
  customTitle: "Kayıt Gerekli",
  redirectToRegister: "on",
  whitelistedPaths: "/login,/register,/reset,/api,/assets,/plugins,/sounds,/language,/static",
  protectedCategories: "",
  showWelcomeMessage: "on",
  welcomeMessageTitle: "Hoş Geldiniz!",
  welcomeMessageContent: "Forumumuza hoş geldiniz! Tüm özelliklere erişmek için lütfen kayıt olun.",
  enableAnalytics: "on",
  enableRateLimit: "on",
  rateLimitRequests: "10",
  rateLimitWindow: "60",
  customRedirectUrl: "",
  blockApiAccess: "off",
  allowedGuestPages: "home,recent,popular,top",
}

// In-memory storage for analytics and rate limiting
const analytics = {
  blockedAttempts: 0,
  uniqueVisitors: new Set(),
  lastReset: Date.now(),
}

const rateLimitStore = new Map()

plugin.init = async (params) => {
  const { router, middleware } = params

  // Admin routes
  router.get("/admin/plugins/guest-access-control", middleware.admin.buildHeader, renderAdmin)
  router.get("/api/admin/plugins/guest-access-control", renderAdmin)

  // API endpoints for admin panel
  router.post("/api/admin/plugins/guest-access-control/save", middleware.admin.isAdmin, saveSettings)
  router.get("/api/admin/plugins/guest-access-control/analytics", middleware.admin.isAdmin, getAnalytics)
  router.post("/api/admin/plugins/guest-access-control/reset-analytics", middleware.admin.isAdmin, resetAnalytics)

  winston.info("[plugin/guest-access-control] Plugin initialized successfully")
}

async function renderAdmin(req, res) {
  const settings = await getSettings()

  res.render("admin/plugins/guest-access-control", {
    title: "Guest Access Control",
    settings,
    analytics: {
      blockedAttempts: analytics.blockedAttempts,
      uniqueVisitors: analytics.uniqueVisitors.size,
      lastReset: new Date(analytics.lastReset).toLocaleString("tr-TR"),
    },
  })
}

async function saveSettings(req, res) {
  try {
    const settings = req.body

    // Validate and sanitize settings
    const validatedSettings = {
      enabled: settings.enabled === "on" ? "on" : "off",
      enableForceRegistration: settings.enableForceRegistration === "on" ? "on" : "off",
      customMessage: String(settings.customMessage || defaultSettings.customMessage).substring(0, 500),
      customTitle: String(settings.customTitle || defaultSettings.customTitle).substring(0, 100),
      redirectToRegister: settings.redirectToRegister === "on" ? "on" : "off",
      whitelistedPaths: String(settings.whitelistedPaths || defaultSettings.whitelistedPaths),
      protectedCategories: String(settings.protectedCategories || ""),
      showWelcomeMessage: settings.showWelcomeMessage === "on" ? "on" : "off",
      welcomeMessageTitle: String(settings.welcomeMessageTitle || defaultSettings.welcomeMessageTitle).substring(
        0,
        100,
      ),
      welcomeMessageContent: String(settings.welcomeMessageContent || defaultSettings.welcomeMessageContent).substring(
        0,
        1000,
      ),
      enableAnalytics: settings.enableAnalytics === "on" ? "on" : "off",
      enableRateLimit: settings.enableRateLimit === "on" ? "on" : "off",
      rateLimitRequests: Number.parseInt(settings.rateLimitRequests, 10) || 10,
      rateLimitWindow: Number.parseInt(settings.rateLimitWindow, 10) || 60,
      customRedirectUrl: String(settings.customRedirectUrl || ""),
      blockApiAccess: settings.blockApiAccess === "on" ? "on" : "off",
      allowedGuestPages: String(settings.allowedGuestPages || defaultSettings.allowedGuestPages),
    }

    // Save each setting
    await meta.settings.set("guest-access-control", validatedSettings)

    winston.info("[plugin/guest-access-control] Settings saved successfully")
    res.json({ success: true, message: "Ayarlar başarıyla kaydedildi!" })
  } catch (error) {
    winston.error("[plugin/guest-access-control] Error saving settings:", error)
    res.status(500).json({ success: false, message: "Ayarlar kaydedilirken hata oluştu." })
  }
}

async function getSettings() {
  try {
    const settings = await meta.settings.get("guest-access-control")
    return { ...defaultSettings, ...settings }
  } catch (error) {
    winston.error("[plugin/guest-access-control] Error getting settings:", error)
    return defaultSettings
  }
}

async function getAnalytics(req, res) {
  res.json({
    blockedAttempts: analytics.blockedAttempts,
    uniqueVisitors: analytics.uniqueVisitors.size,
    lastReset: new Date(analytics.lastReset).toLocaleString("tr-TR"),
  })
}

async function resetAnalytics(req, res) {
  analytics.blockedAttempts = 0
  analytics.uniqueVisitors.clear()
  analytics.lastReset = Date.now()

  res.json({ success: true, message: "İstatistikler sıfırlandı!" })
}

plugin.checkGuestAccess = async (hookData) => {
  const { req, res } = hookData

  // Check if user is logged in
  if (req.uid > 0) {
    return hookData
  }

  const settings = await getSettings()

  // Check if plugin is enabled
  if (settings.enabled !== "on" || settings.enableForceRegistration !== "on") {
    return hookData
  }

  // Track unique visitor
  if (settings.enableAnalytics === "on" && req.ip) {
    analytics.uniqueVisitors.add(req.ip)
  }

  // Rate limiting
  if (settings.enableRateLimit === "on") {
    const isRateLimited = checkRateLimit(req.ip, settings)
    if (isRateLimited) {
      winston.warn(`[plugin/guest-access-control] Rate limit exceeded for IP: ${req.ip}`)
      if (res && res.status) {
        return res.status(429).send("Çok fazla istek. Lütfen daha sonra tekrar deneyin.")
      }
    }
  }

  const currentPath = req.path || req.url || ""

  // Check if path is whitelisted
  if (isPathWhitelisted(currentPath, settings)) {
    return hookData
  }

  // Check if it's an API request and API blocking is enabled
  if (settings.blockApiAccess === "on" && currentPath.startsWith("/api/")) {
    if (!isPathWhitelisted(currentPath, settings)) {
      analytics.blockedAttempts++
      winston.info(`[plugin/guest-access-control] Blocked API access attempt from guest: ${currentPath}`)

      if (res && res.status) {
        return res.status(403).json({
          error: "Authentication required",
          message: "Bu API'ye erişmek için giriş yapmanız gerekiyor.",
        })
      }
    }
  }

  // Block access and redirect
  analytics.blockedAttempts++
  winston.info(`[plugin/guest-access-control] Blocked guest access attempt: ${currentPath}`)

  if (res && res.redirect) {
    const redirectUrl = settings.customRedirectUrl || (settings.redirectToRegister === "on" ? "/register" : "/login")

    // Store original URL for redirect after login
    if (req.session) {
      req.session.returnTo = currentPath
    }

    return res.redirect(redirectUrl)
  }

  return hookData
}

plugin.injectGuestMessage = async (hookData) => {
  const { req, templateData } = hookData

  if (req.uid > 0 || !templateData) {
    return hookData
  }

  const settings = await getSettings()

  if (settings.enabled !== "on" || settings.showWelcomeMessage !== "on") {
    return hookData
  }

  // Inject welcome message into template data
  templateData.guestWelcomeMessage = {
    enabled: true,
    title: settings.welcomeMessageTitle,
    content: settings.welcomeMessageContent,
    customClass: "guest-access-control-banner",
  }

  return hookData
}

plugin.filterTopicForGuests = async (hookData) => {
  const { uid, topic } = hookData

  if (uid > 0 || !topic) {
    return hookData
  }

  const settings = await getSettings()

  if (settings.enabled !== "on" || !settings.protectedCategories) {
    return hookData
  }

  const protectedCategoryIds = settings.protectedCategories
    .split(",")
    .map((id) => Number.parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id))

  if (protectedCategoryIds.includes(topic.cid)) {
    hookData.topic = null
    winston.info(`[plugin/guest-access-control] Blocked guest access to protected topic: ${topic.tid}`)
  }

  return hookData
}

plugin.filterCategoriesForGuests = async (hookData) => {
  const { uid, categories } = hookData

  if (uid > 0 || !categories || !Array.isArray(categories)) {
    return hookData
  }

  const settings = await getSettings()

  if (settings.enabled !== "on" || !settings.protectedCategories) {
    return hookData
  }

  const protectedCategoryIds = settings.protectedCategories
    .split(",")
    .map((id) => Number.parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id))

  if (protectedCategoryIds.length > 0) {
    hookData.categories = categories.filter((category) => !protectedCategoryIds.includes(category.cid))
  }

  return hookData
}

plugin.handleHomepageAccess = async (hookData) => {
  const { uid, data } = hookData

  if (uid > 0) {
    return hookData
  }

  const settings = await getSettings()

  if (settings.enabled !== "on" || settings.enableForceRegistration !== "on") {
    return hookData
  }

  // Allow certain homepage types for guests
  const allowedPages = settings.allowedGuestPages.split(",").map((p) => p.trim())

  if (!allowedPages.includes(data)) {
    winston.info("[plugin/guest-access-control] Modified homepage access for guest")
  }

  return hookData
}

plugin.onUserLogin = async (hookData) => {
  const { uid, req } = hookData

  winston.info(`[plugin/guest-access-control] User ${uid} logged in successfully`)

  // Redirect to originally requested page if stored in session
  if (req.session && req.session.returnTo) {
    const returnUrl = req.session.returnTo
    delete req.session.returnTo

    if (req.res && req.res.redirect) {
      req.res.redirect(returnUrl)
    }
  }

  return hookData
}

plugin.addAdminNavigation = async (header) => {
  header.plugins.push({
    route: "/plugins/guest-access-control",
    icon: "fa-shield-alt",
    name: "Guest Access Control",
  })

  return header
}

// Helper functions
function isPathWhitelisted(path, settings) {
  if (!path) {
    return false
  }

  const whitelistedPaths = settings.whitelistedPaths
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  return whitelistedPaths.some((whitelisted) => {
    if (whitelisted.endsWith("*")) {
      const prefix = whitelisted.slice(0, -1)
      return path.startsWith(prefix)
    }
    return path === whitelisted || path.startsWith(`${whitelisted}/`) || path.startsWith(`${whitelisted}?`)
  })
}

function checkRateLimit(ip, settings) {
  if (!ip) {
    return false
  }

  const now = Date.now()
  const windowMs = settings.rateLimitWindow * 1000
  const maxRequests = Number.parseInt(settings.rateLimitRequests, 10)

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  const record = rateLimitStore.get(ip)

  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    return false
  }

  record.count++

  if (record.count > maxRequests) {
    return true
  }

  return false
}

// Cleanup old rate limit records every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [ip, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(ip)
      }
    }
  },
  5 * 60 * 1000,
)

module.exports = plugin
