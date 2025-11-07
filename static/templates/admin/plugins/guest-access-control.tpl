<div class="acp-page-container">
  <div component="settings/main/header" class="row border-bottom py-2 m-0 sticky-top acp-page-main-header">
    <div class="col-12 col-md-8 px-0 mb-1 mb-md-0">
      <h4 class="fw-bold tracking-tight mb-0">Guest Access Control</h4>
    </div>
    <div class="col-12 col-md-4 px-0">
      <div class="btn-toolbar justify-content-md-end" role="toolbar">
        <button class="btn btn-primary btn-sm" id="save">
          <i class="fa fa-save"></i> Kaydet
        </button>
        <button class="btn btn-secondary btn-sm ms-2" id="reset">
          <i class="fa fa-undo"></i> Sıfırla
        </button>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-12">
      <form class="guest-access-control-settings">
        <div class="card mt-3">
          <div class="card-header">
            <h5 class="mb-0">Ana Ayarlar</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="form-check">
                <!-- Checkbox için data-key yerine value kullanımı eklendi -->
                <input class="form-check-input" type="checkbox" id="enabled" name="enabled" {{{ if enabled }}}checked{{{ end }}} />
                <label class="form-check-label" for="enabled">
                  Plugin'i Etkinleştir
                </label>
              </div>
              <small class="form-text text-muted">Plugin'in tüm özelliklerini aktif eder</small>
            </div>

            <div class="mb-3">
              <div class="form-check">
                <!-- Checkbox için checked attribute eklendi -->
                <input class="form-check-input" type="checkbox" id="forceRegistration" name="forceRegistration" {{{ if forceRegistration }}}checked{{{ end }}} />
                <label class="form-check-label" for="forceRegistration">
                  Zorunlu Kayıt Modu
                </label>
              </div>
              <small class="form-text text-muted">Misafir kullanıcıları kayıt olmaya zorlar</small>
            </div>

            <div class="mb-3">
              <label for="customMessage" class="form-label">Özel Mesaj</label>
              <!-- Textarea için value attribute eklendi -->
              <textarea class="form-control" id="customMessage" name="customMessage" rows="3">{customMessage}</textarea>
              <small class="form-text text-muted">Misafir kullanıcılara gösterilecek mesaj</small>
            </div>

            <div class="mb-3">
              <label for="redirectUrl" class="form-label">Yönlendirme URL</label>
              <!-- Input için value attribute eklendi -->
              <input type="text" class="form-control" id="redirectUrl" name="redirectUrl" value="{redirectUrl}" />
              <small class="form-text text-muted">Misafir kullanıcıların yönlendirileceği sayfa (örn: /register)</small>
            </div>

            <div class="mb-3">
              <label for="whitelistedPaths" class="form-label">İzin Verilen Yollar</label>
              <!-- Textarea için value attribute eklendi -->
              <textarea class="form-control" id="whitelistedPaths" name="whitelistedPaths" rows="3">{whitelistedPaths}</textarea>
              <small class="form-text text-muted">Virgülle ayrılmış yollar (örn: /login,/register,/api)</small>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
