/* Supabase bağlantısı — menü (index.html) ve personel paneli (panel.html) bunu kullanır.
   Supabase > Project Settings > API (ya da "Connect") sayfasından:
     URL       → "Project URL"
     ANON_KEY  → "anon public" ya da "publishable" anahtar  (service_role DEĞİL!)  */
window.SUPA = {
  URL:      "https://cycguwbqqqroikfcuzze.supabase.co",
  ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y2d1d2JxcXFyb2lrZmN1enplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTU5NTAsImV4cCI6MjA5MjI5MTk1MH0.jwtCMVVknrxcAjTHnt5XPArv715OEvxyGMA3BWVRZIs"
};

/* CANLI BAĞLANTI — bir ürün tükendi/var yapılınca açık olan bütün menülere anında haber verir.
   Yüklenemezse sayfalar dakikalık kontrolle çalışmaya devam eder. */
window.SUPA.live = function(onChange){
  var C = window.SUPA;
  if(!C.URL || C.URL.indexOf("BURAYA") === 0) return;
  var t; function ping(){ clearTimeout(t); t = setTimeout(onChange, 250); }   // art arda gelenleri tek seferde işle
  function start(){
    try{
      var sb = window.supabase.createClient(C.URL, C.ANON_KEY,
        {auth:{persistSession:false, autoRefreshToken:false, detectSessionInUrl:false}});
      // her tablo ayrı kanalda: biri hata verirse diğeri çalışmaya devam eder
      ["sold_out", "menu_price"].forEach(function(tbl){
        sb.channel(tbl + "_live")
          .on("postgres_changes", {event:"*", schema:"public", table:tbl}, ping)
          .subscribe(function(status){ if(status === "SUBSCRIBED") ping(); });   // (yeniden) bağlanınca durumu tazele
      });
    }catch(e){}
  }
  if(window.supabase && window.supabase.createClient) return start();
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/dist/umd/supabase.js";
  s.async = true; s.onload = start;
  document.head.appendChild(s);
};
