require(["settings", "api", "jquery", "bootbox", "app"], (Settings, api, $, bootbox, app) => {
  const ACP = {}

  ACP.init = () => {
    console.log("[v0] Guest Access Control admin panel initializing...")

    const wrapper = $(".guest-access-control-settings")

    Settings.load("guest-access-control", wrapper, () => {
      console.log("[v0] Settings loaded successfully")
    })

    $("#save").on("click", (e) => {
      e.preventDefault()
      console.log("[v0] Save button clicked")

      Settings.save("guest-access-control", wrapper, () => {
        console.log("[v0] Settings saved to database")
        app.alertSuccess("Ayarlar başarıyla kaydedildi!")
      })
    })

    $("#reset").on("click", (e) => {
      e.preventDefault()
      console.log("[v0] Reset button clicked")

      bootbox.confirm("Tüm ayarları varsayılan değerlere döndürmek istediğinizden emin misiniz?", (result) => {
        if (result) {
          $("#enabled").prop("checked", false)
          $("#forceRegistration").prop("checked", false)
          $("#customMessage").val("Bu forumu görüntülemek için kayıt olmanız gerekmektedir.")
          $("#redirectUrl").val("/register")
          $("#whitelistedPaths").val("/login,/register,/reset,/api,/assets,/plugins,/sounds,/language,/static")

          app.alertSuccess("Ayarlar varsayılan değerlere döndürüldü. Kaydetmeyi unutmayın!")
        }
      })
    })
  }

  return ACP
})
