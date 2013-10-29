// Cookie setter and getter
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  }
};

// Actions : get, set, remove, keys.
var webStorage = function(action, key, value) {
	
	// Local Storage detection
    var hasStorage = (function() {
      var uid = new Date,
          hasStorage,
          result;
      try {
        (hasStorage = window.localStorage).setItem(uid, uid);
        result = hasStorage.getItem(uid) == uid;
        hasStorage.removeItem(uid);
        return result && hasStorage;
      } catch(e) {return false;}
    }());
    
    // Setter and getter
	switch (action) {
	  case 'get':
	    if (hasStorage) {
			return window.localStorage.getItem(key);
		} else {
			return docCookies.getItem(key);
		}
	  case 'set':
		if (hasStorage) {
			window.localStorage.setItem(key, value);
		} else {
			docCookies.setItem(key, value);
		}
	    break;
	  case 'remove':
	    if (hasStorage) {
			return window.localStorage.removeItem(key);
		} else {
			return docCookies.removeItem(key);
		}
	  case 'keys':
      var keyArr = [];
      if (hasStorage) {
         for (key in window.localStorage) {
          keyArr.push(key);
         }
        return keyArr;
      } else {
        return docCookies.keys();
      }
	}
};	
