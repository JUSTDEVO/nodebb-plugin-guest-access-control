window.define =
  window.define ||
  ((moduleName, dependencies, callback) => {
    if (typeof moduleName === "function") {
      callback = moduleName
      moduleName = undefined
      dependencies = []
    } else if (typeof dependencies === "function") {
      callback = dependencies
      dependencies = []
    }

    const module = { exports: {} }
    const exports = module.exports

    callback.apply(
      module,
      dependencies.map((dep) => window[dep]),
    )

    window[moduleName] = exports
  })

window.$ = window.$ || ((selector) => document.querySelector(selector))

window.config = window.config || { relative_path: "" }

window.define("admin/plugins/guest-access-control", ["settings", "alerts"], (Settings, alerts) => {
  var ACP = {}

  ACP.init = () => {
    Settings.load("guest-access-control", window.$(".guest-access-control-settings"), () => {
      console.log("[v0] Settings loaded successfully")
    })

    window.$("#save").on("click", () => {
      saveSettings()
    })

    window.$("#reset-analytics").on("click", () => {
      resetAnalytics()
    })

    // Load analytics
    loadAnalytics()

    // Auto-refresh analytics every 30 seconds
    setInterval(loadAnalytics, 30000)
  }

  function saveSettings() {
    Settings.save("guest-access-control", window.$(".guest-access-control-settings"), (err) => {
      if (err) {
        alerts.error("Ayarlar kaydedilirken hata oluştu.")
        return
      }
      alerts.success("Ayarlar başarıyla kaydedildi!")
      loadAnalytics()
    })
  }

  function loadAnalytics() {
    window.$.ajax({
      url: window.config.relative_path + "/api/admin/plugins/guest-access-control/analytics",
      type: "GET",
      success: (data) => {
        window.$("#stat-blocked").text(data.blockedAttempts || 0)
        window.$("#stat-visitors").text(data.uniqueVisitors || 0)
        window.$("#stat-reset").text(data.lastReset || "N/A")
      },
      error: () => {
        console.error("Failed to load analytics")
      },
    })
  }

  function resetAnalytics() {
    if (!confirm("İstatistikleri sıfırlamak istediğinizden emin misiniz?")) {
      return
    }

    window.$.ajax({
      url: window.config.relative_path + "/api/admin/plugins/guest-access-control/reset-analytics",
      type: "POST",
      success: (response) => {
        if (response.success) {
          alerts.success(response.message || "İstatistikler sıfırlandı!")
          loadAnalytics()
        }
      },
      error: () => {
        alerts.error("İstatistikler sıfırlanırken bir hata oluştu.")
      },
    })
  }

  return ACP
})
