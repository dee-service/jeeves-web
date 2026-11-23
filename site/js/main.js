(function () {
  "use strict";

  var copyBtn = document.getElementById("copy-invite");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", function () {
    var targetId = copyBtn.getAttribute("data-copy-target");
    var link = document.getElementById(targetId);
    if (!link) return;

    var originalLabel = copyBtn.textContent;

    function showCopied() {
      copyBtn.textContent = "Copied!";
      setTimeout(function () {
        copyBtn.textContent = originalLabel;
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link.href).then(showCopied, function () {
        window.prompt("Copy this link:", link.href);
      });
    } else {
      window.prompt("Copy this link:", link.href);
    }
  });
})();

// HSJeeves downloads: /downloads/versions.json is written by the publish script
// (HSJeeves repo, installer/publish.ps1); the installers sit next to it in /downloads/.
(function () {
  "use strict";

  var box = document.getElementById("hsj-downloads");
  if (!box) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function href(v) {
    return "/downloads/" + encodeURIComponent(v.file);
  }

  function meta(v, noVersion) {
    return (noVersion ? "" : "v" + v.version + " · ") + v.date + " · " + (v.size / 1048576).toFixed(1) + " MB";
  }

  function render(data) {
    var versions = (data && data.versions) || [];
    box.textContent = "";
    if (!versions.length) {
      box.appendChild(el("p", "muted", "No installer has been published yet."));
      return;
    }

    var latest = versions[0];
    var row = el("div", "dl-latest");
    var btn = el("a", "btn btn-primary", "Download HSJeeves " + latest.version);
    btn.href = href(latest);
    row.appendChild(btn);
    row.appendChild(el("span", "dl-meta", "Latest · " + meta(latest)));
    box.appendChild(row);
    if (latest.notes) box.appendChild(el("p", "muted small", latest.notes));
    box.appendChild(el("div", "sha", "SHA-256: " + latest.sha256));

    if (versions.length > 1) {
      box.appendChild(el("h4", null, "Previous versions"));
      var ul = el("ul");
      versions.slice(1).forEach(function (v) {
        var li = el("li");
        var a = el("a", null, "HSJeeves " + v.version);
        a.href = href(v);
        li.appendChild(a);
        li.appendChild(el("span", "dl-meta", " · " + meta(v, true)));
        if (v.notes) li.appendChild(el("div", "muted small", v.notes));
        li.appendChild(el("div", "sha", "SHA-256: " + v.sha256));
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }
  }

  fetch("/downloads/versions.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(render)
    .catch(function () {
      box.textContent = "";
      box.appendChild(el("p", "muted", "Downloads are not available right now. Please try again later."));
    });
})();
