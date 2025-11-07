const meta = require.main.require("./src/meta")
const user = require.main.require("./src/user")
const winston = require.main.require("winston")

const plugin = {}

const defaultSettings = {
  enabled: "off",
  forceRegistration: "off",
  customMessage: "Bu forumu görüntülemek için kayıt olmanız gerekmektedir.",
  redirectUrl: "/register",
  whitelistedPaths: "/login,/register,/reset,/api,/assets,/plugins,/sounds,/language,/static",
}

let settingsCache = null

// Plugin başlatma
plugin.init = async (params) => {
  const { router, middleware } = params

  // Admin panel route'ları
  router.get("/admin/plugins/guest-access-control", middleware.admin.buildHeader, renderAdmin)
  router.get("/api/admin/plugins/guest-access-control", renderAdmin)
  router.post("/api/admin/plugins/guest-access-control/save", middleware.admin.isAdmin, saveSettings)

  winston.info("[plugin/guest-access-control] Plugin initialized")
}

// Admin panel render
async function renderAdmin(req, res) {
  const settings = await getSettings()

  res.render("admin/plugins/guest-access-control", {
    title: "Guest Access Control",
    settings: settings,
  })
}

// Ayarları kaydet
async function saveSettings(req, res) {
  try {
    const settings = {
      enabled: req.body.enabled === "on" ? "on" : "off",
      forceRegistration: req.body.forceRegistration === "on" ? "on" : "off",
      customMessage: String(req.body.customMessage || defaultSettings.customMessage),
      redirectUrl: String(req.body.redirectUrl || defaultSettings.redirectUrl),
      whitelistedPaths: String(req.body.whitelistedPaths || defaultSettings.whitelistedPaths),
    }

    await meta.settings.set("guest-access-control", settings)
    settingsCache = settings

    winston.info("[plugin/guest-access-control] Settings saved")
    res.json({ success: true })
  } catch (error) {
    winston.error("[plugin/guest-access-control] Save error:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Ayarları getir
async function getSettings() {
  if (settingsCache) {
    return settingsCache
  }

  try {
    const settings = await meta.settings.get("guest-access-control")
    settingsCache = Object.assign({}, defaultSettings, settings)
    return settingsCache
  } catch (error) {
    winston.error("[plugin/guest-access-control] Get settings error:", error)
    return defaultSettings
  }
}

// Misafir erişim kontrolü
plugin.checkGuestAccess = async (hookData) => {
  const { req, res } = hookData

  // Kullanıcı giriş yapmışsa devam et
  if (req.uid && req.uid > 0) {
    return hookData
  }

  const settings = await getSettings()

  // Plugin kapalıysa devam et
  if (settings.enabled !== "on" || settings.forceRegistration !== "on") {
    return hookData
  }

  const currentPath = req.path || req.url || ""

  // Whitelist kontrolü
  if (isPathWhitelisted(currentPath, settings)) {
    return hookData
  }

  // Misafir kullanıcıyı yönlendir
  winston.info("[plugin/guest-access-control] Redirecting guest from:", currentPath)

  if (res && typeof res.redirect === "function") {
    res.redirect(settings.redirectUrl)
  }

  return hookData
}

// Path whitelist kontrolü
function isPathWhitelisted(path, settings) {
  if (!path) {
    return false
  }

  const whitelisted = settings.whitelistedPaths
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  return whitelisted.some((allowed) => {
    return path.startsWith(allowed)
  })
}

// Admin menüye ekle
plugin.addAdminNavigation = async (header) => {
  header.plugins.push({
    route: "/plugins/guest-access-control",
    icon: "fa-shield-alt",
    name: "Guest Access Control",
  })

  return header
}

module.exports = plugin
