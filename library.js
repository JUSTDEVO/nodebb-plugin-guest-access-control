const meta = require.main.require("./src/meta")
const user = require.main.require("./src/user")
const winston = require.main.require("winston")

const plugin = {}

const defaultSettings = {
  enabled: "off",
  enableForceRegistration: "off",
  customMessage: "Bu forumu görüntülemek için kayıt olmanız gerekmektedir.",
  customTitle: "Kayıt Gerekli",
  redirectToRegister: "on",
  whitelistedPaths: "/login,/register,/reset,/api/user,/assets,/plugins,/sounds,/language,/static",
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

const analytics = {
  blockedAttempts: 0,
  uniqueVisitors: new Set(),
  lastReset: Date.now(),
}

const rateLimitStore = new Map()
let settingsCache = null
let cacheTime = 0
const CACHE_DURATION = 60000 // 1 dakika cache

plugin.init = async (params) => {
  const { router, middleware } = params

  // Admin panel routes
  router.get("/admin/plugins/guest-access-control", middleware.admin.buildHeader, renderAdmin)
  router.get("/api/admin/plugins/guest-access-control", renderAdmin)
  router.post("/api/admin/plugins/guest-access-control/save", middleware.admin.isAdmin, saveSettings)
  router.get("/api/admin/plugins/guest-access-control/analytics", middleware.admin.isAdmin, getAnalytics)
  router.post("/api/admin/plugins/guest-access-control/reset-analytics", middleware.admin.isAdmin, resetAnalytics)

  winston.info("[plugin/guest-access-control] Plugin initialized successfully")
}

async function renderAdmin(req, res) {
  try {
    const settings = await getSettings()

    res.render("admin/plugins/guest-access-control", {
      title: "Guest Access Control",
      settings: settings,
      analytics: {
        blockedAttempts: analytics.blockedAttempts,
        uniqueVisitors: analytics.uniqueVisitors.size,
        lastReset: new Date(analytics.lastReset).toLocaleString("tr-TR"),
      },
    })
  } catch (error) {
    winston.error("[plugin/guest-access-control] Error rendering admin:", error)
    res.status(500).send("Error loading admin panel")
  }
}

async function saveSettings(req, res) {
  try {
    const settings = req.body

    // Input validation ve sanitization
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
      rateLimitRequests: String(Number.parseInt(settings.rateLimitRequests, 10) || 10),
      rateLimitWindow: String(Number.parseInt(settings.rateLimitWindow, 10) || 60),
      customRedirectUrl: String(settings.customRedirectUrl || ""),
      blockApiAccess: settings.blockApiAccess === "on" ? "on" : "off",
      allowedGuestPages: String(settings.allowedGuestPages || defaultSettings.allowedGuestPages),
    }

    // NodeBB meta.settings kullanarak kaydet
    await meta.settings.set("guest-access-control", validatedSettings)

    // Cache'i temizle
    settingsCache = null
    cacheTime = 0

    winston.info("[plugin/guest-access-control] Settings saved successfully")
    res.json({ success: true, message: "Ayarlar başarıyla kaydedildi!" })
  } catch (error) {
    winston.error("[plugin/guest-access-control] Error saving settings:", error)
    res.status(500).json({ success: false, message: "Ayarlar kaydedilirken hata oluştu." })
  }
}

async function getSettings() {
  try {
    const now = Date.now()

    // Cache kontrolü
    if (settingsCache && now - cacheTime < CACHE_DURATION) {
      return settingsCache
    }

    const settings = await meta.settings.get("guest-access-control")
    settingsCache = { ...defaultSettings, ...settings }
    cacheTime = now

    return settingsCache
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

  winston.info("[plugin/guest-access-control] Analytics reset")
  res.json({ success: true, message: "İstatistikler sıfırlandı!" })
}

plugin.checkGuestAccess = async (hookData) => {
  const { req, res } = hookData

  // Kullanıcı giriş yapmışsa izin ver
  if (req.uid && req.uid > 0) {
    return hookData
  }

  const settings = await getSettings()

  // Plugin veya zorunlu kayıt kapalıysa izin ver
  if (settings.enabled !== "on" || settings.enableForceRegistration !== "on") {
    return hookData
  }

  // Analitik: Benzersiz ziyaretçi takibi
  if (settings.enableAnalytics === "on" && req.ip) {
    analytics.uniqueVisitors.add(req.ip)
  }

  // Rate limiting kontrolü
  if (settings.enableRateLimit === "on" && req.ip) {
    const isRateLimited = checkRateLimit(req.ip, settings)
    if (isRateLimited) {
      winston.warn(`[plugin/guest-access-control] Rate limit exceeded for IP: ${req.ip}`)
      if (res && res.status) {
        res.status(429).send("Çok fazla istek. Lütfen daha sonra tekrar deneyin.")
        return hookData
      }
    }
  }

  const currentPath = req.path || req.url || ""

  // Whitelist kontrolü
  if (isPathWhitelisted(currentPath, settings)) {
    return hookData
  }

  // API erişim kontrolü
  if (settings.blockApiAccess === "on" && currentPath.startsWith("/api/")) {
    if (!isPathWhitelisted(currentPath, settings)) {
      analytics.blockedAttempts++
      winston.info(`[plugin/guest-access-control] Blocked API access: ${currentPath}`)

      if (res && res.status) {
        res.status(403).json({
          error: "Authentication required",
          message: "Bu API'ye erişmek için giriş yapmanız gerekiyor.",
        })
        return hookData
      }
    }
  }

  // Erişimi engelle ve yönlendir
  analytics.blockedAttempts++
  winston.info(`[plugin/guest-access-control] Blocked guest access: ${currentPath}`)

  if (res && res.redirect) {
    const redirectUrl = settings.customRedirectUrl || (settings.redirectToRegister === "on" ? "/register" : "/login")

    // Orijinal URL'i session'a kaydet
    if (req.session) {
      req.session.returnTo = currentPath
    }

    res.redirect(redirectUrl)
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

  // Template'e karşılama mesajı ekle
  templateData.guestWelcomeMessage = {
    enabled: true,
    title: settings.welcomeMessageTitle,
    content: settings.welcomeMessageContent,
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
    winston.info(`[plugin/guest-access-control] Blocked guest topic access: ${topic.tid}`)
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

plugin.addAdminNavigation = async (header) => {
  header.plugins.push({
    route: "/plugins/guest-access-control",
    icon: "fa-shield-alt",
    name: "Guest Access Control",
  })

  return header
}

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
  const windowMs = Number.parseInt(settings.rateLimitWindow, 10) * 1000
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

  return record.count > maxRequests
}

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
