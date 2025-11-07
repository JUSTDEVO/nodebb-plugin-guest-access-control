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
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-12">
			<!-- Analytics Section -->
			<div class="card mt-3">
				<div class="card-header">
					<h5 class="section-title mb-0">
						<i class="fa fa-chart-line"></i> İstatistikler
					</h5>
				</div>
				<div class="card-body">
					<div class="guest-access-control-stats">
						<div class="guest-access-control-stat-card">
							<h4>Engellenen Denemeler</h4>
							<p class="stat-value" id="stat-blocked">{analytics.blockedAttempts}</p>
						</div>
						<div class="guest-access-control-stat-card">
							<h4>Benzersiz Ziyaretçi</h4>
							<p class="stat-value" id="stat-visitors">{analytics.uniqueVisitors}</p>
						</div>
						<div class="guest-access-control-stat-card">
							<h4>Son Sıfırlama</h4>
							<p class="stat-value" style="font-size: 16px;">{analytics.lastReset}</p>
						</div>
					</div>
					<button class="btn btn-danger btn-sm mt-3" id="reset-analytics">
						<i class="fa fa-redo"></i> İstatistikleri Sıfırla
					</button>
				</div>
			</div>

			<!-- Main Settings -->
			<div class="card mt-3">
				<div class="card-header">
					<h5 class="section-title mb-0">
						<i class="fa fa-cog"></i> Ana Ayarlar
					</h5>
				</div>
				<div class="card-body guest-access-control-settings">
					<div class="form-group">
						<div class="checkbox-wrapper">
							<input type="checkbox" id="enabled" name="enabled" <!-- IF settings.enabled -->checked<!-- ENDIF settings.enabled --> />
							<label for="enabled">Plugin'i Etkinleştir</label>
						</div>
						<span class="help-text">Plugin'in tüm özelliklerini etkinleştirir veya devre dışı bırakır</span>
					</div>

					<div class="form-group">
						<div class="checkbox-wrapper">
							<input type="checkbox" id="enableForceRegistration" name="enableForceRegistration" <!-- IF settings.enableForceRegistration -->checked<!-- ENDIF settings.enableForceRegistration --> />
							<label for="enableForceRegistration">Zorunlu Kayıt Modu</label>
						</div>
						<span class="help-text">Misafir kullanıcıların foruma erişimini engeller ve kayıt olmaya zorlar</span>
					</div>

					<hr class="section-divider" />

					<div class="form-group">
						<label for="customTitle">Özel Başlık</label>
						<input type="text" id="customTitle" name="customTitle" class="form-control" value="{settings.customTitle}" />
						<span class="help-text">Misafir kullanıcılara gösterilecek özel başlık</span>
					</div>

					<div class="form-group">
						<label for="customMessage">Özel Mesaj</label>
						<textarea id="customMessage" name="customMessage" class="form-control">{settings.customMessage}</textarea>
						<span class="help-text">Misafir kullanıcılara gösterilecek özel mesaj</span>
					</div>
				</div>
			</div>

			<!-- Redirect Settings -->
			<div class="card mt-3">
				<div class="card-header">
					<h5 class="section-title mb-0">
						<i class="fa fa-directions"></i> Yönlendirme Ayarları
					</h5>
				</div>
				<div class="card-body guest-access-control-settings">
					<div class="form-group">
						<div class="checkbox-wrapper">
							<input type="checkbox" id="redirectToRegister" name="redirectToRegister" <!-- IF settings.redirectToRegister -->checked<!-- ENDIF settings.redirectToRegister --> />
							<label for="redirectToRegister">Kayıt Sayfasına Yönlendir</label>
						</div>
						<span class="help-text">Aktif ise kayıt sayfasına, değilse giriş sayfasına yönlendirir</span>
					</div>

					<div class="form-group">
						<label for="customRedirectUrl">Özel Yönlendirme URL (İsteğe Bağlı)</label>
						<input type="text" id="customRedirectUrl" name="customRedirectUrl" class="form-control" value="{settings.customRedirectUrl}" placeholder="/custom-page" />
						<span class="help-text">Boş bırakırsanız varsayılan yönlendirme kullanılır</span>
					</div>

					<div class="form-group">
						<label for="whitelistedPaths">İzin Verilen Yollar (Virgülle Ayrılmış)</label>
						<textarea id="whitelistedPaths" name="whitelistedPaths" class="form-control">{settings.whitelistedPaths}</textarea>
						<span class="help-text">Bu yollar misafir kullanıcılara açık olacak. Örnek: /login,/register,/api,/assets</span>
					</div>

					<div class="form-group">
						<label for="allowedGuestPages">Misafir Kullanıcılara Açık Sayfalar</label>
						<input type="text" id="allowedGuestPages" name="allowedGuestPages" class="form-control" value="{settings.allowedGuestPages}" />
						<span class="help-text">Misafir kullanıcıların erişebileceği ana sayfa türleri (home,recent,popular,top)</span>
					</div>
				</div>
			</div>

			<!-- Category Protection -->
			<div class="card mt-3">
				<div class="card-header">
					<h5 class="section-title mb-0">
						<i class="fa fa-lock"></i> Kategori Koruması
					</h5>
				</div>
				<div class="card-body guest-access-control-settings">
					<div class="form-group">
						<label for="protectedCategories">Korunan Kategori ID'leri (Virgülle Ayrılmış)</label>
						<input type="text" id="protectedCategories" name="protectedCategories" class="form-control" value="{settings.protectedCategories}" placeholder="1,2,3" />
						<span class="help-text">Bu kategoriler misafir kullanıcılardan gizlenecek. Kategori ID'lerini admin panelinden öğrenebilirsiniz.</span>
					</div>
				</div>
			</div>

			<!-- Welcome Message -->
			<div class="card mt-3">
				<div class="card-header">
					<h5 class="section-title mb-0">
						<i class="fa fa-comment-dots"></i> Karşılama Mesajı
					</h5>
				</div>
				<div class="card-body guest-access-control-settings">
					<div class="form-group">
						<div class="checkbox-wrapper">
							<input type="checkbox" id="showWelcomeMessage" name="showWelcomeMessage" <!-- IF settings.showWelcomeMessage -->checked<!-- ENDIF settings.showWelcomeMessage --> />
							<label for="showWelcomeMessage">Karşılama Mesajını Göster</label>
						</div>
						<span class="help-text">Misafir kullanıcılara özel karşılama mesajı gösterir</span>
					</div>

					<div class="form-group">
						<label for="welcomeMessageTitle">Karşılama Mesajı Başlığı</label>
						<input type="text" id="welcomeMessageTitle" name="welcomeMessageTitle" class="form-control" value="{settings.welcomeMessageTitle}" />
					</div>

					<div class="form-group">
						<label for="welcomeMessageContent">Karşılama Mesajı İçeriği</label>
						<textarea id="welcomeMessageContent" name="welcomeMessageContent" class="form-control">{settings.welcomeMessageContent}</textarea>
					</div>
				</div>
			</div>

			<!-- Security Settings -->
			<div class="card mt-3">
				<div class="card-header">
					<h5 class="section-title mb-0">
						<i class="fa fa-shield-alt"></i> Güvenlik Ayarları
					</h5>
				</div>
				<div class="card-body guest-access-control-settings">
					<div class="form-group">
						<div class="checkbox-wrapper">
							<input type="checkbox" id="enableAnalytics" name="enableAnalytics" <!-- IF settings.enableAnalytics -->checked<!-- ENDIF settings.enableAnalytics --> />
							<label for="enableAnalytics">İstatistikleri Etkinleştir</label>
						</div>
						<span class="help-text">Engellenen denemeleri ve ziyaretçi sayısını takip eder</span>
					</div>

					<div class="form-group">
						<div class="checkbox-wrapper">
							<input type="checkbox" id="blockApiAccess" name="blockApiAccess" <!-- IF settings.blockApiAccess -->checked<!-- ENDIF settings.blockApiAccess --> />
							<label for="blockApiAccess">API Erişimini Engelle</label>
						</div>
						<span class="help-text">Misafir kullanıcıların API'ye erişimini engeller</span>
					</div>

					<div class="form-group">
						<div class="checkbox-wrapper">
							<input type="checkbox" id="enableRateLimit" name="enableRateLimit" <!-- IF settings.enableRateLimit -->checked<!-- ENDIF settings.enableRateLimit --> />
							<label for="enableRateLimit">Hız Sınırlamasını Etkinleştir</label>
						</div>
						<span class="help-text">IP bazlı hız sınırlaması uygular</span>
					</div>

					<div class="form-group">
						<label for="rateLimitRequests">Maksimum İstek Sayısı</label>
						<input type="number" id="rateLimitRequests" name="rateLimitRequests" class="form-control" value="{settings.rateLimitRequests}" min="1" max="1000" />
						<span class="help-text">Belirlenen zaman dilimi içinde izin verilen maksimum istek sayısı</span>
					</div>

					<div class="form-group">
						<label for="rateLimitWindow">Zaman Penceresi (Saniye)</label>
						<input type="number" id="rateLimitWindow" name="rateLimitWindow" class="form-control" value="{settings.rateLimitWindow}" min="1" max="3600" />
						<span class="help-text">Hız sınırlaması için zaman penceresi (saniye cinsinden)</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
