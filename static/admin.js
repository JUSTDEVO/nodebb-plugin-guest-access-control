// Declare the define and $ variables
const define = window.define
const $ = window.$
const app = window.app

define("admin/plugins/guest-access-control", ["settings"], (Settings) => {
  const ACP = {}

  ACP.init = () => {
    Settings.load("guest-access-control", $(".guest-access-control-settings"))

    $("#save").on("click", () => {
      Settings.save("guest-access-control", $(".guest-access-control-settings"), () => {
        app.alertSuccess("Ayarlar kaydedildi!")
      })
    })
  }

  return ACP
})
